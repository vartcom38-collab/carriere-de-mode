/* Haute Couture Live — polish école : hiérarchie visuelle, cohérence et lisibilité gameplay. */
(function(){
'use strict';
if(window.HCSchoolPolish)return;
const ACADEMIC='haute-couture-school-academic-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
function screenKind(){const p=location.pathname;if(/school-year\d+-project\d+/i.test(p))return'projet';if(/school-course/i.test(p))return'cours';if(/school-day/i.test(p))return'journée';if(/school-planning/i.test(p))return'planning';if(/school-campus/i.test(p))return'campus';if(/school-drawing/i.test(p))return'dessin';return'école'}
function academic(){return window.HCSchoolAcademic?.state?.()||read(ACADEMIC,{year:1,week:1,day:1})||{year:1,week:1,day:1}}
function normalizeTeacherName(){
 const replaceNode=n=>{if(n.nodeType===3&&n.nodeValue?.includes('Inès Vautrin'))n.nodeValue=n.nodeValue.replaceAll('Inès Vautrin','Anaïs Vautrin')};
 document.querySelectorAll('body *').forEach(el=>{el.childNodes.forEach(replaceNode)});
 try{window.HCSchoolLife?.courses?.forEach(c=>{if(c.teacher==='Inès Vautrin')c.teacher='Anaïs Vautrin'})}catch(_){ }
}
function css(){if(document.getElementById('hc-school-polish-style'))return;const s=document.createElement('style');s.id='hc-school-polish-style';s.textContent=`
:root{--hc-school-paper:#fffaf4;--hc-school-ink:#251e1a;--hc-school-muted:#78685f;--hc-school-line:#e4d7cc;--hc-school-accent:#4d8d86;--hc-school-warm:#df7864;--hc-school-soft:#f5eee8}
body{background:linear-gradient(180deg,#faf6f1 0%,#f0e6dd 100%)!important}
.wrap,main#app,main{scroll-margin-top:78px}
.card,.panel,#hc-open-brief,#hc-live-jury,#hc-school-life-depth,#hc-school-event-scenes,#hc-school-internship,#hc-school-career-bridge{box-shadow:0 8px 28px rgba(65,47,38,.055);transition:border-color .18s ease,box-shadow .18s ease,transform .18s ease}
.card:hover,.panel:hover{border-color:#d7c4b7}
button,a.button{transition:transform .15s ease,box-shadow .15s ease,opacity .15s ease}button:not(:disabled):hover,a.button:hover{transform:translateY(-1px)}button:focus-visible,a:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid rgba(77,141,134,.25);outline-offset:2px}
.hc-school-context{position:sticky;top:10px;z-index:1200;max-width:1180px;margin:10px auto 0;padding:0 22px;pointer-events:none}.hc-school-context-inner{display:flex;align-items:center;gap:9px;flex-wrap:wrap;width:max-content;max-width:100%;padding:9px 12px;border:1px solid rgba(70,52,43,.12);border-radius:999px;background:rgba(255,250,244,.91);backdrop-filter:blur(12px);box-shadow:0 8px 25px rgba(54,40,33,.09);font:800 9px Arial,sans-serif;letter-spacing:.075em;color:#66564e}.hc-school-context b{color:#2f2926}.hc-school-context span+span:before{content:'·';margin-right:9px;color:#b39d90}
.hc-school-primary{border-color:#bdd7d1!important;box-shadow:0 14px 34px rgba(77,141,134,.11)!important;position:relative}.hc-school-primary:before{content:'À FAIRE MAINTENANT';position:absolute;right:16px;top:13px;font:900 8px Arial,sans-serif;letter-spacing:.12em;color:#4d8d86}
.hc-school-secondary{background:rgba(255,250,244,.76)!important;box-shadow:none!important}
.hc-school-toggle{margin:12px 0 4px;border:1px solid var(--hc-school-line);background:var(--hc-school-paper);color:var(--hc-school-ink);border-radius:12px;padding:10px 13px;font:900 9px Arial,sans-serif;letter-spacing:.07em;cursor:pointer}
.hc-school-collapsed{display:none!important}
#hc-school-life-depth,#hc-school-event-scenes,#hc-school-internship,#hc-school-career-bridge{margin-top:22px!important}
#hc-school-life-depth h2,#hc-school-event-scenes h2,#hc-school-internship h2,#hc-school-career-bridge h2,#hc-live-jury h2,#hc-open-brief h2{letter-spacing:-.02em}
.hcsld-grid,.hcse-grid,.hcsi-grid{align-items:start}
#hc-live-jury .hclj-juror,#hc-open-brief .hcob-field,.hcsld-block{box-shadow:0 3px 12px rgba(55,39,31,.035)}
@media(max-width:700px){.hc-school-context{top:6px;padding:0 10px}.hc-school-context-inner{border-radius:15px;width:100%;justify-content:center}.hc-school-primary:before{position:static;display:block;margin-bottom:8px}.wrap{padding-left:14px!important;padding-right:14px!important}}
`;
document.head.appendChild(s)}
function context(){if(document.getElementById('hc-school-context'))return;const a=academic(),kind=screenKind(),root=document.createElement('div');root.id='hc-school-context';root.className='hc-school-context';root.innerHTML=`<div class="hc-school-context-inner"><span><b>ÉCOLE</b></span><span>ANNÉE ${Number(a.year||1)}</span><span>SEMAINE ${Number(a.week||1)}</span><span>${kind.toUpperCase()}</span></div>`;document.body.insertAdjacentElement('afterbegin',root)}
function prioritize(){
 const kind=screenKind();
 if(kind==='école'){
   const actions=document.querySelector('.actions');if(actions){const cards=[...actions.querySelectorAll('.card')];cards[0]?.classList.add('hc-school-primary');cards.slice(1).forEach(x=>x.classList.add('hc-school-secondary'))}
   const schedule=document.getElementById('schedule');if(schedule&&!document.getElementById('hc-school-program-toggle')){
     const btn=document.createElement('button');btn.id='hc-school-program-toggle';btn.className='hc-school-toggle';btn.type='button';btn.textContent='AFFICHER LE PROGRAMME DÉTAILLÉ';schedule.classList.add('hc-school-collapsed');schedule.before(btn);btn.onclick=()=>{const hidden=schedule.classList.toggle('hc-school-collapsed');btn.textContent=hidden?'AFFICHER LE PROGRAMME DÉTAILLÉ':'MASQUER LE PROGRAMME DÉTAILLÉ'};
   }
 }
 if(kind==='projet'){
   document.getElementById('hc-open-brief')?.classList.add('hc-school-primary');document.getElementById('hc-live-jury')?.classList.add('hc-school-secondary');
 }
 ['hc-school-life-depth','hc-school-event-scenes','hc-school-internship','hc-school-career-bridge'].forEach(id=>document.getElementById(id)?.classList.add('hc-school-secondary'));
}
function observe(){let t;const mo=new MutationObserver(()=>{clearTimeout(t);t=setTimeout(()=>{normalizeTeacherName();prioritize()},40)});mo.observe(document.body,{subtree:true,childList:true});setTimeout(()=>mo.disconnect(),12000)}
function mount(){css();context();normalizeTeacherName();prioritize();observe()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
window.HCSchoolPolish={version:1,mount,normalizeTeacherName,prioritize};
})();