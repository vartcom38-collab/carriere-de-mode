function magnificKey(){return process.env.MAGNIFIC_API_KEY||process.env['CLÉ_API_MAGNIFIC']||process.env.CLE_API_MAGNIFIC||''}
export default function handler(req,res){res.status(200).json({ok:true,service:'carriere-de-mode-visuals',provider:'magnific',magnificConfigured:!!magnificKey()})}
