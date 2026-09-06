/* Haute Couture Live — critique de promo en atelier v1 */
(function(){
'use strict';
if(window.HCSchoolPeerCritiqueV1)return;
const match=location.pathname.match(/school-year(\d+)-project(\d+)/i);if(!match)return;
const projectId=`year${Number(match[1])}-project${Number(match[2])}`;
const BKEY='haute-couture-school-open-brief-v1';
const RKEY='haute-couture-school-peer-critique-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const peers=[
 {id:'lea',name:'Léa',lens:'silhouette',line:'Je regarde surtout si la silhouette se lit immédiatement.'},
 {id:'yanis',name:'Yanis',lens:'construction',line:'Je regarde si ce que tu proposes peut vraiment tenir en construction.'},
 {id:'mila',name:'Mila',lens:'matiere',line:'Je regarde ce que la matière apporte que le dessin seul ne pourrait pas faire.'},
 {id:'sacha',name:'Sacha',lens:'observation',line:'Je regarde si ton point de départ est encore perceptible sans être copié.'},
 {id:'nora',name:'Nora',lens:'concept',line:'Je regarde si la piste prend assez de risque pour devenir vraiment personnelle.'}
];
function brief(){return read(BKEY,{projects:{}})?.projects?.[projectId]||{}}
function state(){return read(RKEY,{projects:{}})}
function save(s){s.projects=s.projects||{};write(RKEY,s)}
function feedback(peer){const p=brief(),dirs=Array.isArray(p.directions)?p.directions.filter(x=>String(x||'').trim().length>20):[],refs=Array.isArray(p.referenceUse)?p.referenceUse.filter(x=>String(x||'').trim().length>18):[];switch(peer.lens){
 case'construction':return p.tests&&p.tests.length>35?'« Tes essais rendent la piste crédible. Maintenant je vérifierais juste ce qui se passe aux jonctions et aux fermetures. »':'« J’aime l’idée, mais je ne sais pas encore comment elle tient. Je ferais une toile très simple avant d’aller plus loin. »';
 case'matiere':return p.materials&&p.materials.length>30?'« Ta matière commence à avoir un rôle. Je comparerais quand même une seconde option pour voir si ton choix est vraiment nécessaire. »':'« Là, la matière ressemble encore à un remplissage. Qu’est-ce qu’elle doit faire physiquement dans le projet ? »';
 case'observation':return refs.length>=2?'« On sent que tes références ont été transformées. Je garderais une trace très claire de ce que tu as déplacé ou refusé. »':'« Je vois les références, mais pas encore assez ce que tu en fais. Qu’est-ce qui reste quand on enlève l’image source ? »';
 case'concept':return dirs.length>=3?'« Tu as plusieurs pistes, mais laquelle te met le plus en danger ? C’est peut-être celle qu’il faut pousser une heure de plus. »':'« Tes variantes restent proches. J’essaierais une piste qui contredit complètement la première. »';
 default:return dirs.length>=2?'« La silhouette commence à se lire. Je regarderais maintenant laquelle raconte le plus clairement ton intention sans explication. »':'« Je ferais encore deux silhouettes très différentes avant de choisir. Là, tu décides peut-être trop tôt. »';}}
const css=document.createElement('style');css.textContent=`.hcpc{margin:16px 0;padding:18px;border-radius:16px;background:#fff9f4;border:1px solid #dfd0c5}.hcpc .k{font:800 8px/1 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#9a6067}.hcpc h3{font:26px/1.1 Georgia,serif;font-weight:400;margin:6px 0}.hcpc p{font:13px/1.55 Georgia,serif;color:#6e5d55}.hcpc-peers{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.hcpc button{border:1px solid #dccbc0;background:#fff;border-radius:999px;padding:9px 12px;cursor:pointer;font:12px Georgia,serif}.hcpc button.active{background:#7e3038;color:white;border-color:#7e3038}.hcpc-feedback{display:none;margin-top:12px;padding:14px 15px;border-radius:13px;background:#f2e9e2;font:14px/1.55 Georgia,serif;color:#574941}.hcpc-feedback.show{display:block}`;document.head.appendChild(css);
function mount(){if(document.querySelector('.hcpc'))return;const target=document.getElementById('hc-open-brief')||document.querySelector('main .card')||document.querySelector('main');if(!target)return;const box=document.createElement('section');box.className='hcpc';box.innerHTML=`<div class="k">Atelier · critique de promo</div><h3>Demander un regard à quelqu’un de la promo</h3><p>Un camarade ne remplace pas le professeur. Son retour peut être pertinent, incomplet ou en désaccord avec le jury — exactement comme dans un vrai atelier.</p><div class="hcpc-peers"></div><div class="hcpc-feedback"></div>`;const list=box.querySelector('.hcpc-peers'),fb=box.querySelector('.hcpc-feedback');peers.forEach(peer=>{const b=document.createElement('button');b.textContent=peer.name;b.title=peer.line;b.onclick=()=>{list.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');const msg=feedback(peer);fb.innerHTML=`<b>${peer.name}</b> — ${msg}`;fb.classList.add('show');const s=state();s.projects=s.projects||{};const rec=s.projects[projectId]||(s.projects[projectId]={history:[]});rec.history=rec.history||[];rec.history.push({peerId:peer.id,peer:peer.name,feedback:msg,at:new Date().toISOString()});rec.history=rec.history.slice(-20);save(s)};list.appendChild(b)});target.insertAdjacentElement('afterend',box)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();setTimeout(mount,600);new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true});
window.HCSchoolPeerCritiqueV1={active:true,mount,feedback};
})();