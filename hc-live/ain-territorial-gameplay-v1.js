/* Haute Couture Live — Ain territorial gameplay V1
   Carte -> rencontres / événements / briefs / secrets / mémoire.
   Résidence != présence. Le moteur ne s'active que lorsque Marion est physiquement présente dans l'Ain.
   Les événements après 2026 sont des éditions FICTION GAMEPLAY plausibles et anti-répétition.
*/
(function(){
'use strict';
if(window.__HCAinTerritorialGameplayV1)return;window.__HCAinTerritorialGameplayV1=true;
const KEY='haute-couture-ain-territorial-gameplay-v1';
const GAME='haute-couture-game-state-v1';
const $=(s,r=document)=>r.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const hash=v=>String(v||'').split('').reduce((a,c)=>((a*33)+c.charCodeAt(0))>>>0,5381);
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(_){return {}}}
function save(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch(_){}return v}
function game(){try{return window.HauteCoutureCore?.load?.()||JSON.parse(localStorage.getItem(GAME)||'{}')||{}}catch(_){return {}}}
function presence(){return window.HCTerritoryContext?.getPresence?.()||null}
function active(){const p=presence();return !!p&&String(p.departmentCode||'')==='01'}
function dateInfo(){const g=game(),iso=g?.clock?.iso||g?.world?.date||null;let d=iso?new Date(iso):new Date(2026,8,10);if(Number.isNaN(d.getTime()))d=new Date(2026,8,10);return {year:d.getFullYear(),month:d.getMonth()+1,day:d.getDate(),season:d.getMonth()+1<=2||d.getMonth()+1===12?'hiver':d.getMonth()+1<=5?'printemps':d.getMonth()+1<=8?'été':'automne',gameDay:Number(g?.clock?.day||g?.world?.day||1)} }
const PEOPLE=[
 {id:'lea-martin',city:'Bourg-en-Bresse',name:'Léa Martin',role:'photographe indépendante',places:['centre-ville','Brou','événements culturels'],knows:['shooting','patrimoine','clientes cérémonie'],opens:['shooting','clientele'],text:'Elle photographie familles, lieux et événements. La revoir ailleurs dans la ville est possible.'},
 {id:'alice-bertrand',city:'Bourg-en-Bresse',name:'Alice Bertrand',role:'organisatrice événementielle',places:['centre-ville','lieux de réception'],knows:['cérémonies','prestataires','calendrier local'],opens:['brief','clientele'],text:'Elle travaille avec plusieurs prestataires et peut se souvenir du sérieux de Marion.'},
 {id:'nora-vernier',city:'Jujurieux',name:'Nora Vernier',role:'médiatrice textile',places:['Jujurieux','patrimoine industriel'],knows:['soie','velours','archives'],opens:['book','atelier'],text:'Elle relie gestes, mémoire ouvrière et lecture de matière sans transformer une visite en maîtrise.'},
 {id:'malo-perrin',city:'Cerdon',name:'Malo Perrin',role:'artisan métal',places:['Cerdon','Bugey'],knows:['relief','fixations','métal fin'],opens:['atelier','collab'],text:'Il peut parler contraintes de poids, fixation et finition avant toute collaboration.'},
 {id:'ines-roux',city:'Oyonnax',name:'Inès Roux',role:'prototypiste accessoire',places:['Oyonnax','zone atelier'],knows:['prototype','acétate','petite série'],opens:['atelier','brief'],text:'Elle raisonne en essais, tolérances, formes et fabrication. Une relation professionnelle se construit dans le temps.'},
 {id:'simon-caron',city:'Gex',name:'Simon Caron',role:'chargé de production transfrontalière',places:['Gex','Ferney-Voltaire','Genève'],knows:['mobilité','événement','clientèle internationale'],opens:['network','brief'],text:'Son réseau traverse la frontière ; il n’est pas automatiquement disponible à chaque visite.'},
 {id:'maelle-faure',city:'Villars-les-Dombes',name:'Maëlle Faure',role:'photographe nature et cérémonie',places:['Dombes','lieux de réception'],knows:['lumière','mariage','saisons'],opens:['shooting','clientele'],text:'Elle connaît les changements de lumière, de météo et de fréquentation des étangs.'},
 {id:'eloi-bailly',city:'Pérouges',name:'Éloi Bailly',role:'brocanteur et chineur',places:['Pérouges','marchés'],knows:['vintage','réemploi','provenance'],opens:['secret','material'],text:'Son stock n’est jamais identique. Certaines trouvailles ne reviennent pas.'}
];
const BRIEFS=[
 {id:'bresse-ceremonie',cities:['Bourg-en-Bresse','Vonnas','Châtillon-sur-Chalaronne'],title:'Cérémonie bressane contemporaine',level:1,kind:'cliente',need:'Une tenue élégante qui évite le pastiche régional.',systems:['Atelier','cliente','réputation locale']},
 {id:'brou-editorial',cities:['Bourg-en-Bresse'],title:'Éditorial architecture et coupe',level:1,kind:'shooting',need:'Construire une silhouette autour des rythmes architecturaux de Brou.',systems:['Book','shooting']},
 {id:'jujurieux-matiere',cities:['Jujurieux'],title:'Étude de drapé et mémoire textile',level:1,kind:'recherche',need:'Comparer tombé, surface et densité sans copier une pièce historique.',systems:['Atelier','Book']},
 {id:'cerdon-metal',cities:['Cerdon'],title:'Détail métal textile',level:2,kind:'collaboration',need:'Imaginer un détail métallique portable avec contraintes de poids et fixation.',systems:['Atelier','collaboration']},
 {id:'oyonnax-accessoire',cities:['Oyonnax'],title:'Prototype accessoire en acétate',level:2,kind:'professionnel',need:'Dessiner puis faire prototyper un petit accessoire compatible avec une petite série.',systems:['Atelier','réseau pro']},
 {id:'gex-transformable',cities:['Gex','Ferney-Voltaire','Mijoux'],title:'Tenue transfrontalière transformable',level:2,kind:'cliente',need:'Passer d’un déplacement professionnel à une réception sans changer entièrement de tenue.',systems:['cliente','Atelier']},
 {id:'dombes-mariage',cities:['Villars-les-Dombes','Châtillon-sur-Chalaronne'],title:'Mariage au bord des étangs',level:1,kind:'cérémonie',need:'Prévoir humidité, lumière changeante et mouvement extérieur.',systems:['cliente','shooting']},
 {id:'perouges-upcycle',cities:['Pérouges'],title:'Réemploi d’une trouvaille ancienne',level:2,kind:'vintage',need:'Transformer un élément chiné sans effacer sa provenance ni imiter un costume ancien.',systems:['Atelier','Book']}
];
const SECRETS=[
 {id:'archive-bresse',cities:['Bourg-en-Bresse'],title:'Une piste dans les archives',requires:2,text:'Un contact mentionne un fonds peu consulté qui pourrait nourrir une recherche de silhouette.'},
 {id:'stock-oyonnax',cities:['Oyonnax'],title:'Ancien stock de matière',requires:3,text:'On parle d’un petit lot ancien conservé hors circuit commercial. Il faudra une recommandation pour le voir.'},
 {id:'carnet-jujurieux',cities:['Jujurieux'],title:'Carnet de formes oublié',requires:3,text:'Une référence à un carnet technique revient dans plusieurs conversations ; personne ne sait encore s’il est accessible.'},
 {id:'spot-dombes',cities:['Villars-les-Dombes','Châtillon-sur-Chalaronne'],title:'Lumière d’étang',requires:2,text:'Une photographe partage un endroit discret qui ne fonctionne qu’à certaines heures et saisons.'},
 {id:'vente-perouges',cities:['Pérouges'],title:'Vente ponctuelle',requires:2,text:'Une petite vente de textiles et accessoires anciens pourrait avoir lieu, mais l’information circule surtout par bouche-à-oreille.'},
 {id:'mijoux-lapidary',cities:['Mijoux'],title:'Contact lapidaire',requires:2,text:'Un artisan accepte parfois de montrer comment lumière, facettes et poids influencent un accessoire, sans proposer de cours complet.'}
];
const EVENTS=[
 {id:'bourg-summer',cities:['Bourg-en-Bresse'],months:[7,8],label:'Saison culturelle d’été',themes:['lumière et patrimoine','musique et espace public','création locale','mémoire architecturale']},
 {id:'bourg-glorieuses',cities:['Bourg-en-Bresse'],months:[12],label:'Grand rendez-vous de fin d’année',themes:['élégance rurale contemporaine','réception et clientèle','tradition revisitée','presse locale']},
 {id:'oyonnax-industry',cities:['Oyonnax'],months:[9,10,11],label:'Saison industrie, science et patrimoine',themes:['matière et prototype','lunetterie','mémoire industrielle','innovation responsable']},
 {id:'gex-festival',cities:['Gex','Ferney-Voltaire'],months:[9,10],label:'Saison culturelle transfrontalière',themes:['cinéma et costume','cultures croisées','mobilité','création bilingue']},
 {id:'dombes-summer',cities:['Villars-les-Dombes','Châtillon-sur-Chalaronne'],months:[5,6,7,8,9],label:'Saison étangs, tourisme et cérémonies',themes:['mariage','nature','photographie','marchés']},
 {id:'heritage-ain',cities:['Jujurieux','Pérouges','Ambronay','Nantua','Belley'],months:[9],label:'Saison patrimoine',themes:['archives','transmission','gestes','architecture']}
];
function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function sameCity(a,b){const x=norm(a),y=norm(b);return x===y||x.includes(y)||y.includes(x)}
function city(){return presence()?.city||presence()?.commune?.nom||''}
function memory(){const m=load();m.people=m.people||{};m.briefs=m.briefs||{};m.secrets=m.secrets||{};m.events=m.events||{};m.signals=m.signals||[];return m}
function emit(type,detail){window.dispatchEvent(new CustomEvent(type,{detail}));}
function addSignal(m,kind,payload){const id=kind+':'+(payload.id||hash(JSON.stringify(payload)));if(m.signals.some(x=>x.id===id))return false;m.signals.push({id,kind,created:dateInfo(),payload});m.signals=m.signals.slice(-120);emit('hc-territorial-signal',{kind,...payload,departmentCode:'01'});return true}
function meet(person,action){const m=memory(),d=dateInfo(),r=m.people[person.id]||{id:person.id,name:person.name,role:person.role,firstDay:d.gameDay,firstYear:d.year,interactions:0,relationship:0,history:[]};r.interactions++;r.lastDay=d.gameDay;r.lastYear=d.year;r.relationship=Math.min(100,r.relationship+(action==='work'?4:action==='talk'?2:1));r.history.push({day:d.gameDay,year:d.year,city:city(),action});r.history=r.history.slice(-40);m.people[person.id]=r;if(action==='work'&&r.interactions>=2)addSignal(m,'phone_lead',{id:'contact-'+person.id,title:'Un contact pourrait avoir une piste',personId:person.id,city:city()});save(m);emit('hc-territorial-person-memory',{departmentCode:'01',person:{...person,memory:r}});return r}
function eventEdition(ev){const d=dateInfo(),seed=hash(ev.id+'|'+d.year),theme=ev.themes[seed%ev.themes.length],scale=['intime','locale','départementale','élargie'][Math.floor(seed/17)%4];return {id:ev.id+'-'+d.year,familyId:ev.id,year:d.year,label:ev.label,theme,scale,fictionalFuture:d.year>2026}}
function unlockBrief(b){const m=memory(),d=dateInfo();if(m.briefs[b.id])return m.briefs[b.id];const r={...b,status:'available',discoveredDay:d.gameDay,discoveredYear:d.year,city:city()};m.briefs[b.id]=r;addSignal(m,'agenda_opportunity',{id:'brief-'+b.id,title:b.title,city:city(),systems:b.systems});save(m);emit('hc-territorial-brief-unlocked',{departmentCode:'01',brief:r});return r}
function revealSecret(s){const m=memory(),d=dateInfo();if(m.secrets[s.id])return m.secrets[s.id];const r={...s,revealedDay:d.gameDay,revealedYear:d.year,city:city()};m.secrets[s.id]=r;addSignal(m,'phone_rumor',{id:'secret-'+s.id,title:s.title,city:city()});save(m);emit('hc-territorial-secret-revealed',{departmentCode:'01',secret:r});return r}
function contactsHere(){const c=city();return PEOPLE.filter(p=>sameCity(p.city,c)||p.places.some(x=>sameCity(x,c)))}
function briefsHere(){const c=city();return BRIEFS.filter(b=>b.cities.some(x=>sameCity(x,c)))}
function secretsHere(){const c=city();return SECRETS.filter(s=>s.cities.some(x=>sameCity(x,c)))}
function eventsHere(){const c=city(),d=dateInfo();return EVENTS.filter(e=>e.months.includes(d.month)&&e.cities.some(x=>sameCity(x,c)))}
function markerForPerson(p,i){const here=presence();return {id:'ain-person-'+p.id,dept:'01',departmentName:'Ain',city:here.city,name:p.name,cat:'people',kind:'Rencontre · FICTION GAMEPLAY',lat:Number(here.lat)+(i+1)*0.00035,lng:Number(here.lng)+(i%2?-.00038:.00038),where:(here.city||'Ain')+' · Ain',text:p.role+' — '+p.text,palette:[],materials:[],motifs:[],unlock:'Cette personne se souvient des rencontres. Parler ne garantit ni mission ni relation.',gameplayType:'person',personId:p.id}}
function markerForEvent(e,i){const here=presence(),ed=eventEdition(e);return {id:'ain-event-'+ed.id,dept:'01',departmentName:'Ain',city:here.city,name:ed.label+' · '+ed.year,cat:'culture',kind:'Événement '+(ed.fictionalFuture?'FICTION GAMEPLAY':'base 2026'),lat:Number(here.lat)-(i+1)*0.00042,lng:Number(here.lng)+(i%2?.00055:-.00055),where:(here.city||'Ain')+' · Ain',text:'Édition '+ed.year+' : '+ed.theme+'. Échelle '+ed.scale+'. Cette édition est mémorisée et ne se répète pas à l’identique.',unlock:'Peut produire rencontre, brief, Book ou simple visite. Aucun résultat garanti.',gameplayType:'event',event:ed}}
function decorateGuide(item){const actions=$('#overlay .guide-actions');if(!actions)return;actions.querySelectorAll('.ain-gp-action').forEach(x=>x.remove());if(item.gameplayType==='person'){
 const p=PEOPLE.find(x=>x.id===item.personId);if(!p)return;const m=memory().people[p.id];const talk=document.createElement('button');talk.className='visit ain-gp-action';talk.textContent=m?'REPRENDRE CONTACT':'SE PRÉSENTER';talk.onclick=()=>{const r=meet(p,'talk');talk.textContent='✓ RENCONTRE MÉMORISÉE ('+r.interactions+')'};const work=document.createElement('button');work.className='save ain-gp-action';work.textContent='PARLER DE SON TRAVAIL';work.onclick=()=>{const r=meet(p,'work');work.textContent='✓ LIEN PRO '+r.relationship+'/100'};actions.prepend(work);actions.prepend(talk);
 }
 if(item.gameplayType==='event'){
  const b=briefsHere()[hash(item.event.id)%Math.max(1,briefsHere().length)];if(b){const btn=document.createElement('button');btn.className='save ain-gp-action';btn.textContent=memory().briefs[b.id]?'BRIEF DÉJÀ CONNU':'VOIR SI UNE PISTE ÉMERGE';btn.disabled=!!memory().briefs[b.id];btn.onclick=()=>{unlockBrief(b);btn.textContent='✓ PISTE AJOUTÉE À L’AGENDA';btn.disabled=true};actions.prepend(btn)}
 }
}
function installGuideHook(){if(window.__HCAinGuideHook||!window.HCLocalMapOpenGuide)return;window.__HCAinGuideHook=true;const base=window.HCLocalMapOpenGuide;window.HCLocalMapOpenGuide=function(item){base(item);if(active())decorateGuide(item)}}
function render(){if(!active()||!window.HCLocalMap)return false;installGuideHook();const p=presence();if(p?.lat==null||p?.lng==null)return false;contactsHere().slice(0,3).forEach((x,i)=>window.HCLocalMap.addMarker(markerForPerson(x,i)));eventsHere().slice(0,2).forEach((x,i)=>window.HCLocalMap.addMarker(markerForEvent(x,i)));
 const m=memory(),known=contactsHere().reduce((n,x)=>n+(m.people[x.id]?.interactions||0),0);secretsHere().filter(s=>known>=s.requires&&!m.secrets[s.id]).slice(0,1).forEach(s=>revealSecret(s));return true}
let sig='';function tick(){if(!active())return;const d=dateInfo(),s=[city(),d.year,d.month,Object.keys(memory().people).length,Object.keys(memory().briefs).length].join('|');if(s!==sig){sig=s;render()}}
function boot(){const t=setInterval(()=>{if(window.HCLocalMap){clearInterval(t);render();setInterval(tick,900)}},100);window.addEventListener('hc-territory-presence',()=>{sig='';setTimeout(render,50)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.HCAinTerritorialGameplay={people:PEOPLE,briefs:BRIEFS,secrets:SECRETS,events:EVENTS,memory,meet,unlockBrief,revealSecret,eventEdition,render};
})();