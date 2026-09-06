/* Haute Couture Live — arrivée école : gameplay + ambiance v2 */
(function(){
'use strict';
if(window.HCSchoolArrivalGameplayV2)return;
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
const school=read('haute-couture-school-choice-v1');
const housing=read('haute-couture-school-housing-v1');
const pathChoice=read('haute-couture-start-path-v1');
const flow=read('haute-couture-school-day1-flow-v1');
const route=location.pathname;
const arrival=!!flow&&flow.phase!=='done';
const type=housing?.type||'residence';
const schoolPath=pathChoice?.type==='school'||/\/school(?:-|\/|$)/i.test(route);
const homePhotos={
 residence:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&fm=jpg&q=86&w=2200',
 colocation:'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&fm=jpg&q=86&w=2200',
 studio:'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&fm=jpg&q=86&w=2200'
};
const dayPhotos={
 morning:'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&fm=jpg&q=86&w=2200',
 tour:'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&fm=jpg&q=86&w=2200',
 course:'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&fm=jpg&q=86&w=2200',
 finish:'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&fm=jpg&q=86&w=2200',
 recap:'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&fm=jpg&q=86&w=2200',
 done:'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&fm=jpg&q=86&w=2200'
};
const style=document.createElement('style');
style.textContent=`
body.hc-arrival-mode #hc-global-menu-launch{display:none!important}
.hc-contextbar{position:absolute;z-index:12;left:max(4vw,28px);top:28px;display:flex;gap:8px;flex-wrap:wrap}
.hc-contextpill{padding:9px 12px;border:1px solid rgba(255,255,255,.35);border-radius:999px;background:rgba(27,18,14,.36);backdrop-filter:blur(12px);color:#fff;font:800 9px/1 Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase}
.hc-scene-note{margin-top:13px;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);font:13px/1.5 Georgia,serif;color:rgba(255,255,255,.9);max-width:620px}
#normalNav .card{position:relative;min-height:210px;overflow:hidden;color:#fff;background:#2c211c center/cover no-repeat!important;border:0!important;box-shadow:0 18px 46px rgba(36,25,20,.18)}
#normalNav .card:before{content:'';position:absolute;inset:0;background:linear-gradient(0deg,rgba(23,16,13,.78),rgba(23,16,13,.12) 68%)}
#normalNav .card>*{position:relative;z-index:1}#normalNav .card p{color:rgba(255,255,255,.84)!important}#normalNav .card .label{color:#f3c8c2!important}
#normalNav .card:nth-child(1){background-image:url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&fm=jpg&q=82&w=1100')!important}
#normalNav .card:nth-child(2){background-image:url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&fm=jpg&q=82&w=1100')!important}
#normalNav .card:nth-child(3){background-image:url('https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&fm=jpg&q=82&w=1100')!important}
#normalNav .card:nth-child(4){background-image:url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&fm=jpg&q=82&w=1100')!important}
#normalNav .card:nth-child(5){background-image:url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&fm=jpg&q=82&w=1100')!important}
#normalNav .card:nth-child(6){background-image:url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&fm=jpg&q=82&w=1100')!important}
.hc-why{margin-top:10px;font:italic 13px/1.45 Georgia,serif;color:#806e65}
@media(max-width:760px){.hc-contextbar{left:18px;top:18px}.hc-contextpill{font-size:8px}}
`;
document.head.appendChild(style);
function context(parent,items){if(!parent||parent.querySelector('.hc-contextbar'))return;const d=document.createElement('div');d.className='hc-contextbar';d.innerHTML=items.map(x=>`<span class="hc-contextpill">${x}</span>`).join('');parent.appendChild(d)}
function repairGlobalHome(){if(!schoolPath||!housing)return;const b=document.getElementById('hcgm-home');if(!b||b.dataset.schoolFixed==='1')return;const clone=b.cloneNode(true);clone.dataset.schoolFixed='1';clone.onclick=()=>{location.href=(location.pathname.includes('/hc-live/')?'../school-home/':'school-home/')};b.replaceWith(clone)}
if(arrival)document.body.classList.add('hc-arrival-mode');
if(/\/school-home\/?$/i.test(route)){
 const hero=document.querySelector('.hero');if(hero){hero.style.backgroundImage=`linear-gradient(90deg,rgba(25,18,15,.58),rgba(25,18,15,.08) 58%,rgba(25,18,15,.18)),url('${homePhotos[type]}')`;context(hero,[type==='colocation'?'Colocation':type==='studio'?'Studio':'Résidence',school?.city||'Vie étudiante',arrival?'Rentrée':'Chez moi']);}
 const p=document.getElementById('homeText');if(p&&!document.querySelector('.hc-scene-note')){const note=document.createElement('div');note.className='hc-scene-note';note.textContent=arrival?'Ton seul objectif pour l’instant : vivre ta rentrée. Le reste du jeu se débloquera une fois tes premiers repères pris.':'Ton logement reste un vrai lieu de vie : départs, retours, messages, travail personnel et temps libre peuvent venir s’y greffer.';p.insertAdjacentElement('afterend',note)}
}
if(/\/school-day\/?$/i.test(route)){
 const hero=document.querySelector('.hero');const phase=flow?.phase||'done';if(hero){hero.style.backgroundImage=`linear-gradient(90deg,rgba(25,18,15,.65),rgba(25,18,15,.18)),url('${dayPhotos[phase]||dayPhotos.done}')`;context(hero,[school?.name||'Mon école',school?.city||'',arrival?'Jour 1':'Vie scolaire'].filter(Boolean));}
 const meta=document.getElementById('nextMeta');if(meta&&!document.querySelector('.hc-why')){const why=document.createElement('div');why.className='hc-why';why.textContent=arrival?'Pourquoi maintenant ? Parce que cette étape te donne le prochain repère utile, sans t’obliger à explorer tout le jeu d’un coup.':'Tu peux suivre cette proposition ou organiser ta journée autrement.';meta.insertAdjacentElement('afterend',why)}
}
setTimeout(repairGlobalHome,250);setTimeout(repairGlobalHome,900);
window.HCSchoolArrivalGameplayV2={arrival,type,school,housing};
})();