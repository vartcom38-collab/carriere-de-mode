/* Haute Couture Live — banque personnelle du personnage.
   Les fichiers réels seront rangés dans hc-live/telephone/personal/ et ne sont utilisés
   que pour des contextes cohérents. Le feed reste majoritairement atelier/lieux/matières. */
(function(){
'use strict';
const slots=[
 {id:'me-profile',file:'./personal/me-profile.jpg',roles:['profile','portrait','milestone'],weight:100},
 {id:'me-window',file:'./personal/me-window.jpg',roles:['lifestyle','journal','daily'],weight:80},
 {id:'me-camera',file:'./personal/me-camera.jpg',roles:['backstage','story','creative'],weight:85},
 {id:'me-laptop',file:'./personal/me-laptop.jpg',roles:['work','career','daily'],weight:75},
 {id:'me-fun',file:'./personal/me-fun.jpg',roles:['fun','story','milestone'],weight:65},
 {id:'me-moodboard',file:'./personal/me-moodboard.jpg',roles:['creative','moodboard','backstage'],weight:90}
];
const loaded=new Map();
function probe(item){if(loaded.has(item.id))return Promise.resolve(loaded.get(item.id));return new Promise(resolve=>{const im=new Image();im.onload=()=>{loaded.set(item.id,true);resolve(true)};im.onerror=()=>{loaded.set(item.id,false);resolve(false)};im.src=item.file})}
async function ready(){await Promise.all(slots.map(probe));return slots.filter(x=>loaded.get(x.id))}
function choose(role,key=''){const pool=slots.filter(x=>loaded.get(x.id)&&x.roles.includes(role));if(!pool.length)return null;let h=0;for(const c of String(key))h=(h*31+c.charCodeAt(0))>>>0;return pool[h%pool.length]}
window.HCPersonalMedia={version:1,slots,loaded,ready,choose,policy:{maxPersonalShare:.30,feedPost:'4:5',story:'9:16',profileGrid:'1:1'}};
ready().then(items=>window.dispatchEvent(new CustomEvent('hc-personal-media-ready',{detail:{count:items.length}})));
})();