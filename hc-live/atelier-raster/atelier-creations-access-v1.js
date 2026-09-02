/* Haute Couture Live — accès Studio depuis Atelier v7 */
(function(){
'use strict';
if(window.__HC_ATELIER_CREATIONS_ACCESS_V7__)return;window.__HC_ATELIER_CREATIONS_ACCESS_V7__=true;
function add(src,tag){if(document.querySelector('script['+tag+']'))return;const s=document.createElement('script');s.src=src;s.defer=true;s.setAttribute(tag,'1');document.head.appendChild(s)}
function mount(){const head=document.querySelector('.hcv3-head');if(!head)return false;head.querySelectorAll('[data-hc-creations],[data-hc-folders]').forEach(x=>x.remove());add('./atelier-project-workspace-v1.js?v=20260902-project5','data-hc-project-workspace');add('./atelier-project-guard-v1.js?v=20260902-project5','data-hc-project-guard');add('./atelier-personal-idea-v1.js?v=20260902-project5','data-hc-personal-idea');add('./atelier-project-ui-cleanup-v1.js?v=20260902-project5','data-hc-project-ui-cleanup');return true}
let n=0;const t=setInterval(()=>{n++;if(mount()||n>60)clearInterval(t)},100);
})();