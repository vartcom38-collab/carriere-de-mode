/* Haute Couture Live — Cantal dense map addon V1 */
(function(){'use strict';if(window.__HCCantalDenseMapAddonV1)return;window.__HCCantalDenseMapAddonV1=true;const ctx=window.HCTerritoryContext,bridge=window.HCLocalMap;if(!ctx||!bridge||String(ctx.getPresence?.()?.departmentCode||'')!=='15')return;[
{id:'cantal-map-murat',dept:'15',departmentName:'Cantal',city:'Murat',name:'Murat · montagne & artisanat',cat:'markets',lat:45.111,lng:2.87,where:'Cantal'},
{id:'cantal-map-mauriac',dept:'15',departmentName:'Cantal',city:'Mauriac',name:'Mauriac · proximité & réemploi',cat:'markets',lat:45.219,lng:2.334,where:'Cantal'},
{id:'cantal-map-massiac',dept:'15',departmentName:'Cantal',city:'Massiac',name:'Massiac · passage & réparation',cat:'markets',lat:45.253,lng:3.197,where:'Cantal'}
].forEach(x=>bridge.addMarker(x));})();