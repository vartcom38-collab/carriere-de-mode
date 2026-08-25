/* Haute Couture Live — progression technique globale v2
   Système indépendant de la ville : connue -> pratiquée -> maîtrisée -> experte.
   Compatible avec les apprentissages existants stockés dans haute-couture-techniques-v1.
   Une formation apprend/renforce une technique ; les réalisations apportent la maîtrise par la pratique.
*/
(function(){
'use strict';
if(window.HCAtelierTechniqueProgression)return;
const SKILL_KEY='haute-couture-techniques-v1',PROG_KEY='haute-couture-technique-progression-v1',HIST_KEY='haute-couture-technique-practice-history-v1',COMP_KEY='haute-couture-atelier-components-v1';
const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v==null?f:v}catch(e){return f}},write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
const LEVELS=[
 {id:'known',label:'CONNUE',min:0,rank:1},
 {id:'practiced',label:'PRATIQUÉE',min:80,rank:2},
 {id:'mastered',label:'MAÎTRISÉE',min:220,rank:3},
 {id:'expert',label:'EXPERTE',min:520,rank:4}
];
function game(){try{return window.parent?.HCGame||window.top?.HCGame||window.HCGame||null}catch(e){return window.HCGame||null}}
function now(){return game()?.get?.().clock?.iso||new Date().toISOString()}
function sourceSkills(){const a=read(SKILL_KEY,[]);return Array.isArray(a)?a:[]}
function learnedMap(){const out={};for(const s of sourceSkills()){const id=norm(s.id||s.name);if(!id)continue;const lvl=Math.max(1,Number(s.level||1));out[id]={id,name:s.name||s.id,learnedLevel:lvl,source:s.source||null,origin:s.origin||null,unlockedAt:s.unlockedAt||null}}return out}
function store(){const raw=read(PROG_KEY,{});return raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{}}
function levelForXp(xp){let out=LEVELS[0];for(const l of LEVELS)if(Number(xp||0)>=l.min)out=l;return out}
function trainingFloor(level){return Math.max(0,(Math.max(1,Number(level||1))-1)*70)}
function ensureKnown(){const learned=learnedMap(),all=store();let changed=false;for(const [id,s] of Object.entries(learned)){if(!all[id]){const bonus=trainingFloor(s.learnedLevel),l=levelForXp(bonus);all[id]={id,name:s.name,xp:bonus,practiceCount:0,level:l.id,rank:l.rank,source:s.source,origin:s.origin,learnedLevel:s.learnedLevel,trained:true,firstKnownAt:s.unlockedAt||now(),lastPracticedAt:null};changed=true}else{const e=all[id],newLevel=Math.max(Number(e.learnedLevel||0),Number(s.learnedLevel||1)),floor=trainingFloor(newLevel);if(newLevel!==Number(e.learnedLevel||0)||Number(e.xp||0)<floor){e.learnedLevel=newLevel;e.trained=true;e.source=e.source||s.source;e.origin=e.origin||s.origin;e.xp=Math.max(Number(e.xp||0),floor);const l=levelForXp(e.xp);e.level=l.id;e.rank=l.rank;changed=true}}}if(changed)write(PROG_KEY,all);return all}
function get(id){const all=ensureKnown(),k=norm(id);return all[k]||null}
function all(){return Object.values(ensureKnown()).sort((a,b)=>Number(b.xp||0)-Number(a.xp||0)||String(a.name).localeCompare(String(b.name),'fr'))}
function componentTechniques(){const c=read(COMP_KEY,[]);return [...new Set((Array.isArray(c)?c:[]).flatMap(x=>x.techniques||[]).map(norm).filter(Boolean))]}
function registerKnown(id,name,meta={}){const k=norm(id||name);if(!k)return null;const s=store();if(!s[k]){s[k]={id:k,name:name||id||k,xp:0,practiceCount:0,level:'known',rank:1,source:meta.source||'Découverte Atelier',origin:meta.origin||null,learnedLevel:Number(meta.learnedLevel||0),trained:Number(meta.learnedLevel||0)>0,firstKnownAt:now(),lastPracticedAt:null};write(PROG_KEY,s);window.dispatchEvent(new CustomEvent('hc-technique-known',{detail:s[k]}))}return s[k]}
function xpGain(tech,creation,metrics){const complexity=Math.max(1,Number(creation?.complexity||1)),minutes=Math.max(30,Number(metrics?.effectiveMinutes||creation?.workMinutes||90)),quality=Number(metrics?.quality||creation?.quality||70);const base=30+(complexity-1)*7,work=Math.min(30,Math.round(minutes/30)*2),qualityBonus=quality>=90?10:quality>=80?7:quality>=70?4:0;return Math.max(18,base+work+qualityBonus)}
function history(){const h=read(HIST_KEY,[]);return Array.isArray(h)?h:[]}
function practice(techniques,creation={},metrics={}){const ids=[...new Set((techniques||[]).map(norm).filter(Boolean))];if(!ids.length)return[];const creationId=creation.id||null,h=history();const previous=creationId?h.find(x=>x.creationId===creationId):null;if(previous)return previous.techniques||[];const s=ensureKnown(),events=[];for(const id of ids){let entry=s[id];if(!entry){entry={id,name:id,xp:0,practiceCount:0,level:'known',rank:1,source:'Pratique en Atelier',origin:null,learnedLevel:0,trained:false,firstKnownAt:now(),lastPracticedAt:null}}const before=levelForXp(entry.xp||0),gain=xpGain(id,creation,metrics);entry.xp=Number(entry.xp||0)+gain;entry.practiceCount=Number(entry.practiceCount||0)+1;entry.lastPracticedAt=now();entry.lastCreationId=creationId;const after=levelForXp(entry.xp);entry.level=after.id;entry.rank=after.rank;entry.name=entry.name||id;s[id]=entry;events.push({id,name:entry.name,gain,before:before.id,after:after.id,rank:after.rank,xp:entry.xp,promoted:before.id!==after.id,trained:!!entry.trained,learnedLevel:Number(entry.learnedLevel||0)})}write(PROG_KEY,s);h.unshift({at:now(),creationId,orderId:creation.orderId||null,techniques:events});write(HIST_KEY,h.slice(0,1000));for(const ev of events){window.dispatchEvent(new CustomEvent('hc-technique-practiced',{detail:ev}));if(ev.promoted)window.dispatchEvent(new CustomEvent('hc-technique-level-up',{detail:ev}))}return events}
function masteryFor(techniques){const ids=[...new Set((techniques||[]).map(norm).filter(Boolean))];if(!ids.length)return{averageRank:1,known:0,total:0,missing:0,details:[]};const s=ensureKnown(),details=ids.map(id=>{const e=s[id];return{id,rank:Number(e?.rank||0),level:e?.level||'unknown',xp:Number(e?.xp||0),trained:!!e?.trained,learnedLevel:Number(e?.learnedLevel||0),practiceCount:Number(e?.practiceCount||0)}});const known=details.filter(x=>x.rank>0).length,missing=details.length-known,avg=details.reduce((n,x)=>n+(x.rank||0),0)/details.length;return{averageRank:Number(avg.toFixed(2)),known,total:details.length,missing,details}}
function careerEffects(techniques){const m=masteryFor(techniques),rank=Math.max(.5,Number(m.averageRank||1));return{averageRank:rank,timeMultiplier:Number(Math.max(.82,1.08-(rank-1)*.08).toFixed(2)),qualityBonus:Math.round((rank-1)*4),retouchReduction:Math.round((rank-1)*6),missing:m.missing,details:m.details}}
function techniquesForCurrentBoard(){return componentTechniques()}
function boot(){ensureKnown();window.addEventListener('hc-skill-unlock',e=>{const d=e.detail||{};registerKnown(d.id||d.name,d.name||d.id,{source:d.source,origin:d.origin,learnedLevel:d.level});ensureKnown()});window.addEventListener('storage',e=>{if(e.key===SKILL_KEY)ensureKnown()});window.HCAtelierTechniqueProgression={version:2,levels:LEVELS,get,all,registerKnown,practice,masteryFor,careerEffects,techniquesForCurrentBoard,keys:{skills:SKILL_KEY,progression:PROG_KEY,history:HIST_KEY}};window.dispatchEvent(new CustomEvent('hc-technique-progression-ready',{detail:{version:2}}))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,220));else setTimeout(boot,220);
})();
