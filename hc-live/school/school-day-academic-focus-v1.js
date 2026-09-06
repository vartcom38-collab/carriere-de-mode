/* Haute Couture Live — Ma journée : priorités académiques naturelles v1 */
(function(){
'use strict';
if(window.HCSchoolDayAcademicFocusV1)return;
if(!/\/school-day\/?$/i.test(location.pathname))return;
const AKEY='haute-couture-school-academic-v1';
const PKEY='haute-couture-school-project-followup-v1';
const FLOW='haute-couture-school-day1-flow-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const flow=read(FLOW,null);if(flow&&flow.phase!=='done'){window.HCSchoolDayAcademicFocusV1={active:false,reason:'arrival'};return}
function academic(){return read(AKEY,{day:1,assignments:{}})}
function followups(){return read(PKEY,{projects:{}})}
function assignmentPriority(){const s=academic(),day=Number(s.day||1),all=Object.values(s.assignments||{}).filter(a=>a&&a.status==='assigned');if(!all.length)return null;all.sort((a,b)=>(Number(a.dueDay||999)-day)-(Number(b.dueDay||999)-day));const a=all[0],left=Number(a.dueDay||day)-day;return{type:'assignment',title:a.title||'Devoir à poursuivre',meta:left<=0?'Rendu attendu aujourd’hui':left===1?'À rendre demain':`À rendre dans ${left} jours`,reason:a.brief||'Un travail demandé en cours attend encore une réponse.',id:a.id,courseId:a.courseId||null}}
function projectPriority(){const s=followups(),items=Object.values(s.projects||{}).filter(Boolean);const p=items.find(x=>x.status==='revise'||x.status==='critique-done'||x.needsRevision)||items.find(x=>x.status==='active');if(!p)return null;return{type:'project',title:p.title||'Projet à reprendre',meta:p.status==='critique-done'||p.needsRevision?'Retour de critique à intégrer':'Projet en cours',reason:p.lastFeedback||p.nextPrompt||'Ton projet attend une décision ou une nouvelle étape.',projectId:p.projectId||p.id}}
function choose(){return assignmentPriority()||projectPriority()}
const css=document.createElement('style');css.textContent=`.hcsdaf{margin:14px 0 0;padding:15px 16px;border-radius:14px;background:rgba(248,238,231,.94);border:1px solid rgba(126,78,72,.16)}.hcsdaf .k{font:800 8px/1 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#a5505d}.hcsdaf h4{font:22px/1.1 Georgia,serif;font-weight:400;margin:6px 0 5px;color:#7e3038}.hcsdaf p{font:12px/1.45 Georgia,serif;color:#756159;margin:0}.hcsdaf .meta{display:inline-block;margin-top:8px;padding:6px 8px;border-radius:999px;background:#fffaf6;border:1px solid rgba(76,48,43,.13);font:800 8px/1 Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#715950}`;document.head.appendChild(css);
function mount(){const p=choose();if(!p)return;const focus=document.querySelector('.focus');if(!focus||focus.querySelector('.hcsdaf'))return;const box=document.createElement('div');box.className='hcsdaf';box.innerHTML=`<div class="k">À garder en tête</div><h4>${p.title}</h4><p>${p.reason}</p><span class="meta">${p.meta}</span>`;const go=focus.querySelector('.go');go?go.insertAdjacentElement('beforebegin',box):focus.appendChild(box);if(p.type==='assignment'){const label=focus.querySelector('.label');if(label)label.textContent='Prochaine priorité';const title=focus.querySelector('#nextTitle');const meta=focus.querySelector('#nextMeta');const reason=focus.querySelector('#reason');if(title)title.textContent=p.title;if(meta)meta.textContent=p.meta;if(reason)reason.textContent='Tu peux avancer ce travail maintenant ou continuer ta journée et y revenir avant le rendu.'} }
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();setTimeout(mount,500);new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true});
window.HCSchoolDayAcademicFocusV1={active:true,choose,mount};
})();