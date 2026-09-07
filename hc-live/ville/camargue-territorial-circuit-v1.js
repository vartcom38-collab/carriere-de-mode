/* Haute Couture Live — Camargue : grand circuit territorial immersif v1
   Contenu original synthétisé à partir de sources publiques officielles et touristiques institutionnelles.
   Le circuit est progressif : chaque étape nourrit d'autres systèmes sans transformer le territoire en simple récompense.
*/
(function(){
'use strict';
if(window.HCCamargueTerritorialCircuitV1)return;
const CIRCUIT={
 id:'camargue-grand-circuit-v1',title:'Grand circuit de Camargue',territory:'Camargue · delta du Rhône · Occitanie / Provence',estimatedMinutes:150,level:'territory-major',
 intro:'Tu ne visites pas un seul lieu : tu traverses un territoire façonné par l’eau douce, la mer, le sel, les vents, les usages humains et une biodiversité exceptionnelle. Le circuit se construit étape par étape. Certaines références, personnes et possibilités n’apparaissent qu’après avoir réellement parcouru les étapes concernées.',
 stages:[
  {id:'delta',title:'1 · Comprendre le delta',minutes:18,kind:'landscape',text:'La Camargue est un delta presque plat, formé par le Rhône et soumis à l’influence de la Méditerranée. L’absence de relief renforce la sensation d’horizon continu. L’eau douce, l’eau salée, la quantité de sel et la topographie déterminent fortement la répartition des milieux naturels et des activités humaines.',observe:['Repérer l’horizon presque sans relief','Comparer eau douce, eau saumâtre et eau salée','Observer comment les digues, canaux et chemins structurent le paysage'],unlocks:['camargue-horizon','camargue-water-strata']},
  {id:'mosaics',title:'2 · Marais, lagunes, sansouïres, roselières',minutes:20,kind:'biodiversity',text:'La Camargue ne se résume pas à “un marais”. C’est une mosaïque de milieux : dunes, lagunes, sansouïres, marais, roselières, pelouses et zones agricoles. Les espèces présentes changent selon l’eau, le sel, la saison et les usages humains.',observe:['Distinguer plusieurs textures de végétation','Repérer la place du roseau','Observer les transitions plutôt que chercher des frontières nettes'],vocabulary:['sansouïre','lagune','roselière','eau saumâtre'],unlocks:['camargue-texture-library']},
  {id:'birds',title:'3 · Les oiseaux et le flamant rose',minutes:18,kind:'fauna',text:'La Camargue est un site majeur pour les oiseaux. Le flamant rose est emblématique, mais il fait partie d’un système écologique beaucoup plus large. Sa reproduction en Camargue est aussi liée à une histoire récente de gestion des milieux, avec la création d’un îlot de nidification au XXe siècle et une collaboration entre gestionnaires et scientifiques.',observe:['Observer la relation entre profondeur d’eau et présence d’oiseaux','Repérer les silhouettes longues, les courbes de cou et les regroupements','Comprendre que la couleur rose dépend de l’alimentation'],unlocks:['camargue-bird-lines','camargue-pink-salt-palette']},
  {id:'horses-bulls',title:'4 · Chevaux, taureaux et élevage extensif',minutes:18,kind:'culture',text:'Les chevaux blancs et les taureaux noirs ne sont pas seulement des images de carte postale. Ils sont liés à l’élevage extensif, aux manades, aux pratiques des gardians et à une culture territoriale vivante. L’animal, le paysage et le travail humain sont imbriqués.',observe:['Observer les contrastes blanc/noir dans le paysage','Regarder la posture du cavalier et la relation au troupeau','Distinguer tradition vécue et simple mise en scène touristique'],unlocks:['camargue-contrast-palette','camargue-riding-lines']},
  {id:'cabins',title:'5 · Pourquoi les cabanes de gardians sont faites ainsi',minutes:20,kind:'architecture',text:'Le territoire offre peu de pierre locale et peu de grands arbres utilisables pour la charpente. Les habitants ont donc longtemps composé avec des matériaux disponibles : terre, petits bois et roseau. La cabane traditionnelle, basse et couverte de sagne, est une réponse concrète au milieu, au coût des matériaux et au climat. Elle fut l’habitat ou l’abri de populations modestes : gardians, pêcheurs, saliniers, bergers ou ouvriers agricoles.',observe:['Repérer la forme basse','Observer la toiture de sagne','Comprendre que la forme vient d’une contrainte réelle de matériaux et de vent','Noter la relation entre technique vernaculaire et paysage'],vocabulary:['sagne','manon','travette','cabane de gardian'],unlocks:['camargue-thatch-texture','camargue-low-profile-structure']},
  {id:'cross',title:'6 · La Croix de Camargue',minutes:16,kind:'symbol',text:'La Croix de Camargue est créée au début du XXe siècle et inaugurée en 1926. Elle associe plusieurs éléments symboliques : croix/trident, cœur et ancre ou barque selon les interprétations et usages locaux. Au-delà de l’objet décoratif, elle est devenue un signe d’appartenance et de mémoire territoriale, très présent dans les fêtes, les mas et les représentations de la Camargue.',observe:['Distinguer les trois éléments graphiques','Comprendre comment un symbole récent peut devenir emblématique','Éviter de l’utiliser comme motif gratuit sans connaître son histoire'],unlocks:['camargue-cross-reference']},
  {id:'salt',title:'7 · Salins, tables saunantes et paysage du sel',minutes:18,kind:'industry-nature',text:'Dans la partie laguno-marine, le sel structure à la fois l’écologie et des activités humaines anciennes. Les salins transforment les lagunes en bassins successifs de concentration. Les couleurs peuvent varier fortement selon la salinité, les micro-organismes, la lumière et la saison.',observe:['Comparer blanc, rose, gris et bleu selon les bassins','Repérer les lignes très horizontales des tables saunantes','Observer le contraste entre géométrie humaine et milieu naturel'],unlocks:['camargue-salt-palette','camargue-horizontal-panels']},
  {id:'humans',title:'8 · Vivre et travailler dans un territoire fragile',minutes:18,kind:'society',text:'La Camargue est habitée et travaillée : élevage, riziculture, saliculture, pêche, tourisme, protection de la nature. Ces activités ne sont pas séparées du paysage : elles le modèlent, le protègent parfois et peuvent aussi le mettre sous pression. Le territoire permet de comprendre qu’un patrimoine naturel est aussi un espace social et économique.',observe:['Repérer les traces d’activité humaine dans le paysage','Comparer usages productifs et protection des milieux','Se demander qui entretient réellement ce territoire'],unlocks:['camargue-human-landscape-memory']},
  {id:'fashion-eye',title:'9 · Traduire la Camargue sans la caricaturer',minutes:20,kind:'fashion',text:'À ce stade seulement, tu peux transformer ce que tu as réellement observé : horizon, roseau, sel, lumière, eau, contrastes animal/paysage, formes basses des cabanes, rythmes des clôtures, silhouettes des oiseaux. L’objectif n’est pas de fabriquer une “collection flamant rose”, mais de choisir des principes précis et défendables.',observe:['Choisir un principe de ligne','Choisir une texture','Choisir une palette','Formuler ce que tu refuses de caricaturer'],unlocks:['camargue-territorial-signature']}
 ],
 unlocks:[
  {id:'camargue-horizon',type:'atelier-reference',label:'Principe · horizon continu',meta:{tags:['horizontalité','étendue','calme']}},
  {id:'camargue-water-strata',type:'silhouette-reference',label:'Principe · strates d’eau et de terrain',meta:{tags:['couches','transparence','superposition']}},
  {id:'camargue-texture-library',type:'atelier-reference',label:'Bibliothèque · textures de milieux camarguais',meta:{tags:['roseau','sansouïre','dune','marais']}},
  {id:'camargue-bird-lines',type:'drawing-reference',label:'Référence · lignes d’oiseaux',meta:{tags:['courbe','équilibre','élancement']}},
  {id:'camargue-pink-salt-palette',type:'palette',label:'Palette · rose salin et eau saumâtre',meta:{colors:['rose salin','gris eau','ivoire lumineux']}},
  {id:'camargue-contrast-palette',type:'palette',label:'Palette · blanc cheval / noir taureau',meta:{colors:['blanc chaud','noir profond','terre grise']}},
  {id:'camargue-thatch-texture',type:'material-reference',label:'Texture · sagne et roseau',meta:{tags:['fibre','verticalité','matière sèche']}},
  {id:'camargue-low-profile-structure',type:'construction-reference',label:'Principe · structure basse et protectrice',meta:{tags:['forme basse','vent','abri']}},
  {id:'camargue-cross-reference',type:'culture-reference',label:'Référence culturelle · Croix de Camargue'},
  {id:'camargue-salt-palette',type:'palette',label:'Palette · sel, lagune et lumière',meta:{colors:['blanc sel','rose minéral','bleu gris']}},
  {id:'camargue-horizontal-panels',type:'construction-reference',label:'Principe · panneaux horizontaux',meta:{tags:['tables saunantes','géométrie','plans']}},
  {id:'camargue-human-landscape-memory',type:'book',label:'Carnet · paysage vécu et travaillé'},
  {id:'camargue-territorial-signature',type:'project-reference',label:'Dossier de recherche · Camargue'}
 ],
 connections:{
  atelier:['Palettes Camargue','Références roseau/sagne','Lignes d’oiseaux','Horizontalité des salins','Principes de strates et d’abri'],
  school:['Sortie de culture / textile / dessin / projet territorial','Réutilisable dans un dossier de recherche et une critique de références'],
  career:['Peut nourrir une commande régionale, une collaboration photo, un projet éditorial ou une spécialisation territoire/matière'],
  book:['Carnet de circuit, observations choisies, dossier Camargue'],
  characters:['Gardian·e, naturaliste, artisan·e du roseau, salinier·e, photographe, éleveur·se, guide ou chercheur·se peuvent être rencontrés progressivement'],
  phone:['Invitations de visite, messages de contacts locaux, photos du circuit si la joueuse choisit de les garder'],
  publicImage:['Ateliergram seulement sur décision de la joueuse ; pas de publication automatique'],
  future:['Saintes-Maries-de-la-Mer','Salin-de-Giraud','Aigues-Mortes','Marais du Vigueirat','Pont du Gard / grands circuits Occitanie']
 },
 sources:[
  {label:'Parc naturel régional de Camargue — Le territoire',url:'https://www.parc-camargue.fr/le-parc-territoire.html'},
  {label:'Parc naturel régional de Camargue — Une mosaïque de milieux',url:'https://www.parc-camargue.fr/une-mosaique-de-milieux.html'},
  {label:'Parc naturel régional de Camargue — Oiseaux de Camargue',url:'https://www.parc-camargue.fr/oiseaux-camargue.html'},
  {label:'Parc naturel régional de Camargue — Patrimoine bâti',url:'https://www.parc-camargue.fr/patrimoine-bati.html'},
  {label:'Office de tourisme des Saintes-Maries-de-la-Mer — Cabane de gardian',url:'https://www.saintesmaries.com/la-cabane-de-gardian'},
  {label:'Saintes-Maries-de-la-Mer — histoire de la Croix de Camargue',url:'https://www.saintesmaries.com/annuaire/exposition-des-oeuvres-d-esteban'}
 ]
};
function register(){window.HCTerritorialCircuits=window.HCTerritorialCircuits||{};window.HCTerritorialCircuits[CIRCUIT.id]=CIRCUIT;window.dispatchEvent(new CustomEvent('hc-territorial-circuit-register',{detail:CIRCUIT}))}
register();
window.HCCamargueTerritorialCircuitV1={version:1,circuit:CIRCUIT};
})();