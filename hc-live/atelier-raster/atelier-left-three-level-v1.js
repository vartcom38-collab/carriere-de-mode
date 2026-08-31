/* Haute Couture Live — Atelier left library v3
   Structure stricte : catégorie -> sous-catégorie -> vignettes glisser-déposer.
*/
(function(){
'use strict';
if(window.__HC_LEFT_THREE_LEVEL_V1__) return;
window.__HC_LEFT_THREE_LEVEL_V1__=true;
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??f}catch(e){return f}};
const UNLOCK='haute-couture-atelier-unlocks-v1',FABRICS='haute-couture-fabric-library-v1';
let rendering=false,observer=null;
function C(){return window.HCAtelierCatalog||null}
function knownSet(){const c=C(),starter=c?.starterIds instanceof Set?c.starterIds:new Set(c?.starterIds||[]),raw=read(UNLOCK,[]),u=new Set((Array.isArray(raw)?raw:[]).map(v=>typeof v==='string'?v:v?.id).filter(Boolean));return new Set([...starter,...u])}
function items(){const k=knownSet();return (C()?.items||[]).filter(x=>k.has(x.id))}
function hay(x){return [x?.id,x?.name,...(x?.tags||[])].join(' ').toLowerCase()}
function visual(x){return window.HCAtelierVisualReferences?.forItem?.(x.id)?.image||x.referenceUrl||''}
const TREE=[
 {label:'HAUTS',subs:[
  ['T-shirts',x=>x.category==='tops'&&/(t-shirt|tee|tshirt)/i.test(hay(x))],
  ['Débardeurs',x=>x.category==='tops'&&/(débardeur|debardeur|tank)/i.test(hay(x))],
  ['Tops & caracos',x=>x.category==='tops'&&/(top|caraco|camisole)/i.test(hay(x))&&!/(crop|débardeur|debardeur|tank|t-shirt|tee|tshirt)/i.test(hay(x))],
  ['Crop tops & bandeaux',x=>x.category==='tops'&&/(crop|bandeau|brassière|brassiere)/i.test(hay(x))],
  ['Chemises & blouses',x=>x.category==='tops'&&/(chemise|chemisier|blouse|shirt|tunique)/i.test(hay(x))],
  ['Bustiers & corsets',x=>x.category==='tops'&&/(bustier|corset|body)/i.test(hay(x))],
  ['Mailles & gilets',x=>x.category==='tops'&&/(pull|maille|cardigan|gilet|sweater)/i.test(hay(x))],
  ['Autres hauts',x=>x.category==='tops'&&!/(t-shirt|tee|tshirt|débardeur|debardeur|tank|top|caraco|camisole|crop|bandeau|brassière|brassiere|chemise|chemisier|blouse|shirt|tunique|bustier|corset|body|pull|maille|cardigan|gilet|sweater)/i.test(hay(x))]
 ]},
 {label:'MANCHES',subs:[
  ['Sans manches & mancherons',x=>x.category==='sleeves'&&/(sans manche|none|cap|mancheron)/i.test(hay(x))],
  ['Manches courtes',x=>x.category==='sleeves'&&/(courte|short)/i.test(hay(x))],
  ['Manches 3/4',x=>x.category==='sleeves'&&/(3\/4|34)/i.test(hay(x))],
  ['Manches longues',x=>x.category==='sleeves'&&/(longue|long)/i.test(hay(x))&&!/(ballon|gigot|bishop|cloche|bell|lantern)/i.test(hay(x))],
  ['Ballon & bouffantes',x=>x.category==='sleeves'&&/(ballon|balloon|bouffante|puff)/i.test(hay(x))],
  ['Gigot & évêque',x=>x.category==='sleeves'&&/(gigot|bishop|évêque|eveque)/i.test(hay(x))],
  ['Évasées & cloche',x=>x.category==='sleeves'&&/(évasée|evasee|cloche|bell|flare)/i.test(hay(x))],
  ['Manches couture',x=>x.category==='sleeves'&&!/(sans manche|none|cap|mancheron|courte|short|3\/4|34|longue|long|ballon|balloon|bouffante|puff|gigot|bishop|évêque|eveque|évasée|evasee|cloche|bell|flare)/i.test(hay(x))]
 ]},
 {label:'ENCOLURES',subs:[
  ['Ronde',x=>x.category==='necklines'&&/(ronde|round)/i.test(hay(x))],['V',x=>x.category==='necklines'&&/(neck-v|encolure v|col v)/i.test(hay(x))],['Carrée',x=>x.category==='necklines'&&/(carrée|carree|square)/i.test(hay(x))],['Bateau',x=>x.category==='necklines'&&/(bateau|boat)/i.test(hay(x))],['Asymétriques',x=>x.category==='necklines'&&/(asym|one shoulder)/i.test(hay(x))],['Drapées & couture',x=>x.category==='necklines'&&!/(ronde|round|neck-v|encolure v|col v|carrée|carree|square|bateau|boat|asym|one shoulder)/i.test(hay(x))]
 ]},
 {label:'COLS',subs:[
  ['Col chemise',x=>x.category==='collars'&&/(chemise|shirt)/i.test(hay(x))],['Claudine',x=>x.category==='collars'&&/(claudine|peter)/i.test(hay(x))],['Montant & officier',x=>x.category==='collars'&&/(montant|officier|mandarin|high)/i.test(hay(x))],['Tailoring',x=>x.category==='collars'&&/(tailor|revers|lapel)/i.test(hay(x))],['Cols couture',x=>x.category==='collars'&&!/(chemise|shirt|claudine|peter|montant|officier|mandarin|high|tailor|revers|lapel)/i.test(hay(x))]
 ]},
 {label:'DOS',subs:[['Dos fermés',x=>x.category==='backs'&&/(fermé|ferme|closed)/i.test(hay(x))],['Dos V',x=>x.category==='backs'&&/(back-v|dos v)/i.test(hay(x))],['Dos nus & ouverts',x=>x.category==='backs'&&/(nu|ouvert|open)/i.test(hay(x))],['Dos travaillés',x=>x.category==='backs'&&!/(fermé|ferme|closed|back-v|dos v|nu|ouvert|open)/i.test(hay(x))]]},
 {label:'BAS',subs:[
  ['Jupes courtes',x=>x.category==='bottoms'&&/(skirt|jupe)/i.test(hay(x))&&/(mini|courte|short)/i.test(hay(x))],['Jupes midi',x=>x.category==='bottoms'&&/(skirt|jupe)/i.test(hay(x))&&/(midi|crayon|pliss)/i.test(hay(x))],['Jupes longues & volumes',x=>x.category==='bottoms'&&/(skirt|jupe)/i.test(hay(x))&&/(long|sirene|sirène|godet|cercle|boule|maxi)/i.test(hay(x))],['Pantalons droits',x=>x.category==='bottoms'&&/(pantalon|pants)/i.test(hay(x))&&/(droit|straight|cigarette)/i.test(hay(x))],['Pantalons larges',x=>x.category==='bottoms'&&/(pantalon|pants|palazzo)/i.test(hay(x))&&/(large|wide|palazzo)/i.test(hay(x))],['Jeans',x=>x.category==='bottoms'&&/(jean|denim)/i.test(hay(x))],['Shorts & bermudas',x=>x.category==='bottoms'&&/(short|bermuda|cycliste)/i.test(hay(x))],['Autres bas',x=>x.category==='bottoms'&&!/(skirt|jupe|pantalon|pants|palazzo|jean|denim|short|bermuda|cycliste)/i.test(hay(x))]
 ]},
 {label:'ROBES & COMBINAISONS',subs:[['Robes courtes',x=>x.category==='dress-bases'&&/(robe|dress)/i.test(hay(x))&&/(courte|mini|short)/i.test(hay(x))],['Robes midi',x=>x.category==='dress-bases'&&/(robe|dress)/i.test(hay(x))&&/midi/i.test(hay(x))],['Robes longues',x=>x.category==='dress-bases'&&/(robe|dress)/i.test(hay(x))&&/(long|maxi|gown)/i.test(hay(x))],['Robes couture',x=>x.category==='dress-bases'&&/(robe|dress)/i.test(hay(x))&&!/(courte|mini|short|midi|long|maxi|gown)/i.test(hay(x))],['Combinaisons',x=>x.category==='dress-bases'&&/(jumpsuit|playsuit|combi)/i.test(hay(x))]]},
 {label:'VESTES & MANTEAUX',subs:[['Vestes',x=>x.category==='outerwear'&&/(veste|jacket)/i.test(hay(x))],['Blazers & smoking',x=>x.category==='outerwear'&&/(blazer|smoking|tux)/i.test(hay(x))],['Bombers & perfecto',x=>x.category==='outerwear'&&/(bomber|perfecto|biker)/i.test(hay(x))],['Manteaux',x=>x.category==='outerwear'&&/(manteau|coat|trench)/i.test(hay(x))],['Capes',x=>x.category==='outerwear'&&/(cape)/i.test(hay(x))]]},
 {label:'CONSTRUCTION',subs:[['Lignes de taille',x=>x.category==='construction'&&/(taille|waist)/i.test(hay(x))],['Volumes',x=>x.category==='construction'&&/(volume|shape)/i.test(hay(x))],['Épaules',x=>x.category==='construction'&&/(épaule|epaule|shoulder)/i.test(hay(x))],['Découpes',x=>x.category==='construction'&&/(découpe|decoupe|cut|panel)/i.test(hay(x))],['Drapés & plis',x=>x.category==='construction'&&/(drap|pli|pleat|gather)/i.test(hay(x))],['Autres constructions',x=>x.category==='construction'&&!/(taille|waist|volume|shape|épaule|epaule|shoulder|découpe|decoupe|cut|panel|drap|pli|pleat|gather)/i.test(hay(x))]]},
 {label:'DÉTAILS & FINITIONS',subs:[['Détails',x=>x.category==='details'],['Ornements',x=>x.category==='ornaments'],['Poches',x=>x.category==='pockets'],['Fermetures',x=>x.category==='closures'],['Traînes',x=>x.category==='trains'],['Capes & ajouts',x=>x.category==='capes']]},
 {label:'MOTIFS',subs:[['Motifs débloqués',x=>x.category==='patterns']]},
 {label:'ACCESSOIRES',subs:[['Accessoires',x=>x.category==='accessories'],['Bijoux',x=>x.category==='jewelry'],['Chaussures',x=>x.category==='shoes']]}
];
function card(x){const img=visual(x);return `<button class="hc3-card" draggable="true" data-kind="catalog" data-id="${esc(x.id)}"><span>${img?`<img src="${esc(img)}" alt="${esc(x.name)}">`:'✦'}</span><b>${esc(x.name)}</b></button>`}
function fabricCard(f){return `<button class="hc3-card hc3-fabric" draggable="true" data-kind="fabric" data-id="${esc(f.id)}"><span>${f.image?`<img src="${esc(f.image)}" alt="${esc(f.name)}">`:'✦'}</span><b>${esc(f.name)}</b></button>`}
function bind(root){root.querySelectorAll('[data-kind][data-id]').forEach(el=>{el.onclick=()=>add(el.dataset.kind,el.dataset.id);el.ondragstart=e=>{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('text/hcv2-item',JSON.stringify({kind:el.dataset.kind,id:el.dataset.id}))}})}
function add(kind,id){if(kind==='catalog')return window.HCAtelierBoardComponents?.addToBoard?.(id);if(kind==='fabric')return window.HCStylistNotebook?.add?.('fabric',id)}
function desiredMarkup(){const all=items();let out='';for(const fam of TREE){const subs=fam.subs.map(([label,test])=>[label,all.filter(test)]).filter(x=>x[1].length);const total=subs.reduce((n,x)=>n+x[1].length,0);if(!total)continue;out+=`<details class="hc3-family"><summary><span>${esc(fam.label)}</span><i>${total}</i><em>⌄</em></summary><div class="hc3-subs">${subs.map(([label,list])=>`<details class="hc3-sub"><summary><span>${esc(label)}</span><i>${list.length}</i><em>⌄</em></summary><div class="hc3-grid">${list.map(card).join('')}</div></details>`).join('')}</div></details>`}
 const fabrics=read(FABRICS,[]);if(fabrics.length)out+=`<details class="hc3-family"><summary><span>MATIÈRES</span><i>${fabrics.length}</i><em>⌄</em></summary><div class="hc3-subs"><details class="hc3-sub"><summary><span>Tissus débloqués</span><i>${fabrics.length}</i><em>⌄</em></summary><div class="hc3-grid">${fabrics.map(fabricCard).join('')}</div></details></div></details>`;
 return out||'<div class="hc3-empty">Aucun élément créatif débloqué pour le moment.</div>'}
function render(){const host=$('#hcv2AccordionHost');if(!host||!C()||!window.HCAtelierBoardComponents){setTimeout(render,120);return}const html=desiredMarkup();if(host.dataset.hc3==='1'&&host.innerHTML===html)return;rendering=true;host.innerHTML=html;host.dataset.hc3='1';bind(host);rendering=false}
function watch(){const host=$('#hcv2AccordionHost');if(!host){setTimeout(watch,150);return}observer?.disconnect();observer=new MutationObserver(()=>{if(rendering)return;if(!host.querySelector('.hc3-family')||host.querySelector('.hcv2-acc,.hcn-family'))setTimeout(render,0)});observer.observe(host,{childList:true,subtree:false});}
function css(){if($('#hc3Css'))return;const s=document.createElement('style');s.id='hc3Css';s.textContent=`
#hcv2AccordionHost{padding:8px 10px 18px!important}.hc3-family{border:1px solid #e2d3c7;border-radius:14px;background:#fff;margin:8px 0;overflow:hidden}.hc3-family>summary,.hc3-sub>summary{display:flex;align-items:center;gap:8px;list-style:none;cursor:pointer}.hc3-family>summary{padding:13px 14px;font:900 10px Arial;letter-spacing:.05em}.hc3-sub{margin:7px 8px;border:1px solid #eaded4;border-radius:11px;background:#fbf6f0;overflow:hidden}.hc3-sub>summary{padding:10px 11px;font:800 9px Arial;background:#fbf6f0}.hc3-family summary::-webkit-details-marker,.hc3-sub summary::-webkit-details-marker{display:none}.hc3-family summary i,.hc3-sub summary i{margin-left:auto;font:700 8px Arial;color:#9a8578;font-style:normal}.hc3-family summary em,.hc3-sub summary em{font:16px Georgia,serif;color:#a17e6d;transform:rotate(-90deg);transition:.15s}.hc3-family[open]>summary em,.hc3-sub[open]>summary em{transform:rotate(0)}.hc3-subs{padding:0 2px 7px}.hc3-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:8px;background:#fff}.hc3-card{min-width:0;border:1px solid #eaded4;background:#fffaf5;border-radius:10px;padding:7px;text-align:left;cursor:grab}.hc3-card span{height:82px;display:grid;place-items:center;background:#f3ebe4;border-radius:7px;overflow:hidden;margin-bottom:6px;color:#b08c7a;font:20px Georgia,serif}.hc3-card img{width:100%;height:100%;object-fit:contain}.hc3-fabric img{object-fit:cover}.hc3-card b{display:block;font:13px/1.08 Georgia,serif;color:#251e1a;overflow-wrap:anywhere}.hc3-empty{padding:16px;font:italic 11px Georgia,serif;color:#8a776b}`;document.head.appendChild(s)}
function boot(){css();render();watch();setInterval(()=>{const h=$('#hcv2AccordionHost');if(h&&!h.querySelector('.hc3-family'))render()},1200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,900));else setTimeout(boot,900);
})();