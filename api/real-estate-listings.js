const PROVIDER_URL='https://cherchertrouver.immo/api/v1/annonces';
function json(res,status,body){res.status(status).setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','s-maxage=900, stale-while-revalidate=3600');return res.end(JSON.stringify(body))}
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:null};
const arr=v=>Array.isArray(v)?v:[];
function apiKey(){let k=String(process.env.CHERCHERTROUVER_API_KEY||process.env.CHERCHER_TROUVER_API_KEY||'').trim();k=k.replace(/^X-Api-Key\s*:\s*/i,'').replace(/^Bearer\s+/i,'').trim();if((k.startsWith('"')&&k.endsWith('"'))||(k.startsWith("'")&&k.endsWith("'")))k=k.slice(1,-1).trim();return k}
function normalize(a){
 const pics=[...new Set(arr(a?.images).filter(x=>typeof x==='string'&&/^https?:\/\//i.test(x)))].slice(0,18);if(pics.length<2)return null;
 const title=String(a.title||''),description=String(a.description||''),text=`${title} ${description}`.toLowerCase(),surface=n(a.surface);
 if(/\b(garage|parking|box|cave|local commercial|bureau|entrep[oô]t|terrain)\b/.test(text))return null;
 if(surface!==null&&surface<8)return null;
 const balcony=/balcon|terrasse|loggia/.test(text),attic=/mansard|sous.?toit|combles|velux|pente/.test(text),loft=/loft|atelier|verrière|open.?space/.test(text),old=/parquet|moulure|cheminée|ancien|haussmann/.test(text),openKitchen=/cuisine ouverte|coin cuisine|kitchenette/.test(text),storage=Boolean(a.cellar)||/placard|dressing|rangement|cellier|penderie/.test(text);
 const stable=String(a.dedup_key||`${a.source||'source'}-${a.reference||'ref'}`),id='real-'+stable.replace(/[^a-zA-Z0-9_-]/g,'-');
 return {id,realPropertyId:stable,realAdvertId:String(a.reference||''),source:'cherchertrouver',sourcePublisher:a.seller_name||a.real_estate_network||a.source||null,sourceUrl:a.external_url||null,city:a.city||'',cityInsee:'',zipcode:a.postal_code||'',department:a.department||'',region:a.region||'',lat:n(a.latitude),lng:n(a.longitude),title:title||'Appartement à louer',surface,rooms:n(a.rooms)||1,bedrooms:n(a.bedrooms)||Math.max(0,(n(a.rooms)||1)-1),price:n(a.price),charges:0,deposit:n(a.price),floor:0,elevator:a.elevator===true,furnished:/meubl/i.test(text),dpe:a.dpe||null,balcony,attic,loft,old,openKitchen,storage,garden:a.garden===true,parking:a.parking===true,cellar:a.cellar===true,kitchen:a.kitchen||null,description,features:[a.kitchen,a.elevator===true?'ascenseur':null,a.garden===true?'jardin':null,a.parking===true?'parking':null,a.cellar===true?'cave':null].filter(Boolean),gallery:pics.map((url,i)=>({id:`${stable}-${i}`,url,order:i})),pictureCount:n(a.images_count)||pics.length,createdAt:a.published_at||null,updatedAt:a.updated_at||null,dedupKey:a.dedup_key||null,sources:arr(a.sources)};
}
export default async function handler(req,res){
 if(req.method!=='GET')return json(res,405,{ok:false,error:'method_not_allowed'});
 const key=apiKey();if(!key)return json(res,503,{ok:false,configured:false,provider:'cherchertrouver',error:'CHERCHERTROUVER_API_KEY_missing'});
 const city=String(req.query?.city||'').trim(),limit=Math.max(4,Math.min(30,Number(req.query?.limit)||20));if(!city)return json(res,400,{ok:false,error:'city_required'});
 const q=new URLSearchParams();q.set('transaction','location');q.set('ville',city);q.set('page_size',String(limit));q.set('sort','recent');
 const minSurface=n(req.query?.surfaceMin);if(minSurface)q.set('surface_min',String(minSurface));
 const maxPrice=n(req.query?.budgetMax);if(maxPrice)q.set('prix_max',String(maxPrice));
 try{const response=await fetch(`${PROVIDER_URL}?${q.toString()}`,{headers:{Accept:'application/json','X-Api-Key':key}});const data=await response.json().catch(()=>({}));if(!response.ok)return json(res,response.status,{ok:false,configured:true,provider:'cherchertrouver',error:data?.error||data?.message||`provider_${response.status}`,providerStatus:response.status,providerCode:data?.code||null});const listings=arr(data.items).map(normalize).filter(Boolean);return json(res,200,{ok:true,configured:true,provider:'cherchertrouver',city,count:listings.length,total:Number(data.total||listings.length),hasMore:Boolean(data.has_more),nextCursor:data.next_cursor||null,quota:{itemsLimit:n(response.headers.get('x-quota-items-limit')),itemsUsed:n(response.headers.get('x-quota-items-used')),requestsLimit:n(response.headers.get('x-quota-requests-limit')),requestsUsed:n(response.headers.get('x-quota-requests-used'))},listings});}catch(e){return json(res,502,{ok:false,configured:true,provider:'cherchertrouver',error:'provider_unreachable',message:String(e?.message||e)})}
}
