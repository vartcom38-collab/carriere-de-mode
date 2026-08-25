/* Haute Couture Live — Atelier starter kit v1.
   L'atelier ne démarre jamais vide : bases maîtrisées + progression technique.
   Les matières de départ sont des références de création, pas du stock acheté.
*/
(function(){
'use strict';
if(window.__HC_ATELIER_STARTER_KIT__)return;window.__HC_ATELIER_STARTER_KIT__=true;
const SKILL_KEY='haute-couture-atelier-skills-v1';
const UNLOCK_KEY='haute-couture-atelier-unlocks-v1';
const REF_KEY='haute-couture-atelier-selected-reference-v1';
const STARTER_KEY='haute-couture-atelier-starter-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch(e){return f}},write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

const STARTER={
 materials:[
  {id:'ref-toile-coton-ecrue',name:'Toile de coton écrue',note:'Base de travail · stable · facile à comprendre',css:'linear-gradient(135deg,#e9dfcf,#f5efe4)'},
  {id:'ref-popeline-blanche',name:'Popeline blanche',note:'Légère · nette · idéale pour les volumes simples',css:'linear-gradient(135deg,#fbfaf7,#e8e4dc)'},
  {id:'ref-serge-noir',name:'Sergé noir',note:'Structuré · sobre · bonne base de silhouette',css:'linear-gradient(135deg,#222,#57524d)'}
 ],
 colors:[
  {id:'ivoire',name:'Ivoire',css:'#eee5d6'},{id:'noir',name:'Noir',css:'#24211f'},{id:'marine',name:'Bleu marine',css:'#263449'},{id:'beige',name:'Beige',css:'#cdb79e'},{id:'bordeaux',name:'Bordeaux',css:'#6f3540'}
 ],
 patterns:[
  {id:'uni',name:'Uni',css:'linear-gradient(135deg,#eee,#ddd)'},
  {id:'rayure-fine',name:'Rayure fine',css:'repeating-linear-gradient(90deg,#eee 0 7px,#9c9289 7px 9px)'},
  {id:'carreau-simple',name:'Carreau simple',css:'linear-gradient(90deg,#ddd 25%,transparent 25% 75%,#ddd 75%),linear-gradient(#ddd 25%,#f5f0ea 25% 75%,#ddd 75%)'}
 ]
};

function skillTier(){
 const explicit=read(SKILL_KEY,{}),char=read('haute-couture-custom-character',{}),game=window.parent?.HCGame?.get?.()||window.HCGame?.get?.()||{};
 const vals=[explicit.couture,explicit.technique,explicit.level,char?.skills?.couture,char?.competences?.couture,char.couture,char.skillCouture,game?.player?.level];
 let n=1;for(const v of vals){const x=Number(v);if(Number.isFinite(x))n=Math.max(n,x)}
 const rep=Number(game?.player?.reputation||0);if(rep>=30)n=Math.max(n,4);else if(rep>=15)n=Math.max(n,3);else if(rep>=6)n=Math.max(n,2);
 return Math.max(1,Math.min(4,Math.round(n)));
}
function limits(){const t=skillTier();return t===1?{tops:3,bottoms:3,details:2,colors:4,patterns:2,materials:2}:t===2?{tops:4,bottoms:4,details:3,colors:5,patterns:3,materials:3}:t===3?{tops:6,bottoms:6,details:5,colors:5,patterns:3,materials:3}:{tops:99,bottoms:99,details:99,colors:5,patterns:3,materials:3}}
function unlockedSet(){const u=read(UNLOCK_KEY,{}),raw=Array.isArray(u)?u:(u.pieces||u.items||u.unlocked||[]);return new Set((raw||[]).map(x=>slug(typeof x==='string'?x:(x.id||x.name))))}
function identifyPiece(el,i,kind){return slug(el.dataset?.id||el.dataset?.piece||el.querySelector('span')?.textContent||el.textContent||`${kind}-${i}`)}
function applyPieces(){
 const lim=limits(),extra=unlockedSet();
 [['tops',lim.tops],['bottoms',lim.bottoms],['details',lim.details]].forEach(([id,count])=>{
  const host=document.getElementById(id);if(!host)return;
  [...host.querySelectorAll('.piece')].forEach((el,i)=>{
   const pid=identifyPiece(el,i,id),ok=i<count||extra.has(pid);
   el.classList.toggle('hc-piece-locked',!ok);el.dataset.hcStarterState=ok?'base':'locked';
   if(!ok){el.draggable=false;el.setAttribute('aria-disabled','true')}else{el.removeAttribute('aria-disabled')}
  });
 });
}
function chooseRef(kind,item,button){
 const current=read(REF_KEY,{});current[kind]={...item,selectedAt:new Date().toISOString(),source:'starter-reference'};write(REF_KEY,current);
 document.querySelectorAll(`[data-hc-ref-kind="${kind}"]`).forEach(x=>x.classList.remove('hc-ref-selected'));button.classList.add('hc-ref-selected');
 toast(`${kind==='material'?'Matière':kind==='color'?'Couleur':'Motif'} de référence : ${item.name}`);
 window.dispatchEvent(new CustomEvent('hc-atelier-reference-selected',{detail:{kind,item}}));
}
function makeChip(kind,item){const b=document.createElement('button');b.className='chip hc-starter-chip';b.type='button';b.dataset.hcStarter='1';b.dataset.hcRefKind=kind;b.dataset.hcRefId=item.id;b.title=item.note||item.name;b.innerHTML=`<i style="background:${esc(item.css)}"></i>${esc(item.name)}`;b.onclick=()=>chooseRef(kind,item,b);return b}
function injectRefs(){
 const lim=limits(),cfg=[['materials','material',STARTER.materials.slice(0,lim.materials)],['colors','color',STARTER.colors.slice(0,lim.colors)],['patterns','pattern',STARTER.patterns.slice(0,lim.patterns)]];
 cfg.forEach(([hostId,kind,items])=>{const host=document.getElementById(hostId);if(!host)return;host.querySelectorAll('[data-hc-starter="1"]').forEach(x=>x.remove());const frag=document.createDocumentFragment();items.forEach(item=>frag.appendChild(makeChip(kind,item)));host.prepend(frag)});
 const sel=read(REF_KEY,{});Object.entries(sel).forEach(([kind,v])=>{const b=document.querySelector(`[data-hc-ref-kind="${kind}"][data-hc-ref-id="${CSS.escape(String(v?.id||''))}"]`);if(b)b.classList.add('hc-ref-selected')});
}
function header(){
 const lib=document.querySelector('.library');if(!lib||document.getElementById('hcStarterInfo'))return;
 const t=skillTier(),names=['','BASES DE DÉPART','BASES CONSOLIDÉES','TECHNIQUE INTERMÉDIAIRE','BIBLIOTHÈQUE ÉTENDUE'];
 const box=document.createElement('div');box.id='hcStarterInfo';box.innerHTML=`<b>${names[t]}</b><span>Niveau technique ${t}/4 · les cartes marquées 🔒 se débloquent par pratique, apprentissage, rencontres et progression.</span>`;
 const notice=lib.querySelector('.notice');notice?.insertAdjacentElement('afterend',box);
}
function css(){if(document.getElementById('hcStarterCss'))return;const s=document.createElement('style');s.id='hcStarterCss';s.textContent=`#hcStarterInfo{margin:10px 0 14px;border:1px solid #d9c8bb;background:#fffaf4;border-radius:12px;padding:10px}#hcStarterInfo b{display:block;font:15px Georgia,serif;color:#9d594e}#hcStarterInfo span{display:block;margin-top:3px;font:9px/1.4 Arial,sans-serif;color:#7c6e64}.piece.hc-piece-locked{position:relative;opacity:.42;cursor:not-allowed;filter:saturate(.45)}.piece.hc-piece-locked:after{content:'🔒 À DÉBLOQUER';position:absolute;inset:auto 6px 27px 6px;background:#27221ed9;color:#fff;border-radius:999px;padding:5px;text-align:center;font:700 7px Arial,sans-serif;letter-spacing:.05em}.hc-starter-chip{opacity:1!important;cursor:pointer!important;min-width:72px}.hc-starter-chip.hc-ref-selected{outline:2px solid #e97872;outline-offset:1px}.hc-starter-chip i{border:1px solid #dfd2c8}`;document.head.appendChild(s)}
function toast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1500)}
function persist(){const s=read(STARTER_KEY,{});if(!s.initializedAt){s.initializedAt=new Date().toISOString();s.initialTier=skillTier();s.version=1;write(STARTER_KEY,s)}}
let queued=false;function refresh(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;css();header();applyPieces();injectRefs()})}
function boot(){persist();refresh();const roots=['tops','bottoms','details','materials','colors','patterns'].map(id=>document.getElementById(id)).filter(Boolean);roots.forEach(r=>new MutationObserver(refresh).observe(r,{childList:true,subtree:true}));window.addEventListener('hc-atelier-unlock',refresh);window.addEventListener('storage',e=>{if([SKILL_KEY,UNLOCK_KEY].includes(e.key))refresh()});window.HCAtelierStarter={skillTier,limits,refresh,starter:STARTER}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,120));else setTimeout(boot,120);
})();