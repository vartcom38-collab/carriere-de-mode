/* Haute Couture Live — raccourci Défilés v1 */
(function(){
'use strict';
if(window.__HC_RUNWAYS_ACCESS_V1__)return;window.__HC_RUNWAYS_ACCESS_V1__=true;
function mount(){const pop=document.getElementById('hcPwPop');if(!pop)return false;if(pop.querySelector('[data-go-runways]'))return true;const b=document.createElement('button');b.type='button';b.dataset.goRunways='1';b.textContent='DÉFILÉS';b.onclick=()=>location.href='../defiles/';const folders=[...pop.querySelectorAll('button')].find(x=>x.textContent.trim()==='MES DOSSIERS');(folders||pop.lastElementChild)?.insertAdjacentElement(folders?'afterend':'beforebegin',b);return true}
let n=0;const t=setInterval(()=>{n++;if(mount()||n>80)clearInterval(t)},100);window.addEventListener('hc-atelier-project-changed',()=>setTimeout(mount,30));})();