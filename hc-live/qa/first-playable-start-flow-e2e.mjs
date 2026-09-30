import { chromium } from 'playwright';

const ROOT=process.env.HC_ROOT_URL||'http://127.0.0.1:4173/hc-live/';
const failures=[];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1360,height:900}});
page.on('pageerror',e=>failures.push('pageerror: '+String(e.message||e)));
page.on('console',m=>{if(m.type()==='error'&&/Uncaught|ReferenceError|TypeError|SyntaxError/i.test(m.text()))failures.push('console: '+m.text())});

await page.goto(ROOT,{waitUntil:'domcontentloaded',timeout:15000});
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'domcontentloaded'});
await page.click('#newBtn');
await page.waitForURL(/\/hc-live\/start-choice\/?$/,{timeout:8000});
if(!await page.locator('#career').isVisible())failures.push('choix carrière non visible après nouvelle partie');

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
const affordable=page.locator('.listing').filter({has:page.locator('.mini-tag.ok')}).first();

const initialBudget=await page.evaluate(()=>Number(localStorage.getItem('haute-couture-starting-budget')||0));
if(initialBudget!==3500)failures.push('budget de départ inattendu: '+initialBudget);

await page.evaluate(()=>document.querySelector('.listing .mini-tag.ok')?.closest('.listing')?.click());
await page.waitForSelector('#detailModal.open',{state:'visible',timeout:5000});
await page.waitForFunction(()=>typeof window.HCHousingChoose==='function'&&!!document.querySelector('#detailVisit'),{timeout:5000});
const detail=await page.evaluate(()=>({
 totalText:document.querySelector('#dTotal')?.textContent||'',
 city:JSON.parse(localStorage.getItem('haute-couture-logement-builder')||'{}').city||''
}));
if(detail.city!=='Nîmes')failures.push('ville logement non conservée');

await page.evaluate(()=>window.HCHousingChoose?.(window.__HC_ACTIVE_LISTING?.id));
await page.waitForTimeout(250);
const housingClick=await page.evaluate(()=>({
 href:location.href,
 home:JSON.parse(localStorage.getItem('haute-couture-home')||'null'),
 current:localStorage.getItem('haute-couture-current-screen')
}));
console.log('FIRST PLAYABLE HOUSING CLICK',JSON.stringify({href:housingClick.href,city:housingClick.home?.city,entryCost:housingClick.home?.estimatedEntryCost,remaining:housingClick.home?.startingBudget,current:housingClick.current}));
await page.waitForURL(/\/hc-live\/career-first-day\/?$/,{timeout:8000});

const state=await page.evaluate(()=>({
 home:JSON.parse(localStorage.getItem('haute-couture-home')||'null'),
 opening:JSON.parse(localStorage.getItem('haute-couture-career-opening-v1')||'null'),
 current:localStorage.getItem('haute-couture-current-screen'),
 startBudget:Number(localStorage.getItem('haute-couture-starting-budget')||0),
 title:document.querySelector('#title')?.textContent||'',
 lead:document.querySelector('#lead')?.textContent||'',
 cards:document.querySelectorAll('[data-id]').length
}));
console.log('FIRST PLAYABLE START',JSON.stringify({city:state.home?.city,entryCost:state.home?.estimatedEntryCost,remaining:state.home?.startingBudget,status:state.opening?.status,current:state.current,cards:state.cards}));
if(state.home?.city!=='Nîmes'||!state.home?.home?.id)failures.push('logement choisi non persisté');
if(!(Number(state.home?.estimatedEntryCost||0)>0))failures.push('coût d’entrée logement absent');
if(!(Number(state.home?.startingBudget||0)<3500)&&Number(state.home?.estimatedEntryCost||0)>0)failures.push('coût du logement non retiré du budget');
if(state.startBudget!==Number(state.home?.startingBudget||-1))failures.push('budget restant non propagé vers le moteur de jeu');
if(state.opening?.status!=='housing-chosen')failures.push('ouverture carrière non passée à housing-chosen');
if(state.current!=='career-first-day')failures.push('écran courant non positionné sur le premier jour');
if(!/Nîmes/.test(state.lead)||state.cards!==4)failures.push('premier jour carrière incomplet');

await page.click('[data-id="city"]');
await page.waitForURL(/\/hc-live\/ville\/?$/,{timeout:8000});
const arrival=await page.evaluate(()=>({
 screen:localStorage.getItem('haute-couture-current-screen'),
 day:JSON.parse(localStorage.getItem('haute-couture-career-first-day-v1')||'null')
}));
if(arrival.screen!=='ville'||arrival.day?.firstChoice!=='city'||arrival.day?.status!=='started')failures.push('première action de carrière non mémorisée');

await browser.close();
if(failures.length){console.error('\nFIRST PLAYABLE START FLOW: '+failures.length+' échec(s)');for(const f of failures)console.error('✗',f);process.exit(1)}
console.log('\n✓ FIRST PLAYABLE START FLOW PASSÉ · nouvelle partie → carrière → logement → budget → premier jour → ville.');
