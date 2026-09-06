/* Haute Couture Live — retours pédagogiques qualitatifs v1 */
(function(){
'use strict';
if(window.HCSchoolQualitativeFeedback)return;
function clean(){
  document.querySelectorAll('#result').forEach(box=>{
    let t=(box.textContent||'').trim();
    if(!t)return;
    const m=t.match(/score\s*(\d+)\/100/i);
    if(m){
      const n=Number(m[1]);
      const label=n>=80?'Notion comprise et réutilisable.':n>=55?'Notion comprise, à consolider par la pratique.':'Notion à reprendre tranquillement dans le cours ou en atelier.';
      t=t.replace(/Cours déjà terminé\s*·\s*score\s*\d+\/100\.?/i,`Cours déjà terminé · ${label}`)
         .replace(/Score\s*\d+\/100\.?/gi,label);
      box.textContent=t;
    }
  });
  document.querySelectorAll('.card h2').forEach(h=>{if((h.textContent||'').trim()==='Vérification')h.textContent='Retour sur une notion'});
  const validate=document.getElementById('validate');
  if(validate){validate.textContent=/NOUVELLE TENTATIVE/i.test(validate.textContent||'')?'REPRENDRE CETTE NOTION':'VALIDER MA SÉANCE'}
  document.querySelectorAll('.skill').forEach(el=>{el.textContent=(el.textContent||'').replace(/\s*\+\d+\s*$/,'')});
}
function mount(){clean();let timer;const mo=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(clean,15)});mo.observe(document.getElementById('app')||document.body,{subtree:true,childList:true,characterData:true});setTimeout(()=>mo.disconnect(),30000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
window.HCSchoolQualitativeFeedback={version:1,clean,mount};
})();