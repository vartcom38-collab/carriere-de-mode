/* Haute Couture Live — moteur visuel logement V2.2.
   Les 6 biens de la carte obtiennent chacun une photo principale unique et persistante.
   La colonne d'annonces est neutralisée immédiatement, avant même l'initialisation du marché.
   Les vues secondaires sont générées seulement à l'ouverture de la fiche. */
(function(){
'use strict';
const BUILD='20260827-map-only-v22';
const inflight=new Map();
let wired=false,batchRunning=false;

function forceMapOnlyLayout(){
  try{
    if(!document.getElementById('hc-map-only-hard-css')){
      const s=document.createElement('style');
      s.id='hc-map-only-hard-css';
      s.textContent=`
        .main{grid-template-columns:minmax(0,1fr)!important;max-width:1720px!important}
        .book{display:none!important;visibility:hidden!important;width:0!important;min-width:0!important;max-width:0!important;margin:0!important;padding:0!important;border:0!important;overflow:hidden!important}
        .main>section{min-width:0!important;width:100%!important}
      `;
      document.head.appendChild(s);
    }
    const hide=()=>{
      const book=document.querySelector('.book');
      if(book){book.style.setProperty('display','none','important');book.setAttribute('aria-hidden','true')}
      const main=document.querySelector('.main');
      if(main)main.style.setProperty('grid-template-columns','minmax(0,1fr)','important');
    };
    hide();
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hide,{once:true});
    else hide();
    setTimeout(hide,50);setTimeout(hide,300);setTimeout(hide,1200);
  }catch(e){}
}
forceMapOnlyLayout();

function loadScript(src,test){return new Promise((resolve,reject)=>{if(test())return resolve();const s=document.createElement('script');s.src=src+'?v='+BUILD;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
async function loadDeps(){await loadScript('./visual-dna.js',()=>!!window.HCVisualDNA);await loadScript('./visual-service.js',()=>!!window.HCVisualService)}
function waitGame(){return new Promise(resolve=>{let n=0;const t=setInterval(()=>{n++;try{if(typeof stock==='function'&&typeof st!=='undefined'){clearInterval(t);resolve(true);return}}catch(e){}if(n>240){clearInterval(t);resolve(false)}},50)})}
function waitMarket(){return new Promise(resolve=>{let n=0;const t=setInterval(()=>{n++;if(window.HCHousingMarketV2||n>80){clearInterval(t);resolve(!!window.HCHousingMarketV2)}},50)})}
function ctx(x){let city='',region='';try{city=st.city||'';region=st.region||''}catch(e){}return{city:city||x.city||'',region:region||x.region||'',district:x.district||''}}
function hydrate(x){return window.HCVisualDNA.hydrate(x,ctx(x))}
function showMainImage(url){const m=document.getElementById('mainVisual');if(!m||!url)return;m.className='';m.style.position='absolute';m.style.inset='0';m.style.background='#efe4d9';m.innerHTML=`<img src="${url}" alt="Photo du logement" style="width:100%;height:100%;object-fit:cover;display:block">`}
function showMainStatus(v,text){const m=document.getElementById('mainVisual');if(!m)return;m.style.background='linear-gradient(135deg,#fff4ea,#ead5c2 46%,#c9d8c7)';m.innerHTML=`<div style="max-width:520px;padding:18px;background:#fffaf1e8;border:1px solid #d9bfae;border-radius:16px;font:14px/1.5 Georgia,serif;color:#493a33"><b style="display:block;font:900 10px Arial,sans-serif;letter-spacing:.1em;margin-bottom:7px">${text}</b><strong style="font-size:21px">${v.archetypeLabel}</strong><br>${v.architecture} · ${v.decorSignature}</div>`}
function cachedMain(x,v){if(v.assets&&v.assets.mainImage)return v.assets.mainImage;try{const c=window.HCVisualService.getCached&&window.HCVisualService.getCached(v.visualSeed,'main');if(c&&c.url){v.assets.mainImage=c.url;window.HCVisualDNA.save(x);return c.url}}catch(e){}return null}
async function ensureMain(x){if(!x||!window.HCVisualService)return null;const v=hydrate(x),ready=cachedMain(x,v);if(ready)return ready;const key=v.visualSeed+'|main';if(inflight.has(key)){try{return await inflight.get(key)}catch(e){return null}}const task=(async()=>{const out=await window.HCVisualService.request(x,ctx(x),'main');return out&&out.url?out.url:null})();inflight.set(key,task);try{return await task}catch(e){return null}finally{inflight.delete(key)}}
function items(){try{return stock()}catch(e){return[]}}
async function fillVisible(){if(batchRunning)return;const list=items().slice(0,6);if(!list.length)return;batchRunning=true;try{let i=0;async function worker(){while(i<list.length){const x=list[i++],v=hydrate(x);if(cachedMain(x,v))continue;await ensureMain(x)}}await Promise.all([worker(),worker()])}finally{batchRunning=false}}
function refreshMapPreviews(){try{if(st.level==='listing'&&typeof refreshListingsOnMap==='function')refreshListingsOnMap()}catch(e){}}
function paintDetail(x){if(!x)return;const v=hydrate(x),u=cachedMain(x,v);if(u)showMainImage(u);else{showMainStatus(v,'CHARGEMENT DE LA PHOTO…');ensureMain(x).then(url=>url?showMainImage(url):showMainStatus(v,'VISUEL EN ATTENTE'))}const keys=['main','kitchen','bathroom','window'],names=['Pièce principale','Cuisine','Salle d’eau','Extérieur / vue'];document.querySelectorAll('.thumb').forEach((t,i)=>{const sp=t.querySelector('span');if(sp)sp.textContent=names[i];t.style.cursor='pointer';t.onclick=async()=>{const fresh=hydrate(x),asset=keys[i]==='main'?cachedMain(x,fresh):fresh.assets.gallery[keys[i]];if(asset){showMainImage(asset);return}if(keys[i]==='main'){const url=await ensureMain(x);if(url)showMainImage(url);return}showMainStatus(fresh,'GÉNÉRATION DE CETTE VUE…');try{const out=await window.HCVisualService.request(x,ctx(x),keys[i]);if(out&&out.url)showMainImage(out.url);else showMainStatus(fresh,'VUE EN ATTENTE')}catch(e){showMainStatus(fresh,'VUE INDISPONIBLE')}}})}
async function wire(){if(wired)return;wired=true;forceMapOnlyLayout();try{await loadDeps()}catch(e){wired=false;return}const ready=await waitGame();if(!ready){wired=false;return}await loadScript('./spatial-discovery-v1.js',()=>!!window.HCSpatialHousingDiscovery).catch(()=>{});await waitMarket();forceMapOnlyLayout();try{if(typeof openListingDetail==='function'){const originalOpen=openListingDetail;openListingDetail=function(id){const r=originalOpen.apply(this,arguments);try{const x=items().find(a=>String(a.id)===String(id!=null?id:st.listing));if(x)paintDetail(x)}catch(e){}return r}}}catch(e){}fillVisible().then(()=>refreshMapPreviews());window.addEventListener('hc-housing-market-v2-ready',()=>{forceMapOnlyLayout();fillVisible().then(()=>refreshMapPreviews())});setInterval(()=>{try{forceMapOnlyLayout();if(st.level==='listing')fillVisible()}catch(e){}},2500);window.HCVisualEngine={build:BUILD,paintDetail,ensureMain,fillVisible,forceMapOnlyLayout}}
if(document.readyState==='loading')window.addEventListener('load',wire,{once:true});else wire();
})();