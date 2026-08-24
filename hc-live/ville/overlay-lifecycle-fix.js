/* Haute Couture Live — stabilise le cycle ouverture/fermeture des fiches de lieux.
   Les fiches riches remplacent temporairement le contenu de .guidebody ; on conserve
   les vrais noeuds de la fiche de base pour les remettre après fermeture, afin que
   openGuide() retrouve toujours #guideText, #guideChips, #guideMode, #guideUnlock,
   #saveBook et #closeGuide lors de l'ouverture suivante.
*/
(function(){
'use strict';
function boot(){
  const overlay=document.querySelector('#overlay');
  const guide=overlay?.querySelector('.guide');
  const body=guide?.querySelector('.guidebody');
  if(!overlay||!guide||!body||overlay.dataset.lifecycleFix==='1')return;
  overlay.dataset.lifecycleFix='1';

  // Conserver LES MEMES noeuds : leurs handlers onclick déjà posés dans index.html survivent.
  const baseNodes=Array.from(body.childNodes);
  const baseGuideClass=guide.className;
  const baseBodyClass=body.className;
  let wasOpen=overlay.classList.contains('open');

  function ensureClose(){
    if(!overlay.classList.contains('open')||guide.querySelector('.hc-place-close'))return;
    const b=document.createElement('button');
    b.type='button';
    b.className='hc-place-close';
    b.setAttribute('aria-label','Fermer la fiche');
    b.textContent='×';
    Object.assign(b.style,{position:'sticky',top:'10px',float:'right',zIndex:'9999',margin:'10px 10px -48px 0',width:'38px',height:'38px',border:'1px solid #d7c7b9',borderRadius:'50%',background:'#fffaf4',color:'#211a16',font:'700 25px/1 Georgia,serif',cursor:'pointer',boxShadow:'0 7px 20px #0002'});
    b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();overlay.classList.remove('open')});
    guide.prepend(b);
  }

  function restoreBase(){
    // Les enrichissements utilisent .r-nav/.r-page ou la classe .rich.
    const rich=guide.classList.contains('rich')||!!body.querySelector('.r-nav,.r-page,[data-rsection]');
    if(rich){
      body.replaceChildren(...baseNodes);
      guide.className=baseGuideClass;
      body.className=baseBodyClass;
    }
    guide.querySelector('.hc-place-close')?.remove();
    // Remettre le scroll au début pour que la prochaine fiche ne réouvre pas en plein milieu.
    guide.scrollTop=0;
  }

  const obs=new MutationObserver(()=>{
    const now=overlay.classList.contains('open');
    if(now&&!wasOpen){
      guide.scrollTop=0;
      setTimeout(ensureClose,0);
    }else if(!now&&wasOpen){
      // Attendre la fin des observers des fiches riches puis restaurer la structure de base.
      setTimeout(restoreBase,0);
    }
    wasOpen=now;
  });
  obs.observe(overlay,{attributes:true,attributeFilter:['class']});

  // Filet de sécurité : fermeture au clic sur le fond et touche Échap, même si une fiche riche
  // a remplacé son propre bouton de fermeture.
  overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.classList.remove('open')},true);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))overlay.classList.remove('open')});

  if(wasOpen)ensureClose();
  window.HCPlaceOverlayLifecycle={restore:restoreBase,ensureClose};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
