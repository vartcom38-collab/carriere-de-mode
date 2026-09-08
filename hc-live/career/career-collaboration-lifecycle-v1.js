/* Haute Couture Live — cycle de collaboration & départs v1 */
(function(){
'use strict';
if(window.HCCareerCollaborationLifecycleV1)return;
const KEY='haute-couture-career-collaboration-lifecycle-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return v}catch(_){return v}};
const now=()=>new Date().toISOString();
const day=()=>Number(window.HCGame?.get?.()?.clock?.day||1);
function state(){const s=read(KEY,{version:1,collaborations:{},history:[]});s.version=1;s.collaborations=s.collaborations||{};s.history=s.history||[];return s}
function save(s){s.updatedAt=now();s.history=s.history.slice(0,400);return write(KEY,s)}
function slug(v){return String(v||'structure').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80)||'structure'}
function start(payload={}){const s=state(),name=String(payload.name||payload.organization||payload.company||payload.studio||payload.atelier||'Structure professionnelle').trim(),institutionId=payload.institutionId||('career-org-'+slug(name)),id=payload.id||('collab:'+institutionId+':'+day()+':'+slug(payload.kind||'mission'));if(s.collaborations[id])return s.collaborations[id];const rec={id,institutionId,name,kind:payload.kind||'collaboration',status:'active',startedDay:day(),startedAt:now(),territory:payload.territory||payload.city||null,sourceId:payload.sourceId||null,role:payload.role||null,renewable:payload.renewable!==false,history:[{type:'started',day:day(),at:now()}]};s.collaborations[id]=rec;s.history.unshift({collaborationId:id,institutionId,type:'started',day:day(),at:now()});save(s);window.HCCareerInstitutionMemoryV1?.record?.({id:institutionId,name,eventType:'collaboration-start',sourceId:id,status:'active',text:'Collaboration professionnelle commencée.',territory:rec.territory,trustDelta:1});window.dispatchEvent(new CustomEvent('hc-career-collaboration-start',{detail:rec}));return rec}
const EXIT={
 natural:{label:'Fin naturelle de la mission',status:'completed',trust:1,friction:0,text:'La mission arrive à son terme prévu. La collaboration se termine proprement.'},
 clean:{label:'Partir proprement',status:'left-cleanly',trust:1,friction:0,text:'Marion annonce son départ clairement et laisse une relation professionnelle exploitable.'},
 decline:{label:'Refuser un renouvellement',status:'renewal-declined',trust:0,friction:0,text:'Marion refuse de poursuivre, sans fermer la porte ni promettre davantage.'},
 move:{label:'Partir pour déménager',status:'left-for-move',trust:0,friction:0,text:'Le départ est lié à un changement de lieu de vie. La relation professionnelle peut continuer à distance.'},
 tense:{label:'Quitter après une tension',status:'left-tense',trust:-1,friction:2,text:'La collaboration se termine dans une tension réelle. La structure s’en souviendra.'},
 dismissed:{label:'La structure met fin à la collaboration',status:'ended-by-structure',trust:-1,friction:1,text:'La structure met fin à la collaboration. Le contexte restera dans l’historique professionnel.'}
};
function end(id,reason='natural',extra={}){const s=state(),rec=s.collaborations[id];if(!rec||rec.status!=='active')return rec||null;const cfg=EXIT[reason]||EXIT.natural;rec.status=cfg.status;rec.endedDay=day();rec.endedAt=now();rec.exitReason=reason;rec.exitText=extra.text||cfg.text;rec.history=rec.history||[];rec.history.unshift({type:'ended',reason,status:cfg.status,day:day(),at:now(),text:rec.exitText});s.history.unshift({collaborationId:id,institutionId:rec.institutionId,type:'ended',reason,status:cfg.status,day:day(),at:now()});save(s);window.HCCareerInstitutionMemoryV1?.record?.({id:rec.institutionId,name:rec.name,eventType:'collaboration-end',sourceId:id,status:cfg.status,text:rec.exitText,territory:rec.territory,trustDelta:cfg.trust,frictionDelta:cfg.friction});window.dispatchEvent(new CustomEvent('hc-career-collaboration-end',{detail:{collaboration:rec,reason,config:cfg}}));return rec}
function active(){return Object.values(state().collaborations).filter(x=>x.status==='active')}
function all(){return Object.values(state().collaborations).sort((a,b)=>String(b.startedAt||'').localeCompare(String(a.startedAt||'')))}
function choices(){return Object.entries(EXIT).map(([id,x])=>({id,label:x.label,text:x.text}))}
function boot(){window.addEventListener('hc-career-collaboration-request-start',e=>start(e.detail||{}));window.addEventListener('hc-career-collaboration-request-end',e=>end(e.detail?.id,e.detail?.reason,e.detail||{}))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.HCCareerCollaborationLifecycleV1={version:1,state,start,end,active,all,choices,exitTypes:EXIT,storageKey:KEY};
})();