/* Haute Couture Live — communauté scolaire : promo, profs et événements persistants */
(function(){
'use strict';
if(window.HCSchoolCommunity)return;
const KEY='haute-couture-school-community-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
const now=()=>new Date().toISOString();
const teachers=[
{id:'claire-delmas',name:'Claire Delmas',role:'Dessin, observation & direction visuelle',style:'Exigeante sur le regard. Elle préfère une observation précise à un dessin spectaculaire mais vide.',focus:['observation','proportions','intention','présentation']},
{id:'samir-bensaid',name:'Samir Bensaïd',role:'Construction, modélisme & contrôle',style:'Calme et rigoureux. Il veut comprendre la logique constructive, les défauts et les corrections.',focus:['construction','essayage','contrôle','faisabilité']},
{id:'anais-vautrin',name:'Anaïs Vautrin',role:'Textile, matière & expérimentation',style:'Elle pousse Marion à documenter les essais et à comparer les résultats plutôt qu’à déclarer trop vite qu’un test est réussi.',focus:['matière','protocole','comparaison','innovation']},
{id:'maud-lefevre',name:'Maud Lefèvre',role:'Culture, recherche & méthode',style:'Elle demande des sources, des liens réels entre références et projet, et refuse les recherches purement décoratives.',focus:['recherche','culture','argumentation','méthode']}
];
const students=[
{id:'lea-morin',name:'Léa Morin',strength:'Coupe précise',fragility:'Se met beaucoup de pression avant les rendus',temper:'fiable, discrète, très présente en atelier'},
{id:'yanis-coste',name:'Yanis Coste',strength:'Volumes audacieux',fragility:'A parfois du mal à finir ce qu’il commence',temper:'énergique, drôle, compétitif sans être hostile'},
{id:'mila-nguyen',name:'Mila Nguyen',strength:'Couleur et narration visuelle',fragility:'Doute beaucoup à l’oral',temper:'curieuse, sensible, généreuse dans ses retours'},
{id:'sacha-bernard',name:'Sacha Bernard',strength:'Recherche documentaire',fragility:'Peut intellectualiser avant de tester',temper:'observateur, calme, exigeant'},
{id:'nora-diallo',name:'Nora Diallo',strength:'Matières et finitions',fragility:'Supporte mal le travail approximatif',temper:'franche, drôle, très loyale'},
{id:'ness-rahmani',name:'Ness Rahmani',strength:'Silhouette et styling',fragility:'Se disperse facilement',temper:'spontanée, sociable, intuitive'},
{id:'theo-marchal',name:'Théo Marchal',strength:'Dessin technique',fragility:'Peut rester trop prudent créativement',temper:'posé, serviable, méthodique'},
{id:'celia-roche',name:'Célia Roche',strength:'Drapé et mouvement',fragility:'Déteste documenter ses étapes',temper:'instinctive, indépendante, chaleureuse'},
{id:'adam-benali',name:'Adam Benali',strength:'Présentation orale',fragility:'Sous-estime parfois la complexité technique',temper:'assuré, sociable, diplomate'},
{id:'zoe-ferrer',name:'Zoé Ferrer',strength:'Motifs et surfaces',fragility:'Peut surcharger ses projets',temper:'enthousiaste, imaginative, un peu chaotique'},
{id:'lucas-vernier',name:'Lucas Vernier',strength:'Construction sobre',fragility:'Prend peu de risques',temper:'réservé, patient, fiable'},
{id:'salome-perez',name:'Salomé Perez',strength:'Recherche matière',fragility:'A du mal à abandonner une piste',temper:'tenace, curieuse, très concentrée'},
{id:'romane-giraud',name:'Romane Giraud',strength:'Image et composition',fragility:'Se compare beaucoup aux autres',temper:'sensible, attentive, parfois anxieuse'},
{id:'ilyes-mansouri',name:'Ilyes Mansouri',strength:'Prototypage rapide',fragility:'Va parfois trop vite sur les contrôles',temper:'pragmatique, direct, enthousiaste'},
{id:'camille-roux',name:'Camille Roux',strength:'Cohérence de collection',fragility:'Peut devenir rigide quand le brief change',temper:'organisée, volontaire, exigeante'},
{id:'elsa-kim',name:'Elsa Kim',strength:'Observation et croquis',fragility:'Parle peu en critique collective',temper:'douce, précise, très attentive'},
{id:'mehdi-laroche',name:'Mehdi Laroche',strength:'Culture mode et références',fragility:'Peut manquer de concret',temper:'bavard, passionné, sociable'},
{id:'jade-ollivier',name:'Jade Ollivier',strength:'Détails et accessoires',fragility:'Travaille parfois trop tard',temper:'inventive, indépendante, loyale'}
];
const eventDefs=[
{id:'coffee-firstweek',minYear:1,minWeek:1,title:'Pause café de promo',duration:30,type:'social',text:'Quelques élèves proposent de prendre un café après les cours. Rien n’est automatique : c’est un premier moment pour observer les dynamiques de la promo.',people:['Léa Morin','Mila Nguyen','Yanis Coste']},
{id:'late-studio-1',minYear:1,minWeek:4,title:'Atelier ouvert en fin de journée',duration:90,type:'atelier',text:'Le studio reste accessible pour avancer sur un rendu, demander un avis ou observer comment d’autres organisent leur travail.',people:['Nora Diallo','Théo Marchal','Célia Roche']},
{id:'critique-corridor',minYear:1,minWeek:8,title:'Avant la critique',duration:20,type:'social',text:'Dans le couloir, chacun relit ses planches. Une discussion courte peut rassurer, agacer ou faire émerger une correction de dernière minute.',people:['Romane Giraud','Adam Benali']},
{id:'guest-talk-y1',minYear:1,minWeek:12,title:'Conférence d’un professionnel invité',duration:75,type:'conference',text:'Un professionnel invité raconte son parcours et ses erreurs. Marion peut en retenir des questions, sans apprendre automatiquement son savoir-faire.',people:[]},
{id:'mutual-help-y1',minYear:1,minWeek:18,title:'Entraide avant rendu',duration:60,type:'social',text:'Une partie de la promo reste pour vérifier présentations, montages et détails. Aider renforce certaines relations mais consomme du temps de jeu.',people:['Léa Morin','Nora Diallo','Ilyes Mansouri']},
{id:'vernissage-y1',minYear:1,minWeek:28,title:'Vernissage de fin d’année',duration:120,type:'event',text:'Les travaux sont montrés à l’école. Marion peut regarder ce que les autres ont choisi d’exposer et mesurer son propre chemin.',people:['Mila Nguyen','Sacha Bernard','Zoé Ferrer']},
{id:'new-groups-y2',minYear:2,minWeek:2,title:'Nouveaux groupes de projet',duration:30,type:'social',text:'Les affinités de première année ne décident pas de tous les groupes. Marion doit travailler avec des personnes qu’elle connaît moins.',people:['Camille Roux','Mehdi Laroche','Elsa Kim']},
{id:'tension-y2',minYear:2,minWeek:10,title:'Désaccord de groupe',duration:45,type:'social',text:'Une divergence apparaît sur une direction de travail. Il faut clarifier responsabilités, arguments et validations au lieu de choisir un gagnant.',people:['Yanis Coste','Salomé Perez']},
{id:'alumni-talk-y2',minYear:2,minWeek:16,title:'Rencontre avec une ancienne élève',duration:60,type:'conference',text:'Une ancienne étudiante parle de ses débuts professionnels, de candidatures refusées et des compétences approfondies après l’école.',people:[]},
{id:'internship-debrief-y2',minYear:2,minWeek:24,title:'Débrief informel des immersions',duration:50,type:'social',text:'La promo compare ses expériences sans transformer les lieux visités en catalogue de secrets. On compare surtout les méthodes et responsabilités.',people:['Théo Marchal','Nora Diallo','Adam Benali']},
{id:'portfolio-night-y3',minYear:3,minWeek:6,title:'Soirée portfolio',duration:90,type:'atelier',text:'Plusieurs élèves travaillent ensemble sur l’ordre de leurs projets. Les retours portent sur la lisibilité, pas sur une identité artificielle.',people:['Sacha Bernard','Romane Giraud','Camille Roux']},
{id:'career-talk-y3',minYear:3,minWeek:18,title:'Conversation sur l’après-école',duration:40,type:'social',text:'Les envies divergent : maison, atelier, freelance, concours, recherche. Marion peut écouter sans devoir choisir immédiatement sa voie.',people:['Léa Morin','Adam Benali','Zoé Ferrer']},
{id:'final-night-y3',minYear:3,minWeek:30,title:'Dernière grande soirée d’atelier',duration:120,type:'atelier',text:'La fin approche. Chacun travaille sur ses priorités. C’est un moment de concentration et d’entraide, sans compte à rebours réel.',people:['Nora Diallo','Mila Nguyen','Ilyes Mansouri','Elsa Kim']}
];
function base(){return{version:1,player:'Marion',relationships:{},events:{},encounters:[],updatedAt:now()}}
function state(){const s=read(KEY,null)||base();s.version=1;s.player='Marion';s.relationships=s.relationships||{};s.events=s.events||{};s.encounters=s.encounters||[];students.forEach(p=>{if(!s.relationships[p.id])s.relationships[p.id]={id:p.id,affinity:0,trust:0,met:false,history:[]}});return s}
function save(s){s.updatedAt=now();return write(KEY,s)}
function academic(){return window.HCSchoolAcademic?.state?.()||read('haute-couture-school-academic-v1',{year:1,week:1,day:1})||{year:1,week:1,day:1}}
function availableEvents(){const a=academic(),s=state();return eventDefs.filter(e=>a.year>e.minYear||(a.year===e.minYear&&a.week>=e.minWeek)).map(e=>({...e,status:s.events[e.id]?.status||'available'}))}
function interact(id,kind='discuter'){const p=students.find(x=>x.id===id);if(!p)return{ok:false};const s=state(),r=s.relationships[id];r.met=true;r.affinity+=kind==='aider'?2:1;if(kind==='aider')r.trust+=1;r.history.unshift({at:now(),text:kind==='aider'?'Marion a pris du temps pour aider sur un travail.':kind==='demander-avis'?'Marion a demandé un avis sur son travail.':'Discussion à l’école.'});r.history=r.history.slice(0,25);save(s);if(window.HCGame?.advanceTime)window.HCGame.advanceTime(kind==='aider'?30:15,'Vie d’école — '+p.name);return{ok:true,relationship:r}}
function attendEvent(id){const e=eventDefs.find(x=>x.id===id),a=academic();if(!e)return{ok:false,reason:'unknown'};if(!(a.year>e.minYear||(a.year===e.minYear&&a.week>=e.minWeek)))return{ok:false,reason:'locked'};const s=state();if(s.events[id]?.status==='done')return{ok:true,already:true};s.events[id]={status:'done',at:now(),year:a.year,week:a.week};(e.people||[]).forEach(name=>{const p=students.find(x=>x.name===name);if(!p)return;const r=s.relationships[p.id];r.met=true;r.affinity+=1;r.history.unshift({at:now(),text:'Moment partagé : '+e.title});r.history=r.history.slice(0,25)});s.encounters.unshift({id:'enc-'+Date.now().toString(36),eventId:id,title:e.title,at:now(),year:a.year,week:a.week});s.encounters=s.encounters.slice(0,80);save(s);if(window.HCGame?.advanceTime)window.HCGame.advanceTime(e.duration,'Vie d’école — '+e.title);if(window.HCSchoolLearningMemory?.addResearch&&e.type==='conference')window.HCSchoolLearningMemory.addResearch({year:a.year,type:'rencontre',title:e.title,text:'Notes personnelles de Marion à compléter après cette rencontre.',source:'school-community',tags:['école','rencontre']});return{ok:true}}
function teacherView(name){const t=teachers.find(x=>x.name===name||x.id===name);if(!t)return null;const mem=window.HCSchoolLearningMemory?.state?.().teacherMemory?.[t.name]||null;return{...t,memory:mem}}
window.HCSchoolCommunity={version:1,state,save,teachers,students,events:eventDefs,availableEvents,interact,attendEvent,teacherView,storageKey:KEY};
})();
