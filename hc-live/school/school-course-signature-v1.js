/* Haute Couture Live — cours signature visuel v3 */
(function(){
'use strict';
if(window.HCSchoolCourseSignatureV3)return;
if(!/\/school-course\/?$/i.test(location.pathname))return;

const style=document.createElement('style');
style.id='hc-course-signature-v3';
style.textContent=`
:root{--hc-cream:rgba(255,249,243,.96);--hc-wine:#914654;--hc-ink:#281f1a;--hc-line:rgba(87,61,49,.16);--hc-shadow:0 24px 70px rgba(35,23,18,.24)}
body{background:#241b17!important;color:var(--hc-ink);overflow:hidden!important}
body:before{content:''!important;position:fixed!important;inset:0!important;pointer-events:none!important;z-index:2!important;background:linear-gradient(90deg,rgba(25,16,13,.38),rgba(25,16,13,.08) 48%,rgba(25,16,13,.24))!important}
body:after{display:none!important}
#hc-premium-mark,[data-hc-course-mood],.hcsp-brand{display:none!important}
.topbar{top:18px!important;left:24px!important;right:24px!important;height:44px!important;align-items:center!important;z-index:30!important}.crumb{padding:9px 14px!important;background:rgba(255,249,243,.93)!important;color:#3c2d27!important;border:1px solid rgba(255,255,255,.75)!important;box-shadow:0 8px 24px rgba(25,15,12,.14)!important;letter-spacing:.11em!important}.exit{position:static!important;padding:9px 14px!important;background:rgba(35,25,20,.72)!important;color:white!important;border:1px solid rgba(255,255,255,.28)!important;border-radius:999px!important;font:800 9px/1 Arial,sans-serif!important;letter-spacing:.06em!important;text-transform:uppercase!important}
.courseTitle{left:50px!important;bottom:52px!important;width:min(520px,34vw)!important;z-index:6!important}.courseTitle .eyebrow{font-size:9px!important;letter-spacing:.16em!important}.courseTitle h1{font-size:clamp(36px,3.25vw,56px)!important;line-height:.98!important;margin:9px 0 10px!important;letter-spacing:-.035em!important;max-width:520px!important;text-wrap:balance!important}.courseTitle p{font-size:14px!important;line-height:1.45!important;max-width:460px!important}
.teacherPresence{right:42px!important;top:82px!important;width:min(410px,31vw)!important;padding:18px 20px!important;border-radius:18px!important;background:var(--hc-cream)!important;border:1px solid rgba(255,255,255,.78)!important;box-shadow:var(--hc-shadow)!important;backdrop-filter:blur(18px)!important}.teacherPresence h2{font-size:26px!important;margin:2px 0!important}.teacherPresence .role{font-size:12px!important}.teacherPresence .say{font-size:16px!important;line-height:1.48!important;margin:13px 0 0!important}.stageDock{right:42px!important;bottom:42px!important;width:min(410px,31vw)!important;padding:17px 20px!important;border-radius:18px!important;background:var(--hc-cream)!important;border:1px solid rgba(255,255,255,.78)!important;box-shadow:var(--hc-shadow)!important;backdrop-filter:blur(18px)!important}.stageDock strong{font-size:22px!important;margin:7px 0!important}.stageDock p{font-size:12px!important;line-height:1.42!important}.dots{margin:11px 0!important}.continue{border-radius:10px!important;padding:13px 15px!important;background:#30231e!important}
.sceneActions{left:50%!important;top:80px!important;transform:translateX(-50%)!important;gap:7px!important;max-width:520px!important;z-index:12!important}.sceneAction,.sceneActions button{padding:9px 12px!important;border-radius:999px!important;background:rgba(35,25,20,.72)!important;color:#fff!important;border:1px solid rgba(255,255,255,.28)!important;box-shadow:0 8px 20px rgba(0,0,0,.12)!important;font-size:9px!important;letter-spacing:.03em!important}.sceneAction:hover,.sceneActions button:hover{background:rgba(145,70,84,.9)!important;transform:none!important}
.objectTray{left:50%!important;bottom:48px!important;transform:translateX(-50%)!important;gap:12px!important;z-index:12!important;align-items:stretch!important}.objectCard{width:154px!important;min-height:188px!important;border-radius:15px!important;background:rgba(255,249,243,.96)!important;border:1px solid rgba(255,255,255,.72)!important;box-shadow:0 18px 50px rgba(21,13,10,.24)!important;overflow:hidden!important}.objectCard:hover{transform:translateY(-3px)!important}.objectCard.active{outline:2px solid #d7959e!important;outline-offset:2px!important}.objectPhoto{height:104px!important;background:center/cover no-repeat!important;position:relative!important;overflow:hidden!important}.objectPhoto:before{display:none!important}.objectPhoto:after{position:absolute;left:9px;bottom:8px;padding:5px 7px;border-radius:999px;background:rgba(34,24,19,.74);color:white;font:800 7px/1 Arial,sans-serif;letter-spacing:.10em;text-transform:uppercase;backdrop-filter:blur(7px)}
.objectCard[data-hc-object='scissors'] .objectPhoto{background-image:linear-gradient(180deg,rgba(0,0,0,.02),rgba(0,0,0,.12)),url('https://images.unsplash.com/photo-1718184021018-d2158af6b321?auto=format&fit=crop&fm=jpg&q=82&w=900')!important}.objectCard[data-hc-object='scissors'] .objectPhoto:after{content:'Outil de coupe'}
.objectCard[data-hc-object='thread'] .objectPhoto{background-image:linear-gradient(180deg,rgba(0,0,0,.01),rgba(0,0,0,.09)),url('https://images.unsplash.com/photo-1613555793439-c50b6274176a?auto=format&fit=crop&fm=jpg&q=82&w=900')!important}.objectCard[data-hc-object='thread'] .objectPhoto:after{content:'Fil · répétition'}
.objectCard[data-hc-object='canvas'] .objectPhoto{background-image:linear-gradient(180deg,rgba(0,0,0,.01),rgba(0,0,0,.06)),url('https://images.unsplash.com/photo-1561748198-9deb2f073078?auto=format&fit=crop&fm=jpg&q=82&w=900')!important}.objectCard[data-hc-object='canvas'] .objectPhoto:after{content:'Matière · surface'}
.objectCard:not([data-hc-object]) .objectPhoto{background:repeating-linear-gradient(0deg,#d6c5ae 0 2px,#eadfce 2px 5px)!important}.objectCard:not([data-hc-object]) .objectPhoto:after{content:'Support d’étude'}
.objectCard b{padding:11px 12px 3px!important;font-size:15px!important;color:#32251f!important}.objectCard span{padding:0 12px 12px!important;font-size:9px!important;line-height:1.35!important;color:#76645b!important}
#sheet,.sheet,[class*='sheet']{background:var(--hc-cream)!important;border:1px solid rgba(255,255,255,.72)!important;border-radius:22px!important;box-shadow:0 30px 90px rgba(22,14,11,.34)!important;backdrop-filter:blur(18px)!important}#sheet h1,#sheet h2,.sheet h1,.sheet h2{font-family:Georgia,'Times New Roman',serif!important;font-weight:400!important;letter-spacing:-.025em!important}#sheet button,.sheet button{border-radius:999px!important}#sheet textarea,#sheet input,.sheet textarea,.sheet input{background:rgba(255,255,255,.9)!important;border:1px solid var(--hc-line)!important;border-radius:14px!important;color:var(--hc-ink)!important}.hcsi{background:rgba(255,249,243,.96)!important;border-radius:18px!important;box-shadow:0 18px 50px rgba(34,22,17,.18)!important}.sortCol,.phrase,.exCard,.choiceRow,.chip,.miniFeedback,.trace{border-radius:13px!important}
@media(max-width:1100px){.courseTitle{width:32vw!important}.teacherPresence,.stageDock{width:350px!important}.objectCard{width:138px!important}.sceneActions{top:74px!important}}@media(max-width:820px){body{overflow:auto!important}.topbar{left:14px!important;right:14px!important}.courseTitle{left:20px!important;right:20px!important;bottom:238px!important;width:auto!important}.courseTitle h1{font-size:38px!important}.teacherPresence{left:16px!important;right:16px!important;top:74px!important;width:auto!important}.stageDock{left:16px!important;right:16px!important;bottom:16px!important;width:auto!important}.sceneActions,.objectTray{display:none!important}.sortGrid,.exampleRow{grid-template-columns:1fr!important}.sheet{padding:22px 18px!important}}
`;
document.head.appendChild(style);

function labelObjects(){
 document.querySelectorAll('.objectCard').forEach(card=>{
   const name=(card.querySelector('b')?.textContent||'').toLowerCase();
   if(/ciseau/.test(name))card.dataset.hcObject='scissors';
   else if(/bobine|fil/.test(name))card.dataset.hcObject='thread';
   else if(/toile|tissu|matière|matiere/.test(name))card.dataset.hcObject='canvas';
 });
}
function clean(){document.getElementById('hc-premium-mark')?.remove();document.querySelectorAll('[data-hc-course-mood],.hcsp-brand').forEach(n=>n.remove());labelObjects()}
function loadSubjectVisuals(){
 const id=new URLSearchParams(location.search).get('id')||'';
 if(!['w1-textile','w1-pattern','w1-drape'].includes(id)||window.HCSubjectVisualsV1||document.querySelector('script[data-hc-subject-visuals]'))return;
 const marker='/hc-live/';const p=location.pathname;const i=p.indexOf(marker);const base=i>=0?p.slice(0,i)+marker:'../';
 const s=document.createElement('script');s.src=base+'school/subject-visuals-v1.js?v=20260906-subjectvisual1';s.defer=true;s.setAttribute('data-hc-subject-visuals','1');document.head.appendChild(s);
}
setTimeout(clean,0);setTimeout(clean,250);setTimeout(clean,900);loadSubjectVisuals();new MutationObserver(clean).observe(document.documentElement,{childList:true,subtree:true});
window.HCSchoolCourseSignatureV3={loaded:true,clean};window.HCSchoolCourseSignature=window.HCSchoolCourseSignatureV3;
})();