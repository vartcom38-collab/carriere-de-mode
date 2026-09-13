/* Haute Couture Live — couverture média documentaire Allier 03 */
(function(){
'use strict';
if(window.__HCTerritorialPlaceMediaAllierV1)return;window.__HCTerritorialPlaceMediaAllierV1=true;
const api=window.HCTerritorialPlaceMediaAURA;if(!api?.items)return;
const STORAGE='haute-couture-territorial-place-media-v1';
const commons=(file,w=1600)=>`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;
const src=file=>`Wikimedia Commons — ${file}`;
const canonical={
 moulins:{image:commons('Allier-moulins.jpg'),source:src('Allier-moulins.jpg'),sourceUrl:'https://commons.wikimedia.org/wiki/File:Allier-moulins.jpg',kind:'photo',real:true},
 vichy:{image:commons('Vichy - Le Hall des Sources 01.JPG'),source:src('Vichy - Le Hall des Sources 01.JPG'),sourceUrl:'https://commons.wikimedia.org/wiki/File:Vichy_-_Le_Hall_des_Sources_01.JPG',kind:'photo',real:true},
 montlucon:{image:commons('Montlucon-NotreDame.jpg'),source:src('Montlucon-NotreDame.jpg'),sourceUrl:'https://commons.wikimedia.org/wiki/File:Montlucon-NotreDame.jpg',kind:'photo',real:true},
 bourbon:{image:commons("Château de Bourbon l'Archambault.JPG"),source:src("Château de Bourbon l'Archambault.JPG"),sourceUrl:'https://commons.wikimedia.org/wiki/File:Ch%C3%A2teau_de_Bourbon_l%27Archambault.JPG',kind:'photo',real:true},
 neris:{image:commons('NerisLesBains1.jpg'),source:src('NerisLesBains1.jpg'),sourceUrl:'https://commons.wikimedia.org/wiki/File:NerisLesBains1.jpg',kind:'photo',real:true},
 charroux:{image:commons('Charroux4.jpg'),source:src('Charroux4.jpg'),sourceUrl:'https://commons.wikimedia.org/wiki/File:Charroux4.jpg',kind:'photo',real:true},
 souvigny:{image:commons('Souvigny (www.xtof.photo).jpg'),source:src('Souvigny (www.xtof.photo).jpg'),sourceUrl:'https://commons.wikimedia.org/wiki/Category:Souvigny_(Allier)',kind:'photo',real:true},
 lapalisse:{image:commons('Château Lapalisse.jpg'),source:src('Château Lapalisse.jpg'),sourceUrl:'https://commons.wikimedia.org/wiki/File:Ch%C3%A2teau_Lapalisse.jpg',kind:'photo',real:true},
 stpourcain:{image:commons('Saint-Pourçain-sur-Sioule.jpg'),source:src('Saint-Pourçain-sur-Sioule.jpg'),sourceUrl:'https://commons.wikimedia.org/wiki/File:Saint-Pour%C3%A7ain-sur-Sioule.jpg',kind:'photo',real:true},
 commentry:{image:commons('Commentry - bois du Parc de la Mine.jpg'),source:src('Commentry - bois du Parc de la Mine.jpg'),sourceUrl:'https://commons.wikimedia.org/wiki/Category:Nature_of_Commentry',kind:'photo',real:true},
 herisson:{image:commons('Hérisson (Allier), Château.jpg'),source:src('Hérisson (Allier), Château.jpg'),sourceUrl:'https://commons.wikimedia.org/wiki/File:H%C3%A9risson_(Allier),_Ch%C3%A2teau.jpg',kind:'photo',real:true}
};
const aliases={
 'mou-centre':'moulins','mou-cncs':'moulins','mou-mmad':'moulins','mou-theatre':'moulins',
 'allier-moulins-costume':'moulins','allier-moulins-archives':'moulins','allier-moulins-metiers-art':'moulins','allier-moulins':'moulins',
 'vic-thermal':'vichy','vic-opera':'vichy','vic-sources':'vichy','vic-parcs':'vichy',
 'allier-vichy-thermal':'vichy','allier-vichy-opera':'vichy','allier-vichy':'vichy','allier-dense-vichy-thermal':'vichy',
 'allier-montlucon':'montlucon','allier-montlucon-secondhand':'montlucon','allier-dense-montlucon-indus':'montlucon',
 'tier2-montlu-on-0':'montlucon','tier2-montlu-on-1':'montlucon','tier2-montlu-on-2':'montlucon','tier2-montlu-on-3':'montlucon','tier2-montlu-on-4':'montlucon',
 'allier-bourbon':'bourbon','allier-dense-bourbon-thermal':'bourbon',
 'allier-neris':'neris',
 'allier-charroux':'charroux',
 'allier-souvigny':'souvigny',
 'allier-lapalisse':'lapalisse','allier-dense-lapalisse':'lapalisse','allier-map-lapalisse':'lapalisse',
 'allier-dense-stpourcain':'stpourcain','allier-map-stpourcain':'stpourcain',
 'allier-dense-commentry':'commentry','allier-map-commentry':'commentry',
 'allier-dense-herisson':'herisson','allier-map-herisson':'herisson'
};
const add={};for(const [id,key] of Object.entries(aliases)){const m=canonical[key];add[id]={...m,url:m.image,attribution:m.source,contextAlias:key};}
Object.assign(api.items,add);
try{const saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};Object.assign(saved,add);localStorage.setItem(STORAGE,JSON.stringify(saved));}catch(_){}
})();
