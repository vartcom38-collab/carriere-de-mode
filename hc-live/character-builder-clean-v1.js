(function(){
  if(window.__HCCharacterBuilderCleanV1)return;
  window.__HCCharacterBuilderCleanV1=true;
  const panel=document.getElementById('characters');
  if(!panel)return;

  const state={step:0,appearance:'look-01',name:'',temperament:'',skill:'',knowledge:'',goal:''};
  const looks=[
    {id:'look-01',src:'./ines-official.webp'},
    {id:'look-02',src:'./ines-transparent.webp'},
    ...Array.from({length:10},(_,i)=>({id:'look-'+String(i+3).padStart(2,'0'),src:''}))
  ];
  const temperaments=[['Solaire','Spontanée, expressive et attirée par la couleur.'],['Élégante','Raffinée, attentive aux détails et à l’allure.'],['Audacieuse','Aime les choix forts et les idées qui détonnent.'],['Créative','Transforme facilement une idée en univers.'],['Déterminée','Avance avec méthode et ambition.'],['Intuitive','Suit son regard et les rencontres inattendues.']];
  const skills=[['Croquis','Imaginer rapidement une silhouette.'],['Couture','Assembler et retoucher proprement.'],['Couleurs','Créer des palettes fortes et cohérentes.'],['Styling','Composer des looks et raconter une allure.'],['Patronage','Construire volumes et formes.'],['Réseau','Créer des contacts et saisir les opportunités.']];
  const knowledges=[['Tissus','Reconnaître les matières et leurs usages.'],['Moodboards','Construire une direction visuelle claire.'],['Retouches','Corriger un tombé et ajuster une pièce.'],['Imprimés','Associer motifs, échelles et couleurs.'],['Vintage','Repérer et transformer l’existant.'],['Image de marque','Comprendre identité et cohérence visuelle.']];
  const goals=[['Haute couture','Maîtriser les finitions et les pièces d’exception.'],['Direction artistique','Construire une image forte et reconnaissable.'],['Patronage avancé','Devenir très solide techniquement.'],['Production','Comprendre coûts, délais et fabrication.'],['Business','Développer une activité viable.'],['Réseau mode','Multiplier les opportunités et collaborations.']];
  const esc=v=>String(v??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));

  panel.innerHTML='';
  panel.style.background='#fffaf4';
  panel.style.overflow='auto';

  const style=document.createElement('style');
  style.id='hcCharacterBuilderCleanV1Styles';
  style.textContent=`
    #characters{background:#fffaf4!important;overflow:auto!important}
    #hc-character-builder{min-height:100%;background:radial-gradient(circle at 15% 5%,#fff 0 13%,transparent 29%),linear-gradient(135deg,#fffaf4,#f8eee4 58%,#f2e2d5);color:#211d1a;font-family:Arial,sans-serif;padding:30px 48px 130px;position:relative}
    .hcb-top{display:flex;justify-content:space-between;align-items:flex-start;gap:20px}.hcb-brand{font:900 19px/.9 Arial;letter-spacing:.16em}.hcb-brand small{display:block;color:#e66d56;font-size:9px;letter-spacing:.3em;margin-top:6px}.hcb-home{border:1px solid #dfcfc4;background:#fffaf4;border-radius:999px;padding:11px 16px;font:14px Georgia;cursor:pointer}
    .hcb-grid{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(330px,.72fr);gap:34px;margin-top:18px}.hcb-main{min-width:0}.hcb-badge{display:inline-block;border:1px solid #e4aa91;border-radius:999px;padding:7px 13px;font:700 10px Arial;letter-spacing:.08em}.hcb-title{margin:12px 0 0;font:900 clamp(48px,5vw,80px)/.9 Arial;letter-spacing:-.055em;text-transform:uppercase}.hcb-title em{font:italic 400 clamp(50px,5.3vw,84px)/.9 Georgia;color:#df6b54;text-transform:none;margin-left:8px}.hcb-intro{font:15px/1.55 Arial;color:#4d4641;margin:15px 0 24px}.hcb-ink{display:inline-block;background:#20201e;color:#fff;padding:8px 16px;border-radius:999px;font:800 13px Arial;letter-spacing:.04em}.hcb-stage h3{font:400 30px Georgia;margin:14px 0 5px}.hcb-sub{font:12px/1.5 Arial;color:#887c73;margin-bottom:15px}
    .hcb-gallery{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:11px}.hcb-look{position:relative;aspect-ratio:.72;border:1px solid #e7d7cb;border-radius:18px;background:#fffaf4;padding:7px;overflow:hidden;cursor:pointer;transition:.18s}.hcb-look:hover{transform:translateY(-3px)}.hcb-look.sel{border:2px solid #ef745d;box-shadow:0 12px 26px rgba(201,103,79,.18)}.hcb-look.sel:after{content:'✓';position:absolute;right:8px;top:8px;width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:#ef745d;color:white;font:bold 15px Arial}.hcb-art{width:100%;height:100%;border-radius:12px;overflow:hidden;background:radial-gradient(circle at 50% 34%,#fffdfa 0 36%,#f9efe4 72%,#f2e4d6 100%);display:grid;place-items:center}.hcb-art img{width:100%;height:100%;object-fit:contain;object-position:50% 100%;display:block}.hcb-empty{text-align:center;color:#bca999}.hcb-empty b{display:block;font:31px Georgia}.hcb-empty span{font:700 7px Arial;letter-spacing:.12em}
    .hcb-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;max-width:780px}.hcb-choice{padding:16px;text-align:left;border:1px solid #e6d8cd;border-radius:16px;background:#fffaf4;cursor:pointer;transition:.16s}.hcb-choice:hover{transform:translateY(-2px)}.hcb-choice.sel{border-color:#e27b64;background:#fff1e9}.hcb-choice b{display:block;font:20px Georgia;margin-bottom:5px}.hcb-choice span{font:12px/1.45 Arial;color:#776d66}.hcb-name input{width:min(620px,100%);border:0;border-bottom:2px solid #e2b49f;background:transparent;padding:12px 1px;font:46px Georgia;outline:0;color:#2d2723}
    .hcb-side{position:sticky;top:20px;align-self:start;background:#fffaf4;border:1px solid #ead8cd;border-radius:24px;padding:18px 20px 22px;box-shadow:0 16px 42px rgba(73,47,31,.10)}.hcb-preview-label{display:inline-block;background:#20201e;color:#fff;border-radius:999px;padding:7px 14px;font:800 11px Arial}.hcb-preview{height:370px;margin:14px 0 10px;border-radius:16px;overflow:hidden;background:linear-gradient(180deg,#fff8ef,#f3dfcf);display:grid;place-items:center}.hcb-preview img{width:100%;height:100%;object-fit:contain;object-position:50% 100%}.hcb-side h3{font:38px Georgia;margin:8px 0 2px}.hcb-vibe{font:italic 30px Georgia;color:#ad755d;margin-bottom:12px}.hcb-summary{display:grid;gap:7px}.hcb-summary div{border-top:1px solid #e8d9cf;padding-top:7px}.hcb-summary b{display:block;font:700 8px Arial;letter-spacing:.12em;text-transform:uppercase}.hcb-summary span{font:13px Georgia;color:#5c524b}
    .hcb-bottom{position:fixed;left:4.5%;right:4.5%;bottom:16px;z-index:99999;display:grid;grid-template-columns:1fr 320px;gap:24px;align-items:center;background:rgba(255,250,244,.97);border:1px solid #e6d4c8;border-radius:24px;padding:12px 18px;box-shadow:0 15px 38px rgba(72,48,31,.11);backdrop-filter:blur(10px)}.hcb-steps{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}.hcb-step{height:5px;border-radius:99px;background:#eadfd5}.hcb-step.on{background:#e96f58}.hcb-actions{display:flex;gap:8px}.hcb-actions button{height:56px;border-radius:999px;padding:0 18px;border:1px solid #ddcec2;background:#fffaf4;font:13px Georgia;cursor:pointer}.hcb-actions .next{flex:1;background:#171717;color:#fff;border:0;font:700 14px Arial;letter-spacing:.06em}.hcb-actions button:disabled{opacity:.3;cursor:not-allowed}.hcb-final{max-width:760px;padding:20px;border-radius:20px;background:#fff4eb;border:1px solid #ead7ca}.hcb-final h3{font:40px Georgia;margin:10px 0}.hcb-final p{font:14px/1.6 Georgia;color:#5e544d}
    @media(max-width:1100px){#hc-character-builder{padding-left:34px;padding-right:34px}.hcb-grid{grid-template-columns:1fr 330px}.hcb-gallery{grid-template-columns:repeat(4,1fr)}}
    @media(max-width:800px){#hc-character-builder{padding:80px 18px 150px}.hcb-grid{display:block}.hcb-side{position:relative;margin-top:24px}.hcb-gallery{grid-template-columns:repeat(3,1fr)}.hcb-choices{grid-template-columns:1fr}.hcb-bottom{left:10px;right:10px;grid-template-columns:1fr 190px}.hcb-title{font-size:43px}.hcb-title em{font-size:46px}.hcb-preview{height:300px}}
  `;
  document.head.appendChild(style);

  const root=document.createElement('section');
  root.id='hc-character-builder';
  panel.appendChild(root);

  function current(){return looks.find(x=>x.id===state.appearance)||looks[0]}
  function valid(){return [!!state.appearance,state.name.trim().length>=2,!!state.temperament,!!state.skill,!!state.knowledge,!!state.goal,true][state.step]}
  function choices(items,key){return `<div class="hcb-choices">${items.map(([n,d])=>`<button class="hcb-choice ${state[key]===n?'sel':''}" data-k="${key}" data-v="${esc(n)}"><b>${esc(n)}</b><span>${esc(d)}</span></button>`).join('')}</div>`}
  function stage(){
    if(state.step===0)return `<span class="hcb-ink">1. CHOISIS TON APPARENCE</span><h3>Choisis le look qui te ressemble le plus</h3><div class="hcb-sub">Ici, aucune identité n’est imposée : tu choisis seulement une image.</div><div class="hcb-gallery">${looks.map((v,i)=>`<button class="hcb-look ${state.appearance===v.id?'sel':''}" data-look="${v.id}"><div class="hcb-art">${v.src?`<img src="${v.src}" alt="">`:`<div class="hcb-empty"><b>${String(i+1).padStart(2,'0')}</b><span>VISUEL À VENIR</span></div>`}</div></button>`).join('')}</div>`;
    if(state.step===1)return `<span class="hcb-ink">2. TON PRÉNOM</span><h3>Comment veux-tu t’appeler ?</h3><div class="hcb-sub">Écris librement le prénom de ton personnage.</div><div class="hcb-name"><input id="hcbName" maxlength="24" autocomplete="off" placeholder="Écris ton prénom…" value="${esc(state.name)}"></div>`;
    if(state.step===2)return `<span class="hcb-ink">3. TON TEMPÉRAMENT</span><h3>Quelle énergie te ressemble ?</h3>${choices(temperaments,'temperament')}`;
    if(state.step===3)return `<span class="hcb-ink">4. TA COMPÉTENCE DE DÉPART</span><h3>Quel est ton premier talent ?</h3>${choices(skills,'skill')}`;
    if(state.step===4)return `<span class="hcb-ink">5. TA CONNAISSANCE DE DÉPART</span><h3>Qu’est-ce que tu connais déjà ?</h3>${choices(knowledges,'knowledge')}`;
    if(state.step===5)return `<span class="hcb-ink">6. TON OBJECTIF</span><h3>Qu’as-tu envie d’apprendre ?</h3>${choices(goals,'goal')}`;
    return `<div class="hcb-final"><span class="hcb-ink">7. TON RÉSUMÉ</span><h3>${esc(state.name||'Ton personnage')}</h3><p>Tu démarres avec un tempérament <b>${esc(state.temperament)}</b>, une compétence en <b>${esc(state.skill)}</b>, des connaissances en <b>${esc(state.knowledge)}</b> et l’envie de progresser en <b>${esc(state.goal)}</b>.</p><p>Tout le reste se construira pendant la partie.</p></div>`;
  }
  function render(){
    const v=current();
    root.innerHTML=`<div class="hcb-top"><div class="hcb-brand">HAUTE<br>COUTURE<small>LIVE</small></div><button class="hcb-home" data-a="home">← Accueil</button></div><div class="hcb-grid"><main class="hcb-main"><span class="hcb-badge">ÉTAPE ${state.step+1} / 7</span><h1 class="hcb-title">CRÉE TON <em>personnage</em></h1><p class="hcb-intro">Choisis ton apparence, ton prénom et ton point de départ. Ton histoire commence ici.</p><section class="hcb-stage">${stage()}</section></main><aside class="hcb-side"><span class="hcb-preview-label">TON APERÇU</span><div class="hcb-preview">${v?.src?`<img src="${v.src}" alt="">`:`<div class="hcb-empty"><b>✦</b><span>CHOISIS UN VISUEL</span></div>`}</div><h3>${esc(state.name||'Ton personnage')}</h3><div class="hcb-vibe">${esc(state.temperament||'Prête à briller !')}</div><div class="hcb-summary"><div><b>Prénom</b><span>${esc(state.name||'À choisir')}</span></div><div><b>Tempérament</b><span>${esc(state.temperament||'À choisir')}</span></div><div><b>Compétence</b><span>${esc(state.skill||'À choisir')}</span></div><div><b>Connaissance</b><span>${esc(state.knowledge||'À choisir')}</span></div><div><b>Objectif</b><span>${esc(state.goal||'À choisir')}</span></div></div></aside></div><div class="hcb-bottom"><div class="hcb-steps">${Array.from({length:7},(_,i)=>`<i class="hcb-step ${i<=state.step?'on':''}"></i>`).join('')}</div><div class="hcb-actions"><button data-a="prev" ${state.step===0?'disabled':''}>Retour</button><button class="next" data-a="next" ${valid()?'':'disabled'}>${state.step<6?'CONTINUER':'COMMENCER'}</button></div></div>`;
    const inp=root.querySelector('#hcbName');
    if(inp)inp.addEventListener('input',e=>{state.name=e.target.value;render()});
  }
  function finish(){
    try{localStorage.setItem('haute-couture-character-builder',JSON.stringify(state));localStorage.setItem('haute-couture-character-name',state.name);localStorage.setItem('haute-couture-character',state.appearance)}catch(e){}
    try{if(typeof window.displayScreen==='function')window.displayScreen('location')}catch(e){}
  }
  root.addEventListener('click',e=>{
    const l=e.target.closest('[data-look]');if(l){state.appearance=l.dataset.look;render();return}
    const c=e.target.closest('[data-k]');if(c){state[c.dataset.k]=c.dataset.v;render();return}
    const a=e.target.closest('[data-a]');if(!a)return;
    if(a.dataset.a==='home'){try{if(typeof window.displayScreen==='function')window.displayScreen('home')}catch(e){};return}
    if(a.dataset.a==='prev'&&state.step>0){state.step--;render();return}
    if(a.dataset.a==='next'&&valid()){if(state.step<6){state.step++;render()}else finish()}
  });
  render();
})();