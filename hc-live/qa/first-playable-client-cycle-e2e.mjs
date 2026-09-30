import { chromium } from 'playwright';

const BASE=process.env.HC_BASE_URL||'http://127.0.0.1:4173/hc-live/ville/';
const failures=[];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});
page.on('pageerror',e=>failures.push('pageerror: '+String(e.message||e)));
page.on('console',m=>{if(m.type()==='error'&&/Uncaught|ReferenceError|TypeError|SyntaxError/i.test(m.text()))failures.push('console: '+m.text())});

await page.addInitScript(()=>{
 const now='2026-09-29T10:00:00.000Z';
 localStorage.clear();
 localStorage.setItem('haute-couture-start-path-v1',JSON.stringify({type:'career',chosenAt:now}));
 localStorage.setItem('haute-couture-player-stats',JSON.stringify({reputation:6}));
 localStorage.setItem('haute-couture-home',JSON.stringify({city:'Nîmes',startingBudget:500,home:{id:'qa-home',city:'Nîmes',title:'Petit appartement',price:0,charges:0,address:'Nîmes'}}));
 localStorage.setItem('haute-couture-current-presence-v1',JSON.stringify({city:'Nîmes',departmentCode:'30',departmentName:'Gard',lat:43.8367,lng:4.3601,reason:'visit'}));
 localStorage.setItem('haute-couture-client-orders-v1',JSON.stringify([{
   id:'qa-generic-order',clientId:'qa-client',clientName:'Camille Test',clientRole:'Cliente fictive',fictional:true,
   city:'Nîmes',source:'Café des Croquis',status:'ready_for_fitting',progress:'realised_sent',specialtyTrack:'tailoring',specialtyLabel:'Tailoring',
   garment:'Robe structurée',occasion:'Rendez-vous professionnel',reward:260,budget:340,
   deadline:'2026-10-03T17:00:00.000Z',
   design:{realisationId:'qa-client-creation'},
   brief:{style:'net et contemporain',materialsPreferred:['crêpe']}
 }]));
 localStorage.setItem('haute-couture-atelier-creations-v1',JSON.stringify([{
   id:'qa-client-creation',type:'client-order',status:'sent_to_client',orderId:'qa-generic-order',
   clientName:'Camille Test',name:'Robe structurée — Camille Test',garment:'Robe structurée',
   occasion:'Rendez-vous professionnel',fabric:{name:'crêpe',meter:18},
   board:{counts:{garments:1,materials:1}},createdAt:now
 }]));
});

await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000});
await page.waitForFunction(()=>!!window.HCGame&&!!window.HCClientFittingLivedV1&&!!window.HCClientFittingGenericBridgeV1,{timeout:10000});
await page.waitForSelector('#hcGenericClientFitting',{state:'visible',timeout:10000});

const before=await page.evaluate(()=>({
 money:Number(window.HCGame.get().player.money||0),
 rep:Number(window.HCGame.get().player.reputation||0),
 tailoring:Number(window.HCGame.get().reputationTracks?.tailoring||0),
 clientele:Number(window.HCGame.get().reputationTracks?.clientele||0),
 time:Number(window.HCGame.get().clock.totalMinutes||0),
 target:window.HCClientFittingGenericBridgeV1.target()?.id||null,
 garment:window.HCClientFittingLivedV1.garmentFor(window.HCClientFittingGenericBridgeV1.target())?.id||null,
 text:document.querySelector('#hcGenericClientFitting')?.textContent||''
}));
console.log('FIRST PLAYABLE FIT BEFORE',JSON.stringify(before));
if(before.rep!==6)failures.push('réputation initiale de progression inattendue');
if(before.target!=='qa-generic-order')failures.push('commande générique non ciblée par la scène essayage');
if(before.garment!=='qa-client-creation')failures.push('la création réelle de la commande n’est pas retrouvée');
if(!/Camille Test/.test(before.text)||!/COMMENCER L’ESSAYAGE/.test(before.text))failures.push('interface essayage générique absente/incomplète');
if(/\b\d+\s*\/\s*100\b|satisfaction\s*[:=]|fitScore/i.test(before.text))failures.push('ancien score numérique visible dans l’essayage');

await page.evaluate(()=>document.querySelector('[data-gfit="start"]')?.click());
await page.waitForFunction(()=>JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0]?.status==='fitting_ok',{timeout:5000});
await page.waitForTimeout(80);
const afterFit=await page.evaluate(()=>({
 status:JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0]?.status,
 time:Number(window.HCGame.get().clock.totalMinutes||0),
 session:JSON.parse(localStorage.getItem('haute-couture-client-fitting-lived-v1')||'{}')?.items?.['qa-generic-order']||null,
 target:window.HCClientFittingGenericBridgeV1?.target?.()?.id||null,
 hasDeliver:!!document.querySelector('[data-gfit="deliver"]'),
 text:document.querySelector('#hcGenericClientFitting')?.textContent||''
}));
console.log('FIRST PLAYABLE FIT APPROVED',JSON.stringify({status:afterFit.status,time:afterFit.time,phase:afterFit.session?.phase,target:afterFit.target,hasDeliver:afterFit.hasDeliver,text:afterFit.text}));
if(afterFit.status!=='fitting_ok'||afterFit.session?.phase!=='approved')failures.push('essayage ne valide pas qualitativement la pièce');
if(!afterFit.hasDeliver||!/PRÉPARER LA LIVRAISON/.test(afterFit.text))failures.push('bouton livraison absent après essayage approuvé');
if(!(afterFit.time>before.time))failures.push('essayage sans passage du temps');

const deliveryCall=await page.evaluate(()=>window.HCClientFittingLivedV1.deliver('qa-generic-order'));
console.log('FIRST PLAYABLE DELIVERY CALL',JSON.stringify(deliveryCall));
await page.waitForFunction(()=>JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0]?.status==='completed',{timeout:5000});

const delivered=await page.evaluate(()=>({
 order:JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0],
 game:window.HCGame.get(),
 relation:JSON.parse(localStorage.getItem('haute-couture-client-relations-v1')||'{}')?.['qa-client']||null,
 tracks:window.HCGame.get().reputationTracks||{},
 careerLevel:window.HCClientOrderEngine?.careerLevel?.()||null,
 level2Templates:(window.HCClientOrderEngine?.availableTemplates?.()||[]).filter(x=>Number(x.min||0)>=2).map(x=>x.id),
 session:JSON.parse(localStorage.getItem('haute-couture-client-fitting-lived-v1')||'{}')?.items?.['qa-generic-order']||null
}));
console.log('FIRST PLAYABLE DELIVERED',JSON.stringify({status:delivered.order?.status,payment:delivered.order?.payment,money:delivered.game?.player?.money,rep:delivered.game?.player?.reputation,trust:delivered.relation?.trust,phase:delivered.session?.phase,tailoring:delivered.tracks?.tailoring,clientele:delivered.tracks?.clientele,careerLevel:delivered.careerLevel,level2Templates:delivered.level2Templates}));
if(delivered.order?.status!=='completed'||delivered.order?.progress!=='delivered')failures.push('commande non terminée après livraison');
if(!delivered.order?.paymentApplied||Number(delivered.order?.payment||0)!==260)failures.push('paiement cliente non appliqué');
if(Number(delivered.game?.player?.money||0)!==before.money+260)failures.push('solde carrière non crédité');
if(Number(delivered.game?.player?.reputation||0)!==before.rep+2)failures.push('réputation professionnelle non créditée');
if(Number(delivered.tracks?.tailoring||0)!==before.tailoring+1)failures.push('spécialité tailoring non créditée');
if(Number(delivered.tracks?.clientele||0)!==before.clientele+1)failures.push('progression clientèle non créditée');
if(Number(delivered.careerLevel||0)!==2)failures.push('niveau carrière 2 non débloqué à réputation 8');
if(!Array.isArray(delivered.level2Templates)||!delivered.level2Templates.length)failures.push('aucune offre de niveau 2 débloquée après progression');
if(Number(delivered.relation?.trust||0)!==2)failures.push('relation cliente non mémorisée');
if(delivered.session?.phase!=='delivered')failures.push('session essayage non clôturée');
if(!(Number(delivered.game?.clock?.totalMinutes||0)>afterFit.time))failures.push('livraison sans passage du temps');

await browser.close();
if(failures.length){console.error('\nFIRST PLAYABLE CLIENT CYCLE: '+failures.length+' échec(s)');for(const f of failures)console.error('✗',f);process.exit(1)}
console.log('\n✓ FIRST PLAYABLE CLIENT CYCLE PASSÉ · création réelle → essayage vécu → temps → livraison → paiement → réputation → relation.');
