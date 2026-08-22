export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin',process.env.ALLOWED_ORIGIN||'*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  if(req.method==='OPTIONS')return res.status(204).end();
  if(req.method!=='POST')return res.status(405).json({error:'method_not_allowed'});
  try{
    const {listingId,visualSeed,view='main',prompt,metadata={}}=req.body||{};
    if(!visualSeed||!prompt)return res.status(400).json({error:'missing_visual_seed_or_prompt'});
    if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:'OPENAI_API_KEY_missing'});
    const safeView=String(view).replace(/[^a-z0-9_-]/gi,'').slice(0,32)||'main';
    const fileName=`${visualSeed}/${safeView}.png`;
    if(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY){
      const existing=await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/public/housing-visuals/${fileName}`,{method:'HEAD'});
      if(existing.ok)return res.status(200).json({url:`${process.env.SUPABASE_URL}/storage/v1/object/public/housing-visuals/${fileName}`,cached:true});
    }
    const styleLock=`\n\nSTYLE LOCK — Haute Couture Live housing visuals: polished editorial illustration for a fashion-career life simulation game; same visual universe as elegant illustrated fashion character cards; clean hand-drawn linework, simplified but believable shapes, soft confident colors, warm natural light, refined lifestyle composition, aspirational but lived-in, never photorealistic, never 3D render, never childish, no text, no UI, no watermark. Keep the home believable for its city, price level and size. Do not make every apartment perfect; preserve realistic constraints and small imperfections.`;
    const finalPrompt=`${prompt}${styleLock}\nUnique listing seed: ${visualSeed}. View: ${safeView}. Listing metadata: ${JSON.stringify(metadata)}.`;
    const openai=await fetch('https://api.openai.com/v1/images/generations',{method:'POST',headers:{'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-2',prompt:finalPrompt,size:safeView==='thumbnail'?'1024x1024':'1536x1024',quality:process.env.OPENAI_IMAGE_QUALITY||'medium',n:1})});
    const json=await openai.json();
    if(!openai.ok)return res.status(openai.status).json({error:'openai_image_error',detail:json});
    const b64=json?.data?.[0]?.b64_json;
    if(!b64)return res.status(502).json({error:'image_payload_missing'});
    if(!(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY))return res.status(200).json({url:`data:image/png;base64,${b64}`,cached:false,temporary:true});
    const bytes=Buffer.from(b64,'base64');
    const up=await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/housing-visuals/${fileName}`,{method:'POST',headers:{'Authorization':`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,'apikey':process.env.SUPABASE_SERVICE_ROLE_KEY,'Content-Type':'image/png','x-upsert':'true'},body:bytes});
    if(!up.ok)return res.status(502).json({error:'storage_upload_failed',detail:await up.text()});
    const url=`${process.env.SUPABASE_URL}/storage/v1/object/public/housing-visuals/${fileName}`;
    return res.status(200).json({url,cached:false,listingId,visualSeed,view:safeView});
  }catch(err){return res.status(500).json({error:'generation_failed',detail:String(err?.message||err)})}
}
