(function(){
  if(window.__HCCharacterCreatorV1)return;window.__HCCharacterCreatorV1=true;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const state={appearance:null,name:'',temperament:null,skill:null,knowledge:null,goal:null};
  const temperaments=[
    ['Poétique','Sensible aux détails, matières et finitions.'],
    ['Solaire','Spontanée, expressive, attirée par la couleur.'],
    ['Audacieuse','Prend des risques et assume des choix forts.'],
    ['Rigoureuse','Précise, structurée, attentive à la coupe.'],
    ['Intuitive','Crée au ressenti, suit les idées inattendues.'],
    ['Artisanale','Aime les gestes, matières et savoir-faire.']
  ];
  const skills=[
    ['Croquis','Imaginer rapidement une silhouette.'],['Couture','Assembler et retoucher proprement.'],['Couleurs','Créer des palettes fortes et cohérentes.'],['Styling','Composer des looks et raconter une allure.'],['Patronage','Construire les volumes et les formes.'],['Réseau','Créer des contacts et saisir les opportunités.']
  ];
  const knowledge=[
    ['Tissus','Reconnaître les matières et leurs usages.'],['Moodboards','Construire une direction visuelle claire.'],['Retouches','Corriger un tombé et ajuster une pièce.'],['Imprimés','Associer motifs, échelles et couleurs.'],['Vintage','Repérer, dater et transformer l’existant.'],['Image de marque','Comprendre identité, ton et cohérence visuelle.']
  ];
  const goals=[
    ['Haute couture','Maîtriser les finitions et les pièces d’exception.'],['Direction artistique','Construire une image forte et reconnaissable.'],['Patronage avancé','Devenir très solide techniquement.'],['Production','Comprendre coûts, délais et fabrication.'],['Business','Développer une activité viable.'],['Réseau mode','Se créer des opportunités et collaborations.']
  ];
  let step=0,visuals=[];

  function collectVisuals(){
    const cards=$$('#characters .hc-person');
    visuals=cards.map((card,i)=>{
      const img=$('.fig img',card),svg=$('.fig svg',card);
      return {id:card.dataset.id||('look-'+(i+1)),name:$('.tag strong',card)?.textContent||('Look '+(i+1)),html:img?`<img src="${img.src}" alt="">`:(svg?svg.outerHTML:'')};
    });
    while(visuals.length<15){
      const i=visuals.length+1;
      visuals.push({id:'look-'+i,name:'Look '+i,html:`<div class="hc-cc-placeholder"><span>${String(i).padStart(2,'0')}</span><small>VISUEL À VENIR</small></div>`});
    }
  }

  function css(){if($('#hcCharacterCreatorV1Styles'))return;const s=document.createElement('style');s.id='hcCharacterCreatorV1Styles';s.textContent=`
    #characters .hc-cast{background:radial-gradient(circle at 18% 12%,rgba(255,255,255,.95),transparent 25%),linear-gradient(135deg,#e8ded1,#f4ece2 58%,#dfd1c0)!important}
    #characters .hc-page{left:4%!important;right:4%!important;top:3%!important;bottom:4%!important;border-radius:26px!important;background:linear-gradient(180deg,#fffdf8,#faf4ea)!important;box-shadow:0 26px 70px rgba(68,48,34,.16)!important}
    #characters .hc-grid,#characters .hc-cast-head,#characters .hc-focus{display:none!important}
    .hc-cc{position:absolute;inset:0;z-index:50;pointer-events:auto;color:#343834;font-family:Arial,sans-serif}
    .hc-cc-shell{position:absolute;left:8%;right:8%;top:7%;bottom:7%;display:grid;grid-template-columns:minmax(0,1.35fr) minmax(300px,.65fr);gap:5%;align-items:stretch}
    .hc-cc-main{min-width:0;display:flex;flex-direction:column}
    .hc-cc-kicker{font:600 7px/1 Arial,sans-serif;letter-spacing:.24em;color:#a67660;text-transform:uppercase;margin-bottom:8px}
    .hc-cc h2{font:400 clamp(40px,4.6vw,70px)/.95 Georgia,serif;letter-spacing:-.045em;margin:0;color:#303530}
    .hc-cc-lead{font:400 10px/1.55 Arial,sans-serif;letter-spacing:.06em;color:#84766b;margin:10px 0 18px;max-width:680px}
    .hc-cc-progress{display:flex;gap:7px;margin:0 0 20px}.hc-cc-progress i{height:4px;flex:1;border-radius:99px;background:#eadfd2}.hc-cc-progress i.on{background:#9ba895}
    .hc-cc-stage{flex:1;min-height:0;overflow:auto;padding-right:6px}
    .hc-cc-step-title{font:400 24px/1.1 Georgia,serif;margin:0 0 5px;color:#494139}.hc-cc-step-sub{font:9px/1.45 Arial,sans-serif;color:#9a8a7d;margin-bottom:15px}
    .hc-cc-visuals{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
    .hc-cc-look,.hc-cc-choice{position:relative;border:1px solid rgba(116,88,66,.12);background:linear-gradient(180deg,#fffdfa,#f7eee3);border-radius:18px;cursor:pointer;transition:.18s;overflow:hidden}
    .hc-cc-look{aspect-ratio:.74;padding:0}.hc-cc-look:hover,.hc-cc-look.selected,.hc-cc-choice:hover,.hc-cc-choice.selected{transform:translateY(-3px);border-color:rgba(143,111,87,.34);box-shadow:0 13px 30px rgba(76,55,39,.09)}
    .hc-cc-look.selected:after{content:'✓';position:absolute;right:8px;top:8px;width:23px;height:23px;border-radius:50%;display:grid;place-items:center;background:#7d9078;color:#fff;font-size:12px}
    .hc-cc-look .art{position:absolute;inset:8px 8px 32px;border-radius:13px;overflow:hidden;background:radial-gradient(circle at 50% 34%,#fffdfa 0 36%,#f9efe4 72%,#f2e4d6 100%)}
    .hc-cc-look img,.hc-cc-look svg{width:100%;height:100%;object-fit:contain;object-position:50% 100%;display:block}.hc-cc-look b{position:absolute;left:0;right:0;bottom:9px;text-align:center;font:400 11px Georgia,serif;color:#62564d}
    .hc-cc-placeholder{width:100%;height:100%;display:grid;place-items:center;align-content:center;gap:5px;color:#c7b8a7}.hc-cc-placeholder span{font:32px Georgia,serif}.hc-cc-placeholder small{font:6px Arial,sans-serif;letter-spacing:.13em}
    .hc-cc-name{width:min(560px,100%);margin-top:18px}.hc-cc-name input{width:100%;border:0;border-bottom:1px solid rgba(89,69,52,.22);background:transparent;padding:13px 2px;font:400 34px Georgia,serif;color:#3d3935;outline:0}.hc-cc-name input::placeholder{color:#c8bbb0}
    .hc-cc-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.hc-cc-choice{padding:14px 15px;text-align:left}.hc-cc-choice b{display:block;font:400 17px Georgia,serif;color:#554b44;margin-bottom:5px}.hc-cc-choice span{font:8px/1.45 Arial,sans-serif;color:#8d8178}
    .hc-cc-side{border-left:1px solid rgba(108,84,64,.1);padding-left:9%;display:flex;flex-direction:column;min-width:0}.hc-cc-side small{font:600 6px Arial,sans-serif;letter-spacing:.18em;color:#a97b66}.hc-cc-preview{margin-top:14px;border-radius:24px;background:linear-gradient(180deg,#fffdf9,#f5eadf);border:1px solid rgba(102,78,59,.1);padding:16px;box-shadow:0 14px 36px rgba(70,50,36,.07)}
    .hc-cc-preview-art{height:260px;border-radius:17px;overflow:hidden;background:radial-gradient(circle at 50% 34%,#fffdfa 0 36%,#f9efe4 72%,#f2e4d6 100%)}.hc-cc-preview-art img,.hc-cc-preview-art svg{width:100%;height:100%;object-fit:contain;object-position:50% 100%}.hc-cc-preview h3{font:400 30px Georgia,serif;margin:13px 0 2px}.hc-cc-preview p{font:italic 12px Georgia,serif;color:#916b59;margin:0}.hc-cc-summary{display:grid;gap:7px;margin-top:15px}.hc-cc-summary div{padding-top:7px;border-top:1px solid rgba(104,82,62,.08)}.hc-cc-summary b{display:block;font:600 5.8px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#789075;margin-bottom:3px}.hc-cc-summary span{font:11px Georgia,serif;color:#5c544e}
    .hc-cc-actions{display:flex;gap:9px;margin-top:auto;padding-top:18px}.hc-cc-actions button{min-height:46px;border-radius:13px;border:1px solid rgba(98,77,59,.15);background:#fffaf3;padding:0 18px;font:11px Georgia,serif;cursor:pointer}.hc-cc-actions .next{margin-left:auto;background:#7c8f77;color:white;border:0;min-width:150px}.hc-cc-actions button:disabled{opacity:.35;cursor:not-allowed}
    .hc-cc-final{padding:20px;border-radius:20px;background:linear-gradient(145deg,#fffaf3,#f2e6d9);border:1px solid rgba(121,89,67,.08)}.hc-cc-final h3{font:400 34px Georgia,serif;margin:0 0 9px}.hc-cc-final p{font:13px/1.55 Georgia,serif;color:#62574e}
    @media(max-width:1000px){.hc-cc-shell{left:5%;right:5%;grid-template-columns:1fr .62fr;gap:3%}.hc-cc-visuals{grid-template-columns:repeat(4,1fr)}}
    @media(max-width:760px){.hc-cc-shell{inset:5% 5% 4%;display:block;overflow:auto}.hc-cc-side{border:0;padding:18px 0 0}.hc-cc-preview-art{height:210px}.hc-cc-visuals{grid-template-columns:repeat(3,1fr)}.hc-cc-choices{grid-template-columns:1fr}.hc-cc-actions{position:sticky;bottom:0;background:linear-gradient(transparent,#fffdf8 25%);padding-bottom:8px}.hc-cc h2{font-size:42px}}
  `;document.head.appendChild(s)}

  function currentLook(){return visuals.find(v=>v.id===state.appearance)||visuals[0]}
  function canNext(){if(step===0)return !!state.appearance;if(step===1)return state.name.trim().length>=2;if(step===2)return !!state.temperament;if(step===3)return !!state.skill;if(step===4)return !!state.knowledge;if(step===5)return !!state.goal;return true}
  function choiceGrid(items,key){return `<div class="hc-cc-choices">${items.map(([n,d])=>`<button class="hc-cc-choice ${state[key]===n?'selected':''}" data-pick="${key}" data-value="${n}"><b>${n}</b><span>${d}</span></button>`).join('')}</div>`}
  function stage(){
    if(step===0)return `<h3 class="hc-cc-step-title">Choisis ton apparence</h3><div class="hc-cc-step-sub">Le visuel change ton personnage, pas tes compétences. Tu pourras compléter la galerie ensuite.</div><div class="hc-cc-visuals">${visuals.map(v=>`<button class="hc-cc-look ${state.appearance===v.id?'selected':''}" data-look="${v.id}"><div class="art">${v.html}</div><b>${v.name}</b></button>`).join('')}</div>`;
    if(step===1)return `<h3 class="hc-cc-step-title">Comment s’appelle-t-elle ?</h3><div class="hc-cc-step-sub">Choisis librement son prénom. C’est ton personnage, pas un preset.</div><div class="hc-cc-name"><input id="hcCcName" maxlength="24" autocomplete="off" placeholder="Écris son prénom…" value="${state.name.replace(/"/g,'&quot;')}"></div>`;
    if(step===2)return `<h3 class="hc-cc-step-title">Choisis son tempérament</h3><div class="hc-cc-step-sub">Une seule dominante. Elle influencera le ton de certaines opportunités.</div>${choiceGrid(temperaments,'temperament')}`;
    if(step===3)return `<h3 class="hc-cc-step-title">Choisis sa compétence de départ</h3><div class="hc-cc-step-sub">Elle commence avec un vrai petit avantage dans un domaine.</div>${choiceGrid(skills,'skill')}`;
    if(step===4)return `<h3 class="hc-cc-step-title">Choisis une connaissance de départ</h3><div class="hc-cc-step-sub">Une base qu’elle possède déjà au lancement de la carrière.</div>${choiceGrid(knowledge,'knowledge')}`;
    if(step===5)return `<h3 class="hc-cc-step-title">Qu’est-ce qu’elle veut apprendre ?</h3><div class="hc-cc-step-sub">Cela donne une première direction à sa progression, sans l’enfermer.</div>${choiceGrid(goals,'goal')}`;
    return `<div class="hc-cc-final"><div class="hc-cc-kicker">PERSONNAGE PRÊT</div><h3>${state.name}</h3><p>${state.name} démarre avec un tempérament <b>${state.temperament.toLowerCase()}</b>, une première force en <b>${state.skill}</b> et des connaissances en <b>${state.knowledge}</b>. Son premier grand objectif sera de progresser en <b>${state.goal}</b>.</p><p>Ces choix donnent seulement ton point de départ : tout le reste se construira pendant la partie.</p></div>`;
  }
  function preview(){const v=currentLook();return `<small>TON PERSONNAGE</small><div class="hc-cc-preview"><div class="hc-cc-preview-art">${v?v.html:''}</div><h3>${state.name||'Ton prénom'}</h3><p>${state.temperament||'Ton tempérament'}</p><div class="hc-cc-summary"><div><b>Compétence</b><span>${state.skill||'À choisir'}</span></div><div><b>Connaissance</b><span>${state.knowledge||'À choisir'}</span></div><div><b>Objectif</b><span>${state.goal||'À choisir'}</span></div></div></div>`}
  function render(){
    const root=$('.hc-cc');if(!root)return;
    root.innerHTML=`<div class="hc-cc-shell"><main class="hc-cc-main"><div class="hc-cc-kicker">CRÉATION DE PERSONNAGE · ÉTAPE ${Math.min(step+1,7)} / 7</div><h2>${step<6?'Crée ton personnage':'Voici ton personnage'}</h2><p class="hc-cc-lead">Choisis son identité et son point de départ. Aucun profil n’est figé : sa carrière évoluera selon tes décisions.</p><div class="hc-cc-progress">${Array.from({length:7},(_,i)=>`<i class="${i<=step?'on':''}"></i>`).join('')}</div><section class="hc-cc-stage">${stage()}</section><div class="hc-cc-actions"><button data-back ${step===0?'disabled':''}>← Retour</button>${step<6?`<button class="next" data-next ${canNext()?'':'disabled'}>Continuer →</button>`:`<button class="next" data-finish>✦ Commencer ma carrière</button>`}</div></main><aside class="hc-cc-side">${preview()}</aside></div>`;
    const input=$('#hcCcName');if(input){input.focus();input.addEventListener('input',e=>{state.name=e.target.value;const n=$('.hc-cc-preview h3');if(n)n.textContent=state.name||'Ton prénom';const next=$('[data-next]');if(next)next.disabled=!canNext()})}
  }
  function saveAndStart(){
    const payload={...state,createdAt:Date.now()};
    try{localStorage.setItem('haute-couture-custom-character',JSON.stringify(payload));localStorage.setItem('haute-couture-character','custom');localStorage.setItem('haute-couture-selected-character','custom');localStorage.setItem('selectedCharacter','custom')}catch(e){}
    try{if(typeof window.displayScreen==='function'){window.displayScreen('location');return}}catch(e){}
  }
  function mount(){
    css();collectVisuals();const cast=$('#characters .hc-cast');if(!cast)return false;
    $$('.hc-ci-sheet').forEach(n=>n.remove());
    const old=$('.hc-cc',cast);if(old)old.remove();
    const app=document.createElement('div');app.className='hc-cc';cast.appendChild(app);render();return true;
  }
  function boot(){
    let n=0;(function wait(){if(mount())return;if(++n<160)setTimeout(wait,50)})();
    window.addEventListener('click',e=>{
      const look=e.target.closest?.('[data-look]');if(look){state.appearance=look.dataset.look;render();return}
      const pick=e.target.closest?.('[data-pick]');if(pick){state[pick.dataset.pick]=pick.dataset.value;render();return}
      if(e.target.closest?.('[data-next]')){if(!canNext())return;step=Math.min(6,step+1);render();return}
      if(e.target.closest?.('[data-back]')){step=Math.max(0,step-1);render();return}
      if(e.target.closest?.('[data-finish]'))saveAndStart();
    },true)
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
