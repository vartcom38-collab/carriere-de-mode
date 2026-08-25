/* Haute Couture Live — effets gameplay de la maîtrise technique v1
   Couche additive chargée après les conséquences de production.
*/
(function(){
'use strict';
if(window.HCTechniqueProgressionEffects)return;
function techs(){return window.HCTechniqueProgression?.techniquesFromComponents?.()||[]}
function applyEstimate(e){if(!e||e.__hcTechniqueProgressApplied)return e;const mod=window.HCTechniqueProgression?.modifiers?.(techs())||{averageLevel:1,timeMultiplier:1,qualityBonus:0,retouchReduction:0};const pc={...(e.productionConsequences||{})};const beforeMinutes=Number(e.minutes||pc.effectiveMinutes||90);const minutes=Math.max(30,Math.round(beforeMinutes*mod.timeMultiplier));pc.techniqueMasteryAverage=mod.averageLevel;pc.techniqueTimeMultiplier=mod.timeMultiplier;pc.techniqueQualityBonus=mod.qualityBonus;pc.techniqueRetouchReduction=mod.retouchReduction;pc.effectiveMinutes=minutes;pc.quality=Math.max(20,Math.min(100,Number(pc.quality||70)+mod.qualityBonus));pc.retouchRisk=Math.max(5,Math.min(90,Number(pc.retouchRisk||35)-mod.retouchReduction));pc.satisfaction=Math.max(15,Math.min(100,Math.round(Number(pc.satisfaction||70)+mod.qualityBonus*.6)));return{...e,minutes,productionConsequences:pc,__hcTechniqueProgressApplied:true}}
function patch(){const pre=window.HCAtelierRealisationPreflight;if(!pre)return false;if(pre.__hcTechniqueProgressPatched)return true;const original=pre.estimate.bind(pre);pre.estimate=()=>applyEstimate(original());pre.__hcTechniqueProgressPatched=true;return true}
function boot(){if(!window.HCTechniqueProgression||!patch()){setTimeout(boot,100);return}window.HCTechniqueProgressionEffects={version:1,applyEstimate,patch};window.dispatchEvent(new CustomEvent('hc-technique-progression-effects-ready',{detail:{version:1}}))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,520));else setTimeout(boot,520);
})();