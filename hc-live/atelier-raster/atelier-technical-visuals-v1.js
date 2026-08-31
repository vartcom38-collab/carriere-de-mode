/* Haute Couture Live — visuels techniques Atelier v1.2.
   Direction visuelle officielle: élément isolé, ivoire/blanc, trait fin, vue frontale, sans personne ni décor.
*/
(function(){
'use strict';
if(window.HCAtelierTechnicalVisuals)return;
const esc=s=>encodeURIComponent(s).replace(/'/g,'%27').replace(/"/g,'%22');
const svg=(body,w=420,h=360)=>'data:image/svg+xml;charset=utf-8,'+esc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><g fill="#fbf8f2" stroke="#8b8178" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`);
const stitch=d=>`<path d="${d}" fill="none" stroke="#c8beb4" stroke-width="1.2" stroke-dasharray="3 3"/>`;
const nofill=d=>`<path d="${d}" fill="none"/>`;
const V={
 'tshirt-classic-front':{id:'tshirt-classic-front',label:'T-shirt classique',tags:['classique','col rond','manches courtes','droit'],image:svg(`<path d="M138 58 172 38h76l34 20 66 45-36 58-36-21v158H144V140l-36 21-36-58 66-45Z"/>${nofill('M174 39c4 25 68 25 72 0')}${stitch('M151 282h118M92 117l30 47M328 117l-30 47')}`),provider:'HC Atelier'},
 'tshirt-v-neck':{id:'tshirt-v-neck',label:'T-shirt col V',tags:['col V','manches courtes','ajusté','basique'],image:svg(`<path d="M138 58 171 39h78l33 19 65 45-35 56-36-20-12 159H156l-12-159-36 20-35-56 65-45Z"/>${nofill('M171 40 210 99l39-59')}<path d="M178 44 210 88l32-44" fill="none" stroke="#c8beb4"/>${stitch('M164 282h92M92 117l30 45M328 117l-30 45')}`),provider:'HC Atelier'},
 'tshirt-oversized':{id:'tshirt-oversized',label:'T-shirt oversize',tags:['oversize','ample','épaules tombantes','streetwear'],image:svg(`<path d="M126 65 170 40h80l44 25 82 43-31 70-59-31v160H134V147l-59 31-31-70 82-43Z"/>${nofill('M171 41c4 27 74 27 78 0')}${stitch('M142 290h136M66 126l53 58M354 126l-53 58')}`),provider:'HC Atelier'},
 'tank-basic':{id:'tank-basic',label:'Débardeur classique',tags:['débardeur','sans manches','basique','ajusté'],image:svg(`<path d="M166 44h88l17 55c15 26 22 47 24 71l10 133H115l10-133c2-24 9-45 24-71l17-55Z"/>${nofill('M167 45c3 28 83 28 86 0M149 99c21 14 30 11 35-8M271 99c-21 14-30 11-35-8')}${stitch('M126 286h168')}`),provider:'HC Atelier'},
 'shirt-basic':{id:'shirt-basic',label:'Chemise classique',tags:['chemise','col chemise','manches longues','boutonnée'],image:svg(`<path d="M142 60 174 38h72l32 22 55 38-29 55-32-18v168H148V135l-32 18-29-55 55-38Z"/>${nofill('M174 39 210 72l36-33M188 53l-20 37 42-18 42 18-20-37M210 72v216')}<circle cx="210" cy="112" r="2"/><circle cx="210" cy="150" r="2"/><circle cx="210" cy="188" r="2"/><circle cx="210" cy="226" r="2"/>${stitch('M156 286h108')}`),provider:'HC Atelier'},
 'skirt-straight':{id:'skirt-straight',label:'Jupe droite',tags:['jupe','droite','taille naturelle','basique'],image:svg(`<path d="M145 58h130l18 244H127l18-244Z"/>${nofill('M145 72h130M210 72v214')}${stitch('M137 286h146')}`),provider:'HC Atelier'},
 'skirt-a-line':{id:'skirt-a-line',label:'Jupe trapèze',tags:['jupe','trapèze','ligne A','basique'],image:svg(`<path d="M154 58h112l57 244H97l57-244Z"/>${nofill('M154 72h112')}${stitch('M110 286h200')}`),provider:'HC Atelier'},
 'pants-straight':{id:'pants-straight',label:'Pantalon droit',tags:['pantalon','droit','taille naturelle','basique'],image:svg(`<path d="M145 55h130l18 247h-67l-16-154-16 154h-67l18-247Z"/>${nofill('M145 72h130M210 72v76M166 82c8 20 80 20 88 0')}${stitch('M135 288h56M229 288h56')}`),provider:'HC Atelier'},
 'jeans-straight':{id:'jeans-straight',label:'Jean droit',tags:['jean','denim','droit','5 poches'],image:svg(`<path d="M145 55h130l18 247h-67l-16-154-16 154h-67l18-247Z"/>${nofill('M145 72h130M210 72v76M166 80q15 25 44 25t44-25M162 86q18 9 30 2M258 86q-18 9-30 2')}<circle cx="210" cy="65" r="3"/>${stitch('M135 288h56M229 288h56')}`),provider:'HC Atelier'},
 'dress-straight':{id:'dress-straight',label:'Robe droite',tags:['robe','droite','sans manches','basique'],image:svg(`<path d="M164 45h92l18 54c16 31 20 60 17 98l20 107H109l20-107c-3-38 1-67 17-98l18-54Z"/>${nofill('M166 46c3 28 85 28 88 0M146 99c18 14 28 11 34-8M274 99c-18 14-28 11-34-8')}${stitch('M121 288h178')}`),provider:'HC Atelier'},
 'sleeve-short-basic':{id:'sleeve-short-basic',label:'Manche courte',tags:['manche','courte','droite','basique'],image:svg(`<path d="M122 72q88-48 176 0l34 76-54 30-31-59-7 178H180l-7-178-31 59-54-30 34-76Z"/>${stitch('M100 145l42 22M320 145l-42 22')}`),provider:'HC Atelier'},
 'sleeve-long-basic':{id:'sleeve-long-basic',label:'Manche longue',tags:['manche','longue','droite','basique'],image:svg(`<path d="M126 70q84-44 168 0l44 197-50 12-48-162-6 177h-48l-6-177-48 162-50-12 44-197Z"/>${stitch('M88 259l48 12M332 259l-48 12')}`),provider:'HC Atelier'},
 'neck-round-basic':{id:'neck-round-basic',label:'Encolure ronde',tags:['encolure','ronde','basique'],image:svg(`<path d="M108 60h204v240H108Z"/><path d="M155 82c10 72 100 72 110 0" fill="#fff"/>${stitch('M162 92c12 55 84 55 96 0')}`),provider:'HC Atelier'},
 'neck-v-basic':{id:'neck-v-basic',label:'Encolure V',tags:['encolure','V','basique'],image:svg(`<path d="M108 60h204v240H108Z"/><path d="M157 82 210 170l53-88" fill="#fff"/>${stitch('M166 91 210 157l44-66')}`),provider:'HC Atelier'},
 'neck-square-basic':{id:'neck-square-basic',label:'Encolure carrée',tags:['encolure','carrée','basique'],image:svg(`<path d="M108 60h204v240H108Z"/><path d="M157 82v78h106V82" fill="#fff"/>${stitch('M166 91v58h88V91')}`),provider:'HC Atelier'},
 'collar-shirt-basic':{id:'collar-shirt-basic',label:'Col chemise',tags:['col','chemise','pointe','basique'],image:svg(`<path d="M130 90 180 48h60l50 42-80 74-80-74Z"/><path d="M180 48 210 94l30-46M210 94l-80-4M210 94l80-4" fill="none"/>`),provider:'HC Atelier'}
};
Object.values(V).forEach(v=>{v.note='Illustration technique interne — élément isolé, ivoire sur fond blanc.'});
window.HCAtelierTechnicalVisuals={version:1.2,refs:V,get:id=>V[id]||null};
const host=document.getElementById('hcv2AccordionHost');if(host)host.dataset.finalSidebar='';
window.dispatchEvent(new CustomEvent('hc-atelier-technical-visuals-ready',{detail:{version:1.2,count:Object.keys(V).length}}));
})();