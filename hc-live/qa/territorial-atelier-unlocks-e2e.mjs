import { chromium } from 'playwright';

const ROOT=process.env.HC_ROOT_URL||'http://127.0.0.1:4173/hc-live/';
const browser=await chromium.launch({headless:true});
const failures=[];
const departments=[
 ['01','Ain','Bourg-en-Bresse','heritage'],['03','Allier','Moulins','culture'],['07','Ardèche','Annonay','craft'],['15','Cantal','Aurillac','nature'],
 ['26','Drôme','Valence','fabric'],['38','Isère','Grenoble','heritage'],['42','Loire','Saint-Étienne','craft'],['43','Haute-Loire','Le Puy-en-Velay','culture'],
 ['63','Puy-de-Dôme','Clermont-Ferrand','nature'],['69','Rhône','Lyon','fabric'],['73','Savoie','Chambéry','heritage'],['74','Haute-Savoie','Annecy','craft']
];

for(const [code,name,city,cat] of departments){
 const context=await browser.newContext();
 const page=await context.newPage();
 page.setDefaultTimeout(10000);
 await page.route('**/tile.openstreetmap.org/**',r=>r.abort());
 await page.addInitScript(p=>{
  localStorage.clear();
  localStorage.setItem('haute-couture-current-presence-v1',JSON.stringify({city:p.city,departmentCode:p.code,departmentName:p.name,lat:45.8,lng:4.8,reason:'visit'}));
 },{code,name,city});
 try{
  await page.goto(ROOT+'ville/',{waitUntil:'domcontentloaded',timeout:20000});
  await page.waitForFunction(()=>!!window.HCTerritorialPlaceInterfaceV1&&!!window.HCTerritorialSignalRuntime,{timeout:10000});
  const action=await page.evaluate(({code,name,city,cat})=>{
   const place={id:'qa-unlock-'+code,dept:code,departmentName:name,city,name:'QA découverte '+name,cat,lat:45.8,lng:4.8,where:city+' · '+name,text:'Référence territoriale de recette Atelier.',palette:['ivoire local','gris pierre'],materials:['laine locale','lin'],motifs:['trame locale'],unlock:'Référence créative Atelier.'};
   window.HCTerritorialPlaceInterfaceV1.open(place);
   const b=document.querySelector('[data-tpa]');if(!b)return null;const id=b.getAttribute('data-tpa');b.click();return id;
  },{code,name,city,cat});
  if(!action)throw new Error('aucune action de lieu disponible');
  await page.waitForFunction(code=>{const raw=JSON.parse(localStorage.getItem('haute-couture-atelier-unlocks-v1')||'[]');return Array.isArray(raw)&&raw.some(x=>x?.source==='territorial'&&x?.departmentCode===code)},code);
  const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('haute-couture-atelier-unlocks-v1')||'[]'));
  const semantic=before.find(x=>x?.source==='territorial'&&x?.departmentCode===code);
  if(!semantic?.materials?.length||!semantic?.motifs?.length||!semantic?.palette?.length)failures.push(code+' '+name+': référence territoriale incomplète avant Atelier');

  await page.goto(ROOT+'atelier/',{waitUntil:'domcontentloaded',timeout:20000});
  await page.waitForFunction(code=>{const r=JSON.parse(localStorage.getItem('haute-couture-atelier-territorial-resolutions-v1')||'{}');return Object.entries(r).some(([id,v])=>id.startsWith('territory:'+code+':')&&Array.isArray(v?.catalogIds)&&v.catalogIds.length)},code,{timeout:15000});
  const resolved=await page.evaluate(code=>{const r=JSON.parse(localStorage.getItem('haute-couture-atelier-territorial-resolutions-v1')||'{}');const hit=Object.entries(r).find(([id,v])=>id.startsWith('territory:'+code+':')&&v?.catalogIds?.length);const unlocks=JSON.parse(localStorage.getItem('haute-couture-atelier-unlocks-v1')||'[]');return{entry:hit?.[1]||null,count:unlocks.length,ids:unlocks.map(x=>typeof x==='string'?x:x?.id).filter(Boolean)}} ,code);
  const catalogId=resolved.entry?.catalogIds?.[0];
  if(!catalogId||!resolved.ids.includes(catalogId))failures.push(code+' '+name+': aucun vrai ID catalogue persisté');

  const inner=page.frames().find(f=>/\/atelier-raster\/index\.html\?/.test(f.url()));
  if(!inner){failures.push(code+' '+name+': frame Atelier réel introuvable')}else{
   await inner.waitForSelector('#hcAtelierShellV3',{timeout:15000});
   const visible=await inner.locator('[data-id="'+catalogId.replace(/"/g,'\\"')+'"]').count();
   if(!visible)failures.push(code+' '+name+': ID '+catalogId+' débloqué mais absent de la bibliothèque Atelier');
  }

  const resolutionBefore=JSON.stringify(resolved.entry);
  const countBefore=resolved.count;
  await page.reload({waitUntil:'domcontentloaded',timeout:20000});
  await page.waitForTimeout(1200);
  const after=await page.evaluate(code=>{const r=JSON.parse(localStorage.getItem('haute-couture-atelier-territorial-resolutions-v1')||'{}');const hit=Object.entries(r).find(([id,v])=>id.startsWith('territory:'+code+':')&&v?.catalogIds?.length);const unlocks=JSON.parse(localStorage.getItem('haute-couture-atelier-unlocks-v1')||'[]');return{entry:hit?.[1]||null,count:unlocks.length,unique:new Set(unlocks.map(x=>typeof x==='string'?x:x?.id).filter(Boolean)).size}},code);
  if(JSON.stringify(after.entry)!==resolutionBefore)failures.push(code+' '+name+': résolution changée après reload');
  if(after.count!==countBefore||after.unique!==after.count)failures.push(code+' '+name+': doublon créé après reload');
  console.log('✓ '+code+' '+name+' · action '+action+' → '+catalogId+' · persistance sans doublon');
 }catch(e){failures.push(code+' '+name+': '+String(e?.message||e))}
 await context.close();
}
await browser.close();
if(failures.length){console.error('\nDÉBLOCAGES TERRITORIAUX → ATELIER : '+failures.length+' échec(s)');for(const f of failures)console.error('✗',f);process.exit(1)}
console.log('\n✓ DÉBLOCAGES TERRITORIAUX → ATELIER : 12/12 départements, sélection réelle et persistance validées.');