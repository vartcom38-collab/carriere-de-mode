/* Haute Couture Live — jurys vivants : critiques contradictoires, défense orale et mémoire pédagogique. */
(function(){
'use strict';
if(window.HCSchoolLiveJury)return;
const KEY='haute-couture-school-live-jury-v1';
const BRIEF_KEY='haute-couture-school-open-brief-v1';
const SCHOOL_KEY='haute-couture-school-choice-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
const now=()=>new Date().toISOString();
const match=location.pathname.match(/school-year(\d+)-project(\d+)/i);
if(!match)return;
const year=Number(match[1]),number=Number(match[2]),projectId=`year${year}-project${number}`;
function family(){const id=String(read(SCHOOL_KEY,{})?.id||'').toLowerCase();if(id.includes('ifm'))return'ifm';if(id.includes('duperre'))return'duperre';return'esmod'}
function state(){const s=read(KEY,{version:1,projects:{},updatedAt:now()});s.version=1;s.projects=s.projects||{};return s}
function save(s){s.updatedAt=now();return write(KEY,s)}
function brief(){return read(BRIEF_KEY,{projects:{}})?.projects?.[projectId]||{} }
function text(v){return String(v||'').trim()}
function arr(v){return Array.isArray(v)?v.filter(Boolean).map(text):[]}
function score(v,n=35){return text(v).length>=n}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function pick(list,salt){return list[(hash(projectId+'|'+salt)%list.length)]}
const panels={
 esmod:[
  {id:'construction',name:'Professeure de construction',focus:'construction',tone:'précise',likes:'la logique de montage, la faisabilité et les preuves de construction'},
  {id:'studio',name:'Directeur de projet',focus:'coherence',tone:'exigeant',likes:'la cohérence entre intention, silhouette et décision'},
  {id:'industry',name:'Intervenante professionnelle',focus:'reality',tone:'pragmatique',likes:'les choix capables de tenir dans une situation réelle'}
 ],
 ifm:[
  {id:'material',name:'Professeure matière',focus:'material',tone:'analytique',likes:'les protocoles, comparaisons et observations matière'},
  {id:'design',name:'Directeur de projet',focus:'coherence',tone:'curieux',likes:'une question claire qui produit plusieurs réponses possibles'},
  {id:'guest',name:'Intervenant extérieur',focus:'evidence',tone:'franc',likes:'les décisions soutenues par des essais plutôt que par l’intuition seule'}
 ],
 duperre:[
  {id:'plastic',name:'Professeure de pratique plastique',focus:'plastic',tone:'attentive',likes:'la position plastique, les écarts et les transformations'},
  {id:'volume',name:'Professeur volume / vêtement',focus:'volume',tone:'incisif',likes:'la relation entre corps, volume, surface et matière'},
  {id:'culture',name:'Intervenante culture visuelle',focus:'references',tone:'curieuse',likes:'les références digérées et transformées plutôt que citées'}
 ]
};
function evidence(p){
 const refs=arr(p.references),uses=arr(p.referenceUse),dirs=arr(p.directions);
 return {
  question:score(p.question,28),nonGoals:score(p.nonGoals,24),materials:score(p.materials,28),tests:score(p.tests,32),criteria:score(p.criteria,28),
  abandoned:score(p.abandoned,24),decision:score(p.decision,32),log:score(p.decisionLog,30),limits:score(p.limits,24),
  refs:refs.length,uses:uses.filter(x=>x.length>=18).length,dirs:dirs.filter(x=>x.length>=24).length,
  refText:refs,dirText:dirs
 };
}
function observations(p,e,j){
 const strong=[],watch=[];
 if(e.question)strong.push('La question de projet est formulée assez clairement pour guider les choix.'); else watch.push('La question reste trop peu définie pour permettre au jury de comprendre ce qui est réellement testé.');
 if(e.refs>=3&&e.uses>=2)strong.push('Les références sont séparées et plusieurs sont réellement transformées dans le projet.'); else watch.push('Le passage entre références et décisions de projet reste à démontrer plus précisément.');
 if(e.dirs>=3)strong.push('Trois pistes distinctes sont documentées avant la décision finale.'); else watch.push('Les pistes présentées ne montrent pas encore trois alternatives suffisamment distinctes.');
 if(e.tests&&e.criteria)strong.push('Les essais sont reliés à des critères de comparaison explicites.'); else watch.push('Le jury manque de preuves permettant de comprendre pourquoi une piste est retenue plutôt qu’une autre.');
 if(e.abandoned)strong.push('Une piste abandonnée est conservée comme trace de décision, ce qui rend le processus lisible.');
 if(e.limits)strong.push('Marion reconnaît ce que le projet ne prouve pas encore.'); else watch.push('Le projet gagnerait à distinguer ce qui est démontré de ce qui reste une hypothèse.');
 const specific={
  construction:e.materials&&e.tests?'La démarche commence à relier intention et faisabilité.':'La construction est évoquée mais pas encore suffisamment vérifiée par des essais observables.',
  material:e.materials&&e.tests?'Le protocole matière donne des éléments comparables.':'La matière est encore davantage déclarée qu’observée.',
  plastic:e.dirs>=3?'Les écarts entre pistes donnent une vraie amplitude plastique.':'Les pistes devraient diverger davantage en volume, surface, matière ou rapport au corps.',
  volume:e.dirs>=3?'Les variations de piste permettent de lire plusieurs rapports possibles au corps.':'Le rapport corps/volume n’est pas encore suffisamment mis en tension.',
  references:e.uses>=2?'Les références commencent à devenir des opérations de projet.':'Le jury veut voir ce qui est transformé, déplacé ou contredit dans chaque référence.',
  coherence:e.question&&e.decision?'La décision finale peut être reliée à la question initiale.':'Le fil entre question initiale et décision finale doit être rendu plus lisible.',
  reality:e.tests&&e.decision?'Le projet possède des preuves qui rendent la décision défendable.':'La décision semble encore plus déclarative que vérifiée.',
  evidence:e.tests&&e.criteria?'Le raisonnement s’appuie sur des observations comparables.':'Il manque un test ou un critère qui pourrait réellement invalider l’hypothèse.'
 }[j.focus];
 if(specific){if(/manque|pas encore|devrait|doit|déclarative|vérifiée/.test(specific))watch.unshift(specific);else strong.unshift(specific)}
 return {strong:strong.slice(0,3),watch:watch.slice(0,3)};
}
function questionFor(p,e,j){
 const q=[];
 if(!e.tests)q.push('Quel essai pourrait réellement invalider ta piste actuelle ?');
 if(!e.criteria)q.push('Sur quels critères précis compares-tu tes pistes, au-delà de ta préférence personnelle ?');
 if(e.refs<3||e.uses<2)q.push('Qu’est-ce que tu transformes concrètement de tes références, et qu’est-ce que tu refuses d’en reprendre ?');
 if(e.dirs<3)q.push('Si tu devais proposer une piste opposée à celle-ci, qu’est-ce qui changerait réellement ?');
 if(!e.limits)q.push('Qu’est-ce que ton projet ne permet pas encore d’affirmer ?');
 if(j.focus==='construction')q.push('Quel choix de construction est le plus fragile aujourd’hui, et comment le vérifierais-tu ?');
 if(j.focus==='material')q.push('Quelle observation matière a réellement changé une décision dans ton projet ?');
 if(j.focus==='plastic'||j.focus==='volume')q.push('Qu’est-ce que le corps fait à ton volume — et qu’est-ce que ton volume fait au corps ?');
 if(j.focus==='references')q.push('Quelle référence disparaîtrait visuellement du projet tout en restant présente dans sa logique ?');
 if(j.focus==='coherence')q.push('Quelle décision de ton projet répond le plus directement à ta question initiale ?');
 return pick(q.length?q:['Quelle décision peux-tu défendre avec une preuve plutôt qu’avec une intention ?'],j.id+'q');
}
function buildPanel(){const base=panels[family()];const count=number%5===0?3:2;return base.slice(0,count)}
function buildSession(force){
 const s=state(),old=s.projects[projectId];if(old&&!force)return old;
 const p=brief(),e=evidence(p),jury=buildPanel().map(j=>{const o=observations(p,e,j);return{...j,positive:o.strong[0]||'Le jury voit une intention personnelle en cours de construction.',reserve:o.watch[0]||'Le projet est suffisamment argumenté pour ouvrir une discussion plus fine.',question:questionFor(p,e,j),answer:null,reaction:null}});
 const session={id:'jury-'+projectId,projectId,year,number,schoolFamily:family(),createdAt:now(),updatedAt:now(),status:'ready',jury,defense:[],revision:null,summary:null};
 s.projects[projectId]=session;save(s);return session;
}
const answers=[
 {id:'defend',label:'Défendre ma décision',desc:'Je maintiens mon choix et je l’appuie sur les preuves déjà présentes.',effect:'assurance'},
 {id:'nuance',label:'Nuancer ma position',desc:'Je précise ce qui est solide et ce qui reste encore hypothétique.',effect:'maturite'},
 {id:'test',label:'Reconnaître la limite et proposer un test',desc:'Je ne sur-vends pas le résultat : je propose ce qui permettrait de trancher.',effect:'rigueur'},
 {id:'revise',label:'Accepter de rouvrir la piste',desc:'Je reconnais que le retour change suffisamment le problème pour retravailler une décision.',effect:'ecoute'}
];
function react(j,choice,p){
 const e=evidence(p);if(choice==='defend')return e.tests&&e.decision?'« D’accord. Tu relies ta position à des éléments observables : je peux suivre ton raisonnement. »':'« Tu peux maintenir cette position, mais il te manque encore une preuve pour qu’elle soit pleinement convaincante. »';
 if(choice==='nuance')return '« Cette nuance rend ton argument plus crédible. Tu distingues mieux intention, observation et conclusion. »';
 if(choice==='test')return '« C’est une réponse solide : tu identifies ce qu’il faut encore vérifier au lieu de transformer une hypothèse en certitude. »';
 return '« Revenir sur une décision n’est pas un recul si tu peux expliquer précisément ce que le retour t’a fait comprendre. »';
}
function answer(jurorId,choice){
 const s=state(),session=s.projects[projectId]||buildSession(false),j=session.jury.find(x=>x.id===jurorId);if(!j||j.answer)return session;
 j.answer=choice;j.reaction=react(j,choice,brief());session.defense.push({jurorId,choice,at:now()});session.updatedAt=now();if(session.jury.every(x=>x.answer))session.status='defended';s.projects[projectId]=session;save(s);persist(session);render();return session;
}
function synthesis(session){
 const p=brief(),e=evidence(p),choices=session.defense.map(x=>x.choice),strengths=[],watch=[];
 if(e.tests)strengths.push('essais documentés');if(e.refs>=3&&e.uses>=2)strengths.push('références transformées');if(e.dirs>=3)strengths.push('pistes comparées');if(e.abandoned)strengths.push('capacité à abandonner une piste');if(e.limits)strengths.push('limites reconnues');
 if(!e.tests)watch.push('preuves expérimentales');if(!e.criteria)watch.push('critères de comparaison');if(e.dirs<3)watch.push('diversité réelle des pistes');if(!e.limits)watch.push('capacité à nommer les limites');
 let stance='défense cohérente';if(choices.filter(x=>x==='test'||x==='nuance').length>=2)stance='défense particulièrement mature';if(choices.includes('revise'))stance='défense ouverte à la révision';
 return {strengths:strengths.length?strengths:['intention personnelle identifiable'],watch:watch.length?watch:['continuer à préciser les preuves'],stance,grade:null};
}
function finalize(){const s=state(),session=s.projects[projectId]||buildSession(false);if(session.status!=='defended')return session;session.summary=synthesis(session);session.status='complete';session.completedAt=now();session.updatedAt=now();s.projects[projectId]=session;save(s);persist(session,true);render();return session}
function revision(textValue){const s=state(),session=s.projects[projectId]||buildSession(false);session.revision=text(textValue).slice(0,3000);session.updatedAt=now();s.projects[projectId]=session;save(s);persist(session);render();return session}
function loadMemory(){if(window.HCSchoolLearningMemory)return Promise.resolve(window.HCSchoolLearningMemory);return new Promise(resolve=>{const sc=document.createElement('script'),cur=document.currentScript;sc.src=cur?.src?new URL('school-learning-memory-v1.js',cur.src).href:'../school/school-learning-memory-v1.js';sc.onload=()=>resolve(window.HCSchoolLearningMemory);sc.onerror=()=>resolve(null);document.head.appendChild(sc)})}
async function persist(session,final=false){const mem=await loadMemory();if(!mem)return;const p=brief();session.jury.forEach(j=>{if(!j.answer)return;mem.teacherNote(j.name,{year,projectId,text:`${j.positive} Réserve : ${j.reserve} Question : ${j.question} Réponse de Marion : ${answers.find(a=>a.id===j.answer)?.label||j.answer}. ${j.reaction||''}`,kind:'jury',strengths:j.answer==='test'||j.answer==='nuance'?['argumentation','recul critique']:['défense orale'],watch:/manque|pas encore|fragile|doit/.test(j.reserve)?['preuve à renforcer']:[]})});
 const feedback=session.jury.map(j=>`${j.name} — ${j.reserve}${j.reaction?' '+j.reaction:''}`).join('\n');mem.projectRecord({id:projectId,title:p.title||`Projet ${number}`,year,brief:[p.interpretation,p.question,p.nonGoals].filter(Boolean).join('\n'),research:[...arr(p.references),text(p.materials),text(p.tests)].filter(Boolean),abandoned:p.abandoned?[p.abandoned]:[],final:p.decision||'',feedback:feedback+(session.revision?`\nCorrection post-jury : ${session.revision}`:''),teacher:session.jury.map(j=>j.name).join(' · '),rubric:{juryStatus:session.status,defense:session.defense,summary:session.summary||null},grade:final?null:undefined});}
function style(){if(document.getElementById('hclj-style'))return;const st=document.createElement('style');st.id='hclj-style';st.textContent=`#hc-live-jury{border:1px solid #d8c9bd;background:linear-gradient(180deg,#fffdf9,#f8f3ed);margin:18px 0;padding:22px;border-radius:18px}#hc-live-jury .eye{font:900 9px Arial,sans-serif;letter-spacing:.16em;color:#9a6d54}#hc-live-jury h2{font:27px Georgia,serif;margin:7px 0}#hc-live-jury .lead{font:13px/1.6 Georgia,serif;color:#695c54;max-width:820px}.hclj-panel{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;margin:17px 0}.hclj-juror{background:#fff;border:1px solid #eaded5;border-radius:15px;padding:14px}.hclj-juror h3{font:18px Georgia,serif;margin:0 0 3px}.hclj-role{font:800 9px Arial,sans-serif;letter-spacing:.08em;color:#9a6d54;text-transform:uppercase}.hclj-good,.hclj-watch{font:12px/1.5 Georgia,serif;margin-top:10px}.hclj-good:before{content:'CE QUI TIENT · ';font:900 9px Arial,sans-serif;color:#4d8d86}.hclj-watch:before{content:'RÉSERVE · ';font:900 9px Arial,sans-serif;color:#a05b4e}.hclj-question{margin-top:13px;padding:11px;border-radius:11px;background:#f7f1eb;font:italic 13px/1.5 Georgia,serif}.hclj-answers{display:grid;gap:7px;margin-top:11px}.hclj-answers button,.hclj-final,.hclj-save{border:0;border-radius:10px;padding:10px 11px;text-align:left;background:#302b29;color:#fff;font-weight:800;cursor:pointer}.hclj-answers button small{display:block;font-weight:400;opacity:.8;margin-top:3px}.hclj-react{margin-top:10px;padding:10px;border-left:3px solid #4d8d86;background:#f3f8f6;font:12px/1.5 Georgia,serif}.hclj-summary{padding:14px;border-radius:13px;background:#eef5f2;margin:15px 0;font:13px/1.55 Georgia,serif}.hclj-revision textarea{width:100%;min-height:100px;border:1px solid #d9ccc2;border-radius:12px;padding:10px;font:13px/1.5 Georgia,serif}.hclj-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.hclj-final,.hclj-save{background:#4d8d86}.hclj-muted{font:11px/1.5 Georgia,serif;color:#7b6c63}@media(max-width:650px){#hc-live-jury{padding:16px}.hclj-panel{grid-template-columns:1fr}}`;document.head.appendChild(st)}
function render(){
 style();let root=document.getElementById('hc-live-jury');if(!root){root=document.createElement('section');root.id='hc-live-jury';const anchor=document.getElementById('hc-open-brief')||document.querySelector('.card')||document.querySelector('main');if(!anchor)return;anchor.insertAdjacentElement('afterend',root)}
 const session=buildSession(false),p=brief();
 const juryHtml=session.jury.map(j=>`<article class="hclj-juror"><div class="hclj-role">${j.tone} · regarde ${j.focus}</div><h3>${j.name}</h3><div class="hclj-good">${j.positive}</div><div class="hclj-watch">${j.reserve}</div><div class="hclj-question">« ${j.question} »</div>${j.answer?`<div class="hclj-react"><b>${answers.find(a=>a.id===j.answer)?.label||'Réponse'}</b><br>${j.reaction||''}</div>`:`<div class="hclj-answers">${answers.map(a=>`<button type="button" data-juror="${j.id}" data-answer="${a.id}">${a.label}<small>${a.desc}</small></button>`).join('')}</div>`}</article>`).join('');
 const ready=!!(text(p.question)||text(p.interpretation)||arr(p.directions).length||text(p.decision));
 const summary=session.summary?`<div class="hclj-summary"><b>Synthèse du jury</b><br>Position orale : ${session.summary.stance}.<br><b>Points solides :</b> ${session.summary.strengths.join(', ')}.<br><b>À poursuivre :</b> ${session.summary.watch.join(', ')}.<br><span class="hclj-muted">Le jury ne fabrique pas une “bonne réponse” cachée : il évalue la solidité du raisonnement et garde les désaccords.</span></div>`:'';
 root.innerHTML=`<div class="eye">JURY · CRITIQUE VIVANTE</div><h2>Défendre le projet</h2><p class="lead">Chaque membre lit le même dossier avec un regard différent. Ils peuvent valoriser des choses différentes, formuler des réserves incompatibles et demander à Marion de défendre, nuancer ou rouvrir une décision.</p>${!ready?'<div class="hclj-summary">Commence par documenter ton brief ouvert : le jury doit réagir à ton vrai processus, pas à une réponse générique.</div>':''}<div class="hclj-panel">${juryHtml}</div>${summary}${session.status==='defended'?'<button type="button" class="hclj-final" id="hclj-final">TERMINER LE JURY & ENREGISTRER LA SYNTHÈSE</button>':''}<div class="hclj-revision"><h3>Correction post-jury</h3><p class="hclj-muted">Facultatif. Marion peut noter ce qu’elle décide réellement de modifier après la critique — ou expliquer pourquoi elle maintient son choix.</p><textarea id="hclj-revision" placeholder="Après le jury, je décide de…">${session.revision||''}</textarea><div class="hclj-actions"><button type="button" class="hclj-save" id="hclj-save-revision">ENREGISTRER LA CORRECTION</button></div></div>`;
 root.querySelectorAll('[data-juror][data-answer]').forEach(b=>b.onclick=()=>answer(b.dataset.juror,b.dataset.answer));const fin=document.getElementById('hclj-final');if(fin)fin.onclick=finalize;document.getElementById('hclj-save-revision').onclick=()=>revision(document.getElementById('hclj-revision').value);
}
function mount(){buildSession(false);render()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
window.HCSchoolLiveJury={version:1,state,buildSession,answer,finalize,revision,render,mount,storageKey:KEY};
})();
