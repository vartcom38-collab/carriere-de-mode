/* Haute Couture Live — Puy-de-Dôme territorial gameplay V1
   Présence réelle uniquement. Personnages/briefs/secrets fictifs ; événements 2026 documentaires deviennent des familles évolutives.
*/
(function(){
'use strict';
if(window.__HCPuyDeDomeTerritorialGameplayV1)return;window.__HCPuyDeDomeTerritorialGameplayV1=true;
const KEY='haute-couture-puy-de-dome-territorial-gameplay-v1',DEPT='63';
const ctx=window.HCTerritoryContext;if(!ctx||String(ctx.getPresence?.()?.departmentCode||'')!==DEPT)return;
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{version:1,people:{},briefs:{},secrets:{},events:{},signals:[]}}catch(_){return{version:1,people:{},briefs:{},secrets:{},events:{},signals:[]}}};
const write=s=>{localStorage.setItem(KEY,JSON.stringify(s));window.dispatchEvent(new CustomEvent('hc-puy-de-dome-territorial-state',{detail:s}));return s};
const game=()=>{try{return window.HCGame?.get?.()||JSON.parse(localStorage.getItem('haute-couture-game-state-v1')||'null')||{}}catch(_){return{}}};
const day=()=>Number(game()?.clock?.day)||1,year=()=>new Date(game()?.clock?.iso||Date.now()).getFullYear()||2026;
const hash=s=>String(s).split('').reduce((a,c)=>((a*33)+c.charCodeAt(0))>>>0,5381);
const people=[
 {id:'pdd-p-clermont-textile',city:'Clermont-Ferrand',name:'Lina Vernay',role:'médiatrice textile contemporain',systems:['Atelier','Book','culture']},
 {id:'pdd-p-clermont-photo',city:'Clermont-Ferrand',name:'Noé Armand',role:'photographe indépendant',systems:['Book','shooting','réseau']},
 {id:'pdd-p-thiers-metal',city:'Thiers',name:'Malo Perrin',role:'artisan métal et accessoire',systems:['Atelier','collaboration','accessoires']},
 {id:'pdd-p-riom-archives',city:'Riom',name:'Nora Delmas',role:'documentaliste patrimoine',systems:['archives','Book','recherche']},
 {id:'pdd-p-volvic-craft',city:'Volvic',name:'Maëlle Roche',role:'créatrice matière et émail',systems:['Atelier','matières','métiers d’art']},
 {id:'pdd-p-sancy-event',city:'Le Mont-Dore',name:'Camille Faure',role:'chargée d’événementiel thermal',systems:['clientes','réception','agenda']}
];
const briefs=[
 {id:'pdd-b-clermont-01',city:'Clermont-Ferrand',title:'Silhouette textile contemporaine pour exposition',systems:['Atelier','Book'],needs:1},
 {id:'pdd-b-clermont-02',city:'Clermont-Ferrand',title:'Éditorial photo autour de la matière volcanique',systems:['Book','shooting'],needs:2},
 {id:'pdd-b-thiers-01',city:'Thiers',title:'Accessoire textile-métal à fixation visible',systems:['Atelier','accessoires'],needs:1},
 {id:'pdd-b-riom-01',city:'Riom',title:'Recherche d’archives pour une silhouette patrimoniale',systems:['Book','recherche'],needs:1},
 {id:'pdd-b-volvic-01',city:'Volvic',title:'Détail de tenue inspiré de lave et émail',systems:['Atelier','matières'],needs:1},
 {id:'pdd-b-sancy-01',city:'Le Mont-Dore',title:'Tenue de réception thermale adaptée au climat',systems:['clientes','cérémonie'],needs:2}
];
const secrets=[
 {id:'pdd-s-clermont-reserve',city:'Clermont-Ferrand',title:'Une piste textile rarement montrée au public',needs:2},
 {id:'pdd-s-thiers-atelier',city:'Thiers',title:'Un artisan accepte parfois des essais très courts',needs:2},
 {id:'pdd-s-sancy-palace',city:'Le Mont-Dore',title:'Un décor thermal discret pourrait accueillir un shooting',needs:3}
];
const eventFamilies=[
 {id:'pdd-e-clermont-textile',city:'Clermont-Ferrand',label:'Saison textile contemporaine',months:[5,6,7,8,9],themes:['territoire et fibre','parade et volume','matière responsable','textile et image']},
 {id:'pdd-e-thiers-coutellia',city:'Thiers',label:'Rendez-vous métiers d’art & métal',months:[5,6],themes:['métal et couture','geste et précision','accessoire et fixation','artisanat international']},
 {id:'pdd-e-volvic-craft',city:'Volvic',label:'Saison métiers d’art de Volvic',months:[5,6,9],themes:['lave et émail','forge et surface','matière locale','transmission artisanale']},
 {id:'pdd-e-sancy-thermal',city:'Le Mont-Dore',label:'Saison thermale du Sancy',months:[6,7,8,9],themes:['architecture et élégance','séjour et réception','montagne et mouvement','patrimoine thermal']}
];
function emit(kind,payload){const s=read(),id=kind+':'+String(payload.id||payload.title||Date.now());if(s.signals.some(x=>x.id===id))return;s.signals.push({id,kind,payload,day:day()});s.signals=s.signals.slice(-120);write(s);window.dispatchEvent(new CustomEvent('hc-territorial-signal',{detail:{kind,departmentCode:DEPT,...payload}}))}
function personRecord(p){const s=read();return s.people[p.id]||null}
function meet(id,action='hello'){const p=people.find(x=>x.id===id);if(!p)return null;const s=read(),r=s.people[id]||{id,city:p.city,name:p.name,role:p.role,met:false,professionalOpen:false,interactions:0,history:[]};r.met=true;r.interactions=(r.interactions||0)+1;r.lastDay=day();if(action==='work'&&r.interactions>=2)r.professionalOpen=true;r.history.push({day:day(),action});r.history=r.history.slice(-30);s.people[id]=r;write(s);if(r.interactions===2)emit('phone_lead',{id:'contact-'+id,city:p.city,personId:id,title:'Un contact de '+p.city});unlockForCity(p.city);return r}
function unlockForCity(city){const s=read(),count=Object.values(s.people).filter(x=>x.city===city&&x.met).reduce((a,x)=>a+(x.interactions||0),0);briefs.filter(b=>b.city===city&&count>=b.needs&&!s.briefs[b.id]).forEach(b=>{s.briefs[b.id]={...b,unlockedDay:day(),status:'lead'};emit('agenda_opportunity',{id:b.id,city:b.city,title:b.title,systems:b.systems})});secrets.filter(x=>x.city===city&&count>=x.needs&&!s.secrets[x.id]).forEach(x=>{s.secrets[x.id]={...x,revealedDay:day()};emit('phone_rumor',{id:x.id,city:x.city,title:x.title})});write(s)}
function eventEdition(f,y=year()){const key=f.id+':'+y,seed=hash(key),theme=f.themes[seed%f.themes.length],scale=['intime','locale','renforcée','exceptionnelle'][Math.floor(seed/11)%4];return{id:key,familyId:f.id,city:f.city,label:f.label,year:y,theme,scale,fictionalFuture:y>2026}}
function syncEvents(){const s=read(),m=new Date(game()?.clock?.iso||Date.now()).getMonth()+1;eventFamilies.forEach(f=>{const e=eventEdition(f);if(!s.events[e.id])s.events[e.id]=e;if(f.months.includes(m))emit('phone_rumor',{id:'event-'+e.id,city:f.city,title:e.label+' · '+e.theme,text:`L’édition ${e.year} prend une tonalité « ${e.theme} » (${e.scale}).`})});write(s)}
function observeReference(ref){if(!ref?.id)return;const types={culture:'BOOK_RESEARCH',heritage:'DESIGN_REFERENCE',fabric:'MATERIAL_KNOWLEDGE',craft:'CRAFT_CONTACT',jewelry:'DESIGN_REFERENCE',nature:'PALETTE_REFERENCE',libraries:'BOOK_RESEARCH'};emit('atelier_unlock',{id:'ref-'+ref.id,city:ref.city,title:ref.name,unlockType:types[ref.cat]||'DESIGN_REFERENCE',materials:ref.materials||[],motifs:ref.motifs||[],palette:ref.palette||[],text:ref.text||'',addToBook:true,level:'observed'})}
window.addEventListener('hc-territorial-place-observed',e=>{const p=e.detail;if(String(p?.dept||p?.departmentCode||'')===DEPT)observeReference(p)});
window.HCPuyDeDomeTerritorialGameplay={version:1,people,briefs,secrets,eventFamilies,meet,personRecord,eventEdition,syncEvents,observeReference,state:read};
syncEvents();
})();