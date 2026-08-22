(function(){
  if(window.__HCCharacterStandaloneBridge)return;
  window.__HCCharacterStandaloneBridge=true;

  const CREATOR='./character.html?v=stable-live-20260822';
  const SCREEN_KEY='haute-couture-current-screen';

  function saveScreen(name){
    try{ if(name) localStorage.setItem(SCREEN_KEY,name); }catch(e){}
  }

  function openCreator(e){
    if(e){e.preventDefault();e.stopImmediatePropagation();}
    saveScreen('character');
    location.href=CREATOR;
  }

  function patchDisplayScreen(){
    try{
      if(typeof window.displayScreen!=='function'||window.displayScreen.__hcPersistent)return false;
      const original=window.displayScreen;
      function persistentDisplayScreen(name){
        saveScreen(name);
        return original.apply(this,arguments);
      }
      persistentDisplayScreen.__hcPersistent=true;
      window.displayScreen=persistentDisplayScreen;
      return true;
    }catch(e){return false}
  }

  function finishReturn(){
    const qs=new URLSearchParams(location.search);
    if(!qs.has('characterDone'))return false;
    try{
      if(typeof window.displayScreen==='function'){
        saveScreen('location');
        window.displayScreen('location');
        history.replaceState({},'',location.pathname);
        return true;
      }
    }catch(e){}
    return false;
  }

  function restoreSavedScreen(){
    const qs=new URLSearchParams(location.search);
    if(!qs.has('resume'))return false;
    let saved='';
    try{saved=localStorage.getItem(SCREEN_KEY)||''}catch(e){}
    if(!saved||saved==='character'||saved==='characters'||saved==='creator')return false;
    try{
      if(typeof window.displayScreen==='function'){
        window.displayScreen(saved);
        history.replaceState({},'',location.pathname);
        return true;
      }
    }catch(e){}
    return false;
  }

  function oldCharacterScreenIsOpen(){
    const panel=document.getElementById('characters');
    if(!panel)return false;
    return panel.classList.contains('active') || getComputedStyle(panel).display!=='none';
  }

  function guardLegacyScreen(){
    if(location.pathname.endsWith('/character.html'))return;
    if(oldCharacterScreenIsOpen()) openCreator();
  }

  function boot(){
    patchDisplayScreen();

    const btn=document.getElementById('chooseCharacter');
    if(btn){
      btn.onclick=openCreator;
      btn.addEventListener('click',openCreator,true);
    }

    document.addEventListener('click',function(e){
      const target=e.target && e.target.closest ? e.target.closest('#chooseCharacter,[data-open-character],[data-screen="characters"]') : null;
      if(target)openCreator(e);
    },true);

    const legacy=document.getElementById('characters');
    if(legacy){
      new MutationObserver(guardLegacyScreen).observe(legacy,{attributes:true,attributeFilter:['class','style']});
    }

    setTimeout(guardLegacyScreen,0);

    let n=0;
    const timer=setInterval(()=>{
      patchDisplayScreen();
      guardLegacyScreen();
      if(finishReturn()||restoreSavedScreen()||++n>80)clearInterval(timer);
    },50);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();