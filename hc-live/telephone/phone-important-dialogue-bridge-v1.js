/* Haute Couture Live — messages/appels importants -> scènes immersives v1 */
(function(){
'use strict';
if(window.HCPhoneImportantDialogueBridgeV1)return;
const GKEY='haute-couture-game-state-v1',PKEY='haute-couture-phone-social-v2',KEY='haute-couture-phone-important-dialogue-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}},write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
function state(){const s=read(KEY,{version:1,seen:{}});s.seen=s.seen||{};return s}
function game(){return read(GKEY,{messages:[]})}
function phone(){return read(PKEY,{notifications:[],opportunities:[]})}
function important(){const s=state(),g=game(),p=phone();const msg=(g.messages||[]).find(m=>m&&!m.read&&m.action?.type!=='nimes_deferred_social'&&!s.seen['m:'+m.id]&&(m.action||/recommand|opportun|cliente|rendez-vous|projet|collab|agence|atelier/i.test((m.subject||'')+' '+(m.text||''))));if(msg)return{kind:'message',id:'m:'+msg.id,data:msg};const opp=(p.opportunities||[]).find(o=>o&&o.status==='offered'&&!s.seen['o:'+o.id]);if(opp)return{kind:'opportunity',id:'o:'+opp.id,data:opp};return null}
function speaker(x){if(x.kind==='message')return{name:x.data.from||'Un contact',role:x.data.subject||'Message important',photo:'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&fm=jpg&q=84&w=1100'};return{name:x.data.from||'Un contact professionnel',role:x.data.kind||'Opportunité',photo:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&fm=jpg&q=84&w=1100'}}
function scene(x){if(x.kind==='message'){const m=x.data;return{id:`phone-important-${m.id}`,speaker:speaker(x),eyebrow:'Téléphone · message important',start:'hello',nodes:{hello:{text:m.text||'Tu reçois un message important.',choices:[{label:'Demander ce qui est attendu concrètement.',reply:'Tu demandes le contexte, le calendrier et ce qui doit réellement être livré avant de répondre.'},{label:'Dire que tu regardes et que tu reviens vers la personne.',reply:'Tu accuses réception sans promettre davantage. Le message reste dans ton téléphone.'},{label:'Répondre plus tard.',reply:'Tu gardes le message pour plus tard. Ne pas répondre immédiatement n’efface pas la relation.'}]}}};}
const o=x.data;return{id:`phone-opportunity-${o.id}`,speaker:speaker(x),eyebrow:'Téléphone · une possibilité arrive',start:'hello',nodes:{hello:{text:`« ${o.title||'J’ai une proposition qui pourrait t’intéresser.'} »`,subtext:o.requirement?`Condition annoncée : ${o.requirement}`:'Tu peux demander des précisions avant de décider.',choices:[{label:'Qu’est-ce que vous attendez exactement ?',reply:'La discussion revient aux livrables, au calendrier et à ce que chacun apporte. Tu évites de confondre “opportunité” et “bonne affaire”.'},{label:'Je veux d’abord vérifier si ça correspond à ma direction.',reply:'Tu gardes la possibilité ouverte sans modifier ton travail juste pour plaire.'},{label:'Ce n’est pas le bon moment.',reply:'Tu déclines pour l’instant. Toutes les opportunités ne doivent pas être prises.'}]}}}}
function mark(x){const s=state();s.seen[x.id]={at:new Date().toISOString(),kind:x.kind};write(KEY,s)}
function maybeOpen(){if(!/telephone/.test(location.pathname.toLowerCase())||!window.HCImmersiveDialogueV1)return;const x=important();if(!x)return;mark(x);setTimeout(()=>window.HCImmersiveDialogueV1.open(scene(x)),700)}
window.addEventListener('hc-phone-state',()=>setTimeout(maybeOpen,500));window.addEventListener('hc-game-state',()=>setTimeout(maybeOpen,500));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(maybeOpen,900));else setTimeout(maybeOpen,900);
window.HCPhoneImportantDialogueBridgeV1={version:2,important,scene,maybeOpen,state,storageKey:KEY};
})();
