import { chromium } from 'playwright';

const ROOT=process.env.HC_ROOT_URL||'http://127.0.0.1:4173/hc-live/';
const failures=[];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.on('pageerror',e=>failures.push('pageerror: '+String(e.stack||e.message||e)));
page.on('console',m=>{if(m.type()==='error'&&/Uncaught|ReferenceError|TypeError|SyntaxError/i.test(m.text()))failures.push('console: '+m.text())});

const readOrder=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0]||null);
const deepReady=()=>page.waitForFunction(()=>{
  const mid=document.getElementById('atelier')?.contentDocument;
  const deep=mid?.getElementById('atelierFrame')?.contentWindow;
  return !!deep?.HCAtelierProjectWorkspace&&!!deep?.HCAtelierClientWorkflow&&!!deep?.HCAtelierRealisationPreflight&&!!deep?.HCAtelierRealisationEngine;
},{timeout:20000});
const deepEval=fn=>page.evaluate(fn);

// 1) Nouvelle partie -> carrière -> logement -> premier jour -> ville.
await page.goto(ROOT,{waitUntil:'domcontentloaded',timeout:15000});
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'domcontentloaded'});
await page.click('#newBtn');
await page.waitForURL(/\/hc-live\/start-choice\/?$/,{timeout:8000});
await page.click('#career');
await page.waitForURL(/\/hc-live\/career-welcome\/?$/,{timeout:8000});
await page.click('[data-intent="income"]');
await page.waitForSelector('#continue.show',{state:'visible',timeout:3000});
await page.evaluate(()=>{
 localStorage.setItem('haute-couture-logement-builder',JSON.stringify({
   level:'listing',region:'Occitanie',dep:'Gard',depCode:'30',city:'Nîmes',cityCode:'',
   cityLat:43.8367,cityLng:4.3601,searchLat:43.8367,searchLng:4.3601,listing:null
 }));
});
await page.click('#continue');
await page.waitForURL(/\/hc-live\/logement\/?$/,{timeout:8000});
await page.waitForFunction(()=>document.querySelectorAll('.listing').length>0,{timeout:15000});
await page.evaluate(()=>document.querySelector('.listing .mini-tag.ok')?.closest('.listing')?.click());
await page.waitForSelector('#detailModal.open',{state:'visible',timeout:5000});
await page.waitForFunction(()=>typeof window.HCHousingChoose==='function'&&!!window.__HC_ACTIVE_LISTING,{timeout:5000});
await page.evaluate(()=>window.HCHousingChoose?.(window.__HC_ACTIVE_LISTING?.id));
await page.waitForURL(/\/hc-live\/career-first-day\/?$/,{timeout:8000});
await page.evaluate(()=>document.querySelector('[data-id="city"]')?.click());
await page.waitForURL(/\/hc-live\/ville\/?$/,{timeout:8000});
await page.waitForFunction(()=>!!window.HCGame&&!!window.HCNimesPlaceUI?.routes?.['nimes-cafe-creative'],{timeout:15000});

const startState=await page.evaluate(()=>({money:Number(window.HCGame.get().player.money||0),rep:Number(window.HCGame.get().player.reputation||0),time:Number(window.HCGame.get().clock.totalMinutes||0)}));

// 2) Café des Croquis -> vraie offre générique -> accepter -> Atelier.
await page.evaluate(()=>window.HCNimesPlaceUI.open({id:'nimes-cafe-creative',name:'Café des Croquis',city:'Nîmes',category:'cafe'}));
await page.waitForFunction(()=>!!window.HCClientOrderEngine&&!!document.querySelector('#hcGenericOrderBoard [data-hc-order-accept]'),{timeout:12000});
const offer=await page.evaluate(()=>{
 const b=document.querySelector('#hcGenericOrderBoard [data-hc-order-accept]');
 const id=b?.dataset.hcOrderAccept||'';
 const o=(JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')).find(x=>x.id===id);
 return{id,budget:o?.budget||0,reward:o?.reward||0,client:o?.clientName||'',garment:o?.garment||''};
});
console.log('CONTINUOUS OFFER',JSON.stringify(offer));
if(!offer.id||!offer.client)failures.push('aucune commande générique réelle proposée au Café');
await page.evaluate(()=>document.querySelector('#hcGenericOrderBoard [data-hc-order-accept]')?.click());
await page.waitForFunction(()=>JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]').some(x=>x.status==='accepted'),{timeout:5000});
const accepted=await readOrder();
if(accepted.id!==offer.id||accepted.status!=='accepted')failures.push('commande du Café non acceptée');
await page.waitForFunction(()=>!!document.querySelector('#hcGenericOrderBoard [data-hc-open-atelier]'),{timeout:5000});
await page.evaluate(()=>document.querySelector('#hcGenericOrderBoard [data-hc-open-atelier]')?.click());
await page.waitForURL(/\/hc-live\/atelier(?:\/|\/index\.html)?$|\/hc-live\/atelier-raster\/lived-atelier-v1\.html/,{timeout:10000});
await page.waitForSelector('#atelier',{state:'attached',timeout:10000});
await deepReady();

// 3) Choisir la commande comme projet actif.
await deepEval(()=>{
 const mid=document.getElementById('atelier')?.contentDocument;
 const deep=mid?.getElementById('atelierFrame')?.contentWindow;
 deep.HCAtelierProjectWorkspace.openChooser();
});
await page.waitForFunction(()=>{
 const mid=document.getElementById('atelier')?.contentDocument;
 const d=mid?.getElementById('atelierFrame')?.contentDocument;
 return !!d?.querySelector('#hcProjectChooser .hc-pw-choice[data-id]');
},{timeout:6000});
await deepEval(()=>{
 const mid=document.getElementById('atelier')?.contentDocument;
 const d=mid?.getElementById('atelierFrame')?.contentDocument;
 d.querySelector('#hcProjectChooser .hc-pw-choice[data-id]')?.click();
});
await page.waitForFunction(()=>{
 const o=JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]').find(x=>x.status==='accepted');
 const p=JSON.parse(localStorage.getItem('haute-couture-atelier-active-project-v1')||'null');
 return !!o&&p?.id===o.id&&p?.type==='client';
},{timeout:5000});

// Choix créatifs déterministes : pas d'appel au backend image en CI.
await deepEval(()=>{
 const o=JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]').find(x=>x.status==='accepted');
 const material=o?.brief?.materialsPreferred?.[0]||'crêpe';
 localStorage.setItem('haute-couture-atelier-board-v2',JSON.stringify({pieces:[{id:'continuous-piece',name:o?.garment||'Pièce cliente'}],counts:{garments:1,materials:1}}));
 localStorage.setItem('haute-couture-atelier-selected-sketch-v2',JSON.stringify({id:'continuous-sketch',name:'Croquis de '+(o?.garment||'commande'),direction:o?.brief?.style||'ligne claire',url:''}));
 localStorage.setItem('haute-couture-atelier-selected-fabric-v1',JSON.stringify({id:'continuous-fabric',name:material,meter:18,pricePerMeter:18,supplier:'Mercerie locale'}));
 localStorage.setItem('haute-couture-fabric-library-v1',JSON.stringify([{id:'continuous-fabric',name:material,meter:18,pricePerMeter:18,stockMeters:8,supplier:'Mercerie locale'}]));
 const mid=document.getElementById('atelier')?.contentDocument;
 const w=mid?.getElementById('atelierFrame')?.contentWindow;
 w?.HCAtelierClientWorkflow?.render?.();
 w?.HCAtelierQuoteEngine?.mount?.();
});
await page.waitForFunction(()=>{
 const mid=document.getElementById('atelier')?.contentDocument;
 const d=mid?.getElementById('atelierFrame')?.contentDocument;
 return !!d?.querySelector('#hcCw2Send');
},{timeout:8000});

// 4) Devis négocié dans le budget -> validation cliente -> réalisation -> envoi essayage.
const quote=await deepEval(()=>{
 const orders=JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]');
 const o=orders.find(x=>x.status==='accepted');
 const mid=document.getElementById('atelier')?.contentDocument;
 const d=mid?.getElementById('atelierFrame')?.contentDocument;
 const input=d?.querySelector('#hcCw2Price');
 const suggested=Number(input?.value||0),chosen=Math.max(1,Math.min(suggested,Math.floor(Number(o?.budget||0)*.95)));
 if(input){input.value=String(chosen);input.dispatchEvent(new Event('input',{bubbles:true}))}
 d?.querySelector('#hcCw2Send')?.click();
 return{suggested,chosen,budget:o?.budget||0};
});
console.log('CONTINUOUS QUOTE',JSON.stringify(quote));
await page.waitForFunction(()=>JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0]?.status==='approved_for_production',{timeout:6000});
await page.waitForFunction(()=>{
 const mid=document.getElementById('atelier')?.contentDocument;
 const d=mid?.getElementById('atelierFrame')?.contentDocument;
 return !!d?.querySelector('#hcCw2Realise');
},{timeout:5000});
await deepEval(()=>{
 const mid=document.getElementById('atelier')?.contentDocument;
 mid?.getElementById('atelierFrame')?.contentDocument?.querySelector('#hcCw2Realise')?.click();
});
await page.waitForFunction(()=>{
 const mid=document.getElementById('atelier')?.contentDocument;
 const d=mid?.getElementById('atelierFrame')?.contentDocument;
 return !!d?.querySelector('#hcConfirmRealise');
},{timeout:6000});
const preflight=await deepEval(()=>{
 const mid=document.getElementById('atelier')?.contentDocument;
 const d=mid?.getElementById('atelierFrame')?.contentDocument;
 return{disabled:!!d?.querySelector('#hcConfirmRealise')?.disabled,text:d?.querySelector('#hcRealisationPreflight')?.textContent||''};
});
if(preflight.disabled)failures.push('préflight de la commande continue bloqué');
await deepEval(()=>{
 const mid=document.getElementById('atelier')?.contentDocument;
 mid?.getElementById('atelierFrame')?.contentDocument?.querySelector('#hcConfirmRealise')?.click();
});
await page.waitForFunction(()=>JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0]?.status==='realised_pending_send',{timeout:10000});
await page.waitForFunction(()=>{
 const mid=document.getElementById('atelier')?.contentDocument;
 return !!mid?.getElementById('atelierFrame')?.contentDocument?.querySelector('#hcSendClient');
},{timeout:6000});
await deepEval(()=>{
 const mid=document.getElementById('atelier')?.contentDocument;
 mid?.getElementById('atelierFrame')?.contentDocument?.querySelector('#hcSendClient')?.click();
});
await page.waitForFunction(()=>JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0]?.status==='ready_for_fitting',{timeout:6000});
const sent=await readOrder();
if(!sent.design?.realisationId)failures.push('création continue non liée à la commande');

// 5) Même commande -> Ville -> essayage vécu -> éventuelle direction assumée -> livraison.
await page.goto(ROOT+'ville/?orderId='+encodeURIComponent(sent.id),{waitUntil:'domcontentloaded',timeout:15000});
await page.waitForFunction(()=>!!window.HCGame&&!!window.HCClientFittingLivedV1&&!!window.HCClientFittingGenericBridgeV1,{timeout:12000});
await page.waitForSelector('#hcGenericClientFitting',{state:'attached',timeout:10000});
const beforeFit=await page.evaluate(()=>({money:Number(window.HCGame.get().player.money||0),time:Number(window.HCGame.get().clock.totalMinutes||0)}));
await page.evaluate(()=>document.querySelector('[data-gfit="start"]')?.click());
await page.waitForFunction(()=>['fitting_ok','alterations_needed'].includes(JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0]?.status),{timeout:6000});
let fitted=await readOrder();
if(fitted.status==='alterations_needed'){
 await page.waitForFunction(()=>!!document.querySelector('[data-gfit="assume"]'),{timeout:5000});
 await page.evaluate(()=>document.querySelector('[data-gfit="assume"]')?.click());
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0]?.status==='fitting_ok',{timeout:5000});
 fitted=await readOrder();
}
await page.waitForFunction(()=>!!document.querySelector('[data-gfit="deliver"]'),{timeout:5000});
await page.evaluate(()=>document.querySelector('[data-gfit="deliver"]')?.click());
await page.waitForFunction(()=>JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0]?.status==='completed',{timeout:6000});

const done=await page.evaluate(()=>({
 order:JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0],
 project:JSON.parse(localStorage.getItem('haute-couture-atelier-active-project-v1')||'null'),
 game:window.HCGame.get(),
 relation:JSON.parse(localStorage.getItem('haute-couture-client-relations-v1')||'{}')
}));
const rel=done.relation?.[done.order?.clientId];
console.log('CONTINUOUS DONE',JSON.stringify({id:done.order?.id,status:done.order?.status,payment:done.order?.payment,money:done.game?.player?.money,rep:done.game?.player?.reputation,trust:rel?.trust,time:done.game?.clock?.totalMinutes,realisationId:done.order?.design?.realisationId}));
if(done.order?.id!==offer.id)failures.push('la commande livrée n’est pas celle acceptée au Café');
if(done.order?.status!=='completed'||!done.order?.paymentApplied)failures.push('commande continue non livrée/payée');
if(!done.order?.design?.realisationId)failures.push('réalisation perdue avant livraison');
if(!(Number(done.game?.clock?.totalMinutes||0)>startState.time))failures.push('aucun temps de jeu écoulé sur le parcours continu');
if(!(Number(rel?.trust||0)>0))failures.push('relation cliente non conservée sur le parcours continu');

// 6) Recharger la partie puis vérifier qu'une nouvelle journée peut réellement relancer la carrière.
const snapshot={id:done.order?.id,money:Number(done.game?.player?.money||0),rep:Number(done.game?.player?.reputation||0),trust:Number(rel?.trust||0),time:Number(done.game?.clock?.totalMinutes||0)};
await page.reload({waitUntil:'domcontentloaded',timeout:15000});
await page.waitForFunction(()=>!!window.HCGame&&!!window.HCNimesPlaceUI?.routes?.['nimes-cafe-creative'],{timeout:12000});
const resumed=await page.evaluate(()=>({
 game:window.HCGame.get(),
 order:JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]').find(x=>x.status==='completed')||null,
 relations:JSON.parse(localStorage.getItem('haute-couture-client-relations-v1')||'{}')
}));
const resumedRel=resumed.relations?.[done.order?.clientId];
console.log('CONTINUOUS RESUME',JSON.stringify({id:resumed.order?.id,money:resumed.game?.player?.money,rep:resumed.game?.player?.reputation,trust:resumedRel?.trust,time:resumed.game?.clock?.totalMinutes}));
if(resumed.order?.id!==snapshot.id)failures.push('commande terminée perdue après rechargement');
if(Number(resumed.game?.player?.money||0)!==snapshot.money)failures.push('argent non conservé après rechargement');
if(Number(resumed.game?.player?.reputation||0)!==snapshot.rep)failures.push('réputation non conservée après rechargement');
if(Number(resumedRel?.trust||0)!==snapshot.trust)failures.push('relation cliente non conservée après rechargement');

await page.evaluate(()=>window.HCGame.advanceTime?.(1440,'Jour suivant — reprise de carrière'));
await page.evaluate(()=>window.HCNimesPlaceUI.open({id:'nimes-cafe-creative',name:'Café des Croquis',city:'Nîmes',category:'cafe'}));
await page.waitForFunction(()=>!!window.HCClientOrderEngine&&!!document.querySelector('#hcGenericOrderBoard'),{timeout:12000});
await page.waitForFunction(()=>document.querySelectorAll('#hcGenericOrderBoard [data-hc-order-accept]').length>0,{timeout:8000});
const nextDay=await page.evaluate(()=>{
 const offered=[...document.querySelectorAll('#hcGenericOrderBoard [data-hc-order-accept]')].map(x=>x.dataset.hcOrderAccept).filter(Boolean);
 const orders=JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]');
 return{day:window.HCGame.get().clock?.day,offered,completed:orders.filter(x=>x.status==='completed').map(x=>x.id),money:Number(window.HCGame.get().player.money||0)};
});
console.log('CONTINUOUS NEXT DAY',JSON.stringify(nextDay));
if(!nextDay.offered.length)failures.push('aucune nouvelle commande proposée le jour suivant');
if(nextDay.offered.includes(snapshot.id))failures.push('ancienne commande livrée reproposée comme nouvelle opportunité');
if(!nextDay.completed.includes(snapshot.id))failures.push('historique de la première cliente perdu en générant la suivante');
if(nextDay.money!==snapshot.money)failures.push('argent modifié sans raison au simple passage au jour suivant');

await browser.close();
if(failures.length){console.error('\nFIRST PLAYABLE CONTINUOUS: '+failures.length+' échec(s)');for(const f of failures)console.error('✗',f);process.exit(1)}
console.log('\n✓ FIRST PLAYABLE CONTINUOUS PASSÉ · nouvelle partie → Café → commande → Atelier → devis → réalisation → essayage → livraison · même sauvegarde.');
