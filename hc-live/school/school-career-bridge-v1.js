/* Haute Couture Live — continuité école -> carrière : portfolio, recommandations, anciens camarades et opportunités. */
(function(){
'use strict';
if(window.HCSchoolCareerBridge)return;
const KEY='haute-couture-school-career-bridge-v1';
const LEARN='haute-couture-school-learning-memory-v1';
const COMMUNITY='haute-couture-school-community-v1';
const INTERNSHIP='haute-couture-school-internship-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
const now=()=>new Date().toISOString();
function base(){return{version:1,portfolio:[],recommendations:[],contacts:[],opportunities:[],skills:[],updatedAt:now()}}
function state(){const s=read(KEY,null)||base();s.version=1;s.portfolio=s.portfolio||[];s.recommendations=s.recommendations||[];s.contacts=s.contacts||[];s.opportunities=s.opportunities||[];s.skills=s.skills||[];return s}
function save(s){s.updatedAt=now();return write(KEY,s)}
function learn(){return read(LEARN,{projectHistory:[],teacherMemory:{}})||{projectHistory:[],teacherMemory:{}}}
function community(){return read(COMMUNITY,{relationships:{}})||{relationships:{}}}
function internships(){return read(INTERNSHIP,{placements:{},careerBridge:{}})||{placements:{},careerBridge:{}}}
function projectScore(p){let n=0;if((p.research||[]).length>=3)n++;if((p.abandoned||[]).length)n++;if(String(p.final||'').length>=30)n++;if(String(p.feedback||'').length>=50)n++;if(p.rubric?.juryStatus==='complete')n+=2;return n}
function syncPortfolio(s,l){
 const old=new Map(s.portfolio.map(x=>[x.projectId,x]));
 s.portfolio=(l.projectHistory||[]).filter(p=>projectScore(p)>=2).map(p=>({
   ...(old.get(p.id)||{}),projectId:p.id,title:p.title,year:p.year,score:projectScore(p),selected:old.get(p.id)?.selected??!!p.portfolio,
   evidence:{research:(p.research||[]).slice(0,8),abandoned:(p.abandoned||[]).slice(0,4),final:p.final||'',feedback:p.feedback||'',jury:p.rubric?.summary||null},updatedAt:now()
 }));
}
function syncRecommendations(s,l){
 const out=[];Object.entries(l.teacherMemory||{}).forEach(([name,m])=>{
   const notes=(m.notes||[]).filter(n=>n.kind==='jury'||n.kind==='feedback');
   const strengths=Object.entries(m.strengths||{}).sort((a,b)=>b[1]-a[1]);
   const watch=Object.entries(m.watch||{}).sort((a,b)=>b[1]-a[1]);
   if(notes.length<2)return;
   const eligible=notes.length>=3&&(!watch[0]||((strengths[0]?.[1]||0)>=(watch[0]?.[1]||0)));
   out.push({teacher:name,eligible,status:eligible?'possible':'not-yet',basis:{notes:notes.length,topStrength:strengths[0]?.[0]||null,topWatch:watch[0]?.[0]||null},text:eligible?`${name} connaît suffisamment le travail de Marion pour pouvoir soutenir une candidature, selon le contexte.`:`${name} a encore trop peu de recul ou garde un point de vigilance important avant une recommandation forte.`});
 });s.recommendations=out;
}
function syncContacts(s,c,i){
 const rel=c.relationships||{};const contacts=[];Object.entries(rel).forEach(([id,r])=>{if(!r?.met)return;if((r.trust||0)>=3||(r.affinity||0)>=5)contacts.push({id:'schoolmate-'+id,type:'ancien-camarade',personId:id,trust:r.trust||0,affinity:r.affinity||0,source:'school',status:'active'})});
 Object.values(i.placements||{}).forEach(p=>{if(p.status==='complete'&&p.outcome?.contact)contacts.push({id:'internship-'+p.id,type:'ancien-tuteur',name:p.mentor||p.tutor||'Tuteur de stage',source:'internship',status:'active',placementId:p.id})});
 s.contacts=contacts;
}
function syncSkills(s,l,i){
 const set=new Set();(l.projectHistory||[]).forEach(p=>{if(p.rubric?.summary?.strengths) p.rubric.summary.strengths.forEach(x=>set.add(x));});
 Object.values(i.placements||{}).forEach(p=>{if(p.status==='complete')(p.outcome?.skills||p.skills||[]).forEach?.(x=>set.add(x))});
 s.skills=[...set].map(name=>({name,source:'school-or-internship'}));
}
function syncOpportunities(s,l,c,i){
 const ops=[];
 s.portfolio.filter(p=>p.selected&&p.score>=4).forEach(p=>ops.push({id:'portfolio-'+p.projectId,type:'portfolio-project',sourceId:p.projectId,title:`Projet de portfolio : ${p.title}`,status:'available',reason:'Projet suffisamment documenté et défendu pour servir de preuve de travail.'}));
 s.recommendations.filter(r=>r.eligible).forEach(r=>ops.push({id:'recommendation-'+r.teacher,type:'teacher-recommendation',title:`Recommandation possible · ${r.teacher}`,status:'available',reason:r.text}));
 s.contacts.forEach(cn=>ops.push({id:'contact-'+cn.id,type:'network-contact',title:cn.type==='ancien-camarade'?'Ancien camarade à recontacter':'Ancien tuteur à recontacter',status:'available',contactId:cn.id}));
 Object.values(i.placements||{}).forEach(p=>{if(p.status==='complete'&&p.outcome?.recommendation)ops.push({id:'stage-opportunity-'+p.id,type:'internship-followup',title:'Suite possible après un stage',status:'available',placementId:p.id,reason:'Le bilan de stage autorise une prise de contact ultérieure.'})});
 s.opportunities=ops;
}
function sync(){const s=state(),l=learn(),c=community(),i=internships();syncPortfolio(s,l);syncRecommendations(s,l);syncContacts(s,c,i);syncSkills(s,l,i);syncOpportunities(s,l,c,i);save(s);render();return s}
function toggleProject(id){const s=state(),p=s.portfolio.find(x=>x.projectId===id);if(!p)return;p.selected=!p.selected;save(s);sync();}
function render(){const host=document.querySelector('#app')||document.querySelector('main');if(!host)return;let root=document.getElementById('hc-school-career-bridge');if(!root){root=document.createElement('section');root.id='hc-school-career-bridge';root.className='card';host.appendChild(root)}const s=state();const projects=s.portfolio.slice(0,8).map(p=>`<div class="hccb-row"><div><b>${p.title}</b><small>Année ${p.year} · dossier ${p.score}/6</small></div><button data-project="${p.projectId}">${p.selected?'RETIRER DU PORTFOLIO':'AJOUTER AU PORTFOLIO'}</button></div>`).join('');const recs=s.recommendations.map(r=>`<div class="hccb-line"><b>${r.teacher}</b><span>${r.text}</span></div>`).join('');root.innerHTML=`<div class="hccb-eye">ÉCOLE → CARRIÈRE</div><h2>Ce que Marion emporte réellement avec elle</h2><p>Les projets, relations et stages ne disparaissent pas à la remise du diplôme. Ils deviennent des preuves de travail, des recommandations possibles, des contacts et des expériences — seulement quand le parcours les justifie.</p><h3>Portfolio issu des vrais projets</h3>${projects||'<p class="hccb-muted">Aucun projet n’est encore assez documenté pour être proposé.</p>'}<h3>Professeurs & recommandations</h3>${recs||'<p class="hccb-muted">Pas encore assez d’historique avec les professeurs.</p>'}<div class="hccb-grid"><div><b>${s.contacts.length}</b><span>contacts conservés</span></div><div><b>${s.opportunities.length}</b><span>ponts vers l’après-école</span></div><div><b>${s.skills.length}</b><span>forces documentées</span></div></div>`;if(!document.getElementById('hccb-style')){const st=document.createElement('style');st.id='hccb-style';st.textContent=`#hc-school-career-bridge{margin:18px 0;padding:20px;border:1px solid #d9cec5;border-radius:18px;background:#fffdf9}.hccb-eye{font:900 9px Arial,sans-serif;letter-spacing:.15em;color:#7b6a5d}.hccb-row{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;border-top:1px solid #eee3db;padding:11px 0}.hccb-row b,.hccb-line b{display:block;font:15px Georgia,serif}.hccb-row small{display:block;color:#827269;margin-top:3px}.hccb-row button{border:0;border-radius:10px;background:#2f2a27;color:white;padding:9px 10px;font-size:9px;font-weight:900;cursor:pointer}.hccb-line{padding:10px 0;border-top:1px solid #eee3db}.hccb-line span{display:block;font:12px/1.45 Georgia,serif;color:#72645b;margin-top:4px}.hccb-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:16px}.hccb-grid div{background:#f4ece6;border-radius:12px;padding:12px;text-align:center}.hccb-grid b{display:block;font:24px Georgia,serif}.hccb-grid span{font-size:9px;font-weight:800}.hccb-muted{color:#7d7067;font:12px/1.5 Georgia,serif}@media(max-width:650px){.hccb-row{grid-template-columns:1fr}.hccb-grid{grid-template-columns:1fr}}`;document.head.appendChild(st)}root.querySelectorAll('[data-project]').forEach(b=>b.onclick=()=>toggleProject(b.dataset.project));}
function mount(){sync()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,120));else setTimeout(mount,120);
window.HCSchoolCareerBridge={version:1,state,sync,toggleProject,render,mount,storageKey:KEY};
})();