export const config={maxDuration:60};

const clip=(s,n)=>String(s||'').replace(/\s+/g,' ').trim().slice(0,n);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const allowedContexts=new Set(['atelier','cliente','book','shooting','ateliergram','editorial']);

export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin',process.env.ALLOWED_ORIGIN||'*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  if(req.method==='OPTIONS')return res.status(204).end();
  if(req.method!=='POST')return res.status(405).json({error:'method_not_allowed'});
  try{
    const key=process.env.MAGNIFIC_API_KEY||process.env.MAGNIFIC_KEY;
    if(!key)return res.status(503).json({error:'MAGNIFIC_API_KEY_or_MAGNIFIC_KEY_missing'});
    const b=req.body||{},garmentId=clip(b.garmentId,160),context=allowedContexts.has(b.context)?b.context:'atelier';
    const promptBase=clip(b.prompt,3200);
    if(!garmentId)return res.status(400).json({error:'garment_id_required'});
    if(!promptBase)return res.status(400).json({error:'prompt_required'});
    const contextPrompt={
      atelier:'neutral couture atelier presentation, full garment clearly visible, restrained background',
      cliente:'realistic fitting-room presentation, one adult model wearing the exact garment, natural posture, garment fully readable',
      book:'luxury fashion portfolio image, editorial but faithful, full silhouette readable',
      shooting:'high-end fashion editorial photograph, deliberate lighting, full silhouette readable',
      ateliergram:'premium fashion social editorial photograph, natural luxury, full garment readable',
      editorial:'high-end fashion editorial photograph, sophisticated but not theatrical'
    }[context];
    const hard='ONE adult fashion model only. Show ONE garment/look only. Photorealistic fashion photography, not illustration, not sketch, not 3D. Preserve exactly the described garment type, silhouette, length, volume, construction, materials, colors and details. Do not invent extra garments, coats, blazers, bags, logos, text, patterns or embellishments. The clothing must remain the same design across future contexts.';
    const prompt=clip(`${promptBase}. ${contextPrompt}. ${hard}`,3900);
    const headers={'Content-Type':'application/json','Accept':'application/json','x-magnific-api-key':key};
    const negative='illustration, sketch, drawing, painting, 3d render, mannequin lineup, multiple people, multiple outfits, collage, text, watermark, logo, extra coat, extra blazer, extra bag';
    const seed=(Number(b.seed)||Math.abs([...garmentId].reduce((h,c)=>((h*31)+c.charCodeAt(0))|0,17)))>>>0;
    let last=null;
    for(let attempt=0;attempt<2;attempt++){
      const r=await fetch('https://api.magnific.com/v1/ai/text-to-image',{method:'POST',headers,body:JSON.stringify({prompt,negative_prompt:negative,guidance_scale:3,seed,num_images:1,image:{size:'portrait_2_3'},filter_nsfw:true})});
      const text=await r.text();let j={};try{j=JSON.parse(text)}catch(_){j={raw:text.slice(0,900)}}
      if(r.ok){
        const item=Array.isArray(j?.data)?j.data[0]:null;
        const url=item?.url||(item?.base64?`data:image/png;base64,${item.base64}`:'');
        if(!url)throw new Error(`garment_visual_missing:${JSON.stringify(j).slice(0,600)}`);
        return res.status(200).json({ok:true,garmentId,context,url,provider:'magnific',model:'text-to-image',seed,promptVersion:1,generatedAt:new Date().toISOString()});
      }
      last={status:r.status,body:j};if(r.status!==429)break;await sleep(1400);
    }
    throw new Error(`magnific_${last?.status}:${JSON.stringify(last?.body||{}).slice(0,700)}`);
  }catch(err){
    console.error('[Garment visual generation failed]',err);
    return res.status(500).json({error:'garment_visual_generation_failed',detail:String(err?.message||err)});
  }
}
