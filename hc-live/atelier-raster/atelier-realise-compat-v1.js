/* Haute Couture Live — realisation compatibility v1
   Le nouveau moodboard stocke components; le preflight historique attend pieces.
*/
(function(){
'use strict';
if(window.__HC_REALISE_COMPAT_V1__)return;window.__HC_REALISE_COMPAT_V1__=true;
const BOARD_KEY='haute-couture-atelier-board-v2';
function patchBoard(){const ctl=window.HCAtelierGenerationController;const m=ctl?.extractMoodboardState?.();if(!m)return;let board={};try{board=JSON.parse(localStorage.getItem(BOARD_KEY)||'{}')||{}}catch(_){board={}}board.components=m.items||board.components||[];board.pieces=m.garments||[];board.moodMaterials=m.materials||[];board.moodColors=m.colors||[];board.moodPatterns=m.patterns||[];board.moodNotes=m.notes||[];board.updatedAt=new Date().toISOString();try{localStorage.setItem(BOARD_KEY,JSON.stringify(board))}catch(_){}}
document.addEventListener('click',e=>{if(e.target.closest?.('#hcGcRealise'))patchBoard()},true);window.addEventListener('hc-atelier-sketch-selected',patchBoard);window.addEventListener('hc-atelier-moodboard-changed',patchBoard);window.HCAtelierRealiseCompat={patchBoard};
})();