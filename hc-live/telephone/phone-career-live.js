/* Career-aware social life v2. Social visibility + specialty-driven professional network. */
(function(){
'use strict';
const ORDER_KEY='haute-couture-client-orders-v1';
const hash=s=>{let h=0;for(const c of String(s||''))h=(h*31+c.charCodeAt(0))>>>0;return h};
const now=()=>window.HCGame?.get?.()?.clock?.iso||new Date().toISOString();
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch(e){return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
const NETWORK={
 tailoring:{label:'Tailoring',templateId:'work',contacts:[['Ariane Delmas','Styliste personnelle'],['Hugo Vernet','Conseiller image'],['Maison Sorel','Studio de tailoring']]},
 bridal:{label:'Bridal',templateId:'bridal',contacts:[['Anaïs Ravel','Wedding planner'],['Louise Perrin','Photographe mariage'],['Maison Alba','Organisatrice de mariages']]},
 ceremonie:{label:'Cérémonie',templateId:'ceremony',contacts:[['Nina Fabre','Organisatrice événementielle'],['Émilie Cazal','Conseillère en image'],['Studio Éclat','Bureau événementiel']]},
 scene:{label:'Scène',templateId:'stage',contacts:[['Maya Soler','Directrice artistique'],['Gabriel Roux','Régisseur de tournée'],['Collectif Minuit','Production scénique']]},
 redCarpet:{label:'Red carpet',templateId:'festival',contacts:[['Léna Vasseur','Attachée de presse'],['Studio Mirabeau','Stylisme célébrités'],['Agence Halo','Relations talents']]},
 pageant:{label:'Pageant',templateId:'pageant',contacts:[['Sonia Vidal','Coach concours'],['Atelier Couronne','Direction de concours'],['Nora Blanc','Conseillère image scène']]},
 avantGarde:{label:'Avant-garde',templateId:'avantgarde',contacts:[['Léonie Artaud','Curatrice mode'],['Revue Forme','Équipe éditoriale'],['Bureau 17','Direction créative']]},
 upcycling:{label:'Upcycling',templateId:'upcycling',contacts:[['Milo Serra','Curateur textile'],['Atelier Reprise','Collectif circulaire'],['Jeanne Arnaud','Acheteuse responsable']]},
 editorial:{label:'Éditorial',templateId:'editorial',contacts:[['Jade K.','Styliste éditoriale'],['Studio Nacre','Direction photo'],['Ligne Claire','Magazine indépendant']]}
};
const FALLBACK_TEMPLATES={
 upcycling:{occasion:'Transformation / pièce seconde vie',garments:['Veste transformée','Robe reconstruite','Ensemble upcyclé'],styles:['inventif, précis et portable','créatif sans perdre la mémoire de la pièce'],materials:['matières existantes','chutes valorisées'],must:['transformation visible','finition propre'],avoid:['effet bricolage'],baseReward:300,minutes:330,days:6},
 editorial:{occasion:'Shooting éditorial',garments:['Silhouette éditoriale','Look image fort','Ensemble photographique'],styles:['graphique et photographique','lisible à l’image avec un détail signature'],materials:['crêpe','organza'],must:['impact photo','silhouette identifiable'],avoid:['effet banal'],baseReward:420,minutes:420,days:7}
};
function photo(seed){const bank=window.HCPhotoBank?.images||[];return bank.length?bank[hash(seed)%bank.length].url:null}
function addFeed(s,id,account,handle,caption,city,type='look'){
  if((s.feed||[]).some(x=>x.id===id))return;
  s.feed.unshift({id,account,handle,avatar:(account||'•')[0],type,caption,likes:38+(hash(id)%420),comments:3+(hash('c'+id)%35),followed:false,city:city||'',imageUrl:photo(id)});
}
function notice(s,id,title,text,type='career'){
  if((s.notifications||[]).some(n=>n.id===id))return;
  s.notifications.unshift({id,title,text,type,at:now(),read:false});
}
function networkContact(track,score){const n=NETWORK[track],idx=score>=10?2:score>=6?1:0;return n?n.contacts[idx]:null}
function makeReferralOrder(g,track,score,contact){
  const n=NETWORK[track];if(!n)return null;
  const orders=read(ORDER_KEY,[]),id=`network-${track}-${score>=10?'signature':score>=6?'established':'emerging'}`;
  if(orders.some(x=>x.id===id))return orders.find(x=>x.id===id);
  const engine=window.HCClientOrderEngine,template=engine?.templates?.find?.(x=>x.id===n.templateId)||FALLBACK_TEMPLATES[n.templateId]||null;
  if(!template&&n.templateId!=='work'&&n.templateId!=='ceremony'&&n.templateId!=='stage'&&n.templateId!=='bridal'&&n.templateId!=='festival'&&n.templateId!=='pageant'&&n.templateId!=='avantgarde')return null;
  const T=template||{
    occasion:n.label,garments:[`${n.label} — commande recommandée`],styles:['précis, personnel et cohérent avec ta signature'],materials:['matières adaptées'],must:['qualité','cohérence'],avoid:['effet générique'],baseReward:280,minutes:330,days:6
  };
  const seed=hash(id+(g.player?.city||'')),garments=T.garments||['Pièce sur mesure'],styles=T.styles||['personnel et maîtrisé'],materials=T.materials||['matière adaptée'],must=T.must||['finition nette','cohérence'],avoidIdeas=T.avoidIdeas||T.avoid||['solution trop générique'];
  const clientNames=['Camille Valette','Alix Morel','Lou Dumas','Salomé Perrier','Mina Caron','Zoé Rey'];
  const client=clientNames[seed%clientNames.length],base=Number(T.baseReward||280),premium=1+Math.min(.28,score*.018),reward=Math.round(base*premium/10)*10,budget=Math.round((reward*1.2+80)/10)*10;
  const d=new Date(g.clock?.iso||new Date());d.setDate(d.getDate()+Number(T.days||6));d.setHours(17,0,0,0);
  const o={id,generated:true,networkReferral:true,status:'offered',createdAt:now(),city:g.player?.city||'Nîmes',source:`Recommandation de ${contact[0]}`,referrer:{name:contact[0],role:contact[1]},clientId:'network-'+client.toLowerCase().replace(/[^a-z0-9]+/g,'-'),clientName:client,clientRole:'Cliente recommandée',clientTone:'professionnelle',fictional:true,deadline:d.toISOString(),occasion:T.occasion||n.label,garment:garments[seed%garments.length],budget,reward,difficulty:`Niveau ${Math.max(1,Math.min(4,Math.ceil(score/4)))}/4`,difficultyLevel:Math.max(1,Math.min(4,Math.ceil(score/4))),estimatedMinutes:Number(T.minutes||330),brief:{style:styles[seed%styles.length],paletteLiked:[],paletteAvoid:[],materialsPreferred:materials.slice(0,2),mustHave:must.slice(0,3),avoid:avoidIdeas.slice(0,2)},notes:`${contact[0]} t’a recommandée directement après avoir entendu parler de ton travail en ${n.label}. Cette commande n’est pas arrivée au hasard : elle vient de ton réseau professionnel.`,templateId:n.templateId,specialtyTrack:track,specialtyLabel:n.label,specialtyReputationAtOffer:score,careerLevelAtOffer:Number(g.player?.level||1)};
  orders.unshift(o);write(ORDER_KEY,orders.slice(0,250));window.dispatchEvent(new CustomEvent('hc-client-order',{detail:o}));return o;
}
function unlockNetworkBeat(g,track,score,threshold){
  const n=NETWORK[track],contact=networkContact(track,threshold);if(!n||!contact)return;
  const id=`network-${track}-${threshold}`;
  HCGame.mutate(gs=>{
    gs.flags=gs.flags||{};gs.flags.professionalNetworkLedger=gs.flags.professionalNetworkLedger||{};
    if(gs.flags.professionalNetworkLedger[id])return;
    gs.flags.professionalNetworkLedger[id]=gs.clock?.iso||now();
    gs.professionalNetwork=gs.professionalNetwork||[];
    if(!gs.professionalNetwork.some(x=>x.id===`${track}-${contact[0]}`))gs.professionalNetwork.push({id:`${track}-${contact[0]}`,name:contact[0],role:contact[1],specialty:track,specialtyLabel:n.label,metThrough:'réputation spécialisée',firstContactDay:gs.clock?.day||1,status:threshold>=10?'contact fort':threshold>=6?'contact professionnel':'nouveau contact'});
    gs.relationships=gs.relationships||{};
    if(!gs.relationships[contact[0]])gs.relationships[contact[0]]={affinity:0,trust:threshold>=10?12:threshold>=6?8:4,history:[`Contact obtenu grâce à ta réputation ${n.label}.`]};
    const text=threshold>=10?`Ton nom revient souvent en ${n.label}. ${contact[0]}, ${contact[1].toLowerCase()}, veut désormais te garder dans son carnet d’adresses pour des projets plus importants.`:threshold>=6?`${contact[0]}, ${contact[1].toLowerCase()}, a reçu ton nom par recommandation. Une cliente de son réseau cherche justement quelqu’un pour un projet en ${n.label}.`:`Ton travail en ${n.label} commence à circuler. ${contact[0]}, ${contact[1].toLowerCase()}, a demandé comment te joindre.`;
    gs.messages=gs.messages||[];if(!gs.messages.some(m=>m.id===id))gs.messages.unshift({id,from:contact[0],avatar:contact[0][0],subject:threshold>=6?'Une recommandation pour toi':'Ton nom circule',text,receivedAt:gs.clock?.iso||now(),read:false,action:null});
  });
  if(threshold>=6)makeReferralOrder(HCGame.get(),track,score,contact);
}
function syncProfessionalNetwork(g){const r=g.reputationTracks||{};for(const [track,n] of Object.entries(NETWORK)){const score=Math.max(0,Number(r[track]||0));if(score>=3)unlockNetworkBeat(g,track,score,3);if(score>=6)unlockNetworkBeat(g,track,score,6);if(score>=10)unlockNetworkBeat(g,track,score,10)}}
function sync(){
  if(!window.HCPhone||!window.HCGame)return;
  const g=HCGame.get();
  HCPhone.mutate(s=>{
    s.careerSocialLedger=s.careerSocialLedger||{};
    const once=(id,fn)=>{if(s.careerSocialLedger[id])return;s.careerSocialLedger[id]=now();fn()};
    const day=Number(g.clock?.day||1),rep=Number(g.player?.reputation||0),city=g.player?.city||'France';
    once('welcome-feed',()=>addFeed(s,'career-welcome','Mode Locale','@mode_locale','Nouveaux talents, ateliers indépendants et adresses à suivre cette semaine.',city,'moodboard'));
    const mission=(g.missions||[])[0];
    if(mission&&['offered','accepted','in_progress','completed'].includes(mission.status))once('mission-visible',()=>{addFeed(s,'career-client-eye','Studio Nacre','@studionacre','Les petits projets clients sont souvent ceux qui révèlent le plus une manière de travailler.',city,'detail');notice(s,'career-client-note','Ton activité commence à se voir','Des comptes créatifs repèrent davantage ton atelier.')});
    if(mission?.status==='completed')once('first-mission-complete',()=>{addFeed(s,'career-first-finish','Mode Locale','@mode_locale','Une première cliente satisfaite, et déjà une silhouette qui commence à raconter quelque chose.',city,'finished');notice(s,'career-first-finish-n','Ta première réalisation circule','Le réseau commence à associer ton nom à un vrai travail terminé.')});
    if((g.portfolio||[]).length>=1)once('portfolio-1',()=>addFeed(s,'career-portfolio-1','Jade K.','@jadek.style','Les profils que je sauvegarde en ce moment : petites signatures, belles matières, vrais détails.',city,'moodboard'));
    if(rep>=5)once('rep-5',()=>{addFeed(s,'career-rep5','Ligne Claire','@ligneclaire.mag','Cinq jeunes créatrices à regarder avant qu’elles ne deviennent impossibles à booker.',city,'look');notice(s,'career-rep5-n','Ton nom apparaît dans de nouvelles bulles','Ta réputation débloque maintenant des réactions plus professionnelles.')});
    if(rep>=12)once('rep-12',()=>addFeed(s,'career-rep12','Maison Émergente','@maisonemergente','Repérage de nouveaux ateliers pour nos prochains projets éditoriaux.',city,'finished'));
    const visits=(g.flags?.visitedLocations||[]).length;
    if(visits>=2)once('travel-2',()=>addFeed(s,'career-travel2','Carnet Mode','@carnetmode','Changer de ville, changer d’œil : détails de rue, vitrines et silhouettes aperçues en chemin.',city,'travel'));
    const dayId='ambient-day-'+day;
    if(day>=2)once(dayId,()=>{const accounts=[['Léna Morel','@lena.more'],['Studio Nacre','@studionacre'],['Jade K.','@jadek.style'],['Mode Locale','@mode_locale']];const [a,h]=accounts[hash(dayId)%accounts.length];const lines=['Backstage du jour : beaucoup d’essais, peu de certitudes, mais une bonne direction.','Repérages, matières et détails qui donnent envie de tout recommencer.','Aujourd’hui : silhouettes simples, belles textures et lumière naturelle.','Ce qu’on remarque en ce moment : les univers qui se construisent sans trop en faire.'];addFeed(s,dayId,a,h,lines[hash('l'+day)%lines.length],city,['backstage','detail','look','travel'][hash(day)%4])});
    s.feed=(s.feed||[]).slice(0,40);s.notifications=(s.notifications||[]).slice(0,90);
  });
  syncProfessionalNetwork(g);
}
let tries=0;const t=setInterval(()=>{tries++;if(window.HCPhone&&window.HCGame){clearInterval(t);sync()}else if(tries>100)clearInterval(t)},60);
window.addEventListener('hc-game-state',()=>setTimeout(sync,0));
window.addEventListener('hc-travel-visited',()=>setTimeout(sync,0));
window.addEventListener('hc-specialty-reputation',()=>setTimeout(sync,0));
})();