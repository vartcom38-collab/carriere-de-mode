const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const cleanBase64=s=>String(s||'').replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '');

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
    const boardNotes=Array.isArray(board.boardNotes)?board.boardNotes:[];
    const refs=board.references||{},capture=cleanBase64(body.moodboardImage||'');
    const componentNames=components.map(x=>x?.name).filter(Boolean),categories=[...new Set(components.map(x=>x?.category).filter(Boolean))];
    const promptTokens=[...(Array.isArray(board.componentPromptTokens)?board.componentPromptTokens:[]),...components.map(x=>x?.promptToken)].map(String).map(x=>x.trim()).filter(Boolean);
    const fabric=board.fabric?.name||board.fabric?.label||refs?.material?.name||'',color=refs?.color?.name||'',pattern=refs?.pattern?.name||'',notes=String(board.notes||'').trim();
    const layout=components.map((x,i)=>({instanceId:x?.instanceId||`element-${i+1}`,catalogId:x?.catalogId||'',variantId:x?.variantId||x?.referenceId||'',name:x?.name||`element ${i+1}`,category:x?.category||'',tags:Array.isArray(x?.tags)?x.tags:[],x:Number(x?.x||0),y:Number(x?.y||0),width:Number(x?.width||0),height:Number(x?.height||0),scale:Number(x?.scale||1),rotation:Number(x?.rotation??x?.rotate??0),zIndex:Number(x?.zIndex??i+5),order:Number(x?.order??i)}));
    const boardW=Math.max(1,Number(board?.capture?.width||Math.max(...layout.map(x=>x.x+x.width),1))),boardH=Math.max(1,Number(board?.capture?.height||Math.max(...layout.map(x=>x.y+x.height),1)));
    const centerX=boardW/2,centerY=boardH/2,maxArea=Math.max(1,...layout.map(x=>x.width*x.height*x.scale*x.scale));
    const layoutText=layout.sort((a,b)=>a.zIndex-b.zIndex).map(x=>{
      const cx=x.x+x.width/2,cy=x.y+x.height/2,area=x.width*x.height*x.scale*x.scale;
      const size=area>=maxArea*.72?'large / dominant':area<=maxArea*.24?'small / supporting':'medium';
      const horizontal=cx<centerX*.72?'left':cx>centerX*1.28?'right':'center';
      const vertical=cy<centerY*.72?'upper':cy>centerY*1.28?'lower':'middle';
      return `${x.name} [${x.category||'reference'}; variant ${x.variantId||'default'}] is ${size}, placed ${vertical}-${horizontal}, rotation ${Math.round(x.rotation)}°, layer ${x.zIndex}, tags ${x.tags.join(', ')||'none'}`;
    }).join(' | ');
    const proximity=[];
    for(let i=0;i<layout.length;i++)for(let j=i+1;j<layout.length;j++){
      const a=layout[i],b=layout[j],ax=a.x+a.width/2,ay=a.y+a.height/2,bx=b.x+b.width/2,by=b.y+b.height/2,d=Math.hypot(ax-bx,ay-by),threshold=Math.max(120,(a.width+b.width+a.height+b.height)/5);
      if(d<threshold)proximity.push(`${a.name} is visually grouped with ${b.name}`);
      const overlap=!(a.x+a.width<b.x||b.x+b.width<a.x||a.y+a.height<b.y||b.y+b.height<a.y);if(overlap)proximity.push(`${a.name} overlaps ${b.name}; layer order ${a.zIndex}<${b.zIndex}`)
    }
    boardNotes.forEach(n=>{let nearest=null,best=Infinity;layout.forEach(x=>{const d=Math.hypot((n.x||0)-(x.x+x.width/2),(n.y||0)-(x.y+x.height/2));if(d<best){best=d;nearest=x}});if(nearest&&String(n.text||'').trim())proximity.push(`Note "${String(n.text).trim().slice(0,140)}" is closest to ${nearest.name}`)});
    const clientText=[client.name&&`Client: ${client.name}`,client.garment&&`Requested garment: ${client.garment}`,client.occasion&&`Occasion: ${client.occasion}`,client.style&&`Desired style: ${client.style}`,Array.isArray(client.paletteLiked)&&client.paletteLiked.length&&`Preferred palette: ${client.paletteLiked.join(', ')}`,Array.isArray(client.paletteAvoid)&&client.paletteAvoid.length&&`Avoid colors: ${client.paletteAvoid.join(', ')}`,Array.isArray(client.materialsPreferred)&&client.materialsPreferred.length&&`Preferred materials: ${client.materialsPreferred.join(', ')}`,client.notes&&`Client notes: ${client.notes}`,client.budget&&`Budget: ${client.budget}`].filter(Boolean).join('. ');
    const boardText=[componentNames.length&&`Selected references only: ${componentNames.join(', ')}`,categories.length&&`Selected families: ${categories.join(', ')}`,layoutText&&`Visual composition: ${layoutText}`,proximity.length&&`Spatial relationships: ${proximity.join(' | ')}`,promptTokens.length&&`Technical vocabulary: ${[...new Set(promptTokens)].join(' | ')}`,fabric&&`Chosen fabric: ${fabric}`,color&&`Chosen color direction: ${color}`,pattern&&`Chosen pattern/treatment: ${pattern}`,notes&&`Designer notes: ${notes}`,designer.level&&`Designer technical level: ${designer.level}`].filter(Boolean).join('. ');
    const styleLock=`Create a professional French fashion-designer croquis: one full-body fashion figure wearing ONE coherent finished outfit, hand-drawn graphite and ink with restrained marker/watercolor indications, elongated proportions, visible construction logic and textile behavior, warm off-white sketchbook paper, no photography, no 3D render, no labels, no collage, no UI. The attached moodboard image is a DIRECTIONAL REFERENCE, not an image to reproduce literally. Read its hierarchy, grouping, scale, proximity, overlap and notes together with the structured data. Use only the selected garment vocabulary as dominant design ingredients. Never introduce an unselected dominant garment feature. The result must remain physically plausible.`;
    const variants=[
      {id:'A',name:'Interprétation fidèle',direction:'Stay very faithful to the selected references, spatial hierarchy and client constraints. Resolve them into the clearest wearable proposal.'},
      {id:'B',name:'Interprétation mode',direction:'Use the exact same selected references and hierarchy, but reinterpret proportion and relationships with a stronger contemporary fashion-editorial point of view.'},
      {id:'C',name:'Interprétation couture',direction:'Use the exact same selected references and hierarchy, but push drape, construction and refinement toward couture without inventing a new dominant ingredient.'}
    ];
    const headers={'Content-Type':'application/json','Accept':'application/json','x-magnific-api-key':process.env.MAGNIFIC_API_KEY};
    async function classic(prompt,seed){const r=await fetch('https://api.magnific.com/v1/ai/text-to-image',{method:'POST',headers,body:JSON.stringify({prompt,negative_prompt:'photorealistic photo, 3d render, mannequin photo, runway photo, multiple outfits, multiple people, collage, text, watermark, logo, UI, moodboard, distorted anatomy, extra limbs, unrelated dominant garment feature',guidance_scale:2,seed,num_images:1,styling:{effects:{framing:'portrait'}},filter_nsfw:true})});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(`magnific_${r.status}:${JSON.stringify(j).slice(0,300)}`);const item=Array.isArray(j?.data)?j.data[0]:null,b64=item?.base64||null,url=item?.url||item?.generated?.[0]||null;if(!b64&&!url)throw new Error('magnific_image_missing');return url||`data:image/png;base64,${b64}`}
    async function referenced(prompt){const r=await fetch('https://api.magnific.com/v1/ai/gemini-2-5-flash-image-preview',{method:'POST',headers,body:JSON.stringify({prompt,reference_images:[capture]})});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(`magnific_reference_${r.status}:${JSON.stringify(j).slice(0,300)}`);let d=j?.data||{},generated=Array.isArray(d.generated)?d.generated:[];if(generated[0])return generated[0];const task=d.task_id;if(!task)throw new Error('magnific_reference_task_missing');for(let i=0;i<24;i++){await sleep(1000);const q=await fetch(`https://api.magnific.com/v1/ai/gemini-2-5-flash-image-preview/${task}`,{headers:{'Accept':'application/json','x-magnific-api-key':process.env.MAGNIFIC_API_KEY}});const k=await q.json().catch(()=>({}));if(!q.ok)throw new Error(`magnific_reference_status_${q.status}`);d=k?.data||{};generated=Array.isArray(d.generated)?d.generated:[];if(generated[0])return generated[0];if(['FAILED','ERROR','CANCELLED'].includes(String(d.status||'').toUpperCase()))throw new Error('magnific_reference_failed')}throw new Error('magnific_reference_timeout')}
    async function generate(v,index){const prompt=`${styleLock}\n\nCLIENT BRIEF: ${clientText||'Personal creation.'}\n\nSTRUCTURED MOODBOARD: ${boardText}.\n\nVARIATION ${v.id}: ${v.direction}\nCreate exactly one complete fashion croquis proposal.`;const baseSeed=Number.isFinite(Number(body.seed))?Number(body.seed):Date.now()%1000000,seed=Math.max(0,Math.min(1000000,(baseSeed+index*7919)%1000001));const url=capture?await referenced(prompt):await classic(prompt,seed);return{id:v.id,name:v.name,direction:v.direction,url,provider:'magnific',prompt}}
    const results=await Promise.all(variants.map((v,i)=>generate(v,i)));
    if(results.length!==3)return res.status(500).json({error:'atelier_requires_three_proposals'});
    return res.status(200).json({ok:true,provider:'magnific',count:3,proposals:results,meta:{components:componentNames,layout,relationships:proximity,fabric,color,pattern,moodboardReferenceUsed:!!capture,captureError:board?.capture?.error||null}});
  }catch(err){return res.status(500).json({error:'atelier_sketch_generation_failed',detail:String(err?.message||err)})}
}
