/* Haute Couture Live — pont de sauvegarde serveur Infomaniak.
   localStorage reste la source locale et le serveur reçoit un snapshot de secours.
*/
(function(){
'use strict';

const PREFIX='haute-couture-';
const META_KEY='haute-couture-server-sync-v1';
const RESET_KEY='haute-couture-new-game-requested-v1';
const SNAPSHOT_SCHEMA='hc-localstorage-snapshot-v1';
const SLOT='main';
const SAVE_URL='/api/save-game.php';
const LOAD_URL='/api/load-game.php?slot='+encodeURIComponent(SLOT);
const MAX_VALUE_CHARS=2_000_000;
let timer=null;
let saving=false;
let pending=false;
let booted=false;

function now(){return new Date().toISOString()}
function parseJSON(raw,fallback){try{return JSON.parse(raw)}catch(e){return fallback}}
function meta(){return parseJSON(localStorage.getItem(META_KEY)||'',{})||{}}
function setMeta(patch){
  const next=Object.assign({},meta(),patch);
  try{localStorage.setItem(META_KEY,JSON.stringify(next))}catch(e){}
  return next;
}
function playerName(){
  const character=parseJSON(localStorage.getItem('haute-couture-custom-character')||'',{})||{};
  const state=parseJSON(localStorage.getItem('haute-couture-game-state-v1')||'',{})||{};
  return character.name||character.prenom||character.firstName||state?.player?.name||'Clara';
}
function capture(){
  const storage={};
  const skipped={};
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);
    if(!key||!key.startsWith(PREFIX)||key===META_KEY||key===RESET_KEY)continue;
    const value=localStorage.getItem(key);
    if(value==null)continue;
    if(value.length>MAX_VALUE_CHARS){
      skipped[key]={reason:'value_too_large',chars:value.length};
      continue;
    }
    storage[key]=value;
  }
  return {
    schema:SNAPSHOT_SCHEMA,
    snapshotVersion:1,
    capturedAt:now(),
    page:location.pathname,
    storage,
    skipped
  };
}
function validServerSnapshot(data){
  return !!(data&&data.schema===SNAPSHOT_SCHEMA&&data.storage&&typeof data.storage==='object');
}
function restore(snapshot){
  if(!validServerSnapshot(snapshot))return false;
  Object.keys(snapshot.storage).forEach(key=>{
    if(!key.startsWith(PREFIX)||key===META_KEY||key===RESET_KEY)return;
    const value=snapshot.storage[key];
    if(typeof value==='string')localStorage.setItem(key,value);
  });
  setMeta({lastRestoreAt:now(),lastServerCapturedAt:snapshot.capturedAt||null,status:'restored'});
  window.dispatchEvent(new CustomEvent('hc-server-save-restored',{detail:{capturedAt:snapshot.capturedAt||null}}));
  return true;
}
async function saveNow(reason){
  if(saving){pending=true;return false}
  saving=true;
  pending=false;
  const data=capture();
  try{
    const response=await fetch(SAVE_URL,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      credentials:'same-origin',
      body:JSON.stringify({
        slot:SLOT,
        playerName:playerName(),
        gameVersion:'hc-live-server-bridge-v1',
        data
      })
    });
    const result=await response.json().catch(()=>null);
    if(!response.ok||!result||!result.ok)throw new Error(result?.error||('HTTP '+response.status));
    setMeta({lastSaveAt:now(),lastReason:reason||'change',status:'saved',lastError:null,skipped:data.skipped});
    window.dispatchEvent(new CustomEvent('hc-server-save',{detail:{ok:true,reason:reason||'change'}}));
    return true;
  }catch(error){
    setMeta({lastAttemptAt:now(),status:'local-only',lastError:String(error&&error.message||error)});
    console.warn('[HCServerSave] sauvegarde serveur indisponible, localStorage conservé.',error);
    window.dispatchEvent(new CustomEvent('hc-server-save',{detail:{ok:false,error:String(error&&error.message||error)}}));
    return false;
  }finally{
    saving=false;
    if(pending)schedule('pending',800);
  }
}
function schedule(reason,delay=1200){
  clearTimeout(timer);
  timer=setTimeout(()=>saveNow(reason),delay);
}
async function boot(){
  if(booted)return;
  booted=true;
  setMeta({lastBootAt:now(),status:'checking'});
  try{
    const response=await fetch(LOAD_URL,{credentials:'same-origin',cache:'no-store'});
    const result=await response.json().catch(()=>null);
    if(!response.ok||!result||!result.ok)throw new Error(result?.error||('HTTP '+response.status));

    const serverSnapshot=result.found?result.data:null;
    const localGame=localStorage.getItem('haute-couture-game-state-v1');
    const resetRequested=localStorage.getItem(RESET_KEY)==='1';

    // Nouvelle partie explicitement demandée : l'ancienne sauvegarde serveur ne doit jamais revenir.
    if(resetRequested){
      localStorage.removeItem(RESET_KEY);
      schedule('new-game-replace-server',350);
      return;
    }

    // Migration prudente : une ancienne sauvegarde de test/non reconnue n'est jamais restaurée.
    // Si ce navigateur n'a pas encore de partie locale et qu'un vrai snapshot existe, on le restaure.
    if(!localGame&&validServerSnapshot(serverSnapshot)){
      restore(serverSnapshot);
      location.reload();
      return;
    }

    // Le navigateur courant gagne pendant la phase de migration.
    schedule(validServerSnapshot(serverSnapshot)?'startup-sync':'replace-test-save',350);
  }catch(error){
    setMeta({status:'local-only',lastError:String(error&&error.message||error)});
    console.warn('[HCServerSave] chargement serveur indisponible, jeu local inchangé.',error);
  }
}

// Observe aussi les systèmes qui écrivent directement dans localStorage.
const originalSetItem=Storage.prototype.setItem;
const originalRemoveItem=Storage.prototype.removeItem;
Storage.prototype.setItem=function(key,value){
  const out=originalSetItem.apply(this,arguments);
  if(this===localStorage&&typeof key==='string'&&key.startsWith(PREFIX)&&key!==META_KEY&&key!==RESET_KEY)schedule('localStorage:setItem');
  return out;
};
Storage.prototype.removeItem=function(key){
  const out=originalRemoveItem.apply(this,arguments);
  if(this===localStorage&&typeof key==='string'&&key.startsWith(PREFIX)&&key!==META_KEY&&key!==RESET_KEY)schedule('localStorage:removeItem');
  return out;
};

window.addEventListener('hc-game-state',()=>schedule('game-state'));
window.addEventListener('storage',e=>{if(e.key&&e.key.startsWith(PREFIX)&&e.key!==META_KEY&&e.key!==RESET_KEY)schedule('other-tab')});
window.addEventListener('pagehide',()=>{if(navigator.sendBeacon){
  try{
    const payload=JSON.stringify({slot:SLOT,playerName:playerName(),gameVersion:'hc-live-server-bridge-v1',data:capture()});
    navigator.sendBeacon(SAVE_URL,new Blob([payload],{type:'application/json'}));
  }catch(e){}
}});

document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot,{once:true}):boot();
window.HCServerSave={saveNow,capture,restore,status:meta};
})();
