(function(){
  if(window.__HCCharacterCreatorResetV2)return;
  window.__HCCharacterCreatorResetV2=true;

  const $=(s,r=document)=>r.querySelector(s);
  const state={step:0,appearance:'',name:'',temperament:'',skill:'',knowledge:'',goal:''};
  const temperaments=[['Solaire','Spontanée, expressive, attirée par la couleur.'],['Élégante','Raffinée, attentive à l’allure et aux détails.'],['Audacieuse','Aime les choix forts et les idées qui détonnent.'],['Créative','Transforme facilement une idée en univers.'],['Déterminée','Avance avec méthode et ambition.'],['Intuitive','Suit son regard et les rencontres inattendues.']];
  const skills=[['Croquis','Imaginer rapidement une silhouette.'],['Couture','Assembler et retoucher proprement.'],['Couleurs','Créer des palettes fortes et cohérentes.'],['Styling','Composer des looks et raconter une allure.'],['Patronage','Construire volumes et formes.'],['Réseau','Créer des contacts et saisir les opportunités.']];
  const knowledges=[['Tissus','Reconnaître les matières et leurs usages.'],['Moodboards','Construire une direction visuelle claire.'],['Retouches','Corriger un tombé et ajuster une pièce.'],['Imprimés','Associer motifs, échelles et couleurs.'],['Vintage','Repérer et transformer l’existant.'],['Image de marque','Comprendre identité et cohérence visuelle.']];
  const goals=[['Haute couture','Maîtriser les finitions et les pièces d’exception.'],['Direction artistique','Construire une image forte et reconnaissable.'],['Patronage avancé','Devenir très solide techniquement.'],['Production','Comprendre coûts, délais et fabrication.'],['Business','Développer une activité viable.'],['Réseau mode','Multiplier les opportunités et collaborations.']];
  let looks=[];

  const esc=v=>String(v??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));
  function save(){try{localStorage.setItem('haute-couture-character-builder',JSON.stringify(state))}catch(e){}}
  function restore(){try{const d=JSON.parse(localStorage.getItem('haute-couture-character-builder')||'{}');Object.assign(state,d||{});state.step=0}catch(e){}}

  async function dataFromScript(path,varName){
    try{
      const t=await fetch(path+'?v=reset-v2',{cache:'no-store'}).then(r=>r.ok?r.text():'');
      const re=new RegExp("const\\s+"+varName+"=['\\\"](data:image\\/[^'\\\"]+)['\\\"]");
      return t.match(re)?.[1]||'';
    }catch(e){return''}
  }

  async function buildLooks(){
    const [clara,ines]=await Promise.all([
      dataFromScript('./clara-visual-patch.js','CLARA'),
      dataFromScript('./ines-full-lite.js','SRC')
    ]);
    looks=[];
    if(clara)looks.push({id:'look-01',src:clara});
    if(ines)looks.push({id:'look-02',src:ines});
    while(looks.length<12)looks.push({id:'look-'+String(looks.length+1).padStart(2,'0'),src:''});
    if(!looks.some(x=>x.id===state.appearance))state.appearance=looks.find(x=>x.src)?.id||looks[0].id;
  }

  function installCss(){
    document.querySelectorAll('[id^="hcCharacterCreator"],[id^="hcResetCreatorStyles"],[id^="hcCCV2Style"],[id^="hc2CustomName"]')
      .forEach(n=>{if(n.tagName==='STYLE')n.remove()});
    let s=$('#hcResetCreatorV2Styles');
    if(s)return;
    s=document.createElement('style');
    s.id='hcResetCreatorV2Styles';
    s.textContent=`
      #characters{position:relative!important;overflow:hidden!important;background:#fffaf4!important;min-height:100vh!important}
      #characters>#hcResetCreatorV2{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
      #characters>*:not(#hcResetCreatorV2){display:none!important}
      #hcResetCreatorV2{position:absolute!important;inset:0!important;z-index:99999!important;overflow:auto!important;background:radial-gradient(circle at 12% 4%,#fff 0 14%,transparent 30%),linear-gradient(135deg,#fffaf4,#f8eee4 58%,#f2e2d5)!important;color:#211d1a!important;font-family:Arial,sans-serif!important}
      .hcv2-shell{min-height:100%;display:grid;grid-template-columns:minmax(0,1.55fr) minmax(330px,.72fr);gap:34px;padding:36px 48px 130px 76px;box-sizing:border-box}
      .hcv2-main{min-width:0}.hcv2-top{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}.hcv2-brand{font:900 19px/.88 Arial;letter-spacing:.16em}.hcv2-brand small{display:block;color:#e66d56;font-size:9px;letter-spacing:.28em;margin-top:6px}.hcv2-later{border:1px solid #e5cbbd;background:#fffaf4;border-radius:999px;padding:12px 17px;font:700 10px Arial;letter-spacing:.08em;cursor:pointer}.hcv2-badge{display:inline-block;margin:19px 0 10px;border:1px solid #e5aa93;border-radius:999px;padding:7px 13px;font:700 10px Arial}.hcv2-title{margin:0;font:900 clamp(48px,5vw,80px)/.9 Arial;letter-spacing:-.055em;text-transform:uppercase}.hcv2-title em{font:italic 400 clamp(50px,5.3vw,84px)/.9 Georgia;color:#df6b54;text-transform:none;margin-left:8px}.hcv2-intro{font:15px/1.55 Arial;color:#4d4641;margin:15px 0 24px}.hcv2-ink{display:inline-block;background:#1f1f1d;color:#fff;padding:8px 16px;font:800 13px Arial;letter-spacing:.04em;border-radius:999px}.hcv2-stage{margin-top:16px}.hcv2-stage h3{font:400 31px Georgia;margin:14px 0 5px}.hcv2-sub{font:12px/1.5 Arial;color:#897d74;margin-bottom:15px}
      .hcv2-gallery{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:11px}.hcv2-look{position:relative;aspect-ratio:.72;border:1px solid #e7d7cb;border-radius:18px;background:#fffaf4;padding:7px;overflow:hidden;cursor:pointer;transition:.18s}.hcv2-look:hover{transform:translateY(-3px)}.hcv2-look.sel{border:2px solid #ef745d;box-shadow:0 12px 26px rgba(201,103,79,.18)}.hcv2-look.sel:after{content:'✓';position:absolute;right:8px;top:8px;width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:#ef745d;color:#fff;font:bold 15px Arial}.hcv2-art{width:100%;height:100%;border-radius:12px;overflow:hidden;background:radial-gradient(circle at 50% 34%,#fffdfa 0 36%,#f9efe4 72%,#f2e4d6 100%);display:grid;place-items:center}.hcv2-art img{width:100%;height:100%;object-fit:contain;object-position:50% 100%;display:block}.hcv2-empty{display:grid;place-items:center;gap:7px;text-align:center;color:#bca999}.hcv2-empty b{font:31px Georgia}.hcv2-empty span{font:700 7px Arial;letter-spacing:.12em}
      .hcv2-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;max-width:780px}.hcv2-choice{padding:16px;text-align:left;border:1px solid #e6d8cd;border-radius:16px;background:#fffaf4;cursor:pointer;transition:.16s}.hcv2-choice:hover{transform:translateY(-2px)}.hcv2-choice.sel{border-color:#e27b64;background:#fff1e9}.hcv2-choice b{display:block;font:20px Georgia;margin-bottom:5px}.hcv2-choice span{font:12px/1.45 Arial;color:#776d66}.hcv2-name input{width:min(620px,100%);border:0;border-bottom:2px solid #e2b49f;background:transparent;padding:12px 1px;font:46px Georgia;outline:0;color:#2d2723}
      .hcv2-side{position:sticky;top:28px;align-self:start;background:#fffaf4;border:1px solid #ead8cd;border-radius:24px;padding:18px 20px 22px;box-shadow:0 16px 42px rgba(73,47,31,.10)}.hcv2-preview-label{display:inline-block;background:#20201e;color:#fff;border-radius:999px;padding:7px 14px;font:800 11px Arial}.hcv2-preview{height:370px;margin:14px 0 10px;border-radius:16px;overflow:hidden;background:linear-gradient(180deg,#fff8ef,#f3dfcf);display:grid;place-items:center}.hcv2-preview img{width:100%;height:100%;object-fit:contain;object-position:50% 100%}.hcv2-side h3{font:38px Georgia;margin:8px 0 2px}.hcv2-vibe{font:italic 30px Georgia;color:#ad755d;margin-bottom:12px}.hcv2-summary{display:grid;gap:7px}.hcv2-summary div{border-top:1px solid #e8d9cf;padding-top:7px}.hcv2-summary b{display:block;font:700 8px Arial;letter-spacing:.12em;text-transform:uppercase}.hcv2-summary span{font:13px Georgia;color:#5c524b}
      .hcv2-bottom{position:fixed;left:4.5%;right:4.5%;bottom:16px;z-index:100000;display:grid;grid-template-columns:1fr 320px;gap:24px;align-items:center;background:rgba(255,250,244,.97);border:1px solid #e6d4c8;border-radius:24px;padding:12px 18px;box-shadow:0 15px 38px rgba(72,48,31,.11);backdrop-filter:blur(10px)}.hcv2-steps{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}.hcv2-step{height:5px;border-radius:99px;background:#eadfd5}.hcv2-step.on{background:#e96f58}.hcv2-actions{display:flex;gap:8px}.hcv2-actions button{height:56px;border-radius:999px;padding:0 18px;border:1px solid #ddcec2;background:#fffaf4;font:13px Georgia;cursor:pointer}.hcv2-actions .next{flex:1;background:#171717;color:#fff;border:0;font:700 14px Arial;letter-spacing:.06em}.hcv2-actions button:disabled{opacity:.3;cursor:not-allowed}.hcv2-final{max-width:760px;padding:20px;border-radius:20px;background:#fff4eb;border:1px solid #ead7ca}.hcv2-final h3{font:40px Georgia;margin:10px 0}.hcv2-final p{font:14px/1.6 Georgia;color:#5e544d}
      @media(max-width:1100px){.hcv2-shell{grid-template-columns:1fr 330px;padding-left:36px}.hcv2-gallery{grid-template-columns:repeat(4,1fr)}}
      @media(max-width:800px){.hcv2-shell{display:block;padding:78px 18px 150px}.hcv2-side{position:relative;top:auto;margin-top:24px}.hcv2-gallery{grid-template-columns:repeat(3,1fr)}.hcv2-choices{grid-template-columns:1fr}.hcv2-bottom{left:10px;right:10px;grid-template-columns:1fr 190px}.hcv2-title{font-size:43px}.hcv2-title em{font-size:46px}.hcv2-preview{height:300px}}
    `;
    document.head.appendChild(s);
  }

  function current(){return looks.find(x=>x.id===state.appearance)||looks[0]}
  function valid(){return [!!state.appearance,state.name.trim().length>=2,!!state.temperament,!!state.skill,!!state.knowledge,!!state.goal,true][state.step]}
  function choiceGrid(items,key){return `<div class="hcv2-choices">${items.map(([n,d])=>`<button class="hcv2-choice ${state[key]===n?'sel':''}" data-k="${key}" data-v="${esc(n)}"><b>${esc(n)}</b><span>${esc(d)}</span></button>`).join('')}</div>`}
  function stage(){
    if(state.step===0)return `<span class="hcv2-ink">1. CHOISIS TON APPARENCE</span><h3>Choisis le look qui te ressemble le plus</h3><div class="hcv2-sub">Tu choisis uniquement un visuel. Ton prénom et ton histoire viennent ensuite.</div><div class="hcv2-gallery">${looks.map((v,i)=>`<button class="hcv2-look ${state.appearance===v.id?'sel':''}" data-look="${v.id}"><div class="hcv2-art">${v.src?`<img src="${v.src}" alt="">`:`<div class="hcv2-empty"><b>${String(i+1).padStart(2,'0')}</b><span>VISUEL À VENIR</span></div>`}</div></button>`).join('')}</div>`;
    if(state.step===1)return `<span class="hcv2-ink">2. TON PRÉNOM</span><h3>Comment veux-tu t’appeler ?</h3><div class="hcv2-sub">Écris librement le prénom de ton personnage.</div><div class="hcv2-name"><input id="hcv2Name" maxlength="24" autocomplete="off" placeholder="Écris ton prénom…" value="${esc(state.name)}"></div>`;
    if(state.step===2)return `<span class="hcv2-ink">3. TON TEMPÉRAMENT</span><h3>Quelle énergie te ressemble ?</h3>${choiceGrid(temperaments,'temperament')}`;
    if(state.step===3)return `<span class="hcv2-ink">4. TA COMPÉTENCE DE DÉPART</span><h3>Quel est ton premier talent ?</h3>${choiceGrid(skills,'skill')}`;
    if(state.step===4)return `<span class="hcv2-ink">5. TA CONNAISSANCE DE DÉPART</span><h3>Qu’est-ce que tu connais déjà ?</h3>${choiceGrid(knowledges,'knowledge')}`;
    if(state.step===5)return `<span class="hcv2-ink">6. TON OBJECTIF</span><h3>Qu’as-tu envie d’apprendre ?</h3>${choiceGrid(goals,'goal')}`;
    return `<div class="hcv2-final"><span class="hcv2-ink">7. TON RÉSUMÉ</span><h3>${esc(state.name||'Ton personnage')}</h3><p>Tu démarres avec un tempérament <b>${esc(state.temperament)}</b>, une compétence en <b>${esc(state.skill)}</b>, des connaissances en <b>${esc(state.knowledge)}</b> et l’envie de progresser en <b>${esc(state.goal)}</b>.</p><p>Tout le reste se construira pendant la partie.</p></div>`;
  }

  function render(){
    const r=$('#hcResetCreatorV2');if(!r)return;
    const v=current();
    r.innerHTML=`<div class="hcv2-shell"><main class="hcv2-main"><div class="hcv2-top"><div class="hcv2-brand">HAUTE<br>COUTURE<small>LIVE</small></div><button class="hcv2-later" data-a="later">REPRENDRE PLUS TARD</button></div><span class="hcv2-badge">ÉTAPE ${state.step+1} / 7</span><h1 class="hcv2-title">CRÉE TON <em>personnage</em></h1><p class="hcv2-intro">Choisis ton apparence, ton prénom et ton point de départ. Ton histoire commence ici.</p><section class="hcv2-stage">${stage()}</section></main><aside class="hcv2-side"><span class="hcv2-preview-label">TON APERÇU</span><div class="hcv2-preview">${v&&v.src?`<img src="${v.src}" alt="">`:`<div class="hcv2-empty"><b>✦</b><span>CHOISIS UN VISUEL</span></div>`}</div><h3>${esc(state.name||'Ton personnage')}</h3><div class="hcv2-vibe">${esc(state.temperament||'Prête à briller !')}</div><div class="hcv2-summary"><div><b>Prénom</b><span>${esc(state.name||'À choisir')}</span></div><div><b>Tempérament</b><span>${esc(state.temperament||'À choisir')}</span></div><div><b>Compétence</b><span>${esc(state.skill||'À choisir')}</span></div><div><b>Connaissance</b><span>${esc(state.knowledge||'À choisir')}</span></div><div><b>Objectif</b><span>${esc(state.goal||'À choisir')}</span></div></div></aside></div><div class="hcv2-bottom"><div class="hcv2-steps">${Array.from({length:7},(_,i)=>`<i class="hcv2-step ${i<=state.step?'on':''}"></i>`).join('')}</div><div class="hcv2-actions"><button data-a="prev" ${state.step===0?'disabled':''}>Retour</button><button class="next" data-a="next" ${valid()?'':'disabled'}>${state.step<6?'CONTINUER':'COMMENCER'}</button></div></div>`;
    const inp=$('#hcv2Name',r);
    if(inp)inp.addEventListener('input',e=>{state.name=e.target.value;save();render()});
  }

  function finish(){
    save();
    try{
      localStorage.setItem('haute-couture-character',state.appearance);
      localStorage.setItem('haute-couture-selected-character',state.appearance);
      localStorage.setItem('selectedCharacter',state.appearance);
      localStorage.setItem('haute-couture-player-name',state.name);
    }catch(e){}
    try{if(typeof window.displayScreen==='function')window.displayScreen('location')}catch(e){}
  }

  function onClick(e){
    const l=e.target.closest('[data-look]');if(l){state.appearance=l.dataset.look;save();render();return}
    const c=e.target.closest('[data-k]');if(c){state[c.dataset.k]=c.dataset.v;save();render();return}
    const a=e.target.closest('[data-a]');if(!a)return;
    if(a.dataset.a==='prev'&&state.step>0){state.step--;save();render();return}
    if(a.dataset.a==='next'&&valid()){if(state.step<6){state.step++;save();render()}else finish();return}
    if(a.dataset.a==='later'){save();try{if(typeof window.displayScreen==='function')window.displayScreen('home')}catch(e){}}
  }

  async function mount(){
    const host=$('#characters');
    if(!host)return false;
    restore();
    await buildLooks();
    installCss();
    document.querySelectorAll('#hcResetCreator,#hcCCV2,.hc2').forEach(n=>n.remove());
    let root=$('#hcResetCreatorV2');
    if(!root){root=document.createElement('section');root.id='hcResetCreatorV2';host.appendChild(root);root.addEventListener('click',onClick)}
    render();
    return true;
  }

  function boot(){let n=0;(async function wait(){if(await mount())return;if(++n<120)setTimeout(wait,50)})()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();