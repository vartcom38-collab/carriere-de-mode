/* Haute Couture Live — runtime guard v1
   Une seule génération visible + erreurs réseau/serveur affichées en clair.
*/
(function(){
'use strict';
if(window.__HC_ATELIER_RUNTIME_GUARD_V1__)return;window.__HC_ATELIER_RUNTIME_GUARD_V1__=true;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const norm=s=>String(s||'').replace(/\s+/g,' ').trim();
function cleanLegacyGeneration(){
  $$('.generateBox,#generate,#generateTop,#styleLater,#result').forEach(el=>{if(!el.closest('.hcv3-head'))el.remove()});
  $$('button').forEach(b=>{
    if(b.classList.contains('hcv3-generate'))return;
    const t=norm(b.textContent).toUpperCase();
    if(t.includes('GÉNÉRER')&&t.includes('CROQUIS'))b.remove();
  });
  $$('.hcz-board-label,#hcCompositionReadout').forEach(x=>x.remove());
}
function ensureErrorBox(){
  const panel=$('#hcGcPanel'),status=panel?.querySelector('#hcGcStatus');if(!panel||!status)return null;
  let box=panel.querySelector('#hcGenerationRawError');
  if(!box){box=document.createElement('div');box.id='hcGenerationRawError';box.style.cssText='display:none;margin-top:10px;padding:10px 12px;border:1px solid #d7a49a;border-radius:10px;background:#fff0ed;color:#722f24;font:11px/1.45 Arial;white-space:pre-wrap;word-break:break-word';status.after(box)}
  return box;
}
function showStoredError(){
  const status=$('#hcGcStatus');if(!status||!norm(status.textContent).includes('La génération a échoué'))return;
  const box=ensureErrorBox();if(!box)return;
  let raw='';try{raw=localStorage.getItem('haute-couture-last-generation-error-v1')||''}catch(_){}
  let msg=raw;
  try{const j=JSON.parse(raw);msg=j.detail||j.error||raw}catch(_){}
  if(!msg)msg='Erreur réseau ou serveur sans détail reçu.';
  box.textContent='ERREUR TECHNIQUE\n'+msg;
  box.style.display='block';
}
function boot(){
  cleanLegacyGeneration();ensureErrorBox();
  const mo=new MutationObserver(()=>{cleanLegacyGeneration();showStoredError()});
  mo.observe(document.body,{childList:true,subtree:true,characterData:true});
  setInterval(()=>{cleanLegacyGeneration();showStoredError()},800);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1000));else setTimeout(boot,1000);
})();
