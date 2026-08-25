/* Haute Couture Live — bridge additif Nîmes -> découvertes Atelier v1.
   Ne remplace aucune mécanique existante : il observe les actions déjà en place
   et ajoute une découverte Atelier cohérente après l'action.
*/
(function(){
'use strict';
if(window.HCNimesAtelierDiscoveryBridge)return;
const LOADS=[
 ['../atelier-raster/atelier-catalog-v1.js?v=20260825-catalog1','data-hc-city-atelier-catalog-v1'],
 ['../atelier-raster/atelier-catalog-v2.js?v=20260825-catalog2','data-hc-city-atelier-catalog-v2'],
 ['../atelier-raster/atelier-catalog-v3.js?v=20260825-catalog3','data-hc-city-atelier-catalog-v3'],
 ['../atelier-raster/atelier-starter-base-v2.js?v=20260825-starterbase2','data-hc-city-atelier-starter-v2'],
 ['../atelier-raster/atelier-unlock-packs-v1.js?v=20260825-unlockpacks1','data-hc-city-atelier-unlock-packs-v1'],
 ['../atelier-raster/atelier-discovery-bindings-v1.js?v=20260825-discovery1','data-hc-city-atelier-discovery-bindings-v1'],
 ['../atelier-raster/atelier-discovery-engine-v1.js?v=20260825-discoveryengine1','data-hc-city-atelier-discovery-engine-v1']
];
const STATE='haute-couture-nimes-atelier-discovery-bridge-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch(e){return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const day=()=>Number(window.HCGame?.get?.().clock?.day||1);
function loadSeq(i=0){
 if(i>=LOADS.length){install();return}
 const [src,attr]=LOADS[i];
 if(document.querySelector('script['+attr+']')){loadSeq(i+1);return}
 const s=document.createElement('script');s.src=src;s.defer=true;s.setAttribute(attr,'1');
 s.onload=()=>loadSeq(i+1);s.onerror=()=>{console.warn('[Nîmes Atelier Discovery] chargement impossible',src);loadSeq(i+1)};
 document.head.appendChild(s);
}
function engine(){return window.HCAtelierDiscoveryEngine||null}
function state(){return read(STATE,{last:{},history:[]})}
function mark(key,item){const s=state();s.last[key]=day();if(item)s.history.unshift({key,day:day(),id:item.id,name:item.name,at:new Date().toISOString()});s.history=s.history.slice(0,300);write(STATE,s)}
function alreadyToday(key){return Number(state().last[key]||0)===day()}
function unlock(kind,type,place,opts={}){
 const E=engine();if(!E)return [];
 const key=opts.onceKey||`${kind}:${type}:${place?.id||'nimes'}`;
 if(opts.oncePerDay&&alreadyToday(key))return [];
 const got=E.unlockFrom(kind,type,{count:opts.count||1,sourceId:opts.sourceId||place?.id||type,placeId:place?.id||null,city:'Nîmes',tierGrace:opts.tierGrace??1});
 if(got.length){mark(key,got[0]);window.dispatchEvent(new CustomEvent('hc-nimes-atelier-discovery',{detail:{place,type,items:got}}));}
 return got;
}
function patchRoute(id,type,attach){
 const ui=window.HCNimesPlaceUI;if(!ui?.routes?.[id])return false;
 const current=ui.routes[id];if(current.__atelierDiscoveryBridge)return true;
 function wrapped(place){const result=current(place);setTimeout(()=>attach(place||{id,name:id}),0);return result}
 wrapped.__atelierDiscoveryBridge=true;wrapped.__original=current;ui.routes[id]=wrapped;return true;
}
function bindOnce(el,key,handler){if(!el||el.dataset[key])return;el.dataset[key]='1';el.addEventListener('click',handler)}
function mercerie(place){
 const bind=()=>{const b=document.querySelector('#npCheckout');if(!b)return;bindOnce(b,'atelierDiscovery',()=>setTimeout(()=>unlock('place','mercerie',place,{oncePerDay:true,onceKey:'mercerie:'+place.id,tierGrace:1}),80))};
 bind();new MutationObserver(bind).observe(document.querySelector('#npBody')||document.body,{childList:true,subtree:true});
}
function archives(place){
 const body=document.querySelector('#npBody');if(!body)return;
 body.querySelectorAll('[data-era]').forEach(b=>bindOnce(b,'atelierDiscovery',()=>setTimeout(()=>unlock('place','archives',place,{sourceId:place.id+'-'+b.dataset.era,tierGrace:1}),80)));
}
function brocante(place){
 const body=document.querySelector('#npBody');if(!body)return;
 const mo=new MutationObserver(()=>{
  body.querySelectorAll('[data-c]').forEach(b=>bindOnce(b,'atelierDiscovery',()=>{
   const c=String(b.dataset.c||'');if(!/(Examiner|Fouiller|Demander son histoire|Demander la provenance|Acheter)/i.test(c))return;
   setTimeout(()=>unlock('place','brocante',place,{oncePerDay:true,onceKey:'brocante:'+place.id,tierGrace:1}),80);
  }));
 });mo.observe(body,{childList:true,subtree:true});mo.takeRecords();
}
function artisan(place){
 const body=document.querySelector('#npBody');if(!body)return;
 const bind=()=>body.querySelectorAll('[data-train]').forEach(b=>bindOnce(b,'atelierDiscovery',()=>{
   const before=(read('haute-couture-techniques-v1',[]).find(x=>x.id==='boutis-bas-languedoc')?.level)||0;
   setTimeout(()=>{const after=(read('haute-couture-techniques-v1',[]).find(x=>x.id==='boutis-bas-languedoc')?.level)||0;if(Number(after)>Number(before))unlock('place','artisan',place,{sourceId:place.id+'-niveau-'+after,tierGrace:2});},120);
 }));
 bind();new MutationObserver(bind).observe(body,{childList:true,subtree:true});
}
function install(){
 const wait=()=>{
  const ui=window.HCNimesPlaceUI,E=engine();if(!ui||!E){setTimeout(wait,100);return}
  patchRoute('nimes-mercerie-atelier','mercerie',mercerie);
  patchRoute('nimes-brocante-textile','brocante',brocante);
  patchRoute('nimes-archives','archives',archives);
  patchRoute('nimes-bibliotheque-patrimoine','archives',archives);
  patchRoute('nimes-atelier-broderie','artisan',artisan);
  window.HCNimesAtelierDiscoveryBridge={version:1,unlock,state,repatch:wait};
  window.dispatchEvent(new CustomEvent('hc-nimes-atelier-discovery-bridge-ready',{detail:{version:1}}));
 };
 wait();
}
loadSeq();
})();