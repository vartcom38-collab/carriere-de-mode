export default function handler(req,res){
  const magnificConfigured=Boolean(process.env.MAGNIFIC_API_KEY||process.env.MAGNIFIC_KEY);
  const streamEstateConfigured=Boolean(process.env.STREAM_ESTATE_API_KEY||process.env.STREAMESTATE_API_KEY);
  res.status(200).setHeader('Content-Type','application/json; charset=utf-8');
  return res.end(JSON.stringify({ok:true,service:'carriere-de-mode-visuals',magnificConfigured,streamEstateConfigured}));
}
