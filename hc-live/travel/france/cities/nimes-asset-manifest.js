/* Haute Couture Live — Nîmes asset manifest
   Aucun déblocage permanent ne doit être marqué prêt tant que les assets required ne sont pas présents.
*/
(function(){
'use strict';
const assets={
 city:'Nîmes',version:1,
 places:{
  'nimes-arenes':{required:[
   {id:'hero',kind:'photo',usage:['map-guide','book'],ratio:'16:9',query:'Arènes de Nîmes façade official'},
   {id:'arcades',kind:'photo',usage:['book','inspiration'],ratio:'4:5',query:'Arènes de Nîmes arcades'},
   {id:'gladiators-relief',kind:'photo',usage:['book','knowledge'],ratio:'1:1',query:'Arènes de Nîmes relief gladiateurs'},
   {id:'bulls-relief',kind:'photo',usage:['book','knowledge'],ratio:'1:1',query:'Arènes de Nîmes taureaux fronton'}]},
  'nimes-musee-romanite':{required:[
   {id:'hero',kind:'photo',usage:['map-guide','book'],ratio:'16:9',query:'Musée de la Romanité Nîmes façade'},
   {id:'penthee',kind:'photo',usage:['book','motif-reference'],ratio:'1:1',query:'Musée de la Romanité mosaïque de Penthée'},
   {id:'governor-mosaic',kind:'photo',usage:['book','motif-reference'],ratio:'1:1',query:'Musée de la Romanité mosaïque enclos gouverneur'},
   {id:'apollo-bronze',kind:'photo',usage:['book','jewelry-reference'],ratio:'4:5',query:'Musée de la Romanité buste Apollon bronze'},
   {id:'venus',kind:'photo',usage:['book','silhouette-reference'],ratio:'4:5',query:'Musée de la Romanité Vénus statue'},
   {id:'silene',kind:'photo',usage:['book','sculpture-reference'],ratio:'4:5',query:'Musée de la Romanité Silène'},
   {id:'dolium',kind:'photo',usage:['book','shape-reference'],ratio:'4:5',query:'Musée de la Romanité Dolium'}]},
  'nimes-tour-magne':{required:[{id:'hero',kind:'photo',usage:['map-guide','book'],ratio:'16:9',query:'Tour Magne Nîmes'}]},
  'nimes-maison-carree':{required:[{id:'hero',kind:'photo',usage:['map-guide','book'],ratio:'16:9',query:'Maison Carrée Nîmes'}]}
 },
 unlocks:{
  'cut-arcade-panel':{kind:'atelier-component',required:[{id:'preview',ratio:'1:1'},{id:'transparent',format:'png',transparent:true},{id:'construction-diagram',ratio:'4:5'}]},
  'pattern-elliptic-cape':{kind:'garment',required:[{id:'garment-preview',ratio:'4:5'},{id:'atelier-layer',format:'png',transparent:true},{id:'pattern-preview',ratio:'1:1'}]},
  'motif-roman-mosaic-border':{kind:'motif',required:[{id:'motif-tile',ratio:'1:1',seamless:true},{id:'fabric-preview',ratio:'1:1'},{id:'atelier-thumbnail',ratio:'1:1'}]},
  'pleat-toga-glass':{kind:'atelier-component',required:[{id:'detail-preview',ratio:'1:1'},{id:'transparent',format:'png',transparent:true}]},
  'palette-romanite-museum':{kind:'palette',required:[{id:'swatches',ratio:'4:1'}]},
  'construction-strata-panel':{kind:'atelier-component',required:[{id:'preview',ratio:'1:1'},{id:'transparent',format:'png',transparent:true}]},
  'classic-column-dress':{kind:'garment',required:[{id:'garment-preview',ratio:'4:5'},{id:'atelier-layer',format:'png',transparent:true},{id:'pattern-preview',ratio:'1:1'}]}
 },
 social:{postRatio:'4:5',storyRatio:'9:16',profileGridRatio:'1:1'},
 status:'spec_ready_assets_pending'
};
window.HCNimesAssetManifest=assets;
})();