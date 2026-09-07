/* Haute Couture Live — conséquences sociales Nîmes v1.
   Les informations circulent dans le réseau local de façon limitée, traçable et sans cascade infinie.
*/
(function(){
'use strict';
if(window.HCNimesSocialConsequencesV1)return;
const KEY='haute-couture-nimes-social-consequences-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
const day=()=>Number(window.HCGame?.get?.()?.clock?.day||1);
function state(){const s=read(KEY,{version:1,heard:{},events:[],recommendations:[],invitations:[]});s.heard=s.heard||{};s.events=s.events||[];s.recommendations=s.recommendations||[];s.invitations=s.invitations||[];return s}
function knownIds(){return window.HCTerritorialPopulationV1?.state?.().known||[]}
function person(id){return (window.HCNimesPeople||[]).find(x=>x.id===id)||null}
function rememberEvent(evt){const s=state();if(s.events.some(x=>x.id===evt.id))return false;s.events.unshift(evt);s.events=s.events.slice(0,180);write(KEY,s);return true}
function tell(targetId,topic,sourceId,meta={}){if(!targetId||!topic||targetId===sourceId)return false;const s=state(),bucket=s.heard[targetId]||(s.heard[targetId]=[]);const id=meta.id||[targetId,topic,sourceId,meta.origin||''].join(':');if(bucket.some(x=>x.id===id))return false;const entry={id,targetId,topic,sourceId,origin:meta.origin||sourceId,kind:meta.kind||'heard',summary:meta.summary||'',day:day(),at:new Date().toISOString()};bucket.unshift(entry);s.heard[targetId]=bucket.slice(0,40);write(KEY,s);window.dispatchEvent(new CustomEvent('hc-nimes-heard-about-player',{detail:entry}));return true}
function recipients(sourceId,{types=null,limit=2}={}){const links=window.HCNimesSocialGraphV1?.links?.(sourceId)||[];return links.filter(x=>!types||types.includes(x.type)).slice(0,limit)}
function spread(sourceId,topic,meta={}){if(!sourceId||!window.HCNimesSocialGraphV1)return[];const out=[];for(const link of recipients(sourceId,{types:meta.types||['professional','regular','mutual-respect','acquaintance','academic','creative-contact'],limit:meta.limit||2})){if(tell(link.id,topic,sourceId,meta))out.push(link.id)}return out}
function recommend(sourceId,targetId,reason,meta={}){const s=state(),id=meta.id||`rec:${sourceId}:${targetId}:${reason}`;if(s.recommendations.some(x=>x.id===id))return false;const entry={id,sourceId,targetId,reason,day:day(),at:new Date().toISOString(),status:'available'};s.recommendations.unshift(entry);s.recommendations=s.recommendations.slice(0,100);write(KEY,s);tell(targetId,'recommendation',sourceId,{id:'heard:'+id,kind:'recommendation',summary:reason,origin:sourceId});window.dispatchEvent(new CustomEvent('hc-nimes-recommendation',{detail:entry}));return true}
function hearsayFor(personId){return (state().heard[personId]||[]).slice()}
function consumeHearsay(personId,id){const s=state(),b=s.heard[personId]||[],x=b.find(e=>e.id===id);if(x)x.consumedAt=new Date().toISOString();write(KEY,s);return x||null}
function onClientOrder(e){const o=e.detail||{};if(o.clientId!=='eloise-martin'||o.status!=='completed')return;const evt={id:'eloise-completed:'+String(o.completedAt||o.payment||day()),kind:'client-success',sourceId:'eloise-martin',day:day(),at:new Date().toISOString()};if(!rememberEvent(evt))return;const targets=spread('eloise-martin','client-work',{origin:'eloise-martin',summary:o.late?'Éloïse a bien reçu sa tenue, malgré un retard.':'Éloïse a parlé positivement de la tenue réalisée pour elle.',limit:o.late?1:2});if(!o.late&&targets.length){const first=targets[0];recommend('eloise-martin',first,'Éloïse a parlé de ton travail après sa commande.',{id:'eloise-recommendation:'+first})}}
function onSkill(e){const x=e.detail||{};if(!/boutis-bas-languedoc/i.test(String(x.id||'')))return;const evt={id:'claire-skill:'+String(x.level||1),kind:'skill',sourceId:'nimes-claire-vidal',day:day(),at:new Date().toISOString()};if(!rememberEvent(evt))return;spread('nimes-claire-vidal','technical-progress',{origin:'nimes-claire-vidal',summary:`Claire a remarqué ta progression en boutis (niveau ${x.level||1}).`,limit:Number(x.level||1)>=2?2:1})}
function onTalk(e){const id=e.detail?.personId;if(!id)return;const p=person(id);if(!p)return;const ps=window.HCTerritorialPopulationV1?.personState?.(id);if(!ps?.known)return;const links=window.HCNimesSocialGraphV1?.links?.(id)||[];const known=new Set(knownIds());const mutual=links.find(x=>known.has(x.id));if(mutual){tell(id,'mutual-contact',mutual.id,{id:`mutual:${id}:${mutual.id}`,origin:mutual.id,summary:`Vous avez ${person(mutual.id)?.firstName||'une connaissance'} en commun.`})}}
function onGuide(e){const placeId=e.detail?.placeId;if(!placeId)return;const cultureSources={
 'nimes-arenes':'nimes-sacha-maurel','nimes-maison-carree':'nimes-manon-vial','nimes-musee-romanite':'nimes-pauline-rey','nimes-tour-magne':'nimes-victor-meunier','nimes-jardins-fontaine':'nimes-lila-bresson'
};const sourceId=cultureSources[placeId];if(!sourceId)return;const evt={id:'guide:'+placeId,kind:'cultural-visit',sourceId,day:day(),at:new Date().toISOString()};if(!rememberEvent(evt))return;spread(sourceId,'cultural-curiosity',{origin:sourceId,summary:'Ton intérêt pour ce lieu a été remarqué dans un petit cercle local.',limit:1})}
window.addEventListener('hc-client-order',onClientOrder);
window.addEventListener('hc-skill-unlock',onSkill);
window.addEventListener('hc-nimes-person-talk',onTalk);
window.addEventListener('hc-guide-complete',onGuide);
window.HCNimesSocialConsequencesV1={version:1,state,spread,tell,recommend,hearsayFor,consumeHearsay};
})();
