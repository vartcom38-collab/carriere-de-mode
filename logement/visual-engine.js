/* Haute Couture Live — logement racine : flux réel direct ChercherTrouver. */
(function(){
'use strict';
if(window.HCVisualEngine?.mode==='direct-real-listings')return;
const BUILD='20260826-root-real-housing2';
const ENDPOINT='https://carriere-de-mode-visuals.vercel.app/api/real-estate-listings';
let installed=false,loading=false,real=[],lastCity='';

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
  return {...x,
    id:String(x.id||x.dedup_key||x.realPropertyId||('real-'+i)),
    realListing:true,
    title:x.title||x.type|| (rooms>=2?'Deux-pièces':'Studio'),
    surface,rooms,price,charges,
    floor:num(x.floor,0),balcony:!!x.balcony,elevator:!!x.elevator,furnished:!!x.furnished,dpe:x.dpe||'—',
    lat:Number.isFinite(lat)?lat:null,lng:Number.isFinite(lng)?lng:null,
    address:x.address||`${city()} · secteur de l’annonce`,
    tags:Array.isArray(x.tags)&&x.tags.length>=3?x.tags:['Annonce réelle',rooms>=2?'Pièces séparées':'Agencement à découvrir',x.furnished?'Meublé':'Non meublé'],
    potential:x.potential|| (surface>=30?'Bon potentiel pour un coin atelier.':surface>=20?'Coin couture possible.':'Espace couture compact.'),
    gallery
  };
}
function valid(x){return x&&x.realListing&&x.gallery.length>=2&&x.price>0&&x.surface>=8}
function showImage(url){const m=document.getElementById('mainVisual');if(!m||!url)return;m.className='';m.style.position='absolute';m.style.inset='0';m.innerHTML=`<img src="${url}" alt="Photo réelle du logement" style="width:100%;height:100%;object-fit:cover;display:block">`}
function renderGallery(x){
  if(!x?.realListing||!x.gallery?.length)return;
  const thumbs=[...document.querySelectorAll('#detailModal .thumb')];
  const pics=x.gallery;showImage(pics[0].url);
  thumbs.forEach((th,i)=>{const p=pics[i];if(!p){th.style.display='none';return}th.style.display='block';th.style.cursor='pointer';th.innerHTML=`<img src="${p.url}" alt="Photo ${i+1}" style="width:100%;height:100%;object-fit:cover;display:block"><span>Photo ${i+1}</span>`;th.onclick=()=>showImage(p.url)});
  let info=document.getElementById('hcRealListingInfo');if(!info){info=document.createElement('div');info.id='hcRealListingInfo';info.className='about-card';document.getElementById('factsCard')?.insertAdjacentElement('afterend',info)}
  if(info)info.innerHTML=`<h3>ANNONCE RÉELLE · GALERIE DU MÊME BIEN</h3><div class="about-list"><div>${pics.length} photo${pics.length>1?'s':''} provenant toutes de cette annonce.</div></div>`;
}
function decorateCards(){
  const list=real;
  document.querySelectorAll('.listing[data-id]').forEach(card=>{
    const x=list.find(v=>String(v.id)===String(card.dataset.id));if(!x)return;
    let slot=card.querySelector('.hc-real-photo');
    if(!slot){const copy=document.createElement('div');copy.className='hc-photo-copy';while(card.firstChild)copy.appendChild(card.firstChild);slot=document.createElement('div');slot.className='hc-real-photo';slot.style.cssText='height:76px;border-radius:10px;overflow:hidden;background:#eee;';card.style.display='grid';card.style.gridTemplateColumns='92px minmax(0,1fr)';card.style.gap='10px';card.style.alignItems='center';card.appendChild(slot);card.appendChild(copy)}
    if(x.gallery[0]?.url)slot.innerHTML=`<img src="${x.gallery[0].url}" alt="Photo réelle" style="width:100%;height:100%;object-fit:cover;display:block">`;
  });
}
async function fetchReal(force=false){
  const c=city();if(!c||loading)return real;if(!force&&real.length&&lastCity===c)return real;
  loading=true;
  try{
    const q=new URLSearchParams({city:c,limit:'12'});if(cityCode())q.set('insee',cityCode());
    const r=await fetch(ENDPOINT+'?'+q.toString(),{headers:{Accept:'application/json'}});const data=await r.json();
    if(!r.ok||!data.ok)throw new Error(data.error||('http_'+r.status));
    real=(data.listings||[]).map(normalize).filter(valid);lastCity=c;
    if(real.length){try{if(typeof side==='function')side();if(typeof drawListings==='function'&&st.level==='listing')drawListings()}catch(e){}setTimeout(decorateCards,80)}
    window.dispatchEvent(new CustomEvent('hc-real-estate-feed-status',{detail:{ok:true,count:real.length,provider:data.provider||'cherchertrouver'}}));
    return real;
  }catch(e){console.error('HC direct real estate',e);window.dispatchEvent(new CustomEvent('hc-real-estate-feed-status',{detail:{ok:false,error:String(e.message||e)}}));return real}
  finally{loading=false}
}
function install(){
  if(installed)return true;
  try{if(typeof stock!=='function'||typeof openListingDetail!=='function'||typeof st==='undefined')return false}catch(e){return false}
  installed=true;purge();
  const oldStock=stock,oldOpen=openListingDetail;
  stock=function(){return real.length?real:oldStock.apply(this,arguments)};
  openListingDetail=function(){const out=oldOpen.apply(this,arguments);try{const x=stock().find(a=>String(a.id)===String(st.listing));if(x?.realListing)renderGallery(x)}catch(e){}return out};
  try{const oldSide=side;side=function(){const out=oldSide.apply(this,arguments);if(st.level==='listing')setTimeout(()=>fetchReal(false),40);setTimeout(decorateCards,60);return out}}catch(e){}
  try{const oldDraw=drawListings;drawListings=function(){const out=oldDraw.apply(this,arguments);setTimeout(()=>fetchReal(false),60);setTimeout(decorateCards,100);return out}}catch(e){}
  setTimeout(()=>fetchReal(true),250);
  window.HCVisualEngine={build:BUILD,mode:'direct-real-listings',fetchReal,renderGallery,decorateCards};
  return true;
}
purge();
let n=0;const t=setInterval(()=>{n++;if(install()||n>200)clearInterval(t)},40);
})();
