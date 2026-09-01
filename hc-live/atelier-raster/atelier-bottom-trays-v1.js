/* Haute Couture Live — Atelier bottom trays v1
   Isolated drag for MATIERES / COULEURS / MOTIFS. Does not bind clothing cards or placed-card movement.
*/
(function(){
'use strict';
if(window.__HC_BOTTOM_TRAYS_V1__)return;window.__HC_BOTTOM_TRAYS_V1__=true;
const MIME='application/x-hc-mood-ref';
let z=600;
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function uid(){try{return crypto.randomUUID()}catch(_){return 'mood-'+Date.now()+'-'+Math.random().toString(36).slice(2)}}
function toast(t){const n=$('#toast');if(!n)return;n.textContent=t;n.classList.add('show');setTimeout(()=>n.classList.remove('show'),1400)}
function visual(kind,name){
 const n=String(name||'').toLowerCase();
 if(kind==='color'){
  const map={ivoire:'#f4efe5',champagne:'#e7d2a8',rose:'#d9a4ad',noir:'#1d1d1d'};return map[n]||'#ddd';
 }
 if(kind==='material'){
  if(n.includes('satin'))return 'linear-gradient(135deg,#eee7df 0%,#fff 32%,#d9d1c8 55%,#faf7f2 78%,#ded4cb 100%)';
  if(n.includes('soie'))return 'linear-gradient(115deg,#e9e2da 0%,#fffaf4 45%,#d8d0c8 55%,#f4eee8 100%)';
  if(n.includes('tulle'))return 'repeating-linear-gradient(45deg,#f7f3ef 0 5px,#d9d4cf 5px 6px),repeating-linear-gradient(-45deg,transparent 0 5px,#ded9d4 5px 6px)';
  if(n.includes('lin'))return 'repeating-linear-gradient(90deg,#ded8d1 0 2px,#eee9e3 2px 5px)';
 }
 if(kind==='pattern'){
  if(n.includes('uni'))return '#eee9e3';
  if(n.includes('pliss'))return 'repeating-linear-gradient(90deg,#eee9e3 0 7px,#cfc7bf 7px 9px,#f7f2ec 9px 15px)';
  if(n.includes('dentelle'))return 'radial-gradient(circle at 25% 25%,transparent 0 5px,#d9d1ca 5px 7px,transparent 7px),radial-gradient(circle at 75% 75%,transparent 0 5px,#d9d1ca 5px 7px,transparent 7px),#f4eee8';
  if(n.includes('perl'))return 'radial-gradient(circle,#c8b7a8 0 2px,transparent 2.5px) 0 0/12px 12px,#f3ede7';
 }
 return '#eee';
}
function decorate(root,kind){if(!root)return;root.closest('.tray')?.querySelector('p')?.replaceChildren(document.createTextNode('Glisse une référence sur ta planche'));
 root.querySelectorAll('.chip').forEach(chip=>{
  const name=(chip.textContent||'Référence').trim();chip.disabled=false;chip.removeAttribute('disabled');chip.draggable=true;chip.dataset.hcMoodKind=kind;chip.dataset.hcMoodName=name;chip.style.opacity='1';chip.style.cursor='grab';chip.style.pointerEvents='auto';
  const i=chip.querySelector('i');if(i){i.style.background=visual(kind,name);i.style.border='1px solid rgba(60,45,35,.08)'}
  chip.ondragstart=e=>{e.stopPropagation();e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData(MIME,JSON.stringify({kind,name,visual:visual(kind,name)}));e.dataTransfer.setData('text/plain','hc-mood:'+kind+':'+name)};
 });
}
function createCard(data,x,y){const board=$('#board'),drop=$('#drop');if(!board||!drop)return false;const r=board.getBoundingClientRect();const el=document.createElement('div');el.className='pieceCard hc-cat-card hc-bottom-ref';el.dataset.instanceId=uid();el.dataset.name=data.name;el.dataset.moodKind=data.kind;el.dataset.hcScale='1';el.dataset.hcRotate='0';el.style.position='absolute';el.style.left=Math.max(0,Math.min(r.width-160,x-r.left-74))+'px';el.style.top=Math.max(0,Math.min(r.height-140,y-r.top-55))+'px';el.style.zIndex=String(++z);el.style.width='148px';el.style.padding='9px';el.style.background='#fffdf9';el.style.border='1px solid #e4d7cd';el.style.borderRadius='13px';el.style.boxShadow='0 8px 18px rgba(79,60,45,.08)';el.style.cursor='move';
 const label=data.kind==='material'?'MATIÈRE':data.kind==='color'?'COULEUR':'MOTIF';
 el.innerHTML='<button class="hc-cat-remove" type="button" title="Retirer" style="position:absolute;right:6px;top:6px;width:24px;height:24px;border:0;border-radius:50%;background:#211a16;color:#fff;z-index:3">×</button><div style="height:72px;border-radius:9px;border:1px solid #eadfd6;background:'+esc(data.visual)+';margin-bottom:7px"></div><b style="display:block;font:15px Georgia,serif">'+esc(data.name)+'</b><small style="display:block;margin-top:3px;font:8px Arial;color:#7a6960">'+label+'</small>';
 drop.appendChild(el);window.dispatchEvent(new CustomEvent('hc-atelier-moodboard-changed'));toast(data.name+' ajouté à la planche');return true;
}
function bindBoard(){const board=$('#board');if(!board||board.dataset.hcBottomTrayDrop==='1')return false;board.dataset.hcBottomTrayDrop='1';board.addEventListener('dragover',e=>{if(!e.dataTransfer?.types?.includes(MIME))return;e.preventDefault();e.stopPropagation();e.dataTransfer.dropEffect='copy';board.classList.add('hc-board-dragover')},true);board.addEventListener('drop',e=>{const raw=e.dataTransfer?.getData(MIME);if(!raw)return;e.preventDefault();e.stopPropagation();board.classList.remove('hc-board-dragover');try{createCard(JSON.parse(raw),e.clientX,e.clientY)}catch(err){console.warn('[Atelier bottom trays] drop failed',err)}},true);board.addEventListener('dragleave',e=>{if(!board.contains(e.relatedTarget))board.classList.remove('hc-board-dragover')});return true}
function scan(){decorate($('#materials'),'material');decorate($('#colors'),'color');decorate($('#patterns'),'pattern');bindBoard()}
function boot(){if(!$('#board')||!$('#materials')||!$('#colors')||!$('#patterns')){setTimeout(boot,120);return}scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});console.info('[Atelier] bottom trays v1 ready')}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1700));else setTimeout(boot,1700);
})();