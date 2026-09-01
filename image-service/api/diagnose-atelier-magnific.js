export const config={maxDuration:60};

export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  if(req.method!=='GET')return res.status(405).json({ok:false,error:'method_not_allowed'});
  const key=process.env.MAGNIFIC_API_KEY;
  if(!key)return res.status(503).json({ok:false,stage:'env',error:'MAGNIFIC_API_KEY_missing'});
  const headers={'Content-Type':'application/json','Accept':'application/json','x-magnific-api-key':key};
  const prompt='Professional fashion designer croquis, elongated full-body figure, graphite and ink sketch on ivory paper, elegant simple satin dress, no photo, no 3D, no text.';
  try{
    const r=await fetch('https://api.magnific.com/v1/ai/text-to-image',{method:'POST',headers,body:JSON.stringify({prompt,negative_prompt:'photo, 3d, text, watermark',guidance_scale:2,seed:12345,num_images:1,styling:{effects:{framing:'portrait'}},filter_nsfw:true})});
    const text=await r.text();
    let body={};try{body=JSON.parse(text)}catch(_){body={raw:text.slice(0,800)}}
    const data=Array.isArray(body?.data)?body.data:[];
    return res.status(r.ok?200:502).json({ok:r.ok,stage:'classic-fast',upstreamStatus:r.status,hasDataArray:Array.isArray(body?.data),dataLength:data.length,firstKeys:data[0]?Object.keys(data[0]).slice(0,20):[],hasBase64:!!data[0]?.base64,hasUrl:!!data[0]?.url,bodyPreview:r.ok?undefined:JSON.stringify(body).slice(0,1200)});
  }catch(err){return res.status(500).json({ok:false,stage:'network',error:String(err?.message||err)})}
}
