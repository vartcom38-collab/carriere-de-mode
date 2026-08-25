/* Haute Couture Live — Chez Moi : conserve la photo réelle du logement choisi. */
(function(){
'use strict';
const IMG=id=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=86`;
const PHOTOS={
 compact:[IMG('photo-1522708323590-d24dbb6b0267'),IMG('photo-1505693416388-ac5ce068fe85'),IMG('photo-1600566753190-17f0baa2a6c3')],
 bright:[IMG('photo-1615529182904-14819c35db37'),IMG('photo-1615874694520-474822394e73'),IMG('photo-1600210492486-724fe5c67fb0')],
 old:[IMG('photo-1600607687939-ce8a6c25118c'),IMG('photo-1618221195710-dd6b41faaea6'),IMG('photo-1586023492125-27b2c045efd7')],
 loft:[IMG('photo-1600566753086-00f18fb6b3ea'),IMG('photo-1600607688969-a5bfcd646154'),IMG('photo-1600566752355-35792bedcfea')],
 premium:[IMG('photo-1600566753190-17f0baa2a6c3'),IMG('photo-1600210492486-724fe5c67fb0'),IMG('photo-1615874694520-474822394e73')],
 outdoor:[IMG('photo-1600585154340-be6161a56a0c'),IMG('photo-1600607687939-ce8a6c25118c'),IMG('photo-1615529182904-14819c35db37')]
};
function hash(s){let h=2166136261;for(const c of String(s||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function family(home){const v=home.visual||{},text=[home.title,home.type,v.archetype,v.archetypeLabel,v.standingLevel].join(' ').toLowerCase();if(home.balcony||/extérieur|terrasse|balcon/.test(text))return'outdoor';if(/loft|atelier|rez-de-chaussée/.test(text))return'loft';if(/ancien|caractère|parquet|moulure/.test(text))return'old';if(/premium|haut de gamme/.test(text)||Number(home.price||0)>1200)return'premium';if(/lumineux|t1|deux-pièces|t2/.test(text)||Number(home.surface||0)>=24)return'bright';return'compact'}
function urlFor(home){const f=family(home),a=PHOTOS[f]||PHOTOS.bright,n=hash(`${home.id}|${home.title}|${home.surface}|${home.price}|${f}`);return a[n%a.length]}
function apply(){
 let raw={};try{raw=JSON.parse(localStorage.getItem('haute-couture-home')||'{}')}catch(e){}const home=raw.home;if(!home)return;
 const url=window.HCVisualService?.resolveRealPhoto?.(home,'main')?.url||urlFor(home);
 home.visual=home.visual||{};home.visual.assets=home.visual.assets||{thumbnail:null,mainImage:null,gallery:{}};home.visual.assets.mainImage=url;home.visual.mainImageSource='real-photo';home.visual.mainImageProvider='real-photo-library';raw.home=home;
 try{localStorage.setItem('haute-couture-home',JSON.stringify(raw));localStorage.setItem('haute-couture-residence',JSON.stringify({...home,city:raw.city||home.city,region:raw.region||home.region}))}catch(e){}
 const scene=document.getElementById('scene');if(scene)scene.style.backgroundImage=`url("${url.replace(/"/g,'%22')}")`;
 const status=document.getElementById('artStatus');if(status)status.textContent='Photo réelle du logement';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,80));else setTimeout(apply,80);
setTimeout(apply,700);
})();