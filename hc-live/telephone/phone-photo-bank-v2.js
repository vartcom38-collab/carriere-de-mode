/* Haute Couture Live — banque photo sociale V2.
   Extension raster curatée à partir de sources gratuites (Pexels/Unsplash).
   Pinterest sert de référence d'ambiance, pas de source redistribuée. */
(function(){
'use strict';
const more=[
{id:'pex-9850412',cat:'fabric',tags:['atelier','moodboard','fabric','textile','swatches'],url:'https://images.pexels.com/photos/9850412/pexels-photo-9850412.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Ron Lach · Pexels'},
{id:'pex-8030144',cat:'fabric',tags:['fabric','swatches','tablet','moodboard','textile'],url:'https://images.pexels.com/photos/8030144/pexels-photo-8030144.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Los Muertos Crew · Pexels'},
{id:'pex-7147454',cat:'atelier',tags:['atelier','workspace','sketch','mannequin','sewing'],url:'https://images.pexels.com/photos/7147454/pexels-photo-7147454.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Michael Burrows · Pexels'},
{id:'pex-3965543',cat:'fabric',tags:['fabric','rolls','studio','atelier','textile'],url:'https://images.pexels.com/photos/3965543/pexels-photo-3965543.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Ksenia Chernaya · Pexels'},
{id:'pex-7998233',cat:'studio',tags:['studio','cutting','team','atelier','fabric'],url:'https://images.pexels.com/photos/7998233/pexels-photo-7998233.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Los Muertos Crew · Pexels'},
{id:'pex-36731235',cat:'studio',tags:['studio','mannequin','sewing','atelier'],url:'https://images.pexels.com/photos/36731235/pexels-photo-36731235.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Vitaly Gariev · Pexels'},
{id:'pex-36731281',cat:'studio',tags:['studio','designer','sewing','atelier'],url:'https://images.pexels.com/photos/36731281/pexels-photo-36731281.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Vitaly Gariev · Pexels'},
{id:'pex-36731581',cat:'lifestyle',tags:['phone','studio','designer','workday'],url:'https://images.pexels.com/photos/36731581/pexels-photo-36731581.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Vitaly Gariev · Pexels'},
{id:'pex-9849661',cat:'atelier',tags:['moodboard','studio','fabric','atelier'],url:'https://images.pexels.com/photos/9849661/pexels-photo-9849661.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Ron Lach · Pexels'},
{id:'pex-8769331',cat:'atelier',tags:['sewing','designer','atelier'],url:'https://images.pexels.com/photos/8769331/pexels-photo-8769331.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Gustavo Fring · Pexels'},
{id:'pex-9850072',cat:'atelier',tags:['sewing','team','atelier','designer'],url:'https://images.pexels.com/photos/9850072/pexels-photo-9850072.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Ron Lach · Pexels'},
{id:'pex-9850066',cat:'atelier',tags:['sewing','red fabric','atelier'],url:'https://images.pexels.com/photos/9850066/pexels-photo-9850066.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Ron Lach · Pexels'},
{id:'pex-18528255',cat:'street',tags:['paris','street','fashion','look','city'],location:'Paris',url:'https://images.pexels.com/photos/18528255/pexels-photo-18528255.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'David Kouakou · Pexels'},
{id:'pex-30214719',cat:'street',tags:['paris','street','fashion','brasserie','city'],location:'Paris',url:'https://images.pexels.com/photos/30214719/pexels-photo-30214719.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'David Kouakou · Pexels'},
{id:'pex-28751291',cat:'street',tags:['paris','streetwear','street','fashion'],location:'Paris',url:'https://images.pexels.com/photos/28751291/pexels-photo-28751291.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Toni Malfilatre · Pexels'},
{id:'pex-29401208',cat:'street',tags:['paris','street','fashion','editorial'],location:'Paris',url:'https://images.pexels.com/photos/29401208/pexels-photo-29401208.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Sofi Polishchuk · Pexels'},
{id:'pex-30712927',cat:'lifestyle',tags:['paris','notre-dame','travel','fashion'],location:'Paris',url:'https://images.pexels.com/photos/30712927/pexels-photo-30712927.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Rachel Brooks · Pexels'},
{id:'pex-34636933',cat:'street',tags:['paris','palais royal','fashion','travel'],location:'Paris',url:'https://images.pexels.com/photos/34636933/pexels-photo-34636933.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Rachel Brooks · Pexels'},
{id:'pex-37551995',cat:'lifestyle',tags:['paris','cafe','montmartre','travel'],location:'Paris',url:'https://images.pexels.com/photos/37551995/pexels-photo-37551995.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Karography · Pexels'},
{id:'pex-14544491',cat:'travel',tags:['arena','roman','amphitheatre','architecture','france','travel'],location:'Arles',url:'https://images.pexels.com/photos/14544491/pexels-photo-14544491.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Malcolm Hill · Pexels'},
{id:'pex-13518949',cat:'travel',tags:['arena','roman','amphitheatre','architecture','lyon','france'],location:'Lyon',url:'https://images.pexels.com/photos/13518949/pexels-photo-13518949.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Bingqian Li · Pexels'},
{id:'pex-30761870',cat:'street',tags:['street','urban','fashion','look'],url:'https://images.pexels.com/photos/30761870/pexels-photo-30761870.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:"César O'neill · Pexels"},
{id:'pex-35276451',cat:'street',tags:['street','fashion','look','city'],url:'https://images.pexels.com/photos/35276451/pexels-photo-35276451.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Guillermo Berlin · Pexels'},
{id:'pex-30729041',cat:'street',tags:['street','fashion','portrait','urban'],url:'https://images.pexels.com/photos/30729041/pexels-photo-30729041.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Dominique Barrera · Pexels'},
{id:'pex-31107313',cat:'street',tags:['street','fashion','portrait','urban'],url:'https://images.pexels.com/photos/31107313/pexels-photo-31107313.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Felix Young · Pexels'},
{id:'pex-39009865',cat:'street',tags:['street','fashion','portrait','urban'],url:'https://images.pexels.com/photos/39009865/pexels-photo-39009865.jpeg?auto=compress&cs=tinysrgb&w=1200',credit:'Murat IŞIK · Pexels'}
];
function merge(){
 const b=window.HCPhotoBank=window.HCPhotoBank||{version:2,source:'curated-free',images:[]};
 const seen=new Set((b.images||[]).map(x=>x.id));
 for(const p of more)if(!seen.has(p.id))b.images.push(p);
 b.version=2;b.count=b.images.length;b.categories=[...new Set(b.images.map(x=>x.cat))];
 window.dispatchEvent(new CustomEvent('hc-photo-bank-updated',{detail:{count:b.images.length}}));
}
merge();
})();