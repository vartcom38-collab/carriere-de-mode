/* Haute Couture Live — mémoire d'introductions Nîmes v1 */
(function(){
'use strict';
if(window.HCNimesIntroductionMemoryV1)return;
const KEY='haute-couture-nimes-introduction-memory-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
function state(){const s=read(KEY,{version:1,introductions:[],byTarget:{}});s.introductions=s.introductions||[];s.byTarget=s.byTarget||{};return s}
function record(targetId,introducerId,meta={}){if(!targetId||!introducerId)return null;const s=state();const existing=s.introductions.find(x=>x.targetId===targetId&&x.introducerId===introducerId);if(existing)return existing;const item={targetId,introducerId,placeId:meta.placeId||null,context:meta.context||'introduction',day:Number(window.HCGame?.get?.()?.clock?.day||1),at:new Date().toISOString(),note:meta.note||''};s.introductions.unshift(item);s.byTarget[targetId]=s.byTarget[targetId]||[];s.byTarget[targetId].unshift(item);write(KEY,s);window.dispatchEvent(new CustomEvent('hc-nimes-introduction',{detail:item}));return item}
function origin(targetId){const s=state();return s.byTarget[targetId]?.[0]||null}
function history(targetId){const s=state();return s.byTarget[targetId]||[]}
window.HCNimesIntroductionMemoryV1={version:1,state,record,origin,history,storageKey:KEY};
})();
