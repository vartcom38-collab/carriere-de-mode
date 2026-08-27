/* Haute Couture Live — moteur visuel logement V2.5.
   Nîmes : les photos réelles curées sont le chemin principal et immédiat.
   Magnific n'est plus requis pour afficher une annonce.
*/
(function(){
'use strict';
const BUILD='20260827-photo-v5-curated';
const ASSIGN_KEY='haute-couture-curated-housing-photo-assignments-v1';
let wired=false;
const p=id=>`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400&h=1050&fit=crop`;
const HERO=['8142976','6782427','6969987','6447393','6447384','8082559','6636309','6920435','6681821','20290959','6265833','7534270','7511693','7018832','6585626','6903161','7019013','7031715','6315809','7031723','6933852','29252608','30580543','8089275'];
const KITCHEN=['7018832','7534270','7511693','6585626','6903161','7019013','7031723','6933852','6890400','19916702','7214447','6890399','7166558','6585628','6265833','6636309','6782427','6447384'];
const BATH=['7005019','6538895','7045298','6527036','6312079','6758770','7214472','7214474','7019017','6527064','7214470','7060819','16015330','6920435'];
const VIEW=['6933770','7031592','15508726','35505627','35459396','23893995','18302453','31458376','33893215','26925314','6758514'];
function hash(s){let x=2166136261;for(const c of String(s)){x^=c.charCodeAt(0);x=Math.imul(x,16777619)}return x>>>0}
function readAssign(){try{return JSON.parse(localStorage.getItem(ASSIGN_KEY)||'{"items":{},"usedHero":[]}')}catch(e){return{items:{},usedHero:[]}}}
function writeAssign(v){try{localStorage.setItem(ASSIGN_KEY,JSON.stringify(v))}catch(e){}}
function choose(pool,seed,avoid=[]){const clean=pool.filter(id=>!avoid.includes(id));const a=clean.length?clean:pool;return a[seed%a.length]}
function assignment(x){
  const db=readAssign(),id=String(x.id||x.listingId||'housing');db.items=db.items||{};db.usedHero=db.usedHero||[];
  if(db.items[id])return db.items[id];
  const seed=hash('HC|CURATED|'+id),used=new Set(db.usedHero);
  let hero=HERO.find(pid=>!used.has(pid));if(!hero)hero=HERO[seed%HERO.length];
  const kitchen=choose(KITCHEN,seed+11,[hero]);
  const bath=choose(BATH,seed+23,[hero,kitchen]);
  const view=choose(VIEW,seed+37,[hero,kitchen,bath]);
  const a={hero:p(hero),kitchen:p(kitchen),bathroom:p(bath),window:p(view),ids:{hero,kitchen,bathroom:bath,window:view},source:'Pexels · bibliothèque curée',build:BUILD};
  db.items[id]=a;if(!used.has(hero))db.usedHero.push(hero);writeAssign(db);return a;
}
function forceMapOnlyLayout(){try{if(!document.getElementById('hc-map-only-hard-css')){const s=document.createElement('style');s.id='hc-map-only-hard-css';s.textContent=`.main{grid-template-columns:minmax(0,1fr)!important;max-width:1720px!important}.book{display:none!important;visibility:hidden!important;width:0!important;min-width:0!important;max-width:0!important;margin:0!important;padding:0!important;border:0!important;overflow:hidden!important}.main>section{min-width:0!important;width:100%!important}`;document.head.appendChild(s)}const book=document.querySelector('.book');if(book){book.style.setProperty('display','none','important');book.setAttribute('aria-hidden','true')}const main=document.querySelector('.main');if(main)main.style.setProperty('grid-template-columns','minmax(0,1fr)','important')}catch(e){}}
function loadScript(src,test){return new Promise((resolve,reject)=>{if(test())return resolve();const s=document.createElement('script');s.src=src+'?v='+BUILD;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
function waitGame(){return new Promise(resolve=>{let n=0;const t=setInterval(()=>{n++;try{if(typeof stock==='function'&&typeof st!=='undefined'){clearInterval(t);resolve(true);return}}catch(e){}if(n>240){clearInterval(t);resolve(false)}},50)})}
function ctx(x){let city='',region='';try{city=st.city||'';region=st.region||''}catch(e){}return{city:city||x.city||'',region:region||x.region||'',district:x.district||''}}
function hydrate(x){try{return window.HCVisualDNA?.hydrate?window.HCVisualDNA.hydrate(x,ctx(x)):(x.visual=x.visual||{})}catch(e){return x.visual=x.visual||{}}}
function ensureCurated(x){
  if(!x)return null;const a=assignment(x),v=hydrate(x);v.assets=v.assets||{};v.assets.gallery=v.assets.gallery||{};
  v.assets.mainImage=a.hero;v.assets.gallery.kitchen=a.kitchen;v.assets.gallery.bathroom=a.bathroom;v.assets.gallery.window=a.window;
  v.visualStatus='curated_ready';v.generationStage='curated_ready';v.mainImageSource='real-photo';v.mainImageProvider='curated-library';v.curatedAssignment=a;
  x.gallery={hero:a.hero,kitchen:a.kitchen,bathroom:a.bathroom,window:a.window,source:a.source};
  try{window.HCVisualDNA?.save?.(x)}catch(e){}
  return a;
}
function showMainImage(url,label='Photo du logement'){const m=document.getElementById('mainVisual');if(!m||!url)return;m.className='';m.style.position='absolute';m.style.inset='0';m.style.background='#efe4d9';m.innerHTML=`<img src="${url}" alt="${label}" style="width:100%;height:100%;object-fit:cover;display:block">`}
function paintDetail(x){
  if(!x)return;const a=ensureCurated(x);showMainImage(a.hero,'Pièce principale');
  const pics=[a.hero,a.kitchen,a.bathroom,a.window],names=['Pièce principale','Cuisine','Salle d’eau','Extérieur / vue'];
  document.querySelectorAll('#detailModal .thumb').forEach((t,i)=>{const url=pics[i]||a.hero,label=names[i]||'Photo';t.innerHTML=`<img src="${url}" alt="${label}" style="width:100%;height:100%;object-fit:cover;display:block"><span>${label}</span>`;t.style.cursor='pointer';t.onclick=()=>showMainImage(url,label)});
}
function items(){try{return stock()}catch(e){return[]}}
function fillVisible(){const list=items().slice(0,6);list.forEach(ensureCurated);return Promise.resolve(list)}
function refreshMapPreviews(){try{if(st.level==='listing'&&typeof refreshListingsOnMap==='function')refreshListingsOnMap()}catch(e){}}
async function wire(){
  if(wired)return;wired=true;forceMapOnlyLayout();
  try{await loadScript('./visual-dna.js',()=>window.HCVisualDNA?.version==='3.0')}catch(e){console.error('HC visual DNA',e)}
  const ready=await waitGame();if(!ready){wired=false;return}
  try{await loadScript('./spatial-discovery-v1.js',()=>!!window.HCSpatialHousingDiscovery)}catch(e){}
  fillVisible().then(()=>refreshMapPreviews());
  window.addEventListener('hc-housing-market-v2-ready',()=>fillVisible().then(()=>refreshMapPreviews()));
  window.addEventListener('hc-listing-opened',e=>{try{if(e.detail?.listing)paintDetail(e.detail.listing)}catch(err){}});
  try{if(typeof openListingDetail==='function'){const originalOpen=openListingDetail;openListingDetail=function(id){const r=originalOpen.apply(this,arguments);try{const x=items().find(a=>String(a.id)===String(id!=null?id:st.listing));if(x)paintDetail(x)}catch(e){}return r}}}catch(e){}
  window.HCVisualEngine={build:BUILD,mode:'curated-default',paintDetail,ensureMain:async x=>ensureCurated(x)?.hero||null,fillVisible,ensureCurated,forceMapOnlyLayout};
}
forceMapOnlyLayout();
if(document.readyState==='loading')window.addEventListener('load',wire,{once:true});else wire();
})();
