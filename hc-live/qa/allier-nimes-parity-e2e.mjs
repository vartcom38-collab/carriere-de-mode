import { chromium } from 'playwright';

const BASE=process.env.HC_BASE_URL||'http://127.0.0.1:4173/hc-live/ville/';
const failures=[];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
page.setDefaultTimeout(10000);
const pageErrors=[];
page.on('pageerror',e=>pageErrors.push(String(e.message||e)));
await page.route('**/tile.openstreetmap.org/**',r=>r.abort());
await page.addInitScript(()=>{
  localStorage.setItem('haute-couture-current-presence-v1',JSON.stringify({city:'Moulins',departmentCode:'03',departmentName:'Allier',lat:46.5669,lng:3.3322,reason:'visit'}));
  localStorage.removeItem('haute-couture-allier-territorial-gameplay-v1');
  localStorage.removeItem('haute-couture-allier-studio-request-v1');
  localStorage.removeItem('haute-couture-atelier-creations-v1');
});
await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:20000});
await page.waitForFunction(()=>window.HCAllierTerritorialGameplay?.version===3,{timeout:10000});
await page.waitForFunction(()=>window.HCAllierParitySystemBridge?.version===1,{timeout:10000});

const shape=await page.evaluate(()=>{
  const api=window.HCAllierTerritorialGameplay;
  const list=api.experiences?.Moulins||[];
  return {
    version:api.version,
    bridge:window.HCAllierParitySystemBridge?.version||0,
    active:api.active?.(),
    types:list.map(x=>x.type),
    ids:list.map(x=>x.id),
    people:api.people.filter(x=>x.city==='Moulins').map(x=>({name:x.name,fictional:x.fictional,role:x.role})),
    chanelAsCurrentPerson:api.people.some(x=>/chanel/i.test([x.name,x.role].join(' '))),
    temp:api.temporaryObjects('Moulins').map(x=>x.type)
  };
});
console.log('ALLIER MOULINS SHAPE',JSON.stringify(shape));
if(shape.version!==3)failures.push('Moulins: runtime Allier V3 absent');
if(shape.bridge!==1)failures.push('Moulins: pont systèmes Allier absent');
if(!shape.active)failures.push('Moulins: runtime non actif malgré présence 03');
for(const type of ['heritage','archives','studio','social','hotel'])if(!shape.types.includes(type))failures.push('Moulins: interface '+type+' absente');
if(shape.people.length<3||shape.people.some(x=>x.fictional!==true||!/FICTION GAMEPLAY/i.test(x.role)))failures.push('Moulins: personnages contemporains non clairement fictifs');
if(shape.chanelAsCurrentPerson)failures.push('Moulins: Chanel ne doit jamais devenir un PNJ contemporain');
for(const type of ['rumor','poster'])if(!shape.temp.includes(type))failures.push('Moulins: objet temporaire '+type+' absent');

const systems=await page.evaluate(()=>{
  const api=window.HCAllierTerritorialGameplay,bridge=window.HCAllierParitySystemBridge;
  const before=window.HCGame.get().clock.totalMinutes||0;
  api.useExperience('moulins-archives-gameplay','atelier');
  api.useExperience('moulins-hotel-gameplay');
  const blocked=bridge.prepareStudio({city:'Moulins',destinations:['Book','Ateliergram']});
  localStorage.setItem('haute-couture-atelier-creations-v1',JSON.stringify([{id:'qa-allier-finished',name:'Silhouette QA Allier',status:'finished',finished:true,finishedAt:'2026-09-15T10:00:00'}]));
  api.useExperience('moulins-studio-gameplay');
  const ready=JSON.parse(localStorage.getItem('haute-couture-allier-studio-request-v1')||'null');
  const person=api.people.find(x=>x.id==='allier-p-moulins-costume');
  api.meet(person.id,'hello');
  api.meet(person.id,'work');
  const inv=bridge.createInvitation({id:'qa-moulins-invitation',title:'Présentation costume QA',organizer:'Équipe costume QA',inviter:'Noémie QA',city:'Moulins',place:'Moulins · centre',dressCode:'Créatif sobre',access:'Invitation nominative'});
  const accepted=bridge.respondInvitation(inv.id,'accepted');
  const after=window.HCGame.get().clock.totalMinutes||0;
  const m=api.state(),g=window.HCGame.get();
  return {
    archiveVisits:m.visits?.['moulins-archives-gameplay']?.count||0,
    hotelVisits:m.visits?.['moulins-hotel-gameplay']?.count||0,
    studioVisits:m.visits?.['moulins-studio-gameplay']?.count||0,
    book:!!m.discoveries?.['book:moulins-archives-gameplay'],
    atelier:!!m.discoveries?.['atelier:moulins-archives-gameplay'],
    tempHome:m.temporaryHome||null,
    timeDelta:after-before,
    blocked,
    ready,
    relation:m.people?.[person.id]||null,
    invitation:m.invitations?.[inv.id]||null,
    calendar:(g.calendar||[]).find(x=>x.id===accepted.eventId)||null,
    phone:(g.messages||[]).filter(x=>String(x.id||'').includes('qa-moulins-invitation')).length
  };
});
console.log('ALLIER MOULINS SYSTEMS',JSON.stringify(systems));
if(!systems.archiveVisits)failures.push('Moulins: mémoire de visite archives absente');
if(!systems.hotelVisits)failures.push('Moulins: mémoire de visite hôtel absente');
if(!systems.studioVisits)failures.push('Moulins: mémoire de visite studio absente');
if(!systems.book||!systems.atelier)failures.push('Moulins: archives non reliées au Book et à l’Atelier');
if(systems.tempHome?.city!=='Moulins'||!systems.tempHome?.access?.includes('telephone')||!systems.tempHome?.access?.includes('agenda'))failures.push('Moulins: Chez Moi temporaire incomplet');
if(systems.timeDelta<165)failures.push('Moulins: temps canonique insuffisamment consommé ('+systems.timeDelta+' min)');
if(systems.blocked?.status!=='blocked'||systems.blocked?.reason!=='no-finished-creation')failures.push('Moulins: studio devrait bloquer sans création terminée');
if(systems.ready?.status!=='ready'||systems.ready?.creationId!=='qa-allier-finished')failures.push('Moulins: studio non relié à la vraie création Atelier terminée');
if((systems.relation?.interactions||0)<2||systems.relation?.professionalOpen!==true)failures.push('Moulins: mémoire relationnelle/revisite absente');
if(systems.invitation?.status!=='accepted'||systems.invitation?.dressCode!=='Créatif sobre'||systems.invitation?.access!=='Invitation nominative')failures.push('Moulins: invitation/RSVP incomplet');
if(systems.calendar?.status!=='planned'||systems.calendar?.type!=='invitation')failures.push('Moulins: RSVP accepté non relié à l’Agenda');
if(systems.phone<2)failures.push('Moulins: invitation/RSVP non reliés au Téléphone');
if(pageErrors.some(x=>/SyntaxError|ReferenceError/.test(x)))failures.push('Moulins: erreur navigateur '+pageErrors.join(' | '));

await page.close();
await browser.close();
if(failures.length){
  console.error('\nALLIER NÎMES PARITY : '+failures.length+' échec(s)');
  failures.forEach(x=>console.error('✗',x));
  process.exit(1);
}
console.log('\nALLIER NÎMES PARITY : OK — Moulins, interfaces spécialisées, mémoire, temps, relation, hôtel, studio réel, invitation/RSVP, Phone et Agenda.');
