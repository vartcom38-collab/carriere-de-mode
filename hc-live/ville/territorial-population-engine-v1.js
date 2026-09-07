/* Haute Couture Live — moteur de population territoriale v1 */
(function(){
'use strict';
if(window.HCTerritorialPopulationV1)return;
const KEY='haute-couture-territorial-population-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
const hash=s=>{let h=2166136261;for(const c of String(s||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return Math.abs(h>>>0)};
function state(){const s=read(KEY,{version:1,people:{},encounters:[],known:[]});s.people=s.people||{};s.encounters=s.encounters||[];s.known=s.known||[];return s}
function personState(id){const s=state();return s.people[id]||{glimpses:0,met:false,known:false,lastEncounterDay:null,history:[]}}
function savePerson(id,p){const s=state();s.people[id]=p;if(p.known&&!s.known.includes(id))s.known.push(id);write(KEY,s);return p}
function day(){return Number(window.HCGame?.get?.()?.clock?.day||1)}
function context(){return {day:day(),hour:Number(String(window.HCGame?.get?.()?.clock?.iso||'').slice(11,13)||12),city:window.HCGame?.get?.()?.player?.city||'',circuit:window.HCTerritorialCircuitEngineV1?.state?.()||null}}
function stageDone(circuitId,stageId){return !!window.HCTerritorialCircuitEngineV1?.circuitState?.(circuitId)?.stages?.[stageId]?.done}
function eligible(person,extra={}){const c={...context(),...extra},p=personState(person.id);if(person.territories?.length&&c.territory&&!person.territories.includes(c.territory))return false;if(person.stages?.length&&!person.stages.some(x=>stageDone(x.circuitId,x.stageId)))return false;if(person.requiresKnown?.length&&!person.requiresKnown.every(id=>personState(id).known))return false;if(person.minDay&&c.day<person.minDay)return false;if(person.maxDay&&c.day>person.maxDay)return false;if(person.hours&&!(c.hour>=person.hours[0]&&c.hour<=person.hours[1]))return false;if(p.lastEncounterDay===c.day)return false;return true}
function choose(pool,extra={}){const list=(pool||[]).filter(x=>eligible(x,extra));if(!list.length)return null;const seed=hash([extra.seed||'',day(),extra.stageId||'',extra.placeId||''].join('|'));return list[seed%list.length]}
function encounter(person,kind='glimpse',meta={}){if(!person)return null;const p=personState(person.id);p.glimpses+=1;p.lastEncounterDay=day();if(kind==='meet'||kind==='talk'){p.met=true;p.known=true}else if(p.glimpses>=Number(person.knowAfter||2)){p.known=true}p.history.unshift({kind,day:day(),at:new Date().toISOString(),meta});p.history=p.history.slice(0,80);savePerson(person.id,p);const s=state();s.encounters.unshift({personId:person.id,kind,day:day(),at:new Date().toISOString(),meta});s.encounters=s.encounters.slice(0,300);write(KEY,s);window.dispatchEvent(new CustomEvent('hc-territorial-encounter',{detail:{person,kind,state:p,meta}}));return p}
function identity(person){const p=personState(person.id);if(p.known)return {name:person.name,role:person.role,known:true};if(p.met)return {name:person.firstName||person.name?.split(' ')[0]||'Quelqu’un',role:person.publicRole||'',known:false};return {name:'Quelqu’un',role:person.publicRole||'Personne aperçue dans le territoire',known:false}}
window.HCTerritorialPopulationV1={version:1,state,personState,eligible,choose,encounter,identity,stageDone,storageKey:KEY};
})();