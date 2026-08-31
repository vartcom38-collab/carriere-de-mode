/* Haute Couture Live — base de départ Atelier v2.1.
   Petite base créative de départ : le reste doit être découvert/débloqué dans le monde, l'école et la carrière.
   Références créatives uniquement : ne crée pas de stock physique gratuit.
*/
(function(){
'use strict';
function boot(){
 const C=window.HCAtelierCatalog;if(!C||C.version<2){setTimeout(boot,60);return}
 if(window.HCAtelierStarterBase?.version>=2.1)return;
 const ids=[
  // Hauts essentiels
  'top-tshirt','top-debardeur','top-chemise',
  // Bas essentiels
  'skirt-droite','skirt-trapeze','pants-droit','jean-droit',
  // Une base de robe
  'dress-droite',
  // Manches fondamentales
  'sleeve-none','sleeve-short','sleeve-long',
  // Encolures / col simples
  'neck-round','neck-v','neck-square','collar-shirt',
  // Construction fondamentale
  'waist-natural','fit-fitted','fit-semi','shape-a','shoulder-natural',
  // Détails / finitions simples
  'detail-pleat','detail-gathers','detail-bow','pocket-patch','closure-buttons',
  // Accessoires de base
  'shoe-ballet','shoe-sneaker','bag-tote','scarf',
  // Matière / motif de base
  'material-cotton','pattern-solid'
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
  version:2.1,
  itemIds:valid,
  colors,
  physicalStockGranted:false,
  visibilityRule:'La bibliothèque ne montre jamais les références encore bloquées. Les familles et sous-catégories sans élément connu sont elles aussi invisibles.',
  intent:'Donner juste assez de vocabulaire pour les premières créations, puis faire grandir la bibliothèque par l’école, les lieux, les rencontres, les missions, les archives et les voyages.',
  groups:{
   hauts:['top-tshirt','top-debardeur','top-chemise'],
   bas:['skirt-droite','skirt-trapeze','pants-droit','jean-droit'],
   robes:['dress-droite'],
   manches:['sleeve-none','sleeve-short','sleeve-long'],
   encolures:['neck-round','neck-v','neck-square','collar-shirt'],
   construction:['waist-natural','fit-fitted','fit-semi','shape-a','shoulder-natural'],
   details:['detail-pleat','detail-gathers','detail-bow','pocket-patch','closure-buttons'],
   accessoires:['shoe-ballet','shoe-sneaker','bag-tote','scarf'],
   matieres:['material-cotton'],
   motifs:['pattern-solid']
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
 window.dispatchEvent(new CustomEvent('hc-atelier-starter-base-ready',{detail:{version:2.1,count:valid.length,colors:colors.length}}));
}
boot();
})();