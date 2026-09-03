/* Haute Couture Live — profils pédagogiques différenciés. Le cursus enseigne des familles et méthodes, jamais le catalogue complet du monde. */
(function(){
'use strict';
if(window.HCSchoolSpecialties)return;
const SCHOOL='haute-couture-school-choice-v1';
const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??f}catch(_){return f}};
const school=()=>read(SCHOOL,null);
const commonCore={
 label:'Socle commun',
 modules:['Observation et intention','Dessin de silhouette','Lecture d’une matière','Construction de base','Culture mode et recherche'],
 rule:'Le socle commun apprend à observer, comprendre et fabriquer. Il ne révèle pas toutes les matières, tous les motifs, toutes les techniques ni tous les savoir-faire existants.'
};
const profiles={
 'ifm-paris':{
  label:'Création expérimentale · corps · matière',
  identity:'Une formation jeu très orientée recherche créative, volume, corps, matière, expérimentation et développement d’une écriture personnelle.',
  year1:['Corps et proportions','Recherche visuelle','Volume et moulage','Matière comme outil de création','Construction fondamentale','Dessin et communication'],
  year2:['Développement de silhouette','Expérimentation de surfaces','Volumes plus complexes','Projet collectif','Recherche de collection','Approche critique du design'],
  year3:['Direction créative','Collection personnelle','Développement technique','Présentation de collection','Portfolio et professionnalisation'],
  motifFocus:['motif construit à partir d’une recherche graphique','répétition et rythme','surface expérimentale'],
  materialExposure:['quelques familles textiles de base','échantillonnage raisonné','comportement et transformation de surface'],
  notAutomatic:['catalogue textile mondial','techniques artisanales régionales','savoir-faire de maisons','motifs traditionnels du monde','matières rares'],
  discoveryStyle:'L’école apprend à expérimenter. Les savoir-faire précis et traditions particulières restent à rencontrer dans le monde.'
 },
 'duperre-paris':{
  label:'Recherche plastique · couleur · matière · volume',
  identity:'Une formation jeu où la recherche plastique, la couleur, le vêtement, l’accessoire et la matière prennent une place forte.',
  year1:['Recherche plastique','Couleur et composition','Volume porté','Culture visuelle','Techniques fondamentales','Matières et surfaces'],
  year2:['Développement de motifs','Impression et surface selon projets','Accessoire et vêtement','Volume expérimental','Projet éditorial','Recherche personnelle'],
  year3:['Projet de diplôme','Collection ou proposition d’auteur','Image et narration','Portfolio','Présentation et jury'],
  motifFocus:['motif dessiné','composition colorée','motif placé','recherche de surface'],
  materialExposure:['familles de fibres courantes','supports d’impression sélectionnés','matières adaptées aux projets étudiés'],
  notAutomatic:['tous les procédés d’impression','tous les motifs patrimoniaux','toutes les broderies','tous les textiles du monde','savoir-faire non rencontrés'],
  discoveryStyle:'L’école ouvre fortement la recherche visuelle, mais chaque technique précise reste une découverte à part entière.'
 },
 'esmod-lyon':{
  label:'Stylisme · construction · développement de collection',
  identity:'Une formation jeu plus structurée autour de la silhouette, du stylisme, du patronnage, du moulage et du développement progressif de collections.',
  year1:['Illustration de mode','Silhouette et proportions','Patronnage fondamental','Montage','Matières usuelles','Premiers dossiers de style'],
  year2:['Transformations de patron','Moulage','Développement de collection','Détails et finitions','Projet de spécialisation','Culture professionnelle'],
  year3:['Collection personnelle','Plan de collection','Prototype','Dossier professionnel','Portfolio','Présentation finale'],
  motifFocus:['rayure et placement','motifs graphiques simples','coordination motif-silhouette'],
  materialExposure:['tissus de base utiles au patronnage','matières adaptées aux exercices de collection','quelques textiles régionaux rencontrés par projet'],
  notAutomatic:['motifs complexes non enseignés','savoir-faire haute couture','textiles rares','techniques territoriales','matières découvertes en voyage'],
  discoveryStyle:'La formation donne une base solide de construction, mais les spécialités et matières rares restent à découvrir.'
 },
 'esmod-bordeaux':{
  label:'Silhouette · collection · image',
  identity:'Une version jeu ESMOD orientée construction, collection et développement d’une identité visuelle liée aux projets.',
  year1:['Illustration','Patronnage','Montage','Couleur','Matières courantes','Recherche de silhouette'],
  year2:['Moulage','Collection capsule','Motifs appliqués au vêtement','Développement technique','Projet collectif','Image de collection'],
  year3:['Collection finale','Plan de collection','Prototype','Portfolio','Présentation','Professionnalisation'],
  motifFocus:['motif placé','coordination couleur-motif','motif appliqué à une capsule'],
  materialExposure:['textiles usuels de construction','matières sélectionnées selon brief','échantillons liés aux projets'],
  notAutomatic:['catalogue global de matières','techniques artisanales inconnues','motifs patrimoniaux','dentelles spécialisées','matières rares'],
  discoveryStyle:'Le choix de matière reste lié aux projets étudiés ; le reste du monde textile reste ouvert.'
 },
 'esmod-rennes':{
  label:'Construction · détail · collection',
  identity:'Une version jeu ESMOD avec attention particulière à la construction, aux détails et à la cohérence d’une collection.',
  year1:['Dessin','Patronnage','Montage','Détails de vêtement','Matières de base','Culture mode'],
  year2:['Moulage','Transformations','Collection capsule','Détails fonctionnels','Projet couleur','Recherche personnelle'],
  year3:['Collection finale','Prototype','Dossier technique','Portfolio','Présentation','Insertion professionnelle'],
  motifFocus:['micro-motifs','motifs répétitifs simples','rapport motif-détail'],
  materialExposure:['tissus courants de coupe à plat','matières de poids variés','supports sélectionnés pour les exercices'],
  notAutomatic:['motifs du monde non étudiés','techniques de broderie spécialisées','textiles rares','savoir-faire haute couture','matières de voyage'],
  discoveryStyle:'On apprend à construire avec précision sans épuiser les possibilités de matières et d’ornement.'
 },
 'esmod-roubaix':{
  label:'Textile · construction · territoire',
  identity:'Une version jeu ESMOD qui peut davantage exploiter le contexte textile du territoire, sans prétendre enseigner tout le patrimoine textile local ou mondial.',
  year1:['Illustration','Patronnage','Montage','Introduction textile','Silhouette','Culture de l’industrie textile'],
  year2:['Moulage','Développement de collection','Projet textile','Motif et surface','Construction avancée','Visite ou recherche territoriale'],
  year3:['Collection personnelle','Sourcing raisonné','Prototype','Portfolio','Présentation','Professionnalisation'],
  motifFocus:['motif textile simple','répétition','surface liée au tissage ou à l’impression selon projet'],
  materialExposure:['familles textiles courantes','quelques constructions de tissu','sélection locale rencontrée dans des projets'],
  notAutomatic:['toutes les archives textiles','toutes les armures','tous les motifs régionaux','toutes les techniques industrielles','matières rares internationales'],
  discoveryStyle:'Le territoire donne des occasions de découverte, mais rien n’est automatiquement connu parce qu’on étudie à Roubaix.'
 }
};
function current(){const s=school();return profiles[s?.id]||profiles['esmod-lyon']}
function canTeach(topic){const p=current();const hay=[...(p.year1||[]),...(p.year2||[]),...(p.year3||[]),...(p.motifFocus||[]),...(p.materialExposure||[])].join(' ').toLowerCase();return hay.includes(String(topic||'').toLowerCase())}
function publicView(){const p=current();return{label:p.label,identity:p.identity,years:{1:p.year1,2:p.year2,3:p.year3},motifFocus:p.motifFocus,materialExposure:p.materialExposure,discoveryStyle:p.discoveryStyle,commonCore}}
window.HCSchoolSpecialties={version:1,profiles,current,publicView,canTeach,school,commonCore};
})();