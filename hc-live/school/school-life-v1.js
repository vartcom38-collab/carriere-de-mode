/* Haute Couture Live — vie scolaire v1. Adaptation gameplay inspirée des axes pédagogiques officiels des écoles, pas reproduction d'un emploi du temps réel. */
(function(){
'use strict';
if(window.HCSchoolLife)return;
const K='haute-couture-school-life-v1',SCHOOL='haute-couture-school-choice-v1';
const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??f}catch(_){return f}},write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
const uid=p=>p+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);
const school=()=>read(SCHOOL,null);
const family=()=>{const id=school()?.id||'';if(id.startsWith('ifm-'))return'ifm';if(id.startsWith('duperre-'))return'duperre';return'esmod'};
const people={
 teachers:[
  {id:'prof-claire',name:'Claire Delmas',role:'Dessin & observation',note:'Personnage fictif du jeu. Exigeante sur le regard, jamais sur le style.'},
  {id:'prof-samir',name:'Samir Bensaïd',role:'Construction du vêtement',note:'Personnage fictif du jeu. Très précis sur vocabulaire, aplomb et logique de patron.'},
  {id:'prof-ines',name:'Inès Vautrin',role:'Textiles & matière',note:'Personnage fictif du jeu. Fait toucher, plier, froisser et comparer avant de nommer.'},
  {id:'prof-maud',name:'Maud Lefèvre',role:'Culture mode & recherche',note:'Personnage fictif du jeu. Refuse les moodboards purement décoratifs.'}
 ],
 students:[
  {id:'lea',name:'Léa Morin',trait:'très graphique',affinity:4},
  {id:'yanis',name:'Yanis Coste',trait:'obsédé par le tailoring',affinity:2},
  {id:'mila',name:'Mila Nguyen',trait:'forte en matière et couleur',affinity:5},
  {id:'sacha',name:'Sacha Bernard',trait:'discret, excellent observateur',affinity:1},
  {id:'nora',name:'Nora Diallo',trait:'très conceptuelle',affinity:3}
 ]
};
const courses=[
 {id:'w1-welcome',day:1,time:'09:00',duration:90,teacher:'Maud Lefèvre',title:'Entrer en école : regarder avant de créer',category:'Méthode',prereq:[],skills:{observation:2,culture:1},
  intro:'Un premier cours de méthode. Le but n’est pas de produire une belle silhouette tout de suite, mais d’apprendre à distinguer observation, référence, intention et solution.',
  lesson:[
   ['Observer n’est pas collectionner','Une référence utile répond à une question. Note ce qui t’intéresse : ligne, volume, rythme, matière, usage, contraste, geste, époque ou attitude. Une image choisie seulement parce qu’elle est “jolie” n’explique rien.'],
   ['Décrire avant de juger','Avant “j’aime / je n’aime pas”, décris : proportions, points d’appui, zones de tension, longueur, densité visuelle, rapport au corps, répétitions et ruptures.'],
   ['Construire une intention','Une intention de design tient en une phrase active : “allonger le torse par une ligne continue”, “faire flotter la matière autour du corps”, “contraster une structure rigide et une surface fragile”.']
  ],exercise:'Choisis un objet banal autour de toi. Écris 5 observations factuelles puis 1 intention de vêtement inspirée de cet objet, sans dessiner encore.',quiz:{q:'Laquelle est une observation exploitable ?',a:['Cette robe est magnifique','Le volume s’éloigne du corps à partir de la taille','J’adore le beige'],correct:1}},
 {id:'w1-drawing',day:1,time:'14:00',duration:150,teacher:'Claire Delmas',title:'Dessin de mode I — proportion, axe, attitude',category:'Dessin',prereq:['w1-welcome'],skills:{drawing:3,observation:2},
  intro:'Le dessin n’est pas un test de “talent”. Il sert à voir, comparer et communiquer. On travaille l’axe, le poids du corps et la proportion avant les détails.',
  lesson:[
   ['Ligne d’action','Repère une ligne principale qui traverse la pose. Elle donne direction et énergie avant même de dessiner les contours.'],
   ['Répartition du poids','Dans une pose debout, vérifie quelle jambe porte réellement le poids. Le bassin, les épaules et les appuis réagissent à cette contrainte.'],
   ['Proportions de mode','Une figure de mode peut être allongée, mais les déformations doivent rester cohérentes. L’objectif est d’exprimer la silhouette du vêtement, pas de masquer les problèmes de construction.'],
   ['Vêtement avant décoration','Commence par masse, longueur, largeur et ligne extérieure. Les boutons, bijoux et textures viennent après.']
  ],exercise:'Fais 6 silhouettes de 2 minutes : uniquement axe, épaules, bassin, appuis et contour général. Choisis ensuite la plus lisible et ajoute le vêtement en 5 lignes maximum.',quiz:{q:'Que faut-il poser en premier dans une esquisse rapide ?',a:['Les boutons','La ligne d’action et les masses','Le motif du tissu'],correct:1}},
 {id:'w1-textile',day:2,time:'09:00',duration:180,teacher:'Inès Vautrin',title:'Matières I — chaîne, trame, main et tombé',category:'Textile',prereq:['w1-welcome'],skills:{textile:4,observation:1},
  intro:'Un vêtement dépend autant de la matière que du dessin. On apprend à décrire un textile avant de décider ce qu’on en fera.',
  lesson:[
   ['Chaîne et trame','Dans un tissu tissé, la chaîne suit généralement la longueur et la trame la largeur. Leur comportement influence stabilité, déformation et coupe.'],
   ['Droit-fil','Le droit-fil indique l’orientation du patron sur le tissu. Le modifier change le comportement de la pièce et peut provoquer torsions ou effets recherchés.'],
   ['Main','La “main” est la sensation du textile : sec, nerveux, souple, compact, duveteux, glissant, craquant… Le vocabulaire tactile aide à anticiper le volume.'],
   ['Tombé','Le tombé décrit la manière dont la matière chute et réagit à la gravité. Deux tissus de même couleur peuvent produire des silhouettes totalement différentes.']
  ],exercise:'Sans chercher de nom de tissu, compare 3 matières que tu peux toucher aujourd’hui. Pour chacune : poids relatif, souplesse, surface, élasticité, tombé et usage possible.',quiz:{q:'Pourquoi le droit-fil est-il important ?',a:['Parce qu’il détermine seulement la couleur','Parce qu’il influence le comportement et l’aplomb de la pièce','Parce qu’il remplace les valeurs de couture'],correct:1}},
 {id:'w1-pattern',day:2,time:'14:00',duration:180,teacher:'Samir Bensaïd',title:'Construction I — patron, aisance et pince',category:'Modélisme',prereq:['w1-textile'],skills:{pattern:4,construction:2},
  intro:'Premier contact avec la logique 2D du vêtement. On ne cherche pas encore une pièce complexe : on comprend comment une surface plane devient volume.',
  lesson:[
   ['Patron de base','Un patron de base représente une géométrie de départ ajustée à des mesures et à une quantité d’aisance définie. Il sert de structure à transformer.'],
   ['Aisance','L’aisance de confort permet au corps de respirer et bouger. L’aisance de style ajoute volontairement du volume pour obtenir une silhouette.'],
   ['Pince','Une pince retire de la matière en 2D pour épouser un volume 3D. Elle peut être déplacée sans perdre sa fonction volumique si son point de pivot reste cohérent.'],
   ['Cran et repère','Les repères servent au montage et à la correspondance des pièces. Un patron lisible communique autant qu’il mesure.']
  ],exercise:'Sur papier, dessine un rectangle représentant un corsage très simplifié. Indique milieu devant, ligne de taille, droit-fil et imagine où une pince pourrait absorber du volume.',quiz:{q:'Une pince sert principalement à…',a:['Créer du volume en contrôlant un excès de surface','Décorer un patron','Indiquer la couleur du tissu'],correct:0}},
 {id:'w1-drape',day:3,time:'09:30',duration:210,teacher:'Samir Bensaïd',title:'Volume I — moulage sur mannequin',category:'Moulage',prereq:['w1-pattern'],skills:{draping:4,construction:2},
  intro:'On passe de la logique 2D au volume directement sur mannequin. Le but est de sentir où la matière veut tomber, se tendre ou se plier.',
  lesson:[
   ['Toile et préparation','Une toile de travail permet d’explorer sans engager le tissu final. Marque droit-fil et lignes de référence avant de manipuler.'],
   ['Point d’ancrage','Fixe peu de points au départ. Trop d’épingles empêchent de voir le comportement naturel de la matière.'],
   ['Excès de matière','L’excès peut devenir pince, pli, fronce, découpe ou volume volontaire. La décision dépend de l’intention.'],
   ['Lecture en 360°','Un vêtement n’existe pas seulement de face. Vérifie profil, dos, équilibre des masses et continuité des lignes.']
  ],exercise:'Prends un morceau de tissu, foulard ou papier souple. Pose-le sur un volume (coussin, mannequin si disponible, dossier de chaise) et crée 3 volumes différents uniquement par pliage et fixation.',quiz:{q:'Pourquoi limiter les points d’ancrage au début ?',a:['Pour laisser apparaître le comportement naturel de la matière','Parce que les épingles changent la couleur','Pour éviter de regarder le dos'],correct:0}},
 {id:'w1-culture',day:4,time:'10:00',duration:150,teacher:'Maud Lefèvre',title:'Culture mode I — référence, contexte et citation',category:'Culture',prereq:['w1-welcome'],skills:{culture:4,research:3},
  intro:'Connaître une image ne suffit pas. Une référence devient intéressante quand on comprend son contexte et qu’on sait la transformer plutôt que la recopier.',
  lesson:[
   ['Contexte','Demande qui a produit l’objet, pour qui, dans quel moment historique, avec quelles techniques et quelles normes sociales.'],
   ['Forme et signification','Une même forme peut avoir des sens différents selon époque, usage et groupe social.'],
   ['Citation vs copie','Citer implique transformation et prise de position. Copier conserve la solution d’origine sans nouvelle question.'],
   ['Archive personnelle','Garde sources, dates, mots-clés et raison du choix. Une archive bien renseignée devient un outil de travail, pas un dossier d’images.']
  ],exercise:'Pars dans ta ville sans destination imposée. Trouve un détail architectural, un vêtement aperçu, une matière ou un objet. Note-le sans chercher à savoir immédiatement “à quoi ça sert” pour ton projet. Reviens avec 3 observations.',quiz:{q:'Qu’est-ce qui rend une référence réellement utile ?',a:['Le nombre de likes de l’image','Le contexte + la raison précise pour laquelle elle répond à une recherche','Le fait qu’elle soit tendance'],correct:1}},
 {id:'w1-assembly',day:4,time:'14:30',duration:180,teacher:'Samir Bensaïd',title:'Montage I — ordre d’assemblage et précision',category:'Montage',prereq:['w1-pattern'],skills:{construction:4,precision:2},
  intro:'Le montage est une suite logique. Une bonne idée peut être ruinée par un ordre d’assemblage mal pensé ou des repères imprécis.',
  lesson:[
   ['Valeur de couture','La valeur de couture est ajoutée autour de la ligne d’assemblage selon la méthode choisie. Elle doit être cohérente et identifiable.'],
   ['Ordre opératoire','Avant de coudre, imagine les étapes : quelles coutures doivent rester accessibles ? quelles finitions doivent être faites avant fermeture ?'],
   ['Presser n’est pas repasser','Le pressage accompagne la construction : ouvrir, coucher ou former une couture au bon moment améliore netteté et volume.'],
   ['Contrôle','Mesure, crans, symétrie, raccords et aplomb sont contrôlés au fur et à mesure, pas seulement à la fin.']
  ],exercise:'Écris un ordre d’assemblage possible pour une jupe simple composée d’un devant, d’un dos, d’une ceinture et d’une fermeture. Tu n’as pas besoin de connaître la solution parfaite : justifie ton ordre.',quiz:{q:'Quand faut-il contrôler les raccords et l’aplomb ?',a:['Seulement après la pièce finie','Tout au long du montage','Jamais si le patron est bon'],correct:1}},
 {id:'w1-project',day:5,time:'09:00',duration:300,teacher:'Claire Delmas',title:'Projet 01 — Une silhouette à partir d’une observation',category:'Projet',prereq:['w1-drawing','w1-textile','w1-pattern','w1-drape','w1-culture','w1-assembly'],skills:{creative:5,drawing:2,research:2},
  intro:'Premier mini-projet. Il ne juge pas ton “style définitif”. Il vérifie si tu sais observer, choisir, transformer et expliquer.',
  lesson:[
   ['Brief','Pars d’une observation réelle faite cette semaine. Évite les thèmes trop vastes comme “la nature” ou “Paris”.'],
   ['Traduction','Transforme l’observation en 3 décisions minimum : proportion, volume, matière, ligne, répétition, ouverture, fermeture ou couleur.'],
   ['Variantes','Produis plusieurs propositions avant de choisir. Une première idée n’est pas une conclusion.'],
   ['Critique','Présente l’intention, les essais abandonnés, la proposition retenue et ce qui reste fragile. La critique sert à continuer le travail.']
  ],exercise:'Réalise 3 mini-silhouettes différentes à partir d’une seule observation collectée en ville. Pour chacune, écris une phrase expliquant la transformation opérée.',quiz:{q:'Quel est le meilleur signe qu’une recherche a été réellement transformée ?',a:['La silhouette ressemble exactement à l’image source','On peut expliquer les décisions de design dérivées de l’observation','Le moodboard contient beaucoup d’images'],correct:1}}
];
function baseState(){return{version:1,week:1,semester:1,enrolledAt:new Date().toISOString(),completed:{},scores:{},notes:{},skills:{observation:0,culture:0,drawing:0,textile:0,pattern:0,construction:0,draping:0,research:0,precision:0,creative:0},relationships:Object.fromEntries(people.students.map(p=>[p.id,{affinity:p.affinity,met:false}])),campus:{orientation:false,library:false,textileLab:false,workshop:false,cafeteria:false},discoveries:[],project01:null}}
function state(){let s=read(K,null);if(!s||s.version!==1)s=baseState();return s}function save(s){return write(K,s)}
function isUnlocked(c,s=state()){return c.prereq.every(id=>!!s.completed[id])}
function completeCourse(id,answer,exerciseText=''){const c=courses.find(x=>x.id===id);if(!c)return{ok:false,reason:'missing'};const s=state();if(!isUnlocked(c,s))return{ok:false,reason:'locked'};const correct=Number(answer)===c.quiz.correct;const score=correct?100:70;s.completed[id]={at:new Date().toISOString(),exercise:String(exerciseText||'').slice(0,3000),quizCorrect:correct};s.scores[id]=score;for(const [k,v] of Object.entries(c.skills||{}))s.skills[k]=(s.skills[k]||0)+v;if(id==='w1-culture')s.discoveries.push({id:uid('field'),type:'open-fieldwork',title:'Observation libre en ville',status:'active'});if(id==='w1-project')s.project01={status:'completed',score,completedAt:new Date().toISOString()};save(s);window.dispatchEvent(new CustomEvent('hc-school-life',{detail:{type:'course-completed',courseId:id,score}}));return{ok:true,score,correct}}
function meet(id){const s=state();if(s.relationships[id]){s.relationships[id].met=true;s.relationships[id].affinity+=1;save(s)}return s}
function visit(place){const s=state();if(place in s.campus)s.campus[place]=true;save(s);return s}
function progress(s=state()){const done=courses.filter(c=>s.completed[c.id]).length;return{done,total:courses.length,pct:Math.round(done/courses.length*100)}}
function profile(){const f=family();if(f==='ifm')return{label:'Construire & Ouvrir',description:'Version jeu inspirée du Bachelor 1 de l’IFM : corps, matière, dessin, modélisme, montage, volume et expérimentation.'};if(f==='duperre')return{label:'Recherche · matière · volume',description:'Version jeu inspirée de l’approche DN MADE Mode : expérimentation plastique, technique, matière, couleur, vêtement et accessoire.'};return{label:'Fashion Design · construction',description:'Version jeu inspirée des fondamentaux ESMOD : illustration, culture mode, développement créatif, patronnage et moulage.'}}
window.HCSchoolLife={version:1,courses,people,state,save,isUnlocked,completeCourse,meet,visit,progress,profile,school,family};
})();