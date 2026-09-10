/* Haute Couture Live — Vienne banque ville V1 */
(function(){'use strict';if(window.HCVienneCityBankV1)return;const city='Vienne';
const roles=['costume scène','habillage','laine et drap','archives textile','photographie','production spectacle','cliente cérémonie','cliente culture','retouche','journalisme','artisanat','régie costume'];
const districts=['Centre historique','Vallée de Gère','Théâtre antique','Gare','Pyramide','Estressin','Saint-Martin','Mont Salomon','Côte-Rôtie'];
const people=Array.from({length:30},(_,i)=>({id:'vie-p-'+(i+1),name:'Contact viennois '+(i+1),role:roles[i%roles.length],district:districts[i%districts.length],fictional:true}));
const families=['Costume de scène','Habillage express','Laine et drap','Patrimoine textile','Éditorial scène','Cérémonie','Archives','Retouche spectacle','Shooting patrimoine','Artiste en tournée','Production culturelle','Upcycling laine'];
const briefs=Array.from({length:52},(_,i)=>({id:'vie-b-'+(i+1),title:families[i%families.length]+' · mission '+(i+1),district:districts[i%districts.length],level:1+Math.floor(i/13),systems:['Atelier','Book','Téléphone','Agenda']}));
const secrets=Array.from({length:16},(_,i)=>({id:'vie-s-'+(i+1),title:'Piste viennoise discrète '+(i+1),district:districts[i%districts.length],fictional:true,threshold:2+(i%5)}));
const eventNames=['Saison scène','Mémoire textile','Costume vivant','Patrimoine et lumière','Artistes de passage','Archives ouvrières','Photo de spectacle','Cérémonies','Réemploi laine'];
const events=eventNames.map((family,i)=>({id:'vie-e-'+(i+1),family:family,evolutive:true}));
window.HCVienneCityBankV1={version:1,city,people,briefs,secrets,events};window.dispatchEvent(new CustomEvent('hc-city-bank-ready',{detail:window.HCVienneCityBankV1}));})();