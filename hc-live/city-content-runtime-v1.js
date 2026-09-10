/* Haute Couture Live — runtime contenu ville V1
   Consomme les banques ville via HCCityContentSelectorV1 et transforme l’exploration en rencontres / briefs / secrets / événements sans répétition immédiate.
*/
(function(){
'use strict';
if(window.__HCCityContentRuntimeV1)return;window.__HCCityContentRuntimeV1=true;
const KEY='haute-couture-city-runtime-v1';
const GAME='haute-couture-game-state-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
function state(){return read(KEY,{version:1,cities:{}})}
function save(s){write(KEY,s);return s}
function game(){try{return window.HCGame?.get?.()||read(GAME,{})||{}}catch(_){return read(GAME,{})||{}}}
function day(){return Number(game()?.clock?.day)||1}
function cityRecord(city){const s=state();s.cities[city]=s.cities[city]||{lastTriggerDay:0,observations:0,briefs:[],people:[],secrets:[],events:[]};save(s);return s.cities[city]}
function emit(detail){window.dispatchEvent(new CustomEvent('hc-territorial-signal',{detail}))}
function departmentCode(){return String(window.HCTerritoryContext?.getPresence?.()?.departmentCode||'')}
function triggerFromObservation(p){
 const city=String(p?.city||window.HCTerritoryContext?.getPresence?.()?.city||'');if(!city)return;
 const selector=window.HCCityContentSelectorV1;if(!selector?.bankFor?.(city))return;
 const rec=cityRecord(city);rec.observations=(rec.observations||0)+1;
 const today=day();const cooldown=today-(rec.lastTriggerDay||0);
 // Une observation nourrit toujours Book/Atelier via les moteurs départementaux ; les gros déclenchements restent espacés.
 if(cooldown<1&&rec.observations%3!==0){const s=state();s.cities[city]=rec;save(s);return;}
 const dept=departmentCode();
 // Rencontre contextuelle : pas à chaque clic.
 if(rec.observations%2===0){const person=selector.pickPerson(city,p?.cat||'exploration');if(person){rec.people.push(person.id);rec.people=rec.people.slice(-60);emit({kind:'phone_lead',departmentCode:dept,id:'city-person-'+person.id+'-'+today,city,title:`Une rencontre à ${city}`,personId:person.id,text:`${person.name||'Un contact local'} (${person.role||'réseau local'}) pourrait recroiser Marion plus tard.`,meta:{source:'city-bank',district:person.district||null}})}}
 // Brief : espacé et dépend du niveau via selector.
 if(rec.observations%3===0){const brief=selector.pickBrief(city,p?.cat||'general');if(brief){rec.briefs.push(brief.id);rec.briefs=rec.briefs.slice(-100);emit({kind:'agenda_opportunity',departmentCode:dept,id:'city-brief-'+brief.id,city,title:brief.title,systems:brief.systems||['Atelier','Book'],meta:{source:'city-bank',district:brief.district||null,level:brief.level||1}})}}
 // Secret : seulement après assez de visites selon la banque.
 if(rec.observations%4===0){const secret=selector.revealSecret(city);if(secret){rec.secrets.push(secret.id);emit({kind:'phone_rumor',departmentCode:dept,id:'city-secret-'+secret.id,city,title:secret.title,meta:{source:'city-bank',district:secret.district||null}})}}
 // Événement de saison : au plus une fois par jour et ville.
 if(cooldown>=1){const ed=selector.edition(city);if(ed&&!rec.events.includes(ed.editionId)){rec.events.push(ed.editionId);rec.events=rec.events.slice(-40);emit({kind:'phone_rumor',departmentCode:dept,id:'city-event-'+ed.editionId,city,title:`${ed.family||'Événement'} · ${ed.year}`,meta:{source:'city-bank',family:ed.family,fictionalFuture:ed.fictionalFuture}})}}
 rec.lastTriggerDay=today;const s=state();s.cities[city]=rec;save(s);
}
window.addEventListener('hc-territorial-place-observed',e=>triggerFromObservation(e.detail));
window.addEventListener('hc-territorial-person-interacted',e=>{const city=e.detail?.city;if(!city)return;const rec=cityRecord(city);if(e.detail?.person?.id&&!rec.people.includes(e.detail.person.id))rec.people.push(e.detail.person.id);const s=state();s.cities[city]=rec;save(s)});
window.HCCityContentRuntimeV1={version:1,state,cityRecord,triggerFromObservation};
})();