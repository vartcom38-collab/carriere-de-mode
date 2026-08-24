/* Haute Couture Live — charge le carnet Maison Carrée existant puis la couche de traduction mode. */
(function(){
'use strict';
function load(src,attr){if(document.querySelector('script['+attr+']'))return;const s=document.createElement('script');s.src=src;s.defer=true;s.setAttribute(attr,'1');document.head.appendChild(s)}
load('rich-place-ui-maison-v2.js?v=20260824-mode-translation','data-hc-rich-maison-core');
load('fashion-translation-patch.js?v=20260824-mode-translation','data-hc-fashion-translation');
})();