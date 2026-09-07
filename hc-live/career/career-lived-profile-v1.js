/* Haute Couture Live — carrière vécue v1 */
(function(){
'use strict';
if(window.HCCareerLivedProfileV1)return;
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function origin(){return window.HCCareerOriginV1?.get?.()||read('haute-couture-start-path-v1',{})||{}}
function knownPeople(){const pop=window.HCTerritorialPopulationV1;if(!pop)return[];const list=window.HCNimesPeople||[];return list.filter(p=>pop.personState?.(p.id)?.known).slice(0,6)}
function completedClients(){const orders=read('haute-couture-client-orders-v1',{});return Object.values(orders||{}).filter(o=>o&&typeof o==='object'&&['completed','fitting_ok'].includes(o.status)).slice(-4)}
function schoolTrace(){const o=origin();if(!(o.type==='school'||o.origin==='school'))return null;const c=window.HCCareerRouteContextV1?.get?.()||{};const names=(c.teachers||c.contacts||[]).map(x=>x.name||x.title||x).filter(Boolean);return names.length?`Ton passé d’école reste vivant à travers ${names.slice(0,2).join(' et ')}.`:'Ton passage par l’école fait partie de ton histoire professionnelle, mais rien n’est inventé au-delà de ce que tu y as réellement vécu.'}
function nextDirection(profile){if(profile.stage==='distinct')return `Tu pourrais approfondir cette direction, ou au contraire provoquer un contre-pied pour éviter qu’elle ne devienne une étiquette trop étroite.`;if(profile.stage==='emerging')return `Cette direction revient assez pour être remarquée. Une prochaine commande ou collaboration peut la renforcer — ou l’ouvrir ailleurs.`;return `Aucune spécialisation ne s’impose encore. C’est un bon moment pour accepter des expériences très différentes.`}
function mount(){
 if(!/(\/carriere\/|\/career\/|opportunites\.html)/i.test(location.pathname))return;
 const profile=window.HCCareerEmergentIdentityV1?.publicProfile?.();if(!profile)return setTimeout(mount,180);
 if(document.getElementById('hcCareerLivedProfile'))return;
 const clients=completedClients(),people=knownPeople(),school=schoolTrace();
 const host=document.createElement('section');host.id='hcCareerLivedProfile';host.innerHTML=`<div class="hclp-ey">TA CARRIÈRE AUJOURD’HUI</div><div class="hclp-grid"><article><h2>Ce qui commence à te définir</h2><p>${esc(profile.sentence)}</p>${profile.secondary?.length?`<small>D’autres fils restent présents : ${esc(profile.secondary.join(' · '))}</small>`:''}</article><article><h2>Ce qui existe déjà autour de toi</h2><p>${clients.length?`${clients.length} commande${clients.length>1?'s':''} a laissé une vraie relation client derrière elle.`:'Ta clientèle est encore en train de se construire.'}</p><p>${people.length?`${people.length} personne${people.length>1?'s':''} de ton réseau local te connaissent réellement.`:'Ton réseau local reste encore très ouvert.'}</p>${school?`<p>${esc(school)}</p>`:''}</article><article><h2>La prochaine direction possible</h2><p>${esc(nextDirection(profile))}</p><small>Ce n’est pas un objectif imposé. C’est une lecture de ce que ta partie a déjà produit.</small></article></div>`;
 const style=document.createElement('style');style.textContent=`#hcCareerLivedProfile{margin:18px auto;width:min(1180px,94vw);padding:20px;border-radius:24px;background:rgba(255,250,244,.94);border:1px solid rgba(113,75,59,.16);box-shadow:0 18px 45px rgba(60,40,30,.10);font-family:Georgia,serif}.hclp-ey{font:800 9px Arial,sans-serif;letter-spacing:.15em;color:#985762;margin-bottom:12px}.hclp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.hclp-grid article{padding:16px;border-radius:17px;background:#fffdf9;border:1px solid rgba(113,75,59,.13)}.hclp-grid h2{font:25px/1.03 Georgia,serif;font-weight:400;margin:0 0 9px}.hclp-grid p{font:13px/1.55 Georgia,serif;color:#65564d}.hclp-grid small{font:11px/1.5 Georgia,serif;color:#8a766a}@media(max-width:850px){.hclp-grid{grid-template-columns:1fr}}`;document.head.appendChild(style);
 const target=document.querySelector('main,.shell,.page,.container')||document.body;target.prepend(host);
}
function boot(){mount();setTimeout(mount,450);window.addEventListener('hc-career-identity',()=>setTimeout(()=>{document.getElementById('hcCareerLivedProfile')?.remove();mount()},40))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.HCCareerLivedProfileV1={version:1,mount};
})();