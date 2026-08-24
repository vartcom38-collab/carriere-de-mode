/* Haute Couture Live — charge Gard complet + enrichissements de Nîmes + traduction mode. */
(function(){
'use strict';
function load(src,attr,onload){if(document.querySelector('script['+attr+']')){onload&&onload();return}const s=document.createElement('script');s.src=src;s.defer=true;s.setAttribute(attr,'1');s.onload=()=>onload&&onload();s.onerror=()=>{console.warn('[Gard] chargement impossible: '+src);onload&&onload()};document.head.appendChild(s)}
load('../travel/france/departments/30.js?v=20260824-gard-total','data-hc-gard-base',()=>{
  load('../travel/france/departments/30-gard-complete-pack.js?v=20260824-gard-total','data-hc-gard-complete',()=>{
    load('tour-magne-v2.js?v=20260824-tour-v2','data-hc-tour-magne',()=>{
      load('rich-place-ui-maison-v2.js?v=20260824-maison-v3','data-hc-rich-maison-core');
      load('fashion-translation-patch.js?v=20260824-mode-v3','data-hc-fashion-translation');
    });
  });
});
})();