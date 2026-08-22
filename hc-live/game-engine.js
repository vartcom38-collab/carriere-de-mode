/* Haute Couture Live — moteur central de partie. Temps de jeu, jamais temps réel. */
(function(){
  const STORAGE_KEY='haute-couture-game-state-v1';
  const VERSION=1;
  const clone=o=>JSON.parse(JSON.stringify(o));
  const uid=p=>(p||'id')+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
  const safeJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch(e){return fallback}};
  const saveRaw=state=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));window.dispatchEvent(new CustomEvent('hc-game-state',{detail:clone(state)}));return state};
  const isoLocal=d=>{const p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:00`};

  function initialClock(){
    const d=new Date();d.setHours(9,0,0,0);
    return {iso:isoLocal(d),totalMinutes:0,day:1};
  }

  function initialState(){
    const homeSave=safeJSON('haute-couture-home',{}),home=homeSave.home||null;
    const character=safeJSON('haute-couture-custom-character',{});
    const legacyBank=safeJSON('haute-couture-bank',{});
    const legacyStats=safeJSON('haute-couture-player-stats',{});
    const starting=Number.isFinite(Number(legacyBank.balance))?Number(legacyBank.balance):Number(homeSave.startingBudget||0);
    const city=homeSave.city||home?.city||'France';
    const state={
      version:VERSION,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),
      clock:initialClock(),
      player:{name:character.name||character.prenom||character.firstName||'Clara',money:starting,reputation:Number(legacyStats.reputation||0),level:1,city},
      home:{listingId:home?.id||null,city,type:home?.title||'Mon logement',address:home?.address||city,rent:Number(home?.price||0)+Number(home?.charges||0)},
      objectives:[],messages:[],calendar:[],missions:[],relationships:{},inventory:[],portfolio:[],transactions:[],flags:{introBootstrapped:false},
      reputationTracks:{local:0,professional:0,creative:0,prestige:0,clientele:0,mariage:0,scene:0,luxe:0}
    };
    bootstrap(state);
    return state;
  }

  function bootstrap(s){
    if(s.flags?.introBootstrapped)return s;
    s.flags=s.flags||{};s.flags.introBootstrapped=true;
    const now=s.clock.iso;
    s.objectives.push(
      {id:'intro-phone',title:'Regarder ton téléphone',status:'active',category:'decouverte'},
      {id:'intro-look',title:'Préparer ton premier look',status:'active',category:'dressing'},
      {id:'intro-city',title:`Découvrir ${s.player.city}`,status:'active',category:'ville'}
    );
    s.messages.push(
      {id:'msg-ines-intro',from:'Inès',avatar:'I',subject:'Une petite demande…',text:"J’ai une robe que j’adore mais elle tombe super mal. Tu crois que tu pourrais m’aider ?",receivedAt:now,read:false,action:'offer-first-mission'},
      {id:'msg-agence-intro',from:'Agence locale',avatar:'A',subject:'Bienvenue',text:`De nouvelles opportunités professionnelles apparaîtront à ${s.player.city} au fil de ta réputation.`,receivedAt:now,read:false}
    );
    s.relationships.Inès={affinity:10,trust:8,history:['Contact de début de partie']};
    const d=new Date(s.clock.iso);d.setDate(d.getDate()+1);d.setHours(11,0,0,0);
    s.calendar.push({id:'evt-discover-city',title:`Découvrir ${s.player.city}`,type:'exploration',start:isoLocal(d),status:'planned',location:s.player.city});
    return s;
  }

  function load(){
    let s=safeJSON(STORAGE_KEY,null);
    if(!s||s.version!==VERSION)s=initialState();
    s.updatedAt=new Date().toISOString();bootstrap(s);saveRaw(s);return s;
  }
  function save(s){s.updatedAt=new Date().toISOString();return saveRaw(s)}
  function get(){return load()}
  function mutate(fn){const s=load();fn(s);return save(s)}
  function gameDate(s){return new Date((s||load()).clock.iso)}
  function formatDateTime(s,withTime=true){const d=gameDate(s);return new Intl.DateTimeFormat('fr-FR',withTime?{weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}:{weekday:'short',day:'2-digit',month:'2-digit'}).format(d)}
  function formatTime(iso){return new Intl.DateTimeFormat('fr-FR',{hour:'2-digit',minute:'2-digit'}).format(new Date(iso))}
  function advanceTime(minutes,reason){minutes=Math.max(0,Number(minutes)||0);return mutate(s=>{const before=new Date(s.clock.iso),d=new Date(before.getTime()+minutes*60000);const beforeDay=before.toDateString();s.clock.iso=isoLocal(d);s.clock.totalMinutes=(s.clock.totalMinutes||0)+minutes;if(d.toDateString()!==beforeDay)s.clock.day=(s.clock.day||1)+1;if(reason)s.calendar.push({id:uid('time'),title:reason,type:'activity',start:isoLocal(before),end:isoLocal(d),status:'done'});});}
  function endDay({wakeHour=9}={}){return mutate(s=>{const before=new Date(s.clock.iso),next=new Date(before);next.setDate(next.getDate()+1);next.setHours(wakeHour,0,0,0);s.calendar.push({id:uid('sleep'),title:'Fin de journée',type:'rest',start:isoLocal(before),end:isoLocal(next),status:'done'});s.clock.iso=isoLocal(next);s.clock.day=(s.clock.day||1)+1;s.clock.totalMinutes=(s.clock.totalMinutes||0)+Math.max(0,Math.round((next-before)/60000));const now=next.getTime();s.calendar.forEach(e=>{if(e.status==='planned'&&e.type!=='deadline'&&new Date(e.start).getTime()<now)e.status='missed'});s.missions.forEach(m=>{if(m.status==='accepted'&&m.deadline&&new Date(m.deadline).getTime()<now)m.late=true});});}
  function transact(amount,label,category='misc'){amount=Number(amount)||0;return mutate(s=>{s.player.money+=amount;s.transactions.unshift({id:uid('tx'),amount,label,category,at:s.clock.iso});localStorage.setItem('haute-couture-bank',JSON.stringify({balance:s.player.money,updatedAt:new Date().toISOString()}));});}
  function addReputation(amount,track='professional',reason=''){amount=Number(amount)||0;return mutate(s=>{s.player.reputation+=amount;s.reputationTracks[track]=(s.reputationTracks[track]||0)+amount;if(reason)s.calendar.push({id:uid('rep'),title:reason,type:'reputation',start:s.clock.iso,status:'done'});localStorage.setItem('haute-couture-player-stats',JSON.stringify({reputation:s.player.reputation}));});}
  function completeObjective(id){return mutate(s=>{const o=s.objectives.find(x=>x.id===id);if(o)o.status='done';});}
  function markMessageRead(id){return mutate(s=>{const m=s.messages.find(x=>x.id===id);if(m)m.read=true;});}
  function addMessage(msg){return mutate(s=>s.messages.unshift({id:msg.id||uid('msg'),from:msg.from||'Contact',avatar:msg.avatar||'•',subject:msg.subject||'',text:msg.text||'',receivedAt:s.clock.iso,read:false,action:msg.action||null}));}
  function schedule(evt){return mutate(s=>s.calendar.push({id:evt.id||uid('evt'),title:evt.title||'Événement',type:evt.type||'event',start:evt.start||s.clock.iso,end:evt.end||null,status:evt.status||'planned',location:evt.location||null,missionId:evt.missionId||null}));}
  function offerFirstMission(){
    return mutate(s=>{
      let m=s.missions.find(x=>x.id==='mission-ines-robe');
      if(!m){m={id:'mission-ines-robe',title:"Reprendre la robe d’Inès",client:'Inès',type:'retouche',status:'offered',reward:45,difficulty:1,durationMinutes:120,brief:'Reprendre la coupe d’une robe qu’Inès adore pour qu’elle tombe mieux.',deadline:null,createdAt:s.clock.iso};s.missions.push(m)}
      const msg=s.messages.find(x=>x.id==='msg-ines-intro');if(msg)msg.read=true;
      const o=s.objectives.find(x=>x.id==='intro-phone');if(o)o.status='done';
    });
  }
  function acceptMission(id){return mutate(s=>{const m=s.missions.find(x=>x.id===id);if(!m)return;m.status='accepted';const d=new Date(s.clock.iso);d.setDate(d.getDate()+2);d.setHours(19,0,0,0);m.deadline=isoLocal(d);s.calendar.push({id:'deadline-'+id,title:'Deadline — '+m.title,type:'deadline',start:m.deadline,status:'planned',missionId:id});});}
  function completeMission(id){return mutate(s=>{const m=s.missions.find(x=>x.id===id);if(!m||m.status==='completed')return;m.status='completed';m.completedAt=s.clock.iso;s.player.money+=Number(m.reward||0);s.player.reputation+=2;s.reputationTracks.professional=(s.reputationTracks.professional||0)+2;s.reputationTracks.clientele=(s.reputationTracks.clientele||0)+1;s.transactions.unshift({id:uid('tx'),amount:Number(m.reward||0),label:m.title,category:'mission',at:s.clock.iso});s.portfolio.push({id:uid('portfolio'),name:m.title,client:m.client,type:m.type,date:s.clock.iso,notable:false});if(s.relationships[m.client]){s.relationships[m.client].trust+=5;s.relationships[m.client].affinity+=2;s.relationships[m.client].history.push('Mission réussie : '+m.title)}localStorage.setItem('haute-couture-bank',JSON.stringify({balance:s.player.money,updatedAt:new Date().toISOString()}));localStorage.setItem('haute-couture-player-stats',JSON.stringify({reputation:s.player.reputation}));});}
  function nextEvent(s){s=s||load();const now=new Date(s.clock.iso).getTime();return s.calendar.filter(e=>e.status==='planned'&&new Date(e.start).getTime()>=now).sort((a,b)=>new Date(a.start)-new Date(b.start))[0]||null}
  function unreadCount(s){return (s||load()).messages.filter(m=>!m.read).length}

  window.HCGame={get,save,mutate,advanceTime,endDay,transact,addReputation,completeObjective,markMessageRead,addMessage,schedule,offerFirstMission,acceptMission,completeMission,nextEvent,unreadCount,formatDateTime,formatTime,storageKey:STORAGE_KEY};

  document.addEventListener('click',e=>{
    const actionEl=e.target.closest&&e.target.closest('[data-action="atelier"],[data-action="telephone"],[data-action="agenda"],[data-action="sortir"]');
    if(!actionEl||!location.pathname.includes('/chez-moi/'))return;
    const action=actionEl.getAttribute('data-action');
    if(!['atelier','telephone','agenda','sortir'].includes(action))return;
    e.preventDefault();e.stopImmediatePropagation();
    location.href=action==='atelier'?'../atelier/':action==='telephone'?'../telephone/':action==='agenda'?'../agenda/':'../ville/';
  },true);
})();