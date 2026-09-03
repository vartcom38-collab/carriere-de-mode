/* Haute Couture Live — opportunités de carrière v1 */
(function(){
'use strict';
if(window.HCCareerOpportunities)return;
const K='haute-couture-career-opportunities-v1',O='haute-couture-client-orders-v1',P='haute-couture-creative-projects-v1',A='haute-couture-atelier-active-project-v1';
const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??f}catch(_){return f}},write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(_){return false}};
const defs=[
{id:'opp-client-local',rep:5,type:'client',title:'Commande privée — Élise Martel',subtitle:'Cliente locale · cérémonie',desc:'Une cliente recommandée par bouche-à-oreille cherche une tenue de cérémonie élégante.',client:{clientName:'Élise Martel',clientRole:'Cliente privée',garment:'Robe de cérémonie',occasion:'Mariage civil',notes:'Je veux quelque chose de très élégant mais pas trop classique.',budget:650,reward:650,estimatedMinutes:540,brief:{style:'Élégant contemporain',paletteLiked:['ivoire','sauge','poudre'],paletteAvoid:['noir intégral'],materialsPreferred:['crêpe','soie']}}},
{id:'opp-collab-boutique',rep:15,type:'collaboration',title:'Collaboration — Boutique Passage',subtitle:'Capsule locale · 3 silhouettes',desc:'Une boutique indépendante te propose une mini-capsule vitrine.',project:{name:'Capsule Boutique Passage',type:'collaboration',subtitle:'Collaboration locale · 3 silhouettes',category:'Collaboration',idea:'Créer trois silhouettes cohérentes, portables et identifiables pour une vitrine de créateur.',targetLooks:3}},
{id:'opp-contest-national',rep:25,type:'contest',title:'Nouvelle Silhouette France',subtitle:'Concours national débloqué',desc:'Ta notoriété te permet désormais de candidater au concours national.',href:'./concours/'},
{id:'opp-client-prestige',rep:40,type:'client',title:'Commande privée — Maison Valmont',subtitle:'Cliente prestige · gala',desc:'Une cliente plus exigeante arrive par recommandation professionnelle.',client:{clientName:'Ariane Valmont',clientRole:'Collectionneuse & mécène',garment:'Robe du soir',occasion:'Gala caritatif',notes:'Je cherche une pièce forte, sophistiquée, avec une vraie signature.',budget:2200,reward:2200,estimatedMinutes:1080,brief:{style:'Couture sculpturale',paletteLiked:['grenat','champagne','bleu nuit'],paletteAvoid:['pastels enfantins'],materialsPreferred:['gazar','soie','organza']}}},
{id:'opp-collab-editorial',rep:60,type:'collaboration',title:'Collaboration éditoriale',subtitle:'Direction artistique · série mode',desc:'Un média mode te propose une collaboration créative autour d’une série éditoriale.',project:{name:'Série éditoriale — Matière vivante',type:'collaboration',subtitle:'Éditorial · direction artistique',category:'Éditorial',idea:'Créer une silhouette manifeste autour de la matière, du volume et du mouvement.',targetLooks:1}},
{id:'opp-runway-paris',rep:80,type:'runway',title:'Paris Emerging Designers Show',subtitle:'Invitation prestige',desc:'Ton niveau de visibilité te rend éligible au show de créateurs émergents à Paris.',href:'./defiles/'},
{id:'opp-house-request',rep:110,type:'collaboration',title:'Demande professionnelle — Maison invitée',subtitle:'Projet spécial · prestige',desc:'Une maison extérieure te contacte pour une proposition de silhouette signature.',project:{name:'Projet Maison invitée',type:'collaboration',subtitle:'Commande créative prestige',category:'Maison invitée',idea:'Développer une silhouette signature répondant à un brief de maison tout en conservant ton identité.',targetLooks:1}}
];
function game(){return window.HCGame||null}function rep(){return Number(game()?.get?.().player?.reputation||0)}
function state(){let s=read(K,{});if(!s||Array.isArray(s))s={};return s}function save(s){write(K,s)}
function activeOrder(){return read(O,[]).find(x=>!['delivered','completed','cancelled','production_scheduled'].includes(x.status))||null}
function scan(){const s=state(),r=rep();for(const d of defs){if(r<d.rep||s[d.id]?.notified)continue;s[d.id]={...(s[d.id]||{}),status:s[d.id]?.status||'available',unlockedAt:new Date().toISOString(),notified:true};game()?.addMessage?.({id:'career-'+d.id,from:'Carrière',avatar:'✦',subject:'Nouvelle opportunité',text:`${d.title} — ${d.desc}`})}save(s);return s}
function accept(id){const d=defs.find(x=>x.id===id);if(!d||rep()<d.rep)return{ok:false,reason:'locked'};const s=state();if(d.type==='client'){
 if(activeOrder())return{ok:false,reason:'active-order'};
 const c=d.client,o={id:'career-order-'+d.id,source:'career-opportunity',opportunityId:d.id,status:'accepted',progress:'designing',createdAt:new Date().toISOString(),...c};let a=read(O,[]);a=[o,...a.filter(x=>x.id!==o.id)];write(O,a.slice(0,100));write(A,{id:o.id,name:o.garment,type:'client',subtitle:o.clientName+' · '+o.occasion,source:'order',selectedAt:new Date().toISOString()});s[id]={...(s[id]||{}),status:'accepted',acceptedAt:new Date().toISOString()};save(s);return{ok:true,type:'client',target:'atelier'}
 }
 if(d.type==='collaboration'){
 const p={id:'career-project-'+d.id,source:'career-opportunity',opportunityId:d.id,status:'active',createdAt:new Date().toISOString(),...d.project};let a=read(P,[]);if(!a.some(x=>x.id===p.id))a.unshift(p);write(P,a.slice(0,250));write(A,{id:p.id,name:p.name,type:p.type,subtitle:p.subtitle,source:'creative-project',idea:p.idea,selectedAt:new Date().toISOString()});s[id]={...(s[id]||{}),status:'accepted',acceptedAt:new Date().toISOString()};save(s);return{ok:true,type:'collaboration',target:'atelier'}
 }
 s[id]={...(s[id]||{}),status:'seen',seenAt:new Date().toISOString()};save(s);return{ok:true,type:d.type,target:d.href||null}
}
function list(){scan();const s=state(),r=rep();return defs.map(d=>({...d,unlocked:r>=d.rep,state:s[d.id]||{status:r>=d.rep?'available':'locked'}}))}
window.addEventListener('hc-game-state',()=>setTimeout(scan,30));setTimeout(scan,150);
window.HCCareerOpportunities={version:1,list,accept,scan,rep,activeOrder};

const loadGlobal=(name,tag)=>{
  if(document.querySelector(`script[${tag}]`))return;
  const script=document.createElement('script');
  const here=document.currentScript&&document.currentScript.src?new URL(document.currentScript.src,location.href):null;
  script.src=here?new URL(name,here).href:name;
  script.defer=true;script.setAttribute(tag,'1');
  document.head.appendChild(script);
};
if(!window.HCServerSave)loadGlobal('server-save-bridge-v1.js?v=20260903-server1','data-hc-server-save');
if(!window.HCGlobalMenu)loadGlobal('global-menu-v1.js?v=20260903-menu1','data-hc-global-menu');
})();