/* Haute Couture Live — Atelier discovery engine v2
   Sélectionne et persiste les découvertes provenant des lieux, PNJ et événements.
   V2 : résout aussi les références territoriales sémantiques vers de vrais éléments
   du catalogue Atelier, une seule fois par découverte.
*/
(function(){
'use strict';
const KEY='haute-couture-atelier-unlocks-v1';
const HISTORY='haute-couture-atelier-discovery-history-v1';
const TERRITORIAL_RESOLUTIONS='haute-couture-atelier-territorial-resolutions-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch(e){return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
function boot(){
 const C=window.HCAtelierCatalog,B=window.HCAtelierDiscoveryBindings;if(!C||!B){setTimeout(boot,60);return}
 if(window.HCAtelierDiscoveryEngine)return;
 function unlockedSet(){const raw=read(KEY,[]);if(Array.isArray(raw))return new Set(raw.map(x=>typeof x==='string'?x:x.id).filter(Boolean));return new Set(Object.keys(raw||{}).filter(k=>raw[k]))}
 function seed(str){let h=2166136261;for(const c of String(str||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
 function score(item,level,sourceSeed){let s=100-Math.abs(Number(item.tier||1)-Math.max(1,Number(level||1)))*18;s+=(seed(item.id+'|'+sourceSeed)%23);if((item.sources||[]).includes('starter'))s-=25;return s}
 function playerLevel(){
  try{const explicit=read('haute-couture-atelier-skills-v1',null);if(explicit?.level)return Number(explicit.level)||1;const g=read('haute-couture-game-state-v1',{});return Number(g.player?.level||g.level||1)||1}catch(e){return 1}
 }
 function candidates(kind,type,opts={}){
  const seen=unlockedSet();const starter=C.starterIds||new Set();const level=opts.level||playerLevel();const sourceSeed=opts.sourceId||type;
  return B.itemsFor(kind,type).map(id=>C.byId(id)).filter(Boolean).filter(x=>!seen.has(x.id)&&!starter.has(x.id)).filter(x=>Number(x.tier||1)<=Math.max(1,Number(level))+Number(opts.tierGrace??1)).sort((a,b)=>score(b,level,sourceSeed)-score(a,level,sourceSeed));
 }
 function persist(item,ctx){
  const raw=read(KEY,[]);let arr=Array.isArray(raw)?raw:[];if(!arr.some(x=>(typeof x==='string'?x:x.id)===item.id))arr.push({id:item.id,unlockedAt:new Date().toISOString(),source:ctx});write(KEY,arr);
  const hist=read(HISTORY,[]);hist.unshift({id:item.id,name:item.name,category:item.category,...ctx,at:new Date().toISOString()});write(HISTORY,hist.slice(0,500));
  window.dispatchEvent(new CustomEvent('hc-atelier-unlock',{detail:{item,source:ctx}}));return item
 }
 function unlockFrom(kind,type,opts={}){
  const count=Math.max(1,Math.min(5,Number(opts.count||1)));const list=candidates(kind,type,opts).slice(0,count);const ctx={kind,type,sourceId:opts.sourceId||null,city:opts.city||null,placeId:opts.placeId||null,npcId:opts.npcId||null,eventId:opts.eventId||null,...(opts.context||{})};return list.map(x=>persist(x,ctx));
 }
 function preview(kind,type,opts={}){return candidates(kind,type,opts)}
 function isUnlocked(id){return unlockedSet().has(id)||(C.starterIds?.has?.(id)||false)}
 function history(){return read(HISTORY,[])}
 function territorialPlaceType(ref){
  const t=String(ref?.type||ref?.unlockType||'').toUpperCase();
  if(t==='MATERIAL_KNOWLEDGE')return 'fabricShop';
  if(t==='CRAFT_CONTACT')return 'artisan';
  if(t==='BOOK_RESEARCH')return 'museum';
  if(t==='PALETTE_REFERENCE')return 'travel';
  if(t==='CLIENT_REFERENCE')return 'boutique';
  return 'regionalCraft';
 }
 function resolveTerritorialUnlocks(){
  const raw=read(KEY,[]);if(!Array.isArray(raw)||!raw.length)return[];
  const resolved=read(TERRITORIAL_RESOLUTIONS,{});const out=[];
  for(const ref of raw){
   if(!ref||typeof ref==='string'||ref.source!=='territorial'||!ref.id||resolved[ref.id])continue;
   const type=territorialPlaceType(ref);
   const items=unlockFrom('place',type,{count:1,sourceId:ref.id,city:ref.territory||null,placeId:ref.id,context:{territorial:true,departmentCode:ref.departmentCode||'',territorialReferenceId:ref.id,territorialReferenceName:ref.name||ref.label||'',materials:ref.materials||[],motifs:ref.motifs||[],palette:ref.palette||[]}});
   if(items.length){resolved[ref.id]={catalogIds:items.map(x=>x.id),resolvedAt:new Date().toISOString(),type};out.push({reference:ref,items})}
  }
  if(out.length){write(TERRITORIAL_RESOLUTIONS,resolved);window.dispatchEvent(new CustomEvent('hc-atelier-territorial-resolved',{detail:out}))}
  return out
 }
 window.HCAtelierDiscoveryEngine={version:2,unlockFrom,preview,isUnlocked,history,resolveTerritorialUnlocks,keys:{unlocks:KEY,history:HISTORY,territorialResolutions:TERRITORIAL_RESOLUTIONS}};
 resolveTerritorialUnlocks();
 window.addEventListener('hc-atelier-unlocks',()=>setTimeout(resolveTerritorialUnlocks,0));
 window.addEventListener('storage',e=>{if(e.key===KEY)setTimeout(resolveTerritorialUnlocks,0)});
 window.dispatchEvent(new CustomEvent('hc-atelier-discovery-engine-ready',{detail:{version:2}}));
}
boot();
})();