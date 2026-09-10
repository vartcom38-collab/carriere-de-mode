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
 const errors=[];page.on('pageerror',e=>errors.push(String(e.message||e)));
 await page.addInitScript(({code,dept,city,lat,lng})=>{
   localStorage.setItem('haute-couture-current-presence-v1',JSON.stringify({city,departmentCode:code,departmentName:dept,lat,lng,reason:'visit'}));
 },{code,dept,city,lat,lng});
 await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>!!window.HCTerritorialPlaceInterfaceV1&&!!window.HCTerritoryContext,{timeout:25000});
 return {page,errors};
}

try{
 // Smoke navigateur des 12 départements + stations 73/74.
 for(const [code,dept,city,lat,lng] of cases){
   const {page,errors}=await pageForPresence(code,dept,city,lat,lng);
   try{
     const presenceBefore=await page.evaluate(()=>localStorage.getItem('haute-couture-current-presence-v1'));
     await page.evaluate(({code,dept,city,lat,lng})=>window.HCTerritorialPlaceInterfaceV1.open({id:'qa-'+code,name:'QA '+city,dept:code,departmentName:dept,city,lat,lng,cat:'culture',text:'QA interface',palette:['test'],materials:['test'],motifs:['test'],fictional:true}),{code,dept,city,lat,lng});
     await page.locator('#hcTerritorialPlaceOverlay.open').waitFor({timeout:5000});
     const presenceAfter=await page.evaluate(()=>localStorage.getItem('haute-couture-current-presence-v1'));
     if(presenceBefore!==presenceAfter)failures.push(`${code} ${city}: ouvrir une fiche a modifié la présence`);
     await page.locator('#tpClose').click();
     if(errors.some(x=>/SyntaxError|ReferenceError/.test(x)))failures.push(`${code} ${city}: erreur navigateur ${errors.join(' | ')}`);
     console.log('✓ département',code,city,'interface ouverte sans téléportation');
   }catch(e){failures.push(`${code} ${city}: ${e.message}`)}
   await page.close();
 }

 // Contrat catégories + temps de jeu.
 {
   const {page}=await pageForPresence('69','Rhône','Lyon',45.764,4.835);
   const supported=await page.evaluate(cats=>cats.every(c=>Array.isArray(window.HCTerritorialPlaceInterfaceV1.actions[c])&&window.HCTerritorialPlaceInterfaceV1.actions[c].length),cats);
   if(!supported)failures.push('Toutes les catégories UI ne possèdent pas des actions dédiées');
   const before=await page.evaluate(()=>window.HCGame.get().clock.totalMinutes||0);
   await page.evaluate(()=>window.HCTerritorialPlaceInterfaceV1.open({id:'qa-time',name:'QA temps',dept:'69',departmentName:'Rhône',city:'Lyon',lat:45.764,lng:4.835,cat:'heritage',text:'QA',fictional:true}));
   await page.locator('[data-tpa]').first().click();await page.waitForTimeout(250);
   const after=await page.evaluate(()=>window.HCGame.get().clock.totalMinutes||0);if(!(after>before))failures.push('Une action de lieu ne fait pas avancer le temps de jeu');
   console.log('✓',cats.length,'catégories avec actions dédiées ; temps de jeu consommé');
   await page.close();
 }

 // AIN : vraie photo + source documentaire réellement rendues.
 {
   const {page,errors}=await pageForPresence('01','Ain','Bourg-en-Bresse',46.205,5.226);
   const beforePresence=await page.evaluate(()=>localStorage.getItem('haute-couture-current-presence-v1'));
   await page.evaluate(()=>window.HCTerritorialPlaceInterfaceV1.open({
     id:'ain-brou',dept:'01',departmentName:'Ain',city:'Bourg-en-Bresse',name:'Monastère royal de Brou',cat:'heritage',lat:46.19766,lng:5.23576,where:'Bourg-en-Bresse · Ain',text:'Architecture, sculpture, dentelle de pierre et recherche patrimoniale.',palette:['ivoire','pierre'],materials:['toile'],motifs:['arcades'],unlock:'BOOK_RESEARCH · DESIGN_REFERENCE.'
   }));
   await page.locator('#hcTerritorialPlaceOverlay.open').waitFor({timeout:5000});
   const flag=(await page.locator('#tpHero .tp-mediaflag').textContent()||'').trim();
   const src=await page.locator('#tpHero img').getAttribute('src');
   const source=(await page.locator('#tpSource').textContent()||'').trim();
   if(flag!=='PHOTO RÉELLE')failures.push(`Ain Brou: badge média inattendu: ${flag}`);
   if(!src||!/Monast|Brou/i.test(decodeURIComponent(src)))failures.push('Ain Brou: la photo documentaire du registre n’est pas injectée');
   if(!/Wikimedia Commons/i.test(source))failures.push('Ain Brou: source documentaire absente de l’interface');
   try{await page.waitForFunction(()=>{const i=document.querySelector('#tpHero img');return !!i&&i.complete&&i.naturalWidth>0},{timeout:15000})}catch(_){failures.push('Ain Brou: la vraie image ne se charge pas dans Chromium')}
   if(await page.locator('#tpHero .tp-fallback').count())failures.push('Ain Brou: fallback affiché malgré une photo documentée');

   // Une action doit modifier temps + mémoire, sans modifier la présence physique.
   const beforeTime=await page.evaluate(()=>window.HCGame.get().clock.totalMinutes||0);
   await page.locator('[data-tpa]').first().click();await page.waitForTimeout(250);
   const actionState=await page.evaluate(()=>JSON.parse(localStorage.getItem('haute-couture-territorial-place-actions-v1')||'{}'));
   const afterTime=await page.evaluate(()=>window.HCGame.get().clock.totalMinutes||0);
   const afterPresence=await page.evaluate(()=>localStorage.getItem('haute-couture-current-presence-v1'));
   if(!(afterTime>beforeTime))failures.push('Ain Brou: action sans consommation de temps');
   if(!actionState?.places?.['ain-brou']?.actions)failures.push('Ain Brou: action non persistée dans la mémoire de lieu');
   if(afterPresence!==beforePresence)failures.push('Ain Brou: action a modifié la présence physique');
   await page.locator('#tpClose').click();

   // Focus carte : doit pouvoir viser Lyon sans déplacer Marion de Bourg-en-Bresse.
   const focusResult=await page.evaluate(()=>{
     const before=localStorage.getItem('haute-couture-current-presence-v1');
     window.HCFranceGeo=window.HCFranceGeo||{};
     window.HCFranceGeo.state={region:{nom:'Auvergne-Rhône-Alpes'},department:{code:'69',nom:'Rhône'},commune:{nom:'Lyon',lat:45.764,lng:4.835}};
     const focus=window.HCTerritoryContext.getMapFocus?.();
     const preview=window.HCTerritoryContext.isPreviewOnly?.();
     const after=localStorage.getItem('haute-couture-current-presence-v1');
     return{before,after,focus,preview,presence:window.HCTerritoryContext.getPresence?.()};
   });
   if(focusResult.before!==focusResult.after)failures.push('Ain: changer le focus carte a écrit la présence');
   if(focusResult.presence?.city!=='Bourg-en-Bresse')failures.push('Ain: focus Lyon a téléporté Marion hors de Bourg-en-Bresse');
   if(focusResult.focus?.city!=='Lyon'||focusResult.preview!==true)failures.push('Ain: le focus carte Lyon n’est pas reconnu comme aperçu seulement');
   if(errors.some(x=>/SyntaxError|ReferenceError/.test(x)))failures.push(`Ain Brou: erreur navigateur ${errors.join(' | ')}`);
   console.log('✓ Ain réel: photo + source + temps + mémoire + anti-téléportation');
   await page.close();
 }

 // AIN : contenu fictif = illustration clairement marquée, jamais photo réelle.
 {
   const {page,errors}=await pageForPresence('01','Ain','Bourg-en-Bresse',46.205,5.226);
   await page.evaluate(()=>window.HCTerritorialPlaceInterfaceV1.open({id:'bou-photo',dept:'01',departmentName:'Ain',city:'Bourg-en-Bresse',name:'Studio Bocage · fictif',cat:'people',lat:46.2036,lng:5.2228,where:'Bourg-en-Bresse',fictional:true,text:'Photographe fictive travaillant portraits, cérémonies, patrimoine et presse locale.',unlock:'Book · shooting · relation persistante.'}));
   await page.locator('#hcTerritorialPlaceOverlay.open').waitFor({timeout:5000});
   const src=await page.locator('#tpHero img').getAttribute('src');
   const flag=(await page.locator('#tpHero .tp-mediaflag').textContent()||'').trim();
   const source=(await page.locator('#tpSource').textContent()||'').trim();
   const status=(await page.locator('#tpStatus').textContent()||'').trim();
   if(!src?.startsWith('data:image/svg+xml'))failures.push('Ain fictif: illustration SVG de jeu absente');
   if(!/ILLUSTRATION \/ LIEU FICTIF/i.test(flag))failures.push(`Ain fictif: badge incorrect: ${flag}`);
   if(!/Illustration générée par Haute Couture Live/i.test(source))failures.push('Ain fictif: source/mention d’illustration absente');
   if(!/FICTIONNEL/.test(status))failures.push('Ain fictif: statut FICTIONNEL non visible');
   try{await page.waitForFunction(()=>{const i=document.querySelector('#tpHero img');return !!i&&i.complete&&i.naturalWidth>0},{timeout:5000})}catch(_){failures.push('Ain fictif: illustration SVG ne se rend pas')}
   if(errors.some(x=>/SyntaxError|ReferenceError/.test(x)))failures.push(`Ain fictif: erreur navigateur ${errors.join(' | ')}`);
   console.log('✓ Ain fictif: illustration de jeu clairement identifiée');
   await page.close();
 }
}finally{await browser.close()}

if(failures.length){console.error('\nE2E TERRITORIAL : '+failures.length+' échec(s)');for(const f of failures)console.error('✗',f);process.exit(1)}
console.log('\n✓ E2E INTERFACES TERRITORIALES PASSÉ');
