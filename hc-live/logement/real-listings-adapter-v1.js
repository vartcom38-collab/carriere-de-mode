/* Haute Couture Live — adaptateur annonces réelles ChercherTrouver v1.
   Couche additive et fail-safe : ne bloque jamais le logement stable.
   Une annonce réelle = une galerie réelle du même bien, sans catégories inventées. */
(function(){
'use strict';
if(window.HCRealListingsAdapter)return;

const BUILD='20260827-real-safe1';
const ENDPOINT='https://carriere-de-mode-visuals.vercel.app/api/real-estate-listings';
const CACHE_KEY='haute-couture-real-listings-safe-v1';
const TTL=6*60*60*1000;
const TIMEOUT=5500;
let installed=false,loading=false,currentCity='',real=[];

function readCache(){try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'{"cities":{}}')}catch(e){return{cities:{}}}}
function writeCache(v){try{localStorage.setItem(CACHE_KEY,JSON.stringify(v))}catch(e){}}
function cityName(){try{return String(st.city||'').trim()}catch(e){return''}}
function legacyShape(x){
  const gallery=(Array.isArray(x.gallery)?x.gallery:[]).map((g,i)=>typeof g==='string'?{url:g,order:i}:g).filter(g=>g&&/^https?:\/\//i.test(String(g.url||'')));
  if(gallery.length<2)return null;
  const title=String(x.title||'Appartement à louer');
  const surface=Number(x.surface)||0;
  const rooms=Number(x.rooms)||1;
  const price=Number(x.price)||0;
  if(!price||surface<8)return null;
  const tags=[];
  if(x.attic)tags.push('Sous les toits / mansardé');
  else if(x.loft)tags.push('Volumes type loft / atelier');
  else if(x.old)tags.push('Charme ancien');
  else tags.push('Annonce réelle');
  if(x.balcony||x.garden)tags.push(x.garden?'Extérieur / jardin':'Balcon / terrasse');
  else if(x.storage)tags.push('Rangements');
  else tags.push(surface>=28?'Espace confortable':'Format compact');
  tags.push(x.dpe?`DPE ${x.dpe}`:'Données du bien');
  return {
    ...x,
    id:String(x.id||('real-'+Math.random())),
    realListing:true,
    title,
    surface,
    rooms,
    price,
    charges:Number(x.charges)||0,
    floor:Number(x.floor)||0,
    elevator:!!x.elevator,
    furnished:!!x.furnished,
    balcony:!!x.balcony,
    dpe:x.dpe||'—',
    lat:Number(x.lat),lng:Number(x.lng),
    address:x.address||`${x.city||cityName()} · annonce réelle`,
    tags,
    potential:surface>=34?'Très bon potentiel pour un espace couture à domicile.':surface>=24?'Un coin couture confortable peut être aménagé.':'Espace compact : organisation nécessaire pour travailler à domicile.',
    gallery,
    hero:gallery[0].url
  };
}
function validCoord(x){return Number.isFinite(x.lat)&&Number.isFinite(x.lng)}
function cached(city){const db=readCache(),b=db.cities&&db.cities[city];if(!b||Date.now()-Number(b.savedAt||0)>TTL)return null;return Array.isArray(b.listings)?b.listings.map(legacyShape).filter(Boolean):null}
function save(city,list){const db=readCache();db.cities=db.cities||{};db.cities[city]={savedAt:Date.now(),listings:list};writeCache(db)}
async function fetchCity(city){
  if(!city||loading)return[];
  const c=cached(city);if(c&&c.length){real=c;currentCity=city;return c}
  loading=true;
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),TIMEOUT);
  try{
    const u=new URL(ENDPOINT);u.searchParams.set('city',city);u.searchParams.set('limit','24');
    const r=await fetch(u.toString(),{headers:{Accept:'application/json'},signal:ctrl.signal,cache:'no-store'});
    if(!r.ok)throw new Error('HTTP '+r.status);
    const j=await r.json();
    const list=(Array.isArray(j.listings)?j.listings:[]).map(legacyShape).filter(Boolean);
    if(list.length){real=list;currentCity=city;save(city,j.listings);}
    return list;
  }catch(e){console.warn('HC real listings unavailable; legacy housing preserved',e);return[]}
  finally{clearTimeout(timer);loading=false}
}
function mergedStock(original){
  return function(){
    const base=original.apply(this,arguments)||[];
    const active=cityName()===currentCity?real:[];
    if(!active.length)return base;
    const seen=new Set(),out=[];
    // Vraies annonces d'abord; le stock synthétique reste fallback et exploration.
    for(const x of [...active,...base]){if(!x||seen.has(String(x.id)))continue;seen.add(String(x.id));out.push(x)}
    return out;
  };
}
function addRealMarkers(){
  try{
    if(!LIVE_MAP||typeof addListingMarkers!=='function'||!real.length)return;
    const bounds=LIVE_MAP.getBounds().pad(.45);
    const list=real.filter(x=>validCoord(x)&&bounds.contains([x.lat,x.lng]));
    if(list.length)addListingMarkers(LIVE_MAP,list);
  }catch(e){console.warn('HC real marker add skipped',e)}
}
function cardHero(){
  if(!real.length)return;
  const map=new Map(real.map(x=>[String(x.id),x]));
  document.querySelectorAll('.listing[data-id]').forEach(card=>{
    const x=map.get(String(card.dataset.id));if(!x||!x.hero)return;
    let slot=card.querySelector('.hc-visual-preview');
    if(!slot){
      const copy=document.createElement('div');copy.className='hc-visual-copy';
      while(card.firstChild)copy.appendChild(card.firstChild);
      slot=document.createElement('div');slot.className='hc-visual-preview';
      card.appendChild(slot);card.appendChild(copy);card.classList.add('hc-visual-card');
    }
    slot.innerHTML=`<img src="${x.hero}" alt="Photo réelle du logement" style="width:100%;height:100%;object-fit:cover;display:block">`;
  });
}
function renderRealGallery(x){
  if(!x||!x.realListing||!x.gallery?.length)return;
  const main=document.getElementById('mainVisual');
  const holder=document.querySelector('#detailModal .thumbs');
  if(!main||!holder)return;
  const show=(url,i)=>{
    main.className='';main.style.position='absolute';main.style.inset='0';
    main.innerHTML=`<img src="${url}" alt="Photo ${i+1} du logement" style="width:100%;height:100%;object-fit:cover;display:block">`;
  };
  show(x.gallery[0].url,0);
  holder.style.gridTemplateColumns='repeat(auto-fit,minmax(92px,1fr))';
  holder.innerHTML=x.gallery.map((g,i)=>`<button type="button" class="thumb hc-real-thumb" data-i="${i}" style="padding:0;cursor:pointer"><img src="${g.url}" alt="Photo ${i+1}" style="width:100%;height:100%;object-fit:cover;display:block"><span>Photo ${i+1}</span></button>`).join('');
  holder.querySelectorAll('.hc-real-thumb').forEach(btn=>btn.onclick=()=>{const i=Number(btn.dataset.i)||0;show(x.gallery[i].url,i)});
  const badge=document.createElement('div');badge.className='hc-real-listing-badge';badge.textContent=`ANNONCE RÉELLE · ${x.gallery.length} PHOTOS DU MÊME BIEN`;
  badge.style.cssText='margin-top:9px;font:900 9px Arial,sans-serif;letter-spacing:.08em;color:#438f8a';
  holder.insertAdjacentElement('afterend',badge);
}
function refreshUi(){
  try{if(typeof side==='function')side()}catch(e){}
  setTimeout(()=>{cardHero();addRealMarkers()},80);
}
async function refreshCity(){
  const city=cityName();if(!city)return;
  const list=await fetchCity(city);if(list.length)refreshUi();
}
function install(){
  let originalStock,originalOpen;
  try{if(typeof stock!=='function'||typeof openListingDetail!=='function'||typeof st==='undefined')return false;originalStock=stock;originalOpen=openListingDetail}catch(e){return false}
  stock=mergedStock(originalStock);
  openListingDetail=function(){
    const r=originalOpen.apply(this,arguments);
    try{const x=stock().find(v=>String(v.id)===String(st.listing));if(x&&x.realListing)setTimeout(()=>renderRealGallery(x),0)}catch(e){}
    return r;
  };
  let last='';setInterval(()=>{const city=cityName();if(city&&city!==last){last=city;refreshCity()}},700);
  const obs=new MutationObserver(()=>setTimeout(cardHero,30));obs.observe(document.getElementById('listings')||document.body,{childList:true,subtree:true});
  try{if(LIVE_MAP){LIVE_MAP.on('moveend',()=>setTimeout(addRealMarkers,100));LIVE_MAP.on('zoomend',()=>setTimeout(addRealMarkers,100))}}catch(e){}
  refreshCity();
  installed=true;window.HCRealListingsAdapter={build:BUILD,refreshCity,renderRealGallery,get listings(){return real.slice()}};
  return true;
}
let tries=0;const poll=setInterval(()=>{tries++;if(install()||tries>200)clearInterval(poll)},60);
})();