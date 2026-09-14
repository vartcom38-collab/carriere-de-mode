/* Haute Couture Live — Ain parity system bridge V1
   Raccorde le runtime territorial Ain aux systèmes canoniques : temps, téléphone, agenda,
   invitations/RSVP et studio photo basé sur une création réellement terminée.
*/
(function(){
'use strict';
if(window.__HCAinParitySystemBridgeV1)return;window.__HCAinParitySystemBridgeV1=true;
const MEM='haute-couture-ain-territorial-gameplay-v1';
const CREATIONS='haute-couture-atelier-creations-v1';
const STUDIO='haute-couture-studio-request-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch(_){return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(_){return false}};
const game=()=>window.HCGame||null;
const now=()=>game()?.get?.().clock?.iso||new Date().toISOString();
const plusMinutes=(iso,min)=>{const d=new Date(iso);d.setMinutes(d.getMinutes()+Number(min||0));const p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:00`};
function ainMemory(){const m=read(MEM,{});m.invitations=m.invitations||{};m.studio=m.studio||{};return m}
function saveMemory(m){write(MEM,m);return m}
function invitationId(payload={}){return 'ain-inv-'+String(payload.id||payload.title||Date.now()).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function createInvitation(payload={}){const m=ainMemory(),id=invitationId(payload);if(m.invitations[id])return m.invitations[id];const start=payload.start||plusMinutes(now(),180);const inv={id,title:payload.title||'Invitation locale',city:payload.city||'Ain',status:'pending',createdAt:now(),start,eventId:'event-'+id,source:payload.source||payload.id||'territoire'};m.invitations[id]=inv;saveMemory(m);game()?.addMessage?.({id:'msg-'+id,from:payload.from||'Réseau local',avatar:'✦',subject:'Invitation — '+inv.title,text:`Une invitation t’attend à ${inv.city}. Réponds avant de bloquer définitivement le créneau.`,action:{type:'ain-rsvp',invitationId:id}});game()?.schedule?.({id:inv.eventId,title:inv.title,type:'invitation',start:inv.start,status:'planned',location:inv.city});window.dispatchEvent(new CustomEvent('hc-ain-invitation',{detail:inv}));return inv}
function respondInvitation(id,response='accepted'){const m=ainMemory(),inv=m.invitations[id];if(!inv)return null;inv.status=response==='declined'?'declined':'accepted';inv.respondedAt=now();saveMemory(m);const g=game();if(g?.mutate)g.mutate(s=>{const e=(s.calendar||[]).find(x=>x.id===inv.eventId);if(e)e.status=inv.status==='accepted'?'planned':'cancelled'});g?.addMessage?.({id:'msg-rsvp-'+id+'-'+inv.status,from:'Agenda',avatar:'✓',subject:inv.status==='accepted'?'Invitation acceptée':'Invitation refusée',text:inv.status==='accepted'?`${inv.title} est confirmée dans ton agenda.`:`${inv.title} a été retirée de tes rendez-vous actifs.`});window.dispatchEvent(new CustomEvent('hc-ain-rsvp',{detail:{...inv}}));return inv}
function finishedCreations(){return read(CREATIONS,[]).filter(c=>{const s=String(c?.status||c?.progress||'').toLowerCase();return c?.finished===true||c?.completed===true||['finished','completed','realised','realized','delivered','ready_for_fitting','fitting_approved'].includes(s)||!!c?.completedAt||!!c?.realisedAt||!!c?.finishedAt})}
function prepareStudio(payload={}){const creations=finishedCreations();const requestedId=payload.garmentId||payload.creationId||null;const creation=(requestedId&&creations.find(c=>c.id===requestedId))||creations[0]||null;const req={id:'ain-studio-'+Date.now(),departmentCode:'01',city:payload.city||'Bourg-en-Bresse',createdAt:now(),requiresFinishedCreation:true,creationId:creation?.id||null,creationName:creation?.name||creation?.title||null,destinations:payload.destinations||['Book','Ateliergram','portfolio','dossier client'],status:creation?'ready':'blocked_no_finished_creation'};write(STUDIO,req);const m=ainMemory();m.studio.last=req;saveMemory(m);window.dispatchEvent(new CustomEvent(creation?'hc-studio-ready':'hc-studio-blocked',{detail:req}));return req}
window.addEventListener('hc-game-time-request',e=>{const d=e.detail||{};if(String(d.departmentCode||'')!=='01'||d.__ainHandled)return;d.__ainHandled=true;game()?.advanceTime?.(Number(d.minutes)||0,d.reason?`${d.reason} — ${d.city||'Ain'}`:'Activité territoriale — Ain')});
window.addEventListener('hc-territorial-signal',e=>{const d=e.detail||{};if(String(d.departmentCode||'')!=='01')return;if(d.kind==='phone_lead'||d.kind==='phone_rumor')game()?.addMessage?.({id:'ain-'+d.kind+'-'+(d.id||Date.now()),from:d.kind==='phone_rumor'?'Rumeur locale':'Contact local',avatar:d.kind==='phone_rumor'?'?':'•',subject:d.title||'Nouvelle piste',text:d.kind==='phone_rumor'?'Une information circule. À toi de décider si elle mérite d’être vérifiée.':'Un contact du territoire reprend la conversation.'});if(d.kind==='agenda_opportunity'||d.kind==='agenda_event')createInvitation({id:d.id,title:d.title,city:d.city,source:d.kind})});
window.addEventListener('hc-studio-photo-request',e=>{const d=e.detail||{};if(String(d.departmentCode||'')==='01')prepareStudio(d)});
window.HCAinParitySystemBridge={version:1,createInvitation,respondInvitation,finishedCreations,prepareStudio,ainMemory};
})();
