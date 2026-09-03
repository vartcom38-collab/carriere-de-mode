/* Haute Couture Live — registre de connaissances et découvertes v1 */
(function(){
'use strict';
if(window.HCKnowledge)return;
const KEY='haute-couture-knowledge-v1';
const LEVELS=['unknown','seen','learned','discovered','practiced','mastered'];
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{version:1,items:{},history:[]}}catch(_){return{version:1,items:{},history:[]}}};
const save=s=>{localStorage.setItem(KEY,JSON.stringify(s));window.dispatchEvent(new CustomEvent('hc-knowledge',{detail:s}));return s};
const rank=l=>Math.max(0,LEVELS.indexOf(l));
function normalize(id,data={}){return{id:String(id),category:data.category||'general',label:data.label||String(id),level:data.level||'unknown',source:data.source||null,schoolId:data.schoolId||null,city:data.city||null,country:data.country||null,notes:data.notes||[],firstSeenAt:data.firstSeenAt||null,updatedAt:data.updatedAt||null}}
function get(id){const s=read();return s.items[id]||normalize(id)}
function setLevel(id,level,meta={}){if(!LEVELS.includes(level))return get(id);const s=read(),old=s.items[id]||normalize(id,meta);const nextRank=Math.max(rank(old.level),rank(level)),next={...old,...meta,id:String(id),level:LEVELS[nextRank],firstSeenAt:old.firstSeenAt||new Date().toISOString(),updatedAt:new Date().toISOString()};s.items[id]=next;s.history.push({id:String(id),from:old.level,to:next.level,source:meta.source||null,at:new Date().toISOString()});if(s.history.length>500)s.history=s.history.slice(-500);save(s);return next}
function teach(id,meta={}){return setLevel(id,'learned',{...meta,source:meta.source||'school'})}
function see(id,meta={}){return setLevel(id,'seen',meta)}
function discover(id,meta={}){return setLevel(id,'discovered',meta)}
function practice(id,meta={}){return setLevel(id,'practiced',meta)}
function master(id,meta={}){return setLevel(id,'mastered',meta)}
function knows(id,min='learned'){return rank(get(id).level)>=rank(min)}
function list(filter={}){const all=Object.values(read().items);return all.filter(x=>(!filter.category||x.category===filter.category)&&(!filter.minLevel||rank(x.level)>=rank(filter.minLevel)))}
function publicSummary(){const s=read(),counts=Object.fromEntries(LEVELS.map(l=>[l,0]));Object.values(s.items).forEach(x=>counts[x.level]=(counts[x.level]||0)+1);return{counts,total:Object.keys(s.items).length}}
window.HCKnowledge={version:1,levels:LEVELS,get,setLevel,teach,see,discover,practice,master,knows,list,summary:publicSummary,storageKey:KEY};
})();
