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
 /* AIN — Bourg-en-Bresse / Brou */
 'ain-brou':{image:commons('Monastère Royal de Brou 38.jpg'),source:source('Monastère Royal de Brou 38.jpg'),kind:'photo',real:true},
 'mc-bourg-brou':{image:commons('Monastère Royal de Brou 38.jpg'),source:source('Monastère Royal de Brou 38.jpg'),kind:'photo',real:true},
 'bou-brou':{image:commons('Monastère Royal de Brou 38.jpg'),source:source('Monastère Royal de Brou 38.jpg'),kind:'photo',real:true},
 'ain-map-bourg':{image:commons('Monastère Royal de Brou 38.jpg'),source:source('Monastère Royal de Brou 38.jpg'),kind:'photo',real:true},
 'ain-bourg':{image:commons('Monastère Royal de Brou 38.jpg'),source:source('Monastère Royal de Brou 38.jpg'),kind:'photo',real:true},
 'ain-scene-bourg':{image:commons('Théâtre de Bourg-en-Bresse.jpg'),source:source('Théâtre de Bourg-en-Bresse.jpg'),kind:'photo',real:true},
 'bou-scene':{image:commons('Théâtre de Bourg-en-Bresse.jpg'),source:source('Théâtre de Bourg-en-Bresse.jpg'),kind:'photo',real:true},
 'ain-emaux-bourg':{image:commons("Boutique Jeanvoine d'émaux bressans à Bourg-en-Bresse (février 2023).JPG"),source:source("Boutique Jeanvoine d'émaux bressans à Bourg-en-Bresse (février 2023).JPG"),kind:'photo',real:true},
 'bou-emaux':{image:commons("Boutique Jeanvoine d'émaux bressans à Bourg-en-Bresse (février 2023).JPG"),source:source("Boutique Jeanvoine d'émaux bressans à Bourg-en-Bresse (février 2023).JPG"),kind:'photo',real:true},

 /* AIN — Pérouges */
 'ain-perouges':{image:commons('Maisons Pérouges.jpg'),source:source('Maisons Pérouges.jpg'),kind:'photo',real:true},
 'ain-map-per':{image:commons('Maisons Pérouges.jpg'),source:source('Maisons Pérouges.jpg'),kind:'photo',real:true},

 /* AIN — Nantua */
 'ain-nantua':{image:commons('Lac de Nantua.jpg'),source:source('Lac de Nantua.jpg'),kind:'photo',real:true},
 'ain-map-nan':{image:commons('Lac de Nantua.jpg'),source:source('Lac de Nantua.jpg'),kind:'photo',real:true},

 /* AIN — Ferney-Voltaire */
 'ain-ferney':{image:commons('Château Ferney Voltaire.JPG'),source:source('Château Ferney Voltaire.JPG'),kind:'photo',real:true},
 'ain-map-fer':{image:commons('Château Ferney Voltaire.JPG'),source:source('Château Ferney Voltaire.JPG'),kind:'photo',real:true},

 /* AIN — Dombes */
 'ain-dombes':{image:commons('Villars les Dombes.jpg'),source:source('Villars les Dombes.jpg'),kind:'photo',real:true},
 'ain-map-dom':{image:commons('Villars les Dombes.jpg'),source:source('Villars les Dombes.jpg'),kind:'photo',real:true},
 'ain-dombes-registry':{image:commons('Villars les Dombes.jpg'),source:source('Villars les Dombes.jpg'),kind:'photo',real:true},

 /* AIN — Oyonnax : ville + Grande Vapeur */
 'ain-map-oyo':{image:commons("Centre d'Oyonnax.jpg"),source:source("Centre d'Oyonnax.jpg"),kind:'photo',real:true},
 'ain-oyonnax':{image:commons("Centre d'Oyonnax.jpg"),source:source("Centre d'Oyonnax.jpg"),kind:'photo',real:true},
 'ain-grande-vapeur':{image:commons('Usine Grande Vapeur - Oyonnax (FR01) - 2021-07-03 - 1.jpg'),source:source('Usine Grande Vapeur - Oyonnax (FR01) - 2021-07-03 - 1.jpg'),kind:'photo',real:true},
 'mc-oyo-vapeur':{image:commons('Usine Grande Vapeur - Oyonnax (FR01) - 2021-07-03 - 1.jpg'),source:source('Usine Grande Vapeur - Oyonnax (FR01) - 2021-07-03 - 1.jpg'),kind:'photo',real:true},
 'oyo-vapeur':{image:commons('Usine Grande Vapeur - Oyonnax (FR01) - 2021-07-03 - 1.jpg'),source:source('Usine Grande Vapeur - Oyonnax (FR01) - 2021-07-03 - 1.jpg'),kind:'photo',real:true},

 /* AIN — Jujurieux / Soieries Bonnet */
 'ain-map-juj':{image:commons('Entrée du musée des soieries Bonnet (Jujurieux).jpg'),source:source('Entrée du musée des soieries Bonnet (Jujurieux).jpg'),kind:'photo',real:true},
 'ain-jujurieux':{image:commons('Entrée du musée des soieries Bonnet (Jujurieux).jpg'),source:source('Entrée du musée des soieries Bonnet (Jujurieux).jpg'),kind:'photo',real:true},
 'ain-soieries':{image:commons('Entrée du musée des soieries Bonnet (Jujurieux).jpg'),source:source('Entrée du musée des soieries Bonnet (Jujurieux).jpg'),kind:'photo',real:true},

 /* AIN — Pays de Gex */
 'ain-map-gex':{image:commons('Col Faucille Gex Ain 4.jpg'),source:source('Col Faucille Gex Ain 4.jpg'),kind:'photo',real:true},
 'ain-gex':{image:commons('Col Faucille Gex Ain 4.jpg'),source:source('Col Faucille Gex Ain 4.jpg'),kind:'photo',real:true},
 'ain-gex-registry':{image:commons('Col Faucille Gex Ain 4.jpg'),source:source('Col Faucille Gex Ain 4.jpg'),kind:'photo',real:true},

 /* AIN — Mijoux */
 'ain-map-mij':{image:commons('Col de la Faucille 01- Un dei rari scorci interessanti, qui il villaggio di Mijoux 990m- BVAPM.jpg'),source:source('Col de la Faucille 01- Un dei rari scorci interessanti, qui il villaggio di Mijoux 990m- BVAPM.jpg'),kind:'photo',real:true},
 'ain-mijoux':{image:commons('Col de la Faucille 01- Un dei rari scorci interessanti, qui il villaggio di Mijoux 990m- BVAPM.jpg'),source:source('Col de la Faucille 01- Un dei rari scorci interessanti, qui il villaggio di Mijoux 990m- BVAPM.jpg'),kind:'photo',real:true},

 /* AIN — Belley */
 'ain-map-bel':{image:commons('Belley.jpg'),source:source('Belley.jpg'),kind:'photo',real:true},
 'ain-belley':{image:commons('Belley.jpg'),source:source('Belley.jpg'),kind:'photo',real:true},

 /* AIN — lieux complémentaires documentés */
 'ain-cerdon-cuivre':{image:commons('Cuivrerie Cerdon Ain 1.jpg'),source:source('Cuivrerie Cerdon Ain 1.jpg'),kind:'photo',real:true},
 'ain-ambronay':{image:commons('Jardin du cloître, vu de la galerie supérieure.jpg'),source:source('Jardin du cloître, vu de la galerie supérieure.jpg'),kind:'photo',real:true},
 'ain-chatillon':{image:commons('Halles - Châtillon-sur-Chalaronne (FR01) - 2025-07-06 - 1.jpg'),source:source('Halles - Châtillon-sur-Chalaronne (FR01) - 2025-07-06 - 1.jpg'),kind:'photo',real:true},
 'ain-vonnas':{image:commons('Vonnas-FR-01-mairie-01.jpg'),source:source('Vonnas-FR-01-mairie-01.jpg'),kind:'photo',real:true},
 'ain-meillonnas':{image:commons('Meillonnas rue ancienne.JPG'),source:source('Meillonnas rue ancienne.JPG'),kind:'photo',real:true},
 'ain-albarine-schappe':{image:commons('Vue de Saint-Rambert-en-Bugey depuis le chemin du Four (août 2019).jpg'),source:source('Vue de Saint-Rambert-en-Bugey depuis le chemin du Four (août 2019).jpg'),kind:'photo',real:true}
};
try{
 const saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};
 for(const [id,m] of Object.entries(M))saved[id]={...(saved[id]||{}),...m,url:m.image,attribution:m.source};
 localStorage.setItem(STORAGE,JSON.stringify(saved));
}catch(_){/* fallback runtime : le registre window reste disponible */}
window.HCTerritorialPlaceMediaAURA={version:1,items:M,get(id){return M[String(id||'')]||null},all(){return{...M}}};
window.dispatchEvent(new CustomEvent('hc-territorial-place-media-ready',{detail:{version:1,count:Object.keys(M).length}}));
})();