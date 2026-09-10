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
try{
 for(const [code,dept,city,lat,lng] of cases){
   const page=await browser.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(String(e.message||e)));
   await page.addInitScript(({code,dept,city,lat,lng})=>{
     localStorage.setItem('haute-couture-current-presence-v1',JSON.stringify({city,departmentCode:code,departmentName:dept,lat,lng,reason:'visit'}));
   },{code,dept,city,lat,lng});
   try{
     await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:30000});
     await page.waitForFunction(()=>!!window.HCTerritorialPlaceInterfaceV1,{timeout:25000});
     const presenceBefore=await page.evaluate(()=>localStorage.getItem('haute-couture-current-presence-v1'));
     await page.evaluate(({code,dept,city,lat,lng})=>window.HCTerritorialPlaceInterfaceV1.open({id:'qa-'+code,name:'QA '+city,dept:code,departmentName:dept,city,lat,lng,cat:'culture',text:'QA interface',palette:['test'],materials:['test'],motifs:['test']}),{code,dept,city,lat,lng});
     await page.locator('#hcTerritorialPlaceOverlay.open').waitFor({timeout:5000});
     const presenceAfter=await page.evaluate(()=>localStorage.getItem('haute-couture-current-presence-v1'));
     if(presenceBefore!==presenceAfter)failures.push(`${code} ${city}: ouvrir une fiche a modifié la présence`);
     const hasFallback=await page.locator('#tpHero .tp-fallback').count();if(!hasFallback)failures.push(`${code} ${city}: fallback média réel absent en QA`);
     await page.locator('#tpClose').click();
     console.log('✓ département',code,city,'interface ouverte sans téléportation');
     if(errors.some(x=>/SyntaxError|ReferenceError/.test(x)))failures.push(`${code} ${city}: erreur navigateur ${errors.join(' | ')}`);
   }catch(e){failures.push(`${code} ${city}: ${e.message}`)}
   await page.close();
 }
 // Contrat des catégories et consommation du vrai temps de jeu sur une page réelle.
 const page=await browser.newPage();
 await page.addInitScript(()=>localStorage.setItem('haute-couture-current-presence-v1',JSON.stringify({city:'Lyon',departmentCode:'69',departmentName:'Rhône',lat:45.764,lng:4.835,reason:'visit'})));
 await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:30000});await page.waitForFunction(()=>!!window.HCTerritorialPlaceInterfaceV1,{timeout:25000});
 const supported=await page.evaluate(cats=>cats.every(c=>Array.isArray(window.HCTerritorialPlaceInterfaceV1.actions[c])&&window.HCTerritorialPlaceInterfaceV1.actions[c].length),cats);
 if(!supported)failures.push('Toutes les catégories UI ne possèdent pas des actions dédiées');
 const before=await page.evaluate(()=>window.HCGame.get().clock.totalMinutes||0);
 await page.evaluate(()=>window.HCTerritorialPlaceInterfaceV1.open({id:'qa-time',name:'QA temps',dept:'69',departmentName:'Rhône',city:'Lyon',lat:45.764,lng:4.835,cat:'heritage',text:'QA',fictional:true}));
 await page.locator('[data-tpa]').first().click();await page.waitForTimeout(250);
 const after=await page.evaluate(()=>window.HCGame.get().clock.totalMinutes||0);if(!(after>before))failures.push('Une action de lieu ne fait pas avancer le temps de jeu');
 console.log('✓',cats.length,'catégories avec actions dédiées ; temps de jeu consommé');
 await page.close();
}finally{await browser.close()}
if(failures.length){console.error('\nE2E TERRITORIAL : '+failures.length+' échec(s)');for(const f of failures)console.error('✗',f);process.exit(1)}
console.log('\n✓ E2E INTERFACES TERRITORIALES PASSÉ');
