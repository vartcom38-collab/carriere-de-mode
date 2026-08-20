(function(){
  if(window.__HCLightBootstrapInstalled)return;window.__HCLightBootstrapInstalled=true;
  const $=(s,r=document)=>r.querySelector(s);
  let locationStarted=false,hubStarted=false,characterStarted=false;
  function add(src,id){if(document.getElementById(id))return;const s=document.createElement('script');s.id=id;s.src=src;s.async=true;document.head.appendChild(s)}
  function ensureLocation(){if(locationStarted)return;locationStarted=true;add('./location-lite-bootstrap.js?v=f1b2afa8','hcLocationLiteScript')}
  function ensureHub(){if(hubStarted)return;hubStarted=true;add('./main-hub-full.js?v=1c50ccf0','hcFullHubScript')}
  function ensureCharacters(){if(characterStarted)return;characterStarted=true;add('./character-interaction-prototype.js?v=37f45237','hcCharacterInteractionPrototypeScript')}
  function ensureHomeButton(){
    const atelier=$('#atelier');if(!atelier||$('#hcReturnHome'))return;
    const b=document.createElement('button');b.id='hcReturnHome';b.type='button';b.textContent='← Accueil';
    b.style.cssText='position:fixed;left:18px;top:18px;z-index:90;border:1px solid rgba(88,70,52,.3);background:rgba(255,251,241,.94);color:#3a3f3d;border-radius:999px;padding:10px 15px;font:14px Georgia,serif;box-shadow:0 5px 16px rgba(50,40,30,.08);cursor:pointer;display:none';
    b.addEventListener('click',()=>{
      try{localStorage.setItem('haute-couture-current-screen','home')}catch(e){}
      if(typeof window.displayScreen==='function')window.displayScreen('home');
      else{
        document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
        const home=$('#home');if(home)home.style.display='block';
      }
    });
    document.body.appendChild(b);
  }
  function sync(){
    const inLocation=$('#location')?.classList.contains('active');
    const inAtelier=$('#atelier')?.classList.contains('active');
    const inCharacters=$('#characters')?.classList.contains('active');
    if(inLocation)ensureLocation();if(inAtelier)ensureHub();if(inCharacters)ensureCharacters();
    ensureHomeButton();const homeBtn=$('#hcReturnHome');if(homeBtn)homeBtn.style.display=inAtelier?'block':'none';
  }
  function boot(){
    const loc=$('#location'),atelier=$('#atelier'),characters=$('#characters');
    if(loc)new MutationObserver(sync).observe(loc,{attributes:true,attributeFilter:['class']});
    if(atelier)new MutationObserver(sync).observe(atelier,{attributes:true,attributeFilter:['class']});
    if(characters)new MutationObserver(sync).observe(characters,{attributes:true,attributeFilter:['class']});
    ensureHomeButton();sync();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();