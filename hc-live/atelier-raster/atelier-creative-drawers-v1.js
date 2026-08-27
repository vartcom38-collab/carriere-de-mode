/* Haute Couture Live — Atelier creative drawers v2
   Vêtements/construction à gauche ; tissus, motifs et couleurs sous le moodboard.
   Tous les contenus restent liés aux connaissances/déblocages de la partie.
*/
(function(){
'use strict';
if(window.__HC_CREATIVE_DRAWERS_V2__) return;
window.__HC_CREATIVE_DRAWERS_V2__=true;

const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??f}catch(e){return f}};
const UNLOCK='haute-couture-atelier-unlocks-v1';
const FABRICS='haute-couture-fabric-library-v1';
const COLOR_UNLOCK='haute-couture-atelier-color-library-v1';

function C(){return window.HCAtelierCatalog||null}
function knownSet(){
  const c=C();
  const starter=c?.starterIds instanceof Set?c.starterIds:new Set(c?.starterIds||[]);
  const raw=read(UNLOCK,[]);
  const unlocked=new Set((Array.isArray(raw)?raw:[]).map(v=>typeof v==='string'?v:v?.id).filter(Boolean));
  return new Set([...starter,...unlocked]);
}
function knownItems(){const k=knownSet();return (C()?.items||[]).filter(x=>k.has(x.id))}
function visual(x){return window.HCAtelierVisualReferences?.forItem?.(x.id)?.image||x.referenceUrl||''}
function text(x){return (String(x?.id||'')+' '+String(x?.name||'')+' '+(x?.tags||[]).join(' ')).toLowerCase()}

const FAMILIES=[
  {label:'HAUTS',subs:[
    ['Tops & T-shirts',x=>x.category==='tops'&&!/(crop|chemise|chemisier|blouse|bustier|corset|body|pull|cardigan|gilet|tunique)/i.test(text(x))],
    ['Crop tops & courts',x=>x.category==='tops'&&/(crop|court|brassière|bandeau)/i.test(text(x))],
    ['Chemises & blouses',x=>x.category==='tops'&&/(chemise|chemisier|blouse|tunique)/i.test(text(x))],
    ['Bustiers, corsets & bodies',x=>x.category==='tops'&&/(bustier|corset|body)/i.test(text(x))],
    ['Mailles & gilets',x=>x.category==='tops'&&/(pull|cardigan|gilet)/i.test(text(x))]
  ]},
  {label:'MANCHES',subs:[
    ['Basiques',x=>x.category==='sleeves'&&/(none|short|long|34|cap|sans manche|courte|longue|3\/4|mancheron)/i.test(text(x))],
    ['Volumes',x=>x.category==='sleeves'&&/(balloon|gigot|bishop|bell|lantern|ballon|gigot|évêque|cloche|bouffante)/i.test(text(x))],
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
  {label:'PANTALONS',subs:[
    ['Pantalons',x=>x.category==='bottoms'&&/(pants-|pantalon|palazzo|legging|sarouel)/i.test(text(x))],
    ['Jeans',x=>x.category==='bottoms'&&/(jean|denim)/i.test(text(x))],
    ['Shorts & bermudas',x=>x.category==='bottoms'&&/(short|bermuda|cycliste)/i.test(text(x))]
  ]},
  {label:'JUPES',subs:[
    ['Courtes & midi',x=>x.category==='bottoms'&&/skirt-/i.test(String(x.id||''))&&!/(longue|sirene|godets|cercle|boule)/i.test(text(x))],
    ['Longues & volumes',x=>x.category==='bottoms'&&/skirt-/i.test(String(x.id||''))&&/(longue|sirene|godets|cercle|boule)/i.test(text(x))]
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

function card(x){
  const img=visual(x);
  return `<button class="hcd-item" draggable="true" data-kind="catalog" data-id="${esc(x.id)}"><span>${img?`<img src="${esc(img)}" alt="${esc(x.name)}">`:'✦'}</span><b>${esc(x.name)}</b></button>`;
}
function empty(){return '<div class="hcd-empty">Aucun élément débloqué dans cette sous-catégorie pour le moment.</div>'}

function renderSidebar(){
  const host=$('#hcv2AccordionHost');
  if(!host||!C()) return false;
  const all=knownItems();
  host.innerHTML=FAMILIES.map((family,index)=>{
    const subs=family.subs.map(([label,test])=>[label,all.filter(test)]);
    const count=subs.reduce((n,p)=>n+p[1].length,0);
    return `<details class="hcd-family" ${index===0?'open':''}><summary><span>${family.label}</span><i>${count}</i><em>⌄</em></summary><div class="hcd-subwrap">${subs.map(([label,list],si)=>`<details class="hcd-sub" ${index===0&&si===0?'open':''}><summary><span>${esc(label)}</span><i>${list.length}</i><em>⌄</em></summary><div class="hcd-grid">${list.length?list.map(card).join(''):empty()}</div></details>`).join('')}</div></details>`;
  }).join('');
  bindCards(host);
  return true;
}

function fabrics(){const v=read(FABRICS,[]);return Array.isArray(v)?v:[]}
function fabricFamily(f){
  const s=[f?.name,f?.composition,f?.weave,f?.usage].filter(Boolean).join(' ').toLowerCase();
  if(/denim|jean/.test(s))return'Denims';
  if(/soie|satin/.test(s))return'Soies & satins';
  if(/lin/.test(s))return'Lins';
  if(/laine|tweed/.test(s))return'Laines & tailleurs';
  if(/coton|popeline/.test(s))return'Cotons';
  if(/tulle|dentelle|organza/.test(s))return'Tulles & transparences';
  return'Autres tissus';
}
function patterns(){return knownItems().filter(x=>x.category==='patterns')}
function colors(){
  const base=window.HCAtelierStarterBase?.colors||C()?.starterProfile?.colors||[];
  const extra=read(COLOR_UNLOCK,[]);
  const map=new Map();
  [...(Array.isArray(base)?base:[]),...(Array.isArray(extra)?extra:[])].forEach(c=>{if(c?.name)map.set(c.id||c.name,c)});
  return [...map.values()];
}
function drawer(title,kicker,body,open){return `<details class="hcd-drawer" ${open?'open':''}><summary><div><small>${kicker}</small><b>${title}</b></div><em>⌄</em></summary><div class="hcd-drawer-body">${body}</div></details>`}

function renderBottom(){
  const center=$('.hcv2-center .hcv2-panel');
  const status=$('.hcv2-status');
  if(!center||!status)return false;
  let host=$('#hcCreativeDrawers');
  if(!host){host=document.createElement('section');host.id='hcCreativeDrawers';center.insertBefore(host,status)}

  const fg={};
  fabrics().forEach(f=>{const key=fabricFamily(f);(fg[key]||(fg[key]=[])).push(f)});
  const fabricHtml=Object.entries(fg).map(([name,list])=>`<details class="hcd-material-sub"><summary><span>${esc(name)}</span><i>${list.length}</i><em>⌄</em></summary><div class="hcd-strip">${list.map(f=>`<button class="hcd-material" draggable="true" data-kind="fabric" data-id="${esc(f.id)}"><span>${f.image?`<img src="${esc(f.image)}" alt="${esc(f.name)}">`:'✦'}</span><b>${esc(f.name)}</b><small>${esc(f.color||'')}</small></button>`).join('')}</div></details>`).join('')||'<p class="hcd-emptyline">Aucun tissu débloqué pour le moment.</p>';

  const pats=patterns();
  const patternHtml=pats.length?`<div class="hcd-strip">${pats.map(x=>`<button class="hcd-material" draggable="true" data-kind="catalog" data-id="${esc(x.id)}"><span>${visual(x)?`<img src="${esc(visual(x))}" alt="${esc(x.name)}">`:'✦'}</span><b>${esc(x.name)}</b></button>`).join('')}</div>`:'<p class="hcd-emptyline">Les motifs apparaîtront ici au fur et à mesure des découvertes.</p>';

  const cols=colors();
  const colorHtml=cols.length?`<div class="hcd-strip hcd-colors">${cols.map(c=>`<button class="hcd-color" draggable="true" data-kind="color" data-id="${esc(c.id||c.name)}"><i style="background:${esc(c.value||c.hex||'#d8c4b5')}"></i><b>${esc(c.name)}</b></button>`).join('')}</div>`:'<p class="hcd-emptyline">Aucune couleur connue pour le moment.</p>';

  host.innerHTML=drawer('TISSUS','MATIÈRES DÉBLOQUÉES',fabricHtml,true)+drawer('MOTIFS','RÉFÉRENCES DÉBLOQUÉES',patternHtml,false)+drawer('COULEURS','PALETTE CONNUE',colorHtml,false);
  bindCards(host);
  return true;
}

async function add(kind,id,x,y){
  if(kind==='catalog'){
    const ok=await window.HCAtelierBoardComponents?.addToBoard?.(id);
    if(ok&&Number.isFinite(x)&&Number.isFinite(y))setTimeout(()=>positionLast(x,y),0);
    return;
  }
  if(kind==='fabric'||kind==='color')window.HCStylistNotebook?.add?.(kind,id,x,y);
}
function positionLast(x,y){
  const board=$('#board');
  const cards=board?.querySelectorAll('#drop .pieceCard');
  const el=cards?.[cards.length-1];
  if(!board||!el)return;
  const r=board.getBoundingClientRect();
  el.style.left=Math.max(8,Math.min(r.width-el.offsetWidth,x-r.left-el.offsetWidth/2))+'px';
  el.style.top=Math.max(8,Math.min(r.height-el.offsetHeight,y-r.top-el.offsetHeight/2))+'px';
  window.HCAtelierBoardComponents?.sync?.();
}
function bindCards(root){
  root.querySelectorAll('[data-kind][data-id]').forEach(el=>{
    const payload={kind:el.dataset.kind,id:el.dataset.id};
    el.onclick=()=>add(payload.kind,payload.id);
    el.ondragstart=e=>{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('text/hcv2-item',JSON.stringify(payload));if(payload.kind==='fabric'||payload.kind==='color')e.dataTransfer.setData('text/hc-stylist',JSON.stringify(payload))};
  });
}
function bindDrop(){
  const board=$('#board');
  if(!board||board.dataset.hcdDrop==='1')return;
  board.dataset.hcdDrop='1';
  board.addEventListener('dragover',e=>{if(e.dataTransfer.types.includes('text/hcv2-item')){e.preventDefault();e.dataTransfer.dropEffect='copy'}});
  board.addEventListener('drop',e=>{const raw=e.dataTransfer.getData('text/hcv2-item');if(!raw)return;e.preventDefault();try{const d=JSON.parse(raw);add(d.kind,d.id,e.clientX,e.clientY)}catch(err){}});
}

function css(){
  if($('#hcCreativeDrawersCss'))return;
  const s=document.createElement('style');s.id='hcCreativeDrawersCss';s.textContent=`
.hcv2-side-search{display:none!important}.hcv2-left-top small{font-size:0!important}.hcv2-left-top small:after{content:'VÊTEMENTS & CONSTRUCTION';font:900 7px Arial;letter-spacing:.16em}.hcv2-left-top h2{font-size:0!important}.hcv2-left-top h2:after{content:'Mes vêtements';font:30px/.95 Georgia,serif}.hcv2-left-top p{font-size:0!important}.hcv2-left-top p:after{content:'Ouvre une famille puis une sous-catégorie. Seuls les éléments connus ou débloqués sont utilisables.';font:10px/1.5 Georgia,serif}.hcv2-accordions{padding:8px 10px 18px!important;overflow-y:auto!important;overflow-x:hidden!important}.hcd-family,.hcd-sub{display:block;width:100%;box-sizing:border-box;border:1px solid #e5d7cc;border-radius:13px;background:#fff;margin:7px 0;overflow:hidden}.hcd-family>summary,.hcd-sub>summary{list-style:none;display:flex;align-items:center;gap:8px;box-sizing:border-box;width:100%;padding:12px;cursor:pointer;font:900 10px Arial}.hcd-sub>summary{padding:9px 10px;background:#fffaf5;font-size:8px}.hcd-family summary::-webkit-details-marker,.hcd-sub summary::-webkit-details-marker{display:none}.hcd-family summary i,.hcd-sub summary i{font-style:normal;margin-left:auto;color:#9b8476;font-size:8px}.hcd-family summary em,.hcd-sub summary em{font-style:normal;font:17px Georgia,serif;transform:rotate(-90deg);transition:.15s}.hcd-family[open]>summary>em,.hcd-sub[open]>summary>em{transform:rotate(0deg)}.hcd-subwrap{padding:0 8px 8px}.hcd-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;padding:0 7px 8px}.hcd-item,.hcd-material,.hcd-color{box-sizing:border-box;min-width:0;border:1px solid #eadfd6;background:#fff;border-radius:11px;padding:6px;text-align:left;cursor:grab;color:#211d1a}.hcd-item span,.hcd-material span{display:grid;place-items:center;height:76px;border-radius:8px;background:#f5ede6;overflow:hidden}.hcd-item img,.hcd-material img{width:100%;height:100%;object-fit:contain}.hcd-material img{object-fit:cover}.hcd-item b,.hcd-material b,.hcd-color b{display:block;margin-top:5px;font:12px/1.08 Georgia,serif;overflow-wrap:anywhere}.hcd-material small{display:block;margin-top:3px;font:7px Arial;color:#8b796e}.hcd-empty{grid-column:1/-1;padding:10px;font:10px/1.35 Georgia,serif;color:#8b796e}.hcd-emptyline{margin:0;padding:10px 4px;font:11px Georgia,serif;color:#8b796e}#hcCreativeDrawers{padding:0 14px 14px}.hcd-drawer{border:1px solid #dfd0c4;border-radius:18px;background:#fffdf9;margin-top:10px;overflow:hidden}.hcd-drawer>summary{list-style:none;cursor:pointer;padding:14px 16px;display:flex;align-items:center}.hcd-drawer>summary::-webkit-details-marker{display:none}.hcd-drawer>summary small{display:block;font:900 7px Arial;letter-spacing:.14em;color:#b07a68}.hcd-drawer>summary b{display:block;font:22px Georgia,serif}.hcd-drawer>summary em{margin-left:auto;font:22px Georgia,serif;transform:rotate(-90deg);transition:.15s}.hcd-drawer[open]>summary>em{transform:rotate(0)}.hcd-drawer-body{padding:0 12px 12px}.hcd-material-sub{border-top:1px solid #eee2d9}.hcd-material-sub>summary{list-style:none;padding:10px 3px;cursor:pointer;font:900 9px Arial;display:flex;gap:8px}.hcd-material-sub summary::-webkit-details-marker{display:none}.hcd-material-sub i{font-style:normal;margin-left:auto;color:#9b8476}.hcd-material-sub em{font-style:normal}.hcd-strip{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;padding:4px 0 8px}.hcd-material span{height:90px}.hcd-color{text-align:center}.hcd-color i{display:block;height:70px;border-radius:8px}.hcd-colors .hcd-color{padding:7px}@media(max-width:1200px){.hcd-strip{grid-template-columns:repeat(3,minmax(0,1fr))}}`;
  document.head.appendChild(s);
}

function renderAll(){css();renderSidebar();renderBottom();bindDrop()}
function boot(){
  if(!$('#hcv2AccordionHost')||!C()||!window.HCAtelierStarterBase||!window.HCAtelierBoardComponents){setTimeout(boot,100);return}
  renderAll();
  window.addEventListener('hc-atelier-unlock',renderAll);
  window.addEventListener('hc-atelier-fabric-selected',renderBottom);
  window.addEventListener('hc-atelier-starter-base-ready',renderAll);
  window.addEventListener('storage',e=>{if([UNLOCK,FABRICS,COLOR_UNLOCK].includes(e.key))renderAll()});
  window.HCCreativeDrawers={version:2,render:renderAll,renderSidebar,renderBottom};
}
setTimeout(boot,250);
})();