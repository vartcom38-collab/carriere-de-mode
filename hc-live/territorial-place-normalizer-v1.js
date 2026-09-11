/* Haute Couture Live — normalisation des marqueurs territoriaux V1
   Objectif : empêcher un contenu de gameplay inventé d'être présenté comme lieu/personne documentaire réel.
   Ne modifie ni les IDs ni les sauvegardes : la normalisation se fait à l'entrée de HCLocalMap.
*/
(function(){
'use strict';
if(window.__HCTerritorialPlaceNormalizerV1)return;window.__HCTerritorialPlaceNormalizerV1=true;
function fictional(p){
 if(!p)return false;
 if(p.fictional===true||p.fictionalFamily===true||p.fictionalFuture===true||p.evolutive===true)return true;
 const type=String(p.gameplayType||'').toLowerCase();
 if(type==='person'||type==='event'||type==='rumor'||type==='secret')return true;
 const kind=String(p.kind||'').toLowerCase(),text=String(p.text||p.description||'').toLowerCase(),id=String(p.id||'').toLowerCase();
 if(/fiction gameplay|fictif|fictive|illustration de jeu/.test(kind+' '+text))return true;
 if(/(?:^|-)person(?:-|$)/.test(id))return true;
 if(/(?:^|-)event(?:-|$)/.test(id)&&!/real|document/.test(kind))return true;
 return false;
}
function normalize(p){
 if(!p||typeof p!=='object')return p;
 if(fictional(p)){
  p.fictional=true;
  p.documentaryContext=false;
 }
 return p;
}
function wrap(map){
 if(!map?.addMarker||map.__hcPlaceNormalizerV1)return map;
 const original=map.addMarker.bind(map);
 map.addMarker=function(place){return original(normalize(place))};
 map.__hcPlaceNormalizerV1=true;
 return map;
}
let current=window.HCLocalMap;
try{
 const desc=Object.getOwnPropertyDescriptor(window,'HCLocalMap');
 if(!desc||desc.configurable){
  Object.defineProperty(window,'HCLocalMap',{configurable:true,get(){return current},set(v){current=wrap(v)}});
 }
}catch(_){ }
if(current)current=wrap(current);
window.HCTerritorialPlaceNormalizerV1={version:1,normalize,isFictional:fictional,wrap};
})();