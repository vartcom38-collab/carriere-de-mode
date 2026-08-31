/* Haute Couture Live — nested creative accordions v2
   Catégorie -> sous-catégorie -> vignettes.
   Ce rendu reste autoritaire même si l'ancien shell tente de rerendre la colonne.
*/
(function(){
'use strict';
if(window.__HC_LEFT_NESTED_ACCORDIONS_V2__)return;
window.__HC_LEFT_NESTED_ACCORDIONS_V2__=true;
const $=s=>document.querySelector(s);
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(e){return f}};
const UNLOCK='haute-couture-atelier-unlocks-v1';
const FABRICS='haute-couture-fabric-library-v1';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let rendering=false, scheduled=false;
function C(){return window.HCAtelierCatalog||null}
function knownSet(){const c=C(),starter=c?.starterIds instanceof Set?c.starterIds:new Set(c?.starterIds||[]),raw=read(UNLOCK,[]),u=new Set((Array.isArray(raw)?raw:[]).map(v=>typeof v==='string'?v:v?.id).filter(Boolean));return new Set([...starter,...u])}
function items(){const k=knownSet();return (C()?.items||[]).filter(x=>k.has(x.id))}
function text(x){return [x?.id,x?.name,...(x?.tags||[])].join(' ').toLowerCase()}
function visual(x){return window.HCAtelierVisualReferences?.forItem?.(x.id)?.image||x.referenceUrl||''}
const F=[
 {label:'HAUTS',subs:[
  ['Tops & T-shirts',x=>x.category==='tops'&&!/(crop|chemise|chemisier|blouse|bustier|corset|body|pull|cardigan|gilet|tunique)/i.test(text(x))],
  ['Crop tops & courts',x=>x.category==='tops'&&/(crop|court|brassière|bandeau)/i.test(text(x))],
  ['Chemises & blouses',x=>x.category==='tops'&&/(chemise|chemisier|blouse|tunique)/i.test(text(x))],
  ['Bustiers, corsets & bodies',x=>x.category==='tops'&&/(bustier|corset|body)/i.test(text(x))],
  ['Mailles & gilets',x=>x.category==='tops'&&/(pull|cardigan|gilet)/i.test(text(x))]
 ]},
 {label:'MANCHES',subs:[
  ['Basiques',x=>x.category==='sleeves'&&/(none|short|long|34|cap|sans manche|courte|longue|3\/4|mancheron)/i.test(text(x))],
  ['Volumes',x=>x.category==='sleeves'&&/(balloon|gigot|bishop|bell|lantern|ballon|évêque|cloche|bouffante)/i.test(text(x))],
  ['Couture & spéciales',x=>x.category==='sleeves'&&!/(none|short|long|34|cap|sans manche|courte|longue|3\/4|mancheron|balloon|gigot|bishop|bell|lantern|ballon|évêque|cloche|bouffante)/i.test(text(x))]
 ]},
 {label:'ENCOLURES',subs:[
  ['Classiques',x=>x.category==='necklines'&&/(round|neck-v|square|boat|ronde|carrée|bateau)/i.test(text(x))],
  ['Soir & couture',x=>x.category==='necklines'&&!/(round|neck-v|square|boat|ronde|carrée|bateau)/i.test(text(x))]
 ]},
 {label:'COLS',subs:[
  ['Classiques',x=>x.category==='collars'&&/(shirt|peterpan|mandarin|chemise|claudine|officier)/i.test(text(x))],
  ['Tailoring & couture',x=>x.category==='collars'&&!/(shirt|peterpan|mandarin|chemise|claudine|officier)/i.test(text(x))]
 ]},
 {label:'DOS',subs:[
  ['Dos simples',x=>x.category==='backs'&&/(closed|back-v|fermé|dos v)/i.test(text(x))],
  ['Dos ouverts & travaillés',x=>x.category==='backs'&&!/(closed|back-v|fermé|dos v)/i.test(text(x))]
 ]},
 {label:'BAS',subs:[
  ['Pantalons',x=>x.category==='bottoms'&&/(pants-|pantalon|palazzo|legging|sarouel)/i.test(text(x))],
  ['Jeans',x=>x.category==='bottoms'&&/(jean|denim)/i.test(text(x))],
  ['Shorts & bermudas',x=>x.category==='bottoms'&&/(short|bermuda|cycliste)/i.test(text(x))],
  ['Jupes courtes & midi',x=>x.category==='bottoms'&&/skirt-/i.test(String(x.id||''))&&!/(longue|sirene|godets|cercle|boule)/i.test(text(x))],
  ['Jupes longues & volumes',x=>x.category==='bottoms'&&/skirt-/i.test(String(x.id||''))&&/(longue|sirene|godets|cercle|boule)/i.test(text(x))]
 ]},
 {label:'ROBES & COMBINAISONS',subs:[
  ['Bases de robe',x=>x.category==='dress-bases'&&/dress-/i.test(String(x.id||''))],
  ['Combinaisons',x=>x.category==='dress-bases'&&/(jumpsuit|playsuit|combi)/i.test(text(x))]
 ]},
 {label:'VESTES & MANTEAUX',subs:[
  ['Vestes & blazers',x=>x.category==='outerwear'&&/(jacket|veste|blazer|smoking|bomber|perfecto)/i.test(text(x))],
  ['Manteaux & capes',x=>x.category==='outerwear'&&!/(jacket|veste|blazer|smoking|bomber|perfecto)/i.test(text(x))]
 ]},
 {label:'CONSTRUCTION',subs:[
  ['Lignes & volumes',x=>x.category==='construction'&&/(waist|fit-|shape-|shoulder|taille|coupe|ligne|épaule|volume)/i.test(text(x))],
  ['Découpes & structure',x=>x.category==='construction'&&!/(waist|fit-|shape-|shoulder|taille|coupe|ligne|épaule|volume)/i.test(text(x))]
 ]},
 {label:'DÉTAILS & FINITIONS',subs:[
  ['Détails',x=>['details','ornaments'].includes(x.category)],
  ['Poches',x=>x.category==='pockets'],
  ['Fermetures',x=>x.category==='closures'],
  ['Traînes & capes',x=>['trains','capes'].includes(x.category)]
 ]}
];
function card(x){const img=visual(x);return `<button class="hcn-card" draggable="true" data-kind="catalog" data-id="${esc(x.id)}"><span>${img?`<img src="${esc(img)}" alt="${esc(x.name)}">`:'✦'}</span><b>${esc(x.name)}</b></button>`}
function fabricCard(f){return `<button class="hcn-card hcn-fabric" draggable="true" data-kind="fabric" data-id="${esc(f.id)}"><span>${f.image?`<img src="${esc(f.image)}" alt="${esc(f.name)}">`:'✦'}</span><b>${esc(f.name)}</b></button>`}
function add(kind,id){if(kind==='catalog')return window.HCAtelierBoardComponents?.addToBoard?.(id);if(kind==='fabric')return window.HCStylistNotebook?.add?.('fabric',id)}
function bind(root){root.querySelectorAll('[data-kind][data-id]').forEach(el=>{el.onclick=()=>add(el.dataset.kind,el.dataset.id);el.ondragstart=e=>{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('text/hcv2-item',JSON.stringify({kind:el.dataset.kind,id:el.dataset.id}))}})}
function render(){
 const host=$('#hcv2AccordionHost');
 if(!host||!C()||!window.HCAtelierBoardComponents){setTimeout(render,120);return}
 rendering=true;
 const opened=new Set([...host.querySelectorAll('details[open] > summary > span:first-child')].map(x=>x.textContent.trim()));
 const all=items();
 const html=F.map((fam)=>{const subs=fam.subs.map(([label,test])=>[label,all.filter(test)]).filter(x=>x[1].length);const total=subs.reduce((n,x)=>n+x[1].length,0);if(!total)return'';const familyOpen=opened.has(fam.label)?'open':'';return `<details class="hcn-family" ${familyOpen}><summary><span>${esc(fam.label)}</span><i>${total}</i><em>⌄</em></summary><div class="hcn-subwrap">${subs.map(([label,list])=>`<details class="hcn-sub" ${opened.has(label)?'open':''}><summary><span>${esc(label)}</span><i>${list.length}</i><em>⌄</em></summary><div class="hcn-grid">${list.map(card).join('')}</div></details>`).join('')}</div></details>`}).join('');
 const fabrics=read(FABRICS,[]);const mat=fabrics.length?`<details class="hcn-family" ${opened.has('MATIÈRES')?'open':''}><summary><span>MATIÈRES</span><i>${fabrics.length}</i><em>⌄</em></summary><div class="hcn-subwrap"><details class="hcn-sub" ${opened.has('Tissus débloqués')?'open':''}><summary><span>Tissus débloqués</span><i>${fabrics.length}</i><em>⌄</em></summary><div class="hcn-grid">${fabrics.map(fabricCard).join('')}</div></details></div></details>`:'';
 host.innerHTML=html+mat;
 bind(host);
 document.body.classList.add('hc-nested-accordion-ready');
 rendering=false;
}
function scheduleRender(){if(rendering||scheduled)return;scheduled=true;setTimeout(()=>{scheduled=false;const host=$('#hcv2AccordionHost');if(host&&!host.querySelector('.hcn-family'))render()},30)}
function css(){if($('#hcNestedAccCss'))return;const s=document.createElement('style');s.id='hcNestedAccCss';s.textContent=`
#hcv2AccordionHost{padding:8px 10px 18px!important}.hcn-family,.hcn-sub{border:1px solid #e7d8cd;border-radius:13px;background:#fff;overflow:hidden;margin:7px 0}.hcn-family>summary,.hcn-sub>summary{display:flex;align-items:center;gap:8px;list-style:none;cursor:pointer}.hcn-family>summary{padding:12px 13px;font:900 10px Arial;letter-spacing:.04em}.hcn-sub>summary{padding:10px 12px;background:#fbf5ef;font:800 9px Arial}.hcn-family summary::-webkit-details-marker,.hcn-sub summary::-webkit-details-marker{display:none}.hcn-family summary i,.hcn-sub summary i{margin-left:auto;font:700 8px Arial;color:#9b8779;font-style:normal}.hcn-family summary em,.hcn-sub summary em{font:16px Georgia,serif;color:#9b7b6c;transform:rotate(-90deg);transition:.15s}.hcn-family[open]>summary em,.hcn-sub[open]>summary em{transform:rotate(0deg)}.hcn-subwrap{padding:0 8px 8px}.hcn-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:8px}.hcn-card{border:1px solid #eaded4;background:#fffaf5;border-radius:11px;padding:7px;text-align:left;cursor:grab;min-width:0}.hcn-card span{display:grid;place-items:center;height:82px;border-radius:8px;background:#f4ece5;overflow:hidden;margin-bottom:6px;color:#b18e7c;font:20px Georgia,serif}.hcn-card img{width:100%;height:100%;object-fit:contain}.hcn-fabric img{object-fit:cover}.hcn-card b{display:block;font:13px/1.08 Georgia,serif;color:#241d19;overflow-wrap:anywhere}@media(max-width:900px){.hcn-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
`;document.head.appendChild(s)}
function boot(){
 css();render();
 const wait=()=>{const host=$('#hcv2AccordionHost');if(!host){setTimeout(wait,100);return}new MutationObserver(scheduleRender).observe(host,{childList:true});};wait();
 window.addEventListener('storage',()=>setTimeout(render,20));
 const input=document.querySelector('.hcv2-side-search input');if(input)input.addEventListener('input',()=>setTimeout(render,40));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,900));else setTimeout(boot,900);
})();