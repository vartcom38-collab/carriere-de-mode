/* Haute Couture Live — Saint-Étienne banque ville V1 */
(function(){
'use strict';
if(window.HCStEtienneCityContentBankV1)return;
const city='Saint-Étienne',dept='42';
const first=['Anaïs','Mila','Nina','Claire','Lina','Lou','Maya','Sacha','Noémie','Éva','Léo','Malo','Nora','Jade','Emma','Adrien','Inès','Zoé'];
const last=['Perrin','Giraud','Vial','Roche','Besson','Moulin','Favier','Granet','Mercier','Borel','Aubert','Chazal','Murat','Forest','Renaud','Valette','Delmas','Lacombe'];
const roles=[
 ['tisseuse ruban','Atelier','matières'],['photographe produit','Book','shooting'],['designer textile','design','collaboration'],['technicienne textile','fonctionnel','Atelier'],['costumière de scène','costume','scène'],['retoucheuse','clientes','Atelier'],['brocanteuse','vintage','sourcing'],['journaliste design','presse','réputation'],['entrepreneure industrielle','clientes','B2B'],['chargée de production','réseau','logistique'],['graphiste','image','Book'],['modéliste','construction','Atelier'],['vendeuse mercerie','sourcing','matières'],['étudiante design','jeune réseau','expérimentation'],['organisateur culturel','agenda','réseau'],['cliente architecte','clientes','tailoring'],['habilleuse','scène','costume'],['responsable atelier fictif','réseau','production']
];
const districts=['Centre','Manufacture','Carnot','Chavanelle','Bergson','Bellevue','Terrenoire','Bassin stéphanois'];
const people=Array.from({length:36},(_,i)=>{const r=roles[i%roles.length];return{id:`ste-person-${String(i+1).padStart(2,'0')}`,city,dept,name:`${first[i%first.length]} ${last[(i*7)%last.length]}`,role:r[0],district:districts[i%districts.length],systems:r.slice(1),fictional:true,rarity:i<18?'courant':i<30?'occasionnel':'rare'};});
const cores=[
 ['Pièce centrée sur le ruban','design','matières'],['Vêtement de travail réinterprété','fonctionnel','Atelier'],['Portrait de créatrice industrielle','image','Book'],['Tenue de présentation design','tailoring','réputation'],['Costume pour petite scène','costume','scène'],['Look conférence innovation','tailoring','B2B'],['Capsule ruban + maille','design','Atelier'],['Shooting produit et détail','photo','Book'],['Transformation d’un vêtement usé','upcycling','vintage'],['Silhouette à bordure Jacquard','design','matières'],['Tenue robuste pour équipe technique','fonctionnel','clientes'],['Vêtement pluie et relief','fonctionnel','saison'],['Mini-série pour jeune marque','production','réseau'],['Éditorial architecture industrielle','photo','patrimoine'],['Tenue de vernissage design','cérémonie','culture'],['Accessoire sangles et rubans','accessoire','Atelier'],['Commande de cliente architecte','tailoring','clientes'],['Look concert local','costume','scène'],['Pièce archive industrielle','Book','recherche'],['Projet étudiant expérimental','jeune réseau','design']
];
const briefs=Array.from({length:60},(_,i)=>{const b=cores[i%cores.length];return{id:`ste-brief-${String(i+1).padStart(2,'0')}`,city,title:`${b[0]} · ${1+Math.floor(i/cores.length)}`,track:b[1],system:b[2],tier:i<15?'débutante':i<30?'développement':i<45?'confirmée':'avancée',district:districts[(i*5)%districts.length],fictional:true,antiRepeat:['client','matière','lieu','saison','silhouette','conséquence']};});
const secretLabels=['Échantillonnier de rubans techniques','Carnet de mise en carte retrouvé','Ancien rouleau non catalogué','Prototype d’accessoire abandonné','Photographies d’un atelier disparu','Carnet de commandes industrielles','Boîte de passementeries atypiques','Plan de métier annoté','Série de rubans de test','Archive de vêtements de travail','Contact d’une ancienne ouvrière','Stock dormant dans un atelier fictif','Projet textile jamais commercialisé','Carnet de couleurs techniques','Planche photo d’un défilé local','Échantillon de textile expérimental','Adresse d’un atelier confidentiel','Correspondance entre designer et fabricant'];
const secrets=secretLabels.map((title,i)=>({id:`ste-secret-${String(i+1).padStart(2,'0')}`,city,title,district:districts[i%districts.length],fictional:true,needsVisits:2+(i%5),needsRelation:i%4===0?2:1,rarity:i<8?'occasionnel':'rare'}));
const eventFamilies=[
 {id:'ste-ev-tisseade',label:'Tisséade',realBase2026:true,months:[3,4,9,10]},
 {id:'ste-ev-design',label:'Saison design',fictional:true,months:[3,4,5,9,10]},
 {id:'ste-ev-ruban',label:'Rencontres ruban et textile',fictional:true,months:[2,6,11]},
 {id:'ste-ev-scene',label:'Saison scène et tournées',fictional:true,months:[1,2,3,10,11,12]},
 {id:'ste-ev-vintage',label:'Week-end seconde main',fictional:true,months:[4,9]},
 {id:'ste-ev-industry',label:'Rencontres industrie / design',fictional:true,months:[2,5,10]},
 {id:'ste-ev-campus',label:'Projets étudiants design',fictional:true,months:[3,4,11]},
 {id:'ste-ev-patrimoine',label:'Patrimoine industriel',realBase2026:true,months:[9]},
 {id:'ste-ev-photo',label:'Parcours photo matière et architecture',fictional:true,months:[5,6,10]},
 {id:'ste-ev-hiver',label:'Commandes d’hiver',fictional:true,months:[11,12,1]},
 {id:'ste-ev-pro',label:'Réseau entrepreneures et image',fictional:true,months:[2,6,10]},
 {id:'ste-ev-gier',label:'Circulation bassin stéphanois',fictional:true,months:[4,5,6,9]}
];
window.HCStEtienneCityContentBankV1={version:1,city,dept,people,briefs,secrets,eventFamilies,counts:{people:people.length,briefs:briefs.length,secrets:secrets.length,eventFamilies:eventFamilies.length}};
window.dispatchEvent(new CustomEvent('hc-city-content-bank',{detail:window.HCStEtienneCityContentBankV1}));
})();