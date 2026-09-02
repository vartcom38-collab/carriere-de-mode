export const config={maxDuration:60};

export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  if(req.method!=='GET')return res.status(405).json({ok:false,error:'method_not_allowed'});
  const key=process.env.MAGNIFIC_API_KEY||process.env.MAGNIFIC_KEY;
  if(!key)return res.status(503).json({ok:false,stage:'env',error:'MAGNIFIC_API_KEY_or_MAGNIFIC_KEY_missing'});
  const headers={'Content-Type':'application/json','Accept':'application/json','x-magnific-api-key':key};
  const prompt='Professional fashion designer croquis, elongated full-body figure, graphite and ink sketch on ivory paper, elegant simple satin dress, no photo, no 3D, no text.';
  try{
    const r=await fetch('https://api.magnific.com/v1/ai/text-to-image',{method:'POST',headers,body:JSON.stringify({prompt,negative_prompt:'photo, 3d, text, watermark',guidance_scale:2,seed:12345,num_images:1,image:{size:'square_1_1'},filter_nsfw:true})});
    const text=await r.text();
    let body={};try{body=JSON.parse(text)}catch(_){body={raw:text.slice(0,800)}}
    const data=Array.isArray(body?.data)?body.data:[];
    const base64Chars=String(data[0]?.base64||'').length;
    return res.status(r.ok?200:502).json({ok:r.ok,stage:'classic-fast',keySource:process.env.MAGNIFIC_API_KEY?'MAGNIFIC_API_KEY':'MAGNIFIC_KEY',upstreamStatus:r.status,hasDataArray:Array.isArray(body?.data),dataLength:data.length,firstKeys:data[0]?Object.keys(data[0]).slice(0,20):[],hasBase64:!!data[0]?.base64,hasUrl:!!data[0]?.url,base64Chars,base64ApproxMiB:Number((base64Chars/1024/1024).toFixed(2)),bodyPreview:r.ok?undefined:JSON.stringify(body).slice(0,1200)});
  }catch(err){return res.status(500).json({ok:false,stage:'network',error:String(err?.message||err)})}
}
