/* Haute Couture Live — verrou pédagogique des ateliers pratiques v1 */
(function(){
'use strict';
if(window.HCCoursePracticalGateV1)return;
if(!/\/school-course\/?$/i.test(location.pathname))return;
const id=new URLSearchParams(location.search).get('id')||'';
const required={'w1-textile':4,'w1-pattern':4,'w1-drape':4,'w1-assembly':4};
if(!required[id]){window.HCCoursePracticalGateV1={active:false};return}
const flowKey='haute-couture-real-classroom-flow-v1:'+id;
function state(){try{return JSON.parse(localStorage.getItem(flowKey)||'null')||{phase:0}}catch(_){return{phase:0}}}
function unlocked(){return Number(state().phase||0)>=required[id]}
const css=document.createElement('style');css.textContent=`.hcpw-launch.hc-locked{opacity:.62;cursor:not-allowed!important;background:rgba(45,33,28,.5)!important}.hcpw-gate-note{position:fixed;z-index:2147483900;left:50%;bottom:28px;transform:translate(-50%,18px);opacity:0;transition:.2s;padding:11px 15px;border-radius:999px;background:#2d211c;color:#fff;font:12px/1.2 Georgia,serif;pointer-events:none}.hcpw-gate-note.show{opacity:1;transform:translate(-50%,0)}`;document.head.appendChild(css);
const toast=document.createElement('div');toast.className='hcpw-gate-note';toast.textContent='Termine d’abord la séance guidée avec le professeur.';document.body.appendChild(toast);
let t;
function warn(){toast.classList.add('show');clearTimeout(t);t=setTimeout(()=>toast.classList.remove('show'),2200)}
function apply(){const b=document.querySelector('.hcpw-launch');if(!b)return;if(unlocked()){b.classList.remove('hc-locked');b.disabled=false;b.textContent=readDone()?'Atelier pratique ✓':'Atelier pratique';b.title='';return}b.classList.add('hc-locked');b.disabled=false;b.textContent='Atelier pratique · après la séance';b.title='Termine la séance guidée avant de passer à la manipulation';if(!b.dataset.hcGate){b.dataset.hcGate='1';b.addEventListener('click',e=>{if(unlocked())return;e.preventDefault();e.stopImmediatePropagation();warn()},true)}}
function readDone(){try{return !!JSON.parse(localStorage.getItem('haute-couture-course-practical-v1:'+id)||'null')?.done}catch(_){return false}}
apply();setTimeout(apply,350);setTimeout(apply,1000);new MutationObserver(apply).observe(document.body,{childList:true,subtree:true});window.addEventListener('storage',apply);window.HCCoursePracticalGateV1={active:true,id,unlocked,apply};
})();