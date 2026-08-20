(function(){
  if(window.__HCCharacterFocusSmartPositionInstalled)return;
  window.__HCCharacterFocusSmartPositionInstalled=true;

  const $=(s,r=document)=>r.querySelector(s);

  function positionFor(person){
    const root=$('.hc-cast');
    const card=$('.hc-focus',root);
    if(!root||!card)return;

    card.style.zIndex='12';

    if(matchMedia('(max-width:900px)').matches){
      card.style.left='8px';
      card.style.right='8px';
      card.style.top='auto';
      card.style.bottom='2%';
      return;
    }

    const rootRect=root.getBoundingClientRect();
    const personRect=person?.getBoundingClientRect();
    const personCenter=personRect ? personRect.left + personRect.width/2 : rootRect.left + rootRect.width/2;
    const rootCenter=rootRect.left + rootRect.width/2;

    card.style.top='17%';
    card.style.bottom='auto';

    // La fiche choisit toujours le côté opposé au personnage actif.
    if(personCenter >= rootCenter){
      card.style.left='7.2%';
      card.style.right='auto';
    }else{
      card.style.left='auto';
      card.style.right='7.2%';
    }
  }

  function activePerson(){return $('.hc-person.focused')}

  function sync(){
    const person=activePerson();
    if(person)positionFor(person);
  }

  document.addEventListener('pointerover',e=>{
    const person=e.target.closest?.('.hc-person');
    if(person)positionFor(person);
  },true);

  document.addEventListener('click',e=>{
    const person=e.target.closest?.('.hc-person');
    if(person)positionFor(person);
  },true);

  window.addEventListener('resize',sync,{passive:true});

  function boot(){
    const screen=$('#characters');
    if(!screen)return;
    new MutationObserver(sync).observe(screen,{subtree:true,attributes:true,attributeFilter:['class']});
    sync();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();