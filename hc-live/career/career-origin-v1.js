/* Haute Couture Live — origine de carrière : école ou carrière directe v1 */
(function(){
'use strict';
if(window.HCCareerOriginV1)return;
const START='haute-couture-start-path-v1';
const OUT='haute-couture-career-origin-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
function resolve(){
 const start=read(START,null);
 const raw=String(start?.type||start?.path||start?.mode||'').toLowerCase();
 let origin='unknown';
 if(raw==='school'||/school|ecole|école/.test(raw))origin='school';
 else if(raw==='career'||/career|carriere|carrière|direct/.test(raw))origin='direct';
 /* Le choix de départ est la source de vérité. On ne déduit jamais une école
    de simples anciennes clés localStorage quand le départ dit carrière directe. */
 const state={version:1,origin,schoolHistoryAllowed:origin==='school',directCareer:origin==='direct',resolvedFrom:start?'start-path':'missing-start-path'};
 write(OUT,state);return state;
}
function isSchoolRoute(){return resolve().schoolHistoryAllowed}
function isDirectRoute(){return resolve().directCareer}
function filterSchoolCarry(value,empty){return isSchoolRoute()?value:empty}
window.HCCareerOriginV1={version:1,resolve,isSchoolRoute,isDirectRoute,filterSchoolCarry,storageKey:OUT};
resolve();
})();