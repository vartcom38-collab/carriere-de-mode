/* Haute Couture Live — pont d’interaction carte locale V2
   Observer un lieu nourrit le parcours ; rencontrer un personnage fictif reste une action explicite et mémorisée.
   Généralisé à tous les départements territoriaux déjà branchés.
*/
(function(){
'use strict';
if(window.__HCTerritorialLocalInteractionBridgeV2)return;window.__HCTerritorialLocalInteractionBridgeV2=true;
const ctx=window.HCTerritoryContext;
function engineFor(code){
 const map={
  '01':()=>window.HCAinTerritorialGameplay||window.HCAinTerritorialGameplayV1,
  '03':()=>window.HCAllierTerritorialGameplay,
  '15':()=>window.HCCantalTerritorialGameplay,
  '42':()=>window.HCLoireTerritorialGameplay,
  '43':()=>window.HCHauteLoireTerritorialGameplay,
  '63':()=>window.HCPuyDeDomeTerritorialGameplay,
  '69':()=>window.HCRhoneTerritorialGameplay
 };
 return map[String(code||'')]?.()||null;
}
function personFor(engine,p){if(!engine||!p)return null;const list=engine.people||[];return list.find(x=>x.id===p.personId)||list.find(x=>x.city===p.city&&String(p.name||'').toLowerCase().includes(String(x.name||x.role||'').split(' ')[0].toLowerCase()))||null}
function recordFor(engine,person){if(!engine||!person)return null;if(typeof engine.personRecord==='function')return engine.personRecord(person);try{return engine.state?.()?.people?.[person.id]||null}catch(_){return null}}
function injectPersonActions(p){
 if(!p?.fictional)return;
 const code=String(p.dept||p.departmentCode||ctx?.getPresence?.()?.departmentCode||''),engine=engineFor(code),person=personFor(engine,p);
 if(!engine||!person||typeof engine.meet!=='function')return;
 const box=document.querySelector('.guide-actions');if(!box||box.querySelector('[data-hc-territorial-person]'))return;
 const hello=document.createElement('button');hello.dataset.hcTerritorialPerson='hello';hello.className='visit';hello.textContent='SE PRÉSENTER';
 const work=document.createElement('button');work.dataset.hcTerritorialPerson='work';work.className='visit';work.textContent='PARLER DE MON TRAVAIL';
 box.insertBefore(work,box.firstChild);box.insertBefore(hello,box.firstChild);
 const update=()=>{const r=recordFor(engine,person);if(r?.met)hello.textContent='REPRENDRE CONTACT';if(r?.professionalOpen){work.textContent='LIEN PRO OUVERT';work.disabled=true}}
 hello.onclick=e=>{e.preventDefault();const r=engine.meet(person.id,'hello');window.dispatchEvent(new CustomEvent('hc-territorial-person-interacted',{detail:{departmentCode:code,city:person.city,person,action:'hello',record:r}}));update()};
 work.onclick=e=>{e.preventDefault();const r=engine.meet(person.id,'work');window.dispatchEvent(new CustomEvent('hc-territorial-person-interacted',{detail:{departmentCode:code,city:person.city,person,action:'work',record:r}}));update()};
 update();
}
function wrap(){const original=window.HCLocalMapOpenGuide;if(typeof original!=='function'||original.__hcTerritorialWrapped)return false;function wrapped(p){const r=original(p);try{window.dispatchEvent(new CustomEvent('hc-territorial-place-observed',{detail:p}));setTimeout(()=>injectPersonActions(p),0)}catch(_){}return r}wrapped.__hcTerritorialWrapped=true;window.HCLocalMapOpenGuide=wrapped;return true}
let tries=0;const timer=setInterval(()=>{tries++;if(wrap()||tries>80)clearInterval(timer)},100);
window.HCTerritorialLocalInteractionBridge={version:2,engineFor,personFor,recordFor,injectPersonActions};
})();