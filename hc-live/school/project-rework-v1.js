/* Haute Couture Live — reprise de projet et dossier de progression v1 */
(function(){
'use strict';
if(window.HCSchoolProjectRework)return;
const KEY='haute-couture-school-project-rework-v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{version:1,projects:{}}}catch(_){return{version:1,projects:{}}}};
const save=s=>{localStorage.setItem(KEY,JSON.stringify(s));return s};
function ensure(projectId='project2'){const s=read();if(!s.projects[projectId])s.projects[projectId]={projectId,feedbackRead:false,weaknesses:[],strengths:[],actions:[],reworked:false,portfolio:false,notes:'',updatedAt:null};save(s);return s.projects[projectId]}
function update(projectId,patch){const s=read(),p=s.projects[projectId]||ensure(projectId);Object.assign(p,patch,{updatedAt:new Date().toISOString()});s.projects[projectId]=p;save(s);return p}
function markFeedback(projectId,strengths=[],weaknesses=[]){return update(projectId,{feedbackRead:true,strengths:[...new Set(strengths)],weaknesses:[...new Set(weaknesses)]})}
function planRework(projectId,actions=[]){return update(projectId,{actions:actions.filter(Boolean).slice(0,8)})}
function finishRework(projectId,notes=''){const p=update(projectId,{reworked:true,notes:String(notes||'').slice(0,6000)});if(window.HCKnowledge)HCKnowledge.practice('school:project-rework',{source:'school',label:'Reprise critique d’un projet'});return p}
function addToPortfolio(projectId){const p=update(projectId,{portfolio:true});if(window.HCKnowledge)HCKnowledge.practice('school:portfolio-selection',{source:'school',label:'Sélection et édition de portfolio'});return p}
window.HCSchoolProjectRework={version:1,read,ensure,update,markFeedback,planRework,finishRework,addToPortfolio};
})();