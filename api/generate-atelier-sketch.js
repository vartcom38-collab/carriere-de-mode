export const config={maxDuration:60};

const clip=(s,n)=>String(s||'').replace(/\s+/g,' ').trim().slice(0,n);
const cleanBase64=s=>String(s||'').replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/,'');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

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
    const capture=cleanBase64(body.moodboardImage||'');
    const variants={
      1:'PROPOSITION 1 — interprétation la plus fidèle aux proportions et associations visibles sur la planche, construction couture lisible.',
      2:'PROPOSITION 2 — mêmes éléments obligatoires et même identité visuelle, mais drapé, découpe et rythme des lignes différents.',
      3:'PROPOSITION 3 — mêmes éléments obligatoires et même identité visuelle, avec une résolution plus couture dans les détails et finitions.'
    };
    const hardRules='IMAGE FINALE: montre UNE SEULE création cohérente portée par UNE silhouette de mode principale en pied. Pas de lineup, pas de série de mannequins, pas de planche de collection, pas de collage. Ne remplace jamais les vêtements sélectionnés par un blazer, tailleur, trench ou manteau s’ils ne figurent pas dans la planche. Les formes de vêtements de la référence sont obligatoires; matières, couleurs et détails du brief doivent les transformer en une vraie tenue haute couture.';
    const prompt=clip(`${basePrompt}\n\n${hardRules}\n\n${variants[variant]}`,3000);
    const seed=(Number(body.seed)||Date.now()%1000000)+(variant*7919);
    const headers={'Content-Type':'application/json','Accept':'application/json','x-magnific-api-key':key};
    const providerErrors=[];

    async function jsonFetch(url,options){
      const r=await fetch(url,options);const text=await r.text();let j={};try{j=JSON.parse(text)}catch(_){j={raw:text.slice(0,900)}}
      if(!r.ok)throw new Error(`magnific_${r.status}:${JSON.stringify(j).slice(0,700)}`);return j;
    }

    async function generateFromReference(){
      if(!capture)throw new Error('reference_image_missing');
      const path='https://api.magnific.com/v1/ai/gemini-2-5-flash-image-preview';
      const first=await jsonFetch(path,{method:'POST',headers,body:JSON.stringify({prompt,reference_images:[capture]})});
      let d=first?.data||{},generated=Array.isArray(d.generated)?d.generated:[];
      if(generated[0])return generated[0];
      const taskId=d.task_id;if(!taskId)throw new Error(`reference_task_missing:${JSON.stringify(first).slice(0,500)}`);
      for(let i=0;i<22;i++){
        await sleep(900);
        const poll=await jsonFetch(`${path}/${taskId}`,{headers:{Accept:'application/json','x-magnific-api-key':key}});
        d=poll?.data||{};generated=Array.isArray(d.generated)?d.generated:[];
        if(generated[0])return generated[0];
        const st=String(d.status||'').toUpperCase();
        if(['FAILED','ERROR','CANCELLED'].includes(st))throw new Error(`reference_${st.toLowerCase()}`);
      }
      throw new Error('reference_timeout');
    }

    async function generateClassic(){
      let last=null;
      for(let attempt=0;attempt<2;attempt++){
        const r=await fetch('https://api.magnific.com/v1/ai/text-to-image',{method:'POST',headers,body:JSON.stringify({prompt,negative_prompt:'photo, photorealism, 3d render, text, watermark, multiple models, lineup, collection board, blazer, suit, trench coat',guidance_scale:2,seed,num_images:1,image:{size:'square_1_1'},filter_nsfw:true})});
        const text=await r.text();let j={};try{j=JSON.parse(text)}catch(_){j={raw:text.slice(0,700)}}
        if(r.ok){const item=Array.isArray(j?.data)?j.data[0]:null;if(item?.url)return item.url;if(item?.base64)return `data:image/png;base64,${item.base64}`;throw new Error(`classic_image_missing:${JSON.stringify(j).slice(0,500)}`)}
        last={status:r.status,body:j};if(r.status!==429)break;await sleep(1500);
      }
      throw new Error(`classic_${last?.status}:${JSON.stringify(last?.body||{}).slice(0,700)}`);
    }

    let url=null,mode='classic-fast';
    if(capture){
      try{url=await generateFromReference();mode='moodboard-reference'}
      catch(err){providerErrors.push({stage:'moodboard-reference',error:String(err?.message||err)})}
    }
    if(!url){url=await generateClassic();mode=capture?'classic-fallback':'classic-fast'}

    return res.status(200).json({ok:true,proposal:{id:String(variant),name:`Croquis ${variant}`,direction:variants[variant],url,provider:'magnific',mode,prompt},meta:{referenceReceived:!!capture,referenceUsed:mode==='moodboard-reference',providerErrors}});
  }catch(err){
    console.error('[Atelier single sketch failed]',err);
    return res.status(500).json({error:'atelier_single_sketch_failed',detail:String(err?.message||err)});
  }
}
