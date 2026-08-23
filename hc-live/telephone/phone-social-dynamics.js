/* Social dynamics: local trends, NPC reactions, polls. No API, no credits. */
(function(){
'use strict';
if(!window.HCPhone||!window.HCGame)return;
const H=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return h};
const day=()=>Number(HCGame.get()?.clock?.day||1), now=()=>HCGame.get()?.clock?.iso||new Date().toISOString();
const trends=[
{id:'drape',label:'Drapé',tag:'#drape',types:['sketch','detail','finished']},{id:'ivoire',label:'Ivoire',tag:'#ivoire',types:['moodboard','look','finished']},{id:'tailoring',label:'Tailoring',tag:'#tailoring',types:['look','sketch','finished']},{id:'romance',label:'Romantique moderne',tag:'#romantique',types:['look','moodboard','detail']},{id:'denim',label:'Denim créatif',tag:'#denim',types:['look','detail','before_after']},{id:'craft',label:'Savoir-faire',tag:'#savoirfaire',types:['backstage','detail','finished']},{id:'street',label:'Street couture',tag:'#streetcouture',types:['travel','look','before_after']}
];
const npc={
'Inès':['J’adore 😭💛','Ça te ressemble tellement.','Le détail est trop beau ✨'],
'@lena.more':['Belle direction. Curieuse de voir la suite.','Le volume est intéressant 👀','Très mode.'],
'@studionacre':['Belle recherche de matière.','La construction est intéressante.','Direction très propre.'],
'@jadek.style':['Cette palette !!!','Je sauvegarde direct.','Le mood est parfait.'],
'@mode_locale':['À suivre.','Une jeune signature qui se précise.','Belle proposition visuelle.']
};
function sync(){HCPhone.mutate(s=>{s.socialDynamics=s.socialDynamics||{week:0,trends:[],polls:[],insights:{},cred:{creativity:0,proximity:0,credibility:0}};const week=Math.floor((day()-1)/7)+1;if(s.socialDynamics.week!==week){const a=trends[(H('w'+week)%trends.length)],b=trends[(H('x'+week)%trends.length)],c=trends[(H('y'+week)%trends.length)];s.socialDynamics.week=week;s.socialDynamics.trends=[a,b,c].filter((x,i,arr)=>arr.findIndex(y=>y.id===x.id)===i);s.notifications.unshift({id:'trend-'+week,type:'trend',title:'Nouvelles tendances',text:s.socialDynamics.trends.map(x=>x.label).join(' · '),at:now(),read:false})}})}
sync();
const original=HCPhone.publish.bind(HCPhone);
HCPhone.publish=function(mediaId,caption='',opts={}){const old=HCPhone.get(),media=HCPhone.getMedia(mediaId);original(mediaId,caption,opts);const fresh=HCPhone.get(),post=fresh.posts.find(p=>!old.posts.some(x=>x.id===p.id));if(!post||!media)return fresh;HCPhone.mutate(s=>{const p=s.posts.find(x=>x.id===post.id),d=s.socialDynamics,t=d.trends.find(x=>(x.types||[]).includes(media.type));if(t){const er=Math.max(3,Math.round(p.reach*.22)),ef=Math.max(1,Math.round(Math.max(1,p.followerGain)*.35));p.reach+=er;p.followerGain+=ef;p.trendBoost=t;s.profile.reach+=er;s.profile.followers+=ef;s.analytics.totalFollowerGain+=ef;d.cred.creativity++;s.notifications.unshift({id:'trend-hit-'+p.id,type:'trend',title:'Tendance repérée',text:`${t.label} · +${ef} abonnés`,at:now(),read:false})}const known=HCGame.get()?.relationships||{};Object.entries(npc).forEach(([author,lines],i)=>{if(author==='Inès'&&!known.Inès)return;if(H(post.id+author+day())%100<(author==='Inès'?68:author==='@mode_locale'?24:38)){p.comments=p.comments||[];p.comments.push({id:'npc-'+H(post.id+author),author,text:lines[H(mediaId+author)%lines.length],at:now(),npc:true});s.analytics.totalComments=(s.analytics.totalComments||0)+1;if(author==='Inès')d.cred.proximity++;if(author==='@studionacre'||author==='@mode_locale')d.cred.credibility++}}) });return HCPhone.get()};
HCPhone.createPoll=function(mediaId,question,options){options=(options||[]).map(String).map(x=>x.trim()).filter(Boolean).slice(0,4);if(options.length<2)throw new Error('Deux choix minimum');HCPhone.story(mediaId,question);HCPhone.mutate(s=>{const base=Math.max(20,Math.round((s.profile.followers||38)*.45)),vals=options.map((label,i)=>({label,votes:10+(H(question+label+i)%Math.max(12,base))})),total=vals.reduce((a,b)=>a+b.votes,0);vals.forEach(v=>v.percent=Math.round(v.votes/total*100));const win=vals.slice().sort((a,b)=>b.votes-a.votes)[0],poll={id:'poll-'+Date.now().toString(36),mediaId,question,options:vals,winner:win.label,day:day(),at:now()};s.socialDynamics.polls.unshift(poll);s.socialDynamics.insights[win.label]=(s.socialDynamics.insights[win.label]||0)+1;s.socialDynamics.cred.proximity++;s.notifications.unshift({id:'poll-'+poll.id,type:'poll',title:'Résultat du sondage',text:`${win.label} arrive en tête avec ${win.percent}%`,at:now(),read:false})});return HCPhone.get()};
HCPhone.currentTrends=()=>{sync();return HCPhone.get().socialDynamics?.trends||[]};
HCPhone.socialDynamics=()=>{sync();return HCPhone.get().socialDynamics};
window.addEventListener('hc-game-state',sync);
})();