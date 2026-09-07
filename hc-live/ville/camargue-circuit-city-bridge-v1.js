/* Haute Couture Live — pont Ville de Nîmes → Grand circuit de Camargue v1 */
(function(){
'use strict';
if(window.HCCamargueCircuitCityBridgeV1)return;
function inject(){
 const box=document.querySelector('.buttons')||document.querySelector('.panel');
 if(!box||box.querySelector('[data-hc-camargue-circuit]'))return;
 const b=document.createElement('button');
 b.type='button';b.dataset.hcCamargueCircuit='1';
 b.style.cssText='grid-column:1/-1;border:0;border-radius:12px;padding:12px 14px;background:#7f3742;color:#fff;font:900 10px Arial;letter-spacing:.05em;cursor:pointer;margin-top:4px';
 const refresh=()=>{const p=window.HCTerritorialCircuitEngineV1?.progress?.('camargue-grand-circuit-v1')||{done:0,total:9,completed:false};b.textContent=p.completed?'CAMARGUE · PARCOURS DÉJÀ VÉCU':'EXCURSION CAMARGUE · '+(p.done?`REPRENDRE ${p.done}/${p.total}`:'COMMENCER')};
 refresh();
 b.onclick=()=>window.HCTerritorialCircuitUIV1?.open?.('camargue-grand-circuit-v1');
 box.appendChild(b);
 window.addEventListener('hc-circuit-stage',refresh);
 window.addEventListener('hc-circuit-complete',refresh);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(inject,500));else setTimeout(inject,500);
new MutationObserver(inject).observe(document.documentElement,{childList:true,subtree:true});
window.HCCamargueCircuitCityBridgeV1={version:1,inject};
})();