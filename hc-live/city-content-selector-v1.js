/* Haute Couture Live — sélecteur dynamique des banques ville V1
   But : choisir personnages / briefs / secrets / événements sans répétition immédiate.
*/
(function(){'use strict';if(window.HCCityContentSelectorV1)return;
const KEY='haute-couture-city-content-history-v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{cities:{}}}catch(_){return{cities:{}}}};
const write=s=>localStorage.setItem(KEY,JSON.stringify(s));
const hash=s=>String(s).split('').reduce((a,c)=>((a*33)+c.charCodeAt(0))>>>0,5381);
function bankFor(city){const sources=[window.HCLyonCityBankV1,window.HCClermontCityContentBankV1,window.HCStEtienneCityContentBankV1,window.HCVilleurbanneCityContentBankV1,window.HCAurillacCityContentBankV1,window.HCLePuyCityBankV1,window.HCMoulinsVichyCityBanksV1,window.HCBourgOyonnaxCityBanksV1];for(const s of sources){if(!s)continue;if(s.city===city)return s;if(s[city])return s[city]}return null}
function game(){try{return window.HCGame?.get?.()||{}}catch(_){return{}}}
function level(){const g=game();return Number(g?.career?.level||g?.player?.careerLevel||1)||1}
function season(){const g=game(),d=new Date(g?.clock?.iso||Date.now()),m=d.getMonth()+1;return m<=2||m===12?'hiver':m<=5?'printemps':m<=8?'été':'automne'}
function history(city){const s=read();s.cities[city]=s.cities[city]||{briefs:[],people:[],secrets:[],events:[]};write(s);return s.cities[city]}
function eligibleBriefs(city){const b=bankFor(city);if(!b)return[];const lv=level(),h=history(city);return (b.briefs||[]).filter(x=>(x.level||1)<=lv+1&&!h.briefs.slice(-12).includes(x.id))}
function choose(arr,seed){if(!arr.length)return null;return arr[hash(seed)%arr.length]}
function pickBrief(city,context='general'){const arr=eligibleBriefs(city),h=history(city);const g=game(),seed=[city,context,season(),level(),g?.clock?.day||1,h.briefs.length].join('|');const item=choose(arr,seed)||choose(bankFor(city)?.briefs||[],seed);if(!item)return null;h.briefs.push(item.id);h.briefs=h.briefs.slice(-60);const s=read();s.cities[city]=h;write(s);return item}
function pickPerson(city,context='free'){const b=bankFor(city);if(!b)return null;const h=history(city),arr=(b.people||[]).filter(x=>!h.people.slice(-8).includes(x.id));const item=choose(arr.length?arr:b.people||[],[city,context,season(),h.people.length].join('|'));if(!item)return null;h.people.push(item.id);h.people=h.people.slice(-40);const s=read();s.cities[city]=h;write(s);return item}
function revealSecret(city){const b=bankFor(city);if(!b)return null;const h=history(city),visits=Number(game()?.flags?.territorialVisits?.[city])||0;const arr=(b.secrets||[]).filter(x=>visits>=(x.threshold||2)&&!h.secrets.includes(x.id));const item=choose(arr,[city,visits,h.secrets.length].join('|'));if(!item)return null;h.secrets.push(item.id);const s=read();s.cities[city]=h;write(s);return item}
function edition(city){const b=bankFor(city);if(!b)return null;const g=game(),y=new Date(g?.clock?.iso||Date.now()).getFullYear(),arr=b.events||[];if(!arr.length)return null;const item=choose(arr,[city,y,season()].join('|'));return{...item,year:y,season:season(),editionId:`${item.id}:${y}`,fictionalFuture:y>2026}}
window.HCCityContentSelectorV1={version:1,bankFor,pickBrief,pickPerson,revealSecret,edition,season,level,history};window.dispatchEvent(new CustomEvent('hc-city-content-selector-ready'));
})();