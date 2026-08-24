/* Haute Couture Live — fil rouge Nîmes v1.
   Relie Chez moi, Ville, rencontres libres, lieux, téléphone, missions, Book/Atelier et progression locale.
*/
(function(){
'use strict';
const KEY='haute-couture-nimes-thread-v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}};
const write=s=>{localStorage.setItem(KEY,JSON.stringify(s));window.dispatchEvent(new CustomEvent('hc-nimes-thread',{detail:s}));return s};
const hash=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const game=()=>window.HCGame||null,world=()=>window.HCGardWorld||null,pack=()=>window.HCGardComplete||null;
function state(){const s=read();s.started=s.started||false;s.stage=Number(s.stage||0);s.flags=s.flags||{};s.walks=s.walks||{};s.history=s.history||[];return s}
function day(){return Number(game()?.get?.().clock?.day||1)}
function addHistory(s,type,data={}){s.history.push({day:day(),type,...data});if(s.history.length>120)s.history=s.history.slice(-120)}
function ensureObjective(id,title,category='nimes'){const g=game();if(!g)return;g.mutate(gs=>{gs.objectives=gs.objectives||[];if(!gs.objectives.some(o=>o.id===id))gs.objectives.push({id,title,status:'active',category})})}
function doneObjective(id){game()?.completeObjective?.(id)}
function messageOnce(flag,msg){const s=state();if(s.flags[flag])return;s.flags[flag]=true;write(s);game()?.addMessage?.(msg)}
function start(){const s=state();if(s.started)return;s.started=true;s.stage=0;addHistory(s,'thread_started');write(s);ensureObjective('nimes-sortir','Sortir découvrir Nîmes');messageOnce('welcomeCity',{from:'Carnet de Nîmes',avatar:'N',subject:'Commence par regarder ta ville',text:'Ton chez-toi est ton point d’ancrage. Sors quand tu veux : visite un lieu, marche dans les rues, rencontre des gens et ramène des idées à l’atelier.'})}
function firstCityAction(kind,label){const s=state();if(s.flags.firstCityAction)return;s.flags.firstCityAction=true;s.stage=Math.max(s.stage,1);addHistory(s,'first_city_action',{kind,label});write(s);doneObjective('intro-city');doneObjective('nimes-sortir');ensureObjective('nimes-inspiration','Ramener une première inspiration de Nîmes');messageOnce('firstCityFollowup',{from:'Carnet de Nîmes',avatar:'N',subject:'Ta ville commence à vivre',text:'Continue sans te presser. Une visite, une promenade ou une rencontre peut ouvrir une piste de création, un contact ou une future commande. En rentrant chez toi, tes nouveaux objectifs et messages restent visibles.'})}
function onVisit(place){if(!place||String(place.city||'').toLowerCase()!=='nîmes')return;firstCityAction('visit',place.name);const s=state();s.flags.visitedPlace=true;s.stage=Math.max(s.stage,2);addHistory(s,'visit',{placeId:place.id,name:place.name});write(s);doneObjective('nimes-inspiration');ensureObjective('nimes-reseau','Créer un premier contact professionnel ou local à Nîmes');refreshHome()}
function pickStreetCharacter(zone){const w=world(),p=pack();if(!w||!p)return null;const chars=w.cityCharacters?.('Nîmes')||[];if(!chars.length)return null;const ws=w.state?.()||{},eligible=chars.filter(c=>{const m=ws.characters?.[c.id];if(!m?.met)return true;return day()-Number(m.lastSeenDay||0)>=3});if(!eligible.length)return null;return eligible[hash(`${zone.id}:${day()}:${state().walks[zone.id]||0}`)%eligible.length]}
const ZONES={
 ecusson:{id:'nimes-street-ecusson',name:'Promenade dans l’Écusson',city:'Nîmes',category:'street',visit:{durationMinutes:35}},
 jardins:{id:'nimes-street-jardins',name:'Balade côté Jardins',city:'Nîmes',category:'street',visit:{durationMinutes:40}},
 halles:{id:'nimes-street-halles',name:'Flâner autour des Halles',city:'Nîmes',category:'street',visit:{durationMinutes:30}},
 gare:{id:'nimes-street-gare',name:'Traverser le quartier de la gare',city:'Nîmes',category:'street',visit:{durationMinutes:30}}
};
function wander(zoneId='ecusson'){
 const z=ZONES[zoneId]||ZONES.ecusson,g=game(),w=world();if(!g||!w)return null;const s=state();const key=`${zoneId}:${day()}`;if(s.flags['walk:'+key])return {zone:z,repeated:true};s.flags['walk:'+key]=true;s.walks[z.id]=(s.walks[z.id]||0)+1;addHistory(s,'wander',{zoneId:z.id});write(s);g.advanceTime(Number(z.visit.durationMinutes||35),z.name);firstCityAction('wander',z.name);
 let encounter=null;const roll=(hash(`${z.id}:${day()}:chance`)%1000)/1000;if(roll<.62){const c=pickStreetCharacter(z);if(c)encounter=w.meet?.(c,z)||null}
 if(!encounter){messageOnce('streetQuiet:'+key,{from:'Carnet de ville',avatar:'⌖',subject:z.name,text:'Pas de rencontre importante cette fois. Tu observes les silhouettes, les vitrines, les matières, les habitudes de la ville. Ce genre de sortie pourra nourrir ton regard et de futurs posts.'})}
 refreshHome();return {zone:z,encounter}
}
function onEncounter(e){const d=e?.detail;if(!d?.character)return;const s=state();s.flags.metSomeone=true;s.stage=Math.max(s.stage,3);addHistory(s,'encounter',{characterId:d.character.id,placeId:d.place?.id,first:d.first});write(s);doneObjective('nimes-reseau');ensureObjective('nimes-premier-projet','Faire avancer un premier projet ou une collaboration locale');refreshHome()}
function onMission(e){const m=e?.detail;if(!m)return;const s=state();s.flags.missionOffered=true;s.stage=Math.max(s.stage,4);addHistory(s,'mission_offered',{missionId:m.id});write(s);ensureObjective('nimes-premier-projet','Faire avancer un premier projet ou une collaboration locale');refreshHome()}
function onAtelier(e){const s=state();s.flags.atelierUsed=true;s.stage=Math.max(s.stage,3);addHistory(s,'atelier_unlock',{id:e?.detail?.id||null});write(s);refreshHome()}
function homeCopy(){const s=state();if(s.stage<=0)return 'Tu viens de t’installer. Ton chez-toi est ton point de départ : téléphone, agenda, atelier puis la ville quand tu veux.';if(s.stage===1)return 'Tu as commencé à explorer Nîmes. Continue une visite ou une promenade, puis reviens ici pour organiser ce que tu as découvert.';if(s.stage===2)return 'Tu as déjà ramené quelque chose de la ville. Ton prochain vrai cap : construire ton réseau local sans forcer les rencontres.';if(s.stage===3)return 'Nîmes commence à te connaître. Entre les contacts, le téléphone, les sorties et l’atelier, tes premières opportunités peuvent maintenant se croiser.';if(s.stage>=4)return 'Ta vie locale et ta carrière commencent à se mélanger : sorties, relations, commandes, Book et Atelier forment maintenant le même fil.';return ''}
function refreshHome(){if(!location.pathname.includes('/chez-moi/'))return;const s=state(),story=document.querySelector('#storyText');if(story)story.textContent=homeCopy();const tag=document.querySelector('#sceneTag');if(tag&&s.stage>=3)tag.textContent='NÎMES · TON POINT D’ANCRAGE';let box=document.querySelector('#hcNimesThreadBox');if(!box){const systems=document.querySelector('.systems');if(systems){box=document.createElement('div');box.id='hcNimesThreadBox';box.style.cssText='margin-top:10px;padding:11px 12px;border:1px solid #ead9ca;border-radius:14px;background:#fffdf9;font:11px/1.45 Georgia,serif';systems.appendChild(box)}}if(box){const labels=['INSTALLATION','DÉCOUVERTE','INSPIRATION','RÉSEAU','PREMIERS PROJETS'];box.innerHTML=`<b style="font-size:14px">FIL ROUGE · NÎMES</b><br><span>${labels[Math.min(s.stage,4)]}</span><br>${homeCopy()}`}}
function injectCityActions(){if(!location.pathname.includes('/ville/'))return;const host=document.querySelector('.panel');if(!host||document.querySelector('#hcNimesWalks'))return;const wrap=document.createElement('div');wrap.id='hcNimesWalks';wrap.style.cssText='margin-top:14px;padding-top:12px;border-top:1px solid #ead9ca';wrap.innerHTML='<b style="font:17px Georgia,serif">SE PROMENER</b><p style="font:10px/1.4 Georgia,serif;color:#786b63">Les rencontres ne vivent pas seulement dans les lieux. Marche dans Nîmes et vois ce qui se passe.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px"><button data-walk="ecusson">ÉCUSSON · 35 MIN</button><button data-walk="halles">AUTOUR DES HALLES · 30 MIN</button><button data-walk="jardins">CÔTÉ JARDINS · 40 MIN</button><button data-walk="gare">QUARTIER GARE · 30 MIN</button></div>';wrap.querySelectorAll('button').forEach(b=>{b.style.cssText='border:1px solid #ead9ca;background:#fffaf4;border-radius:10px;padding:9px 6px;font-size:8px;font-weight:900;cursor:pointer';b.onclick=()=>{const r=wander(b.dataset.walk);if(r?.repeated){b.textContent='DÉJÀ FAIT AUJOURD’HUI'}else b.textContent='✓ PROMENADE FAITE'}});host.appendChild(wrap)}
function boot(){start();refreshHome();injectCityActions()}
window.HCNimesThread={state,start,wander,onVisit,refreshHome,zones:ZONES};
window.addEventListener('hc-gard-visit-resolved',e=>onVisit(e.detail?.place));
window.addEventListener('hc-gard-encounter',onEncounter);
window.addEventListener('hc-gard-mission-offered',onMission);
window.addEventListener('hc-atelier-unlock',onAtelier);
window.addEventListener('hc-game-state',()=>setTimeout(refreshHome,20));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,250));else setTimeout(boot,250);
})();