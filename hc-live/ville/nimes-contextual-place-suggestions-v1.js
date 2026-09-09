/* Haute Couture Live — suggestions contextuelles de lieux Nîmes v1
   Fait remonter quelques lieux sans exposer toute la base de données.
*/
(function(){
'use strict';
if(window.HCNimesContextualPlaceSuggestionsV1)return;
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const $=s=>document.querySelector(s);
const PLACE_META={
 'Café des Croquis':{intent:['wander','people'],why:'Un endroit simple pour faire une pause et laisser une rencontre arriver.'},
 'Brocante textile':{intent:['wander','material','book'],why:'Pour regarder les matières autrement et peut-être tomber sur une pièce singulière.'},
 'Mercerie':{intent:['material','project'],why:'Utile si une idée a besoin de devenir concrète.'},
 'Arènes de Nîmes':{intent:['beauty','book'],why:'Une référence forte de structure, répétition et proportions.'},
 'Maison Carrée':{intent:['beauty','book'],why:'Pour observer la rigueur, les proportions et les détails.'},
 'Musée de la Romanité':{intent:['beauty','project','book'],why:'Pour nourrir un projet de références documentées.'},
 'Jardins de la Fontaine':{intent:['wander','beauty','book'],why:'Pour marcher, regarder les matières naturelles et ralentir.'},
 'Tour Magne':{intent:['wander','beauty','book'],why:'Pour prendre du recul sur la ville et regarder les lignes d’horizon.'},
 'Atelier de Claire Vidal':{intent:['material','project'],why:'Pour parler geste, matière et savoir-faire.'}
};
function visits(){return read('haute-couture-nimes-place-arrival-memory-v1',{places:{}}).places||{}}
function knownPeopleAt(place){const people=window.HCNimesPeople||[],pop=window.HCTerritorialPopulationV1;return people.filter(p=>p.places?.includes(place)&&pop?.personState?.(p.id)?.known)}
function currentIntent(){return document.querySelector('.hc-city-intent.active')?.dataset.intent||'wander'}
function score(name,intent){const meta=PLACE_META[name]||{intent:[]},v=visits()[name]?.visits||0,known=knownPeopleAt(name).length;let s=meta.intent.includes(intent)?6:0;if(v===0)s+=3;else if(v>=2&&v<=5)s+=2;if(known)s+=2;const ctx=window.HCWorldTimeAtmosphereV1?.now?.();if(name==='Café des Croquis'&&ctx?.part==='soir')s+=2;if(name==='Jardins de la Fontaine'&&['matin','après-midi'].includes(ctx?.part))s+=1;if(name==='Tour Magne'&&ctx?.part==='soir')s+=2;return s}
function suggestions(){const intent=currentIntent();return Object.keys(PLACE_META).map(name=>({name,intent,meta:PLACE_META[name],visits:visits()[name]?.visits||0,known:knownPeopleAt(name),score:score(name,intent)})).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name)).slice(0,3)}
function why(x){if(x.known.length)return `${x.known[0].firstName} fait partie des personnes que tu associes à ce lieu. ${x.meta.why}`;if(x.visits===0)return `Tu n’y es encore jamais vraiment allée. ${x.meta.why}`;if(x.visits>=3)return `Tu connais déjà un peu cet endroit. ${x.meta.why}`;return x.meta.why}
function openPlace(name){window.dispatchEvent(new CustomEvent('hc-place-recommendation',{detail:{place:{id:'nimes-suggested:'+String(name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-'),name,category:'local-suggestion'},from:'Suggestion locale'}}));const text=[...document.querySelectorAll('.leaflet-tooltip,.guide-title h2,.pin')];const node=text.find(n=>(n.textContent||'').toLowerCase().includes(name.toLowerCase().replace(' de nîmes','')));if(node){node.click?.();return true}window.dispatchEvent(new CustomEvent('hc-nimes-place-suggestion-open',{detail:{place:name}}));return false}
function render(){if(!/\/ville\/?/i.test(location.pathname))return;const panel=$('.panel');if(!panel)return;let box=$('#hcCitySuggestions');if(!box){box=document.createElement('section');box.id='hcCitySuggestions';box.innerHTML='<div class="hc-cs-ey">Maintenant, à Nîmes</div><div class="hc-cs-list"></div>';const intents=$('#hcCityIntentBox');(intents||panel.firstChild)?.parentNode?.insertBefore(box,(intents||panel.firstChild)?.nextSibling||null);const st=document.createElement('style');st.textContent=`#hcCitySuggestions{margin:14px 0;padding:14px;border-radius:17px;background:rgba(255,255,255,.72);border:1px solid #e5d7ca}.hc-cs-ey{font:900 8px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#a05e52;margin-bottom:8px}.hc-cs-list{display:grid;gap:7px}.hc-cs-card{border:0;background:transparent;padding:7px 0;text-align:left;border-top:1px solid #eee2d8;cursor:pointer}.hc-cs-card:first-child{border-top:0}.hc-cs-card b{display:block;font:15px Georgia,serif;font-weight:400}.hc-cs-card span{display:block;margin-top:3px;font:10px/1.4 Georgia,serif;color:#75665e}.hc-cs-card em{font-style:normal;font:800 8px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#a05e52}`;document.head.appendChild(st)}const list=box.querySelector('.hc-cs-list');list.innerHTML=suggestions().map((x,i)=>`<button class="hc-cs-card" data-place="${x.name.replace(/"/g,'&quot;')}"><em>${i===0?'Ça pourrait te convenir':'Autre piste'}</em><b>${x.name}</b><span>${why(x)}</span></button>`).join('');list.querySelectorAll('[data-place]').forEach(b=>b.addEventListener('click',()=>openPlace(b.dataset.place)))}
function boot(){let n=0;const t=()=>{n++;if($('.panel')){render();document.addEventListener('click',e=>{if(e.target.closest?.('.hc-city-intent'))setTimeout(render,40)});window.addEventListener('hc-time-atmosphere',()=>setTimeout(render,0));return}if(n<80)setTimeout(t,80)};t()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.HCNimesContextualPlaceSuggestionsV1={version:1,suggestions,render};
})();