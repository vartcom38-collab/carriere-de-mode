/* Haute Couture Live — base de départ Atelier v2.
   Références créatives uniquement : ne crée pas de stock physique gratuit.
*/
(function(){
'use strict';
function boot(){
 const C=window.HCAtelierCatalog;if(!C||C.version<2){setTimeout(boot,60);return}
 if(window.HCAtelierStarterBase?.version>=2)return;
 const ids=[
  // Hauts
  'top-tshirt','top-debardeur','top-caraco','top-chemise','top-cache-coeur',
  // Bas
  'skirt-droite','skirt-trapeze','skirt-longue','short-classique','pants-droit','pants-large','jean-droit',
  // Bases de robe
  'dress-droite','dress-trapeze',
  // Manches
  'sleeve-none','sleeve-short','sleeve-long','sleeve-cap',
  // Encolures / col / dos
  'neck-round','neck-v','neck-square','neck-scoop','collar-shirt','back-closed',
  // Construction fondamentale
  'waist-natural','waist-high','fit-fitted','fit-semi','shape-a','shoulder-natural','seam-side','seam-center','hem-straight','lining-basic',
  // Détails / finitions simples
  'detail-pleat','detail-gathers','detail-bow','detail-slit','detail-binding','pocket-patch','closure-buttons','closure-snaps','closure-wraptie','belt-thin',
  // Accessoires simples
  'shoe-ballet','shoe-loafer','shoe-sandal','shoe-sneaker','bag-tote','scarf','headband','hosiery-opaque',
  // Références matière / motif
  'material-cotton','material-poplin','material-twill','pattern-solid','pattern-stripe-fine'
 ];
 const valid=ids.filter(id=>C.byId(id));
 C.starterIds=new Set(valid);
 const colors=[
  {id:'ivoire',name:'Ivoire',value:'#eee5d6'},
  {id:'noir',name:'Noir',value:'#24211f'},
  {id:'marine',name:'Bleu marine',value:'#263449'},
  {id:'beige',name:'Beige',value:'#cdb79e'}
 ];
 const profile={
  version:2,
  itemIds:valid,
  colors,
  physicalStockGranted:false,
  intent:'Permettre de composer des premières silhouettes simples avant toute exploration, sans rendre inutiles les découvertes.',
  groups:{
   hauts:['top-tshirt','top-debardeur','top-caraco','top-chemise','top-cache-coeur'],
   bas:['skirt-droite','skirt-trapeze','skirt-longue','short-classique','pants-droit','pants-large','jean-droit'],
   robes:['dress-droite','dress-trapeze'],
   manches:['sleeve-none','sleeve-short','sleeve-long','sleeve-cap'],
   encolures:['neck-round','neck-v','neck-square','neck-scoop','collar-shirt','back-closed'],
   construction:['waist-natural','waist-high','fit-fitted','fit-semi','shape-a','shoulder-natural','seam-side','seam-center','hem-straight','lining-basic'],
   details:['detail-pleat','detail-gathers','detail-bow','detail-slit','detail-binding','pocket-patch','closure-buttons','closure-snaps','closure-wraptie','belt-thin'],
   accessoires:['shoe-ballet','shoe-loafer','shoe-sandal','shoe-sneaker','bag-tote','scarf','headband','hosiery-opaque'],
   matieres:['material-cotton','material-poplin','material-twill'],
   motifs:['pattern-solid','pattern-stripe-fine']
  },
  lockedWorlds:[
   'corseterie','lingerie construite','maillots de bain','tailoring avancé','mariée avancée','traînes et voiles complexes','cabaret','danse et scène','Miss / concours','Cannes / tapis rouge','costume de parc à thème','construction historique','avant-garde','ornements couture avancés'
  ]
 };
 C.starterProfile=profile;
 C.isStarter=id=>C.starterIds.has(id);
 C.starterByCategory=cat=>C.items.filter(x=>x.category===cat&&C.starterIds.has(x.id));
 C.lockedAtStart=()=>C.items.filter(x=>!C.starterIds.has(x.id));
 window.HCAtelierStarterBase=profile;
 window.dispatchEvent(new CustomEvent('hc-atelier-starter-base-ready',{detail:{version:2,count:valid.length,colors:colors.length}}));
}
boot();
})();