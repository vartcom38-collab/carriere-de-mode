/* Career-aware social life. Adds new feed/activity beats as the game evolves. */
(function(){
'use strict';
const hash=s=>{let h=0;for(const c of String(s||''))h=(h*31+c.charCodeAt(0))>>>0;return h};
const now=()=>window.HCGame?.get?.()?.clock?.iso||new Date().toISOString();
function photo(seed){const bank=window.HCPhotoBank?.images||[];return bank.length?bank[hash(seed)%bank.length].url:null}
function addFeed(s,id,account,handle,caption,city,type='look'){
  if((s.feed||[]).some(x=>x.id===id))return;
  s.feed.unshift({id,account,handle,avatar:(account||'•')[0],type,caption,likes:38+(hash(id)%420),comments:3+(hash('c'+id)%35),followed:false,city:city||'',imageUrl:photo(id)});
}
function notice(s,id,title,text,type='career'){
  if((s.notifications||[]).some(n=>n.id===id))return;
  s.notifications.unshift({id,title,text,type,at:now(),read:false});
}
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
    s.feed=(s.feed||[]).slice(0,40);
    s.notifications=(s.notifications||[]).slice(0,90);
  });
}
let tries=0;const t=setInterval(()=>{tries++;if(window.HCPhone&&window.HCGame){clearInterval(t);sync()}else if(tries>100)clearInterval(t)},60);
window.addEventListener('hc-game-state',()=>setTimeout(sync,0));
window.addEventListener('hc-travel-visited',()=>setTimeout(sync,0));
})();