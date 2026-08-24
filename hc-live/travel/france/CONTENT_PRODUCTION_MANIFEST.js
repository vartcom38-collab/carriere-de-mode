/* Haute Couture Live — manifeste de production territoriale
   Checklist exécutable pour chaque région / département / ville / lieu / déblocage.
*/
(function(){
'use strict';
const manifest={
 version:1,
 region:{required:['identity','history','ecosystems','majorCities','heritage','fashionHeritage','crafts','materials','palette','motifs','seasonality','events','photoBank','characterPools','secretPools','regionalUnlocks','tags','sources']},
 department:{required:['identity','ecosystems','cities','villages','heritage','museums','nature','markets','fabricShops','vintage','craft','foodCulture','photoSpots','routes','characters','missions','events','secrets','lootPools','socialPools','atelierPools','bookPools','tags','sources']},
 city:{required:['identity','history','districts','mapAnchors','places','shops','markets','cafes','museums','heritage','nature','photoSpots','characters','encounters','events','secrets','routes','socialSuggestions','bookPages','atelierUnlocks','tags','sources']},
 place:{required:['identity','coordinates','realOrFictional','officialSources','heroImage','gallery','summary','history','anecdotes','visitChapters','objectsAndWorks','architecture','fashionReading','palette','materials','motifs','jewelry','accessories','silhouettes','references','tags','bookPayload','socialPayload','atelierPayload','layers','repeatPool','seasonalPool','careerPool']},
 unlock:{required:['id','type','title','image','thumbnail','origin','rarity','tags','atelierUsage','bookUsage','socialUsage','conditions'],byType:{garment:['silhouette','construction','compatibleMaterials','variants'],fabric:['textureImage','fiber','weight','drape','finish','colors'],motif:['tileImage','scale','repeat','colors'],accessory:['placement','compatibility','variants'],palette:['swatches'],object:['story','condition','uses'],social:['format','caption','location','media'],character:['portrait','personality','role','memory','relationshipHooks']}},
 rules:{
  noUnlockWithoutAsset:true,
  realFactsNeedSource:true,
  fictionalGameplayMustBeFlagged:true,
  eachPlaceConnectsAtLeast:2,
  defaultPlaceSystems:['book','atelier','social'],
  longCareerPrinciple:'Ne jamais tout révéler à la première visite. Prévoir revisites, saisons, années de carrière et relations.',
  imagePrinciple:'Visuels raster réels ou créés, jamais simple placeholder vectoriel pour une récompense permanente.'
 }
};
window.HCFranceContentManifest=manifest;
})();