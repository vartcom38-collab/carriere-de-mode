/* Haute Couture Live — rythme quotidien selon type de territoire v1 */
(function(){
'use strict';
if(window.HCTerritorialDailyRhythmV1)return;
const KEY='haute-couture-territorial-daily-rhythm-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return v}catch(_){return v}};
const now=()=>new Date().toISOString();
const day=()=>Number(window.HCGame?.get?.()?.clock?.day||1);
const hash=s=>{let h=2166136261;for(const c of String(s||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return Math.abs(h>>>0)};
function presence(){return window.HCPlayerResidenceV1?.getCurrentPresence?.()||read('haute-couture-current-territory-v1',null)||null}
function normalizeType(t){const raw=String(t?.territoryType||t?.type||t?.kind||'locality').toLowerCase();if(/village|hamlet|commune-rural|rural/.test(raw))return'village';if(/metropole|métropole|capital|large-city|big-city/.test(raw))return'metropolis';if(/town|small-city|medium-city|ville|city/.test(raw))return'town';return'locality'}
const PROFILE={
 village:{label:'Vie locale serrée',encounterDensity:'low',repeatChance:'high',anonymity:'low',shopVariety:'compact',spontaneousLeadPace:'slow-steady',description:'Peu de lieux, mais on recroise davantage les mêmes personnes. Les liens peuvent devenir profonds rapidement.'},
 town:{label:'Rythme de ville',encounterDensity:'medium',repeatChance:'medium',anonymity:'medium',shopVariety:'balanced',spontaneousLeadPace:'steady',description:'Un équilibre entre habitudes locales, nouvelles rencontres et diversité de lieux.'},
 metropolis:{label:'Flux métropolitain',encounterDensity:'high',repeatChance:'low',anonymity:'high',shopVariety:'wide',spontaneousLeadPace:'frequent',description:'Beaucoup de mouvement, davantage de nouvelles têtes et d’occasions, mais moins de répétition spontanée.'},
 locality:{label:'Rythme local',encounterDensity:'medium',repeatChance:'medium',anonymity:'medium',shopVariety:'balanced',spontaneousLeadPace:'steady',description:'Le territoire prend forme à mesure qu’il est découvert, sans hiérarchie de valeur.'}
};
function state(){const s=read(KEY,{version:1,territories:{},history:[]});s.version=1;s.territories=s.territories||{};s.history=s.history||[];return s}
function territoryKey(t){return String(t?.territoryId||t?.id||t?.city||t?.label||'unknown')}
function current(){const t=presence();if(!t)return null;const type=normalizeType(t),p=PROFILE[type]||PROFILE.locality;return{territory:t,type,...p}}
function remember(){const cur=current();if(!cur)return null;const s=state(),id=territoryKey(cur.territory),old=s.territories[id]||{};s.territories[id]={...old,territoryId:id,label:cur.territory.label||cur.territory.city||id,type:cur.type,firstSeenDay:old.firstSeenDay||day(),lastSeenDay:day(),visitDays:Number(old.visitDays||0)+1,profile:{encounterDensity:cur.encounterDensity,repeatChance:cur.repeatChance,anonymity:cur.anonymity,shopVariety:cur.shopVariety,spontaneousLeadPace:cur.spontaneousLeadPace}};s.history.push({territoryId:id,type:cur.type,day:day(),at:now()});s.history=s.history.slice(-240);write(KEY,s);return s.territories[id]}
function dailyPulse(){const cur=current();if(!cur)return null;const seed=hash([territoryKey(cur.territory),day()].join('|'));const encounterCount=cur.type==='village'?1+(seed%2):cur.type==='metropolis'?2+(seed%3):1+(seed%3);const newFaceBias=cur.type==='village'?0.25:cur.type==='metropolis'?0.8:0.5;return{territory:cur.territory,type:cur.type,encounterCount,newFaceBias,repeatBias:1-newFaceBias,shopVariety:cur.shopVariety,leadPace:cur.spontaneousLeadPace,description:cur.description}}
function emit(reason='refresh'){const rec=remember(),pulse=dailyPulse();window.dispatchEvent(new CustomEvent('hc-territorial-daily-rhythm',{detail:{reason,record:rec,pulse}}));return pulse}
function rootBase(){const marker='/hc-live/',p=location.pathname,i=p.indexOf(marker);return i>=0?p.slice(0,i)+marker:'/'}
function appendScript(src,attr){if(document.querySelector(`script[${attr}]`))return;const s=document.createElement('script');s.src=rootBase()+src;s.defer=true;s.setAttribute(attr,'1');document.head.appendChild(s)}
function loadPlaceDiscovery(){if(!/\/ville(?:\/|$)/i.test(location.pathname))return;if(!window.HCTerritorialPlaceDiscoveryV1)appendScript('ville/territorial-place-discovery-v1.js?v=20260909-placediscovery1','data-hc-territorial-place-discovery');setTimeout(()=>{if(!window.HCTerritorialPlaceFamiliarityV1)appendScript('ville/territorial-place-familiarity-v1.js?v=20260909-placefamiliarity1','data-hc-territorial-place-familiarity');if(!window.HCTerritorialPlaceFamiliarityUIV1)appendScript('ville/territorial-place-familiarity-ui-v1.js?v=20260909-placefamiliarityui1','data-hc-territorial-place-familiarity-ui')},180)}
function boot(){loadPlaceDiscovery();emit('boot');['hc-presence-changed','hc-residence-changed','hc-local-life-context-changed','hc-game-state'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(()=>emit(ev),60)))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.HCTerritorialDailyRhythmV1={version:1,state,current,dailyPulse,normalizeType,emit,loadPlaceDiscovery,storageKey:KEY};
})();