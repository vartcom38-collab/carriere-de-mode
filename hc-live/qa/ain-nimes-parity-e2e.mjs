import { chromium } from 'playwright';

const BASE=process.env.HC_BASE_URL||'http://127.0.0.1:4173/hc-live/ville/';
const failures=[];
const expected={
 'Bourg-en-Bresse':['heritage','archives','studio','hotel'],
 'Oyonnax':['craft','archives','social'],
 'Jujurieux':['craft','archives'],
 'Belley':['social','craft','hotel'],
 'Pérouges':['heritage','vintage']
};
const coords={
 'Bourg-en-Bresse':[46.205,5.226],Oyonnax:[46.2592,5.6573],Jujurieux:[46.0396,5.4084],Belley:[45.758,5.685],Pérouges:[45.9038,5.1796]
};
const browser=await chromium.launch({headless:true});

async function openCity(city,{seedCreation=false}={}){
 const [lat,lng]=coords[city];
 const page=await browser.newPage();
 page.setDefaultTimeout(8000);
 const pageErrors=[];
 page.on('pageerror',e=>pageErrors.push(String(e.message||e)));
 await page.route('**/tile.openstreetmap.org/**',r=>r.abort());
 await page.addInitScript(({presence,seedCreation})=>{
   localStorage.setItem('haute-couture-current-presence-v1',JSON.stringify(presence));
   if(seedCreation)localStorage.setItem('haute-couture-atelier-creations-v1',JSON.stringify([{id:'qa-finished-garment',name:'Silhouette QA Ain',status:'finished',finished:true,finishedAt:'2026-09-14T10:00:00'}]));
 },{presence:{city,departmentCode:'01',departmentName:'Ain',lat,lng,reason:'visit'},seedCreation});
 await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:20000});
 await page.waitForFunction(()=>window.HCAinTerritorialGameplay?.version===2,{timeout:10000});
 await page.waitForFunction(()=>window.HCAinParitySystemBridge?.version===1,{timeout:10000});
 return {page,pageErrors};
}

for(const [city,types] of Object.entries(expected)){
 const {page,pageErrors}=await openCity(city);
 const snap=await page.evaluate(()=>{
   const api=window.HCAinTerritorialGameplay;
   const p=window.HCTerritoryContext?.getPresence?.();
   const key=Object.keys(api.experiences||{}).find(k=>k===p?.city);
   const list=key?api.experiences[key]:[];
   return {version:api.version,bridge:window.HCAinParitySystemBridge?.version||0,city:p?.city,types:list.map(x=>x.type),ids:list.map(x=>x.id),people:api.people.filter(x=>x.city===p?.city).length,temp:api.temporaryObjects().map(x=>x.type)};
 });
 console.log('AIN PARITY',city,JSON.stringify(snap));
 if(snap.version!==2)failures.push(city+': runtime Ain V2 absent');
 if(snap.bridge!==1)failures.push(city+': pont systèmes Ain absent');
 if(snap.city!==city)failures.push(city+': présence incorrecte');
 for(const type of types)if(!snap.types.includes(type))failures.push(city+': interface '+type+' absente');
 if(!snap.people)failures.push(city+': aucune rencontre persistante dédiée');
 if(!snap.temp.length||!['rumor','poster','inspiration','encounter'].includes(snap.temp[0]))failures.push(city+': objet narratif temporaire invalide');
 if(pageErrors.some(x=>/SyntaxError|ReferenceError/.test(x)))failures.push(city+': erreur navigateur '+pageErrors.join(' | '));
 await page.close();
}

{
 const {page,pageErrors}=await openCity('Bourg-en-Bresse',{seedCreation:true});
 const result=await page.evaluate(()=>{
   const api=window.HCAinTerritorialGameplay;
   const bridge=window.HCAinParitySystemBridge;
   const archive=api.experiences['Bourg-en-Bresse'].find(x=>x.type==='archives');
   const hotel=api.experiences['Bourg-en-Bresse'].find(x=>x.type==='hotel');
   const studio=api.experiences['Bourg-en-Bresse'].find(x=>x.type==='studio');
   const before=window.HCGame?.get?.().clock?.totalMinutes||0;
   api.useExperience(archive,0);
   api.useExperience(hotel,0);
   api.useExperience(studio,0);
   const after=window.HCGame?.get?.().clock?.totalMinutes||0;
   const inv=bridge.createInvitation({id:'qa-invitation',title:'Présentation textile QA',city:'Bourg-en-Bresse'});
   const accepted=bridge.respondInvitation(inv.id,'accepted');
   const m=api.memory();
   const g=window.HCGame?.get?.()||{};
   const book=Object.values(m.discoveries||{}).some(x=>x.kind==='book'&&x.source===archive.id);
   const atelier=Object.values(m.discoveries||{}).some(x=>x.kind==='atelier'&&x.source===archive.id);
   const studioReq=JSON.parse(localStorage.getItem('haute-couture-studio-request-v1')||'null');
   const calendar=(g.calendar||[]).find(x=>x.id===accepted.eventId);
   const phone=(g.messages||[]).filter(x=>String(x.id||'').includes('qa-invitation'));
   return {archiveVisits:m.visits?.[archive.id]?.count||0,hotelVisits:m.visits?.[hotel.id]?.count||0,studioVisits:m.visits?.[studio.id]?.count||0,book,atelier,tempHome:m.temporaryHome||null,timeDelta:after-before,studioReq,invitation:m.invitations?.[inv.id]||null,calendar,phoneCount:phone.length};
 });
 console.log('AIN CROSS SYSTEMS',JSON.stringify(result));
 if(!result.archiveVisits)failures.push('Bourg: mémoire de visite archives absente');
 if(!result.hotelVisits)failures.push('Bourg: mémoire de visite hôtel absente');
 if(!result.studioVisits)failures.push('Bourg: mémoire de visite studio absente');
 if(!result.book)failures.push('Bourg: archives ne débloquent pas le Book');
 if(!result.atelier)failures.push('Bourg: archives ne débloquent pas l’Atelier');
 if(result.tempHome?.city!=='Bourg-en-Bresse')failures.push('Bourg: chez-moi temporaire hôtel absent');
 if(result.timeDelta<165)failures.push('Bourg: temps de jeu non consommé par les expériences ('+result.timeDelta+' min)');
 if(result.studioReq?.status!=='ready'||result.studioReq?.creationId!=='qa-finished-garment')failures.push('Bourg: studio non relié à une création terminée réelle');
 if(result.invitation?.status!=='accepted')failures.push('Bourg: RSVP invitation non persisté');
 if(result.calendar?.status!=='planned'||result.calendar?.type!=='invitation')failures.push('Bourg: invitation non reliée à l’Agenda');
 if(result.phoneCount<2)failures.push('Bourg: invitation/RSVP non reliés au Téléphone');
 if(pageErrors.some(x=>/SyntaxError|ReferenceError/.test(x)))failures.push('Bourg systèmes: erreur navigateur '+pageErrors.join(' | '));
 await page.close();
}

await browser.close();
if(failures.length){
 console.error('\nAIN NÎMES PARITY : '+failures.length+' échec(s)');
 failures.forEach(x=>console.error('✗',x));
 process.exit(1);
}
console.log('\nAIN NÎMES PARITY : OK — 5 villes, interfaces spécialisées, mémoire, temps, studio, invitation/RSVP et ponts systèmes.');
