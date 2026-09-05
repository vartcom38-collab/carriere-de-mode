/* Haute Couture Live — scènes jouables de vie scolaire : conférences, expos, sorties et soirées de rendu. */
(function(){
'use strict';
if(window.HCSchoolEventScenes)return;
const KEY='haute-couture-school-event-scenes-v1';
const COMMUNITY_KEY='haute-couture-school-community-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
const now=()=>new Date().toISOString();
function base(){return{version:1,scenes:{},history:[],updatedAt:now()}}
function state(){const s=read(KEY,null)||base();s.version=1;s.scenes=s.scenes||{};s.history=s.history||[];return s}
function save(s){s.updatedAt=now();return write(KEY,s)}
function academic(){return window.HCSchoolAcademic?.state?.()||read('haute-couture-school-academic-v1',{year:1,week:1,day:1})||{year:1,week:1,day:1}}
function community(){return window.HCSchoolCommunity||null}
function students(){return community()?.students||[]}
function events(){return community()?.events||[]}
function eventStatus(id){return community()?.availableEvents?.().find(e=>e.id===id)||null}
function mutateRelation(id,a=0,t=0,text=''){const c=community();if(!c||!id)return;const cs=c.state(),r=cs.relationships[id];if(!r)return;r.met=true;r.affinity+=a;r.trust+=t;if(text){r.history.unshift({at:now(),text});r.history=r.history.slice(0,25)}c.save(cs)}
function personByName(name){return students().find(p=>p.name===name)||null}
function sceneType(e){if(e.type==='conference')return'conference';if(e.type==='atelier')return'atelier';if(/vernissage|expo/i.test(e.title))return'expo';if(/soirée|nuit|rendu/i.test(e.title))return'render-night';return'social'}
const beats={
 conference:{intro:'La salle se remplit. L’intervenant parle autant de ses erreurs que de ses réussites. Marion n’a pas besoin de tout retenir : elle choisit ce qu’elle veut réellement creuser.',choices:[
  {id:'method',label:'Noter une méthode de travail',effect:'research',note:'Marion retient une méthode ou une façon d’organiser le travail, sans transformer la conférence en savoir-faire acquis automatiquement.'},
  {id:'question',label:'Poser une question précise',effect:'confidence',note:'Marion formule une question liée à une difficulté concrète de son parcours.'},
  {id:'observe',label:'Écouter sans intervenir',effect:'observe',note:'Marion écoute et trie ce qui lui semble utile sans se forcer à parler.'}
 ]},
 expo:{intro:'Les travaux sont visibles côte à côte. Ce qui frappe n’est pas seulement le niveau : ce sont les choix, les écarts et les manières différentes de résoudre un même problème.',choices:[
  {id:'compare',label:'Comparer deux démarches',effect:'research',note:'Marion compare deux manières de construire une réponse sans chercher un classement.'},
  {id:'talk',label:'Discuter avec un camarade',effect:'relation',note:'Marion demande à un camarade ce qu’il a changé entre recherche et rendu final.'},
  {id:'alone',label:'Faire le tour seule',effect:'observe',note:'Marion prend le temps de regarder sans transformer l’exposition en networking obligatoire.'}
 ]},
 'render-night':{intro:'La fatigue est là, mais l’ambiance est concentrée. Certains parlent beaucoup, d’autres travaillent en silence. Marion doit choisir où placer son temps avant le rendu.',choices:[
  {id:'help',label:'Aider quelqu’un sur un point précis',effect:'relation',note:'Marion aide sur un point concret sans prendre en charge le projet d’un autre.'},
  {id:'focus',label:'Protéger mon temps de travail',effect:'focus',note:'Marion reste concentrée sur son propre rendu et pose une limite claire.'},
  {id:'review',label:'Faire une critique croisée de 20 min',effect:'research',note:'Marion échange un retour rapide et demande une critique sur son propre travail.'}
 ]},
 atelier:{intro:'L’école reste ouverte plus longtemps. Les tables sont occupées, les prototypes sortent, les discussions deviennent plus directes à mesure que le rendu approche.',choices:[
  {id:'test',label:'Profiter du temps pour tester',effect:'research',note:'Marion utilise le moment pour vérifier une hypothèse au lieu de simplement avancer plus vite.'},
  {id:'peer',label:'Demander un avis ciblé',effect:'relation',note:'Marion sollicite un regard précis, pas une validation générale.'},
  {id:'work',label:'Travailler en silence',effect:'focus',note:'Marion avance sans transformer chaque soirée d’atelier en événement social.'}
 ]},
 social:{intro:'Ce moment existe surtout pour faire respirer la vie d’école. Les discussions ne débouchent pas forcément sur une opportunité : parfois elles servent simplement à mieux connaître la promo.',choices:[
  {id:'open',label:'Parler avec quelqu’un que je connais peu',effect:'relation',note:'Marion élargit doucement son cercle sans obtenir de récompense automatique.'},
  {id:'close',label:'Rester avec mes proches',effect:'relation',note:'Marion renforce une relation déjà existante.'},
  {id:'leave',label:'Partir plus tôt',effect:'boundary',note:'Marion quitte le moment quand elle en a envie, sans sanction sociale automatique.'}
 ]}
};
function ensureScene(eventId){const e=events().find(x=>x.id===eventId);if(!e)return null;const s=state();if(s.scenes[eventId])return s.scenes[eventId];const type=sceneType(e),people=(e.people||[]).map(personByName).filter(Boolean),scene={id:eventId,eventId,type,title:e.title,text:e.text,people:people.map(p=>p.id),status:'ready',choice:null,outcome:null,createdAt:now()};s.scenes[eventId]=scene;save(s);return scene}
function availableScenes(){return (community()?.availableEvents?.()||[]).filter(e=>e.status!=='done').map(e=>({...e,scene:ensureScene(e.id)}))}
function choose(eventId,choiceId){const e=events().find(x=>x.id===eventId),s=state(),scene=s.scenes[eventId]||ensureScene(eventId);if(!e||!scene||scene.status==='complete')return scene;const beat=beats[scene.type]||beats.social,choice=beat.choices.find(c=>c.id===choiceId);if(!choice)return scene;const people=scene.people.map(id=>students().find(p=>p.id===id)).filter(Boolean);let outcome=choice.note;
 if(choice.effect==='relation'&&people.length){const target=people[0];mutateRelation(target.id,2,1,`Moment partagé pendant : ${e.title}`);outcome+=` ${target.name} se souviendra de ce moment.`}
 if(choice.effect==='research'&&window.HCSchoolLearningMemory?.addResearch){window.HCSchoolLearningMemory.addResearch({year:academic().year,type:'sortie-école',title:e.title,text:choice.note,source:'school-event-scene',tags:['école',scene.type,choice.id]})}
 scene.choice=choiceId;scene.outcome=outcome;scene.status='complete';scene.completedAt=now();s.history.unshift({eventId,title:e.title,type:scene.type,choice:choiceId,outcome,at:now(),year:academic().year,week:academic().week});s.history=s.history.slice(0,100);save(s);
 const ce=community();if(ce){const cs=ce.state();cs.events[eventId]={status:'done',at:now(),year:academic().year,week:academic().week,sceneChoice:choiceId};ce.save(cs)}
 window.HCGame?.advanceTime?.(e.duration||60,'Vie d’école — '+e.title);render();return scene}
function render(){const host=document.querySelector('#app')||document.querySelector('main')||document.body;if(!host||document.getElementById('hc-school-event-scenes'))return;const list=availableScenes().slice(0,3);if(!list.length)return;const root=document.createElement('section');root.id='hc-school-event-scenes';root.className='card';root.innerHTML=`<div class="hcse-eye">SCÈNES D’ÉCOLE</div><h2>Moments à vivre</h2><p class="hcse-lead">Les événements ne donnent pas automatiquement une compétence ou un contact. Marion choisit ce qu’elle fait réellement sur place, et le jeu garde la trace de ce qu’elle en retire.</p><div class="hcse-grid">${list.map(e=>{const sc=e.scene,b=beats[sc.type]||beats.social,people=sc.people.map(id=>students().find(p=>p.id===id)?.name).filter(Boolean);return `<article class="hcse-card"><div class="hcse-type">${sc.type.replace('-', ' ')}</div><h3>${e.title}</h3><p>${b.intro}</p>${people.length?`<div class="hcse-people">Présents : ${people.join(' · ')}</div>`:''}<div class="hcse-actions">${b.choices.map(c=>`<button data-scene="${e.id}" data-choice="${c.id}">${c.label}</button>`).join('')}</div></article>`}).join('')}</div>`;
 const st=document.createElement('style');st.textContent=`#hc-school-event-scenes{margin:18px 0;padding:20px;border:1px solid #dccfc5;background:linear-gradient(180deg,#fffdfb,#f8f1eb);border-radius:18px}.hcse-eye,.hcse-type{font:900 9px Arial,sans-serif;letter-spacing:.14em;color:#956c57;text-transform:uppercase}.hcse-lead{font:13px/1.6 Georgia,serif;color:#6d5f56}.hcse-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;margin-top:14px}.hcse-card{border:1px solid #eadfd6;background:#fff;border-radius:15px;padding:14px}.hcse-card h3{font:19px Georgia,serif;margin:5px 0 8px}.hcse-card p{font:12px/1.55 Georgia,serif;color:#74645a}.hcse-people{font:10px/1.4 Arial,sans-serif;font-weight:800;color:#7c6b61;margin:9px 0}.hcse-actions{display:grid;gap:6px;margin-top:10px}.hcse-actions button{border:1px solid #d8cabf;background:#f8f1eb;border-radius:10px;padding:10px;text-align:left;font-size:10px;font-weight:900;cursor:pointer}.hcse-actions button:hover{background:#efe4da}@media(max-width:650px){.hcse-grid{grid-template-columns:1fr}}`;document.head.appendChild(st);host.appendChild(root);root.addEventListener('click',ev=>{const b=ev.target.closest('button[data-scene]');if(!b)return;choose(b.dataset.scene,b.dataset.choice);root.remove();render()})}
function mount(){if(!community())return setTimeout(mount,60);render()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,0));else setTimeout(mount,0);
window.HCSchoolEventScenes={version:1,state,availableScenes,ensureScene,choose,render,mount,storageKey:KEY};
})();
