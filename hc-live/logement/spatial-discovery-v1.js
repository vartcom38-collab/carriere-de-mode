/* Haute Couture Live — découverte immobilière spatiale, additive et sans photos.
   Objectif : en ville/quartier/annonces, déplacer la carte révèle des logements
   persistants dans les secteurs explorés, sans recréer la carte. */
(function(){
'use strict';
if(window.HCSpatialHousingDiscovery)return;

const KEY='haute-couture-housing-spatial-discovery-v1';
const CELL=.0042;
const TYPES=[
  ['Studio lumineux',17,25,1],
  ['Studio mansardé',14,22,.88],
  ['T1 rénové',20,30,1.05],
  ['Deux-pièces créatif',28,42,1.18],
  ['Petit loft',31,48,1.30],
  ['Appartement ancien',25,44,1.12],
  ['Rez-de-chaussée atelier',25,40,1.04]
];

const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{"version":1,"cities":{}}')}catch(e){return{version:1,cities:{}}}};
const write=v=>{try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){};
function hash(s){let x=2166136261;for(const c of String(s)){x^=c.charCodeAt(0);x=Math.imul(x,16777619)}return x>>>0}
function rng(seed){return function(){let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function cityId(){try{return String(st.cityCode||st.city||'ville')}catch(e){return'ville'}}
function rentMultiplier(){try{return Number(D()?.rent||1)}catch(e){return 1}}
function cellId(lat,lng){return `${Math.floor(Number(lat)/CELL)}:${Math.floor(Number(lng)/CELL)}`}
function cellCenter(key){const [a,b]=String(key).split(':').map(Number);return{lat:(a+.5)*CELL,lng:(b+.5)*CELL}}
function allowedLevel(){try{return ['city','district','listing'].includes(st.level)&&!!st.city}catch(e){return false}}
function realMarketActive(){
  try{return !!(window.HCRealListingsAdapter&&typeof window.HCRealListingsAdapter.hasVisibleReal==='function'&&window.HCRealListingsAdapter.hasVisibleReal())}catch(e){return false}
}

function bucket(db){
  const id=cityId();
  db.cities=db.cities||{};
  if(!db.cities[id])db.cities[id]={city:(typeof st!=='undefined'?st.city:''),cells:{}};
  return db.cities[id];
}
function makeListing(key,index){
  const seed=hash(cityId()+'|'+key+'|'+index),r=rng(seed),c=cellCenter(key),t=TYPES[Math.floor(r()*TYPES.length)];
  const surface=Math.round(t[1]+r()*(t[2]-t[1]));
  const price=Math.round((385+surface*13.8)*rentMultiplier()*t[3]*(.9+r()*.22)/10)*10;
  const charges=Math.round((35+r()*70)/5)*5;
  const rooms=surface>=28?2:1,floor=Math.floor(r()*6),balcony=r()>.57,elevator=floor>=3&&r()>.45,furnished=r()>.48,dpe=['C','D','D','E','E'][Math.floor(r()*5)];
  return {
    id:`spatial-${cityId()}-${key.replace(':','-')}-${index}`,
    spatial:true,cell:key,title:t[0],surface,price,charges,rooms,floor,balcony,elevator,furnished,dpe,
    lat:c.lat+(r()-.5)*CELL*.72,lng:c.lng+(r()-.5)*CELL*.72,
    address:(typeof st!=='undefined'&&st.city?st.city:'Ville')+' · secteur à explorer',
    tags:[['Très lumineux','Belle lumière','Lumière douce','Lumière traversante'][Math.floor(r()*4)],surface>34?'Vrai atelier possible':surface>25?'Coin couture confortable':'Coin couture compact',['Bon état','Charme ancien','Rénové récemment','Volumes atypiques'][Math.floor(r()*4)]],
    potential:surface>30?'Assez de place pour installer un vrai espace de création et une table de travail.':surface>21?'Un coin couture peut tenir confortablement.':'Compact : il faudra optimiser chaque mètre carré.'
  };
}
function discoverCell(key){
  const db=read(),b=bucket(db);b.cells=b.cells||{};
  if(b.cells[key])return[];
  const count=(hash(cityId()+'|'+key)%5===0)?2:1,list=[];
  for(let i=0;i<count;i++)list.push(makeListing(key,i));
  b.cells[key]={discoveredAt:new Date().toISOString(),listings:list};write(db);return list;
}
function discovered(){
  const db=read(),b=db.cities&&db.cities[cityId()];
  return b?Object.values(b.cells||{}).flatMap(x=>x.listings||[]):[];
}
function visibleCells(){
  try{
    if(!LIVE_MAP||!allowedLevel())return[];
    const c=LIVE_MAP.getCenter(),base=cellId(c.lat,c.lng),[a,b]=base.split(':').map(Number),keys=[];
    for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++)keys.push(`${a+y}:${b+x}`);
    return keys;
  }catch(e){return[]}
}
function inBounds(x){
  try{return !!LIVE_MAP&&LIVE_MAP.getBounds().pad(.35).contains([x.lat,x.lng])}catch(e){return true}
}
function addMarkers(list){
  try{
    if(realMarketActive())return;
    if(!LIVE_MAP||typeof addListingMarkers!=='function')return;
    const visible=list.filter(inBounds);
    if(visible.length)addListingMarkers(LIVE_MAP,visible);
  }catch(e){console.error('HC spatial markers',e)}
}
function discoverVisible(){
  if(realMarketActive())return[];
  if(!allowedLevel()||!LIVE_MAP)return[];
  const fresh=[];for(const key of visibleCells())fresh.push(...discoverCell(key));
  if(fresh.length){
    addMarkers(fresh);
    const note=document.getElementById('mapNote');
    if(note)note.textContent=`${fresh.length} nouvelle${fresh.length>1?'s':''} annonce${fresh.length>1?'s':''} découverte${fresh.length>1?'s':''} ici. Continue à déplacer la carte pour explorer d’autres secteurs.`;
  }
  return fresh;
}
function installMapWatch(){
  let bound=null,timer=null;
  function bind(){
    try{
      if(!LIVE_MAP||LIVE_MAP===bound)return false;
      bound=LIVE_MAP;
      const onMove=()=>{clearTimeout(timer);timer=setTimeout(discoverVisible,280)};
      LIVE_MAP.on('moveend',onMove);LIVE_MAP.on('zoomend',onMove);
      setTimeout(discoverVisible,350);return true;
    }catch(e){return false}
  }
  const id=setInterval(()=>bind(),250);
  setTimeout(()=>clearInterval(id),120000);
}
function install(){
  let originalStock;
  try{if(typeof stock!=='function'||typeof st==='undefined'||typeof addListingMarkers!=='function')return false;originalStock=stock}catch(e){return false}
  stock=function(){
    const base=originalStock.apply(this,arguments)||[];
    if(realMarketActive())return base;
    const extra=discovered(),seen=new Set(),all=[];
    for(const x of [...base,...extra]){if(!x||seen.has(String(x.id)))continue;seen.add(String(x.id));all.push(x)}
    return all;
  };
  installMapWatch();
  window.HCSpatialHousingDiscovery={version:2,discoverVisible,discoverCell,discovered,key:KEY,realMarketActive};
  return true;
}

let tries=0;const poll=setInterval(()=>{tries++;if(install()||tries>200)clearInterval(poll)},50);
})();

/* Charge la source d'annonces réelles en couche séparée. Un échec ne touche pas au moteur spatial. */
(function(){
  if(window.HCRealListingsAdapter||document.querySelector('script[data-hc-real-listings]'))return;
  const s=document.createElement('script');
  s.src='./real-listings-adapter-v1.js?v=20260827-real-safe5';
  s.async=true;s.dataset.hcRealListings='1';
  s.onerror=()=>console.warn('HC real listings adapter unavailable; spatial fallback kept');
  document.head.appendChild(s);
})();