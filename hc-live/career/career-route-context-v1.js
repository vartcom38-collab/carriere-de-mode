/* Haute Couture Live — contexte carrière selon le parcours choisi v1 */
(function(){
'use strict';
if(window.HCCareerRouteContextV1)return;
const START='haute-couture-start-path-v1',ORIGIN='haute-couture-career-origin-v1',SCHOOL='haute-couture-school-career-continuity-v2',KEY='haute-couture-career-route-context-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}},write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
function route(){const start=read(START,null),o=read(ORIGIN,null);if(o?.origin)return o.origin;const raw=String(start?.type||start?.path||start?.mode||'').toLowerCase();if(raw==='school'||/school|ecole|école/.test(raw))return'school';return'direct'}
function build(){const origin=route();const school=origin==='school'?read(SCHOOL,{personal:[],professional:[],teachers:[],collaborations:[],opportunities:[],rivalries:[]}):null;const ctx={version:1,origin,hasSchoolHistory:origin==='school',entry:origin==='school'?'after-school':'direct-career',school:origin==='school'?{personal:school.personal||[],professional:school.professional||[],teachers:school.teachers||[],collaborations:school.collaborations||[],opportunities:school.opportunities||[],rivalries:school.rivalries||[]}:null,direct:origin==='direct'?{teachers:[],schoolRecommendations:[],schoolmates:[],schoolProjects:[],schoolInternships:[]}:null};write(KEY,ctx);return ctx}
function allows(feature){const c=build();if(['teacher-recommendation','schoolmate','school-project','school-internship','school-memory'].includes(feature))return c.hasSchoolHistory;return true}
window.HCCareerRouteContextV1={version:1,build,route,allows,storageKey:KEY};
build();
})();