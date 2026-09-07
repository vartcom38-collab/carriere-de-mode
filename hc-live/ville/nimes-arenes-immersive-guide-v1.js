/* Haute Couture Live — Arènes de Nîmes : guide immersif long v1
   Contenu original synthétisé à partir de sources officielles publiques. Aucun texte source n'est reproduit.
*/
(function(){
'use strict';
if(window.HCNimesArenesImmersiveGuideV1)return;
const PLACE={
 id:'nimes-arenes',title:'Arènes de Nîmes',city:'Nîmes',territory:'Gard · Occitanie',level:'major',estimatedMinutes:35,
 hero:'https://images.pexels.com/photos/356844/pexels-photo-356844.jpeg?auto=compress&cs=tinysrgb&w=1400',
 intro:'Tu ne viens pas seulement voir un monument romain. Tu vas comprendre comment il a été conçu, comment des milliers de spectateurs y circulaient, pourquoi il a survécu, comment il a été transformé en forteresse puis en quartier habité, et pourquoi on le restaure encore aujourd’hui.',
 chapters:[
  {id:'context',title:'1 · Nemausus et le besoin d’un amphithéâtre',minutes:5,kind:'history',text:'À la fin de l’Antiquité romaine, Nemausus est une ville importante de Gaule narbonnaise. Un amphithéâtre est un équipement de spectacle mais aussi un marqueur urbain et politique : sa capacité, son implantation et son organisation parlent autant de la ville que des jeux qui s’y déroulent.',observe:['Repérer l’ellipse générale','Comparer la masse du monument à la ville actuelle','Comprendre qu’un amphithéâtre est pensé pour gérer une foule immense']},
  {id:'construction',title:'2 · Du plan à la pierre',minutes:7,kind:'architecture',text:'Le monument mesure environ 133 mètres de long pour 101 mètres de large et atteint 21 mètres de haut. Sa façade extérieure compte deux niveaux d’arcades répartis en 60 travées. Les pierres provenaient notamment des carrières de Barutel et de Roquemaillère. La force du projet tient au rapport entre une enveloppe monumentale et un réseau intérieur de galeries, voûtes, escaliers et circulations.',observe:['Rythme des arcades','Répétition des travées','Alternance plein / vide','Pierre et ombre'],vocabulary:['travée','voûte','galerie','cavea','arena']},
  {id:'crowd',title:'3 · Faire entrer plus de 20 000 personnes',minutes:5,kind:'society',text:'L’architecture est aussi une machine à organiser les flux. Les galeries voûtées et escaliers rayonnants permettent de gagner rapidement les gradins. Dans l’Antiquité, plus de 20 000 spectateurs pouvaient prendre place, avec une répartition liée au rang social. La visibilité sur la piste est au cœur de la conception.',observe:['Chercher les trajectoires possibles','Imaginer plusieurs milliers de personnes entrant en même temps','Relier organisation spatiale et hiérarchie sociale']},
  {id:'spectacle',title:'4 · Le spectacle et la société',minutes:4,kind:'culture',text:'Les spectacles ne sont pas un simple divertissement isolé : ils appartiennent à une culture publique, à des pratiques de représentation politique et à un système social. Le lieu permet aussi d’étudier la façon dont l’Empire romain met en scène la foule, le pouvoir, la compétition et la visibilité.',observe:['Distinguer ce qui relève de l’architecture et ce qui relève de l’usage','Éviter les clichés cinématographiques faciles','Se demander ce que le monument impose au regard']},
  {id:'middleages',title:'5 · Quand l’amphithéâtre devient forteresse',minutes:4,kind:'timeline',text:'À partir du VIe siècle, le monument est transformé en forteresse. Des arcades sont murées et des pouvoirs locaux s’y installent. Cette occupation continue joue un rôle essentiel dans sa survie : le monument n’est pas abandonné puis redécouvert d’un bloc, il change de fonction.',observe:['Imaginer les arcades fermées','Comprendre qu’un monument survit parfois parce qu’il est réutilisé','Comparer “préserver” et “transformer”']},
  {id:'neighbourhood',title:'6 · Un quartier entier dans les Arènes',minutes:4,kind:'urban',text:'Après la fin de la fonction militaire, des maisons, ateliers et entrepôts occupent l’édifice. Le quartier des Arènes perdure jusqu’au début du XIXe siècle. La Ville acquiert progressivement des constructions à la fin du XVIIIe siècle ; au début du XIXe, les maisons sont supprimées et le monument est dégagé puis restauré.',observe:['Imaginer des rues et des maisons dans l’enceinte','Comprendre la notion de restauration comme choix historique','Comparer monument “habité” et monument “patrimonialisé”']},
  {id:'restoration',title:'7 · Restaurer sans effacer 2 000 ans',minutes:4,kind:'conservation',text:'Les campagnes de restauration se poursuivent encore. L’eau de pluie, la disparition de certains gradins et les perturbations des anciens systèmes d’évacuation fragilisent le monument. Depuis 2009, la restauration est accompagnée d’études archéologiques détaillées. Des fouilles sous l’arène ont également révélé les traces d’une construction antérieure mêlant pierre et bois.',observe:['Repérer les différences de pierre','Comprendre qu’une restauration produit aussi de nouvelles connaissances','Se demander ce que signifie “authentique” sur un monument transformé pendant vingt siècles']},
  {id:'fashion-eye',title:'8 · Regarder comme une créatrice',minutes:3,kind:'fashion',text:'Seulement maintenant, tu peux traduire ce que tu as réellement observé : rythme vertical des arcades, répétition, alternance lumière/ombre, structure pleine/creuse, circulation, hiérarchie des niveaux, pierre chaude, géométrie et monumentalité. Une référence n’est pas une image à copier : c’est un principe à transformer.',observe:['Choisir un principe plutôt qu’un motif décoratif','Formuler une intention de silhouette','Identifier une palette sans la considérer comme obligatoire']}
 ],
 timeline:[
  ['Fin Ier siècle / début IIe siècle','Construction de l’amphithéâtre romain dans Nemausus.'],
  ['VIe siècle','Transformation progressive en forteresse.'],
  ['Moyen Âge','Installation de pouvoirs et d’habitants dans l’édifice.'],
  ['XVIIIe–début XIXe siècles','Acquisition puis suppression progressive des maisons occupant les Arènes.'],
  ['XIXe siècle','Grandes campagnes de dégagement et de restauration ; retour progressif à la fonction de spectacle.'],
  ['Depuis 2009','Nouvelle campagne de restauration accompagnée d’études archéologiques.'],
  ['2026 et après','Poursuite programmée de la restauration des travées et protection du monument.']
 ],
 unlocks:[
  {id:'arena-arcade-rhythm',type:'atelier-reference',label:'Principe · rythme d’arcades',meta:{family:'construction',tags:['répétition','verticalité','plein-vide']}},
  {id:'arena-stone-shadow',type:'palette',label:'Palette · pierre chaude et ombre',meta:{colors:['ivoire minéral','ocre clair','ombre graphite']}},
  {id:'arena-layered-circulation',type:'silhouette-reference',label:'Principe · niveaux et circulation',meta:{tags:['strates','passages','structure']}},
  {id:'arena-book-memory',type:'book',label:'Visite documentée · Arènes de Nîmes'}
 ],
 connections:{
  atelier:['Référence architecture : rythme, plein/vide, verticalité','Palette pierre/ombre','Principe de silhouette en niveaux'],
  school:['Réutilisable en culture mode, méthode, dessin, construction et projet de recherche'],
  career:['Peut nourrir une commande locale, une collection territoriale ou une discussion de positionnement'],
  book:['Trace de visite documentée et observations choisies'],
  characters:['Guide culturel, archéologue, restauratrice, photographe ou habitué peuvent être reliés plus tard'],
  phone:['Photo/notes de visite et éventuelle invitation culturelle'],
  publicImage:['Contenu Ateliergram seulement si la joueuse choisit de publier une trace'],
  future:['Circuit Romanité Nîmes','Pont du Gard','Camargue et architecture territoriale']
 },
 sources:[
  {label:'Ville de Nîmes — Les Arènes de Nîmes',url:'https://www.nimes.fr/que-faire-a-nimes/patrimoine/les-monuments-romains/les-arenes-de-nimes'},
  {label:'Ville de Nîmes — Restauration des Arènes',url:'https://www.nimes.fr/ma-ville/les-grands-projets/restauration-des-arenes'},
  {label:'Webdocumentaire officiel — Les Arènes de Nîmes',url:'https://arenes-webdoc.nimes.fr/'},
  {label:'Site officiel des Arènes de Nîmes',url:'https://www.arenes-nimes.com/'}
 ]
};
function register(){window.HCTerritorialGuides=window.HCTerritorialGuides||{};window.HCTerritorialGuides[PLACE.id]=PLACE;window.dispatchEvent(new CustomEvent('hc-territorial-guide-register',{detail:PLACE}))}
register();
window.HCNimesArenesImmersiveGuideV1={version:1,place:PLACE};
})();
