/* Haute Couture Live — intentions de sortie Nîmes v1
   La joueuse pense en envies et besoins ; les catégories techniques de la carte restent derrière.
*/
(function(){
'use strict';
if(window.HCNimesCityIntentsV1)return;
const INTENTS=[
 {id:'wander',label:'J’ai envie de flâner',sub:'Marcher, regarder, laisser venir quelque chose.',cats:['cafes','nature','view','vintage','hidden','markets']},
 {id:'material',label:'Je cherche une matière ou un savoir-faire',sub:'Tissus, mercerie, artisanat, gestes et techniques.',cats:['fabric','craft','vintage','jewelry']},
 {id:'beauty',label:'Je veux voir quelque chose de beau',sub:'Architecture, musée, jardin, point de vue.',cats:['heritage','culture','nature','view']},
 {id:'people',label:'Je veux croiser du monde',sub:'Un café, un marché, un lieu où une rencontre peut arriver.',cats:['cafes','markets','people','fashion','culture']},
 {id:'project',label:'Je veux avancer sur un projet',sub:'Trouver une matière, une référence, un contact ou une piste concrète.',cats:['fabric','craft','culture','libraries','fashion','jewelry']},
 {id:'book',label:'Je cherche une idée pour mon Book',sub:'Un détail, une palette, une forme ou une histoire à garder.',cats:['heritage','culture','nature','view','vintage','hidden']}
];
const $=s=>document.querySelector(s);
function filters(){return [...document.querySelectorAll('[data-filter]')]}
function applyIntent(id){const intent=INTENTS.find(x=>x.id===id);if(!intent)return;for(const box of filters()){const on=intent.cats.includes(box.dataset.filter)||box.dataset.filter==='home';if(box.checked!==on){box.checked=on;box.dispatchEvent(new Event('change',{bubbles:true}))}}
 document.querySelectorAll('.hc-city-intent').forEach(b=>b.classList.toggle('active',b.dataset.intent===id));
 const note=$('#hcCityIntentNote');if(note)note.textContent=intent.sub;
 window.dispatchEvent(new CustomEvent('hc-nimes-city-intent',{detail:intent}));
}
function inject(){if(!/\/ville\/?/i.test(location.pathname))return false;const panel=$('.panel');const old=$('#filters');if(!panel||!old)return false;if($('#hcCityIntentBox'))return true;
 const st=document.createElement('style');st.id='hcCityIntentStyle';st.textContent=`#filters{display:none}.hc-city-intents{margin:14px 0}.hc-city-intents .ey{font:900 8px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#a05e52;margin-bottom:8px}.hc-city-intent-grid{display:grid;gap:7px}.hc-city-intent{border:1px solid #e5d7ca;background:#fff;border-radius:14px;padding:11px 12px;text-align:left;cursor:pointer;color:#261e1a}.hc-city-intent b{display:block;font:16px/1.05 Georgia,serif;font-weight:400}.hc-city-intent small{display:block;margin-top:4px;font:10px/1.35 Georgia,serif;color:#786b63}.hc-city-intent.active{border-color:#a75f50;background:#fff6ef;box-shadow:0 8px 22px rgba(105,63,48,.08)}.hc-city-filter-more{margin-top:9px;border:0;background:transparent;color:#8a6c60;font:800 9px Arial,sans-serif;text-decoration:underline;cursor:pointer}.hc-city-intent-note{font:11px/1.45 Georgia,serif;color:#6f5f56;margin:8px 0 0}.hc-show-tech-filters #filters{display:grid;margin-top:10px;padding-top:10px;border-top:1px solid #eaded4}`;document.head.appendChild(st);
 const box=document.createElement('div');box.id='hcCityIntentBox';box.className='hc-city-intents';box.innerHTML=`<div class="ey">De quoi as-tu envie ?</div><div class="hc-city-intent-grid">${INTENTS.map(x=>`<button class="hc-city-intent" data-intent="${x.id}"><b>${x.label}</b><small>${x.sub}</small></button>`).join('')}</div><p class="hc-city-intent-note" id="hcCityIntentNote">Choisis une envie, ou ouvre les filtres détaillés si tu veux chercher précisément.</p><button class="hc-city-filter-more" type="button">Voir les filtres détaillés</button>`;
 old.parentNode.insertBefore(box,old);
 box.querySelectorAll('[data-intent]').forEach(b=>b.addEventListener('click',()=>applyIntent(b.dataset.intent)));
 box.querySelector('.hc-city-filter-more').addEventListener('click',e=>{panel.classList.toggle('hc-show-tech-filters');e.currentTarget.textContent=panel.classList.contains('hc-show-tech-filters')?'Masquer les filtres détaillés':'Voir les filtres détaillés'});
 const ctx=window.HCWorldTimeAtmosphereV1?.now?.();let def='wander';if(ctx?.part==='matin')def='beauty';else if(ctx?.part==='soir')def='people';else if(ctx?.part==='après-midi')def='project';if([0,6].includes(new Date(ctx?.iso||Date.now()).getDay()))def='wander';applyIntent(def);return true;
}
function boot(){let n=0;const t=()=>{n++;if(inject()||n>80)return;setTimeout(t,80)};t()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.HCNimesCityIntentsV1={version:1,intents:INTENTS,applyIntent,inject};
})();