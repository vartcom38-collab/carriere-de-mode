/* Haute Couture Live — accès Studio depuis Atelier v3 */
(function(){
'use strict';
if(window.__HC_ATELIER_CREATIONS_ACCESS_V3__)return;window.__HC_ATELIER_CREATIONS_ACCESS_V3__=true;
function loadWorkspace(){if(document.querySelector('script[data-hc-project-workspace]'))return;const s=document.createElement('script');s.src='./atelier-project-workspace-v1.js?v=20260902-project1';s.defer=true;s.setAttribute('data-hc-project-workspace','1');document.head.appendChild(s)}
function mount(){const head=document.querySelector('.hcv3-head');if(!head)return false;head.querySelectorAll('[data-hc-creations],[data-hc-folders]').forEach(x=>x.remove());loadWorkspace();return true}
let n=0;const t=setInterval(()=>{n++;if(mount()||n>60)clearInterval(t)},100);
})();