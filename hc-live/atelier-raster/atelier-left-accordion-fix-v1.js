/* Haute Couture Live — Atelier left accordion fix v1
   Rend les accordéons de gauche de façon robuste même si certaines briques Atelier chargent plus tard.
*/
(function(){
'use strict';
if(window.__HC_LEFT_ACCORDION_FIX_V1__)return;
window.__HC_LEFT_ACCORDION_FIX_V1__=true;
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??f}catch(e){return f}};
const UNLOCK='haute-couture-atelier-unlocks-v1',FABRICS='haute-couture-fabric-library-v1';
let tries=0;
function knownSet(){
  const C=window.HCAtelierCatalog;
  const starter=C?.starterIds instanceof Set?C.starterIds:new Set(C?.starterIds||[]);
  const raw=read(UNLOCK,[]);
  const unlocked=new Set((Array.isArray(raw)?raw:[]).map(x=>typeof x==='string'?x:x?.id).filter(Boolean));
  return new Set([...starter,...unlocked]);
}
function label(cat){return window.HCAtelierCatalog?.categories?.[cat]||String(cat||'Autres').replace(/-/g,' ')}
function visual(x){return window.HCAtelierVisualReferences?.forItem?.(x.id)?.image||x.referenceUrl||''}
function groupLabel(cat){
  const map={
    tops:'HAUTS',bottoms:'BAS', 'dress-bases':'ROBES & COMBINAISONS',sleeves:'MANCHES',necklines:'ENCOLURES',collars:'COLS',backs:'DOS',outerwear:'VESTES & MANTEAUX',construction:'CONSTRUCTION',details:'DÉTAILS & FINITIONS',ornaments:'DÉTAILS & FINITIONS',pockets:'DÉTAILS & FINITIONS',closures:'DÉTAILS & FINITIONS',trains:'DÉTAILS & FINITIONS',capes:'DÉTAILS & FINITIONS',patterns:'MOTIFS',accessories:'ACCESSOIRES',jewelry:'BIJOUX',shoes:'CHAUSSURES'
  };
  return map[cat]||label(cat).toUpperCase();
}
function add(kind,id){
  if(kind==='fabric')return window.HCStylistNotebook?.add?.('fabric',id);
  if(kind==='catalog')return window.HCAtelierBoardComponents?.addToBoard?.(id);
}
function bind(root){
  root.querySelectorAll('[data-kind][data-id]').forEach(b=>{
    b.onclick=()=>add(b.dataset.kind,b.dataset.id);
    b.ondragstart=e=>{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('text/hcv2-item',JSON.stringify({kind:b.dataset.kind,id:b.dataset.id}))};
  });
}
function card(x){const img=visual(x);return `<button class="hcv2-item" draggable="true" data-kind="catalog" data-id="${esc(x.id)}"><span class="hcv2-thumb">${img?`<img src="${esc(img)}" alt="${esc(x.name)}">`:'✦'}</span><b>${esc(x.name)}</b><small>${esc((x.tags||[]).slice(0,2).join(' · '))}</small></button>`}
function fabricCard(f){return `<button class="hcv2-item fabric" draggable="true" data-kind="fabric" data-id="${esc(f.id)}"><span class="hcv2-thumb">${f.image?`<img src="${esc(f.image)}" alt="${esc(f.name)}">`:'✦'}</span><b>${esc(f.name)}</b><small>${esc([f.color,f.composition].filter(Boolean).join(' · '))}</small></button>`}
function render(){
  tries++;
  const host=$('#hcv2AccordionHost');
  const C=window.HCAtelierCatalog;
  if(!host||!C){if(tries<120)setTimeout(render,120);return}
  const known=knownSet();
  const grouped=new Map();
  (C.items||[]).filter(x=>known.has(x.id)).forEach(x=>{const k=groupLabel(x.category);if(!grouped.has(k))grouped.set(k,[]);grouped.get(k).push(x)});
  const fabrics=read(FABRICS,[]);
  const order=['HAUTS','MANCHES','ENCOLURES','COLS','DOS','BAS','ROBES & COMBINAISONS','VESTES & MANTEAUX','CONSTRUCTION','DÉTAILS & FINITIONS','TISSUS','MOTIFS','ACCESSOIRES','BIJOUX','CHAUSSURES'];
  const blocks=[];
  for(const name of order){
    if(name==='TISSUS'){
      blocks.push(`<details class="hcv2-acc"><summary><span>TISSUS</span><span class="hcv2-count">${Array.isArray(fabrics)?fabrics.length:0}</span><span class="hcv2-arrow">⌄</span></summary><div class="hcv2-items">${Array.isArray(fabrics)&&fabrics.length?fabrics.map(fabricCard).join(''):'<div class="hcv2-empty">Tes tissus débloqués apparaîtront ici.</div>'}</div></details>`);
      continue;
    }
    const list=grouped.get(name)||[];
    if(!list.length)continue;
    blocks.push(`<details class="hcv2-acc" ${blocks.length===0?'open':''}><summary><span>${esc(name)}</span><span class="hcv2-count">${list.length}</span><span class="hcv2-arrow">⌄</span></summary><div class="hcv2-items">${list.map(card).join('')}</div></details>`);
  }
  for(const [name,list] of grouped){if(order.includes(name)||!list.length)continue;blocks.push(`<details class="hcv2-acc"><summary><span>${esc(name)}</span><span class="hcv2-count">${list.length}</span><span class="hcv2-arrow">⌄</span></summary><div class="hcv2-items">${list.map(card).join('')}</div></details>`)}
  host.innerHTML=blocks.length?blocks.join(''):'<div class="hcv2-empty" style="padding:16px">Aucun élément Atelier n’est encore disponible.</div>';
  host.style.display='block';host.style.minHeight='180px';
  bind(host);
}
function boot(){render();window.addEventListener('hc-atelier-board-components-ready',render);window.addEventListener('hc-atelier-library-changed',render);window.addEventListener('storage',e=>{if([UNLOCK,FABRICS].includes(e.key))render()});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
