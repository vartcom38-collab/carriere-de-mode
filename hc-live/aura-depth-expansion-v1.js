/* Haute Couture Live — AURA depth expansion V1
   Première passe : grands pôles + lieux à forte valeur de gameplay.
   Les lieux fictifs sont explicitement marqués fictional:true.
*/
(function(){
'use strict';
if(window.__HCAuraDepthV1)return;window.__HCAuraDepthV1=true;
const D={
'01':[
{id:'01-bourg-social-atelier',dept:'01',departmentName:'Ain',city:'Bourg-en-Bresse',name:'Café des dessinateurs · Bourg',template:'social',cat:'people',fictional:true,lat:46.2052,lng:5.225,where:'Bourg-en-Bresse · Ain',ambience:'Fin d’après-midi, étudiants, artisans et habitués',text:'Lieu social fictif de gameplay pour faire vivre Bourg : rendez-vous, petites rumeurs, clientes locales et artistes de passage.'},
{id:'01-bourg-memoire-textile',dept:'01',departmentName:'Ain',city:'Bourg-en-Bresse',name:'Fonds textile bressan · recherche',template:'archives',cat:'libraries',fictional:true,lat:46.2047,lng:5.226,where:'Bourg-en-Bresse · Ain',text:'Point de recherche gameplay autour du costume bressan, des émaux, de l’ornement et des photographies locales.'}
],
'03':[
{id:'03-cncs',dept:'03',departmentName:'Allier',city:'Moulins',name:'Centre national du costume et de la scène',template:'heritage',cat:'culture',lat:46.5579,lng:3.3235,where:'Moulins · Allier',text:'Costumes de scène, silhouettes, matières, accessoires, métiers et scénographies : un lieu majeur pour la carrière.',palette:['rouge théâtre','or','noir'],materials:['velours','passementerie','soie'],motifs:['costume','scène','ornement'],unlock:'Références costume · missions scène · Book.'},
{id:'03-maison-mantin',dept:'03',departmentName:'Allier',city:'Moulins',name:'Maison Mantin',template:'heritage',cat:'heritage',lat:46.5648,lng:3.3323,where:'Moulins · Allier',text:'Maison de collectionneur de la fin du XIXe siècle : décors, objets, textiles et goût bourgeois peuvent nourrir une recherche d’époque.'},
{id:'03-vichy-social',dept:'03',departmentName:'Allier',city:'Vichy',name:'Salon thermal · Vichy',template:'social',cat:'people',fictional:true,lat:46.1266,lng:3.4209,where:'Vichy · Allier',ambience:'Clientèle de séjour, réception et rendez-vous',text:'Lieu social fictif relié à la vie thermale : commandes de cérémonie, rencontres, invitations et clientèle de passage.'}
],
'07':[
{id:'07-papeteries',dept:'07',departmentName:'Ardèche',city:'Davézieux',name:'Musée des Papeteries Canson et Montgolfier',template:'heritage',cat:'culture',lat:45.251,lng:4.708,where:'Davézieux · Ardèche',text:'Papier, fabrication, dessin, couleur et histoire industrielle : une source directe pour le croquis, les surfaces et la recherche matière.',materials:['papier','fibres','encres'],motifs:['trame','ballon','filigrane']},
{id:'07-annonay-social',dept:'07',departmentName:'Ardèche',city:'Annonay',name:'Café des inventeurs · Annonay',template:'social',cat:'people',fictional:true,lat:45.2397,lng:4.6704,where:'Annonay · Ardèche',ambience:'Centre-ville, jeunes créatifs, industriels et artistes locaux',text:'Point social fictif permettant de faire circuler rumeurs, collaborations et missions liées au papier, au cuir, au textile et au design.'},
{id:'07-pont-arc',dept:'07',departmentName:'Ardèche',city:'Vallon-Pont-d’Arc',name:'Pont d’Arc · roche & courbe',template:'heritage',cat:'nature',lat:44.3829,lng:4.4168,where:'Vallon-Pont-d’Arc · Ardèche',text:'Arche naturelle, roche claire, eau et ombre : une source de coupe, de courbe et de palette minérale.'}
],
'15':[
{id:'15-aurillac-costume',dept:'15',departmentName:'Cantal',city:'Aurillac',name:'Costume cantalien · fonds Parry',template:'archives',cat:'libraries',lat:44.926,lng:2.441,where:'Aurillac · Cantal',text:'Recherche sur les vêtements du quotidien et de représentation en Auvergne à partir des fonds photographiques locaux : coiffes, volumes, usages, mutations.'},
{id:'15-salers',dept:'15',departmentName:'Cantal',city:'Salers',name:'Salers · pierre volcanique & silhouettes',template:'heritage',cat:'heritage',lat:45.138,lng:2.495,where:'Salers · Cantal',text:'Architecture sombre, relief, rues et lumière du plateau nourrissent une palette forte et des silhouettes structurées.',palette:['basalte','gris pluie','vert prairie'],materials:['laine','lin'],motifs:['pierre','toitures','relief']},
{id:'15-aurillac-social',dept:'15',departmentName:'Cantal',city:'Aurillac',name:'Café des costumiers · Aurillac',template:'social',cat:'people',fictional:true,lat:44.9265,lng:2.442,where:'Aurillac · Cantal',ambience:'Artistes, costumiers, musiciens et habitués',text:'Lieu fictif permettant d’ancrer les scènes sociales autour du costume, de la photographie et des événements culturels.'}
],
'26':[
{id:'26-romans-chaussure',dept:'26',departmentName:'Drôme',city:'Romans-sur-Isère',name:'Musée de la Chaussure · Romans',template:'heritage',cat:'culture',lat:45.0457,lng:5.0526,where:'Romans-sur-Isère · Drôme',text:'Chaussure, cuir, forme, artisanat et histoire industrielle : un lieu central pour l’accessoire et le design de silhouette.',materials:['cuir','peau','métal'],motifs:['forme','talon','laçage']},
{id:'26-grignan-chateau',dept:'26',departmentName:'Drôme',city:'Grignan',name:'Château de Grignan',template:'heritage',cat:'heritage',lat:44.4194,lng:4.9094,where:'Grignan · Drôme',text:'Architecture, intérieurs, histoire de cour et lien avec Madame de Sévigné : visite, lecture mode, événements et recherches d’archives.'},
{id:'26-hauterives-palais',dept:'26',departmentName:'Drôme',city:'Hauterives',name:'Palais idéal du Facteur Cheval',template:'heritage',cat:'heritage',lat:45.2551,lng:5.0282,where:'Hauterives · Drôme',text:'Ornement total, sculpture, accumulation et architecture imaginaire : traduction possible en reliefs, broderies et volumes.'}
],
'38':[
{id:'38-stendhal-museum',dept:'38',departmentName:'Isère',city:'Grenoble',name:'Musée Stendhal',template:'archives',cat:'libraries',lat:45.1912,lng:5.7278,where:'Grenoble · Isère',text:'Fonds littéraires, objets, lieux et mémoire grenobloise liés à Stendhal : recherche, Book et pistes de collection.'},
{id:'38-berlioz-house',dept:'38',departmentName:'Isère',city:'La Côte-Saint-André',name:'Musée Hector-Berlioz',template:'heritage',cat:'culture',lat:45.394,lng:5.261,where:'La Côte-Saint-André · Isère',text:'Maison natale, musique, scène et festival : une porte vers le costume, le rythme, la dramaturgie et les collaborations culturelles.'},
{id:'38-grenoble-social',dept:'38',departmentName:'Isère',city:'Grenoble',name:'Café des gantiers · Grenoble',template:'social',cat:'people',fictional:true,lat:45.1905,lng:5.7285,where:'Grenoble · Isère',ambience:'Créatifs, étudiants, artisans et anciens du métier',text:'Lieu social fictif inspiré de l’histoire gantière locale : rumeurs de commandes, rencontres et transmission de savoir-faire.'}
],
'42':[
{id:'42-mai-rubans',dept:'42',departmentName:'Loire',city:'Saint-Étienne',name:'Musée d’Art et d’Industrie · Rubans',template:'archives',cat:'culture',lat:45.4319,lng:4.388,where:'Saint-Étienne · Loire',text:'Rubanerie, métiers à tisser, tissuthèque, art décoratif et haute couture : un des lieux les plus directement liés au gameplay mode de toute la région.',materials:['soie','ruban','velours'],motifs:['fleur','orient','mécanique','lisière']},
{id:'42-firminy-corbu',dept:'42',departmentName:'Loire',city:'Firminy',name:'Site Le Corbusier · Firminy',template:'heritage',cat:'heritage',lat:45.383,lng:4.287,where:'Firminy · Loire',text:'Architecture moderne, Modulor, couleur et lumière : lecture mode, Book, shooting et collection architecturale.'},
{id:'42-sainte-social',dept:'42',departmentName:'Loire',city:'Saint-Étienne',name:'Café des rubaniers · Saint-Étienne',template:'social',cat:'people',fictional:true,lat:45.438,lng:4.387,where:'Saint-Étienne · Loire',ambience:'Fin de journée, designers, passementiers, étudiants et journalistes',text:'Lieu social fictif pour relier les métiers du ruban, le design, les écoles, la presse et les commandes.'}
],
'43':[
{id:'43-crozatier',dept:'43',departmentName:'Haute-Loire',city:'Le Puy-en-Velay',name:'Musée Crozatier · recherche locale',template:'archives',cat:'culture',lat:45.043,lng:3.883,where:'Le Puy-en-Velay · Haute-Loire',text:'Collections d’art, d’histoire et de territoire utilisables comme porte d’entrée vers costumes, objets, images et mémoire locale.'},
{id:'43-dentelle',dept:'43',departmentName:'Haute-Loire',city:'Le Puy-en-Velay',name:'Dentelle du Puy · savoir-faire',template:'craft',cat:'craft',lat:45.044,lng:3.885,where:'Le Puy-en-Velay · Haute-Loire',text:'Apprentissage progressif autour de la dentelle aux fuseaux et de sa traduction contemporaine.',techniques:['dentelle aux fuseaux','bordure ajourée','motif placé']},
{id:'43-lafayette-chateau',dept:'43',departmentName:'Haute-Loire',city:'Chavaniac-Lafayette',name:'Château de Chavaniac-Lafayette',template:'heritage',cat:'heritage',lat:45.1594,lng:3.5811,where:'Chavaniac-Lafayette · Haute-Loire',text:'Maison natale de Lafayette : uniformes, objets, jardins, voyage et mémoire historique.'}
],
'63':[
{id:'63-bargoin-textile',dept:'63',departmentName:'Puy-de-Dôme',city:'Clermont-Ferrand',name:'Musée Bargoin · textile & archéologie',template:'archives',cat:'culture',lat:45.7725,lng:3.0875,where:'Clermont-Ferrand · Puy-de-Dôme',text:'Textiles, objets et archéologie peuvent nourrir une recherche matière, couleur, motif et construction.'},
{id:'63-michelin',dept:'63',departmentName:'Puy-de-Dôme',city:'Clermont-Ferrand',name:'L’Aventure Michelin · design industriel',template:'heritage',cat:'culture',lat:45.7908,lng:3.105,where:'Clermont-Ferrand · Puy-de-Dôme',text:'Graphisme, mobilité, caoutchouc, publicité et design industriel : une piste inattendue pour matière, accessoire et image de marque.'},
{id:'63-clermont-social',dept:'63',departmentName:'Puy-de-Dôme',city:'Clermont-Ferrand',name:'Café noir volcan · Clermont',template:'social',cat:'people',fictional:true,lat:45.777,lng:3.087,where:'Clermont-Ferrand · Puy-de-Dôme',ambience:'Étudiants, artistes, ingénieurs, journalistes et voyageurs',text:'Lieu social fictif ancré dans la ville pour générer rencontres, commandes et rumeurs culturelles.'}
],
'69':[
{id:'69-maison-canuts',dept:'69',departmentName:'Rhône',city:'Lyon',name:'Maison des Canuts',template:'archives',cat:'culture',lat:45.779,lng:4.832,where:'Croix-Rousse · Lyon · Rhône',text:'Canuts, Jacquard, soie, dessin textile et histoire sociale : recherche incontournable pour la progression mode.'},
{id:'69-soierie-vivante',dept:'69',departmentName:'Rhône',city:'Lyon',name:'Soierie Vivante · atelier de tissage',template:'craft',cat:'craft',lat:45.777,lng:4.833,where:'Croix-Rousse · Lyon · Rhône',text:'Ateliers historiques de tissage et passementerie : observer les métiers, comprendre la fabrication et débloquer progressivement des savoir-faire.',techniques:['tissage Jacquard','passementerie','lecture de dessin textile']},
{id:'69-lyon-social',dept:'69',departmentName:'Rhône',city:'Lyon',name:'Café de la Fabrique · Croix-Rousse',template:'social',cat:'people',fictional:true,lat:45.7745,lng:4.8325,where:'Croix-Rousse · Lyon · Rhône',ambience:'Soie, designers, étudiants, artisans et journalistes',text:'Lieu social fictif pour faire circuler invitations, rumeurs d’ateliers, clientes et opportunités de collaboration.'}
],
'73':[
{id:'73-charmettes',dept:'73',departmentName:'Savoie',city:'Chambéry',name:'Les Charmettes · maison de Rousseau',template:'heritage',cat:'heritage',lat:45.552,lng:5.918,where:'Chambéry · Savoie',text:'Maison, jardins, écriture et paysage : une visite calme qui peut ouvrir recherche, Book et collection inspirée de la nature.'},
{id:'73-opinel-museum',dept:'73',departmentName:'Savoie',city:'Saint-Jean-de-Maurienne',name:'Musée Opinel',template:'heritage',cat:'culture',lat:45.277,lng:6.346,where:'Saint-Jean-de-Maurienne · Savoie',text:'Bois, acier, objet fonctionnel, histoire industrielle et identité graphique : une piste accessoire et design.'},
{id:'73-chambery-social',dept:'73',departmentName:'Savoie',city:'Chambéry',name:'Salon des voyageurs · Chambéry',template:'social',cat:'people',fictional:true,lat:45.566,lng:5.92,where:'Chambéry · Savoie',ambience:'Voyageurs, étudiants, professionnels de montagne et artistes',text:'Lieu fictif de rendez-vous permettant de relier Chambéry aux stations, à la Maurienne et aux déplacements professionnels.'}
],
'74':[
{id:'74-annecy-chateau',dept:'74',departmentName:'Haute-Savoie',city:'Annecy',name:'Musée-Château d’Annecy',template:'heritage',cat:'culture',lat:45.8972,lng:6.1255,where:'Annecy · Haute-Savoie',text:'Architecture, collections et vues sur la ville : patrimoine, image, recherche et shooting.'},
{id:'74-evian-palais',dept:'74',departmentName:'Haute-Savoie',city:'Évian-les-Bains',name:'Palais Lumière · Évian',template:'heritage',cat:'culture',lat:46.401,lng:6.589,where:'Évian-les-Bains · Haute-Savoie',text:'Architecture thermale, expositions et clientèle de séjour : terrain de culture, réception et missions.'},
{id:'74-annecy-social',dept:'74',departmentName:'Haute-Savoie',city:'Annecy',name:'Café du lac · Annecy',template:'social',cat:'people',fictional:true,lat:45.899,lng:6.129,where:'Annecy · Haute-Savoie',ambience:'Créatifs, festivaliers, voyageurs et clientèle internationale',text:'Lieu social fictif relié aux événements culturels, aux shootings et aux rencontres de passage.'}
]};
function boot(){const map=window.HCLocalMap,ctx=window.HCTerritoryContext;if(!map||!ctx)return false;const here=ctx.getPresence?.();if(!here)return true;(D[String(here.departmentCode||'')]||[]).forEach(x=>map.addMarker(x));return true}
let n=0;const t=setInterval(()=>{n++;if(boot()||n>30)clearInterval(t)},100);
})();
