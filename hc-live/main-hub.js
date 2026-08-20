(function(){
  if(window.__HCLightBootstrapInstalled)return;window.__HCLightBootstrapInstalled=true;
  const $=(s,r=document)=>r.querySelector(s);
  let locationStarted=false,hubStarted=false,characterStarted=false;
  function add(src,id){if(document.getElementById(id))return;const s=document.createElement('script');s.id=id;s.src=src;s.async=true;document.head.appendChild(s)}
  function ensureLocation(){if(locationStarted)return;locationStarted=true;add('./location-lite-bootstrap.js?v=f1b2afa8','hcLocationLiteScript')}
  function ensureHub(){if(hubStarted)return;hubStarted=true;add('./main-hub-full.js?v=1c50ccf0','hcFullHubScript')}
  function ensureCharacters(){if(characterStarted)return;characterStarted=true;add('./character-interaction-prototype.js?v=37f45237','hcCharacterInteractionPrototypeScript')}
  function goHome(){
    try{localStorage.setItem('haute-couture-current-screen','home')}catch(e){}
    try{if(typeof window.displayScreen==='function'){window.displayScreen('home');return}}catch(e){}
    document.querySelectorAll('.panel,.optionsPanel').forEach(p=>p.classList.remove('active'));
    const home=$('#home');if(home){home.style.display='block';home.classList.add('active')}
  }
  function ensureHomeButton(){
    if($('#hcReturnHome'))return;
    const b=document.createElement('button');b.id='hcReturnHome';b.type='button';b.textContent='← Accueil';
    b.style.cssText='position:fixed;left:18px;top:18px;z-index:190;border:1px solid rgba(88,70,52,.3);background:rgba(255,251,241,.96);color:#3a3f3d;border-radius:999px;padding:10px 15px;font:14px Georgia,serif;box-shadow:0 5px 16px rgba(50,40,30,.11);cursor:pointer;display:none;touch-action:manipulation';
    b.addEventListener('click',goHome);
    document.body.appendChild(b);
  }
  function sync(){
    const inLocation=$('#location')?.classList.contains('active');
    const inAtelier=$('#atelier')?.classList.contains('active');
    const inCharacters=$('#characters')?.classList.contains('active');
    if(inLocation)ensureLocation();if(inAtelier)ensureHub();if(inCharacters)ensureCharacters();
    ensureHomeButton();
    const homeBtn=$('#hcReturnHome');
    const homeVisible=$('#home')&&getComputedStyle($('#home')).display!=='none'&&!document.querySelector('.panel.active,.optionsPanel.active');
    if(homeBtn)homeBtn.style.display=homeVisible?'none':'block';
  }
  function boot(){
    const forceHome=new URLSearchParams(location.search).has('home')||new URLSearchParams(location.search).has('start');
    if(forceHome){
      try{localStorage.setItem('haute-couture-current-screen','home')}catch(e){}
      setTimeout(goHome,0);
      try{history.replaceState(null,'',location.pathname+location.hash)}catch(e){}
    }
    const loc=$('#location'),atelier=$('#atelier'),characters=$('#characters');
    if(loc)new MutationObserver(sync).observe(loc,{attributes:true,attributeFilter:['class']});
    if(atelier)new MutationObserver(sync).observe(atelier,{attributes:true,attributeFilter:['class']});
    if(characters)new MutationObserver(sync).observe(characters,{attributes:true,attributeFilter:['class']});
    document.querySelectorAll('.panel,.optionsPanel').forEach(p=>new MutationObserver(sync).observe(p,{attributes:true,attributeFilter:['class']}));
    ensureHomeButton();sync();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();