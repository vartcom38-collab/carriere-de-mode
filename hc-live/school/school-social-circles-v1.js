/* Haute Couture Live — cercles sociaux souples et recomposables v1 */
(function(){
'use strict';
if(window.HCSchoolSocialCirclesV1)return;
const AKEY='haute-couture-school-academic-v1',CKEY='haute-couture-school-community-v1',SKEY='haute-couture-school-social-outside-v1',KEY='haute-couture-school-social-circles-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}},write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
function academic(){return read(AKEY,{year:1,week:1})}
function periodKey(){const a=academic();return `y${a.year}-b${Math.floor((Number(a.week||1)-1)/8)+1}`}
function students(){return window.HCSchoolCommunity?.students||[]}
function state(){const s=read(KEY,{version:1,periods:{}});s.periods=s.periods||{};return s}
function relationScore(id){const c=read(CKEY,{relationships:{}}),r=c.relationships?.[id];if(!r?.met)return-99;return Number(r.affinity||0)+Number(r.trust||0)*2+Math.min(6,(r.history||[]).length)}
function outsideScore(id){const s=read(SKEY,{history:[]});return (s.history||[]).filter(h=>h.personId===id&&h.status==='done').length*2}
function build(){const s=state(),key=periodKey();if(s.periods[key])return s.periods[key];const list=students().map(p=>({...p,score:relationScore(p.id)+outsideScore(p.id)})).filter(p=>p.score>=3).sort((a,b)=>b.score-a.score);if(list.length<2){s.periods[key]={key,members:[],label:'Cercle encore ouvert'};write(KEY,s);return s.periods[key]}const a=academic(),seed=(Number(a.year||1)*97+Number(a.week||1)*31)%list.length;const rotated=list.slice(seed).concat(list.slice(0,seed));const members=rotated.slice(0,Math.min(4,Math.max(2,rotated.filter(x=>x.score>=5).length||2))).map(x=>x.id);s.periods[key]={key,members,label:members.length>=4?'Petit groupe régulier':'Quelques affinités qui reviennent'};write(KEY,s);return s.periods[key]}
function names(){const p=build();return p.members.map(id=>students().find(x=>x.id===id)?.name).filter(Boolean)}
function mount(){if(!/school-life/.test(location.pathname.toLowerCase()))return;const ns=names();if(!ns.length)return;if(document.getElementById('hc-social-circle'))return;const host=document.querySelector('#hc-relation-evolution,.panel');if(!host)return;const box=document.createElement('div');box.id='hc-social-circle';box.style.cssText='margin:10px 0 0;padding:12px 14px;border-radius:14px;background:#eef3f0;border-left:3px solid #55786e;font:13px/1.5 Georgia,serif;color:#53655f';box.innerHTML=`<b style="font:800 9px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase">Cercle qui se dessine</b><br>${ns.join(', ')}. Ce groupe n’est pas définitif : il peut se recomposer avec les semaines, les projets et les habitudes.`;host.appendChild(box)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,220));else setTimeout(mount,220);
window.HCSchoolSocialCirclesV1={version:1,state,build,names,mount,storageKey:KEY};
})();