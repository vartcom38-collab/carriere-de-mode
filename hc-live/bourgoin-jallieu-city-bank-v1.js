/* Haute Couture Live — Bourgoin-Jallieu banque ville V1 */
(function(){
'use strict';
if(window.HCBourgoinJallieuCityBankV1)return;
const city='Bourgoin-Jallieu';
const roles=['médiation textile','tissage','design motif','couleur textile','costume','retouche','photographie','cliente cérémonie','cliente locale','archives','artisanat d’art','production textile','seconde main','journalisme culture'];
const districts=['Centre-ville','Musée','Gare','Bourbre','Champaret','Mozas','Pré-Bénit','Oiselet','La Grive','Montbernier'];
const people=Array.from({length:32},(_,i)=>({id:'bj-p-'+(i+1),name:'Contact berjallien '+(i+1),role:roles[i%roles.length],district:districts[i%districts.length],fictional:true}));
const families=['Tissage','Impression textile','Ennoblissement','Motif placé','Couleur','Archives textile','Upcycling','Cérémonie','Petite série','Métiers d’art','Costume','Patrimoine vivant','Sourcing'];
const briefs=Array.from({length:56},(_,i)=>({id:'bj-b-'+(i+1),title:families[i%families.length]+' · mission '+(i+1),district:districts[i%districts.length],level:1+Math.floor(i/14),systems:['Atelier','Book','Téléphone','Agenda']}));
const secrets=Array.from({length:18},(_,i)=>({id:'bj-s-'+(i+1),title:'Piste textile discrète '+(i+1),district:districts[i%districts.length],fictional:true,threshold:2+(i%5)}));
const eventFamilies=['Tissage vivant','Impression et couleur','Métiers d’art','Patrimoine textile','Exposition textile','Atelier public','Archives et collection','Création locale','Réemploi textile','Transmission'];
const events=eventFamilies.map((family,i)=>({id:'bj-e-'+(i+1),family:family,evolutive:true}));
window.HCBourgoinJallieuCityBankV1={version:1,city,people,briefs,secrets,events};
window.dispatchEvent(new CustomEvent('hc-city-bank-ready',{detail:window.HCBourgoinJallieuCityBankV1}));
})();