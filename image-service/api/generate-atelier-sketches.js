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
    const generatedPrompt=clip(body.generatedPrompt||board.generatedPrompt||'',1250);
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

    const base=`Croquis de styliste professionnel français, silhouette entière élancée, dessin main graphite et encre avec touches aquarelle/feutre, papier ivoire. La photo JPEG du moodboard est la direction visuelle principale : conserver les silhouettes, volumes, encolures, longueurs et associations de vêtements qui y sont visibles, puis les résoudre en UNE tenue cohérente portée. Respecter strictement matières, couleurs, motifs et demande cliente. Pas de photo, pas de 3D, pas de collage, pas de texte dans l'image.`;
    const variants=[
      `Proposition 1 : première solution de stylisme, construction claire et proportions équilibrées.`,
      `Proposition 2 : autre solution de stylisme, mêmes choix obligatoires mais proportions, lignes et drapé sensiblement différents.`,
      `Proposition 3 : troisième solution de stylisme, mêmes choix obligatoires mais détails de construction et finitions différents.`
    ];
    const headers={'Content-Type':'application/json','Accept':'application/json','x-magnific-api-key':process.env.MAGNIFIC_API_KEY};

    async function api(path,options,retries=1){
      let last;
      for(let i=0;i<=retries;i++){
        const r=await fetch(`https://api.magnific.com${path}`,options),j=await r.json().catch(()=>({}));
        if(r.ok)return j;
        last=new Error(`magnific_${r.status}:${JSON.stringify(j).slice(0,360)}`);
        if(r.status!==429||i===retries)throw last;
        await sleep(1200*(i+1));
      }
      throw last;
    }
    async function task(path,payload){
      const j=await api(path,{method:'POST',headers,body:JSON.stringify(payload)},1);
      let d=j?.data||{},generated=Array.isArray(d.generated)?d.generated:[];
      if(generated[0])return generated[0];
      const id=d.task_id;if(!id)throw new Error('magnific_task_missing');
      for(let i=0;i<42;i++){
        await sleep(850);
        const k=await api(`${path}/${id}`,{headers:{Accept:'application/json','x-magnific-api-key':process.env.MAGNIFIC_API_KEY}},1);
        d=k?.data||{};generated=Array.isArray(d.generated)?d.generated:[];
        if(generated[0])return generated[0];
        const st=String(d.status||'').toUpperCase();
        if(['FAILED','ERROR','CANCELLED'].includes(st))throw new Error(`magnific_task_${st.toLowerCase()}`);
      }
      throw new Error('magnific_task_timeout');
    }
    async function generateOne(index){
      const prompt=clip(`${base} ${generatedPrompt?`Direction Atelier: ${generatedPrompt}. `:''}Commande: ${clientText||'création personnelle'}. Planche détectée: ${boardText}. ${variants[index]} Créer exactement un croquis de mode complet.`,2800);
      let url=null,mode='reference-image',referenceError=null;
      if(capture){
        try{url=await task('/v1/ai/gemini-2-5-flash-image-preview',{prompt,reference_images:[capture]})}
        catch(err){referenceError=String(err?.message||err);console.warn(`[Atelier] reference sketch ${index+1} failed`,referenceError)}
      }
      if(!url){
        mode='text-fallback';
        url=await task('/v1/ai/text-to-image/nano-banana-pro-flash',{prompt,aspect_ratio:'2:3',resolution:'1K',use_google_search_tool:false});
      }
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
