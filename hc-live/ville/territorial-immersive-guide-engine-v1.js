/* Haute Couture Live — moteur de guide territorial immersif v1
   Un grand lieu n'est pas une fiche : c'est une visite structurée, documentée, jouable et connectée aux autres systèmes.
*/
(function(){
'use strict';
if(window.HCTerritorialImmersiveGuideV1)return;
const KEY='haute-couture-territorial-guide-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
const state=()=>{const s=read(KEY,{version:1,places:{},memory:[],unlocks:[]});s.places=s.places||{};s.memory=s.memory||[];s.unlocks=s.unlocks||[];return s};
function placeState(id){const s=state();return s.places[id]||{visited:false,completed:false,steps:{},notes:[],firstVisitAt:null,lastVisitAt:null}}
function savePlace(id,p){const s=state();s.places[id]=p;write(KEY,s);return p}
function visit(id){const p=placeState(id);p.visited=true;p.firstVisitAt=p.firstVisitAt||new Date().toISOString();p.lastVisitAt=new Date().toISOString();return savePlace(id,p)}
function completeStep(placeId,stepId,data={}){const p=visit(placeId);p.steps[stepId]={done:true,at:new Date().toISOString(),...data};savePlace(placeId,p);window.dispatchEvent(new CustomEvent('hc-guide-step',{detail:{placeId,stepId,data}}));return p}
function remember(placeId,kind,text,meta={}){const s=state();s.memory.unshift({placeId,kind,text,meta,at:new Date().toISOString()});s.memory=s.memory.slice(0,300);write(KEY,s);window.dispatchEvent(new CustomEvent('hc-guide-memory',{detail:{placeId,kind,text,meta}}))}
function unlock(placeId,id,type,label,meta={}){const s=state();if(s.unlocks.some(x=>x.id===id))return false;const item={id,placeId,type,label,meta,at:new Date().toISOString()};s.unlocks.unshift(item);write(KEY,s);window.dispatchEvent(new CustomEvent('hc-guide-unlock',{detail:item}));return true}
function finish(place){const p=visit(place.id);p.completed=true;p.completedAt=p.completedAt||new Date().toISOString();savePlace(place.id,p);(place.unlocks||[]).forEach(u=>unlock(place.id,u.id,u.type,u.label,u.meta||{}));window.dispatchEvent(new CustomEvent('hc-guide-complete',{detail:{placeId:place.id,place}}));return p}
function integrationMap(place){return {
 atelier:place.connections?.atelier||[],school:place.connections?.school||[],career:place.connections?.career||[],book:place.connections?.book||[],characters:place.connections?.characters||[],phone:place.connections?.phone||[],publicImage:place.connections?.publicImage||[],future:place.connections?.future||[]
}}
function validate(place){const errors=[];if(!place?.id)errors.push('id');if(!place?.title)errors.push('title');if(!Array.isArray(place?.chapters)||place.chapters.length<3)errors.push('chapters');if(!Array.isArray(place?.sources)||!place.sources.length)errors.push('sources');if(!place?.connections)errors.push('connections');return {ok:!errors.length,errors}}
window.HCTerritorialImmersiveGuideV1={version:1,state,placeState,visit,completeStep,remember,unlock,finish,integrationMap,validate,storageKey:KEY};
})();
