/* Haute Couture Live — Atelier discovery bindings v1
   Relie les types de lieux/PNJ/événements aux packs de déblocage Atelier.
   Les villes peuvent utiliser ces clés sans connaître les IDs d'objets individuels.
*/
(function(){
'use strict';
function boot(){
 const P=window.HCAtelierUnlockPacks,C=window.HCAtelierCatalog;if(!P||!C){setTimeout(boot,60);return}
 if(window.HCAtelierDiscoveryBindings)return;
 const placeTypes={
  mercerie:['mercerie','denim','pleats','embroidery'],
  fabricShop:['mercerie','denim'],
  haberdashery:['mercerie','embroidery'],
  tailor:['tailoring','menswear','artisan'],
  corsetMaker:['artisan','lingerie','wedding'],
  embroiderer:['embroidery','artisan'],
  pleater:['pleats','artisan'],
  jeweler:['pageant','cannes'],
  shoemaker:['artisan'],
  milliner:['wedding','pageant','cannes'],
  artisan:['artisan'],
  archives:['archives','historical'],
  library:['archives','historical'],
  museum:['museum','historical','regional'],
  brocante:['historical','regional','boutique'],
  vintageShop:['historical','boutique'],
  boutique:['boutique'],
  bridalShop:['wedding'],
  lingerieShop:['lingerie'],
  swimShop:['swim'],
  danceShop:['dance','stage'],
  costumeWorkshop:['stage','historical','themePark'],
  theaterWorkshop:['stage','historical'],
  themeParkWorkshop:['themePark','stage'],
  sportsShop:['sport'],
  uniformWorkshop:['uniform','tailoring'],
  mentor:['mentor'],
  fashionSchool:['mentor','tailoring','artisan'],
  atelier:['artisan','mentor'],
  travel:['travel','regional'],
  regionalCraft:['regional','travel','artisan']
 };
 const eventTypes={
  wedding:['wedding'],bridesmaid:['wedding'],baptism:['wedding'],communion:['wedding'],civilWedding:['wedding'],
  gala:['cannes','pageant'],redCarpet:['cannes'],cannes:['cannes'],festival:['cannes','avantGarde'],
  pageant:['pageant'],miss:['pageant'],beautyContest:['pageant'],
  cabaret:['cabaret','stage'],concert:['stage'],theater:['stage'],dance:['dance','stage'],
  themePark:['themePark'],characterPerformance:['themePark','stage'],
  fashionShow:['avantGarde','cannes'],fashionWeek:['avantGarde','cannes','mentor'],
  heritage:['historical','regional'],museumEvent:['museum','historical'],craftFair:['artisan','regional'],
  sport:['sport'],uniformCommission:['uniform'],lingerieEvent:['lingerie'],swimEvent:['swim']
 };
 const npcTypes={
  seamstress:['artisan'],tailor:['tailoring','artisan'],corsetier:['lingerie','wedding','artisan'],embroiderer:['embroidery','artisan'],
  pleater:['pleats','artisan'],historian:['archives','historical'],archivist:['archives'],curator:['museum','historical'],
  costumeDesigner:['stage','historical','themePark'],stylist:['mentor','cannes'],designer:['mentor','avantGarde'],
  bridalDesigner:['wedding','mentor'],pageantDesigner:['pageant','mentor'],cabaretDesigner:['cabaret','stage'],
  shoemaker:['artisan'],milliner:['wedding','pageant','cannes'],jeweler:['pageant','cannes'],sportsDesigner:['sport']
 };
 function packsFor(kind,type){const map=kind==='event'?eventTypes:kind==='npc'?npcTypes:placeTypes;return (map[type]||[]).filter(id=>!!P.get(id))}
 function itemsFor(kind,type){const ids=[];for(const pack of packsFor(kind,type))ids.push(...(P.get(pack)?.ids||[]));return [...new Set(ids)].filter(id=>!!C.byId(id))}
 function descriptor(kind,type){return {kind,type,packs:packsFor(kind,type),items:itemsFor(kind,type)}}
 window.HCAtelierDiscoveryBindings={version:1,placeTypes,eventTypes,npcTypes,packsFor,itemsFor,descriptor};
 window.dispatchEvent(new CustomEvent('hc-atelier-discovery-bindings-ready',{detail:{version:1,places:Object.keys(placeTypes).length,events:Object.keys(eventTypes).length,npcs:Object.keys(npcTypes).length}}));
}
boot();
})();