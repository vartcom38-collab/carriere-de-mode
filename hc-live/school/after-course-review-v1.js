/* Haute Couture Live — après-cours & révision espacée v1 */
(function(){
'use strict';
if(window.HCAfterCourseReview)return;
const STORE='haute-couture-school-review-v1',SEQ='haute-couture-school-review-seq-v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'[]')||[]}catch(_){return []}};
const save=v=>localStorage.setItem(STORE,JSON.stringify(v));
const seq=()=>Number(localStorage.getItem(SEQ)||0);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const packs={
 'w1-welcome':{remember:['Observation = fait vérifiable','Interprétation = sens ou impression','Intention = action recherchée'],examples:['« Trois plis verticaux partent du même point » = observation exploitable','« C’est élégant » = jugement trop vague'],errors:['Sauter directement de l’image à la solution','Confondre description et opinion'],review:{q:'Laquelle est une observation ?',a:['Cette forme est élégante','Trois lignes parallèles descendent depuis le même point','Je veux allonger la silhouette'],ok:1}},
 'w1-drawing':{remember:['Ligne d’action avant détail','Appui et poids du corps','Masses avant contour'],examples:['Une pose lisible peut fonctionner avec très peu de traits'],errors:['Dessiner les détails avant l’équilibre','Allonger les proportions sans repères'],review:{q:'Que vérifies-tu d’abord si une pose semble tomber ?',a:['Le motif','La projection du poids par rapport à l’appui','Les doigts'],ok:1}},
 'w1-textile':{remember:['Composition ≠ comportement','Main, tombé, poids, épaisseur','Biais plus déformable sur beaucoup de tissés'],examples:['Une étoffe fluide se choisit pour son comportement, pas son nom seul'],errors:['Dire seulement « c’est du coton »','Choisir une matière uniquement pour sa couleur'],review:{q:'Pour prévoir un drapé, quelle information est la plus utile ?',a:['Le prix','Le tombé et la souplesse','Le nom de la marque'],ok:1}},
 'w1-pattern':{remember:['Corps ≠ vêtement','Aisance de confort / de style','Pince = gestion du volume'],examples:['Une correction de toile doit être reportée sur le patron'],errors:['Confondre ligne de couture et valeur','Tracer une ligne sans connaître sa fonction'],review:{q:'Que doit préserver un transfert de pince ?',a:['Le volume autour du pivot','La même direction exacte','Le même nombre de crans'],ok:0}},
 'w1-drape':{remember:['Peu de points d’ancrage au départ','Lire tension, compression et excès','Toujours vérifier à 360°'],examples:['Un excès peut devenir pli, pince, fronce ou volume'],errors:['Épingler partout trop tôt','Supprimer une tension avant de la comprendre'],review:{q:'Pourquoi limiter les épingles au début ?',a:['Pour aller plus vite uniquement','Pour observer le comportement naturel de la matière','Pour éviter de voir le dos'],ok:1}},
 'w1-assembly':{remember:['Ordre opératoire = accessibilité','Pressage pendant le montage','Contrôler avant de fermer définitivement'],examples:['L’ourlet vient souvent après les assemblages principaux'],errors:['Fermer toutes les coutures trop tôt','Confondre marge et ligne d’assemblage'],review:{q:'Pourquoi penser l’ordre opératoire avant de coudre ?',a:['Pour garder les zones accessibles au bon moment','Pour utiliser plus de fil','Pour éviter le repassage'],ok:0}},
 'w1-culture':{remember:['Référence = source documentée','Contexte avant citation','Transformer plutôt que copier'],examples:['Une image utile doit répondre à une question du projet'],errors:['Moodboard sans sources','Copier un détail sans comprendre son contexte'],review:{q:'Qu’est-ce qui transforme une image en référence de travail ?',a:['Le fait de l’aimer','Une source, un contexte et une question précise','Sa popularité'],ok:1}}
};
function inferPack(id,cat){return packs[id]||{remember:[`Retenir les notions essentielles du cours de ${cat||'mode'}`,'Relier chaque décision à une observation ou une méthode','Savoir expliquer ce que tu fais'],examples:['Garde au moins un exemple concret vu pendant la séance'],errors:['Éviter les réponses vagues ou non justifiées'],review:{q:'Quel est le meilleur réflexe après ce cours ?',a:['Mémoriser sans comprendre','Relier la notion à un exemple concret','Passer immédiatement à autre chose'],ok:1}}}
function capture(){
 const id=new URLSearchParams(location.search).get('id'); if(!id)return;
 const sheet=document.getElementById('sheet'); if(!sheet||!/Fin de séance/i.test(sheet.textContent))return;
 const list=read(); if(list.some(x=>x.id===id&&x.completedMarker===seq()+1))return;
 const c=window.HCSchoolLife?.courses?.find(x=>x.id===id)||{}; const p=inferPack(id,c.category);
 const n=seq()+1; localStorage.setItem(SEQ,String(n));
 list.push({id,title:c.title||id,category:c.category||'Cours',teacher:c.teacher||'',completedMarker:n,dueMarker:n+2,status:'fresh',remember:p.remember,examples:p.examples,errors:p.errors,review:p.review,lastResult:null}); save(list);
}
function due(){const n=seq();return read().filter(x=>x.status!=='mastered'&&x.dueMarker<=n)}
function injectEntry(){
 const path=location.pathname; if(!/\/school-(?:home|day)\/?$/i.test(path))return;
 if(document.querySelector('[data-hc-review-entry]'))return;
 const list=read(),d=due(); if(!list.length)return;
 const box=document.createElement('section');box.dataset.hcReviewEntry='1';box.style.cssText='margin:18px auto;max-width:1180px;padding:18px 20px;border:1px solid #e0d2c7;border-radius:20px;background:#fffaf5;color:#2a211c;font-family:Georgia,serif;box-shadow:0 14px 35px rgba(45,31,24,.07)';
 box.innerHTML=`<div style="font:800 9px Arial;letter-spacing:.14em;color:#b96f68;text-transform:uppercase">Révisions</div><div style="display:flex;justify-content:space-between;gap:18px;align-items:center;margin-top:7px"><div><div style="font-size:24px">${d.length?`${d.length} notion${d.length>1?'s':''} à revoir`:'Mes fiches de cours'}</div><div style="font-size:13px;color:#77655d;margin-top:4px">${d.length?'Une notion vue plus tôt revient maintenant.':'Tes exemples et erreurs restent disponibles.'}</div></div><button style="border:0;border-radius:999px;background:#2a211c;color:white;padding:12px 16px;cursor:pointer" onclick="location.href='../school-review/'">Ouvrir mes révisions</button></div>`;
 const main=document.querySelector('main')||document.body; main.appendChild(box);
}
const obs=new MutationObserver(()=>{capture();injectEntry()});obs.observe(document.body,{subtree:true,childList:true});
setTimeout(injectEntry,500);
window.HCAfterCourseReview={read,due,capture};
})();