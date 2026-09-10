import { chromium } from 'playwright';

const BASE=process.env.HC_BASE_URL||'http://127.0.0.1:4173/hc-live/ville/';
const failures=[];
const browser=await chromium.launch({headless:true});

async function main(){
 const page=await browser.newPage();
 page.setDefaultTimeout(5000);
 const errors=[],consoleErrors=[];
 page.on('pageerror',e=>errors.push(String(e.message||e)));
 page.on('console',m=>{const text=m.text();if(m.type()==='error')consoleErrors.push(text)});
 await page.route('**/tile.openstreetmap.org/**',route=>route.abort());
 await page.addInitScript(()=>localStorage.setItem('haute-couture-current-presence-v1',JSON.stringify({city:'Bourg-en-Bresse',departmentCode:'01',departmentName:'Ain',lat:46.205,lng:5.226,reason:'visit'})));
 await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:20000});
 await page.waitForFunction(()=>!!window.HCTerritoryContext&&!!window.HCLocalMap&&!!window.HCTerritorialPlaceInterfaceV1,{timeout:8000});
 console.log('✓ AIN bootstrap réel /ville');

 const runtime=await page.evaluate(()=>({
   gardStack:!!document.querySelector('[data-hc-gard-base],[data-hc-nimes-local-life],[data-hc-nimes-place-ui]'),
   media:!!window.HCTerritorialPlaceMediaAURA,
   presence:window.HCTerritoryContext.getPresence?.()
 }));
 if(runtime.gardStack)failures.push('Ain: le stack Gard/Nîmes est chargé hors Gard');
 if(!runtime.media)failures.push('Ain: registre média AURA absent');
 if(runtime.presence?.city!=='Bourg-en-Bresse')failures.push('Ain: présence initiale incorrecte');

 const beforePresence=await page.evaluate(()=>localStorage.getItem('haute-couture-current-presence-v1'));
 const brou=await page.evaluate(()=>{
   window.HCTerritorialPlaceInterfaceV1.open({id:'ain-brou',dept:'01',departmentName:'Ain',city:'Bourg-en-Bresse',name:'Monastère royal de Brou',cat:'heritage',lat:46.19766,lng:5.23576,where:'Bourg-en-Bresse · Ain',text:'Architecture, sculpture, dentelle de pierre et recherche patrimoniale.',palette:['ivoire','pierre'],materials:['toile'],motifs:['arcades'],unlock:'BOOK_RESEARCH · DESIGN_REFERENCE.'});
   return{title:document.querySelector('#tpTitle')?.textContent||null,flag:document.querySelector('#tpHero .tp-mediaflag')?.textContent?.trim()||null,src:document.querySelector('#tpHero img')?.getAttribute('src')||null,source:document.querySelector('#tpSource')?.textContent?.trim()||null,fallback:!!document.querySelector('#tpHero .tp-fallback'),buttons:document.querySelectorAll('[data-tpa]').length,status:document.querySelector('#tpStatus')?.textContent?.trim()||null};
 });
 console.log('AIN BROU',JSON.stringify({title:brou.title,flag:brou.flag,buttons:brou.buttons}));
 if(brou.title!=='Monastère royal de Brou')failures.push('Ain Brou: mauvais titre rendu');
 if(brou.flag!=='PHOTO RÉELLE')failures.push('Ain Brou: badge média inattendu: '+brou.flag);
 if(!brou.src||!/Monast|Brou/i.test(decodeURIComponent(brou.src)))failures.push('Ain Brou: photo documentaire non injectée');
 if(!/Wikimedia Commons/i.test(brou.source||''))failures.push('Ain Brou: source documentaire absente');
 if(brou.fallback)failures.push('Ain Brou: fallback affiché malgré photo documentée');
 if(brou.buttons!==3)failures.push('Ain Brou: actions patrimoine incomplètes');
 if(!/RÉEL \/ DOCUMENTAIRE/.test(brou.status||''))failures.push('Ain Brou: statut documentaire absent');

 const beforeTime=await page.evaluate(()=>Number(window.HCGame?.get?.()?.clock?.totalMinutes||0));
 const clicked=await page.evaluate(()=>{const b=document.querySelector('[data-tpa]');if(!b)return false;b.click();return true});
 if(!clicked)failures.push('Ain Brou: clic action impossible');
 await page.waitForTimeout(100);
 const actionResult=await page.evaluate(()=>({time:Number(window.HCGame?.get?.()?.clock?.totalMinutes||0),state:JSON.parse(localStorage.getItem('haute-couture-territorial-place-actions-v1')||'{}'),presence:localStorage.getItem('haute-couture-current-presence-v1')}));
 console.log('AIN ACTION',JSON.stringify({beforeTime,afterTime:actionResult.time,actions:actionResult.state?.places?.['ain-brou']?.actions||0}));
 if(!(actionResult.time>beforeTime))failures.push('Ain Brou: action sans consommation de temps');
 if(!actionResult.state?.places?.['ain-brou']?.actions)failures.push('Ain Brou: mémoire de lieu non persistée');
 if(actionResult.presence!==beforePresence)failures.push('Ain Brou: action a déplacé Marion');

 const focus=await page.evaluate(()=>{const before=localStorage.getItem('haute-couture-current-presence-v1');window.HCFranceGeo=window.HCFranceGeo||{};window.HCFranceGeo.state={region:{nom:'Auvergne-Rhône-Alpes'},department:{code:'69',nom:'Rhône'},commune:{nom:'Lyon',lat:45.764,lng:4.835}};return{before,after:localStorage.getItem('haute-couture-current-presence-v1'),focus:window.HCTerritoryContext.getMapFocus?.(),preview:window.HCTerritoryContext.isPreviewOnly?.(),presence:window.HCTerritoryContext.getPresence?.()}});
 console.log('AIN FOCUS',JSON.stringify({focus:focus.focus?.city,preview:focus.preview,presence:focus.presence?.city}));
 if(focus.before!==focus.after||focus.presence?.city!=='Bourg-en-Bresse')failures.push('Ain: focus Lyon a modifié la présence physique');
 if(focus.focus?.city!=='Lyon'||focus.preview!==true)failures.push('Ain: focus Lyon non reconnu comme aperçu');

 const fiction=await page.evaluate(()=>{
   window.HCTerritorialPlaceInterfaceV1.open({id:'bou-photo',dept:'01',departmentName:'Ain',city:'Bourg-en-Bresse',name:'Studio Bocage · fictif',cat:'people',lat:46.2036,lng:5.2228,where:'Bourg-en-Bresse',fictional:true,text:'Photographe fictive.',unlock:'Book · shooting · relation persistante.'});
   return{title:document.querySelector('#tpTitle')?.textContent||null,src:document.querySelector('#tpHero img')?.getAttribute('src')||null,flag:document.querySelector('#tpHero .tp-mediaflag')?.textContent?.trim()||null,source:document.querySelector('#tpSource')?.textContent?.trim()||null,status:document.querySelector('#tpStatus')?.textContent?.trim()||null,buttons:document.querySelectorAll('[data-tpa]').length};
 });
 console.log('AIN FICTION',JSON.stringify({title:fiction.title,flag:fiction.flag,buttons:fiction.buttons,svg:fiction.src?.startsWith('data:image/svg+xml')}));
 if(fiction.title!=='Studio Bocage · fictif')failures.push('Ain fictif: fiche non actualisée');
 if(!fiction.src?.startsWith('data:image/svg+xml'))failures.push('Ain fictif: illustration SVG absente');
 if(!/ILLUSTRATION \/ LIEU FICTIF/i.test(fiction.flag||''))failures.push('Ain fictif: badge incorrect: '+fiction.flag);
 if(!/Illustration générée par Haute Couture Live/i.test(fiction.source||'')||!/FICTIONNEL/.test(fiction.status||''))failures.push('Ain fictif: identification fiction insuffisante');
 if(fiction.buttons!==3)failures.push('Ain fictif: actions rencontre incomplètes');

 if(errors.some(x=>/SyntaxError|ReferenceError/.test(x)))failures.push('Ain: erreur navigateur '+errors.join(' | '));
 if(consoleErrors.some(x=>/Uncaught|ReferenceError|SyntaxError/i.test(x)))failures.push('Ain: erreur console '+consoleErrors.join(' | '));
}

try{await main()}finally{await browser.close()}
if(failures.length){console.error('\nAIN E2E : '+failures.length+' échec(s)');for(const f of failures)console.error('✗',f);process.exit(1)}
console.log('\n✓ AIN E2E COMPLET PASSÉ · média réel + fiction + actions + temps + mémoire + anti-téléportation + isolation Nîmes');
