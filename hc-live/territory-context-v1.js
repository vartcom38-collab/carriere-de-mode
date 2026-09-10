/* Haute Couture Live — contexte territorial V1
   Sépare résidence, présence physique temporaire et focus de la carte interactive.
*/
(function(){
'use strict';
if(window.HCTerritoryContext)return;
const PRESENCE_KEY='haute-couture-current-presence-v1';
const HOME_KEY='haute-couture-home';
const RESIDENCE_KEY='haute-couture-residence';
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
const num=v=>{const n=Number(v);return Number.isFinite(n)?n:null};
function deptCode(v){
  if(v==null)return null;
  if(typeof v==='object')v=v.code??v.departmentCode??v.deptCode;
  const s=String(v).trim();
  if(!s)return null;
  if(/^\d$/.test(s))return '0'+s;
  return s.toUpperCase();
}
function normalizePlace(input,meta={}){
  if(!input)return null;
  const department=input.department&&typeof input.department==='object'?input.department:null;
  const commune=input.commune&&typeof input.commune==='object'?input.commune:null;
  const city=input.city||input.communeName||commune?.nom||input.name||department?.nom||null;
  return {
    id:input.id||commune?.code||null,
    city,
    commune:commune||null,
    department:department||input.department||null,
    departmentCode:deptCode(input.departmentCode??input.deptCode??department?.code),
    departmentName:input.departmentName||department?.nom||null,
    lat:num(input.lat??commune?.lat??department?.lat),
    lng:num(input.lng??input.lon??commune?.lng??commune?.lon??department?.lng??department?.lon),
    source:meta.source||input.source||null,
    reason:meta.reason||input.reason||null,
    enteredAt:input.enteredAt||null
  };
}
function getPresence(){return normalizePlace(read(PRESENCE_KEY),{source:'presence'});}
function setPresence(place,reason='visit'){
  const p=normalizePlace(place,{source:'presence',reason});
  if(!p)return null;
  p.enteredAt=new Date().toISOString();
  localStorage.setItem(PRESENCE_KEY,JSON.stringify(p));
  window.dispatchEvent(new CustomEvent('hc-territory-presence',{detail:p}));
  return p;
}
function clearPresence(){localStorage.removeItem(PRESENCE_KEY);window.dispatchEvent(new CustomEvent('hc-territory-presence',{detail:null}));}
function getResidence(){
  const hs=read(HOME_KEY),rs=read(RESIDENCE_KEY);
  const h=hs?.home||rs||hs;
  if(!h)return null;
  return normalizePlace({...h,city:hs?.city||h.city,lat:h.lat??hs?.cityLat,lng:h.lng??h.lon??hs?.cityLng,departmentCode:h.departmentCode??h.deptCode??hs?.departmentCode??hs?.deptCode,departmentName:h.departmentName??hs?.departmentName},{source:'residence',reason:'home'});
}
function getMapFocus(){
  const s=window.HCFranceGeo?.state;
  if(!s||(!s.department&&!s.commune))return null;
  return normalizePlace({department:s.department,departmentCode:s.department?.code,departmentName:s.department?.nom,commune:s.commune,city:s.commune?.nom||s.department?.nom,lat:s.commune?.lat??s.department?.lat,lng:s.commune?.lng??s.commune?.lon??s.department?.lng??s.department?.lon},{source:'map-focus',reason:'preview'});
}
function currentLocal(){return getPresence()||getResidence();}
function currentForInteractiveMap(){return getMapFocus()||getPresence()||getResidence();}
function isAwayFromHome(){const p=getPresence(),h=getResidence();if(!p)return false;if(!h)return true;if(p.departmentCode&&h.departmentCode&&p.departmentCode!==h.departmentCode)return true;return !!(p.city&&h.city&&p.city!==h.city);}
window.HCTerritoryContext={storageKey:PRESENCE_KEY,normalizePlace,getPresence,setPresence,clearPresence,getResidence,getMapFocus,currentLocal,currentForInteractiveMap,isAwayFromHome};
})();
