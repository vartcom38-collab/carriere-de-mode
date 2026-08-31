/* Haute Couture Live — Atelier pointer drag v1
   Source visible shell -> board, independent from browser HTML5 drag/drop.
*/
(function(){
'use strict';
if(window.__HC_ATELIER_POINTER_DRAG_V1__)return;window.__HC_ATELIER_POINTER_DRAG_V1__=true;
let drag=null,ghost=null,moved=false;
const $=s=>document.querySelector(s);
function boardApi(){return window.HCAtelierBoardComponents}
function boardEl(){return $('#board')}
function cleanup(){
  ghost?.remove();ghost=null;drag=null;moved=false;
  document.body.classList.remove('hc-pointer-library-dragging');
  boardEl()?.classList.remove('hc-board-dragover');
}
function makeGhost(source){
  const g=source.cloneNode(true);g.removeAttribute('id');g.removeAttribute('draggable');
  Object.assign(g.style,{position:'fixed',left:'0',top:'0',width:Math.max(120,source.getBoundingClientRect().width)+'px',zIndex:'999999',pointerEvents:'none',opacity:'.88',transform:'translate(-50%,-50%) rotate(-2deg)',boxShadow:'0 18px 45px rgba(30,20,15,.22)'});
  g.classList.add('hc-pointer-drag-ghost');document.body.appendChild(g);return g;
}
function itemFromTarget(target){
  const el=target.closest?.('.hcv2-item[data-kind="catalog"],.hcl-card[data-item],.hc-variant-drag');if(!el)return null;
  let id=el.dataset.id||el.dataset.item||null,referenceId=el.dataset.referenceId||el.dataset.variantId||null;
  if(el.classList.contains('hc-variant-drag')){
    const detail=el.closest('.hcl-detail');id=id||detail?.dataset.item||detail?.dataset.id||null;
    referenceId=referenceId||el.dataset.ref||null;
  }
  if(!id)return null;return{el,id,referenceId};
}
function onDown(e){
  if(e.button!=null&&e.button!==0)return;
  const item=itemFromTarget(e.target);if(!item)return;
  drag={...item,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY};moved=false;
}
function onMove(e){
  if(!drag||e.pointerId!==drag.pointerId)return;
  drag.x=e.clientX;drag.y=e.clientY;
  if(!moved&&Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)<7)return;
  if(!moved){moved=true;ghost=makeGhost(drag.el);document.body.classList.add('hc-pointer-library-dragging')}
  e.preventDefault();
  if(ghost){ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px'}
  const b=boardEl();if(!b)return;const r=b.getBoundingClientRect();const inside=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;b.classList.toggle('hc-board-dragover',inside);
}
async function onUp(e){
  if(!drag||e.pointerId!==drag.pointerId){return}
  const current={...drag};const didMove=moved;const b=boardEl();
  if(!didMove||!b){cleanup();return}
  e.preventDefault();e.stopPropagation();
  const r=b.getBoundingClientRect();const inside=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;
  if(inside&&boardApi()?.addToBoard){
    const x=e.clientX-r.left-82,y=e.clientY-r.top-80;
    try{await boardApi().addToBoard(current.id,{referenceId:current.referenceId||null,x,y});boardApi().sync?.();window.dispatchEvent(new CustomEvent('hc-atelier-moodboard-changed'))}catch(err){console.error('[Atelier pointer drag] drop failed',err)}
  }
  cleanup();
}
function css(){if($('#hcPointerDragStyle'))return;const s=document.createElement('style');s.id='hcPointerDragStyle';s.textContent='.hcv2-item[data-kind="catalog"],.hcl-card[data-item],.hc-variant-drag{touch-action:none;user-select:none;-webkit-user-drag:none}.hc-pointer-library-dragging{cursor:grabbing!important}.hc-pointer-library-dragging *{cursor:grabbing!important}';document.head.appendChild(s)}
function boot(){if(!boardEl()||!boardApi()?.addToBoard){setTimeout(boot,100);return}css();document.addEventListener('pointerdown',onDown,true);document.addEventListener('pointermove',onMove,{capture:true,passive:false});document.addEventListener('pointerup',onUp,true);document.addEventListener('pointercancel',cleanup,true);window.addEventListener('blur',cleanup);console.info('[Atelier] pointer drag v1 ready')}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,300));else setTimeout(boot,300);
})();