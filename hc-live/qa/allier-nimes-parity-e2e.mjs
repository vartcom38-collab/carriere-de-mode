import { chromium } from 'playwright';

const BASE=process.env.HC_BASE_URL||'http://127.0.0.1:4173/hc-live/ville/';
const failures=[];
const browser=await chromium.launch({headless:true});

async function openCity(city,lat,lng){
  const page=await browser.newPage();
  page.setDefaultTimeout(10000);
  const pageErrors=[];
  page.on('pageerror',e=>pageErrors.push(String(e.message||e)));
  await page.route('**/tile.openstreetmap.org/**',r=>r.abort());
  await page.addInitScript(({city,lat,lng})=>{
    localStorage.setItem('haute-couture-current-presence-v1',JSON.stringify({city,departmentCode:'03',departmentName:'Allier',lat,lng,reason:'visit'}));
    localStorage.removeItem('haute-couture-allier-territorial-gameplay-v1');
    localStorage.removeItem('haute-couture-allier-studio-request-v1');
    localStorage.removeItem('haute-couture-atelier-creations-v1');
  },{city,lat,lng});
  await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:20000});
  await page.waitForFunction(()=>window.HCAllierTerritorialGameplay?.version===4,{timeout:10000});
  await page.waitForFunction(()=>window.HCAllierParitySystemBridge?.version===1,{timeout:10000});
  await page.waitForFunction(()=>window.HCAllierMapInterface?.version===2,{timeout:10000});
  await page.waitForFunction(()=>window.HCLocalMap&&typeof window.HCLocalMap.addMarker==='function',{timeout:10000});
  return {page,pageErrors};
}

{
  const {page,pageErrors}=await openCity('Moulins',46.5669,3.3322);
  const shape=await page.evaluate(()=>{
    const api=window.HCAllierTerritorialGameplay;
    const list=api.experiences?.Moulins||[];
    return {
      version:api.version,
      bridge:window.HCAllierParitySystemBridge?.version||0,
      mapInterface:window.HCAllierMapInterface?.version||0,
      active:api.active?.(),
      types:list.map(x=>x.type),
      ids:list.map(x=>x.id),
      people:api.people.filter(x=>x.city==='Moulins').map(x=>({name:x.name,fictional:x.fictional,role:x.role})),
      chanelAsCurrentPerson:api.people.some(x=>/chanel/i.test([x.name,x.role].join(' '))),
      temp:api.temporaryObjects('Moulins').map(x=>x.type)
    };
  });
  console.log('ALLIER MOULINS SHAPE',JSON.stringify(shape));
  if(shape.version!==4)failures.push('Moulins: runtime Allier V4 absent');
  if(shape.bridge!==1)failures.push('Moulins: pont systèmes Allier absent');
  if(shape.mapInterface!==2)failures.push('Moulins: couche interface carte V2 absente');
  if(!shape.active)failures.push('Moulins: runtime non actif malgré présence 03');
  for(const type of ['heritage','archives','studio','social','hotel'])if(!shape.types.includes(type))failures.push('Moulins: interface '+type+' absente');
  if(shape.people.length<3||shape.people.some(x=>x.fictional!==true||!/FICTION GAMEPLAY/i.test(x.role)))failures.push('Moulins: personnages contemporains non clairement fictifs');
  if(shape.chanelAsCurrentPerson)failures.push('Moulins: Chanel ne doit jamais devenir un PNJ contemporain');
  for(const type of ['rumor','poster'])if(!shape.temp.includes(type))failures.push('Moulins: objet temporaire '+type+' absent');

  const visible=await page.evaluate(async()=>{
    const captured=[],map=window.HCLocalMap,original=map.addMarker;
    map.addMarker=item=>{captured.push(item);return item};
    window.HCAllierMapInterface.render();
    map.addMarker=original;
    const experience=captured.find(x=>x.gameplayType==='allier-experience'&&x.experienceId==='moulins-archives-gameplay');
    if(experience){window.HCLocalMapOpenGuide(experience);await new Promise(r=>setTimeout(r,30));}
    return {
      count:captured.length,
      person:captured.some(x=>x.gameplayType==='allier-person'),
      experiences:captured.filter(x=>x.gameplayType==='allier-experience').map(x=>x.experienceId),
      temp:captured.some(x=>x.gameplayType==='allier-temporary'),
      guideCard:!!document.querySelector('#overlay .allier-special-card'),
      actionLabels:[...document.querySelectorAll('#overlay .allier-gp-action')].map(x=>x.textContent.trim())
    };
  });
  console.log('ALLIER MOULINS VISIBLE UI',JSON.stringify(visible));
  if(visible.count<10)failures.push('Moulins: trop peu de marqueurs gameplay réellement injectés ('+visible.count+')');
  if(!visible.person)failures.push('Moulins: rencontres non visibles sur la carte');
  for(const id of ['moulins-cncs-research','moulins-archives-gameplay','moulins-studio-gameplay','moulins-social-gameplay','moulins-hotel-gameplay'])if(!visible.experiences.includes(id))failures.push('Moulins: marqueur interface '+id+' non injecté');
  if(!visible.temp)failures.push('Moulins: objets temporaires non visibles sur la carte');
  if(!visible.guideCard||visible.actionLabels.length<2)failures.push('Moulins: guide spécialisé sans carte/boutons d’action');
  if(!visible.actionLabels.some(x=>/ATELIER/.test(x))||!visible.actionLabels.some(x=>/BOOK/.test(x)))failures.push('Moulins: interface archives sans choix Book/Atelier visible');

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
    return {archiveVisits:m.visits?.['moulins-archives-gameplay']?.count||0,hotelVisits:m.visits?.['moulins-hotel-gameplay']?.count||0,studioVisits:m.visits?.['moulins-studio-gameplay']?.count||0,book:!!m.discoveries?.['book:moulins-archives-gameplay'],atelier:!!m.discoveries?.['atelier:moulins-archives-gameplay'],tempHome:m.temporaryHome||null,timeDelta:after-before,blocked,ready,relation:m.people?.[person.id]||null,invitation:m.invitations?.[inv.id]||null,calendar:(g.calendar||[]).find(x=>x.id===accepted.eventId)||null,phone:(g.messages||[]).filter(x=>String(x.id||'').includes('qa-moulins-invitation')).length};
  });
  console.log('ALLIER MOULINS SYSTEMS',JSON.stringify(systems));
  if(!systems.archiveVisits||!systems.hotelVisits||!systems.studioVisits)failures.push('Moulins: mémoire de visite incomplète');
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
}

{
  const {page,pageErrors}=await openCity('Montluçon',46.3402,2.6025);
  const shape=await page.evaluate(()=>{
    const api=window.HCAllierTerritorialGameplay,list=api.experiences?.['Montluçon']||[];
    return {
      active:api.active?.(),supported:window.HCAllierMapInterface?.supportedCity?.(),types:list.map(x=>x.type),ids:list.map(x=>x.id),
      people:api.people.filter(x=>x.city==='Montluçon').map(x=>({name:x.name,fictional:x.fictional,role:x.role})),
      briefs:api.briefs.filter(x=>x.city==='Montluçon').map(x=>x.id),secrets:api.secrets.filter(x=>x.city==='Montluçon').map(x=>x.id),temp:api.temporaryObjects('Montluçon').map(x=>x.type)
    };
  });
  console.log('ALLIER MONTLUCON SHAPE',JSON.stringify(shape));
  if(!shape.active||shape.supported!=='Montluçon')failures.push('Montluçon: runtime/interface non actifs sur la présence réelle');
  for(const type of ['heritage','archives','craft','social','studio','hotel'])if(!shape.types.includes(type))failures.push('Montluçon: interface '+type+' absente');
  if(shape.people.length<3||shape.people.some(x=>x.fictional!==true||!/FICTION GAMEPLAY/i.test(x.role)))failures.push('Montluçon: personnages contemporains non clairement fictifs');
  if(shape.briefs.length<3||shape.secrets.length<2)failures.push('Montluçon: profondeur briefs/pistes insuffisante');
  for(const type of ['rumor','poster'])if(!shape.temp.includes(type))failures.push('Montluçon: objet temporaire '+type+' absent');

  const visible=await page.evaluate(async()=>{
    const captured=[],map=window.HCLocalMap,original=map.addMarker;
    map.addMarker=item=>{captured.push(item);return item};
    window.HCAllierMapInterface.render();
    map.addMarker=original;
    const craft=captured.find(x=>x.gameplayType==='allier-experience'&&x.experienceId==='montlucon-reemploi-gameplay');
    if(craft){window.HCLocalMapOpenGuide(craft);await new Promise(r=>setTimeout(r,30));}
    return {count:captured.length,people:captured.filter(x=>x.gameplayType==='allier-person').length,experiences:captured.filter(x=>x.gameplayType==='allier-experience').map(x=>x.experienceId),temp:captured.some(x=>x.gameplayType==='allier-temporary'),guideCard:!!document.querySelector('#overlay .allier-special-card'),actionLabels:[...document.querySelectorAll('#overlay .allier-gp-action')].map(x=>x.textContent.trim())};
  });
  console.log('ALLIER MONTLUCON VISIBLE UI',JSON.stringify(visible));
  if(visible.count<11||visible.people<3)failures.push('Montluçon: couche UI trop pauvre ('+visible.count+' marqueurs / '+visible.people+' rencontres)');
  for(const id of ['montlucon-heritage-gameplay','montlucon-archives-gameplay','montlucon-reemploi-gameplay','montlucon-social-gameplay','montlucon-studio-gameplay','montlucon-hotel-gameplay'])if(!visible.experiences.includes(id))failures.push('Montluçon: marqueur interface '+id+' non injecté');
  if(!visible.temp)failures.push('Montluçon: objets temporaires non visibles sur la carte');
  if(!visible.guideCard||!visible.actionLabels.some(x=>/ATELIER/.test(x))||!visible.actionLabels.some(x=>/BOOK/.test(x)))failures.push('Montluçon: interface réemploi sans choix Book/Atelier visible');

  const systems=await page.evaluate(()=>{
    const api=window.HCAllierTerritorialGameplay,bridge=window.HCAllierParitySystemBridge;
    const before=window.HCGame.get().clock.totalMinutes||0;
    api.useExperience('montlucon-archives-gameplay','atelier');
    api.useExperience('montlucon-reemploi-gameplay','atelier');
    api.useExperience('montlucon-hotel-gameplay');
    const blocked=bridge.prepareStudio({city:'Montluçon'});
    localStorage.setItem('haute-couture-atelier-creations-v1',JSON.stringify([{id:'qa-montlucon-finished',name:'Silhouette scène QA',status:'finished',finished:true,finishedAt:'2026-09-15T10:00:00'}]));
    api.useExperience('montlucon-studio-gameplay');
    const ready=JSON.parse(localStorage.getItem('haute-couture-allier-studio-request-v1')||'null');
    const person=api.people.find(x=>x.id==='allier-p-montlucon-scene');api.meet(person.id,'hello');api.meet(person.id,'work');
    const inv=bridge.createInvitation({id:'qa-montlucon-invitation',title:'Essayage équipe de scène QA',organizer:'Équipe de scène QA',inviter:'Mina QA',city:'Montluçon',place:'Montluçon · scène',dressCode:'Travail / scène',access:'Invitation équipe'});const accepted=bridge.respondInvitation(inv.id,'accepted');
    const after=window.HCGame.get().clock.totalMinutes||0,m=api.state(),g=window.HCGame.get();
    return {archive:!!m.discoveries?.['atelier:montlucon-archives-gameplay'],craftBook:!!m.discoveries?.['book:montlucon-reemploi-gameplay'],craftAtelier:!!m.discoveries?.['atelier:montlucon-reemploi-gameplay'],tempHome:m.temporaryHome||null,timeDelta:after-before,blocked,ready,relation:m.people?.[person.id]||null,invitation:m.invitations?.[inv.id]||null,calendar:(g.calendar||[]).find(x=>x.id===accepted.eventId)||null,phone:(g.messages||[]).filter(x=>String(x.id||'').includes('qa-montlucon-invitation')).length};
  });
  console.log('ALLIER MONTLUCON SYSTEMS',JSON.stringify(systems));
  if(!systems.archive||!systems.craftBook||!systems.craftAtelier)failures.push('Montluçon: archives/réemploi non reliés au Book et à l’Atelier');
  if(systems.tempHome?.city!=='Montluçon'||!systems.tempHome?.access?.includes('telephone')||!systems.tempHome?.access?.includes('agenda'))failures.push('Montluçon: Chez Moi temporaire incomplet');
  if(systems.timeDelta<260)failures.push('Montluçon: temps canonique insuffisamment consommé ('+systems.timeDelta+' min)');
  if(systems.blocked?.status!=='blocked'||systems.blocked?.reason!=='no-finished-creation')failures.push('Montluçon: studio devrait bloquer sans création terminée');
  if(systems.ready?.status!=='ready'||systems.ready?.creationId!=='qa-montlucon-finished'||systems.ready?.city!=='Montluçon')failures.push('Montluçon: studio non relié à la vraie création Atelier terminée');
  if((systems.relation?.interactions||0)<2||systems.relation?.professionalOpen!==true)failures.push('Montluçon: mémoire relationnelle/revisite absente');
  if(systems.invitation?.status!=='accepted'||systems.invitation?.city!=='Montluçon')failures.push('Montluçon: invitation/RSVP incomplet');
  if(systems.calendar?.status!=='planned'||systems.calendar?.type!=='invitation')failures.push('Montluçon: RSVP accepté non relié à l’Agenda');
  if(systems.phone<2)failures.push('Montluçon: invitation/RSVP non reliés au Téléphone');
  if(pageErrors.some(x=>/SyntaxError|ReferenceError/.test(x)))failures.push('Montluçon: erreur navigateur '+pageErrors.join(' | '));
  await page.close();
}

await browser.close();
if(failures.length){
  console.error('\nALLIER NÎMES PARITY : '+failures.length+' échec(s)');
  failures.forEach(x=>console.error('✗',x));
  process.exit(1);
}
console.log('\nALLIER NÎMES PARITY : OK — Moulins + Montluçon visibles et vivants : interfaces carte, mémoire, temps, relations, hébergement, studio réel, invitations/RSVP, Phone, Agenda, Book et Atelier.');
