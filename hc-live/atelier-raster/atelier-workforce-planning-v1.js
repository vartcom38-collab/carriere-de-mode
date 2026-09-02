/* Haute Couture Live — réseau couture + planning de production v1 */
(function(){
'use strict';
if(window.HCAtelierWorkforcePlanning)return;
const K={team:'haute-couture-atelier-workforce-v1',choice:'haute-couture-atelier-production-choice-v1',orders:'haute-couture-client-orders-v1'};
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch(_){return f}},write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(_){return false}};
function game(){try{return window.parent?.HCGame||window.top?.HCGame||window.HCGame||null}catch(_){return window.HCGame||null}}
const defaults=[
 {id:'self',name:'Moi-même',type:'self',rate:0,speed:1,quality:72,specialties:['retouches','montage simple'],available:true},
 {id:'camille',name:'Camille Roux',type:'partner',rate:38,speed:1.05,quality:84,specialties:['flou','robes','soie','mousseline'],available:true},
 {id:'sophie',name:'Sophie Martin',type:'partner',rate:46,speed:1.18,quality:91,specialties:['tailleur','corseterie','finitions main'],available:true},
 {id:'leila',name:'Leïla Benamar',type:'partner',rate:52,speed:.95,quality:94,specialties:['broderie','perles','ornements','haute couture'],available:true}
];
function team(){let t=read(K.team,null);if(!Array.isArray(t)||!t.length){t=defaults;write(K.team,t)}return t}
function selected(){const id=read(K.choice,'camille')||'camille';return team().find(x=>x.id===id)||team()[1]||team()[0]}
function setSelected(id){write(K.choice,id);window.dispatchEvent(new CustomEvent('hc-atelier-workforce-changed',{detail:selected()}));return selected()}
function reputation(){return Number(game()?.get?.().player?.reputation||0)}
function stylistRate(){const r=reputation();if(r<10)return 32;if(r<25)return 40;if(r<50)return 52;if(r<90)return 68;if(r<140)return 88;if(r<220)return 115;return 150}
function creativeHours(totalHours){return Math.max(3,Math.round(totalHours*.24*10)/10)}
function sewingHours(totalHours){return Math.max(0,Math.round((totalHours-creativeHours(totalHours))*10)/10)}
function nextWorkingStart(d){const x=new Date(d);if(x.getHours()<9)x.setHours(9,0,0,0);if(x.getHours()>=18){x.setDate(x.getDate()+1);x.setHours(9,0,0,0)}while(x.getDay()===0||x.getDay()===6){x.setDate(x.getDate()+1);x.setHours(9,0,0,0)}return x}
function iso(d){const p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:00`}
function buildBlocks(hours,{title='Production couture',assignee='Atelier',maxSession=3}={}){let left=Math.max(0,Number(hours)||0),cursor=nextWorkingStart(new Date(game()?.get?.().clock?.iso||new Date())),out=[];while(left>.01&&out.length<60){cursor=nextWorkingStart(cursor);const room=Math.max(.5,18-cursor.getHours()-cursor.getMinutes()/60),h=Math.min(left,maxSession,room);const end=new Date(cursor.getTime()+h*3600000);out.push({title:`${title} — ${assignee}`,type:'production',start:iso(cursor),end:iso(end),status:'planned',assignee,hours:Math.round(h*10)/10});left-=h;cursor=new Date(end.getTime()+60*60000)}return out}
function scheduleProduction(hours,opts={}){const blocks=buildBlocks(hours,opts);for(const b of blocks)game()?.schedule?.(b);return blocks}
function partnerCost(totalHours,worker=selected()){const sh=sewingHours(totalHours);return worker.type==='self'?0:Math.round(sh*Number(worker.rate||0)*100)/100}
function mount(){const h=document.getElementById('hcClientWorkflowV2');if(!h||!h.querySelector('#hcCw2Mode'))return;let box=h.querySelector('#hcWorkforceBox');if(!box){box=document.createElement('div');box.id='hcWorkforceBox';box.className='hc-cw2-card';box.style.marginTop='9px';h.querySelector('.hc-cw2-grid')?.insertAdjacentElement('afterend',box)}const cur=selected();box.innerHTML=`<small>FABRICATION</small><select id="hcWorkforceSelect" class="hc-cw2-input">${team().map(w=>`<option value="${w.id}" ${w.id===cur.id?'selected':''}>${w.type==='self'?'Je réalise moi-même':w.name+' · '+w.rate+' €/h'}</option>`).join('')}</select><div style="margin-top:6px;font:10px/1.45 Georgia,serif;color:#6e5d54">${cur.type==='self'?'Ton temps personnel est mobilisé pour la confection.':`Partenaire · qualité ${cur.quality}/100 · spécialités : ${cur.specialties.join(', ')}`}</div>`;box.querySelector('#hcWorkforceSelect').onchange=e=>{setSelected(e.target.value);window.HCAtelierQuoteEngine?.refresh?.()}}
window.addEventListener('hc-atelier-sketch-selected',()=>setTimeout(mount,40));window.addEventListener('hc-client-order',()=>setTimeout(mount,40));setTimeout(mount,1300);
window.HCAtelierWorkforcePlanning={version:1,team,selected,setSelected,reputation,stylistRate,creativeHours,sewingHours,partnerCost,buildBlocks,scheduleProduction,mount};
})();