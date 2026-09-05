/* Haute Couture Live — briefs ouverts : Marion construit sa réponse, aucune solution cachée. */
(function(){
'use strict';
if(window.HCSchoolOpenBrief)return;
const KEY='haute-couture-school-open-brief-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
const now=()=>new Date().toISOString();
const path=location.pathname;
const match=path.match(/school-year(\d+)-project(\d+)/i);
if(!match)return;
const year=Number(match[1]),number=Number(match[2]),projectId=`year${year}-project${number}`;
function base(){return{version:1,projects:{},updatedAt:now()}}
function state(){const s=read(KEY,null)||base();s.version=1;s.projects=s.projects||{};return s}
function saveState(s){s.updatedAt=now();return write(KEY,s)}
function school(){return read('haute-couture-school-choice-v1',null)}
function family(){const id=String(school()?.id||'').toLowerCase();if(id.includes('ifm'))return'ifm';if(id.includes('duperre'))return'duperre';return'esmod'}
const emphasis={
 esmod:'Construction, faisabilité, ordre de développement et contrôle. La réponse peut être très différente d’un projet à l’autre : ce qui compte est que les choix soient construits et vérifiables.',
 ifm:'Corps, matière, protocole, expérimentation et comparaison. Une hypothèse peut échouer : l’important est de documenter ce que le test permet réellement de conclure.',
 duperre:'Volume, couleur, matière, surface et position plastique. Le projet peut rester ouvert tant que Marion sait expliquer ses décisions et ses transformations.'
};
const fields=[
 ['interpretation','Ma lecture personnelle du brief','Qu’est-ce que j’entends vraiment dans ce sujet ? Quelle partie m’intéresse, m’intrigue ou me résiste ?'],
 ['question','Ma question de projet','Formule une question assez précise pour guider les choix, mais assez ouverte pour permettre plusieurs réponses.'],
 ['references','Mes références choisies et pourquoi','Références visuelles, historiques, matérielles, urbaines, culturelles… précise ce que chacune apporte.'],
 ['materials','Mes hypothèses de matières / techniques','Ce que tu envisages d’essayer. Tu n’as pas besoin de connaître d’avance ce qui fonctionnera.'],
 ['directions','Mes pistes possibles','Décris au moins deux directions réellement différentes avant de décider.'],
 ['tests','Les essais que je veux faire','Quels tests permettront de comparer les pistes plutôt que de choisir au goût ?'],
 ['abandoned','Ce que j’abandonne et pourquoi','Une piste abandonnée documentée compte comme une décision de projet, pas comme un échec effacé.'],
 ['decision','Ma décision actuelle et ses preuves','Ce que tu retiens aujourd’hui, sur quelles preuves, et ce qui reste encore incertain.']
];
function ensure(){const s=state(),old=s.projects[projectId]||{};const p={id:projectId,year,number,title:document.querySelector('h1')?.textContent?.trim()||`Projet ${number}`,schoolId:school()?.id||null,createdAt:old.createdAt||now(),updatedAt:now()};fields.forEach(([id])=>p[id]=old[id]||'');s.projects[projectId]={...old,...p};saveState(s);return s.projects[projectId]}
function payload(){const old=ensure(),p={...old,updatedAt:now()};fields.forEach(([id])=>p[id]=String(document.getElementById('hcob-'+id)?.value||'').trim());return p}
function syncMemory(p){if(!window.HCSchoolLearningMemory?.projectRecord)return;window.HCSchoolLearningMemory.projectRecord({id:projectId,title:p.title,year,brief:p.interpretation||'',research:[p.references,p.materials,p.directions,p.tests].filter(Boolean),abandoned:p.abandoned?[p.abandoned]:[],final:p.decision||'',teacher:null});}
function loadMemory(){if(window.HCSchoolLearningMemory)return Promise.resolve();return new Promise(resolve=>{const script=document.createElement('script'),current=document.currentScript;script.src=current?.src?new URL('school-learning-memory-v1.js',current.src).href:'../school/school-learning-memory-v1.js';script.onload=resolve;script.onerror=resolve;document.head.appendChild(script)})}
function renderProgress(){const p=payload(),developed=fields.filter(([id])=>(p[id]||'').length>=30).length,el=document.getElementById('hcob-progress');if(el)el.textContent=`Cadrage personnel : ${developed}/${fields.length} axes suffisamment développés. Ce compteur mesure la documentation, jamais la qualité artistique.`}
function mount(){if(document.getElementById('hc-open-brief'))return;const p=ensure(),target=document.querySelector('.card')||document.querySelector('main');if(!target)return;const section=document.createElement('section');section.id='hc-open-brief';section.className='card';section.innerHTML=`<div class="hcob-eye">BRIEF OUVERT · RÉPONSE DE MARION</div><h2>Construire ma propre réponse</h2><p class="hcob-lead">Le sujet fixe un cadre, pas une solution. Deux élèves peuvent répondre correctement avec des directions opposées. Les professeurs évaluent la qualité de la recherche, des essais, des décisions, des corrections et de l’argumentation — pas la proximité avec une réponse cachée.</p><div class="hcob-emphasis"><b>Dans cette école :</b> ${emphasis[family()]}</div><div class="hcob-grid">${fields.map(([id,label,help])=>`<div class="hcob-field"><label for="hcob-${id}">${label}</label><small>${help}</small><textarea id="hcob-${id}"></textarea></div>`).join('')}</div><div class="hcob-rubric"><b>Ce que le professeur regardera</b><span>question compréhensible</span><span>références transformées, pas copiées</span><span>plusieurs pistes comparées</span><span>essais observables</span><span>choix argumentés</span><span>capacité à corriger ou abandonner</span></div><div id="hcob-progress" class="hcob-progress"></div><div class="hcob-actions"><button type="button" id="hcob-save">ENREGISTRER MON CADRAGE</button></div>`;
 const style=document.createElement('style');style.textContent=`#hc-open-brief{border-color:#c9dcd6;background:linear-gradient(180deg,#fbfffd,#fffaf4)}#hc-open-brief .hcob-eye{font:900 9px Arial,sans-serif;letter-spacing:.15em;color:#4d8d86;margin-bottom:8px}#hc-open-brief .hcob-lead{max-width:850px}.hcob-emphasis{margin:14px 0;padding:12px 14px;border-radius:13px;background:#edf4f1;color:#496b63;font:12px/1.55 Georgia,serif}.hcob-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.hcob-field label{display:block;font-size:11px;font-weight:900;margin-bottom:4px}.hcob-field small{display:block;min-height:35px;color:#806f65;font:11px/1.45 Georgia,serif;margin-bottom:6px}.hcob-field textarea{width:100%;min-height:105px;border:1px solid #dfd0c5;border-radius:12px;padding:11px;background:#fff;font:13px/1.5 Georgia,serif}.hcob-rubric{display:flex;gap:6px;flex-wrap:wrap;margin-top:14px}.hcob-rubric b{width:100%;font:13px Georgia,serif;margin-bottom:3px}.hcob-rubric span{font-size:9px;font-weight:900;background:#f0e8e1;border-radius:999px;padding:7px 9px}.hcob-progress{margin-top:13px;color:#75675e;font:12px/1.5 Georgia,serif}.hcob-actions{margin-top:12px}.hcob-actions button{border:0;border-radius:12px;background:#4d8d86;color:white;padding:11px 14px;font-weight:900;cursor:pointer}@media(max-width:720px){.hcob-grid{grid-template-columns:1fr}.hcob-field small{min-height:0}}`;document.head.appendChild(style);
 target.insertAdjacentElement('beforebegin',section);fields.forEach(([id])=>{const el=document.getElementById('hcob-'+id);el.value=p[id]||'';el.addEventListener('input',renderProgress)});document.getElementById('hcob-save').onclick=async()=>{const next=payload(),s=state();s.projects[projectId]=next;saveState(s);await loadMemory();syncMemory(next);const b=document.getElementById('hcob-save');b.textContent='CADRAGE ENREGISTRÉ ✓';setTimeout(()=>b.textContent='ENREGISTRER MON CADRAGE',1400)};renderProgress()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
window.HCSchoolOpenBrief={version:1,state,ensure,payload,mount,storageKey:KEY};
})();
