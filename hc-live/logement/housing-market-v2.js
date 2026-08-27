/* Haute Couture Live — marché immobilier V2.1.
   La carte est l'unique navigateur des annonces : un marqueur = un bien = une fiche.
   Les biens restent persistants, uniques à l'échelle nationale et dotés d'un ADN stable. */
(function(){
'use strict';
if(window.HCHousingMarketV2)return;

const VERSION='2.1';
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
function imageFor(x){
  try{
    if(!window.HCVisualDNA)return null;
    const v=window.HCVisualDNA.hydrate(x,{city:x.city||cityName(),region:st.region||''});
    if(v?.assets?.mainImage)return v.assets.mainImage;
    const c=window.HCVisualService?.getCached?.(v.visualSeed,'main');
    return c?.url||null;
  }catch(e){return null}
}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function previewHtml(x){
  const img=imageFor(x),total=Number(x.price||0)+Number(x.charges||0),feature=x.propertyDNA?.feature||x.tags?.[1]||'';
  return `<div class="hc-map-preview">${img?`<img src="${esc(img)}" alt="Photo du logement">`:'<div class="hc-map-preview-wait">PHOTO DU LOGEMENT</div>'}<div class="hc-map-preview-copy"><b>${esc(x.title)}</b><span>${esc(x.surface)} m² · ${esc(total)} €/mois CC</span><small>${esc(feature)} · cliquer pour ouvrir</small></div></div>`;
}
function installStyles(){
  if(document.getElementById('hc-map-only-housing-css'))return;
  const s=document.createElement('style');s.id='hc-map-only-housing-css';s.textContent=`
    .main{grid-template-columns:minmax(0,1fr)!important;max-width:1720px!important}
    .book{display:none!important}
    .workspace{grid-template-columns:minmax(560px,1.5fr) minmax(270px,.42fr)!important}
    .mapbox{min-height:720px!important}.live-map{min-height:600px!important}
    .leaflet-tooltip.hc-listing-preview-tip{padding:0!important;border:0!important;background:transparent!important;box-shadow:0 18px 40px rgba(55,35,25,.22)!important;border-radius:16px!important}
    .leaflet-tooltip.hc-listing-preview-tip:before{display:none!important}
    .hc-map-preview{width:275px;overflow:hidden;border:1px solid #e6d4c8;border-radius:16px;background:#fffaf3;color:#111}
    .hc-map-preview img,.hc-map-preview-wait{width:100%;height:135px;display:block;object-fit:cover;background:linear-gradient(135deg,#f7eadc,#e4c9b6 52%,#cad6c4)}
    .hc-map-preview-wait{display:grid;place-items:center;font:900 9px Arial,sans-serif;letter-spacing:.12em;color:#765e52}
    .hc-map-preview-copy{padding:11px 12px 12px;display:grid;gap:4px}.hc-map-preview-copy b{font:19px Georgia,serif}.hc-map-preview-copy span{font:800 11px Arial,sans-serif}.hc-map-preview-copy small{font:italic 11px Georgia,serif;color:#7c6257}
    @media(max-width:900px){.workspace{grid-template-columns:1fr!important}.picker{order:2}.mapbox{min-height:650px!important}}
  `;document.head.appendChild(s);
}
function openExact(id){
  const x=getSector().find(v=>String(v.id)===String(id));if(!x)return false;
  st.listing=String(x.id);save();
  try{openListingDetail(String(x.id))}catch(e){try{openListingDetail()}catch(_){} }
  return true;
}
function install(){
  try{if(typeof st==='undefined'||typeof drawListings!=='function'||typeof side!=='function'||typeof addListingMarkers!=='function'||typeof openListingDetail!=='function')return false}catch(e){return false}
  installStyles();
  stock=function(){return getSector()};
  filteredStock=function(){return applyFilters(getSector())};

  const originalOpen=openListingDetail;
  openListingDetail=function(id){
    if(id!=null){const x=getSector().find(v=>String(v.id)===String(id));if(!x)return;st.listing=String(x.id);save()}
    return originalOpen.call(this);
  };
  selectListing=function(id,open=false){
    const x=getSector().find(v=>String(v.id)===String(id));if(!x)return;
    st.listing=String(x.id);save();
    if(open)openListingDetail(String(x.id));
  };
  addListingMarkers=function(m,a){
    (Array.isArray(a)?a:[]).forEach(x=>{
      const ic=L.divIcon({className:'',html:`<div class="home-pin">${Number(x.price)||0} €</div>`,iconSize:[70,28],iconAnchor:[35,14]});
      const mk=L.marker([x.lat,x.lng],{icon:ic}).addTo(m);
      mk.bindTooltip(previewHtml(x),{className:'hc-listing-preview-tip',direction:'top',offset:[0,-12],opacity:1});
      mk.on('mouseover',()=>{try{mk.setTooltipContent(previewHtml(x))}catch(e){}});
      mk.on('click',()=>openExact(x.id));
    });
  };
  drawListings=function(){
    const m=baseMap(),a=filteredStock();addListingMarkers(m,a);applyView(m,()=>{const ar=anchor();m.setView([ar[0],ar[1]],15)});
    el('mapTitle').textContent=st.city.toUpperCase()+' — LOGEMENTS';
    el('mapNote').textContent=a.length?`${a.length} logement${a.length>1?'s':''} dans cette zone. Survole un prix pour voir l’aperçu, clique pour ouvrir la fiche.`:'Aucun logement ne correspond à ces filtres.';
  };
  side=function(){
    const d=D();el('place').textContent=st.city||st.dep||st.region||'À toi de choisir';el('vibe').textContent=st.region?d.vibe:'Une nouvelle vie commence ici ♡';el('budget').textContent=st.region?d.budget:'—';el('pace').textContent=st.region?d.pace:'—';el('opp').textContent=st.region?d.opp:'—';el('creative').textContent=st.region?d.creative:'—';el('topBudget').textContent=money(START_BUDGET);el('bookBudget').textContent=money(START_BUDGET);el('listings').innerHTML='';el('next').disabled=true;updateFilterCount();
  };

  let bound=null,timer=null,rerendering=false;
  function bind(){
    try{
      if(!LIVE_MAP||st.level!=='listing'||LIVE_MAP===bound)return false;
      bound=LIVE_MAP;
      LIVE_MAP.on('moveend',()=>{
        if(rerendering||st.level!=='listing')return;
        clearTimeout(timer);timer=setTimeout(()=>{
          try{
            const c=LIVE_MAP.getCenter(),old=sectorId();st.searchLat=c.lat;st.searchLng=c.lng;
            if(sectorId()===old)return;
            rerendering=true;PENDING_VIEW={lat:c.lat,lng:c.lng,zoom:LIVE_MAP.getZoom()};save();render();setTimeout(()=>{rerendering=false;bound=null;bind()},120);
          }catch(e){rerendering=false}
        },260);
      });return true;
    }catch(e){return false}
  }
  setInterval(bind,350);
  window.HCHousingMarketV2={version:VERSION,getSector,sectorId,applyFilters,openExact,previewHtml,key:KEY};
  window.dispatchEvent(new CustomEvent('hc-housing-market-v2-ready',{detail:{version:VERSION}}));
  try{if(st.level==='listing'){side();refreshListingsOnMap()}}catch(e){}
  return true;
}
let tries=0;const poll=setInterval(()=>{tries++;if(install()||tries>180)clearInterval(poll)},60);
})();