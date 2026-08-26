/* Haute Couture Live — annonces immobilières réelles v3
   ChercherTrouver prioritaire : une annonce conserve sa galerie complète.
   Le stock d'une ville s'enrichit par pagination quand la joueuse explore de nouveaux secteurs de carte.
*/
(function(){
'use strict';
if(window.HCRealEstateLiveFeed?.version>=3)return;
const CACHE_KEY='haute-couture-real-listings-cache-v3';
const USED_KEY='haute-couture-real-listings-used-v1';
const ENDPOINT_KEY='haute-couture-real-estate-api-endpoint';
const DEFAULT_ENDPOINT='https://carriere-de-mode-visuals.vercel.app/api/real-estate-listings';
const CELL=.0042;
try{
  localStorage.removeItem('haute-couture-real-listings-cache-v1');
  localStorage.removeItem('haute-couture-real-listings-cache-v2');
  localStorage.removeItem('haute-couture-housing-spatial-market-v1');
  localStorage.removeItem('haute-couture-housing-gallery-assignments-v1');
}catch(e){}
const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v==null?f:v}catch(e){return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
function endpoint(){
 const stored=String(localStorage.getItem(ENDPOINT_KEY)||'').trim();
 if(stored&&/carriere-de-mode-visuals-vartcom38-7358s-projects\.vercel\.app/i.test(stored)){
   try{localStorage.removeItem(ENDPOINT_KEY)}catch(e){}
   return window.HC_REAL_ESTATE_API_ENDPOINT||DEFAULT_ENDPOINT;
 }
 return stored||window.HC_REAL_ESTATE_API_ENDPOINT||DEFAULT_ENDPOINT;
}
const cityKey=()=>{try{return String(st.cityCode||st.city||'').trim()}catch(e){return''}};
const cityName=()=>{try{return String(st.city||'').trim()}catch(e){return''}};
let loading=false,lastKey='',live=[],boundMap=null,mapTimer=null;
function cache(){return read(CACHE_KEY,{})}
function usage(){const u=read(USED_KEY,{properties:{},pictures:{}});u.properties=u.properties||{};u.pictures=u.pictures||{};return u}
function saveUsage(u){write(USED_KEY,u)}
function imgUrls(x){return (x.gallery||[]).map(p=>p?.url).filter(Boolean)}
function acceptUnique(x){const u=usage(),pid=String(x.realPropertyId||x.id),pics=imgUrls(x),territory=cityKey()||cityName();const assigned=u.properties[pid];if(assigned&&assigned!==territory)return false;for(const url of pics){const owner=u.pictures[url];if(owner&&owner!==pid)return false}u.properties[pid]=territory;pics.forEach(url=>u.pictures[url]=pid);saveUsage(u);return true}
function inferTitle(x){const source=String(x.title||''),desc=String(x.description||'').toLowerCase(),surface=Number(x.surface||0),rooms=Number(x.rooms||1);if(x.attic)return'Studio mansardé';if(x.loft)return surface>=30?'Petit loft':'Rez-de-chaussée atelier';if(x.old)return'Appartement ancien';if(rooms>=2)return'Deux-pièces créatif';if(/rénov|refait à neuf|renov/.test(desc))return'T1 rénové';if(/studio/i.test(source)||rooms===1)return'Studio lumineux';return source||'Appartement à louer'}
function gameplay(x){const surface=Number(x.surface||0),rooms=Number(x.rooms||1),balcony=!!x.balcony;const atelier=surface>=38?5:surface>=31?4:surface>=24?3:surface>=19?2:1,storage=Math.max(4,Math.round(surface*.32)+(x.storage?3:0)),receive=rooms>=2&&surface>=28;return{atelierCapacity:atelier,storageCapacity:storage,canReceiveClients:receive,homeWorkTimePercent:atelier>=4?-8:atelier===3?-4:atelier===2?3:8,inspirationBonus:balcony?2:surface>=32?1:0,privacy:rooms>=2?'bonne':'limitée',summary:atelier>=4?'Vrai potentiel d’atelier à domicile':atelier===3?'Coin couture confortable':atelier===2?'Coin couture compact':'Espace de travail très contraint'}}
function normalize(x){const g=(x.gallery||[]).filter(p=>p?.url),lat=Number(x.lat),lng=Number(x.lng),surface=Number(x.surface||0),price=Number(x.price||0),charges=Number(x.charges||0);const y={...x,id:x.id||('real-'+x.realPropertyId),realListing:true,originalListingTitle:x.title||'',title:inferTitle(x),surface,price,charges,rooms:Number(x.rooms||1),floor:Number(x.floor||0),balcony:!!x.balcony,elevator:!!x.elevator,furnished:!!x.furnished,dpe:x.dpe||'—',lat:Number.isFinite(lat)?lat:null,lng:Number.isFinite(lng)?lng:null,address:`${x.city||cityName()} · secteur de l’annonce`,tags:[x.attic?'Mansardé':x.old?'Charme ancien':x.loft?'Volume atelier':'Annonce réelle',x.openKitchen?'Cuisine ouverte':x.storage?'Rangements signalés':'Agencement à découvrir',x.furnished?'Meublé':'Non meublé'],potential:'',gallery:g};y.gameplay=gameplay(y);y.potential=`${y.gameplay.summary}. Rangement ${y.gameplay.storageCapacity}/20${y.gameplay.canReceiveClients?' · possibilité de recevoir une cliente sur rendez-vous':''}.`;y.visual=y.visual||{};y.visual.assets=y.visual.assets||{};if(g[0]?.url)y.visual.assets.mainImage=g[0].url;y.visual.mainImageSource='real-listing';y.visual.mainImageProvider=x.source||'cherchertrouver';return y}
function valid(x){return x&&Array.isArray(x.gallery)&&x.gallery.length>=2&&Number.isFinite(Number(x.lat))&&Number.isFinite(Number(x.lng))&&Number(x.price)>0&&Number(x.surface)>=8}
function bucket(key=cityKey()){const c=cache();if(!c[key])c[key]={at:0,provider:'cherchertrouver',listings:[],nextCursor:null,hasMore:true,exploredCells:{},pages:0};c[key].exploredCells=c[key].exploredCells||{};return{all:c,b:c[key]}}
function mergeUnique(base,next){const seen=new Set(base.map(x=>String(x.id))),out=[...base];for(const x of next){if(!x||seen.has(String(x.id)))continue;seen.add(String(x.id));out.push(x)}return out}
function query(cursor){const q=new URLSearchParams();q.set('city',cityName()||cityKey());q.set('limit','12');if(cursor)q.set('cursor',cursor);return q}
async function requestPage(cursor=null){const res=await fetch(endpoint()+'?'+query(cursor).toString(),{headers:{Accept:'application/json'}}),data=await res.json().catch(()=>({}));if(!res.ok||!data.ok){window.dispatchEvent(new CustomEvent('hc-real-estate-feed-status',{detail:{ok:false,configured:data.configured!==false,error:data.error||('http_'+res.status)}}));return null}return data}
function refreshFullMap(){try{if(st.level!=='listing')return;const c=LIVE_MAP?.getCenter?.(),z=LIVE_MAP?.getZoom?.();if(c)PENDING_VIEW={lat:c.lat,lng:c.lng,zoom:z};drawListings()}catch(e){try{side()}catch(_){}}}
function addFreshToMap(fresh){try{if(st.level==='listing'&&LIVE_MAP&&fresh.length&&typeof addListingMarkers==='function')addListingMarkers(LIVE_MAP,fresh)}catch(e){}}
function announceFresh(n){const note=document.getElementById('mapNote');if(note&&n>0)note.textContent=`${n} nouvelle${n>1?'s':''} annonce${n>1?'s':''} réelle${n>1?'s':''} découverte${n>1?'s':''} dans la ville. Continue à déplacer la carte pour voir d’autres opportunités.`}
async function fetchCity(force=false){const key=cityKey();if(!key||loading)return live;const {all,b}=bucket(key);if(!force&&b.listings.length&&Date.now()-Number(b.at||0)<30*60*1000){live=b.listings.map(normalize).filter(valid);lastKey=key;return live}loading=true;try{const data=await requestPage(null);if(!data)return live;const fresh=(data.listings||[]).map(normalize).filter(valid).filter(acceptUnique);b.at=Date.now();b.provider=data.provider||'cherchertrouver';b.listings=fresh;b.nextCursor=data.nextCursor||null;b.hasMore=Boolean(data.hasMore&&data.nextCursor);b.pages=1;all[key]=b;write(CACHE_KEY,all);live=fresh;lastKey=key;window.dispatchEvent(new CustomEvent('hc-real-estate-feed-status',{detail:{ok:true,count:live.length,provider:b.provider,hasMore:b.hasMore}}));try{side();refreshFullMap()}catch(e){}return live}catch(e){window.dispatchEvent(new CustomEvent('hc-real-estate-feed-status',{detail:{ok:false,error:String(e?.message||e)}}));return live}finally{loading=false}}
function cellId(){try{if(!LIVE_MAP)return'';const c=LIVE_MAP.getCenter();return `${Math.floor(c.lat/CELL)}:${Math.floor(c.lng/CELL)}`}catch(e){return''}}
async function fetchNextForMap(){const key=cityKey();if(!key||loading||st.level!=='listing')return[];const {all,b}=bucket(key),cell=cellId();if(!cell||b.exploredCells[cell])return[];b.exploredCells[cell]=Date.now();all[key]=b;write(CACHE_KEY,all);if(!b.listings.length){await fetchCity(false);return live}if(!b.hasMore||!b.nextCursor||Number(b.pages||0)>=12)return[];loading=true;try{const data=await requestPage(b.nextCursor);if(!data)return[];const existing=(b.listings||[]).map(normalize).filter(valid),fresh=(data.listings||[]).map(normalize).filter(valid).filter(acceptUnique).filter(x=>!existing.some(y=>String(y.id)===String(x.id)));b.listings=mergeUnique(existing,fresh);b.nextCursor=data.nextCursor||null;b.hasMore=Boolean(data.hasMore&&data.nextCursor);b.pages=Number(b.pages||0)+1;b.at=Date.now();all[key]=b;write(CACHE_KEY,all);live=b.listings;lastKey=key;if(fresh.length){try{side()}catch(e){}addFreshToMap(fresh);announceFresh(fresh.length)}window.dispatchEvent(new CustomEvent('hc-real-estate-feed-expanded',{detail:{city:cityName(),added:fresh.length,total:live.length,hasMore:b.hasMore,cell}}));return fresh}catch(e){return[]}finally{loading=false}}
function current(){const key=cityKey(),c=cache()[key];if(key!==lastKey&&c?.listings){live=c.listings.map(normalize).filter(valid);lastKey=key}return live}
function renderGallery(x){if(!x?.realListing)return;const main=document.getElementById('mainVisual'),thumbs=[...document.querySelectorAll('#detailModal .thumb')],pics=x.gallery||[];if(!main||!pics.length)return;function show(i){const p=pics[i];if(!p)return;main.className='';main.style.position='absolute';main.style.inset='0';main.innerHTML=`<img src="${p.url}" alt="Photo ${i+1} du logement" style="width:100%;height:100%;display:block;object-fit:cover">`}show(0);thumbs.forEach((th,i)=>{const p=pics[i]||null;if(!p){th.style.display='none';return}th.style.display='block';th.style.cursor='pointer';th.innerHTML=`<img src="${p.url}" alt="Photo ${i+1} du logement" style="width:100%;height:100%;display:block;object-fit:cover"><span>Photo ${i+1}</span>`;th.onclick=()=>show(i)});let info=document.getElementById('hcRealListingInfo');if(!info){info=document.createElement('div');info.id='hcRealListingInfo';info.className='about-card';document.getElementById('factsCard')?.insertAdjacentElement('afterend',info)}if(info){const flags=[x.balcony?'Balcon / terrasse signalé':null,x.attic?'Mansardé / sous-toit':null,x.openKitchen?'Cuisine ouverte / coin cuisine':null,x.storage?'Rangements signalés':null,x.old?'Caractère ancien':null,x.loft?'Volume loft / atelier':null].filter(Boolean);info.innerHTML=`<h3>ANNONCE RÉELLE · GALERIE DU MÊME BIEN</h3><div class="about-list">${flags.length?flags.map(t=>`<div>${t}</div>`).join(''):'<div>Les caractéristiques visibles viennent de cette annonce réelle.</div>'}<div>${pics.length} photo${pics.length>1?'s':''} appartenant toutes au même logement.</div></div>`}}
function ensureMapWatch(){try{if(!LIVE_MAP||LIVE_MAP===boundMap)return;boundMap=LIVE_MAP;LIVE_MAP.on('moveend',()=>{clearTimeout(mapTimer);mapTimer=setTimeout(fetchNextForMap,420)});setTimeout(fetchNextForMap,700)}catch(e){}}
function configure(url){if(url)localStorage.setItem(ENDPOINT_KEY,url);else localStorage.removeItem(ENDPOINT_KEY)}
function reset(){localStorage.removeItem(CACHE_KEY);live=[];lastKey=''}
function install(){let originalStock,originalOpen;try{if(typeof stock!=='function'||typeof openListingDetail!=='function'||typeof st==='undefined')return false;originalStock=stock;originalOpen=openListingDetail}catch(e){return false}
 stock=function(){const real=current();if(real.length)return real;return (originalStock.apply(this,arguments)||[]).filter(x=>!x?.spatial)};
 openListingDetail=function(){const out=originalOpen.apply(this,arguments);try{const x=stock().find(a=>String(a.id)===String(st.listing));if(x?.realListing)renderGallery(x)}catch(e){}return out};
 try{const oldDraw=drawListings;drawListings=function(){const r=oldDraw.apply(this,arguments);setTimeout(()=>{ensureMapWatch();fetchCity(false)},140);return r}}catch(e){}
 try{const oldSide=side;side=function(){const r=oldSide.apply(this,arguments);if(st.level==='listing')setTimeout(()=>fetchCity(false),100);return r}}catch(e){}
 setInterval(ensureMapWatch,650);setTimeout(()=>fetchCity(false),350);window.HCRealEstateLiveFeed={version:3,fetchCity,fetchNextForMap,current,configure,endpoint,reset,keys:{cache:CACHE_KEY,used:USED_KEY}};return true}
let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>180)clearInterval(timer)},60);
})();
