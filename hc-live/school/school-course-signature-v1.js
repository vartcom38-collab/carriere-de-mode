/* Haute Couture Live — cours signature visuel v1 */
(function(){
'use strict';
if(window.HCSchoolCourseSignature)return;
if(!/\/school-course\/?$/i.test(location.pathname))return;
const style=document.createElement('style');
style.textContent=`
:root{--hc-cream:rgba(255,249,243,.95);--hc-wine:#9f5361;--hc-ink:#281f1a;--hc-line:rgba(87,61,49,.16);--hc-shadow:0 24px 70px rgba(35,23,18,.24)}
body{background-color:#2b211d!important;color:var(--hc-ink)}
body:before{content:'';position:fixed;inset:0;pointer-events:none;z-index:2;background:linear-gradient(90deg,rgba(30,20,16,.22),transparent 50%,rgba(30,20,16,.18))}
body:after{content:'HAUTE COUTURE  ·  LIVE';position:fixed;left:28px;top:22px;z-index:9998;color:white;font:18px/1 Georgia,serif;letter-spacing:.12em;text-shadow:0 2px 12px rgba(0,0,0,.35);pointer-events:none}
.teacherCard,.teacher-card,[class*="teacher"]{backdrop-filter:blur(14px)}
.teacherCard,.teacher-card{background:var(--hc-cream)!important;border:1px solid rgba(255,255,255,.72)!important;border-radius:22px!important;box-shadow:var(--hc-shadow)!important}
.stageDock,.stage-dock,[class*="stageDock"]{background:rgba(255,249,243,.92)!important;border:1px solid rgba(255,255,255,.68)!important;border-radius:22px!important;box-shadow:var(--hc-shadow)!important;backdrop-filter:blur(15px)}
.sceneActions,.scene-actions{gap:10px!important}.sceneActions button,.scene-actions button,.objectTray button,.object-tray button{background:rgba(36,27,22,.78)!important;color:white!important;border:1px solid rgba(255,255,255,.28)!important;border-radius:16px!important;box-shadow:0 10px 28px rgba(0,0,0,.16)!important;backdrop-filter:blur(12px);transition:.2s!important}.sceneActions button:hover,.scene-actions button:hover,.objectTray button:hover,.object-tray button:hover{transform:translateY(-2px);background:rgba(159,83,97,.92)!important}
#sheet,.sheet,[class*="sheet"]{background:var(--hc-cream)!important;border:1px solid rgba(255,255,255,.72)!important;border-radius:28px!important;box-shadow:0 30px 90px rgba(22,14,11,.34)!important;backdrop-filter:blur(18px)}
#sheet h1,#sheet h2,.sheet h1,.sheet h2{font-family:Georgia,'Times New Roman',serif!important;font-weight:400!important;letter-spacing:-.025em!important}
#sheet button,.sheet button{border-radius:999px!important;border:0!important;background:var(--hc-wine)!important;color:white!important;font-weight:800!important;letter-spacing:.04em!important;padding:12px 16px!important}
#sheet textarea,#sheet input,.sheet textarea,.sheet input{background:rgba(255,255,255,.86)!important;border:1px solid var(--hc-line)!important;border-radius:15px!important;color:var(--hc-ink)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.8)!important}
.hcsi{background:rgba(255,249,243,.93)!important;border:1px solid rgba(255,255,255,.7)!important;border-radius:20px!important;box-shadow:0 18px 50px rgba(34,22,17,.18)!important}.hcsi button{border-radius:14px!important}.hcsi [class*="card"],.hcsi [class*="choice"]{border-radius:15px!important}
.sortCol,.phrase,.exCard,.choiceRow,.chip,.miniFeedback,.trace{border-radius:15px!important}
@media(max-width:700px){body:after{left:15px;top:14px;font-size:13px}.teacherCard,.teacher-card,.stageDock,.stage-dock{border-radius:17px!important}}
`;
document.head.appendChild(style);
function addMood(){if(document.querySelector('[data-hc-course-mood]'))return;const mood=document.createElement('div');mood.dataset.hcCourseMood='1';mood.style.cssText='position:fixed;left:28px;bottom:26px;z-index:9997;color:white;max-width:340px;text-shadow:0 2px 15px rgba(0,0,0,.45);pointer-events:none';mood.innerHTML='<div style="font:800 9px Arial;letter-spacing:.16em;text-transform:uppercase;color:#f0c9c2">Cours en immersion</div><div style="font:italic 18px/1.4 Georgia,serif;margin-top:6px">Observer. Comprendre. Essayer. Corriger. Recommencer.</div>';document.body.appendChild(mood)}
setTimeout(addMood,250);
const mo=new MutationObserver(addMood);mo.observe(document.documentElement,{childList:true,subtree:true});
window.HCSchoolCourseSignature={loaded:true};
})();