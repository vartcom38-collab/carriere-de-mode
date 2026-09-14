import { chromium } from 'playwright';

const BASE=process.env.HC_BASE_URL||'http://127.0.0.1:4173';
const AURA=['01','03','07','15','26','38','42','43','63','69','73','74'];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1500,height:1000}});
page.setDefaultTimeout(15000);
page.on('console',msg=>console.log('BROWSER:',msg.type(),msg.text()));
page.on('pageerror',err=>console.log('BROWSER_PAGEERROR:',err.message));

try{
  console.log('QA_FRANCE: seed presence');
  await page.goto(`${BASE}/hc-live/ville/index.html`,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.setItem('haute-couture-current-presence-v1',JSON.stringify({city:'Nîmes',departmentCode:'30',departmentName:'Gard',lat:43.8367,lng:4.3601,reason:'qa-baseline'})));

  console.log('QA_FRANCE: open global map');
  await page.goto(`${BASE}/hc-live/ville/france.html`,{waitUntil:'domcontentloaded'});
  const iframe=page.locator('#mapFrame');
  await iframe.waitFor({state:'attached'});
  const handle=await iframe.elementHandle();
  const frame=await handle?.contentFrame();
  if(!frame)throw new Error('iframe carte locale introuvable');
  await frame.waitForLoadState('domcontentloaded');

  console.log('QA_FRANCE: collect departments');
  await frame.waitForTimeout(12000);
  const snapshot=await frame.evaluate(codes=>{
    const state=window.__HCFranceMapState;
    const counts=Object.fromEntries(codes.map(code=>[code,(state?.byDept?.get(code)||[]).length]));
    return {counts,total:state?.getTotal?.()||0,zoom:window.HCLocalMap?.map?.getZoom?.()??null,title:document.querySelector('#cityTitle')?.textContent||'',summary:document.querySelector('#territorySummary')?.textContent||'',presence:window.HCTerritoryContext?.getPresence?.()||null};
  },AURA);
  console.log('QA_FRANCE: snapshot',JSON.stringify(snapshot));

  const missing=AURA.filter(code=>!(snapshot.counts[code]>0));
  if(missing.length)throw new Error(`departements absents de la carte France: ${missing.join(',')} | counts=${JSON.stringify(snapshot.counts)}`);
  if(snapshot.zoom>6)throw new Error(`la carte France demarre trop zoomee: ${snapshot.zoom}`);
  if(!/FRANCE/i.test(snapshot.title))throw new Error(`titre global inattendu: ${snapshot.title}`);
  if(snapshot.presence?.departmentCode!=='30')throw new Error('la consultation globale a modifie la presence initiale');

  console.log('QA_FRANCE: browse Isere');
  await frame.locator('[data-dept="38"]').click();
  await frame.waitForTimeout(500);
  const afterBrowse=await frame.evaluate(()=>window.HCTerritoryContext?.getPresence?.()||null);
  if(afterBrowse?.departmentCode!=='30')throw new Error('le focus departemental a modifie la presence');

  console.log('QA_FRANCE: open place guide');
  await frame.evaluate(()=>window.HCLocalMapOpenGuide(window.__HCFranceMapState.byDept.get('38')[0]));
  await frame.locator('#overlay.open').waitFor({state:'visible'});
  const afterGuide=await frame.evaluate(()=>window.HCTerritoryContext?.getPresence?.()||null);
  if(afterGuide?.departmentCode!=='30')throw new Error('ouvrir une fiche lieu a modifie la presence');

  console.log('QA_FRANCE: explicit travel');
  await frame.locator('#visitHere').click({noWaitAfter:true});
  await frame.waitForFunction(()=>window.HCTerritoryContext?.getPresence?.()?.departmentCode==='38',null,{timeout:15000});
  const afterTravel=await frame.evaluate(()=>window.HCTerritoryContext.getPresence());
  if(afterTravel?.departmentCode!=='38')throw new Error('SE RENDRE ICI ne change pas la presence');

  console.log(JSON.stringify({ok:true,aura:'12/12',...snapshot,travelDepartment:afterTravel.departmentCode},null,2));
} finally {
  await Promise.race([browser.close(),new Promise(resolve=>setTimeout(resolve,3000))]);
}
