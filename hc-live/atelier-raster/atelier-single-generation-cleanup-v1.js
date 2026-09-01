/* Haute Couture Live — cleanup génération unique v1
   Un seul CTA de génération, moodboard libre, aucune ancienne couche parasite.
*/
(function(){
'use strict';
if(window.__HC_SINGLE_GENERATION_CLEANUP_V1__)return;window.__HC_SINGLE_GENERATION_CLEANUP_V1__=true;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function clean(){
  // Ancien bloc de génération dans le brief : supprimé physiquement.
  $$('.brief .generateBox,.hcv3-brief-host .generateBox').forEach(x=>x.remove());
  ['generate','generateTop','styleLater'].forEach(id=>{const el=document.getElementById(id);if(el&&!el.closest('.hcv3-head'))el.remove()});

  // Anciennes aides visuelles de composition : elles ne font plus partie du moodboard moderne.
  $$('.hcz-board-label,#hcCompositionReadout').forEach(x=>x.remove());
  const board=$('#board');
  if(board){
    board.querySelectorAll('.hcz-board-label').forEach(x=>x.remove());
    // La silhouette centrale historique biaise la photo de référence : on ne la garde plus.
    board.querySelectorAll(':scope > .croquis').forEach(x=>x.remove());
  }

  // Il ne doit rester qu'un seul bouton visible qui lance les croquis : celui du header v3.
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
    #board{background:#fffaf5!important;border:1px solid #e4d7cd!important;box-shadow:0 12px 30px rgba(76,55,43,.07)!important}
    #board:before{content:""!important;position:absolute!important;inset:0!important;background:linear-gradient(180deg,rgba(255,255,255,.72),rgba(250,242,234,.34))!important;pointer-events:none!important}
    #board .hcz-board-label,#hcCompositionReadout,.brief .generateBox,.hcv3-brief-host .generateBox{display:none!important}
  `;
  document.head.appendChild(s);
}
function boot(){css();clean();new MutationObserver(()=>clean()).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1800));else setTimeout(boot,1800);
})();