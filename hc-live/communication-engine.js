(function(){
  const KEY='haute-couture-game-state-v1';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const names=['Lina','Camille','Sofia','Jeanne','Alice','Noémie','Clémence','Sarah','Zoé','Élodie','Nina','Maëlle','Apolline','Ana','Lou','Eva'];
  const tones=['chaleureux','pressé','hésitant','direct','exigeant','enthousiaste'];
  const channels=['sms','email','voicemail'];
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
  function save(s){if(window.HauteCoutureCore)return HauteCoutureCore.save(s);localStorage.setItem(KEY,JSON.stringify(s));return s}
  function ensureComms(s){
    if(!s.communications)s.communications={threads:[],pending:[],history:[],unread:0,lastGeneratedDay:0};
    if(!s.communications.threads)s.communications.threads=[];
    if(!s.communications.pending)s.communications.pending=[];
    if(!s.communications.history)s.communications.history=[];
    if(typeof s.communications.unread!=='number')s.communications.unread=0;
    return s;
  }
  function makeChoice(id,label,tone,effects,nextText,nextSubject){return{id,label,tone,effects:effects||{},nextText,nextSubject};}
  function makeStarterMessage(s){
    const city=s.world.currentCity||'ta ville';
    return {id:'comm-start-'+s.world.day,channel:'voicemail',from:'Lucie',subject:'Une petite demande...',day:s.world.day,read:false,resolved:false,body:'Bonjour, c’est Lucie. Une amie m’a dit que tu faisais de la couture. J’ai une robe à reprendre assez vite pour samedi… Je ne sais pas si tu prends déjà des clientes, mais rappelle-moi quand tu peux.',choices:[
      makeChoice('yes','Oui, je peux regarder ça demain.','ouverte',{relationship:6,confidence:2,mission:'retouche'},'Super, merci ! Je passe demain avec la robe.','Rendez-vous confirmé'),
      makeChoice('negotiate','Je peux, mais il me faut connaître le délai et le budget.','pro',{relationship:2,professional:2,confidence:3,mission:'retouche-pro'},'Bien sûr. J’ai environ 60 € de budget et samedi est vraiment la limite.','Budget et délai précisés'),
      makeChoice('decline','Je préfère ne pas m’engager cette semaine.','prudente',{relationship:-1,stress:-3,confidence:1},'Je comprends, aucun souci. Je garde ton numéro pour une autre fois.','Pas cette fois')
    ]};
  }
  function generateMessage(s){
    ensureComms(s);
    const day=s.world.day||1;
    if(s.communications.lastGeneratedDay===day)return null;
    s.communications.lastGeneratedDay=day;
    const seed=(day*17+(s.contacts?.length||0)*11+(s.missions?.completed?.length||0)*7+(s.world.currentCity?.length||0));
    if(seed%3===0)return null;
    const channel=channels[seed%channels.length],name=names[seed%names.length],tone=tones[seed%tones.length];
    const kind=seed%6;
    let body,subject,choices;
    if(kind===0){subject='Une demande un peu urgente';body=`Bonjour, je m’appelle ${name}. On m’a donné ton contact pour une tenue à ajuster. J’en aurais besoin assez vite et je préfère être claire : le délai est serré.`;choices=[makeChoice('accept-fast','Je peux accepter, mais avec un supplément urgence.','ferme',{money:35,professional:2,stress:5,mission:'urgent'}),makeChoice('accept-normal','Je peux essayer sans supplément, mais je ne garantis rien.','souple',{relationship:3,stress:9,mission:'urgent-risk'}),makeChoice('refuse','Je préfère refuser plutôt que mal faire.','prudente',{professional:1,confidence:1})];}
    else if(kind===1){subject='Ton travail m’a été recommandé';body=`Bonjour, c’est ${name}. Une de tes clientes m’a parlé de toi. J’aimerais une pièce pour un événement, mais j’ai un budget limité. Est-ce qu’on peut trouver une solution ?`;choices=[makeChoice('adapt','Oui, on peut simplifier le modèle pour respecter ton budget.','empathique',{relationship:7,creative:1,mission:'budget'}),makeChoice('hold-price','Je préfère garder mon tarif et proposer moins de finitions.','pro',{professional:3,relationship:1,mission:'budget-pro'}),makeChoice('decline-budget','Je ne pourrai pas faire quelque chose de correct dans ce budget.','ferme',{professional:2,relationship:-2})];}
    else if(kind===2){subject='Un détail ne me rassure pas';body=`Bonsoir, c’est ${name}. J’ai repensé à notre projet et je suis un peu inquiète pour la coupe. Je veux être sûre qu’on se comprend avant que tu avances davantage.`;choices=[makeChoice('listen','Tu as raison, explique-moi ce qui t’inquiète.','écoute',{relationship:8,stress:2,confidence:1}),makeChoice('reassure','Je maîtrise, fais-moi confiance.','assurée',{confidence:4,relationship:-1}),makeChoice('meeting','On bloque un essayage supplémentaire.','pro',{relationship:5,professional:2,stress:4})];}
    else if(kind===3){subject='Une proposition inattendue';body=`Salut, ${name} ici. Je prépare un petit shooting local et je cherche quelqu’un pour prêter ou créer une pièce. Ce n’est pas très payé, mais il y aura des photos et du réseau.`;choices=[makeChoice('collab','J’accepte pour le portfolio et les rencontres.','ambitieuse',{creative:3,professional:2,stress:4,story:'shooting'}),makeChoice('paid','Je suis partante uniquement avec un minimum de rémunération.','ferme',{professional:4,relationship:1,money:25,story:'shooting-paid'}),makeChoice('no-collab','Je préfère me concentrer sur mes commandes payées.','prudente',{confidence:2,stress:-2})];}
    else if(kind===4){subject='Petit problème après livraison';body=`Bonjour, c’est ${name}. La pièce est très belle, mais en la portant hier j’ai remarqué qu’un détail me gêne. Je ne sais pas si c’est normal.`;choices=[makeChoice('fix-free','Passe, je te fais la correction sans frais.','service',{relationship:10,professional:2,stress:4}),makeChoice('inspect','On regarde ensemble d’abord, puis je te dis ce qui est possible.','pro',{relationship:4,professional:3}),makeChoice('charge','Je peux corriger, mais ce sera une nouvelle prestation.','ferme',{money:20,relationship:-4,professional:1})];}
    else {subject='Invitation de dernière minute';body=`Bonjour, ici ${name}. Une place vient de se libérer pour un petit événement créatif à ${s.world.currentCity||'proximité'}. Si tu veux venir, il faut me répondre aujourd’hui.`;choices=[makeChoice('go','J’y vais, même si ça bouscule ma journée.','curieuse',{creative:5,stress:5,story:'event'}),makeChoice('network','J’y vais surtout pour rencontrer du monde.','ambitieuse',{professional:4,relationship:2,story:'event-network'}),makeChoice('stay','Je reste à l’atelier : mes délais passent avant.','disciplinée',{professional:2,stress:-1})];}
    return {id:'comm-'+day+'-'+seed,channel,from:name,subject,day,read:false,resolved:false,tone,body,choices};
  }
  function applyEffects(s,msg,choice){
    const e=choice.effects||{};
    if(e.money)s.player.money+=e.money;
    if(e.stress)s.player.stress=clamp((s.player.stress||0)+e.stress,0,100);
    if(e.confidence)s.player.confidence=clamp((s.player.confidence||0)+e.confidence,0,100);
    if(e.professional)s.player.reputation.professional=(s.player.reputation.professional||0)+e.professional;
    if(e.creative)s.player.reputation.creative=(s.player.reputation.creative||0)+e.creative;
    let c=s.contacts.find(x=>x.name===msg.from);
    if(!c){c={id:'contact-'+msg.id,name:msg.from,kind:'contact',relationship:0,trust:0,referrals:0,status:'Nouveau contact',notes:[],metDay:s.world.day,lastInteractionDay:s.world.day};s.contacts.push(c)}
    if(e.relationship)c.relationship=clamp((c.relationship||0)+e.relationship,-100,100);
    c.lastInteractionDay=s.world.day;c.notes.push({day:s.world.day,text:'Échange : '+choice.label});
    c.status=c.relationship>=40?'Relation fidèle':c.relationship>=25?'Relation de confiance':c.relationship>=10?'Bon contact':c.relationship<0?'Relation fragile':'Nouveau contact';
    if(e.story){s.storyArcs=s.storyArcs||[];s.storyArcs.push({id:'arc-'+msg.id,kind:e.story,title:msg.subject,startedDay:s.world.day,status:'active',from:msg.from});}
    if(e.mission){
      const m={id:'comm-mission-'+msg.id,generated:true,kind:e.mission.includes('retouche')?'retouche':'commande',title:e.mission.includes('urgent')?'Commande urgente':'Commande issue d’un échange',clientId:c.id,client:msg.from,relationshipKind:'cliente',brief:msg.body,budget:55+(e.money||0),durationHours:e.mission.includes('urgent')?5:7,difficulty:e.mission.includes('urgent')?2:1,deadlineDays:e.mission.includes('urgent')?2:4,inspiration:'Échange, confiance et contraintes réelles',rewards:{money:80+(e.money||0),reputationLocal:2,relationship:6,skill:'Couture',skillXp:2}};
      if(!s.missions.available.some(x=>x.id===m.id)&&!s.missions.active.some(x=>x.id===m.id))s.missions.available.unshift(m);
    }
  }
  function answer(id,choiceId){const s=ensureComms(load());if(!s)return;const msg=s.communications.threads.find(x=>x.id===id);if(!msg||msg.resolved)return;const choice=msg.choices.find(x=>x.id===choiceId);if(!choice)return;msg.read=true;msg.resolved=true;msg.selectedChoice=choiceId;msg.answer=choice.label;msg.resolvedDay=s.world.day;applyEffects(s,msg,choice);s.communications.history.unshift({id:'hist-'+id,day:s.world.day,from:msg.from,subject:msg.subject,choice:choice.label});s.communications.unread=s.communications.threads.filter(x=>!x.read&&!x.resolved).length;if(choice.nextText){s.communications.threads.unshift({id:id+'-follow',channel:msg.channel,from:msg.from,subject:choice.nextSubject||'Réponse',day:s.world.day,read:false,resolved:true,body:choice.nextText,choices:[]});s.communications.unread++;}save(s);render();}
  function seed(){let s=load();if(!s)return;if(!s.communications||!s.communications.threads?.length){ensureComms(s);const first=makeStarterMessage(s);s.communications.threads.push(first);s.communications.unread=1;save(s)}}
  function onDay(){let s=ensureComms(load());if(!s)return;const msg=generateMessage(s);if(msg){s.communications.threads.unshift(msg);s.communications.unread=(s.communications.unread||0)+1;save(s)}}
  function inject(){if(document.getElementById('hcCommButton'))return;const dock=document.querySelector('#atelier .hub-docks');if(!dock)return;const b=document.createElement('button');b.className='hub-btn';b.id='hcCommButton';b.textContent='☎ Messages';b.onclick=open;dock.appendChild(b);const panel=document.createElement('aside');panel.id='hcCommPanel';panel.style.cssText='position:absolute;left:3%;top:5%;bottom:13%;width:min(42%,520px);z-index:20;background:rgba(255,252,245,.98);border:1px solid rgba(82,68,52,.24);border-radius:18px;box-shadow:0 20px 60px rgba(44,34,25,.22);padding:18px;overflow:auto;display:none';panel.innerHTML='<button id="hcCommClose" style="position:absolute;right:12px;top:8px;border:0;background:none;font-size:26px;cursor:pointer">×</button><div id="hcCommBody"></div>';document.querySelector('#atelier .atelier-room').appendChild(panel);document.getElementById('hcCommClose').onclick=()=>panel.style.display='none';render();}
  function icon(ch){return ch==='voicemail'?'☎ Répondeur':ch==='email'?'✉ Mail':'◉ Message';}
  function open(){const p=document.getElementById('hcCommPanel');if(p){p.style.display='block';render()}}
  function render(){const body=document.getElementById('hcCommBody');if(!body)return;let s=ensureComms(load());if(!s)return;const unread=s.communications.threads.filter(x=>!x.read&&!x.resolved).length;s.communications.unread=unread;const btn=document.getElementById('hcCommButton');if(btn)btn.textContent='☎ Messages'+(unread?' · '+unread:'');
    const html=s.communications.threads.map(m=>`<article style="border:1px solid rgba(82,68,52,.2);background:#fffdf8;border-radius:13px;padding:12px;margin:9px 0;${!m.read&&!m.resolved?'box-shadow:inset 3px 0 #879879':''}"><div style="font:11px Arial,sans-serif;color:#7a7167">${icon(m.channel)} · Jour ${m.day}${m.tone?' · ton '+esc(m.tone):''}</div><h3 style="font-size:17px;font-weight:400;margin:5px 0">${esc(m.from)} — ${esc(m.subject)}</h3><p style="font-size:13px;line-height:1.5">${esc(m.body)}</p>${m.resolved&&m.answer?`<div style="padding:8px 10px;background:#edf1e8;border-radius:10px;font-size:12px"><strong>Ta réponse :</strong> ${esc(m.answer)}</div>`:''}${!m.resolved&&m.choices?.length?`<div style="display:grid;gap:7px;margin-top:10px">${m.choices.map(c=>`<button onclick="window.HCAnswerComm('${m.id}','${c.id}')" style="text-align:left;border:1px solid rgba(82,68,52,.22);background:#fffaf4;border-radius:11px;padding:9px 10px;font:12px Georgia,serif;cursor:pointer">${esc(c.label)}</button>`).join('')}</div>`:''}</article>`).join('');
    body.innerHTML='<div style="font:11px Arial,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#748069">Téléphone · mails · répondeur</div><h2 style="font-size:29px;font-weight:400;margin:4px 0 8px">Mes échanges</h2><p style="font:12px/1.45 Arial,sans-serif;color:#776e64">Tes réponses ne sont pas décoratives : elles peuvent modifier relation, stress, réputation, argent, commandes et histoires futures.</p>'+html;
  }
  function install(){if(window.__HCCommsInstalled)return;window.__HCCommsInstalled=true;seed();inject();window.HCAnswerComm=answer;const core=window.HauteCoutureCore;if(core&&!core.__commsWrapped){core.__commsWrapped=true;const oldFinish=core.finishDay;core.finishDay=function(){const s=oldFinish();onDay();return load()||s};}setInterval(()=>{if(document.querySelector('#atelier .atelier-room'))inject()},500);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
