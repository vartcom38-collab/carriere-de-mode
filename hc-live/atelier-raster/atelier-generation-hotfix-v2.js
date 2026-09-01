/* Haute Couture Live — generation hotfix v2
   Verrouille le bouton du shell sur le nouveau contrôleur et normalise la vraie planche avant génération.
*/
(function(){
'use strict';
if(window.__HC_GENERATION_HOTFIX_V2__)return;window.__HC_GENERATION_HOTFIX_V2__=true;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function uniq(list){return [...new Set(list)]}
function boardEls(){
 const drop=$('#drop'),board=$('#board');if(!drop||!board)return[];
 const all=uniq([
  ...drop.querySelectorAll('.pieceCard,.hc-cat-card,.hc-mood-card,[data-instance-id],[data-catalog-id],[data-mood-kind]'),
  ...board.querySelectorAll('#drop > div[data-move]')
 ]).filter(el=>el instanceof HTMLElement&&!el.classList.contains('noteCard'));
 all.forEach((el,i)=>{
  el.classList.add('pieceCard');
  if(!el.dataset.instanceId)el.dataset.instanceId='live-'+Date.now()+'-'+i;
  if(el.dataset.moodKind&&!el.dataset.name){el.dataset.name=el.querySelector('b')?.textContent?.trim()||el.dataset.moodId||'Référence'}
 });
 return all;
}
function counts(){const els=boardEls();let garments=0,materials=0,colors=0,patterns=0,notes=0;els.forEach(el=>{const k=el.dataset.moodKind||'';if(k==='material')materials++;else if(k==='color')colors++;else if(k==='pattern')patterns++;else if(k==='note'||el.querySelector('textarea'))notes++;else garments++});return{total:els.length,garments,materials,colors,patterns,notes}}
function badge(){let n=$('#hcv3MoodCount');const actions=$('.hcv3-actions');if(!actions)return null;if(!n){n=document.createElement('span');n.id='hcv3MoodCount';n.style.cssText='align-self:center;white-space:nowrap;font:800 8px Arial;color:#6f5e55;background:#f3e9e1;border:1px solid #e2d4ca;border-radius:999px;padding:8px 10px';actions.insertBefore(n,$('.hcv3-generate'))}return n}
function updateBadge(){const c=counts(),n=badge();if(!n)return;n.textContent=c.total?`${c.total} élément${c.total>1?'s':''} · ${c.garments} vêt. · ${c.materials} mat. · ${c.colors} coul. · ${c.patterns} motif${c.patterns>1?'s':''}`:'Planche vide';n.dataset.total=String(c.total)}
function hideNoise(){$$('body *').forEach(el=>{const t=(el.textContent||'').replace(/\s+/g,' ').trim();if(t==='Lecture de ta composition'){const box=el.closest('section,article,.card,.panel,[class*=composition],[class*=reading]')||el.parentElement;if(box&&!box.closest('#board'))box.style.setProperty('display','none','important')}if(t==='Bibliothèque Atelier'){const cs=getComputedStyle(el);if(cs.position==='fixed'||cs.position==='absolute'||el.closest('[style*=fixed]'))el.style.setProperty('display','none','important')}})}
function ensureRemove(){boardEls().forEach(el=>{if(el.querySelector('.hc-cat-remove,.hc-gc-remove'))return;const b=document.createElement('button');b.type='button';b.className='hc-gc-remove';b.textContent='×';b.title='Retirer';b.style.cssText='position:absolute;right:6px;top:6px;width:26px;height:26px;border:0;border-radius:50%;background:#211a16;color:#fff;z-index:9999;cursor:pointer;font:700 16px Arial';b.addEventListener('pointerdown',e=>e.stopPropagation(),true);b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();el.remove();window.HCAtelierBoardComponents?.sync?.();window.dispatchEvent(new CustomEvent('hc-atelier-moodboard-changed'));updateBadge()},true);el.appendChild(b)})}
function bind(){const b=$('.hcv3-generate');if(!b)return false;
 // Neutralise totalement l'ancien relais vers #generateTop.
 b.onclick=null;
 if(b.dataset.hcHotfixV2==='1')return true;
 b.dataset.hcHotfixV2='1';
 b.addEventListener('click',async e=>{
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  const c=counts();updateBadge();ensureRemove();
  if(!c.total){const t=$('#toast');if(t){t.textContent='Ajoute au moins un élément à ta planche avant de générer.';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}return false}
  const ctl=window.HCAtelierGenerationController;
  if(!ctl?.generate){console.error('[Atelier hotfix] generation controller unavailable');return false}
  return await ctl.generate(e);
 },true);
 return true
}
function scan(){hideNoise();ensureRemove();updateBadge();bind()}
function boot(){scan();new MutationObserver(()=>setTimeout(scan,0)).observe(document.body,{childList:true,subtree:true});setInterval(scan,800)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1900));else setTimeout(boot,1900);
})();