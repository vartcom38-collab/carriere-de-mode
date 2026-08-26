/* Haute Couture Live — logement racine : shim de stabilisation.
   Ne surcharge aucune fonction du moteur principal.
   Il sécurise seulement le chargement des fonds GeoJSON avant index.html. */
(function(){
  'use strict';
  const BUILD='20260826-root-housing-geo-recovery2';

  try{
    localStorage.setItem('haute-couture-real-estate-api-endpoint','https://carriere-de-mode-visuals.vercel.app/api/real-estate-listings');
  }catch(e){}

  const nativeFetch=window.fetch.bind(window);
  const GEO_REDIRECTS={
    'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions-version-simplifiee.geojson':
      'https://geo.api.gouv.fr/regions?fields=nom,code&format=geojson&geometry=contour',
    'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson':
      'https://geo.api.gouv.fr/departements?fields=nom,code,codeRegion&format=geojson&geometry=contour'
  };

  window.fetch=async function(input,init){
    const url=typeof input==='string'?input:(input&&input.url)||'';
    const replacement=GEO_REDIRECTS[url];
    if(!replacement) return nativeFetch(input,init);

    try{
      const response=await nativeFetch(replacement,init);
      if(response && response.ok) return response;
    }catch(e){}

    return nativeFetch(input,init);
  };

  window.HCVisualEngine={
    build:BUILD,
    mode:'safe-passive-geo-recovery',
    active:false,
    geoRecovery:true
  };
})();
