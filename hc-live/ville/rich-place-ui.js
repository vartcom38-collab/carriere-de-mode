/* Haute Couture Live — charge Gard complet + enrichissements de Nîmes + traduction mode. */
(function(){
'use strict';
function load(src,attr,onload){if(document.querySelector('script['+attr+']')){onload&&onload();return}const s=document.createElement('script');s.src=src;s.defer=true;s.setAttribute(attr,'1');s.onload=()=>onload&&onload();s.onerror=()=>{console.warn('[Gard] chargement impossible: '+src);onload&&onload()};document.head.appendChild(s)}
load('overlay-lifecycle-fix.js?v=20260824-overlay-fix-1','data-hc-overlay-lifecycle',()=>{
  load('../travel/france/departments/30.js?v=20260824-gard-total','data-hc-gard-base',()=>{
    load('../travel/france/departments/30-gard-complete-pack.js?v=20260824-gard-total','data-hc-gard-complete',()=>{
      load('nimes-local-life-v1.js?v=20260824-nimes-local-life','data-hc-nimes-local-life',()=>{
        load('../travel/france/departments/gard-gameplay-engine.js?v=20260824-gard-total','data-hc-gard-gameplay');
        load('../travel/france/departments/gard-world-mechanics-v2.js?v=20260824-gard-world-v2','data-hc-gard-world-v2');
        load('gard-map-layer-v1.js?v=20260824-gard-map-v1','data-hc-gard-map-layer');
      });
      load('tour-magne-v2.js?v=20260824-tour-v2','data-hc-tour-magne',()=>{
        load('rich-place-ui-maison-v2.js?v=20260824-maison-v3','data-hc-rich-maison-core',()=>{
          load('fashion-translation-patch.js?v=20260824-mode-v3','data-hc-fashion-translation');
          load('nimes-heritage-expansion-v1.js?v=20260824-nimes-core-roman','data-hc-nimes-heritage-expansion');
          load('nimes-textile-museums-v1.js?v=20260824-nimes-textile-museums','data-hc-nimes-textile-museums');
          load('nimes-city-culture-v1.js?v=20260824-nimes-city-culture','data-hc-nimes-city-culture');
        });
      });
    });
  });
});
})();