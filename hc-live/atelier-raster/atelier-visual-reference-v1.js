/* Haute Couture Live — références visuelles Atelier v2.1.
   Starter vêtements : packshots photo validés. Les inspirations / archives restent séparées.
*/
(function(){
'use strict';
if(window.HCAtelierVisualReferences)return;
const refs={};
const TECH_KEYS={
 'top-tshirt':['tshirt-classic-photo','tshirt-v-photo','tshirt-oversize-photo'],
 'top-debardeur':['tank-classic-photo','tank-fitted-photo'],
 'top-caraco':['caraco-white-photo','caraco-black-photo'],
 'top-chemise':['shirt-classic-photo'],
 'top-blouse':['blouse-simple-photo'],
 'skirt-droite':['skirt-straight-photo'],
 'skirt-trapeze':['skirt-trapeze-photo'],
 'skirt-longue':['skirt-long-photo'],
 'pants-droit':['pants-straight-photo'],
 'pants-large':['pants-wide-photo'],
 'jean-droit':['jean-straight-photo'],
 'short-classique':['short-classic-photo'],
 'dress-droite':['dress-straight-photo'],
 'dress-trapeze':['dress-trapeze-photo'],
 'dress-chemise':['dress-shirt-photo']
};
function variantsForItem(id){const keys=TECH_KEYS[id]||[];const get=window.HCAtelierTechnicalVisuals?.get;if(!get)return[];return keys.map(k=>get(k)).filter(Boolean)}
window.HCAtelierVisualReferences={
 version:2.1,
 refs,
 galleries:{},
 forItem:id=>refs[id]||null,
 variantsForItem,
 forCategory:()=>null,
 enrich:item=>({...item,visualReference:refs[item.id]||null,visualVariants:variantsForItem(item.id),visualGallery:null})
};
window.addEventListener('hc-atelier-technical-visuals-ready',()=>window.dispatchEvent(new CustomEvent('hc-atelier-visual-references-updated')));
})();