const MAGNIFIC_BASE='https://api.magnific.com/v1/ai/text-to-image/imagen4-fast';

function cors(req,res){
  res.setHeader('Access-Control-Allow-Origin','https://vartcom38-collab.github.io');
  res.setHeader('Vary','Origin');
  res.setHeader('Access-Control-Allow-Methods','GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS'){
    res.status(204).end();
    return true;
  }
  return false;
}

function magnificKey(){
  return process.env.MAGNIFIC_API_KEY||process.env['CLÉ_API_MAGNIFIC']||process.env.CLE_API_MAGNIFIC||'';
}

export default async function handler(req,res){
  if(cors(req,res))return;
  if(req.method!=='GET')return res.status(405).json({error:'method_not_allowed'});

  const apiKey=magnificKey();
  if(!apiKey)return res.status(503).json({error:'magnific_not_configured'});

  const taskId=String(req.query?.taskId||'').trim();
  if(!taskId)return res.status(400).json({error:'task_id_required'});

  try{
    const poll=await fetch(`${MAGNIFIC_BASE}/${encodeURIComponent(taskId)}`,{
      headers:{'Accept':'application/json','x-magnific-api-key':apiKey}
    });
    const status=await poll.json().catch(()=>({}));
    if(!poll.ok)return res.status(poll.status).json({error:'magnific_status_failed',details:status});

    const state=status?.data?.status||status?.status||'UNKNOWN';
    const generated=status?.data?.generated||status?.generated||[];

    if(state==='COMPLETED'){
      const first=generated[0];
      const url=typeof first==='string'?first:(first?.url||first?.image_url||first?.publicUrl);
      if(!url)return res.status(502).json({error:'magnific_missing_output',taskId,state});
      return res.status(200).json({success:true,provider:'magnific',taskId,status:'COMPLETED',publicUrl:url});
    }

    if(state==='FAILED')return res.status(502).json({error:'magnific_generation_failed',taskId,status:'FAILED'});

    return res.status(200).json({success:true,provider:'magnific',taskId,status:state||'IN_PROGRESS'});
  }catch(error){
    return res.status(500).json({error:'visual_status_backend_error',message:error?.message||String(error)});
  }
}
