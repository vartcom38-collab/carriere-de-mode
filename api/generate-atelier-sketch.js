export const config={maxDuration:60};

const clip=(s,n)=>String(s||'').replace(/\s+/g,' ').trim().slice(0,n);

export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin',process.env.ALLOWED_ORIGIN||'*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  if(req.method==='OPTIONS')return res.status(204).end();
  if(req.method!=='POST')return res.status(405).json({error:'method_not_allowed'});
  try{
    const key=process.env.MAGNIFIC_API_KEY||process.env.MAGNIFIC_KEY;
    if(!key)return res.status(503).json({error:'MAGNIFIC_API_KEY_or_MAGNIFIC_KEY_missing'});
    const body=req.body||{};
    const variant=Math.max(1,Math.min(3,Number(body.variantIndex)||1));
    const basePrompt=clip(body.prompt||'',2200);
    if(!basePrompt)return res.status(400).json({error:'prompt_required'});
    const variants={
      1:'Croquis 1: balanced proportions, clear construction, strong front-view readability.',
      2:'Croquis 2: same mandatory ingredients but noticeably different drape, lines and proportions.',
      3:'Croquis 3: same mandatory ingredients with more couture construction details and refined finishing.'
    };
    const prompt=clip(`${basePrompt} ${variants[variant]}`,2400);
    const seed=(Number(body.seed)||Date.now()%1000000)+(variant*7919);
    const headers={'Content-Type':'application/json','Accept':'application/json','x-magnific-api-key':key};
    let last=null;
    for(let attempt=0;attempt<2;attempt++){
      const r=await fetch('https://api.magnific.com/v1/ai/text-to-image',{method:'POST',headers,body:JSON.stringify({prompt,seed,num_images:1,filter_nsfw:true})});
      const text=await r.text();
      let j={};try{j=JSON.parse(text)}catch(_){j={raw:text.slice(0,700)}}
      if(r.ok){
        const item=Array.isArray(j?.data)?j.data[0]:null;
        const url=item?.url||(item?.base64?`data:image/png;base64,${item.base64}`:null);
        if(!url)return res.status(502).json({error:'magnific_image_missing',detail:JSON.stringify(j).slice(0,500)});
        return res.status(200).json({ok:true,proposal:{id:String(variant),name:`Croquis ${variant}`,direction:variants[variant],url,provider:'magnific',mode:'classic-fast',prompt}});
      }
      last={status:r.status,body:j};
      if(r.status!==429)break;
      await new Promise(resolve=>setTimeout(resolve,1500));
    }
    return res.status(502).json({error:'magnific_failed',detail:`magnific_${last?.status}:${JSON.stringify(last?.body||{}).slice(0,700)}`});
  }catch(err){
    console.error('[Atelier single sketch failed]',err);
    return res.status(500).json({error:'atelier_single_sketch_failed',detail:String(err?.message||err)});
  }
}
