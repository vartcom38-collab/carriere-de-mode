/* Haute Couture Live — Atelier content audit v1 */
(function(){
'use strict';
function boot(){
 const C=window.HCAtelierCatalog;if(!C||C.version<3||!C.productionSchemaVersion){setTimeout(boot,80);return}
 if(window.HCAtelierContentAudit)return;
 function inspect(item){
  const p=item.production||{};const problems=[];
  if(!item.id)problems.push('missing-id');
  if(!item.name)problems.push('missing-name');
  if(!item.category)problems.push('missing-category');
  if(!Array.isArray(item.sources)||!item.sources.length)problems.push('missing-unlock-source');
  if(!p.compatibility?.slots?.length)problems.push('missing-slot');
  if(!p.promptToken)problems.push('missing-prompt-token');
  if(!p.visual?.query)problems.push('missing-visual-query');
  if(p.visual?.status!=='ready')problems.push('visual-reference-pending');
  return{id:item.id,name:item.name,category:item.category,ready:problems.length===0,problems};
 }
 function report(){const rows=C.items.map(inspect);return{version:1,catalogVersion:C.version,total:rows.length,ready:rows.filter(x=>x.ready).length,pending:rows.filter(x=>!x.ready).length,missingVisual:rows.filter(x=>x.problems.includes('visual-reference-pending')).length,rows}}
 window.HCAtelierContentAudit={inspect,report};
 window.dispatchEvent(new CustomEvent('hc-atelier-content-audit-ready',{detail:report()}));
}
boot();
})();