import { chromium } from 'playwright';

const BASE=process.env.HC_BASE_URL||'http://127.0.0.1:4173';
const AURA=['01','03','07','15','26','38','42','43','63','69','73','74'];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1500,height:1000}});

try{
  await page.goto(`${BASE}/hc-live/ville/index.html`,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>{
    localStorage.setItem('haute-couture-current-presence-v1',JSON.stringify({city:'Nîmes',departmentCode:'30',departmentName:'Gard',lat:43.8367,lng:4.3601,reason:'qa-baseline'}));
  });

  await page.goto(`${BASE}/hc-live/ville/france.html`,{waitUntil:'domcontentloaded'});
  const iframe=page.locator('#mapFrame');
  await iframe.waitFor({state:'attached'});
  const handle=await iframe.elementHandle();
  const frame=await handle?.contentFrame();
  if(!frame)throw new Error('iframe carte locale introuvable');
  await frame.waitForLoadState('domcontentloaded');

  await frame.waitForFunction(codes=>{
    const state=window.__HCFranceMapState;
    return !!state && codes.every(code=>(state.byDept.get(code)||[]).length>0);
  },AURA,{timeout:30000});

  const snapshot=await frame.evaluate(codes=>{
    const state=window.__HCFranceMapState;
    const counts=Object.fromEntries(codes.map(code=>[code,(state.byDept.get(code)||[]).length]));
    return {counts,total:state.getTotal(),zoom:window.HCLocalMap.map.getZoom(),title:document.querySelector('#cityTitle')?.textContent||'',summary:document.querySelector('#territorySummary')?.textContent||'',presence:window.HCTerritoryContext?.getPresence?.()||null};
  },AURA);

  for(const code of AURA)if(!(snapshot.counts[code]>0))throw new Error(`departement ${code} absent de la carte France`);
  if(snapshot.zoom>6)throw new Error(`la carte France demarre trop zoomee: ${snapshot.zoom}`);
  if(!/FRANCE/i.test(snapshot.title))throw new Error(`titre global inattendu: ${snapshot.title}`);
  if(snapshot.presence?.departmentCode!=='30')throw new Error('la consultation globale a modifie la presence initiale');

  await frame.locator('[data-dept="38"]').click();
  await frame.waitForTimeout(250);
  const afterBrowse=await frame.evaluate(()=>window.HCTerritoryContext?.getPresence?.()||null);
  if(afterBrowse?.departmentCode!=='30')throw new Error('le focus departemental a modifie la presence');

  await frame.evaluate(()=>window.HCLocalMapOpenGuide(window.__HCFranceMapState.byDept.get('38')[0]));
  await frame.locator('#overlay.open').waitFor({state:'visible'});
  const afterGuide=await frame.evaluate(()=>window.HCTerritoryContext?.getPresence?.()||null);
  if(afterGuide?.departmentCode!=='30')throw new Error('ouvrir une fiche lieu a modifie la presence');

  await frame.locator('#visitHere').click();
  await frame.waitForFunction(()=>window.HCTerritoryContext?.getPresence?.()?.departmentCode==='38',{timeout:10000});
  const afterTravel=await frame.evaluate(()=>window.HCTerritoryContext.getPresence());
  if(afterTravel?.departmentCode!=='38')throw new Error('SE RENDRE ICI ne change pas la presence');

  console.log(JSON.stringify({ok:true,aura:'12/12',...snapshot,travelDepartment:afterTravel.departmentCode},null,2));
} finally {
  await browser.close();
}
