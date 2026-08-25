const MAGNIFIC_BASE='https://api.magnific.com/v1/ai/text-to-image/imagen4-fast';

function cors(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Accept');
  if(req.method==='OPTIONS'){
    res.status(204).end();
    return true;
  }
  return false;
}

function magnificKey(){
  return process.env.MAGNIFIC_API_KEY||process.env['CLÉ_API_MAGNIFIC']||process.env.CLE_API_MAGNIFIC||'';
}

function buildPrompt(body){
  const v=body.visual||body.metadata||{};
  const base=String(body.promptText||body.prompt||'').trim();
  const city=String(body.city||'France').trim();
  const district=String(body.district||'').trim();
  const view=String(body.view||body.promptKey||'main').trim();
  const details=[v.archetypeLabel||v.archetype,v.architecture,v.palette,v.decorSignature||v.decor,v.floorMaterial,v.furnitureSignature,v.lightSignature,v.viewSignature,v.creativeFeature,v.imageStyle].filter(Boolean).join(', ');
  return [base,`Location: ${city}${district?`, ${district}`:''}.`,`Requested view: ${view}.`,details?`Visual identity: ${details}.`:null,body.visualSeed?`Unique seed: ${String(body.visualSeed)}.`:null].filter(Boolean).join(' ');
}

export default async function handler(req,res){
  if(cors(req,res))return;
  if(req.method!=='POST')return res.status(405).json({error:'method_not_allowed'});
  const apiKey=magnificKey();
  if(!apiKey)return res.status(503).json({error:'magnific_not_configured'});
  const body=req.body||{};
  if(!body.listingId)return res.status(400).json({error:'listing_id_required'});
  try{
    const create=await fetch(MAGNIFIC_BASE,{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json','x-magnific-api-key':apiKey},
      body:JSON.stringify({prompt:buildPrompt(body),aspect_ratio:'landscape_4_3',enhance_prompt:true,language:'en',output_options:{mime_type:'image/png',compression_quality:85}})
    });
    const created=await create.json().catch(()=>({}));
    if(!create.ok)return res.status(create.status).json({error:'magnific_create_failed',details:created});
    const taskId=created?.data?.task_id||created?.task_id;
    if(!taskId)return res.status(502).json({error:'magnific_missing_task_id',details:created});
    return res.status(202).json({success:true,provider:'magnific',taskId,status:'IN_PROGRESS'});
  }catch(error){
    return res.status(500).json({error:'visual_backend_error',message:error?.message||String(error)});
  }
}
