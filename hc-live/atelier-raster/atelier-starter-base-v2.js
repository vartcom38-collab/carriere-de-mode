/* Haute Couture Live — base de départ Atelier v2.2.
   Starter volontairement petit : uniquement les références simples disponibles au lancement.
   Tout le reste doit être découvert/débloqué dans le monde, l'école et la carrière.
   Références créatives uniquement : ne crée pas de stock physique gratuit.
*/
(function(){
'use strict';
function boot(){
 const C=window.HCAtelierCatalog;if(!C||C.version<2){setTimeout(boot,60);return}
 if(window.HCAtelierStarterBase?.version>=2.2)return;
 const ids=[
  // HAUTS — petite garde-robe de départ
  'top-tshirt','top-debardeur','top-caraco','top-chemise','top-blouse',
  // BAS
  'skirt-droite','skirt-trapeze','skirt-longue','pants-droit','pants-large','jean-droit','short-classique',
  // ROBES simples
  'dress-droite','dress-trapeze','dress-chemise',
  // MANCHES fondamentales
  'sleeve-none','sleeve-short','sleeve-long',
  // ENCOLURES / COL simples
  'neck-round','neck-v','neck-square','collar-shirt',
  // CONSTRUCTION fondamentale
  'waist-natural','fit-fitted','fit-semi','shape-a','shoulder-natural',
  // DÉTAILS / FINITIONS simples
  'detail-pleat','detail-gathers','detail-bow','pocket-patch','closure-buttons',
  // ACCESSOIRES de base
  'shoe-ballet','shoe-sneaker','bag-tote','scarf',
  // MATIÈRES / MOTIFS de départ
  'material-cotton','material-poplin','material-jersey','pattern-solid','pattern-stripe-fine'
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
  version:2.2,
  itemIds:valid,
  colors,
  physicalStockGranted:false,
  visibilityRule:'La bibliothèque ne montre jamais les références encore bloquées. Une famille ou une sous-catégorie sans élément connu reste entièrement invisible.',
  visualRule:'Les vignettes techniques utilisent de préférence une photo produit sans personne, élément seul, fond neutre. La couleur de la photo sert uniquement de référence visuelle : la couleur finale est choisie ensuite dans l’Atelier.',
  intent:'Donner une petite base suffisamment variée pour commencer à créer, puis faire grandir la bibliothèque par l’école, les lieux, les rencontres, les missions, les archives et les voyages.',
  groups:{
   hauts:['top-tshirt','top-debardeur','top-caraco','top-chemise','top-blouse'],
   bas:['skirt-droite','skirt-trapeze','skirt-longue','pants-droit','pants-large','jean-droit','short-classique'],
   robes:['dress-droite','dress-trapeze','dress-chemise'],
   manches:['sleeve-none','sleeve-short','sleeve-long'],
   encolures:['neck-round','neck-v','neck-square','collar-shirt'],
   construction:['waist-natural','fit-fitted','fit-semi','shape-a','shoulder-natural'],
   details:['detail-pleat','detail-gathers','detail-bow','pocket-patch','closure-buttons'],
   accessoires:['shoe-ballet','shoe-sneaker','bag-tote','scarf'],
   matieres:['material-cotton','material-poplin','material-jersey'],
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
 window.dispatchEvent(new CustomEvent('hc-atelier-starter-base-ready',{detail:{version:2.2,count:valid.length,colors:colors.length}}));
}
boot();
})();