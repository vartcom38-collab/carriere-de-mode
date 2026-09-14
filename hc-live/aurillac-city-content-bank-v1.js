/* Haute Couture Live — Aurillac banque ville V1 */
(function(){
'use strict';if(window.HCAurillacCityContentBankV1)return;
const city='Aurillac',dept='15',districts=['Centre ancien','Jordanne','Gare','Prairie','Zone artisanale','Hauteurs','Marché','Périphérie sud'];
const first=['Mila','Lina','Nora','Sacha','Lou','Noémie','Jade','Malo','Éva','Anaïs','Clara','Zoé','Léo','Inès','Camille','Adrien'];
const last=['Vidal','Roche','Borel','Perrin','Favier','Mercier','Giraud','Aubert','Forest','Valette','Moulin','Renaud','Murat','Delmas','Granet','Lacombe'];
const roles=[['prototypiste accessoire','Atelier','parapluie'],['costumière de rue','scène','costume'],['photographe','Book','shooting'],['organisatrice festival','agenda','réseau'],['vendeuse mercerie','sourcing','matières'],['retoucheuse','Atelier','clientes'],['brocanteuse','vintage','sourcing'],['cliente commerçante','clientes','quotidien'],['chargée de production','réseau','logistique'],['artisane laine','matières','Atelier'],['journaliste locale','presse','réputation'],['régisseuse','scène','réseau']];
const people=Array.from({length:30},(_,i)=>{const r=roles[i%roles.length];return{id:`aur-person-${i+1}`,city,dept,name:`${first[i%first.length]} ${last[(i*5)%last.length]}`,role:r[0],district:districts[i%districts.length],systems:r.slice(1),fictional:true,rarity:i<15?'courant':i<24?'occasionnel':'rare'};});
const cores=[['Accessoire inspiré du parapluie','accessoire'],['Tenue mobile pour arts de rue','costume'],['Shooting pluie et mouvement','photo'],['Pièce en laine contemporaine','matières'],['Look commerçante locale','tailoring'],['Transformation seconde main','upcycling'],['Tenue d’accueil festival','cérémonie'],['Costume robuste de tournée','fonctionnel'],['Robe de mariage locale','mariage'],['Portrait d’artisane','image'],['Prototype pliable','design'],['Tenue de marché d’hiver','fonctionnel'],['Look d’été festivalier','scène'],['Capsule noir/pluie/couleur','design'],['Commande de cliente fidèle','clientes'],['Éditorial ville + montagne','photo']];
const briefs=Array.from({length:48},(_,i)=>({id:`aur-brief-${i+1}`,city,title:`${cores[i%cores.length][0]} · ${1+Math.floor(i/cores.length)}`,track:cores[i%cores.length][1],tier:i<12?'débutante':i<24?'développement':i<36?'confirmée':'avancée',district:districts[(i*3)%districts.length],fictional:true,antiRepeat:['client','lieu','matière','saison','conséquence']}));
const labels=['Ancien patron de parapluie','Carnet de tournée','Planche photo de festival','Stock de poignées dépareillées','Échantillon de laine locale','Adresse d’atelier discret','Ancienne commande de scène','Boîte d’accessoires de rue','Carnet d’une costumière','Correspondance d’un régisseur','Plan de structure pliable','Archive de marché','Prototype jamais vendu','Série photo sous la pluie','Contact d’une ancienne ouvrière','Réserve textile oubliée'];
const secrets=labels.map((title,i)=>({id:`aur-secret-${i+1}`,city,title,district:districts[i%districts.length],fictional:true,needsVisits:2+(i%5),rarity:i<8?'occasionnel':'rare'}));
const eventFamilies=[
{id:'aur-ev-festival',label:'Festival international de théâtre de rue',realBase2026:true,months:[8]},
{id:'aur-ev-parapluie',label:'Rencontres autour du parapluie et de l’accessoire',fictional:true,months:[4,5,9]},
{id:'aur-ev-laine',label:'Marché laine / artisanat',fictional:true,months:[3,7,10]},
{id:'aur-ev-vintage',label:'Brocante et seconde main',fictional:true,months:[4,9]},
{id:'aur-ev-photo',label:'Parcours photo pluie / ville',fictional:true,months:[5,10]},
{id:'aur-ev-scene',label:'Tournées et petites scènes',fictional:true,months:[1,2,3,10,11]},
{id:'aur-ev-mariage',label:'Saison cérémonies',fictional:true,months:[5,6,7]},
{id:'aur-ev-hiver',label:'Commandes d’hiver',fictional:true,months:[11,12,1]},
{id:'aur-ev-artisanat',label:'Rencontres métiers d’art',fictional:true,months:[4,6,9]},
{id:'aur-ev-jeunes',label:'Jeunes créateurs du Cantal',fictional:true,months:[3,6,10]}
];
window.HCAurillacCityContentBankV1={version:1,city,dept,people,briefs,secrets,eventFamilies,counts:{people:people.length,briefs:briefs.length,secrets:secrets.length,eventFamilies:eventFamilies.length}};window.dispatchEvent(new CustomEvent('hc-city-content-bank',{detail:window.HCAurillacCityContentBankV1}));
})();