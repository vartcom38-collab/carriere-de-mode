/* Haute Couture Live — compatibilité logement.
   L'ancien moteur spatial + annonces réelles est retiré : la carte et la colonne
   sont désormais alimentées par une seule source, housing-market-v2.js. */
(function(){
'use strict';
if(window.HCSpatialHousingDiscovery)return;

const BUILD='20260827-market-v2';
function loadMarket(){
  if(window.HCHousingMarketV2)return Promise.resolve(window.HCHousingMarketV2);
  if(document.querySelector('script[data-hc-housing-market-v2]'))return Promise.resolve(null);
  return new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src='./housing-market-v2.js?v='+BUILD;
    s.async=true;s.dataset.hcHousingMarketV2='1';
    s.onload=()=>resolve(window.HCHousingMarketV2||null);
    s.onerror=reject;
    document.head.appendChild(s);
  });
}
window.HCSpatialHousingDiscovery={version:3,mode:'synchronized-market-v2',loadMarket};
loadMarket().catch(e=>console.error('HC housing market v2 failed',e));
})();