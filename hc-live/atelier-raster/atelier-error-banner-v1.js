/* Haute Couture Live — Atelier error banner v1
   Affiche toute erreur HTTP de génération en bandeau fixe impossible à rater.
*/
(function(){
'use strict';
if(window.__HC_ATELIER_ERROR_BANNER_V1__)return;window.__HC_ATELIER_ERROR_BANNER_V1__=true;
const END='/api/generate-atelier-sketches';
function show(msg){let b=document.getElementById('hcAtelierErrorBanner');if(!b){b=document.createElement('div');b.id='hcAtelierErrorBanner';b.style.cssText='position:fixed;left:18px;right:18px;bottom:18px;z-index:2147483647;background:#7d1f1f;color:#fff;border:2px solid #b94a4a;border-radius:14px;padding:14px 16px;box-shadow:0 16px 40px #0004;font:700 12px/1.45 Arial;white-space:pre-wrap;word-break:break-word';document.body.appendChild(b)}b.textContent='ERREUR TECHNIQUE\n'+String(msg||'Erreur inconnue');}
const nativeFetch=window.fetch.bind(window);
window.fetch=async function(input,init){const url=String(typeof input==='string'?input:input?.url||'');try{const r=await nativeFetch(input,init);if(url.includes(END)&&!r.ok){let txt='';try{txt=await r.clone().text()}catch(_){}show('HTTP '+r.status+'\n'+(txt||r.statusText||'Réponse vide du serveur'));}return r}catch(err){if(url.includes(END))show('ERREUR RÉSEAU\n'+String(err?.message||err));throw err}}
new MutationObserver(()=>{const d=document.querySelector('#hcGcStatus details pre');if(d&&d.textContent.trim())show(d.textContent.trim())}).observe(document.documentElement,{subtree:true,childList:true,characterData:true});
})();