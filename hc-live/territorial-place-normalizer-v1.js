/* Haute Couture Live — normalisation des marqueurs territoriaux V3
   Empêche un contenu inventé d'être présenté comme documentaire et sécurise
   le chargement async des packs carte qui peuvent arriver avant HCLocalMap.
*/
(function(){
'use strict';
if(window.__HCTerritorialPlaceNormalizerV3)return;window.__HCTerritorialPlaceNormalizerV3=true;

/* Couche média 42/69 additive. Elle écrit le registre documentaire local sans
   modifier les marqueurs ni les contrôles QA. Le fichier est local à /ville/. */
(function loadLoireRhoneMedia(){
 if(window.__HCTerritorialPlaceMediaLoireRhoneV1||document.getElementById('hcMediaLoireRhoneV1'))return;
 const s=document.createElement('script');s.id='hcMediaLoireRhoneV1';s.src='./territorial-place-media-loire-rhone-v1.js?v=20260913-qa1';
 document.head.appendChild(s);
})();

function fictional(p){
 if(!p)return false;
 if(p.fictional===true||p.fictionalFamily===true||p.fictionalFuture===true||p.evolutive===true)return true;
 const type=String(p.gameplayType||'').toLowerCase();
 if(type==='person'||type==='event'||type==='rumor'||type==='secret')return true;
 const kind=String(p.kind||'').toLowerCase(),text=String(p.text||p.description||'').toLowerCase(),id=String(p.id||'').toLowerCase();
 if(/fiction gameplay|fictif|fictive|illustration de jeu/.test(kind+' '+text))return true;
 if(/(?:^|-)person(?:-|$)/.test(id))return true;
 if(/(?:^|-)event(?:-|$)/.test(id)&&!/real|document/.test(kind))return true;
 if(/famille événementielle|famille evolutive|famille évolutive/.test(text+' '+String(p.name||'').toLowerCase()))return true;
 return false;
}
function normalize(p){
 if(!p||typeof p!=='object')return p;
 if(fictional(p)){p.fictional=true;p.documentaryContext=false}
 return p;
}
function wrap(map){
 if(!map?.addMarker||map.__hcPlaceNormalizerV3)return map;
 const original=map.addMarker.bind(map);
 map.addMarker=function(place){return original(normalize(place))};
 map.__hcPlaceNormalizerV3=true;
 return map;
}

/* territory-context est chargé avant la création de HCLocalMap. Ses scripts dynamiques
   sont async : sur un chargement local très rapide, un pack peut s'exécuter trop tôt,
   poser son garde global puis sortir faute de bridge. On repère uniquement ces scripts
   effectivement terminés avant la carte, et on les rejoue une seule fois après la carte. */
let current=window.HCLocalMap,mapReady=false;
const early=new Set();
function relevantScript(s){return s?.tagName==='SCRIPT'&&/^hc/i.test(String(s.id||''))&&/(Map|Universe)/i.test(String(s.id||''))&&s.src}
function track(s){
 if(!relevantScript(s)||s.__hcEarlyTracked)return;s.__hcEarlyTracked=true;
 s.addEventListener('load',()=>{if(!mapReady)early.add(s)},{once:true});
 try{if(!mapReady&&performance.getEntriesByName(s.src).some(e=>e.responseEnd>0))early.add(s)}catch(_){}
}
document.querySelectorAll('script[id]').forEach(track);
const observer=new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(track)));observer.observe(document.documentElement,{childList:true,subtree:true});
async function replayEarly(){
 if(!early.size)return;
 for(const s of [...early]){
  if(s.__hcEarlyReplayed)continue;s.__hcEarlyReplayed=true;
  try{
   const text=await fetch(s.src,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.text()});
   const guard=text.match(/if\(window\.(__[A-Za-z0-9_$]+)\)return;window\.\1=true/);
   if(guard){try{delete window[guard[1]]}catch(_){window[guard[1]]=false}}
   (0,eval)(text+'\n//# sourceURL='+s.src.split('?')[0]+'?hc-replay=1');
  }catch(e){console.warn('[HC territoires] retry pack impossible',s.id,e)}
 }
}
try{
 const desc=Object.getOwnPropertyDescriptor(window,'HCLocalMap');
 if(!desc||desc.configurable){
  Object.defineProperty(window,'HCLocalMap',{configurable:true,get(){return current},set(v){
   current=wrap(v);mapReady=!!current;
   if(mapReady){observer.disconnect();queueMicrotask(()=>replayEarly());setTimeout(()=>window.HCTerritoryContext?.loadDepartmentGameplay?.(),0)}
  }});
 }
}catch(_){ }
if(current){current=wrap(current);mapReady=true;observer.disconnect();queueMicrotask(()=>replayEarly())}
window.HCTerritorialPlaceNormalizerV1=window.HCTerritorialPlaceNormalizerV2=window.HCTerritorialPlaceNormalizerV3={version:3,normalize,isFictional:fictional,wrap,replayEarly};
})();