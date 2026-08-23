/* Haute Couture Live — Phone / social gameplay engine
   100% local gameplay: no image generation, no API call, no credits.
   The engine turns existing game assets, travel unlocks, atelier exports and missions into reusable social-media content. */
(function(){
  'use strict';
  const KEY='haute-couture-phone-social-v2';
  const VERSION=2;
  const nowId=p=>(p||'id')+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);
  const clone=o=>JSON.parse(JSON.stringify(o));
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch(e){return f}};
  const write=s=>{s.updatedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(s));window.dispatchEvent(new CustomEvent('hc-phone-state',{detail:clone(s)}));return s};
  const game=()=>window.HCGame?.get?.()||null;
  const gameIso=()=>game()?.clock?.iso||new Date().toISOString();
  const dayKey=()=>String(game()?.clock?.day||1);
  const hash=str=>{let h=2166136261;for(const c of String(str)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return Math.abs(h>>>0)};
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const unique=a=>[...new Set(a.filter(Boolean))];
  const slug=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

  const PACKS={
    'starter-life':{
      id:'starter-life',label:'Début de carrière',source:'starter',
      items:[
        ['starter-coffee-sketch','Café & carnet','backstage','Coulisses du matin · carnet, café et premières idées.','atelier'],
        ['starter-desk','Table de travail','backstage','Table de travail · épingles, crayons et papier.','atelier'],
        ['starter-fabric','Détail textile','detail','Textures, plis et matières en gros plan.','atelier'],
        ['starter-mirror','Look miroir','look','Look du jour · photo miroir.','lifestyle'],
        ['starter-mood','Moodboard neutre','moodboard','Planche d’inspiration neutre.','inspiration'],
        ['starter-notes','Notes de création','backstage','Notes et recherches de silhouette.','atelier']
      ]
    },
    'atelier-core':{
      id:'atelier-core',label:'Atelier',source:'atelier',
      items:[
        ['atelier-croquis','Croquis en cours','sketch','Croquis de travail en cours.','atelier'],
        ['atelier-drape','Recherche de drapé','detail','Recherche de volume et de drapé.','atelier'],
        ['atelier-pins','Épinglage','backstage','Épinglage sur mannequin.','atelier'],
        ['atelier-swatch','Nuancier textile','detail','Nuancier matières et couleurs.','atelier']
      ]
    },
    'first-client':{
      id:'first-client',label:'Première cliente',source:'mission',
      items:[
        ['client-brief','Brief cliente','backstage','Brief, mesures et premières notes.','client'],
        ['client-before','Avant retouche','before_after','Avant transformation.','client'],
        ['client-fitting','Essayage cliente','backstage','Essayage et ajustements.','client']
      ]
    },
    'portfolio-one':{
      id:'portfolio-one',label:'Premier projet terminé',source:'portfolio',
      items:[
        ['portfolio-finished','Création terminée','finished','Projet terminé · prêt à entrer au portfolio.','portfolio'],
        ['portfolio-detail','Détail couture final','detail','Détail finition du projet terminé.','portfolio'],
        ['portfolio-ba','Avant / après','before_after','Transformation avant / après.','portfolio']
      ]
    },
    'local-city':{
      id:'local-city',label:'Ma ville',source:'travel',dynamic:true,
      items:[
        ['city-street','Rue & architecture','travel','Repérage dans la ville.','travel'],
        ['city-cafe','Café local','travel','Pause inspiration en ville.','travel'],
        ['city-window','Vitrine mode','travel','Vitrine et repérage tendances.','travel'],
        ['city-detail','Détail urbain','travel','Couleurs, matières et détails de rue.','travel']
      ]
    },
    'social-100':{
      id:'social-100',label:'Premiers regards pros',source:'milestone',
      items:[['social-thanks-100','100 abonnés','milestone','Merci pour les 100 ✦','social']]
    },
    'social-1000':{
      id:'social-1000',label:'Profil qui monte',source:'milestone',
      items:[['social-thanks-1k','1K abonnés','milestone','1 000 abonnés — la communauté grandit.','social']]
    }
  };

  function mediaFromTuple(t,packId,city){
    const [id,title,type,caption,category]=t;
    return {id,packId,title,type,caption,category,imageKey:id,imageUrl:null,city:city||null,unlockedAt:gameIso(),used:0,favorite:false,source:'library',free:true};
  }

  function initial(){
    const g=game();
    const name=g?.player?.name||'Clara';
    return {
      version:VERSION,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),
      profile:{handle:'@'+slug(name||'clara')+'.atelier',displayName:name,bio:'Jeune créatrice · croquis, tissus & vraie vie de mode ✦',followers:38,following:91,reach:0,engagement:0,verified:false},
      posts:[],stories:[],feed:[],notifications:[],media:[],unlockedPacks:[],triggerLedger:{},cooldowns:{},daily:{},visited:[],
      contacts:{},opportunities:[],savedPosts:[],followedAccounts:['mode_locale','atelier_notes'],
      analytics:{totalLikes:0,totalComments:0,totalPosts:0,totalStories:0,totalFollowerGain:0,bestPostId:null,bestPostScore:0},
      settings:{private:false,comments:true,autoArchiveStories:true,zeroCreditMode:true},
      flags:{seeded:false,introShown:false}
    };
  }

  function load(){
    let s=read(KEY,null);
    if(!s||s.version!==VERSION)s=initial();
    bootstrap(s);syncFromGame(s);evaluate(s);return write(s);
  }
  function mutate(fn){const s=read(KEY,null)||initial();bootstrap(s);fn(s);syncFromGame(s);evaluate(s);return write(s)}

  function pushNotice(s,type,title,text,action,data){
    const dedupe=(data&&data.dedupe)||null;
    if(dedupe&&s.notifications.some(n=>n.dedupe===dedupe))return;
    s.notifications.unshift({id:nowId('phone-notice'),type,title,text,action:action||null,data:data||{},dedupe,at:gameIso(),read:false});
    s.notifications=s.notifications.slice(0,80);
  }

  function unlockPackIn(s,id,context={}){
    if(s.unlockedPacks.includes(id))return false;
    const p=PACKS[id];if(!p)return false;
    s.unlockedPacks.push(id);
    const city=context.city||game()?.player?.city||null;
    p.items.forEach(t=>{if(!s.media.some(m=>m.id===t[0]))s.media.push(mediaFromTuple(t,id,city))});
    pushNotice(s,'unlock','Nouveau contenu débloqué',p.label,'media',{packId:id,dedupe:'unlock-'+id});
    return true;
  }

  function seedFeed(s){
    if(s.flags.seeded)return;s.flags.seeded=true;
    s.feed=[
      {id:'feed-lena-1',account:'Léna Morel',handle:'@lena.more',avatar:'L',type:'look',visual:'v2',caption:'Essayages du matin, volumes simples et une obsession pour les beaux tombés.',likes:284,comments:18,followed:false,city:'Paris'},
      {id:'feed-studio-1',account:'Studio Nacre',handle:'@studionacre',avatar:'N',type:'detail',visual:'v3',caption:'Recherche matière : transparence, structure, mouvement.',likes:612,comments:34,followed:false,city:'Lyon'},
      {id:'feed-jade-1',account:'Jade K.',handle:'@jadek.style',avatar:'J',type:'moodboard',visual:'v4',caption:'Palette du jour : crème, vieux rose et une pointe de métal.',likes:193,comments:11,followed:false,city:'Bordeaux'}
    ];
  }

  function bootstrap(s){
    s.version=VERSION;s.profile=s.profile||initial().profile;s.posts=s.posts||[];s.stories=s.stories||[];s.feed=s.feed||[];s.notifications=s.notifications||[];s.media=s.media||[];s.unlockedPacks=s.unlockedPacks||[];s.triggerLedger=s.triggerLedger||{};s.cooldowns=s.cooldowns||{};s.daily=s.daily||{};s.visited=s.visited||[];s.contacts=s.contacts||{};s.opportunities=s.opportunities||[];s.savedPosts=s.savedPosts||[];s.followedAccounts=s.followedAccounts||[];s.analytics=s.analytics||initial().analytics;s.settings=s.settings||initial().settings;s.flags=s.flags||{};
    seedFeed(s);unlockPackIn(s,'starter-life');unlockPackIn(s,'atelier-core');
    if(!s.flags.introShown){s.flags.introShown=true;pushNotice(s,'system','Ton compte est prêt','Ton réseau social fonctionne entièrement avec les contenus du jeu : aucun crédit n’est consommé.','social',{dedupe:'intro-zero-credit'})}
  }

  function addVisitedIn(s,place){
    if(!place)return;const id=slug(place);if(s.visited.some(v=>v.id===id))return;
    s.visited.push({id,name:place,firstVisit:gameIso()});
    if(s.visited.length===1)unlockPackIn(s,'local-city',{city:place});
    pushNotice(s,'travel','Nouvelles photos disponibles',place+' vient d’ajouter de nouvelles ambiances à ta médiathèque.','media',{dedupe:'travel-'+id});
  }

  function ingestAtelier(s){
    const keys=['haute-couture-atelier-exports','haute-couture-atelier-media','hc-atelier-exports'];
    let exports=[];for(const k of keys){const x=read(k,[]);if(Array.isArray(x))exports=exports.concat(x)}
    exports.forEach((x,i)=>{
      const id='atelier-export-'+(x.id||hash(JSON.stringify(x)+i));
      if(s.media.some(m=>m.id===id))return;
      s.media.push({id,packId:'atelier-export',title:x.title||x.name||'Création Atelier',type:x.type||'sketch',caption:x.caption||'Création en cours dans mon atelier.',category:'atelier',imageKey:id,imageUrl:x.url||x.image||x.imageUrl||null,city:null,unlockedAt:gameIso(),used:0,favorite:false,source:'atelier_export',free:true,meta:x});
      pushNotice(s,'atelier','Nouveau média Atelier','Une création de l’Atelier est maintenant publiable.','media',{dedupe:'atelier-media-'+id});
    });
  }

  function syncFromGame(s){
    const g=game();if(!g)return s;
    s.profile.displayName=g.player?.name||s.profile.displayName;
    if(!s.profile.handle||s.profile.handle==='@clara.atelier')s.profile.handle='@'+slug(s.profile.displayName)+'.atelier';
    addVisitedIn(s,g.player?.city);
    (g.calendar||[]).filter(e=>e.status==='done'&&e.location).forEach(e=>addVisitedIn(s,e.location));
    const travel=read('haute-couture-travel-history',[]);if(Array.isArray(travel))travel.forEach(t=>addVisitedIn(s,t.city||t.place||t.name));
    if((g.missions||[]).some(m=>['offered','accepted','in_progress','completed'].includes(m.status)))unlockPackIn(s,'first-client');
    if((g.portfolio||[]).length)unlockPackIn(s,'portfolio-one');
    ingestAtelier(s);
    // Convert game relationships into phone contact metadata without replacing the original relationship system.
    Object.entries(g.relationships||{}).forEach(([name,r])=>{s.contacts[name]=Object.assign(s.contacts[name]||{name,muted:false,favorite:false,lastCallDay:null}, {affinity:r.affinity||0,trust:r.trust||0,historyCount:(r.history||[]).length})});
    return s;
  }

  function triggerOnce(s,id,fn){if(s.triggerLedger[id])return false;s.triggerLedger[id]={at:gameIso()};fn();return true}
  function addOpportunity(s,id,title,from,kind,requirement,reward,action){
    if(s.opportunities.some(o=>o.id===id))return;
    s.opportunities.unshift({id,title,from,kind,status:'offered',requirement,reward,action,createdAt:gameIso()});
    pushNotice(s,'opportunity',from,title,'opportunity',{opportunityId:id,dedupe:'opp-'+id});
  }

  function evaluate(s){
    const g=game();const f=s.profile.followers||0,rep=g?.player?.reputation||0,portfolio=(g?.portfolio||[]).length;
    if(f>=100)triggerOnce(s,'followers-100',()=>{unlockPackIn(s,'social-100');addOpportunity(s,'opp-local-boutique','Ta grille nous plaît — partante pour un repost ?','Boutique locale','repost','100 abonnés',{followers:18,reputation:1},'social')});
    if(f>=250&&rep>=3)triggerOnce(s,'followers-250',()=>addOpportunity(s,'opp-photographer','Mini shooting créatif en échange de contenu','Photographe émergent','shoot','250 abonnés + réputation 3',{followers:45,reputation:1,media:2},'social'));
    if(f>=500&&portfolio>=1)triggerOnce(s,'followers-500',()=>addOpportunity(s,'opp-creator-collab','Collaboration croisée autour de ton dernier projet','Créatrice indépendante','collab','500 abonnés + 1 projet portfolio',{followers:90,reputation:2},'social'));
    if(f>=1000){triggerOnce(s,'followers-1000',()=>{unlockPackIn(s,'social-1000');addOpportunity(s,'opp-local-media','Portrait : les jeunes talents mode à suivre','Magazine local','press','1K abonnés',{followers:180,reputation:3},'social')})}
    if(f>=2500&&rep>=12)triggerOnce(s,'followers-2500',()=>addOpportunity(s,'opp-brand-seeding','Sélection créatrice — proposition de gifting','Maison émergente','brand','2.5K abonnés + réputation 12',{followers:320,reputation:4},'social'));
    if(rep>=20)triggerOnce(s,'rep-20-social',()=>pushNotice(s,'milestone','Ton nom commence à circuler','Les comptes professionnels te découvrent plus facilement.','social',{dedupe:'rep20'}));
    // Daily light-weight social events; deterministic and never real-time.
    const d=dayKey();if(!s.daily[d])s.daily[d]={posts:0,stories:0,calls:0,likes:0};
    if((g?.clock?.day||1)>=3)triggerOnce(s,'day-3-tip',()=>pushNotice(s,'tip','Conseil réseau','Les contenus de voyage et les créations terminées ont généralement plus de portée.','social',{dedupe:'day3tip'}));
    archiveStories(s);
    return s;
  }

  function archiveStories(s){
    if(!s.settings.autoArchiveStories)return;
    const current=Number(game()?.clock?.day||1);
    s.stories.forEach(st=>{if(!st.archived&&current-Number(st.day||current)>=1)st.archived=true});
  }

  function availableMedia(s=load()){return s.media.filter(m=>m.free&&!m.locked).sort((a,b)=>(a.used||0)-(b.used||0))}
  function getMedia(id,s=load()){return s.media.find(m=>m.id===id)||null}

  function performance(s,media,kind='post'){
    const g=game();const d=dayKey();const daily=s.daily[d]||{posts:0,stories:0};
    const followers=s.profile.followers||0,rep=g?.player?.reputation||0;
    const typeBonus={finished:1.45,before_after:1.38,travel:1.28,look:1.16,sketch:1.12,moodboard:1.08,detail:1.04,backstage:.96,milestone:1.1}[media?.type]||1;
    const novelty=media?.used?Math.max(.72,1-(media.used*.08)):1.08;
    const spam=kind==='post'?Math.max(.45,1-(daily.posts||0)*.22):Math.max(.55,1-(daily.stories||0)*.14);
    const base=Math.max(12,followers*.18+22+rep*2.4);
    const seed=.88+(hash((media?.id||'x')+gameIso()+kind)%28)/100;
    const reach=Math.round(base*typeBonus*novelty*spam*seed*(kind==='story'?.72:1));
    const likes=Math.max(2,Math.round(reach*(.16+((hash(media?.id)%7)/100))));
    const comments=Math.max(0,Math.round(likes*(.055+((hash('c'+media?.id)%5)/100))));
    const followerGain=Math.max(0,Math.round(reach*(kind==='story'?.018:.034)*typeBonus));
    return {reach,likes,comments,followerGain,score:Math.round((likes+comments*3+followerGain*4)*10)/10,spamPenalty:spam};
  }

  function commentsFor(s,media,count){
    const g=game();const known=Object.keys(g?.relationships||{});const generic=['Très beau travail ✦','Le tombé est canon.','J’adore cette direction.','Cette matière !','Ça prend forme 👀','La silhouette est superbe.','Obsédée par ce détail.'];
    const out=[];for(let i=0;i<Math.min(count,4);i++){const author=known[i]||['@mode_locale','@carnetstyle','@ateliercurieux','@ligne_claire'][i%4];out.push({id:nowId('comment'),author,text:generic[(hash(media.id+i)%generic.length)],at:gameIso()})}return out;
  }

  function publish(mediaId,caption='',opts={}){
    return mutate(s=>{
      const media=s.media.find(m=>m.id===mediaId);if(!media)throw new Error('Média introuvable');
      const d=dayKey();s.daily[d]=s.daily[d]||{posts:0,stories:0,calls:0,likes:0};
      const perf=performance(s,media,'post');
      const post={id:nowId('post'),mediaId,caption:caption||media.caption,type:media.type,imageUrl:media.imageUrl||null,imageKey:media.imageKey,city:media.city||null,createdAt:gameIso(),day:Number(game()?.clock?.day||1),likes:perf.likes,comments:commentsFor(s,media,perf.comments),reach:perf.reach,followerGain:perf.followerGain,score:perf.score,saved:0,archived:false};
      s.posts.unshift(post);media.used=(media.used||0)+1;s.profile.followers+=perf.followerGain;s.profile.reach+=perf.reach;s.analytics.totalLikes+=perf.likes;s.analytics.totalComments+=post.comments.length;s.analytics.totalPosts++;s.analytics.totalFollowerGain+=perf.followerGain;s.daily[d].posts++;
      if(perf.score>s.analytics.bestPostScore){s.analytics.bestPostScore=perf.score;s.analytics.bestPostId=post.id}
      if(perf.spamPenalty<.65)pushNotice(s,'warning','Portée réduite','Tu as beaucoup publié aujourd’hui. L’audience réagit moins.','analytics',{dedupe:'spam-'+d+'-'+s.daily[d].posts});
      else pushNotice(s,'reaction','Publication en ligne',`+${perf.followerGain} abonnés · ${perf.likes} J’aime · portée ${perf.reach}`,'post',{postId:post.id});
    });
  }

  function story(mediaId,caption=''){
    return mutate(s=>{
      const media=s.media.find(m=>m.id===mediaId);if(!media)throw new Error('Média introuvable');
      const d=dayKey();s.daily[d]=s.daily[d]||{posts:0,stories:0,calls:0,likes:0};const perf=performance(s,media,'story');
      s.stories.unshift({id:nowId('story'),mediaId,caption:caption||media.caption,imageUrl:media.imageUrl||null,imageKey:media.imageKey,type:media.type,createdAt:gameIso(),day:Number(game()?.clock?.day||1),views:perf.reach,reactions:Math.max(0,Math.round(perf.likes*.15)),followerGain:perf.followerGain,archived:false});
      media.used=(media.used||0)+1;s.profile.followers+=perf.followerGain;s.profile.reach+=perf.reach;s.analytics.totalStories++;s.analytics.totalFollowerGain+=perf.followerGain;s.daily[d].stories++;
    });
  }

  function likeFeed(postId){return mutate(s=>{const p=s.feed.find(x=>x.id===postId);if(!p||p.liked)return;p.liked=true;p.likes=(p.likes||0)+1;const d=dayKey();s.daily[d]=s.daily[d]||{};s.daily[d].likes=(s.daily[d].likes||0)+1})}
  function saveFeed(postId){return mutate(s=>{if(!s.savedPosts.includes(postId))s.savedPosts.push(postId)})}
  function followAccount(handle){return mutate(s=>{if(!s.followedAccounts.includes(handle)){s.followedAccounts.push(handle);s.profile.following++;const p=s.feed.find(x=>x.handle===handle);if(p)p.followed=true}})}

  function callContact(name){
    return mutate(s=>{
      const g=game();if(!g||!name)return;const d=dayKey();const c=s.contacts[name]||(s.contacts[name]={name,lastCallDay:null});
      s.daily[d]=s.daily[d]||{calls:0};if(c.lastCallDay===d){pushNotice(s,'call','Appel terminé',`Tu as déjà pris des nouvelles de ${name} aujourd’hui. Pas de bonus supplémentaire.`,'contact',{dedupe:'call-repeat-'+d+'-'+name});return}
      c.lastCallDay=d;s.daily[d].calls=(s.daily[d].calls||0)+1;
      window.HCGame?.mutate?.(gs=>{const r=gs.relationships[name];if(r){r.affinity=(r.affinity||0)+1;r.trust=(r.trust||0)+1;r.history=r.history||[];r.history.push('Appel téléphonique')}});
      window.HCGame?.advanceTime?.(12,'Appel à '+name);
      pushNotice(s,'call','Appel terminé',`Ta relation avec ${name} s’est renforcée.`,'contact',{dedupe:'call-'+d+'-'+name});
    });
  }

  function resolveOpportunity(id,choice='accept'){
    return mutate(s=>{
      const o=s.opportunities.find(x=>x.id===id);if(!o||o.status!=='offered')return;
      o.status=choice==='decline'?'declined':'completed';o.resolvedAt=gameIso();
      if(choice==='decline')return;
      const r=o.reward||{};s.profile.followers+=Number(r.followers||0);s.analytics.totalFollowerGain+=Number(r.followers||0);
      if(r.media){for(let i=0;i<r.media;i++){const mid=id+'-media-'+i;if(!s.media.some(m=>m.id===mid))s.media.push({id:mid,packId:id,title:'Contenu collaboration '+(i+1),type:'look',caption:'Collaboration créative.',category:'collab',imageKey:mid,imageUrl:null,unlockedAt:gameIso(),used:0,favorite:false,source:'opportunity',free:true})}}
      if(Number(r.reputation||0)>0)window.HCGame?.addReputation?.(Number(r.reputation),'professional','Visibilité via le réseau social');
      pushNotice(s,'success','Opportunité terminée',`${o.from} · ton compte gagne en visibilité.`,'social',{dedupe:'done-'+id});
    });
  }

  function registerTravel(place){return mutate(s=>addVisitedIn(s,place))}
  function registerAtelierMedia(payload){return mutate(s=>{const id='atelier-export-'+(payload.id||hash(JSON.stringify(payload)));if(s.media.some(m=>m.id===id))return;s.media.push({id,packId:'atelier-export',title:payload.title||'Création Atelier',type:payload.type||'sketch',caption:payload.caption||'Création en cours.',category:'atelier',imageKey:id,imageUrl:payload.url||payload.imageUrl||null,unlockedAt:gameIso(),used:0,favorite:false,source:'atelier_export',free:true,meta:payload});pushNotice(s,'atelier','Nouveau contenu publiable',payload.title||'Création Atelier','media',{dedupe:'atelier-manual-'+id})})}
  function registerMediaPack(pack){if(!pack?.id||!Array.isArray(pack.items))return false;PACKS[pack.id]=pack;return true}
  function unlockPack(id,context){return mutate(s=>unlockPackIn(s,id,context))}
  function markNotificationRead(id){return mutate(s=>{const n=s.notifications.find(x=>x.id===id);if(n)n.read=true})}
  function unreadNotifications(s=load()){return s.notifications.filter(n=>!n.read).length}
  function snapshot(){return clone(load())}

  window.HCPhone={
    get:snapshot,mutate,availableMedia,getMedia,publish,story,likeFeed,saveFeed,followAccount,callContact,resolveOpportunity,
    registerTravel,registerAtelierMedia,registerMediaPack,unlockPack,markNotificationRead,unreadNotifications,sync:()=>mutate(()=>{}),storageKey:KEY,version:VERSION
  };

  // Keep triggers synchronized whenever the central game changes.
  window.addEventListener('hc-game-state',()=>{try{const s=read(KEY,null)||initial();bootstrap(s);syncFromGame(s);evaluate(s);write(s)}catch(e){console.warn('[HCPhone] sync failed',e)}});
  // Also listen for future modules without making them depend on this engine.
  window.addEventListener('hc-travel-visited',e=>{if(e.detail?.place)registerTravel(e.detail.place)});
  window.addEventListener('hc-atelier-media',e=>{if(e.detail)registerAtelierMedia(e.detail)});
  load();
})();