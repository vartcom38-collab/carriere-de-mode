/* Haute Couture Live — références professionnelles pour les cours existants v1
   Cette couche ne remplace PAS le programme du jeu. Elle documente les cours déjà définis
   avec des repères issus de programmes publics d'écoles/musées et de pratiques générales du métier.
   Aucun cours propriétaire n'est reproduit.
*/
(function(){
'use strict';
if(window.HCCourseProfessionalReferenceV1)return;
const refs={
 'w1-welcome':{
  subject:'Méthode de création',
  principle:'Recherche documentée → observation → expérimentation → intention → développement',
  professionalAnchors:['recherche iconographique','documentation des sources','expérimentation 2D/3D','verbalisation d’une intention'],
  sources:[
   {label:'IFM · BA Fashion Design — Bachelor 1 Construire & Ouvrir',url:'https://www.ifmparis.fr/fr/programmes/diplomant-certifiant-qualifiant/bachelor-fashion-design',note:'Recherche iconographique, matière, volume, dessin, expérimentation et fondamentaux techniques.'}
  ]
 },
 'w1-drawing':{
  subject:'Dessin & observation',
  principle:'Geste et structure avant détail ; le dessin sert à analyser et communiquer le vêtement.',
  professionalAnchors:['ligne d’action','appui et équilibre','masses','proportion','silhouette','vêtement par volumes'],
  sources:[
   {label:'IFM · BA Fashion Design — Bachelor 1',url:'https://www.ifmparis.fr/fr/programmes/diplomant-certifiant-qualifiant/bachelor-fashion-design',note:'Pratiquer le dessin, libérer la main et exercer le regard.'}
  ]
 },
 'w1-textile':{
  subject:'Textile & matière',
  principle:'Identifier une matière par sa structure et son comportement avant de décider son usage.',
  professionalAnchors:['fibre → fil → étoffe','tissé / maille','identification','structure','tombé','poids','surface','usage'],
  sources:[
   {label:'FIT · TS 131 Textile Principles for the Fashion Designer',url:'https://catalog.fitnyc.edu/undergraduate/courses/ts/',note:'Fibres, fils, formation des étoffes, couleur, impressions, produits finis et identification en laboratoire.'},
   {label:'V&A Academy · Textiles: Materials, Techniques & History',url:'https://www.vam.ac.uk/event/x87xqaAmX7a/o25069-textiles-materials-techniques-history',note:'Matériaux, techniques et histoire textile à partir des collections du musée.'},
   {label:'IFM · Bachelor Modéliste Concepteur',url:'https://www.ifmparis.fr/fr/programmes/diplomant-certifiant-qualifiant/bachelor-modeliste-concepteur',note:'Technologie des tissus intégrée à la formation du modéliste.'}
  ]
 },
 'w1-pattern':{
  subject:'Modélisme · coupe à plat',
  principle:'Le patron est une traduction contrôlée du volume : mesures, aisance, lignes fonctionnelles, toile, essayage et correction.',
  professionalAnchors:['sloper / base','mesure corps vs vêtement','aisance','pince','droit-fil','crans','essayage','correction'],
  sources:[
   {label:'IFM · Programme Intensif en Modélisme et Stylisme',url:'https://www.ifmparis.fr/fr/programmes/diplomant-certifiant-qualifiant/programme-intensif-en-modelisme-et-stylisme',note:'Patronage, transformation des bases et maintien du lien essentiel avec la 3D.'},
   {label:'FIT · PM 121 Patternmaking I',url:'https://catalog.fitnyc.edu/undergraduate/courses/pm/',note:'Bases corps, mesures standard, manches, cols, patrons papier, échantillon tissu, fit et balance.'},
   {label:'FIT · FD 121 Flat Pattern Design I',url:'https://catalog.fitnyc.edu/undergraduate/courses/fd/',note:'Transformation de bases par slash-and-spread et pivot, évaluation sur mannequin.'}
  ]
 },
 'w1-drape':{
  subject:'Moulage',
  principle:'Construire et lire le volume directement sur mannequin avec toile, épingles, équilibre, proportion et forme.',
  professionalAnchors:['mannequin','toile','ancrage','tension','équilibre','proportion','forme','transfert vers patron'],
  sources:[
   {label:'IFM · Programme Intensif en Modélisme et Stylisme',url:'https://www.ifmparis.fr/fr/programmes/diplomant-certifiant-qualifiant/programme-intensif-en-modelisme-et-stylisme',note:'Moulage du tailleur au flou, de la théorie aux projets personnels.'},
   {label:'FIT · FD 117 Introduction to Draping',url:'https://catalog.fitnyc.edu/search/?P=FD+117',note:'Manipulation de la toile sur mannequin, proportion, équilibre et forme.'},
   {label:'FIT · Draping for Fashion Design',url:'https://continuinged.fitnyc.edu/search/publicCourseSearchDetails.do?courseId=1053846&method=load&selectedProgramAreaId=1025466&selectedProgramStreamId=1026971',note:'Épinglage et mise en forme de la toile sur dress form avec matériel professionnel.'}
  ]
 },
 'w1-culture':{
  subject:'Culture mode & références',
  principle:'Une référence utile est située, documentée et analysée ; elle ne sert pas de simple image d’ambiance.',
  professionalAnchors:['source','contexte','date','auteur / maison','fonction','silhouette','construction','matière','citation'],
  sources:[
   {label:'The Met · Heilbrunn Timeline of Art History',url:'https://www.metmuseum.org/fr/essays/timeline-of-art-history',note:'Ressource de recherche et d’enseignement basée sur les collections du Met.'},
   {label:'The Met · Costume Institute — essais mode',url:'https://www.metmuseum.org/fr/essays/charles-frederick-worth-1825-1895-and-the-house-of-worth',note:'Exemple de source contextualisée pour analyser une maison, une période et ses vêtements.'}
  ]
 },
 'w1-assembly':{
  subject:'Montage & construction',
  principle:'L’ordre opératoire protège l’accessibilité, la précision et les finitions ; coupe, couture, pressage et contrôle forment une seule chaîne.',
  professionalAnchors:['ordre opératoire','ligne de couture','valeur de couture','accessibilité','pressage','entoilage','finition','contrôle'],
  sources:[
   {label:'IFM · Programme Intensif en Modélisme et Stylisme',url:'https://www.ifmparis.fr/fr/programmes/diplomant-certifiant-qualifiant/programme-intensif-en-modelisme-et-stylisme',note:'Montage, finitions main et machine et choix de finitions adaptées.'},
   {label:'FIT · FD 133 Materials and Construction I',url:'https://catalog.fitnyc.edu/undergraduate/courses/fd/',note:'Coupe, construction, finitions, cotons, lainages et entoilages appliqués aux prototypes.'},
   {label:'FIT · FD 231 Haute Couture Sewing Techniques',url:'https://catalog.fitnyc.edu/undergraduate/courses/fd/',note:'Coupe, points main, coutures, ourlets, poches, pressage et finitions de niveau couture.'}
  ]
 }
};
function get(id){return refs[id]||null}
window.HCCourseProfessionalReferenceV1={version:1,refs,get};
})();