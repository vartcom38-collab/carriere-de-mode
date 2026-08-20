(function(){
  if(window.__HCCharacterFocusAutohideInstalled)return;
  window.__HCCharacterFocusAutohideInstalled=true;
  const $=(s,r=document)=>r.querySelector(s);
  let timer=null;
  function cancel(){if(timer){clearTimeout(timer);timer=null}}
  function hide(){
    timer=null;
    const root=$('.hc-cast');
    if(!root)return;
    root.classList.remove('has-focus');
    root.querySelectorAll('.hc-person.focused').forEach(el=>el.classList.remove('focused'));
    root.querySelector('.hc-focus')?.classList.remove('open');
  }
  function schedule(){cancel();timer=setTimeout(hide,150)}
  function onPointerMove(e){
    if(e.pointerType&&e.pointerType!=='mouse')return;
    const screen=$('#characters');
    if(!screen?.classList.contains('active'))return;
    const root=$('.hc-cast');
    if(!root?.classList.contains('has-focus'))return;
    const safe=e.target.closest?.('.hc-person,.hc-focus,.hc-compare,.hc-compare-panel,.selection-back,#hcReturnHome');
    if(safe){cancel();return}
    schedule();
  }
  function boot(){
    const screen=$('#characters');
    if(!screen)return;
    screen.addEventListener('pointermove',onPointerMove,true);
    screen.addEventListener('pointerleave',e=>{if(!e.pointerType||e.pointerType==='mouse')schedule()},true);
    screen.addEventListener('pointerdown',e=>{
      if(e.pointerType==='mouse')return;
      const root=$('.hc-cast');
      if(!root?.classList.contains('has-focus'))return;
      if(!e.target.closest?.('.hc-person,.hc-focus,.hc-compare,.hc-compare-panel'))hide();
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();