/* Haute Couture Live — Haute-Loire territorial gameplay V2 */
(function(){
'use strict';
if(window.__HCHauteLoireTerritorialGameplayV2)return;window.__HCHauteLoireTerritorialGameplayV2=true;
const KEY='haute-couture-haute-loire-territorial-gameplay-v1',DEPT='43';
const ctx=window.HCTerritoryContext;if(!ctx||String(ctx.getPresence?.()?.departmentCode||'')!==DEPT)return;
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{version:2,people:{},briefs:{},secrets:{},events:{},signals:[]}}catch(_){return{version:2,people:{},briefs:{},secrets:{},events:{},signals:[]}}};
const write=s=>{localStorage.setItem(KEY,JSON.stringify(s));window.dispatchEvent(new CustomEvent('hc-haute-loire-territorial-state',{detail:s}));return s};
const game=()=>{try{return window.HCGame?.get?.()||JSON.parse(localStorage.getItem('haute-couture-game-state-v1')||'null')||{}}catch(_){return{}}};
const day=()=>Number(game()?.clock?.day)||1,year=()=>new Date(game()?.clock?.iso||Date.now()).getFullYear()||2026;
const hash=s=>String(s).split('').reduce((a,c)=>((a*33)+c.charCodeAt(0))>>>0,5381);
const people=[
{id:'hl-p-puy-dentelle',city:'Le Puy-en-Velay',name:'Élise Chardon',role:'dentellière formatrice',systems:['Atelier','dentelle','transmission']},
{id:'hl-p-puy-costume',city:'Le Puy-en-Velay',name:'Mina Roux',role:'costumière indépendante',systems:['scène','Atelier','réseau']},
{id:'hl-p-brioude-art',city:'Brioude',name:'Nora Vidal',role:'créatrice métiers d’art',systems:['Atelier','Book','collaboration']},
{id:'hl-p-retournac-doc',city:'Retournac',name:'Camille Perrin',role:'médiatrice textile',systems:['archives','Book','matières']},
{id:'hl-p-chaise-scene',city:'La Chaise-Dieu',name:'Sacha Morel',role:'régisseur costume',systems:['scène','agenda','réseau']},
{id:'hl-p-blesle-coiffe',city:'Blesle',name:'Lou Vernet',role:'médiatrice patrimoine vestimentaire',systems:['Book','coiffes','mémoire']}
];
const briefs=[
{id:'hl-b-puy-01',city:'Le Puy-en-Velay',title:'Détail de dentelle contemporain sans pastiche',systems:['Atelier','dentelle'],needs:1},
{id:'hl-b-puy-02',city:'Le Puy-en-Velay',title:'Pièce de cérémonie mêlant structure et dentelle',systems:['clientes','Atelier'],needs:2},
{id:'hl-b-brioude-01',city:'Brioude',title:'Prototype métiers d’art pour exposition',systems:['Atelier','Book'],needs:1},
{id:'hl-b-retournac-01',city:'Retournac',title:'Recherche textile à partir de collections',systems:['Book','matières'],needs:1},
{id:'hl-b-chaise-01',city:'La Chaise-Dieu',title:'Tenue de scène sobre pour interprète',systems:['scène','Atelier'],needs:2},
{id:'hl-b-blesle-01',city:'Blesle',title:'Silhouette inspirée d’une coiffe sans reproduction',systems:['Book','design'],needs:1}
];
const secrets=[
{id:'hl-s-puy-stage',city:'Le Puy-en-Velay',title:'Une place se libère dans un petit stage spécialisé',needs:3},
{id:'hl-s-brioude-collab',city:'Brioude',title:'Une créatrice cherche une collaboration ponctuelle',needs:2},
{id:'hl-s-chaise-loge',city:'La Chaise-Dieu',title:'Une équipe de spectacle a besoin d’une retouche urgente',needs:2}
];
const eventFamilies=[
{id:'hl-e-puy-roiseau',city:'Le Puy-en-Velay',label:'Roi de l’Oiseau',months:[9],themes:['costume et ville','parure et mouvement','histoire relue','foule et silhouette']},
{id:'hl-e-brioude-metiers',city:'Brioude',label:'Biennale des Métiers d’Art',months:[9],themes:['matière et geste','croisements de savoir-faire','objet et vêtement','transmission contemporaine']},
{id:'hl-e-chaise-festival',city:'La Chaise-Dieu',label:'Festival de La Chaise-Dieu',months:[8],themes:['musique et vêtement','scène et sobriété','patrimoine et lumière','loges et mouvement']}
];
function emit(kind,payload){const s=read(),id=kind+':'+String(payload.id||payload.title||Date.now());if(s.signals.some(x=>x.id===id))return;s.signals.push({id,kind,payload,day:day()});s.signals=s.signals.slice(-120);write(s);window.dispatchEvent(new CustomEvent('hc-territorial-signal',{detail:{kind,departmentCode:DEPT,...payload}}))}
function unlockForCity(city){const s=read(),count=Object.values(s.people).filter(x=>x.city===city&&x.met).reduce((a,x)=>a+(x.interactions||0),0),newBriefs=briefs.filter(b=>b.city===city&&count>=b.needs&&!s.briefs[b.id]),newSecrets=secrets.filter(x=>x.city===city&&count>=x.needs&&!s.secrets[x.id]);newBriefs.forEach(b=>{s.briefs[b.id]={...b,unlockedDay:day(),status:'lead'}});newSecrets.forEach(x=>{s.secrets[x.id]={...x,revealedDay:day()}});write(s);newBriefs.forEach(b=>emit('agenda_opportunity',{id:b.id,city:b.city,title:b.title,systems:b.systems}));newSecrets.forEach(x=>emit('phone_rumor',{id:x.id,city:x.city,title:x.title}))}
function meet(id,action='hello'){const p=people.find(x=>x.id===id);if(!p)return null;const s=read(),r=s.people[id]||{id,city:p.city,name:p.name,role:p.role,met:false,professionalOpen:false,interactions:0,history:[]};r.met=true;r.interactions=(r.interactions||0)+1;r.lastDay=day();if(action==='work'&&r.interactions>=2)r.professionalOpen=true;r.history.push({day:day(),action});r.history=r.history.slice(-30);s.people[id]=r;write(s);if(r.interactions===2)emit('phone_lead',{id:'contact-'+id,city:p.city,personId:id,title:'Un contact de '+p.city});unlockForCity(p.city);return r}
function eventEdition(f,y=year()){const seed=hash(f.id+':'+y);return{id:f.id+':'+y,familyId:f.id,city:f.city,label:f.label,year:y,theme:f.themes[seed%f.themes.length],scale:['intime','locale','renforcée','exceptionnelle'][Math.floor(seed/11)%4],fictionalFuture:y>2026}}
function syncEvents(){const s=read(),m=new Date(game()?.clock?.iso||Date.now()).getMonth()+1;eventFamilies.forEach(f=>{const e=eventEdition(f);if(!s.events[e.id])s.events[e.id]=e});write(s);eventFamilies.forEach(f=>{const e=s.events[f.id+':'+year()];if(f.months.includes(m)&&e)emit('phone_rumor',{id:'event-'+e.id,city:f.city,title:e.label+' · '+e.theme})})}
function observeReference(ref){if(!ref?.id)return;const types={culture:'BOOK_RESEARCH',heritage:'DESIGN_REFERENCE',fabric:'MATERIAL_KNOWLEDGE',craft:'CRAFT_CONTACT',jewelry:'DESIGN_REFERENCE',nature:'PALETTE_REFERENCE'};emit('atelier_unlock',{id:'ref-'+ref.id,city:ref.city,title:ref.name,unlockType:types[ref.cat]||'DESIGN_REFERENCE',materials:ref.materials||[],motifs:ref.motifs||[],palette:ref.palette||[],text:ref.text||'',addToBook:true,level:'observed'})}
window.addEventListener('hc-territorial-place-observed',e=>{const p=e.detail;if(String(p?.dept||p?.departmentCode||'')===DEPT)observeReference(p)});
window.HCHauteLoireTerritorialGameplay={version:2,people,briefs,secrets,eventFamilies,meet,eventEdition,syncEvents,observeReference,state:read};syncEvents();
})();