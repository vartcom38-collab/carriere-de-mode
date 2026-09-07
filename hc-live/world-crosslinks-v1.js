/* Haute Couture Live — ponts transversaux monde -> Book / mémoire v1 */
(function(){
'use strict';
if(window.HCWorldCrosslinksV1)return;
const KEY='haute-couture-world-crosslinks-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
function state(){const s=read(KEY,{version:1,events:[]});s.events=s.events||[];return s}
function remember(id,kind,data={}){const s=state();if(s.events.some(x=>x.id===id))return false;const e={id,kind,data,at:new Date().toISOString()};s.events.unshift(e);s.events=s.events.slice(0,600);write(KEY,s);window.dispatchEvent(new CustomEvent('hc-world-crosslink',{detail:e}));return e}
function addBook(item){if(!window.HCBook?.add)return false;return window.HCBook.add(item)}
function circuitUnlock(e){const x=e.detail||{};if(!x.id)return;const id='circuit-unlock:'+x.id;if(!remember(id,'territorial-unlock',x))return;addBook({id:'memory-'+x.id,title:x.label||'Référence territoriale',type:'Découverte',category:x.type==='palette'?'Palettes':'Lieux',summary:'Référence débloquée pendant une exploration territoriale.',source:x.circuitId||'Circuit territorial',sourceId:x.id,tags:['territoire','exploration',x.type||'référence',...(x.meta?.tags||[])],palette:x.meta?.colors||[]})}
function skillUnlock(e){const x=e.detail||{};if(!x.id)return;const id='skill:'+x.id+':'+String(x.level||1);if(!remember(id,'skill',x))return;addBook({id:'skill-'+x.id+'-'+String(x.level||1),title:x.name||'Savoir-faire appris',type:'Savoir-faire',category:'Matieres',summary:`Technique réellement pratiquée${x.origin?' · '+x.origin:''}.`,source:x.source||x.origin||'Apprentissage',sourceId:x.id,tags:['savoir-faire','atelier',x.origin||'',`niveau-${x.level||1}`]})}
function guideComplete(e){const x=e.detail||{};const placeId=x.placeId||x.guideId;if(!placeId)return;const id='guide:'+placeId;if(!remember(id,'guide-complete',x))return;addBook({id:'visit-'+placeId,title:x.title||'Visite culturelle',type:'Lieu',category:'Lieux',summary:'Visite documentée terminée. Les observations choisies peuvent désormais nourrir de futurs projets.',source:x.source||'Guide immersif territorial',sourceId:placeId,tags:['culture','visite','territoire']})}
function clientOrder(e){const x=e.detail||{};if(x.status!=='completed'||!x.id)return;const id='client:'+x.id;if(!remember(id,'client-complete',x))return;addBook({id:'client-'+x.id,title:x.clientName?`Commande · ${x.clientName}`:'Commande cliente terminée',type:'Projet client',category:'Mode',summary:x.result||x.garment||'Une commande menée jusqu’à la livraison.',source:x.source||'Carrière',sourceId:x.id,tags:['cliente','commande','carrière',x.garment||'']})}
function socialTalk(e){const x=e.detail||{};if(!x.personId)return;const p=(window.HCNimesPeople||[]).find(v=>v.id===x.personId);if(!p)return;remember(`met:${x.personId}`,'person-met',{personId:x.personId,name:p.name,place:x.place||''})}
window.addEventListener('hc-circuit-unlock',circuitUnlock);
window.addEventListener('hc-skill-unlock',skillUnlock);
window.addEventListener('hc-guide-complete',guideComplete);
window.addEventListener('hc-client-order',clientOrder);
window.addEventListener('hc-nimes-person-talk',socialTalk);
window.HCWorldCrosslinksV1={version:1,state,remember,addBook};
})();