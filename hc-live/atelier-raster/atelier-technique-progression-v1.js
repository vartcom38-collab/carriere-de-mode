/* Haute Couture Live — progression technique globale v1
   Système indépendant de la ville : connue -> pratiquée -> maîtrisée -> experte.
   Compatible avec les apprentissages existants stockés dans haute-couture-techniques-v1.
*/
(function(){
'use strict';
if(window.HCAtelierTechniqueProgression)return;
const SKILL_KEY='haute-couture-techniques-v1',PROG_KEY='haute-couture-technique-progression-v1',HIST_KEY='haute-couture-technique-practice-history-v1',COMP_KEY='haute-couture-atelier-components-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch(e){return f}},write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
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
function ensureKnown(){const learned=learnedMap(),all=store();let changed=false;for(const [id,s] of Object.entries(learned)){if(!all[id]){const bonus=Math.max(0,(s.learnedLevel-1)*70);all[id]={id,name:s.name,xp:bonus,practiceCount:0,level:levelForXp(bonus).id,rank:levelForXp(bonus).rank,source:s.source,origin:s.origin,learnedLevel:s.learnedLevel,firstKnownAt:s.unlockedAt||now(),lastPracticedAt:null};changed=true}else if(Number(s.learnedLevel||1)>Number(all[id].learnedLevel||1)){all[id].learnedLevel=s.learnedLevel;all[id].xp=Math.max(Number(all[id].xp||0),(s.learnedLevel-1)*70);const l=levelForXp(all[id].xp);all[id].level=l.id;all[id].rank=l.rank;changed=true}}if(changed)write(PROG_KEY,all);return all}
function get(id){const all=ensureKnown(),k=norm(id);return all[k]||null}
function all(){return Object.values(ensureKnown()).sort((a,b)=>Number(b.xp||0)-Number(a.xp||0)||String(a.name).localeCompare(String(b.name),'fr'))}
function componentTechniques(){const c=read(COMP_KEY,[]);return [...new Set((Array.isArray(c)?c:[]).flatMap(x=>x.techniques||[]).map(norm).filter(Boolean))]}
function registerKnown(id,name,meta={}){const k=norm(id||name);if(!k)return null;const s=store();if(!s[k]){s[k]={id:k,name:name||id||k,xp:0,practiceCount:0,level:'known',rank:1,source:meta.source||'Découverte Atelier',origin:meta.origin||null,learnedLevel:Number(meta.learnedLevel||1),firstKnownAt:now(),lastPracticedAt:null};write(PROG_KEY,s);window.dispatchEvent(new CustomEvent('hc-technique-known',{detail:s[k]}))}return s[k]}
function xpGain(tech,creation,metrics){const base=34,complex=Math.max(0,Number(creation?.complexity||1)-1)*6,minutes=Math.min(24,Math.round(Number(metrics?.effectiveMinutes||creation?.workMinutes||90)/30)*2),quality=Number(metrics?.quality||creation?.quality||70)>=85?8:Number(metrics?.quality||creation?.quality||70)>=75?4:0;return Math.max(18,base+complex+minutes+quality)}
function practice(techniques,creation={},metrics={}){const ids=[...new Set((techniques||[]).map(norm).filter(Boolean))];if(!ids.length)return[];const s=ensureKnown(),events=[];for(const id of ids){const entry=s[id]||registerKnown(id,id,{source:'Pratique en Atelier'}),before=levelForXp(entry.xp||0),gain=xpGain(id,creation,metrics);entry.xp=Number(entry.xp||0)+gain;entry.practiceCount=Number(entry.practiceCount||0)+1;entry.lastPracticedAt=now();entry.lastCreationId=creation.id||null;const after=levelForXp(entry.xp);entry.level=after.id;entry.rank=after.rank;entry.name=entry.name||id;s[id]=entry;events.push({id,name:entry.name,gain,before:before.id,after:after.id,rank:after.rank,xp:entry.xp,promoted:before.id!==after.id})}write(PROG_KEY,s);let h=read(HIST_KEY,[]);h.unshift({at:now(),creationId:creation.id||null,orderId:creation.orderId||null,techniques:events});write(HIST_KEY,h.slice(0,1000));for(const ev of events){window.dispatchEvent(new CustomEvent('hc-technique-practiced',{detail:ev}));if(ev.promoted)window.dispatchEvent(new CustomEvent('hc-technique-level-up',{detail:ev}))}return events}
function masteryFor(techniques){const ids=[...new Set((techniques||[]).map(norm).filter(Boolean))];if(!ids.length)return{averageRank:1,known:0,total:0,missing:0,details:[]};const s=ensureKnown(),details=ids.map(id=>{const e=s[id];return{id,rank:Number(e?.rank||0),level:e?.level||'unknown',xp:Number(e?.xp||0)}});const known=details.filter(x=>x.rank>0).length,missing=details.length-known,avg=details.reduce((n,x)=>n+(x.rank||0),0)/details.length;return{averageRank:Number(avg.toFixed(2)),known,total:details.length,missing,details}}
function techniquesForCurrentBoard(){return componentTechniques()}
function boot(){ensureKnown();window.addEventListener('hc-skill-unlock',e=>{const d=e.detail||{};registerKnown(d.id||d.name,d.name||d.id,{source:d.source,origin:d.origin,learnedLevel:d.level});ensureKnown()});window.addEventListener('storage',e=>{if(e.key===SKILL_KEY)ensureKnown()});window.HCAtelierTechniqueProgression={version:1,levels:LEVELS,get,all,registerKnown,practice,masteryFor,techniquesForCurrentBoard,keys:{skills:SKILL_KEY,progression:PROG_KEY,history:HIST_KEY}};window.dispatchEvent(new CustomEvent('hc-technique-progression-ready',{detail:{version:1}}))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,220));else setTimeout(boot,220);
})();