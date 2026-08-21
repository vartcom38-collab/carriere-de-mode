(function(){
  if(window.__HCCharacterStandaloneBridge)return;
  window.__HCCharacterStandaloneBridge=true;

  const CREATOR='./character.html?v=responsive-20260821-2212';

  function openCreator(e){
    if(e){e.preventDefault();e.stopImmediatePropagation();}
    location.href=CREATOR;
  }

  function finishReturn(){
    const qs=new URLSearchParams(location.search);
    if(!qs.has('characterDone'))return false;
    try{
      if(typeof window.displayScreen==='function'){
        window.displayScreen('location');
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

    if(!finishReturn()){
      let n=0;
      const timer=setInterval(()=>{
        guardLegacyScreen();
        if(finishReturn()||++n>60)clearInterval(timer);
      },50);
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();