export default function handler(req,res){
  const magnificConfigured=Boolean(process.env.MAGNIFIC_API_KEY||process.env.MAGNIFIC_KEY);
  const streamEstateConfigured=Boolean(process.env.STREAM_ESTATE_API_KEY||process.env.STREAMESTATE_API_KEY);
  const casafariConfigured=Boolean(process.env.CASAFARI_API_TOKEN||process.env.CASAFARI_TOKEN||process.env.CASAFARI_API_KEY);
  const preferredRealEstateProvider=casafariConfigured?'casafari':(streamEstateConfigured?'stream-estate':'none');
  res.status(200).setHeader('Content-Type','application/json; charset=utf-8');
  return res.end(JSON.stringify({ok:true,service:'carriere-de-mode-visuals',build:'20260826-casafari1',magnificConfigured,casafariConfigured,streamEstateConfigured,preferredRealEstateProvider}));
}
