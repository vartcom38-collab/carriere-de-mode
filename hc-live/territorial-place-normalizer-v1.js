/* Haute Couture Live — normalisation des marqueurs territoriaux V4
   Empêche un contenu inventé d'être présenté comme documentaire, applique les
   enrichissements territoriaux strictement identifiés avant injection carte et
   sécurise le chargement async des packs qui peuvent arriver avant HCLocalMap.
*/
(function(){
'use strict';
if(window.__HCTerritorialPlaceNormalizerV4)return;window.__HCTerritorialPlaceNormalizerV4=true;

/* Couche média 42/69 additive. Elle écrit le registre documentaire local sans
   modifier les contrôles QA. Le fichier est local à /ville/. */
(function loadLoireRhoneMedia(){
 if(window.__HCTerritorialPlaceMediaLoireRhoneV1||document.getElementById('hcMediaLoireRhoneV1'))return;
 const s=document.createElement('script');s.id='hcMediaLoireRhoneV1';s.src='./territorial-place-media-loire-rhone-v1.js?v=20260913-qa2';
 document.head.appendChild(s);
})();

const CREATIVE_FIXES={
 'charlieu-centre':{palette:['pierre claire','ocre doux','gris ardoise'],materials:['lin','laine'],motifs:['arcades','trame médiévale']},
 'charlieu-atelier':{palette:['écru','bleu atelier','bois'],materials:['soie','fils','bois'],motifs:['navette','chaîne-trame']},
 'tier2-montbrison-0':{palette:['pierre claire','vert jardin','ardoise'],materials:['lin','laine fine'],motifs:['façades','trame historique']},
 'tier2-montbrison-2':{palette:['ivoire','rose poudré','bleu nuit'],materials:['soie','crêpe','dentelle'],motifs:['cérémonie','plis souples']},
 'tier2-montbrison-8':{palette:['vert tendre','pierre','bleu eau'],materials:['lin','toile'],motifs:['jardin','courbes de promenade']},
 'vfs-centre':{palette:['pierre dorée','crème','gris zinc'],materials:['lin','laine fine'],motifs:['façades','rythme urbain']},
 'vfs-beaujolais':{palette:['lie-de-vin','pierre dorée','vert vigne'],materials:['soie','velours','lin'],motifs:['vigne','courbes du relief']},
 'tier2-tarare-0':{palette:['écru','gris atelier','bleu nuit'],materials:['voilage','coton','fils'],motifs:['trame','mémoire industrielle']},
 'tier2-tarare-3':{palette:['blanc cassé','gris perle','bleu brume'],materials:['voilage','organza','fils fins'],motifs:['transparence','rayures légères']},
 'tier2-tarare-8':{palette:['vert sombre','pierre','bleu horizon'],materials:['laine','toile'],motifs:['relief','lignes d’horizon']}
};

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
function enrichCreative(p){
 const fix=CREATIVE_FIXES[p?.id];if(!fix)return p;
 for(const k of ['palette','materials','motifs'])if(!(p[k]?.length))p[k]=[...fix[k]];
 return p;
}
function normalize(p){
 if(!p||typeof p!=='object')return p;
 enrichCreative(p);
 if(fictional(p)){p.fictional=true;p.documentaryContext=false}
 return p;
}
function wrap(map){
 if(!map?.addMarker||map.__hcPlaceNormalizerV4)return map;
 const original=map.addMarker.bind(map);
 map.addMarker=function(place){return original(normalize(place))};
 map.__hcPlaceNormalizerV4=true;
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
window.HCTerritorialPlaceNormalizerV1=window.HCTerritorialPlaceNormalizerV2=window.HCTerritorialPlaceNormalizerV3=window.HCTerritorialPlaceNormalizerV4={version:4,normalize,isFictional:fictional,wrap,replayEarly};
})();