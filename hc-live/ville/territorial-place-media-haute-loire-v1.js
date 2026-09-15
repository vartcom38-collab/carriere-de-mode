/* Haute Couture Live — médias documentaires Haute-Loire V1 */
(function(){
'use strict';
if(window.__HCTerritorialPlaceMediaHauteLoireV1)return;window.__HCTerritorialPlaceMediaHauteLoireV1=true;
const STORAGE='haute-couture-territorial-place-media-v1';
const api=window.HCTerritorialPlaceMediaAURA;if(!api?.items)return;
const commons=(file,w=1600)=>`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;
const C={
 puy:{image:commons('Cathédrale Le Puy-en-Velay.JPEG'),source:'Wikimedia Commons — cathédrale Notre-Dame, Le Puy-en-Velay',sourceUrl:'https://commons.wikimedia.org/wiki/File:Cath%C3%A9drale_Le_Puy-en-Velay.JPEG',kind:'photo',real:true},
 crozatier:{image:commons('Musee Crozatier facade jardin.jpg'),source:'Wikimedia Commons — façade jardin du Musée Crozatier, Le Puy-en-Velay',sourceUrl:'https://commons.wikimedia.org/wiki/Category:Mus%C3%A9e_Crozatier',kind:'photo',real:true},
 dentelle:{image:commons('La Dentelle Au Foyer.jpg'),source:'Wikimedia Commons — La Dentelle au Foyer, Le Puy-en-Velay',sourceUrl:'https://commons.wikimedia.org/wiki/File:La_Dentelle_Au_Foyer.jpg',kind:'photo',real:true},
 chavaniac:{image:commons('Château de Chavaniac Chavaniac-Lafayette.jpg'),source:'Wikimedia Commons — Château de Chavaniac-Lafayette, maison natale de Lafayette',sourceUrl:'https://commons.wikimedia.org/wiki/File:Ch%C3%A2teau_de_Chavaniac_Chavaniac-Lafayette.jpg',kind:'photo',real:true},
 brioude:{image:commons('Brioude, basilique St-Julien, haut abside.jpg'),source:'Wikimedia Commons — basilique Saint-Julien, Brioude',sourceUrl:'https://commons.wikimedia.org/wiki/File:Brioude,_basilique_St-Julien,_haut_abside.jpg',kind:'photo',real:true},
 retournac:{image:commons('Musée des dentelles à retournac.jpg'),source:'Wikimedia Commons — Musée des dentelles, Retournac',sourceUrl:'https://commons.wikimedia.org/wiki/Category:Retournac',kind:'photo',real:true},
 chaise:{image:commons('Abbatiale Saint Robert La Chaise Dieu Haute LoIre.jpg'),source:'Wikimedia Commons — abbatiale Saint-Robert, La Chaise-Dieu',sourceUrl:'https://commons.wikimedia.org/wiki/File:Abbatiale_Saint_Robert_La_Chaise_Dieu_Haute_LoIre.jpg',kind:'photo',real:true},
 blesle:{image:commons('Ancienne abbaye de Blesle (43) - 01.jpg'),source:'Wikimedia Commons — ancienne abbaye de Blesle',sourceUrl:'https://commons.wikimedia.org/wiki/Category:Blesle',kind:'photo',real:true},
 yssingeaux:{image:commons('Yssingeaux (50126166922).jpg'),source:'Wikimedia Commons — Yssingeaux, Haute-Loire',sourceUrl:'https://commons.wikimedia.org/wiki/File:Yssingeaux_(50126166922).jpg',kind:'photo',real:true},
 monistrol:{image:commons('Monistrol-sur-Loire Bourg médiéval1.JPG'),source:'Wikimedia Commons — vieille ville de Monistrol-sur-Loire',sourceUrl:'https://commons.wikimedia.org/wiki/File:Monistrol-sur-Loire_Bourg_m%C3%A9di%C3%A9val1.JPG',kind:'photo',real:true},
 langeac:{image:commons('Langeac Vil1a.jpg'),source:'Wikimedia Commons — Langeac, l’Allier et la collégiale Saint-Gal',sourceUrl:'https://commons.wikimedia.org/wiki/File:Langeac_Vil1a.jpg',kind:'photo',real:true}
};
const aliases={
 'hl-puy-dentelle':'dentelle','puy-dentelle':'dentelle','hl-puy':'dentelle','hl43-map-puy':'dentelle','hl43-puy-conservatoire':'dentelle','43-dentelle':'dentelle',
 'hl-puy-patrimoine':'puy','puy-centre':'puy','puy-cathedrale':'puy','puy-marche':'puy','hl43-puy-crozatier':'puy','43-crozatier':'crozatier',
 '43-lafayette-chateau':'chavaniac','fig-43-lafayette':'chavaniac',
 'hl-brioude-dentelle':'brioude','hl-brioude':'brioude','hl43-map-brioude':'brioude','tier2-brioude-0':'brioude','tier2-brioude-1':'brioude','tier2-brioude-2':'brioude','tier2-brioude-3':'brioude','hl43-brioude-craft':'brioude',
 'hl-retournac':'retournac','hl43-map-retournac':'retournac',
 'hl-chaise':'chaise','hl43-map-chaise':'chaise','hl43-chaise-scene':'chaise',
 'hl-blesle':'blesle','hl43-map-blesle':'blesle','hl43-blesle-memory':'blesle',
 'hl-yssingeaux':'yssingeaux','hl43-map-yssingeaux':'yssingeaux','hl43-yssingeaux-daily':'yssingeaux',
 'hl-monistrol':'monistrol','hl43-map-monistrol':'monistrol','hl43-monistrol-network':'monistrol',
 'hl43-map-langeac':'langeac','hl43-langeac-rural':'langeac'
};
const extra={};
for(const [id,key] of Object.entries(aliases))extra[id]={...C[key],contextAlias:key,source:C[key].source+' · repère documentaire partagé'};
for(const [id,m] of Object.entries(extra))api.items[id]=m;
try{const saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};for(const [id,m] of Object.entries(extra))saved[id]={...(saved[id]||{}),...m,url:m.image,attribution:m.source};localStorage.setItem(STORAGE,JSON.stringify(saved))}catch(_){ }
window.HCTerritorialPlaceMediaHauteLoire={version:1,items:extra,aliases};
})();