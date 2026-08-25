/* Haute Couture Live — Studio Lumière Vercel/Magnific bridge v2.
   Intercepte uniquement l'ancien endpoint Supabase du Studio et le redirige vers Vercel.
*/
(function(){
'use strict';
if(window.__HC_STUDIO_VERCEL_BRIDGE__)return;
window.__HC_STUDIO_VERCEL_BRIDGE__=true;

const OLD='https://pmsowlrsbyczjjwzuzsr.supabase.co/functions/v1/hc-generate-listing-visual';
const BASE='https://carriere-de-mode-visuals-vartcom38-7358s-projects.vercel.app';
const GENERATE=BASE+'/api/generate-listing-visual';
const CHECK=BASE+'/api/check-listing-visual';
const nativeFetch=window.fetch.bind(window);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

function jsonResponse(data,status=200){
  return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
}

async function waitForTask(taskId){
  const started=Date.now();
  while(Date.now()-started<180000){
    await sleep(1800);
    let r;
    try{
      r=await nativeFetch(CHECK+'?taskId='+encodeURIComponent(taskId),{method:'GET',headers:{Accept:'application/json'}});
    }catch(error){
      return jsonResponse({success:false,error:'vercel_poll_network_error: '+(error?.message||String(error))},500);
    }
    const d=await r.json().catch(()=>({}));
    if(!r.ok)return jsonResponse({success:false,error:d.error||('vercel_poll_http_'+r.status),message:d.message||'',details:d.details||null},r.status);
    if(d.publicUrl)return jsonResponse({success:true,provider:'magnific',taskId,publicUrl:d.publicUrl,cached:false},200);
    if(d.status==='FAILED')return jsonResponse({success:false,error:'magnific_generation_failed'},502);
  }
  return jsonResponse({success:false,error:'magnific_generation_timeout'},504);
}

window.fetch=async function(input,init){
  const url=typeof input==='string'?input:input?.url;
  if(url!==OLD)return nativeFetch(input,init);
  try{
    const r=await nativeFetch(GENERATE,init);
    const d=await r.json().catch(()=>({}));
    if(!r.ok)return jsonResponse({success:false,error:d.error||('vercel_generate_http_'+r.status),message:d.message||'',details:d.details||null},r.status);
    if(d.publicUrl)return jsonResponse(d,200);
    if(d.taskId)return waitForTask(d.taskId);
    return jsonResponse({success:false,error:'magnific_missing_output',details:d},502);
  }catch(error){
    return jsonResponse({success:false,error:'vercel_bridge_error: '+(error?.message||String(error))},500);
  }
};
})();
