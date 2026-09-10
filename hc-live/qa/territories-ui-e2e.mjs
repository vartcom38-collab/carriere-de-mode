import { chromium } from 'playwright';

const BASE=process.env.HC_BASE_URL||'http://127.0.0.1:4173/hc-live/ville/';
const cases=[
 ['01','Ain','Bourg-en-Bresse',46.205,5.226],['03','Allier','Moulins',46.566,3.334],['07','Ardèche','Annonay',45.24,4.67],
 ['15','Cantal','Aurillac',44.93,2.44],['26','Drôme','Romans-sur-Isère',45.045,5.05],['38','Isère','Grenoble',45.188,5.724],
 ['42','Loire','Saint-Étienne',45.439,4.387],['43','Haute-Loire','Le Puy-en-Velay',45.043,3.885],['63','Puy-de-Dôme','Clermont-Ferrand',45.777,3.087],
 ['69','Rhône','Lyon',45.764,4.835],['73','Savoie','Chambéry',45.565,5.92],['74','Haute-Savoie','Annecy',45.899,6.129],
 ['73','Savoie','Courchevel',45.415,6.634],['74','Haute-Savoie','Cluses',46.06,6.58]
];
const cats=['fabric','craft','culture','heritage','markets','vintage','nature','view','libraries','jewelry','people','cafe','shop','photo'];
let failures=[];
const browser=await chromium.launch({headless:true});

async function pageForPresence(code,dept,city,lat,lng){
 const page=await browser.newPage();
 const errors=[],consoleErrors=[];
 page.on('pageerror',e=>errors.push(String(e.message||e)));
 page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
 await page.addInitScript(({code,dept,city,lat,lng})=>localStorage.setItem('haute-couture-current-presence-v1',JSON.stringify({city,departmentCode:code,departmentName:dept,lat,lng,reason:'visit'})),{code,dept,city,lat,lng});
 await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:30000});
 try{await page.waitForFunction(()=>!!window.HCTerritoryContext&&!!window.HCLocalMap&&!!window.HCTerritorialPlaceInterfaceV1,{timeout:12000})}
 catch(e){const diag=await page.evaluate(()=>({href:location.href,hasLeaflet:!!window.L,hasContext:!!window.HCTerritoryContext,hasMap:!!window.HCLocalMap,hasMedia:!!window.HCTerritorialPlaceMediaAURA,hasInterface:!!window.HCTerritorialPlaceInterfaceV1,presence:localStorage.getItem('haute-couture-current-presence-v1'),scripts:[...document.scripts].map(s=>s.src||'[inline]').filter(Boolean)})).catch(()=>({evaluation:'failed'}));await page.close();throw new Error(`${code} ${city}: bootstrap timeout · ${JSON.stringify(diag)} · pageErrors=${errors.join(' || ')} · consoleErrors=${consoleErrors.join(' || ')}`)}
 return {page,errors,consoleErrors};
}

async function testAin(){
 const {page,errors,consoleErrors}=await pageForPresence('01','Ain','Bourg-en-Bresse',46.205,5.226);
 try{
   const beforePresence=await page.evaluate(()=>localStorage.getItem('haute-couture-current-presence-v1'));
   await page.evaluate(()=>window.HCTerritorialPlaceInterfaceV1.open({id:'ain-brou',dept:'01',departmentName:'Ain',city:'Bourg-en-Bresse',name:'Monastère royal de Brou',cat:'heritage',lat:46.19766,lng:5.23576,where:'Bourg-en-Bresse · Ain',text:'Architecture, sculpture, dentelle de pierre et recherche patrimoniale.',palette:['ivoire','pierre'],materials:['toile'],motifs:['arcades'],unlock:'BOOK_RESEARCH · DESIGN_REFERENCE.'}));
   await page.locator('#hcTerritorialPlaceOverlay.open').waitFor({timeout:5000});
   const flag=(await page.locator('#tpHero .tp-mediaflag').textContent()||'').trim();
   const src=await page.locator('#tpHero img').getAttribute('src');
   const source=(await page.locator('#tpSource').textContent()||'').trim();
   if(flag!=='PHOTO RÉELLE')failures.push(`Ain Brou: badge média inattendu: ${flag}`);
   if(!src||!/Monast|Brou/i.test(decodeURIComponent(src)))failures.push('Ain Brou: photo documentaire non injectée');
   if(!/Wikimedia Commons/i.test(source))failures.push('Ain Brou: source documentaire absente');
   try{await page.waitForFunction(()=>{const i=document.querySelector('#tpHero img');return !!i&&i.complete&&i.naturalWidth>0},{timeout:8000})}catch(_){failures.push('Ain Brou: vraie image non chargée dans Chromium')}
   if(await page.locator('#tpHero .tp-fallback').count())failures.push('Ain Brou: fallback affiché malgré photo documentée');

   const actionDiag=await page.evaluate(()=>({
     title:document.querySelector('#tpTitle')?.textContent||null,
     overlayCount:document.querySelectorAll('#hcTerritorialPlaceOverlay').length,
     actionsHostCount:document.querySelectorAll('#tpActions').length,
     buttons:document.querySelectorAll('[data-tpa]').length,
     actionsHtml:document.querySelector('#tpActions')?.innerHTML||null,
     heritage:window.HCTerritorialPlaceInterfaceV1?.actions?.heritage||null,
     openText:String(window.HCTerritorialPlaceInterfaceV1?.open||'').slice(0,240)
   }));
   console.log('AIN ACTION DIAG',JSON.stringify(actionDiag));
   if(actionDiag.buttons===0){failures.push(`Ain Brou: aucun bouton d’action rendu · ${JSON.stringify(actionDiag)}`)}else{
     const beforeTime=await page.evaluate(()=>window.HCGame.get().clock.totalMinutes||0);
     await page.locator('[data-tpa]').first().click({timeout:5000});await page.waitForTimeout(200);
     const actionState=await page.evaluate(()=>JSON.parse(localStorage.getItem('haute-couture-territorial-place-actions-v1')||'{}'));
     const afterTime=await page.evaluate(()=>window.HCGame.get().clock.totalMinutes||0);
     const afterPresence=await page.evaluate(()=>localStorage.getItem('haute-couture-current-presence-v1'));
     if(!(afterTime>beforeTime))failures.push('Ain Brou: action sans consommation de temps');
     if(!actionState?.places?.['ain-brou']?.actions)failures.push('Ain Brou: mémoire de lieu non persistée');
     if(afterPresence!==beforePresence)failures.push('Ain Brou: action a déplacé Marion');
   }
   await page.locator('#tpClose').click({timeout:5000}).catch(()=>{});
   const focusResult=await page.evaluate(()=>{const before=localStorage.getItem('haute-couture-current-presence-v1');window.HCFranceGeo=window.HCFranceGeo||{};window.HCFranceGeo.state={region:{nom:'Auvergne-Rhône-Alpes'},department:{code:'69',nom:'Rhône'},commune:{nom:'Lyon',lat:45.764,lng:4.835}};return{before,after:localStorage.getItem('haute-couture-current-presence-v1'),focus:window.HCTerritoryContext.getMapFocus?.(),preview:window.HCTerritoryContext.isPreviewOnly?.(),presence:window.HCTerritoryContext.getPresence?.()}});
   if(focusResult.before!==focusResult.after||focusResult.presence?.city!=='Bourg-en-Bresse')failures.push('Ain: focus Lyon a modifié la présence physique');
   if(focusResult.focus?.city!=='Lyon'||focusResult.preview!==true)failures.push('Ain: focus Lyon non reconnu comme aperçu');

   await page.evaluate(()=>window.HCTerritorialPlaceInterfaceV1.open({id:'bou-photo',dept:'01',departmentName:'Ain',city:'Bourg-en-Bresse',name:'Studio Bocage · fictif',cat:'people',lat:46.2036,lng:5.2228,where:'Bourg-en-Bresse',fictional:true,text:'Photographe fictive.',unlock:'Book · shooting · relation persistante.'}));
   await page.locator('#hcTerritorialPlaceOverlay.open').waitFor({timeout:5000});
   const fsrc=await page.locator('#tpHero img').getAttribute('src'),fflag=(await page.locator('#tpHero .tp-mediaflag').textContent()||'').trim(),fsource=(await page.locator('#tpSource').textContent()||'').trim(),status=(await page.locator('#tpStatus').textContent()||'').trim();
   if(!fsrc?.startsWith('data:image/svg+xml'))failures.push('Ain fictif: illustration SVG absente');
   if(!/ILLUSTRATION \/ LIEU FICTIF/i.test(fflag))failures.push(`Ain fictif: badge incorrect: ${fflag}`);
   if(!/Illustration générée par Haute Couture Live/i.test(fsource)||!/FICTIONNEL/.test(status))failures.push('Ain fictif: identification fiction insuffisante');
   try{await page.waitForFunction(()=>{const i=document.querySelector('#tpHero img');return !!i&&i.complete&&i.naturalWidth>0},{timeout:5000})}catch(_){failures.push('Ain fictif: SVG ne se rend pas')}
   if(errors.some(x=>/SyntaxError|ReferenceError/.test(x)))failures.push(`Ain: erreur navigateur ${errors.join(' | ')}`);
   if(consoleErrors.some(x=>/404|Uncaught|ReferenceError|SyntaxError/i.test(x)))failures.push(`Ain: erreur console ${consoleErrors.join(' | ')}`);
   console.log('✓ AIN: photo réelle + source + fiction + anti-téléportation ; actions diagnostiquées');
 }finally{await page.close()}
}

try{
 await testAin();
 for(const [code,dept,city,lat,lng] of cases){
   const {page,errors}=await pageForPresence(code,dept,city,lat,lng);
   try{const before=await page.evaluate(()=>localStorage.getItem('haute-couture-current-presence-v1'));await page.evaluate(({code,dept,city,lat,lng})=>window.HCTerritorialPlaceInterfaceV1.open({id:'qa-'+code,name:'QA '+city,dept:code,departmentName:dept,city,lat,lng,cat:'culture',text:'QA interface',fictional:true}),{code,dept,city,lat,lng});await page.locator('#hcTerritorialPlaceOverlay.open').waitFor({timeout:5000});const after=await page.evaluate(()=>localStorage.getItem('haute-couture-current-presence-v1'));if(before!==after)failures.push(`${code} ${city}: ouverture interface a modifié la présence`);if(errors.some(x=>/SyntaxError|ReferenceError/.test(x)))failures.push(`${code} ${city}: ${errors.join(' | ')}`);console.log('✓ département',code,city,'bootstrap + interface')}finally{await page.close()}
 }
 const {page}=await pageForPresence('69','Rhône','Lyon',45.764,4.835);try{const supported=await page.evaluate(cats=>cats.every(c=>Array.isArray(window.HCTerritorialPlaceInterfaceV1.actions[c])&&window.HCTerritorialPlaceInterfaceV1.actions[c].length),cats);if(!supported)failures.push('Toutes les catégories UI ne possèdent pas des actions dédiées')}finally{await page.close()}
}finally{await browser.close()}

if(failures.length){console.error('\nE2E TERRITORIAL : '+failures.length+' échec(s)');for(const f of failures)console.error('✗',f);process.exit(1)}
console.log('\n✓ E2E INTERFACES TERRITORIALES PASSÉ');
