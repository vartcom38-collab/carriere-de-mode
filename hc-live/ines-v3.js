(function(){
  if(window.__HCCharacterStandaloneBridge)return;
  window.__HCCharacterStandaloneBridge=true;

  const SCREEN_KEY='haute-couture-current-screen';

  function publicScreen(name){
    if(name==='location')return 'logement';
    if(name==='characters'||name==='creator')return 'character';
    return name;
  }

  function internalScreen(name){
    if(name==='logement')return 'location';
    if(name==='character')return 'characters';
    return name;
  }

  function saveScreen(name){
    try{ if(name) localStorage.setItem(SCREEN_KEY,publicScreen(name)); }catch(e){}
  }

  function goTop(path){
    try{
      if(window.top!==window.self){window.top.location.href=path;return;}
    }catch(e){}
    location.href=path;
  }

  function openCreator(e){
    if(e){e.preventDefault();e.stopImmediatePropagation();}
    saveScreen('character');
    goTop('../character/');
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
    saveScreen('logement');
    goTop('../logement/');
    return true;
  }

  function restoreSavedScreen(){
    const qs=new URLSearchParams(location.search);
    if(!qs.has('resume'))return false;
    let saved='';
    try{saved=localStorage.getItem(SCREEN_KEY)||''}catch(e){}
    if(!saved||saved==='character')return false;
    try{
      if(typeof window.displayScreen==='function'){
        window.displayScreen(internalScreen(saved));
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

    let n=0;
    const timer=setInterval(()=>{
      patchDisplayScreen();
      if(finishReturn()||restoreSavedScreen()||++n>80)clearInterval(timer);
    },50);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();