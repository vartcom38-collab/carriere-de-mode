/* Haute Couture Live — couche "vrai cours" v1
   Ajoute aux cours existants : démonstration prof, exemple, contre-exemple, correction.
   Le programme et les étapes existantes restent la source de progression.
*/
(function(){
'use strict';
if(window.HCCourseRealClassLayerV1)return;
if(!/\/school-course\/?$/i.test(location.pathname))return;
const id=new URLSearchParams(location.search).get('id')||'';
const DATA={
 'w1-welcome':{
  title:'Voir la méthode en action',
  steps:[
   ['1 · Observer','Maud pose une paire de ciseaux fermée. Elle ne demande pas ce que cela évoque. Elle décrit seulement : deux lames longues, un axe central, deux anneaux, une articulation, une direction dominante.'],
   ['2 · Interpréter','Ensuite seulement : articulation, ouverture, fermeture, tension, protection, répétition. Ce sont des lectures possibles, pas des faits.'],
   ['3 · Formuler une intention','À partir de « articulation », elle formule : créer une construction qui s’ouvre sans perdre sa continuité. Elle n’a toujours pas décidé s’il s’agira d’une robe, d’une veste ou d’un détail.'],
   ['4 · Chercher plusieurs solutions','Panneaux articulés, fentes contrôlées, plis mobiles ou pièces superposées peuvent répondre à la même intention. Le premier dessin n’est donc pas automatiquement la solution.']
  ],
  good:'Observation : deux éléments longs pivotent autour d’un axe commun.',
  bad:'Ces ciseaux sont élégants et me font penser à un oiseau.',
  correction:'La deuxième phrase mélange jugement esthétique et interprétation. Elle peut devenir utile plus tard, mais elle n’est pas encore une observation.',
  source:'Repères : IFM BA Fashion Design · recherche, expérimentation, matière et intention.'
 },
 'w1-drawing':{
  title:'Voir une pose comme un professeur de dessin',
  steps:[
   ['1 · Ligne d’action','Claire réduit la pose à une seule direction. Tant que cette ligne générale n’est pas claire, elle ne dessine ni mains, ni visage, ni vêtement.'],
   ['2 · Appui','Elle cherche quelle jambe reçoit réellement le poids. Le bassin se place en conséquence ; les épaules répondent souvent en contrepoids.'],
   ['3 · Masses','Tête, cage thoracique et bassin sont posés comme trois masses simples orientées dans l’espace.'],
   ['4 · Vêtement','Le vêtement arrive par grandes masses : largeur, longueur, évasement, rapport au corps. Les plis ne viennent qu’après.']
  ],
  good:'Je vois une jambe porteuse claire, un bassin incliné et une cage qui compense.',
  bad:'Je commence par dessiner les yeux, les cheveux et les plis de la manche.',
  correction:'Le détail peut être séduisant tout en masquant une pose instable. Vérifie d’abord geste, appui et masses.',
  source:'Repères : IFM BA Fashion Design · dessin pour libérer la main et exercer le regard.'
 },
 'w1-textile':{
  title:'Faire une vraie lecture matière',
  steps:[
   ['1 · Sans étiquette','Inès cache la composition. Elle fait toucher, plier, suspendre et froisser l’échantillon avant de donner son nom.'],
   ['2 · Structure','On distingue d’abord tissé ou maille, puis stabilité, élasticité et direction. Sur un tissé, on compare chaîne, trame et biais.'],
   ['3 · Comportement','On décrit surface, main, poids, épaisseur, transparence, nervosité et tombé.'],
   ['4 · Usage','L’usage vient à la fin : une matière est choisie parce que son comportement sert le volume et la construction voulus.']
  ],
  good:'Surface légèrement duveteuse, souple, peu nerveuse, plis arrondis et poids moyen.',
  bad:'C’est du coton, donc c’est un bon tissu pour une robe.',
  correction:'La composition seule ne suffit pas. Deux cotons peuvent avoir des structures, poids, finitions et tombés très différents.',
  source:'Repères : FIT TS 131 · fibres, fils, étoffes et identification en laboratoire ; IFM · technologie textile.'
 },
 'w1-pattern':{
  title:'Lire un patron comme une hypothèse de volume',
  steps:[
   ['1 · Mesure corps','Samir distingue la mesure du corps de celle du vêtement. Elles ne sont presque jamais identiques.'],
   ['2 · Aisance','Il ajoute d’abord l’espace nécessaire au mouvement, puis l’aisance de style voulue.'],
   ['3 · Lignes fonctionnelles','Droit-fil, ligne de couture, valeur, pince et crans ont chacun une fonction précise.'],
   ['4 · Vérification 3D','La toile est montée et essayée. L’équilibre et le fit servent ensuite à corriger le patron papier.']
  ],
  good:'Je déplace la pince mais je conserve son volume autour du même point de pivot.',
  bad:'Je déplace la pointe et je ferme une quantité différente parce que la nouvelle ligne est plus jolie.',
  correction:'Un transfert de pince doit préserver le volume construit. Sinon tu modifies le fit, pas seulement le dessin des lignes.',
  source:'Repères : IFM patronage · transformer les bases en gardant le lien avec la 3D ; FIT PM 121 / FD 121.'
 },
 'w1-drape':{
  title:'Lire la toile avant de la corriger',
  steps:[
   ['1 · Préparer','La toile est orientée, marquée et posée sur le mannequin avec le moins d’épingles possible au départ.'],
   ['2 · Ancrer','On fixe les points nécessaires pour stabiliser la matière sans la bloquer partout.'],
   ['3 · Lire les forces','Plis rayonnants, diagonales tendues et excès indiquent où la matière subit tension, compression ou surplus.'],
   ['4 · Décider','L’excès peut devenir pince, pli, fronce, découpe ou volume volontaire. On ne le supprime pas automatiquement.']
  ],
  good:'La tension part de l’ancrage vers l’emmanchure ; je cherche d’abord pourquoi.',
  bad:'Je mets une épingle sur chaque pli jusqu’à ce que tout soit plat.',
  correction:'Multiplier les épingles peut cacher le comportement réel de la toile. Observe la cause avant de contraindre la matière.',
  source:'Repères : IFM moulage ; FIT FD 117 · proportion, équilibre, forme et manipulation de toile sur mannequin.'
 },
 'w1-culture':{
  title:'Transformer une image en vraie référence',
  steps:[
   ['1 · Identifier','On relève auteur ou maison, date, type d’objet, collection et provenance quand ces informations existent.'],
   ['2 · Contextualiser','On cherche pourquoi cette silhouette ou cette technique apparaît à ce moment-là.'],
   ['3 · Analyser','On décrit construction, proportion, matière, fonction, détail et relation au corps.'],
   ['4 · Transformer','On formule ce qu’on retient précisément pour son propre projet, sans copier l’image entière.']
  ],
  good:'Je retiens la façon dont le poids est projeté à l’arrière par la structure de soutien.',
  bad:'J’adore cette robe ancienne, je vais faire la même en moderne.',
  correction:'Une référence utile doit répondre à une question précise. Sinon elle reste une image d’ambiance.',
  source:'Repères : The Met Costume Institute / Heilbrunn Timeline · sources contextualisées pour l’étude du vêtement.'
 },
 'w1-assembly':{
  title:'Construire un ordre opératoire',
  steps:[
   ['1 · Lire la pièce','Avant de piquer, on identifie les zones qui devront encore être accessibles plus tard.'],
   ['2 · Préparer','Thermocollage, marquages, surfilage éventuel et contrôles sont faits avant que certaines coutures ne ferment l’accès.'],
   ['3 · Assembler','Les coutures sont réalisées dans un ordre qui permet précision, correspondance et manipulation propre.'],
   ['4 · Presser et contrôler','Le pressage accompagne le montage ; on contrôle chaque étape avant de rendre l’erreur plus difficile à corriger.']
  ],
  good:'Je prépare et presse la couture avant de fermer la zone qui la rendra inaccessible.',
  bad:'Je ferme d’abord toutes les grandes coutures puis je verrai les finitions à la fin.',
  correction:'Une mauvaise séquence peut rendre une zone impossible à presser, retourner ou finir correctement.',
  source:'Repères : IFM montage et finitions main/machine ; FIT FD 133 et FD 231.'
 }
};
const D=DATA[id];
if(!D){window.HCCourseRealClassLayerV1={active:false,id};return}
const css=document.createElement('style');css.id='hc-real-class-css';css.textContent=`
.hcrc-trigger{border:1px solid rgba(94,64,52,.18);background:#fff8f1;color:#4b382f;border-radius:999px;padding:10px 14px;font:800 9px/1 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;margin:10px 8px 0 0}.hcrc-trigger:hover{background:#f2e6dc}.hcrc{margin:18px 0;padding:0;border:1px solid rgba(94,64,52,.15);border-radius:20px;overflow:hidden;background:#fffdf9;box-shadow:0 14px 34px rgba(50,30,23,.08)}.hcrc-head{padding:16px 18px;background:#efe3da}.hcrc-k{font:800 8px/1 Arial,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#a35d5c}.hcrc-head h4{margin:6px 0 0;font:24px/1.1 Georgia,serif;font-weight:400}.hcrc-step{padding:18px;min-height:120px}.hcrc-step b{display:block;margin-bottom:7px;font:18px/1.2 Georgia,serif;font-weight:400}.hcrc-step p{margin:0;font:14px/1.6 Georgia,serif;color:#65544b}.hcrc-nav{display:flex;justify-content:space-between;gap:8px;padding:0 18px 16px}.hcrc-nav button{border:0;border-radius:999px;padding:10px 13px;background:#2d211c;color:#fff;font:800 8px/1 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}.hcrc-nav button:disabled{opacity:.35}.hcrc-compare{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 18px 18px}.hcrc-case{border-radius:15px;padding:14px;background:#f4eee8}.hcrc-case.bad{background:#fff0ed}.hcrc-case strong{display:block;font:800 8px/1 Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px}.hcrc-case p{margin:0;font:13px/1.5 Georgia,serif}.hcrc-correction{margin:0 18px 16px;padding:13px 14px;border-left:3px solid #a35d5c;background:#faf2ec;font:italic 13px/1.55 Georgia,serif}.hcrc-source{padding:11px 18px;background:#2f231e;color:#d9c7ba;font:9px/1.45 Arial,sans-serif;letter-spacing:.02em}@media(max-width:700px){.hcrc-compare{grid-template-columns:1fr}}
`;document.head.appendChild(css);
function build(){
 const root=document.createElement('section');root.className='hcrc';let i=0;
 root.innerHTML=`<div class="hcrc-head"><div class="hcrc-k">Démonstration du professeur</div><h4>${D.title}</h4></div><div class="hcrc-step"><b></b><p></p></div><div class="hcrc-nav"><button type="button" data-prev>← Précédent</button><button type="button" data-next>Étape suivante →</button></div><div class="hcrc-compare"><div class="hcrc-case"><strong>Formulation utile</strong><p>${D.good}</p></div><div class="hcrc-case bad"><strong>Erreur typique</strong><p>${D.bad}</p></div></div><div class="hcrc-correction">${D.correction}</div><div class="hcrc-source">${D.source}</div>`;
 const b=root.querySelector('.hcrc-step b'),p=root.querySelector('.hcrc-step p'),prev=root.querySelector('[data-prev]'),next=root.querySelector('[data-next]');
 function render(){b.textContent=D.steps[i][0];p.textContent=D.steps[i][1];prev.disabled=i===0;next.textContent=i===D.steps.length-1?'Revoir depuis le début':'Étape suivante →'}
 prev.onclick=()=>{if(i>0)i--;render()};next.onclick=()=>{i=i===D.steps.length-1?0:i+1;render()};render();return root;
}
function enhance(){
 const sheet=document.querySelector('#sheet,.sheet');if(!sheet||sheet.dataset.hcrcReady)return;sheet.dataset.hcrcReady='1';
 const actions=sheet.querySelector('.actions')||sheet.querySelector('.practiceBox')||sheet;
 const btn=document.createElement('button');btn.type='button';btn.className='hcrc-trigger';btn.textContent='Montre-moi un exemple';
 btn.onclick=()=>{let panel=sheet.querySelector('.hcrc');if(panel){panel.remove();btn.textContent='Montre-moi un exemple';return}panel=build();const host=sheet.querySelector('.practiceBox')||actions;host.parentNode.insertBefore(panel,host.nextSibling);btn.textContent='Masquer la démonstration';panel.scrollIntoView({behavior:'smooth',block:'nearest'})};
 if(actions.classList?.contains('actions'))actions.prepend(btn);else actions.parentNode.insertBefore(btn,actions);
}
setTimeout(enhance,200);setTimeout(enhance,700);new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
window.HCCourseRealClassLayerV1={active:true,id,data:D,enhance};
})();