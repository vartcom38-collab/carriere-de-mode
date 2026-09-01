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
    const magnificKey=process.env.MAGNIFIC_API_KEY||process.env.MAGNIFIC_KEY||'';
    const openaiKey=process.env.OPENAI_API_KEY||'';
    if(!magnificKey&&!openaiKey)return res.status(503).json({error:'image_provider_missing'});

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

    const base='Professional fashion designer croquis. Full-body elongated fashion figure, hand-drawn graphite and ink with restrained watercolor or marker indications on ivory sketchbook paper. Resolve the selected garments into one coherent wearable look. Respect the selected silhouettes, necklines, lengths, proportions, fabrics, colors, patterns and client request. Fashion illustration only: no photograph, no photorealism, no 3D render, no collage, no typography, no watermark.';
    const variants=[
      'Croquis 1: balanced proportions, clear construction, strong front-view readability.',
      'Croquis 2: same mandatory ingredients but noticeably different drape, lines and proportions.',
      'Croquis 3: same mandatory ingredients with more couture construction details and refined finishing.'
    ];
    const prompts=variants.map(v=>clip(`${base} ${generatedPrompt?`Atelier direction: ${generatedPrompt}. `:''}Client order: ${clientText||'personal creation'}. Moodboard selections: ${boardText}. ${v}`,2400));

    async function magnificJson(url,options){
      const r=await fetch(url,options);
      const text=await r.text();
      let j={};try{j=JSON.parse(text)}catch(_){j={raw:text.slice(0,600)}}
      if(!r.ok)throw new Error(`magnific_${r.status}:${JSON.stringify(j).slice(0,500)}`);
      return j;
    }

    async function magnificReference(prompt){
      if(!magnificKey||!capture)throw new Error('magnific_reference_unavailable');
      const path='https://api.magnific.com/v1/ai/gemini-2-5-flash-image-preview';
      const headers={'Content-Type':'application/json','Accept':'application/json','x-magnific-api-key':magnificKey};
      const j=await magnificJson(path,{method:'POST',headers,body:JSON.stringify({prompt,reference_images:[capture]})});
      let d=j?.data||{},generated=Array.isArray(d.generated)?d.generated:[];
      if(generated[0])return generated[0];
      const taskId=d.task_id;
      if(!taskId)throw new Error('magnific_reference_task_missing');
      for(let i=0;i<10;i++){
        await sleep(800);
        const k=await magnificJson(`${path}/${taskId}`,{headers:{Accept:'application/json','x-magnific-api-key':magnificKey}});
        d=k?.data||{};generated=Array.isArray(d.generated)?d.generated:[];
        if(generated[0])return generated[0];
        const st=String(d.status||'').toUpperCase();
        if(['FAILED','ERROR','CANCELLED'].includes(st))throw new Error(`magnific_reference_${st.toLowerCase()}`);
      }
      throw new Error('magnific_reference_timeout');
    }

    async function magnificText(prompt,seed){
      if(!magnificKey)throw new Error('magnific_key_missing');
      const headers={'Content-Type':'application/json','Accept':'application/json','x-magnific-api-key':magnificKey};
      const j=await magnificJson('https://api.magnific.com/v1/ai/text-to-image',{method:'POST',headers,body:JSON.stringify({prompt,seed,num_images:1,filter_nsfw:true})});
      const item=Array.isArray(j?.data)?j.data[0]:null;
      if(item?.url)return item.url;
      if(item?.base64)return `data:image/png;base64,${item.base64}`;
      throw new Error(`magnific_text_image_missing:${JSON.stringify(j).slice(0,350)}`);
    }

    async function openaiText(prompt){
      if(!openaiKey)throw new Error('openai_key_missing');
      const r=await fetch('https://api.openai.com/v1/images/generations',{
        method:'POST',
        headers:{'Authorization':`Bearer ${openaiKey}`,'Content-Type':'application/json'},
        body:JSON.stringify({
          model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-2',
          prompt,
          size:'1024x1536',
          quality:process.env.OPENAI_IMAGE_QUALITY||'medium',
          n:1
        })
      });
      const text=await r.text();
      let j={};try{j=JSON.parse(text)}catch(_){j={raw:text.slice(0,600)}}
      if(!r.ok)throw new Error(`openai_${r.status}:${JSON.stringify(j).slice(0,500)}`);
      const item=Array.isArray(j?.data)?j.data[0]:null;
      if(item?.b64_json)return `data:image/png;base64,${item.b64_json}`;
      if(item?.url)return item.url;
      throw new Error(`openai_image_missing:${JSON.stringify(j).slice(0,350)}`);
    }

    const baseSeed=Number.isFinite(Number(body.seed))?Number(body.seed):Date.now()%1000000;
    const providerErrors=[];

    async function generateOne(i){
      const prompt=prompts[i],seed=(baseSeed+i*7919)%1000001;
      if(magnificKey&&capture){
        try{return{url:await magnificReference(prompt),provider:'magnific',mode:'reference-image'}}
        catch(err){providerErrors.push({croquis:i+1,provider:'magnific-reference',error:String(err?.message||err)})}
      }
      if(magnificKey){
        try{return{url:await magnificText(prompt,seed),provider:'magnific',mode:'text-fallback'}}
        catch(err){providerErrors.push({croquis:i+1,provider:'magnific-text',error:String(err?.message||err)})}
      }
      if(openaiKey){
        try{return{url:await openaiText(prompt),provider:'openai',mode:'text-fallback'}}
        catch(err){providerErrors.push({croquis:i+1,provider:'openai',error:String(err?.message||err)})}
      }
      throw new Error(`croquis_${i+1}_all_providers_failed`);
    }

    const settled=await Promise.allSettled([0,1,2].map(generateOne));
    const failed=settled.findIndex(x=>x.status==='rejected');
    if(failed>=0)throw new Error(`croquis_${failed+1}_failed:${String(settled[failed].reason?.message||settled[failed].reason)};providers=${JSON.stringify(providerErrors).slice(0,1200)}`);
    const out=settled.map(x=>x.value);

    const proposals=out.map((x,i)=>({
      id:String(i+1),name:`Croquis ${i+1}`,direction:variants[i],url:x.url,
      provider:x.provider,mode:x.mode,prompt:prompts[i]
    }));

    return res.status(200).json({
      ok:true,count:3,proposals,
      meta:{
        garments,materials,colors,patterns,notes,
        captureReceived:!!capture,
        moodboardReferenceUsed:proposals.some(x=>x.mode==='reference-image'),
        providers:proposals.map(x=>x.provider),
        providerErrors,
        designerLevel:designer.level||null
      }
    });
  }catch(err){
    console.error('[Atelier sketch generation failed]',err);
    return res.status(500).json({error:'atelier_sketch_generation_failed',detail:String(err?.message||err)});
  }
}
