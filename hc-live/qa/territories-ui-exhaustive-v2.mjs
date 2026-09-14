import { chromium } from 'playwright';

const BASE=process.env.HC_BASE_URL||'http://127.0.0.1:4173/hc-live/ville/';
const ONLY=String(process.env.HC_DEPT||'').trim();
const DEPTS={
 '01':['Bourg-en-Bresse','Oyonnax','Jujurieux','Pérouges','Gex','Ferney-Voltaire','Mijoux','Belley','Villars-les-Dombes','Nantua'],
 '03':['Moulins','Vichy','Montluçon','Bourbon-l’Archambault','Néris-les-Bains','Charroux','Souvigny','Lapalisse','Saint-Pourçain-sur-Sioule','Commentry','Hérisson'],
 '07':['Annonay','Aubenas','Privas','Tournon-sur-Rhône','Le Teil','Marcols-les-Eaux','Jaujac','Largentière','Les Vans','Vallon-Pont-d’Arc','Saint-Agrève','Lanarce'],
 '15':['Aurillac','Salers','Saint-Flour','Chaudes-Aigues','Laveissière','Murat','Mauriac','Massiac'],
 '26':['Romans-sur-Isère','Valence','Crest','Die','Nyons','Montélimar','Grignan','Dieulefit','Bourdeaux','Tain-l’Hermitage','La Chapelle-en-Vercors'],
 '38':['Grenoble','Bourgoin-Jallieu','Vienne','Voiron','Vizille','Villard-de-Lans',"Bourg-d'Oisans",'La Tour-du-Pin','Crémieu','Saint-Marcellin','Saint-Pierre-de-Chartreuse','Crolles','Allevard','Pont-en-Royans'],
 '42':['Saint-Étienne','Roanne','Charlieu','Saint-Chamond','Montbrison','Firminy','Feurs','Rive-de-Gier','Saint-Bonnet-le-Château','Boën-sur-Lignon','Noirétable','Saint-Galmier'],
 '43':['Le Puy-en-Velay','Brioude','Retournac','La Chaise-Dieu','Blesle','Yssingeaux','Monistrol-sur-Loire','Langeac'],
 '63':['Clermont-Ferrand','Thiers','Riom','Volvic','Le Mont-Dore','La Bourboule','Issoire','Ambert','Orcines'],
 '69':['Lyon','Villeurbanne','Villefranche-sur-Saône','Tarare','Amplepuis','Thizy-les-Bourgs','Oullins-Pierre-Bénite','Givors'],
 '73':['Chambéry','Aix-les-Bains','Albertville','Beaufort','Bourg-Saint-Maurice','Modane','Courchevel','Méribel','Val Thorens','Tignes',"Val-d'Isère",'La Plagne','Les Arcs','Séez','Saint-Jean-de-Maurienne'],
 '74':['Annecy','Chamonix-Mont-Blanc','Le Grand-Bornand','Châtel','Megève','Évian-les-Bains','Thonon-les-Bains','Morzine','Avoriaz','La Clusaz','Cluses','Sallanches','Saint-Gervais-les-Bains','Samoëns','Yvoire']
};
const NAMES={'01':'Ain','03':'Allier','07':'Ardèche','15':'Cantal','26':'Drôme','38':'Isère','42':'Loire','43':'Haute-Loire','63':'Puy-de-Dôme','69':'Rhône','73':'Savoie','74':'Haute-Savoie'};
const NEED_CHIPS=new Set(['fabric','craft','heritage','nature','view','jewelry']);
const failures=[],warnings=[],seen=new Map();
const browser=await chromium.launch({headless:true});
function isFiction(p){return !!(p.fictional||p.fictionalFamily||p.fictionalFuture||p.evolutive||/famille événementielle/i.test(String(p.name||'')))}

async function runCity(code,city,control={}){
 const context=await browser.newContext({viewport:{width:1280,height:800}});control.context=context;
 const page=await context.newPage();page.setDefaultTimeout(8000);
 const presence={city,departmentCode:code,departmentName:NAMES[code],lat:46,lng:4,reason:'visit'};
 const pageErrors=[],consoleErrors=[];
 page.on('pageerror',e=>pageErrors.push(String(e.message||e)));
 page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
 await page.route('**/*',r=>{const u=r.request().url(),t=r.request().resourceType();if(['image','media','font'].includes(t)||u.includes('tile.openstreetmap.org'))return r.abort();return r.continue()});
 await page.addInitScript(p=>{
  localStorage.setItem('haute-couture-current-presence-v1',JSON.stringify(p));
  window.__qaCapturedPlaces=[];
  const nativeDefineProperty=Object.defineProperty;
  Object.defineProperty=function(target,prop,descriptor){
   if(target===window&&prop==='HCLocalMap'&&descriptor&&typeof descriptor.set==='function'&&typeof descriptor.get==='function'){
    const originalSet=descriptor.set;
    const wrapped={...descriptor,set(v){
     if(v?.addMarker&&!v.__qaUnderlyingCaptureWrapped){
      const originalAdd=v.addMarker.bind(v);
      v.addMarker=function(place){try{window.__qaCapturedPlaces.push(JSON.parse(JSON.stringify(place)))}catch(_){window.__qaCapturedPlaces.push(place)}return originalAdd(place)};
      v.__qaUnderlyingCaptureWrapped=true;
     }
     return originalSet.call(this,v);
    }};
    const result=nativeDefineProperty.call(Object,target,prop,wrapped);Object.defineProperty=nativeDefineProperty;return result;
   }
   return nativeDefineProperty.call(Object,target,prop,descriptor);
  };
 },presence);
 try{
  await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000});
  await page.waitForFunction(()=>!!window.HCTerritoryContext&&!!window.HCTerritorialPlaceInterfaceV1&&!!window.HCLocalMap,{timeout:10000});
  await page.waitForFunction(()=>Array.isArray(window.__qaCapturedPlaces)&&window.__qaCapturedPlaces.length>0,{timeout:8000});
  let previous=-1,stable=0;
  for(let i=0;i<24&&stable<5;i++){const n=await page.evaluate(()=>window.__qaCapturedPlaces?.length||0);if(n>0&&n===previous)stable++;else{stable=0;previous=n}await page.waitForTimeout(120)}
  const markers=await page.evaluate(()=>[...(window.__qaCapturedPlaces||[])]),unique=[],ids=new Set();
  for(const p of markers){if(!p?.id||ids.has(p.id))continue;ids.add(p.id);unique.push(p)}
  console.log(`CITY ${code} ${city} · ${unique.length} marqueur(s)`);if(!unique.length)failures.push(`${code} ${city}: aucun marqueur injecté`);

  const fresh=unique.filter(p=>p?.id&&!seen.has(p.id));
  const snapshots=[];
  const CHUNK=4;
  for(let start=0;start<fresh.length;start+=CHUNK){
   const chunk=fresh.slice(start,start+CHUNK);
   const part=await page.evaluate(places=>places.map(place=>{
    window.HCTerritorialPlaceInterfaceV1.open(place);
    const q=s=>document.querySelector(s),visible=el=>{if(!el)return false;const cs=getComputedStyle(el),r=el.getBoundingClientRect();return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>0&&r.width>1&&r.height>1};
    const overlay=q('#hcTerritorialPlaceOverlay'),shell=q('.tp-shell'),titleEl=q('#tpTitle'),sourceEl=q('#tpSource'),statusEl=q('#tpStatus'),bookEl=q('#tpBook'),travelEl=q('#tpTravel'),closeEl=q('#tpClose'),img=q('#tpHero img');
    const sr=shell?.getBoundingClientRect(),actions=[...document.querySelectorAll('[data-tpa]')];
    return{title:titleEl?.textContent?.trim()||'',source:sourceEl?.textContent?.trim()||'',flag:q('#tpHero .tp-mediaflag')?.textContent?.trim()||'',status:statusEl?.textContent?.trim()||'',chips:document.querySelectorAll('#tpChips .tp-chip').length,actions:actions.length,visibleActions:actions.filter(visible).length,book:!!bookEl,travel:!!travelEl,img:!!img,imgSrc:img?.getAttribute('src')||'',overlayOpen:!!overlay?.classList.contains('open'),overlayVisible:visible(overlay),shellVisible:visible(shell),titleVisible:visible(titleEl),sourceVisible:visible(sourceEl),statusVisible:visible(statusEl),bookVisible:visible(bookEl),travelVisible:visible(travelEl),closeVisible:visible(closeEl),shellWidth:Math.round(sr?.width||0),shellHeight:Math.round(sr?.height||0),shellFitsViewport:!!sr&&sr.left>=-2&&sr.right<=innerWidth+2&&sr.top>=-2&&sr.bottom<=innerHeight+2};
   }),chunk);
   snapshots.push(...part);
   await page.waitForTimeout(0);
  }

  for(let i=0;i<fresh.length;i++){
   const p=fresh[i],ui=snapshots[i],fictional=isFiction(p);seen.set(p.id,{code,city,name:p.name||p.id,fictional,cat:p.cat||p.category||null});const tag=`${code} | ${city} | ${p.id} | ${p.name||''}`;
   if(!ui.title)failures.push(tag+' · titre manquant');
   if(!ui.overlayOpen||!ui.overlayVisible)failures.push(tag+' · interface de lieu non ouverte/visible');
   if(!ui.shellVisible||ui.shellWidth<280||ui.shellHeight<220)failures.push(tag+` · panneau de lieu invisible ou dimensions invalides (${ui.shellWidth}×${ui.shellHeight})`);
   if(!ui.shellFitsViewport)failures.push(tag+' · panneau de lieu déborde du viewport desktop');
   if(!ui.titleVisible)failures.push(tag+' · titre présent mais non visible');if(!ui.statusVisible)failures.push(tag+' · statut réel/fictif présent mais non visible');if(!ui.sourceVisible)failures.push(tag+' · source média présente mais non visible');if(!ui.closeVisible)failures.push(tag+' · bouton fermeture non visible');
   if(!String(p.text||p.description||'').trim())failures.push(tag+' · texte propre au lieu manquant');if(!String(p.unlock||'').trim())failures.push(tag+' · gain/effet propre au lieu manquant');
   if(ui.actions<2)failures.push(tag+` · actions insuffisantes (${ui.actions})`);if(ui.visibleActions!==ui.actions)failures.push(tag+` · actions présentes mais non toutes visibles (${ui.visibleActions}/${ui.actions})`);
   if(!ui.book||!ui.travel)failures.push(tag+' · boutons Book/déplacement manquants');if(!ui.bookVisible||!ui.travelVisible)failures.push(tag+' · boutons Book/déplacement présents mais non visibles');
   if(NEED_CHIPS.has(p.cat)&&!(p.materials?.length||p.motifs?.length||p.palette?.length))failures.push(tag+' · matières/motifs/palette absents');
   if(fictional){if(!/FICTIONNEL/.test(ui.status)||!/ILLUSTRATION|FICTIF/.test(ui.flag))failures.push(tag+' · fiction/événement évolutif mal signalé')}else{if(ui.flag!=='PHOTO RÉELLE')failures.push(tag+' · photo réelle validée absente');if(!ui.img||!ui.imgSrc)failures.push(tag+' · URL image absente');if(!ui.source||/manquante|revalider/i.test(ui.source))failures.push(tag+' · source image absente/non validée');if(!/RÉEL \/ DOCUMENTAIRE/.test(ui.status))failures.push(tag+' · statut documentaire absent')}
  }
  if(pageErrors.some(x=>/SyntaxError|ReferenceError|TypeError/.test(x)))failures.push(`${code} ${city} · erreur page: ${pageErrors.join(' | ')}`);if(consoleErrors.some(x=>/Uncaught|ReferenceError|SyntaxError|TypeError/i.test(x)))failures.push(`${code} ${city} · erreur console: ${consoleErrors.join(' | ')}`);
 }finally{if(control.context===context)control.context=null;await Promise.race([context.close().catch(()=>{}),new Promise(r=>setTimeout(r,2500))])}
}

async function runCityBounded(code,city,ms=20000){
 const control={context:null};let timer,timedOut=false;const task=runCity(code,city,control);const guardedTask=task.catch(e=>{if(timedOut)return new Promise(()=>{});throw e});
 const deadline=new Promise((_,reject)=>{timer=setTimeout(async()=>{timedOut=true;const err=new Error(`timeout ville ${code} ${city} après ${ms}ms`);try{await control.context?.close()}catch(_){}reject(err)},ms)});
 try{return await Promise.race([guardedTask,deadline])}finally{clearTimeout(timer);if(control.context){try{await control.context.close()}catch(_){}control.context=null}await Promise.race([task.catch(()=>{}),new Promise(r=>setTimeout(r,2500))])}
}

const entries=Object.entries(DEPTS).filter(([c])=>!ONLY||c===ONLY);if(ONLY&&!entries.length)throw new Error('HC_DEPT inconnu: '+ONLY);
for(const [code,cities] of entries){for(const city of cities){const seenBefore=new Set(seen.keys()),failBefore=failures.length;try{await runCityBounded(code,city,20000)}catch(e){if(/timeout ville/.test(String(e?.message||e))){failures.length=failBefore;for(const id of [...seen.keys()])if(!seenBefore.has(id))seen.delete(id);warnings.push(`${code} ${city} · premier passage expiré, retry unique avec le même timeout 20 s`);try{await runCityBounded(code,city,20000);continue}catch(retryError){e=retryError}}failures.push(`${code} ${city} · chargement/QA impossible: ${e.message}`)}}}
await browser.close();
const rows=[...seen.entries()].map(([id,x])=>({id,...x}));console.log(`\nTOTAL CLIQUABLES UNIQUES${ONLY?' '+ONLY:''}: ${rows.length}`);console.log(`RÉELS: ${rows.filter(x=>!x.fictional).length} · FICTIFS/ÉVOLUTIFS: ${rows.filter(x=>x.fictional).length}`);if(warnings.length){console.log(`AVERTISSEMENTS: ${warnings.length}`);for(const w of warnings)console.log('!',w)}
const uniq=[...new Set(failures)];if(uniq.length){console.error(`\nRECETTE EXHAUSTIVE${ONLY?' '+ONLY:''}: ${uniq.length} défaut(s)`);for(const f of uniq)console.error('✗',f);process.exit(1)}
console.log(`\n✓ RECETTE EXHAUSTIVE AURA${ONLY?' '+ONLY:''} PASSÉE · chaque marqueur cliquable a contenu, gain, actions, contrat média et interface visible cohérents.`);
