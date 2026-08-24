/* Haute Couture Live — suggestions de contenus contextuelles.
   Posts et stories prêts à publier selon la journée, les lieux, missions, matières,
   portfolio et réputation. Les visuels viennent d'une banque raster locale/curatée. */
(function(){
'use strict';
const KEY='haute-couture-social-suggestions-v1';
const clean=s=>String(s||'').trim();
const hash=s=>{let h=0;for(const c of String(s||''))h=(h*31+c.charCodeAt(0))>>>0;return h};
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{published:{},dismissed:{}}}catch(e){return{published:{},dismissed:{}}}};
const save=x=>localStorage.setItem(KEY,JSON.stringify(x));
const game=()=>window.HCGame?.get?.()||{};
const social=()=>window.HCPhone?.get?.()||{};
const bank=()=>window.HCPhotoBank?.images||[];
function norm(s){return clean(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function photo(cat,key,place=''){
 const all=bank(),p=norm(place);
 let pool=[];
 if(p){
   const words=p.split(/\s+/).filter(x=>x.length>3);
   pool=all.filter(x=>{const hay=norm([x.location,...(x.tags||[])].join(' '));return words.some(w=>hay.includes(w))});
   if(/nimes|arene|amphitheatre|amphitheater/.test(p)){
     const arena=all.filter(x=>norm([x.location,...(x.tags||[])].join(' ')).match(/arena|arene|roman|amphitheatre|amphitheater/));
     if(arena.length)pool=arena;
   }
 }
 if(!pool.length)pool=all.filter(x=>x.cat===cat);
 if(!pool.length)pool=all;
 if(!pool.length)return null;
 return pool[hash(key)%pool.length].url;
}
function cleanPlace(x){return clean(x).replace(/^Découvrir\s+/i,'').replace(/^Visite\s*[-—:]?\s*/i,'')}
function latestDone(g){return (g.calendar||[]).filter(e=>e.status==='done').slice().sort((a,b)=>new Date(b.end||b.start)-new Date(a.end||a.start)).slice(0,10)}
function contexts(){
 const g=game(),day=Number(g.clock?.day||1),ctx=[];
 const visits=[...(g.flags?.visitedLocations||[])];
 latestDone(g).forEach(e=>{if(e.location&&!visits.includes(e.location))visits.push(e.location)});
 visits.slice(-6).reverse().forEach((place,i)=>ctx.push({kind:'visit',key:'visit:'+place,place:cleanPlace(place),weight:110-i}));
 latestDone(g).forEach((e,i)=>{const t=norm(e.title);if(/tissu|textile|mercerie|matiere|soie|dentelle|laine|coton|velours|lin/.test(t))ctx.push({kind:'fabric',key:'fabric:'+e.id,title:e.title,place:e.location,weight:102-i});else if(/atelier|croquis|coupe|couture|patron|essayage|drap|epingle|mannequin/.test(t))ctx.push({kind:'backstage',key:'back:'+e.id,title:e.title,place:e.location,weight:98-i})});
 (g.missions||[]).filter(m=>['accepted','in_progress'].includes(m.status)).slice(-3).forEach(m=>ctx.push({kind:'mission',key:'mission:'+m.id,title:m.title,client:m.client,weight:94}));
 (g.portfolio||[]).slice(-5).reverse().forEach((p,i)=>ctx.push({kind:'finished',key:'portfolio:'+p.id,title:p.name||p.title||p.type,client:p.client,weight:100-i}));
 if((g.player?.reputation||0)>=5)ctx.push({kind:'career',key:'career:'+Math.floor((g.player.reputation||0)/5),rep:g.player.reputation,weight:70});
 ctx.push({kind:'daily',key:'daily:'+day,day,weight:45});
 return ctx.sort((a,b)=>b.weight-a.weight)
}
function visitCopy(ctx,variant){
 const place=ctx.place||'la ville',n=norm(place);
 if(/nimes|arene/.test(n)){
   return [
    {title:`Les Arènes de Nîmes`,caption:`Aujourd’hui aux Arènes de Nîmes. Les arches, les répétitions de lignes et la pierre patinée… impossible de ne pas penser en volumes et en silhouettes.`,story:`Nîmes aujourd’hui 🤍 Des lignes partout.`,cat:'travel',type:'travel'},
    {title:`Textures de Nîmes`,caption:`Des détails des Arènes de Nîmes directement dans mon carnet d’inspirations : pierre, ombres, courbes et rythme.`,story:`Inspiration du jour : les Arènes ✨`,cat:'travel',type:'travel'},
    {title:`Carnet du Sud`,caption:`Une journée à Nîmes, entre patrimoine et idées de coupe. J’adore quand un lieu me donne immédiatement envie de dessiner.`,story:`Mood du jour · Nîmes`,cat:'lifestyle',type:'travel'}
   ][variant%3];
 }
 return [
  {title:`Aujourd’hui à ${place}`,caption:`Parenthèse à ${place}. J’adore observer les volumes, les matières et les détails partout où je passe. ✨`,story:`Aujourd’hui : ${place} 🤍`,cat:'lifestyle',type:'travel'},
  {title:`Détails de ${place}`,caption:`Quelques détails de ${place} qui finissent déjà dans mon carnet d’inspirations.`,story:`Inspiration du jour — ${place}`,cat:'street',type:'travel'},
  {title:`Carnet de voyage`,caption:`Une journée à ${place}, entre architecture, textures et idées de silhouettes.`,story:`Mood du jour 📍 ${place}`,cat:'lifestyle',type:'travel'}
 ][variant%3]
}
function copy(ctx,variant){
 if(ctx.kind==='visit')return visitCopy(ctx,variant);
 const maps={
 fabric:[
  {title:'Nouvelle matière repérée',caption:`Nouvelle obsession matière aujourd’hui. ${ctx.title||'Un textile'} qui donne déjà envie de tester de nouveaux volumes.`,story:'Nouveau tissu repéré 👀',cat:'fabric',type:'detail'},
  {title:'Détail textile',caption:'Zoom sur une matière qui pourrait complètement changer la direction d’un prochain look.',story:'Vous en feriez quoi ?',cat:'fabric',type:'detail'},
  {title:'Palette & matière',caption:'Je commence souvent par la matière. Le reste vient ensuite.',story:'Texture du jour 🤍',cat:'fabric',type:'moodboard'}
 ],
 backstage:[
  {title:'Coulisses atelier',caption:`Petit aperçu des coulisses : ${ctx.title||'recherche en cours'}. Les meilleures idées commencent souvent dans le désordre.`,story:'Backstage atelier ✂️',cat:'atelier',type:'backstage'},
  {title:'Work in progress',caption:'Entre essais, épingles et hésitations. Rien n’est figé tant que la silhouette ne tombe pas juste.',story:'Work in progress…',cat:'studio',type:'backstage'},
  {title:'Sur la table de travail',caption:'Aujourd’hui : mesurer, défaire, recommencer. C’est souvent là que la pièce devient vraiment intéressante.',story:'Sur la table aujourd’hui ✂️',cat:'atelier',type:'backstage'}
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
 contexts().forEach(ctx=>{
   const variants=ctx.kind==='visit'||ctx.kind==='fabric'||ctx.kind==='backstage'?3:2;
   for(let v=0;v<variants;v++){
    const c=copy(ctx,v),base=`${ctx.key}:${v}`;
    if(!mem.published[base]&&!mem.dismissed[base])out.push({id:base,context:ctx.kind,reason:reason(ctx),title:c.title,caption:c.caption,storyCaption:c.story,photo:photo(c.cat,base,ctx.place||''),category:c.cat,type:c.type,place:ctx.place||null,priority:ctx.weight-v});
   }
 });
 return out.sort((a,b)=>b.priority-a.priority).slice(0,15)
}
function reason(ctx){
 if(ctx.kind==='visit')return `Parce que tu as visité ${ctx.place}`;
 if(ctx.kind==='fabric')return 'Parce que tu as découvert une matière ou un textile';
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
  rep>=10?'Créatrice indépendante · pièces, clientes & inspirations du quotidien':'Entre atelier, tissus et idées de silhouettes.',
  'Fashion diary · atelier, détails, lieux & silhouettes',
  'Une vie de mode en construction — projets, clientes, voyages, matières.'
 ];
 const imgs=bank().filter(x=>['lifestyle','studio','atelier','street'].includes(x.cat)).slice(0,24);
 return {bios:[...new Set(bios)],avatars:imgs.map(x=>({url:x.url,credit:x.credit,id:x.id})),currentBio:p.bio||''}
}
function setBio(bio){HCPhone.mutate(s=>{s.profile=s.profile||{};s.profile.bio=String(bio||'').slice(0,150)})}
function setAvatar(url){HCPhone.mutate(s=>{s.profile=s.profile||{};s.profile.avatarUrl=url})}
window.HCSocialSuggestions={get:suggestions,publish,dismiss,profileIdeas,setBio,setAvatar,contexts};
window.addEventListener('hc-travel-visited',()=>window.dispatchEvent(new CustomEvent('hc-social-suggestions')));
window.addEventListener('hc-game-state',()=>window.dispatchEvent(new CustomEvent('hc-social-suggestions')));
window.addEventListener('hc-photo-bank-updated',()=>window.dispatchEvent(new CustomEvent('hc-social-suggestions')));
})();