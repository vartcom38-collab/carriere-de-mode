/* Haute Couture Live — Atelier simple layout v1
   Une bibliothèque unique à gauche, grande planche au centre, brief à droite.
   Les matières/couleurs/motifs utilisent les mêmes .hcf-card que les vêtements.
*/
(function(){
'use strict';
if(window.__HC_ATELIER_SIMPLE_LAYOUT_V1__)return;window.__HC_ATELIER_SIMPLE_LAYOUT_V1__=true;
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DATA={
 materials:[
  ['satin','Satin','linear-gradient(135deg,#f7f2eb 0%,#d8c8b8 48%,#fffaf3 58%,#cdb9a4 100%)'],
  ['soie','Soie','linear-gradient(135deg,#f8f4ef,#e9dfd5 45%,#fff 55%,#ddd0c3)'],
  ['tulle','Tulle','repeating-linear-gradient(45deg,#f8f3ee 0 4px,#e5dbd3 4px 5px)'],
  ['organza','Organza','linear-gradient(135deg,rgba(255,255,255,.92),rgba(228,214,203,.55)),repeating-linear-gradient(90deg,#eee2d9 0 1px,transparent 1px 6px)'],
  ['crepe','Crêpe','radial-gradient(circle at 30% 30%,#fff 0 1px,#e8ddd4 1.5px 2px,#f6efe9 2.5px)'],
  ['velours','Velours','linear-gradient(120deg,#55443d,#2f2521 45%,#7a665c 53%,#352925)'],
  ['lin','Lin','repeating-linear-gradient(0deg,#e6ddd4 0 1px,#f7f2ed 1px 4px),repeating-linear-gradient(90deg,transparent 0 3px,#d7cbc0 3px 4px)'],
  ['dentelle-matiere','Dentelle','radial-gradient(circle,#eadfd6 0 2px,transparent 2.5px),radial-gradient(circle at 8px 8px,#d5c5b9 0 1.4px,transparent 2px),#fbf6f1']
 ],
 colors:[
  ['ivoire','Ivoire','#f5f0e6'],['champagne','Champagne','#d9c3a0'],['dore','Doré','#b89352'],['rose-poudre','Rose poudré','#dfb7b2'],
  ['rouge','Rouge','#9f3f3a'],['bordeaux','Bordeaux','#6f2932'],['bleu-nuit','Bleu nuit','#29364b'],['bleu-ciel','Bleu ciel','#adc8d8'],
  ['vert-sauge','Vert sauge','#9eaa94'],['emeraude','Émeraude','#315f51'],['noir','Noir','#272321'],['blanc','Blanc','#ffffff']
 ],
 patterns:[
  ['uni','Uni','linear-gradient(#eee8e1,#eee8e1)'],
  ['rayures','Rayures fines','repeating-linear-gradient(90deg,#f8f3ed 0 8px,#a98d7d 8px 10px)'],
  ['pois','Pois','radial-gradient(circle,#8e6e60 0 3px,transparent 3.5px),#f8f1eb'],
  ['floral','Floral','radial-gradient(ellipse at 30% 35%,#b9867c 0 7%,transparent 8%),radial-gradient(ellipse at 65% 62%,#d5a89f 0 8%,transparent 9%),radial-gradient(circle at 48% 50%,#8ea08b 0 4%,transparent 5%),#f7efe8'],
  ['dentelle','Dentelle','radial-gradient(circle,#a98d82 0 2px,transparent 2.5px),radial-gradient(circle at 9px 9px,#d7c5bb 0 2px,transparent 2.5px),#fbf6f2'],
  ['plisse','Plissé','repeating-linear-gradient(90deg,#f8f2ec 0 7px,#d7c8bd 7px 9px,#eee2d9 9px 11px)'],
  ['brocart','Brocart','linear-gradient(45deg,transparent 45%,#b89157 46% 54%,transparent 55%),linear-gradient(-45deg,transparent 45%,#b89157 46% 54%,transparent 55%),#eee2d2'],
  ['perle','Perlé','radial-gradient(circle,#f9f7f2 0 3px,#cdbcae 3.5px 4.5px,transparent 5px),#e7ddd5']
 ]
};
function card(kind,id,name,preview){return `<button class="hcf-card hc-simple-source" type="button" data-mood-kind="${esc(kind)}" data-mood-id="${esc(id)}" data-name="${esc(name)}" data-preview-style="${esc(preview)}"><span class="hc-simple-preview" style="background:${preview}"></span><b>${esc(name)}</b><small>${kind==='material'?'Matière':kind==='color'?'Couleur':kind==='pattern'?'Motif':'Note'}</small></button>`}
function cards(kind,arr){return `<div class="hc-simple-grid">${arr.map(x=>card(kind,...x)).join('')}</div>`}
function build(){const shell=$('#hcAtelierShellV2'),host=$('#hcv2AccordionHost'),panel=$('.hcv2-left .hcv2-panel');if(!shell||!host||!panel){setTimeout(build,120);return}
 if($('#hcSimpleTabs'))return;
 const search=$('.hcv2-side-search');
 const tabs=document.createElement('div');tabs.id='hcSimpleTabs';tabs.className='hc-simple-tabs';tabs.innerHTML='<button class="active" data-pane="pieces">VÊTEMENTS</button><button data-pane="materials">MATIÈRES</button><button data-pane="colors">COULEURS</button><button data-pane="patterns">MOTIFS</button><button data-pane="notes">NOTES</button>';
 const panes=document.createElement('div');panes.id='hcSimplePanes';panes.innerHTML=`<div class="hc-simple-pane" data-pane="materials">${cards('material',DATA.materials)}</div><div class="hc-simple-pane" data-pane="colors">${cards('color',DATA.colors)}</div><div class="hc-simple-pane" data-pane="patterns">${cards('pattern',DATA.patterns)}</div><div class="hc-simple-pane" data-pane="notes"><div class="hc-simple-note-help"><b>Notes de création</b><span>Glisse une note sur ta planche, puis écris directement dedans.</span></div>${cards('note',[['note-libre','Note libre','linear-gradient(#fff9d9,#fff4b8)']])}</div>`;
 (search||panel.firstChild)?.insertAdjacentElement?.('afterend',tabs);tabs.insertAdjacentElement('afterend',panes);
 function show(name){tabs.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.pane===name));host.style.display=name==='pieces'?'block':'none';panes.querySelectorAll('.hc-simple-pane').forEach(p=>p.classList.toggle('active',p.dataset.pane===name));if(search)search.style.display=name==='pieces'?'block':'none'}
 tabs.addEventListener('click',e=>{const b=e.target.closest('button[data-pane]');if(b)show(b.dataset.pane)});show('pieces');
 document.querySelector('.afterBar')?.style.setProperty('display','none','important');
 document.querySelector('#hcMoodSelectionBar')?.style.setProperty('display','none','important');
 document.body.classList.add('hc-simple-layout');
}
function css(){if($('#hcSimpleLayoutCss'))return;const s=document.createElement('style');s.id='hcSimpleLayoutCss';s.textContent=`
body.hc-simple-layout #hcAtelierShellV2{background:#f3ebe4}body.hc-simple-layout .hcv2-main{grid-template-columns:320px minmax(680px,1fr) 320px;gap:12px;padding:12px;max-width:1850px}body.hc-simple-layout .hcv2-left .hcv2-panel,body.hc-simple-layout .hcv2-right .hcv2-panel{top:96px;max-height:calc(100vh - 108px)}body.hc-simple-layout .hcv2-left-top{padding:15px 16px 12px}body.hc-simple-layout .hcv2-left-top h2{font-size:26px}body.hc-simple-layout .hcv2-left-top p{font-size:9px}body.hc-simple-layout .hcv2-center-head{padding:14px 16px 8px}body.hc-simple-layout .hcv2-center-head h2{font-size:28px}body.hc-simple-layout .hcv2-workspace{padding:0 10px 10px}body.hc-simple-layout .hcv2-workspace .board{min-height:760px!important}body.hc-simple-layout .afterBar{display:none!important}body.hc-simple-layout #hcMoodSelectionBar{display:none!important}.hc-simple-tabs{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;padding:10px;border-bottom:1px solid #e2d4c9;background:#fbf5ef}.hc-simple-tabs button{border:1px solid #dfd1c6;background:#fff;border-radius:999px;padding:8px 6px;font:900 7px Arial;letter-spacing:.04em;cursor:pointer}.hc-simple-tabs button:first-child{grid-column:1/-1}.hc-simple-tabs button.active{background:#271f1b;color:#fff;border-color:#271f1b}.hc-simple-pane{display:none;overflow:auto;padding:10px;flex:1}.hc-simple-pane.active{display:block}.hc-simple-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.hc-simple-source{touch-action:none;user-select:none}.hc-simple-preview{height:78px!important;display:block!important;border-radius:8px!important;border:1px solid #e5d8ce!important;margin-bottom:6px!important}.hc-simple-source[data-mood-kind=color] .hc-simple-preview{height:70px!important}.hc-simple-source small{display:block;margin-top:4px;font:700 7px Arial;color:#9a8275;text-transform:uppercase}.hc-simple-note-help{padding:10px 11px;margin-bottom:9px;border-radius:12px;background:#f6eee7}.hc-simple-note-help b{display:block;font:15px Georgia,serif}.hc-simple-note-help span{display:block;margin-top:4px;font:9px/1.4 Georgia,serif;color:#7b6960}@media(max-width:1350px){body.hc-simple-layout .hcv2-main{grid-template-columns:300px 1fr}body.hc-simple-layout .hcv2-right{grid-column:1/-1}}
`;document.head.appendChild(s)}
function boot(){css();build();new MutationObserver(()=>{if(!$('#hcSimpleTabs'))build();document.querySelector('.afterBar')?.style.setProperty('display','none','important')}).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1300));else setTimeout(boot,1300);
})();