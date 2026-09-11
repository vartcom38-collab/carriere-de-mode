import { chromium } from 'playwright';

const BASE=process.env.HC_BASE_URL||'http://127.0.0.1:4173/hc-live/ville/';
const failures=[];
const browser=await chromium.launch({headless:true});

async function pageFor(presence){
 const page=await browser.newPage();
 page.setDefaultTimeout(8000);
 const errors=[],consoleErrors=[];
 page.on('pageerror',e=>errors.push(String(e.message||e)));
 page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
 await page.route('**/tile.openstreetmap.org/**',r=>r.abort());
 await page.addInitScript(p=>{
  localStorage.setItem('haute-couture-current-presence-v1',JSON.stringify(p));
  window.__qaCapturedPlaces=[];
  let localMapValue;
  Object.defineProperty(window,'HCLocalMap',{
   configurable:true,
   get(){return localMapValue},
   set(v){
    localMapValue=v;
    if(v?.addMarker&&!v.__qaCaptureWrapped){
     const original=v.addMarker.bind(v);
     v.addMarker=function(place){window.__qaCapturedPlaces.push(place);return original(place)};
     v.__qaCaptureWrapped=true;
    }
   }
  });
 },presence);
 await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:20000});
 await page.waitForFunction(()=>!!window.HCTerritoryContext&&!!window.HCTerritorialPlaceInterfaceV1&&!!window.__HCTerritorialPlaceMediaAURAFinalV1,{timeout:12000});
 return{page,errors,consoleErrors};
}

function browserErrors(label,errors,consoleErrors){
 if(errors.some(x=>/SyntaxError|ReferenceError/.test(x)))failures.push(label+': erreur navigateur '+errors.join(' | '));
 if(consoleErrors.some(x=>/Uncaught|ReferenceError|SyntaxError/i.test(x)))failures.push(label+': erreur console '+consoleErrors.join(' | '));
}

async function exercise({label,presence,targetId,ready,stats,focus,expectedText}){
 const {page,errors,consoleErrors}=await pageFor(presence);
 await page.waitForFunction(({targetId,ready})=>{
  const place=(window.__qaCapturedPlaces||[]).find(x=>x.id===targetId);
  const ok=ready==='isere'?!!window.HCIsereTerritorialGameplay:
   ready==='loire'?!!window.HCLoireDenseCityBanksV1:
   ready==='rhone'?!!window.HCRhoneDenseCityBanks:false;
  return !!place&&ok;
 },{targetId,ready},{timeout:12000});

 const runtime=await page.evaluate(({targetId,ready})=>{
  const place=(window.__qaCapturedPlaces||[]).find(x=>x.id===targetId)||null;
  let totals=null;
  if(ready==='isere'){
   const g=window.HCIsereTerritorialGameplay;
   totals={people:g?.people?.length||0,briefs:g?.briefs?.length||0,secrets:g?.secrets?.length||0,events:g?.eventFamilies?.length||0};
  }
  if(ready==='loire'){
   const cities=window.HCLoireDenseCityBanksV1?.cities||{};
   totals=Object.values(cities).reduce((a,c)=>({people:a.people+(c.people?.length||0),briefs:a.briefs+(c.briefs?.length||0),secrets:a.secrets+(c.secrets?.length||0),events:a.events+(c.events?.length||0)}),{people:0,briefs:0,secrets:0,events:0});
  }
  if(ready==='rhone'){
   const cities=window.HCRhoneDenseCityBanks?.cities||{};
   totals=Object.values(cities).reduce((a,c)=>({people:a.people+(c.people?.length||0),briefs:a.briefs+(c.briefs?.length||0),secrets:a.secrets+(c.secrets?.length||0),events:a.events+(c.eventFamilies?.length||0)}),{people:0,briefs:0,secrets:0,events:0});
  }
  return{presence:window.HCTerritoryContext.getPresence?.(),place,totals,gardStack:!!document.querySelector('[data-hc-gard-base],[data-hc-nimes-local-life],[data-hc-nimes-place-ui]')};
 },{targetId,ready});
 console.log(label+' RUNTIME',JSON.stringify({presence:runtime.presence,totals:runtime.totals,place:runtime.place?.id,gardStack:runtime.gardStack}));
 if(runtime.presence?.city!==presence.city||runtime.presence?.departmentCode!==presence.departmentCode)failures.push(label+': présence incorrecte');
 if(runtime.gardStack)failures.push(label+': stack Gard/Nîmes chargé hors Gard');
 for(const [k,min] of Object.entries(stats||{}))if((runtime.totals?.[k]||0)<min)failures.push(`${label}: volume ${k} insuffisant (${runtime.totals?.[k]||0} < ${min})`);

 const beforePresence=await page.evaluate(()=>localStorage.getItem('haute-couture-current-presence-v1'));
 const placeUI=await page.evaluate(targetId=>{
  const p=(window.__qaCapturedPlaces||[]).find(x=>x.id===targetId);if(!p)return{missing:true};
  window.HCTerritorialPlaceInterfaceV1.open(p);
  return{title:document.querySelector('#tpTitle')?.textContent||null,flag:document.querySelector('#tpHero .tp-mediaflag')?.textContent?.trim()||null,source:document.querySelector('#tpSource')?.textContent?.trim()||null,status:document.querySelector('#tpStatus')?.textContent?.trim()||null,text:document.querySelector('#tpText')?.textContent||null,buttons:document.querySelectorAll('[data-tpa]').length};
 },targetId);
 console.log(label+' PLACE',JSON.stringify({title:placeUI.title,flag:placeUI.flag,buttons:placeUI.buttons,source:placeUI.source}));
 if(placeUI.missing)failures.push(label+': lieu documentaire absent');
 if(placeUI.flag!=='PHOTO RÉELLE')failures.push(label+': photo réelle absente');
 if(!placeUI.source)failures.push(label+': source documentaire absente');
 if(!/RÉEL \/ DOCUMENTAIRE/.test(placeUI.status||''))failures.push(label+': statut documentaire absent');
 if(placeUI.buttons<3)failures.push(label+': actions contextuelles insuffisantes');
 if(expectedText&&!expectedText.test(placeUI.text||''))failures.push(label+': texte documentaire attendu absent');

 const beforeTime=await page.evaluate(()=>Number(window.HCGame?.get?.()?.clock?.totalMinutes||0));
 await page.evaluate(()=>document.querySelector('[data-tpa]')?.click());
 await page.waitForTimeout(120);
 const action=await page.evaluate(targetId=>({time:Number(window.HCGame?.get?.()?.clock?.totalMinutes||0),state:JSON.parse(localStorage.getItem('haute-couture-territorial-place-actions-v1')||'{}'),presence:localStorage.getItem('haute-couture-current-presence-v1'),targetId}),targetId);
 const actionCount=action.state?.places?.[targetId]?.actions||0;
 console.log(label+' ACTION',JSON.stringify({beforeTime,afterTime:action.time,actions:actionCount}));
 if(!(action.time>beforeTime))failures.push(label+': action sans consommation de temps');
 if(!actionCount)failures.push(label+': mémoire d’action non persistée');
 if(action.presence!==beforePresence)failures.push(label+': action a déplacé Marion');

 const focusResult=await page.evaluate(focus=>{
  const before=localStorage.getItem('haute-couture-current-presence-v1');
  window.HCFranceGeo=window.HCFranceGeo||{};
  window.HCFranceGeo.state={region:{nom:'Auvergne-Rhône-Alpes'},department:{code:focus.departmentCode,nom:focus.departmentName},commune:{nom:focus.city,lat:focus.lat,lng:focus.lng}};
  return{before,after:localStorage.getItem('haute-couture-current-presence-v1'),focus:window.HCTerritoryContext.getMapFocus?.(),preview:window.HCTerritoryContext.isPreviewOnly?.(),presence:window.HCTerritoryContext.getPresence?.()};
 },focus);
 console.log(label+' FOCUS',JSON.stringify({focus:focusResult.focus?.city,preview:focusResult.preview,presence:focusResult.presence?.city}));
 if(focusResult.before!==focusResult.after||focusResult.presence?.city!==presence.city)failures.push(label+': focus carte a déplacé Marion');
 if(focusResult.focus?.city!==focus.city||focusResult.preview!==true)failures.push(label+': focus carte non traité comme aperçu');

 const fiction=await page.evaluate(({presence,label})=>{
  const p={id:'qa-fiction-'+presence.departmentCode,dept:presence.departmentCode,departmentName:presence.departmentName,city:presence.city,name:`Atelier test ${label} · fictif`,cat:'craft',lat:presence.lat,lng:presence.lng,where:presence.city,fictional:true,text:'Contenu fictif de validation.',unlock:'Relation persistante.'};
  window.HCTerritorialPlaceInterfaceV1.open(p);
  return{src:document.querySelector('#tpHero img')?.getAttribute('src')||null,status:document.querySelector('#tpStatus')?.textContent?.trim()||null,buttons:document.querySelectorAll('[data-tpa]').length};
 },{presence,label});
 if(!fiction.src?.startsWith('data:image/svg+xml')||!/FICTIONNEL/.test(fiction.status||'')||fiction.buttons<3)failures.push(label+': rendu fictionnel invalide');

 browserErrors(label,errors,consoleErrors);
 await page.close();
}

try{
 await exercise({label:'ISÈRE',presence:{city:'Bourgoin-Jallieu',departmentCode:'38',departmentName:'Isère',lat:45.5864,lng:5.2733,reason:'visit'},targetId:'is-bj-musee',ready:'isere',stats:{people:20,briefs:20,secrets:10,events:10},focus:{city:'Saint-Étienne',departmentCode:'42',departmentName:'Loire',lat:45.4397,lng:4.3872},expectedText:/Tissage|impression textile|ennoblissement/i});
 await exercise({label:'LOIRE',presence:{city:'Saint-Chamond',departmentCode:'42',departmentName:'Loire',lat:45.475,lng:4.514,reason:'visit'},targetId:'lo42-sc-tresses',ready:'loire',stats:{people:256,briefs:416,secrets:120,events:72},focus:{city:'Lyon',departmentCode:'69',departmentName:'Rhône',lat:45.764,lng:4.8357},expectedText:/tresses|lacets|ruban/i});
 await exercise({label:'RHÔNE',presence:{city:'Amplepuis',departmentCode:'69',departmentName:'Rhône',lat:45.972,lng:4.331,reason:'visit'},targetId:'rh-dense-amplepuis-thimonnier',ready:'rhone',stats:{people:256,briefs:416,secrets:120,events:72},focus:{city:'Grenoble',departmentCode:'38',departmentName:'Isère',lat:45.1885,lng:5.7245},expectedText:/Thimonnier|machine à coudre|assemblage/i});
}finally{await browser.close()}

if(failures.length){console.error(`\nAURA FINAL E2E : ${failures.length} échec(s)`);for(const f of failures)console.error('✗',f);process.exit(1)}
console.log('\n✓ ISÈRE + LOIRE + RHÔNE E2E COMPLET PASSÉ · lieux réels + médias sourcés + densité + actions + temps + mémoire + fiction + anti-téléportation');
