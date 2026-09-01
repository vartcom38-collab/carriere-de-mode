export const config={maxDuration:60};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const cleanBase64=s=>String(s||'').replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/,'');
const names=a=>(Array.isArray(a)?a:[]).map(x=>typeof x==='string'?x:x?.name).filter(Boolean);

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
    const generatedPrompt=String(body.generatedPrompt||board.generatedPrompt||'').trim();
    const refs=board.references||{};
    const materialNames=[...new Set([...names(refs.materials),...components.filter(x=>x?.moodKind==='material'||x?.category==='material').map(x=>x?.name).filter(Boolean)])];
    const colorNames=[...new Set([...names(refs.colors),...components.filter(x=>x?.moodKind==='color'||x?.category==='color').map(x=>x?.name).filter(Boolean)])];
    const patternNames=[...new Set([...names(refs.patterns),...components.filter(x=>x?.moodKind==='pattern'||x?.category==='pattern').map(x=>x?.name).filter(Boolean)])];
    const noteTexts=[...(Array.isArray(board.notes)?board.notes:[]).map(x=>typeof x==='string'?x:x?.noteText||x?.text).filter(Boolean),...components.map(x=>x?.noteText).filter(Boolean)];
    const garmentNames=components.filter(x=>!x?.moodKind||x?.moodKind==='reference').map(x=>x?.name).filter(Boolean);
    const layout=components.map((x,i)=>({name:x?.name||`élément ${i+1}`,category:x?.category||x?.moodKind||'',moodKind:x?.moodKind||'',x:Number(x?.x||0),y:Number(x?.y||0),width:Number(x?.width||0),height:Number(x?.height||0),zIndex:Number(x?.zIndex??i+5)}));
    const boardW=Math.max(1,Number(board?.capture?.width||Math.max(...layout.map(x=>x.x+x.width),1))),boardH=Math.max(1,Number(board?.capture?.height||Math.max(...layout.map(x=>x.y+x.height),1)));
    const centerX=boardW/2,centerY=boardH/2;
    const layoutText=layout.map(x=>{const cx=x.x+x.width/2,cy=x.y+x.height/2,h=cx<centerX*.72?'left':cx>centerX*1.28?'right':'center',v=cy<centerY*.72?'upper':cy>centerY*1.28?'lower':'middle';return `${x.name}: ${v}-${h}, layer ${x.zIndex}`}).join(' | ');
    const clientText=[client.garment&&`requested garment ${client.garment}`,client.occasion&&`occasion ${client.occasion}`,client.style&&`style ${client.style}`,Array.isArray(client.paletteLiked)&&client.paletteLiked.length&&`preferred palette ${client.paletteLiked.join(', ')}`,Array.isArray(client.paletteAvoid)&&client.paletteAvoid.length&&`avoid ${client.paletteAvoid.join(', ')}`,Array.isArray(client.materialsPreferred)&&client.materialsPreferred.length&&`preferred materials ${client.materialsPreferred.join(', ')}`,client.notes&&`client notes ${client.notes}`].filter(Boolean).join('. ');
    const structured=[garmentNames.length&&`garment silhouettes selected: ${garmentNames.join(', ')}`,materialNames.length&&`materials: ${materialNames.join(', ')}`,colorNames.length&&`colors: ${colorNames.join(', ')}`,patternNames.length&&`patterns: ${patternNames.join(', ')}`,!patternNames.length&&'no pattern selected',noteTexts.length&&`designer notes: ${noteTexts.join(' | ')}`,layoutText&&`moodboard layout: ${layoutText}`,designer.level&&`designer level ${designer.level}`].filter(Boolean).join('. ');

    const visualLock=`Create a professional fashion designer sketch, not a photograph. Full-body elongated fashion figure, hand-drawn graphite and ink, restrained watercolor/marker accents, visible garment construction and fabric behavior, warm ivory sketchbook paper. The supplied moodboard image is the primary visual direction. Preserve the approximate garment silhouettes, neckline/hem/volume relationships and selected clothing archetypes visible in that image. Transform the moodboard into one coherent wearable design; do not reproduce it as a collage. Respect all selected fabrics, colors, patterns and client constraints. Do not introduce any dominant garment component, color, fabric or pattern that is absent from the moodboard. No text, labels, UI, collage, 3D render or fashion photography.`;
    const variants=[
      {id:'1',name:'Croquis 1',direction:'Keep the selected silhouettes especially clear and resolved. Explore a first professional construction solution with balanced proportions and a clean front-oriented fashion pose.'},
      {id:'2',name:'Croquis 2',direction:'Keep the same selected garment vocabulary, fabrics and colors, but explore a distinctly different styling solution through proportion, drape and line. Use a slightly dynamic three-quarter fashion pose while keeping the garment readable.'},
      {id:'3',name:'Croquis 3',direction:'Keep the same selected garment vocabulary, fabrics and colors, but explore another distinct styling solution through construction details, finishing and couture refinement. The silhouette must still visibly derive from the moodboard.'}
    ];
    const headers={'Content-Type':'application/json','Accept':'application/json','x-magnific-api-key':process.env.MAGNIFIC_API_KEY};

    async function request(url,options,retries=1){let last;for(let i=0;i<=retries;i++){const r=await fetch(url,options),j=await r.json().catch(()=>({}));if(r.ok)return j;last=new Error(`magnific_${r.status}:${JSON.stringify(j).slice(0,400)}`);if(r.status!==429||i===retries)throw last;await sleep(1400*(i+1))}throw last}
    async function referenceImage(prompt){const j=await request('https://api.magnific.com/v1/ai/gemini-2-5-flash-image-preview',{method:'POST',headers,body:JSON.stringify({prompt,reference_images:[capture]})},1);let d=j?.data||{},generated=Array.isArray(d.generated)?d.generated:[];if(generated[0])return generated[0];const task=d.task_id;if(!task)throw new Error('magnific_reference_task_missing');for(let i=0;i<22;i++){await sleep(1000);const k=await request(`https://api.magnific.com/v1/ai/gemini-2-5-flash-image-preview/${task}`,{headers:{Accept:'application/json','x-magnific-api-key':process.env.MAGNIFIC_API_KEY}},1);d=k?.data||{};generated=Array.isArray(d.generated)?d.generated:[];if(generated[0])return generated[0];const st=String(d.status||'').toUpperCase();if(['FAILED','ERROR','CANCELLED'].includes(st))throw new Error(`magnific_reference_${st.toLowerCase()}`)}throw new Error('magnific_reference_timeout')}
    async function classic(prompt,seed){const j=await request('https://api.magnific.com/v1/ai/text-to-image',{method:'POST',headers,body:JSON.stringify({prompt,negative_prompt:'photograph, photorealistic, 3d render, mannequin photo, runway photo, multiple outfits, collage, text, watermark, logo, UI, distorted anatomy, extra limbs, unselected garment component, unselected dominant color, unselected dominant pattern',guidance_scale:2,seed,num_images:1,styling:{effects:{framing:'portrait'}},filter_nsfw:true})},1);const item=Array.isArray(j?.data)?j.data[0]:null,b64=item?.base64||null,url=item?.url||item?.generated?.[0]||null;if(!b64&&!url)throw new Error('magnific_text_image_missing');return url||`data:image/png;base64,${b64}`}
    async function one(v,index){const authoritative=generatedPrompt?`\n\nATELIER DIRECTION (authoritative):\n${generatedPrompt}`:'';const prompt=`${visualLock}${authoritative}\n\nCLIENT: ${clientText||'personal creation'}.\n\nSTRUCTURED MOODBOARD: ${structured}.\n\nTHIS SKETCH: ${v.direction}\nCreate one complete fashion-designer croquis.`;const base=Number.isFinite(Number(body.seed))?Number(body.seed):Date.now()%1000000,seed=(base+index*7919)%1000001;let url=null,mode='text',referenceError=null;if(capture){try{url=await referenceImage(prompt);mode='reference-image'}catch(err){referenceError=String(err?.message||err);console.warn(`[Atelier] moodboard reference failed for sketch ${v.id}`,referenceError)}}if(!url)url=await classic(prompt,seed);return{id:v.id,name:v.name,direction:v.direction,url,provider:'magnific',mode,referenceError,prompt}}

    const settled=await Promise.allSettled(variants.map((v,i)=>one(v,i)));
    const results=settled.filter(x=>x.status==='fulfilled').map(x=>x.value);
    if(results.length!==3){const failures=settled.map((x,i)=>x.status==='rejected'?{sketch:i+1,error:String(x.reason?.message||x.reason)}:null).filter(Boolean);throw new Error(`three_sketches_required:${JSON.stringify(failures)}`)}
    return res.status(200).json({ok:true,provider:'magnific',count:3,proposals:results,meta:{garments:garmentNames,materials:materialNames,colors:colorNames,patterns:patternNames,notes:noteTexts,moodboardReferenceUsed:results.some(x=>x.mode==='reference-image'),referenceFallbacks:results.filter(x=>x.referenceError).map(x=>({sketch:x.id,error:x.referenceError})),captureReceived:!!capture,generatedPromptUsed:!!generatedPrompt}});
  }catch(err){console.error('[Atelier sketch generation failed]',err);return res.status(500).json({error:'atelier_sketch_generation_failed',detail:String(err?.message||err)})}
}
