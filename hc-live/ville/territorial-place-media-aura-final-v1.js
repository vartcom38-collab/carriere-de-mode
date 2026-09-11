/* Haute Couture Live — compléments média documentaires AURA V2
   Ajoute des médias à des marqueurs territoriaux existants sans dupliquer leur contenu gameplay.
   Les alias ne sont créés que lorsqu'ils désignent le même lieu ou un repère territorial dont la photo est explicitement contextuelle.
*/
(function(){
'use strict';
if(window.__HCTerritorialPlaceMediaAURAFinalV2)return;window.__HCTerritorialPlaceMediaAURAFinalV2=true;
const api=window.HCTerritorialPlaceMediaAURA;if(!api?.items)return;
const STORAGE='haute-couture-territorial-place-media-v1';
const commons=(file,w=1600)=>`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;
const extra={
 'is-bj-musee':{
  image:commons('Métier à tisser du XIXème.jpg'),
  source:'Wikimedia Commons — Métier à tisser du XIXème.jpg',
  sourceUrl:'https://musee.bourgoinjallieu.fr/le-musee/',
  kind:'photo',real:true
 },
 'lo42-sc-tresses':{
  image:'https://saint-chamond.fr/wp-content/uploads/2022/11/50877517251_6ceeb2aab8_c-1200x650.jpg',
  source:'Ville de Saint-Chamond — patrimoine industriel local',
  sourceUrl:'https://saint-chamond.fr/decouvrir-saint-chamond/patrimoine-et-tourisme/les-hotels-richard-chambovet-ennemond-richard-et-patissier/',
  kind:'photo',real:true
 },
 'rh-dense-amplepuis-thimonnier':{
  image:'https://cdn-s-www.leprogres.fr/images/F1545449-5A07-4CF2-8EA4-235649080577/NW_detail/barthelemy-thimmonier-est-le-personnage-star-de-la-ville-d-amplepuis-il-a-donne-son-nom-au-musee-de-la-machine-a-coudre-photo-progres-coline-michel-les-nouvelles-acquisitions-du-musee-sont-selectionnees-selon-des-criteres-specifiques-photo-progres-coline-michel-le-musee-possede-quelques-pieces-rares-comme-cette-miniature-de-machine-a-coudre-faite-en-argent-destinee-a-une-jeune-fille-le-progres-coline-michel-une-partie-des-machines-a-coudre-domestiques-et-industrielles-sont-exposees-dans-une-ancienne-eglise-desacralisee-le-progres-coline-michel-1628107054.jpg',
  source:'Le Progrès — Musée Barthélemy Thimonnier, Amplepuis',
  sourceUrl:'https://musees.ouestrhodanien.fr/musee-barthelemy-thimonnier.html',
  kind:'photo',real:true
 }
};
/* Alias Ain : même lieu exact ou photo de contexte géographique explicitement conservée comme telle. */
const aliases={
 'ain-bourg-brou':'ain-brou',
 'ain-bourg-centre':'bou-centre',
 'ain-oyo-musee':'ain-oyonnax-musee',
 'ain-oyo-vapeur':'ain-grande-vapeur',
 'ain-juj-soieries':'ain-soieries',
 'ain-perouges-cite':'ain-perouges',
 'ain-perouges-photo':'ain-perouges',
 'ain-gex-reseau':'ain-gex',
 'ain-gex-savoirfaire':'ain-gex',
 'ain-gex-jura':'ain-gex',
 'ain-ferney-culture':'ain-ferney',
 'ain-mijoux-lapidaire':'ain-mijoux',
 'ain-mijoux-hiver':'ain-mijoux',
 'ain-belley-bugey':'ain-belley',
 'ain-dombes-etangs':'ain-dombes',
 'ain-nantua-lac':'ain-nantua',
 'ain-nantua-reseau':'ain-nantua'
};
Object.entries(aliases).forEach(([id,sourceId])=>{
 const src=api.items[sourceId];
 if(src)extra[id]={...src,contextAlias:sourceId,source:String(src.source||'')+(sourceId===id?'':' · repère documentaire partagé')};
});
Object.entries(extra).forEach(([id,m])=>{api.items[id]=m});
try{
 const saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};
 Object.entries(extra).forEach(([id,m])=>saved[id]={...(saved[id]||{}),...m,url:m.image,attribution:m.source});
 localStorage.setItem(STORAGE,JSON.stringify(saved));
}catch(_){ }
window.HCTerritorialPlaceMediaAURAFinal={version:2,items:extra,aliases};
window.dispatchEvent(new CustomEvent('hc-territorial-place-media-final-ready',{detail:{count:Object.keys(extra).length,aliases:Object.keys(aliases).length}}));
})();