import { chromium } from 'playwright';

const URL=process.env.HC_ATELIER_URL||'http://127.0.0.1:4173/hc-live/atelier-raster/index-v2.html';
const failures=[];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.on('pageerror',e=>failures.push('pageerror: '+String(e.message||e)));
page.on('console',m=>{if(m.type()==='error'&&/Uncaught|ReferenceError|TypeError|SyntaxError/i.test(m.text()))failures.push('console: '+m.text())});

await page.addInitScript(()=>{
 const now='2026-09-29T10:00:00.000Z';
 localStorage.clear();
 localStorage.setItem('haute-couture-start-path-v1',JSON.stringify({type:'career',chosenAt:now}));
 localStorage.setItem('haute-couture-home',JSON.stringify({city:'Nîmes',startingBudget:900,home:{id:'qa-home',city:'Nîmes',title:'Appartement test',price:0,charges:0}}));
 localStorage.setItem('haute-couture-client-orders-v1',JSON.stringify([{
   id:'qa-middle-order',clientId:'qa-middle-client',clientName:'Camille Test',clientRole:'Cliente fictive',
   fictional:true,city:'Nîmes',source:'Café des Croquis',status:'accepted',progress:'brief_accepted',
   garment:'Robe structurée',occasion:'Rendez-vous professionnel',budget:900,reward:260,estimatedMinutes:260,
   brief:{style:'net, contemporain, crédible',paletteLiked:['marine'],materialsPreferred:['crêpe']}
 }]));
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
 return !!window.HCGame&&!!w?.HCAtelierClientWorkflow&&!!w?.HCAtelierRealisationEngine&&!!w?.HCAtelierRealisationPreflight&&!!d?.querySelector('#hcClientWorkflowV2');
},{timeout:20000});
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

await page.evaluate(()=>document.getElementById('atelierFrame')?.contentDocument?.querySelector('#hcCw2Send')?.click());
await page.waitForFunction(()=>JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0]?.status==='approved_for_production',{timeout:5000});

const approved=await page.evaluate(()=>JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0]);
console.log('FIRST PLAYABLE MIDDLE APPROVED',JSON.stringify({status:approved.status,price:approved.proposal?.price,response:approved.clientResponse?.type}));
if(approved.clientResponse?.type!=='approved'||!approved.proposal?.sketch?.id)failures.push('devis/croquis non validé par la cliente');

await page.waitForFunction(()=>!!document.getElementById('atelierFrame')?.contentDocument?.querySelector('#hcCw2Realise'),{timeout:5000});
await page.evaluate(()=>document.getElementById('atelierFrame')?.contentDocument?.querySelector('#hcCw2Realise')?.click());
await page.waitForFunction(()=>!!document.getElementById('atelierFrame')?.contentDocument?.querySelector('#hcConfirmRealise'),{timeout:5000});

const preflight=await page.evaluate(()=>({
 disabled:document.getElementById('atelierFrame')?.contentDocument?.querySelector('#hcConfirmRealise')?.disabled,
 text:document.getElementById('atelierFrame')?.contentDocument?.querySelector('#hcAtelierRealisationPreflight')?.textContent||''
}));
if(preflight.disabled)failures.push('réalisation bloquée malgré planche/croquis/matière complets');

await page.evaluate(()=>document.getElementById('atelierFrame')?.contentDocument?.querySelector('#hcConfirmRealise')?.click());
await page.waitForFunction(()=>JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0]?.status==='realised_pending_send',{timeout:7000});

const realised=await page.evaluate(()=>({
 order:JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]')[0],
 creations:JSON.parse(localStorage.getItem('haute-couture-atelier-creations-v1')||'[]'),
 game:window.HCGame.get()
}));
console.log('FIRST PLAYABLE MIDDLE REALISED',JSON.stringify({status:realised.order?.status,creationId:realised.order?.design?.realisationId,creations:realised.creations.length,time:realised.game?.clock?.totalMinutes}));
if(!realised.order?.design?.realisationId||realised.creations.length!==1)failures.push('création cliente réelle non persistée');
if(!(Number(realised.game?.clock?.totalMinutes||0)>before.time))failures.push('réalisation sans passage du temps');

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
