(function(){
  if(window.__HCCharacterCreatorCustomNameV1)return;
  window.__HCCharacterCreatorCustomNameV1=true;

  function install(){
    if(document.getElementById('hcCharacterCreatorCustomNameV1Styles'))return;
    const s=document.createElement('style');
    s.id='hcCharacterCreatorCustomNameV1Styles';
    s.textContent=`
      #hcCCV2 .look b{display:none!important}
      #hcCCV2 .look .art{inset:8px!important}
      #hcCCV2 .look{aspect-ratio:.76!important}
      #hcCCV2 .look img,#hcCCV2 .look svg{object-fit:contain!important;object-position:50% 100%!important}
    `;
    document.head.appendChild(s);
  }

  function clean(){
    install();
    const root=document.getElementById('hcCCV2');
    if(!root)return false;

    root.querySelectorAll('.look b').forEach(n=>n.remove());
    root.querySelectorAll('.look img').forEach(img=>{
      img.alt='Visuel de personnage';
      img.removeAttribute('title');
    });

    const nameInput=root.querySelector('#ccName');
    if(nameInput){
      nameInput.setAttribute('placeholder','Entre ton prénom…');
      nameInput.setAttribute('aria-label','Prénom de ton personnage');
    }
    return true;
  }

  function boot(){
    let n=0;
    (function wait(){
      if(clean()){
        const root=document.getElementById('hcCCV2');
        if(root)new MutationObserver(clean).observe(root,{childList:true,subtree:true});
        return;
      }
      if(++n<160)setTimeout(wait,50);
    })();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();