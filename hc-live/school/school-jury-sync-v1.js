/* Haute Couture Live — synchronise jury vivant et brief ouvert. */
(function(){
'use strict';
if(window.HCSchoolJurySync)return;
const JURY_KEY='haute-couture-school-live-jury-v1';
const match=location.pathname.match(/school-year(\d+)-project(\d+)/i);
if(!match)return;
const projectId=`year${Number(match[1])}-project${Number(match[2])}`;
const read=()=>{try{return JSON.parse(localStorage.getItem(JURY_KEY)||'null')||{version:1,projects:{}}}catch(_){return{version:1,projects:{}}}};
const save=s=>localStorage.setItem(JURY_KEY,JSON.stringify(s));
function invalidateDraftJury(){
 const s=read(),old=s.projects?.[projectId];
 if(!old)return false;
 /* Un jury terminé reste une trace historique. Pour obtenir une nouvelle critique après rendu,
    Marion doit explicitement rouvrir le jury via son moteur. */
 if(old.status==='complete')return false;
 delete s.projects[projectId];s.updatedAt=new Date().toISOString();save(s);
 return true;
}
function refresh(){
 const changed=invalidateDraftJury();
 if(changed&&window.HCSchoolLiveJury?.render)window.HCSchoolLiveJury.render();
}
document.addEventListener('click',e=>{
 const b=e.target?.closest?.('#hcob-save');if(!b)return;
 /* Le gestionnaire du brief est attaché directement au bouton : ce léger décalage garantit
    que les nouvelles données sont déjà dans localStorage avant de reconstruire le jury. */
 setTimeout(refresh,0);
});
window.HCSchoolJurySync={version:1,projectId,refresh,invalidateDraftJury};
})();