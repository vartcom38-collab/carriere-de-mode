/* Haute Couture Live — generation hotfix v3
   Verrouille la generation sur la vraie planche, affiche exactement ce qui sera pris en compte
   et supprime les anciens controles parasites.
*/
(function(){
'use strict';
if(window.__HC_GENERATION_HOTFIX_V3__)return;window.__HC_GENERATION_HOTFIX_V3__=true;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function uniq(list){return [...new Set(list)]}
function norm(s){return String(s||'').replace(/\s+/g,' ').trim()}
function boardEls(){
 const drop=$('#drop'),board=$('#board');if(!drop||!board)return[];
 const all=uniq([
  ...drop.querySelectorAll('.pieceCard,.hc-cat-card,.hc-mood-card,[data-instance-id],[data-catalog-id],[data-mood-kind]'),
  ...board.querySelectorAll('#drop > div[data-move]')
 ]).filter(el=>el instanceof HTMLElement&&!el.classList.contains('noteCard'));
 all.forEach((el,i)=>{
  el.classList.add('pieceCard');
  if(!el.dataset.instanceId)el.dataset.instanceId='live-'+Date.now()+'-'+i;
  if(!el.dataset.name)el.dataset.name=norm(el.dataset.referenceLabel||el.querySelector('b')?.textContent||el.querySelector('img')?.alt||el.dataset.moodId||('Élément '+(i+1)));
 });
 return all;
}
function kindOf(el){const k=el.dataset.moodKind||'';if(k==='material')return'materials';if(k==='color')return'colors';if(k==='pattern')return'patterns';if(k==='note'||el.querySelector('textarea'))return'notes';return'garments'}
function state(){const out={garments:[],materials:[],colors:[],patterns:[],notes:[]};boardEls().forEach(el=>{const k=kindOf(el);const name=k==='notes'?norm(el.querySelector('textarea')?.value||el.dataset.name||'Note'):norm(el.dataset.referenceLabel||el.dataset.name||el.querySelector('b')?.textContent||el.querySelector('img')?.alt||'Référence');if(name)out[k].push(name)});Object.keys(out).forEach(k=>out[k]=uniq(out[k]));return out}
function counts(){const s=state();return{total:s.garments.length+s.materials.length+s.colors.length+s.patterns.length+s.notes.length,garments:s.garments.length,materials:s.materials.length,colors:s.colors.length,patterns:s.patterns.length,notes:s.notes.length}}
function badge(){let n=$('#hcv3MoodCount');const actions=$('.hcv3-actions');if(!actions)return null;if(!n){n=document.createElement('span');n.id='hcv3MoodCount';n.style.cssText='align-self:center;white-space:nowrap;font:800 8px Arial;color:#6f5e55;background:#f3e9e1;border:1px solid #e2d4ca;border-radius:999px;padding:8px 10px';actions.insertBefore(n,$('.hcv3-generate'))}return n}
function summaryBox(){let box=$('#hcv3GenerationInputs');const head=$('.hcv3-center-head');if(!head)return null;if(!box){box=document.createElement('div');box.id='hcv3GenerationInputs';box.innerHTML='<div class="hcv3-inputs-title"><b>PRIS EN COMPTE POUR LES CROQUIS</b><span>Mis à jour automatiquement depuis ta planche</span></div><div class="hcv3-inputs-grid"></div><div class="hcv3-inputs-foot">+ les notes de la commande cliente + la capture visuelle complète de la planche</div>';head.appendChild(box)}return box}
function fmt(label,list,empty='Aucun'){return `<div class="hcv3-input-row"><b>${label}</b><span class="${list.length?'':'empty'}">${list.length?list.join(' · '):empty}</span></div>`}
function updateSummary(){const s=state(),c=counts(),n=badge();if(n){n.textContent=c.total?`${c.total} élément${c.total>1?'s':''} · ${c.garments} vêt. · ${c.materials} mat. · ${c.colors} coul. · ${c.patterns} motif${c.patterns>1?'s':''}`:'Planche vide';n.dataset.total=String(c.total)}const box=summaryBox();if(!box)return;box.querySelector('.hcv3-inputs-grid').innerHTML=fmt('Vêtements / formes',s.garments)+fmt('Matières',s.materials)+fmt('Couleurs',s.colors)+fmt('Motifs',s.patterns,'Aucun motif sélectionné')+fmt('Notes de planche',s.notes,'Aucune note de planche')}
function removeLegacyNoise(){
 $$('body *').forEach(el=>{
  const t=norm(el.textContent);
  if(t==='Bibliothèque Atelier'){
   const target=el.closest('button,a,[role="button"]')||el;
   if(!target.closest('#hcAtelierShellV3'))target.remove();else target.style.setProperty('display','none','important');
  }
  if(t==='Lecture de ta composition'){
   const box=el.closest('section,article,.card,.panel,[class*=composition],[class*=reading]')||el.parentElement;
   if(box&&box!==document.body&&!box.closest('#board')&&!box.closest('#hcv3GenerationInputs'))box.remove();
  }
 });
}
function ensureRemove(){boardEls().forEach(el=>{if(el.querySelector('.hc-cat-remove,.hc-gc-remove'))return;const b=document.createElement('button');b.type='button';b.className='hc-gc-remove';b.textContent='×';b.title='Retirer';b.style.cssText='position:absolute;right:6px;top:6px;width:26px;height:26px;border:0;border-radius:50%;background:#211a16;color:#fff;z-index:9999;cursor:pointer;font:700 16px Arial';b.addEventListener('pointerdown',e=>e.stopPropagation(),true);b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();el.remove();window.HCAtelierBoardComponents?.sync?.();window.dispatchEvent(new CustomEvent('hc-atelier-moodboard-changed'));updateSummary()},true);el.appendChild(b)})}
function bind(){const b=$('.hcv3-generate');if(!b)return false;b.onclick=null;if(b.dataset.hcHotfixV3==='1')return true;b.dataset.hcHotfixV3='1';b.addEventListener('click',async e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();updateSummary();ensureRemove();const c=counts();if(!c.total){const t=$('#toast');if(t){t.textContent='Ajoute au moins un élément à ta planche avant de générer.';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}return false}const ctl=window.HCAtelierGenerationController;if(!ctl?.generate){console.error('[Atelier hotfix] generation controller unavailable');return false}return await ctl.generate(e)},true);return true}
function css(){if($('#hcv3GenerationInputsCss'))return;const s=document.createElement('style');s.id='hcv3GenerationInputsCss';s.textContent=`#hcv3GenerationInputs{margin-top:10px;border:1px solid #e3d5ca;background:#fffaf5;border-radius:14px;padding:11px 12px}.hcv3-inputs-title{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;margin-bottom:7px}.hcv3-inputs-title b{font:900 8px Arial;letter-spacing:.08em;color:#6f5144}.hcv3-inputs-title span{font:8px Georgia,serif;color:#8b786e}.hcv3-inputs-grid{display:grid;gap:5px}.hcv3-input-row{display:grid;grid-template-columns:120px 1fr;gap:8px;font:9px/1.35 Arial}.hcv3-input-row b{color:#6d5a50}.hcv3-input-row span{color:#2e2520}.hcv3-input-row span.empty{color:#a09188;font-style:italic}.hcv3-inputs-foot{margin-top:8px;padding-top:7px;border-top:1px solid #eee3da;font:italic 8px/1.35 Georgia,serif;color:#7d6b61}`;document.head.appendChild(s)}
function scan(){removeLegacyNoise();ensureRemove();updateSummary();bind()}
function boot(){css();scan();new MutationObserver(()=>setTimeout(scan,0)).observe(document.body,{childList:true,subtree:true});window.addEventListener('hc-atelier-moodboard-changed',updateSummary);window.addEventListener('input',e=>{if(e.target.closest?.('#drop'))updateSummary()},true);setInterval(scan,1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1900));else setTimeout(boot,1900);
})();