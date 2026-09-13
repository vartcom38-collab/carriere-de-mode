/* Haute Couture Live — médias documentaires Puy-de-Dôme V1 */
(function(){
'use strict';
if(window.__HCTerritorialPlaceMediaPuyDeDomeV1)return;window.__HCTerritorialPlaceMediaPuyDeDomeV1=true;
const STORAGE='haute-couture-territorial-place-media-v1';
const api=window.HCTerritorialPlaceMediaAURA;if(!api?.items)return;
const commons=(file,w=1600)=>`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;
const C={
 clermont:{image:commons('Clermont-Ferrand Cathedral.jpg'),source:'Wikimedia Commons — cathédrale Notre-Dame-de-l’Assomption, Clermont-Ferrand',sourceUrl:'https://commons.wikimedia.org/wiki/File:Clermont-Ferrand_Cathedral.jpg',kind:'photo',real:true},
 thiers:{image:commons('Thiers - coutellerie - émouleurs.jpg'),source:'Wikimedia Commons — émouleurs dans une coutellerie de Thiers, début XXe siècle',sourceUrl:'https://commons.wikimedia.org/wiki/File:Thiers_-_coutellerie_-_%C3%A9mouleurs.jpg',kind:'photo',real:true},
 riom:{image:commons("FRANCE - Auvergne - RIOM - La tour de l'horloge.JPG"),source:'Wikimedia Commons — tour de l’Horloge, Riom',sourceUrl:'https://commons.wikimedia.org/wiki/File:FRANCE_-_Auvergne_-_RIOM_-_La_tour_de_l%27horloge.JPG',kind:'photo',real:true},
 volvic:{image:commons('Commune de Volvic.jpg'),source:'Wikimedia Commons — vue générale de Volvic depuis Notre-Dame de la Garde',sourceUrl:'https://commons.wikimedia.org/wiki/File:Commune_de_Volvic.jpg',kind:'photo',real:true},
 montdore:{image:commons('Le Mont-Dore thermes.jpg'),source:'Wikimedia Commons — thermes du Mont-Dore, façade place du Panthéon',sourceUrl:'https://commons.wikimedia.org/wiki/File:Le_Mont-Dore_thermes.jpg',kind:'photo',real:true},
 bourboule:{image:commons('La Bourboule.jpg'),source:'Wikimedia Commons — La Bourboule, Puy-de-Dôme',sourceUrl:'https://commons.wikimedia.org/wiki/File:La_Bourboule.jpg',kind:'photo',real:true},
 issoire:{image:commons('Issoire Place de la Republique.jpg'),source:'Wikimedia Commons — place de la République, Issoire',sourceUrl:'https://commons.wikimedia.org/wiki/File:Issoire_Place_de_la_Republique.jpg',kind:'photo',real:true},
 ambert:{image:commons('Moulin Richard de Bas 2016-08-08 n27.jpg'),source:'Wikimedia Commons — Moulin Richard-de-Bas, Ambert · chiffon destiné à la pâte à papier',sourceUrl:'https://commons.wikimedia.org/wiki/File:Moulin_Richard_de_Bas_2016-08-08_n27.jpg',kind:'photo',real:true},
 orcines:{image:commons("Orcines - Puy de Dôme - Panoramique des Dômes - Gare d'arrivée, extérieur depuis un chemin.jpg"),source:'Wikimedia Commons — Puy de Dôme, Panoramique des Dômes, Orcines',sourceUrl:'https://commons.wikimedia.org/wiki/File:Orcines_-_Puy_de_D%C3%B4me_-_Panoramique_des_D%C3%B4mes_-_Gare_d%27arriv%C3%A9e,_ext%C3%A9rieur_depuis_un_chemin.jpg',kind:'photo',real:true}
};
const aliases={
 'cf3-centre':'clermont','cf3-cathedrale':'clermont','cf3-jaude':'clermont','cf3-montferrand':'clermont','cf3-bargoin':'clermont','cf3-marq':'clermont','cf3-salins':'clermont','cf3-delille':'clermont','cf3-carmes':'clermont','cf3-photo-montjuzet':'clermont','cf3-royat-link':'clermont','cf3-hiver':'clermont','pdd-clermont-textile':'clermont','pdd-clermont-archives':'clermont','pdd-clermont':'clermont',
 'pdd-thiers-metal':'thiers','pdd-thiers':'thiers','pdd-d-thiers':'thiers','thiers-coutellerie':'thiers',
 'pdd-riom-archives':'riom','pdd-d-riom':'riom','riom-archives':'riom','riom-centre':'riom',
 'pdd-volvic-craft':'volvic','pdd-volvic':'volvic','pdd-d-volvic':'volvic',
 'pdd-sancy-montdore':'montdore','pdd-d-montdore':'montdore',
 'pdd-bourboule':'bourboule','pdd-d-bourboule':'bourboule',
 'pdd-issoire':'issoire','pdd-d-issoire':'issoire',
 'pdd-d-ambert':'ambert',
 'pdd-orcines':'orcines','pdd-d-orcines':'orcines'
};
const extra={};
for(const [id,key] of Object.entries(aliases))extra[id]={...C[key],contextAlias:key,source:C[key].source+' · repère documentaire partagé'};
for(const [id,m] of Object.entries(extra))api.items[id]=m;
try{
 const saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};
 for(const [id,m] of Object.entries(extra))saved[id]={...(saved[id]||{}),...m,url:m.image,attribution:m.source};
 localStorage.setItem(STORAGE,JSON.stringify(saved));
}catch(_){ }
window.HCTerritorialPlaceMediaPuyDeDome={version:1,items:extra,aliases};
})();
