/* Haute Couture Live — correctif de chargement territorial Savoie 73 V2
   Focus carte != déplacement. Chargement séquentiel pour éviter les courses entre moteur, ponts et addons.
*/
(function(){'use strict';if(window.__HCTerritoryContextSavoieAddonV2)return;window.__HCTerritoryContextSavoieAddonV2=true;const ctx=window.HCTerritoryContext;if(!ctx||!String(location.pathname).includes('/ville'))return;const p=ctx.getPresence?.();if(String(p?.departmentCode||'')!=='73')return;const base=(document.currentScript&&document.currentScript.src)?new URL('.',document.currentScript.src):new URL('../',location.href);
function load(id,src){return new Promise((resolve,reject)=>{const old=document.getElementById(id);if(old){if(old.dataset.hcLoaded==='1'||old.readyState==='complete')return resolve(old);old.addEventListener('load',()=>resolve(old),{once:true});old.addEventListener('error',reject,{once:true});return}const s=document.createElement('script');s.id=id;s.src=new URL(src,base).href;s.async=false;s.addEventListener('load',()=>{s.dataset.hcLoaded='1';resolve(s)},{once:true});s.addEventListener('error',reject,{once:true});document.head.appendChild(s)})}
(async()=>{try{
await load('hcTerritorialSignalRuntime','territorial-signal-runtime-v1.js?v=20260910-runtime8');
await load('hcTerritorialLocalInteractionBridge','territorial-local-interaction-bridge-v1.js?v=20260910-localbridge2');
await load('hcCityContentSelector','city-content-selector-v1.js?v=20260910-selector4');
await load('hcCityContentRuntime','city-content-runtime-v1.js?v=20260910-cityruntime1');
await load('hcTerritoryGameplayScript73','savoie-territorial-gameplay-v1.js?v=20260910-savoieplay3');
await load('hcTerritoryMapPack73','savoie-map-content-v1.js?v=20260910-savoiemap2');
await load('hcSavoieHighResortsMap','savoie-high-resorts-map-v1.js?v=20260910-savoiestationsmap1');
const city=String(p.city||'');const baseCities=['Chambéry','Aix-les-Bains','Albertville','Beaufort','Bourg-Saint-Maurice','Modane'];const highCities=['Courchevel','Méribel','Val Thorens','Tignes',"Val-d'Isère",'Val-d’Isère','La Plagne','Les Arcs','Séez','Saint-Jean-de-Maurienne'];
if(baseCities.includes(city)){await load('hcSavoiePrimaryUniverse','savoie-primary-cities-universe-v1.js?v=20260910-savoieprimary2');await load('hcSavoiePrimaryBank','savoie-primary-cities-banks-v1.js?v=20260910-savoieprimarybank2')}
if(highCities.includes(city)){await load('hcSavoieHighUniverse','savoie-high-resorts-universe-v1.js?v=20260910-savoiestations1');await load('hcSavoieHighBank','savoie-high-resorts-banks-v1.js?v=20260910-savoiestationsbank2');await load('hcSavoieHighResortsGameplayAddon','savoie-high-resorts-gameplay-addon-v1.js?v=20260910-savoiestationsplay2')}
window.dispatchEvent(new CustomEvent('hc-savoie-runtime-ready',{detail:{departmentCode:'73',city}}));
}catch(err){console.error('[HC Savoie loader]',err);window.dispatchEvent(new CustomEvent('hc-territory-load-error',{detail:{departmentCode:'73',city:String(p.city||''),message:String(err?.message||err)}}))}})();
})();