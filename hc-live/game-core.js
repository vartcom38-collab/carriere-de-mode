(function(){
  const KEY='haute-couture-game-state-v1';
  const VERSION=1;
  const clone=o=>JSON.parse(JSON.stringify(o));
  const nowISO=()=>new Date().toISOString();
  const starterInventory=[
    {id:'machine-basic',type:'equipment',name:'Machine à coudre familiale',qty:1,quality:1},
    {id:'scissors-basic',type:'equipment',name:'Ciseaux de couture',qty:1,quality:1},
    {id:'needles-basic',type:'haberdashery',name:'Aiguilles assorties',qty:1,quality:1},
    {id:'thread-neutral',type:'haberdashery',name:'Fils neutres',qty:4,quality:1},
    {id:'fabric-cotton-cream',type:'fabric',name:'Coton écru',qty:2,unit:'m',quality:1}
  ];
  const starterMissionTemplates=[
    {id:'retouche-voisine',kind:'retouche',title:'Une première retouche',client:'Voisine du quartier',brief:'Raccourcir et reprendre une robe simple pour qu’elle tombe mieux.',budget:55,durationHours:4,difficulty:1,deadlineDays:3,rewards:{money:55,reputationLocal:2,skill:'Couture',skillXp:2}},
    {id:'jupe-simple',kind:'commande',title:'Une jupe pour un dîner',client:'Première cliente',brief:'Créer une jupe simple, portable et bien finie à partir d’un tissu accessible.',budget:95,durationHours:7,difficulty:1,deadlineDays:5,rewards:{money:95,reputationLocal:3,skill:'Finitions',skillXp:2}},
    {id:'transformation-vintage',kind:'upcycling',title:'Transformer une pièce ancienne',client:'Cliente de passage',brief:'Donner une nouvelle vie à un vêtement ancien sans perdre son caractère.',budget:80,durationHours:6,difficulty:1,deadlineDays:4,rewards:{money:80,reputationCreative:2,skill:'Créativité',skillXp:2}}
  ];
  function baseState(character,residence){
    return {
      version:VERSION,createdAt:nowISO(),updatedAt:nowISO(),started:false,
      player:{characterId:character?.id||null,name:character?.name||'',money:1200,energy:100,stress:10,reputation:{local:0,professional:0,creative:0,prestige:0,clientele:0}},
      world:{day:1,hour:9,minute:0,season:'Automne',weather:'Doux',currentCity:residence?.city||null,currentRegion:residence?.region||null,currentDepartment:residence?.department||null},
      home:{current:residence||null,properties:residence?[residence]:[],primaryResidenceId:residence?.id||null,primaryAtelierId:residence?.id||null,decor:[],equipmentSlots:[],storageBonus:0},
      inventory:clone(starterInventory),
      skills:{Couture:{level:1,xp:0},Croquis:{level:1,xp:0},Matières:{level:1,xp:0},Finitions:{level:1,xp:0},Patronage:{level:0,xp:0},Créativité:{level:1,xp:0}},
      knowledge:[],
      carnet:{pages:[{id:'depart',type:'journal',title:'Un nouveau départ',text:'Premier jour dans mon nouveau logement. Tout reste à construire.',createdDay:1}],discoveries:[],palettes:[],places:[],techniques:[],suppliers:[],contacts:[],creations:[]},
      agenda:{appointments:[],deadlines:[],trips:[],events:[]},
      contacts:[],
      missions:{available:clone(starterMissionTemplates),active:[],completed:[],failed:[]},
      orders:[],
      messages:[{id:'welcome',from:'Carnet',subject:'Bienvenue chez toi',body:'Installe-toi, regarde autour de toi et commence doucement.',day:1,read:false}],
      map:{discoveredPlaces:[],savedPlaces:[],realEstateAlerts:[]},
      progression:{tutorialStage:'arrived',unlocked:['carnet','agenda','matieres','carte','messages'],careerLevel:1},
      collections:[],creations:[],team:[],finances:{income:[],expenses:[],rent:residence?.price||0}
    };
  }
  function save(state){state.updatedAt=nowISO();localStorage.setItem(KEY,JSON.stringify(state));return state}
  function load(){try{const raw=localStorage.getItem(KEY);return raw?JSON.parse(raw):null}catch(e){return null}}
  function ensure(character,residence){let s=load();if(!s)s=baseState(character,residence);if(character){s.player.characterId=character.id;s.player.name=character.name}if(residence&&!s.home.current){s.home.current=residence;s.home.properties=[residence];s.home.primaryResidenceId=residence.id;s.home.primaryAtelierId=residence.id;s.world.currentCity=residence.city;s.world.currentRegion=residence.region;s.world.currentDepartment=residence.department}s.started=true;return save(s)}
  function addCarnetPage(title,text,type='journal'){const s=load();if(!s)return null;s.carnet.pages.push({id:'page-'+Date.now(),type,title,text,createdDay:s.world.day});return save(s)}
  function addContact(contact){const s=load();if(!s)return null;if(!s.contacts.find(c=>c.id===contact.id))s.contacts.push(contact);return save(s)}
  function addInventory(item){const s=load();if(!s)return null;const found=s.inventory.find(i=>i.id===item.id);if(found)found.qty=(found.qty||0)+(item.qty||1);else s.inventory.push(item);return save(s)}
  function addSkillXp(skill,amount=1){const s=load();if(!s)return null;if(!s.skills[skill])s.skills[skill]={level:0,xp:0};s.skills[skill].xp+=amount;while(s.skills[skill].xp>=5){s.skills[skill].xp-=5;s.skills[skill].level+=1}return save(s)}
  function acceptMission(id){const s=load();if(!s)return null;const i=s.missions.available.findIndex(m=>m.id===id);if(i<0)return s;const m=s.missions.available.splice(i,1)[0];m.acceptedDay=s.world.day;m.deadlineDay=s.world.day+m.deadlineDays;m.progress=0;s.missions.active.push(m);s.agenda.deadlines.push({id:'deadline-'+m.id,title:m.title,day:m.deadlineDay,type:'mission'});s.messages.push({id:'accepted-'+m.id,from:m.client,subject:'Commande confirmée',body:m.brief,day:s.world.day,read:false});return save(s)}
  function progressMission(id,hours){const s=load();if(!s)return null;const m=s.missions.active.find(x=>x.id===id);if(!m)return s;m.progress=Math.min(m.durationHours,(m.progress||0)+hours);s.world.hour+=hours;while(s.world.hour>=24){s.world.hour-=24;s.world.day+=1}if(m.progress>=m.durationHours)return completeMission(id);return save(s)}
  function completeMission(id){const s=load();if(!s)return null;const i=s.missions.active.findIndex(m=>m.id===id);if(i<0)return s;const m=s.missions.active.splice(i,1)[0];m.completedDay=s.world.day;s.missions.completed.push(m);s.player.money+=m.rewards.money||0;s.finances.income.push({day:s.world.day,amount:m.rewards.money||0,label:m.title});if(m.rewards.reputationLocal)s.player.reputation.local+=m.rewards.reputationLocal;if(m.rewards.reputationCreative)s.player.reputation.creative+=m.rewards.reputationCreative;s.carnet.creations.push({id:'creation-'+m.id,title:m.title,day:s.world.day,type:m.kind});if(m.rewards.skill){if(!s.skills[m.rewards.skill])s.skills[m.rewards.skill]={level:0,xp:0};s.skills[m.rewards.skill].xp+=m.rewards.skillXp||1;while(s.skills[m.rewards.skill].xp>=5){s.skills[m.rewards.skill].xp-=5;s.skills[m.rewards.skill].level+=1}}s.messages.push({id:'done-'+m.id,from:m.client,subject:'Merci !',body:'La commande est terminée. Ta réputation commence à grandir.',day:s.world.day,read:false});return save(s)}
  function finishDay(){const s=load();if(!s)return null;s.world.day+=1;s.world.hour=8;s.player.energy=Math.min(100,s.player.energy+35);s.player.stress=Math.max(0,s.player.stress-10);s.messages.push({id:'day-'+s.world.day,from:'Agenda',subject:'Jour '+s.world.day,body:'Une nouvelle journée commence.',day:s.world.day,read:false});return save(s)}
  function moveHome(residence){const s=load();if(!s)return null;s.home.current=residence;if(!s.home.properties.find(p=>p.id===residence.id))s.home.properties.push(residence);s.home.primaryResidenceId=residence.id;s.home.primaryAtelierId=residence.id;s.world.currentCity=residence.city;s.world.currentRegion=residence.region;s.world.currentDepartment=residence.department;return save(s)}
  function reset(){localStorage.removeItem(KEY)}
  window.HauteCoutureCore={KEY,baseState,load,save,ensure,reset,addCarnetPage,addContact,addInventory,addSkillXp,acceptMission,progressMission,completeMission,finishDay,moveHome,starterMissionTemplates};
})();
