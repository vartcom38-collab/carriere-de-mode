/* Haute Couture Live — arcs relationnels scolaires persistants v1 */
(function(){
'use strict';
if(window.HCSchoolRelationshipArcsV1)return;
const COMMUNITY='haute-couture-school-community-v1',ACADEMIC='haute-couture-school-academic-v1',MEM='haute-couture-school-relationship-arcs-v1';
const read=(k,f=null)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
const now=()=>new Date().toISOString();
const dayKey=()=>{const a=window.HCSchoolAcademic?.state?.()||read(ACADEMIC,{year:1,week:1,day:1});return `y${a.year||1}-w${a.week||1}-d${a.day||1}`};
function label(r){
 const a=Number(r.affinity||0),t=Number(r.trust||0),fr=Number(r.friction||0),last=Number(r.lastInteractionIndex||0),idx=timelineIndex();
 if(fr>=4&&a<=2)return'tension';
 if(r.met&&idx-last>=18&&a>=4)return'distance';
 if(t>=5&&a>=8)return'amitié forte';
 if(t>=3&&a>=5)return'amitié';
 if(a>=3)return'habitude';
 if(r.met)return'connaissance';
 return'inconnu';
}
function timelineIndex(){const a=window.HCSchoolAcademic?.state?.()||read(ACADEMIC,{year:1,week:1,day:1});return ((Number(a.year||1)-1)*32+Number(a.week||1)-1)*7+Number(a.day||1)}
function ensure(){
 const c=read(COMMUNITY,{relationships:{}})||{relationships:{}};c.relationships=c.relationships||{};
 const mem=read(MEM,{version:1,people:{},history:[]})||{version:1,people:{},history:[]};mem.people=mem.people||{};mem.history=mem.history||[];
 for(const [id,r] of Object.entries(c.relationships)){
   r.friction=Number(r.friction||0);r.sharedWork=Number(r.sharedWork||0);r.helpGiven=Number(r.helpGiven||0);r.helpReceived=Number(r.helpReceived||0);r.lastInteractionIndex=Number(r.lastInteractionIndex||0);
   const next=label(r),prev=r.bondState||'inconnu';r.bondState=next;
   mem.people[id]=mem.people[id]||{personId:id,states:[],milestones:[]};
   if(prev!==next){const ev={at:now(),day:dayKey(),personId:id,from:prev,to:next};mem.people[id].states.unshift(ev);mem.people[id].states=mem.people[id].states.slice(0,30);mem.history.unshift(ev);}
 }
 mem.history=mem.history.slice(0,200);write(COMMUNITY,c);write(MEM,mem);return{community:c,memory:mem};
}
function note(id,type,text,delta={}){
 const c=read(COMMUNITY,{relationships:{}})||{relationships:{}};const r=c.relationships?.[id];if(!r)return false;
 r.met=true;r.affinity=Number(r.affinity||0)+Number(delta.affinity||0);r.trust=Number(r.trust||0)+Number(delta.trust||0);r.friction=Math.max(0,Number(r.friction||0)+Number(delta.friction||0));r.sharedWork=Number(r.sharedWork||0)+Number(delta.sharedWork||0);r.helpGiven=Number(r.helpGiven||0)+Number(delta.helpGiven||0);r.helpReceived=Number(r.helpReceived||0)+Number(delta.helpReceived||0);r.lastInteractionIndex=timelineIndex();r.history=r.history||[];r.history.unshift({at:now(),type,text});r.history=r.history.slice(0,40);write(COMMUNITY,c);ensure();window.dispatchEvent(new CustomEvent('hc-school-relationship-arc',{detail:{personId:id,type}}));return true;
}
function inferFromInteraction(id,kind){
 if(kind==='aider')return note(id,'entraide','Marion a pris du temps pour aider cette personne.',{trust:1,helpGiven:1});
 if(kind==='demander-avis')return note(id,'avis','Marion lui a demandé un avis sur son travail.',{trust:1});
 return note(id,'discussion','Une nouvelle discussion prolonge leur habitude de se parler.',{});
}
function patchCommunity(){const api=window.HCSchoolCommunity;if(!api||api.__hcArcsPatched)return false;
 const originalInteract=api.interact?.bind(api),originalAttend=api.attendEvent?.bind(api);
 if(originalInteract)api.interact=function(id,kind='discuter'){const out=originalInteract(id,kind);if(out?.ok)inferFromInteraction(id,kind);return out};
 if(originalAttend)api.attendEvent=function(id){const before=read(COMMUNITY,{relationships:{}});const out=originalAttend(id);if(out?.ok&&!out.already){const after=read(COMMUNITY,{relationships:{}});for(const [pid,r] of Object.entries(after.relationships||{})){const b=before.relationships?.[pid];if(Number(r.affinity||0)>Number(b?.affinity||0))note(pid,'moment-partagé','Un moment de vie d’école devient un souvenir commun.',{trust:1});}}return out};
 api.__hcArcsPatched=true;ensure();return true;}
function recordSharedProject(personIds,projectId,title){(personIds||[]).forEach(id=>note(id,'projet-partagé',`Travail partagé : ${title||projectId||'projet'}.`,{trust:1,sharedWork:1}));}
function recordTension(id,text='Un désaccord laisse une petite trace entre eux.'){return note(id,'tension',text,{friction:2,affinity:-1});}
function repair(id,text='Ils ont pris le temps de remettre les choses à plat.'){return note(id,'réparation',text,{friction:-2,trust:1});}
function get(id){const c=ensure().community,r=c.relationships?.[id];return r?{...r,bondState:label(r)}:null}
function all(){const c=ensure().community;return Object.fromEntries(Object.entries(c.relationships||{}).map(([id,r])=>[id,{...r,bondState:label(r)}]))}
function boot(){let n=0;const t=setInterval(()=>{n++;if(patchCommunity()||n>80)clearInterval(t)},80);ensure();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.addEventListener('hc-school-housing-encounter',e=>{const id=e.detail?.personId;if(id)note(id,'hors-cours','Ils se sont croisés en dehors des cours à cause de leur quotidien étudiant.',{affinity:1});});
window.HCSchoolRelationshipArcsV1={version:1,ensure,get,all,note,recordSharedProject,recordTension,repair,patchCommunity,storageKey:MEM};
})();