/* Haute Couture Live — raccourci Collections dans Atelier v1 */
(function(){
'use strict';
if(window.__HC_COLLECTIONS_ACCESS_V1__)return;window.__HC_COLLECTIONS_ACCESS_V1__=true;
function mount(){const pop=document.getElementById('hcPwPop');if(!pop)return false;if(pop.querySelector('[data-go-collections]'))return true;const b=document.createElement('button');b.setAttribute('data-go-collections','1');b.textContent='MES COLLECTIONS';b.onclick=e=>{e.preventDefault();e.stopPropagation();location.href='../collections/'};const folders=pop.querySelector('[data-go="folders"]');folders?.insertAdjacentElement('afterend',b)||pop.prepend(b);return true}
let n=0;const t=setInterval(()=>{n++;if(mount()||n>50)clearInterval(t)},120);['hc-atelier-project-changed','hc-atelier-project-closed'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(mount,60)));
})();