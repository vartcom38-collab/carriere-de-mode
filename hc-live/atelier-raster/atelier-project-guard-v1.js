/* Haute Couture Live — garde-fou Projet actif v2 */
(function(){
'use strict';
if(window.__HC_ATELIER_PROJECT_GUARD_V2__)return;window.__HC_ATELIER_PROJECT_GUARD_V2__=true;
let neutralized=false;
function ws(){return window.HCAtelierProjectWorkspace}
function active(){return ws()?.active?.()||null}
function removeClientUi(){document.getElementById('hcSketchChosenModal')?.remove();document.getElementById('hcClientWorkflowV2')?.remove();document.querySelectorAll('#hcQuoteBreakdown,#hcRealiseFeedback').forEach(x=>x.remove())}
function neutralBrief(){const p=active();return{name:p?.name||'Création personnelle',garment:p?.name||'Création libre',occasion:p?.subtitle||'',style:'',paletteLiked:[],paletteAvoid:[],materialsPreferred:[],notes:p?.subtitle||'',budget:0,orderId:p?.id||''}}
function wrapPrompt(){const c=window.HCAtelierGenerationController;if(!c?.buildPrompt||c.__hcProjectPromptWrapped)return false;const orig=c.buildPrompt.bind(c);c.buildPrompt=function(b,m){const p=active();return orig(p&&p.type!=='client'?neutralBrief():b,m)};c.__hcProjectPromptWrapped=true;return true}
function neutralizeOnce(){if(neutralized||!ws()||active())return;neutralized=true;ws().clearVisualWorkspace?.();removeClientUi()}
document.addEventListener('click',e=>{const b=e.target.closest?.('.hcv3-generate');if(!b)return;if(active())return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();ws()?.openChooser?.()},true);
window.addEventListener('hc-atelier-sketch-selected',()=>{const p=active();if(p&&p.type!=='client')setTimeout(removeClientUi,0)});
window.addEventListener('hc-atelier-project-changed',()=>{neutralized=false;wrapPrompt();const p=active();if(!p||p.type!=='client')setTimeout(removeClientUi,0)});
window.addEventListener('hc-atelier-project-closed',()=>{neutralized=true;setTimeout(removeClientUi,0);setTimeout(removeClientUi,250)});
let n=0;const t=setInterval(()=>{n++;wrapPrompt();neutralizeOnce();if(ws()&&!active())removeClientUi();if(n>50)clearInterval(t)},120);
})();