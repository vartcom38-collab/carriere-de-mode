/* Haute Couture Live — pont territorial générique V1
   Convertit les signaux territoriaux en données natives HCGame : messages + agenda.
   Réutilisable par tous les départements. Anti-doublon par id stable.
*/
(function(){
'use strict';
if(window.__HCTerritorialSignalRuntimeV1)return;window.__HCTerritorialSignalRuntimeV1=true;
const GAME='haute-couture-game-state-v1';
function readGame(){try{return window.HCGame?.get?.()||JSON.parse(localStorage.getItem(GAME)||'null')}catch(_){return null}}
function saveGame(g){try{if(window.HCGame?.mutate){window.HCGame.mutate(s=>Object.assign(s,g));return true}localStorage.setItem(GAME,JSON.stringify(g));window.dispatchEvent(new CustomEvent('hc-game-state',{detail:g}));return true}catch(_){return false}}
function isoPlus(hours){const g=readGame(),base=new Date(g?.clock?.iso||Date.now());base.setHours(base.getHours()+hours);return base.toISOString()}
function ensureMessage(s,id,from,subject,text,meta){s.messages=s.messages||[];if(s.messages.some(m=>m.id===id))return false;s.messages.unshift({id,from,avatar:String(from||'T')[0]||'T',subject,text,receivedAt:s.clock?.iso||new Date().toISOString(),read:false,action:null,meta:{source:'territorial',...(meta||{})}});return true}
function ensureCalendar(s,id,title,location,description,type='exploration',delayHours=24){s.calendar=s.calendar||[];if(s.calendar.some(e=>e.id===id))return false;const start=new Date(s.clock?.iso||Date.now());start.setHours(start.getHours()+delayHours);if(start.getHours()<10)start.setHours(10,0,0,0);if(start.getHours()>19){start.setDate(start.getDate()+1);start.setHours(11,0,0,0)}const end=new Date(start.getTime()+60*60*1000);s.calendar.unshift({id,title,type,status:'planned',start:start.toISOString(),end:end.toISOString(),location:location||'',notes:description||'',description:description||'',source:'territorial'});return true}
function importSignal(detail){if(!detail?.kind)return;const d=detail,idBase='territory:'+String(d.departmentCode||'xx')+':'+String(d.id||d.title||Date.now());if(window.HCGame?.mutate){window.HCGame.mutate(s=>apply(s,d,idBase));return}const g=readGame();if(!g)return;apply(g,d,idBase);saveGame(g)}
function apply(s,d,idBase){
 if(d.kind==='phone_lead')ensureMessage(s,idBase,'Réseau local',d.title||'Une piste locale',`À ${d.city||'cet endroit'}, un contact rencontré sur place pourrait avoir une piste. Rien n’est encore garanti : le lien dépendra de tes prochaines interactions.`,{kind:d.kind,city:d.city,personId:d.personId});
 if(d.kind==='phone_rumor')ensureMessage(s,idBase,'Bouche-à-oreille',d.title||'Une rumeur locale',`Une information circule à ${d.city||'proximité'}. Elle a été ajoutée à ta mémoire territoriale ; à toi de décider si tu veux la suivre.`,{kind:d.kind,city:d.city});
 if(d.kind==='agenda_opportunity'){
  ensureMessage(s,idBase+':msg','Opportunité locale',d.title||'Nouvelle piste',`Une nouvelle piste est apparue à ${d.city||'cet endroit'}. Elle a été ajoutée à ton agenda pour que tu puisses la retrouver.`,{kind:d.kind,city:d.city,systems:d.systems});
  ensureCalendar(s,idBase+':agenda',d.title||'Piste territoriale',d.city||'',`Piste découverte pendant une exploration territoriale. Systèmes concernés : ${(d.systems||[]).join(' · ')||'exploration / réseau'}.`,'exploration',24);
 }
}
function syncStoredAin(){
 try{const m=JSON.parse(localStorage.getItem('haute-couture-ain-territorial-gameplay-v1')||'null');if(!m?.signals?.length)return;const g=readGame();if(!g)return;let changed=false;m.signals.forEach(x=>{const beforeM=(g.messages||[]).length,beforeC=(g.calendar||[]).length;apply(g,{kind:x.kind,...x.payload,departmentCode:'01'},'territory:01:'+String(x.payload?.id||x.id));if((g.messages||[]).length!==beforeM||(g.calendar||[]).length!==beforeC)changed=true});if(changed)saveGame(g)}catch(_){}
}
window.addEventListener('hc-territorial-signal',e=>importSignal(e.detail));
window.HCTerritorialSignalRuntime={importSignal,syncStoredAin};
setTimeout(syncStoredAin,50);
})();