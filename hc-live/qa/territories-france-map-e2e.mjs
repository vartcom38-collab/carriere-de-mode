import { chromium } from 'playwright';

const BASE=process.env.HC_BASE_URL||'http://127.0.0.1:4173';
const AURA=['01','03','07','15','26','38','42','43','63','69','73','74'];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1500,height:1000}});
page.setDefaultTimeout(15000);
page.on('console',msg=>console.log('BROWSER:',msg.type(),msg.text()));
page.on('pageerror',err=>console.log('BROWSER_PAGEERROR:',err.message));

async function waitGlobalReady(){
  const deadline=Date.now()+20000;
  let snapshot=null;
  while(Date.now()<deadline){
    try{
      snapshot=await page.evaluate(codes=>{
        const state=window.__HCFranceMapState;
        const counts=Object.fromEntries(codes.map(code=>[code,(state?.byDept?.get(code)||[]).length]));
        return {
          counts,
          total:state?.getTotal?.()||0,
          zoom:window.HCLocalMap?.map?.getZoom?.()??null,
          title:document.querySelector('#cityTitle')?.textContent||'',
          summary:document.querySelector('#territorySummary')?.textContent||'',
          presence:window.HCTerritoryContext?.getPresence?.()||null,
          buttons:document.querySelectorAll('[data-dept]').length
        };
      },AURA);
      if(AURA.every(code=>(snapshot.counts[code]||0)>0)&&snapshot.buttons===12)return snapshot;
    }catch(_){ }
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  return snapshot;
}

function assertGlobal(snapshot){
  if(!snapshot)throw new Error('aucun snapshot de la carte France');
  const missing=AURA.filter(code=>!(snapshot.counts[code]>0));
  if(missing.length)throw new Error(`departements absents de la carte France: ${missing.join(',')} | counts=${JSON.stringify(snapshot.counts)}`);
  if(snapshot.buttons!==12)throw new Error(`interface territoriale incomplete: ${snapshot.buttons}/12 boutons departementaux`);
  if(snapshot.zoom>6)throw new Error(`la carte France demarre trop zoomee: ${snapshot.zoom}`);
  if(!/FRANCE/i.test(snapshot.title))throw new Error(`titre global inattendu: ${snapshot.title}`);
  if(snapshot.presence?.departmentCode!=='30')throw new Error('la consultation globale a modifie la presence initiale');
}

try{
  console.log('QA_FRANCE: seed presence');
  await page.goto(`${BASE}/hc-live/ville/index.html`,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.setItem('haute-couture-current-presence-v1',JSON.stringify({city:'Nîmes',departmentCode:'30',departmentName:'Gard',lat:43.8367,lng:4.3601,reason:'qa-baseline'})));

  console.log('QA_FRANCE: open global map');
  await page.goto(`${BASE}/hc-live/ville/france.html`,{waitUntil:'domcontentloaded'});
  console.log('QA_FRANCE: wait global ready');
  const snapshot=await waitGlobalReady();
  console.log('QA_FRANCE: snapshot',JSON.stringify(snapshot));
  assertGlobal(snapshot);

  console.log('QA_FRANCE: browse Isere');
  const browse=await page.evaluate(()=>{
    const btn=document.querySelector('[data-dept="38"]');
    if(!btn)return null;
    btn.click();
    return {
      presence:window.HCTerritoryContext?.getPresence?.()||null,
      title:document.querySelector('#mapTitle')?.textContent||'',
      isereCount:window.__HCFranceMapState?.byDept?.get('38')?.length||0
    };
  });
  if(!browse)throw new Error('bouton Isere absent de l interface');
  if(browse.presence?.departmentCode!=='30')throw new Error('le focus departemental a modifie la presence');
  if(browse.isereCount!==14)throw new Error(`rendu Isere inattendu: ${browse.isereCount} lieux`);

  console.log('QA_FRANCE: reload clean global view for guide');
  await page.goto(`${BASE}/hc-live/ville/france.html`,{waitUntil:'domcontentloaded'});
  const guideSnapshot=await waitGlobalReady();
  assertGlobal(guideSnapshot);

  console.log('QA_FRANCE: open place guide');
  const guideOpen=await page.evaluate(()=>{
    const place=window.__HCFranceMapState?.byDept?.get('38')?.[0];
    if(!place||typeof window.HCLocalMapOpenGuide!=='function')return false;
    window.HCLocalMapOpenGuide(place);
    return document.querySelector('#overlay')?.classList.contains('open')===true;
  });
  if(!guideOpen)throw new Error('la fiche lieu Isere ne s ouvre pas');
  const afterGuide=await page.evaluate(()=>window.HCTerritoryContext?.getPresence?.()||null);
  if(afterGuide?.departmentCode!=='30')throw new Error('ouvrir une fiche lieu a modifie la presence');

  console.log('QA_FRANCE: explicit travel');
  const visitOk=await page.evaluate(()=>{
    const btn=document.querySelector('#visitHere');
    if(!btn||btn.disabled)return false;
    btn.click();
    return true;
  });
  if(!visitOk)throw new Error('bouton SE RENDRE ICI indisponible');

  const travelDeadline=Date.now()+5000;
  let afterTravel=null;
  while(Date.now()<travelDeadline){
    try{
      afterTravel=await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('haute-couture-current-presence-v1')||'null')}catch(_){return null}});
    }catch(_){ }
    if(afterTravel?.departmentCode==='38')break;
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  if(afterTravel?.departmentCode!=='38')throw new Error(`SE RENDRE ICI ne change pas la presence: ${JSON.stringify(afterTravel)}`);

  console.log(JSON.stringify({ok:true,aura:'12/12',...snapshot,travelDepartment:afterTravel.departmentCode},null,2));
} finally {
  await Promise.race([browser.close(),new Promise(resolve=>setTimeout(resolve,3000))]);
}
