(function(){
  if(window.__HCCharacterFocusSmartPositionV2Installed)return;
  window.__HCCharacterFocusSmartPositionV2Installed=true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  function place(person){
    const root=$('.hc-cast');
    const card=$('.hc-focus',root);
    if(!root||!card||!person)return;

    card.style.setProperty('z-index','50','important');

    if(matchMedia('(max-width:900px)').matches){
      card.style.setProperty('left','8px','important');
      card.style.setProperty('right','8px','important');
      card.style.setProperty('top','auto','important');
      card.style.setProperty('bottom','2%','important');
      return;
    }

    const people=$$('.hc-person',root);
    const index=Math.max(0,people.indexOf(person));
    const col=index%6;

    card.style.setProperty('top','17%','important');
    card.style.setProperty('bottom','auto','important');

    // Colonnes 4,5,6 : fiche à gauche. Colonnes 1,2,3 : fiche à droite.
    if(col>=3){
      card.style.setProperty('left','7.2%','important');
      card.style.setProperty('right','auto','important');
    }else{
      card.style.setProperty('left','auto','important');
      card.style.setProperty('right','7.2%','important');
    }
  }

  function sync(){
    const root=$('.hc-cast');
    const person=$('.hc-person.focused',root);
    if(person)place(person);
  }

  document.addEventListener('pointerenter',e=>{
    const p=e.target.closest?.('.hc-person');
    if(p)place(p);
  },true);
  document.addEventListener('pointerover',e=>{
    const p=e.target.closest?.('.hc-person');
    if(p)place(p);
  },true);
  document.addEventListener('click',e=>{
    const p=e.target.closest?.('.hc-person');
    if(p)place(p);
  },true);

  function boot(){
    const screen=$('#characters');
    if(!screen)return;
    new MutationObserver(sync).observe(screen,{subtree:true,attributes:true,attributeFilter:['class']});
    sync();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();