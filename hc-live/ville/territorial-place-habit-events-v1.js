/* Haute Couture Live — petits événements d'habitude dans les lieux v1 */
(function(){
'use strict';
if(window.HCTerritorialPlaceHabitEventsV1)return;
const KEY='haute-couture-territorial-place-habit-events-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return v}catch(_){return v}};
const day=()=>Number(window.HCGame?.get?.()?.clock?.day||1),now=()=>new Date().toISOString();
const hash=s=>{let h=2166136261;for(const c of String(s||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return Math.abs(h>>>0)};
function state(){const s=read(KEY,{version:1,events:{},history:[]});s.events=s.events||{};s.history=s.history||[];return s}
function save(s){s.updatedAt=now();s.history=s.history.slice(0,400);return write(KEY,s)}
function variants(rec){const c=String(rec.category||'').toLowerCase();if(/fabric|mercer|craft|artisan/.test(c))return[
 {type:'arrival',text:'On te signale un nouvel arrivage qui pourrait correspondre à ce que tu regardes souvent.'},
 {type:'aside',text:'Quelque chose a été mis de côté en pensant que cela pourrait t’intéresser.'},
 {type:'contact',text:'La conversation dérive vers quelqu’un du coin qui travaille une matière ou un geste particulier.'}
];if(/cafe/.test(c))return[
 {type:'regular',text:'On te reconnaît avant même que tu t’installes. Le lieu commence vraiment à faire partie de ta routine.'},
 {type:'encounter',text:'Un visage déjà aperçu revient dans le même créneau. Ce lieu commence à produire ses propres habitudes sociales.'}
];if(/culture|museum|gallery|heritage/.test(c))return[
 {type:'reference',text:'Tu remarques immédiatement une nouvelle référence ou un détail que tu n’aurais pas repéré lors de ta première visite.'},
 {type:'return',text:'Tu n’as plus besoin de tout parcourir : tu reviens directement vers ce qui nourrit ton travail du moment.'}
];if(/vintage|market|brocante/.test(c))return[
 {type:'find',text:'On te montre une trouvaille récente avant qu’elle ne disparaisse parmi le reste.'},
 {type:'arrival',text:'Un nouvel arrivage change ce que le lieu peut offrir aujourd’hui.'}
];return[{type:'habit',text:'Le lieu te reconnaît désormais comme une présence régulière. Tu vois plus vite ce qui a changé depuis la dernière fois.'}]}
function maybe(rec){if(!rec||rec.level!=='habitude')return null;const period=Math.floor(day()/5),id=String(rec.key||rec.placeId),eventKey=id+'|'+period,s=state();if(s.events[eventKey])return s.events[eventKey];const options=variants(rec),pick=options[hash(eventKey)%options.length],evt={id:eventKey,placeKey:id,placeId:rec.placeId,name:rec.name,territoryId:rec.territoryId,type:pick.type,text:pick.text,day:day(),at:now(),consumed:false};s.events[eventKey]=evt;s.history.unshift(evt);save(s);window.dispatchEvent(new CustomEvent('hc-place-habit-event',{detail:evt}));return evt}
function latestForName(name){const n=String(name||'').trim().toLowerCase();return Object.values(state().events).filter(x=>String(x.name||'').trim().toLowerCase()===n).sort((a,b)=>b.day-a.day)[0]||null}
function boot(){window.addEventListener('hc-territorial-place-discovered',()=>setTimeout(()=>{const title=document.getElementById('guideTitle');const rec=window.HCTerritorialPlaceFamiliarityV1?.currentByName?.((title?.textContent||'').trim());maybe(rec)},80));window.addEventListener('hc-place-familiarity-changed',e=>maybe(e.detail));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.HCTerritorialPlaceHabitEventsV1={version:1,state,maybe,latestForName,storageKey:KEY};
})();