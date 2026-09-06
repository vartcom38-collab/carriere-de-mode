/* Haute Couture Live — école ↔ ville pédagogique v1 */
(function(){
'use strict';
if(window.HCSchoolCityBridge)return;
const STORE='haute-couture-school-city-tasks-v1';
const readJSON=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))??f}catch(_){return f}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const templates={
 'w1-textile':{title:'Observer des matières en ville',subtitle:'Prolongement facultatif · Textile',cats:['fabric'],prompt:'Va voir de vraies matières et compare leur surface, leur souplesse, leur poids visuel et leur tombé. Tu n’as pas besoin d’acheter.',trace:'Une observation textile faite hors de l’école pourra nourrir ton carnet.'},
 'w1-culture':{title:'Chercher une vraie référence',subtitle:'Prolongement facultatif · Culture mode',cats:['culture','libraries'],prompt:'Choisis un lieu culturel ou documentaire et cherche une référence que tu peux situer : source, contexte, date ou usage. L’objectif n’est pas de copier, mais de comprendre.',trace:'La référence choisie pourra rejoindre ton carnet de recherche.'}
};
function all(){return readJSON(STORE,[])}
function save(v){write(STORE,v)}
function ensureFromCompleted(){
 const L=window.HCSchoolLife;if(!L?.state)return all();
 const completed=L.state().completed||{},tasks=all();let changed=false;
 Object.keys(templates).forEach(id=>{
   if(!completed[id]||tasks.some(t=>t.courseId===id))return;
   const t=templates[id];tasks.push({id:'city-'+id,courseId:id,...t,status:'available',createdAt:new Date().toISOString()});changed=true;
 });
 if(changed)save(tasks);return tasks;
}
function active(){return ensureFromCompleted().find(t=>t.status==='active')||null}
function available(){return ensureFromCompleted().filter(t=>t.status==='available')}
function start(id){const tasks=all(),i=tasks.findIndex(t=>t.id===id);if(i<0)return null;tasks.forEach(t=>{if(t.status==='active')t.status='available'});tasks[i].status='active';tasks[i].startedAt=new Date().toISOString();save(tasks);return tasks[i]}
function complete(id,place){const tasks=all(),i=tasks.findIndex(t=>t.id===id);if(i<0)return null;tasks[i].status='done';tasks[i].place=place||null;tasks[i].completedAt=new Date().toISOString();save(tasks);return tasks[i]}
function inject(){
 if(!/\/school-day\/?$/i.test(location.pathname))return;
 const flow=readJSON('haute-couture-school-day1-flow-v1',null);if(flow&&flow.phase!=='done')return;
 if(document.querySelector('[data-hc-city-bridge]'))return;
 const tasks=available();if(!tasks.length)return;
 const root=document.querySelector('.wrap')||document.querySelector('main');if(!root)return;
 const t=tasks[0],box=document.createElement('section');box.dataset.hcCityBridge='1';
 box.style.cssText='margin-top:22px;border-radius:24px;overflow:hidden;background:linear-gradient(90deg,rgba(28,20,17,.78),rgba(28,20,17,.18)),url(https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&fm=jpg&q=82&w=1600) center/cover;color:white;padding:28px;min-height:210px;display:flex;align-items:flex-end;box-shadow:0 18px 50px rgba(45,30,23,.14)';
 box.innerHTML=`<div style="max-width:720px"><div style="font:800 9px Arial;letter-spacing:.16em;text-transform:uppercase;color:#f0c7c0">${t.subtitle}</div><div style="font:36px/1.02 Georgia,serif;margin:10px 0">${t.title}</div><div style="font:14px/1.55 Georgia,serif;color:rgba(255,255,255,.88)">${t.prompt}</div><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px"><button data-go style="border:0;border-radius:999px;background:#fffaf5;color:#241b17;padding:13px 17px;font:800 10px Arial;letter-spacing:.06em;text-transform:uppercase;cursor:pointer">Continuer ce cours en ville</button><button data-later style="border:1px solid rgba(255,255,255,.45);border-radius:999px;background:transparent;color:white;padding:13px 17px;font:800 10px Arial;letter-spacing:.06em;text-transform:uppercase;cursor:pointer">Plus tard</button></div></div>`;
 box.querySelector('[data-go]').onclick=()=>{start(t.id);location.href='../school-city/'};
 box.querySelector('[data-later]').onclick=()=>box.remove();root.appendChild(box);
}
setTimeout(()=>{ensureFromCompleted();inject()},450);
window.addEventListener('hc-school-course-completed',()=>{ensureFromCompleted();inject()});
window.HCSchoolCityBridge={all,active,available,start,complete,ensureFromCompleted};
})();