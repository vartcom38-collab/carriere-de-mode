/* Haute Couture Live — évaluation qualitative par critères v1 */
(function(){
'use strict';
if(window.HCQualitativeEvaluation)return;
const courseId=new URLSearchParams(location.search).get('id')||'';
if(!/\/school-course\/?$/i.test(location.pathname)||!courseId){window.HCQualitativeEvaluation={active:false};return}
const STORE='haute-couture-school-qualitative-evaluation-v1';
const SESSION='haute-couture-school-eval-session-v1:'+courseId;
const readAll=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch(_){return {}}};
const saveAll=v=>localStorage.setItem(STORE,JSON.stringify(v));
const readSession=()=>{try{return JSON.parse(localStorage.getItem(SESSION)||'{"answers":[],"notes":""}')||{answers:[],notes:''}}catch(_){return {answers:[],notes:''}}};
const saveSession=v=>localStorage.setItem(SESSION,JSON.stringify(v));
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const course=()=>window.HCSchoolLife?.courses?.find(x=>x.id===courseId)||{};
const cat=()=>String(course().category||'Méthode');
const lower=s=>String(s||'').toLowerCase();
const contains=(txt,words)=>words.filter(w=>lower(txt).includes(lower(w))).length;
const lexicons={
 'Méthode':['observation','forme','surface','proportion','direction','répétition','tension','matière','intention','référence','solution'],
 'Dessin':['ligne d’action','appui','poids','bassin','épaules','masse','silhouette','équilibre','volume','proportion'],
 'Textile':['main','tombé','poids','épaisseur','souple','nerveux','sec','compact','biais','droit-fil','élasticité','transparence','froissage'],
 'Matière':['main','tombé','poids','épaisseur','souple','nerveux','sec','compact','biais','droit-fil','élasticité','transparence','froissage'],
 'Modélisme':['aisance','droit-fil','pince','cran','valeur de couture','ligne de couture','patron','toile','pivot','volume'],
 'Moulage':['ancrage','tension','compression','excès','pli','pince','fronce','volume','mannequin','360'],
 'Montage':['ordre opératoire','assemblage','valeur de couture','pressage','couture','cran','fermeture','ourlet','accessibilité','contrôle'],
 'Culture':['source','contexte','référence','archive','date','auteur','collection','interprétation','citation','documenter'],
 'Projet':['intention','référence','matière','volume','contrainte','essai','prototype','correction','choix','justification']
};
const causal=['parce que','donc','car ','ce qui','entraîne','permet','provoque','afin de','pour que','grâce à','à cause de'];
const evidence=['j’observe','je vois','on voit','mesure','surface','forme','pli','ligne','direction','tension','volume','poids','appui','tombé'];
const judgement=['joli','beau','belle','élégant','élégante','moche','moderne','original','tendance','chic','j’aime','jadore','j’adore'];
const criteriaByCategory={
 'Méthode':[['Précision de l’observation','Décrire des faits visibles avant les impressions.'],['Vocabulaire professionnel','Nommer forme, matière, direction, répétition ou tension.'],['Chaîne de raisonnement','Relier observation → intention → solution.'],['Justification','Expliquer pourquoi une décision découle de ce qui est observé.']],
 'Dessin':[['Lecture de la structure','Repérer axe, appui, bassin et masses avant le détail.'],['Vocabulaire de dessin','Employer ligne d’action, appui, masse, équilibre, proportion.'],['Diagnostic','Identifier la cause d’une pose peu crédible.'],['Révision','Proposer ce que tu corrigerais avant d’ajouter des détails.']],
 'Textile':[['Observation du comportement','Décrire main, tombé, poids, épaisseur, déformation.'],['Vocabulaire matière','Employer des termes tactiles et structurels précis.'],['Lien matière / usage','Justifier un usage avec des comportements observés.'],['Comparaison','Différencier au moins deux étoffes par des faits.']],
 'Matière':[['Observation du comportement','Décrire main, tombé, poids, épaisseur, déformation.'],['Vocabulaire matière','Employer des termes tactiles et structurels précis.'],['Lien matière / usage','Justifier un usage avec des comportements observés.'],['Comparaison','Différencier au moins deux étoffes par des faits.']],
 'Modélisme':[['Lecture du patron','Comprendre la fonction des lignes et repères.'],['Logique 2D → 3D','Relier patron, volume et essayage.'],['Vocabulaire construction','Employer aisance, pince, droit-fil, cran, valeur.'],['Correction','Expliquer comment une observation de toile modifie le patron.']],
 'Moulage':[['Lecture de la matière','Repérer tension, compression, excès et tombé.'],['Points d’ancrage','Utiliser peu de points et comprendre leur effet.'],['Transformation du volume','Proposer une transformation cohérente de l’excès.'],['Lecture 360°','Prendre en compte face, profil et dos.']],
 'Montage':[['Ordre opératoire','Organiser les étapes selon l’accessibilité.'],['Contrôle technique','Vérifier repères, assemblages et pressage.'],['Vocabulaire montage','Employer couture, valeur, cran, pressage, ourlet.'],['Cause / effet','Expliquer ce qui devient difficile si une étape arrive trop tôt.']],
 'Culture':[['Qualité de la source','Identifier origine, auteur, date ou contexte.'],['Analyse contextualisée','Distinguer fait, hypothèse et interprétation.'],['Usage de la référence','Expliquer pourquoi la source éclaire le projet.'],['Transformation','Éviter la copie littérale et reformuler une logique.']],
 'Projet':[['Intention','Formuler un objectif de design précis.'],['Processus','Conserver essais, corrections et décisions.'],['Justification','Relier matière, volume et contraintes aux choix.'],['Autonomie','Réviser une proposition à partir d’un retour critique.']]
};
function snapshotInputs(){
 const s=readSession();
 document.querySelectorAll('#sheet textarea').forEach(t=>{const v=t.value.trim();if(v&& !s.answers.includes(v))s.answers.push(v)});
 const n=document.querySelector('#notes');if(n?.value.trim())s.notes=n.value.trim();
 saveSession(s);
}
function assess(){
 snapshotInputs();
 const s=readSession(),text=[...(s.answers||[]),s.notes||''].join('\n');
 const category=cat(),criteria=criteriaByCategory[category]||criteriaByCategory['Méthode'];
 const vocab=lexicons[category]||lexicons['Méthode'];
 const vocabHits=contains(text,vocab),causalHits=contains(text,causal),evidenceHits=contains(text,evidence),judgementHits=contains(text,judgement);
 const length=text.trim().length;
 const strengths=[],focus=[];
 if(evidenceHits>=3||length>280)strengths.push('Tu fournis des éléments concrets plutôt qu’une réponse purement générale.');else focus.push('Décrire davantage de faits observables avant de conclure.');
 if(vocabHits>=3)strengths.push('Ton vocabulaire commence à devenir professionnel et précis.');else focus.push('Réutiliser le vocabulaire métier du cours dans tes observations.');
 if(causalHits>=2)strengths.push('Tu relies plusieurs choix à leurs causes ou à leurs effets.');else focus.push('Expliquer davantage pourquoi un fait entraîne une décision.');
 if(judgementHits>1&&evidenceHits<3)focus.push('Remplacer les jugements esthétiques vagues par des descriptions vérifiables.');
 const levels=criteria.map((c,i)=>{
   let value='À renforcer';
   if(i===0&&(evidenceHits>=3||length>260))value='En bonne voie';
   if(i===1&&vocabHits>=3)value='En bonne voie';
   if(i===2&&causalHits>=2)value='En bonne voie';
   if(i===3&&length>180&&(causalHits>=1||vocabHits>=3))value='En bonne voie';
   if(length>420&&vocabHits>=5&&causalHits>=3&&evidenceHits>=4)value='Solide';
   return {name:c[0],description:c[1],level:value};
 });
 const teacher=course().teacher||'Le professeur';
 let summary=`${teacher} : « `;
 if(strengths.length&&focus.length)summary+=strengths[0]+' '+focus[0];
 else if(strengths.length)summary+=strengths[0]+' Continue à rendre chaque décision explicable.';
 else summary+='Ton travail reste encore trop général. Reviens aux faits, au vocabulaire du cours et au lien entre cause et décision.';
 summary+=' »';
 const result={courseId,title:course().title||courseId,category,teacher,criteria,strengths,focus,summary,createdAt:new Date().toISOString()};
 const all=readAll();all[courseId]=result;saveAll(all);return result;
}
function injectFinal(){
 const sheet=document.getElementById('sheet');if(!sheet||!/Fin de séance/i.test(sheet.textContent)||sheet.querySelector('[data-hc-qualitative-eval]'))return;
 const r=assess();
 const box=document.createElement('section');box.dataset.hcQualitativeEval='1';box.style.cssText='margin:18px 0;padding:18px 20px;border-radius:18px;background:#f2e9e2;border:1px solid #dfcec2;color:#2a211c;font-family:Georgia,serif';
 box.innerHTML=`<div style="font:800 9px Arial;letter-spacing:.14em;text-transform:uppercase;color:#b96f68">Retour pédagogique</div><div style="font-size:18px;line-height:1.55;font-style:italic;margin:9px 0 13px">${esc(r.summary)}</div><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px">${r.criteria.map(c=>`<div style="background:#fffaf5;border-radius:13px;padding:11px"><b style="display:block;font-size:14px">${esc(c.name)}</b><span style="font:11px Arial;color:#78675f">${esc(c.level)}</span></div>`).join('')}</div>${r.focus.length?`<div style="margin-top:13px;font-size:13px;line-height:1.5"><b>À retravailler :</b> ${esc(r.focus[0])}</div>`:''}`;
 const actions=sheet.querySelector('.actions');(actions||sheet).insertAdjacentElement(actions?'beforebegin':'beforeend',box);
}
document.addEventListener('input',e=>{if(e.target.matches('#sheet textarea,#notes'))snapshotInputs()},true);
document.addEventListener('click',e=>{if(e.target.closest('#next,#saveNotes'))snapshotInputs()},true);
const obs=new MutationObserver(()=>{snapshotInputs();injectFinal()});obs.observe(document.body,{subtree:true,childList:true});
window.HCQualitativeEvaluation={active:true,assess,read:()=>readAll()[courseId]||null,readAll};
})();