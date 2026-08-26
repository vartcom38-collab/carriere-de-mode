/* Haute Couture Live — logement racine : vraies annonces + exploration spatiale persistante. */
(function(){
'use strict';
if(window.HCVisualEngine?.mode==='direct-real-spatial-listings')return;
const BUILD='20260826-root-real-housing3';
const ENDPOINT='https://carriere-de-mode-visuals.vercel.app/api/real-estate-listings';
const CACHE='haute-couture-root-real-housing-v3';
const CELL=.0038;
let installed=false,loading=false,real=[],lastCity='',nextCursor=null,hasMore=true,pages=0,boundMap=null,mapTimer=null;

function read(){try{return JSON.parse(localStorage.getItem(CACHE)||'{}')||{}}catch(e){return{}}}
function write(v){try{localStorage.setItem(CACHE,JSON.stringify(v))}catch(e){}}
function purge(){
  try{
    ['haute-couture-housing-spatial-market-v1','haute-couture-housing-gallery-assignments-v1','haute-couture-real-listings-cache-v1','haute-couture-real-listings-cache-v2','haute-couture-real-listings-cache-v3'].forEach(k=>localStorage.removeItem(k));
    localStorage.setItem('haute-couture-real-estate-api-endpoint',ENDPOINT);
  }catch(e){}
}
function city(){try{return String(st.city||'').trim()}catch(e){return''}}
function cityCode(){try{return String(st.cityCode||'').trim()}catch(e){return''}}
function num(v,d=0){v=Number(v);return Number.isFinite(v)?v:d}
function normalize(x,i){
  const gallery=(Array.isArray(x.gallery)?x.gallery:Array.isArray(x.images)?x.images.map(url=>({url})):[]).map(p=>typeof p==='string'?{url:p}:p).filter(p=>p&&p.url);
  const surface=num(x.surface||x.surface_m2||x.area,0),rooms=num(x.rooms||x.pieces||1,1),price=num(x.price||x.rent||x.loyer,0),charges=num(x.charges,0);
  const lat=num(x.lat||x.latitude,NaN),lng=num(x.lng||x.longitude,NaN);
  return {...x,id:String(x.id||x.dedup_key||x.realPropertyId||('real-'+i)),realListing:true,title:x.title||x.type||(rooms>=2?'Deux-pièces':'Studio'),surface,rooms,price,charges,floor:num(x.floor,0),balcony:!!x.balcony,elevator:!!x.elevator,furnished:!!x.furnished,dpe:x.dpe||'—',lat:Number.isFinite(lat)?lat:null,lng:Number.isFinite(lng)?lng:null,address:x.address||`${city()} · secteur de l’annonce`,tags:Array.isArray(x.tags)&&x.tags.length>=3?x.tags:['Annonce réelle',rooms>=2?'Pièces séparées':'Agencement à découvrir',x.furnished?'Meublé':'Non meublé'],potential:x.potential||(surface>=30?'Bon potentiel pour un coin atelier.':surface>=20?'Coin couture possible.':'Espace couture compact.'),gallery};
}
function valid(x){return x&&x.realListing&&x.gallery.length>=2&&x.price>0&&x.surface>=8&&Number.isFinite(x.lat)&&Number.isFinite(x.lng)}
function merge(base,next){const seen=new Set(base.map(x=>String(x.id))),out=[...base];for(const x of next){if(!x||seen.has(String(x.id)))continue;seen.add(String(x.id));out.push(x)}return out}
function cityState(){const all=read(),key=cityCode()||city();if(!all[key])all[key]={city:city(),listings:[],nextCursor:null,hasMore:true,pages:0,cells:{}};all[key].cells=all[key].cells||{};return{all,key,b:all[key]}}
function hydrateFromCache(){const {b}=cityState();real=(b.listings||[]).map(normalize).filter(valid);nextCursor=b.nextCursor||null;hasMore=b.hasMore!==false;pages=Number(b.pages||0);lastCity=city()}
function saveState(){const {all,key,b}=cityState();b.city=city();b.listings=real;b.nextCursor=nextCursor;b.hasMore=hasMore;b.pages=pages;all[key]=b;write(all)}
function showImage(url){const m=document.getElementById('mainVisual');if(!m||!url)return;m.className='';m.style.position='absolute';m.style.inset='0';m.innerHTML=`<img src="${url}" alt="Photo réelle du logement" style="width:100%;height:100%;object-fit:cover;display:block">`}
function renderGallery(x){
  if(!x?.realListing||!x.gallery?.length)return;
  const thumbs=[...document.querySelectorAll('#detailModal .thumb')],pics=x.gallery;showImage(pics[0].url);
  thumbs.forEach((th,i)=>{const p=pics[i];if(!p){th.style.display='none';return}th.style.display='block';th.style.cursor='pointer';th.innerHTML=`<img src="${p.url}" alt="Photo ${i+1}" style="width:100%;height:100%;object-fit:cover;display:block"><span>Photo ${i+1}</span>`;th.onclick=()=>showImage(p.url)});
  let info=document.getElementById('hcRealListingInfo');if(!info){info=document.createElement('div');info.id='hcRealListingInfo';info.className='about-card';document.getElementById('factsCard')?.insertAdjacentElement('afterend',info)}
  if(info)info.innerHTML=`<h3>ANNONCE RÉELLE · GALERIE DU MÊME BIEN</h3><div class="about-list"><div>${pics.length} photo${pics.length>1?'s':''} provenant toutes de cette annonce.</div></div>`;
}
function decorateCards(){
  const list=real;document.querySelectorAll('.listing[data-id]').forEach(card=>{
    const x=list.find(v=>String(v.id)===String(card.dataset.id));if(!x)return;
    let slot=card.querySelector('.hc-real-photo');if(!slot){const copy=document.createElement('div');copy.className='hc-photo-copy';while(card.firstChild)copy.appendChild(card.firstChild);slot=document.createElement('div');slot.className='hc-real-photo';slot.style.cssText='height:76px;border-radius:10px;overflow:hidden;background:#eee;';card.style.display='grid';card.style.gridTemplateColumns='92px minmax(0,1fr)';card.style.gap='10px';card.style.alignItems='center';card.appendChild(slot);card.appendChild(copy)}
    if(x.gallery[0]?.url)slot.innerHTML=`<img src="${x.gallery[0].url}" alt="Photo réelle" style="width:100%;height:100%;object-fit:cover;display:block">`;
  });
}
function note(text){const n=document.getElementById('mapNote');if(n)n.textContent=text}
async function request(cursor=null){const q=new URLSearchParams({city:city(),limit:'12'});if(cityCode())q.set('insee',cityCode());if(cursor)q.set('cursor',cursor);const r=await fetch(ENDPOINT+'?'+q.toString(),{headers:{Accept:'application/json'},mode:'cors'});const data=await r.json();if(!r.ok||!data.ok)throw new Error(data.error||('http_'+r.status));return data}
async function fetchFirst(force=false){
  const c=city();if(!c||loading)return real;if(!force&&real.length&&lastCity===c)return real;loading=true;
  try{const data=await request(null);const fresh=(data.listings||[]).map(normalize).filter(valid);real=fresh;lastCity=c;nextCursor=data.nextCursor||null;hasMore=Boolean(data.hasMore&&data.nextCursor);pages=1;saveState();if(real.length){try{if(typeof side==='function')side();if(typeof drawListings==='function'&&st.level==='listing')drawListings()}catch(e){}setTimeout(decorateCards,80);note(`${real.length} vraies annonces chargées à ${c}. Déplace la carte pour découvrir d’autres secteurs.`)}window.dispatchEvent(new CustomEvent('hc-real-estate-feed-status',{detail:{ok:true,count:real.length,provider:data.provider||'cherchertrouver'}}));return real}
  catch(e){console.error('HC direct real estate',e);window.dispatchEvent(new CustomEvent('hc-real-estate-feed-status',{detail:{ok:false,error:String(e.message||e)}}));return real}
  finally{loading=false}
}
function currentCell(){try{if(!LIVE_MAP)return'';const c=LIVE_MAP.getCenter();return `${Math.floor(c.lat/CELL)}:${Math.floor(c.lng/CELL)}`}catch(e){return''}}
async function fetchNextForSector(){
  try{if(typeof st==='undefined'||st.level!=='listing'||!LIVE_MAP)return[]}catch(e){return[]}
  const cell=currentCell();if(!cell||loading)return[];const {all,key,b}=cityState();if(b.cells[cell])return[];b.cells[cell]=Date.now();all[key]=b;write(all);
  if(!real.length){await fetchFirst(false);return real}if(!hasMore||!nextCursor||pages>=12){note('Tous les secteurs disponibles pour cette ville ont été explorés pour le moment.');return[]}
  loading=true;try{const data=await request(nextCursor),fresh=(data.listings||[]).map(normalize).filter(valid).filter(x=>!real.some(y=>String(y.id)===String(x.id)));real=merge(real,fresh);nextCursor=data.nextCursor||null;hasMore=Boolean(data.hasMore&&data.nextCursor);pages++;saveState();if(fresh.length){try{if(typeof side==='function')side();if(typeof drawListings==='function')drawListings()}catch(e){}setTimeout(decorateCards,90);note(`${fresh.length} nouvelle${fresh.length>1?'s':''} vraie${fresh.length>1?'s':''} annonce${fresh.length>1?'s':''} découverte${fresh.length>1?'s':''} dans ce secteur. Continue à déplacer la carte.`)}return fresh}catch(e){console.error('HC sector housing',e);return[]}finally{loading=false}
}
function bindMap(){try{if(!LIVE_MAP||boundMap===LIVE_MAP)return;boundMap=LIVE_MAP;LIVE_MAP.on('moveend',()=>{clearTimeout(mapTimer);mapTimer=setTimeout(fetchNextForSector,350)});LIVE_MAP.on('zoomend',()=>{clearTimeout(mapTimer);mapTimer=setTimeout(fetchNextForSector,350)});setTimeout(fetchNextForSector,650)}catch(e){}}
function install(){
  if(installed)return true;try{if(typeof stock!=='function'||typeof openListingDetail!=='function'||typeof st==='undefined')return false}catch(e){return false}
  installed=true;purge();hydrateFromCache();const oldStock=stock,oldOpen=openListingDetail;
  stock=function(){return real.length?real:oldStock.apply(this,arguments)};
  openListingDetail=function(){const out=oldOpen.apply(this,arguments);try{const x=stock().find(a=>String(a.id)===String(st.listing));if(x?.realListing)renderGallery(x)}catch(e){}return out};
  try{const oldSide=side;side=function(){const out=oldSide.apply(this,arguments);if(st.level==='listing')setTimeout(()=>fetchFirst(false),40);setTimeout(decorateCards,60);return out}}catch(e){}
  try{const oldDraw=drawListings;drawListings=function(){const out=oldDraw.apply(this,arguments);setTimeout(()=>{bindMap();fetchFirst(false);decorateCards()},80);return out}}catch(e){}
  setInterval(bindMap,500);setTimeout(()=>fetchFirst(true),250);
  window.HCVisualEngine={build:BUILD,mode:'direct-real-spatial-listings',fetchFirst,fetchNextForSector,renderGallery,decorateCards};return true;
}
purge();let n=0;const t=setInterval(()=>{n++;if(install()||n>200)clearInterval(t)},40);
})();