/* Haute Couture Live — progression crédible de la promo, sans classement global. */
(function(){
'use strict';
if(window.HCSchoolCohortProgress)return;
const KEY='haute-couture-school-cohort-progress-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
const now=()=>new Date().toISOString();
const hash=str=>{let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return Math.abs(h>>>0)};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function academic(){return window.HCSchoolAcademic?.state?.()||read('haute-couture-school-academic-v1',{year:1,week:1,day:1})||{year:1,week:1,day:1}}
function students(){return window.HCSchoolCommunity?.students||[]}
function base(){return{version:1,students:{},snapshots:{},critiques:[],updatedAt:now()}}
function state(){const s=read(KEY,null)||base();s.version=1;s.students=s.students||{};s.snapshots=s.snapshots||{};s.critiques=s.critiques||[];students().forEach(p=>{if(!s.students[p.id])s.students[p.id]={id:p.id,name:p.name,confidence:50,discipline:50,experimentation:50,technical:50,presentation:50,trajectory:[],lastOutcome:null}});return s}
function save(s){s.updatedAt=now();return write(KEY,s)}
function strengthAxis(p){const x=(p.strength||'').toLowerCase();if(x.includes('construction')||x.includes('coupe')||x.includes('dessin technique'))return'technical';if(x.includes('mati')||x.includes('drap'))return'experimentation';if(x.includes('oral'))return'presentation';if(x.includes('recherche')||x.includes('culture'))return'discipline';if(x.includes('collection')||x.includes('image')||x.includes('silhouette')||x.includes('motif'))return'confidence';return'confidence'}
function fragilityAxis(p){const x=(p.fragility||'').toLowerCase();if(x.includes('finir')||x.includes('documenter')||x.includes('tard')||x.includes('disperse')||x.includes('compar'))return'discipline';if(x.includes('oral'))return'presentation';if(x.includes('contrôle')||x.includes('technique')||x.includes('approxim'))return'technical';if(x.includes('risque')||x.includes('prudent')||x.includes('rigide'))return'experimentation';return'confidence'}
function snapshotKey(year,week){return `y${year}-w${week}`}
function evolveStudent(p,year,week){const s=state(),rec=s.students[p.id],seed=hash(`${p.id}|${year}|${week}`),sa=strengthAxis(p),fa=fragilityAxis(p);const cadence=(seed%5)-2;const stress=((seed>>>3)%7)-3;const boost=((seed>>>7)%4);rec[sa]=clamp(rec[sa]+1+boost,20,95);rec[fa]=clamp(rec[fa]+cadence,20,95);rec.confidence=clamp(rec.confidence+(stress>1?-1:1),20,95);rec.discipline=clamp(rec.discipline+((seed%3)-1),20,95);return rec}
function outcomeFor(p,year,week,context='projet'){const rec=evolveStudent(p,year,week),seed=hash(`${p.id}|${year}|${week}|${context}`);const average=(rec.confidence+rec.discipline+rec.experimentation+rec.technical+rec.presentation)/5;const swing=(seed%21)-10;const score=clamp(Math.round(average+swing),25,92);let status='solide',text='Le travail est cohérent mais garde des zones à approfondir.';
 if(score<42){status='fragile';text='Le rendu est en difficulté sur plusieurs points. Le professeur demande une reprise ciblée plutôt qu’un simple recommencement.'}
 else if(score<58){status='irrégulier';text='Il y a une piste intéressante, mais le rendu manque encore de contrôle ou de clarté.'}
 else if(score<75){status='solide';text='Le projet tient debout et les choix sont lisibles, avec encore quelques corrections utiles.'}
 else {status='très abouti';text='Le projet est particulièrement convaincant cette fois-ci, sans rendre l’élève “meilleur partout”.'}
 const fa=fragilityAxis(p),sa=strengthAxis(p);const notes={technical:'technique',experimentation:'expérimentation',presentation:'présentation',discipline:'méthode',confidence:'prise de décision'};
 return{studentId:p.id,name:p.name,year,week,context,status,scoreBand:score<42?'en difficulté':score<58?'moyen':score<75?'bon':'très bon',text,strength:`Point fort visible : ${notes[sa]}.`,watch:`À surveiller : ${notes[fa]}.`}}
function ensureWeek(year,week){const s=state(),key=snapshotKey(year,week);if(s.snapshots[key])return s.snapshots[key];const entries=students().map(p=>outcomeFor(p,year,week,'semaine'));const snap={year,week,createdAt:now(),entries};s.snapshots[key]=snap;entries.forEach(o=>{const r=s.students[o.studentId];r.lastOutcome=o;r.trajectory.unshift({year,week,status:o.status,scoreBand:o.scoreBand,at:now()});r.trajectory=r.trajectory.slice(0,96)});save(s);return snap}
function currentWeek(){const a=academic();return ensureWeek(Number(a.year||1),Number(a.week||1))}
function studentView(id){const s=state(),p=students().find(x=>x.id===id),r=s.students[id];if(!p||!r)return null;return{profile:p,...r}}
function critiqueFor(courseId){const a=academic(),group=window.HCSchoolClassroomSocial?.groupFor?.(window.HCSchoolLife?.courses?.find(c=>c.id===courseId))||[];const key=`${courseId}|${a.year}|${a.week}`;const s=state();let c=s.critiques.find(x=>x.key===key);if(c)return c;const reactions=group.map(p=>outcomeFor(p,a.year,a.week,'critique')).map((o,i)=>({...o,reaction:i%3===0?'Son propre rendu l’a rendu très attentive à ce point.':i%3===1?'Elle compare avec ses erreurs récentes sans transformer ça en compétition.':'Son avis est précis, mais reste un point de vue de camarade.'}));c={key,courseId,year:a.year,week:a.week,reactions,createdAt:now()};s.critiques.unshift(c);s.critiques=s.critiques.slice(0,120);save(s);return c}
function recordWeekAdvance(){const a=academic();ensureWeek(Number(a.year||1),Number(a.week||1));}
window.addEventListener('hc-game-state',()=>setTimeout(recordWeekAdvance,20));
window.HCSchoolCohortProgress={version:1,state,currentWeek,ensureWeek,studentView,critiqueFor,outcomeFor,storageKey:KEY};
})();
