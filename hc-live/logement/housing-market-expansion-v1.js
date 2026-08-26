/* Haute Couture Live — legacy housing market compatibility shim v2.
   Real spatial discovery now belongs to HCRealEstateLiveFeed.
   This file intentionally does not create listings or mutate galleries.
*/
(function(){
'use strict';
if(window.HCHousingMarketExpansion?.version>=2)return;
const LEGACY_KEYS=[
  'haute-couture-housing-spatial-market-v1',
  'haute-couture-housing-gallery-assignments-v1'
];
try{LEGACY_KEYS.forEach(k=>localStorage.removeItem(k))}catch(e){}
const empty=()=>[];
const passthrough=x=>x||null;
window.HCHousingMarketExpansion={
  version:2,
  legacyDisabled:true,
  discoverVisible:empty,
  discoverCell:empty,
  spatialListings:empty,
  ensureGallery:passthrough,
  homeGameplay:x=>x?.gameplay||null,
  keys:{market:LEGACY_KEYS[0],galleries:LEGACY_KEYS[1]}
};
window.dispatchEvent(new CustomEvent('hc-housing-market-ready',{detail:{version:2,legacyDisabled:true}}));
})();
