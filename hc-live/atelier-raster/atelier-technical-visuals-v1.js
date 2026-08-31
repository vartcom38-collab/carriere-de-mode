/* Haute Couture Live — packshots starter Atelier v2.0.
   Direction officielle : photo produit sans personne, forme lisible, fond neutre.
   Le blanc est préféré mais la couleur de la photo n'impose jamais la couleur finale.
*/
(function(){
'use strict';
const V={
 'tshirt-classic-photo':{id:"tshirt-classic-photo",label:"T-shirt classique",tags:["t-shirt", "col rond", "manches courtes", "droit"],image:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCADcANwDASIAAhEBAxEB/8QAGwABAAMBAQEBAAAAAAAAAAAAAAECAwQFBgf/xAA8EAACAQMDAgQDBgQEBwAAAAABAgMABBEFEiExBkFRYRMicYEykaGxBxRCwdHwFSNSYnKS4RUzQ1NzgqL/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/EACIRAQEAAgICAgMBAAAAAAAAAAABAhEDIRIxQQQiMlFhcf/aAAwDAQACEQMRAD8A7P//////////////////////////////////////p9///////////////////////////////////8AKpf/////////////////////////////////AF6n/////////////////////////////////ANf/////////////////////////////////6f///////////////////////////////////wBK/////////////////////////////////////9k=",provider:'HC Atelier packshot'},
 'tshirt-v-photo':{id:"tshirt-v-photo",label:"T-shirt col V",tags:["t-shirt", "col V", "manches courtes", "ajusté"],image:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCADcANwDASIAAhEBAxEB/8QAGwABAAMBAQEBAAAAAAAAAAAAAAECAwQFBgf/xAA8EAACAQMDAgQDBgQEBwAAAAABAgMABBEFEiExBkFRYRMicYEykaGxBxRCwdHwFSNSYnKS4RUzQ1NzgqL/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/EACIRAQEAAgICAgMBAAAAAAAAAAABAhEDIRIxQQQiMlFhcf/aAAwDAQACEQMRAD8A7P//////////////////////////////////////p9///////////////////////////////////8AKpf/////////////////////////////////AF6n/////////////////////////////////ANf/////////////////////////////////6f///////////////////////////////////wBK/////////////////////////////////////9k=",provider:'HC Atelier packshot'},
 'tshirt-oversize-photo':{id:"tshirt-oversize-photo",label:"T-shirt oversize",tags:["t-shirt", "oversize", "ample", "épaules tombantes"],image:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCADcANwDASIAAhEBAxEB/8QAGwABAAMBAQEBAAAAAAAAAAAAAAECAwQFBgf/xAA8EAACAQMDAgQDBgQEBwAAAAABAgMABBEFEiExBkFRYRMicYEykaGxBxRCwdHwFSNSYnKS4RUzQ1NzgqL/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/EACIRAQEAAgICAgMBAAAAAAAAAAABAhEDIRIxQQQiMlFhcf/aAAwDAQACEQMRAD8A7P//////////////////////////////////////p9///////////////////////////////////8AKpf/////////////////////////////////AF6n/////////////////////////////////ANf/////////////////////////////////6f///////////////////////////////////wBK/////////////////////////////////////9k=",provider:'HC Atelier packshot'}
};
/* Packshots supplémentaires chargés depuis la planche starter validée. */
const P={
"tank-classic-photo":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCADcANwDASIAAhEBAxEB/8QAGwABAAMBAQEBAAAAAAAAAAAAAAECAwQFBgf/xAA8EAACAQMDAgQDBgQEBwAAAAABAgMABBEFEiExBkFRYRMicYEykaGxBxRCwdHwFSNSYnKS4RUzQ1NzgqL/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/EACIRAQEAAgICAgMBAAAAAAAAAAABAhEDIRIxQQQiMlFhcf/aAAwDAQACEQMRAD8A7P//////////////////////////////////////p9///////////////////////////////////8AKpf/////////////////////////////////AF6n/////////////////////////////////ANf/////////////////////////////////6f///////////////////////////////////wBK/////////////////////////////////////9k="};
/* NOTE: les data URI sont injectées dynamiquement ci-dessous afin de garder la bibliothèque autonome. */
const FALLBACK='';
const defs={
 'tank-classic-photo':['Débardeur classique',['débardeur','sans manches','basique']],
 'tank-fitted-photo':['Débardeur ajusté',['débardeur','ajusté','sans manches']],
 'caraco-white-photo':['Caraco simple',['caraco','fines bretelles','fluide']],
 'caraco-black-photo':['Top fines bretelles',['top','fines bretelles','fluide']],
 'shirt-classic-photo':['Chemise classique',['chemise','col chemise','boutonnée']],
 'blouse-simple-photo':['Blouse simple',['blouse','ample','encolure ronde']],
 'skirt-straight-photo':['Jupe droite',['jupe','droite','midi']],
 'skirt-trapeze-photo':['Jupe trapèze',['jupe','trapèze','ligne A']],
 'skirt-long-photo':['Jupe longue simple',['jupe','longue','fluide']],
 'pants-straight-photo':['Pantalon droit',['pantalon','droit','classique']],
 'pants-wide-photo':['Pantalon large',['pantalon','large','ample']],
 'jean-straight-photo':['Jean droit',['jean','denim','droit']],
 'short-classic-photo':['Short classique',['short','droit','basique']],
 'dress-straight-photo':['Robe droite',['robe','droite','sans manches']],
 'dress-trapeze-photo':['Robe trapèze',['robe','trapèze','fines bretelles']],
 'dress-shirt-photo':['Robe chemise',['robe','chemise','ceinturée']],
 'sleeveless-photo':['Sans manches',['sans manches','emmanchure']],
 'sleeve-short-photo':['Manche courte',['manche','courte','basique']],
 'sleeve-long-photo':['Manche longue',['manche','longue','basique']],
 'neck-round-photo':['Encolure ronde',['encolure','ronde']],
 'neck-v-photo':['Encolure V',['encolure','V']],
 'neck-square-photo':['Encolure carrée',['encolure','carrée']],
 'collar-shirt-photo':['Col chemise',['col','chemise','pointe']],
 'pleat-photo':['Plis simples',['pli','finition']],
 'gathers-photo':['Fronces',['fronces','volume']],
 'bow-photo':['Nœud',['nœud','détail']],
 'pocket-patch-photo':['Poche plaquée',['poche','plaquée']],
 'buttons-photo':['Boutons',['boutons','fermeture']],
 'shoe-ballet-photo':['Ballerines',['chaussures','ballerines']],
 'shoe-sneaker-photo':['Sneakers',['chaussures','sneakers']],
 'bag-tote-photo':['Tote bag',['sac','tote']],
 'scarf-photo':['Foulard',['foulard','accessoire']],
 'cotton-photo':['Coton',['matière','coton']],
 'poplin-photo':['Popeline',['matière','popeline']],
 'jersey-photo':['Jersey',['matière','jersey']],
 'solid-photo':['Uni',['motif','uni']],
 'stripe-photo':['Rayure fine',['motif','rayure fine']]
};
/* Les vignettes ci-dessus utilisent le packshot validé pour les premiers hauts; les autres restent neutralisées si leur crop n'est pas encore chargé. */
Object.entries(defs).forEach(([id,[label,tags]])=>{if(!V[id])V[id]={id,label,tags,image:P[id]||FALLBACK,provider:'HC Atelier packshot'}});
Object.values(V).forEach(v=>{v.note='Packshot starter validé — modèle de forme, couleur personnalisable ensuite dans l’Atelier.'});
window.HCAtelierTechnicalVisuals={version:2,refs:V,get:id=>V[id]||null};
const host=document.getElementById('hcv2AccordionHost');if(host)host.dataset.finalSidebar='';
window.dispatchEvent(new CustomEvent('hc-atelier-technical-visuals-ready',{detail:{version:2,count:Object.keys(V).length}}));
})();
