/* Haute Couture Live — Allier dense map addon V1 */
(function(){'use strict';if(window.__HCAllierDenseMapAddonV1)return;window.__HCAllierDenseMapAddonV1=true;const ctx=window.HCTerritoryContext,bridge=window.HCLocalMap;if(!ctx||!bridge||String(ctx.getPresence?.()?.departmentCode||'')!=='03')return;[
{id:'allier-map-stpourcain',dept:'03',departmentName:'Allier',city:'Saint-Pourçain-sur-Sioule',name:'Saint-Pourçain · réception & saison',cat:'markets',lat:46.307,lng:3.289,where:'Allier'},
{id:'allier-map-lapalisse',dept:'03',departmentName:'Allier',city:'Lapalisse',name:'Lapalisse · patrimoine & passage',cat:'heritage',lat:46.249,lng:3.637,where:'Allier'},
{id:'allier-map-commentry',dept:'03',departmentName:'Allier',city:'Commentry',name:'Commentry · industrie & workwear',cat:'heritage',lat:46.289,lng:2.742,where:'Allier'},
{id:'allier-map-herisson',dept:'03',departmentName:'Allier',city:'Hérisson',name:'Hérisson · village & création',cat:'culture',lat:46.508,lng:2.712,where:'Allier'}
].forEach(x=>bridge.addMarker(x));})();