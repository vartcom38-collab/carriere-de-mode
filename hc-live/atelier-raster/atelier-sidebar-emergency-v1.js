/* Atelier sidebar emergency v1 — restores category > subcategory > draggable cards */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??f}catch(e){return f}};
const UNLOCK='haute-couture-atelier-unlocks-v1';
function catalog(){return window.HCAtelierCatalog||null}
function known(){const c=catalog();const starter=c?.starterIds instanceof Set?c.starterIds:new Set(c?.starterIds||[]);const raw=read(UNLOCK,[]);const unlocked=new Set((Array.isArray(raw)?raw:[]).map(v=>typeof v==='string'?v:v?.id).filter(Boolean));return new Set([...starter,...unlocked])}
function all(){const c=catalog(),k=known();return (c?.items||[]).filter(x=>k.has(x.id))}
function h(x){return [x.id,x.name,...(x.tags||[])].join(' ').toLowerCase()}
const GROUPS=[
['HAUTS',[
 ['T-shirts',x=>x.category==='tops'&&/t-shirt|tshirt|tee/i.test(h(x))],
 ['Débardeurs',x=>x.category==='tops'&&/débardeur|debardeur|tank/i.test(h(x))],
 ['Tops & caracos',x=>x.category==='tops'&&/caraco|top/i.test(h(x))&&!/crop|t-shirt|tshirt|tee/i.test(h(x))],
 ['Crop tops & bandeaux',x=>x.category==='tops'&&/crop|bandeau|brassière|brassiere/i.test(h(x))],
 ['Chemises & blouses',x=>x.category==='tops'&&/chemise|chemisier|blouse|tunique|shirt/i.test(h(x))],
 ['Bustiers & corsets',x=>x.category==='tops'&&/bustier|corset|body/i.test(h(x))],
 ['Mailles & gilets',x=>x.category==='tops'&&/pull|cardigan|gilet|maille/i.test(h(x))]
]],
['MANCHES',[
 ['Sans manches',x=>x.category==='sleeves'&&/sans manche|none/i.test(h(x))],
 ['Courtes',x=>x.category==='sleeves'&&/courte|short/i.test(h(x))],
 ['Longues',x=>x.category==='sleeves'&&/longue|long/i.test(h(x))],
 ['Volumes',x=>x.category==='sleeves'&&/ballon|gigot|bishop|cloche|bell|bouffante/i.test(h(x))],
 ['Autres manches',x=>x.category==='sleeves']
]],
['ENCOLURES',[[ 'Rondes',x=>x.category==='necklines'&&/ronde|round/i.test(h(x))],['V',x=>x.category==='necklines'&&/neck-v|encolure v/i.test(h(x))],['Carrées',x=>x.category==='necklines'&&/carrée|carree|square/i.test(h(x))],['Autres',x=>x.category==='necklines']]],
['COLS',[[ 'Chemise',x=>x.category==='collars'&&/chemise|shirt/i.test(h(x))],['Claudine',x=>x.category==='collars'&&/claudine|peter/i.test(h(x))],['Autres cols',x=>x.category==='collars']]],
['DOS',[[ 'Dos V',x=>x.category==='backs'&&/back-v|dos v/i.test(h(x))],['Dos ouverts',x=>x.category==='backs'&&/nu|open|ouvert/i.test(h(x))],['Autres dos',x=>x.category==='backs']]],
['BAS',[[ 'Jupes',x=>x.category==='bottoms'&&/skirt|jupe/i.test(h(x))],['Pantalons',x=>x.category==='bottoms'&&/pants|pantalon|palazzo|legging/i.test(h(x))],['Jeans',x=>x.category==='bottoms'&&/jean|denim/i.test(h(x))],['Shorts & bermudas',x=>x.category==='bottoms'&&/short|bermuda|cycliste/i.test(h(x))]]],
['ROBES & COMBINAISONS',[[ 'Robes',x=>x.category==='dress-bases'],['Combinaisons',x=>x.category==='dress-bases'&&/combi|jumpsuit|playsuit/i.test(h(x))]]],
['VESTES & MANTEAUX',[[ 'Vestes & blazers',x=>x.category==='outerwear'&&/veste|jacket|blazer|smoking|bomber|perfecto/i.test(h(x))],['Manteaux & capes',x=>x.category==='outerwear']]],
['CONSTRUCTION',[[ 'Volumes & lignes',x=>x.category==='construction'],['Détails de construction',x=>x.category==='construction']]],
['DÉTAILS & FINITIONS',[[ 'Détails',x=>x.category==='details'],['Ornements',x=>x.category==='ornaments'],['Poches',x=>x.category==='pockets'],['Fermetures',x=>x.category==='closures'],['Traînes',x=>x.category==='trains']]],
['ACCESSOIRES',[[ 'Accessoires',x=>x.category==='accessories'],['Bijoux',x=>x.category==='jewelry'],['Chaussures',x=>x.category==='shoes']]]
];
function img(x){return window.HCAtelierVisualReferences?.forItem?.(x.id)?.image||x.referenceUrl||''}
function card(x){const im=img(x);return `<button class="hc-em-card" draggable="true" data-id="${esc(x.id)}"><span>${im?`<img src="${esc(im)}" alt="${esc(x.name)}">`:'✦'}</span><b>${esc(x.name)}</b></button>`}
function render(){const host=$('#hcv2AccordionHost');if(!host||!catalog()||!window.HCAtelierBoardComponents){setTimeout(render,150);return}const items=all();let out='';for(const [family,subs] of GROUPS){const used=new Set();const built=[];for(const [label,test] of subs){const list=items.filter(x=>test(x)&&!used.has(x.id));list.forEach(x=>used.add(x.id));if(list.length)built.push([label,list]);}if(!built.length)continue;const total=built.reduce((n,[,l])=>n+l.length,0);out+=`<details class="hc-em-family"><summary>${esc(family)} <i>${total}</i><em>⌄</em></summary><div>${built.map(([label,list])=>`<details class="hc-em-sub"><summary>${esc(label)} <i>${list.length}</i><em>⌄</em></summary><section>${list.map(card).join('')}</section></details>`).join('')}</div></details>`}host.innerHTML=out||'<p class="hc-em-empty">Aucun élément débloqué pour le moment.</p>';host.dataset.emergency='1';bind(host)}
function bind(root){root.querySelectorAll('.hc-em-card').forEach(b=>{b.onclick=()=>window.HCAtelierBoardComponents?.addToBoard?.(b.dataset.id);b.ondragstart=e=>{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('text/hcv2-item',JSON.stringify({kind:'catalog',id:b.dataset.id}))}})}
function style(){if($('#hcEmergencySidebarCss'))return;const s=document.createElement('style');s.id='hcEmergencySidebarCss';s.textContent=`.hc-em-family,.hc-em-sub{border:1px solid #e5d7cc;border-radius:12px;background:#fff;overflow:hidden;margin:7px 0}.hc-em-family>summary,.hc-em-sub>summary{display:flex;align-items:center;gap:8px;list-style:none;cursor:pointer}.hc-em-family>summary{padding:12px 13px;font:900 10px Arial}.hc-em-sub>summary{padding:10px 11px;background:#fbf5ef;font:800 9px Arial}.hc-em-family summary::-webkit-details-marker,.hc-em-sub summary::-webkit-details-marker{display:none}.hc-em-family summary i,.hc-em-sub summary i{margin-left:auto;font:700 8px Arial;color:#9a8578;font-style:normal}.hc-em-family summary em,.hc-em-sub summary em{font-style:normal;color:#9b7968}.hc-em-family>div{padding:0 7px 7px}.hc-em-sub section{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:8px}.hc-em-card{border:1px solid #eadfd6;border-radius:10px;background:#fffaf5;padding:7px;text-align:left;cursor:grab}.hc-em-card span{height:78px;display:grid;place-items:center;background:#f4ece5;border-radius:7px;overflow:hidden;margin-bottom:5px;color:#b08c7a}.hc-em-card img{width:100%;height:100%;object-fit:contain}.hc-em-card b{font:12px/1.1 Georgia,serif}.hc-em-empty{padding:14px;font:11px Georgia,serif;color:#8a776b}`;document.head.appendChild(s)}
function boot(){style();render();setInterval(()=>{const host=$('#hcv2AccordionHost');if(host&&host.dataset.emergency!=='1')render()},1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,800));else setTimeout(boot,800);
})();
