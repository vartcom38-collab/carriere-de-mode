/* Haute Couture Live — compléments média documentaires AURA V3
   Ajoute des médias à des marqueurs territoriaux existants sans dupliquer leur contenu gameplay.
   Les alias ne sont créés que lorsqu'ils désignent le même lieu ou un repère territorial dont la photo est explicitement contextuelle.
*/
(function(){
'use strict';
if(window.__HCTerritorialPlaceMediaAURAFinalV3)return;window.__HCTerritorialPlaceMediaAURAFinalV3=true;
const api=window.HCTerritorialPlaceMediaAURA;if(!api?.items)return;
const STORAGE='haute-couture-territorial-place-media-v1';
const commons=(file,w=1600)=>`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;
const extra={
 'is-bj-musee':{image:commons('Métier à tisser du XIXème.jpg'),source:'Wikimedia Commons — Métier à tisser du XIXème.jpg',sourceUrl:'https://musee.bourgoinjallieu.fr/le-musee/',kind:'photo',real:true},
 'bj-musee-textile':{image:'https://musee.bourgoinjallieu.fr/wp-content/uploads/2022/03/textile-img-1.webp',source:'Musée de Bourgoin-Jallieu — parcours textile · métier à tisser',sourceUrl:'https://musee.bourgoinjallieu.fr/le-musee/',kind:'photo',real:true},
 'bj-musee-rebracks':{image:'https://musee.bourgoinjallieu.fr/wp-content/uploads/2022/03/textile-img-1.webp',source:'Musée de Bourgoin-Jallieu — parcours textile · repère documentaire partagé',sourceUrl:'https://musee.bourgoinjallieu.fr/collections/',kind:'photo',real:true,contextAlias:'bj-musee-textile'},
 'bj-musee-metiers':{image:'https://musee.bourgoinjallieu.fr/wp-content/uploads/2022/03/textile-img-1.webp',source:'Musée de Bourgoin-Jallieu — parcours textile · métier à tisser',sourceUrl:'https://musee.bourgoinjallieu.fr/le-musee/',kind:'photo',real:true,contextAlias:'bj-musee-textile'},
 'lo42-sc-tresses':{image:'https://saint-chamond.fr/wp-content/uploads/2022/11/50877517251_6ceeb2aab8_c-1200x650.jpg',source:'Ville de Saint-Chamond — patrimoine industriel local',sourceUrl:'https://saint-chamond.fr/decouvrir-saint-chamond/patrimoine-et-tourisme/les-hotels-richard-chambovet-ennemond-richard-et-patissier/',kind:'photo',real:true},
 'rh-dense-amplepuis-thimonnier':{image:'https://cdn-s-www.leprogres.fr/images/F1545449-5A07-4CF2-8EA4-235649080577/NW_detail/barthelemy-thimmonier-est-le-personnage-star-de-la-ville-d-amplepuis-il-a-donne-son-nom-au-musee-de-la-machine-a-coudre-photo-progres-coline-michel-les-nouvelles-acquisitions-du-musee-sont-selectionnees-selon-des-criteres-specifiques-photo-progres-coline-michel-le-musee-possede-quelques-pieces-rares-comme-cette-miniature-de-machine-a-coudre-faite-en-argent-destinee-a-une-jeune-fille-le-progres-coline-michel-une-partie-des-machines-a-coudre-domestiques-et-industrielles-sont-exposees-dans-une-ancienne-eglise-desacralisee-le-progres-coline-michel-1628107054.jpg',source:'Le Progrès — Musée Barthélemy Thimonnier, Amplepuis',sourceUrl:'https://musees.ouestrhodanien.fr/musee-barthelemy-thimonnier.html',kind:'photo',real:true},
 'cantal-dense-lioran':{image:commons("Le Lioran depuis la piste de l'Aiguillon.png"),source:"Wikimedia Commons — Le Lioran depuis la piste de l’Aiguillon",sourceUrl:"https://commons.wikimedia.org/wiki/File:Le_Lioran_depuis_la_piste_de_l%27Aiguillon.png",kind:'photo',real:true},
 'pdd63-ambert-richard-de-bas':{image:commons('Moulin Richard de Bas 2016-08-08 n02.jpg'),source:'Wikimedia Commons — Moulin Richard de Bas, Ambert',sourceUrl:'https://commons.wikimedia.org/wiki/File:Moulin_Richard_de_Bas_2016-08-08_n02.jpg',kind:'photo',real:true},
 'sav-courch-excellence':{image:commons('Courchevel 1850 ski resort.jpg'),source:'Wikimedia Commons — Courchevel 1850, station de ski',sourceUrl:'https://commons.wikimedia.org/wiki/File:Courchevel_1850_ski_resort.jpg',kind:'photo',real:true},

 /* Isère — canoniques documentaires vérifiés. */
 'is-media-grenoble':{image:commons('Grenoble -panorama.jpg'),source:'Wikimedia Commons — panorama de Grenoble',sourceUrl:'https://commons.wikimedia.org/wiki/File:Grenoble_-panorama.jpg',kind:'photo',real:true},
 'is-media-grenoble-musee':{image:commons('Museum of Grenoble - Musée de Grenoble.jpg'),source:'Wikimedia Commons — Musée de Grenoble',sourceUrl:'https://commons.wikimedia.org/wiki/File:Museum_of_Grenoble_-_Mus%C3%A9e_de_Grenoble.jpg',kind:'photo',real:true},
 'is-media-grenoble-bastille':{image:commons('Bastille (Grenoble).JPG'),source:'Wikimedia Commons — Bastille de Grenoble',sourceUrl:'https://commons.wikimedia.org/wiki/File:Bastille_(Grenoble).JPG',kind:'photo',real:true},
 'is-media-vienne':{image:commons('Vienne, théâtre antique.jpg'),source:'Wikimedia Commons — Théâtre antique de Vienne',sourceUrl:'https://commons.wikimedia.org/wiki/File:Vienne,_th%C3%A9%C3%A2tre_antique.jpg',kind:'photo',real:true},
 'is-media-bourgoin':{image:commons('Centre-ville de Bourgoin-Jallieu.jpg'),source:'Wikimedia Commons — centre-ville de Bourgoin-Jallieu',sourceUrl:'https://commons.wikimedia.org/wiki/File:Centre-ville_de_Bourgoin-Jallieu.jpg',kind:'photo',real:true},
 'is-media-bourgoin-gare':{image:commons('Gare de Bourgoin-Jallieu (38).JPG'),source:'Wikimedia Commons — gare de Bourgoin-Jallieu',sourceUrl:'https://commons.wikimedia.org/wiki/File:Gare_de_Bourgoin-Jallieu_(38).JPG',kind:'photo',real:true},
 'is-media-voiron':{image:commons('Voiron Saint-Bruno.JPG'),source:'Wikimedia Commons — Voiron, Saint-Bruno',sourceUrl:'https://commons.wikimedia.org/wiki/File:Voiron_Saint-Bruno.JPG',kind:'photo',real:true},
 'is-media-vizille':{image:commons('Chateau vizille.jpg'),source:'Wikimedia Commons — Château de Vizille',sourceUrl:'https://commons.wikimedia.org/wiki/File:Chateau_vizille.jpg',kind:'photo',real:true},
 'is-media-vercors':{image:commons('Villard-de-Lans et le Vercors.jpg'),source:'Wikimedia Commons — Villard-de-Lans et le Vercors',sourceUrl:'https://commons.wikimedia.org/wiki/File:Villard-de-Lans_et_le_Vercors.jpg',kind:'photo',real:true},
 'is-media-cremieu':{image:commons('Halles de Crémieu.jpg'),source:'Wikimedia Commons — Halles de Crémieu',sourceUrl:'https://commons.wikimedia.org/wiki/File:Halles_de_Cr%C3%A9mieu.jpg',kind:'photo',real:true},
 'is-media-stmarcellin':{image:commons('Saint-Marcellin, Isère.jpg'),source:'Wikimedia Commons — Saint-Marcellin, Isère',sourceUrl:'https://commons.wikimedia.org/wiki/File:Saint-Marcellin,_Is%C3%A8re.jpg',kind:'photo',real:true},
 'is-media-chartreuse':{image:commons('Massif de la Chartreuse (8419420077).jpg'),source:'Wikimedia Commons — massif de la Chartreuse',sourceUrl:'https://commons.wikimedia.org/wiki/File:Massif_de_la_Chartreuse_(8419420077).jpg',kind:'photo',real:true},
 'is-media-belledonne':{image:commons('Panoramique Lac BLanc Belledonne.jpg'),source:'Wikimedia Commons — chaîne de Belledonne',sourceUrl:'https://commons.wikimedia.org/wiki/File:Panoramique_Lac_BLanc_Belledonne.jpg',kind:'photo',real:true},
 'is-media-royans':{image:commons('Pont-en-Royans - Maisons suspendues (août 2021).jpg'),source:'Wikimedia Commons — maisons suspendues de Pont-en-Royans',sourceUrl:'https://commons.wikimedia.org/wiki/File:Pont-en-Royans_-_Maisons_suspendues_(ao%C3%BBt_2021).jpg',kind:'photo',real:true},

 /* Drôme — canoniques documentaires. */
 'dr-media-romans-centre':{image:commons('Romans-TourJacquemart.jpg'),source:'Wikimedia Commons — Tour Jacquemart, Romans-sur-Isère',sourceUrl:'https://commons.wikimedia.org/wiki/File:Romans-TourJacquemart.jpg',kind:'photo',real:true},
 'dr-media-romans-musee':{image:commons('Romans-MuséeInternationalChaussure.jpg'),source:'Wikimedia Commons — Musée international de la Chaussure, Romans-sur-Isère',sourceUrl:'https://commons.wikimedia.org/wiki/File:Romans-Mus%C3%A9eInternationalChaussure.jpg',kind:'photo',real:true},
 'dr-media-romans-xxl':{image:'https://media.valence-romans-tourisme.com/filer_public/20/0d/200d0a8a-2be1-4ed4-aad6-b36369819e0a/chaussure_geante1.jpg',source:'Valence Romans Tourisme — chaussure géante du parcours XXL',sourceUrl:'https://www.valence-romans-tourisme.com/fr/sinspirer/patrimoines-savoir-faire/',kind:'photo',real:true},
 'dr-media-valence-musee':{image:'https://museedupatrimoine.fr/patrimoine/34959/photo-musee-d-art-et-d-archeologie-de-valence--1.jpg',source:'Musée du Patrimoine de France — Musée d’art et d’archéologie de Valence',sourceUrl:'https://museedupatrimoine.fr/musee-d-art-et-d-archeologie-de-valence-drome/34959.html',kind:'photo',real:true},
 'dr-media-valence-creation':{image:'https://cdn-s-www.ledauphine.com/images/78903C12-66B3-48FC-9AC5-4BA96F5D2226/NW_raw/carole-gruet-au-milieu-de-ses-creations-colorees-photo-le-dl-a-h-1602695158.jpg',source:'Le Dauphiné Libéré — création locale à Valence',sourceUrl:'https://www.ledauphine.com/economie/2020/10/14/valence-les-pompons-d-alice-une-nouvelle-boutique-de-createurs',kind:'photo',real:true},
 'dr-media-crest':{image:'https://www.voyageurs-du-temps.fr/images/sites/a-crest/visuel2-prison-tour-de-crest-sc%C3%A9nographie-utinam.jpg',source:'Voyageurs du Temps — Tour de Crest',sourceUrl:'https://www.voyageurs-du-temps.fr/LA-TOUR-DE-CREST-Prison-d-etat_1383.html',kind:'photo',real:true},
 'dr-media-die':{image:'https://lecaillouauxhiboux.fr/uploads/articles/riviere-drome/ville-de-die-drome.jpg',source:'Le Caillou aux Hiboux — ville de Die et marché du Diois',sourceUrl:'https://lecaillouauxhiboux.fr/article/la-drome-au-fil-des-saisons',kind:'photo',real:true},
 'dr-media-nyons':{image:'https://nyons-info.fr/img/ruelle-nyons-centre.jpg',source:'Nyons-Info — Vieux Nyons',sourceUrl:'https://nyons-info.fr/vieux-nyons/',kind:'photo',real:true},
 'dr-media-montelimar':{image:'https://cdn-s-www.ledauphine.com/images/05E6279B-5C3C-4D29-B076-D103B89F5F70/NW_raw/l-association-des-commercants-du-centre-ville-a-ete-creee-il-y-a-un-an-avec-pour-objectif-de-redynamiser-les-rues-du-centre-photo-le-dl-floremie-blanc-1757956423.jpg',source:'Le Dauphiné Libéré — centre-ville de Montélimar',sourceUrl:'https://www.ledauphine.com/economie/2025/09/15/il-y-a-eu-des-fermetures-mais-des-ouvertures-ont-suivi-un-bilan-positif-pour-les-commercants-du-centre-ville',kind:'photo',real:true},
 'dr-media-grignan':{image:commons('Château de Grignan.jpg'),source:'Wikimedia Commons — Château de Grignan',sourceUrl:'https://commons.wikimedia.org/wiki/File:Ch%C3%A2teau_de_Grignan.jpg',kind:'photo',real:true},
 'dr-media-dieulefit':{image:'https://assets.justacote.com/photos_entreprises/dieulefit-dieulefit-146748521236.jpg',source:'Justacoté — centre historique de Dieulefit',sourceUrl:'https://www.justacote.com/dieulefit-26220/ville-et-quartier/dieulefit-958946.htm',kind:'photo',real:true},
 'dr-media-bourdeaux':{image:'https://www.dieulefit-tourisme.com/en/wp-content/uploads/sites/2/2018/06/photo-une.jpeg',source:'Dieulefit-Bourdeaux Tourisme — village de Bourdeaux',sourceUrl:'https://www.dieulefit-tourisme.com/en/our-destination/our-villages/bourdeaux/',kind:'photo',real:true},
 'dr-media-tain':{image:'https://app-vitusrejser-umbraco-prod-001.azurewebsites.net/media/ja0esrfr/frankrig-tain-hermitage-hoej.jpg?format=jpg&height=675&quality=80&width=1200',source:'Vitus Rejser — coteaux de Tain-l’Hermitage et Rhône',sourceUrl:'https://www.vitusrejser.dk/rejsemaal/frankrig-cotes-du-rhone-vin-og-kultur/',kind:'photo',real:true},
 'dr-media-vercors':{image:commons('La Chapelle en Vercors.jpg'),source:'Wikimedia Commons — La Chapelle-en-Vercors et hauts plateaux',sourceUrl:'https://commons.wikimedia.org/wiki/File:La_Chapelle_en_Vercors.jpg',kind:'photo',real:true},
 'ar-peyrebeille-auberge-rouge':{image:'https://static.apidae-tourisme.com/filestore/objets-touristiques/images/211/18/37360339.jpg',source:'Auvergne-Rhône-Alpes Tourisme / Apidae — Auberge de Peyrebeille',sourceUrl:'https://www.auvergnerhonealpes-tourisme.com/fiches/auberge-de-peyrebeille-auberge-rouge/',kind:'photo',real:true}
};
const aliases={
 /* Ain : même lieu exact ou contexte géographique explicite. */
 'ain-bourg-brou':'ain-brou','ain-bourg-centre':'bou-centre','ain-oyo-musee':'ain-oyonnax-musee','ain-oyo-vapeur':'ain-grande-vapeur','ain-juj-soieries':'ain-soieries','ain-perouges-cite':'ain-perouges','ain-perouges-photo':'ain-perouges','ain-gex-reseau':'ain-gex','ain-gex-savoirfaire':'ain-gex','ain-gex-jura':'ain-gex','ain-ferney-culture':'ain-ferney','ain-mijoux-lapidaire':'ain-mijoux','ain-mijoux-hiver':'ain-mijoux','ain-belley-bugey':'ain-belley','ain-dombes-etangs':'ain-dombes','ain-nantua-lac':'ain-nantua','ain-nantua-reseau':'ain-nantua',
 /* Isère : variantes de même lieu ou photo de contexte territorial explicitement assumée. */
 'is-vienne-scene':'is-media-vienne','vie-musee-textile':'is-media-vienne','vie-vallee-gere':'is-media-vienne','vie-theatre-antique':'is-media-vienne','vie-centre-antique':'is-media-vienne',
 'is-voiron-centre':'is-media-voiron','voi-centre':'is-media-voiron','voi-chartreuse':'is-media-chartreuse',
 'is-vizille':'is-media-vizille','viz-domaine':'is-media-vizille','viz-costume-histoire':'is-media-vizille',
 'is-vercors':'is-media-vercors','ver-centre':'is-media-vercors','ver-vercors':'is-media-vercors',
 'is-oisans':'is-media-belledonne','ois-centre':'is-media-belledonne','ois-relief':'is-media-belledonne',
 'is-tdp':'is-media-belledonne','tdp-halles':'is-media-belledonne','tdp-dauphins':'is-media-belledonne','tdp-equinoxe':'is-media-belledonne',
 'is-cremieu':'is-media-cremieu','cre-halles':'is-media-cremieu','cre-medieval':'is-media-cremieu','cre-isle':'is-media-cremieu',
 'is-stmarcellin':'is-media-stmarcellin','sm-centre':'is-media-stmarcellin','sm-marche':'is-media-stmarcellin','sm-sudgres':'is-media-stmarcellin',
 'is-chartreuse':'is-media-chartreuse','cha-village':'is-media-chartreuse','cha-transhumance':'is-media-chartreuse',
 'is-gresivaudan':'is-media-belledonne','gre-vallee':'is-media-belledonne','gre-heritage':'is-media-belledonne',
 'is-belledonne':'is-media-belledonne','bel-musee':'is-media-belledonne','bel-pinsot':'is-media-belledonne',
 'is-royans':'is-media-royans','roy-maisons':'is-media-royans','roy-eau':'is-media-royans',
 'is-bj-musee':'bj-musee-textile','bj-centre-observation':'is-media-bourgoin','bj-bourbre':'is-media-bourgoin','bj-gare':'is-media-bourgoin-gare',
 'gre-musee-grenoble':'is-media-grenoble-musee','gre-bastille':'is-media-grenoble-bastille','gre-eveche-sashiko':'is-media-grenoble','gre-argouges':'is-media-grenoble','gre-alpexpo':'is-media-grenoble','gre-championnet':'is-media-grenoble','gre-stbruno':'is-media-grenoble','gre-presquile':'is-media-grenoble',
 /* Drôme : variantes gameplay du même lieu / même contexte réel. */
 'dr-rom-centre':'dr-media-romans-centre','rom-musee-chaussure':'dr-media-romans-musee','rom-parcours-xxl':'dr-media-romans-xxl','dr-val-musee':'dr-media-valence-musee','val-musee':'dr-media-valence-musee','dr-val-createurs':'dr-media-valence-creation','val-client-ville':'dr-media-valence-creation','dr-crest':'dr-media-crest','crest-tour':'dr-media-crest','dr-die':'dr-media-die','die-diois':'dr-media-die','die-marche':'dr-media-die','dr-nyons':'dr-media-nyons','nyons-centre':'dr-media-nyons','dr-mon':'dr-media-montelimar','dr-mon-centre':'dr-media-montelimar','dr-gri':'dr-media-grignan','dr-gri-remparts':'dr-media-grignan','dr-dieul':'dr-media-dieulefit','dr-dieul-art':'dr-media-dieulefit','dr-bour':'dr-media-bourdeaux','dr-bour-village':'dr-media-bourdeaux','dr-tain':'dr-media-tain','dr-tain-rhone':'dr-media-tain','dr-ver26':'dr-media-vercors','dr-vercors-textile':'dr-media-vercors'
};
Object.entries(aliases).forEach(([id,sourceId])=>{
 const src=api.items[sourceId]||extra[sourceId];
 if(src)extra[id]={...src,contextAlias:sourceId,source:String(src.source||'')+(sourceId===id?'':' · repère documentaire partagé')};
});
Object.entries(extra).forEach(([id,m])=>{api.items[id]=m});
try{
 const saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};
 Object.entries(extra).forEach(([id,m])=>saved[id]={...(saved[id]||{}),...m,url:m.image,attribution:m.source});
 localStorage.setItem(STORAGE,JSON.stringify(saved));
}catch(_){ }
window.HCTerritorialPlaceMediaAURAFinal={version:3,items:extra,aliases};
window.dispatchEvent(new CustomEvent('hc-territorial-place-media-final-ready',{detail:{count:Object.keys(extra).length,aliases:Object.keys(aliases).length}}));
})();