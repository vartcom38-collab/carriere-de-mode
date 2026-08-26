/* Haute Couture Live — real estate live feed proxy v1
   Server-side only: keeps provider API key private, normalizes real French rental listings,
   preserves one coherent gallery per property and exposes stable property/ad ids to the game.
*/
const PROVIDER_URL='https://api.stream.estate/documents/properties';

function json(res,status,body){res.status(status).setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','s-maxage=900, stale-while-revalidate=3600');return res.end(JSON.stringify(body))}
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:null};
const arr=v=>Array.isArray(v)?v:[];
const cleanPictures=v=>[...new Set(arr(v).filter(x=>typeof x==='string'&&/^https?:\/\//i.test(x)))].slice(0,18);
function bestAdvert(p){const ads=arr(p.adverts).filter(a=>!a?.expired);const withPics=ads.filter(a=>cleanPictures(a?.pictures).length>=2);return (withPics[0]||ads[0]||arr(p.adverts)[0]||{});}
function featureText(p,a){return [...arr(p.features),...arr(a.features),p.description,a.description].filter(Boolean).join(' ').toLowerCase()}
function normalize(p){
  const a=bestAdvert(p),city=p.city||{},loc=p.locations||city.locations||{},pics=cleanPictures(a.pictures?.length?a.pictures:p.pictures);
  if(pics.length<2)return null;
  const text=featureText(p,a),surface=n(a.surface)??n(p.surface),rooms=n(a.room)??n(p.room),bedrooms=n(p.bedroom),price=n(a.price)??n(p.price),charges=n(a.rentalCharges)??0,pledge=n(a.rentalPledge)??price;
  const balcony=/balcon|terrasse|loggia|extérieur|jardin/.test(text),attic=/mansard|sous.?toit|combles|velux|pente/.test(text),loft=/loft|atelier|verrière|open.?space/.test(text),old=/parquet|moulure|cheminée|ancien|haussmann/.test(text),openKitchen=/cuisine ouverte|coin cuisine|kitchenette/.test(text),storage=/placard|dressing|rangement|cellier|penderie/.test(text);
  return {
    id:'real-'+String(p.uuid||p['@id']||a.uuid||'').replace(/[^a-zA-Z0-9_-]/g,'-'),
    realPropertyId:String(p.uuid||p['@id']||''),realAdvertId:String(a.uuid||''),source:'stream-estate',sourcePublisher:a.publisher?.name||null,sourceUrl:a.url||null,
    city:city.name||city.originalName||'',cityInsee:city.insee||'',zipcode:city.zipcode||'',department:city.department?.name||'',region:city.region?.name||'',
    lat:n(loc.lat),lng:n(loc.lon),title:a.title||p.title||'Appartement à louer',surface,rooms:rooms||1,bedrooms:bedrooms||Math.max(0,(rooms||1)-1),price,charges,deposit:pledge,
    floor:n(a.floor)??n(p.floor)??0,elevator:Boolean(a.elevator??p.elevator),furnished:Boolean(a.furnished??p.furnished),dpe:a.energy?.category||p.energy?.category||null,
    balcony,attic,loft,old,openKitchen,storage,
    description:a.description||p.description||'',features:[...new Set([...arr(a.features),...arr(p.features)])],
    gallery:pics.map((url,i)=>({id:`${String(p.uuid||a.uuid||'property')}-${i}`,url,order:i})),
    pictureCount:pics.length,createdAt:a.createdAt||p.createdAt||null,updatedAt:a.updatedAt||p.updatedAt||null
  };
}

export default async function handler(req,res){
  if(req.method!=='GET')return json(res,405,{ok:false,error:'method_not_allowed'});
  const key=process.env.STREAM_ESTATE_API_KEY||process.env.STREAMESTATE_API_KEY;
  if(!key)return json(res,503,{ok:false,configured:false,provider:'stream-estate',error:'STREAM_ESTATE_API_KEY_missing'});
  const insee=String(req.query?.insee||'').trim(),city=String(req.query?.city||'').trim(),limit=Math.max(4,Math.min(30,Number(req.query?.limit)||20));
  if(!insee&&!city)return json(res,400,{ok:false,error:'insee_or_city_required'});
  const q=new URLSearchParams();q.set('transactionType','1');q.set('withCoherentPrice','true');q.set('withLocation','true');q.set('itemsPerPage',String(limit));q.set('order[createdAt]','desc');
  if(insee)q.append('includedInseeCodes[]',insee);
  const minSurface=n(req.query?.surfaceMin);if(minSurface)q.set('surfaceMin',String(minSurface));
  const maxPrice=n(req.query?.budgetMax);if(maxPrice)q.set('budgetMax',String(maxPrice));
  try{
    const response=await fetch(`${PROVIDER_URL}?${q.toString()}`,{headers:{Accept:'application/json','X-API-KEY':key}});
    const data=await response.json().catch(()=>({}));
    if(!response.ok)return json(res,response.status,{ok:false,configured:true,provider:'stream-estate',error:data?.message||data?.error||`provider_${response.status}`});
    let listings=arr(data['hydra:member']).map(normalize).filter(Boolean);
    if(city&&!insee){const target=city.toLowerCase();listings=listings.filter(x=>String(x.city||'').toLowerCase().includes(target));}
    return json(res,200,{ok:true,configured:true,provider:'stream-estate',insee:insee||null,city:city||null,count:listings.length,total:Number(data['hydra:totalItems']||listings.length),listings});
  }catch(e){return json(res,502,{ok:false,configured:true,provider:'stream-estate',error:'provider_unreachable',message:String(e?.message||e)});}
}
