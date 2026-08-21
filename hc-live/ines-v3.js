(function(){
  if(window.__HCCharacterCleanCompat)return;window.__HCCharacterCleanCompat=true;
  function load(){
    const characters=document.getElementById('characters');
    if(!characters||!characters.classList.contains('active'))return;
    if(document.getElementById('hcCharacterBuilderCleanV1Script'))return;
    const s=document.createElement('script');
    s.id='hcCharacterBuilderCleanV1Script';
    s.src='./character-builder-clean-v1.js?v=clean-hard-reset-20260821-1840';
    s.async=false;
    document.head.appendChild(s);
  }
  function boot(){
    const characters=document.getElementById('characters');
    if(characters)new MutationObserver(load).observe(characters,{attributes:true,attributeFilter:['class']});
    load();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();