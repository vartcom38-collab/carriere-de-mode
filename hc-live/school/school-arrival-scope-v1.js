/* Haute Couture Live — cadrage du guidage d'arrivée à l'école v1 */
(function(){
'use strict';
if(window.HCSchoolArrivalScope)return;
const FLOW='haute-couture-school-day1-flow-v1',PATH='haute-couture-start-path-v1';
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
const flow=read(FLOW),path=read(PATH);
const isSchoolPath=!path||path.type==='school';
const arrivalActive=isSchoolPath&&flow&&flow.phase!=='done';
const route=location.pathname;
function addCard(parent,label,title,text,href){const a=document.createElement('article');a.className='card';a.innerHTML=`<div class="label">${label}</div><h3>${title}</h3><p>${text}</p>`;a.onclick=()=>location.href=href;parent.appendChild(a)}
function ensureCityBridge(){
 if(!isSchoolPath||window.HCSchoolCityBridge||document.querySelector('[data-hc-school-city-bridge]'))return;
 const s=document.createElement('script');s.src='../school/school-city-bridge-v1.js?v=20260906-citybridge1';s.defer=true;s.dataset.hcSchoolCityBridge='1';document.head.appendChild(s);
}
function routeSchoolCity(){
 if(!isSchoolPath)return;
 document.querySelectorAll('a[href="../ville/"],a[href$="/ville/"]').forEach(a=>a.href='../school-city/');
 const city=document.getElementById('city');if(city)city.onclick=()=>location.href='../school-city/';
 document.querySelectorAll('.life-action,.soft,button').forEach(b=>{
   const t=(b.textContent||'').toLowerCase();
   if(t.includes('sortir un moment')||t.trim()==='la ville')b.onclick=()=>location.href='../school-city/';
 });
}
function freeSchoolHome(){
 if(!/\/school-home\/?$/i.test(route)||arrivalActive)return;
 const small=document.getElementById('smallTitle'),homeText=document.getElementById('homeText'),nextLabel=document.getElementById('nextLabel'),nextTitle=document.getElementById('nextTitle'),nextMeta=document.getElementById('nextMeta'),go=document.getElementById('goNext'),nav=document.getElementById('normalNav');
 if(small)small.textContent='Vie étudiante';if(homeText)homeText.textContent='Ta rentrée est passée. Ici, tu retrouves ton quotidien étudiant, mais tu peux désormais organiser ta vie d’école plus librement.';if(nextLabel)nextLabel.textContent='Aujourd’hui';if(nextTitle)nextTitle.textContent='Voir ce qui est prévu';if(nextMeta)nextMeta.textContent='Consulte ta journée si tu veux un fil conducteur, ou pars directement vers l’école, la ville ou tes outils.';if(go){go.textContent='Voir ma journée';go.onclick=()=>location.href='../school-day/'}
 if(nav){nav.classList.remove('hidden');if(!nav.querySelector('[data-free-school]')){addCard(nav,'Organisation','Mon emploi du temps','Voir les prochains cours et les rendus.','../school-planning/');nav.lastElementChild.dataset.freeSchool='1';addCard(nav,'Apprentissage','Mes révisions','Retrouver les notions et corrections de mes cours.','../school-review/');nav.lastElementChild.dataset.freeSchool='1';addCard(nav,'Vie scolaire','Ma vie d’école','Promo, événements et professeurs.','../school-life/');nav.lastElementChild.dataset.freeSchool='1'}nav.style.gridTemplateColumns='repeat(3,minmax(0,1fr))'}
 routeSchoolCity();
}
function freeSchoolDay(){
 if(!/\/school-day\/?$/i.test(route)||arrivalActive)return;
 const dayTitle=document.getElementById('dayTitle'),normal=document.getElementById('normal'),timeline=document.getElementById('timeline');if(dayTitle)dayTitle.textContent='Ta rentrée est passée : utilise cette page quand tu veux retrouver le fil de ta journée.';if(timeline)timeline.classList.add('hidden');
 if(normal){normal.classList.remove('hidden');const footer=normal.querySelector('.footer');if(footer&&!footer.querySelector('[data-free-school]')){[['Mon école','../school-campus/'],['La ville','../school-city/'],['Mes révisions','../school-review/'],["Vie d’école",'../school-life/']].forEach(([t,h])=>{const b=document.createElement('button');b.className='soft';b.textContent=t;b.dataset.freeSchool='1';b.onclick=()=>location.href=h;footer.appendChild(b)})}}
 routeSchoolCity();ensureCityBridge();
}
function protectCareer(){if(isSchoolPath)return;localStorage.removeItem(FLOW)}
function fixSchoolHomeShortcut(){if(!isSchoolPath)return;const btn=document.getElementById('hcgm-home');if(!btn)return;btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();location.href=(route.includes('/hc-live/')?'../school-home/':'school-home/')},{capture:true})}
protectCareer();setTimeout(()=>{freeSchoolHome();freeSchoolDay();routeSchoolCity();ensureCityBridge();fixSchoolHomeShortcut()},0);setTimeout(routeSchoolCity,650);
window.HCSchoolArrivalScope={arrivalActive,isSchoolPath};
})();