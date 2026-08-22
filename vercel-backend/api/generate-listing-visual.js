const MAGNIFIC_BASE='https://api.magnific.com/v1/ai/text-to-image/imagen4-fast';

function cors(req,res){
  res.setHeader('Access-Control-Allow-Origin','https://vartcom38-collab.github.io');
  res.setHeader('Vary','Origin');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS'){
    res.status(204).end();
    return true;
  }
  return false;
}

function buildPrompt(body){
  const v=body.visual||body.metadata||{};
  const base=String(body.promptText||body.prompt||'').trim();
  const city=String(body.city||'France').trim();
  const district=String(body.district||'').trim();
  const view=String(body.view||body.promptKey||'main').trim();

  const artDirection=[
    'HAUTE COUTURE LIVE HOUSING STYLE LOCK.',
    'Create a premium fashion-career game background that belongs in exactly the same illustrated universe as the elegant female character cards.',
    'The room must feel like a scene where the game character could be placed without any visual rupture.',
    'Use clean confident outlines, elegant simplified shapes, controlled volumes, smooth polished shading, refined warm pastel colors, soft natural sunlight and a chic French lifestyle mood.',
    'Rendering must read as premium visual-novel / fashion-game background art, not generic editorial concept art.',
    'Keep architecture and furniture believable, stylish and lived-in, with subtle fashion details such as garments, accessories, magazines, mirrors or tasteful decor when appropriate.',
    'Composition should be clear and readable for a game scene, with a strong foreground, middle ground and background, but avoid exaggerated cinematic perspective.',
    'Avoid photorealism, realistic 3D rendering, painterly brush texture, watercolor, sketchiness, gritty texture, hyper-detailed realism, stock-interior aesthetics and childish cartoon styling.',
    'No visible people, no text, no logo, no UI, no watermark.'
  ].join(' ');

  const details=[
    v.archetypeLabel||v.archetype,
    v.architecture,
    v.palette,
    v.decorSignature||v.decor,
    v.floorMaterial,
    v.furnitureSignature,
    v.lightSignature,
    v.viewSignature,
    v.creativeFeature,
    v.imageStyle
  ].filter(Boolean).join(', ');

  return [
    base,
    artDirection,
    `Location: ${city}${district?`, ${district}`:''}.`,
    `Requested game view: ${view}.`,
    details?`Apartment identity to preserve: ${details}.`:null,
    body.visualSeed?`Unique apartment seed: ${String(body.visualSeed)}.`:null
  ].filter(Boolean).join(' ');
}

export default async function handler(req,res){
  if(cors(req,res))return;
  if(req.method!=='POST')return res.status(405).json({error:'method_not_allowed'});

  const apiKey=process.env.MAGNIFIC_API_KEY;
  if(!apiKey)return res.status(503).json({error:'magnific_not_configured'});

  const body=req.body||{};
  if(!body.listingId)return res.status(400).json({error:'listing_id_required'});

  try{
    const create=await fetch(MAGNIFIC_BASE,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Accept':'application/json',
        'x-magnific-api-key':apiKey
      },
      body:JSON.stringify({
        prompt:buildPrompt(body),
        aspect_ratio:'landscape_4_3',
        enhance_prompt:true,
        language:'en',
        output_options:{mime_type:'image/png',compression_quality:85}
      })
    });

    const created=await create.json().catch(()=>({}));
    if(!create.ok)return res.status(create.status).json({error:'magnific_create_failed',details:created});

    const taskId=created?.data?.task_id;
    if(!taskId)return res.status(502).json({error:'magnific_missing_task_id'});

    const started=Date.now();
    while(Date.now()-started<52000){
      await new Promise(r=>setTimeout(r,1800));
      const poll=await fetch(`${MAGNIFIC_BASE}/${encodeURIComponent(taskId)}`,{
        headers:{'Accept':'application/json','x-magnific-api-key':apiKey}
      });
      const status=await poll.json().catch(()=>({}));
      if(!poll.ok)return res.status(poll.status).json({error:'magnific_status_failed',details:status});

      const state=status?.data?.status;
      const generated=status?.data?.generated||[];
      if(state==='COMPLETED'){
        const first=generated[0];
        const url=typeof first==='string'?first:(first?.url||first?.image_url);
        if(!url)return res.status(502).json({error:'magnific_missing_output'});
        return res.status(200).json({success:true,provider:'magnific',taskId,publicUrl:url,cached:false});
      }
      if(state==='FAILED')return res.status(502).json({error:'magnific_generation_failed'});
    }

    return res.status(202).json({success:true,provider:'magnific',taskId,status:'IN_PROGRESS'});
  }catch(error){
    return res.status(500).json({error:'visual_backend_error',message:error?.message||String(error)});
  }
}
