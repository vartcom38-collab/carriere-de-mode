/* Haute Couture Live — migration des relations Nîmes vers la population territoriale v1 */
(function(){
'use strict';
if(window.HCNimesPopulationMigrationV1)return;
const POPKEY='haute-couture-territorial-population-v1',DONE='haute-couture-nimes-population-migration-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
function legacyValue(p){if(!p.legacy)return 0;const v=read(p.legacy.key,{});const obj=p.legacy.nested?v?.[p.legacy.nested]:v;return Number(obj?.[p.legacy.field]||0)}
function migrate(){if(read(DONE,false))return;const people=window.HCNimesPeople||[];const s=read(POPKEY,{version:1,people:{},encounters:[],known:[]});s.people=s.people||{};s.known=s.known||[];
 for(const p of people){const n=legacyValue(p);if(n<=0)continue;const cur=s.people[p.id]||{glimpses:0,met:false,known:false,lastEncounterDay:null,history:[]};cur.glimpses=Math.max(Number(cur.glimpses||0),1);cur.met=true;cur.known=true;cur.history=cur.history||[];if(!cur.history.some(h=>h.meta?.migration==='nimes-legacy'))cur.history.unshift({kind:'migration',day:null,at:new Date().toISOString(),meta:{migration:'nimes-legacy',legacyValue:n}});s.people[p.id]=cur;if(!s.known.includes(p.id))s.known.push(p.id)}
 write(POPKEY,s);write(DONE,{done:true,at:new Date().toISOString(),count:s.known.filter(id=>people.some(p=>p.id===id)).length});window.dispatchEvent(new CustomEvent('hc-nimes-population-migrated',{detail:{known:s.known}}))}
setTimeout(migrate,50);
window.HCNimesPopulationMigrationV1={version:1,migrate};
})();
