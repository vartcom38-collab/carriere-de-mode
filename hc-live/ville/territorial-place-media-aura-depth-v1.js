/* Haute Couture Live — fermeture média des repères AURA depth / figures V1
   Cette couche ne remplace aucun contenu gameplay. Elle relie seulement les IDs
   ajoutés par aura-depth / cultural-figures aux médias documentaires canoniques.
   Un alias de contexte est toujours annoncé comme tel dans la source.
*/
(function(){
'use strict';
if(window.__HCTerritorialPlaceMediaAURADepthV1)return;window.__HCTerritorialPlaceMediaAURADepthV1=true;
const api=window.HCTerritorialPlaceMediaAURA;if(!api?.items)return;
const STORAGE='haute-couture-territorial-place-media-v1';
const commons=(file,w=1600)=>`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;
const exact={
 '26-hauterives-palais':{image:commons('Hauterives Palais facteur cheval.jpg'),source:'Wikimedia Commons — Palais idéal du Facteur Cheval, Hauterives',sourceUrl:'https://commons.wikimedia.org/wiki/File:Hauterives_Palais_facteur_cheval.jpg',kind:'photo',real:true},
 'fig-26-cheval':{image:commons('Hauterives Palais facteur cheval.jpg'),source:'Wikimedia Commons — Palais idéal du Facteur Cheval, Hauterives · contexte documentaire Ferdinand Cheval',sourceUrl:'https://commons.wikimedia.org/wiki/File:Hauterives_Palais_facteur_cheval.jpg',kind:'photo',real:true},
 '38-berlioz-house':{image:commons('F-38-La Cote-Saint-Andre musee Berlioz.jpg'),source:'Wikimedia Commons — maison natale / Musée Hector-Berlioz, La Côte-Saint-André',sourceUrl:'https://commons.wikimedia.org/wiki/File:F-38-La_Cote-Saint-Andre_musee_Berlioz.jpg',kind:'photo',real:true},
 'fig-38-berlioz':{image:commons('Hector Berlioz par Paul de Pommayrac.jpg'),source:'Wikimedia Commons — portrait d’Hector Berlioz, collection Musée Hector-Berlioz',sourceUrl:'https://commons.wikimedia.org/wiki/File:Hector_Berlioz_par_Paul_de_Pommayrac.jpg',kind:'photo',real:true}
};
const map={
 'fig-01-brillat':'ain-belley',
 '03-cncs':'mou-cncs','03-maison-mantin':'mou-centre','fig-03-chanel':'mou-centre',
 '07-papeteries':'ar-ann-industrie','07-pont-arc':'vallon-arc','fig-07-montgolfier':'ar-ann-industrie','fig-07-ferrat':'ar-aub-soie',
 '15-aurillac-costume':'cantal-aurillac-centre','15-salers':'tier2-salers-0','fig-15-pompidou':'cantal-aurillac-centre',
 '26-romans-chaussure':'dr-media-romans-musee','26-grignan-chateau':'dr-media-grignan','fig-26-sevigne':'dr-media-grignan',
 '38-stendhal-museum':'is-media-grenoble','fig-38-stendhal':'is-media-grenoble',
 '42-mai-rubans':'lr42-saint-etienne','42-firminy-corbu':'lr42-firminy','fig-42-corbusier':'lr42-firminy',
 '63-bargoin-textile':'cf3-bargoin','63-michelin':'cf3-centre','fig-63-pascal':'cf3-centre',
 '69-maison-canuts':'lr69-canuts','69-soierie-vivante':'lr69-canuts','fig-69-jacquard':'lr69-canuts','fig-69-saintex':'lr69-lyon',
 '73-charmettes':'sa-chambery','73-opinel-museum':'sav-map-sjm','fig-73-rousseau':'sa-chambery','fig-73-opinel':'sav-map-sjm',
 '74-annecy-chateau':'hs-annecy','74-evian-palais':'hs-evian','fig-74-berthollet':'hs-annecy','fig-74-novarina':'hs-thonon'
};
const written={...exact};
function contextual(id,sourceId,src){
 return {...src,contextAlias:sourceId,source:String(src.source||src.attribution||'Source documentaire')+' · contexte documentaire partagé',attribution:String(src.source||src.attribution||'Source documentaire')+' · contexte documentaire partagé',real:true,kind:'photo'};
}
function persist(items){
 try{const saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};for(const [id,m] of Object.entries(items))saved[id]={...(saved[id]||{}),...m,url:m.image||m.url,attribution:m.source||m.attribution};localStorage.setItem(STORAGE,JSON.stringify(saved));}catch(_){}
}
Object.assign(api.items,exact);persist(exact);
let tries=0;
(function resolve(){
 let pending=0,added={};
 for(const [id,sourceId] of Object.entries(map)){
  if(api.items[id]?.image||api.items[id]?.url)continue;
  const src=api.items[sourceId];
  if(!src?.image&&!src?.url){pending++;continue;}
  const m=contextual(id,sourceId,src);api.items[id]=m;written[id]=m;added[id]=m;
 }
 if(Object.keys(added).length)persist(added);
 if(pending&&tries++<120)setTimeout(resolve,25);
})();
window.HCTerritorialPlaceMediaAURADepthV1={version:1,items:written,map};
})();