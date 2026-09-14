/* Haute Couture Live — couverture média documentaire Savoie 73 */
(function(){
'use strict';
if(window.__HCTerritorialPlaceMediaSavoieV1)return;window.__HCTerritorialPlaceMediaSavoieV1=true;
const api=window.HCTerritorialPlaceMediaAURA;if(!api?.items)return;
const STORAGE='haute-couture-territorial-place-media-v1';
const commons=(file,w=1600)=>`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;
const src=file=>`Wikimedia Commons — ${file}`;
const canonical={
 chambery:{image:commons('Chambéry - Belledonnes (Savoie).JPG'),source:src('Chambéry - Belledonnes (Savoie).JPG'),sourceUrl:'https://commons.wikimedia.org/wiki/File:Chamb%C3%A9ry_-_Belledonnes_(Savoie).JPG',kind:'photo',real:true},
 aix:{image:commons('Vue de Aix-les-Bains et du lac du Bourget.jpg'),source:src('Vue de Aix-les-Bains et du lac du Bourget.jpg'),sourceUrl:'https://commons.wikimedia.org/wiki/File:Vue_de_Aix-les-Bains_et_du_lac_du_Bourget.jpg',kind:'photo',real:true},
 albertville:{image:commons('Albertville @ Conflans 01.jpg'),source:src('Albertville @ Conflans 01.jpg'),sourceUrl:'https://commons.wikimedia.org/wiki/File:Albertville_@_Conflans_01.jpg',kind:'photo',real:true},
 beaufort:{image:commons('Beaufort Savoie.jpg'),source:src('Beaufort Savoie.jpg'),sourceUrl:'https://commons.wikimedia.org/wiki/File:Beaufort_Savoie.jpg',kind:'photo',real:true},
 bourg:{image:commons('Bourg-Saint-Maurice, Savoie, France.jpg'),source:src('Bourg-Saint-Maurice, Savoie, France.jpg'),sourceUrl:'https://commons.wikimedia.org/wiki/File:Bourg-Saint-Maurice,_Savoie,_France.jpg',kind:'photo',real:true},
 modane:{image:commons("Les gorges de l'Arc depuis Pont du Diable côté Modane (août 2026).JPG"),source:src("Les gorges de l'Arc depuis Pont du Diable côté Modane (août 2026).JPG"),sourceUrl:'https://commons.wikimedia.org/wiki/File:Les_gorges_de_l%27Arc_depuis_Pont_du_Diable_c%C3%B4t%C3%A9_Modane_(ao%C3%BBt_2026).JPG',kind:'photo',real:true},
 courchevel:{image:commons('Courchevel.jpg'),source:src('Courchevel.jpg'),sourceUrl:'https://commons.wikimedia.org/wiki/File:Courchevel.jpg',kind:'photo',real:true},
 meribel:{image:commons('Métibel-Mottaret vu de Méribel-Centre (décembre 2019).JPG'),source:src('Métibel-Mottaret vu de Méribel-Centre (décembre 2019).JPG'),sourceUrl:'https://commons.wikimedia.org/wiki/File:M%C3%A9tibel-Mottaret_vu_de_M%C3%A9ribel-Centre_(d%C3%A9cembre_2019).JPG',kind:'photo',real:true},
 valthorens:{image:commons('Val Thorens.jpg'),source:src('Val Thorens.jpg'),sourceUrl:'https://commons.wikimedia.org/wiki/File:Val_Thorens.jpg',kind:'photo',real:true},
 tignes:{image:commons('Tignes-Les Brévières en Tarentaise depuis le barrage (février 2026).JPG'),source:src('Tignes-Les Brévières en Tarentaise depuis le barrage (février 2026).JPG'),sourceUrl:'https://commons.wikimedia.org/wiki/File:Tignes-Les_Br%C3%A9vi%C3%A8res_en_Tarentaise_depuis_le_barrage_(f%C3%A9vrier_2026).JPG',kind:'photo',real:true},
 valdisere:{image:commons("Val d'Isère.jpg"),source:src("Val d'Isère.jpg"),sourceUrl:'https://commons.wikimedia.org/wiki/File:Val_d%27Is%C3%A8re.jpg',kind:'photo',real:true},
 laplagne:{image:commons('La Plagne savoie ete.JPG'),source:src('La Plagne savoie ete.JPG'),sourceUrl:'https://commons.wikimedia.org/wiki/File:La_Plagne_savoie_ete.JPG',kind:'photo',real:true},
 arcs:{image:commons('LesArcs.JPG'),source:src('LesArcs.JPG'),sourceUrl:'https://commons.wikimedia.org/wiki/File:LesArcs.JPG',kind:'photo',real:true},
 seez:{image:commons('Séez (Savoie).JPG'),source:src('Séez (Savoie).JPG'),sourceUrl:'https://commons.wikimedia.org/wiki/File:S%C3%A9ez_(Savoie).JPG',kind:'photo',real:true},
 sjm:{image:commons('Vue de Saint-Jean-de-Maurienne.jpg'),source:src('Vue de Saint-Jean-de-Maurienne.jpg'),sourceUrl:'https://commons.wikimedia.org/wiki/File:Vue_de_Saint-Jean-de-Maurienne.jpg',kind:'photo',real:true}
};
const aliases={
 'sa-chambery':'chambery','cha-centre':'chambery',
 'sa-aix':'aix','aix-palaces':'aix',
 'sa-albertville':'albertville','alb-conflans':'albertville','alb-olympique':'albertville',
 'sa-beaufort':'beaufort','beau-laine':'beaufort',
 'sa-tarentaise':'bourg','bsm-tarentaise':'bourg',
 'sa-maurienne':'modane','mod-vallee':'modane',
 'sav-map-courchevel':'courchevel','sav-courch-excellence':'courchevel',
 'sav-map-meribel':'meribel','sav-meribel-archi':'meribel',
 'sav-map-valthorens':'valthorens','sav-vt-altitude':'valthorens',
 'sav-map-tignes':'tignes','sav-tignes-rider':'tignes',
 'sav-map-valdisere':'valdisere','sav-valdisere-village':'valdisere',
 'sav-map-laplagne':'laplagne','sav-laplagne-archi':'laplagne',
 'sav-map-arcs':'arcs','sav-arcs-archi':'arcs',
 'sav-map-seez':'seez','sav-map-sjm':'sjm','sav-sjm-costumes':'sjm'
};
const add={};for(const [id,key] of Object.entries(aliases)){const m=canonical[key];add[id]={...m,url:m.image,attribution:m.source,contextAlias:key};}
Object.assign(api.items,add);
try{const saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};Object.assign(saved,add);localStorage.setItem(STORAGE,JSON.stringify(saved));}catch(_){}
})();
