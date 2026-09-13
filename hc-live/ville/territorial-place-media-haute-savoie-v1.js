/* Haute Couture Live — médias documentaires Haute-Savoie V1
   Une entrée = une photographie réellement liée à la commune / au repère territorial.
   Les vues historiques sont signalées comme telles dans la source ; aucune illustration
   n'est présentée comme photographie documentaire d'un lieu réel.
*/
(function(){
'use strict';
if(window.__HCTerritorialPlaceMediaHauteSavoieV1)return;window.__HCTerritorialPlaceMediaHauteSavoieV1=true;
const STORAGE='haute-couture-territorial-place-media-v1';
const commons=(file,w=1600)=>`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;
const page=file=>`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file).replace(/%2F/g,'/')}`;
const media=(file,label)=>({image:commons(file),url:commons(file),source:`Wikimedia Commons — ${label}`,attribution:`Wikimedia Commons — ${label}`,sourceUrl:page(file),kind:'photo',real:true});
const M={
 'hs-annecy':media('Lake Annecy.JPG','lac d’Annecy vu depuis Annecy'),
 'hs-chamonix':media('Chamonix-Mont-Blanc.jpg','vallée de Chamonix et mont Blanc'),
 'hs-chatel':media('Châtel-CP-anté1940-0024.jpg','vue documentaire historique de Châtel, carte postale 1937'),
 'hs-megeve':media('Col de Megève.jpg','col de Megève'),
 'hs-evian':media('Evian-les-Bains.jpg','vue documentaire historique d’Évian-les-Bains, fin XIXe siècle'),
 'hs-thonon':media('Thonon-les-Bains - Château de Bellegarde - Bâtiment et tour.jpg','Château de Bellegarde à Thonon-les-Bains'),
 'hs-morzine':media('Morzine summer.jpg','Morzine et la pointe de Nyon'),
 'hs-avoriaz':media('Avoriaz.jpg','vue aérienne d’Avoriaz'),
 'hs-clusaz':media('La Clusaz (51199209197).jpg','La Clusaz'),
 'hs-cluses':media('Cluses.JPG','Cluses, Haute-Savoie'),
 'hs-sallanches':media('Mont Blanc @ Sallanches (51009709842).jpg','mont Blanc vu depuis Sallanches'),
 'hs-stgervais':media('Village @ Saint-Gervais-les-Bains (50926323698).jpg','village de Saint-Gervais-les-Bains'),
 'hs-samoens':media('Overview of Samoens.jpg','vue générale de Samoëns'),
 'hs-yvoire':media("Château d'Yvoire seen from the gardens, Yvoire, Haute-Savoie.jpg",'château d’Yvoire vu depuis les jardins')
};
try{
 const saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};
 for(const [id,m] of Object.entries(M))saved[id]={...(saved[id]||{}),...m};
 localStorage.setItem(STORAGE,JSON.stringify(saved));
}catch(_){/* le registre window reste disponible si le stockage est indisponible */}
const api=window.HCTerritorialPlaceMediaAURA;
if(api?.items){for(const [id,m] of Object.entries(M))api.items[id]={...(api.items[id]||{}),...m}}
window.HCTerritorialPlaceMediaHauteSavoieV1={version:1,items:M,get(id){return M[String(id||'')]||null},all(){return{...M}}};
})();
