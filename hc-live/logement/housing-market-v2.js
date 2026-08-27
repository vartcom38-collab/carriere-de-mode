/* Haute Couture Live — marché immobilier V2.
   Source unique pour la carte + la colonne : chaque secteur produit 6 biens
   persistants, uniques à l'échelle nationale et dotés d'un ADN immobilier stable. */
(function(){
'use strict';
if(window.HCHousingMarketV2)return;

const VERSION=2;
const KEY='haute-couture-housing-market-v2';
const COUNT=6;
const SECTOR=.0065;
const TYPES=[
  ['Studio lumineux',17,25,1.00],['Studio mansardé',14,23,.88],['T1 rénové',20,31,1.06],
  ['Deux-pièces créatif',28,43,1.18],['Petit loft',31,49,1.30],['Appartement ancien',25,45,1.12],
  ['Rez-de-chaussée atelier',25,41,1.04]
];
const ARCH=['ancien sobre','années 1930','années 1950','années 1970 revisité','contemporain chaleureux','atelier réhabilité','maison de ville divisée'];
const LIGHT=['plein sud','lumière traversante','lumière douce du matin','soleil de fin de journée','grandes ouvertures','lumière calme sur cour'];
const MATERIAL=['parquet miel','parquet ancien','tomettes','béton ciré clair','carrelage graphique discret','sol minéral clair','bois blond'];
const FEATURE=['alcôve','niche murale','grande fenêtre','petit balcon','coin bureau','poutres discrètes','hauteur sous plafond','verrière intérieure','mur en pierre claire'];
const MOOD=['chaleureux et vivant','minimal mais accueillant','créatif sans être chargé','ancien avec charme','solaire et doux','intime et élégant','simple avec beaucoup de potentiel'];

const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{"version":2,"sectors":{}}')}catch(e){return{version:2,sectors:{}}}};
const write=v=>{try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}};
function hash(s){let x=2166136261;for(const c of String(s)){x^=c.charCodeAt(0);x=Math.imul(x,16777619)}return x>>>0}
function rng(seed){return function(){let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function cityCode(){try{return String(st.cityCode||st.city||'france')}catch(e){return'france'}}
function cityName(){try{return String(st.city||'France')}catch(e){return'France'}}
function anchor(){try{return [Number(st.searchLat)||Number(st.cityLat)||46.6,Number(st.searchLng)||Number(st.cityLng)||2.2]}catch(e){return[46.6,2.2]}}
function sectorId(){const [lat,lng]=anchor();return `${cityCode()}|${Math.floor(lat/SECTOR)}|${Math.floor(lng/SECTOR)}`}
function moneyFactor(){try{return Number(D()?.rent||1)}catch(e){return 1}}
function pick(a,r){return a[Math.floor(r()*a.length)]}
function gameplay(x){const s=Number(x.surface||0),rooms=Number(x.rooms||1);const atelier=s>=38?5:s>=31?4:s>=24?3:s>=19?2:1;return{atelierCapacity:atelier,storageCapacity:Math.max(4,Math.round(s*.32)+(x.furnished?1:3)),canReceiveClients:rooms>=2&&s>=28,summary:atelier>=4?'Vrai potentiel d’atelier à domicile':atelier===3?'Coin couture confortable':atelier===2?'Coin couture compact':'Espace de travail très contraint'}}
function makeListing(sec,index){
  const [alat,alng]=anchor();
  const seed=hash(`FR|${sec}|${index}|HC-HOME-V2`),r=rng(seed),t=pick(TYPES,r);
  const surface=Math.round(t[1]+r()*(t[2]-t[1]));
  const rooms=surface>=29?2:1,floor=Math.floor(r()*6),balcony=r()>.62,elevator=floor>=3&&r()>.46,furnished=r()>.48;
  const architecture=pick(ARCH,r),light=pick(LIGHT,r),material=pick(MATERIAL,r),feature=balcony?'petit balcon':pick(FEATURE,r),mood=pick(MOOD,r);
  const lat=alat+(r()-.5)*.0075,lng=alng+(r()-.5)*.009;
  const price=Math.round((385+surface*13.8)*moneyFactor()*t[3]*(.90+r()*.22)/10)*10,charges=Math.round((35+r()*70)/5)*5;
  const signature=`${cityCode()}-${hash(`${sec}|${index}|${architecture}|${light}|${material}|${feature}`).toString(36)}`;
  const x={
    id:`hc-fr-${signature}`,listingId:`hc-fr-${signature}`,nationalUnique:true,marketVersion:VERSION,
    city:cityName(),cityCode:cityCode(),sector:sec,title:t[0],surface,rooms,price,charges,floor,balcony,elevator,furnished,
    dpe:pick(['C','D','D','E','E'],r),lat,lng,address:`${cityName()} · secteur résidentiel`,
    propertyDNA:{signature,architecture,light,material,feature,mood,layout:rooms===1?'pièce principale ouverte':'séjour + pièce séparée',paletteSeed:hash(signature+'palette').toString(36)},
    tags:[light,surface>34?'Vrai atelier possible':surface>25?'Coin couture confortable':'Coin couture compact',`${architecture} · ${material}`],
    potential:''
  };
  x.gameplay=gameplay(x);x.potential=`${x.gameplay.summary}. ${feature.charAt(0).toUpperCase()+feature.slice(1)} · ambiance ${mood}.`;
  return x;
}
function getSector(){
  const db=read(),sec=sectorId();db.sectors=db.sectors||{};
  if(!Array.isArray(db.sectors[sec])||db.sectors[sec].length!==COUNT){db.sectors[sec]=Array.from({length:COUNT},(_,i)=>makeListing(sec,i));write(db)}
  return db.sectors[sec].map(x=>({...x,gameplay:x.gameplay||gameplay(x)}));
}
function applyFilters(list){
  let a=list.slice();
  try{
    const rent=Number(document.getElementById('filterRent')?.value)||0,surf=Number(document.getElementById('filterSurface')?.value)||0,type=document.getElementById('filterType')?.value||'';
    if(rent)a=a.filter(x=>x.price<=rent);if(surf)a=a.filter(x=>x.surface>=surf);if(type)a=a.filter(x=>x.title===type);
  }catch(e){}
  return a;
}
function install(){
  try{if(typeof st==='undefined'||typeof drawListings!=='function'||typeof side!=='function')return false}catch(e){return false}
  stock=function(){return getSector()};
  filteredStock=function(){return applyFilters(getSector())};

  let bound=null,timer=null,rerendering=false;
  function bind(){
    try{
      if(!LIVE_MAP||st.level!=='listing'||LIVE_MAP===bound)return false;
      bound=LIVE_MAP;
      LIVE_MAP.on('moveend',()=>{
        if(rerendering||st.level!=='listing')return;
        clearTimeout(timer);timer=setTimeout(()=>{
          try{
            const c=LIVE_MAP.getCenter(),old=sectorId();
            st.searchLat=c.lat;st.searchLng=c.lng;
            if(sectorId()===old){side();return}
            rerendering=true;PENDING_VIEW={lat:c.lat,lng:c.lng,zoom:LIVE_MAP.getZoom()};
            save();render();setTimeout(()=>{rerendering=false;bound=null;bind()},120);
          }catch(e){rerendering=false}
        },260);
      });
      return true;
    }catch(e){return false}
  }
  setInterval(bind,350);
  window.HCHousingMarketV2={version:VERSION,getSector,sectorId,applyFilters,key:KEY};
  window.dispatchEvent(new CustomEvent('hc-housing-market-v2-ready',{detail:{version:VERSION}}));
  try{if(st.level==='listing'){side();refreshListingsOnMap()}}catch(e){}
  return true;
}
let tries=0;const poll=setInterval(()=>{tries++;if(install()||tries>180)clearInterval(poll)},60);
})();