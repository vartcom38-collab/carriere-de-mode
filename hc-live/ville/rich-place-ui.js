/* Haute Couture Live — charge les enrichissements de Nîmes puis la couche de traduction mode. */
(function(){
'use strict';
function load(src,attr,onload){if(document.querySelector('script['+attr+']')){onload&&onload();return}const s=document.createElement('script');s.src=src;s.defer=true;s.setAttribute(attr,'1');s.onload=()=>onload&&onload();document.head.appendChild(s)}
load('tour-magne-v2.js?v=20260824-tour-v2','data-hc-tour-magne',()=>{
  load('rich-place-ui-maison-v2.js?v=20260824-maison-v3','data-hc-rich-maison-core');
  load('fashion-translation-patch.js?v=20260824-mode-v3','data-hc-fashion-translation');
});
})();