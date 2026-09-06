/* Haute Couture Live — supports visuels pédagogiques exacts v1 */
(function(){
'use strict';
if(window.HCSubjectVisualsV1)return;
if(!/\/school-course\/?$/i.test(location.pathname))return;
const id=new URLSearchParams(location.search).get('id')||'';
const DATA={
 'w1-textile':{
  kicker:'LABORATOIRE TEXTILE',title:'Lire la matière avant de la nommer',
  photo:'https://images.unsplash.com/photo-4Yh_YJitizc?auto=format&fit=crop&w=1200&q=86',
  fallback:'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=86',
  note:'Observe la structure, la surface et le comportement. Le nom de la fibre ne suffit jamais.',
  tags:[['STRUCTURE','Tissé / maille'],['DIRECTION','Droit-fil / biais'],['COMPORTEMENT','Tenue / fluidité']]
 },
 'w1-pattern':{
  kicker:'MODÉLISME',title:'Lire le patron comme une carte du volume',
  photo:'https://images.unsplash.com/photo-fPmQNx7cf0E?auto=format&fit=crop&w=1200&q=86',
  fallback:'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=86',
  note:'Un patron n’est pas un dessin plat : chaque ligne prépare une orientation, un assemblage ou un volume.',
  tags:[['ORIENTATION','Droit-fil'],['VOLUME','Pince'],['ASSEMBLAGE','Crans']]
 },
 'w1-drape':{
  kicker:'MOULAGE',title:'Observer le tissu sur le corps',
  photo:'https://images.unsplash.com/photo-2UbbVpHWb58?auto=format&fit=crop&w=1200&q=86',
  fallback:'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1200&q=86',
  note:'Commence avec peu de points d’ancrage. Regarde ensuite où la matière tire, tombe ou s’accumule.',
  tags:[['POINT FIXE','Ancrage'],['FORCE','Tension'],['MATIÈRE','Excès / volume']]
 }
};
const D=DATA[id];if(!D){window.HCSubjectVisualsV1={active:false};return}
const css=document.createElement('style');css.id='hc-subject-visuals-v1-css';css.textContent=`
.hcsv1{margin:18px 0 22px;border-radius:20px;overflow:hidden;border:1px solid rgba(78,54,43,.14);background:#fffaf5;box-shadow:0 18px 48px rgba(42,28,22,.10)}
.hcsv1-photo{height:250px;position:relative;background:#d8c9bd center/cover no-repeat;overflow:hidden}.hcsv1-photo:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(24,15,12,.06),rgba(24,15,12,.56))}
.hcsv1-head{position:absolute;z-index:2;left:20px;right:20px;bottom:18px;color:#fff;text-shadow:0 2px 14px rgba(0,0,0,.35)}.hcsv1-k{font:800 9px/1 Arial,sans-serif;letter-spacing:.16em;color:#f1c3bd;margin-bottom:7px}.hcsv1-head h4{font:29px/1.05 Georgia,serif;font-weight:400;margin:0;color:#fff!important}
.hcsv1-body{padding:16px 18px 18px}.hcsv1-body p{margin:0 0 14px!important;font:14px/1.55 Georgia,serif!important;color:#67564d!important}.hcsv1-tags{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.hcsv1-tag{border:1px solid rgba(78,54,43,.13);background:#f6eee8;border-radius:13px;padding:11px}.hcsv1-tag b{display:block;font:800 8px/1 Arial,sans-serif;letter-spacing:.11em;color:#b96f68;margin-bottom:5px}.hcsv1-tag span{font:14px/1.2 Georgia,serif;color:#3b2d27}
@media(max-width:720px){.hcsv1-photo{height:190px}.hcsv1-tags{grid-template-columns:1fr}.hcsv1-head h4{font-size:24px}}
`;document.head.appendChild(css);
function make(){
 const host=document.querySelector('.hcsi2');if(!host||host.querySelector('.hcsv1'))return;
 const box=document.createElement('section');box.className='hcsv1';
 box.innerHTML=`<div class="hcsv1-photo" style="background-image:url('${D.photo}')"><div class="hcsv1-head"><div class="hcsv1-k">${D.kicker}</div><h4>${D.title}</h4></div></div><div class="hcsv1-body"><p>${D.note}</p><div class="hcsv1-tags">${D.tags.map(x=>`<div class="hcsv1-tag"><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div></div>`;
 const photo=box.querySelector('.hcsv1-photo');const img=new Image();img.onerror=()=>{photo.style.backgroundImage=`url('${D.fallback}')`};img.src=D.photo;
 host.prepend(box);
}
setTimeout(make,120);setTimeout(make,500);setTimeout(make,1200);new MutationObserver(make).observe(document.documentElement,{childList:true,subtree:true});
window.HCSubjectVisualsV1={active:true,id,make};
})();