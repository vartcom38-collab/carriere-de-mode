/* Haute Couture Live — cleanup génération unique v2
   Nettoyage immédiat et léger : aucune surveillance globale du DOM.
*/
(function(){
'use strict';
if(window.__HC_SINGLE_GENERATION_CLEANUP_V2__)return;window.__HC_SINGLE_GENERATION_CLEANUP_V2__=true;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function clean(){
  $$('.brief .generateBox,.hcv3-brief-host .generateBox').forEach(x=>x.remove());
  ['generate','generateTop','styleLater'].forEach(id=>{const el=document.getElementById(id);if(el&&!el.closest('.hcv3-head'))el.remove()});
  $$('.hcz-board-label,#hcCompositionReadout').forEach(x=>x.remove());
  const board=$('#board');
  if(board){
    board.querySelectorAll(':scope > .croquis,.croquis').forEach(x=>x.remove());
    board.querySelectorAll('.hcz-board-label').forEach(x=>x.remove());
  }
  const main=$('.hcv3-generate');
  $$('button').forEach(b=>{
    if(b===main)return;
    const t=(b.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(t.includes('générer')&&t.includes('croquis')){
      const box=b.closest('.generateBox');
      if(box)box.remove();else if(!b.closest('.hcv3-head'))b.remove();
    }
  });
}
function css(){
  if($('#hcSingleGenerationCleanupCss'))return;
  const s=document.createElement('style');s.id='hcSingleGenerationCleanupCss';
  s.textContent=`
    #board>.croquis,#board .croquis{display:none!important;visibility:hidden!important;opacity:0!important}
    #board{background:#fffaf5!important;border:1px solid #e4d7cd!important;box-shadow:0 12px 30px rgba(76,55,43,.07)!important}
    #board:before{content:""!important;position:absolute!important;inset:0!important;background:linear-gradient(180deg,rgba(255,255,255,.72),rgba(250,242,234,.34))!important;pointer-events:none!important}
    #board .hcz-board-label,#hcCompositionReadout,.brief .generateBox,.hcv3-brief-host .generateBox{display:none!important}
  `;
  document.head.appendChild(s);
}
function loadSplitGeneration(){
  if(document.querySelector('script[data-hc-split-generation-v1]'))return;
  const s=document.createElement('script');
  s.src='./atelier-generation-split-v1.js?v=20260901-split1';
  s.defer=true;
  s.setAttribute('data-hc-split-generation-v1','1');
  document.head.appendChild(s);
}
function boot(){css();clean();loadSplitGeneration();requestAnimationFrame(clean);setTimeout(clean,500);setTimeout(clean,1500)}
// Exécution immédiate : la silhouette ne doit pas flasher à l'ouverture.
css();clean();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();