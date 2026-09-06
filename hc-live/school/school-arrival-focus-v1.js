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
 document.getElementById('hc-premium-mark')?.remove();
 document.getElementById('hc-school-event-scenes')?.remove();
 document.querySelectorAll('[data-hc-city-bridge],.hc-school-life-depth,.hc-school-event-scenes').forEach(n=>n.remove());
}
const style=document.createElement('style');style.id='hc-school-arrival-focus-css';style.textContent=`
body.hc-school-arrival-strict #hc-premium-mark,
body.hc-school-arrival-strict #hc-school-event-scenes,
body.hc-school-arrival-strict [data-hc-city-bridge]{display:none!important}
body.hc-school-arrival-strict .bottom,
body.hc-school-arrival-strict #normalNav{display:none!important}
body.hc-school-arrival-strict .topbar .nav{visibility:hidden!important;pointer-events:none!important}
body.hc-school-arrival-strict .scene{min-height:100vh!important;overflow:hidden!important}
body.hc-school-arrival-strict .hero{min-height:calc(100vh - 78px)!important;padding:42px 0 48px!important;grid-template-columns:minmax(360px,.82fr) minmax(520px,1.18fr)!important;gap:64px!important;align-items:center!important}
body.hc-school-arrival-strict .story{align-self:center!important;padding-bottom:0!important}
body.hc-school-arrival-strict .today{align-self:center!important;justify-self:end!important;max-height:calc(100vh - 130px)!important;overflow:auto!important}
body.hc-school-arrival-strict .today-grid{grid-template-columns:150px 1fr!important;gap:20px!important}
body.hc-school-arrival-strict .today-photo{min-height:220px!important}
body.hc-school-arrival-strict .profile{opacity:.92}
@media(max-width:1050px){
 body.hc-school-arrival-strict .hero{grid-template-columns:1fr!important;padding:36px 0 42px!important}
 body.hc-school-arrival-strict .story{display:none!important}
 body.hc-school-arrival-strict .today{justify-self:center!important;width:min(700px,94vw)!important}
}
@media(max-width:680px){
 body.hc-school-arrival-strict .topbar .nav{display:none!important}
 body.hc-school-arrival-strict .hero{min-height:calc(100vh - 64px)!important;padding:24px 0!important}
 body.hc-school-arrival-strict .today{max-height:none!important}
 body.hc-school-arrival-strict .today-grid{grid-template-columns:1fr!important}
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