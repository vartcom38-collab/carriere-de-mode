/* Haute Couture Live — supports pédagogiques interactifs v2 */
(function(){
'use strict';
if(window.HCCourseInteractiveVisualsV2)return;
if(!/\/school-course\/?$/i.test(location.pathname))return;
const id=new URLSearchParams(location.search).get('id')||'';
const supported=['w1-drawing','w1-assembly','w1-pattern','w1-drape'];
if(!supported.includes(id)){window.HCCourseInteractiveVisualsV2={active:false};return}

const data={
 'w1-drawing':{
   title:'Lire une pose avant de dessiner',
   intro:'Clique les repères qui organisent réellement la pose. Commence par la structure, pas par le vêtement.',
   image:'https://unsplash.com/photos/dXfhAOU4moY/download?force=true&w=1200',
   credit:'Photo de pose · support d’observation',
   points:[
    {x:50,y:21,label:'Ligne d’action',note:'Cherche d’abord la direction générale du corps. Elle organise toute la pose.'},
    {x:49,y:48,label:'Bassin',note:'Le bassin te renseigne sur l’appui et sur la répartition du poids.'},
    {x:38,y:78,label:'Jambe porteuse',note:'La jambe qui reçoit le poids doit rendre l’équilibre crédible.'}
   ]
 },
 'w1-assembly':{
   title:'Lire le poste de montage',
   intro:'Repère les éléments qui comptent avant même de piquer : guidage, zone d’assemblage et accessibilité.',
   image:'https://burst.shopifycdn.com/photos/angled-view-of-sewing-machine-use.jpg?exif=0&format=pjpg&iptc=0&width=1200',
   credit:'Machine à coudre en action · Burst / Shopify',
   points:[
    {x:47,y:44,label:'Pied presseur',note:'Le pied maintient la matière pendant que l’aiguille forme la couture.'},
    {x:51,y:58,label:'Ligne de piqûre',note:'Tu dois savoir où passe réellement la ligne d’assemblage, distincte du bord brut.'},
    {x:66,y:67,label:'Guidage du tissu',note:'Le tissu est guidé sans être tiré : la régularité dépend aussi du geste.'}
   ]
 },
 'w1-pattern':{
   title:'Lire un patron comme une carte du volume',
   intro:'Repère sur la table ce qui permet d’orienter, de former et d’assembler. Un patron se lit avant de se découper.',
   image:'https://images.unsplash.com/photo-fPmQNx7cf0E?auto=format&fit=crop&w=1200&q=86',
   credit:'Travail de patronage · support d’observation',
   points:[
    {x:43,y:54,label:'Droit-fil',note:'Le droit-fil oriente la pièce par rapport à la structure du tissu. Une mauvaise orientation peut modifier tombé et stabilité.'},
    {x:58,y:45,label:'Pince',note:'La pince retire de la surface plane pour construire un volume autour du corps. Elle se lit comme une décision de volume.'},
    {x:69,y:62,label:'Crans',note:'Les crans sont des repères de correspondance. Ils servent à contrôler l’assemblage entre plusieurs pièces.'}
   ]
 },
 'w1-drape':{
   title:'Lire la toile sur le mannequin',
   intro:'Observe ce que la matière raconte avant de vouloir la corriger. Clique les signes qui permettent de lire le volume.',
   image:'https://images.unsplash.com/photo-2UbbVpHWb58?auto=format&fit=crop&w=1200&q=86',
   credit:'Moulage sur mannequin · support d’observation',
   points:[
    {x:48,y:29,label:'Point d’ancrage',note:'Un ancrage fixe localement la toile. Plus tu multiplies les points trop tôt, plus tu empêches la matière de révéler son comportement.'},
    {x:57,y:48,label:'Tension',note:'Des plis qui rayonnent ou une diagonale tendue signalent une force. Une tension est d’abord une information à lire.'},
    {x:43,y:68,label:'Excès de matière',note:'L’excès peut devenir pince, pli, fronce, découpe ou volume volontaire. Il ne faut pas le supprimer automatiquement.'}
   ]
 }
};
const D=data[id];
const css=document.createElement('style');css.id='hc-course-interactive-visuals-css';css.textContent=`
.hciv{margin:18px 0 20px;padding:0;border-radius:20px;overflow:hidden;background:#201714;color:white;box-shadow:0 22px 60px rgba(36,23,18,.18)}
.hciv-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-end;padding:18px 20px 14px;background:#fffaf5;color:#2b211c}.hciv-k{font:800 9px/1 Arial,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#b96f68;margin-bottom:6px}.hciv-head h4{font:25px/1.08 Georgia,serif;font-weight:400;margin:0}.hciv-head p{font:12px/1.45 Georgia,serif;color:#74635a;max-width:430px;margin:0}.hciv-photo{position:relative;height:320px;background:#2b211c center/cover no-repeat;overflow:hidden}.hciv-photo:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(17,11,9,.48));pointer-events:none}.hciv-point{position:absolute;z-index:2;width:30px;height:30px;border-radius:50%;border:2px solid rgba(255,255,255,.95);background:rgba(145,70,84,.9);box-shadow:0 8px 25px rgba(0,0,0,.25);transform:translate(-50%,-50%);cursor:pointer;color:white;font:800 10px/1 Arial,sans-serif}.hciv-point:before{content:'+'}.hciv-point.active{background:#fff;color:#5b343a;border-color:#fff;transform:translate(-50%,-50%) scale(1.08)}.hciv-point.active:before{content:'✓'}.hciv-note{position:absolute;z-index:3;left:18px;right:18px;bottom:16px;min-height:56px;padding:12px 14px;border-radius:14px;background:rgba(29,20,16,.84);backdrop-filter:blur(12px);font:13px/1.45 Georgia,serif;opacity:0;transform:translateY(8px);transition:.18s;pointer-events:none}.hciv-note.show{opacity:1;transform:none}.hciv-note b{display:block;font:800 9px/1 Arial,sans-serif;letter-spacing:.11em;text-transform:uppercase;color:#f0c2bd;margin-bottom:4px}.hciv-foot{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:11px 16px;background:#2d211c;color:#d9c9be;font:10px/1.3 Arial,sans-serif}.hciv-progress{display:flex;gap:5px}.hciv-progress i{width:22px;height:3px;border-radius:10px;background:#6c574d}.hciv-progress i.on{background:#e6b2ad}.hciv-done{color:#f2d8d5;opacity:0}.hciv-done.show{opacity:1}.hciv-label{position:absolute;z-index:2;transform:translate(-50%,18px);padding:5px 7px;border-radius:999px;background:rgba(29,20,16,.74);color:#fff;font:800 7px/1 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;pointer-events:none;opacity:0;transition:.18s}.hciv-label.show{opacity:1}@media(max-width:760px){.hciv-head{display:block}.hciv-head p{margin-top:8px}.hciv-photo{height:280px}}
`;document.head.appendChild(css);

function mount(){
 const host=document.querySelector('.hcsi2,#sheet .practiceBox,#sheet');
 if(!host||host.querySelector('.hciv'))return;
 const box=document.createElement('section');box.className='hciv';
 box.innerHTML=`<div class="hciv-head"><div><div class="hciv-k">Observation active</div><h4>${D.title}</h4></div><p>${D.intro}</p></div><div class="hciv-photo"><div class="hciv-note"><b></b><span></span></div></div><div class="hciv-foot"><span>${D.credit}</span><div class="hciv-progress"></div><span class="hciv-done">Repères lus ✓</span></div>`;
 const photo=box.querySelector('.hciv-photo');photo.style.backgroundImage=`linear-gradient(180deg,rgba(0,0,0,.03),rgba(0,0,0,.07)),url("${D.image}")`;
 const note=box.querySelector('.hciv-note'),prog=box.querySelector('.hciv-progress');
 const seen=new Set();
 D.points.forEach((p,i)=>{
   const b=document.createElement('button');b.type='button';b.className='hciv-point';b.style.left=p.x+'%';b.style.top=p.y+'%';b.setAttribute('aria-label',p.label);
   const lab=document.createElement('span');lab.className='hciv-label';lab.style.left=p.x+'%';lab.style.top=p.y+'%';lab.textContent=p.label;photo.appendChild(lab);
   const pip=document.createElement('i');prog.appendChild(pip);
   b.addEventListener('click',()=>{seen.add(i);b.classList.add('active');lab.classList.add('show');pip.classList.add('on');note.querySelector('b').textContent=p.label;note.querySelector('span').textContent=p.note;note.classList.add('show');if(seen.size===D.points.length)box.querySelector('.hciv-done').classList.add('show')});
   photo.appendChild(b);
 });
 host.prepend(box);
}
setTimeout(mount,150);setTimeout(mount,600);new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});
window.HCCourseInteractiveVisualsV2={active:true,id,mount};
window.HCCourseInteractiveVisualsV1=window.HCCourseInteractiveVisualsV2;
})();