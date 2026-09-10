/* Haute Couture Live — Isère territorial gameplay V1 */
(function(){'use strict';if(window.__HCIsereTerritorialGameplayV1)return;window.__HCIsereTerritorialGameplayV1=true;
const KEY='haute-couture-isere-territorial-gameplay-v1',DEPT='38',ctx=window.HCTerritoryContext;if(!ctx||String(ctx.getPresence?.()?.departmentCode||'')!==DEPT)return;
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{version:1,people:{},briefs:{},secrets:{},events:{},signals:[]}}catch(_){return{version:1,people:{},briefs:{},secrets:{},events:{},signals:[]}}};const write=s=>{localStorage.setItem(KEY,JSON.stringify(s));return s};const game=()=>{try{return window.HCGame?.get?.()||{}}catch(_){return{}}};const day=()=>Number(game()?.clock?.day)||1,year=()=>new Date(game()?.clock?.iso||Date.now()).getFullYear()||2026;const hash=s=>String(s).split('').reduce((a,c)=>((a*33)+c.charCodeAt(0))>>>0,5381);
const people=[
{id:'is-p-gre-textile',city:'Grenoble',name:'Alix Perrin',role:'designer textile',systems:['Atelier','Book']},
{id:'is-p-gre-matiere',city:'Grenoble',name:'Nora Vial',role:'ingénieure matière',systems:['Atelier','B2B']},
{id:'is-p-bj-tissage',city:'Bourgoin-Jallieu',name:'Maëlle Chardon',role:'médiatrice tissage',systems:['Book','matières']},
{id:'is-p-vienne-scene',city:'Vienne',name:'Sacha Delmas',role:'habilleur de scène',systems:['scène','agenda']},
{id:'is-p-voiron-client',city:'Voiron',name:'Claire Vernet',role:'cliente locale',systems:['clientes','mémoire']},
{id:'is-p-voiron-retouche',city:'Voiron',name:'Élise Montmayeur',role:'retoucheuse et réparatrice',systems:['Atelier','clientes']},
{id:'is-p-vizille-costume',city:'Vizille',name:'Nina Cordier',role:'costumière événementielle',systems:['Atelier','Book','scène']},
{id:'is-p-vizille-photo',city:'Vizille',name:'Martin Rey',role:'photographe patrimoine',systems:['Book','shooting']},
{id:'is-p-vercors-matiere',city:'Villard-de-Lans',name:'Jo Perron',role:'développeur matière outdoor',systems:['Atelier','B2B']},
{id:'is-p-vercors-guide',city:'Villard-de-Lans',name:'Lina Faure',role:'guide et testeuse terrain',systems:['clientes','B2B','Atelier']},
{id:'is-p-oisans-proto',city:"Bourg-d'Oisans",name:'Noé Arnaud',role:'prototypiste outdoor',systems:['Atelier','B2B']},
{id:'is-p-oisans-photo',city:"Bourg-d'Oisans",name:'Maya Brun',role:'photographe sport et altitude',systems:['Book','shooting']}
];
const briefs=[
{id:'is-b-gre-01',city:'Grenoble',title:'Prototype textile technique urbain',systems:['Atelier','B2B'],needs:1},
{id:'is-b-gre-02',city:'Grenoble',title:'Shooting mode et relief alpin',systems:['Book','shooting'],needs:2},
{id:'is-b-bj-01',city:'Bourgoin-Jallieu',title:'Étude tissage et impression textile',systems:['Atelier','Book'],needs:1},
{id:'is-b-vienne-01',city:'Vienne',title:'Tenue de scène pour festival',systems:['Atelier','scène'],needs:2},
{id:'is-b-voiron-01',city:'Voiron',title:'Commande cérémonie locale',systems:['clientes'],needs:1},
{id:'is-b-voiron-02',city:'Voiron',title:'Transformation d’une pièce existante',systems:['Atelier','clientes','Book'],needs:2},
{id:'is-b-vizille-01',city:'Vizille',title:'Silhouette contemporaine pour shooting patrimoine',systems:['Atelier','Book','shooting'],needs:1},
{id:'is-b-vizille-02',city:'Vizille',title:'Tenue de cérémonie inspirée du parc sans pastiche historique',systems:['Atelier','clientes'],needs:2},
{id:'is-b-vercors-01',city:'Villard-de-Lans',title:'Prototype de surcouche mobile pour altitude',systems:['Atelier','B2B'],needs:1},
{id:'is-b-vercors-02',city:'Villard-de-Lans',title:'Essai porté froid et mouvement',systems:['Atelier','Book','B2B'],needs:2},
{id:'is-b-oisans-01',city:"Bourg-d'Oisans",title:'Pièce technique de transition vallée-altitude',systems:['Atelier','B2B'],needs:1},
{id:'is-b-oisans-02',city:"Bourg-d'Oisans",title:'Campagne photo mouvement et haute montagne',systems:['Book','shooting','B2B'],needs:2}
];
const secrets=[
{id:'is-s-gre-lab',city:'Grenoble',title:'Un prototype matière cherche un regard textile',needs:3},
{id:'is-s-bj-doc',city:'Bourgoin-Jallieu',title:'Une piste documentaire textile peu consultée',needs:2},
{id:'is-s-vienne-stage',city:'Vienne',title:'Une équipe de scène cherche une retouche urgente',needs:2},
{id:'is-s-voiron-fourni',city:'Voiron',title:'Un petit fournisseur accepte parfois de très faibles métrages',needs:3},
{id:'is-s-vizille-photo',city:'Vizille',title:'Un repérage photo exceptionnel pourrait s’ouvrir hors horaires publics',needs:3},
{id:'is-s-vercors-test',city:'Villard-de-Lans',title:'Un test terrain confidentiel cherche une pièce à éprouver',needs:3},
{id:'is-s-oisans-marque',city:"Bourg-d'Oisans",title:'Une petite structure outdoor cherche discrètement un prototype à tester',needs:3}
];
const eventFamilies=[
{id:'is-e-gre-art',city:'Grenoble',label:'Saison textile et métiers d’art',months:[3,9,12],themes:['matière et création','réemploi','textile technique','artisanat contemporain']},
{id:'is-e-bj-textile',city:'Bourgoin-Jallieu',label:'Saison textile du Nord-Isère',months:[9,10],themes:['tissage','impression','patrimoine vivant','transmission']},
{id:'is-e-vienne-scene',city:'Vienne',label:'Saison scène et patrimoine',months:[6,7,8],themes:['costume et scène','festival','patrimoine et lumière','public international']},
{id:'is-e-voiron-local',city:'Voiron',label:'Saison artisanat et clientèle locale',months:[4,5,9,10],themes:['réparation','cérémonie','maille','création locale']},
{id:'is-e-vizille-patrimoine',city:'Vizille',label:'Saison patrimoine et image',months:[5,6,9],themes:['cérémonie contemporaine','jardin et silhouette','photo de mode','costume et représentation']},
{id:'is-e-vercors-outdoor',city:'Villard-de-Lans',label:'Saison montagne et prototype',months:[1,2,7,8,12],themes:['froid et mobilité','test terrain','laine et technique','shooting outdoor']},
{id:'is-e-oisans-performance',city:"Bourg-d'Oisans",label:'Saison altitude et performance',months:[1,2,6,7,8,12],themes:['mobilité verticale','performance textile','réparation technique','campagne outdoor']}
];
function emit(kind,payload){const s=read(),id=kind+':'+String(payload.id||payload.title||Date.now());if(s.signals.some(x=>x.id===id))return;s.signals.push({id,kind,payload,day:day()});s.signals=s.signals.slice(-180);write(s);window.dispatchEvent(new CustomEvent('hc-territorial-signal',{detail:{kind,departmentCode:DEPT,...payload}}))}
function personRecord(p){return read().people[p.id]||null}function unlock(city){const s=read(),count=Object.values(s.people).filter(x=>x.city===city&&x.met).reduce((a,x)=>a+(x.interactions||0),0);briefs.filter(b=>b.city===city&&count>=b.needs&&!s.briefs[b.id]).forEach(b=>{s.briefs[b.id]={...b,unlockedDay:day(),status:'lead'};emit('agenda_opportunity',{id:b.id,city:b.city,title:b.title,systems:b.systems})});secrets.filter(x=>x.city===city&&count>=x.needs&&!s.secrets[x.id]).forEach(x=>{s.secrets[x.id]={...x,revealedDay:day()};emit('phone_rumor',{id:x.id,city:x.city,title:x.title})});write(s)}
function meet(id,action='hello'){const p=people.find(x=>x.id===id);if(!p)return null;const s=read(),r=s.people[id]||{id,city:p.city,name:p.name,role:p.role,met:false,professionalOpen:false,interactions:0,history:[]};r.met=true;r.interactions++;if(action==='work'&&r.interactions>=2)r.professionalOpen=true;r.lastDay=day();r.history.push({day:day(),action});s.people[id]=r;write(s);if(r.interactions===2)emit('phone_lead',{id:'contact-'+id,city:p.city,personId:id,title:'Un contact de '+p.city});unlock(p.city);return r}
function eventEdition(f,y=year()){const seed=hash(f.id+':'+y);return{id:f.id+':'+y,familyId:f.id,city:f.city,label:f.label,year:y,theme:f.themes[seed%f.themes.length],scale:['intime','locale','renforcée','exceptionnelle'][Math.floor(seed/11)%4],fictionalFuture:y>2026}}
function syncEvents(){const m=new Date(game()?.clock?.iso||Date.now()).getMonth()+1;eventFamilies.forEach(f=>{if(f.months.includes(m)){const e=eventEdition(f);emit('phone_rumor',{id:'event-'+e.id,city:f.city,title:e.label+' · '+e.theme,fictionalFuture:e.fictionalFuture})}})}
function observeReference(ref){if(!ref?.id)return;const types={culture:'BOOK_RESEARCH',heritage:'DESIGN_REFERENCE',fabric:'MATERIAL_KNOWLEDGE',craft:'CRAFT_CONTACT',nature:'PALETTE_REFERENCE',view:'PALETTE_REFERENCE',libraries:'BOOK_RESEARCH'};emit('atelier_unlock',{id:'ref-'+ref.id,city:ref.city,title:ref.name,unlockType:types[ref.cat]||'DESIGN_REFERENCE',materials:ref.materials||[],motifs:ref.motifs||[],palette:ref.palette||[],text:ref.text||'',addToBook:true,level:'observed'})}
window.addEventListener('hc-territorial-place-observed',e=>{const p=e.detail;if(String(p?.dept||p?.departmentCode||'')===DEPT)observeReference(p)});window.HCIsereTerritorialGameplay={version:1,people,briefs,secrets,eventFamilies,meet,personRecord,eventEdition,syncEvents,observeReference,state:read};syncEvents();})();