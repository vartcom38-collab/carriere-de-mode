export const config={maxDuration:60};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const cleanBase64=s=>String(s||'').replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/,'');
const names=a=>(Array.isArray(a)?a:[]).map(x=>typeof x==='string'?x:x?.name).filter(Boolean);
const uniq=a=>[...new Set(a.filter(Boolean))];
const clip=(s,n)=>String(s||'').replace(/\s+/g,' ').trim().slice(0,n);

export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin',process.env.ALLOWED_ORIGIN||'*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  if(req.method==='OPTIONS')return res.status(204).end();
  if(req.method!=='POST')return res.status(405).json({error:'method_not_allowed'});

  try{
    const magnificKey=process.env.MAGNIFIC_API_KEY||process.env.MAGNIFIC_KEY;
    if(!magnificKey)return res.status(503).json({error:'MAGNIFIC_API_KEY_or_MAGNIFIC_KEY_missing'});

    const body=req.body||{},board=body.board||{},client=body.client||{},designer=body.designer||{};
    const components=Array.isArray(board.components)?board.components:[];
    if(!components.length)return res.status(400).json({error:'board_requires_element'});

    const capture=cleanBase64(body.moodboardImage||'');
    const refs=board.references||{};
    const garments=uniq(components.filter(x=>!x?.moodKind||x?.moodKind==='reference').map(x=>x?.name));
    const materials=uniq([...names(refs.materials),...components.filter(x=>x?.moodKind==='material'||x?.category==='material').map(x=>x?.name)]);
    const colors=uniq([...names(refs.colors),...components.filter(x=>x?.moodKind==='color'||x?.category==='color').map(x=>x?.name)]);
    const patterns=uniq([...names(refs.patterns),...components.filter(x=>x?.moodKind==='pattern'||x?.category==='pattern').map(x=>x?.name)]);
    const notes=uniq([...(Array.isArray(board.notes)?board.notes:[]).map(x=>typeof x==='string'?x:x?.noteText||x?.text),...components.map(x=>x?.noteText)]);

    const generatedPrompt=clip(body.generatedPrompt||board.generatedPrompt||'',1100);
    const clientText=clip([
      client.garment&&`demande ${client.garment}`,
      client.occasion&&`occasion ${client.occasion}`,
      client.style&&`style ${client.style}`,
      Array.isArray(client.paletteLiked)&&client.paletteLiked.length&&`palette ${client.paletteLiked.join(', ')}`,
      Array.isArray(client.paletteAvoid)&&client.paletteAvoid.length&&`éviter ${client.paletteAvoid.join(', ')}`,
      Array.isArray(client.materialsPreferred)&&client.materialsPreferred.length&&`matières souhaitées ${client.materialsPreferred.join(', ')}`,
      client.notes&&`notes cliente ${client.notes}`
    ].filter(Boolean).join('. '),480);
    const boardText=clip([
      garments.length&&`silhouettes/formes ${garments.join(', ')}`,
      materials.length&&`matières ${materials.join(', ')}`,
      colors.length&&`couleurs ${colors.join(', ')}`,
      patterns.length?`motifs ${patterns.join(', ')}`:'aucun motif dominant',
      notes.length&&`notes créatives ${notes.join(' | ')}`
    ].filter(Boolean).join('. '),620);

    const base='Croquis de styliste professionnel, silhouette entière élancée, dessin main graphite et encre avec touches aquarelle ou feutre, papier ivoire. La photo JPEG du moodboard est la direction visuelle principale. Conserver les silhouettes, volumes, encolures, longueurs et associations visibles puis les résoudre en une tenue cohérente portée. Respecter strictement matières, couleurs, motifs et demande cliente. Pas de photo, pas de 3D, pas de collage, pas de texte dans image.';
    const variants=[
      'Solution 1 : proportions équilibrées, construction claire, lecture frontale nette.',
      'Solution 2 : mêmes choix obligatoires, mais lignes, drapé et proportions sensiblement différents.',
      'Solution 3 : mêmes choix obligatoires, avec détails de construction et finitions plus couture.'
    ];
    const prompts=variants.map(v=>clip(`${base} ${generatedPrompt?`Direction Atelier: ${generatedPrompt}. `:''}Commande: ${clientText||'création personnelle'}. Planche détectée: ${boardText}. ${v} Créer exactement un croquis de mode complet.`,2500));
    const headers={'Content-Type':'application/json','Accept':'application/json','x-magnific-api-key':magnificKey};
    const baseSeed=Number.isFinite(Number(body.seed))?Number(body.seed):Date.now()%1000000;

    async function jsonFetch(url,options,retries=1){
      let last;
      for(let i=0;i<=retries;i++){
        const r=await fetch(url,options);
        const text=await r.text();
        let j={};try{j=JSON.parse(text)}catch(_){j={raw:text.slice(0,600)}}
        if(r.ok)return j;
        last=new Error(`magnific_${r.status}:${JSON.stringify(j).slice(0,500)}`);
        if(r.status!==429||i===retries)throw last;
        await sleep(1400*(i+1));
      }
      throw last;
    }

    async function referenceImage(prompt){
      const path='https://api.magnific.com/v1/ai/gemini-2-5-flash-image-preview';
      const j=await jsonFetch(path,{method:'POST',headers,body:JSON.stringify({prompt,reference_images:[capture]})},1);
      let d=j?.data||{};
      let generated=Array.isArray(d.generated)?d.generated:[];
      if(generated[0])return generated[0];
      const taskId=d.task_id;
      if(!taskId)throw new Error('magnific_reference_task_missing');
      for(let i=0;i<24;i++){
        await sleep(900);
        const k=await jsonFetch(`${path}/${taskId}`,{headers:{Accept:'application/json','x-magnific-api-key':magnificKey}},1);
        d=k?.data||{};
        generated=Array.isArray(d.generated)?d.generated:[];
        if(generated[0])return generated[0];
        const st=String(d.status||'').toUpperCase();
        if(['FAILED','ERROR','CANCELLED'].includes(st))throw new Error(`magnific_reference_${st.toLowerCase()}`);
      }
      throw new Error('magnific_reference_timeout');
    }

    async function classicFast(prompt,seed){
      const payload={
        prompt,
        negative_prompt:'photograph, photorealistic, 3d render, mannequin photo, runway photo, collage, text, watermark, logo, UI, distorted anatomy, extra limbs, unrelated dominant garment, unselected dominant color, unselected dominant pattern',
        guidance_scale:2,
        seed,
        num_images:1,
        image:{size:'square_1_1'},
        filter_nsfw:true
      };
      const j=await jsonFetch('https://api.magnific.com/v1/ai/text-to-image',{method:'POST',headers,body:JSON.stringify(payload)},1);
      const item=Array.isArray(j?.data)?j.data[0]:null;
      if(item?.url)return item.url;
      if(item?.base64)return `data:image/png;base64,${item.base64}`;
      throw new Error(`magnific_classic_image_missing:${JSON.stringify(j).slice(0,350)}`);
    }

    const out=new Array(3).fill(null);
    const refErrors=new Array(3).fill(null);

    if(capture){
      const refsAttempt=await Promise.allSettled(prompts.map(referenceImage));
      refsAttempt.forEach((r,i)=>{
        if(r.status==='fulfilled')out[i]={url:r.value,mode:'reference-image'};
        else refErrors[i]=String(r.reason?.message||r.reason);
      });
    }

    for(let i=0;i<3;i++){
      if(out[i])continue;
      const seed=(baseSeed+i*7919)%1000001;
      try{out[i]={url:await classicFast(prompts[i],seed),mode:'text-fallback'}}
      catch(err){throw new Error(`croquis_${i+1}_failed:${String(err?.message||err)};reference=${refErrors[i]||'none'}`)}
    }

    const proposals=out.map((x,i)=>({id:String(i+1),name:`Croquis ${i+1}`,direction:variants[i],url:x.url,provider:'magnific',mode:x.mode,referenceError:refErrors[i],prompt:prompts[i]}));
    return res.status(200).json({
      ok:true,
      count:3,
      provider:'magnific',
      proposals,
      meta:{
        keySource:process.env.MAGNIFIC_API_KEY?'MAGNIFIC_API_KEY':'MAGNIFIC_KEY',
        garments,materials,colors,patterns,notes,
        captureReceived:!!capture,
        moodboardReferenceUsed:proposals.some(x=>x.mode==='reference-image'),
        fallbacks:proposals.filter(x=>x.referenceError).map(x=>({croquis:x.id,error:x.referenceError})),
        designerLevel:designer.level||null
      }
    });
  }catch(err){
    console.error('[Atelier sketch generation failed]',err);
    return res.status(500).json({error:'atelier_sketch_generation_failed',detail:String(err?.message||err)});
  }
}
