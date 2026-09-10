/* Haute Couture Live — contexte territorial V2
   Résidence, présence physique/voyage et focus de carte sont trois choses distinctes.
   Regle canonique : ouvrir/regarder un territoire ne déplace jamais Marion.
*/
(function(){
'use strict';
if(window.HCTerritoryContext?.version>=2)return;
const SCRIPT_BASE=(document.currentScript&&document.currentScript.src)?new URL('.',document.currentScript.src):new URL('./',location.href);
const PRESENCE_KEY='haute-couture-current-presence-v1';
const HOME_KEY='haute-couture-home';
const RESIDENCE_KEY='haute-couture-residence';
const GAME_KEY='haute-couture-game-state-v1';
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
const num=v=>{const n=Number(v);return Number.isFinite(n)?n:null};
const DEPT_BY_NAME={'Ain':'01','Allier':'03','Cantal':'15','Loire':'42','Haute-Loire':'43','Puy-de-Dôme':'63','Puy de Dôme':'63','Rhône':'69','Rhone':'69','Gard':'30'};
const DEPT_BY_CITY={
 'Bourg-en-Bresse':'01','Oyonnax':'01','Jujurieux':'01','Pérouges':'01','Gex':'01','Moulins':'03','Vichy':'03','Montluçon':'03','Bourbon-l’Archambault':'03',
 'Aurillac':'15','Salers':'15','Saint-Flour':'15','Saint-Étienne':'42','Roanne':'42','Charlieu':'42','Montbrison':'42','Le Puy-en-Velay':'43','Brioude':'43','Retournac':'43',
 'Clermont-Ferrand':'63','Thiers':'63','Riom':'63','Volvic':'63','Le Mont-Dore':'63','La Bourboule':'63','Lyon':'69','Villefranche-sur-Saône':'69','Nîmes':'30'
};
function deptCode(v){if(v==null)return null;if(typeof v==='object')v=v.code??v.departmentCode??v.deptCode;const s=String(v).trim();if(!s)return null;if(/^\d$/.test(s))return '0'+s;if(/^\d{2,3}$/.test(s)||/^(2A|2B)$/i.test(s))return s.toUpperCase();return DEPT_BY_NAME[s]||null;}
function normalizePlace(input,meta={}){
 if(!input)return null;const department=input.department&&typeof input.department==='object'?input.department:null;const commune=input.commune&&typeof input.commune==='object'?input.commune:null;const city=input.city||input.communeName||commune?.nom||input.name||department?.nom||null;
 const code=deptCode(input.departmentCode??input.deptCode??department?.code??input.departmentName??(typeof input.department==='string'?input.department:null))||DEPT_BY_CITY[city]||null;
 return {id:input.id||commune?.code||null,city,commune:commune||null,department:department||input.department||null,departmentCode:code,departmentName:input.departmentName||department?.nom||(typeof input.department==='string'?input.department:null)||null,region:input.region||input.regionName||null,lat:num(input.lat??commune?.lat??department?.lat),lng:num(input.lng??input.lon??commune?.lng??commune?.lon??department?.lng??department?.lon),source:meta.source||input.source||null,reason:meta.reason||input.reason||null,enteredAt:input.enteredAt||null};
}
function getStoredPresence(){return normalizePlace(read(PRESENCE_KEY),{source:'presence'});}
function getTravelPresence(){
 const g=read(GAME_KEY),w=g?.world;if(!w?.currentCity&&!w?.currentDepartment)return null;
 return normalizePlace({city:w.currentCity,department:w.currentDepartment,departmentName:w.currentDepartment,departmentCode:w.currentDepartmentCode,region:w.currentRegion,lat:w.currentLat,lng:w.currentLng},{source:'travel-world',reason:'current-location'});
}
function getPresence(){return getStoredPresence()||getTravelPresence();}
function syncGameWorld(p){
 const g=read(GAME_KEY);if(!g)return;
 g.world=g.world||{};if(p.city)g.world.currentCity=p.city;if(p.departmentName||p.department)g.world.currentDepartment=p.departmentName||(typeof p.department==='string'?p.department:null);if(p.departmentCode)g.world.currentDepartmentCode=p.departmentCode;if(p.region)g.world.currentRegion=p.region;if(p.lat!=null)g.world.currentLat=p.lat;if(p.lng!=null)g.world.currentLng=p.lng;
 try{if(window.HauteCoutureCore?.save)window.HauteCoutureCore.save(g);else localStorage.setItem(GAME_KEY,JSON.stringify(g))}catch(_){localStorage.setItem(GAME_KEY,JSON.stringify(g))}
}
function setPresence(place,reason='visit'){
 const p=normalizePlace(place,{source:'presence',reason});if(!p)return null;p.enteredAt=new Date().toISOString();localStorage.setItem(PRESENCE_KEY,JSON.stringify(p));syncGameWorld(p);window.dispatchEvent(new CustomEvent('hc-territory-presence',{detail:p}));loadDepartmentGameplay(p);return p;
}
function clearPresence(){localStorage.removeItem(PRESENCE_KEY);window.dispatchEvent(new CustomEvent('hc-territory-presence',{detail:null}));}
function getResidence(){const hs=read(HOME_KEY),rs=read(RESIDENCE_KEY);const h=hs?.home||rs||hs;if(!h)return null;return normalizePlace({...h,city:hs?.city||h.city,lat:h.lat??hs?.cityLat,lng:h.lng??h.lon??hs?.cityLng,departmentCode:h.departmentCode??h.deptCode??hs?.departmentCode??hs?.deptCode,departmentName:h.departmentName??hs?.departmentName},{source:'residence',reason:'home'});}
function getMapFocus(){const s=window.HCFranceGeo?.state;if(!s||(!s.department&&!s.commune))return null;return normalizePlace({department:s.department,departmentCode:s.department?.code,departmentName:s.department?.nom,region:s.region?.nom,commune:s.commune,city:s.commune?.nom||s.department?.nom,lat:s.commune?.centre?.coordinates?.[1]??s.commune?.lat??s.department?.lat,lng:s.commune?.centre?.coordinates?.[0]??s.commune?.lng??s.commune?.lon??s.department?.lng??s.department?.lon},{source:'map-focus',reason:'preview'});}
function currentLocal(){return getPresence()||getResidence();}
function currentForInteractiveMap(){return getMapFocus()||getPresence()||getResidence();}
function isAwayFromHome(){const p=getPresence(),h=getResidence();if(!p)return false;if(!h)return true;if(p.departmentCode&&h.departmentCode&&p.departmentCode!==h.departmentCode)return true;return !!(p.city&&h.city&&p.city!==h.city);}
function isPreviewOnly(){const f=getMapFocus(),p=getPresence();if(!f)return false;if(!p)return true;if(f.departmentCode&&p.departmentCode&&f.departmentCode!==p.departmentCode)return true;return !!(f.city&&p.city&&f.city!==p.city);}
const DEPARTMENT_GAMEPLAY={'01':'ain-territorial-gameplay-v1.js?v=20260910-ainplay1'};
function loadScript(id,src){if(document.getElementById(id))return;const s=document.createElement('script');s.id=id;s.src=new URL(src,SCRIPT_BASE).href;s.async=true;document.head.appendChild(s)}
function loadDepartmentGameplay(place=getPresence()){
 if(!place||!String(location.pathname).includes('/ville'))return;
 loadScript('hcTerritorialSignalRuntime','territorial-signal-runtime-v1.js?v=20260910-runtime1');
 const src=DEPARTMENT_GAMEPLAY[String(place.departmentCode||'')];if(!src)return;
 loadScript('hcTerritoryGameplayScript'+String(place.departmentCode||''),src);
}
window.HCTerritoryContext={version:2,storageKey:PRESENCE_KEY,normalizePlace,getStoredPresence,getTravelPresence,getPresence,setPresence,clearPresence,getResidence,getMapFocus,currentLocal,currentForInteractiveMap,isAwayFromHome,isPreviewOnly,loadDepartmentGameplay};
loadDepartmentGameplay();
})();
