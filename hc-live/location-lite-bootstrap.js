(function(){
  if(window.__HCLocationLiteInstalled)return;window.__HCLocationLiteInstalled=true;
  const $=(s,r=document)=>r.querySelector(s);
  let geoLoading=false,mapLoading=false;
  function load(src,test,onload){if(test())return onload&&onload();const s=document.createElement('script');s.src=src;s.async=true;s.onload=()=>onload&&onload();s.onerror=()=>{};document.head.appendChild(s)}
  function ensure(){
    if(!$('#location')?.classList.contains('active'))return;
    if(!window.__HCFranceGeographyInstalled&&!geoLoading){geoLoading=true;load('./france-geography-engine.js?v=6c563790',()=>!!window.__HCFranceGeographyInstalled,()=>{geoLoading=false;ensureVector()})}else ensureVector();
  }
  function ensureVector(){if(!window.__HCBourgVectorMapInstalled&&!mapLoading){mapLoading=true;load('./bourg-vector-map.js?v=ca705722',()=>!!window.__HCBourgVectorMapInstalled,()=>{mapLoading=false})}}
  function boot(){const loc=$('#location');if(!loc)return;new MutationObserver(ensure).observe(loc,{attributes:true,attributeFilter:['class']});if(loc.classList.contains('active'))ensure()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();