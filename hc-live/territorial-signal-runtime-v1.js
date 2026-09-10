/* Haute Couture Live — pont territorial générique V2
   Convertit les signaux territoriaux en données natives HCGame : messages + agenda + pistes Atelier/Book.
   Réutilisable par tous les départements. Anti-doublon par id stable.
*/
(function(){
'use strict';
if(window.__HCTerritorialSignalRuntimeV2)return;window.__HCTerritorialSignalRuntimeV2=true;
const GAME='haute-couture-game-state-v1';
const ATELIER='haute-couture-atelier-unlocks-v1';
const BOOK='haute-couture-book-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(_){return false}};
function readGame(){try{return window.HCGame?.get?.()||read(GAME,null)}catch(_){return null}}
function saveGame(g){try{if(window.HCGame?.mutate){window.HCGame.mutate(s=>Object.assign(s,g));return true}write(GAME,g);window.dispatchEvent(new CustomEvent('hc-game-state',{detail:g}));return true}catch(_){return false}}
function ensureMessage(s,id,from,subject,text,meta){s.messages=s.messages||[];if(s.messages.some(m=>m.id===id))return false;s.messages.unshift({id,from,avatar:String(from||'T')[0]||'T',subject,text,receivedAt:s.clock?.iso||new Date().toISOString(),read:false,action:null,meta:{source:'territorial',...(meta||{})}});return true}
function ensureCalendar(s,id,title,location,description,type='exploration',delayHours=24){s.calendar=s.calendar||[];if(s.calendar.some(e=>e.id===id))return false;const start=new Date(s.clock?.iso||Date.now());start.setHours(start.getHours()+delayHours);if(start.getHours()<10)start.setHours(10,0,0,0);if(start.getHours()>19){start.setDate(start.getDate()+1);start.setHours(11,0,0,0)}const end=new Date(start.getTime()+60*60*1000);s.calendar.unshift({id,title,type,status:'planned',start:start.toISOString(),end:end.toISOString(),location:location||'',notes:description||'',description:description||'',source:'territorial'});return true}
function ensureAtelierUnlock(d,idBase){let raw=read(ATELIER,[]),list=Array.isArray(raw)?raw:Object.values(raw||{});if(list.some(x=>x.id===idBase))return false;list.push({id:idBase,name:d.title||d.name||'Référence territoriale',label:d.title||d.name||'Référence territoriale',type:d.unlockType||d.type||'DESIGN_REFERENCE',territory:d.city||d.departmentName||'',departmentCode:d.departmentCode||'',source:'territorial',materials:d.materials||[],motifs:d.motifs||[],palette:d.palette||[],learnedAt:new Date().toISOString(),level:d.level||'observed',description:d.text||d.description||''});write(ATELIER,list);window.dispatchEvent(new CustomEvent('hc-atelier-unlocks',{detail:list}));return true}
function ensureBookReference(d,idBase){const b=read(BOOK,{items:[]});b.items=Array.isArray(b.items)?b.items:[];if(b.items.some(x=>x.id===idBase))return false;b.items.unshift({id:idBase,title:d.title||d.name||'Référence territoriale',type:d.bookType||'Recherche',category:d.category||'Territoires',place:d.city||d.departmentName||'',summary:d.text||d.description||'',palette:d.palette||[],materials:d.materials||[],motifs:d.motifs||[],tags:[...(d.tags||[]),...(d.materials||[]),...(d.motifs||[])],source:'territorial',savedAt:new Date().toISOString()});write(BOOK,b);window.dispatchEvent(new CustomEvent('hc-book-state',{detail:b}));return true}
function apply(s,d,idBase){
 if(d.kind==='phone_lead')ensureMessage(s,idBase,d.from||'Réseau local',d.title||'Une piste locale',d.text||`À ${d.city||'cet endroit'}, un contact rencontré sur place pourrait avoir une piste. Rien n’est encore garanti : le lien dépendra de tes prochaines interactions.`,{kind:d.kind,city:d.city,personId:d.personId});
 if(d.kind==='phone_rumor')ensureMessage(s,idBase,d.from||'Bouche-à-oreille',d.title||'Une rumeur locale',d.text||`Une information circule à ${d.city||'proximité'}. Elle a été ajoutée à ta mémoire territoriale ; à toi de décider si tu veux la suivre.`,{kind:d.kind,city:d.city});
 if(d.kind==='agenda_opportunity'){
  ensureMessage(s,idBase+':msg',d.from||'Opportunité locale',d.title||'Nouvelle piste',d.text||`Une nouvelle piste est apparue à ${d.city||'cet endroit'}. Elle a été ajoutée à ton agenda pour que tu puisses la retrouver.`,{kind:d.kind,city:d.city,systems:d.systems});
  ensureCalendar(s,idBase+':agenda',d.title||'Piste territoriale',d.city||'',d.description||`Piste découverte pendant une exploration territoriale. Systèmes concernés : ${(d.systems||[]).join(' · ')||'exploration / réseau'}.`,'exploration',d.delayHours??24);
 }
 if(d.kind==='atelier_unlock'){ensureAtelierUnlock(d,idBase+':atelier');if(d.addToBook)ensureBookReference(d,idBase+':book')}
 if(d.kind==='book_reference')ensureBookReference(d,idBase+':book');
}
function importSignal(detail){if(!detail?.kind)return;const d=detail,idBase='territory:'+String(d.departmentCode||'xx')+':'+String(d.id||d.title||Date.now());if(window.HCGame?.mutate){window.HCGame.mutate(s=>apply(s,d,idBase));return}const g=readGame();if(!g)return;apply(g,d,idBase);saveGame(g)}
function syncStoredDepartment(code,key){try{const m=read(key,null);if(!m?.signals?.length)return;const g=readGame();if(!g)return;let changed=false;m.signals.forEach(x=>{const bm=(g.messages||[]).length,bc=(g.calendar||[]).length;apply(g,{kind:x.kind,...x.payload,departmentCode:code},'territory:'+code+':'+String(x.payload?.id||x.id));if((g.messages||[]).length!==bm||(g.calendar||[]).length!==bc)changed=true});if(changed)saveGame(g)}catch(_){}}
function syncKnownStores(){syncStoredDepartment('01','haute-couture-ain-territorial-gameplay-v1');syncStoredDepartment('03','haute-couture-allier-territorial-gameplay-v1')}
window.addEventListener('hc-territorial-signal',e=>importSignal(e.detail));
window.HCTerritorialSignalRuntime={version:2,importSignal,syncKnownStores,ensureAtelierUnlock,ensureBookReference};
setTimeout(syncKnownStores,50);
})();