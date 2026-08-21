(function(){
  if(window.__HCLightBootstrapInstalled)return;window.__HCLightBootstrapInstalled=true;
  const $=(s,r=document)=>r.querySelector(s);
  let locationStarted=false,characterStarted=false;
  function add(src,id,done){
    if(document.getElementById(id)){done&&done();return}
    const s=document.createElement('script');s.id=id;s.src=src;s.async=false;
    if(done){s.onload=done;s.onerror=done}
    document.head.appendChild(s)
  }
  function loadSeries(list,i=0){if(i>=list.length)return;const [src,id]=list[i];add(src,id,()=>loadSeries(list,i+1))}
  function ensureLocation(){if(locationStarted)return;locationStarted=true;add('./location-lite-bootstrap.js?v=f1b2afa8','hcLocationLiteScript')}
  function ensureCharacters(){
    if(characterStarted)return;characterStarted=true;
    const oldArt=$('#characters .selection-art');if(oldArt)oldArt.remove();
    const oldDim=$('#characters .profile-dim');if(oldDim)oldDim.classList.remove('open');
    loadSeries([
      ['./character-interaction-prototype.js?v=e966568c','hcCharacterInteractionPrototypeScript'],
      ['./character-notebook-split-layout.js?v=stable-1925','hcCharacterNotebookSplitScript'],
      ['./clara-visual-patch.js?v=stable-1925','hcClaraVisualPatchScript'],
      ['./character-casting-final.js?v=158c243a','hcCharacterCastingFinalScript'],
      ['./character-desktop-ipad-polish.js?v=1bb21cc5','hcCharacterDesktopIpadPolishScript'],
      ['./ines-official-visual.js?v=357cb370','hcInesOfficialVisualScript'],
      ['./maya-official-visual.js?v=d60e3ebf','hcMayaOfficialVisualScript'],
      ['./character-mobile-polish.js?v=1f446660','hcCharacterMobilePolishScript'],
      ['./character-uniform-cards.js?v=e782397b','hcCharacterUniformCardsScript'],
      ['./character-casting-stability-v2.js?v=2a74ab3d','hcCharacterCastingStabilityV2Script'],
      ['./character-image-framing-final.js?v=2f3825ba','hcCharacterImageFramingFinalScript'],
      ['./character-casting-clean-v3.js?v=76408f22','hcCharacterCastingCleanV3Script'],
      ['./character-visual-crop-v5.js?v=469db7b3','hcCharacterVisualCropV5Script'],
      ['./ines-visual-v6.js?v=49c92907','hcInesVisualV6Script'],
      ['./clara-master-experience-v1.js?v=62274ce4','hcClaraMasterExperienceV1Script'],
      ['./character-master-experience-all-v1.js?v=f8019fe7','hcCharacterMasterExperienceAllV1Script'],
      ['./clara-card-final-v3.js?v=da589317','hcClaraCardFinalV3Script'],
      ['./ines-portrait-lite.js?v=ac7ac65f','hcInesPortraitLiteScript']
    ])
  }
  function setHomeState(){try{localStorage.setItem('haute-couture-current-screen','home')}catch(e){}try{localStorage.setItem('haute-couture-screen','home')}catch(e){}}
  function goHome(){setHomeState();try{if(typeof window.displayScreen==='function'){window.displayScreen('home');return}}catch(e){}document.querySelectorAll('.panel,.optionsPanel').forEach(p=>p.classList.remove('active'));const home=$('#home');if(home){home.style.display='block';home.classList.add('active')}}
  function ensureHomeButton(){if($('#hcReturnHome'))return;const b=document.createElement('button');b.id='hcReturnHome';b.type='button';b.textContent='← Accueil';b.style.cssText='position:fixed;left:18px;top:18px;z-index:190;border:1px solid rgba(88,70,52,.3);background:rgba(255,251,241,.96);color:#3a3f3d;border-radius:999px;padding:10px 15px;font:14px Georgia,serif;box-shadow:0 5px 16px rgba(50,40,30,.11);cursor:pointer;display:none;touch-action:manipulation';b.addEventListener('click',goHome);document.body.appendChild(b)}
  function sync(){const inLocation=$('#location')?.classList.contains('active');const inCharacters=$('#characters')?.classList.contains('active');if(inLocation)ensureLocation();if(inCharacters)ensureCharacters();ensureHomeButton();const homeBtn=$('#hcReturnHome');const homeVisible=$('#home')&&getComputedStyle($('#home')).display!=='none'&&!document.querySelector('.panel.active,.optionsPanel.active');if(homeBtn)homeBtn.style.display=homeVisible?'none':'block'}
  function boot(){const oldArt=$('#characters .selection-art');if(oldArt)oldArt.remove();const qs=new URLSearchParams(location.search);if(qs.has('home')||qs.has('start')){setHomeState();setTimeout(goHome,0)}document.querySelectorAll('.panel,.optionsPanel').forEach(p=>new MutationObserver(sync).observe(p,{attributes:true,attributeFilter:['class']}));ensureHomeButton();sync()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();