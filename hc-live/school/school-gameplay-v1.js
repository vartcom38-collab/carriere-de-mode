/* Haute Couture Live — gameplay scolaire intégré v1 */
(function(){
'use strict';
if(window.HCSchoolGameplay)return;
const PENDING='haute-couture-school-pending-time-v1',DRAW='haute-couture-drawing-practice-v1';
const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??f}catch(_){return f}},write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const homeworkRules={
'w1-drawing':{id:'hw-drawing-gesture',title:'Carnet — gestes et silhouettes',brief:'Réalise au minimum les exercices Libérer la main et Ligne d’action dans l’atelier dessin. Garde tes essais, même imparfaits.',dueOffset:2,kind:'drawing'},
'w1-textile':{id:'hw-textile-observe',title:'Échantillons du quotidien',brief:'Observe trois matières réellement accessibles autour de toi. Décris poids, surface, souplesse, élasticité et tombé sans chercher à leur donner immédiatement un nom précis.',dueOffset:2,kind:'fieldwork'},
'w1-culture':{id:'hw-city-observation',title:'Carnet de terrain',brief:'Pars librement en ville et rapporte trois observations : un détail, une matière, une silhouette ou un objet. Le lieu et la découverte ne sont volontairement pas imposés.',dueOffset:2,kind:'fieldwork'},
'w1-project':{id:'hw-project01-refine',title:'Reprise du Projet 01',brief:'Après le cours, reprends une de tes trois propositions. Note ce que tu conserverais, modifierais et testerais ensuite.',dueOffset:3,kind:'project'}
};
function academic(){return window.HCSchoolAcademic||null}function life(){return window.HCSchoolLife||null}function course(id){return life()?.courses?.find(c=>c.id===id)||null}function courseYear(c){return Number(c?.year||1)}
function ensureHomework(courseId){const A=academic(),rule=homeworkRules[courseId];if(!A||!rule)return null;const s=A.state();if(s.assignments[rule.id])return s.assignments[rule.id];return A.assign({id:rule.id,title:rule.title,courseId,brief:rule.brief,dueDay:s.day+rule.dueOffset,kind:rule.kind,year:s.year})}
function attend(courseId){const A=academic();if(!A)return;const s=A.state();if(!s.attendance[courseId])A.markAttendance(courseId,'present')}
function consumeCourseTime(courseId){const c=course(courseId);if(!c)return;const key='course:'+courseId,done=read(PENDING,{});if(done[key])return;done[key]={minutes:Number(c.duration)||0,at:new Date().toISOString(),year:courseYear(c)};write(PENDING,done);const run=()=>{if(window.HCGame?.advanceTime){window.HCGame.advanceTime(Number(c.duration)||0,'École — '+c.title);return true}return false};if(!run()){let tries=0;const t=setInterval(()=>{tries++;if(run()||tries>30)clearInterval(t)},150)}}
function complete(courseId){attend(courseId);ensureHomework(courseId);consumeCourseTime(courseId)}
function drawingStatus(){const d=read(DRAW,{});return{gesture:!!d.gesture,axis:!!d.axis,proportion:!!d.proportion,weight:!!d.weight,silhouette:!!d.silhouette,fabric:!!d.fabric,count:Object.keys(d).length}}
function submitDrawingHomework(){const A=academic();if(!A)return{ok:false};const s=A.state(),a=s.assignments['hw-drawing-gesture'];if(!a)return{ok:false,reason:'not-assigned'};const d=drawingStatus();if(!d.gesture||!d.axis)return{ok:false,reason:'drawing-incomplete'};A.submit(a.id,{text:'Exercices au stylet enregistrés : Libérer la main + Ligne d’action.',assetKey:DRAW});return{ok:true}}
function dayChecklist(){const A=academic(),L=life();if(!A||!L)return null;const a=A.state(),l=L.state();const todays=L.courses.filter(c=>courseYear(c)===Number(a.year)&&Number(c.day)===Number(a.day));const done=todays.filter(c=>l.completed[c.id]),missing=todays.filter(c=>!l.completed[c.id]);const due=Object.values(a.assignments).filter(x=>(!x.year||Number(x.year)===Number(a.year))&&x.dueDay<=a.day&&x.status==='assigned');return{year:a.year,courses:todays.length,done:done.length,missing,due,canClose:missing.length===0}}
function closeDay(){const A=academic();if(!A)return{ok:false,reason:'academic-unavailable'};const c=dayChecklist();if(c&&!c.canClose)return{ok:false,reason:'courses-not-finished',missing:c.missing};A.endDay();return{ok:true}}
window.addEventListener('hc-school-life',e=>{if(e.detail?.type==='course-completed')complete(e.detail.courseId)});
window.HCSchoolGameplay={version:1,homeworkRules,complete,ensureHomework,attend,consumeCourseTime,drawingStatus,submitDrawingHomework,dayChecklist,closeDay};
})();