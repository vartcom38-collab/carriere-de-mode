/* Haute Couture Live — Atelier workflow v2
   Planche libre sans silhouette centrale.
   Composition -> 4 directions de croquis -> choix -> réalisation (étape suivante).
*/
(function(){
'use strict';
if(window.__HC_ATELIER_WORKFLOW_V2__)return;window.__HC_ATELIER_WORKFLOW_V2__=true;
const BOARD_KEY='haute-couture-atelier-board-v2';
const SKETCH_KEY='haute-couture-atelier-selected-sketch-v2';
const REF_KEY='haute-couture-atelier-selected-reference-v1';
const FABRIC_KEY='haute-couture-atelier-selected-fabric-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch(e){return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(t){const n=document.getElementById('toast');if(!n)return;n.textContent=t;n.classList.add('show');setTimeout(()=>n.classList.remove('show'),1500)}
function css(){if(document.getElementById('hcAtelierWorkflowV2Css'))return;const s=document.createElement('style');s.id='hcAtelierWorkflowV2Css';s.textContent=`
.croquis{display:none!important}.board{min-height:720px;background:#fbf6ef!important;background-image:linear-gradient(#eadfd6 1px,transparent 1px),linear-gradient(90deg,#eadfd6 1px,transparent 1px)!important;background-size:32px 32px!important}.board:before{display:none!important}.hc-board-empty{position:absolute;inset:50% auto auto 50%;transform:translate(-50%,-50%);width:min(430px,70%);text-align:center;z-index:2;color:#8d7c71;pointer-events:none}.hc-board-empty b{display:block;font:italic 30px Georgia,serif;color:#c7796d;margin-bottom:8px}.hc-board-empty span{font:11px/1.55 Georgia,serif}.hc-board-empty.hidden{display:none}.pieceCard{width:154px!important;background:#fffdf9f2!important}.pieceCard img{height:126px!important}.noteCard{z-index:8!important}.afterBar{margin-top:14px!important}.tray p{min-height:20px}.hc-sketch-panel{display:none;margin:14px 0 2px;background:#fff;border:1px solid #e4d7ce;border-radius:18px;padding:14px;box-shadow:0 10px 28px rgba(73,53,40,.07)}.hc-sketch-panel.open{display:block}.hc-sketch-head{display:flex;justify-content:space-between;align-items:end;gap:14px;margin-bottom:12px}.hc-sketch-head h3{font:25px Georgia,serif;margin:0}.hc-sketch-head p{margin:3px 0 0;font:10px/1.45 Georgia,serif;color:#84736a}.hc-sketch-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}.hc-sketch-card{border:1px solid #e7dcd3;border-radius:14px;background:#fffaf5;padding:8px;cursor:pointer;text-align:left;transition:.15s}.hc-sketch-card:hover{transform:translateY(-2px);border-color:#d49b8d}.hc-sketch-card.selected{outline:2px solid #e97872;background:#fff4ef}.hc-sketch-preview{height:180px;border-radius:10px;background:#f4ece5;position:relative;overflow:hidden}.hc-sketch-preview img{position:absolute;width:72%;height:72%;object-fit:contain;filter:grayscale(1);opacity:.86}.hc-sketch-preview img:nth-child(1){left:-2%;top:4%;transform:rotate(-4deg)}.hc-sketch-preview img:nth-child(2){right:-2%;bottom:4%;transform:rotate(4deg)}.hc-sketch-preview img:nth-child(3){left:15%;bottom:-4%;transform:scale(.72) rotate(-2deg)}.hc-sketch-tag{position:absolute;left:8px;top:8px;background:#211d1ad9;color:#fff;border-radius:999px;padding:5px 7px;font:800 7px Arial,sans-serif;letter-spacing:.08em}.hc-sketch-card b{display:block;font:17px Georgia,serif;margin:7px 0 2px}.hc-sketch-card small{display:block;font:8px/1.45 Arial,sans-serif;color:#7d6e65}.hc-flow-status{margin-top:9px;border-radius:10px;padding:8px 10px;background:#f7eee8;font:9px/1.4 Arial,sans-serif;color:#6f5e54}.hc-next-realise{margin-top:10px;width:100%;border:0;border-radius:11px;background:#211d1a;color:#fff;padding:12px;font-size:9px;font-weight:900;cursor:pointer}.hc-next-realise:disabled{opacity:.35;cursor:not-allowed}@media(max-width:1250px){.hc-sketch-grid{grid-template-columns:1fr 1fr}}
`;document.head.appendChild(s)}
function rewriteChrome(){
 const steps=document.querySelector('.steps');if(steps)steps.innerHTML='<span class="step active"><b>1</b>Planche</span><span>—</span><span class="step"><b>2</b>4 croquis</span><span>—</span><span class="step"><b>3</b>Choix</span><span>—</span><span class="step"><b>4</b>Réalisation</span>';
 const brand=document.querySelector('.brand em');if(brand)brand.textContent='Studio de création';
 const notice=document.querySelector('.notice');if(notice)notice.textContent='Compose librement ta direction : formes, détails, matières, couleurs, motifs, inspirations et notes. Aucun mannequin imposé au centre.';
 const gen=document.getElementById('generateTop');if(gen)gen.textContent='CRÉER 4 DIRECTIONS DE CROQUIS ✨';
 const gen2=document.getElementById('generate');if(gen2)gen2.textContent='CRÉER 4 DIRECTIONS DE CROQUIS ✨';
 document.querySelectorAll('.tray p').forEach((p,i)=>p.textContent=['Références et matières découvertes à poser dans la direction créative','Palette de la proposition','Motifs et traitements à suggérer'][i]||p.textContent);
 const res=document.getElementById('result');if(res)res.style.display='none';
 const later=document.getElementById('styleLater');if(later)later.style.display='none';
}
function emptyState(){
 const b=document.getElementById('board');if(!b)return;document.querySelector('.croquis')?.remove();
 let e=document.getElementById('hcBoardEmpty');if(!e){e=document.createElement('div');e.id='hcBoardEmpty';e.className='hc-board-empty';e.innerHTML='<b>Ta planche est libre</b><span>Glisse ici des formes, des détails et tes idées. Ajoute ensuite matière, couleur, motif ou inspiration. La silhouette finale sera créée seulement après ta composition.</span>';b.appendChild(e)}
 refreshEmpty();
}
function pieces(){return [...document.querySelectorAll('#drop .pieceCard')].map((x,i)=>({name:(x.querySelector('b')?.textContent||x.dataset.name||'Pièce').trim(),img:x.querySelector('img')?.src||'',x:parseFloat(x.style.left)||0,y:parseFloat(x.style.top)||0,order:i}))}
function refs(){return read(REF_KEY,{})}
function fabric(){return read(FABRIC_KEY,null)}
function notes(){return document.getElementById('designNotes')?.value||''}
function refreshEmpty(){const e=document.getElementById('hcBoardEmpty');if(e)e.classList.toggle('hidden',pieces().length>0)}
function snapshot(){const data={version:2,pieces:pieces(),references:refs(),fabric:fabric(),notes:notes(),updatedAt:new Date().toISOString()};write(BOARD_KEY,data);return data}
function directionNames(data){const hasDetail=data.pieces.length>2;return hasDetail?['Ligne essentielle','Volume couture','Asymétrie éditoriale','Version mouvement']:['Ligne pure','Volume étudié','Variation graphique','Version souple']}
function buildPanel(){
 let p=document.getElementById('hcSketchPanel');if(p)return p;const workspace=document.querySelector('.workspace');const after=document.querySelector('.afterBar');if(!workspace||!after)return null;
 p=document.createElement('section');p.id='hcSketchPanel';p.className='hc-sketch-panel';p.innerHTML='<div class="hc-sketch-head"><div><h3>4 directions de croquis</h3><p>Ce sont les quatre interprétations issues de ta planche. Choisis celle que tu veux pousser jusqu’à la réalisation.</p></div></div><div class="hc-sketch-grid" id="hcSketchGrid"></div><div class="hc-flow-status" id="hcFlowStatus">Aucune direction choisie.</div><button class="hc-next-realise" id="hcRealiseBtn" disabled>RÉALISER CETTE CRÉATION — ÉTAPE SUIVANTE</button>';
 workspace.insertBefore(p,after);p.querySelector('#hcRealiseBtn').onclick=()=>{const s=read(SKETCH_KEY,null);if(!s)return;toast('Direction enregistrée · prochaine étape : réalisation');window.dispatchEvent(new CustomEvent('hc-atelier-realise-requested',{detail:s}))};return p
}
function proposalVariant(data,index,name){
 const imgs=data.pieces.slice(0,3).map(x=>x.img).filter(Boolean);const ref=data.references||{};const descriptors=[
  'Interprétation la plus fidèle à ta planche.',
  'Volumes légèrement amplifiés, construction plus couture.',
  'Proportions et placement retravaillés pour une lecture plus éditoriale.',
  'Version pensée pour le mouvement et le tombé des matières.'
 ];
 return{id:'atelier-sketch-'+Date.now()+'-'+index,index,name,descriptor:descriptors[index],pieces:data.pieces.map(x=>x.name),images:imgs,references:ref,fabric:data.fabric||null,notes:data.notes||'',createdAt:new Date().toISOString()}
}
function renderProposals(data){
 const panel=buildPanel();if(!panel)return;const grid=panel.querySelector('#hcSketchGrid'),names=directionNames(data);const proposals=names.map((n,i)=>proposalVariant(data,i,n));
 grid.innerHTML=proposals.map((p,i)=>`<button class="hc-sketch-card" type="button" data-hc-sketch="${i}"><div class="hc-sketch-preview"><span class="hc-sketch-tag">PROPOSITION ${String.fromCharCode(65+i)}</span>${p.images.map(src=>`<img src="${esc(src)}" alt="">`).join('')}</div><b>${esc(p.name)}</b><small>${esc(p.descriptor)}</small></button>`).join('');
 grid.querySelectorAll('[data-hc-sketch]').forEach(btn=>btn.onclick=()=>{const p=proposals[Number(btn.dataset.hcSketch)];grid.querySelectorAll('.hc-sketch-card').forEach(x=>x.classList.remove('selected'));btn.classList.add('selected');write(SKETCH_KEY,p);panel.querySelector('#hcFlowStatus').textContent='✓ Direction choisie : '+p.name+'. Elle reste liée à cette planche.';panel.querySelector('#hcRealiseBtn').disabled=false;window.dispatchEvent(new CustomEvent('hc-atelier-sketch-selected',{detail:p}));toast(p.name+' choisie')});
 panel.classList.add('open');panel.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function generate(e){e?.preventDefault?.();e?.stopPropagation?.();e?.stopImmediatePropagation?.();const data=snapshot();if(!data.pieces.length){toast('Ajoute au moins une forme ou un détail à ta planche');return false}renderProposals(data);toast('4 directions préparées à partir de ta planche');return false}
function bindGenerate(){['generateTop','generate'].forEach(id=>{const b=document.getElementById(id);if(!b||b.dataset.hcWorkflowV2)return;b.dataset.hcWorkflowV2='1';b.addEventListener('click',generate,true)})}
function observe(){const drop=document.getElementById('drop');if(drop)new MutationObserver(()=>{refreshEmpty();snapshot()}).observe(drop,{childList:true,subtree:true});const notesEl=document.getElementById('designNotes');notesEl?.addEventListener('input',()=>snapshot());window.addEventListener('hc-atelier-reference-selected',()=>snapshot());window.addEventListener('hc-atelier-fabric-selected',()=>snapshot())}
function patchClear(){const b=document.getElementById('clearBoard');if(!b||b.dataset.hcWorkflowV2)return;b.dataset.hcWorkflowV2='1';b.addEventListener('click',()=>{write(SKETCH_KEY,null);setTimeout(()=>{document.getElementById('hcSketchPanel')?.classList.remove('open');refreshEmpty();snapshot()},20)},true)}
function boot(){css();rewriteChrome();emptyState();buildPanel();bindGenerate();patchClear();observe();snapshot();window.HCAtelierWorkflowV2={snapshot,generate,selected:()=>read(SKETCH_KEY,null),board:()=>read(BOARD_KEY,null)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,180));else setTimeout(boot,180);
})();