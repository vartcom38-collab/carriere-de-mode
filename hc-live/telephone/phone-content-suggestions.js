/* Haute Couture Live — suggestions de contenus contextuelles.
   Génère des posts/stories prêts à publier selon la journée de jeu, les lieux, missions,
   découvertes, portfolio et réputation. Aucun upload joueur, aucun appel IA. */
(function(){
'use strict';
const KEY='haute-couture-social-suggestions-v1';
const esc=s=>String(s||'').trim();
const hash=s=>{let h=0;for(const c of String(s||''))h=(h*31+c.charCodeAt(0))>>>0;return h};
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{published:{},dismissed:{}}}catch(e){return{published:{},dismissed:{}}}};
const save=x=>localStorage.setItem(KEY,JSON.stringify(x));
const game=()=>window.HCGame?.get?.()||{};
const social=()=>window.HCPhone?.get?.()||{};
const bank=()=>window.HCPhotoBank?.images||[];
function photo(cat,key){const all=bank(),f=all.filter(x=>x.cat===cat);const pool=f.length?f:all;if(!pool.length)return null;return pool[hash(key)%pool.length].url}
function cleanPlace(x){return esc(x).replace(/^Découvrir\s+/i,'').replace(/^Visite\s*[-—:]?\s*/i,'')}
function latestDone(g){return (g.calendar||[]).filter(e=>e.status==='done').slice().sort((a,b)=>new Date(b.end||b.start)-new Date(a.end||a.start)).slice(0,8)}
function contexts(){
 const g=game(),day=Number(g.clock?.day||1),ctx=[];
 const visits=[...(g.flags?.visitedLocations||[])];
 latestDone(g).forEach(e=>{if(e.location&&!visits.includes(e.location))visits.push(e.location)});
 visits.slice(-5).reverse().forEach((place,i)=>ctx.push({kind:'visit',key:'visit:'+place,place:cleanPlace(place),weight:100-i}));
 latestDone(g).forEach((e,i)=>{const t=String(e.title||'').toLowerCase();if(/tissu|textile|mercerie|matière|matiere|soie|dentelle|laine|coton/.test(t))ctx.push({kind:'fabric',key:'fabric:'+e.id,title:e.title,weight:95-i});else if(/atelier|croquis|coupe|couture|patron|essayage|drap/.test(t))ctx.push({kind:'backstage',key:'back:'+e.id,title:e.title,weight:90-i})});
 (g.missions||[]).filter(m=>['accepted','in_progress'].includes(m.status)).slice(-3).forEach(m=>ctx.push({kind:'mission',key:'mission:'+m.id,title:m.title,client:m.client,weight:88}));
 (g.portfolio||[]).slice(-4).reverse().forEach((p,i)=>ctx.push({kind:'finished',key:'portfolio:'+p.id,title:p.name||p.title||p.type,client:p.client,weight:92-i}));
 if((g.player?.reputation||0)>=5)ctx.push({kind:'career',key:'career:'+Math.floor((g.player.reputation||0)/5),rep:g.player.reputation,weight:65});
 ctx.push({kind:'daily',key:'daily:'+day,day,weight:40});
 return ctx.sort((a,b)=>b.weight-a.weight)
}
function copy(ctx,variant){
 const place=ctx.place||'la ville';
 const maps={
 visit:[
  {title:`Aujourd’hui à ${place}`,caption:`Parenthèse à ${place}. J’adore observer les volumes, les matières et les détails partout où je passe. ✨`,story:`Aujourd’hui : ${place} 🤍`,cat:'lifestyle',type:'travel'},
  {title:`Détails de ${place}`,caption:`Quelques détails de ${place} qui finissent déjà dans mon carnet d’inspirations.`,story:`Inspiration du jour — ${place}`,cat:'street',type:'travel'},
  {title:`Carnet de voyage`,caption:`Une journée à ${place}, entre architecture, textures et idées de silhouettes.`,story:`Mood du jour 📍 ${place}`,cat:'lifestyle',type:'travel'}
 ],
 fabric:[
  {title:'Nouvelle matière repérée',caption:`Nouvelle obsession matière aujourd’hui. ${ctx.title||'Un textile'} qui donne déjà envie de tester de nouveaux volumes.`,story:'Nouveau tissu repéré 👀',cat:'fabric',type:'detail'},
  {title:'Détail textile',caption:'Zoom sur une matière qui pourrait complètement changer la direction d’un prochain look.',story:'Vous en feriez quoi ?',cat:'atelier',type:'detail'}
 ],
 backstage:[
  {title:'Coulisses atelier',caption:`Petit aperçu des coulisses : ${ctx.title||'recherche en cours'}. Les meilleures idées commencent souvent dans le désordre.`,story:'Backstage atelier ✂️',cat:'atelier',type:'backstage'},
  {title:'Work in progress',caption:'Entre essais, épingles et hésitations. Rien n’est figé tant que la silhouette ne tombe pas juste.',story:'Work in progress…',cat:'studio',type:'backstage'}
 ],
 mission:[
  {title:`Projet en cours${ctx.client?' · '+ctx.client:''}`,caption:`Projet en cours : ${ctx.title||'nouvelle pièce'}. Je garde encore quelques détails secrets, mais ça avance.`,story:'Projet cliente en cours ✨',cat:'atelier',type:'backstage'},
  {title:'Essayages & ajustements',caption:'Le moment où quelques millimètres changent toute une silhouette.',story:'Essayages aujourd’hui',cat:'studio',type:'backstage'}
 ],
 finished:[
  {title:'Projet terminé',caption:`Projet terminé : ${ctx.title||'nouvelle création'}. Toujours ce petit moment étrange entre fierté et envie de recommencer immédiatement.`,story:'Final look ✨',cat:'studio',type:'finished'},
  {title:'Détails finaux',caption:'Les finitions sont souvent les choses qu’on remarque le moins… et celles auxquelles je pense le plus.',story:'Les détails 🤍',cat:'atelier',type:'finished'}
 ],
 career:[
  {title:'Petit cap',caption:'Je commence doucement à voir mon univers prendre forme. Merci à celles et ceux qui suivent les coulisses depuis le début. 🤍',story:'Petit cap aujourd’hui ✨',cat:'lifestyle',type:'milestone'}
 ],
 daily:[
  {title:'Carnet du jour',caption:'Quelques images, quelques notes, et beaucoup trop d’idées à tester.',story:'Mood du jour',cat:'lifestyle',type:'moodboard'},
  {title:'Dans mon carnet',caption:'Un mélange de détails, de matières et de silhouettes qui tournent dans ma tête aujourd’hui.',story:'Inspi du jour ✍️',cat:'atelier',type:'moodboard'}
 ]
 };
 const arr=maps[ctx.kind]||maps.daily;return arr[variant%arr.length]
}
function suggestions(){
 const mem=read(),out=[];
 contexts().forEach((ctx,ci)=>{
   for(let v=0;v<2;v++){
    const c=copy(ctx,v),base=`${ctx.key}:${v}`;
    if(!mem.published[base]&&!mem.dismissed[base])out.push({id:base,context:ctx.kind,reason:reason(ctx),title:c.title,caption:c.caption,storyCaption:c.story,photo:photo(c.cat,base),category:c.cat,type:c.type,place:ctx.place||null,priority:ctx.weight-v});
   }
 });
 return out.sort((a,b)=>b.priority-a.priority).slice(0,12)
}
function reason(ctx){
 if(ctx.kind==='visit')return `Parce que tu as visité ${ctx.place}`;
 if(ctx.kind==='fabric')return 'Parce que tu as découvert une matière / un textile';
 if(ctx.kind==='backstage')return 'Parce que tu as travaillé sur une étape créative';
 if(ctx.kind==='mission')return `Parce que tu as un projet${ctx.client?' avec '+ctx.client:''} en cours`;
 if(ctx.kind==='finished')return 'Parce qu’une création vient d’entrer dans ton portfolio';
 if(ctx.kind==='career')return 'Parce que ta visibilité progresse';
 return 'Suggestion légère pour aujourd’hui'
}
function ensureMedia(sug){
 const id='suggest-'+hash(sug.id).toString(36),s=social();
 if((s.media||[]).some(m=>m.id===id))return id;
 HCPhone.mutate(st=>{st.media=st.media||[];st.media.push({id,packId:'contextual-suggestions',title:sug.title,type:sug.type||'lifestyle',caption:sug.caption,category:sug.category||'lifestyle',imageKey:id,imageUrl:sug.photo,city:sug.place||game().player?.city||null,unlockedAt:game().clock?.iso||new Date().toISOString(),used:0,favorite:false,source:'contextual_suggestion',free:true})});
 return id
}
function publish(id,mode='post'){
 const sug=suggestions().find(x=>x.id===id);if(!sug)return null;
 const mediaId=ensureMedia(sug);
 if(mode==='story')HCPhone.story(mediaId,sug.storyCaption||sug.caption);else HCPhone.publish(mediaId,sug.caption);
 const mem=read();mem.published[id]={mode,at:game().clock?.iso||new Date().toISOString()};save(mem);
 return HCPhone.get()
}
function dismiss(id){const m=read();m.dismissed[id]=true;save(m)}
function profileIdeas(){
 const g=game(),p=social().profile||{},visits=g.flags?.visitedLocations||[],rep=g.player?.reputation||0,portfolio=(g.portfolio||[]).length;
 const bios=[
  'Créatrice de mode · croquis, matières & coulisses ✂️',
  `${g.player?.city||'France'} · création, silhouettes & détails`,
  portfolio?`${portfolio} projet${portfolio>1?'s':''} au portfolio · atelier & vraie vie de mode`:'Je construis mon vestiaire, une pièce après l’autre.',
  visits.length?`Mode, atelier & carnets de voyage · ${visits.slice(-2).join(' · ')}`:'Journal visuel d’une jeune créatrice.',
  rep>=10?'Créatrice indépendante · pièces, clientes & inspirations du quotidien':'Entre atelier, tissus et idées de silhouettes.'
 ];
 const imgs=bank().filter(x=>['lifestyle','studio','atelier'].includes(x.cat)).slice(0,18);
 return {bios:[...new Set(bios)],avatars:imgs.map(x=>({url:x.url,credit:x.credit,id:x.id})),currentBio:p.bio||''}
}
function setBio(bio){HCPhone.mutate(s=>{s.profile=s.profile||{};s.profile.bio=String(bio||'').slice(0,150)})}
function setAvatar(url){HCPhone.mutate(s=>{s.profile=s.profile||{};s.profile.avatarUrl=url})}
window.HCSocialSuggestions={get:suggestions,publish,dismiss,profileIdeas,setBio,setAvatar,contexts};
window.addEventListener('hc-travel-visited',()=>window.dispatchEvent(new CustomEvent('hc-social-suggestions')));
window.addEventListener('hc-game-state',()=>window.dispatchEvent(new CustomEvent('hc-social-suggestions')));
})();