/* Haute Couture Live — generation controller v1
   Source de vérité = contenu réel de #drop.
   Extraction structurée + capture visuelle + prompt + 3 croquis.
*/
(function(){
'use strict';
if(window.__HC_GENERATION_CONTROLLER_V1__)return;window.__HC_GENERATION_CONTROLLER_V1__=true;
const ENDPOINT=localStorage.getItem('haute-couture-atelier-sketch-api-endpoint')||'https://carriere-de-mode-visuals-vartcom38-7358s-projects.vercel.app/api/generate-atelier-sketches';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;
function toast(t){const n=$('#toast');if(!n)return;n.textContent=t;n.classList.add('show');setTimeout(()=>n.classList.remove('show'),1800)}
function norm(s){return String(s||'').replace(/\s+/g,' ').trim()}
function hideLegacyNoise(){
  $$('body *').forEach(el=>{
    const t=norm(el.textContent);
    if(t==='Bibliothèque Atelier'){const r=getComputedStyle(el);if(r.position==='fixed'||r.position==='absolute'||el.closest('[style*="position: fixed"],[style*="position:fixed"]'))el.style.setProperty('display','none','important')}
    if(t==='Lecture de ta composition'){
      let box=el.closest('section,article,.card,.panel,[class*="reading"],[class*="composition"]')||el.parentElement;
      if(box&&box!==document.body&&!box.closest('#board'))box.style.setProperty('display','none','important');
    }
  });
}
function ensureRemove(el){
  if(!el||el.querySelector('.hc-cat-remove,.hc-gc-remove'))return;
  const b=document.createElement('button');b.type='button';b.className='hc-gc-remove';b.title='Retirer de la planche';b.textContent='×';
  b.style.cssText='position:absolute;right:6px;top:6px;width:26px;height:26px;border:0;border-radius:50%;background:#211a16;color:#fff;z-index:9999;cursor:pointer;font:700 16px/26px Arial;padding:0';
  b.addEventListener('pointerdown',e=>e.stopPropagation(),true);
  b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();el.remove();window.HCAtelierBoardComponents?.sync?.();window.dispatchEvent(new CustomEvent('hc-atelier-moodboard-changed'));toast('Élément retiré')},true);
  el.appendChild(b);
}
function catalogItem(id){return (window.HCAtelierCatalog?.items||[]).find(x=>x.id===id)||null}
function cardRect(el,board){const er=el.getBoundingClientRect(),br=board.getBoundingClientRect();return{x:Math.round(er.left-br.left),y:Math.round(er.top-br.top),width:Math.round(er.width),height:Math.round(er.height),centerX:Math.round(er.left-br.left+er.width/2),centerY:Math.round(er.top-br.top+er.height/2)}}
function parseCard(el,i,board){
  const moodKind=el.dataset.moodKind||'';
  const catalogId=el.dataset.catalogId||el.dataset.id||'';
  const cat=catalogItem(catalogId);
  const name=norm(el.dataset.name||el.dataset.referenceLabel||el.querySelector('b')?.textContent||el.querySelector('img')?.alt||('Élément '+(i+1)));
  const rect=cardRect(el,board);
  const tags=cat?.tags||norm(el.querySelector('small')?.textContent).split('·').map(x=>x.trim()).filter(Boolean);
  const noteText=norm(el.querySelector('textarea')?.value||'');
  return {
    instanceId:el.dataset.instanceId||el.dataset.hcVisualId||('item-'+i),catalogId:catalogId||null,variantId:el.dataset.variantId||el.dataset.referenceId||null,
    moodKind:moodKind||null,moodId:el.dataset.moodId||null,name,category:cat?.category||(moodKind||'reference'),image:el.querySelector('img')?.src||null,tags,
    x:rect.x,y:rect.y,width:rect.width,height:rect.height,centerX:rect.centerX,centerY:rect.centerY,scale:num(el.dataset.hcScale,1),rotation:num(el.dataset.hcRotate,0),zIndex:num(el.style.zIndex||getComputedStyle(el).zIndex,0),noteText
  };
}
function overlaps(a,b){return !(a.x+a.width<b.x||b.x+b.width<a.x||a.y+a.height<b.y||b.y+b.height<a.y)}
function analyze(items,board){
  const w=board.clientWidth||1,h=board.clientHeight||1,cx=w/2,cy=h/2;
  const ranked=items.map(x=>({...x,visualArea:x.width*x.height*x.scale*x.scale,centerDistance:Math.hypot(x.centerX-cx,x.centerY-cy)})).sort((a,b)=>(b.visualArea-a.visualArea)||(a.centerDistance-b.centerDistance));
  const groups=[],pairs=[];
  for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){
    const a=items[i],b=items[j],dist=Math.hypot(a.centerX-b.centerX,a.centerY-b.centerY);
    if(overlaps(a,b))pairs.push([a.instanceId,b.instanceId]);
    if(dist<Math.max(150,(a.width+b.width)*.65))groups.push([a.instanceId,b.instanceId]);
  }
  return {board:{width:w,height:h},mainElements:ranked.slice(0,3).map(x=>x.instanceId),visualOrder:items.slice().sort((a,b)=>a.zIndex-b.zIndex).map(x=>x.instanceId),groups,overlaps:pairs};
}
function extractMoodboardState(){
  const board=$('#board'),drop=$('#drop');if(!board||!drop)return{items:[],garments:[],materials:[],colors:[],patterns:[],notes:[],composition:{},counts:{total:0,garments:0,materials:0,colors:0,patterns:0,notes:0}};
  const items=$$('#drop .pieceCard').map((el,i)=>parseCard(el,i,board));
  const materials=items.filter(x=>x.moodKind==='material'),colors=items.filter(x=>x.moodKind==='color'),patterns=items.filter(x=>x.moodKind==='pattern'),notes=items.filter(x=>x.moodKind==='note'||x.noteText),garments=items.filter(x=>!x.moodKind||x.moodKind==='reference');
  return {items,garments,materials,colors,patterns,notes,composition:analyze(items,board),counts:{total:items.length,garments:garments.length,materials:materials.length,colors:colors.length,patterns:patterns.length,notes:notes.length}};
}
function currentOrder(){try{return(JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')||[]).find(x=>x.status==='accepted'||x.status==='alterations_needed')||null}catch(_){return null}}
function briefFromDom(){const vals={};$$('.briefRow').forEach(r=>{const k=norm(r.querySelector('b')?.textContent),v=norm(r.querySelector('span')?.textContent);if(k)vals[k]=v});return{name:norm($('.client')?.textContent),garment:vals['Vêtement']||vals['Pièce']||'',occasion:norm(($('.meta')?.textContent||'').split('·')[0]),style:vals.Style||'',paletteLiked:vals.Palette?[vals.Palette]:[],paletteAvoid:vals['À éviter']?[vals['À éviter']]:[],materialsPreferred:vals['Matières']?[vals['Matières']]:[],notes:norm($('#clientNotes')?.value||$('.quote')?.textContent),budget:vals.Budget||''}}
function clientBrief(){const o=currentOrder();if(!o)return briefFromDom();return{name:o.clientName||'',garment:o.garment||'',occasion:o.occasion||'',style:o.brief?.style||'',paletteLiked:o.brief?.paletteLiked||[],paletteAvoid:o.brief?.paletteAvoid||[],materialsPreferred:o.brief?.materialsPreferred||[],notes:o.notes||'',budget:o.budget||0,orderId:o.id||''}}
function list(xs){return xs.length?xs.map(x=>x.name).join(', '):'aucun'}
function buildPrompt(brief,m){
  const notes=m.notes.map(x=>x.noteText||x.name).filter(Boolean).join(' | ')||'aucune';
  return `Créer exactement trois croquis de mode à partir de la commande cliente ET de la planche de création fournie en image de référence.\n\nCOMMANDE CLIENTE\n- Cliente : ${brief.name||'non précisée'}\n- Pièce / demande : ${brief.garment||'non précisée'}\n- Occasion : ${brief.occasion||'non précisée'}\n- Style : ${brief.style||'non précisé'}\n- Palette appréciée : ${(brief.paletteLiked||[]).join(', ')||'non précisée'}\n- Couleurs à éviter : ${(brief.paletteAvoid||[]).join(', ')||'aucune'}\n- Matières souhaitées : ${(brief.materialsPreferred||[]).join(', ')||'non précisées'}\n- Notes : ${brief.notes||'aucune'}\n\nPLANCHE DE CRÉATION RÉELLE\n- Vêtements / formes sélectionnés : ${list(m.garments)}\n- Matières sélectionnées : ${list(m.materials)}\n- Couleurs sélectionnées : ${list(m.colors)}\n- Motifs sélectionnés : ${list(m.patterns)}\n- Notes posées sur la planche : ${notes}\n\nLa position, la taille, la proximité et les superpositions des éléments visibles sur l'image de la planche font partie de la direction créative. Ne remplace pas une matière ou une couleur sélectionnée par une autre dominante. N'invente pas de motif dominant si aucun motif n'est sélectionné.\n\nProposer exactement :\nA — Interprétation fidèle : proche de la planche.\nB — Interprétation mode : plus éditoriale tout en conservant les choix clés.\nC — Interprétation couture : plus ambitieuse et sophistiquée sans trahir les choix dominants.`;
}
function inlineComputed(src,dst){if(!(src instanceof Element)||!(dst instanceof Element))return;const cs=getComputedStyle(src);for(let i=0;i<cs.length;i++){const p=cs[i];try{dst.style.setProperty(p,cs.getPropertyValue(p),cs.getPropertyPriority(p))}catch(_){}}[...src.children].forEach((c,i)=>inlineComputed(c,dst.children[i]))}
function loadImage(src){return new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src})}
async function captureMoodboardImage(){
  const board=$('#board');if(!board)throw new Error('moodboard_missing');
  try{
    const clone=board.cloneNode(true);clone.querySelectorAll('.hc-gc-remove,.hc-cat-remove,#hcBoardEmpty').forEach(x=>x.remove());
    const srcTas=board.querySelectorAll('textarea');clone.querySelectorAll('textarea').forEach((ta,i)=>{const d=document.createElement('div');d.textContent=srcTas[i]?.value||ta.value||'';d.style.whiteSpace='pre-wrap';ta.replaceWith(d)});
    inlineComputed(board,clone);clone.style.position='relative';clone.style.left='0';clone.style.top='0';clone.style.margin='0';
    const w=Math.max(1,board.offsetWidth),h=Math.max(1,board.offsetHeight);clone.style.width=w+'px';clone.style.height=h+'px';
    const xml=new XMLSerializer().serializeToString(clone);const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${xml}</div></foreignObject></svg>`;
    const img=await loadImage('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg));const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;canvas.getContext('2d').drawImage(img,0,0,w,h);
    return{dataUrl:canvas.toDataURL('image/png'),width:w,height:h,error:null};
  }catch(e){return{dataUrl:null,width:0,height:0,error:String(e?.message||e)}}
}
function panel(){let p=$('#hcGcPanel');if(p)return p;p=document.createElement('section');p.id='hcGcPanel';p.innerHTML='<div class="hc-gc-head"><div><small>GÉNÉRATION</small><h3>3 propositions de croquis</h3><p>Brief client + contenu réel + image de ta planche.</p></div></div><div id="hcGcPrompt"></div><div id="hcGcGrid"></div><div id="hcGcStatus"></div>';
  const center=$('.hcv3-center')||$('.workspace')?.parentElement;center?.appendChild(p);return p}
function setStatus(t,loading=false){const p=panel(),s=p?.querySelector('#hcGcStatus');if(!s)return;s.textContent=t;s.className='hc-gc-status'+(loading?' loading':'')}
function renderPrompt(prompt){const p=panel()?.querySelector('#hcGcPrompt');if(!p)return;p.innerHTML='<details><summary>Voir le prompt utilisé</summary><pre>'+esc(prompt)+'</pre></details>'}
function renderProposals(list){const root=panel()?.querySelector('#hcGcGrid');if(!root)return;root.className='hc-gc-grid';root.innerHTML=list.map((p,i)=>`<button class="hc-gc-card" type="button" data-i="${i}"><span>PROPOSITION ${esc(p.id||String.fromCharCode(65+i))}</span><img src="${esc(p.url||'')}" alt="${esc(p.name||'Croquis')}"><b>${esc(p.name||'Croquis')}</b><small>${esc(p.direction||'')}</small></button>`).join('');root.querySelectorAll('.hc-gc-card').forEach(b=>b.onclick=()=>{root.querySelectorAll('.hc-gc-card').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');const p=list[Number(b.dataset.i)];try{localStorage.setItem('haute-couture-atelier-selected-sketch-v2',JSON.stringify({...p,selectedAt:new Date().toISOString()}))}catch(_){};toast((p.name||'Croquis')+' choisi')})}
async function generate(e){
  e?.preventDefault?.();e?.stopPropagation?.();e?.stopImmediatePropagation?.();
  const m=extractMoodboardState();if(!m.counts.total){toast('Ajoute au moins un élément à ta planche avant de générer.');return false}
  const brief=clientBrief(),prompt=buildPrompt(brief,m);panel();renderPrompt(prompt);setStatus('Capture de ta planche puis génération des trois croquis…',true);
  const capture=await captureMoodboardImage();
  const board={version:5,components:m.items,references:{materials:m.materials,colors:m.colors,patterns:m.patterns},notes:m.notes,composition:m.composition,counts:m.counts,capture:{width:capture.width,height:capture.height,error:capture.error},generatedPrompt:prompt,updatedAt:new Date().toISOString()};
  try{localStorage.setItem('haute-couture-atelier-board-v2',JSON.stringify(board))}catch(_){}
  try{
    const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({board,client:brief,designer:{level:1},moodboardImage:capture.dataUrl||null,generatedPrompt:prompt,seed:Date.now()%1000000})});
    const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.detail||j.error||('HTTP '+r.status));if(!Array.isArray(j.proposals)||j.proposals.length!==3)throw new Error('Le générateur doit renvoyer exactement trois propositions');
    renderProposals(j.proposals);setStatus('Trois croquis générés à partir de ta planche.'+(capture.error?' La capture visuelle a échoué : les données structurées ont été utilisées.':''));toast('3 croquis générés');
  }catch(err){console.error('[Atelier generation controller]',err);setStatus('La génération a échoué. Ta planche est conservée.');toast('La génération a échoué. Ta planche est conservée.')}
  return false;
}
function bindGenerate(){const b=$('.hcv3-generate');if(!b||b.dataset.hcGcBound==='1')return;b.dataset.hcGcBound='1';b.addEventListener('click',generate,true)}
function css(){if($('#hcGcCss'))return;const s=document.createElement('style');s.id='hcGcCss';s.textContent=`#hcGcPanel{margin:0 8px 18px;background:#fffaf5;border:1px solid #e4d7cd;border-radius:18px;padding:14px}.hc-gc-head small{font:900 7px Arial;letter-spacing:.16em;color:#d97d68}.hc-gc-head h3{font:25px Georgia,serif;margin:4px 0}.hc-gc-head p{margin:0 0 10px;font:9px Georgia,serif;color:#7d6d64}#hcGcPrompt details{margin:8px 0;border:1px solid #eadfd6;border-radius:10px;background:#fff;padding:8px}#hcGcPrompt summary{cursor:pointer;font:800 8px Arial}#hcGcPrompt pre{white-space:pre-wrap;font:9px/1.45 Arial;margin:8px 0 0;color:#594b43}.hc-gc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:10px}.hc-gc-card{border:1px solid #e4d7cd;background:#fff;border-radius:13px;padding:8px;text-align:left;cursor:pointer}.hc-gc-card.selected{outline:2px solid #d97d68}.hc-gc-card span{font:800 7px Arial;color:#8c7669}.hc-gc-card img{display:block;width:100%;aspect-ratio:3/4;object-fit:contain;background:#f5ece5;border-radius:9px;margin:6px 0}.hc-gc-card b{display:block;font:16px Georgia,serif}.hc-gc-card small{display:block;margin-top:3px;font:8px/1.35 Arial;color:#78685f}.hc-gc-status{margin-top:10px;border-radius:10px;background:#f5ece5;padding:9px;font:9px Arial}.hc-gc-status.loading{background:#211a16;color:#fff}@media(max-width:1100px){.hc-gc-grid{grid-template-columns:1fr}}`;document.head.appendChild(s)}
function scan(){hideLegacyNoise();$$('#drop .pieceCard').forEach(ensureRemove);bindGenerate()}
function boot(){css();scan();new MutationObserver(()=>scan()).observe(document.body,{childList:true,subtree:true});setInterval(scan,1000);window.HCAtelierGenerationController={extractMoodboardState,captureMoodboardImage,buildPrompt,generate}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1600));else setTimeout(boot,1600);
})();