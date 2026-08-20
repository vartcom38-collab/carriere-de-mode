(function(){
  if(window.__HCCharacterInteractionPrototype)return;
  window.__HCCharacterInteractionPrototype=true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const cast=[
    {id:'clara',name:'Clara',note:'Poétique · détails sensibles',strength:'Volumes doux · finitions délicates',dream:'Créer des pièces que l’on garde comme des souvenirs.',projection:'Tu remarqueras plus vite les belles finitions, les détails sensibles et les histoires cachées.',accent:'#d7a891',dress:'#e9c7b5',hair:'#69493d',skin:'#e7b28f',symbol:'✿'},
    {id:'ines',name:'Inès',note:'Solaire · couleur & mouvement',strength:'Palette · imprimés · fluidité',dream:'Créer une mode spontanée qui vit avec le corps.',projection:'Les couleurs, imprimés et rencontres créatives ressortiront davantage dans ton début de partie.',accent:'#d77b56',dress:'#e7a06e',hair:'#3a2b27',skin:'#bb7d5f',symbol:'◌'},
    {id:'maya',name:'Maya',note:'Direction créative · silhouette',strength:'Image · allure · impact',dream:'Signer une collection immédiatement reconnaissable.',projection:'Tu seras attirée par les projets visibles, les briefs ambitieux et les occasions de construire une image forte.',accent:'#748c7d',dress:'#9aab98',hair:'#302824',skin:'#c58e71',symbol:'✎'},
    {id:'elise',name:'Élise',note:'Rigoureuse · élégante',strength:'Coupe · soie · précision',dream:'Atteindre une élégance si juste qu’elle paraît évidente.',projection:'Les belles matières, les finitions exigeantes et les projets précis auront plus de poids.',accent:'#aa8a6b',dress:'#d9c9b4',hair:'#806756',skin:'#e1b697',symbol:'◇'},
    {id:'salome',name:'Salomé',note:'Libre · inspirée',strength:'Volume · naturel · mouvement',dream:'Créer sans perdre la liberté du premier croquis.',projection:'Les matières brutes, paysages et pistes inattendues apparaîtront plus naturellement.',accent:'#d6b66c',dress:'#ece2c6',hair:'#b19a7a',skin:'#deb08d',symbol:'≈'},
    {id:'anais',name:'Anaïs',note:'Pratique · authentique',strength:'Construction · lin · fonction',dream:'Faire des pièces belles, solides et faites pour vivre.',projection:'Tu identifieras plus vite les solutions pratiques et les projets où le savoir-faire compte.',accent:'#5f7180',dress:'#d8ddd8',hair:'#765a4c',skin:'#d3a181',symbol:'⌁'},
    {id:'jade',name:'Jade',note:'Artisanale · tactile',strength:'Cuir · gestes main · caractère',dream:'Faire reconnaître la valeur du travail artisanal dans une mode contemporaine.',projection:'Les artisans, matières de caractère et techniques manuelles seront plus visibles.',accent:'#976b50',dress:'#c8a487',hair:'#49352c',skin:'#bd8061',symbol:'✦'},
    {id:'camille',name:'Camille',note:'Créative · vintage',strength:'Upcycling · transformation · trouvaille',dream:'Transformer l’existant jusqu’à le rendre évident.',projection:'Tu repéreras davantage les pièces à transformer, les trouvailles vintage et les secondes vies.',accent:'#b87567',dress:'#d8b49c',hair:'#5b463b',skin:'#dfac8a',symbol:'↺'},
    {id:'louise',name:'Louise',note:'Scénique · narrative',strength:'Costume · scène · ornement',dream:'Créer des costumes que l’on reconnaît avant même l’histoire.',projection:'Les projets de scène, personnages et détails narratifs attireront davantage ton attention.',accent:'#88748b',dress:'#c7b6c7',hair:'#8b715f',skin:'#e0b08c',symbol:'✧'},
    {id:'margaux',name:'Margaux',note:'Romantique · intuitive',strength:'Broderie · motifs · minutie',dream:'Faire du détail une signature sans alourdir la silhouette.',projection:'Les motifs, broderies et savoir-faire décoratifs prendront plus de place dans tes découvertes.',accent:'#bb7a7a',dress:'#d9aaa4',hair:'#68493b',skin:'#d29b79',symbol:'❋'},
    {id:'juliette',name:'Juliette',note:'Sensible · matière',strength:'Dentelle · lin · texture',dream:'Créer des pièces calmes, tactiles et presque intemporelles.',projection:'Les textures naturelles et détails textiles subtils ressortiront davantage.',accent:'#849a88',dress:'#c7d5c5',hair:'#675244',skin:'#d7a684',symbol:'⌇'},
    {id:'romane',name:'Romane',note:'Énergique · sportive',strength:'Mouvement · confort · fonction',dream:'Prouver qu’un vêtement fonctionnel peut avoir autant de caractère qu’une pièce spectaculaire.',projection:'Tu remarqueras plus facilement le confort, la construction et les projets liés au mouvement.',accent:'#687785',dress:'#a9b5bd',hair:'#5a453b',skin:'#cb9272',symbol:'△'}
  ];

  let mounted=false,focused=null,compare=[],touchX=null;
  const byId=id=>cast.find(x=>x.id===id);

  function installCss(){
    if($('#hcCharacterInteractionStyles'))return;
    const s=document.createElement('style');
    s.id='hcCharacterInteractionStyles';
    s.textContent=`
      html,body{max-width:100%;overflow-x:hidden!important}
      #characters{overflow:hidden!important;contain:layout paint size;max-width:100vw!important}
      #characters .selection-wrap,#characters .selection-stage{overflow:hidden!important;max-width:100%!important}
      #characters.hc-casting .selection-art{opacity:.16;filter:saturate(.48) brightness(1.1);transform:scale(1.018)}
      #characters.hc-casting .hit-grid{pointer-events:none!important;opacity:0!important}
      #characters.hc-casting:not(.hc-native-profile) .profile-card,
      #characters.hc-casting:not(.hc-native-profile) .profile-dim{visibility:hidden!important;opacity:0!important;pointer-events:none!important}
      #characters.hc-casting.hc-native-profile .profile-card.open,
      #characters.hc-casting.hc-native-profile .profile-dim.open{visibility:visible!important;opacity:1!important;pointer-events:auto!important}
      .hc-cast{position:absolute;inset:0;width:100%;max-width:100%;overflow:hidden;contain:layout paint;z-index:5;pointer-events:none;background:linear-gradient(180deg,rgba(250,247,240,.58),rgba(250,247,240,.76) 68%,rgba(250,247,240,.94))}
      .hc-cast-head{position:absolute;left:8%;right:8%;top:3.2%;text-align:center;color:#383d3a;pointer-events:none}.hc-cast-head h2{font:400 clamp(30px,3.8vw,54px)/1 Georgia,serif;margin:0}.hc-cast-head p{margin:7px 0 0;font:11px Arial,sans-serif;letter-spacing:.08em;color:#707770}
      .hc-cast-viewport{position:absolute;left:0;right:0;top:12%;bottom:10%;overflow:hidden;pointer-events:none;contain:layout paint}
      .hc-cast-rail{position:absolute;inset:0;display:flex;align-items:flex-end;gap:8px;overflow-x:auto;overflow-y:hidden;padding:10px 39% 18px 4%;scroll-snap-type:x proximity;scrollbar-width:none;overscroll-behavior-x:contain;pointer-events:auto;touch-action:pan-x;max-width:100%;contain:layout paint}.hc-cast-rail::-webkit-scrollbar{display:none}
      .hc-person{flex:0 0 clamp(225px,24vw,320px);min-width:225px;height:99%;position:relative;border:0;background:transparent;cursor:pointer;scroll-snap-align:center;padding:0;transform-origin:50% 100%;transition:transform .24s,opacity .24s,filter .24s}.hc-person .fig{position:absolute;left:50%;bottom:58px;width:110%;height:93%;transform:translateX(-50%);transition:.24s;filter:drop-shadow(0 14px 14px rgba(55,45,35,.14))}.hc-person .tag{position:absolute;left:50%;bottom:3px;transform:translateX(-50%);min-width:155px;max-width:96%;padding:8px 11px;border-radius:17px;background:rgba(255,252,246,.94);border:1px solid rgba(62,62,55,.10);box-shadow:0 7px 18px rgba(50,40,30,.08);color:#424744}.hc-person .tag strong{font:21px Georgia,serif;font-weight:400}.hc-person .tag span{display:block;margin-top:2px;font:9px Arial,sans-serif;letter-spacing:.055em;text-transform:uppercase;color:#747b74;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.hc-person:hover,.hc-person:focus-visible,.hc-person.focused{transform:translateY(-13px) scale(1.08);z-index:3;outline:none}.hc-person.focused .fig{transform:translateX(-50%) translateY(-5px)}.hc-cast.has-focus .hc-person:not(.focused){opacity:.26;filter:saturate(.4)}
      .hc-focus{position:absolute;right:22px;top:14%;width:min(360px,32%);max-height:72%;overflow:auto;padding:18px;background:rgba(252,249,243,.97);border:1px solid rgba(70,64,55,.16);border-radius:20px;box-shadow:0 20px 55px rgba(45,35,28,.19);pointer-events:auto;transform:translateX(calc(100% + 48px));opacity:0;transition:.27s}.hc-focus.open{transform:none;opacity:1}.hc-focus-nav{display:flex;justify-content:space-between;align-items:center}.hc-icon{width:44px;height:44px;border-radius:50%;border:1px solid rgba(70,65,58,.17);background:#fffaf2;cursor:pointer;font-size:20px;touch-action:manipulation}.hc-focus h3{font:400 31px/1 Georgia,serif;margin:5px 0}.hc-focus .vibe{font:italic 13px Georgia,serif;color:#777065;margin-bottom:13px}.hc-focus-block{padding:10px 0;border-top:1px solid rgba(70,65,58,.11)}.hc-focus-block b{display:block;font:9px Arial,sans-serif;letter-spacing:.13em;text-transform:uppercase;color:#718071;margin-bottom:4px}.hc-focus-block p{margin:0;font:12px/1.42 Georgia,serif;color:#514c47}.hc-projection{background:#f0e8df;border-radius:12px;padding:10px!important;margin-top:5px;border:0!important}.hc-focus-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:12px}.hc-focus-actions button{min-height:46px;border-radius:11px;border:1px solid rgba(70,65,58,.18);background:#fffaf2;font:11px Arial,sans-serif;cursor:pointer;touch-action:manipulation}.hc-focus-actions .primary{grid-column:1/-1;background:#71806c;color:white;border:0;font:14px Georgia,serif}
      .hc-compare{position:absolute;left:4%;bottom:3%;min-height:46px;max-width:62%;display:flex;align-items:center;gap:7px;padding:6px 9px;border-radius:18px;background:rgba(255,252,246,.93);box-shadow:0 8px 25px rgba(50,40,30,.10);pointer-events:auto;opacity:0;transform:translateY(10px);transition:.2s}.hc-compare.open{opacity:1;transform:none}.hc-compare-chip{border:0;background:#e9eee5;border-radius:999px;padding:7px 10px;cursor:pointer;font:11px Arial,sans-serif}.hc-compare strong{font:11px Arial,sans-serif;font-weight:600;margin-right:3px}.hc-compare-panel{position:absolute;left:4%;bottom:12%;width:min(620px,66%);padding:13px;border-radius:18px;background:rgba(255,252,246,.98);box-shadow:0 18px 45px rgba(50,40,30,.15);pointer-events:auto;display:none}.hc-compare-panel.open{display:block}.hc-compare-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.hc-compare-col{padding:9px;border-radius:12px;background:#f5f0e8}.hc-compare-col b{font:17px Georgia,serif;font-weight:400}.hc-compare-col small{display:block;margin:4px 0 8px;font:9px Arial,sans-serif;color:#777}.hc-compare-col p{font:11px/1.35 Georgia,serif;margin:0}
      @media(max-width:820px){.hc-cast-head{top:4.5%}.hc-cast-head h2{font-size:30px}.hc-cast-head p{font-size:9px}.hc-cast-viewport{top:13%;bottom:24%}.hc-cast-rail{padding:10px 43% 12px 7%;gap:4px;scroll-snap-type:x mandatory}.hc-person{flex-basis:56vw;min-width:245px;height:100%}.hc-person .fig{width:118%;height:95%;bottom:55px}.hc-person .tag{min-width:160px}.hc-focus{left:10px;right:10px;top:auto;bottom:2%;width:auto;max-height:39%;border-radius:18px 18px 10px 10px;transform:translateY(calc(100% + 20px))}.hc-focus.open{transform:none}.hc-focus h3{font-size:25px}.hc-focus-block{display:none}.hc-focus .hc-projection{display:block}.hc-compare{left:10px;bottom:42%;max-width:calc(100% - 20px)}.hc-compare-panel{left:10px;right:10px;bottom:49%;width:auto;max-height:30%;overflow:auto}.hc-compare-grid{grid-template-columns:repeat(3,minmax(125px,1fr));overflow-x:auto}.hc-person:hover{transform:none}.hc-person.focused{transform:translateY(-8px) scale(1.07)}}
    `;
    document.head.appendChild(s);
  }

  function figure(c,i){
    const lean=i%3-1;
    return `<svg viewBox="0 0 180 470" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><ellipse cx="90" cy="451" rx="49" ry="7" fill="rgba(70,65,58,.12)"/><g transform="rotate(${lean} 90 245)"><path d="M55 79Q60 23 91 22q37 2 39 57l-8 43H60z" fill="${c.hair}"/><ellipse cx="91" cy="80" rx="27" ry="34" fill="${c.skin}"/><path d="M67 65q24-31 52-6q-12-28-30-25Q71 36 67 65" fill="${c.hair}"/><path d="M82 80q4 3 8 0m13 0q4 3 8 0" fill="none" stroke="#443b36" stroke-width="1.8" stroke-linecap="round"/><path d="M89 95q5 4 10 0" fill="none" stroke="#9a665e" stroke-width="1.8"/><path d="M81 112v22h21v-22" fill="${c.skin}"/><path d="M55 137q35-22 70 0l15 156q-42 24-96 0z" fill="${c.dress}" stroke="#55534e" stroke-width="1.4"/><path d="M57 143Q42 197 38 260m85-117q17 57 21 117" fill="none" stroke="${c.skin}" stroke-width="13" stroke-linecap="round"/><path d="M64 304l3 125m47-125l-1 125" stroke="#55504a" stroke-width="13" stroke-linecap="round"/><path d="M55 434h27m19 0h27" stroke="#3f3b38" stroke-width="9" stroke-linecap="round"/><circle cx="138" cy="147" r="16" fill="${c.accent}" opacity=".22"/><text x="138" y="153" text-anchor="middle" font-size="18" fill="${c.accent}">${c.symbol}</text></g></svg>`;
  }

  function centerPerson(id,smooth=true){
    const root=$('.hc-cast'),rail=$('.hc-cast-rail',root),b=$(`.hc-person[data-id="${id}"]`,root);
    if(!rail||!b)return;
    const max=Math.max(0,rail.scrollWidth-rail.clientWidth);
    const wanted=b.offsetLeft-(rail.clientWidth-b.offsetWidth)/2;
    const target=Math.max(0,Math.min(max,wanted));
    requestAnimationFrame(()=>rail.scrollTo({left:target,behavior:smooth?'smooth':'auto'}));
  }

  function renderFocus(){
    const root=$('.hc-cast'),box=$('.hc-focus',root),c=byId(focused);
    if(!box||!c)return;
    box.innerHTML=`<div class="hc-focus-nav"><button class="hc-icon" data-nav="-1">‹</button><span>${cast.indexOf(c)+1} / ${cast.length}</span><button class="hc-icon" data-nav="1">›</button></div><h3>${c.name}</h3><div class="vibe">${c.note}</div><div class="hc-focus-block"><b>Son regard</b><p>${c.strength}</p></div><div class="hc-focus-block"><b>Elle recherche</b><p>${c.dream}</p></div><div class="hc-focus-block hc-projection"><b>Et si je devenais elle ?</b><p>${c.projection}</p></div><div class="hc-focus-actions"><button data-compare>${compare.includes(c.id)?'Retirer':'Comparer'}</button><button data-close>Fermer</button><button class="primary" data-profile>Voir son portrait complet</button></div>`;
    $('[data-nav="-1"]',box).onclick=()=>move(-1);
    $('[data-nav="1"]',box).onclick=()=>move(1);
    $('[data-close]',box).onclick=clearFocus;
    $('[data-compare]',box).onclick=()=>toggleCompare(c.id);
    $('[data-profile]',box).onclick=()=>openNativeProfile(c.id);
  }

  function setFocus(id,scroll=true){
    focused=id;
    const root=$('.hc-cast');
    if(!root)return;
    root.classList.add('has-focus');
    $$('.hc-person',root).forEach(b=>b.classList.toggle('focused',b.dataset.id===id));
    $('.hc-focus',root)?.classList.add('open');
    renderFocus();
    if(scroll)centerPerson(id,true);
  }

  function clearFocus(){
    focused=null;
    const root=$('.hc-cast');
    if(!root)return;
    root.classList.remove('has-focus');
    $$('.hc-person',root).forEach(b=>b.classList.remove('focused'));
    $('.hc-focus',root)?.classList.remove('open');
  }

  function move(delta){
    let i=cast.findIndex(x=>x.id===focused);
    if(i<0)i=0;
    i=(i+delta+cast.length)%cast.length;
    setFocus(cast[i].id,true);
  }

  function toggleCompare(id){
    if(compare.includes(id))compare=compare.filter(x=>x!==id);
    else if(compare.length<3)compare.push(id);
    renderCompare();
    renderFocus();
  }

  function renderCompare(){
    const root=$('.hc-cast'),bar=$('.hc-compare',root),panel=$('.hc-compare-panel',root);
    if(!bar||!panel)return;
    bar.classList.toggle('open',compare.length>0);
    bar.innerHTML=compare.length?`<strong>Comparer</strong>${compare.map(id=>`<button class="hc-compare-chip" data-id="${id}">${byId(id).name} ×</button>`).join('')}${compare.length>1?'<button class="hc-compare-chip" data-show>Voir</button>':''}`:'';
    $$('[data-id]',bar).forEach(b=>b.onclick=()=>toggleCompare(b.dataset.id));
    $('[data-show]',bar)?.addEventListener('click',()=>panel.classList.toggle('open'));
    panel.innerHTML=`<div class="hc-compare-grid">${compare.map(id=>{const c=byId(id);return `<div class="hc-compare-col"><b>${c.name}</b><small>${c.note}</small><p>${c.strength}</p><p style="margin-top:7px">${c.projection}</p></div>`}).join('')}</div>`;
    if(compare.length<2)panel.classList.remove('open');
  }

  function openNativeProfile(id){
    const screen=$('#characters');
    if(!screen)return;
    screen.classList.add('hc-native-profile');
    const btn=$(`.char-hit[data-id="${id}"]`);
    if(btn)btn.click();
    else if(typeof window.openProfile==='function')window.openProfile(id);
  }

  function syncNativeProfile(){
    const screen=$('#characters'),card=$('#profileCard')||$('.profile-card');
    if(!screen)return;
    if(!card?.classList.contains('open'))screen.classList.remove('hc-native-profile');
  }

  function mount(){
    if(mounted)return;
    const screen=$('#characters'),stage=$('#characters .selection-stage');
    if(!screen||!stage)return;
    mounted=true;
    installCss();
    screen.classList.add('hc-casting');
    screen.classList.remove('hc-native-profile');
    $('.profile-card')?.classList.remove('open');
    $('.profile-dim')?.classList.remove('open');

    const root=document.createElement('div');
    root.className='hc-cast';
    root.innerHTML='<div class="hc-cast-head"><h2>Qui vas-tu devenir ?</h2><p>Choisis un regard, une sensibilité, une manière de créer.</p></div><div class="hc-cast-viewport"><div class="hc-cast-rail"></div></div><aside class="hc-focus"></aside><div class="hc-compare"></div><div class="hc-compare-panel"></div>';
    stage.appendChild(root);

    const rail=$('.hc-cast-rail',root);
    cast.forEach((c,i)=>{
      const b=document.createElement('button');
      b.className='hc-person';
      b.type='button';
      b.dataset.id=c.id;
      b.innerHTML=`<span class="fig">${figure(c,i)}</span><span class="tag"><strong>${c.name}</strong><span>${c.note}</span></span>`;
      b.addEventListener('mouseenter',()=>{if(!matchMedia('(pointer:coarse)').matches)setFocus(c.id,false)});
      b.addEventListener('click',()=>setFocus(c.id,true));
      rail.appendChild(b);
    });

    rail.addEventListener('touchstart',e=>touchX=e.touches[0]?.clientX,{passive:true});
    rail.addEventListener('touchend',e=>{if(touchX==null)return;const x=e.changedTouches[0]?.clientX,d=x-touchX;touchX=null;if(Math.abs(d)>55&&focused)move(d<0?1:-1)},{passive:true});

    const card=$('#profileCard')||$('.profile-card');
    if(card)new MutationObserver(syncNativeProfile).observe(card,{attributes:true,attributeFilter:['class']});

    document.addEventListener('keydown',e=>{
      if(!screen.classList.contains('active')||screen.classList.contains('hc-native-profile'))return;
      if(e.key==='ArrowRight')move(1);
      if(e.key==='ArrowLeft')move(-1);
      if(e.key==='Escape')clearFocus();
    });
    renderCompare();
  }

  function sync(){if($('#characters')?.classList.contains('active'))mount()}
  function boot(){const screen=$('#characters');if(!screen)return;new MutationObserver(sync).observe(screen,{attributes:true,attributeFilter:['class']});sync()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();