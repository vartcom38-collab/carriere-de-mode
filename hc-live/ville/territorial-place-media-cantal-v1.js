/* Haute Couture Live — médias documentaires Cantal V1 */
(function(){
'use strict';
if(window.__HCTerritorialPlaceMediaCantalV1)return;window.__HCTerritorialPlaceMediaCantalV1=true;
const STORAGE='haute-couture-territorial-place-media-v1';
const api=window.HCTerritorialPlaceMediaAURA;if(!api?.items)return;
const commons=(file,w=1600)=>`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;
const C={
 aurillac:{image:commons('Aurillac - Hôtel de ville -1.jpg'),source:'Wikimedia Commons — Aurillac, Hôtel de ville',sourceUrl:'https://commons.wikimedia.org/wiki/File:Aurillac_-_H%C3%B4tel_de_ville_-1.jpg',kind:'photo',real:true},
 salers:{image:commons('Salers-Porte Martille.jpg'),source:'Wikimedia Commons — Salers, porte Martille',sourceUrl:'https://commons.wikimedia.org/wiki/File:Salers-Porte_Martille.jpg',kind:'photo',real:true},
 saintflour:{image:commons('Vue de la ville haute de Saint-Flour.jpg'),source:'Wikimedia Commons — vue de la ville haute de Saint-Flour',sourceUrl:'https://commons.wikimedia.org/wiki/Category:Saint-Flour_(Cantal)',kind:'photo',real:true},
 chaudes:{image:commons('Chaudes aigues source.jpg'),source:'Wikimedia Commons — source thermale de Chaudes-Aigues',sourceUrl:'https://commons.wikimedia.org/wiki/File:Chaudes_aigues_source.jpg',kind:'photo',real:true},
 lioran:{image:commons("Le Lioran depuis la piste de l'Aiguillon.png"),source:'Wikimedia Commons — Le Lioran depuis la piste de l’Aiguillon',sourceUrl:"https://commons.wikimedia.org/wiki/File:Le_Lioran_depuis_la_piste_de_l%27Aiguillon.png",kind:'photo',real:true},
 murat:{image:commons('Murat (Cantal).jpg'),source:'Wikimedia Commons — ville de Murat',sourceUrl:'https://commons.wikimedia.org/wiki/File:Murat_(Cantal).jpg',kind:'photo',real:true}
};
const aliases={
 'cantal-aurillac-centre':'aurillac','cantal-aurillac-parapluie':'aurillac','aur-centre':'aurillac','aur-parapluie':'aurillac','aur-theatre':'aurillac','cantal-aurillac':'aurillac',
 'cantal-salers':'salers','cantal-map-salers':'salers','tier2-salers-0':'salers','tier2-salers-1':'salers','tier2-salers-2':'salers','tier2-salers-3':'salers','tier2-salers-4':'salers','tier2-salers-5':'salers','tier2-salers-6':'salers','tier2-salers-7':'salers','tier2-salers-8':'salers',
 'cantal-stflour':'saintflour','cantal-map-stflour':'saintflour','tier2-saint-flour-0':'saintflour','tier2-saint-flour-1':'saintflour','tier2-saint-flour-2':'saintflour','tier2-saint-flour-3':'saintflour','tier2-saint-flour-4':'saintflour','tier2-saint-flour-5':'saintflour','tier2-saint-flour-6':'saintflour','tier2-saint-flour-7':'saintflour','tier2-saint-flour-8':'saintflour',
 'cantal-chaudes':'chaudes','cantal-map-chaudes':'chaudes','cantal-dense-chaudes':'chaudes',
 'cantal-lioran':'lioran','cantal-map-lioran':'lioran','cantal-dense-lioran':'lioran',
 'cantal-murat':'murat','cantal-map-murat':'murat','cantal-dense-murat':'murat'
};
const extra={};
for(const [id,key] of Object.entries(aliases))extra[id]={...C[key],contextAlias:key,source:C[key].source+' · repère documentaire partagé'};
for(const [id,m] of Object.entries(extra))api.items[id]=m;
try{const saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};for(const [id,m] of Object.entries(extra))saved[id]={...(saved[id]||{}),...m,url:m.image,attribution:m.source};localStorage.setItem(STORAGE,JSON.stringify(saved))}catch(_){ }
window.HCTerritorialPlaceMediaCantal={version:1,items:extra,aliases};
})();
