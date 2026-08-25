export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin',process.env.ALLOWED_ORIGIN||'*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  if(req.method==='OPTIONS')return res.status(204).end();
  if(req.method!=='POST')return res.status(405).json({error:'method_not_allowed'});
  try{
    if(!process.env.MAGNIFIC_API_KEY)return res.status(503).json({error:'MAGNIFIC_API_KEY_missing'});
    const body=req.body||{};
    const board=body.board||{};
    const client=body.client||{};
    const designer=body.designer||{};
    const pieces=(board.pieces||[]).map(x=>typeof x==='string'?x:x.name).filter(Boolean);
    const refs=board.references||{};
    const fabric=board.fabric?.name||board.fabric?.label||refs?.material?.name||'';
    const color=refs?.color?.name||'';
    const pattern=refs?.pattern?.name||'';
    const notes=String(board.notes||'').trim();
    if(!pieces.length)return res.status(400).json({error:'board_requires_piece'});

    const clientText=[
      client.name&&`Client: ${client.name}`,
      client.garment&&`Requested garment: ${client.garment}`,
      client.occasion&&`Occasion: ${client.occasion}`,
      client.style&&`Desired style: ${client.style}`,
      Array.isArray(client.paletteLiked)&&client.paletteLiked.length&&`Preferred palette: ${client.paletteLiked.join(', ')}`,
      Array.isArray(client.paletteAvoid)&&client.paletteAvoid.length&&`Avoid: ${client.paletteAvoid.join(', ')}`,
      Array.isArray(client.materialsPreferred)&&client.materialsPreferred.length&&`Preferred materials: ${client.materialsPreferred.join(', ')}`,
      client.notes&&`Client words: ${client.notes}`
    ].filter(Boolean).join('. ');

    const boardText=[
      `Chosen garment elements: ${pieces.join(', ')}`,
      fabric&&`Chosen fabric: ${fabric}`,
      color&&`Chosen color direction: ${color}`,
      pattern&&`Chosen pattern/treatment: ${pattern}`,
      notes&&`Designer notes: ${notes}`,
      designer.level&&`Designer technical level: ${designer.level}`
    ].filter(Boolean).join('. ');

    const styleLock=`Professional fashion designer croquis, genuine stylist sketchbook aesthetic, full-body fashion figure wearing ONE coherent finished outfit, hand-drawn graphite and ink linework with restrained marker/watercolor indications, elongated fashion proportions, visible garment construction lines and textile behavior, white or warm off-white paper, elegant French fashion-school presentation, no photography, no 3D render, no text, no labels, no collage, no moodboard, no duplicate figures, no UI. The garment must be physically plausible and clearly derive from the provided design board and client brief.`;
    const variants=[
      {id:'A',name:'Interprétation fidèle',direction:'Stay very faithful to the selected pieces and proportions. Refine them into the clearest, most wearable and professionally resolved fashion proposal.'},
      {id:'B',name:'Interprétation mode',direction:'Keep the same brief and ingredients, but reinterpret proportions and construction with a stronger contemporary fashion-editorial point of view. More assertive, still wearable.'},
      {id:'C',name:'Interprétation couture',direction:'Keep the same brief and ingredients, but push drape, construction and refined detail into a more couture direction without becoming costume-like or ignoring the client constraints.'}
    ];

    async function generate(v,index){
      const prompt=`${styleLock}\n\nCLIENT BRIEF: ${clientText||'No client brief: personal creation.'}\nDESIGN BOARD: ${boardText}.\nVARIATION ${v.id}: ${v.direction}\nCreate exactly one complete fashion croquis proposal. Do not add unrelated garments or accessories. Preserve the selected material/color direction when specified.`;
      const r=await fetch('https://api.magnific.com/v1/ai/text-to-image',{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json','x-magnific-api-key':process.env.MAGNIFIC_API_KEY},
        body:JSON.stringify({
          prompt,
          negative_prompt:'photorealistic photo, 3d render, mannequin photo, fashion runway photo, multiple outfits, multiple people, collage, text, watermark, logo, UI, distorted hands, extra limbs',
          guidance_scale:3,
          seed:Math.max(1,Math.min(4294967295,Number(body.seed||Date.now())+index*7919)),
          num_images:1,
          image:{size:'portrait_2_3'},
          filter_nsfw:true
        })
      });
      const j=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(`magnific_${r.status}:${JSON.stringify(j).slice(0,300)}`);
      const item=Array.isArray(j?.data)?j.data[0]:null;
      const b64=item?.base64||null;
      const url=item?.url||item?.generated?.[0]||null;
      if(!b64&&!url)throw new Error('magnific_image_missing');
      return{id:v.id,name:v.name,direction:v.direction,url:url||`data:image/png;base64,${b64}`,provider:'magnific',prompt};
    }

    const results=await Promise.all(variants.map((v,i)=>generate(v,i)));
    return res.status(200).json({ok:true,provider:'magnific',count:results.length,proposals:results,meta:{pieces,fabric,color,pattern}});
  }catch(err){
    return res.status(500).json({error:'atelier_sketch_generation_failed',detail:String(err?.message||err)});
  }
}
