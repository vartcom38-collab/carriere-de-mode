/* Haute Couture Live — Allier territorial gameplay V4
   Présence réelle uniquement. Personnages/briefs/lieux de gameplay fictifs explicitement signalés ;
   références historiques et événements documentaires restent documentaires.
*/
(function(){
'use strict';
if(window.__HCAllierTerritorialGameplayV4)return;window.__HCAllierTerritorialGameplayV4=true;
const KEY='haute-couture-allier-territorial-gameplay-v1',DEPT='03';
const context=()=>window.HCTerritoryContext||null;
const active=()=>String(context()?.getPresence?.()?.departmentCode||'')===DEPT;
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{version:4,people:{},briefs:{},secrets:{},events:{},visits:{},discoveries:{},signals:[]}}catch(_){return{version:4,people:{},briefs:{},secrets:{},events:{},visits:{},discoveries:{},signals:[]}}};
const write=s=>{s.version=4;s.people=s.people||{};s.briefs=s.briefs||{};s.secrets=s.secrets||{};s.events=s.events||{};s.visits=s.visits||{};s.discoveries=s.discoveries||{};s.signals=s.signals||[];localStorage.setItem(KEY,JSON.stringify(s));window.dispatchEvent(new CustomEvent('hc-allier-territorial-state',{detail:s}));return s};
const game=()=>{try{return window.HCGame?.get?.()||JSON.parse(localStorage.getItem('haute-couture-game-state-v1')||'null')||{}}catch(_){return{}}};
const day=()=>Number(game()?.clock?.day)||1,year=()=>{const d=new Date(game()?.clock?.iso||Date.now());return d.getFullYear()||2026};
const month=()=>{const d=new Date(game()?.clock?.iso||Date.now());return d.getMonth()+1};
const hash=s=>String(s).split('').reduce((a,c)=>((a*33)+c.charCodeAt(0))>>>0,5381);
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const currentCity=()=>context()?.getPresence?.()?.city||context()?.getPresence?.()?.commune?.nom||'';
const people=[
{id:'allier-p-moulins-costume',city:'Moulins',name:'Élise Marceau',role:'costumière de scène · FICTION GAMEPLAY',fictional:true,systems:['Atelier','Book','scène']},
{id:'allier-p-moulins-doc',city:'Moulins',name:'Nora Besset',role:'documentaliste costume · FICTION GAMEPLAY',fictional:true,systems:['archives','Book','recherche']},
{id:'allier-p-moulins-photo',city:'Moulins',name:'Sacha Morel',role:'photographe indépendant · FICTION GAMEPLAY',fictional:true,systems:['Book','shooting','réseau']},
{id:'allier-p-vichy-event',city:'Vichy',name:'Camille Vernet',role:'chargée d’événementiel · FICTION GAMEPLAY',fictional:true,systems:['clientes','réception','agenda']},
{id:'allier-p-montlucon-scene',city:'Montluçon',name:'Mina Perrin',role:'habilleuse de scène · FICTION GAMEPLAY',fictional:true,systems:['costume','musique','réseau']},
{id:'allier-p-montlucon-reemploi',city:'Montluçon',name:'Samir Delmas',role:'artisan réemploi textile · FICTION GAMEPLAY',fictional:true,systems:['Atelier','matière','réemploi']},
{id:'allier-p-montlucon-photo',city:'Montluçon',name:'Léna Courtois',role:'photographe de scène · FICTION GAMEPLAY',fictional:true,systems:['Book','studio','musique']},
{id:'allier-p-bourbon-client',city:'Bourbon-l’Archambault',name:'Claire Derval',role:'cliente de cure récurrente · FICTION GAMEPLAY',fictional:true,systems:['clientes','cérémonie','mémoire']}
];
const briefs=[
{id:'allier-b-moulins-01',city:'Moulins',title:'Costume mobile pour une petite scène',systems:['Atelier','scène'],needs:1},
{id:'allier-b-moulins-02',city:'Moulins',title:'Recherche d’ornement à partir d’archives',systems:['Book','Atelier'],needs:2},
{id:'allier-b-moulins-03',city:'Moulins',title:'Éditorial costume et architecture',systems:['studio','Book'],needs:3},
{id:'allier-b-vichy-01',city:'Vichy',title:'Tenue de réception thermale contemporaine',systems:['clientes','cérémonie'],needs:1},
{id:'allier-b-montlucon-01',city:'Montluçon',title:'Tenue de scène robuste et transformable',systems:['Atelier','musique'],needs:1},
{id:'allier-b-montlucon-02',city:'Montluçon',title:'Réemploi d’une matière industrielle en détail couture',systems:['Atelier','matière'],needs:2},
{id:'allier-b-montlucon-03',city:'Montluçon',title:'Éditorial nocturne autour d’une silhouette de scène',systems:['studio','Book'],needs:3},
{id:'allier-b-bourbon-01',city:'Bourbon-l’Archambault',title:'Robe de dîner pour une cliente fidèle',systems:['clientes','relation'],needs:2}
];
const secrets=[
{id:'allier-s-moulins-archive',city:'Moulins',title:'Un fonds de détails de costume peu consulté',needs:2},
{id:'allier-s-vichy-villa',city:'Vichy',title:'Un lieu discret pour un shooting de saison',needs:2},
{id:'allier-s-montlucon-tournee',city:'Montluçon',title:'Une équipe de passage cherche une solution costume',needs:2},
{id:'allier-s-montlucon-matiere',city:'Montluçon',title:'Un lot de matières réemployables pourrait devenir une expérimentation Atelier',needs:3}
];
const eventFamilies=[
{id:'allier-e-moulins-scene',city:'Moulins',label:'Saison scène & costume · Moulins',months:[6,7,8,9,10],themes:['costume et lumière','patrimoine en mouvement','ville nocturne','scène et silhouette']},
{id:'allier-e-vichy-napoleon',city:'Vichy',label:'Saison historique et élégance · Vichy',months:[4,5,6],themes:['élégance historique relue','réception et costume','architecture et silhouette','parure et promenade']},
{id:'allier-e-montlucon-patrimoine',city:'Montluçon',label:'Saison patrimoine et musique · Montluçon',months:[8,9,10],themes:['mémoire industrielle','cité médiévale','musique et vêtement','archives et scène']}
];
const experiences={
Moulins:[
{id:'moulins-cncs-research',city:'Moulins',name:'CNCS · lecture costume & scène',type:'heritage',kind:'Patrimoine costume',minutes:75,fictional:false,text:'Observer silhouette, construction, matière, mouvement et scénographie. La visite nourrit la recherche sans donner magiquement un savoir-faire.',materials:['velours','soie','passementerie'],motifs:['volume','mouvement','ornement']},
{id:'moulins-archives-gameplay',city:'Moulins',name:'Archives & recherche textile · FICTION GAMEPLAY',type:'archives',kind:'Archives',minutes:60,fictional:true,text:'Formuler une recherche documentaire et conserver une piste pour le Book ou l’Atelier.'},
{id:'moulins-studio-gameplay',city:'Moulins',name:'Studio photo Moulins · FICTION GAMEPLAY',type:'studio',kind:'Studio photo',minutes:90,fictional:true,text:'Le shooting demande une vraie création Atelier terminée avant de choisir objectif, direction et destinations.'},
{id:'moulins-social-gameplay',city:'Moulins',name:'Café des équipes costume · FICTION GAMEPLAY',type:'social',kind:'Lieu social',minutes:30,fictional:true,text:'Les recommandations, rumeurs et opportunités dépendent des relations déjà construites.'},
{id:'moulins-hotel-gameplay',city:'Moulins',name:'Hôtel du centre · FICTION GAMEPLAY',type:'hotel',kind:'Hébergement',minutes:15,fictional:true,text:'Installe un Chez Moi temporaire : téléphone, agenda, travail, invitations et repos restent accessibles.'}
],
'Montluçon':[
{id:'montlucon-heritage-gameplay',city:'Montluçon',name:'Parcours patrimoine & silhouette · Montluçon',type:'heritage',kind:'Patrimoine urbain',minutes:60,fictional:false,text:'Lire les volumes de la ville, ses contrastes de matières et sa mémoire industrielle comme références de silhouette, sans transformer l’observation en savoir-faire automatique.',materials:['laine dense','toile robuste','métal patiné'],motifs:['verticale','armature','superposition']},
{id:'montlucon-archives-gameplay',city:'Montluçon',name:'Archives scène & industrie · FICTION GAMEPLAY',type:'archives',kind:'Archives',minutes:60,fictional:true,text:'Croiser une piste de scène, une mémoire ouvrière et des usages vestimentaires pour nourrir une recherche personnelle.'},
{id:'montlucon-reemploi-gameplay',city:'Montluçon',name:'Atelier de réemploi textile · FICTION GAMEPLAY',type:'craft',kind:'Artisan / matière',minutes:75,fictional:true,text:'Expérimenter la transformation d’une matière robuste et documenter ce qui est réellement réutilisable dans une création.'},
{id:'montlucon-social-gameplay',city:'Montluçon',name:'Café des équipes de scène · FICTION GAMEPLAY',type:'social',kind:'Lieu social',minutes:30,fictional:true,text:'Écouter les besoins de passage, les dates de tournée et les recommandations sans garantir qu’une opportunité se concrétise.'},
{id:'montlucon-studio-gameplay',city:'Montluçon',name:'Studio scène Montluçon · FICTION GAMEPLAY',type:'studio',kind:'Studio photo',minutes:90,fictional:true,text:'Construire un shooting autour du mouvement, du contraste et d’une vraie création Atelier terminée.'},
{id:'montlucon-hotel-gameplay',city:'Montluçon',name:'Hébergement de tournée · FICTION GAMEPLAY',type:'hotel',kind:'Hébergement',minutes:15,fictional:true,text:'Installe un Chez Moi temporaire pour la durée du passage : téléphone, agenda, travail, invitations et repos restent accessibles.'}
]};
function emit(kind,payload){if(!active())return;const s=read(),id=kind+':'+String(payload.id||payload.title||Date.now());if(s.signals.some(x=>x.id===id))return;s.signals.push({id,kind,payload,day:day()});s.signals=s.signals.slice(-160);write(s);window.dispatchEvent(new CustomEvent('hc-territorial-signal',{detail:{kind,departmentCode:DEPT,...payload}}))}
function spend(minutes,reason,city=currentCity()){if(!active())return;window.dispatchEvent(new CustomEvent('hc-game-time-request',{detail:{minutes:Number(minutes)||0,reason,departmentCode:DEPT,city}}))}
function visit(id,type,minutes,city=currentCity()){if(!active())return null;const s=read(),r=s.visits[id]||{count:0,history:[]};r.count++;r.lastDay=day();r.lastYear=year();r.history.push({day:day(),year:year(),city,type});r.history=r.history.slice(-24);s.visits[id]=r;write(s);spend(minutes,type,city);return r}
function unlock(target,id,title,extra={}){if(!active())return null;const s=read(),key=target+':'+id;if(!s.discoveries[key]){s.discoveries[key]={id,title,target,city:extra.city||currentCity(),day:day(),year:year(),...extra};write(s);window.dispatchEvent(new CustomEvent('hc-territorial-unlock',{detail:{departmentCode:DEPT,target,discovery:s.discoveries[key]}}))}return s.discoveries[key]}
function personRecord(p){return read().people[p.id]||null}
function meet(id,action='hello'){if(!active())return null;const p=people.find(x=>x.id===id);if(!p)return null;const s=read(),r=s.people[id]||{id,city:p.city,name:p.name,role:p.role,fictional:true,met:false,professionalOpen:false,interactions:0,history:[]};r.met=true;r.interactions=(r.interactions||0)+1;r.lastDay=day();if(action==='work'&&r.interactions>=2)r.professionalOpen=true;r.history.push({day:day(),action});r.history=r.history.slice(-30);s.people[id]=r;write(s);spend(20,'Rencontre avec '+p.name,p.city);if(r.interactions===2)emit('phone_lead',{id:'contact-'+id,city:p.city,personId:id,title:'Un contact de '+p.city,text:p.name+' garde ton travail en tête.'});unlockForCity(p.city);return r}
function unlockForCity(city){if(!active())return;let s=read(),count=Object.values(s.people).filter(x=>x.city===city&&x.met).reduce((a,x)=>a+(x.interactions||0),0),out=[];briefs.filter(b=>b.city===city&&count>=b.needs&&!s.briefs[b.id]).forEach(b=>{s.briefs[b.id]={...b,unlockedDay:day(),status:'lead'};out.push(['agenda_opportunity',{id:b.id,city:b.city,title:b.title,systems:b.systems}])});secrets.filter(x=>x.city===city&&count>=x.needs&&!s.secrets[x.id]).forEach(x=>{s.secrets[x.id]={...x,revealedDay:day()};out.push(['phone_rumor',{id:x.id,city:x.city,title:x.title}])});write(s);out.forEach(([k,p])=>emit(k,p))}
function eventEdition(f,y=year()){const key=f.id+':'+y,seed=hash(key),theme=f.themes[seed%f.themes.length],scale=['intime','locale','renforcée','exceptionnelle'][Math.floor(seed/11)%4];return{id:key,familyId:f.id,city:f.city,label:f.label,year:y,theme,scale,fictionalFuture:y>2026,evolutive:true}}
function syncEvents(){if(!active())return [];let s=read(),m=month(),out=[];eventFamilies.forEach(f=>{const e=eventEdition(f);if(!s.events[e.id])s.events[e.id]=e;if(f.months.includes(m)){const id='event-'+e.id;if(!s.signals.some(x=>x.id==='phone_rumor:'+id))out.push(['phone_rumor',{id,city:f.city,title:e.label+' · '+e.theme,text:`L’édition ${e.year} prend une tonalité « ${e.theme} » (${e.scale}).`,evolutive:true,fictional:e.fictionalFuture}])}});write(s);out.forEach(([k,p])=>emit(k,p));return out}
function observeReference(ref){if(!active()||!ref?.id)return;const types={culture:'BOOK_RESEARCH',heritage:'DESIGN_REFERENCE',fabric:'MATERIAL_KNOWLEDGE',craft:'CRAFT_CONTACT',jewelry:'DESIGN_REFERENCE',nature:'PALETTE_REFERENCE',markets:'CLIENT_REFERENCE'};emit('atelier_unlock',{id:'ref-'+ref.id,city:ref.city,title:ref.name,unlockType:types[ref.cat]||'DESIGN_REFERENCE',materials:ref.materials||[],motifs:ref.motifs||[],palette:ref.palette||[],text:ref.text||'',addToBook:true,level:'observed'})}
function useExperience(id,action='visit'){if(!active())return null;const all=Object.values(experiences).flat(),x=all.find(v=>v.id===id);if(!x)return null;const city=x.city||currentCity(),r=visit(x.id,x.type,x.minutes,city);if(!r)return null;
if(x.type==='heritage'){unlock('book',x.id,'Recherche patrimoine · '+city,{city,visit:r.count,materials:x.materials,motifs:x.motifs});if(action==='atelier')unlock('atelier',x.id,'Proportions, matières et mouvements observés · '+city,{city,materials:x.materials,motifs:x.motifs})}
if(x.type==='archives'){unlock('book',x.id,'Piste documentaire · '+city,{city,visit:r.count});if(action==='atelier')unlock('atelier',x.id,'Référence d’archives transférée à l’Atelier',{city,documentary:true})}
if(x.type==='craft'){unlock('book',x.id,'Recherche matière et réemploi · '+city,{city,visit:r.count});if(action==='atelier')unlock('atelier',x.id,'Expérimentation matière documentée · '+city,{city,materials:['matière robuste','réemploi'],motifs:['assemblage','renfort']})}
if(x.type==='studio')window.dispatchEvent(new CustomEvent('hc-studio-photo-request',{detail:{departmentCode:DEPT,city,experienceId:x.id,destinations:['Book','Ateliergram','portfolio']}}));
if(x.type==='hotel'){const s=read();s.temporaryHome={city,active:true,installedDay:day(),installedYear:year(),access:['telephone','agenda','travail','repos','invitations']};write(s);window.dispatchEvent(new CustomEvent('hc-territorial-temporary-home',{detail:{departmentCode:DEPT,...s.temporaryHome}}))}
if(x.type==='social'){if(r.count>=2)emit('agenda_opportunity',{id:norm(city)+'-network-'+day(),city,title:'Rencontre réseau · '+city});else emit('phone_rumor',{id:norm(city)+'-rumor-'+day(),city,title:'Une piste circule dans le réseau local'})}return r}
function temporaryObjects(city=currentCity()){if(!active())return [];const seed=hash([DEPT,city,day(),year()].join('|')),base=[{type:'rumor',name:'Rumeur du réseau costume',fictional:true},{type:'poster',name:'Affiche culturelle du jour',fictional:false},{type:'inspiration',name:'Détail de silhouette aperçu',fictional:false},{type:'encounter',name:'Rencontre de passage · FICTION GAMEPLAY',fictional:true}];return base.slice(0,2+(seed%2)).map((x,i)=>({...x,id:'allier-temp-'+norm(city)+'-'+day()+'-'+i,city,day:day(),evolutive:true}))}
window.addEventListener('hc-territorial-place-observed',e=>{const p=e.detail;if(String(p?.dept||p?.departmentCode||'')===DEPT)observeReference(p)});
window.HCAllierTerritorialGameplay={version:4,people,briefs,secrets,eventFamilies,experiences,meet,personRecord,eventEdition,syncEvents,observeReference,useExperience,temporaryObjects,state:read,visit,unlock,active};
let tries=0;const boot=setInterval(()=>{if(active()){clearInterval(boot);syncEvents()}else if(tries++>400)clearInterval(boot)},25);
window.addEventListener('hc-territory-presence',()=>{if(active())syncEvents()});
})();