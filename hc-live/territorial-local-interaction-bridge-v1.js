/* Haute Couture Live — pont d’interaction carte locale V1
   Observer un lieu nourrit le parcours ; rencontrer un personnage fictif reste une action explicite et mémorisée.
*/
(function(){
'use strict';
if(window.__HCTerritorialLocalInteractionBridgeV1)return;window.__HCTerritorialLocalInteractionBridgeV1=true;
const ctx=window.HCTerritoryContext;
function engineFor(code){if(code==='01')return window.HCAinTerritorialGameplay||window.HCAinTerritorialGameplayV1;if(code==='03')return window.HCAllierTerritorialGameplay;return null}
function personFor(engine,p){if(!engine||!p)return null;const list=engine.people||[];return list.find(x=>x.id===p.personId)||list.find(x=>x.city===p.city&&String(p.name||'').toLowerCase().includes(String(x.role||'').split(' ')[0].toLowerCase()))||null}
function injectPersonActions(p){if(!p?.fictional)return;const code=String(p.dept||p.departmentCode||ctx?.getPresence?.()?.departmentCode||''),engine=engineFor(code),person=personFor(engine,p);if(!engine||!person||typeof engine.meet!=='function')return;const box=document.querySelector('.guide-actions');if(!box||box.querySelector('[data-hc-territorial-person]'))return;const hello=document.createElement('button');hello.dataset.hcTerritorialPerson='hello';hello.className='visit';hello.textContent='SE PRÉSENTER';const work=document.createElement('button');work.dataset.hcTerritorialPerson='work';work.className='visit';work.textContent='PARLER DE MON TRAVAIL';box.insertBefore(work,box.firstChild);box.insertBefore(hello,box.firstChild);const update=()=>{const r=engine.personRecord?.(person)||null;if(r?.met)hello.textContent='REPRENDRE CONTACT';if(r?.professionalOpen)work.textContent='LIEN PRO OUVERT'};hello.onclick=e=>{e.preventDefault();engine.meet(person.id,'hello');update()};work.onclick=e=>{e.preventDefault();engine.meet(person.id,'work');update()};update()}
function wrap(){const original=window.HCLocalMapOpenGuide;if(typeof original!=='function'||original.__hcTerritorialWrapped)return false;function wrapped(p){const r=original(p);try{window.dispatchEvent(new CustomEvent('hc-territorial-place-observed',{detail:p}));setTimeout(()=>injectPersonActions(p),0)}catch(_){}return r}wrapped.__hcTerritorialWrapped=true;window.HCLocalMapOpenGuide=wrapped;return true}
let tries=0;const timer=setInterval(()=>{tries++;if(wrap()||tries>80)clearInterval(timer)},100);
})();