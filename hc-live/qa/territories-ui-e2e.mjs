import { chromium } from 'playwright';

const BASE=process.env.HC_BASE_URL||'http://127.0.0.1:4173/hc-live/ville/';
const failures=[];
const browser=await chromium.launch({headless:true});

async function main(){
 const page=await browser.newPage();
 page.setDefaultTimeout(5000);
 const errors=[],consoleErrors=[];
 page.on('pageerror',e=>errors.push(String(e.message||e)));
 page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
 // Les tuiles OSM ne sont pas nécessaires au test fonctionnel et peuvent ralentir la CI.
 await page.route('**/tile.openstreetmap.org/**',route=>route.abort());
 await page.addInitScript(()=>localStorage.setItem('haute-couture-current-presence-v1',JSON.stringify({city:'Bourg-en-Bresse',departmentCode:'01',departmentName:'Ain',lat:46.205,lng:5.226,reason:'visit'})));
 await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:20000});
 try{
   await page.waitForFunction(()=>!!window.HCTerritoryContext&&!!window.HCLocalMap&&!!window.HCTerritorialPlaceInterfaceV1,{timeout:8000});
 }catch(e){
   const diag=await page.evaluate(()=>({hasLeaflet:!!window.L,hasContext:!!window.HCTerritoryContext,hasMap:!!window.HCLocalMap,hasMedia:!!window.HCTerritorialPlaceMediaAURA,hasInterface:!!window.HCTerritorialPlaceInterfaceV1,presence:localStorage.getItem('haute-couture-current-presence-v1'),scripts:[...document.scripts].map(s=>s.src||'[inline]').filter(Boolean)})).catch(()=>({evaluation:'failed'}));
   throw new Error('AIN bootstrap timeout · '+JSON.stringify(diag)+' · pageErrors='+errors.join(' || ')+' · consoleErrors='+consoleErrors.join(' || '));
 }
 console.log('✓ AIN bootstrap réel /ville');

 const beforePresence=await page.evaluate(()=>localStorage.getItem('haute-couture-current-presence-v1'));
 await page.evaluate(()=>window.HCTerritorialPlaceInterfaceV1.open({id:'ain-brou',dept:'01',departmentName:'Ain',city:'Bourg-en-Bresse',name:'Monastère royal de Brou',cat:'heritage',lat:46.19766,lng:5.23576,where:'Bourg-en-Bresse · Ain',text:'Architecture, sculpture, dentelle de pierre et recherche patrimoniale.',palette:['ivoire','pierre'],materials:['toile'],motifs:['arcades'],unlock:'BOOK_RESEARCH · DESIGN_REFERENCE.'}));
 await page.waitForFunction(()=>document.querySelector('#hcTerritorialPlaceOverlay')?.classList.contains('open'),{timeout:3000});
 const brou=await page.evaluate(()=>({
   title:document.querySelector('#tpTitle')?.textContent||null,
   flag:document.querySelector('#tpHero .tp-mediaflag')?.textContent?.trim()||null,
   src:document.querySelector('#tpHero img')?.getAttribute('src')||null,
   source:document.querySelector('#tpSource')?.textContent?.trim()||null,
   fallback:!!document.querySelector('#tpHero .tp-fallback'),
   actionsHostCount:document.querySelectorAll('#tpActions').length,
   buttons:document.querySelectorAll('[data-tpa]').length,
   actionsHtml:document.querySelector('#tpActions')?.innerHTML||null,
   heritage:window.HCTerritorialPlaceInterfaceV1?.actions?.heritage||null
 }));
 console.log('AIN BROU DIAG',JSON.stringify(brou));
 if(brou.title!=='Monastère royal de Brou')failures.push('Ain Brou: mauvais titre rendu');
 if(brou.flag!=='PHOTO RÉELLE')failures.push('Ain Brou: badge média inattendu: '+brou.flag);
 if(!brou.src||!/Monast|Brou/i.test(decodeURIComponent(brou.src)))failures.push('Ain Brou: photo documentaire non injectée');
 if(!/Wikimedia Commons/i.test(brou.source||''))failures.push('Ain Brou: source documentaire absente');
 if(brou.fallback)failures.push('Ain Brou: fallback affiché malgré photo documentée');
 if(brou.buttons===0)failures.push('Ain Brou: aucun bouton action rendu · '+JSON.stringify(brou));
 try{await page.waitForFunction(()=>{const i=document.querySelector('#tpHero img');return !!i&&i.complete&&i.naturalWidth>0},{timeout:8000})}catch(_){failures.push('Ain Brou: vraie image non chargée dans Chromium')}

 if(brou.buttons>0){
   const beforeTime=await page.evaluate(()=>Number(window.HCGame?.get?.()?.clock?.totalMinutes||0));
   const clicked=await page.evaluate(()=>{const b=document.querySelector('[data-tpa]');if(!b)return false;b.click();return true});
   if(!clicked)failures.push('Ain Brou: bouton présent mais clic impossible');
   await page.waitForTimeout(100);
   const actionResult=await page.evaluate(()=>({time:Number(window.HCGame?.get?.()?.clock?.totalMinutes||0),state:JSON.parse(localStorage.getItem('haute-couture-territorial-place-actions-v1')||'{}'),presence:localStorage.getItem('haute-couture-current-presence-v1')}));
   console.log('AIN ACTION RESULT',JSON.stringify({beforeTime,afterTime:actionResult.time,actions:actionResult.state?.places?.['ain-brou']?.actions||0}));
   if(!(actionResult.time>beforeTime))failures.push('Ain Brou: action sans consommation de temps');
   if(!actionResult.state?.places?.['ain-brou']?.actions)failures.push('Ain Brou: mémoire de lieu non persistée');
   if(actionResult.presence!==beforePresence)failures.push('Ain Brou: action a déplacé Marion');
 }

 window.focus();
 const focusResult=await page.evaluate(()=>{const before=localStorage.getItem('haute-couture-current-presence-v1');window.HCFranceGeo=window.HCFranceGeo||{};window.HCFranceGeo.state={region:{nom:'Auvergne-Rhône-Alpes'},department:{code:'69',nom:'Rhône'},commune:{nom:'Lyon',lat:45.764,lng:4.835}};return{before,after:localStorage.getItem('haute-couture-current-presence-v1'),focus:window.HCTerritoryContext.getMapFocus?.(),preview:window.HCTerritoryContext.isPreviewOnly?.(),presence:window.HCTerritoryContext.getPresence?.()}});
 console.log('AIN FOCUS RESULT',JSON.stringify(focusResult));
 if(focusResult.before!==focusResult.after||focusResult.presence?.city!=='Bourg-en-Bresse')failures.push('Ain: focus Lyon a modifié la présence physique');
 if(focusResult.focus?.city!=='Lyon'||focusResult.preview!==true)failures.push('Ain: focus Lyon non reconnu comme aperçu');

 await page.evaluate(()=>window.HCTerritorialPlaceInterfaceV1.open({id:'bou-photo',dept:'01',departmentName:'Ain',city:'Bourg-en-Bresse',name:'Studio Bocage · fictif',cat:'people',lat:46.2036,lng:5.2228,where:'Bourg-en-Bresse',fictional:true,text:'Photographe fictive.',unlock:'Book · shooting · relation persistante.'}));
 await page.waitForFunction(()=>document.querySelector('#tpTitle')?.textContent==='Studio Bocage · fictif',{timeout:3000});
 const fiction=await page.evaluate(()=>({src:document.querySelector('#tpHero img')?.getAttribute('src')||null,flag:document.querySelector('#tpHero .tp-mediaflag')?.textContent?.trim()||null,source:document.querySelector('#tpSource')?.textContent?.trim()||null,status:document.querySelector('#tpStatus')?.textContent?.trim()||null,buttons:document.querySelectorAll('[data-tpa]').length}));
 console.log('AIN FICTION DIAG',JSON.stringify(fiction));
 if(!fiction.src?.startsWith('data:image/svg+xml'))failures.push('Ain fictif: illustration SVG absente');
 if(!/ILLUSTRATION \/ LIEU FICTIF/i.test(fiction.flag||''))failures.push('Ain fictif: badge incorrect: '+fiction.flag);
 if(!/Illustration générée par Haute Couture Live/i.test(fiction.source||'')||!/FICTIONNEL/.test(fiction.status||''))failures.push('Ain fictif: identification fiction insuffisante');
 if(fiction.buttons===0)failures.push('Ain fictif: aucune action interactive');
 try{await page.waitForFunction(()=>{const i=document.querySelector('#tpHero img');return !!i&&i.complete&&i.naturalWidth>0},{timeout:3000})}catch(_){failures.push('Ain fictif: SVG ne se rend pas')}

 if(errors.some(x=>/SyntaxError|ReferenceError/.test(x)))failures.push('Ain: erreur navigateur '+errors.join(' | '));
 if(consoleErrors.some(x=>/Uncaught|ReferenceError|SyntaxError/i.test(x)))failures.push('Ain: erreur console '+consoleErrors.join(' | '));
}

try{await main()}finally{await browser.close()}
if(failures.length){console.error('\nAIN E2E : '+failures.length+' échec(s)');for(const f of failures)console.error('✗',f);process.exit(1)}
console.log('\n✓ AIN E2E COMPLET PASSÉ · photo réelle + source + fiction + actions + temps + mémoire + anti-téléportation');
