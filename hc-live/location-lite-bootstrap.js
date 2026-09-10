(function(){
  if(window.__HCLocationLiteInstalled)return;window.__HCLocationLiteInstalled=true;
  const $=(s,r=document)=>r.querySelector(s);
  let geoLoading=false,mapLoading=false,territoryLoading=false;
  function load(src,test,onload){if(test())return onload&&onload();const s=document.createElement('script');s.src=src;s.async=true;s.onload=()=>onload&&onload();s.onerror=()=>{};document.head.appendChild(s)}
  function ensure(){
    if(!$('#location')?.classList.contains('active'))return;
    ensureTerritory(()=>{
      if(!window.__HCFranceGeographyInstalled&&!geoLoading){geoLoading=true;load('./france-geography-engine.js?v=20260910-presence1',()=>!!window.__HCFranceGeographyInstalled,()=>{geoLoading=false;ensureTerritorialLayer();ensureVector()})}else{ensureTerritorialLayer();ensureVector()}
    });
  }
  function ensureTerritory(cb){if(window.HCTerritoryContext)return cb&&cb();if(territoryLoading)return setTimeout(()=>ensureTerritory(cb),80);territoryLoading=true;load('./territory-context-v1.js?v=20260910-presence2',()=>!!window.HCTerritoryContext,()=>{territoryLoading=false;cb&&cb()})}
  function ensureTerritorialLayer(){load('./territorial-interactive-layer-v1.js?v=20260910-maptravel1',()=>!!window.__HCTerritorialInteractiveLayerInstalled)}
  function ensureVector(){if(!window.__HCBourgVectorMapInstalled&&!mapLoading){mapLoading=true;load('./bourg-vector-map.js?v=ca705722',()=>!!window.__HCBourgVectorMapInstalled,()=>{mapLoading=false})}}
  function boot(){const loc=$('#location');if(!loc)return;new MutationObserver(ensure).observe(loc,{attributes:true,attributeFilter:['class']});if(loc.classList.contains('active'))ensure()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();