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
    if(!process.env.MAGNIFIC_API_KEY)return res.status(503).json({error:'MAGNIFIC_API_KEY_missing'});
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
    const generatedPrompt=clip(body.generatedPrompt||board.generatedPrompt||'',1200);
    const clientText=clip([
      client.garment&&`demande ${client.garment}`,
      client.occasion&&`occasion ${client.occasion}`,
      client.style&&`style ${client.style}`,
      Array.isArray(client.paletteLiked)&&client.paletteLiked.length&&`palette ${client.paletteLiked.join(', ')}`,
      Array.isArray(client.paletteAvoid)&&client.paletteAvoid.length&&`éviter ${client.paletteAvoid.join(', ')}`,
      Array.isArray(client.materialsPreferred)&&client.materialsPreferred.length&&`matières souhaitées ${client.materialsPreferred.join(', ')}`,
      client.notes&&`notes cliente ${client.notes}`
    ].filter(Boolean).join('. '),500);
    const boardText=clip([
      garments.length&&`silhouettes/formes ${garments.join(', ')}`,
      materials.length&&`matières ${materials.join(', ')}`,
      colors.length&&`couleurs ${colors.join(', ')}`,
      patterns.length?`motifs ${patterns.join(', ')}`:'aucun motif dominant',
      notes.length&&`notes créatives ${notes.join(' | ')}`
    ].filter(Boolean).join('. '),650);

    const base=`Croquis de styliste professionnel, silhouette entière élancée, dessin main graphite et encre avec touches aquarelle/feutre, papier ivoire. La photo JPEG du moodboard est la direction visuelle principale. Conserver les silhouettes, volumes, encolures, longueurs et associations de vêtements visibles sur cette planche puis les résoudre en UNE tenue cohérente portée. Respecter strictement matières, couleurs, motifs et demande cliente. Pas de photo, pas de 3D, pas de collage, pas de texte dans l'image.`;
    const variants=[
      `Première solution de stylisme : proportions équilibrées, construction claire, lecture frontale nette.`,
      `Deuxième solution de stylisme : mêmes choix obligatoires, mais lignes, drapé et proportions sensiblement différents.`,
      `Troisième solution de stylisme : mêmes choix obligatoires, mais détails de construction et finitions plus couture.`
    ];
    const headers={'Content-Type':'application/json','Accept':'application/json','x-magnific-api-key':process.env.MAGNIFIC_API_KEY};

    async function jsonFetch(url,options,retries=1){
      let last;
      for(let i=0;i<=retries;i++){
        const r=await fetch(url,options),j=await r.json().catch(()=>({}));
        if(r.ok)return j;
        last=new Error(`magnific_${r.status}:${JSON.stringify(j).slice(0,420)}`);
        if(r.status!==429||i===retries)throw last;
        await sleep(1400*(i+1));
      }
      throw last;
    }

    async function referenceImage(prompt){
      const path='https://api.magnific.com/v1/ai/gemini-2-5-flash-image-preview';
      const j=await jsonFetch(path,{method:'POST',headers,body:JSON.stringify({prompt,reference_images:[capture]})},1);
      let d=j?.data||{},generated=Array.isArray(d.generated)?d.generated:[];
      if(generated[0])return generated[0];
      const taskId=d.task_id;
      if(!taskId)throw new Error('magnific_reference_task_missing');
      for(let i=0;i<36;i++){
        await sleep(1000);
        const k=await jsonFetch(`${path}/${taskId}`,{headers:{Accept:'application/json','x-magnific-api-key':process.env.MAGNIFIC_API_KEY}},1);
        d=k?.data||{};generated=Array.isArray(d.generated)?d.generated:[];
        if(generated[0])return generated[0];
        const st=String(d.status||'').toUpperCase();
        if(['FAILED','ERROR','CANCELLED'].includes(st))throw new Error(`magnific_reference_${st.toLowerCase()}`);
      }
      throw new Error('magnific_reference_timeout');
    }

    async function classicFast(prompt,seed){
      const j=await jsonFetch('https://api.magnific.com/v1/ai/text-to-image',{method:'POST',headers,body:JSON.stringify({
        prompt,
        negative_prompt:'photograph, photorealistic, 3d render, mannequin photo, runway photo, collage, text, watermark, logo, UI, distorted anatomy, extra limbs, unrelated dominant garment, unselected dominant color, unselected dominant pattern',
        guidance_scale:2,
        seed,
        num_images:1,
        styling:{effects:{framing:'portrait'}},
        filter_nsfw:true
      })},1);
      const item=Array.isArray(j?.data)?j.data[0]:null;
      const b64=item?.base64||null,url=item?.url||null;
      if(url)return url;
      if(b64)return `data:image/png;base64,${b64}`;
      throw new Error('magnific_classic_image_missing');
    }

    async function generateOne(index){
      const prompt=clip(`${base} ${generatedPrompt?`Direction Atelier: ${generatedPrompt}. `:''}Commande: ${clientText||'création personnelle'}. Planche détectée: ${boardText}. ${variants[index]} Créer exactement un croquis de mode complet.`,2800);
      const baseSeed=Number.isFinite(Number(body.seed))?Number(body.seed):Date.now()%1000000;
      const seed=(baseSeed+index*7919)%1000001;
      let url=null,mode='text-fallback',referenceError=null;
      if(capture){
        try{url=await referenceImage(prompt);mode='reference-image'}
        catch(err){referenceError=String(err?.message||err);console.warn(`[Atelier] reference sketch ${index+1} failed`,referenceError)}
      }
      if(!url)url=await classicFast(prompt,seed);
      return{id:String(index+1),name:`Croquis ${index+1}`,direction:variants[index],url,provider:'magnific',mode,referenceError,prompt};
    }

    const settled=await Promise.allSettled([0,1,2].map(generateOne));
    const proposals=settled.filter(x=>x.status==='fulfilled').map(x=>x.value);
    if(proposals.length!==3){
      const failures=settled.map((x,i)=>x.status==='rejected'?{croquis:i+1,error:String(x.reason?.message||x.reason)}:null).filter(Boolean);
      throw new Error(`three_sketches_required:${JSON.stringify(failures)}`);
    }

    return res.status(200).json({ok:true,count:3,provider:'magnific',proposals,meta:{garments,materials,colors,patterns,notes,captureReceived:!!capture,moodboardReferenceUsed:proposals.some(x=>x.mode==='reference-image'),fallbacks:proposals.filter(x=>x.referenceError).map(x=>({croquis:x.id,error:x.referenceError})),designerLevel:designer.level||null}});
  }catch(err){
    console.error('[Atelier sketch generation failed]',err);
    return res.status(500).json({error:'atelier_sketch_generation_failed',detail:String(err?.message||err)});
  }
}
