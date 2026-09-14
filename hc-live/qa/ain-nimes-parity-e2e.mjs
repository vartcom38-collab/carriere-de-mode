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

async function openCity(city){
 const [lat,lng]=coords[city];
 const page=await browser.newPage();
 page.setDefaultTimeout(8000);
 const pageErrors=[];
 page.on('pageerror',e=>pageErrors.push(String(e.message||e)));
 await page.route('**/tile.openstreetmap.org/**',r=>r.abort());
 await page.addInitScript(p=>localStorage.setItem('haute-couture-current-presence-v1',JSON.stringify(p)),{city,departmentCode:'01',departmentName:'Ain',lat,lng,reason:'visit'});
 await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:20000});
 await page.waitForFunction(()=>window.HCAinTerritorialGameplay?.version===2,{timeout:10000});
 return {page,pageErrors};
}

for(const [city,types] of Object.entries(expected)){
 const {page,pageErrors}=await openCity(city);
 const snap=await page.evaluate(()=>{
   const api=window.HCAinTerritorialGameplay;
   const p=window.HCTerritoryContext?.getPresence?.();
   const key=Object.keys(api.experiences||{}).find(k=>k===p?.city);
   const list=key?api.experiences[key]:[];
   return {version:api.version,city:p?.city,types:list.map(x=>x.type),ids:list.map(x=>x.id),people:api.people.filter(x=>x.city===p?.city).length,temp:api.temporaryObjects().map(x=>x.type)};
 });
 console.log('AIN PARITY',city,JSON.stringify(snap));
 if(snap.version!==2)failures.push(city+': runtime Ain V2 absent');
 if(snap.city!==city)failures.push(city+': présence incorrecte');
 for(const type of types)if(!snap.types.includes(type))failures.push(city+': interface '+type+' absente');
 if(!snap.people)failures.push(city+': aucune rencontre persistante dédiée');
 if(!snap.temp.length||!['rumor','poster','inspiration','encounter'].includes(snap.temp[0]))failures.push(city+': objet narratif temporaire invalide');
 if(pageErrors.some(x=>/SyntaxError|ReferenceError/.test(x)))failures.push(city+': erreur navigateur '+pageErrors.join(' | '));
 await page.close();
}

{
 const {page}=await openCity('Bourg-en-Bresse');
 const result=await page.evaluate(()=>{
   const api=window.HCAinTerritorialGameplay;
   const archive=api.experiences['Bourg-en-Bresse'].find(x=>x.type==='archives');
   const hotel=api.experiences['Bourg-en-Bresse'].find(x=>x.type==='hotel');
   api.useExperience(archive,0);
   api.useExperience(hotel,0);
   const m=api.memory();
   const book=Object.values(m.discoveries||{}).some(x=>x.kind==='book'&&x.source===archive.id);
   const atelier=Object.values(m.discoveries||{}).some(x=>x.kind==='atelier'&&x.source===archive.id);
   return {archiveVisits:m.visits?.[archive.id]?.count||0,hotelVisits:m.visits?.[hotel.id]?.count||0,book,atelier,tempHome:m.temporaryHome||null};
 });
 console.log('AIN CROSS SYSTEMS',JSON.stringify(result));
 if(!result.archiveVisits)failures.push('Bourg: mémoire de visite archives absente');
 if(!result.hotelVisits)failures.push('Bourg: mémoire de visite hôtel absente');
 if(!result.book)failures.push('Bourg: archives ne débloquent pas le Book');
 if(!result.atelier)failures.push('Bourg: archives ne débloquent pas l’Atelier');
 if(result.tempHome?.city!=='Bourg-en-Bresse')failures.push('Bourg: chez-moi temporaire hôtel absent');
 await page.close();
}

await browser.close();
if(failures.length){
 console.error('\nAIN NÎMES PARITY : '+failures.length+' échec(s)');
 failures.forEach(x=>console.error('✗',x));
 process.exit(1);
}
console.log('\nAIN NÎMES PARITY : OK — 5 villes, interfaces spécialisées, mémoire et ponts systèmes.');
