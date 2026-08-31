/* Haute Couture Live — Atelier sidebar FINAL v1.2
   Menu robuste indépendant du shell : catégorie -> sous-catégorie -> vignettes.
   Règle absolue : aucun contenu bloqué n'est affiché. Une famille/sous-catégorie vide reste invisible.
*/
(function(){
'use strict';
if(window.__HC_ATELIER_SIDEBAR_FINAL_V12__) return;
window.__HC_ATELIER_SIDEBAR_FINAL_V12__=true;
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??f}catch(e){return f}};
const UNLOCK='haute-couture-atelier-unlocks-v1';
let rendering=false;
const TREE=[
 ['HAUTS',[
  ['T-shirts',x=>x.category==='tops'&&/(t-shirt|tshirt|tee)/i.test(text(x))],
  ['Débardeurs',x=>x.category==='tops'&&/(débardeur|debardeur|tank)/i.test(text(x))],
  ['Tops & caracos',x=>x.category==='tops'&&/(caraco|cache-cœur|cache-coeur|top asym|top-cape)/i.test(text(x))],
  ['Crop tops & brassières',x=>x.category==='tops'&&/(crop|brassière|brassiere|bandeau)/i.test(text(x))],
  ['Chemises & blouses',x=>x.category==='tops'&&/(chemise|chemisier|blouse|tunique)/i.test(text(x))],
  ['Bustiers, corsets & bodies',x=>x.category==='tops'&&/(bustier|corset|body)/i.test(text(x))],
  ['Mailles & gilets',x=>x.category==='tops'&&/(pull|cardigan|gilet)/i.test(text(x))]
 ]],
 ['MANCHES',[
  ['Sans manches',x=>x.category==='sleeves'&&/(sans manche|sleeve-none)/i.test(text(x))],
  ['Manches courtes',x=>x.category==='sleeves'&&/(courte|sleeve-short|mancheron)/i.test(text(x))],
  ['Manches longues',x=>x.category==='sleeves'&&/(longue|sleeve-long|3\/4)/i.test(text(x))&&!/(ballon|gigot|évêque|eveque|cloche)/i.test(text(x))],
  ['Ballon & bouffantes',x=>x.category==='sleeves'&&/(ballon|balloon|bouffante)/i.test(text(x))],
  ['Gigot & évêque',x=>x.category==='sleeves'&&/(gigot|évêque|eveque|bishop)/i.test(text(x))],
  ['Évasées & cloche',x=>x.category==='sleeves'&&/(cloche|bell|évasée|evasee)/i.test(text(x))],
  ['Spéciales',x=>x.category==='sleeves'&&!/(sans manche|sleeve-none|courte|sleeve-short|longue|sleeve-long|3\/4|ballon|balloon|bouffante|gigot|évêque|eveque|bishop|cloche|bell|évasée|evasee)/i.test(text(x))]
 ]],
 ['ENCOLURES',[
  ['Rondes',x=>x.category==='necklines'&&/(ronde|round)/i.test(text(x))],
  ['V',x=>x.category==='necklines'&&/(neck-v|encolure v)/i.test(text(x))],
  ['Carrées',x=>x.category==='necklines'&&/(carrée|carree|square)/i.test(text(x))],
  ['Bateau',x=>x.category==='necklines'&&/(bateau|boat)/i.test(text(x))],
  ['Couture',x=>x.category==='necklines'&&!/(ronde|round|neck-v|encolure v|carrée|carree|square|bateau|boat)/i.test(text(x))]
 ]],
 ['COLS',[
  ['Chemise',x=>x.category==='collars'&&/(chemise|shirt)/i.test(text(x))],
  ['Claudine',x=>x.category==='collars'&&/(claudine|peter)/i.test(text(x))],
  ['Officier & montant',x=>x.category==='collars'&&/(officier|mandarin|montant)/i.test(text(x))],
  ['Tailoring & couture',x=>x.category==='collars'&&!/(chemise|shirt|claudine|peter|officier|mandarin|montant)/i.test(text(x))]
 ]],
 ['DOS',[
  ['Dos V',x=>x.category==='backs'&&/(back-v|dos v)/i.test(text(x))],
  ['Dos nus & ouverts',x=>x.category==='backs'&&/(dos nu|open|ouvert)/i.test(text(x))],
  ['Dos travaillés',x=>x.category==='backs'&&!/(back-v|dos v|dos nu|open|ouvert)/i.test(text(x))]
 ]],
 ['BAS',[
  ['Jupes',x=>x.category==='bottoms'&&/(skirt|jupe)/i.test(text(x))],
  ['Pantalons',x=>x.category==='bottoms'&&/(pants|pantalon|palazzo|sarouel|legging)/i.test(text(x))],
  ['Jeans',x=>x.category==='bottoms'&&/(jean|denim)/i.test(text(x))],
  ['Shorts & bermudas',x=>x.category==='bottoms'&&/(short|bermuda|cycliste)/i.test(text(x))]
 ]],
 ['ROBES & COMBINAISONS',[
  ['Robes',x=>x.category==='dress-bases'&&/(dress|robe)/i.test(text(x))],
  ['Combinaisons',x=>x.category==='dress-bases'&&/(jumpsuit|playsuit|combi)/i.test(text(x))]
 ]],
 ['VESTES & MANTEAUX',[
  ['Vestes & blazers',x=>x.category==='outerwear'&&/(veste|jacket|blazer|smoking|bomber|perfecto)/i.test(text(x))],
  ['Manteaux & capes',x=>x.category==='outerwear'&&!/(veste|jacket|blazer|smoking|bomber|perfecto)/i.test(text(x))]
 ]],
 ['CONSTRUCTION',[
  ['Lignes & volumes',x=>x.category==='construction'&&/(taille|waist|fit|shape|ligne|volume)/i.test(text(x))],
  ['Épaules & structure',x=>x.category==='construction'&&/(épaule|epaule|shoulder|découpe|decoupe|panel|baleine|boning|crinoline|rembourrage|padding)/i.test(text(x))],
  ['Autres constructions',x=>x.category==='construction']
 ]],
 ['DÉTAILS & FINITIONS',[
  ['Détails',x=>x.category==='details'],['Ornements',x=>x.category==='ornaments'],['Poches',x=>x.category==='pockets'],['Fermetures',x=>x.category==='closures'],['Traînes',x=>x.category==='trains'],['Capes & ajouts',x=>x.category==='capes']
 ]],
 ['ACCESSOIRES',[
  ['Accessoires',x=>x.category==='accessories'],['Bijoux',x=>x.category==='jewelry'],['Chaussures',x=>x.category==='shoes']
 ]]
];
function text(x){return [x?.id,x?.name,...(x?.tags||[])].join(' ').toLowerCase()}
function catalog(){return window.HCAtelierCatalog||null}
function known(){const c=catalog();const starter=c?.starterIds instanceof Set?c.starterIds:new Set(c?.starterIds||[]);const raw=read(UNLOCK,[]);const unlocked=new Set((Array.isArray(raw)?raw:[]).map(v=>typeof v==='string'?v:v?.id).filter(Boolean));return new Set([...starter,...unlocked])}
function items(){const c=catalog(),k=known();return (c?.items||[]).filter(x=>k.has(x.id))}
function image(x){return window.HCAtelierVisualReferences?.forItem?.(x.id)?.image||x.referenceUrl||''}
function variants(x){return window.HCAtelierVisualReferences?.variantsForItem?.(x.id)||[]}
function card(x,ref=null){const im=ref?.image||image(x);const label=ref?.label||x.name;const tags=ref?.tags||x.tags||[];return `<button class="hcf-card" draggable="true" data-id="${esc(x.id)}"${ref?` data-reference-id="${esc(ref.id)}"`:''}><span>${im?`<img src="${esc(im)}" alt="${esc(label)}">`:'✦'}</span><b>${esc(label)}</b>${tags.length?`<small>${esc(tags.slice(0,3).join(' · '))}</small>`:''}</button>`}
function cardsFor(x){const vs=variants(x);return vs.length?vs.map(v=>card(x,v)).join(''):card(x)}
function ensureHost(){let host=$('#hcv2AccordionHost');if(host)return host;const panel=$('.hcv2-left .hcv2-panel')||$('.hcv2-left');if(!panel)return null;host=document.createElement('div');host.id='hcv2AccordionHost';host.className='hcv2-accordions';const search=panel.querySelector('.hcv2-side-search');if(search)search.insertAdjacentElement('afterend',host);else panel.appendChild(host);return host}
function render(){const host=ensureHost(),c=catalog();if(!host||!c){setTimeout(render,150);return}const all=items();let out='';for(const [family,subs] of TREE){const used=new Set();const built=subs.map(([label,test])=>{const list=all.filter(x=>test(x)&&!used.has(x.id));list.forEach(x=>used.add(x.id));return [label,list]}).filter(([,list])=>list.length);if(!built.length)continue;const total=built.reduce((n,[,list])=>n+list.reduce((m,x)=>m+Math.max(1,variants(x).length),0),0);out+=`<details class="hcf-family"><summary><span>${esc(family)}</span><i>${total}</i><em>⌄</em></summary><div class="hcf-subwrap">${built.map(([label,list])=>{const count=list.reduce((m,x)=>m+Math.max(1,variants(x).length),0);return `<details class="hcf-sub"><summary><span>${esc(label)}</span><i>${count}</i><em>⌄</em></summary><div class="hcf-grid">${list.map(cardsFor).join('')}</div></details>`}).join('')}</div></details>`}rendering=true;host.innerHTML=out;host.dataset.finalSidebar='1';bind(host);rendering=false}
function bind(host){host.querySelectorAll('.hcf-card').forEach(b=>{const add=()=>window.HCAtelierBoardComponents?.addToBoard?.(b.dataset.id,{referenceId:b.dataset.referenceId||null});b.onclick=add;b.ondragstart=e=>{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('text/hcv2-item',JSON.stringify({kind:'catalog',id:b.dataset.id,referenceId:b.dataset.referenceId||null}))};b.ondragend=e=>{if(e.dataTransfer?.dropEffect!=='none')add()}})}
function style(){if($('#hcfSidebarCss'))return;const s=document.createElement('style');s.id='hcfSidebarCss';s.textContent=`#hcv2AccordionHost{display:block!important;min-height:180px!important;overflow:auto!important;padding:8px 10px 16px!important}.hcf-family,.hcf-sub{display:block!important;border:1px solid #e5d7cc;border-radius:12px;background:#fff;overflow:hidden;margin:7px 0}.hcf-family>summary,.hcf-sub>summary{display:flex!important;align-items:center;gap:8px;list-style:none;cursor:pointer}.hcf-family>summary{padding:12px 13px;font:900 10px Arial;letter-spacing:.04em}.hcf-sub>summary{padding:10px 11px;background:#fbf5ef;font:800 9px Arial}.hcf-family summary::-webkit-details-marker,.hcf-sub summary::-webkit-details-marker{display:none}.hcf-family summary i,.hcf-sub summary i{margin-left:auto;font:700 8px Arial;color:#9a8578;font-style:normal}.hcf-family summary em,.hcf-sub summary em{font-style:normal;color:#9b7968}.hcf-subwrap{padding:0 7px 7px}.hcf-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:8px}.hcf-card{min-width:0;border:1px solid #eadfd6;border-radius:10px;background:#fffaf5;padding:7px;text-align:left;cursor:grab}.hcf-card span{height:78px;display:grid;place-items:center;background:#f4ece5;border-radius:7px;overflow:hidden;margin-bottom:5px;color:#b08c7a}.hcf-card img{width:100%;height:100%;object-fit:contain}.hcf-card b{display:block;font:12px/1.1 Georgia,serif;overflow-wrap:anywhere}.hcf-card small{display:block;margin-top:4px;font:7px/1.25 Arial;color:#8f7a6d}`;document.head.appendChild(s)}
function boot(){style();render();const obs=new MutationObserver(()=>{const host=ensureHost();if(!rendering&&host&&host.dataset.finalSidebar!=='1')setTimeout(render,0)});obs.observe(document.body,{childList:true,subtree:true});setInterval(()=>{const host=ensureHost();if(host&&(!host.children.length||host.dataset.finalSidebar!=='1'))render()},1200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1200));else setTimeout(boot,1200);
})();