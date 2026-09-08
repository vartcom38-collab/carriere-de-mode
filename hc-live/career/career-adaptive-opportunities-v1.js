/* Haute Couture Live — opportunités adaptatives selon identité émergente v1 */
(function(){
'use strict';
if(window.HCCareerAdaptiveOpportunitiesV1)return;
const THEME_WORDS={
 ceremony:['cérémon','mariage','gala','soir','robe','habillé','prestige'],
 drape:['drap','fluide','mouvement','soie','satin','organza','mousseline'],
 structure:['structur','sculpt','architecture','tailoring','construction','volume','signature'],
 textile:['matière','textile','surface','artisan','tissu','boutis','brod','teinture'],
 heritage:['patrimoine','roman','antique','nîmes','camargue','culture','archive'],
 image:['éditorial','image','photo','shoot','média','direction artistique','show','défilé']
};
const labels={ceremony:'cérémonie',drape:'drapé & mouvement',structure:'construction & volume',textile:'matière & savoir-faire',heritage:'patrimoine traduit',image:'image & éditorial'};
function identity(){try{return window.HCCareerEmergentIdentityV1?.refresh?.()||{stage:'open',top:null,ranked:[]}}catch(_){return{stage:'open',top:null,ranked:[]}}}
function themesFor(o){const text=[o.title,o.subtitle,o.desc,o.client?.garment,o.client?.occasion,o.client?.notes,o.client?.brief?.style,o.project?.idea,o.project?.category].filter(Boolean).join(' ').toLowerCase();return Object.entries(THEME_WORDS).filter(([,words])=>words.some(w=>text.includes(w))).map(([id])=>id)}
function affinity(o,id){if(!id)return 0;const themes=themesFor(o);if(themes.includes(id))return 3;const secondary=identity().ranked?.filter(x=>x.score>0).slice(1,3).map(x=>x.id)||[];if(themes.some(t=>secondary.includes(t)))return 1;return 0}
function reason(o,profile){const themes=themesFor(o);if(profile.stage==='open'||!profile.top)return 'Une proposition qui peut encore élargir ta pratique.';if(themes.includes(profile.top))return `Cette proposition fait écho à ce qui devient reconnaissable dans ton travail : ${labels[profile.top]||profile.top}.`;if(themes.length)return `Cette proposition ouvre un autre terrain — ${themes.slice(0,2).map(t=>labels[t]||t).join(' · ')} — sans remettre en cause ta direction actuelle.`;return 'Une opportunité plus transversale, utile pour garder ta pratique ouverte.'}
function decorate(list){const p=identity();return (list||[]).map((o,index)=>({...o,identityFit:affinity(o,p.top),identityThemes:themesFor(o),identityReason:reason(o,p),identityStage:p.stage,identityTop:p.top,__originalIndex:index})).sort((a,b)=>{
  if(a.unlocked!==b.unlocked)return a.unlocked?-1:1;
  if(a.state?.status==='accepted'&&b.state?.status!=='accepted')return -1;
  if(b.state?.status==='accepted'&&a.state?.status!=='accepted')return 1;
  const fit=(b.identityFit||0)-(a.identityFit||0);if(fit)return fit;
  return a.__originalIndex-b.__originalIndex;
 })}
function patch(){const api=window.HCCareerOpportunities;if(!api||api.__hcAdaptivePatched)return false;const original=api.list.bind(api);api.list=function(){return decorate(original())};api.__hcAdaptivePatched=true;window.dispatchEvent(new CustomEvent('hc-career-opportunities-adaptive'));return true}
function boot(){let tries=0;const t=setInterval(()=>{tries++;if(patch()||tries>80)clearInterval(t)},80)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.addEventListener('hc-career-identity',()=>setTimeout(()=>window.dispatchEvent(new CustomEvent('hc-career-opportunities-adaptive')),20));
window.HCCareerAdaptiveOpportunitiesV1={version:1,decorate,themesFor,identity,patch};
})();