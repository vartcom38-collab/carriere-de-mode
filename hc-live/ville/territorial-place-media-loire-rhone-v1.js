/* Haute Couture Live — compléments média documentaires Loire (42) + Rhône (69) V2
   Couche additive : associe les marqueurs réels à des photos documentaires sourcées
   et complète uniquement les champs créatifs manquants détectés par la recette exhaustive.
*/
(function(){
'use strict';
if(window.__HCTerritorialPlaceMediaLoireRhoneV2)return;window.__HCTerritorialPlaceMediaLoireRhoneV2=true;
const STORAGE='haute-couture-territorial-place-media-v1';
const commons=(file,w=1600)=>`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;
const media=(file,label)=>({image:commons(file),url:commons(file),source:`Wikimedia Commons — ${label}`,attribution:`Wikimedia Commons — ${label}`,sourceUrl:`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file).replace(/%20/g,'_')}`,kind:'photo',real:true});
const M={
 /* Loire — repères canoniques */
 'lr42-saint-etienne':media("L'hotel de ville.jpg",'Hôtel de ville de Saint-Étienne'),
 'lr42-charlieu':media('Abbaye de Charlieu (6).jpg','Abbaye de Charlieu'),
 'lr42-roanne':media('Roanne - Hôtel de ville.jpg','Roanne · Hôtel de ville'),
 'lr42-gier':media('Rive-de-Gier.JPG','Rive-de-Gier · vue générale'),
 'lr42-montbrison':media('Panorama Montbrison.jpg','Montbrison · panorama'),
 'lr42-firminy':media('Hauteurs de Firminy.JPG','Firminy · vue depuis les hauteurs'),
 'lr42-feurs':media('Feurs (Loire, Fr) Loise.JPG','Feurs · Loire'),
 'lr42-saint-bonnet':media('Saint Bonnet le Château.jpg','Saint-Bonnet-le-Château'),
 'lr42-boen':media('Boen sur Lignon.jpg','Boën-sur-Lignon · vallée du Lignon'),
 'lr42-noiretable':media('Eglise de Noirétable.JPG','Noirétable · église'),
 'lr42-saint-galmier':media('Saint-galmier.jpg','Saint-Galmier'),

 /* Rhône — Lyon et grands pôles */
 'lr69-lyon':media('Panoramic view of Lyon from Fourvière.jpg','Lyon · panorama depuis Fourvière'),
 'lr69-canuts':media('La Maison des Canuts Panneau.JPG','Maison des Canuts · Lyon'),
 'lr69-vieux-lyon':media('Vieux Lyon (31991726254).jpg','Vieux Lyon'),
 'lr69-confluence':media('Lyon, confluence du Rhône et de la Saône.jpg','Lyon · Confluence Rhône-Saône'),
 'lr69-opera':media('Lyon opera.jpg','Opéra de Lyon'),
 'lr69-partdieu':media('Gare Part-Dieu (Lyon, 2025).jpg','Gare de Lyon-Part-Dieu'),
 'lr69-teteor':media("Parc de la Tête d'Or - Lyon (FR69) - 2024-06-01 - 1.jpg",'Parc de la Tête d’Or · Lyon'),
 'lr69-villeurbanne':media('Villeurbanne.Avenue Henri-Barbusse.Les gratte-ciels.jpg','Villeurbanne · Gratte-Ciel'),
 'lr69-villefranche':media('Villefranche-sur-Saône (Rhône, France).jpg','Villefranche-sur-Saône'),
 'lr69-tarare':media('Maison dite "ancien prieuré" Tarare (Rhône).jpg','Tarare · ancien prieuré'),
 'lr69-amplepuis':media('Amplepuis - Musée Barthélemy Thimonnier - 1.jpg','Amplepuis · musée Barthélemy Thimonnier'),
 'lr69-thizy':media('Thizy-les-Bourgs - Mairie.JPG','Thizy-les-Bourgs'),
 'lr69-fourviere':media('Panorama depuis Fourvière Lyon 1.jpg','Lyon · panorama depuis Fourvière')
};
const A={
 /* Loire */
 'loire-stet-ruban':'lr42-saint-etienne','loire-stet-design':'lr42-saint-etienne','ste3-mai':'lr42-saint-etienne','ste3-manufacture':'lr42-saint-etienne','ste3-centre':'lr42-saint-etienne','ste3-carnot':'lr42-saint-etienne','ste3-chavanelle':'lr42-saint-etienne','ste3-belair':'lr42-saint-etienne','ste3-winter':'lr42-saint-etienne','loire-stetienne':'lr42-saint-etienne',
 'loire-charlieu-soierie':'lr42-charlieu','loire-charlieu':'lr42-charlieu','charlieu-soierie':'lr42-charlieu','charlieu-centre':'lr42-charlieu','charlieu-atelier':'lr42-charlieu',
 'loire-roanne-prod':'lr42-roanne','loire-roanne':'lr42-roanne','roanne-commerce':'lr42-roanne',
 'loire-gier':'lr42-gier','ste3-gier':'lr42-gier','lo42-map-rdg':'lr42-gier','lo42-rdg-industrie':'lr42-gier',
 'loire-montbrison':'lr42-montbrison','tier2-montbrison-0':'lr42-montbrison','tier2-montbrison-1':'lr42-montbrison','tier2-montbrison-8':'lr42-montbrison',
 'loire-firminy':'lr42-firminy','ste3-firminy':'lr42-firminy','lo42-firminy-modulor':'lr42-firminy',
 'loire-feurs':'lr42-feurs','lo42-feurs-marche':'lr42-feurs',
 'lo42-map-sbc':'lr42-saint-bonnet','lo42-sbc-artisanat':'lr42-saint-bonnet',
 'lo42-map-boen':'lr42-boen','lo42-boen-forez':'lr42-boen',
 'lo42-map-noiretable':'lr42-noiretable','lo42-noiretable-foret':'lr42-noiretable',
 'lo42-map-sg':'lr42-saint-galmier','lo42-sg-eau':'lr42-saint-galmier',

 /* Rhône */
 'rh-lyon-canuts':'lr69-canuts','rh-lyon-traboules':'lr69-canuts','lyon-croixrousse-belvedere':'lr69-canuts','lyon-croixrousse-memoire':'lr69-canuts',
 'rh-lyon-musee-tissus':'lr69-lyon','rh-lyon-ensatt':'lr69-lyon','rh-lyon-ensba':'lr69-lyon','rh-lyon-sucriere':'lr69-confluence','rh-lyon-opera':'lr69-opera','rh-lyon-presquile':'lr69-lyon','lyon-presquile-vitrines':'lr69-lyon',
 'rh-lyon-vieux':'lr69-vieux-lyon','lyon-vieux-costume-recherche':'lr69-vieux-lyon','rh-lyon-confluence':'lr69-confluence','lyon-confluence-photo':'lr69-confluence',
 'rh-lyon-guillotiere':'lr69-lyon','rh-lyon-partdieu':'lr69-partdieu','lyon-partdieu-travel':'lr69-partdieu','rh-lyon-vaise':'lr69-lyon','lyon-gerland-tech':'lr69-lyon','lyon-brotteaux-clientele':'lr69-lyon','lyon-fourviere-panorama':'lr69-fourviere','lyon-teteor-nature':'lr69-teteor',
 'rh-villeurbanne':'lr69-villeurbanne','lyon-villeurbanne-scene':'lr69-villeurbanne','rh-dense-villeurbanne-scene':'lr69-villeurbanne','vil-gratte-ciel':'lr69-villeurbanne','vil-tnp':'lr69-villeurbanne','vil-campus':'lr69-villeurbanne','vil-charpennes':'lr69-villeurbanne',
 'rh-villefranche':'lr69-villefranche','rh-beaujolais':'lr69-villefranche','rh-dense-villefranche-reception':'lr69-villefranche','vfs-centre':'lr69-villefranche','vfs-beaujolais':'lr69-villefranche',
 'rh-tarare':'lr69-tarare','rh-dense-tarare-voilage':'lr69-tarare','tier2-tarare-0':'lr69-tarare','tier2-tarare-1':'lr69-tarare','tier2-tarare-8':'lr69-tarare',
 'rh-map-amplepuis':'lr69-amplepuis','rh-map-thizy':'lr69-thizy','rh-dense-thizy-manufacture':'lr69-thizy'
};
for(const [id,src] of Object.entries(A)){const base=M[src];if(base)M[id]={...base,contextAlias:src,source:base.source+' · repère documentaire partagé',attribution:base.attribution+' · repère documentaire partagé'};}
try{const saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};for(const [id,m] of Object.entries(M))saved[id]={...(saved[id]||{}),...m};localStorage.setItem(STORAGE,JSON.stringify(saved));}catch(_){ }
const api=window.HCTerritorialPlaceMediaAURA;if(api?.items)for(const [id,m] of Object.entries(M))api.items[id]=m;

/* Enrichissements éditoriaux ciblés : uniquement les marqueurs que la recette a trouvés vides. */
const E={
 'charlieu-centre':{palette:['pierre claire','ocre doux','gris ardoise'],materials:['lin','laine'],motifs:['arcades','trame médiévale']},
 'charlieu-atelier':{palette:['écru','bleu atelier','bois'],materials:['soie','fils','bois'],motifs:['navette','chaîne-trame']},
 'vfs-centre':{palette:['pierre dorée','crème','gris zinc'],materials:['lin','laine fine'],motifs:['façades','rythme urbain']},
 'vfs-beaujolais':{palette:['lie-de-vin','pierre dorée','vert vigne'],materials:['soie','velours','lin'],motifs:['vigne','courbes du relief']},
 'tier2-tarare-0':{palette:['écru','gris atelier','bleu nuit'],materials:['voilage','coton','fils'],motifs:['trame','mémoire industrielle']},
 'tier2-tarare-3':{palette:['blanc cassé','gris perle','bleu brume'],materials:['voilage','organza','fils fins'],motifs:['transparence','rayures légères']},
 'tier2-tarare-8':{palette:['vert sombre','pierre','bleu horizon'],materials:['laine','toile'],motifs:['relief','lignes d’horizon']}
};
function enrich(p){const e=E[p?.id];if(!e)return p;for(const k of ['palette','materials','motifs'])if(!(p[k]?.length))p[k]=[...e[k]];return p;}
function wrapMap(map){if(!map?.addMarker||map.__hcLoireRhoneEnriched)return map;const add=map.addMarker.bind(map);map.addMarker=p=>add(enrich(p));map.__hcLoireRhoneEnriched=true;return map;}
try{
 let current=window.HCLocalMap;const d=Object.getOwnPropertyDescriptor(window,'HCLocalMap');
 if((!d||d.configurable)&&!window.__hcLoireRhoneMapHook){window.__hcLoireRhoneMapHook=true;Object.defineProperty(window,'HCLocalMap',{configurable:true,get(){return current},set(v){current=wrapMap(v)}});if(current)current=wrapMap(current)}
 else if(current)wrapMap(current);
}catch(_){if(window.HCLocalMap)wrapMap(window.HCLocalMap)}

window.HCTerritorialPlaceMediaLoireRhone={version:2,items:M,aliases:A,enrich};
window.dispatchEvent(new CustomEvent('hc-territorial-place-media-loire-rhone-ready',{detail:{count:Object.keys(M).length,aliases:Object.keys(A).length}}));
})();