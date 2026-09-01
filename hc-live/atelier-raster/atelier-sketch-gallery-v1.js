/* Haute Couture Live — galerie des croquis v1
   3 emplacements visibles, choix clair, réalisation après sélection.
*/
(function(){
'use strict';
if(window.__HC_SKETCH_GALLERY_V1__)return;window.__HC_SKETCH_GALLERY_V1__=true;
const $=s=>document.querySelector(s);
function css(){if($('#hcSketchGalleryCss'))return;const s=document.createElement('style');s.id='hcSketchGalleryCss';s.textContent=`
#hcGcPanel{margin-top:14px!important;padding:16px!important;border:1px solid #e2d5cb!important;border-radius:18px!important;background:#fff!important;box-shadow:0 12px 30px rgba(70,50,38,.06)!important}
#hcGcPanel .hc-gc-head small{font:900 8px Arial!important;letter-spacing:.12em!important;color:#a06a56!important}
#hcGcPanel .hc-gc-head h3{margin:4px 0 3px!important;font:700 28px Georgia,serif!important;color:#241c18!important}
#hcGcPanel .hc-gc-head p{margin:0 0 12px!important;font:11px/1.5 Arial!important;color:#7f7068!important}
#hcGcGrid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:14px!important;margin-top:12px!important}
.hc-gc-card,.hc-sketch-placeholder{position:relative!important;min-height:410px!important;border:1px solid #e6d9cf!important;border-radius:16px!important;background:#fffaf6!important;padding:10px!important;text-align:left!important;overflow:hidden!important}
.hc-gc-card{cursor:pointer!important;transition:transform .15s ease,border-color .15s ease,box-shadow .15s ease!important}
.hc-gc-card:hover{transform:translateY(-2px)!important;box-shadow:0 12px 24px rgba(63,46,36,.08)!important}
.hc-gc-card.selected{border:2px solid #2b211c!important;box-shadow:0 0 0 3px rgba(43,33,28,.08)!important}
.hc-gc-card.selected:after{content:'CHOISI';position:absolute;right:10px;top:10px;background:#211a16;color:#fff;border-radius:999px;padding:6px 9px;font:900 8px Arial;letter-spacing:.08em;z-index:3}
.hc-gc-card img{display:block!important;width:100%!important;height:320px!important;object-fit:contain!important;background:#f7f0ea!important;border-radius:12px!important;margin-bottom:10px!important}
.hc-gc-card>span{display:block!important;margin-bottom:7px!important;font:900 8px Arial!important;letter-spacing:.12em!important;color:#9b6c57!important}
.hc-gc-card>b{display:block!important;font:700 17px Georgia,serif!important;color:#261d18!important}
.hc-gc-card>small{display:block!important;margin-top:5px!important;font:10px/1.4 Arial!important;color:#817168!important}
.hc-sketch-placeholder{display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;color:#9a8b82!important;background:linear-gradient(180deg,#fffaf6,#f7efe8)!important}
.hc-sketch-placeholder:before{content:'';width:70%;height:285px;border:1px dashed #d9c9bd;border-radius:12px;background:rgba(255,255,255,.55);margin-bottom:13px}
.hc-sketch-placeholder b{font:700 16px Georgia,serif;color:#6f6058}.hc-sketch-placeholder span{margin-top:5px;font:9px Arial}
#hcGcRealise{margin-top:14px!important;padding:14px 16px!important;font-size:10px!important}
#hcGcStatus{margin-top:10px!important}
@media(max-width:1000px){#hcGcGrid{grid-template-columns:1fr!important}.hc-gc-card,.hc-sketch-placeholder{min-height:360px!important}.hc-gc-card img{height:290px!important}}
`;document.head.appendChild(s)}
function placeholders(){const p=$('#hcGcPanel'),g=$('#hcGcGrid');if(!p||!g)return false;const h=p.querySelector('.hc-gc-head h3');if(h)h.textContent='Mes croquis générés';const para=p.querySelector('.hc-gc-head p');if(para)para.textContent='Les 3 propositions de stylisme apparaissent ici. Clique sur ton croquis préféré pour le choisir.';if(!g.children.length){g.innerHTML=[1,2,3].map(i=>`<div class="hc-sketch-placeholder"><b>Croquis ${i}</b><span>En attente de génération Magnific</span></div>`).join('')}return true}
function restoreSelection(){const g=$('#hcGcGrid');if(!g||!g.querySelector('.hc-gc-card'))return;let selected=null;try{selected=JSON.parse(localStorage.getItem('haute-couture-atelier-selected-sketch-v2')||'null')}catch(_){}if(!selected)return;[...g.querySelectorAll('.hc-gc-card')].forEach(card=>{const img=card.querySelector('img')?.src||'';if(selected.url&&img===selected.url)card.classList.add('selected')})}
function boot(){css();let tries=0;const timer=setInterval(()=>{tries++;if(placeholders()){clearInterval(timer);restoreSelection()}if(tries>80)clearInterval(timer)},150);window.addEventListener('hc-atelier-sketch-selected',()=>setTimeout(restoreSelection,0))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();