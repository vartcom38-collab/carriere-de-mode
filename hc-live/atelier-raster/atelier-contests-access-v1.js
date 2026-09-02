/* Haute Couture Live — raccourci Concours dans Atelier v1 */
(function(){
'use strict';
if(window.HCAtelierContestsAccess)return;
function mount(){const pop=document.getElementById('hcPwPop');if(!pop)return false;if(pop.querySelector('[data-go-contests]'))return true;const b=document.createElement('button');b.textContent='CONCOURS';b.setAttribute('data-go-contests','1');b.onclick=()=>location.href='../concours/';const collections=pop.querySelector('[data-go-collections]');if(collections)collections.insertAdjacentElement('afterend',b);else pop.insertBefore(b,pop.firstChild);return true}
let n=0;const t=setInterval(()=>{n++;if(mount()||n>80)clearInterval(t)},100);window.addEventListener('hc-atelier-project-changed',()=>setTimeout(mount,20));window.HCAtelierContestsAccess={version:1,mount};
})();