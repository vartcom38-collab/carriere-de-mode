/* Haute Couture Live — persistance des croquis générés v1 */
(function(){
'use strict';
if(window.HCAtelierSketchPersistence)return;
const GALLERY='haute-couture-atelier-generated-sketches-v1';
const SELECTED='haute-couture-atelier-selected-sketch-v2';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch(_){return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(_){return false}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function scrape(){const cards=[...document.querySelectorAll('#hcGcGrid .hc-gc-card')];if(cards.length<1)return[];return cards.map((card,i)=>({id:'saved-sketch-'+(i+1),name:card.querySelector('b')?.textContent||('Croquis '+(i+1)),direction:card.querySelector('small')?.textContent||'',url:card.querySelector('img')?.src||'',index:i})).filter(x=>x.url)}
function saveGallery(){const list=scrape();if(list.length)write(GALLERY,{version:1,savedAt:new Date().toISOString(),items:list});return list}
function select(item,btn){const root=document.getElementById('hcGcGrid');root?.querySelectorAll('.hc-gc-card').forEach(x=>x.classList.remove('selected'));btn?.classList.add('selected');const value={...item,selectedAt:new Date().toISOString()};write(SELECTED,value);window.__HC_SELECTED_SKETCH__=value;window.dispatchEvent(new CustomEvent('hc-atelier-sketch-selected',{detail:value}))}
function restore(){const saved=read(GALLERY,null),items=saved?.items||[];if(!items.length)return false;const root=document.getElementById('hcGcGrid');if(!root)return false;const selected=read(SELECTED,null);root.className='hc-gc-grid';root.innerHTML=items.map((p,i)=>`<button class="hc-gc-card${selected?.url===p.url?' selected':''}" type="button" data-saved-i="${i}"><span>CROQUIS ${i+1}</span><img src="${esc(p.url)}" alt="Croquis de styliste ${i+1}"><b>${esc(p.name||('Croquis '+(i+1)))}</b><small>${esc(p.direction||'')}</small></button>`).join('');root.querySelectorAll('.hc-gc-card').forEach(btn=>{btn.onclick=()=>select(items[Number(btn.dataset.savedI)],btn)});const st=document.getElementById('hcGcStatus');if(st)st.innerHTML='<div>3 croquis restaurés depuis ta dernière session. Tu n’as pas besoin de les régénérer.</div>';return true}
function restoreLater(n=0){if(restore())return;if(n<20)setTimeout(()=>restoreLater(n+1),250)}
window.addEventListener('hc-atelier-sketch-selected',()=>{saveGallery()});
window.addEventListener('beforeunload',saveGallery);
setTimeout(()=>restoreLater(),1800);
window.HCAtelierSketchPersistence={version:1,saveGallery,restore};
})();