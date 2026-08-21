(function(){
  if(window.__HCCharacterStandaloneBridge)return;
  window.__HCCharacterStandaloneBridge=true;

  function openCreator(e){
    if(e){e.preventDefault();e.stopImmediatePropagation();}
    location.href='./character.html?v=clean-20260821-1842';
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

  function boot(){
    const btn=document.getElementById('chooseCharacter');
    if(btn){
      btn.onclick=openCreator;
      btn.addEventListener('click',openCreator,true);
    }

    if(!finishReturn()){
      let n=0;
      const timer=setInterval(()=>{
        if(finishReturn()||++n>40)clearInterval(timer);
      },50);
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();