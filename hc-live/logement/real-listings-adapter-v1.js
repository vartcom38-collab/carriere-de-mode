/* Haute Couture Live — adaptateur annonces réelles ChercherTrouver v5.
   Fail-safe : le logement stable reste intact si l'API ne répond pas.
   Une annonce réelle = une galerie réelle du même bien, affichée selon la zone visible.
   Marché limité et tournant : peu d'annonces pertinentes, stock renouvelé dans le temps. */
(function(){
'use strict';
if(window.HCRealListingsAdapter)return;

const BUILD='20260827-real-safe5';
const ENDPOINT='https://carriere-de-mode-visuals.vercel.app/api/real-estate-listings';
const CACHE_KEY='haute-couture-real-listings-safe-v3';
const TTL=6*60*60*1000;
const TIMEOUT=5500;
const ROTATE_MS=12*60*60*1000;
const MAX_VISIBLE=6;
let installed=false,loading=false,currentCity='',real=[],boundMap=null,markerIds=new Set(),renderedMarketSignature='';

function readCache(){try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'{"cities":{}}')}catch(e){return{cities:{}}}}
function writeCache(v){try{localStorage.setItem(CACHE_KEY,JSON.stringify(v))}catch(e){}}
function cityName(){try{return String(st.city||'').trim()}catch(e){return''}}
function normalizeGallery(gallery){return (Array.isArray(gallery)?gallery:[]).map((g,i)=>typeof g==='string'?{url:g,order:i}:g).filter(g=>g&&/^https?:\/\//i.test(String(g.url||'')))}
function legacyShape(x){
  const gallery=normalizeGallery(x.gallery);if(gallery.length<2)return null;
  const surface=Number(x.surface)||0,price=Number(x.price)||0;if(!price||surface<8)return null;
  const tags=[];
  if(x.attic)tags.push('Sous les toits / mansardé');else if(x.loft)tags.push('Volumes type loft / atelier');else if(x.old)tags.push('Charme ancien');else tags.push('Annonce réelle');
  if(x.balcony||x.garden)tags.push(x.garden?'Extérieur / jardin':'Balcon / terrasse');else if(x.storage)tags.push('Rangements');else tags.push(surface>=28?'Espace confortable':'Format compact');
  tags.push(x.dpe?`DPE ${x.dpe}`:'Données du bien');
  return {...x,id:String(x.id||('real-'+Math.random())),realListing:true,title:String(x.title||'Appartement à louer'),surface,rooms:Number(x.rooms)||1,price,charges:Number(x.charges)||0,floor:Number(x.floor)||0,elevator:!!x.elevator,furnished:!!x.furnished,balcony:!!x.balcony,dpe:x.dpe||'—',lat:Number(x.lat),lng:Number(x.lng),address:x.address||`${x.city||cityName()} · annonce réelle`,tags,potential:surface>=34?'Très bon potentiel pour un espace couture à domicile.':surface>=24?'Un coin couture confortable peut être aménagé.':'Espace compact : organisation nécessaire pour travailler à domicile.',gallery,hero:gallery[0].url};
}
function dedupeListings(list){
  const propertySeen=new Set(),photoOwner=new Map(),out=[];
  for(const raw of list){
    const x=legacyShape(raw);if(!x)continue;
    const pid=String(x.realPropertyId||x.dedupKey||x.id);if(propertySeen.has(pid))continue;propertySeen.add(pid);
    const clean=[];
    for(const g of x.gallery){const u=String(g.url);const owner=photoOwner.get(u);if(owner&&owner!==pid)continue;photoOwner.set(u,pid);clean.push(g)}
    if(clean.length<2)continue;x.gallery=clean;x.hero=clean[0].url;out.push(x);
  }
  return out;
}
function validCoord(x){return Number.isFinite(x.lat)&&Number.isFinite(x.lng)}
function hash(s){let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function marketBucket(){return Math.floor(Date.now()/ROTATE_MS)}
function rank(x){return hash(`${cityName()}|${marketBucket()}|${x.realPropertyId||x.dedupKey||x.id}`)}
function cached(city){const db=readCache(),b=db.cities&&db.cities[city];if(!b||Date.now()-Number(b.savedAt||0)>TTL)return null;return Array.isArray(b.listings)?dedupeListings(b.listings):null}
function save(city,list){const db=readCache();db.cities=db.cities||{};db.cities[city]={savedAt:Date.now(),listings:list};writeCache(db)}
async function fetchCity(city){
  if(!city||loading)return[];const c=cached(city);if(c&&c.length){real=c;currentCity=city;return c}
  loading=true;const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),TIMEOUT);
  try{const u=new URL(ENDPOINT);u.searchParams.set('city',city);u.searchParams.set('limit','30');const r=await fetch(u.toString(),{headers:{Accept:'application/json'},signal:ctrl.signal,cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);const j=await r.json();const list=dedupeListings(Array.isArray(j.listings)?j.listings:[]);if(list.length){real=list;currentCity=city;save(city,j.listings)}return list}catch(e){console.warn('HC real listings unavailable; legacy housing preserved',e);return[]}finally{clearTimeout(timer);loading=false}
}
function visibleReal(){
  if(cityName()!==currentCity||!real.length)return[];
  let candidates=[];
  try{if(LIVE_MAP&&['city','district','listing'].includes(st.level)){const b=LIVE_MAP.getBounds().pad(.35);candidates=real.filter(x=>validCoord(x)&&b.contains([x.lat,x.lng]))}}catch(e){}
  if(!candidates.length)return[];
  candidates.sort((a,b)=>rank(a)-rank(b));
  let chosen=candidates.slice(0,MAX_VISIBLE);
  try{if(st.listing){const selected=candidates.find(x=>String(x.id)===String(st.listing));if(selected&&!chosen.some(x=>String(x.id)===String(selected.id)))chosen=[selected,...chosen.slice(0,MAX_VISIBLE-1)]}}catch(e){}
  return chosen;
}
function hasVisibleReal(){return visibleReal().length>0}
function mergedStock(original){return function(){const base=original.apply(this,arguments)||[],active=visibleReal();if(active.length)return active;return base}}
function ensureMarkerState(){try{if(LIVE_MAP&&LIVE_MAP!==boundMap){boundMap=LIVE_MAP;markerIds=new Set()}}catch(e){}}
function marketSignature(){const active=visibleReal();return active.length?'real:'+active.map(x=>String(x.id)).sort().join('|'):'fallback'}
function reconcileListingMap(force=false){
  try{
    if(!LIVE_MAP||typeof st==='undefined'||st.level!=='listing'||typeof refreshListingsOnMap!=='function')return false;
    const sig=marketSignature();
    if(!force&&sig===renderedMarketSignature)return false;
    renderedMarketSignature=sig;
    /* Important : refreshListingsOnMap reconstruit la carte Leaflet. Cela détruit les anciens
       marqueurs synthétiques au lieu de simplement poser les annonces réelles par-dessus. */
    refreshListingsOnMap();
    return true;
  }catch(e){console.warn('HC real map reconcile skipped',e);return false}
}
function addRealMarkers(){
  try{ensureMarkerState();if(!LIVE_MAP||typeof addListingMarkers!=='function')return;const list=visibleReal().filter(x=>!markerIds.has(String(x.id)));if(!list.length)return;addListingMarkers(LIVE_MAP,list);list.forEach(x=>markerIds.add(String(x.id)))}catch(e){console.warn('HC real marker add skipped',e)}
}
function cardHero(){
  const map=new Map(real.map(x=>[String(x.id),x]));document.querySelectorAll('.listing[data-id]').forEach(card=>{const x=map.get(String(card.dataset.id));if(!x||!x.hero)return;let slot=card.querySelector('.hc-visual-preview');if(!slot){const copy=document.createElement('div');copy.className='hc-visual-copy';while(card.firstChild)copy.appendChild(card.firstChild);slot=document.createElement('div');slot.className='hc-visual-preview';card.appendChild(slot);card.appendChild(copy);card.classList.add('hc-visual-card')}slot.innerHTML=`<img src="${x.hero}" alt="Photo réelle du logement" style="width:100%;height:100%;object-fit:cover;display:block">`})
}
function renderRealGallery(x){
  if(!x||!x.realListing||!x.gallery?.length)return;const main=document.getElementById('mainVisual'),holder=document.querySelector('#detailModal .thumbs');if(!main||!holder)return;
  const show=(url,i)=>{main.className='';main.style.position='absolute';main.style.inset='0';main.innerHTML=`<img src="${url}" alt="Photo ${i+1} du logement" style="width:100%;height:100%;object-fit:cover;display:block">`};show(x.gallery[0].url,0);
  holder.style.gridTemplateColumns='repeat(auto-fit,minmax(92px,1fr))';holder.innerHTML=x.gallery.map((g,i)=>`<button type="button" class="thumb hc-real-thumb" data-i="${i}" style="padding:0;cursor:pointer"><img src="${g.url}" alt="Photo ${i+1}" style="width:100%;height:100%;object-fit:cover;display:block"><span>Photo ${i+1}</span></button>`).join('');holder.querySelectorAll('.hc-real-thumb').forEach(btn=>btn.onclick=()=>{const i=Number(btn.dataset.i)||0;show(x.gallery[i].url,i)});
  document.querySelectorAll('.hc-real-listing-badge').forEach(n=>n.remove());const badge=document.createElement('div');badge.className='hc-real-listing-badge';badge.textContent=`ANNONCE RÉELLE · ${x.gallery.length} PHOTOS DU MÊME BIEN`;badge.style.cssText='margin-top:9px;font:900 9px Arial,sans-serif;letter-spacing:.08em;color:#438f8a';holder.insertAdjacentElement('afterend',badge)
}
function refreshUi(){
  const rebuilt=reconcileListingMap();
  if(!rebuilt){try{if(typeof side==='function')side()}catch(e){}}
  setTimeout(()=>{cardHero();if(!rebuilt)addRealMarkers()},80)
}
async function refreshCity(){const city=cityName();if(!city)return;const list=await fetchCity(city);if(list.length){renderedMarketSignature='';refreshUi()}}
function refreshViewport(){
  const rebuilt=reconcileListingMap();
  if(!rebuilt){try{if(typeof side==='function')side()}catch(e){}setTimeout(()=>{cardHero();addRealMarkers()},70)}
  else setTimeout(cardHero,70)
}
function install(){
  let originalStock,originalOpen;try{if(typeof stock!=='function'||typeof openListingDetail!=='function'||typeof st==='undefined')return false;originalStock=stock;originalOpen=openListingDetail}catch(e){return false}
  stock=mergedStock(originalStock);openListingDetail=function(){const r=originalOpen.apply(this,arguments);try{const x=real.find(v=>String(v.id)===String(st.listing));if(x)setTimeout(()=>renderRealGallery(x),0)}catch(e){}return r};
  let last='';setInterval(()=>{const city=cityName();if(city&&city!==last){last=city;renderedMarketSignature='';refreshCity()}ensureMarkerState()},700);
  const obs=new MutationObserver(()=>setTimeout(cardHero,30));obs.observe(document.getElementById('listings')||document.body,{childList:true,subtree:true});
  setInterval(()=>{try{if(LIVE_MAP&&!LIVE_MAP.__hcRealBound){LIVE_MAP.__hcRealBound=true;LIVE_MAP.on('moveend',refreshViewport);LIVE_MAP.on('zoomend',refreshViewport)}}catch(e){}},400);
  refreshCity();installed=true;window.HCRealListingsAdapter={build:BUILD,refreshCity,renderRealGallery,hasVisibleReal,reconcileListingMap,get listings(){return real.slice()},get visible(){return visibleReal().slice()},marketBucket};return true
}
let tries=0;const poll=setInterval(()=>{tries++;if(install()||tries>200)clearInterval(poll)},60);
})();