/* Haute Couture Live — compléments média documentaires Ardèche (07) V1
   Couche additive : rattache les marqueurs territoriaux réels à des photos
   documentaires sourcées, sans transformer les lieux fictifs en lieux réels.
*/
(function(){
'use strict';
if(window.__HCTerritorialPlaceMediaArdecheV1)return;window.__HCTerritorialPlaceMediaArdecheV1=true;
const STORAGE='haute-couture-territorial-place-media-v1';
const commons=(file,w=1600)=>`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;
const wm=(file,label)=>({image:commons(file),url:commons(file),source:`Wikimedia Commons — ${label}`,attribution:`Wikimedia Commons — ${label}`,sourceUrl:`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file).replace(/%20/g,'_')}`,kind:'photo',real:true});
const doc=(image,label,sourceUrl)=>({image,url:image,source:label,attribution:label,sourceUrl,kind:'photo',real:true});
const M={
 'ar07-annonay':wm('Annonay La Deûme.jpg','Annonay · La Deûme'),
 'ar07-aubenas':wm("Site remarquable d'Aubenas.jpg",'Aubenas · site remarquable'),
 'ar07-privas':doc('https://www.coeur-ardeche.fr/app/uploads/2025/05/2024-bit-privas.webp','Office de Tourisme Cœur d’Ardèche — Privas','https://www.coeur-ardeche.fr/preparer/informations-pratiques/loffice-de-tourisme/'),
 'ar07-tournon':doc('https://media.ardeche-hermitage.com/photos/structure_18937/38053428.png.1024x747_q70_crop_upscale.jpg','Ardèche Hermitage Tourisme — Tournon-sur-Rhône','https://www.ardeche-hermitage.com/fr/catalogue/detail/exposition-arts-pluriel-la-tourette-7685217/'),
 'ar07-teil':doc('https://www.sud-ardeche-tourisme.com/vallee-vignobles/uploads/2019/08/bureaux-information-touristique-le-teil_1800x1260_acf_cropped-640x448.jpg','Office de Tourisme Porte Sud Ardèche — Le Teil','https://www.sud-ardeche-tourisme.com/decouvrir-le-sud-ardeche/terre-dhistoire/secrets-de-villages/au-bord-du-rhone/meysse/'),
 'ar07-jaujac':doc('https://via-ardeche.fr/uploads/2024/10/village-de-jaujac-vu-du-chastelas-credits-sbugnon.jpeg','Via Ardèche — village de Jaujac','https://via-ardeche.fr/a-voir/incontournables/jaujac/'),
 'ar07-largentiere':doc('https://en.tourisme-valdeligne.fr/wp-content/uploads/sites/2/wpetourisme/21728874-diaporama-scaled.jpg','Office de Tourisme Val de Ligne — Largentière','https://en.tourisme-valdeligne.fr/cultural-heritage/medieval-town-of-largentiere/'),
 'ar07-lesvans':doc('https://cdn.iris-etourism.io/uploads/adt_ardeche/sizes/6e4/178-48-35991730-800x520.webp','Ardèche Guide — Les Vans','https://www.ardeche-guide.com/commerce/office-de-tourisme-cevennes-dardeche-bureau-des-vans-476284/'),
 'ar07-vallon':doc('https://sourcesvolcans.com/medias/45-1-2048x1152.jpg','Office de Tourisme Gorges de l’Ardèche Pont d’Arc — Vallon-Pont-d’Arc','https://sourcesvolcans.com/en/office-de-tourisme-gorges-de-lardeche-pont-darc-bureau-de-vallon-pont-darc'),
 'ar07-stagreve':doc('https://sourcesvolcans.com/medias/facade-saint-agreve-1.jpg','Office de Tourisme Ardèche Hautes Vallées — Saint-Agrève','https://sourcesvolcans.com/office-de-tourisme-ardeche-hautes-vallees-saint-agreve'),
 'ar07-marcols-neuve':doc('https://cdn-s-www.ledauphine.com/images/74089E6B-91FF-49E1-B4A5-069B90261B70/FB1200/photo-1629039198.jpg','Le Dauphiné Libéré — Moulinage de la Neuve, Marcols-les-Eaux','https://www.ledauphine.com/culture-loisirs/2021/08/16/l-idee-de-sortie-a-la-decouverte-du-moulinage-de-la-neuve-de-marcols-les-eaux')
};
const A={
 'ar-ann-industrie':'ar07-annonay',
 'aub-centre':'ar07-aubenas',
 'ar-privas':'ar07-privas','pri-centre':'ar07-privas',
 'ar-tournon':'ar07-tournon','tour-rhone':'ar07-tournon',
 'ar-teil':'ar07-teil','teil-reemploi':'ar07-teil',
 'ar-jaujac':'ar07-jaujac','jau-monts':'ar07-jaujac',
 'ar-largentiere':'ar07-largentiere','lar-centre':'ar07-largentiere',
 'ar-lesvans':'ar07-lesvans','vans-cevennes':'ar07-lesvans',
 'ar-vallon':'ar07-vallon','vallon-arc':'ar07-vallon',
 'ar-stagreve':'ar07-stagreve','stagr-plateau':'ar07-stagreve',
 'marcols-neuve':'ar07-marcols-neuve'
};
for(const [id,src] of Object.entries(A)){const base=M[src];if(base)M[id]={...base,contextAlias:src,source:base.source+' · repère documentaire partagé',attribution:base.attribution+' · repère documentaire partagé'};}
try{const saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};for(const [id,m] of Object.entries(M))saved[id]={...(saved[id]||{}),...m};localStorage.setItem(STORAGE,JSON.stringify(saved));}catch(_){ }
const api=window.HCTerritorialPlaceMediaAURA;if(api?.items)for(const [id,m] of Object.entries(M))api.items[id]=m;
window.HCTerritorialPlaceMediaArdeche={version:1,items:M,aliases:A};
window.dispatchEvent(new CustomEvent('hc-territorial-place-media-ardeche-ready',{detail:{count:Object.keys(M).length,aliases:Object.keys(A).length}}));
})();
