/* Haute Couture Live — visuels techniques Atelier v1.1.
   Direction visuelle officielle: élément isolé, ivoire/blanc, trait fin, vue frontale, sans personne ni décor.
*/
(function(){
'use strict';
if(window.HCAtelierTechnicalVisuals)return;
const esc=s=>encodeURIComponent(s).replace(/'/g,'%27').replace(/"/g,'%22');
const svg=(body,w=420,h=360)=>'data:image/svg+xml;charset=utf-8,'+esc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><g fill="#fbf8f2" stroke="#8b8178" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`);
const stitch=d=>`<path d="${d}" fill="none" stroke="#c8beb4" stroke-width="1.2" stroke-dasharray="3 3"/>`;
const V={
 'tshirt-classic-front':{
  id:'tshirt-classic-front',label:'T-shirt classique',tags:['classique','col rond','manches courtes','droit'],
  image:svg(`<path d="M138 58 172 38h76l34 20 66 45-36 58-36-21v158H144V140l-36 21-36-58 66-45Z"/><path d="M174 39c4 25 68 25 72 0" fill="none"/>${stitch('M151 282h118M92 117l30 47M328 117l-30 47')}`),provider:'HC Atelier'
 },
 'tshirt-v-neck':{
  id:'tshirt-v-neck',label:'T-shirt col V',tags:['col V','manches courtes','ajusté','basique'],
  image:svg(`<path d="M138 58 171 39h78l33 19 65 45-35 56-36-20-12 159H156l-12-159-36 20-35-56 65-45Z"/><path d="M171 40 210 99l39-59" fill="none"/><path d="M178 44 210 88l32-44" fill="none" stroke="#c8beb4"/>${stitch('M164 282h92M92 117l30 45M328 117l-30 45')}`),provider:'HC Atelier'
 },
 'tshirt-oversized':{
  id:'tshirt-oversized',label:'T-shirt oversize',tags:['oversize','ample','épaules tombantes','streetwear'],
  image:svg(`<path d="M126 65 170 40h80l44 25 82 43-31 70-59-31v160H134V147l-59 31-31-70 82-43Z"/><path d="M171 41c4 27 74 27 78 0" fill="none"/>${stitch('M142 290h136M66 126l53 58M354 126l-53 58')}`),provider:'HC Atelier'
 },
 'tank-basic':{
  id:'tank-basic',label:'Débardeur classique',tags:['débardeur','sans manches','basique','ajusté'],
  image:svg(`<path d="M166 44h88l17 55c15 26 22 47 24 71l10 133H115l10-133c2-24 9-45 24-71l17-55Z"/><path d="M167 45c3 28 83 28 86 0" fill="none"/><path d="M149 99c21 14 30 11 35-8M271 99c-21 14-30 11-35-8" fill="none"/>${stitch('M126 286h168')}`),provider:'HC Atelier'
 }
};
Object.values(V).forEach(v=>{v.note='Illustration technique interne — élément isolé, ivoire sur fond blanc.'});
window.HCAtelierTechnicalVisuals={version:1.1,refs:V,get:id=>V[id]||null};
const host=document.getElementById('hcv2AccordionHost');if(host)host.dataset.finalSidebar='';
window.dispatchEvent(new CustomEvent('hc-atelier-technical-visuals-ready',{detail:{version:1.1,count:Object.keys(V).length}}));
})();