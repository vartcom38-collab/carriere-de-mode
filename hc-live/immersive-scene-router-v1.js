/* Haute Couture Live — routeur global des scènes immersives v1 */
(function(){
'use strict';
if(window.HCImmersiveSceneRouterV1)return;
const base=(()=>{const p=location.pathname,i=p.indexOf('/hc-live/');return i>=0?p.slice(0,i+9):'/'})();
function load(file,attr){return new Promise(resolve=>{const found=document.querySelector(`script[${attr}]`);if(found){if(found.dataset.hcLoaded==='1')return resolve(found);found.addEventListener('load',()=>resolve(found),{once:true});setTimeout(()=>resolve(found),900);return}const s=document.createElement('script');s.src=base+file;s.defer=true;s.setAttribute(attr,'1');s.addEventListener('load',()=>{s.dataset.hcLoaded='1';resolve(s)},{once:true});s.addEventListener('error',()=>resolve(s),{once:true});document.head.appendChild(s)})}
async function boot(){
 const p=location.pathname.toLowerCase();
 if(!window.HCImmersiveDialogueV1)await load('immersive-dialogue-v1.js?v=20260907-dialogue2','data-hc-immersive-dialogue');
 if(/school-(day|life)/.test(p)){
   await load('school/school-daily-life-v1.js?v=20260907-dailylife4','data-hc-school-daily-life-router');
   await load('school/school-daily-life-dialogue-bridge-v1.js?v=20260907-daily-dialogue1','data-hc-school-daily-dialogue');
 }
 if(/school-(day|life|city)/.test(p)){
   if(!window.HCSchoolExpandedSocialWorldV1)await load('school/school-expanded-social-world-v1.js?v=20260907-expandedworld2','data-hc-expanded-social-router');
   await load('school/school-expanded-social-dialogue-bridge-v1.js?v=20260907-expandeddialogue1','data-hc-expanded-social-dialogue');
 }
 if(/school-life/.test(p))await load('school/school-immersive-dialogues-v1.js?v=20260907-teacherdialogue2','data-hc-school-teacher-dialogues');
 if(/school-city/.test(p))await load('school/school-city-immersive-scenes-v1.js?v=20260907-cityscene2','data-hc-school-city-scenes');
 if(/(chez-moi|carriere|career|telephone)/.test(p)){
   await load('career/career-origin-v1.js?v=20260907-careerorigin2','data-hc-career-origin-router');
   await load('career/career-route-context-v1.js?v=20260907-careerroute2','data-hc-career-route-router');
   await load('career/career-immersive-dialogues-v1.js?v=20260907-careerdialogue2','data-hc-career-dialogues');
 }
}
boot();
window.HCImmersiveSceneRouterV1={version:1,boot};
})();
