export const config={maxDuration:60};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
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
    const key=process.env.MAGNIFIC_API_KEY||process.env.MAGNIFIC_KEY;
    if(!key)return res.status(503).json({error:'MAGNIFIC_API_KEY_or_MAGNIFIC_KEY_missing'});

    const body=req.body||{},board=body.board||{},client=body.client||{},designer=body.designer||{};
    const components=Array.isArray(board.components)?board.components:[];
    if(!components.length)return res.status(400).json({error:'board_requires_element'});

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
    ].filter(Boolean).join('. '),700);

    const base='Professional fashion designer croquis, full-body elongated figure, hand-drawn graphite and ink with restrained watercolor or marker indications on ivory paper. Create one coherent wearable look from the selected garments. Respect silhouettes, necklines, lengths, proportions, fabrics, colors, patterns and client request. Fashion illustration only, no photograph, no photorealism, no 3D, no collage, no typography, no watermark.';
    const variants=[
      'Croquis 1: balanced proportions, clear construction, strong front-view readability.',
      'Croquis 2: same mandatory ingredients but noticeably different drape, lines and proportions.',
      'Croquis 3: same mandatory ingredients with more couture construction details and refined finishing.'
    ];
    const prompts=variants.map(v=>clip(`${base} ${generatedPrompt?`Atelier direction: ${generatedPrompt}. `:''}Client order: ${clientText||'personal creation'}. Moodboard selections: ${boardText}. ${v}`,2500));
    const headers={'Content-Type':'application/json','Accept':'application/json','x-magnific-api-key':key};
    const baseSeed=Number.isFinite(Number(body.seed))?Number(body.seed):Date.now()%1000000;

    async function generateClassic(prompt,seed){
      let last='';
      for(let attempt=0;attempt<3;attempt++){
        const r=await fetch('https://api.magnific.com/v1/ai/text-to-image',{method:'POST',headers,body:JSON.stringify({prompt,seed,num_images:1,filter_nsfw:true})});
        const text=await r.text();
        let j={};try{j=JSON.parse(text)}catch(_){j={raw:text.slice(0,800)}}
        if(r.ok){
          const item=Array.isArray(j?.data)?j.data[0]:null;
          if(item?.base64)return `data:image/png;base64,${item.base64}`;
          if(item?.url)return item.url;
          throw new Error(`magnific_image_missing:${JSON.stringify(j).slice(0,500)}`);
        }
        last=`magnific_${r.status}:${JSON.stringify(j).slice(0,600)}`;
        if(r.status!==429)throw new Error(last);
        await sleep(1500*(attempt+1));
      }
      throw new Error(last||'magnific_generation_failed');
    }

    const proposals=[];
    for(let i=0;i<3;i++){
      const seed=(baseSeed+i*7919)%1000001;
      const url=await generateClassic(prompts[i],seed);
      proposals.push({id:String(i+1),name:`Croquis ${i+1}`,direction:variants[i],url,provider:'magnific',mode:'classic-fast',prompt:prompts[i]});
    }

    return res.status(200).json({
      ok:true,count:3,provider:'magnific',proposals,
      meta:{mode:'classic-fast-only',garments,materials,colors,patterns,notes,captureReceived:!!body.moodboardImage,moodboardReferenceUsed:false,designerLevel:designer.level||null}
    });
  }catch(err){
    console.error('[Atelier Classic Fast generation failed]',err);
    return res.status(500).json({error:'atelier_sketch_generation_failed',detail:String(err?.message||err)});
  }
}
