/* Haute Couture Live — bridge territoires AURA -> découvertes Atelier v1.
   Transforme les actions réellement effectuées dans un lieu territorial en
   découvertes du catalogue Atelier persistant. Aucun simple focus de carte ne
   débloque de contenu ; une même action de lieu n'est traitée qu'une fois.
*/
(function(){
'use strict';
if(window.HCTerritorialAtelierDiscoveryBridgeV1)return;
const AURA=new Set(['01','03','07','15','26','38','42','43','63','69','73','74']);
const here=window.HCTerritoryContext?.getPresence?.();
if(!here||!AURA.has(String(here.departmentCode||'')))return;

const LOADS=[
 ['../atelier-raster/atelier-catalog-v1.js?v=20260825-catalog1','data-hc-territory-atelier-catalog-v1'],
 ['../atelier-raster/atelier-catalog-v2.js?v=20260825-catalog2','data-hc-territory-atelier-catalog-v2'],
 ['../atelier-raster/atelier-catalog-v3.js?v=20260825-catalog3','data-hc-territory-atelier-catalog-v3'],
 ['../atelier-raster/atelier-starter-base-v2.js?v=20260831-starterbase3','data-hc-territory-atelier-starter-v2'],
 ['../atelier-raster/atelier-unlock-packs-v1.js?v=20260825-unlockpacks1','data-hc-territory-atelier-unlock-packs-v1'],
 ['../atelier-raster/atelier-discovery-bindings-v1.js?v=20260825-discovery1','data-hc-territory-atelier-discovery-bindings-v1'],
 ['../atelier-raster/atelier-discovery-engine-v1.js?v=20260825-discoveryengine1','data-hc-territory-atelier-discovery-engine-v1']
];
const STATE='haute-couture-territorial-atelier-bridge-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
const queue=[];
let ready=false;

function state(){
 const s=read(STATE,null)||{version:1,processed:{},history:[]};
 s.version=1;s.processed=s.processed||{};s.history=s.history||[];return s;
}
function save(s){s.history=s.history.slice(0,500);write(STATE,s);return s}
function engine(){return window.HCAtelierDiscoveryEngine||null}
function placeType(d={}){
 const u=String(d.unlockType||'').toUpperCase(),cat=String(d.category||d.cat||'').toLowerCase();
 if(u==='REST')return null;
 if(/^MATERIAL_|^SUPPLIER_/.test(u))return 'mercerie';
 if(/^TECHNIQUE_|^CRAFT_/.test(u))return cat==='jewelry'?'jeweler':'regionalCraft';
 if(u==='ARCHIVE_REFERENCE'||u==='BOOK_RESEARCH')return 'archives';
 if(u==='VINTAGE_REFERENCE')return 'brocante';
 if(['DESIGN_REFERENCE','MOTIF_REFERENCE','PALETTE_REFERENCE','PHOTO_REFERENCE'].includes(u))return ['nature','view','photo'].includes(cat)?'travel':'museum';
 if(u==='RELATION_CONTACT'||u==='PHONE_CONTACT'||u==='CAREER_LEAD'||u==='LOCAL_CONTACT'||u==='CLIENT_REFERENCE')return null;
 const byCat={fabric:'mercerie',craft:'regionalCraft',culture:'museum',heritage:'archives',markets:'regionalCraft',vintage:'brocante',nature:'travel',view:'travel',libraries:'archives',jewelry:'jeweler',shop:'boutique',photo:'travel'};
 return byCat[cat]||null;
}
function remember(signal,type,items){
 const s=state();
 s.processed[signal.id]={id:signal.id,departmentCode:signal.departmentCode||null,city:signal.city||null,placeId:signal.placeId||null,actionId:signal.actionId||null,unlockType:signal.unlockType||null,category:signal.category||null,atelierType:type,itemIds:(items||[]).map(x=>x.id),at:new Date().toISOString()};
 s.history.unshift(s.processed[signal.id]);save(s);
}
function processSignal(detail={}){
 if(detail.kind!=='atelier_unlock'||!detail.id)return[];
 if(!AURA.has(String(detail.departmentCode||here.departmentCode||'')))return[];
 const s=state();if(s.processed[detail.id])return[];
 const type=placeType(detail);
 if(!type){remember(detail,null,[]);window.dispatchEvent(new CustomEvent('hc-territorial-atelier-discovery',{detail:{signal:detail,type:null,items:[],ignored:true}}));return[]}
 const E=engine();if(!E){queue.push(detail);return[]}
 const items=E.unlockFrom('place',type,{count:1,sourceId:detail.id,placeId:detail.placeId||null,city:detail.city||null,tierGrace:1});
 remember(detail,type,items);
 window.dispatchEvent(new CustomEvent('hc-territorial-atelier-discovery',{detail:{signal:detail,type,items,ignored:false}}));
 return items;
}
function flush(){if(!engine())return;ready=true;while(queue.length)processSignal(queue.shift());window.dispatchEvent(new CustomEvent('hc-territorial-atelier-discovery-bridge-ready',{detail:{version:1,departmentCode:here.departmentCode}}));}
function loadSeq(i=0){
 if(i>=LOADS.length){flush();return}
 const [src,attr]=LOADS[i];
 if(document.querySelector('script['+attr+']')){loadSeq(i+1);return}
 const globals=[window.HCAtelierCatalog,window.HCAtelierCatalogV2,window.HCAtelierCatalogV3,window.HCAtelierStarterBaseV2,window.HCAtelierUnlockPacks,window.HCAtelierDiscoveryBindings,window.HCAtelierDiscoveryEngine];
 if(globals[i]){loadSeq(i+1);return}
 const s=document.createElement('script');s.src=src;s.defer=true;s.setAttribute(attr,'1');s.onload=()=>loadSeq(i+1);s.onerror=()=>{console.warn('[Territoires Atelier] chargement impossible',src);loadSeq(i+1)};document.head.appendChild(s);
}
window.addEventListener('hc-territorial-signal',e=>{
 const d=e.detail||{};if(d.kind!=='atelier_unlock')return;
 if(ready&&engine())processSignal(d);else queue.push(d);
});
window.HCTerritorialAtelierDiscoveryBridgeV1={version:1,state,processSignal,placeType,get ready(){return ready},storageKey:STATE};
loadSeq();
})();