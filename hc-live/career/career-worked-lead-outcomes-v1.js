/* Haute Couture Live — résultats des pistes réellement travaillées v1 */
(function(){
'use strict';
if(window.HCCareerWorkedLeadOutcomesV1)return;
const KEY='haute-couture-career-worked-lead-outcomes-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
const day=()=>Number(window.HCGame?.get?.()?.clock?.day||1);
function state(){const s=read(KEY,{version:1,results:{}});s.results=s.results||{};return s}
function person(id){return (window.HCNimesPeople||[]).find(x=>x.id===id)||null}
function onWorked(e){const d=e.detail||{},lead=d.lead||{},axis=d.axis||lead.axis||'contact',id=lead.id||lead.followupId;if(!id)return;const s=state();if(s.results[id])return;const p=person(lead.personId);const result={id,axis,day:day(),status:'qualified',personId:lead.personId||'',createdAt:new Date().toISOString()};window.HCGame?.mutate?.(g=>{g.messages=g.messages||[];if(axis==='textile'||axis==='structure'){g.atelierPistes=g.atelierPistes||[];const x=g.atelierPistes.find(v=>v.id===lead.id)||g.atelierPistes.find(v=>v.axis===axis&&v.status==='worked');if(x){x.status='tested';x.result=d.result||'';x.testedDay=day()}result.type='tested-technique';}
else if(axis==='image'){g.creativeProjects=g.creativeProjects||[];const x=g.creativeProjects.find(v=>v.id===lead.id)||g.creativeProjects.find(v=>v.type==='shooting-lead'&&v.status==='worked');if(x){x.status='ready-to-shoot';x.preparedDay=day();x.preparation=d.result||''}result.type='shooting-ready';g.messages.unshift({id:'worked-image-'+id,from:p?.name||'Contact éditorial',subject:'La piste image est prête à aller plus loin',text:'Vous avez désormais assez cadré l’intention pour envisager un vrai shooting. Rien n’est encore réalisé.',receivedAt:g.clock?.iso||new Date().toISOString(),read:false})}
else if(axis==='heritage'){g.culturalLeads=g.culturalLeads||[];const x=g.culturalLeads.find(v=>v.id===lead.id)||g.culturalLeads.find(v=>v.status==='worked');if(x){x.status='researched';x.researchedDay=day();x.result=d.result||''}result.type='reference-researched'}
else if(axis==='ceremony'||axis==='drape'){g.clientLeads=g.clientLeads||[];let x=g.clientLeads.find(v=>v.id===lead.id)||g.clientLeads.find(v=>v.status==='worked');if(x){x.status='briefed';x.briefedDay=day();x.briefResult=d.result||''}else{g.clientLeads.unshift({id:'briefed-'+id,title:'Cliente potentielle · '+(p?.firstName||'Nîmes'),personId:lead.personId||'',axis,status:'briefed',source:'Réseau Nîmes',createdDay:day(),briefResult:d.result||''})}result.type='client-briefed';g.messages.unshift({id:'worked-client-'+id,from:p?.name||'Cliente potentielle',subject:'Le brief est maintenant assez clair',text:'Le besoin est qualifié. Tu peux maintenant décider plus tard si tu veux transformer cette piste en vraie commande.',receivedAt:g.clock?.iso||new Date().toISOString(),read:false})}
else{result.type='professional-contact';}});s.results[id]=result;write(KEY,s);window.dispatchEvent(new CustomEvent('hc-career-lead-result',{detail:result}))}
window.addEventListener('hc-career-lead-worked',onWorked);
window.HCCareerWorkedLeadOutcomesV1={version:1,state,onWorked,storageKey:KEY};
})();