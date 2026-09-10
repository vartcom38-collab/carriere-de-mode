/* Haute Couture Live — Rhône dense city banks V1
   Fiction gameplay. Documentary anchors are carried by map/universe files.
*/
(function(){
'use strict';
if(window.__HCRhoneDenseCityBanksV1)return;window.__HCRhoneDenseCityBanksV1=true;
const ctx=window.HCTerritoryContext;if(!ctx||String(ctx.getPresence?.()?.departmentCode||'')!=='69')return;
const cities={
 'Lyon':{people:40,briefs:68,secrets:20,events:12,roles:['tisseuse','designer textile','costumière','brodeuse','coloriste','photographe','styliste','prototypiste'],districts:['Croix-Rousse','Presqu’île','Guillotière','Confluence','Vaise','Vieux Lyon'],families:['soie contemporaine','Jacquard','costume de scène','réemploi','éditorial','broderie','prototype urbain']},
 'Villeurbanne':{people:32,briefs:52,secrets:15,events:9,roles:['costumière','habilleur','créatrice upcycling','régisseuse','photographe','couturière'],districts:['Gratte-Ciel','Charpennes','Tonkin','Cusset'],families:['scène','jeunesse créative','upcycling','costume mobile','collectif']},
 'Villefranche-sur-Saône':{people:32,briefs:52,secrets:15,events:9,roles:['organisatrice de réception','photographe','couturière cérémonie','accessoiriste','styliste'],districts:['Centre','Promenoir','Belleroche','Beaujolais'],families:['mariage','réception','patrimoine','clientèle premium','shooting']},
 'Tarare':{people:32,briefs:52,secrets:15,events:9,roles:['technicien textile','tisserande','prototypiste','archiviste','responsable production','couturière'],districts:['Centre','Madeleine','Ouest industriel'],families:['voilage','mousseline','industrie textile','petite série','archives techniques']},
 'Amplepuis':{people:32,briefs:52,secrets:15,events:9,roles:['mécanicienne machine à coudre','modéliste','couturière','médiateur technique','réparatrice','prototypiste'],districts:['Centre','secteur musée','quartiers d’atelier'],families:['machine à coudre','construction','assemblage','réparation','transmission technique']},
 'Thizy-les-Bourgs':{people:32,briefs:52,secrets:15,events:9,roles:['tisserande','teinturière','médiatrice patrimoine','designer matière','responsable atelier','photographe industriel'],districts:['Thizy','Bourg-de-Thizy','site de la Manufacture'],families:['tissage','teinture','molleton','couverture','friche industrielle','mémoire ouvrière']},
 'Oullins-Pierre-Bénite':{people:28,briefs:44,secrets:13,events:8,roles:['costumière','couturière retouche','styliste','photographe','responsable petite série'],districts:['Oullins centre','La Saulaie','Pierre-Bénite'],families:['mobilité métropolitaine','retouche','petite série','scène','clientèle quotidienne']},
 'Givors':{people:28,briefs:44,secrets:12,events:7,roles:['designer vêtement de travail','couturière','photographe industriel','prototypiste','responsable atelier'],districts:['Centre','Canal','vallée du Gier'],families:['vêtement fonctionnel','industrie','robustesse','réemploi','image industrielle']}
};
const first=['Alix','Noémie','Maya','Lina','Jeanne','Iris','Nina','Salomé','Élise','Maëlle','Lou','Inès','Camille','Yanis','Malo','Noé','Sacha','Elias','Niels','Gabriel','Samia','Nora','Aïcha','Clara','Léonie','Jade','Zoé','Lucie','Aya','Hugo','Léo','Robin'];
const last=['Rivière','Borel','Masson','Duret','Perrin','Giraud','Vernier','Morel','Chazal','Roche','Meyer','Basset','Delcourt','Lamy','Vidal','Perret','Renaud','Béraud','Faure','Arnaud','Berger','Colin','Valette','Brun','Garnier','Marchal','Favier','Rey','Cottin','Joly','Aubert','Grange'];
const traits=['précis·e','curieux·se','réservé·e','direct·e','généreux·se','exigeant·e','inventif·ve','méthodique','sociable','indépendant·e'];
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase();
function makePeople(city,c){return Array.from({length:c.people},(_,i)=>({id:`rh-dense-p-${slug(city)}-${i+1}`,city,name:first[(i*5+city.length)%first.length]+' '+last[(i*7+city.length)%last.length],role:c.roles[i%c.roles.length],district:c.districts[i%c.districts.length],trait:traits[i%traits.length],systems:['relations','carrière',i%3===0?'Atelier':i%3===1?'Book':'Téléphone'],fictional:true}));}
function makeBriefs(city,c){return Array.from({length:c.briefs},(_,i)=>{const f=c.families[i%c.families.length];return{id:`rh-dense-b-${slug(city)}-${i+1}`,city,title:`${f} · commande ${i+1}`,family:f,needs:1+(i%6),systems:[i%2?'Atelier':'Book',i%3?'carrière':'clientes'],fictional:true};});}
function makeSecrets(city,c){return Array.from({length:c.secrets},(_,i)=>({id:`rh-dense-s-${slug(city)}-${i+1}`,city,title:`Piste locale ${i+1} · ${c.families[i%c.families.length]}`,family:c.families[i%c.families.length],needs:2+(i%5),fictional:true}));}
function makeEvents(city,c){const months=[[1,2],[3,4],[5,6],[6,7],[9],[9,10],[10,11],[11,12],[4,5,6],[7,8]];return Array.from({length:c.events},(_,i)=>({id:`rh-dense-e-${slug(city)}-${i+1}`,city,label:`Saison ${c.families[i%c.families.length]}`,months:months[i%months.length],themes:[c.families[i%c.families.length],c.families[(i+1)%c.families.length],'transmission et création'],fictionalFuture:true}));}
const bank={departmentCode:'69',departmentName:'Rhône',version:1,cities:{}};
Object.entries(cities).forEach(([city,c])=>{bank.cities[city]={city,people:makePeople(city,c),briefs:makeBriefs(city,c),secrets:makeSecrets(city,c),eventFamilies:makeEvents(city,c)};});
window.HCRhoneDenseCityBanks=bank;window.dispatchEvent(new CustomEvent('hc-city-bank-ready',{detail:bank}));
})();