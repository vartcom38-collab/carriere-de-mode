/* Haute Couture Live — mémoire pédagogique longue : les professeurs comparent Marion à son propre parcours. */
(function(){
'use strict';
if(window.HCSchoolTeacherProgression)return;
const MEMORY_KEY='haute-couture-school-learning-memory-v1';
const JURY_KEY='haute-couture-school-live-jury-v1';
const match=location.pathname.match(/school-year(\d+)-project(\d+)/i);
if(!match)return;
const year=Number(match[1]),number=Number(match[2]),projectId=`year${year}-project${number}`;
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
function memory(){return read(MEMORY_KEY,{teacherMemory:{},projectHistory:[]})}
function jury(){return read(JURY_KEY,{projects:{}})?.projects?.[projectId]||null}
function total(obj){return Object.values(obj||{}).reduce((a,b)=>a+Number(b||0),0)}
function topKey(obj){return Object.entries(obj||{}).sort((a,b)=>Number(b[1])-Number(a[1]))[0]||null}
function priorProjectSummaries(){
 const m=memory();
 return (m.projectHistory||[]).filter(p=>p.id!==projectId&&p.year<=year&&p.rubric?.summary).map(p=>p.rubric.summary);
}
function profile(teacherName){
 const m=memory(),t=m.teacherMemory?.[teacherName];
 if(!t)return{seen:0,text:'C’est la première critique mémorisée de ce professeur avec Marion.',kind:'first'};
 const notes=(t.notes||[]).filter(n=>n.projectId!==projectId&&n.kind==='jury');
 const strengths=t.strengths||{},watch=t.watch||{};
 const seen=new Set(notes.map(n=>n.projectId).filter(Boolean)).size;
 if(!seen)return{seen:0,text:'C’est la première critique mémorisée de ce professeur avec Marion.',kind:'first'};
 const w=topKey(watch),s=topKey(strengths);
 let text=`Ce professeur a déjà suivi Marion sur ${seen} projet${seen>1?'s':''}.`;
 if(w&&Number(w[1])>=2)text+=` Point récurrent : ${w[0]} (${w[1]} remarques mémorisées).`;
 else if(s&&Number(s[1])>=2)text+=` Force déjà repérée : ${s[0]}.`;
 return{seen,text,kind:w&&Number(w[1])>=2?'watch':'known'};
}
function progressionText(session){
 const past=priorProjectSummaries();if(!past.length||!session?.summary)return'';
 const oldWatch=past.flatMap(x=>x.watch||[]),now=session.summary.watch||[],oldStrength=past.flatMap(x=>x.strengths||[]),nowStrength=session.summary.strengths||[];
 const improved=oldWatch.find(x=>nowStrength.includes(x));
 const repeated=now.find(x=>oldWatch.includes(x));
 if(improved)return`Progression visible : « ${improved} » apparaissait auparavant comme point à poursuivre et figure maintenant parmi les points solides.`;
 if(repeated)return`Point encore présent d’un projet à l’autre : « ${repeated} ». Le jury attend maintenant une évolution plus nette sur cet axe.`;
 const stable=nowStrength.find(x=>oldStrength.includes(x));
 if(stable)return`Force confirmée sur plusieurs projets : « ${stable} ». Le jury commence à l’identifier comme une qualité régulière du travail de Marion.`;
 return'';
}
function ensureStyle(){if(document.getElementById('hc-teacher-progression-style'))return;const s=document.createElement('style');s.id='hc-teacher-progression-style';s.textContent=`.hctp-memory{margin-top:10px;padding:9px 10px;border-radius:10px;background:#f5f0ea;border:1px dashed #d8c9bd;font:11px/1.5 Georgia,serif;color:#665950}.hctp-memory b{font:900 9px Arial,sans-serif;letter-spacing:.08em;color:#8c6753}.hctp-global{margin:12px 0;padding:12px 14px;border-radius:12px;background:#f0f6f3;border-left:3px solid #4d8d86;font:12px/1.55 Georgia,serif;color:#53665f}`;document.head.appendChild(s)}
function annotate(){
 ensureStyle();const root=document.getElementById('hc-live-jury'),session=jury();if(!root||!session)return;
 const cards=[...root.querySelectorAll('.hclj-juror')];
 cards.forEach((card,i)=>{if(card.querySelector('.hctp-memory'))return;const j=session.jury?.[i];if(!j)return;const p=profile(j.name),box=document.createElement('div');box.className='hctp-memory';box.innerHTML=`<b>MÉMOIRE DU PROFESSEUR</b><br>${p.text}`;card.appendChild(box)});
 const existing=root.querySelector('.hctp-global'),txt=progressionText(session);
 if(txt&&!existing){const box=document.createElement('div');box.className='hctp-global';box.innerHTML=`<b>Progression par rapport aux projets précédents</b><br>${txt}`;const summary=root.querySelector('.hclj-summary');(summary||root.querySelector('.hclj-panel'))?.insertAdjacentElement('afterend',box)}
}
let scheduled=false;function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;annotate()})}
function mount(){annotate();const root=document.getElementById('hc-live-jury');if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true});else{const obs=new MutationObserver(()=>{if(document.getElementById('hc-live-jury')){obs.disconnect();mount()}});obs.observe(document.documentElement,{childList:true,subtree:true})}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
window.HCSchoolTeacherProgression={version:1,profile,annotate,storageKey:MEMORY_KEY};
})();
