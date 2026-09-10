/* Haute Couture Live — familiarité vivante avec les lieux v1 */
(function(){
'use strict';
if(window.HCTerritorialPlaceFamiliarityV1)return;
const KEY='haute-couture-territorial-place-familiarity-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return v}catch(_){return v}};
const now=()=>new Date().toISOString();
const day=()=>Number(window.HCGame?.get?.()?.clock?.day||1);
function state(){const s=read(KEY,{version:1,places:{},history:[]});s.version=1;s.places=s.places||{};s.history=s.history||[];return s}
function save(s){s.updatedAt=now();s.history=s.history.slice(0,500);return write(KEY,s)}
function sourceEntry(detail={}){const tr=detail.territory||{},p=detail.place||{};if(!p.id)return null;return{key:String((tr.id||tr.territoryId||'unknown')+'|'+p.id),territoryId:tr.id||tr.territoryId||null,territoryLabel:tr.label||tr.city||null,placeId:p.id,name:p.name||'Lieu',category:p.category||'place',visits:Number(p.visits||0),firstSource:p.firstSource||detail.source||null,lastSource:p.lastSource||detail.source||null}}
function levelFor(visits){if(visits>=10)return 'habitude';if(visits>=5)return 'familier';if(visits>=2)return 'reconnu';return 'decouverte'}
const TEXT={
 decouverte:'Tu observes encore le lieu avant de savoir comment il fonctionne.',
 reconnu:'Tu reconnais l’endroit et tu commences à savoir où regarder.',
 familier:'Tu connais assez le lieu pour remarquer plus vite ce qui change.',
 habitude:'Le lieu fait partie de tes habitudes. Certaines personnes peuvent te reconnaître et penser à toi.'
};
function affordances(level,category){const a=[];if(level==='reconnu'||level==='familier'||level==='habitude')a.push('repérer les changements');if(level==='familier'||level==='habitude')a.push('demander quelque chose de plus précis');if(level==='habitude'){if(/fabric|mercer|craft|artisan/.test(category))a.push('être prévenue d’un arrivage ou d’une matière mise de côté');if(/cafe/.test(category))a.push('être reconnue et croiser plus facilement des habitués');if(/culture|museum|gallery|heritage/.test(category))a.push('revenir pour une référence précise plutôt que tout redécouvrir');if(/vintage|market|brocante/.test(category))a.push('être prévenue d’une trouvaille ou d’un nouvel arrivage')}return a}
function sync(detail={}){const base=sourceEntry(detail);if(!base)return null;const s=state(),old=s.places[base.key]||{},level=levelFor(base.visits),changed=old.level&&old.level!==level;const rec=s.places[base.key]={...old,...base,level,text:TEXT[level],affordances:affordances(level,base.category),updatedDay:day(),updatedAt:now()};if(!old.firstSeenAt)rec.firstSeenAt=now();if(changed){s.history.unshift({type:'level-change',key:base.key,from:old.level,to:level,day:day(),at:now()});window.dispatchEvent(new CustomEvent('hc-place-familiarity-changed',{detail:rec}))}save(s);return rec}
function get(placeId,territoryId=null){const s=state();if(territoryId)return s.places[String(territoryId)+'|'+String(placeId)]||null;return Object.values(s.places).find(x=>x.placeId===placeId)||null}
function currentByName(name){const n=String(name||'').trim().toLowerCase();return Object.values(state().places).filter(x=>String(x.name||'').trim().toLowerCase()===n).sort((a,b)=>(b.visits||0)-(a.visits||0))[0]||null}
function boot(){window.addEventListener('hc-territorial-place-discovered',e=>sync(e.detail||{}));const d=window.HCTerritorialPlaceDiscoveryV1?.current?.();if(d){Object.values(d.places||{}).forEach(p=>sync({territory:d,place:p,source:p.lastSource}))}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.HCTerritorialPlaceFamiliarityV1={version:1,state,sync,get,currentByName,levelFor,storageKey:KEY};
})();