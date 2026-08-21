(function(){
  if(window.__HCCharacterCreatorStableV3)return;
  window.__HCCharacterCreatorStableV3=true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const state={step:0,appearance:'',name:'',temperament:'',skill:'',knowledge:'',goal:''};
  let visuals=[];

  const temperaments=[
    ['Solaire','Spontanée, expressive et attirée par la couleur.'],
    ['Élégante','Tu recherches la justesse, l’équilibre et une belle allure.'],
    ['Audacieuse','Tu assumes les choix forts et les idées qui détonnent.'],
    ['Créative','Tu transformes facilement une idée en univers.'],
    ['Déterminée','Tu progresses avec méthode, ambition et constance.'],
    ['Intuitive','Tu suis ton regard et les rencontres inattendues.']
  ];
  const skills=[
    ['Croquis','Imaginer rapidement une silhouette.'],
    ['Couture','Assembler et retoucher proprement.'],
    ['Couleurs','Créer des palettes fortes et cohérentes.'],
    ['Styling','Composer des looks et raconter une allure.'],
    ['Patronage','Construire les volumes et les formes.'],
    ['Réseau','Créer des contacts et saisir les opportunités.']
  ];
  const knowledge=[
    ['Tissus','Reconnaître les matières et leurs usages.'],
    ['Moodboards','Construire une direction visuelle claire.'],
    ['Retouches','Corriger un tombé et ajuster une pièce.'],
    ['Imprimés','Associer motifs, échelles et couleurs.'],
    ['Vintage','Repérer et transformer l’existant.'],
    ['Image de marque','Comprendre identité, ton et cohérence visuelle.']
  ];
  const goals=[
    ['Haute couture','Maîtriser les finitions et les pièces d’exception.'],
    ['Direction artistique','Construire une image forte et reconnaissable.'],
    ['Patronage avancé','Devenir très solide techniquement.'],
    ['Production','Comprendre coûts, délais et fabrication.'],
    ['Business','Développer une activité viable.'],
    ['Réseau mode','Multiplier les opportunités et collaborations.']
  ];

  const esc=v=>String(v??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));

  function save(){
    try{localStorage.setItem('haute-couture-character-builder',JSON.stringify(state))}catch(e){}
  }

  function restore(){
    try{
      const x=JSON.parse(localStorage.getItem('haute-couture-character-builder')||'null');
      if(x&&typeof x==='object')Object.assign(state,x);
      state.step=Math.max(0,Math.min(6,Number(state.step)||0));
    }catch(e){}
  }

  function collectVisuals(){
    const found=[];
    $$('#characters .hc-person').forEach((card,i)=>{
      const img=$('.fig img',card);
      if(img&&img.complete&&img.naturalWidth>20){
        found.push({id:card.dataset.id||('look-'+(i+1)),src:img.currentSrc||img.src});
      }
    });
    const unique=[];
    const seen=new Set();
    found.forEach(v=>{if(v.src&&!seen.has(v.src)){seen.add(v.src);unique.push(v)}});
    visuals=unique;
    if(!visuals.length){
      visuals=[{id:'look-1',src:''}];
    }
    if(!visuals.some(v=>v.id===state.appearance))state.appearance=visuals[0].id;
  }

  function css(){
    ['hcCharacterCreatorV1Styles','hcCharacterCreatorV2Styles','hcCharacterCreatorV2MoodStyles','hcCharacterCreatorCleanupV1Styles','hcCCV2Style'].forEach(id=>document.getElementById(id)?.remove());
    if($('#hcCreatorStableV3Styles'))return;
    const s=document.createElement('style');
    s.id='hcCreatorStableV3Styles';
    s.textContent=`
      #characters.hc-creator-active{position:relative!important;overflow:hidden!important;background:#fffaf4!important}
      #characters.hc-creator-active>*:not(#hcCreatorStable){visibility:hidden!important;opacity:0!important;pointer-events:none!important}
      #hcCreatorStable{visibility:visible!important;opacity:1!important;pointer-events:auto!important;position:absolute!important;inset:0!important;z-index:9999!important;overflow:auto!important;background:radial-gradient(circle at 15% 8%,#fff 0 13%,transparent 30%),linear-gradient(135deg,#fffaf4,#f8eee5 58%,#f3e4d9);color:#201d1a;font-family:Arial,sans-serif;box-sizing:border-box}
      #hcCreatorStable *{box-sizing:border-box}
      .ccv3-shell{min-height:100%;display:grid;grid-template-columns:minmax(0,1.55fr) minmax(330px,.7fr);gap:32px;padding:28px 38px 126px 84px}
      .ccv3-main{min-width:0}.ccv3-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px}.ccv3-brand{font:900 18px/.9 Arial;letter-spacing:.18em}.ccv3-brand small{display:block;color:#e46b56;font-size:10px;letter-spacing:.28em;margin-top:5px}.ccv3-later{border:1px solid #e3c9bb;background:#fffaf5;border-radius:999px;padding:12px 18px;font:700 10px Arial;letter-spacing:.1em;cursor:pointer}.ccv3-badge{display:inline-block;border:1px solid #eda991;border-radius:999px;padding:7px 13px;font:800 10px Arial;letter-spacing:.11em;margin:12px 0 10px}.ccv3-title{margin:0;font:900 clamp(48px,5vw,78px)/.9 Arial;letter-spacing:-.055em}.ccv3-title em{font:italic 400 clamp(50px,5.2vw,82px)/.9 Georgia;color:#e46b56;margin-left:8px}.ccv3-intro{font:15px/1.55 Arial;color:#4f4741;margin:15px 0 22px;max-width:690px}
      .ccv3-stage{min-height:0}.ccv3-ink{display:inline-block;background:#1e1d1b;color:#fff;padding:8px 16px;border-radius:999px;font:800 12px Arial;letter-spacing:.06em;margin-bottom:12px}.ccv3-step-title{font:400 30px/1.1 Georgia;margin:0 0 5px}.ccv3-note{font:12px/1.5 Arial;color:#8b776a;margin:0 0 15px}
      .ccv3-gallery{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:11px;max-height:430px;overflow:auto;padding:2px 4px 6px 0}.ccv3-look{position:relative;aspect-ratio:.73;border:1px solid rgba(125,87,64,.13);border-radius:18px;background:#fffaf4;overflow:hidden;padding:0;cursor:pointer;box-shadow:0 6px 18px rgba(73,49,33,.04);transition:.18s}.ccv3-look:hover{transform:translateY(-3px)}.ccv3-look.sel{border:2px solid #ef745d;box-shadow:0 12px 25px rgba(210,102,78,.16)}.ccv3-look.sel:after{content:'✓';position:absolute;right:8px;top:8px;width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:#ef745d;color:white;font:bold 15px Arial;z-index:3}.ccv3-look .art{position:absolute;inset:7px;border-radius:12px;overflow:hidden;background:radial-gradient(circle at 50% 34%,#fffdfa 0 36%,#f9efe4 72%,#f2e4d6 100%)}.ccv3-look img{width:100%;height:100%;object-fit:contain;object-position:50% 100%;display:block}.ccv3-empty{width:100%;height:100%;display:grid;place-items:center;color:#baa899;font:12px Arial}
      .ccv3-name{max-width:640px;margin-top:20px}.ccv3-name input{width:100%;border:0;border-bottom:2px solid #e7ad97;background:transparent;padding:10px 2px;font:48px Georgia;color:#2a2420;outline:0}.ccv3-name input::placeholder{color:#c7b4a5}.ccv3-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;max-width:780px}.ccv3-choice{padding:15px 16px;text-align:left;border:1px solid rgba(122,85,63,.14);border-radius:16px;background:#fffaf4;cursor:pointer;transition:.18s}.ccv3-choice:hover,.ccv3-choice.sel{transform:translateY(-2px);border-color:#e78c73;box-shadow:0 10px 22px rgba(90,55,36,.07)}.ccv3-choice.sel{background:#fff0e9}.ccv3-choice b{display:block;font:20px Georgia;margin-bottom:4px}.ccv3-choice span{font:12px/1.45 Arial;color:#7f7066}
      .ccv3-side{position:sticky;top:20px;align-self:start;border:1px solid rgba(122,88,65,.12);border-radius:28px;background:#fffaf4;padding:18px;box-shadow:0 14px 35px rgba(72,48,33,.08)}.ccv3-preview-label{display:inline-block;background:#1c1c1a;color:#fff;border-radius:999px;padding:8px 15px;font:800 11px Arial;letter-spacing:.08em}.ccv3-preview-art{height:340px;margin:13px 0 12px;border-radius:20px;overflow:hidden;background:radial-gradient(circle at 50% 34%,#fffdfa 0 36%,#f9efe4 72%,#f2e4d6 100%)}.ccv3-preview-art img{width:100%;height:100%;object-fit:contain;object-position:50% 100%;display:block}.ccv3-side h3{font:400 38px Georgia;margin:4px 0 0}.ccv3-vibe{font:italic 26px Georgia;color:#b8765d;margin:3px 0 14px}.ccv3-summary{display:grid;gap:7px}.ccv3-summary div{border-top:1px solid rgba(110,80,59,.09);padding-top:7px}.ccv3-summary b{display:block;font:800 8px Arial;letter-spacing:.12em;text-transform:uppercase;color:#8a776c}.ccv3-summary span{display:block;margin-top:2px;font:12px Georgia;color:#5f554e}
      .ccv3-final{max-width:760px;padding:20px;border:1px solid rgba(120,86,64,.12);border-radius:18px;background:#fff6ee}.ccv3-final h3{font:42px Georgia;margin:0 0 8px}.ccv3-final p{font:15px/1.6 Georgia;color:#5d5148}
      .ccv3-bottom{position:absolute;left:5%;right:5%;bottom:14px;display:grid;grid-template-columns:1fr 270px;gap:24px;align-items:center;border:1px solid rgba(120,86,64,.12);border-radius:24px;background:rgba(255,250,244,.97);padding:11px 15px 11px 20px;box-shadow:0 13px 34px rgba(72,48,33,.09)}.ccv3-steps{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.ccv3-step{border:0;background:transparent;text-align:center;padding:2px;cursor:pointer}.ccv3-step i{margin:0 auto 4px;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#fff5ec;border:1px solid #ead8ca;font:700 12px Arial;font-style:normal}.ccv3-step.on i{background:#ffd7cb;border-color:#eb9c84}.ccv3-step b{display:block;font:800 8px Arial;letter-spacing:.04em}.ccv3-next{height:58px;border:0;border-radius:999px;background:#1e1d1b;color:#fff;font:800 14px Arial;letter-spacing:.06em;cursor:pointer}.ccv3-next:disabled{opacity:.3;cursor:not-allowed}.ccv3-prev{height:42px;border:1px solid #dfcdbf;border-radius:999px;background:#fffaf4;padding:0 15px;font:12px Georgia;cursor:pointer;margin-right:8px}
      @media(max-width:1180px){.ccv3-shell{grid-template-columns:1fr 330px;padding-left:38px}.ccv3-gallery{grid-template-columns:repeat(4,1fr)}}
      @media(max-width:820px){#hcCreatorStable{overflow:auto!important}.ccv3-shell{display:block;padding:72px 18px 150px}.ccv3-side{position:relative;top:auto;margin-top:24px}.ccv3-gallery{grid-template-columns:repeat(3,1fr);max-height:none}.ccv3-bottom{position:fixed;left:10px;right:10px;grid-template-columns:1fr 150px}.ccv3-step b{display:none}.ccv3-title{font-size:44px}.ccv3-title em{font-size:46px}}
    `;
    document.head.appendChild(s);
  }

  function currentLook(){return visuals.find(v=>v.id===state.appearance)||visuals[0]}
  function valid(){return state.step===0?!!state.appearance:state.step===1?state.name.trim().length>=2:state.step===2?!!state.temperament:state.step===3?!!state.skill:state.step===4?!!state.knowledge:state.step===5?!!state.goal:true}
  function options(items,key){return `<div class="ccv3-choices">${items.map(([n,d])=>`<button class="ccv3-choice ${state[key]===n?'sel':''}" data-pick="${key}" data-value="${esc(n)}"><b>${esc(n)}</b><span>${esc(d)}</span></button>`).join('')}</div>`}
  function visualHTML(v){return v&&v.src?`<img src="${esc(v.src)}" alt="">`:`<div class="ccv3-empty">VISUEL À VENIR</div>`}

  function stage(){
    if(state.step===0)return `<div class="ccv3-ink">1. CHOISIS TON APPARENCE</div><h3 class="ccv3-step-title">Choisis le look qui te ressemble le plus</h3><p class="ccv3-note">Ici, tu choisis uniquement une apparence. Aucun prénom ni profil n’est imposé.</p><div class="ccv3-gallery">${visuals.map(v=>`<button class="ccv3-look ${state.appearance===v.id?'sel':''}" data-look="${esc(v.id)}"><div class="art">${visualHTML(v)}</div></button>`).join('')}</div>`;
    if(state.step===1)return `<div class="ccv3-ink">2. TON PRÉNOM</div><h3 class="ccv3-step-title">Comment veux-tu t’appeler ?</h3><p class="ccv3-note">Écris librement ton prénom. C’est celui qui sera utilisé dans toute la partie.</p><div class="ccv3-name"><input id="ccv3Name" maxlength="24" autocomplete="off" placeholder="Écris ton prénom…" value="${esc(state.name)}"></div>`;
    if(state.step===2)return `<div class="ccv3-ink">3. TON TEMPÉRAMENT</div><h3 class="ccv3-step-title">Quelle énergie te ressemble ?</h3><p class="ccv3-note">Choisis une seule dominante pour ton point de départ.</p>${options(temperaments,'temperament')}`;
    if(state.step===3)return `<div class="ccv3-ink">4. TA COMPÉTENCE</div><h3 class="ccv3-step-title">Quel est ton premier talent ?</h3><p class="ccv3-note">Une seule compétence de départ.</p>${options(skills,'skill')}`;
    if(state.step===4)return `<div class="ccv3-ink">5. TA CONNAISSANCE</div><h3 class="ccv3-step-title">Qu’est-ce que tu connais déjà ?</h3><p class="ccv3-note">Une seule connaissance au lancement de la carrière.</p>${options(knowledge,'knowledge')}`;
    if(state.step===5)return `<div class="ccv3-ink">6. TON OBJECTIF</div><h3 class="ccv3-step-title">Qu’as-tu envie d’apprendre ?</h3><p class="ccv3-note">Cela donne une première direction à ton évolution, sans t’enfermer.</p>${options(goals,'goal')}`;
    return `<div class="ccv3-final"><div class="ccv3-ink">7. TON RÉSUMÉ</div><h3>${esc(state.name||'Ton personnage')}</h3><p>Tu démarres avec un tempérament <b>${esc(state.temperament)}</b>, une force en <b>${esc(state.skill)}</b>, une connaissance en <b>${esc(state.knowledge)}</b> et l’envie de progresser en <b>${esc(state.goal)}</b>.</p><p>Ce n’est que ton point de départ : ta carrière évoluera ensuite selon tes décisions.</p></div>`;
  }

  function preview(){
    const v=currentLook();
    return `<span class="ccv3-preview-label">TON APERÇU</span><div class="ccv3-preview-art">${visualHTML(v)}</div><h3>${esc(state.name||'Ton personnage')}</h3><div class="ccv3-vibe">${esc(state.temperament||'Prête à briller !')}</div><div class="ccv3-summary"><div><b>Prénom</b><span>${esc(state.name||'À choisir')}</span></div><div><b>Tempérament</b><span>${esc(state.temperament||'À choisir')}</span></div><div><b>Compétence</b><span>${esc(state.skill||'À choisir')}</span></div><div><b>Connaissance</b><span>${esc(state.knowledge||'À choisir')}</span></div><div><b>Objectif</b><span>${esc(state.goal||'À choisir')}</span></div></div>`;
  }

  function render(){
    const root=$('#hcCreatorStable');
    if(!root)return;
    root.innerHTML=`<div class="ccv3-shell"><main class="ccv3-main"><div class="ccv3-head"><div class="ccv3-brand">HAUTE<br>COUTURE<small>LIVE</small></div><button class="ccv3-later" data-action="later">REPRENDRE PLUS TARD</button></div><span class="ccv3-badge">ÉTAPE ${state.step+1} / 7</span><h2 class="ccv3-title">CRÉE TON <em>personnage</em></h2><p class="ccv3-intro">Choisis ton apparence, ton prénom et ton point de départ. Ton histoire commence ici.</p><section class="ccv3-stage">${stage()}</section></main><aside class="ccv3-side">${preview()}</aside></div><div class="ccv3-bottom"><div class="ccv3-steps">${['APPARENCE','PRÉNOM','TEMPÉRAMENT','COMPÉTENCE','CONNAISSANCE','OBJECTIF','RÉSUMÉ'].map((n,i)=>`<button class="ccv3-step ${i===state.step?'on':''}" data-step="${i}"><i>${i+1}</i><b>${n}</b></button>`).join('')}</div><div><button class="ccv3-prev" data-action="prev" ${state.step===0?'disabled':''}>Retour</button><button class="ccv3-next" data-action="next" ${valid()?'':'disabled'}>${state.step<6?'CONTINUER':'COMMENCER'}</button></div></div>`;
    const input=$('#ccv3Name',root);
    if(input){
      input.focus();
      input.addEventListener('input',e=>{state.name=e.target.value;save();const h=$('.ccv3-side h3',root);if(h)h.textContent=state.name||'Ton personnage';const first=$('.ccv3-summary span',root);if(first)first.textContent=state.name||'À choisir';const next=$('[data-action="next"]',root);if(next)next.disabled=!valid()});
    }
  }

  function finish(){
    save();
    try{
      localStorage.setItem('haute-couture-character',state.appearance);
      localStorage.setItem('haute-couture-selected-character',state.appearance);
      localStorage.setItem('selectedCharacter',state.appearance);
      localStorage.setItem('haute-couture-character-name',state.name);
    }catch(e){}
    try{if(typeof window.displayScreen==='function')window.displayScreen('location')}catch(e){}
  }

  function onClick(e){
    const look=e.target.closest('[data-look]');
    if(look){state.appearance=look.dataset.look;save();render();return}
    const pick=e.target.closest('[data-pick]');
    if(pick){state[pick.dataset.pick]=pick.dataset.value;save();render();return}
    const stepBtn=e.target.closest('[data-step]');
    if(stepBtn){const target=Number(stepBtn.dataset.step);if(target<=state.step){state.step=target;save();render()}return}
    const action=e.target.closest('[data-action]');
    if(!action)return;
    if(action.dataset.action==='prev'&&state.step>0){state.step--;save();render();return}
    if(action.dataset.action==='next'&&valid()){
      if(state.step<6){state.step++;save();render()}else finish();
      return;
    }
    if(action.dataset.action==='later'){
      save();
      try{if(typeof window.displayScreen==='function')window.displayScreen('home')}catch(e){}
    }
  }

  function mount(){
    const host=$('#characters');
    if(!host)return false;
    collectVisuals();
    css();
    host.classList.add('hc-creator-active');
    let root=$('#hcCreatorStable');
    if(!root){root=document.createElement('section');root.id='hcCreatorStable';host.appendChild(root);root.addEventListener('click',onClick)}
    render();
    return true;
  }

  function boot(){
    restore();
    let tries=0;
    (function wait(){
      const imgs=$$('#characters .hc-person .fig img');
      const ready=imgs.some(img=>img.complete&&img.naturalWidth>20);
      if(ready&&mount())return;
      if(++tries<120)setTimeout(wait,50);else mount();
    })();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();