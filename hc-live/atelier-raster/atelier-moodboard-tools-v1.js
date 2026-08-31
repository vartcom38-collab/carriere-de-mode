/* Haute Couture Live — Atelier moodboard tools v1
   Outils de composition visuelle : selection, zoom, rotation, suppression.
*/
(function(){
'use strict';
if(window.__HC_MOODBOARD_TOOLS_V1__)return;window.__HC_MOODBOARD_TOOLS_V1__=true;
const KEY='haute-couture-moodboard-visual-state-v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return{}}};
const write=v=>{try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}};
let selected=null,tries=0;
function idFor(el,i){if(!el.dataset.hcVisualId)el.dataset.hcVisualId=el.dataset.catalogId||el.dataset.name||('mood-'+i+'-'+Date.now());return el.dataset.hcVisualId}
function stateOf(el){return{scale:Number(el.dataset.hcScale||1),rotate:Number(el.dataset.hcRotate||0)}}
function applyTransform(el){const s=stateOf(el);el.style.transform=`rotate(${s.rotate}deg) scale(${s.scale})`;el.style.transformOrigin='center center'}
function save(){const out={};document.querySelectorAll('#board .pieceCard,#board .hc-fixed-note,#board .hc-board-note').forEach((el,i)=>{const id=idFor(el,i),s=stateOf(el);out[id]={...s,left:el.style.left||'',top:el.style.top||''}});write(out);window.dispatchEvent(new CustomEvent('hc-atelier-moodboard-changed'))}
function restore(el,i){const st=read()[idFor(el,i)];if(!st)return;el.dataset.hcScale=String(st.scale||1);el.dataset.hcRotate=String(st.rotate||0);if(st.left)el.style.left=st.left;if(st.top)el.style.top=st.top;applyTransform(el)}
function select(el){if(selected===el)return;selected?.classList.remove('hc-mood-selected');selected=el||null;if(selected){selected.classList.add('hc-mood-selected');renderBar(true)}else renderBar(false)}
function change(ds,dr){if(!selected)return;let s=stateOf(selected);s.scale=Math.max(.55,Math.min(1.8,s.scale+ds));s.rotate=Math.max(-25,Math.min(25,s.rotate+dr));selected.dataset.hcScale=String(Number(s.scale.toFixed(2)));selected.dataset.hcRotate=String(Math.round(s.rotate));applyTransform(selected);save()}
function removeSelected(){if(!selected)return;const el=selected;select(null);const rm=el.querySelector('.hc-cat-remove');if(rm)rm.click();else{el.remove();save()}}
function resetSelected(){if(!selected)return;selected.dataset.hcScale='1';selected.dataset.hcRotate='0';applyTransform(selected);save()}
function renderBar(show){const bar=document.getElementById('hcMoodSelectionBar');if(bar)bar.classList.toggle('show',!!show)}
function controls(){if(document.getElementById('hcMoodSelectionBar'))return;const board=document.getElementById('board');if(!board)return;const bar=document.createElement('div');bar.id='hcMoodSelectionBar';bar.innerHTML='<span><b>Élément sélectionné</b> ajuste sa place sur ta planche</span><div><button data-a="minus">−</button><button data-a="plus">＋</button><button data-a="left">↶</button><button data-a="right">↷</button><button data-a="reset">Réinitialiser</button><button class="danger" data-a="delete">Supprimer</button></div>';board.parentElement.insertBefore(bar,board);bar.onclick=e=>{const a=e.target.closest('button')?.dataset.a;if(!a)return;if(a==='minus')change(-.1,0);if(a==='plus')change(.1,0);if(a==='left')change(0,-3);if(a==='right')change(0,3);if(a==='reset')resetSelected();if(a==='delete')removeSelected()}}
function bind(el,i){if(el.dataset.hcMoodTools)return;el.dataset.hcMoodTools='1';restore(el,i);el.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;select(el)});el.addEventListener('pointerup',()=>setTimeout(save,0))}
function scan(){document.querySelectorAll('#board .pieceCard,#board .hc-fixed-note,#board .hc-board-note').forEach(bind)}
function css(){if(document.getElementById('hcMoodboardToolsCss'))return;const s=document.createElement('style');s.id='hcMoodboardToolsCss';s.textContent=`
#hcMoodSelectionBar{display:none;align-items:center;justify-content:space-between;gap:12px;margin:0 0 8px;padding:8px 10px;border:1px solid #e6d7cb;border-radius:12px;background:#2b211c;color:#fff;box-shadow:0 8px 22px rgba(55,38,28,.08)}#hcMoodSelectionBar.show{display:flex}#hcMoodSelectionBar span{font:9px Arial;color:#d9cbc3}#hcMoodSelectionBar span b{display:block;font:13px Georgia,serif;color:#fff;margin-bottom:2px}#hcMoodSelectionBar div{display:flex;gap:5px;flex-wrap:wrap;justify-content:flex-end}#hcMoodSelectionBar button{border:1px solid #59483e;background:#fffaf5;color:#241c18;border-radius:999px;min-width:31px;padding:6px 9px;font:800 8px Arial;cursor:pointer}#hcMoodSelectionBar button.danger{background:#4b2d29;color:#fff;border-color:#6c3c35}.hc-mood-selected{outline:2px solid #d97d68!important;outline-offset:4px!important}.pieceCard,.hc-fixed-note,.hc-board-note{transition:transform .12s ease,outline .12s ease;transform-origin:center center}#board{touch-action:none}
`;document.head.appendChild(s)}
function boot(){tries++;const board=document.getElementById('board'),shell=document.getElementById('hcAtelierShellV2');if(!board||!shell){if(tries<100)setTimeout(boot,120);return}css();controls();scan();new MutationObserver(scan).observe(board,{childList:true,subtree:true});board.addEventListener('pointerdown',e=>{if(e.target===board||e.target.id==='drop')select(null)});window.addEventListener('beforeunload',save)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,120));else setTimeout(boot,120);
})();