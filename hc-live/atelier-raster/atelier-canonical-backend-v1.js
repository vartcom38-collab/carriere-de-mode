/* Haute Couture Live — canonical backend v1
   Redirige uniquement l'ancien alias Vercel vers le domaine Production courant.
*/
(function(){
'use strict';
if(window.__HC_CANONICAL_BACKEND_V1__)return;
window.__HC_CANONICAL_BACKEND_V1__=true;
const OLD='https://carriere-de-mode-visuals-vartcom38-7358s-projects.vercel.app';
const LIVE='https://carriere-de-mode-visuals.vercel.app';
const nativeFetch=window.fetch.bind(window);
window.fetch=function(input,init){
  try{
    if(typeof input==='string'&&input.startsWith(OLD)) input=LIVE+input.slice(OLD.length);
    else if(input instanceof Request&&input.url.startsWith(OLD)) input=new Request(LIVE+input.url.slice(OLD.length),input);
  }catch(_){}
  return nativeFetch(input,init);
};
console.info('[Atelier] backend production canonique actif:',LIVE);
})();