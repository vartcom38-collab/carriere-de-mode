/* Haute Couture Live — accès Studio depuis Chez moi v2 */
(function(){
'use strict';
if(window.__HC_HOME_CREATIONS_ACCESS_V2__)return;window.__HC_HOME_CREATIONS_ACCESS_V2__=true;
function button(kind,title,small,icon,href){const b=document.createElement('button');b.className='action-card primary';b.setAttribute('data-hc-studio-shortcut',kind);b.innerHTML=`<span class="icon">${icon}</span><b>${title}</b><small>${small}</small>`;b.onclick=()=>location.href=href;return b}
function mount(){const grid=document.querySelector('.actions-grid');if(!grid)return false;grid.querySelectorAll('[data-hc-creations]').forEach(x=>x.remove());if(grid.querySelector('[data-hc-studio-shortcut="creations"]'))return true;const creations=button('creations','Mes créations','Suivi des commandes, dossiers de réalisation et historique.','✦','../creations/?view=tracking');const folders=button('folders','Mes dossiers','Collections, clientes, concours, défilés et classements personnels.','▤','../creations/?view=folders');const atelier=[...grid.children].find(x=>/Atelier/i.test(x.textContent||''));if(atelier){atelier.insertAdjacentElement('afterend',folders);atelier.insertAdjacentElement('afterend',creations)}else{grid.append(creations,folders)}return true}
let n=0;const t=setInterval(()=>{n++;if(mount()||n>40)clearInterval(t)},100);
})();