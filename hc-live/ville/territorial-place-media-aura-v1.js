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
 'mc-bourg-scene':{image:commons('Théâtre de Bourg-en-Bresse.jpg'),source:source('Théâtre de Bourg-en-Bresse.jpg'),kind:'photo',real:true},
 'ain-emaux-bourg':{image:commons("Boutique Jeanvoine d'émaux bressans à Bourg-en-Bresse (février 2023).JPG"),source:source("Boutique Jeanvoine d'émaux bressans à Bourg-en-Bresse (février 2023).JPG"),kind:'photo',real:true},
 'bou-emaux':{image:commons("Boutique Jeanvoine d'émaux bressans à Bourg-en-Bresse (février 2023).JPG"),source:source("Boutique Jeanvoine d'émaux bressans à Bourg-en-Bresse (février 2023).JPG"),kind:'photo',real:true},
 'bou-centre':{image:'https://www.bourgenbressedestinations.fr/app/uploads/bourg-en-bresse/2023/05/thumbs/60505/bourg-en-bresse-julien-audigier-11-640x640.webp',source:'Bourg-en-Bresse destinations — Hôtel de Ville / centre de Bourg-en-Bresse',sourceUrl:'https://www.bourgenbressedestinations.fr/explorer/bourg-en-bresse-lesprit-citadin/escapade-a-bourg-en-bresse/',kind:'photo',real:true},
 'ain-archives-bourg':{image:'https://www.ain-genealogie.fr/images/batim.jpg',source:'Ain-Généalogie — bâtiment des Archives départementales de l’Ain',sourceUrl:'https://www.ain-genealogie.fr/archives.htm',kind:'photo',real:true},
 'bou-archives':{image:'https://www.ain-genealogie.fr/images/batim.jpg',source:'Ain-Généalogie — bâtiment des Archives départementales de l’Ain',sourceUrl:'https://www.ain-genealogie.fr/archives.htm',kind:'photo',real:true},
 'bou-marche':{image:commons('Marché couvert Champ Foire Bourg Bresse 1.jpg'),source:source('Marché couvert Champ Foire Bourg Bresse 1.jpg'),kind:'photo',real:true},

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

 /* AIN — Oyonnax : ville + musée + Grande Vapeur */
 'ain-map-oyo':{image:commons("Centre d'Oyonnax.jpg"),source:source("Centre d'Oyonnax.jpg"),kind:'photo',real:true},
 'ain-oyonnax':{image:commons("Centre d'Oyonnax.jpg"),source:source("Centre d'Oyonnax.jpg"),kind:'photo',real:true},
 'oyo-centre':{image:commons("Centre d'Oyonnax.jpg"),source:source("Centre d'Oyonnax.jpg"),kind:'photo',real:true},
 'ain-oyonnax-musee':{image:'https://static.apidae-tourisme.com/filestore/objets-touristiques/images/160/153/23566752.jpg',source:'L’Ain Tourisme / Apidae — Musée du Peigne et de la Plasturgie, Oyonnax',sourceUrl:'https://www.ain-tourisme.com/offres/musee-du-peigne-et-de-la-plasturgie-oyonnax-fr-5374842/',kind:'photo',real:true},
 'oyo-musee':{image:'https://static.apidae-tourisme.com/filestore/objets-touristiques/images/160/153/23566752.jpg',source:'L’Ain Tourisme / Apidae — Musée du Peigne et de la Plasturgie, Oyonnax',sourceUrl:'https://www.ain-tourisme.com/offres/musee-du-peigne-et-de-la-plasturgie-oyonnax-fr-5374842/',kind:'photo',real:true},
 'mc-oyo-musee':{image:'https://static.apidae-tourisme.com/filestore/objets-touristiques/images/160/153/23566752.jpg',source:'L’Ain Tourisme / Apidae — Musée du Peigne et de la Plasturgie, Oyonnax',sourceUrl:'https://www.ain-tourisme.com/offres/musee-du-peigne-et-de-la-plasturgie-oyonnax-fr-5374842/',kind:'photo',real:true},
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
window.HCTerritorialPlaceMediaAURA={version:2,items:M,get(id){return M[String(id||'')]||null},all(){return{...M}}};

/* Visuel de jeu déterministe pour tout contenu explicitement fictif.
   Jamais utilisé pour un lieu réel : les vrais lieux gardent l'obligation photo + source. */
function hash(s){let h=2166136261;for(const c of String(s||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function xml(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]))}
function gameIllustration(p){
 const palettes=[['#efe4d7','#c27868','#2b211c'],['#e3e8df','#71806d','#272c27'],['#e5e0ea','#8b718d','#29222b'],['#e4e8ec','#697b8b','#20272c'],['#eee5db','#a57b58','#2d251f']];
 const H=hash((p.id||'')+'|'+(p.city||'')+'|'+(p.cat||'')),q=palettes[H%palettes.length];
 const title=xml(String(p.name||'CONTENU DE JEU').slice(0,52)),city=xml(String(p.city||p.where||'Auvergne-Rhône-Alpes').slice(0,40)),kind=xml(String(p.cat||'territoire').toUpperCase());
 const a=90+(H%170),b=600+((H>>>8)%260),c=250+((H>>>16)%500);
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700"><rect width="1200" height="700" fill="${q[0]}"/><circle cx="${a}" cy="120" r="270" fill="${q[1]}" opacity=".18"/><circle cx="${b}" cy="610" r="360" fill="${q[1]}" opacity=".12"/><path d="M0 ${c} C250 ${c-150} 430 ${c+120} 680 ${c-30} S1020 ${c-120} 1200 ${c+50} V700 H0Z" fill="${q[1]}" opacity=".18"/><g fill="none" stroke="${q[2]}" opacity=".25" stroke-width="2"><path d="M90 90h1020M90 610h1020"/><circle cx="1030" cy="155" r="76"/><circle cx="1030" cy="155" r="48"/></g><text x="90" y="105" font-family="Arial,sans-serif" font-size="22" font-weight="700" letter-spacing="5" fill="${q[1]}">ILLUSTRATION DE JEU · ${kind}</text><text x="90" y="355" font-family="Georgia,serif" font-size="58" fill="${q[2]}">${title}</text><text x="92" y="410" font-family="Arial,sans-serif" font-size="24" fill="${q[2]}" opacity=".72">${city}</text><text x="90" y="620" font-family="Arial,sans-serif" font-size="18" fill="${q[2]}" opacity=".55">HAUTE COUTURE LIVE · contenu fictif / interprétation de gameplay</text></svg>`;
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
function decorateFictional(p){if(!p||!p.fictional||p.image||p.photo||p.imageUrl)return p;return{...p,image:gameIllustration(p),imageSource:'Illustration générée par Haute Couture Live · contenu fictif',gameIllustration:true}}
function installFictionalVisuals(){
 const api=window.HCTerritorialPlaceInterfaceV1;if(!api||api.__fictionalVisualsV1)return false;
 const original=api.open;if(typeof original!=='function')return false;
 const wrapped=p=>original(decorateFictional(p));api.open=wrapped;api.__fictionalVisualsV1=true;api.gameIllustration=gameIllustration;
 window.HCLocalMapOpenGuide=wrapped;return true;
}
window.addEventListener('hc-territorial-place-interface-ready',installFictionalVisuals);
queueMicrotask(()=>installFictionalVisuals());
window.dispatchEvent(new CustomEvent('hc-territorial-place-media-ready',{detail:{version:2,count:Object.keys(M).length,fictionalVisuals:'generated-labelled'}}));
})();