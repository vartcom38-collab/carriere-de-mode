/* Haute Couture Live — désaccords pédagogiques de jury v1 */
(function(){
'use strict';
if(window.HCSchoolJuryDisagreementV1)return;
const match=location.pathname.match(/school-year(\d+)-project(\d+)/i);if(!match)return;
const JKEY='haute-couture-school-live-jury-v1';
const BKEY='haute-couture-school-open-brief-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const projectId=`year${Number(match[1])}-project${Number(match[2])}`;
function session(){return read(JKEY,{projects:{}})?.projects?.[projectId]||null}
function brief(){return read(BKEY,{projects:{}})?.projects?.[projectId]||{}}
function text(v){return String(v||'').trim()}
function has(v,n=28){return text(v).length>=n}
function disagreement(){const s=session();if(!s||!Array.isArray(s.jury)||s.jury.length<2)return null;const p=brief(),a=s.jury[0],b=s.jury[1];let axis='la piste retenue',left='',right='';
 if(has(p.tests)&&!has(p.decision,35)){axis='le niveau de preuve';left=`${a.name} estime que les essais sont suffisamment intéressants pour continuer cette piste.`;right=`${b.name} trouve que les essais existent, mais que la décision finale reste encore trop peu démontrée.`}
 else if(has(p.materials)&&has(p.directions,40)){axis='matière versus silhouette';left=`${a.name} défend la cohérence matière : pour elle, la piste mérite d’être poussée même si la silhouette n’est pas totalement résolue.`;right=`${b.name} pense au contraire que la relation au corps doit être clarifiée avant d’investir davantage la matière.`}
 else if(has(p.abandoned,24)){axis='l’abandon d’une piste';left=`${a.name} considère que l’abandon montre une vraie capacité de décision.`;right=`${b.name} se demande si la piste n’a pas été abandonnée trop tôt et voudrait voir un test supplémentaire avant de la fermer.`}
 else {axis='la direction générale';left=`${a.name} voit une intention assez claire pour poursuivre sans tout remettre à plat.`;right=`${b.name} trouve la piste prometteuse mais trop proche de la première intuition, et demande un écart plus radical.`}
 return{axis,left,right};}
const css=document.createElement('style');css.textContent=`.hcjd{margin:14px 0;padding:15px 16px;border-radius:14px;background:#fff8f1;border:1px solid #ddcfc5}.hcjd .k{font:800 8px/1 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#9b5d63}.hcjd h4{font:22px/1.15 Georgia,serif;font-weight:400;margin:6px 0 10px}.hcjd-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.hcjd-card{padding:12px 13px;border-radius:12px;background:#f5ece5;font:12px/1.5 Georgia,serif;color:#66564f}.hcjd-q{margin-top:12px;font:italic 13px/1.5 Georgia,serif;color:#6e5b53}@media(max-width:700px){.hcjd-grid{grid-template-columns:1fr}}`;document.head.appendChild(css);
function mount(){const d=disagreement(),root=document.getElementById('hc-live-jury');if(!d||!root||root.querySelector('.hcjd'))return;const box=document.createElement('section');box.className='hcjd';box.innerHTML=`<div class="k">Désaccord du jury</div><h4>Les profs ne lisent pas ${d.axis} de la même façon.</h4><div class="hcjd-grid"><div class="hcjd-card">${d.left}</div><div class="hcjd-card">${d.right}</div></div><div class="hcjd-q">À toi de défendre, nuancer ou rouvrir ta décision : le but n’est pas de trouver “la réponse du prof”, mais de montrer ce que tu peux réellement soutenir.</div>`;const panel=root.querySelector('.hclj-panel')||root.firstElementChild;panel?panel.insertAdjacentElement('afterend',box):root.appendChild(box)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();setTimeout(mount,500);new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true});
window.HCSchoolJuryDisagreementV1={active:true,disagreement,mount};
})();