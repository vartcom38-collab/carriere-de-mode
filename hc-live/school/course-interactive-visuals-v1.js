/* Haute Couture Live — supports pédagogiques interactifs v1 */
(function(){
'use strict';
if(window.HCCourseInteractiveVisualsV1)return;
if(!/\/school-course\/?$/i.test(location.pathname))return;
const id=new URLSearchParams(location.search).get('id')||'';
const supported=['w1-drawing','w1-assembly'];
if(!supported.includes(id)){window.HCCourseInteractiveVisualsV1={active:false};return}

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
 }
};
const D=data[id];
const css=document.createElement('style');css.id='hc-course-interactive-visuals-css';css.textContent=`
.hciv{margin:18px 0 20px;padding:0;border-radius:20px;overflow:hidden;background:#201714;color:white;box-shadow:0 22px 60px rgba(36,23,18,.18)}
.hciv-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-end;padding:18px 20px 14px;background:#fffaf5;color:#2b211c}.hciv-k{font:800 9px/1 Arial,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#b96f68;margin-bottom:6px}.hciv-head h4{font:25px/1.08 Georgia,serif;font-weight:400;margin:0}.hciv-head p{font:12px/1.45 Georgia,serif;color:#74635a;max-width:430px;margin:0}.hciv-photo{position:relative;height:320px;background:#2b211c center/cover no-repeat;overflow:hidden}.hciv-photo:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(17,11,9,.48));pointer-events:none}.hciv-point{position:absolute;z-index:2;width:28px;height:28px;border-radius:50%;border:2px solid rgba(255,255,255,.95);background:rgba(145,70,84,.88);box-shadow:0 8px 25px rgba(0,0,0,.25);transform:translate(-50%,-50%);cursor:pointer;color:white;font:800 10px/1 Arial,sans-serif}.hciv-point:before{content:'+'}.hciv-point.active{background:#fff;color:#5b343a;border-color:#fff;transform:translate(-50%,-50%) scale(1.08)}.hciv-point.active:before{content:'✓'}.hciv-note{position:absolute;z-index:3;left:18px;right:18px;bottom:16px;min-height:56px;padding:12px 14px;border-radius:14px;background:rgba(29,20,16,.82);backdrop-filter:blur(12px);font:13px/1.45 Georgia,serif;opacity:0;transform:translateY(8px);transition:.18s;pointer-events:none}.hciv-note.show{opacity:1;transform:none}.hciv-note b{display:block;font:800 9px/1 Arial,sans-serif;letter-spacing:.11em;text-transform:uppercase;color:#f0c2bd;margin-bottom:4px}.hciv-foot{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:11px 16px;background:#2d211c;color:#d9c9be;font:10px/1.3 Arial,sans-serif}.hciv-progress{display:flex;gap:5px}.hciv-progress i{width:22px;height:3px;border-radius:10px;background:#6c574d}.hciv-progress i.on{background:#e6b2ad}.hciv-done{color:#f2d8d5;opacity:0}.hciv-done.show{opacity:1}@media(max-width:760px){.hciv-head{display:block}.hciv-head p{margin-top:8px}.hciv-photo{height:280px}}
`;document.head.appendChild(css);

function mount(){
 const host=document.querySelector('.hcsi2,#sheet .practiceBox,#sheet');
 if(!host||host.querySelector('.hciv'))return;
 const box=document.createElement('section');box.className='hciv';
 box.innerHTML=`<div class="hciv-head"><div><div class="hciv-k">Support visuel de séance</div><h4>${D.title}</h4></div><p>${D.intro}</p></div><div class="hciv-photo"><div class="hciv-note"><b></b><span></span></div></div><div class="hciv-foot"><span>${D.credit}</span><div class="hciv-progress"></div><span class="hciv-done">Repères lus ✓</span></div>`;
 const photo=box.querySelector('.hciv-photo');photo.style.backgroundImage=`linear-gradient(180deg,rgba(0,0,0,.03),rgba(0,0,0,.07)),url("${D.image}")`;
 const note=box.querySelector('.hciv-note'),prog=box.querySelector('.hciv-progress');
 const seen=new Set();
 D.points.forEach((p,i)=>{
   const b=document.createElement('button');b.type='button';b.className='hciv-point';b.style.left=p.x+'%';b.style.top=p.y+'%';b.setAttribute('aria-label',p.label);
   const pip=document.createElement('i');prog.appendChild(pip);
   b.addEventListener('click',()=>{seen.add(i);b.classList.add('active');pip.classList.add('on');note.querySelector('b').textContent=p.label;note.querySelector('span').textContent=p.note;note.classList.add('show');if(seen.size===D.points.length)box.querySelector('.hciv-done').classList.add('show')});
   photo.appendChild(b);
 });
 host.prepend(box);
}
setTimeout(mount,150);setTimeout(mount,600);new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});
window.HCCourseInteractiveVisualsV1={active:true,id,mount};
})();