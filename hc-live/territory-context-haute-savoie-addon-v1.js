/* Haute Couture Live — correctif chargement territorial Haute-Savoie 74 V2
   Focus carte != déplacement. Chargement séquentiel + attente explicite de HCLocalMap.
*/
(function(){'use strict';if(window.__HCTerritoryContextHauteSavoieAddonV2)return;window.__HCTerritoryContextHauteSavoieAddonV2=true;
const ctx=window.HCTerritoryContext;if(!ctx||!String(location.pathname).includes('/ville'))return;
let p=ctx.getPresence?.();const city=String(p?.city||''),deptName=String(p?.departmentName||p?.department||'');
const known=['Annecy','Chamonix-Mont-Blanc','Le Grand-Bornand','Châtel','Megève','Évian-les-Bains','Thonon-les-Bains','Morzine','Avoriaz','La Clusaz','Cluses','Sallanches','Saint-Gervais-les-Bains','Samoëns','Yvoire'];
const is74=String(p?.departmentCode||'')==='74'||/Haute[- ]Savoie/i.test(deptName)||known.includes(city);if(!is74)return;
if(String(p?.departmentCode||'')!=='74'&&ctx.setPresence){try{ctx.setPresence({...p,departmentCode:'74',departmentName:'Haute-Savoie'},p?.reason||'visit');p=ctx.getPresence?.()||p}catch(_){}}
const base=(document.currentScript&&document.currentScript.src)?new URL('.',document.currentScript.src):new URL('../',location.href);
function load(id,src){return new Promise((resolve,reject)=>{const old=document.getElementById(id);if(old){if(old.dataset.hcLoaded==='1'||old.readyState==='complete')return resolve(old);old.addEventListener('load',()=>resolve(old),{once:true});old.addEventListener('error',reject,{once:true});return}const s=document.createElement('script');s.id=id;s.src=new URL(src,base).href;s.async=false;s.addEventListener('load',()=>{s.dataset.hcLoaded='1';resolve(s)},{once:true});s.addEventListener('error',reject,{once:true});document.head.appendChild(s)})}
function waitForMap(timeout=5000){if(window.HCLocalMap)return Promise.resolve(window.HCLocalMap);return new Promise((resolve,reject)=>{const start=Date.now(),t=setInterval(()=>{if(window.HCLocalMap){clearInterval(t);resolve(window.HCLocalMap)}else if(Date.now()-start>=timeout){clearInterval(t);reject(new Error('HCLocalMap indisponible'))}},20)})}
(async()=>{try{
 await load('hcTerritorialSignalRuntime','territorial-signal-runtime-v1.js?v=20260910-runtime8');
 await load('hcTerritorialLocalInteractionBridge','territorial-local-interaction-bridge-v1.js?v=20260910-localbridge2');
 await load('hcCityContentSelector','city-content-selector-v1.js?v=20260910-selector4');
 await load('hcCityContentRuntime','city-content-runtime-v1.js?v=20260910-cityruntime1');
 await load('hcTerritoryGameplayScript74','haute-savoie-territorial-gameplay-v1.js?v=20260910-hautesavoieplay2');
 await waitForMap();
 await load('hcTerritoryMapPack74','haute-savoie-map-content-v1.js?v=20260910-hautesavoiemap2');
 await load('hcHauteSavoieSecondaryMap','haute-savoie-secondary-map-v1.js?v=20260910-hautesavoie2map2');
 await load('hcHauteSavoieCityUniverse','haute-savoie-city-universe-v1.js?v=20260910-hautesavoieuniverse2');
 await load('hcHauteSavoieSecondaryUniverse','haute-savoie-secondary-universe-v1.js?v=20260910-hautesavoie2universe2');
 await load('hcHauteSavoieCityBank','haute-savoie-city-banks-v1.js?v=20260910-hautesavoiebank2');
 await load('hcHauteSavoieSecondaryBank','haute-savoie-secondary-banks-v1.js?v=20260910-hautesavoie2bank2');
 window.dispatchEvent(new CustomEvent('hc-haute-savoie-runtime-ready',{detail:{departmentCode:'74',city:String(p?.city||city)}}));
}catch(err){console.error('[HC Haute-Savoie loader]',err);window.dispatchEvent(new CustomEvent('hc-territory-load-error',{detail:{departmentCode:'74',city:String(p?.city||city),message:String(err?.message||err)}}))}})();
})();