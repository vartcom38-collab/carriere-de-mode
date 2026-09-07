/* Haute Couture Live — rythme quotidien v1
   Mémorise les traces d'une journée et rend retours chez soi / week-ends plus sensibles, sans bonus ni pénalité.
*/
(function(){
'use strict';
if(window.HCDailyLifeRhythmV1)return;
const KEY='haute-couture-daily-life-rhythm-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
function game(){try{return window.HCGame?.get?.()||read('haute-couture-game-state-v1',{})||{}}catch(_){return {}}}
function ctx(){const g=game(),iso=g.clock?.iso||new Date().toISOString(),d=new Date(iso),dow=d.getDay();return{day:Number(g.clock?.day||1),iso,hour:d.getHours(),dow,weekend:dow===0||dow===6,weekday:['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'][dow]}}
function state(){const s=read(KEY,{version:1,days:{},returnScenes:{}});s.days=s.days||{};s.returnScenes=s.returnScenes||{};return s}
function trace(kind,label,meta={}){const c=ctx(),s=state(),d=s.days[c.day]||(s.days[c.day]={day:c.day,traces:[],createdAt:new Date().toISOString()});const id=meta.id||`${kind}:${String(label||'').slice(0,80)}`;if(!d.traces.some(x=>x.id===id))d.traces.push({id,kind,label:String(label||''),meta,at:new Date().toISOString()});d.traces=d.traces.slice(-24);write(KEY,s);return d}
function today(){const c=ctx();return state().days[c.day]||{day:c.day,traces:[]}}
function recap(){const t=today(),types={};t.traces.forEach(x=>types[x.kind]=(types[x.kind]||0)+1);let headline='Une journée plutôt calme.';let body='Tu rentres sans qu’un événement particulier prenne toute la place. Certaines journées servent simplement à avancer.';
 const last=t.traces[t.traces.length-1];
 if(types.client) {headline='Une journée tournée vers quelqu’un d’autre.';body='Le travail avec une cliente reste encore un peu présent quand tu rentres. Tu repenses aux détails qui ont demandé le plus d’attention.'}
 else if(types.creation||types.skill){headline='Le travail reste dans les mains.';body='Même rentrée chez toi, tu continues mentalement un geste, une matière ou une construction commencée plus tôt.'}
 else if(types.visit||types.circuit){headline='Tu ramènes un lieu avec toi.';body='Des formes, une matière ou une couleur observée aujourd’hui restent plus nettes que le reste.'}
 else if(types.social){headline='Une conversation revient.';body='Une phrase entendue aujourd’hui te revient sans forcément demander une réponse immédiate.'}
 if(last?.label)body+=` La dernière trace nette de la journée : ${last.label}`;
 return{headline,body,count:t.traces.length,traces:t.traces.slice(-4)} }
function weekendCopy(){const c=ctx();if(!c.weekend)return null;return c.dow===6?'Samedi. La ville n’a pas tout à fait le même rythme : certains rendez-vous professionnels disparaissent, d’autres lieux deviennent plus vivants. Rien ne t’oblige à remplir la journée.':'Dimanche. Certaines portes restent fermées, d’autres promenades deviennent plus naturelles. Une journée vide n’est pas une journée perdue.'}
function homeReturnScene(){if(!/\/chez-moi\/?/i.test(location.pathname)||!window.HCImmersiveDialogueV1)return false;const c=ctx();if(c.hour<18)return false;const s=state(),id=`return:${c.day}`;if(s.returnScenes[id])return false;s.returnScenes[id]={at:new Date().toISOString()};write(KEY,s);const r=recap(),wc=weekendCopy();const scene={id:`home-return-${c.day}`,speaker:{name:'Chez moi',role:`${c.weekday} · retour de journée`,photo:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&fm=jpg&q=84&w=1200'},eyebrow:'Chez moi · fin de journée',start:'return',nodes:{return:{text:r.body,subtext:wc||'Tu peux encore faire quelque chose ce soir, ou laisser la journée se terminer sans chercher à la rentabiliser.',choices:[{label:'Rester un moment chez moi.',reply:'Le rythme retombe. Tu n’as rien à optimiser.'},{label:'Regarder ce qui reste pour demain.',reply:'Tu gardes seulement en tête ce qui mérite vraiment de revenir demain.'},{label:'Continuer ma soirée.',reply:'La journée n’est pas encore obligée de se terminer.'}]}}};setTimeout(()=>window.HCImmersiveDialogueV1.open(scene),650);return true}
function decorateHome(){if(!/\/chez-moi\/?/i.test(location.pathname))return;const wc=weekendCopy();if(wc&&!document.querySelector('.hc-weekend-note')){const host=document.querySelector('.hchi-priority')||document.querySelector('.side .panel');if(host){const d=document.createElement('div');d.className='hc-weekend-note';d.style.cssText='margin-top:10px;font:12px/1.5 Georgia,serif;color:#735f56';d.textContent=wc;host.appendChild(d)}}}
function onSkill(e){trace('skill',e.detail?.name||e.detail?.id||'Une technique travaillée',{id:'skill:'+String(e.detail?.id||'')+':'+String(e.detail?.level||'')})}
function onGuide(e){trace('visit',e.detail?.title||e.detail?.placeId||'Une visite culturelle',{id:'guide:'+String(e.detail?.placeId||'')})}
function onCircuit(e){trace('circuit',e.detail?.title||e.detail?.circuitId||'Une excursion territoriale',{id:'circuit:'+String(e.detail?.circuitId||'')})}
function onTalk(e){trace('social','Une conversation à '+(e.detail?.place||'Nîmes'),{id:'talk:'+String(e.detail?.personId||'')+':'+ctx().day})}
function onClient(e){if(e.detail?.status==='completed')trace('client','Une commande cliente terminée',{id:'client:'+String(e.detail?.clientId||'')+':'+ctx().day})}
function onCreation(e){trace('creation',e.detail?.title||e.detail?.name||'Une création avancée',{id:'creation:'+String(e.detail?.id||'')+':'+ctx().day})}
window.addEventListener('hc-skill-unlock',onSkill);window.addEventListener('hc-guide-complete',onGuide);window.addEventListener('hc-circuit-complete',onCircuit);window.addEventListener('hc-nimes-person-talk',onTalk);window.addEventListener('hc-client-order',onClient);window.addEventListener('hc-creation-complete',onCreation);
function boot(){decorateHome();homeReturnScene();setTimeout(()=>{decorateHome();homeReturnScene()},600)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();window.addEventListener('hc-game-state',()=>setTimeout(boot,120));
window.HCDailyLifeRhythmV1={version:1,state,trace,today,recap,weekendCopy,homeReturnScene,storageKey:KEY};
})();