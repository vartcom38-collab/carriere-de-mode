/* Haute Couture Live — vie d'école approfondie : groupes, entraide, tensions, invitations et ambiance par année. */
(function(){
'use strict';
if(window.HCSchoolLifeDepth)return;
const KEY='haute-couture-school-life-depth-v1';
const COMMUNITY_KEY='haute-couture-school-community-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
const now=()=>new Date().toISOString();
function academic(){return window.HCSchoolAcademic?.state?.()||read('haute-couture-school-academic-v1',{year:1,week:1,day:1})||{year:1,week:1,day:1}}
function base(){return{version:1,groupProjects:{},requests:{},rivalries:{},invitations:{},moments:[],updatedAt:now()}}
function state(){const s=read(KEY,null)||base();s.version=1;s.groupProjects=s.groupProjects||{};s.requests=s.requests||{};s.rivalries=s.rivalries||{};s.invitations=s.invitations||{};s.moments=s.moments||[];return s}
function save(s){s.updatedAt=now();return write(KEY,s)}
function community(){return window.HCSchoolCommunity||null}
function communityState(){return community()?.state?.()||read(COMMUNITY_KEY,{relationships:{}})||{relationships:{}}}
function students(){return community()?.students||[]}
function hash(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function pick(list,salt){return list.length?list[hash(salt)%list.length]:null}
const moods={
 1:{title:'Année 1 · Tout le monde cherche encore sa place',text:'Les groupes bougent beaucoup. Les amitiés commencent, les comparaisons aussi. Les demandes d’aide sont souvent simples et concrètes. Les profs attendent surtout que Marion apprenne à regarder, tester et expliquer.',pressure:'curiosité + premières comparaisons'},
 2:{title:'Année 2 · Les habitudes et les tensions deviennent visibles',text:'Les affinités sont plus nettes, mais les groupes imposés cassent les habitudes. Les désaccords portent davantage sur les décisions de projet, les responsabilités et la manière de travailler.',pressure:'autonomie + responsabilités partagées'},
 3:{title:'Année 3 · La promo commence déjà à regarder vers l’après',text:'Les élèves s’entraident encore, mais chacun protège aussi son temps, son portfolio et ses priorités. Les discussions parlent davantage de stages, de candidatures, de spécialisation et de ce qu’on veut garder de l’école.',pressure:'affirmation + transition vers la carrière'}
};
function relation(id){return communityState().relationships?.[id]||{affinity:0,trust:0,met:false}}
function rankedStudents(){return students().map(p=>({p,r:relation(p.id)})).sort((a,b)=>(b.r.trust+b.r.affinity)-(a.r.trust+a.r.affinity))}
function ensureWeek(){
 const a=academic(),s=state(),key=`y${a.year}-w${a.week}`;
 if(!s.groupProjects[key]){
   const pool=students();
   const seed=`${key}|groups`;
   const ranked=pool.map((p,i)=>({p,k:hash(seed+'|'+p.id+'|'+i)})).sort((x,y)=>x.k-y.k).map(x=>x.p);
   const mode=(a.week%3===0)?'chosen':'assigned';
   let members;
   if(mode==='chosen'){
     const close=rankedStudents().filter(x=>x.r.met).slice(0,2).map(x=>x.p);
     const rest=ranked.filter(p=>!close.some(c=>c.id===p.id));members=[...close,...rest].slice(0,3);
   }else members=ranked.slice(0,3);
   s.groupProjects[key]={id:key,year:a.year,week:a.week,mode,members:members.map(p=>p.id),status:'active',decision:null,createdAt:now()};
 }
 const reqKey=`${key}-request`;
 if(!s.requests[reqKey]&&students().length){
   const candidate=pick(students(),reqKey);
   const asks={1:['relire sa présentation','l’aider à choisir entre deux essais','vérifier un montage avant rendu'],2:['l’aider à répartir un travail de groupe','regarder un prototype qui ne fonctionne pas','l’écouter préparer une critique difficile'],3:['relire l’ordre de son portfolio','faire un retour sur une candidature','l’aider à décider ce qu’il faut encore corriger avant un jury']};
   s.requests[reqKey]={id:reqKey,studentId:candidate.id,ask:pick(asks[a.year]||asks[1],reqKey+'ask'),status:'pending',createdAt:now()};
 }
 const invKey=`${key}-invite`;
 if(!s.invitations[invKey]&&a.week%4===0){
   const types=a.year===1?['café après les cours','petite expo étudiante','soirée tranquille après rendu']:a.year===2?['vernissage','conférence hors cours','soirée d’atelier']:['soirée portfolio','rencontre avec des anciens','dernier verre après une grosse semaine'];
   const host=pick(students(),invKey+'host');
   s.invitations[invKey]={id:invKey,studentId:host?.id||null,title:pick(types,invKey+'type'),status:'pending',createdAt:now()};
 }
 save(s);return {key,group:s.groupProjects[key],request:s.requests[reqKey],invite:s.invitations[invKey]};
}
function pushMoment(s,text,type,studentId){s.moments.unshift({id:'m-'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),at:now(),year:academic().year,week:academic().week,text,type,studentId:studentId||null});s.moments=s.moments.slice(0,120)}
function mutateRelation(id,affinity=0,trust=0,text=''){const c=community();if(!c)return;const cs=c.state(),r=cs.relationships[id];if(!r)return;r.met=true;r.affinity+=affinity;r.trust+=trust;if(text){r.history.unshift({at:now(),text});r.history=r.history.slice(0,25)}c.save(cs)}
function requestChoice(id,choice){const s=state(),r=s.requests[id];if(!r||r.status!=='pending')return;const p=students().find(x=>x.id===r.studentId);if(choice==='help'){r.status='helped';mutateRelation(r.studentId,2,2,'Marion a pris du temps pour aider sur une difficulté concrète.');pushMoment(s,`${p?.name||'Un camarade'} a demandé à Marion de ${r.ask}. Marion a accepté.`, 'help',r.studentId);window.HCGame?.advanceTime?.(45,'Vie d’école — entraide');}
else if(choice==='later'){r.status='later';mutateRelation(r.studentId,0,0,'Marion a expliqué qu’elle n’avait pas le temps immédiatement.');pushMoment(s,`Marion n’a pas pu aider ${p?.name||'ce camarade'} tout de suite, mais elle a répondu clairement.`, 'boundary',r.studentId);}
else {r.status='declined';mutateRelation(r.studentId,-1,0,'Marion a refusé une demande d’aide sans prolonger la discussion.');pushMoment(s,`Marion a refusé la demande de ${p?.name||'ce camarade'}.`, 'decline',r.studentId);}save(s);render()}
function groupChoice(key,choice){const s=state(),g=s.groupProjects[key];if(!g||g.status!=='active')return;g.decision=choice;g.status='decided';const names=g.members.map(id=>students().find(p=>p.id===id)?.name).filter(Boolean);if(choice==='lead'){g.members.forEach(id=>mutateRelation(id,1,1,'Marion a pris la coordination d’un travail de groupe.'));pushMoment(s,`Marion prend la coordination avec ${names.join(', ')}. Elle devra aussi écouter les objections.`, 'group');}
else if(choice==='mediate'){g.members.forEach(id=>mutateRelation(id,1,2,'Marion a aidé le groupe à clarifier les désaccords et responsabilités.'));pushMoment(s,`Marion choisit de clarifier les désaccords dans le groupe avec ${names.join(', ')}.`, 'group');}
else {g.members.forEach(id=>mutateRelation(id,1,0,'Marion a travaillé en autonomie dans un groupe sans chercher à prendre la direction.'));pushMoment(s,`Marion travaille sans prendre la direction du groupe avec ${names.join(', ')}.`, 'group');}window.HCGame?.advanceTime?.(30,'Vie d’école — groupe');save(s);render()}
function invitationChoice(id,choice){const s=state(),inv=s.invitations[id];if(!inv||inv.status!=='pending')return;const p=students().find(x=>x.id===inv.studentId);inv.status=choice==='go'?'attended':'declined';if(choice==='go'){if(inv.studentId)mutateRelation(inv.studentId,2,1,'Moment social partagé hors du cours.');pushMoment(s,`Marion va à ${inv.title}${p?' avec '+p.name:''}.`, 'social',inv.studentId);window.HCGame?.advanceTime?.(90,'Vie d’école — sortie');}else pushMoment(s,`Marion décline ${inv.title}. La vie sociale continue sans pénalité automatique.`, 'social-boundary',inv.studentId);save(s);render()}
function detectRivalry(){const a=academic(),s=state();if(a.year<1)return null;const key=`y${a.year}-rivalry`;if(s.rivalries[key])return s.rivalries[key];const candidates=students().filter(p=>relation(p.id).met);if(!candidates.length)return null;const p=pick(candidates,key);const triggers={1:'Vous vous comparez souvent sur les rendus, sans hostilité ouverte.',2:'Vos méthodes de travail s’opposent souvent et les critiques commencent à vous faire réagir.',3:'Vous visez parfois les mêmes opportunités, mais chacun garde sa trajectoire.'};s.rivalries[key]={id:key,studentId:p.id,intensity:'light',text:triggers[a.year],createdAt:now()};save(s);return s.rivalries[key]}
function currentMood(){return moods[Math.min(3,Math.max(1,Number(academic().year||1)))]}
function render(){
 const data=ensureWeek(),a=academic(),mood=currentMood(),rootId='hc-school-life-depth';let root=document.getElementById(rootId);const host=document.querySelector('#app')||document.querySelector('main')||document.body;if(!host)return;if(!root){root=document.createElement('section');root.id=rootId;root.className='card';host.appendChild(root)}
 const s=state(),g=data.group,req=data.request,inv=data.invite,rival=detectRivalry();const groupNames=(g.members||[]).map(id=>students().find(p=>p.id===id)?.name).filter(Boolean);const reqStudent=students().find(p=>p.id===req?.studentId);const invStudent=students().find(p=>p.id===inv?.studentId);const rivalStudent=students().find(p=>p.id===rival?.studentId);
 const groupBlock=`<div class="hcsld-block"><div class="hcsld-k">GROUPE ${g.mode==='assigned'?'IMPOSÉ':'CHOISI'}</div><h3>${groupNames.join(' · ')||'Groupe en formation'}</h3><p>${g.mode==='assigned'?'Le groupe ne dépend pas des affinités de Marion. Elle doit composer avec les méthodes des autres.':'Cette fois, les affinités existantes peuvent influencer le groupe, mais elles ne garantissent pas une collaboration facile.'}</p>${g.status==='active'?`<div class="hcsld-actions"><button data-group="${data.key}" data-choice="lead">Prendre la coordination</button><button data-group="${data.key}" data-choice="mediate">Clarifier les rôles</button><button data-group="${data.key}" data-choice="follow">Travailler sans diriger</button></div>`:`<div class="hcsld-done">Décision prise · ${g.decision}</div>`}</div>`;
 const reqBlock=req?`<div class="hcsld-block"><div class="hcsld-k">DEMANDE D’UN CAMARADE</div><h3>${reqStudent?.name||'Un camarade'} te demande de ${req.ask}</h3><p>Aider peut renforcer la relation mais consomme du temps. Refuser n’est pas automatiquement “méchant” : la manière dont Marion gère ses limites compte aussi.</p>${req.status==='pending'?`<div class="hcsld-actions"><button data-request="${req.id}" data-choice="help">Aider · 45 min</button><button data-request="${req.id}" data-choice="later">Dire que je verrai plus tard</button><button data-request="${req.id}" data-choice="decline">Refuser</button></div>`:`<div class="hcsld-done">Réponse enregistrée · ${req.status}</div>`}</div>`:'';
 const inviteBlock=inv?`<div class="hcsld-block"><div class="hcsld-k">INVITATION</div><h3>${inv.title}</h3><p>${invStudent?invStudent.name+' propose ce moment. ':''}Ce type de sortie nourrit la vie de promo, mais Marion n’a jamais besoin d’accepter toutes les invitations.</p>${inv.status==='pending'?`<div class="hcsld-actions"><button data-invite="${inv.id}" data-choice="go">Y aller · 1 h 30</button><button data-invite="${inv.id}" data-choice="skip">Décliner</button></div>`:`<div class="hcsld-done">${inv.status==='attended'?'Moment vécu':'Invitation déclinée'}</div>`}</div>`:'';
 const rivalBlock=rival?`<div class="hcsld-rival"><b>Rivalité légère · ${rivalStudent?.name||'un camarade'}</b><span>${rival.text}</span><small>Cette rivalité ne transforme pas la personne en antagoniste. Elle peut devenir émulation, tension passagère, amitié ou disparaître selon les interactions.</small></div>`:'';
 root.innerHTML=`<div class="hcsld-eye">VIE D’ÉCOLE · ANNÉE ${a.year}</div><h2>${mood.title}</h2><p class="hcsld-lead">${mood.text}</p><div class="hcsld-pressure">Ambiance pédagogique · ${mood.pressure}</div>${rivalBlock}<div class="hcsld-grid">${groupBlock}${reqBlock}${inviteBlock}</div>${s.moments.length?`<details class="hcsld-history"><summary>Moments récents de la vie d’école</summary>${s.moments.slice(0,6).map(x=>`<p>${x.text}</p>`).join('')}</details>`:''}`;
 if(!document.getElementById('hcsld-style')){const st=document.createElement('style');st.id='hcsld-style';st.textContent=`#hc-school-life-depth{margin:18px 0;padding:20px;border:1px solid #ded1c7;background:linear-gradient(180deg,#fffdf9,#f8f2ec);border-radius:18px}.hcsld-eye,.hcsld-k{font:900 9px Arial,sans-serif;letter-spacing:.14em;color:#916c59}.hcsld-lead{max-width:850px;font:13px/1.6 Georgia,serif;color:#685a52}.hcsld-pressure{display:inline-block;margin:8px 0 14px;padding:7px 10px;border-radius:999px;background:#efe6de;font:800 9px Arial,sans-serif}.hcsld-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:11px}.hcsld-block{border:1px solid #eaded5;background:white;border-radius:15px;padding:14px}.hcsld-block h3{font:18px Georgia,serif;margin:5px 0 7px}.hcsld-block p{font:12px/1.5 Georgia,serif;color:#74645a}.hcsld-actions{display:grid;gap:6px;margin-top:10px}.hcsld-actions button{border:1px solid #d7c9be;background:#f7f0ea;border-radius:10px;padding:9px 10px;text-align:left;font-size:10px;font-weight:900;cursor:pointer}.hcsld-done{margin-top:10px;padding:9px;border-radius:10px;background:#edf5f2;font:11px Georgia,serif}.hcsld-rival{margin:8px 0 14px;padding:12px 14px;border-left:3px solid #b7866d;background:#fbf5f0;font:12px/1.5 Georgia,serif}.hcsld-rival b,.hcsld-rival span,.hcsld-rival small{display:block}.hcsld-rival small{margin-top:5px;color:#7d6c62}.hcsld-history{margin-top:14px;font:12px/1.45 Georgia,serif}.hcsld-history summary{cursor:pointer;font-weight:700}.hcsld-history p{margin:7px 0}`;document.head.appendChild(st)}
 root.querySelectorAll('[data-request]').forEach(b=>b.onclick=()=>requestChoice(b.dataset.request,b.dataset.choice));root.querySelectorAll('[data-group]').forEach(b=>b.onclick=()=>groupChoice(b.dataset.group,b.dataset.choice));root.querySelectorAll('[data-invite]').forEach(b=>b.onclick=()=>invitationChoice(b.dataset.invite,b.dataset.choice));
}
function mount(){if(!community())return;render()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,80));else setTimeout(mount,80);
window.HCSchoolLifeDepth={version:1,state,ensureWeek,currentMood,requestChoice,groupChoice,invitationChoice,detectRivalry,render,mount,storageKey:KEY};
})();
