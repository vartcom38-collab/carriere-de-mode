/* Haute Couture Live — système académique v1 : rythme joueur, devoirs, notes, absences, matériel, planning. */
(function(){
'use strict';
if(window.HCSchoolAcademic)return;
const KEY='haute-couture-school-academic-v1';
const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
const base=()=>({version:1,year:1,semester:1,week:1,day:1,dayClosed:false,attendance:{},assignments:{},grades:[],materials:{owned:[],needed:['Carnet de croquis A4','Crayons HB / 2B / 4B','Gomme mie de pain','Règle 30 cm','Mètre ruban','Ciseaux papier','Épingles','Toile de coton pour exercices']},scheduleMode:'player-paced',history:[],yearCompletions:{},promotionReady:false});
function state(){const s=read(KEY,null);if(!s||s.version!==1)return base();if(!s.yearCompletions)s.yearCompletions={};if(typeof s.promotionReady!=='boolean')s.promotionReady=false;return s}
function save(s){return write(KEY,s)}
function markAttendance(courseId,status='present'){const s=state();s.attendance[courseId]={status,at:new Date().toISOString(),gameDay:s.day,year:s.year};save(s);return s}
function assign(a){const s=state();const id=a.id||'assignment-'+Date.now().toString(36);s.assignments[id]={id,title:a.title||'Devoir',courseId:a.courseId||null,brief:a.brief||'',status:'assigned',assignedDay:s.day,dueDay:a.dueDay||s.day+2,submission:null,feedback:null,grade:null,year:s.year};save(s);return s.assignments[id]}
function submit(id,payload){const s=state(),a=s.assignments[id];if(!a)return null;a.status='submitted';a.submission={text:String(payload?.text||'').slice(0,6000),assetKey:payload?.assetKey||null,submittedAt:new Date().toISOString(),gameDay:s.day,year:s.year};save(s);return a}
function grade(id,value,feedback=''){const s=state(),a=s.assignments[id];if(!a)return null;a.status='graded';a.grade=Math.max(0,Math.min(20,Number(value)||0));a.feedback=String(feedback||'').slice(0,3000);s.grades.unshift({id:'grade-'+Date.now().toString(36),assignmentId:id,title:a.title,value:a.grade,outOf:20,at:new Date().toISOString(),gameDay:s.day,year:s.year});save(s);return a}
function ownMaterial(name){const s=state();if(!s.materials.owned.includes(name))s.materials.owned.push(name);save(s);return s}
function endDay(){const s=state();s.dayClosed=true;s.history.push({type:'end-day',day:s.day,year:s.year,at:new Date().toISOString()});save(s);if(window.HCGame?.endDay)window.HCGame.endDay();return s}
function startNextDay(){const s=state();if(!s.dayClosed)return{ok:false,reason:'current-day-not-closed'};if(s.promotionReady)return{ok:false,reason:'year-promotion-pending'};s.day+=1;s.dayClosed=false;s.history.push({type:'start-day',day:s.day,year:s.year,at:new Date().toISOString()});if((s.day-1)%5===0)s.week+=1;save(s);return{ok:true,state:s}}
function completeYear(year,payload={}){const s=state();year=Number(year)||s.year;if(s.year!==year)return{ok:false,reason:'wrong-current-year'};if(s.yearCompletions[year])return{ok:true,already:true,state:s};s.yearCompletions[year]={year,completedAt:new Date().toISOString(),gameDay:s.day,juryScore:payload.juryScore??null,portfolioKey:payload.portfolioKey||null,reflection:payload.reflection||null};s.promotionReady=true;s.dayClosed=true;s.history.push({type:'complete-year',year,day:s.day,at:new Date().toISOString()});save(s);return{ok:true,state:s}}
function startNextYear(){const s=state();if(!s.promotionReady||!s.yearCompletions[s.year])return{ok:false,reason:'year-not-completed'};s.year+=1;s.semester=1;s.week=1;s.day=1;s.dayClosed=false;s.promotionReady=false;s.history.push({type:'start-year',year:s.year,day:1,at:new Date().toISOString()});save(s);return{ok:true,state:s}}
function canAdvance(){return state().dayClosed}
function overview(){const s=state(),assignments=Object.values(s.assignments);return{year:s.year,semester:s.semester,week:s.week,day:s.day,dayClosed:s.dayClosed,promotionReady:s.promotionReady,yearCompletions:s.yearCompletions,assigned:assignments.filter(a=>a.status==='assigned').length,submitted:assignments.filter(a=>a.status==='submitted').length,graded:assignments.filter(a=>a.status==='graded').length,average:s.grades.length?Math.round((s.grades.reduce((n,g)=>n+g.value,0)/s.grades.length)*10)/10:null,materials:s.materials}}
window.HCSchoolAcademic={version:1,state,save,markAttendance,assign,submit,grade,ownMaterial,endDay,startNextDay,completeYear,startNextYear,canAdvance,overview};
})();
