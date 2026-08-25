/* Haute Couture Live — Atelier composition zones v1
   Couche additive : structure visuellement la planche sans silhouette centrale.
   Regroupe les composants connus par familles de construction et affiche une lecture synthétique.
*/
(function(){
'use strict';
if(window.HCAtelierCompositionZones)return;
const COMP_KEY='haute-couture-atelier-components-v1',FABRIC_KEY='haute-couture-atelier-selected-fabric-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch(e){return f}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const GROUPS=[
 {id:'shape',label:'FORME PRINCIPALE',cats:['dress-bases','tops','bottoms','outerwear','menswear','kids','baby','nightwear','sportswear','dancewear','uniforms','lingerie','swimwear']},
 {id:'sleeves',label:'MANCHES',cats:['sleeves']},
 {id:'neck',label:'ENCOLURE & COL',cats:['necklines','collars']},
 {id:'back',label:'DOS',cats:['backs']},
 {id:'construction',label:'CONSTRUCTION',cats:['construction','trains','capes']},
 {id:'details',label:'DÉTAILS & ORNEMENTS',cats:['details','ornaments','pockets','closures','belts']},
 {id:'accessories',label:'ACCESSOIRES',cats:['headwear','shoes','bags','accessories','jewelry','hosiery']},
 {id:'special',label:'MODULES SPÉCIAUX',cats:['stage','pageant','red-carpet','ceremony','bridal','avant-garde']}
];
function css(){if(document.getElementById('hcCompositionZonesStyle'))return;const s=document.createElement('style');s.id='hcCompositionZonesStyle';s.textContent=`
#hcCompositionReadout{margin:12px 0 0;border:1px solid #e4d8cf;background:#fffaf5;border-radius:18px;padding:12px;box-shadow:0 8px 22px #70503a0b}.hcz-head{display:flex;justify-content:space-between;align-items:end;gap:12px;margin-bottom:10px}.hcz-head h3{margin:0;font:22px Georgia,serif}.hcz-head p{margin:2px 0 0;font:9px/1.45 Arial;color:#8a786d}.hcz-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.hcz-zone{border:1px solid #eadfd7;background:#fff;border-radius:13px;padding:9px;min-height:82px}.hcz-zone.empty{opacity:.55}.hcz-k{font:900 7px Arial;letter-spacing:.11em;color:#a97c67;margin-bottom:6px}.hcz-item{display:inline-block;margin:2px 3px 2px 0;padding:5px 7px;border-radius:999px;background:#f6ece5;border:1px solid #ead9cd;font:8px Arial;color:#44382f}.hcz-fabric{background:#211a16;color:#fff;border-radius:999px;padding:6px 9px;font:900 8px Arial;white-space:nowrap}.hcz-count{font:900 8px Arial;color:#846d61}.hcz-board-label{position:absolute;z-index:1;border:1px dashed #d7c8bc;background:#fffaf5cc;border-radius:999px;padding:5px 8px;font:900 7px Arial;letter-spacing:.09em;color:#9a8173;pointer-events:none;backdrop-filter:blur(4px)}.hcz-l1{left:3%;top:3%}.hcz-l2{right:3%;top:3%}.hcz-l3{left:3%;bottom:3%}.hcz-l4{right:3%;bottom:3%}@media(max-width:1050px){.hcz-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}`;
document.head.appendChild(s)}
function groupFor(c){return GROUPS.find(g=>g.cats.includes(c))||{id:'other',label:'AUTRES',cats:[]}}
function ensureBoardLabels(){const board=document.getElementById('board');if(!board||board.querySelector('.hcz-board-label'))return;[['hcz-l1','FORMES'],['hcz-l2','CONSTRUCTION'],['hcz-l3','DÉTAILS'],['hcz-l4','MATIÈRES & ACCESSOIRES']].forEach(([cl,txt])=>{const n=document.createElement('div');n.className='hcz-board-label '+cl;n.textContent=txt;board.appendChild(n)})}
function ensureReadout(){let host=document.getElementById('hcCompositionReadout');if(host)return host;const workspace=document.querySelector('.workspace');const after=document.querySelector('.afterBar');if(!workspace||!after)return null;host=document.createElement('section');host.id='hcCompositionReadout';workspace.insertBefore(host,after);return host}
function render(){const host=ensureReadout();if(!host)return;const comps=read(COMP_KEY,[]),fabric=read(FABRIC_KEY,null),groups={};GROUPS.forEach(g=>groups[g.id]=[]);groups.other=[];for(const c of comps){const g=groupFor(c.category);(groups[g.id]||(groups[g.id]=[])).push(c)}const blocks=GROUPS.map(g=>{const arr=groups[g.id]||[];return `<div class="hcz-zone ${arr.length?'':'empty'}"><div class="hcz-k">${esc(g.label)}</div>${arr.length?arr.map(x=>`<span class="hcz-item">${esc(x.name)}</span>`).join(''):'<span class="hcz-count">Aucun élément</span>'}</div>`}).join('');host.innerHTML=`<div class="hcz-head"><div><h3>Lecture de ta composition</h3><p>La planche reste libre. Cette lecture sert à organiser la construction et à enrichir le prompt de stylisme.</p></div><div class="hcz-fabric">${fabric?'MATIÈRE · '+esc(fabric.name||fabric.title||'sélectionnée'):'MATIÈRE NON CHOISIE'}</div></div><div class="hcz-grid">${blocks}</div>`;window.dispatchEvent(new CustomEvent('hc-atelier-composition-zones-updated',{detail:{components:comps,groups,fabric}}))}
function boot(){if(!document.getElementById('board')){setTimeout(boot,80);return}css();ensureBoardLabels();render();window.addEventListener('hc-atelier-components-changed',render);window.addEventListener('hc-atelier-component-added',render);window.addEventListener('hc-atelier-fabric-selected',render);window.addEventListener('storage',e=>{if([COMP_KEY,FABRIC_KEY].includes(e.key))render()});window.HCAtelierCompositionZones={version:1,render,groups:GROUPS,groupFor};}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,260));else setTimeout(boot,260);
})();