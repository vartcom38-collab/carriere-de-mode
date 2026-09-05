/* Haute Couture Live — normalisation identité école : Marion joueuse, aucune Inès héritée */
(function(){
'use strict';
const OLD='Inès Vautrin',NEW='Anaïs Vautrin';
function patchLife(){const L=window.HCSchoolLife;if(!L)return;const teachers=L.people?.teachers||[];teachers.forEach(t=>{if(t.name===OLD||t.id==='prof-ines'){t.id='prof-anais';t.name=NEW}});(L.courses||[]).forEach(c=>{if(c.teacher===OLD)c.teacher=NEW})}
function patchMemory(){const key='haute-couture-school-learning-memory-v1';try{const s=JSON.parse(localStorage.getItem(key)||'null');if(!s)return;if(s.teacherMemory?.[OLD]){const old=s.teacherMemory[OLD],cur=s.teacherMemory[NEW]||{teacher:NEW,notes:[],strengths:{},watch:{}};cur.teacher=NEW;cur.notes=[...(cur.notes||[]),...(old.notes||[])].sort((a,b)=>String(b.at||'').localeCompare(String(a.at||''))).slice(0,80);for(const [k,v] of Object.entries(old.strengths||{}))cur.strengths[k]=(cur.strengths[k]||0)+Number(v||0);for(const [k,v] of Object.entries(old.watch||{}))cur.watch[k]=(cur.watch[k]||0)+Number(v||0);s.teacherMemory[NEW]=cur;delete s.teacherMemory[OLD];localStorage.setItem(key,JSON.stringify(s))}}catch(_){}}
function patchAcademic(){const key='haute-couture-school-academic-v1';try{const s=JSON.parse(localStorage.getItem(key)||'null');if(!s)return;(s.grades||[]).forEach(g=>{if(g.teacher===OLD)g.teacher=NEW});Object.values(s.assignments||{}).forEach(a=>{if(a.teacher===OLD)a.teacher=NEW});localStorage.setItem(key,JSON.stringify(s))}catch(_){}}
patchLife();patchMemory();patchAcademic();
window.HCSchoolIdentity={playerName:'Marion',materialTeacher:NEW,version:1};
})();