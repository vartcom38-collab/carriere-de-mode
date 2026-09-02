/* Haute Couture Live — accès Studio depuis Atelier v2 */
(function(){
'use strict';
if(window.__HC_ATELIER_CREATIONS_ACCESS_V2__)return;window.__HC_ATELIER_CREATIONS_ACCESS_V2__=true;
function mount(){const head=document.querySelector('.hcv3-head');if(!head)return false;const home=head.querySelector('.hcv3-home');if(!home)return false;head.querySelectorAll('[data-hc-creations]').forEach(x=>x.remove());if(head.querySelector('[data-hc-studio-shortcut="creations"]'))return true;const c=document.createElement('button');c.type='button';c.className='hcv3-home';c.setAttribute('data-hc-studio-shortcut','creations');c.textContent='✦ MES CRÉATIONS';c.onclick=()=>location.href='../creations/?view=tracking';const f=document.createElement('button');f.type='button';f.className='hcv3-home';f.setAttribute('data-hc-studio-shortcut','folders');f.textContent='▤ MES DOSSIERS';f.onclick=()=>location.href='../creations/?view=folders';home.insertAdjacentElement('afterend',f);home.insertAdjacentElement('afterend',c);return true}
let n=0;const t=setInterval(()=>{n++;if(mount()||n>60)clearInterval(t)},100);
})();