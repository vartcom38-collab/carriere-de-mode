/* Haute Couture Live — Clermont-Ferrand banque ville V1
   Banque dense : personnages, briefs, secrets, familles événementielles. Fictif explicite sauf ancres réelles déjà portées par la carte.
*/
(function(){
'use strict';
if(window.HCClermontCityContentBankV1)return;
const city='Clermont-Ferrand',dept='63';
const first=['Anaïs','Camille','Lina','Élodie','Nora','Maëlle','Sacha','Noémie','Lucie','Maya','Clara','Jade','Inès','Léo','Malo','Adrien','Lou','Zoé'];
const last=['Roche','Borel','Vignal','Chabert','Mercier','Favier','Renaud','Giraud','Delmas','Aubert','Granet','Perrin','Valette','Noir','Mazel','Forest','Murat','Lacombe'];
const roles=[
 ['photographe matière','Book','shooting'],['retoucheuse','Atelier','clientes'],['organisatrice culturelle','agenda','réseau'],['vendeuse mercerie','sourcing','matières'],['créatrice upcycling','Atelier','vintage'],['documentaliste','archives','Book'],['styliste indépendante','réseau','collaboration'],['cliente entrepreneure','clientes','tailoring'],['costumière intermittente','scène','costume'],['journaliste culture','presse','réputation'],['graphiste','image','Book'],['modéliste','Atelier','construction'],['brocanteuse','vintage','sourcing'],['médiatrice textile','Book','matières'],['organisatrice mariage','clientes','cérémonie'],['technicienne événement','scène','logistique'],['étudiante design','jeune réseau','expérimentation'],['directrice de lieu fictif','réseau','événement']
];
const districts=['Centre ancien','Jaude','Montferrand','Les Salins','Carmes','Delille','Campus','Ouest métropolitain'];
const people=Array.from({length:36},(_,i)=>{const r=roles[i%roles.length];return{id:`cf-person-${String(i+1).padStart(2,'0')}`,city,dept,name:`${first[i%first.length]} ${last[(i*5)%last.length]}`,role:r[0],district:districts[i%districts.length],systems:r.slice(1),fictional:true,rarity:i<18?'courant':i<30?'occasionnel':'rare'};});
const briefCores=[
 ['Portrait professionnel volcanique','tailoring','image'],['Capsule pierre noire / ivoire','design','Book'],['Tenue de vernissage','cérémonie','culture'],['Look de conférence','tailoring','clientes'],['Silhouette de festival cinéma','image','événement'],['Costume léger pour tournage','costume','scène'],['Robe civile contemporaine','mariage','clientes'],['Transformation d’une robe familiale','upcycling','mémoire'],['Mini-capsule seconde main','upcycling','vintage'],['Shooting au vent','photo','mouvement'],['Tenue d’accueil culturel','tailoring','culture'],['Prototype matière mixte','Atelier','matières'],['Pièce inspirée des collections textiles','Book','recherche'],['Accessoire graphique','design','accessoire'],['Tenue de remise de prix','cérémonie','réputation'],['Look étudiant à petit budget','jeune réseau','upcycling'],['Vestiaire d’entrepreneure','tailoring','clientes'],['Silhouette pluie froide','fonctionnel','saison'],['Tenue d’été extérieure','cérémonie','saison'],['Éditorial Montferrand','photo','patrimoine']
];
const briefs=Array.from({length:60},(_,i)=>{const b=briefCores[i%briefCores.length],tier=i<15?'débutante':i<30?'développement':i<45?'confirmée':'avancée';return{id:`cf-brief-${String(i+1).padStart(2,'0')}`,city,title:`${b[0]} · ${1+Math.floor(i/briefCores.length)}`,track:b[1],system:b[2],tier,district:districts[(i*3)%districts.length],fictional:true,antiRepeat:['client','matière','lieu','saison','silhouette','conséquence']};});
const secretLabels=['Carnet d’échantillons oublié','Planche-contact jamais publiée','Ancien carnet de commandes','Adresse de retouche transmise oralement','Réserve de boutons dépareillés','Correspondance autour d’une exposition','Prototype abandonné','Ancienne série de portraits de créateurs','Stock de tissus dormants','Carnet de motifs personnels','Adresse de shooting discrète','Lien oublié entre deux ateliers','Cliente historique à retrouver','Photographe retraité qui possède des archives','Petit fonds de vêtements de travail','Collection privée de cartes postales mode','Échantillon sans provenance claire','Projet d’exposition jamais monté'];
const secrets=secretLabels.map((title,i)=>({id:`cf-secret-${String(i+1).padStart(2,'0')}`,city,title,district:districts[i%districts.length],fictional:true,needsVisits:2+(i%5),needsRelation:i%3===0?2:1,rarity:i<8?'occasionnel':'rare'}));
const eventFamilies=[
 {id:'cf-ev-textile',label:'Biennale textile',realBase2026:true,months:[5,6,7,8,9]},
 {id:'cf-ev-cinema',label:'Saison cinéma / équipes de passage',realBase2026:true,months:[1,2,3]},
 {id:'cf-ev-patrimoine',label:'Journées patrimoine',realBase2026:true,months:[9]},
 {id:'cf-ev-design',label:'Rencontres design et matières',fictional:true,months:[3,4,10]},
 {id:'cf-ev-vintage',label:'Week-end seconde main',fictional:true,months:[4,9,11]},
 {id:'cf-ev-photo',label:'Parcours photographie urbaine',fictional:true,months:[5,6,10]},
 {id:'cf-ev-ceremonie',label:'Saison cérémonies',fictional:true,months:[5,6,7,8]},
 {id:'cf-ev-campus',label:'Projets étudiants',fictional:true,months:[2,3,4,11]},
 {id:'cf-ev-hiver',label:'Marché et commandes d’hiver',fictional:true,months:[11,12,1]},
 {id:'cf-ev-archives',label:'Ouverture exceptionnelle de fonds',fictional:true,months:[3,9]},
 {id:'cf-ev-pro',label:'Rencontres entrepreneures / image',fictional:true,months:[2,5,10]},
 {id:'cf-ev-outdoor',label:'Saison extérieure et montagne proche',fictional:true,months:[6,7,8]}
];
window.HCClermontCityContentBankV1={version:1,city,dept,people,briefs,secrets,eventFamilies,counts:{people:people.length,briefs:briefs.length,secrets:secrets.length,eventFamilies:eventFamilies.length}};
window.dispatchEvent(new CustomEvent('hc-city-content-bank',{detail:window.HCClermontCityContentBankV1}));
})();