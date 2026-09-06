/* Haute Couture Live — strict visual focus for the first school arrival */
(function(){
'use strict';
if(window.HCSchoolArrivalFocusV1)return;
const path=location.pathname.toLowerCase();
const FLOW='haute-couture-school-day1-flow-v1';
const readFlow=()=>{try{return JSON.parse(localStorage.getItem(FLOW)||'null')}catch(_){return null}};
function active(){const f=readFlow();return !!f&&f.phase!=='done'}
function clean(){
 if(!active())return;
 document.body.classList.add('hc-school-arrival-strict');
 document.documentElement.classList.add('hc-school-arrival-strict-html');
 document.getElementById('hc-premium-mark')?.remove();
 document.getElementById('hc-school-event-scenes')?.remove();
 document.querySelectorAll('[data-hc-city-bridge],.hc-school-life-depth,.hc-school-event-scenes,.hcsp-brand').forEach(n=>n.remove());
}
const style=document.createElement('style');style.id='hc-school-arrival-focus-css';style.textContent=`
html.hc-school-arrival-strict-html,body.hc-school-arrival-strict{min-height:100%;overflow-x:hidden!important}
body.hc-school-arrival-strict #hc-premium-mark,
body.hc-school-arrival-strict #hc-school-event-scenes,
body.hc-school-arrival-strict [data-hc-city-bridge],
body.hc-school-arrival-strict .hcsp-brand{display:none!important}
body.hc-school-arrival-strict .bottom,
body.hc-school-arrival-strict #normalNav{display:none!important}
body.hc-school-arrival-strict .topbar .nav{visibility:hidden!important;pointer-events:none!important}
body.hc-school-arrival-strict #hc-global-menu-launch{opacity:.72;transform:scale(.92)}

/* HOME — one scene, one panel, one action. */
body.hc-school-arrival-strict.hc-school-home .scene{min-height:100vh!important;height:auto!important;overflow:hidden!important;padding:0!important}
body.hc-school-arrival-strict.hc-school-home .topbar{height:72px!important}
body.hc-school-arrival-strict.hc-school-home .hero{width:min(1380px,92vw)!important;min-height:calc(100vh - 72px)!important;padding:34px 0 42px!important;grid-template-columns:minmax(360px,.78fr) minmax(500px,1.22fr)!important;gap:72px!important;align-items:center!important}
body.hc-school-arrival-strict.hc-school-home .story{align-self:center!important;padding:0!important;max-width:520px}
body.hc-school-arrival-strict.hc-school-home .story h1{font-size:clamp(58px,6vw,92px)!important;margin:10px 0 16px!important}
body.hc-school-arrival-strict.hc-school-home .story p{font-size:15px!important;line-height:1.5!important}
body.hc-school-arrival-strict.hc-school-home .today{align-self:center!important;justify-self:end!important;width:min(590px,100%)!important;max-height:none!important;overflow:visible!important;padding:24px 26px 22px!important;border-radius:16px!important}
body.hc-school-arrival-strict.hc-school-home .today-head h2{font-size:38px!important}
body.hc-school-arrival-strict.hc-school-home .today-grid{grid-template-columns:138px 1fr!important;gap:18px!important;margin-top:16px!important}
body.hc-school-arrival-strict.hc-school-home .today-photo{min-height:190px!important;height:190px!important}
body.hc-school-arrival-strict.hc-school-home .today h3{font-size:30px!important;margin:7px 0 8px!important}
body.hc-school-arrival-strict.hc-school-home .today p{font-size:13px!important;line-height:1.46!important}
body.hc-school-arrival-strict.hc-school-home .mini-list{gap:6px!important;margin-top:12px!important}
body.hc-school-arrival-strict.hc-school-home .mini{font-size:11px!important}
body.hc-school-arrival-strict.hc-school-home .go{margin-top:15px!important;padding:14px 18px!important;font-size:16px!important}
body.hc-school-arrival-strict.hc-school-home .recap,
body.hc-school-arrival-strict.hc-school-home .home-life{margin-top:12px!important;padding:12px 14px!important}

/* DAY — guided first day stays fully above the fold on desktop. */
body.hc-school-arrival-strict.hc-school-day .scene{min-height:100vh!important;height:auto!important;overflow:hidden!important;padding:0!important}
body.hc-school-arrival-strict.hc-school-day .topbar{height:72px!important}
body.hc-school-arrival-strict.hc-school-day .stage{width:min(1360px,92vw)!important;min-height:calc(100vh - 72px)!important;padding:32px 0 38px!important;grid-template-columns:minmax(290px,.68fr) minmax(650px,1.32fr)!important;gap:54px!important;align-items:center!important}
body.hc-school-arrival-strict.hc-school-day .scene-copy{align-self:center!important;padding-bottom:0!important}
body.hc-school-arrival-strict.hc-school-day .scene-copy h1{font-size:clamp(52px,5.4vw,78px)!important}
body.hc-school-arrival-strict.hc-school-day .board{align-self:center!important;justify-self:end!important;width:min(760px,100%)!important;max-height:calc(100vh - 118px)!important;overflow:auto!important;border-radius:16px!important}
body.hc-school-arrival-strict.hc-school-day .board-head{padding:22px 24px 15px!important}
body.hc-school-arrival-strict.hc-school-day .board-head h2{font-size:38px!important}
body.hc-school-arrival-strict.hc-school-day .board-body{min-height:380px!important}
body.hc-school-arrival-strict.hc-school-day .timeline{padding:20px 18px 20px 22px!important}
body.hc-school-arrival-strict.hc-school-day .focus{padding:20px 22px!important}
body.hc-school-arrival-strict.hc-school-day .focus-photo{height:125px!important;margin-bottom:13px!important}
body.hc-school-arrival-strict.hc-school-day .focus h3{font-size:29px!important}
body.hc-school-arrival-strict.hc-school-day .go{padding:13px 16px!important;font-size:16px!important}
body.hc-school-arrival-strict.hc-school-day .normal{display:none!important}

/* Welcome / tour — never let generic injected cards leak below the scene. */
body.hc-school-arrival-strict.hc-school-welcome #hc-school-event-scenes,
body.hc-school-arrival-strict.hc-school-tour #hc-school-event-scenes{display:none!important}

@media(max-width:1050px){
 body.hc-school-arrival-strict.hc-school-home .hero,
 body.hc-school-arrival-strict.hc-school-day .stage{grid-template-columns:1fr!important;padding:28px 0 34px!important}
 body.hc-school-arrival-strict.hc-school-home .story,
 body.hc-school-arrival-strict.hc-school-day .scene-copy{display:none!important}
 body.hc-school-arrival-strict.hc-school-home .today,
 body.hc-school-arrival-strict.hc-school-day .board{justify-self:center!important;width:min(720px,94vw)!important}
 body.hc-school-arrival-strict.hc-school-day .board{max-height:none!important}
}
@media(max-width:680px){
 body.hc-school-arrival-strict .topbar .nav{display:none!important}
 body.hc-school-arrival-strict.hc-school-home .hero,
 body.hc-school-arrival-strict.hc-school-day .stage{min-height:calc(100vh - 64px)!important;padding:20px 0!important}
 body.hc-school-arrival-strict.hc-school-home .today{padding:20px 18px!important}
 body.hc-school-arrival-strict.hc-school-home .today-grid,
 body.hc-school-arrival-strict.hc-school-day .board-body{grid-template-columns:1fr!important}
 body.hc-school-arrival-strict.hc-school-home .today-photo{height:150px!important;min-height:150px!important}
 body.hc-school-arrival-strict.hc-school-day .timeline{border-right:0!important;border-bottom:1px solid rgba(76,48,43,.17)!important}
}
`;
document.head.appendChild(style);
if(/\/school-home\/?$|\/school-day\/?$|\/school-welcome\/?$|\/school-tour\/?$/.test(path)){
 clean();
 const mo=new MutationObserver(clean);mo.observe(document.documentElement,{childList:true,subtree:true});
 window.addEventListener('storage',clean);
}
window.HCSchoolArrivalFocusV1={active,clean};
})();