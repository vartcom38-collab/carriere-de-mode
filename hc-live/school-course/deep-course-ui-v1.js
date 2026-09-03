/* Haute Couture Live — enrichit l'écran cours avec le contenu pédagogique approfondi. */
(function(){
'use strict';
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function render(){
 const root=document.getElementById('app'); if(!root||!window.HCDeepCourses)return;
 const id=new URLSearchParams(location.search).get('id')||'w1-welcome',d=HCDeepCourses.get(id); if(!d)return;
 const card=document.createElement('section');card.className='card hc-deep-course';
 const vocab=(d.vocabulary||[]).map(([a,b])=>`<div style="padding:10px 0;border-top:1px solid #e2d3c7"><b>${esc(a)}</b><br><span style="font:13px/1.55 Georgia,serif;color:#5f5048">${esc(b)}</span></div>`).join('');
 const chapters=(d.chapters||[]).map(x=>`<div class="lesson"><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div>`).join('');
 const mistakes=(d.mistakes||[]).map(x=>`<li>${esc(x)}</li>`).join('');
 const practices=(d.guidedPractice||[]).map(x=>`<div style="margin:14px 0;padding:15px;border-radius:14px;background:#f4ece6"><b>${esc(x.title)}</b><ol>${x.steps.map(s=>`<li style="font:13px/1.55 Georgia,serif;color:#5f5048;margin:5px 0">${esc(s)}</li>`).join('')}</ol></div>`).join('');
 const progression=d.progression?`<h3>Progression de la matière</h3><ol>${d.progression.map(x=>`<li style="font:14px/1.55 Georgia,serif;color:#5f5048">${esc(x)}</li>`).join('')}</ol>`:'';
 card.innerHTML=`<div style="font:900 9px Arial;letter-spacing:.14em;color:#df7864;margin-bottom:8px">COURS APPROFONDI</div><h2>Objectifs pédagogiques</h2><ul>${(d.objectives||[]).map(x=>`<li style="font:14px/1.55 Georgia,serif;color:#5f5048">${esc(x)}</li>`).join('')}</ul><h2 style="margin-top:26px">Vocabulaire professionnel</h2>${vocab}<h2 style="margin-top:28px">Le cours en profondeur</h2>${chapters}<h2 style="margin-top:28px">Erreurs fréquentes</h2><ul>${mistakes}</ul><h2 style="margin-top:28px">Pratique guidée</h2>${practices}${progression}<div style="margin-top:24px;padding:18px;border-radius:16px;background:#edf4f2"><b>TRAVAIL PERSONNEL</b><p>${esc(d.homework||'')}</p>${d.discoveryRule?`<p><b>Important :</b> ${esc(d.discoveryRule)}</p>`:''}${d.stylusRoute?`<button class="btn draw" onclick="location.href='${esc(d.stylusRoute)}'">FAIRE LA PRATIQUE AU STYLET</button>`:''}</div>`;
 const first=root.querySelector('.card'); if(first)first.insertAdjacentElement('afterend',card);else root.appendChild(card);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else setTimeout(render,0);
})();