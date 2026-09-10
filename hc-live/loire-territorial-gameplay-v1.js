/* Haute Couture Live — Loire territorial gameplay V2 */
(function(){
'use strict';
if(window.__HCLoireTerritorialGameplayV2)return;window.__HCLoireTerritorialGameplayV2=true;
const KEY='haute-couture-loire-territorial-gameplay-v1',DEPT='42';
const ctx=window.HCTerritoryContext;if(!ctx||String(ctx.getPresence?.()?.departmentCode||'')!==DEPT)return;
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{version:2,people:{},briefs:{},secrets:{},events:{},signals:[]}}catch(_){return{version:2,people:{},briefs:{},secrets:{},events:{},signals:[]}}};
const write=s=>{localStorage.setItem(KEY,JSON.stringify(s));window.dispatchEvent(new CustomEvent('hc-loire-territorial-state',{detail:s}));return s};
const game=()=>{try{return window.HCGame?.get?.()||JSON.parse(localStorage.getItem('haute-couture-game-state-v1')||'null')||{}}catch(_){return{}}};
const day=()=>Number(game()?.clock?.day)||1,year=()=>new Date(game()?.clock?.iso||Date.now()).getFullYear()||2026;
const hash=s=>String(s).split('').reduce((a,c)=>((a*33)+c.charCodeAt(0))>>>0,5381);
const people=[
{id:'loire-p-stet-ruban',city:'Saint-Étienne',name:'Nora Masson',role:'designer textile',systems:['Atelier','ruban','design']},
{id:'loire-p-stet-tech',city:'Saint-Étienne',name:'Yanis Roche',role:'technicien textile',systems:['matières','industrie','Atelier']},
{id:'loire-p-charlieu-soie',city:'Charlieu',name:'Élise Béraud',role:'médiatrice soierie',systems:['tissage','Book','matières']},
{id:'loire-p-roanne-prod',city:'Roanne',name:'Malo Perrin',role:'chef de production',systems:['carrière','production','réseau']},
{id:'loire-p-gier-work',city:'Saint-Chamond',name:'Camille Vernier',role:'designer vêtement fonctionnel',systems:['Atelier','travail','industrie']},
{id:'loire-p-montbrison-client',city:'Montbrison',name:'Claire Morel',role:'cliente de cérémonie',systems:['clientes','cérémonie','mémoire']}
];
const briefs=[
{id:'loire-b-stet-01',city:'Saint-Étienne',title:'Ruban structurant intégré à une veste',systems:['Atelier','design'],needs:1},
{id:'loire-b-stet-02',city:'Saint-Étienne',title:'Prototype textile technique pour usage réel',systems:['Atelier','matières'],needs:2},
{id:'loire-b-charlieu-01',city:'Charlieu',title:'Étude chaîne-trame pour détail textile',systems:['Atelier','Book'],needs:1},
{id:'loire-b-roanne-01',city:'Roanne',title:'Petite série cohérente pour jeune marque',systems:['production','carrière'],needs:2},
{id:'loire-b-gier-01',city:'Saint-Chamond',title:'Vêtement de travail revisité sans folklore',systems:['Atelier','industrie'],needs:1},
{id:'loire-b-montbrison-01',city:'Montbrison',title:'Tenue de cérémonie pour cliente locale',systems:['clientes','cérémonie'],needs:1}
];
const secrets=[
{id:'loire-s-stet-stock',city:'Saint-Étienne',title:'Un ancien stock de rubans intéresse un petit réseau de créateurs',needs:2},
{id:'loire-s-charlieu-metier',city:'Charlieu',title:'Une démonstration plus poussée devient accessible',needs:2},
{id:'loire-s-roanne-prod',city:'Roanne',title:'Une structure cherche discrètement un renfort créatif',needs:3}
];
const eventFamilies=[
{id:'loire-e-stet-textile',city:'Saint-Étienne',label:'Saison textile et design',months:[9,10,11],themes:['ruban et structure','textile technique','design et industrie','matière et innovation']},
{id:'loire-e-charlieu-soie',city:'Charlieu',label:'Fête de la soierie',months:[9,10],themes:['chaîne et trame','soie et transmission','patrimoine vivant','tissage contemporain']},
{id:'loire-e-roanne-origine',city:'Roanne',label:'Origine Loire',months:[11],themes:['créateurs locaux','production et savoir-faire','commerce et design','petites séries']}
];
function emit(kind,payload){const s=read(),id=kind+':'+String(payload.id||payload.title||Date.now());if(s.signals.some(x=>x.id===id))return;s.signals.push({id,kind,payload,day:day()});s.signals=s.signals.slice(-120);write(s);window.dispatchEvent(new CustomEvent('hc-territorial-signal',{detail:{kind,departmentCode:DEPT,...payload}}))}
function unlockForCity(city){const s=read(),count=Object.values(s.people).filter(x=>x.city===city&&x.met).reduce((a,x)=>a+(x.interactions||0),0),newBriefs=briefs.filter(b=>b.city===city&&count>=b.needs&&!s.briefs[b.id]),newSecrets=secrets.filter(x=>x.city===city&&count>=x.needs&&!s.secrets[x.id]);newBriefs.forEach(b=>{s.briefs[b.id]={...b,unlockedDay:day(),status:'lead'}});newSecrets.forEach(x=>{s.secrets[x.id]={...x,revealedDay:day()}});write(s);newBriefs.forEach(b=>emit('agenda_opportunity',{id:b.id,city:b.city,title:b.title,systems:b.systems}));newSecrets.forEach(x=>emit('phone_rumor',{id:x.id,city:x.city,title:x.title}))}
function meet(id,action='hello'){const p=people.find(x=>x.id===id);if(!p)return null;const s=read(),r=s.people[id]||{id,city:p.city,name:p.name,role:p.role,met:false,professionalOpen:false,interactions:0,history:[]};r.met=true;r.interactions=(r.interactions||0)+1;r.lastDay=day();if(action==='work'&&r.interactions>=2)r.professionalOpen=true;r.history.push({day:day(),action});r.history=r.history.slice(-30);s.people[id]=r;write(s);if(r.interactions===2)emit('phone_lead',{id:'contact-'+id,city:p.city,personId:id,title:'Un contact de '+p.city});unlockForCity(p.city);return r}
function eventEdition(f,y=year()){const seed=hash(f.id+':'+y);return{id:f.id+':'+y,familyId:f.id,city:f.city,label:f.label,year:y,theme:f.themes[seed%f.themes.length],scale:['intime','locale','renforcée','exceptionnelle'][Math.floor(seed/11)%4],fictionalFuture:y>2026}}
function syncEvents(){const s=read(),m=new Date(game()?.clock?.iso||Date.now()).getMonth()+1,newEvents=[];eventFamilies.forEach(f=>{const e=eventEdition(f);if(!s.events[e.id]){s.events[e.id]=e;newEvents.push(e)}});write(s);eventFamilies.forEach(f=>{const e=s.events[f.id+':'+year()];if(f.months.includes(m)&&e)emit('phone_rumor',{id:'event-'+e.id,city:f.city,title:e.label+' · '+e.theme})})}
function observeReference(ref){if(!ref?.id)return;const types={culture:'BOOK_RESEARCH',heritage:'DESIGN_REFERENCE',fabric:'MATERIAL_KNOWLEDGE',craft:'CRAFT_CONTACT',jewelry:'DESIGN_REFERENCE',nature:'PALETTE_REFERENCE'};emit('atelier_unlock',{id:'ref-'+ref.id,city:ref.city,title:ref.name,unlockType:types[ref.cat]||'DESIGN_REFERENCE',materials:ref.materials||[],motifs:ref.motifs||[],palette:ref.palette||[],text:ref.text||'',addToBook:true,level:'observed'})}
window.addEventListener('hc-territorial-place-observed',e=>{const p=e.detail;if(String(p?.dept||p?.departmentCode||'')===DEPT)observeReference(p)});
window.HCLoireTerritorialGameplay={version:2,people,briefs,secrets,eventFamilies,meet,eventEdition,syncEvents,observeReference,state:read};syncEvents();
})();