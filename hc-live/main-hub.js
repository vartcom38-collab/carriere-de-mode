(function(){
  if(window.__HCLightBootstrapInstalled)return;window.__HCLightBootstrapInstalled=true;
  const $=(s,r=document)=>r.querySelector(s);
  let locationStarted=false,characterStarted=false;
  function add(src,id,done){if(document.getElementById(id)){done&&done();return}const s=document.createElement('script');s.id=id;s.src=src;s.async=false;if(done){s.onload=done;s.onerror=done}document.head.appendChild(s)}
  function ensureLocation(){if(locationStarted)return;locationStarted=true;add('./location-lite-bootstrap.js?v=f1b2afa8','hcLocationLiteScript')}
  function ensureCharacters(){if(characterStarted)return;characterStarted=true;add('./character-builder-clean-v1.js?v=clean-20260821-1838','hcCharacterBuilderCleanV1Script')}
  function setHomeState(){try{localStorage.setItem('haute-couture-current-screen','home')}catch(e){}try{localStorage.setItem('haute-couture-screen','home')}catch(e){}}
  function goHome(){setHomeState();try{if(typeof window.displayScreen==='function'){window.displayScreen('home');return}}catch(e){}document.querySelectorAll('.panel,.optionsPanel').forEach(p=>p.classList.remove('active'));const home=$('#home');if(home){home.style.display='block';home.classList.add('active')}}
  function sync(){const inLocation=$('#location')?.classList.contains('active');const inCharacters=$('#characters')?.classList.contains('active');if(inLocation)ensureLocation();if(inCharacters)ensureCharacters()}
  function boot(){const qs=new URLSearchParams(location.search);if(qs.has('home')||qs.has('start')){setHomeState();setTimeout(goHome,0)}document.querySelectorAll('.panel,.optionsPanel').forEach(p=>new MutationObserver(sync).observe(p,{attributes:true,attributeFilter:['class']}));sync()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();