/* Haute Couture Live — carte départementale Ain dense V2 */
(function(){'use strict';if(window.__HCAinMapContentV2)return;window.__HCAinMapContentV2=true;const ctx=window.HCTerritoryContext,bridge=window.HCLocalMap,p=ctx?.getPresence?.();if(!bridge||String(p?.departmentCode||'')!=='01')return;const P=[
{id:'ain-map-bourg',city:'Bourg-en-Bresse',name:'Bourg-en-Bresse · capitale bressane',cat:'culture',lat:46.2052,lng:5.2255,text:'Architecture, cérémonie, photographie, clientèle et métiers d’art.'},
{id:'ain-map-oyo',city:'Oyonnax',name:'Oyonnax · plasturgie & accessoire',cat:'craft',lat:46.2592,lng:5.6573,text:'Peigne, lunetterie, acétate, prototype et design industriel.'},
{id:'ain-map-juj',city:'Jujurieux',name:'Jujurieux · soieries & textile',cat:'fabric',lat:46.0396,lng:5.4084,text:'Soie, velours, tissage, archives et patrimoine industriel textile.'},
{id:'ain-map-per',city:'Pérouges',name:'Pérouges · patrimoine & réemploi',cat:'heritage',lat:45.9038,lng:5.1796,text:'Pierre, photo, cérémonie, vintage et réemploi.'},
{id:'ain-map-gex',city:'Gex',name:'Pays de Gex · transfrontalier & savoir-faire',cat:'craft',lat:46.333,lng:6.0577,text:'Réseau Genève, Monts Jura, artisans, clientèle mobile et internationale.'},
{id:'ain-map-fer',city:'Ferney-Voltaire',name:'Ferney-Voltaire · culture internationale',cat:'culture',lat:46.2576,lng:6.108,text:'Réception, culture, représentation et réseaux transfrontaliers.'},
{id:'ain-map-mij',city:'Mijoux',name:'Mijoux · lapidaire & Jura',cat:'jewelry',lat:46.367,lng:5.997,text:'Pierre, facette, bijou, hiver et petite série.'},
{id:'ain-map-bel',city:'Belley',name:'Belley · Bugey & clientèle locale',cat:'markets',lat:45.758,lng:5.685,text:'Marché, cérémonie, vallée, matière naturelle et proximité.'},
{id:'ain-map-dom',city:'Villars-les-Dombes',name:'Dombes · eau, lumière & cérémonie',cat:'nature',lat:46.002,lng:5.032,text:'Étangs, lumière, mariage, photo et saisonnalité extérieure.'},
{id:'ain-map-nan',city:'Nantua',name:'Nantua · lac & Haut-Bugey',cat:'view',lat:46.151,lng:5.606,text:'Lac, relief, photographie et pont vers l’industrie du Haut-Bugey.'}
];P.forEach(x=>bridge.addMarker({dept:'01',departmentName:'Ain',where:x.city+' · Ain',materials:x.city==='Jujurieux'?['soie','velours']:x.city==='Oyonnax'?['acétate','plastique recyclé']:[],motifs:[],palette:[],unlock:'Voyage · Book · Atelier · réseau territorial.',...x}))})();