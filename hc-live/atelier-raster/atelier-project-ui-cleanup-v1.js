/* Haute Couture Live — nettoyage UI selon projet actif v1 */
(function(){
'use strict';
if(window.__HC_ATELIER_PROJECT_UI_CLEANUP_V1__)return;window.__HC_ATELIER_PROJECT_UI_CLEANUP_V1__=true;
const ACTIVE='haute-couture-atelier-active-project-v1';
const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??f}catch(_){return f}};
function active(){return read(ACTIVE,null)}
function cleanup(){
 const p=active();
 const isClient=p?.type==='client';
 const head=document.querySelector('.hcv3-brief-head');
 if(head){const k=head.querySelector('small'),h=head.querySelector('h2');if(isClient){if(k)k.textContent='COMMANDE CLIENT';if(h)h.textContent='Le brief'}else if(p){if(k)k.textContent=p.type==='personal'?'PROJET PERSONNEL':'PROJET CRÉATIF';if(h)h.textContent='Mon projet'}else{if(k)k.textContent='ATELIER';if(h)h.textContent='Projet actif'}}
 if(!isClient){
   document.getElementById('hcClientWorkflowV2')?.remove();
   document.getElementById('hcSketchChosenModal')?.remove();
   document.querySelectorAll('#hcQuoteBreakdown,#hcRealiseFeedback').forEach(x=>x.remove());
   document.querySelectorAll('.hcv3-center > section').forEach(x=>{if(/SUIVI COMMANDE|production_scheduled|PRODUCTION PLANIFIÉE/i.test(x.textContent||''))x.remove()});
 }
}
['hc-atelier-project-changed','hc-atelier-project-closed','hc-client-order','hc-production-scheduled','hc-game-state'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(cleanup,0)));
let n=0;const t=setInterval(()=>{n++;cleanup();if(n>=80)clearInterval(t)},125);
window.HCAtelierProjectUiCleanup={version:1,cleanup,active};
})();