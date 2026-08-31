/* Haute Couture Live — Atelier pointer drag v4
   Drag visible sidebar -> board. Robust drop + fallback from the visible unlocked card.
*/
(function(){
'use strict';
if(window.__HC_ATELIER_POINTER_DRAG_V4__)return;window.__HC_ATELIER_POINTER_DRAG_V4__=true;
let drag=null,ghost=null,moved=false,z=700;
const $=s=>document.querySelector(s);
const SOURCE_SELECTOR='.hcf-card[data-id],.hcv2-item[data-kind="catalog"],.hcl-card[data-item],.hc-variant-drag';
function boardApi(){return window.HCAtelierBoardComponents}
function boardEl(){return $('#board')}
function dropEl(){return $('#drop')}
function toast(t){const n=$('#toast');if(!n)return;n.textContent=t;n.classList.add('show');setTimeout(()=>n.classList.remove('show'),1800)}
function cleanup(){ghost?.remove();ghost=null;drag=null;moved=false;document.body.classList.remove('hc-pointer-library-dragging');boardEl()?.classList.remove('hc-board-dragover')}
function makeGhost(source){const g=source.cloneNode(true);g.removeAttribute('id');g.removeAttribute('draggable');Object.assign(g.style,{position:'fixed',left:'0',top:'0',width:Math.max(120,source.getBoundingClientRect().width)+'px',zIndex:'999999',pointerEvents:'none',opacity:'.9',transform:'translate(-50%,-50%) rotate(-2deg)',boxShadow:'0 18px 45px rgba(30,20,15,.22)'});g.classList.add('hc-pointer-drag-ghost');document.body.appendChild(g);return g}
function itemFromTarget(target){const el=target.closest?.(SOURCE_SELECTOR);if(!el)return null;let id=el.dataset.id||el.dataset.item||null,referenceId=el.dataset.referenceId||el.dataset.variantId||null;if(el.classList.contains('hc-variant-drag')){const detail=el.closest('.hcl-detail');id=id||detail?.dataset.item||detail?.dataset.id||null;referenceId=referenceId||el.dataset.ref||null}if(!id)return null;return{el,id,referenceId}}
function disableOne(el){if(!el||el.dataset.hcPointerOwned==='1')return;el.dataset.hcPointerOwned='1';el.draggable=false;el.removeAttribute('draggable');el.ondragstart=null;el.ondragend=null;el.addEventListener('dragstart',e=>e.preventDefault(),{capture:true});el.style.touchAction='none';el.style.userSelect='none';el.style.webkitUserDrag='none'}
function disableNativeDrag(root=document){if(root.matches?.(SOURCE_SELECTOR))disableOne(root);root.querySelectorAll?.(SOURCE_SELECTOR).forEach(disableOne)}
function pointInsideBoard(x,y,b){if(!b)return false;const r=b.getBoundingClientRect();const byRect=x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;const hit=document.elementFromPoint(x,y);return byRect||!!hit?.closest?.('#board')}
function fallbackAppend(current,x,y){
 const b=boardEl(),drop=dropEl();if(!b||!drop)return false;
 const item=window.HCAtelierCatalog?.byId?.(current.id)||null;
 const srcImg=current.el.querySelector('img')?.src||'';
 const label=current.el.querySelector('b')?.textContent?.trim()||item?.name||'Élément';
 const card=document.createElement('div');card.className='pieceCard hc-cat-card';card.dataset.move='';card.dataset.instanceId=(crypto?.randomUUID?.()||('mb-'+Date.now()+'-'+Math.random().toString(36).slice(2)));card.dataset.catalogId=current.id;card.dataset.name=item?.name||label;card.dataset.category=item?.category||'catalog';card.dataset.tier=String(item?.tier||1);card.dataset.hcScale='1';card.dataset.hcRotate='0';card.dataset.image=srcImg;
 if(current.referenceId){card.dataset.referenceId=current.referenceId;card.dataset.variantId=current.referenceId;card.dataset.referenceLabel=label}
 const r=b.getBoundingClientRect(),maxX=Math.max(0,b.clientWidth-184),maxY=Math.max(0,b.clientHeight-210);card.style.left=Math.max(0,Math.min(maxX,x-r.left-82))+'px';card.style.top=Math.max(0,Math.min(maxY,y-r.top-80))+'px';card.style.zIndex=String(++z);
 card.innerHTML='<button class="hc-cat-remove" type="button" title="Retirer">×</button>'+(srcImg?'<img src="'+srcImg.replace(/"/g,'&quot;')+'" alt="">':'<div style="height:118px;border-radius:9px;background:#f5ede6;display:grid;place-items:center;font:italic 12px Georgia,serif;color:#8a786d">Référence visuelle</div>')+'<div class="hc-cat-k">'+String(item?.category||'COMPOSANT').toUpperCase()+'</div><b>'+label.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))+'</b>';
 card.querySelector('.hc-cat-remove').onclick=e=>{e.stopPropagation();card.remove();boardApi()?.sync?.();window.dispatchEvent(new CustomEvent('hc-atelier-moodboard-changed'))};
 drop.appendChild(card);boardApi()?.sync?.();window.dispatchEvent(new CustomEvent('hc-atelier-moodboard-changed'));window.dispatchEvent(new CustomEvent('hc-atelier-component-added',{detail:{item,referenceId:current.referenceId||null,element:card,fallback:true}}));toast(label+' ajouté à la planche');return true
}
function onDown(e){if(e.button!=null&&e.button!==0)return;const item=itemFromTarget(e.target);if(!item)return;e.preventDefault();e.stopPropagation();disableOne(item.el);drag={...item,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY};moved=false;try{item.el.setPointerCapture?.(e.pointerId)}catch(_){}}
function onMove(e){if(!drag||e.pointerId!==drag.pointerId)return;drag.x=e.clientX;drag.y=e.clientY;if(!moved&&Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)<5)return;if(!moved){moved=true;ghost=makeGhost(drag.el);document.body.classList.add('hc-pointer-library-dragging')}e.preventDefault();e.stopPropagation();if(ghost){ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px'}const b=boardEl();if(!b)return;b.classList.toggle('hc-board-dragover',pointInsideBoard(e.clientX,e.clientY,b))}
async function onUp(e){
 if(!drag||e.pointerId!==drag.pointerId)return;const current={...drag},didMove=moved,b=boardEl();e.preventDefault();e.stopPropagation();
 if(!didMove||!b){cleanup();return}
 const x=e.clientX,y=e.clientY,inside=pointInsideBoard(x,y,b);let ok=false;
 if(inside){
  try{if(boardApi()?.addToBoard){const r=b.getBoundingClientRect();ok=!!(await boardApi().addToBoard(current.id,{referenceId:current.referenceId||null,x:x-r.left-82,y:y-r.top-80}))}}catch(err){console.error('[Atelier pointer drag] API drop failed',err)}
  if(!ok)ok=fallbackAppend(current,x,y);
  if(ok){boardApi()?.sync?.();window.dispatchEvent(new CustomEvent('hc-atelier-moodboard-changed'))}else toast('Impossible d’ajouter cet élément à la planche')
 }
 cleanup();
}
function css(){if($('#hcPointerDragStyle'))return;const s=document.createElement('style');s.id='hcPointerDragStyle';s.textContent=SOURCE_SELECTOR+'{touch-action:none!important;user-select:none!important;-webkit-user-drag:none!important;cursor:grab!important}.hc-pointer-library-dragging{cursor:grabbing!important}.hc-pointer-library-dragging *{cursor:grabbing!important}';document.head.appendChild(s)}
function boot(){if(!boardEl()||!dropEl()||!boardApi()?.sync){setTimeout(boot,100);return}css();disableNativeDrag();new MutationObserver(muts=>{for(const m of muts){for(const n of m.addedNodes){if(n.nodeType===1)disableNativeDrag(n)}}}).observe(document.body,{childList:true,subtree:true});document.addEventListener('pointerdown',onDown,true);document.addEventListener('pointermove',onMove,{capture:true,passive:false});document.addEventListener('pointerup',onUp,true);document.addEventListener('pointercancel',e=>{if(drag&&e.pointerId===drag.pointerId)cleanup()},true);window.addEventListener('blur',cleanup);console.info('[Atelier] pointer drag v4 ready')}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,300));else setTimeout(boot,300);
})();