/* Haute Couture Live — registre média territorial AURA V1
   Une entrée = un visuel réellement associé au lieu + sa source documentaire.
   Ne jamais utiliser ce registre pour faire passer une illustration fictive pour une photo réelle.
*/
(function(){
'use strict';
if(window.__HCTerritorialPlaceMediaAURAV1)return;window.__HCTerritorialPlaceMediaAURAV1=true;
const STORAGE='haute-couture-territorial-place-media-v1';
const commons=(file,w=1600)=>`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;
const source=file=>`Wikimedia Commons — ${file}`;
const M={
 /* AIN — première vague documentaire */
 'ain-brou':{image:commons('Monastère Royal de Brou 38.jpg'),source:source('Monastère Royal de Brou 38.jpg'),kind:'photo',real:true},
 'mc-bourg-brou':{image:commons('Monastère Royal de Brou 38.jpg'),source:source('Monastère Royal de Brou 38.jpg'),kind:'photo',real:true},
 'bou-brou':{image:commons('Monastère Royal de Brou 38.jpg'),source:source('Monastère Royal de Brou 38.jpg'),kind:'photo',real:true},
 'ain-perouges':{image:commons('Maisons Pérouges.jpg'),source:source('Maisons Pérouges.jpg'),kind:'photo',real:true},
 'ain-map-per':{image:commons('Maisons Pérouges.jpg'),source:source('Maisons Pérouges.jpg'),kind:'photo',real:true},
 'ain-nantua':{image:commons('Lac de Nantua.jpg'),source:source('Lac de Nantua.jpg'),kind:'photo',real:true},
 'ain-map-nan':{image:commons('Lac de Nantua.jpg'),source:source('Lac de Nantua.jpg'),kind:'photo',real:true},
 'ain-ferney':{image:commons('Château Ferney Voltaire.JPG'),source:source('Château Ferney Voltaire.JPG'),kind:'photo',real:true},
 'ain-map-fer':{image:commons('Château Ferney Voltaire.JPG'),source:source('Château Ferney Voltaire.JPG'),kind:'photo',real:true},
 'ain-dombes':{image:commons('Villars les Dombes.jpg'),source:source('Villars les Dombes.jpg'),kind:'photo',real:true},
 'ain-map-dom':{image:commons('Villars les Dombes.jpg'),source:source('Villars les Dombes.jpg'),kind:'photo',real:true}
};
/* L'interface territoriale sait déjà lire ce stockage. On fusionne sans effacer d'éventuels médias ajoutés manuellement. */
try{
 const saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};
 for(const [id,m] of Object.entries(M))saved[id]={...(saved[id]||{}),...m,url:m.image,attribution:m.source};
 localStorage.setItem(STORAGE,JSON.stringify(saved));
}catch(_){/* fallback runtime : le registre window reste disponible */}
window.HCTerritorialPlaceMediaAURA={version:1,items:M,get(id){return M[String(id||'')]||null},all(){return{...M}}};
window.dispatchEvent(new CustomEvent('hc-territorial-place-media-ready',{detail:{version:1,count:Object.keys(M).length}}));
})();