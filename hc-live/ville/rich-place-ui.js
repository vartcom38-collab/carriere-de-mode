/* Haute Couture Live — charge Gard complet + enrichissements de Nîmes + traduction mode. */
(function(){
'use strict';
function load(src,attr,onload){if(document.querySelector('script['+attr+']')){onload&&onload();return}const s=document.createElement('script');s.src=src;s.defer=true;s.setAttribute(attr,'1');s.onload=()=>onload&&onload();s.onerror=()=>{console.warn('[Gard] chargement impossible: '+src);onload&&onload()};document.head.appendChild(s)}
load('overlay-lifecycle-fix.js?v=20260824-overlay-fix-1','data-hc-overlay-lifecycle',()=>{
  load('../travel/france/france-territories.js?v=20260824-france-registry','data-hc-france-territories',()=>{
    load('../travel/france/departments/30.js?v=20260824-gard-total','data-hc-gard-base',()=>{
      load('../travel/france/departments/30-gard-complete-pack.js?v=20260824-gard-total','data-hc-gard-complete',()=>{
        load('../travel/france/france-discovery-search-v1.js?v=20260824-france-search-v1','data-hc-france-discovery',()=>{
          load('france-discovery-search-ui-v1.js?v=20260824-france-search-ui-v1','data-hc-france-discovery-ui');
        });
        load('nimes-local-life-v1.js?v=20260825-nimes-local-life2','data-hc-nimes-local-life',()=>{
          load('../travel/france/departments/gard-gameplay-engine.js?v=20260824-gard-total','data-hc-gard-gameplay');
          load('../travel/france/departments/gard-world-mechanics-v2.js?v=20260824-gard-world-v2','data-hc-gard-world-v2',()=>{
            load('../travel/france/cities/nimes-career-thread-v1.js?v=20260824-nimes-thread-v1','data-hc-nimes-thread');
            load('nimes-place-interfaces-v1.js?v=20260825-nimes-place-ui1','data-hc-nimes-place-ui',()=>{
              load('gard-map-layer-v1.js?v=20260825-gard-map2','data-hc-gard-map-layer',()=>{
                load('nimes-map-ephemera-v1.js?v=20260825-nimes-ephemera1','data-hc-nimes-ephemera');
              });
            });
          });
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
});
})();