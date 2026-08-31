/* Haute Couture Live — final sidebar direct drop v1
   Direct pointer gesture bound to the actual .hcf-card elements rendered last.
*/
(function(){
'use strict';
if(window.__HC_FINAL_CARD_DROP_V1__)return;window.__HC_FINAL_CARD_DROP_V1__=true;
let state=null,ghost=null;
const qs=s=>document.querySelector(s);
function toast(msg){const n=qs('#toast');if(!n)return;n.textContent=msg;n.classList.add('show');setTimeout(()=>n.classList.remove('show'),1800)}
function board(){return qs('#board')}
function api(){return window.HCAtelierBoardComponents}
function endVisual(){ghost?.remove();ghost=null;board()?.classList.remove('hc-board-dragover');document.body.classList.remove('hc-final-card-dragging')}
function makeGhost(card,x,y){const g=card.cloneNode(true);g.removeAttribute('draggable');Object.assign(g.style,{position:'fixed',left:x+'px',top:y+'px',width:Math.max(120,card.getBoundingClientRect().width)+'px',zIndex:'1000000',pointerEvents:'none',opacity:'.92',transform:'translate(-50%,-50%) rotate(-2deg)',boxShadow:'0 18px 42px rgba(30,20,15,.25)'});document.body.appendChild(g);return g}
async function dropNow(card,x,y){const b=board(),a=api();if(!b||!a?.addToBoard){toast('Planche indisponible');return false}const r=b.getBoundingClientRect();const hit=document.elementFromPoint(x,y);const inside=(hit&&(hit===b||hit.closest?.('#board')))||(x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom);if(!inside)return false;const id=card.dataset.id,referenceId=card.dataset.referenceId||null;const px=x-r.left-82,py=y-r.top-80;try{const ok=await a.addToBoard(id,{referenceId,x:px,y:py});if(ok){a.sync?.();window.dispatchEvent(new CustomEvent('hc-atelier-moodboard-changed'));toast('Ajouté à la planche');return true}toast('Cet élément n’a pas pu être ajouté');return false}catch(err){console.error('[Atelier final drop]',err);toast('Erreur pendant le dépôt');return false}}
function bindCard(card){if(card.dataset.hcFinalDrop==='1')return;card.dataset.hcFinalDrop='1';card.draggable=false;card.removeAttribute('draggable');card.style.touchAction='none';card.style.userSelect='none';card.ondragstart=null;card.ondragend=null;
 card.addEventListener('pointerdown',e=>{if(e.button!=null&&e.button!==0)return;e.preventDefault();e.stopPropagation();state={card,id:e.pointerId,sx:e.clientX,sy:e.clientY,moved:false};try{card.setPointerCapture?.(e.pointerId)}catch(_){}} ,true);
 card.addEventListener('pointermove',e=>{if(!state||state.card!==card||e.pointerId!==state.id)return;const d=Math.hypot(e.clientX-state.sx,e.clientY-state.sy);if(!state.moved&&d<4)return;if(!state.moved){state.moved=true;ghost=makeGhost(card,e.clientX,e.clientY);document.body.classList.add('hc-final-card-dragging')}e.preventDefault();e.stopPropagation();if(ghost){ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px'}const b=board();if(b){const r=b.getBoundingClientRect();b.classList.toggle('hc-board-dragover',e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)}} ,{capture:true,passive:false});
 card.addEventListener('pointerup',async e=>{if(!state||state.card!==card||e.pointerId!==state.id)return;const moved=state.moved;e.preventDefault();e.stopPropagation();if(moved)await dropNow(card,e.clientX,e.clientY);state=null;endVisual()} ,true);
 card.addEventListener('pointercancel',()=>{state=null;endVisual()},true);
}
function scan(root=document){if(root.matches?.('.hcf-card[data-id]'))bindCard(root);root.querySelectorAll?.('.hcf-card[data-id]').forEach(bindCard)}
function boot(){scan();new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n)}))).observe(document.body,{childList:true,subtree:true});setInterval(scan,700);console.info('[Atelier] final card direct drop v1 ready')}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1400));else setTimeout(boot,1400);
})();