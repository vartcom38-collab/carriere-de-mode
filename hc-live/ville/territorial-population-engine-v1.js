/* Haute Couture Live — moteur de population territoriale v2 */
(function(){
'use strict';
if(window.HCTerritorialPopulationV1)return;
const KEY='haute-couture-territorial-population-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
const hash=s=>{let h=2166136261;for(const c of String(s||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return Math.abs(h>>>0)};
function state(){const s=read(KEY,{version:2,people:{},encounters:[],known:[]});s.version=2;s.people=s.people||{};s.encounters=s.encounters||[];s.known=s.known||[];return s}
function personState(id){const s=state();return s.people[id]||{glimpses:0,met:false,known:false,lastEncounterDay:null,history:[]}}
function savePerson(id,p){const s=state();s.people[id]=p;if(p.known&&!s.known.includes(id))s.known.push(id);write(KEY,s);return p}
function day(){return Number(window.HCGame?.get?.()?.clock?.day||1)}
function currentPresence(){return window.HCPlayerResidenceV1?.getCurrentPresence?.()||read('haute-couture-current-territory-v1',null)||null}
function context(){const presence=currentPresence(),g=window.HCGame?.get?.()||{};return {day:day(),hour:Number(String(g?.clock?.iso||'').slice(11,13)||12),city:String(presence?.city||presence?.label||g?.player?.city||''),territory:String(presence?.territoryId||presence?.id||presence?.city||presence?.label||''),territoryType:String(presence?.territoryType||presence?.type||'locality'),presence,circuit:window.HCTerritorialCircuitEngineV1?.state?.()||null}}
function stageDone(circuitId,stageId){return !!window.HCTerritorialCircuitEngineV1?.circuitState?.(circuitId)?.stages?.[stageId]?.done}
function territoryMatches(person,c){if(!person.territories?.length)return true;const keys=new Set([c.territory,c.city,c.presence?.label,c.presence?.city].filter(Boolean).map(x=>String(x).toLowerCase()));return person.territories.some(t=>keys.has(String(t).toLowerCase()))}
function eligible(person,extra={}){const c={...context(),...extra},p=personState(person.id);if(!territoryMatches(person,c))return false;if(person.stages?.length&&!person.stages.some(x=>stageDone(x.circuitId,x.stageId)))return false;if(person.requiresKnown?.length&&!person.requiresKnown.every(id=>personState(id).known))return false;if(person.minDay&&c.day<person.minDay)return false;if(person.maxDay&&c.day>person.maxDay)return false;if(person.hours&&!(c.hour>=person.hours[0]&&c.hour<=person.hours[1]))return false;if(p.lastEncounterDay===c.day)return false;return true}
function choose(pool,extra={}){const list=(pool||[]).filter(x=>eligible(x,extra));if(!list.length)return null;const c=context(),seed=hash([extra.seed||'',day(),c.territory||c.city,extra.stageId||'',extra.placeId||''].join('|'));return list[seed%list.length]}
function encounter(person,kind='glimpse',meta={}){if(!person)return null;const p=personState(person.id),c=context();p.glimpses+=1;p.lastEncounterDay=day();if(kind==='meet'||kind==='talk'){p.met=true;p.known=true}else if(p.glimpses>=Number(person.knowAfter||2)){p.known=true}p.history.unshift({kind,day:day(),at:new Date().toISOString(),territory:c.territory||c.city,meta});p.history=p.history.slice(0,80);savePerson(person.id,p);const s=state();s.encounters.unshift({personId:person.id,kind,day:day(),at:new Date().toISOString(),territory:c.territory||c.city,meta});s.encounters=s.encounters.slice(0,300);write(KEY,s);window.dispatchEvent(new CustomEvent('hc-territorial-encounter',{detail:{person,kind,state:p,context:c,meta}}));return p}
function identity(person){const p=personState(person.id);if(p.known)return {name:person.name,role:person.role,known:true};if(p.met)return {name:person.firstName||person.name?.split(' ')[0]||'Quelqu’un',role:person.publicRole||'',known:false};return {name:'Quelqu’un',role:person.publicRole||'Personne aperçue dans le territoire',known:false}}
function refresh(){window.dispatchEvent(new CustomEvent('hc-territorial-population-context',{detail:context()}))}
['hc-presence-changed','hc-residence-changed','hc-local-life-context-changed'].forEach(ev=>window.addEventListener(ev,refresh));
window.HCTerritorialPopulationV1={version:2,state,personState,eligible,choose,encounter,identity,stageDone,context,currentPresence,refresh,storageKey:KEY};
})();