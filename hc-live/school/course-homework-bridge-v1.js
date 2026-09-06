/* Haute Couture Live — pont cours -> devoirs v1 */
(function(){
'use strict';
if(window.HCCourseHomeworkBridgeV1)return;
if(!/\/school-course\/?$/i.test(location.pathname))return;
const id=new URLSearchParams(location.search).get('id')||'';
const supported=['w1-welcome','w1-drawing','w1-textile','w1-pattern','w1-drape','w1-culture','w1-assembly'];
if(!supported.includes(id)){window.HCCourseHomeworkBridgeV1={active:false};return}
const FLOW='haute-couture-real-classroom-flow-v1:'+id, PRACT='haute-couture-course-practical-v1:'+id, ACADEMIC='haute-couture-school-academic-v1';
const practicalRequired=['w1-textile','w1-pattern','w1-drape','w1-assembly'].includes(id);
const lengths={'w1-welcome':3,'w1-drawing':3,'w1-textile':4,'w1-pattern':4,'w1-drape':4,'w1-culture':3,'w1-assembly':4};
const teachers={'w1-welcome':'Maud Lefèvre','w1-drawing':'Claire Delmas','w1-textile':'Inès Vautrin','w1-pattern':'Samir Bensaïd','w1-drape':'Samir Bensaïd','w1-culture':'Maud Lefèvre','w1-assembly':'Samir Bensaïd'};
function parse(k,f){try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}}
function courseDone(){return Number(parse(FLOW,{phase:0}).phase||0)>=lengths[id]}
function practicalDone(){return !practicalRequired||!!parse(PRACT,{done:false}).done}
function homework(){return window.HCRealCoursePedagogy?.get?.(id)?.homework||null}
function academicState(){return parse(ACADEMIC,null)}
function already(){const s=academicState();return !!s?.assignments?.['homework-'+id]}
function create(){if(!courseDone()||!practicalDone()||already()||!window.HCSchoolAcademic?.assign)return false;const brief=homework();if(!brief)return false;window.HCSchoolAcademic.assign({id:'homework-'+id,title:'À faire après le cours',courseId:id,brief,teacher:teachers[id],dueDay:(window.HCSchoolAcademic.state()?.day||1)+2,rubric:{mode:'qualitative',origin:'course-homework',criteria:['réutiliser la notion vue en cours','montrer une observation ou un essai','expliquer une décision']}});show();return true}
function show(){if(document.querySelector('.hchw-toast'))return;const d=document.createElement('div');d.className='hchw-toast';d.innerHTML='<b>Nouveau travail à faire</b><span>Le devoir donné par le professeur a été ajouté à ton suivi scolaire.</span>';document.body.appendChild(d);setTimeout(()=>d.classList.add('show'),40);setTimeout(()=>{d.classList.remove('show');setTimeout(()=>d.remove(),250)},4200)}
const st=document.createElement('style');st.textContent='.hchw-toast{position:fixed;z-index:2147483950;right:24px;bottom:24px;width:min(360px,calc(100vw - 32px));padding:15px 17px;border-radius:17px;background:#fff8f1;color:#342620;box-shadow:0 20px 60px rgba(25,15,12,.28);border:1px solid rgba(90,58,47,.14);opacity:0;transform:translateY(12px);transition:.22s}.hchw-toast.show{opacity:1;transform:none}.hchw-toast b{display:block;font:18px/1.1 Georgia,serif;font-weight:400;margin-bottom:5px}.hchw-toast span{font:12px/1.45 Georgia,serif;color:#756159}';document.head.appendChild(st);
let n=0;const timer=setInterval(()=>{n++;if(create()||already()||n>180)clearInterval(timer)},700);setTimeout(create,500);window.HCCourseHomeworkBridgeV1={active:true,id,create,courseDone,practicalDone};
})();