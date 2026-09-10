/* Haute Couture Live — bootstrap Ville AURA + correctif Savoie 73 V4
   Le fichier est chargé par /ville pour tous les territoires : il initialise donc l'UI de lieu AURA,
   puis active la couche Savoie uniquement lorsque Marion est physiquement en 73.
   Focus carte != déplacement. Chargement séquentiel + attente explicite de HCLocalMap.
*/
(function(){'use strict';if(window.__HCTerritoryContextSavoieAddonV4)return;window.__HCTerritoryContextSavoieAddonV4=true;
const ctx=window.HCTerritoryContext;if(!ctx||!String(location.pathname).includes('/ville'))return;
const base=(document.currentScript&&document.currentScript.src)?new URL('.',document.currentScript.src):new URL('../',location.href);
function load(id,src){return new Promise((resolve,reject)=>{const old=document.getElementById(id);if(old){if(old.dataset.hcLoaded==='1'||old.readyState==='complete')return resolve(old);old.addEventListener('load',()=>resolve(old),{once:true});old.addEventListener('error',reject,{once:true});return}const s=document.createElement('script');s.id=id;s.src=new URL(src,base).href;s.async=false;s.addEventListener('load',()=>{s.dataset.hcLoaded='1';resolve(s)},{once:true});s.addEventListener('error',reject,{once:true});document.head.appendChild(s)})}
function waitForMap(timeout=8000){if(window.HCLocalMap)return Promise.resolve(window.HCLocalMap);return new Promise((resolve,reject)=>{const start=Date.now(),t=setInterval(()=>{if(window.HCLocalMap){clearInterval(t);resolve(window.HCLocalMap)}else if(Date.now()-start>=timeout){clearInterval(t);reject(new Error('HCLocalMap indisponible'))}},20)})}

/* Bootstrap commun : les médias sont chargés AVANT l'interface afin que la première ouverture soit déjà documentée. */
(async()=>{try{
 await waitForMap();
 await load('hcTerritorialPlaceMediaAURA','ville/territorial-place-media-aura-v1.js?v=20260910-aura-media2');
 await load('hcTerritorialPlaceInterfaceAURA','ville/territorial-place-interface-v1.js?v=20260910-aura-placeui1');
 window.dispatchEvent(new CustomEvent('hc-territorial-place-ui-runtime-ready',{detail:{media:true,interface:true}}));
}catch(err){console.error('[HC Ville UI loader]',err);window.dispatchEvent(new CustomEvent('hc-territory-load-error',{detail:{scope:'place-ui',message:String(err?.message||err)}}))}})();

const p=ctx.getPresence?.();if(String(p?.departmentCode||'')!=='73')return;
(async()=>{try{
 await load('hcTerritorialSignalRuntime','territorial-signal-runtime-v1.js?v=20260910-runtime8');
 await load('hcTerritorialLocalInteractionBridge','territorial-local-interaction-bridge-v1.js?v=20260910-localbridge2');
 await load('hcCityContentSelector','city-content-selector-v1.js?v=20260910-selector4');
 await load('hcCityContentRuntime','city-content-runtime-v1.js?v=20260910-cityruntime1');
 await load('hcTerritoryGameplayScript73','savoie-territorial-gameplay-v1.js?v=20260910-savoieplay3');
 await waitForMap();
 await load('hcTerritoryMapPack73','savoie-map-content-v1.js?v=20260910-savoiemap3');
 await load('hcSavoieHighResortsMap','savoie-high-resorts-map-v1.js?v=20260910-savoiestationsmap2');
 const city=String(p.city||'');
 const baseCities=['Chambéry','Aix-les-Bains','Albertville','Beaufort','Bourg-Saint-Maurice','Modane'];
 const highCities=['Courchevel','Méribel','Val Thorens','Tignes',"Val-d'Isère",'Val-d’Isère','La Plagne','Les Arcs','Séez','Saint-Jean-de-Maurienne'];
 if(baseCities.includes(city)){await load('hcSavoiePrimaryUniverse','savoie-primary-cities-universe-v1.js?v=20260910-savoieprimary3');await load('hcSavoiePrimaryBank','savoie-primary-cities-banks-v1.js?v=20260910-savoieprimarybank3')}
 if(highCities.includes(city)){await load('hcSavoieHighUniverse','savoie-high-resorts-universe-v1.js?v=20260910-savoiestations2');await load('hcSavoieHighBank','savoie-high-resorts-banks-v1.js?v=20260910-savoiestationsbank3');await load('hcSavoieHighResortsGameplayAddon','savoie-high-resorts-gameplay-addon-v1.js?v=20260910-savoiestationsplay3')}
 window.dispatchEvent(new CustomEvent('hc-savoie-runtime-ready',{detail:{departmentCode:'73',city}}));
}catch(err){console.error('[HC Savoie loader]',err);window.dispatchEvent(new CustomEvent('hc-territory-load-error',{detail:{departmentCode:'73',city:String(p.city||''),message:String(err?.message||err)}}))}})();
})();