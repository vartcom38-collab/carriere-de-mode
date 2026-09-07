/* Haute Couture Live — nettoyage immersif Nîmes v1 */
(function(){
'use strict';
if(window.HCNimesImmersionCleanupV1)return;
function style(){if(document.getElementById('hcNimesImmersionCleanupStyle'))return;const s=document.createElement('style');s.id='hcNimesImmersionCleanupStyle';s.textContent=`
/* Les états relationnels restent dans les moteurs, pas comme compteurs de jeu. */
.ncv2-rel,.nbs-rel,.arel,.nbv3-note{font-variant-numeric:normal}
.ncv2-person .ncv2-rel,.nbs-card .nbs-rel,.nbs-copy .nbs-rel,.aperson .arel{letter-spacing:.02em}
.hc-hide-prototype-metric{display:none!important}
.hc-human-state{display:inline-flex;align-items:center;border:1px solid rgba(118,88,74,.18);background:rgba(255,255,255,.72);border-radius:999px;padding:6px 9px;font:800 8px Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6d584e}
`;document.head.appendChild(s)}
function humanize(text){return String(text||'').replace(/\s*[·|]\s*(?:relation|confiance)?\s*-?\d+(?:\/\d+)?\b/ig,'').replace(/RELATION\s*[·:]?\s*-?\d+/ig,'').replace(/CONFIANCE\s*-?\d+/ig,'').trim()}
function clean(){if(!/\/ville\/?/i.test(location.pathname))return;style();document.querySelectorAll('.ncv2-rel,.nbs-rel,.arel').forEach(el=>{const next=humanize(el.textContent);if(next&&next!==el.textContent.trim())el.textContent=next;el.classList.add('hc-human-state')});document.querySelectorAll('button').forEach(b=>{const t=(b.textContent||'').trim();if(/VOIR SA FICHE/i.test(t))b.textContent='MIEUX CONNAÎTRE';if(/VOIR SA FICHE PERSONNAGE/i.test(t))b.textContent='MIEUX CONNAÎTRE'});document.querySelectorAll('.nco-k').forEach(el=>{el.textContent=humanize(el.textContent)});}
function boot(){clean();const body=document.getElementById('npBody')||document.body;let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(clean,60)}).observe(body,{childList:true,subtree:true,characterData:true});window.addEventListener('hc-game-state',()=>setTimeout(clean,0))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.HCNimesImmersionCleanupV1={version:1,clean,humanize};
})();