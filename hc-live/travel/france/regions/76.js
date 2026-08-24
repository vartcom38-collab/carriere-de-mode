/* Haute Couture Live — Région 76 Occitanie. Couche régionale, contenu départemental chargé séparément. */
(function(){
'use strict';
const data={
 code:'76',slug:'occitanie',name:'Occitanie',capital:'Toulouse',
 departments:['09','11','12','30','31','32','34','46','48','65','66','81','82'],
 gameplay:{
  pace:'slow',
  identityTags:['Méditerranée','Pyrénées','Causses','Cévennes','Camargue','romanité','briques','pierres','marchés','artisanat','textiles','patrimoine'],
  regionalTracks:[
   {id:'oc-patrimoine',label:'Carnet patrimoine',levels:12},
   {id:'oc-matieres',label:'Matières & savoir-faire',levels:12},
   {id:'oc-reseau',label:'Réseau du Sud',levels:12},
   {id:'oc-route',label:'Carnet de route',levels:18}
  ],
  rules:{maxDirectReputationPerVisit:1,rareArchiveBaseChance:.015,repeatVisitCooldownDays:14,majorStoryCooldownDays:60},
  unlockPhilosophy:'La région ne se complète jamais en une seule carrière courte : les lieux, contacts, archives et événements se révèlent par couches, saisons et années de jeu.'
 },
 departmentFiles:Object.fromEntries(['09','11','12','30','31','32','34','46','48','65','66','81','82'].map(code=>[code,`../departments/${code}.js`]))
};
window.HCFranceRegionData=window.HCFranceRegionData||{};window.HCFranceRegionData[data.code]=data;
})();