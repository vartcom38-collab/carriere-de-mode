(function(){
  if(window.__HCLightBootstrapInstalled)return;window.__HCLightBootstrapInstalled=true;
  const $=(s,r=document)=>r.querySelector(s);
  let locationStarted=false,hubStarted=false;
  function add(src,id){if(document.getElementById(id))return;const s=document.createElement('script');s.id=id;s.src=src;s.async=true;document.head.appendChild(s)}
  function ensureLocation(){if(locationStarted)return;locationStarted=true;add('./location-lite-bootstrap.js?v=f1b2afa8','hcLocationLiteScript')}
  function ensureHub(){if(hubStarted)return;hubStarted=true;add('./main-hub-full.js?v=1c50ccf0','hcFullHubScript')}
  function sync(){if($('#location')?.classList.contains('active'))ensureLocation();if($('#atelier')?.classList.contains('active'))ensureHub()}
  function boot(){
    const loc=$('#location'),atelier=$('#atelier');
    if(loc)new MutationObserver(sync).observe(loc,{attributes:true,attributeFilter:['class']});
    if(atelier)new MutationObserver(sync).observe(atelier,{attributes:true,attributeFilter:['class']});
    sync();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();