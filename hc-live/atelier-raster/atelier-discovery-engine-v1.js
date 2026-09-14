/* Haute Couture Live — Atelier discovery engine v3
   Sélectionne et persiste les découvertes provenant des lieux, PNJ et événements.
   V3 : résout les références territoriales vers de vrais éléments du catalogue et
   récupère au démarrage les signaux atelier stockés par chaque département AURA.
*/
(function(){
'use strict';
const KEY='haute-couture-atelier-unlocks-v1';
const HISTORY='haute-couture-atelier-discovery-history-v1';
const TERRITORIAL_RESOLUTIONS='haute-couture-atelier-territorial-resolutions-v1';
const TERRITORIAL_BRIDGE_STATE='haute-couture-territorial-atelier-bridge-v1';
const TERRITORIAL_STORES={
 '01':'haute-couture-ain-territorial-gameplay-v1','03':'haute-couture-allier-territorial-gameplay-v1','07':'haute-couture-ardeche-territorial-gameplay-v1','15':'haute-couture-cantal-territorial-gameplay-v1','26':'haute-couture-drome-territorial-gameplay-v1','38':'haute-couture-isere-territorial-gameplay-v1','42':'haute-couture-loire-territorial-gameplay-v1','43':'haute-couture-haute-loire-territorial-gameplay-v1','63':'haute-couture-puy-de-dome-territorial-gameplay-v1','69':'haute-couture-rhone-territorial-gameplay-v1','73':'haute-couture-savoie-territorial-gameplay-v1','74':'haute-couture-haute-savoie-territorial-gameplay-v1'
};
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch(e){return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
function boot(){
 const C=window.HCAtelierCatalog,B=window.HCAtelierDiscoveryBindings;if(!C||!B){setTimeout(boot,60);return}
 if(window.HCAtelierDiscoveryEngine)return;
 function unlockedSet(){const raw=read(KEY,[]);if(Array.isArray(raw))return new Set(raw.map(x=>typeof x==='string'?x:x.id).filter(Boolean));return new Set(Object.keys(raw||{}).filter(k=>raw[k]))}
 function seed(str){let h=2166136261;for(const c of String(str||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
 function score(item,level,sourceSeed){let s=100-Math.abs(Number(item.tier||1)-Math.max(1,Number(level||1)))*18;s+=(seed(item.id+'|'+sourceSeed)%23);if((item.sources||[]).includes('starter'))s-=25;return s}
 function playerLevel(){try{const explicit=read('haute-couture-atelier-skills-v1',null);if(explicit?.level)return Number(explicit.level)||1;const g=read('haute-couture-game-state-v1',{});return Number(g.player?.level||g.level||1)||1}catch(e){return 1}}
 function candidates(kind,type,opts={}){const seen=unlockedSet();const starter=C.starterIds||new Set();const level=opts.level||playerLevel();const sourceSeed=opts.sourceId||type;return B.itemsFor(kind,type).map(id=>C.byId(id)).filter(Boolean).filter(x=>!seen.has(x.id)&&!starter.has(x.id)).filter(x=>Number(x.tier||1)<=Math.max(1,Number(level))+Number(opts.tierGrace??1)).sort((a,b)=>score(b,level,sourceSeed)-score(a,level,sourceSeed))}
 function persist(item,ctx){const raw=read(KEY,[]);let arr=Array.isArray(raw)?raw:[];if(!arr.some(x=>(typeof x==='string'?x:x.id)===item.id))arr.push({id:item.id,unlockedAt:new Date().toISOString(),source:ctx});write(KEY,arr);const hist=read(HISTORY,[]);hist.unshift({id:item.id,name:item.name,category:item.category,...ctx,at:new Date().toISOString()});write(HISTORY,hist.slice(0,500));window.dispatchEvent(new CustomEvent('hc-atelier-unlock',{detail:{item,source:ctx}}));return item}
 function unlockFrom(kind,type,opts={}){const count=Math.max(1,Math.min(5,Number(opts.count||1)));const list=candidates(kind,type,opts).slice(0,count);const ctx={kind,type,sourceId:opts.sourceId||null,city:opts.city||null,placeId:opts.placeId||null,npcId:opts.npcId||null,eventId:opts.eventId||null,...(opts.context||{})};return list.map(x=>persist(x,ctx))}
 function preview(kind,type,opts={}){return candidates(kind,type,opts)}
 function isUnlocked(id){return unlockedSet().has(id)||(C.starterIds?.has?.(id)||false)}
 function history(){return read(HISTORY,[])}
 function recoverTerritorialUnlocks(){let raw=read(KEY,[]);if(!Array.isArray(raw))raw=[];const seen=new Set(raw.map(x=>typeof x==='string'?x:x?.id).filter(Boolean));let changed=false;for(const [code,key] of Object.entries(TERRITORIAL_STORES)){const state=read(key,null);for(const signal of state?.signals||[]){if(signal?.kind!=='atelier_unlock'||!signal.payload)continue;const d=signal.payload,id='territory:'+code+':'+String(d.id||signal.id)+':atelier';if(seen.has(id))continue;raw.push({id,name:d.title||d.name||'Référence territoriale',label:d.title||d.name||'Référence territoriale',type:d.unlockType||d.type||'DESIGN_REFERENCE',territory:d.city||'',departmentCode:code,territorialSignalId:String(signal.id||''),source:'territorial',materials:d.materials||[],motifs:d.motifs||[],palette:d.palette||[],learnedAt:new Date().toISOString(),level:d.level||'observed',description:d.text||d.description||'',meta:d.meta||{}});seen.add(id);changed=true}}
  if(changed){write(KEY,raw);window.dispatchEvent(new CustomEvent('hc-atelier-unlocks',{detail:raw}))}return changed}
 function territorialPlaceType(ref){const t=String(ref?.type||ref?.unlockType||'').toUpperCase();if(t==='MATERIAL_KNOWLEDGE')return 'fabricShop';if(t==='CRAFT_CONTACT')return 'artisan';if(t==='BOOK_RESEARCH')return 'museum';if(t==='PALETTE_REFERENCE')return 'travel';if(t==='CLIENT_REFERENCE')return 'boutique';return 'regionalCraft'}
 function resolveTerritorialUnlocks(){const raw=read(KEY,[]);if(!Array.isArray(raw)||!raw.length)return[];const resolved=read(TERRITORIAL_RESOLUTIONS,{});const bridge=read(TERRITORIAL_BRIDGE_STATE,{processed:{}});const processed=bridge&&bridge.processed||{};const out=[];for(const ref of raw){if(!ref||typeof ref==='string'||ref.source!=='territorial'||!ref.id||resolved[ref.id])continue;const signalId=String(ref.territorialSignalId||'');const bridged=signalId?processed[signalId]:null;const bridgedIds=Array.isArray(bridged?.itemIds)?[...new Set(bridged.itemIds.filter(id=>id&&C.byId(id)))]:[];if(bridgedIds.length){const type=bridged.atelierType||territorialPlaceType(ref);const items=bridgedIds.map(id=>C.byId(id)).filter(Boolean);resolved[ref.id]={catalogIds:bridgedIds,resolvedAt:new Date().toISOString(),type,source:'territorial-bridge',signalId};out.push({reference:ref,items});continue}const type=territorialPlaceType(ref);const items=unlockFrom('place',type,{count:1,sourceId:ref.id,city:ref.territory||null,placeId:ref.id,context:{territorial:true,departmentCode:ref.departmentCode||'',territorialReferenceId:ref.id,territorialReferenceName:ref.name||ref.label||'',materials:ref.materials||[],motifs:ref.motifs||[],palette:ref.palette||[]}});if(items.length){resolved[ref.id]={catalogIds:items.map(x=>x.id),resolvedAt:new Date().toISOString(),type,source:'atelier-fallback'};out.push({reference:ref,items})}}
  if(out.length){write(TERRITORIAL_RESOLUTIONS,resolved);window.dispatchEvent(new CustomEvent('hc-atelier-territorial-resolved',{detail:out}))}return out}
 function syncTerritorial(){recoverTerritorialUnlocks();return resolveTerritorialUnlocks()}
 window.HCAtelierDiscoveryEngine={version:3,unlockFrom,preview,isUnlocked,history,recoverTerritorialUnlocks,resolveTerritorialUnlocks,syncTerritorial,keys:{unlocks:KEY,history:HISTORY,territorialResolutions:TERRITORIAL_RESOLUTIONS}};
 syncTerritorial();
 window.addEventListener('hc-atelier-unlocks',()=>setTimeout(resolveTerritorialUnlocks,0));
 window.addEventListener('storage',e=>{if(e.key===KEY||e.key===TERRITORIAL_BRIDGE_STATE||Object.values(TERRITORIAL_STORES).includes(e.key))setTimeout(syncTerritorial,0)});
 window.dispatchEvent(new CustomEvent('hc-atelier-discovery-engine-ready',{detail:{version:3}}));
}
boot();
})();