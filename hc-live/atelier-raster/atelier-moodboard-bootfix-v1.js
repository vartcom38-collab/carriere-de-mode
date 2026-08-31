/* Haute Couture Live — moodboard boot fix v1
   Attend que la coque Atelier soit réellement construite avant d'appliquer la direction moodboard.
*/
(function(){
'use strict';
if(window.__HC_MOODBOARD_BOOTFIX_V1__)return;
window.__HC_MOODBOARD_BOOTFIX_V1__=true;
let tries=0;
function apply(){
  tries++;
  const board=document.getElementById('board');
  const shell=document.getElementById('hcAtelierShellV2');
  if(!board||!shell){if(tries<80)setTimeout(apply,150);return;}
  document.body.classList.add('hc-moodboard-ready');
  const center=document.querySelector('.hcv2-center-head');
  if(center){
    const small=center.querySelector('small');
    const h2=center.querySelector('h2');
    const p=center.querySelector('p');
    if(small)small.textContent='MOODBOARD / DIRECTION CRÉATIVE';
    if(h2)h2.textContent='Ma planche d’inspiration';
    if(p)p.textContent='Glisse ici tes références, matières, détails, couleurs et idées. Leur placement fait partie de ta direction créative.';
  }
  const left=document.querySelector('.hcv2-left-top');
  if(left){
    const small=left.querySelector('small');
    const h2=left.querySelector('h2');
    const p=left.querySelector('p');
    if(small)small.textContent='BIBLIOTHÈQUE CRÉATIVE';
    if(h2)h2.textContent='Inspirations & éléments';
    if(p)p.textContent='Tout ce que tu connais ou débloques peut nourrir ta planche.';
  }
  document.querySelectorAll('#board *').forEach(el=>{
    const t=(el.textContent||'').trim().toUpperCase();
    if((t==='FORMES'||t==='CONSTRUCTION')&&el.children.length===0)el.style.display='none';
  });
  let toolbar=document.getElementById('hcMoodboardToolbarFixed');
  if(!toolbar){
    toolbar=document.createElement('div');
    toolbar.id='hcMoodboardToolbarFixed';
    toolbar.innerHTML='<div><b>Composer mon moodboard</b><span>Placement libre · références · matières · notes</span></div><div><button type="button" id="hcAddMoodNote">+ NOTE</button></div>';
    board.parentElement.insertBefore(toolbar,board);
    document.getElementById('hcAddMoodNote').onclick=function(){
      const n=document.createElement('div');
      n.className='hc-fixed-note';
      n.contentEditable='true';
      n.textContent='Nouvelle idée…';
      n.style.left='42%';n.style.top='28%';
      board.appendChild(n);
      let drag=false,ox=0,oy=0;
      n.addEventListener('pointerdown',e=>{drag=true;const r=n.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;n.setPointerCapture?.(e.pointerId)});
      n.addEventListener('pointermove',e=>{if(!drag)return;const r=board.getBoundingClientRect();n.style.left=Math.max(8,Math.min(r.width-n.offsetWidth-8,e.clientX-r.left-ox))+'px';n.style.top=Math.max(8,Math.min(r.height-n.offsetHeight-8,e.clientY-r.top-oy))+'px'});
      n.addEventListener('pointerup',()=>drag=false);
    };
  }
  if(!document.getElementById('hcMoodboardBootfixCss')){
    const s=document.createElement('style');s.id='hcMoodboardBootfixCss';s.textContent=`
#hcMoodboardToolbarFixed{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:0 0 10px;padding:10px 12px;border:1px solid #e6d7cb;border-radius:14px;background:#fffdf9;box-shadow:0 8px 22px rgba(74,50,35,.05)}
#hcMoodboardToolbarFixed b{display:block;font:700 16px Georgia,serif;color:#2b211c}#hcMoodboardToolbarFixed span{font:9px Arial;color:#816f64}#hcMoodboardToolbarFixed button{border:1px solid #dfd0c4;background:#fff;border-radius:999px;padding:7px 10px;font:900 8px Arial;cursor:pointer}
.hc-fixed-note{position:absolute;z-index:20;width:190px;min-height:70px;padding:12px;background:#fffaf0;border:1px solid #dcc9b7;border-radius:8px;box-shadow:0 12px 25px rgba(60,43,31,.12);font:italic 14px/1.35 Georgia,serif;transform:rotate(-1deg);cursor:move;outline:none}
body.hc-moodboard-ready .hcv2-left-top{background:#2b211c!important}body.hc-moodboard-ready .hcv2-workspace .board{background:#fbf7f0!important;background-image:linear-gradient(rgba(217,196,179,.28) 1px,transparent 1px),linear-gradient(90deg,rgba(217,196,179,.28) 1px,transparent 1px)!important;background-size:36px 36px!important}
`;
    document.head.appendChild(s);
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,100));else setTimeout(apply,100);
})();