/* Haute Couture Live — routeur global des scènes immersives v1 */
(function(){
'use strict';
if(window.HCImmersiveSceneRouterV1)return;
const base=(()=>{const p=location.pathname,i=p.indexOf('/hc-live/');return i>=0?p.slice(0,i+9):'/'})();
function load(file,attr){return new Promise(resolve=>{const found=document.querySelector(`script[${attr}]`);if(found){if(found.dataset.hcLoaded==='1')return resolve(found);found.addEventListener('load',()=>resolve(found),{once:true});setTimeout(()=>resolve(found),900);return}const s=document.createElement('script');s.src=base+file;s.defer=true;s.setAttribute(attr,'1');s.addEventListener('load',()=>{s.dataset.hcLoaded='1';resolve(s)},{once:true});s.addEventListener('error',()=>resolve(s),{once:true});document.head.appendChild(s)})}
async function boot(){
 const p=location.pathname.toLowerCase();
 if(!window.HCImmersiveDialogueV1)await load('immersive-dialogue-v1.js?v=20260907-dialogue3','data-hc-immersive-dialogue');
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
 if(/(chez-moi|carriere|career|telephone|ville)/.test(p)){
   await load('career/career-origin-v1.js?v=20260907-careerorigin2','data-hc-career-origin-router');
   await load('career/career-route-context-v1.js?v=20260907-careerroute2','data-hc-career-route-router');
   await load('career/career-immersive-dialogues-v1.js?v=20260907-careerdialogue2','data-hc-career-dialogues');
   await load('career/career-client-immersive-bridge-v1.js?v=20260907-clientdialogue1','data-hc-career-client-dialogues');
 }
 if(/telephone/.test(p))await load('telephone/phone-important-dialogue-bridge-v1.js?v=20260907-phonedialogue1','data-hc-phone-important-dialogues');
 if(/ville/.test(p)){
   await load('ville/nimes-artisan-dialogue-bridge-v1.js?v=20260907-artisandialogue1','data-hc-nimes-artisan-dialogues');
   await load('ville/nimes-client-fitting-dialogue-bridge-v1.js?v=20260907-fittingdialogue1','data-hc-nimes-fitting-dialogues');
   await load('ville/territorial-immersive-guide-engine-v1.js?v=20260907-travelguide1','data-hc-territorial-guide-engine');
   await load('ville/nimes-arenes-immersive-guide-v1.js?v=20260907-arenesguide1','data-hc-nimes-arenes-guide');
   await load('ville/nimes-major-immersive-guides-v1.js?v=20260907-nimesguides1','data-hc-nimes-major-guides');
   await load('ville/territorial-immersive-guide-ui-v1.js?v=20260907-travelguideui2','data-hc-territorial-guide-ui');
   await load('ville/territorial-circuit-engine-v1.js?v=20260907-circuitengine1','data-hc-territorial-circuit-engine');
   await load('ville/camargue-territorial-circuit-v1.js?v=20260907-camarguecircuit1','data-hc-camargue-circuit');
   await load('ville/territorial-circuit-ui-v1.js?v=20260907-circuitui1','data-hc-territorial-circuit-ui');
   await load('ville/camargue-circuit-city-bridge-v1.js?v=20260907-camarguebridge1','data-hc-camargue-circuit-bridge');
   await load('ville/territorial-population-engine-v1.js?v=20260907-population1','data-hc-territorial-population');
   await load('ville/camargue-population-v1.js?v=20260907-camarguepeople1','data-hc-camargue-population');
   await load('ville/camargue-encounter-bridge-v1.js?v=20260907-camargueencounters1','data-hc-camargue-encounters');
   await load('ville/nimes-population-v1.js?v=20260907-nimespeople1','data-hc-nimes-population');
   await load('ville/nimes-population-migration-v1.js?v=20260907-nimesmigration1','data-hc-nimes-population-migration');
   await load('ville/nimes-social-graph-v1.js?v=20260907-nimessocial1','data-hc-nimes-social-graph');
   await load('ville/nimes-introduction-memory-v1.js?v=20260907-nimesintro1','data-hc-nimes-intro-memory');
   await load('ville/nimes-social-consequences-v1.js?v=20260907-nimesconsequences1','data-hc-nimes-social-consequences');
   await load('ville/nimes-encounter-bridge-v1.js?v=20260907-nimesencounters3','data-hc-nimes-encounters');
 }
}
boot();
window.HCImmersiveSceneRouterV1={version:11,boot};
})();
