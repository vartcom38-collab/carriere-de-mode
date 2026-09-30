import { chromium } from 'playwright';

const URL=process.env.HC_ATELIER_URL||'http://127.0.0.1:4173/hc-live/atelier-raster/index-v2.html';
const failures=[];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.on('pageerror',e=>{const detail=String(e.stack||e.message||e);console.error('FIRST PLAYABLE PAGEERROR',detail);failures.push('pageerror: '+detail)});
page.on('console',m=>{if(m.type()==='error'&&/Uncaught|ReferenceError|TypeError|SyntaxError/i.test(m.text()))failures.push('console: '+m.text())});

await page.addInitScript(()=>{
 const now='2026-09-29T10:00:00.000Z';
 localStorage.clear();
 localStorage.setItem('haute-couture-start-path-v1',JSON.stringify({type:'career',chosenAt:now}));
 localStorage.setItem('haute-couture-home',JSON.stringify({city:'Nîmes',startingBudget:5000,home:{id:'qa-home',city:'Nîmes',title:'Appartement test',price:0,charges:0}}));
 localStorage.setItem('haute-couture-atelier-production-choice-v1',JSON.stringify('camille'));
 localStorage.setItem('haute-couture-client-orders-v1',JSON.stringify([{
   id:'qa-middle-order',clientId:'qa-middle-client',clientName:'Camille Test',clientRole:'Cliente fictive',
   fictional:true,city:'Nîmes',source:'Café des Croquis',status:'accepted',progress:'brief_accepted',
   garment:'Robe structurée',occasion:'Rendez-vous professionnel',budget:900,reward:260,estimatedMinutes:260,
   brief:{style:'net, contemporain, crédible',paletteLiked:['marine'],materialsPreferred:['crêpe']}
 }]));
 localStorage.setItem('haute-couture-atelier-active-project-v1',JSON.stringify({
   id:'qa-middle-order',name:'Robe structurée',type:'client',
   subtitle:'Camille Test · Rendez-vous professionnel',source:'order',selectedAt:now
 }));
 localStorage.setItem('haute-couture-atelier-board-v2',JSON.stringify({
   pieces:[{id:'top-drape',name:'Top drapé'},{id:'jupe',name:'Jupe drapée'}],
   counts:{garments:2,materials:1}
 }));
 localStorage.setItem('haute-couture-atelier-selected-sketch-v2',JSON.stringify({
   id:'qa-sketch',name:'Croquis cliente QA',direction:'Ligne structurée et mobile',url:''
 }));
 localStorage.setItem('haute-couture-atelier-selected-fabric-v1',JSON.stringify({
   id:'qa-crepe',name:'Crêpe test',meter:18,pricePerMeter:18,supplier:'Mercerie test'
 }));
 localStorage.setItem('haute-couture-fabric-library-v1',JSON.stringify([
   {id:'qa-crepe',name:'Crêpe test',meter:18,pricePerMeter:18,stockMeters:5,supplier:'Mercerie test'}
 ]));
});

await page.goto(URL,{waitUntil:'domcontentloaded',timeout:15000});
await page.waitForFunction(()=>{
 const f=document.getElementById('atelierFrame'),w=f?.contentWindow,d=f?.contentDocument;
 return document.body.classList.contains('hc-ready')&&!!window.HCGame&&!!w?.HCAtelierClientWorkflow&&!!w?.HCAtelierRealisationEngine&&!!w?.HCAtelierRealisationPreflight&&!!d?.getElementById('hcAtelierShellV3');
},{timeout:20000});
await page.evaluate(()=>{
 const w=document.getElementById('atelierFrame')?.contentWindow;
 w?.HCAtelierClientWorkflow?.render?.();
});
const bootDiag=await page.evaluate(()=>{
 const sketch={id:'qa-sketch',name:'Croquis cliente QA',direction:'Ligne structurée et mobile',url:''};
 localStorage.setItem('haute-couture-atelier-selected-sketch-v2',JSON.stringify(sketch));
 const f=document.getElementById('atelierFrame'),w=f?.contentWindow,d=f?.contentDocument;
 if(w)w.__HC_SELECTED_SKETCH__=sketch;
 let renderError=null;
 try{w?.HCAtelierClientWorkflow?.render?.()}catch(e){renderError=String(e?.stack||e?.message||e)}
 return{
   order:JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0]||null,
   sketch:JSON.parse(localStorage.getItem('haute-couture-atelier-selected-sketch-v2')||'null'),
   text:d?.querySelector('#hcClientWorkflowV2')?.textContent||'',
   hasSend:!!d?.querySelector('#hcCw2Send'),
   renderError
 };
});
console.log('FIRST PLAYABLE MIDDLE BOOT',JSON.stringify(bootDiag));
if(!bootDiag.hasSend){
 failures.push('workflow devis absent après sélection du croquis'+(bootDiag.renderError?' · '+bootDiag.renderError:'')+' · panneau: '+bootDiag.text);
 await browser.close();
 console.error('\nFIRST PLAYABLE MIDDLE FLOW: '+failures.length+' échec(s)');for(const f of failures)console.error('✗',f);process.exit(1);
}

const before=await page.evaluate(()=>({
 order:JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0],
 money:Number(window.HCGame.get().player.money||0),
 time:Number(window.HCGame.get().clock.totalMinutes||0),
 text:document.getElementById('atelierFrame')?.contentDocument?.querySelector('#hcClientWorkflowV2')?.textContent||''
}));
console.log('FIRST PLAYABLE MIDDLE BEFORE',JSON.stringify({status:before.order?.status,money:before.money,time:before.time,text:before.text}));
if(before.order?.status!=='accepted')failures.push('commande de départ non acceptée');
if(!/PROPOSITION CLIENTE|Présenter/i.test(before.text))failures.push('workflow devis cliente absent');

const quote=await page.evaluate(()=>{
 const d=document.getElementById('atelierFrame')?.contentDocument;
 const input=d?.querySelector('#hcCw2Price');
 const budget=JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0]?.budget||0;
 const suggested=Number(input?.value||0);
 const chosen=Math.max(1,Math.min(suggested,Math.floor(Number(budget||0)*0.95)));
 if(input){input.value=String(chosen);input.dispatchEvent(new Event('input',{bubbles:true}))}
 const w=document.getElementById('atelierFrame')?.contentWindow;
 const est=w?.HCAtelierQuoteEngine?.estimate?.()||null;
 return{budget,suggested,chosen,hasBreakdown:!!d?.querySelector('#hcQuoteBreakdown'),workHours:Number(est?.workHours||0),recommended:Number(est?.price||0),materialCost:Number(est?.materialCost||0),features:est?.features||[]};
});
console.log('FIRST PLAYABLE MIDDLE QUOTE',JSON.stringify(quote));
if(quote.workHours>45)failures.push('devis atelier encore anormalement long pour cette robe test: '+quote.workHours+' h');
if(!(quote.chosen>0&&quote.chosen<=quote.budget))failures.push('devis ajusté hors budget');
if(!quote.hasBreakdown)failures.push('détail du devis réaliste absent');

await page.evaluate(()=>document.getElementById('atelierFrame')?.contentDocument?.querySelector('#hcCw2Send')?.click());
await page.waitForFunction(()=>JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0]?.status==='approved_for_production',{timeout:5000});

const approved=await page.evaluate(()=>JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0]);
console.log('FIRST PLAYABLE MIDDLE APPROVED',JSON.stringify({status:approved.status,price:approved.proposal?.price,response:approved.clientResponse?.type}));
if(approved.clientResponse?.type!=='approved'||!approved.proposal?.sketch?.id)failures.push('devis/croquis non validé par la cliente');

await page.waitForFunction(()=>!!document.getElementById('atelierFrame')?.contentDocument?.querySelector('#hcCw2Realise'),{timeout:5000});
await page.evaluate(()=>document.getElementById('atelierFrame')?.contentDocument?.querySelector('#hcCw2Realise')?.click());
await page.waitForFunction(()=>!!document.getElementById('atelierFrame')?.contentDocument?.querySelector('#hcConfirmRealise'),{timeout:5000});

const preflight=await page.evaluate(()=>{
 const f=document.getElementById('atelierFrame'),w=f?.contentWindow,d=f?.contentDocument,chk=w?.HCAtelierRealisationEngine?.canRealise?.()||{};
 return{
   disabled:d?.querySelector('#hcConfirmRealise')?.disabled,
   text:d?.querySelector('#hcAtelierRealisationPreflight')?.textContent||'',
   laborCost:Number(chk?.labor?.cost||0),
   worker:chk?.labor?.worker?.name||'',
   cashNeed:Number(chk?.cashNeed||0),
   materialCost:Number(chk?.material?.purchaseCost||0),
   money:Number(window.HCGame.get().player.money||0)
 };
});
console.log('FIRST PLAYABLE MIDDLE PREFLIGHT',JSON.stringify(preflight));
if(preflight.disabled)failures.push('réalisation bloquée malgré trésorerie suffisante');
if(!(preflight.laborCost>0)||!/Camille Roux/.test(preflight.worker))failures.push('coût partenaire Camille absent du préflight');
if(!/COÛT PARTENAIRE|TOTAL À FINANCER/.test(preflight.text))failures.push('préflight ne montre pas le coût complet');
if(preflight.cashNeed!==preflight.laborCost+preflight.materialCost)failures.push('total cash préflight incohérent');

await page.evaluate(()=>document.getElementById('atelierFrame')?.contentDocument?.querySelector('#hcConfirmRealise')?.click());
await page.waitForFunction(()=>JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0]?.status==='realised_pending_send',{timeout:7000});

const realised=await page.evaluate(()=>({
 order:JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0],
 creations:JSON.parse(localStorage.getItem('haute-couture-atelier-creations-v1')||'[]'),
 game:window.HCGame.get()
}));
console.log('FIRST PLAYABLE MIDDLE REALISED',JSON.stringify({status:realised.order?.status,creationId:realised.order?.design?.realisationId,creations:realised.creations.length,time:realised.game?.clock?.totalMinutes,money:realised.game?.player?.money,laborCost:realised.order?.production?.laborCost,laborPaid:realised.order?.production?.laborPaid,worker:realised.order?.production?.worker?.name}));
if(!realised.order?.design?.realisationId||realised.creations.length!==1)failures.push('création cliente réelle non persistée');
if(!(Number(realised.game?.clock?.totalMinutes||0)>before.time))failures.push('réalisation sans passage du temps');
if(!realised.order?.production?.laborPaid)failures.push('confection partenaire non marquée payée');
if(Number(realised.order?.production?.laborCost||0)!==preflight.laborCost)failures.push('coût partenaire enregistré incorrect');
if(Number(realised.game?.player?.money||0)!==before.money-preflight.cashNeed)failures.push('trésorerie non débitée du coût réel de réalisation');
if(Number(realised.creations?.[0]?.labor?.cost||0)!==preflight.laborCost)failures.push('coût partenaire absent de la création persistée');

await page.waitForFunction(()=>!!document.getElementById('atelierFrame')?.contentDocument?.querySelector('#hcSendClient'),{timeout:5000});
await page.evaluate(()=>document.getElementById('atelierFrame')?.contentDocument?.querySelector('#hcSendClient')?.click());
await page.waitForFunction(()=>JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0]?.status==='ready_for_fitting',{timeout:5000});

const sent=await page.evaluate(()=>({
 order:JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0],
 creation:JSON.parse(localStorage.getItem('haute-couture-atelier-creations-v1')||'[]')[0]
}));
console.log('FIRST PLAYABLE MIDDLE SENT',JSON.stringify({status:sent.order?.status,progress:sent.order?.progress,creationStatus:sent.creation?.status}));
if(sent.order?.status!=='ready_for_fitting'||sent.order?.progress!=='realised_sent')failures.push('commande non transmise à l’essayage');
if(sent.creation?.status!=='sent_to_client')failures.push('création non marquée envoyée à la cliente');

await browser.close();
if(failures.length){console.error('\nFIRST PLAYABLE MIDDLE FLOW: '+failures.length+' échec(s)');for(const f of failures)console.error('✗',f);process.exit(1)}
console.log('\n✓ FIRST PLAYABLE MIDDLE FLOW PASSÉ · commande → devis → validation → réalisation → envoi essayage.');
