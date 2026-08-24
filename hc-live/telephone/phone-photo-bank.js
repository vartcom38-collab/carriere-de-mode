/* Haute Couture Live — banque photo sociale raster.
   Sources gratuites Pexels. Aucun appel IA, aucun crédit de génération. */
(function(){
'use strict';
const photos=[
 {id:'atelier-sewing-9850072',cat:'atelier',url:'https://images.pexels.com/photos/9850072/pexels-photo-9850072.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Ron Lach · Pexels'},
 {id:'atelier-sewing-8769327',cat:'atelier',url:'https://images.pexels.com/photos/8769327/pexels-photo-8769327.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Gustavo Fring · Pexels'},
 {id:'atelier-sewing-8769331',cat:'atelier',url:'https://images.pexels.com/photos/8769331/pexels-photo-8769331.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Gustavo Fring · Pexels'},
 {id:'atelier-sewing-9850065',cat:'atelier',url:'https://images.pexels.com/photos/9850065/pexels-photo-9850065.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Ron Lach · Pexels'},
 {id:'atelier-sewing-9850066',cat:'atelier',url:'https://images.pexels.com/photos/9850066/pexels-photo-9850066.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Ron Lach · Pexels'},
 {id:'atelier-team-9850070',cat:'atelier',url:'https://images.pexels.com/photos/9850070/pexels-photo-9850070.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Ron Lach · Pexels'},
 {id:'atelier-studio-36731281',cat:'studio',url:'https://images.pexels.com/photos/36731281/pexels-photo-36731281.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Vitaly Gariev · Pexels'},
 {id:'atelier-studio-36731238',cat:'studio',url:'https://images.pexels.com/photos/36731238/pexels-photo-36731238.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Vitaly Gariev · Pexels'},
 {id:'atelier-studio-36731235',cat:'studio',url:'https://images.pexels.com/photos/36731235/pexels-photo-36731235.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Vitaly Gariev · Pexels'},
 {id:'atelier-studio-36731337',cat:'studio',url:'https://images.pexels.com/photos/36731337/pexels-photo-36731337.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Vitaly Gariev · Pexels'},
 {id:'atelier-phone-36731580',cat:'lifestyle',url:'https://images.pexels.com/photos/36731580/pexels-photo-36731580.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Vitaly Gariev · Pexels'},
 {id:'atelier-phone-36731581',cat:'lifestyle',url:'https://images.pexels.com/photos/36731581/pexels-photo-36731581.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Vitaly Gariev · Pexels'},
 {id:'fabric-tulle-6334345',cat:'fabric',url:'https://images.pexels.com/photos/6334345/pexels-photo-6334345.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Ksenia Chernaya · Pexels'},
 {id:'fabric-luxury-12081254',cat:'fabric',url:'https://images.pexels.com/photos/12081254/pexels-photo-12081254.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Markus Winkler · Pexels'},
 {id:'fabric-detail-4935559',cat:'fabric',url:'https://images.pexels.com/photos/4935559/pexels-photo-4935559.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Brett Jordan · Pexels'},
 {id:'fabric-white-7946560',cat:'fabric',url:'https://images.pexels.com/photos/7946560/pexels-photo-7946560.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Hanna Pad · Pexels'},
 {id:'fabric-denim-34851004',cat:'fabric',url:'https://images.pexels.com/photos/34851004/pexels-photo-34851004.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Pexels'},
 {id:'fabric-satin-7946623',cat:'fabric',url:'https://images.pexels.com/photos/7946623/pexels-photo-7946623.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Hanna Pad · Pexels'},
 {id:'fabric-white-7629856',cat:'fabric',url:'https://images.pexels.com/photos/7629856/pexels-photo-7629856.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Martin de Arriba · Pexels'},
 {id:'cafe-notebook-18493334',cat:'cafe',url:'https://images.pexels.com/photos/18493334/pexels-photo-18493334.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Eugenia Remark · Pexels'},
 {id:'cafe-notebook-18493350',cat:'cafe',url:'https://images.pexels.com/photos/18493350/pexels-photo-18493350.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Eugenia Remark · Pexels'},
 {id:'cafe-notebook-18493343',cat:'cafe',url:'https://images.pexels.com/photos/18493343/pexels-photo-18493343.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Eugenia Remark · Pexels'},
 {id:'street-30761870',cat:'street',url:'https://images.pexels.com/photos/30761870/pexels-photo-30761870.jpeg?auto=compress&cs=tinysrgb&w=900',credit:"César O'neill · Pexels"},
 {id:'street-31369314',cat:'street',url:'https://images.pexels.com/photos/31369314/pexels-photo-31369314.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Felix Young · Pexels'},
 {id:'street-35276451',cat:'street',url:'https://images.pexels.com/photos/35276451/pexels-photo-35276451.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Guillermo Berlin · Pexels'},
 {id:'street-31107305',cat:'street',url:'https://images.pexels.com/photos/31107305/pexels-photo-31107305.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Felix Young · Pexels'},
 {id:'paris-street-30214719',cat:'paris',url:'https://images.pexels.com/photos/30214719/pexels-photo-30214719.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'David Kouakou · Pexels'},
 {id:'paris-street-28751291',cat:'paris',url:'https://images.pexels.com/photos/28751291/pexels-photo-28751291.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Toni Malfilatre · Pexels'},
 {id:'street-31107313',cat:'street',url:'https://images.pexels.com/photos/31107313/pexels-photo-31107313.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Felix Young · Pexels'},
 {id:'street-37036179',cat:'street',url:'https://images.pexels.com/photos/37036179/pexels-photo-37036179.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Murat IŞIK · Pexels'}
];
const hash=s=>{let h=0;for(const c of String(s||''))h=(h*31+c.charCodeAt(0))>>>0;return h};
window.HCPhotoBank={version:2,source:'Pexels',images:photos,byCategory:cat=>photos.filter(p=>p.cat===cat)};
function choose(m,i){const t=String(m?.type||m?.category||'').toLowerCase();let pool=photos;if(t.includes('travel')||t.includes('look'))pool=photos.filter(p=>['street','paris'].includes(p.cat));else if(t.includes('detail')||t.includes('mood')||t.includes('fabric'))pool=photos.filter(p=>p.cat==='fabric');else if(t.includes('backstage')||t.includes('sketch'))pool=photos.filter(p=>['atelier','studio','cafe'].includes(p.cat));return pool[hash(m?.id||i)%pool.length]||photos[0]}
function apply(){if(!window.HCPhone)return false;try{HCPhone.mutate(s=>{
 s.photoBank={version:2,source:'Pexels',count:photos.length,categories:[...new Set(photos.map(p=>p.cat))]};
 (s.media||[]).forEach((m,i)=>{if(!m.imageUrl||String(m.imageUrl).includes('../')){const p=choose(m,i);m.imageUrl=p.url;m.photoCredit=p.credit;m.photoBankId=p.id;if(m.source==='library')m.source='photo_bank'}});
 (s.feed||[]).forEach((p,i)=>{if(!p.imageUrl){const ph=choose(p,i+99);p.imageUrl=ph.url;p.photoCredit=ph.credit;p.photoBankId=ph.id}});
 });return true}catch(e){console.warn('[HCPhotoBank] apply failed',e);return false}}
let n=0;const t=setInterval(()=>{n++;if(apply()||n>80)clearInterval(t)},75);
window.addEventListener('hc-phone-state',()=>{if(n>80)apply()});
})();