export default function handler(req,res){res.status(200).json({ok:true,service:'carriere-de-mode-visuals',provider:'magnific',magnificConfigured:!!process.env.MAGNIFIC_API_KEY})}
