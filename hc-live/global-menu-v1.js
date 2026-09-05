/* Haute Couture Live — menu global v1 */
(function(){
'use strict';
if(window.HCGlobalMenu)return;

const META_KEY='haute-couture-server-sync-v1';
const rootBase=()=>{
  const p=location.pathname;
  const marker='/hc-live/';
  const i=p.indexOf(marker);
  return i>=0?p.slice(0,i)+marker:'/';
};
const href=part=>rootBase()+String(part||'').replace(/^\/+/, '');
const readMeta=()=>{try{return JSON.parse(localStorage.getItem(META_KEY)||'{}')||{}}catch(_){return {}}};
const readJSON=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
const fmt=iso=>{
  if(!iso)return 'Pas encore synchronisée';
  const d=new Date(iso);
  if(Number.isNaN(d.getTime()))return 'Sauvegarde disponible';
  return 'Dernière sauvegarde · '+new Intl.DateTimeFormat('fr-FR',{hour:'2-digit',minute:'2-digit'}).format(d);
};

const css=document.createElement('style');
css.textContent=`
#hc-global-menu-launch{position:fixed;z-index:2147483000;right:max(16px,env(safe-area-inset-right));top:max(16px,env(safe-area-inset-top));width:46px;height:46px;border:1px solid rgba(49,38,32,.16);border-radius:50%;background:rgba(255,250,244,.94);box-shadow:0 10px 28px rgba(55,38,29,.18);color:#29211d;font:700 19px/1 Arial,sans-serif;cursor:pointer;backdrop-filter:blur(10px)}
#hc-global-menu-launch:hover{transform:translateY(-1px)}
#hc-global-menu-backdrop{position:fixed;z-index:2147483001;inset:0;background:rgba(29,22,19,.24);opacity:0;pointer-events:none;transition:.18s;backdrop-filter:blur(2px)}
#hc-global-menu-panel{position:absolute;right:max(16px,env(safe-area-inset-right));top:max(72px,calc(env(safe-area-inset-top) + 72px));width:min(350px,calc(100vw - 32px));background:#fffaf4;border:1px solid #e3d4c8;border-radius:24px;padding:20px;box-shadow:0 24px 70px rgba(55,38,29,.24);transform:translateY(-8px) scale(.98);transition:.18s}
#hc-global-menu-backdrop.hc-open{opacity:1;pointer-events:auto}#hc-global-menu-backdrop.hc-open #hc-global-menu-panel{transform:none}
.hcgm-head{display:flex;justify-content:space-between;gap:15px;align-items:flex-start;margin-bottom:16px}.hcgm-eyebrow{font:900 9px/1 Arial,sans-serif;letter-spacing:.16em;color:#d9705d;margin-bottom:6px}.hcgm-title{font:26px/1.05 Georgia,serif;color:#251e1a}.hcgm-close{border:0;background:transparent;color:#77665d;font-size:23px;cursor:pointer;padding:0 2px}.hcgm-status{font:12px/1.4 Georgia,serif;color:#77665d;background:#f4ece5;border-radius:13px;padding:10px 12px;margin-bottom:12px}.hcgm-actions{display:grid;gap:8px}.hcgm-btn{width:100%;border:1px solid #e3d4c8;background:white;color:#2b231f;border-radius:14px;padding:13px 14px;text-align:left;font:800 11px/1.2 Arial,sans-serif;letter-spacing:.035em;cursor:pointer}.hcgm-btn:hover{background:#f8f1eb}.hcgm-btn.hc-primary{background:#29211d;color:white;border-color:#29211d}.hcgm-btn small{display:block;font:11px/1.4 Georgia,serif;font-weight:400;letter-spacing:0;color:#8b786c;margin-top:4px}.hcgm-btn.hc-primary small{color:#d8ccc4}.hcgm-saving{opacity:.62;pointer-events:none}
@media(max-width:620px){#hc-global-menu-launch{width:42px;height:42px;right:12px;top:12px}#hc-global-menu-panel{right:12px;top:64px;width:calc(100vw - 24px);border-radius:20px}}
`;
document.head.appendChild(css);

const launch=document.createElement('button');
launch.id='hc-global-menu-launch';launch.type='button';launch.setAttribute('aria-label','Menu du jeu');launch.textContent='⚙';
const backdrop=document.createElement('div');backdrop.id='hc-global-menu-backdrop';
backdrop.innerHTML=`<div id="hc-global-menu-panel" role="dialog" aria-modal="true" aria-label="Menu du jeu">
  <div class="hcgm-head"><div><div class="hcgm-eyebrow">HAUTE COUTURE LIVE</div><div class="hcgm-title">Menu</div></div><button class="hcgm-close" type="button" aria-label="Fermer">×</button></div>
  <div class="hcgm-status" id="hcgm-status">${fmt(readMeta().lastSaveAt)}</div>
  <div class="hcgm-actions">
    <button class="hcgm-btn hc-primary" id="hcgm-save" type="button">SAUVEGARDER MAINTENANT<small>Enregistre la partie dans le navigateur et sur ton serveur.</small></button>
    <button class="hcgm-btn" id="hcgm-home" type="button">CHEZ MOI<small>Retourne directement à ton logement.</small></button>
    <button class="hcgm-btn" id="hcgm-start" type="button">RETOUR À L’ACCUEIL<small>Quitte l’écran actuel sans effacer ta progression.</small></button>
  </div>
</div>`;
document.body.append(launch,backdrop);
const panel=backdrop.querySelector('#hc-global-menu-panel');
const status=backdrop.querySelector('#hcgm-status');
const saveBtn=backdrop.querySelector('#hcgm-save');
const open=()=>{status.textContent=fmt(readMeta().lastSaveAt);backdrop.classList.add('hc-open')};
const close=()=>backdrop.classList.remove('hc-open');
launch.addEventListener('click',open);
backdrop.querySelector('.hcgm-close').addEventListener('click',close);
backdrop.addEventListener('click',e=>{if(e.target===backdrop)close()});
panel.addEventListener('click',e=>e.stopPropagation());
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
backdrop.querySelector('#hcgm-home').addEventListener('click',()=>{
  const path=readJSON('haute-couture-start-path-v1');
  const housing=readJSON('haute-couture-school-housing-v1');
  const studentHome=path?.type==='school'&&housing&&housing.type!=='studio';
  location.href=studentHome?href('school-home/'):href('chez-moi/');
});
backdrop.querySelector('#hcgm-start').addEventListener('click',()=>location.href=rootBase());

async function manualSave(){
  saveBtn.classList.add('hcgm-saving');status.textContent='Sauvegarde en cours…';
  try{
    if(window.HCGame?.get){
      const state=window.HCGame.get();
      if(state&&window.HCGame.save)window.HCGame.save(state);
    }
    if(!window.HCServerSave?.saveNow)throw new Error('server_bridge_unavailable');
    const ok=await window.HCServerSave.saveNow('manual-menu');
    status.textContent=ok?'Sauvegardé ✓ · '+new Intl.DateTimeFormat('fr-FR',{hour:'2-digit',minute:'2-digit'}).format(new Date()):'Sauvegardé localement · serveur indisponible';
  }catch(_){status.textContent='Sauvegardé localement · serveur indisponible'}
  finally{saveBtn.classList.remove('hcgm-saving')}
}
saveBtn.addEventListener('click',manualSave);
window.addEventListener('hc-server-save',e=>{if(e.detail?.ok)status.textContent=fmt(readMeta().lastSaveAt)});

function addSchoolScript(src,attr){
  if(document.querySelector(`script[${attr}]`))return;
  const s=document.createElement('script');
  s.src=href(src);s.defer=true;s.setAttribute(attr,'1');
  document.head.appendChild(s);
}
function loadSchoolEnhancements(){
  const path=location.pathname;
  const project=/\/school-year\d+-project\d+\//i.test(path);
  const anySchool=/\/school(?:-|\/|$)/i.test(path);
  const schoolScreen=/\/school(?:\/|$)|\/school-home(?:\/|$)|\/school-year\d+(?:\/|$)/i.test(path);
  if(anySchool){
    if(!window.HCSchoolPolish)addSchoolScript('school/school-polish-v1.js?v=20260905-polish1','data-hc-school-polish');
    if(!window.HCSchoolAcademic)addSchoolScript('school/school-academic-v1.js?v=20260905-academic2','data-hc-school-academic');
    setTimeout(()=>{if(!window.HCSchoolYearTransition)addSchoolScript('school/school-year-transition-v1.js?v=20260905-yeartransition1','data-hc-school-year-transition')},90);
  }
  if(project){
    if(!window.HCSchoolOpenBrief)addSchoolScript('school/school-open-brief-v1.js?v=20260905-openbrief2','data-hc-open-brief');
    if(!window.HCSchoolLiveJury)addSchoolScript('school/school-live-jury-v1.js?v=20260905-jury1','data-hc-live-jury');
    if(!window.HCSchoolJurySync)addSchoolScript('school/school-jury-sync-v1.js?v=20260905-jurysync1','data-hc-jury-sync');
    if(!window.HCSchoolTeacherProgression)addSchoolScript('school/school-teacher-progression-v1.js?v=20260905-teacherprogress1','data-hc-teacher-progression');
  }
  if(schoolScreen&&!project){
    if(!window.HCSchoolCommunity)addSchoolScript('school/school-community-v1.js?v=20260905-community2','data-hc-school-community');
    setTimeout(()=>{
      if(!window.HCSchoolLifeDepth)addSchoolScript('school/school-life-depth-v1.js?v=20260905-lifedepth1','data-hc-school-life-depth');
      if(!window.HCSchoolEventScenes)addSchoolScript('school/school-event-scenes-v1.js?v=20260905-eventscenes1','data-hc-school-event-scenes');
      if(!window.HCSchoolInternship)addSchoolScript('school/school-internship-v1.js?v=20260905-internship1','data-hc-school-internship');
      if(!window.HCSchoolCareerBridge)addSchoolScript('school/school-career-bridge-v1.js?v=20260905-careerbridge1','data-hc-school-career-bridge');
    },80);
  }
}
loadSchoolEnhancements();
window.HCGlobalMenu={open,close,manualSave,rootBase};
})();