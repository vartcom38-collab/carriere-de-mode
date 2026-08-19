(function(){
  const firstNames=['Alice','Amélie','Ana','Anna','Apolline','Aurore','Camille','Capucine','Carla','Célia','Chloé','Clémence','Diane','Éléonore','Emma','Eva','Gabrielle','Garance','Inès','Iris','Jade','Jeanne','Joséphine','Léa','Lila','Lina','Lou','Louise','Lucie','Maëlle','Manon','Margaux','Mathilde','Mélanie','Mila','Nina','Noémie','Océane','Olivia','Pauline','Romane','Rose','Salomé','Sarah','Sofia','Solène','Thaïs','Valentine','Victoire','Zoé'];
  const occupations=['architecte','bibliothécaire','fleuriste','photographe','professeure','libraire','danseuse','étudiante','céramiste','journaliste','musicienne','illustratrice','restauratrice','comédienne','cheffe de projet','infirmière','avocate','galeriste','coiffeuse','artisane'];
  const personalities=[
    {id:'precise',label:'très précise',budget:1.05,stress:1.15,relation:7},
    {id:'warm',label:'chaleureuse et fidèle',budget:1,stress:.85,relation:11},
    {id:'bold',label:'audacieuse',budget:1.15,stress:1,relation:8},
    {id:'shy',label:'réservée',budget:.9,stress:.8,relation:9},
    {id:'urgent',label:'toujours pressée',budget:1.2,stress:1.35,relation:5},
    {id:'curious',label:'curieuse et ouverte',budget:1,stress:.9,relation:10},
    {id:'demanding',label:'très exigeante',budget:1.35,stress:1.45,relation:6},
    {id:'sentimental',label:'attachée aux souvenirs',budget:.95,stress:.9,relation:12}
  ];
  const garments=[
    {kind:'retouche',title:'Retouche délicate',item:'robe',hours:4,base:55,skill:'Couture',diff:1},
    {kind:'retouche',title:'Ajuster une veste',item:'veste',hours:5,base:70,skill:'Finitions',diff:1},
    {kind:'commande',title:'Jupe sur mesure',item:'jupe',hours:7,base:95,skill:'Patronage',diff:1},
    {kind:'commande',title:'Pantalon bien coupé',item:'pantalon',hours:9,base:125,skill:'Patronage',diff:2},
    {kind:'commande',title:'Chemisier léger',item:'chemisier',hours:8,base:120,skill:'Couture',diff:2},
    {kind:'commande',title:'Robe de dîner',item:'robe',hours:11,base:165,skill:'Finitions',diff:2},
    {kind:'upcycling',title:'Transformer une pièce ancienne',item:'vêtement vintage',hours:7,base:100,skill:'Créativité',diff:2},
    {kind:'ceremony',title:'Tenue pour une cérémonie',item:'tenue',hours:14,base:230,skill:'Finitions',diff:3,minLevel:2},
    {kind:'wedding',title:'Invitée à un mariage',item:'robe habillée',hours:15,base:260,skill:'Patronage',diff:3,minLevel:2,rep:'wedding'},
    {kind:'stage',title:'Pièce pour la scène',item:'costume',hours:18,base:320,skill:'Créativité',diff:3,minLevel:3,rep:'stage'},
    {kind:'editorial',title:'Silhouette pour un shooting',item:'silhouette éditoriale',hours:20,base:390,skill:'Créativité',diff:4,minLevel:4},
    {kind:'wedding',title:'Robe de mariée civile',item:'robe de mariée',hours:24,base:520,skill:'Finitions',diff:4,minLevel:5,rep:'wedding'},
    {kind:'luxury',title:'Commande privée haut de gamme',item:'pièce couture',hours:28,base:760,skill:'Patronage',diff:5,minLevel:7,rep:'luxury'}
  ];
  const occasions=['un dîner important','un anniversaire','une cérémonie familiale','un rendez-vous professionnel','un vernissage','une soirée de théâtre','un week-end spécial','une séance photo','un concert','une fête de famille'];
  const constraints=['doit rester très confortable','doit pouvoir être portée toute la journée','doit mettre en valeur un tissu déjà possédé','doit rester sobre','doit avoir un détail inattendu','doit être facile à transporter','doit fonctionner avec des chaussures déjà choisies','doit conserver un élément sentimental','doit être terminée sans gaspiller de matière','doit convenir à une météo changeante'];
  const inspirations=['lignes architecturales','lumière de fin de journée','matières naturelles','contraste mat/brillant','souvenir vintage','silhouette fluide','détail artisanal','couleurs minérales','mouvement du tissu','volumes souples','graphisme urbain','palette végétale'];
  const fabrics=['coton','lin','laine fine','viscose','denim','velours','satin','mousseline','twill','jacquard'];
  const referralKinds=['une amie','une collègue','sa sœur','une voisine','une photographe','une commerçante du quartier'];
  function hash(str){let h=2166136261>>>0;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
  function rng(seed){let x=seed>>>0;return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
  const pick=(r,a)=>a[Math.floor(r()*a.length)];
  function careerLevel(state){return Math.max(1,state?.progression?.careerLevel||1)}
  function clientFromContacts(state,r){const eligible=(state.contacts||[]).filter(c=>(c.relationship||0)>=10);if(eligible.length&&r()<.32){const c=pick(r,eligible);return{id:c.id,name:c.name,kind:c.kind||'cliente',returning:true,relationship:c.relationship||0,descriptor:'cliente déjà connue'}}return null}
  function makeClient(state,r,serial){const old=clientFromContacts(state,r);if(old)return old;const name=pick(r,firstNames),job=pick(r,occupations),p=pick(r,personalities);return{id:'client-'+hash(name+'-'+job+'-'+serial+'-'+state.world.day),name,kind:'cliente',returning:false,personality:p,descriptor:job+', '+p.label}}
  function allowedGarments(level){return garments.filter(g=>(g.minLevel||1)<=level)}
  function generatedMission(state,index=0){const seedText=[state.world.day,state.world.currentCity||'France',state.player.characterId||'x',state.missions.completed.length,state.missions.failed.length,index].join('|');const r=rng(hash(seedText));const level=careerLevel(state);const g=pick(r,allowedGarments(level));const c=makeClient(state,r,seedText);const p=c.personality||pick(r,personalities);const occasion=pick(r,occasions),constraint=pick(r,constraints),insp=pick(r,inspirations),fabric=pick(r,fabrics);const variance=.85+r()*.35;const budget=Math.round((g.base*(p?.budget||1)*variance)/5)*5;const duration=Math.max(3,Math.round(g.hours*(.9+r()*.25)));const deadline=Math.max(2,Math.round(duration/4)+(p?.id==='urgent'?1:2)+Math.floor(r()*3));const id='proc-'+state.world.day+'-'+index+'-'+hash(seedText+'-'+g.title+'-'+c.id);const clientLabel=c.returning?c.name:c.name+', '+c.descriptor;const brief=(c.returning?'Elle revient vers toi. ':'')+'Elle cherche '+(g.item==='tenue'?'une tenue':'un(e) '+g.item)+' pour '+occasion+' ; la pièce '+constraint+'. Une piste de matière : '+fabric+'.';return {id,generated:true,kind:g.kind,title:g.title,clientId:c.id,client:clientLabel,relationshipKind:'cliente',brief,budget,durationHours:duration,difficulty:g.diff,deadlineDays:deadline,inspiration:insp,rewards:{money:budget,reputationLocal:Math.max(1,g.diff),reputationCreative:g.diff>=3?1:0,relationship:(p?.relation||8),skill:g.skill,skillXp:Math.max(1,Math.ceil(g.diff/2))},meta:{occasion,constraint,fabric,personality:p?.label||'',returning:c.returning,careerLevel:level}}}
  function fillMissions(state,target=6){if(!state?.missions)return state;const existing=new Set([...(state.missions.available||[]),...(state.missions.active||[]),...(state.missions.completed||[]),...(state.missions.failed||[])].map(m=>m.id));let tries=0;while(state.missions.available.length<target&&tries<30){const m=generatedMission(state,tries);if(!existing.has(m.id)){state.missions.available.push(m);existing.add(m.id)}tries++}return state}
  function referralMission(state,contact){const seed=hash((contact?.id||'ref')+'|'+state.world.day+'|'+(contact?.referrals||0));const r=rng(seed);const m=generatedMission(state,100+((contact?.referrals||0)%50));m.id='ref-'+m.id;m.client=pick(r,referralKinds)+' de '+contact.name+' — '+m.client;m.meta.referralFrom=contact.id;m.brief='Recommandée par '+contact.name+'. '+m.brief;m.rewards.relationship+=2;return m}
  function dailyWorldEvent(state){const seed=hash('event|'+state.world.day+'|'+(state.world.currentCity||'France'));const r=rng(seed);const pool=[
    {kind:'trend',title:'Une couleur revient partout',text:'Dans les vitrines et les silhouettes croisées, une même gamme de tons commence à apparaître.'},
    {kind:'culture',title:'Une affiche attire ton regard',text:'Une exposition, un spectacle ou un événement local pourrait nourrir une future inspiration.'},
    {kind:'supplier',title:'Une adresse circule',text:'On te parle d’une petite adresse où trouver de la matière ou de la mercerie intéressante.'},
    {kind:'social',title:'Le bouche-à-oreille bouge',text:'Ton nom commence doucement à circuler dans un petit réseau local.'},
    {kind:'quiet',title:'Journée calme',text:'Rien d’urgent. Un peu d’espace pour avancer, apprendre ou observer.'}
  ];const base=pick(r,pool);return {...base,id:'world-'+state.world.day+'-'+seed,day:state.world.day}}
  function materialDiscovery(state,index=0){const seed=hash('mat|'+state.world.day+'|'+index+'|'+(state.world.currentRegion||''));const r=rng(seed);const fabric=pick(r,fabrics);const qualities=['souple','sec','texturé','léger','dense','lumineux','mat'];return{id:'material-'+seed,name:fabric+' '+pick(r,qualities),type:'fabric',qty:1,unit:'coupon',quality:1+Math.floor(r()*3),memory:'Découvert à '+(state.world.currentCity||'proximité')+' au jour '+state.world.day+'.'}}
  window.HauteCoutureBank={generatedMission,fillMissions,referralMission,dailyWorldEvent,materialDiscovery,counts:{firstNames:firstNames.length,occupations:occupations.length,personalities:personalities.length,garments:garments.length,occasions:occasions.length,constraints:constraints.length,inspirations:inspirations.length,fabrics:fabrics.length}};
})();
