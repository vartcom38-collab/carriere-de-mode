/* Haute Couture Live — logement racine : shim de stabilisation.
   IMPORTANT : ce fichier ne surcharge plus aucune fonction du moteur principal.
   Il laisse index.html initialiser seul la carte, les filtres et la navigation.
   Le flux immobilier réel sera rebranché ensuite dans une couche isolée. */
(function(){
  'use strict';
  const BUILD='20260826-root-housing-safe1';
  try{
    localStorage.setItem('haute-couture-real-estate-api-endpoint','https://carriere-de-mode-visuals.vercel.app/api/real-estate-listings');
  }catch(e){}
  window.HCVisualEngine={
    build:BUILD,
    mode:'safe-passive',
    active:false
  };
})();
