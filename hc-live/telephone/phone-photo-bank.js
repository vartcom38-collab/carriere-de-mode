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
 {id:'atelier-phone-36731581',cat:'lifestyle',url:'https://images.pexels.com/photos/36731581/pexels-photo-36731581.jpeg?auto=compress&cs=tinysrgb&w=900',credit:'Vitaly Gariev · Pexels'}
];
const hash=s=>{let h=0;for(const c of String(s||''))h=(h*31+c.charCodeAt(0))>>>0;return h};
window.HCPhotoBank={version:1,source:'Pexels',images:photos};
function apply(){if(!window.HCPhone)return false;try{HCPhone.mutate(s=>{
 s.photoBank=s.photoBank||{version:1,source:'Pexels',count:photos.length};
 (s.media||[]).forEach((m,i)=>{if(!m.imageUrl){const p=photos[hash(m.id||i)%photos.length];m.imageUrl=p.url;m.photoCredit=p.credit;m.photoBankId=p.id;m.source=m.source||'photo_bank'}});
 (s.feed||[]).forEach((p,i)=>{if(!p.imageUrl){const ph=photos[hash(p.id||i+99)%photos.length];p.imageUrl=ph.url;p.photoCredit=ph.credit;p.photoBankId=ph.id}});
 });return true}catch(e){console.warn('[HCPhotoBank] apply failed',e);return false}}
let n=0;const t=setInterval(()=>{n++;if(apply()||n>80)clearInterval(t)},75);
window.addEventListener('hc-phone-state',()=>{if(n>80)apply()});
})();