(function(){
  if(window.__HCClaraPortraitFullscreen)return;
  window.__HCClaraPortraitFullscreen=true;
  const $=(s,r=document)=>r.querySelector(s);

  function installCss(){
    if($('#hcClaraPortraitFullscreenStyles'))return;
    const st=document.createElement('style');
    st.id='hcClaraPortraitFullscreenStyles';
    st.textContent=`
      .hc-clara-book{position:fixed;inset:0;z-index:260;background:rgba(239,231,220,.74);backdrop-filter:blur(12px);display:none;place-items:center;padding:18px;opacity:0;transition:opacity .24s ease}
      .hc-clara-book.open{display:grid;opacity:1}
      .hc-clara-sheet{position:relative;width:min(1480px,96vw);height:min(860px,94vh);overflow:hidden;border-radius:34px;background:linear-gradient(90deg,#fffdf8 0 49.4%,#e2d6c7 49.55%,#f7f0e7 50%,#fffdf9 50.7% 100%);border:1px solid rgba(102,78,57,.13);box-shadow:0 35px 90px rgba(60,42,29,.24)}
      .hc-clara-sheet:before{content:'';position:absolute;inset:0;pointer-events:none;opacity:.24;background:radial-gradient(circle at 18% 18%,rgba(231,206,179,.38),transparent 24%),radial-gradient(circle at 82% 76%,rgba(220,205,186,.28),transparent 23%),radial-gradient(rgba(121,100,79,.16) .55px,transparent .55px);background-size:auto,auto,9px 9px;mix-blend-mode:multiply}
      .hc-clara-close{position:absolute;right:22px;top:20px;z-index:8;width:48px;height:48px;border-radius:50%;border:1px solid rgba(90,70,54,.16);background:rgba(255,253,249,.92);font:25px Georgia,serif;color:#4b433d;cursor:pointer;box-shadow:0 8px 22px rgba(60,45,33,.08)}
      .hc-clara-left{position:absolute;left:0;top:0;bottom:0;width:50%;padding:38px 42px 30px;display:grid;grid-template-rows:auto 1fr auto;overflow:hidden}
      .hc-clara-kicker{font:600 8px Arial,sans-serif;letter-spacing:.24em;color:#a67861;text-transform:uppercase}.hc-clara-title{margin:8px 0 0;font:400 clamp(48px,5vw,82px)/.9 Georgia,serif;letter-spacing:-.045em;color:#303531}.hc-clara-sub{margin:10px 0 0;font:italic 15px Georgia,serif;color:#9a6953}
      .hc-clara-hero{position:relative;min-height:0;margin-top:10px;overflow:hidden;border-radius:30px;background:radial-gradient(circle at 50% 32%,rgba(255,255,255,.98),rgba(250,241,230,.93) 58%,rgba(240,225,207,.94));border:1px solid rgba(188,132,99,.14)}
      .hc-clara-hero img{position:absolute;inset:2% 2% 0;width:96%;height:98%;object-fit:contain;object-position:50% 100%;mix-blend-mode:multiply;filter:drop-shadow(0 18px 16px rgba(83,52,36,.13)) saturate(1.035) contrast(1.02)}
      .hc-clara-hero:after{content:'01  ·  PERSONNAGE FINAL';position:absolute;left:19px;top:17px;font:600 6px Arial,sans-serif;letter-spacing:.18em;color:#a57762}
      .hc-clara-quote{margin-top:14px;padding:12px 15px;border-radius:15px;background:rgba(243,234,223,.84);font:italic 13px/1.45 Georgia,serif;color:#61584f;border:1px solid rgba(104,82,62,.06)}
      .hc-clara-right{position:absolute;left:50%;right:0;top:0;bottom:0;padding:42px 44px 34px;overflow:auto}.hc-clara-right::-webkit-scrollbar{width:8px}.hc-clara-right::-webkit-scrollbar-thumb{background:#ded1c1;border-radius:999px}
      .hc-clara-section{padding:0 0 22px;margin-bottom:22px;border-bottom:1px solid rgba(91,72,54,.11)}.hc-clara-section:last-child{border-bottom:0;margin-bottom:0}
      .hc-clara-section-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:15px}.hc-clara-section-head h3{margin:0;font:400 27px/1 Georgia,serif;color:#3b3733}.hc-clara-section-head span{font:600 6px Arial,sans-serif;letter-spacing:.18em;color:#9c7b68;text-transform:uppercase}
      .hc-clara-bio{font:400 14px/1.55 Georgia,serif;color:#514b45;max-width:700px}.hc-clara-chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}.hc-clara-chip{padding:7px 11px;border-radius:999px;background:#f2e8db;border:1px solid rgba(117,89,65,.07);font:10px Arial,sans-serif;letter-spacing:.04em;color:#795f50}
      .hc-clara-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.hc-clara-stat{padding:12px;border-radius:15px;background:#fbf7f0;border:1px solid rgba(102,79,60,.07)}.hc-clara-stat b{display:block;font:600 7px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#768772}.hc-clara-stat strong{display:block;margin-top:8px;font:400 24px Georgia,serif;color:#403a35}.hc-clara-bar{height:6px;margin-top:8px;border-radius:999px;background:#e8e0d5;overflow:hidden}.hc-clara-bar i{display:block;height:100%;background:linear-gradient(90deg,#87977f,#c6ab8a);border-radius:inherit}
      .hc-clara-gallery{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:12px}.hc-clara-card{position:relative;min-height:188px;border-radius:20px;overflow:hidden;background:linear-gradient(145deg,#fffaf3,#eee2d3);border:1px solid rgba(103,82,62,.08);box-shadow:0 9px 24px rgba(80,56,39,.055)}.hc-clara-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply;filter:saturate(1.02) contrast(1.02)}.hc-clara-card.full img{object-fit:contain;object-position:50% 100%;padding:8px}.hc-clara-card.crop img{object-position:50% 15%;transform:scale(1.35)}.hc-clara-card.detail img{object-position:50% 6%;transform:scale(1.62)}.hc-clara-card span{position:absolute;left:12px;bottom:11px;padding:6px 8px;border-radius:999px;background:rgba(255,252,247,.88);font:600 6px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#775e4e;backdrop-filter:blur(4px)}
      .hc-clara-look-row{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.hc-clara-look{min-height:124px;border-radius:18px;padding:14px;position:relative;overflow:hidden;border:1px solid rgba(103,82,62,.07);background:linear-gradient(145deg,#fbf4ea,#eee1d3)}.hc-clara-look:nth-child(2){background:linear-gradient(145deg,#f4f0eb,#d7d2cd)}.hc-clara-look:nth-child(3){background:linear-gradient(145deg,#efe9e4,#cfc6be)}.hc-clara-look b{font:400 17px Georgia,serif;color:#433d37}.hc-clara-look small{display:block;margin-top:5px;font:9px Arial,sans-serif;color:#8a7769;letter-spacing:.04em}.hc-clara-look:after{content:'✦';position:absolute;right:14px;bottom:10px;font-size:23px;color:#b79b78;opacity:.45}
      @media(max-width:900px){.hc-clara-book{padding:0}.hc-clara-sheet{width:100vw;height:100svh;border-radius:0}.hc-clara-left{width:44%;padding:28px 22px 24px}.hc-clara-right{left:44%;padding:34px 24px 26px}.hc-clara-title{font-size:45px}.hc-clara-gallery{grid-template-columns:1fr 1fr}.hc-clara-card{min-height:145px}.hc-clara-stats{grid-template-columns:1fr}.hc-clara-look-row{grid-template-columns:1fr}}
    `;
    document.head.appendChild(st);
  }

  function build(){
    if($('.hc-clara-book'))return $('.hc-clara-book');
    const clara=$('#characters .hc-person[data-id="clara"] .hc-clara-master');
    if(!clara)return null;
    const src=clara.src;
    const o=document.createElement('div');o.className='hc-clara-book';o.innerHTML=`
      <section class="hc-clara-sheet" role="dialog" aria-modal="true" aria-label="Portrait complet de Clara">
        <button class="hc-clara-close" type="button" aria-label="Fermer">×</button>
        <div class="hc-clara-left">
          <header><div class="hc-clara-kicker">DOSSIER PERSONNAGE · COLLECTION 01</div><h2 class="hc-clara-title">Clara</h2><p class="hc-clara-sub">Poétique · détails sensibles</p></header>
          <div class="hc-clara-hero"><img src="${src}" alt="Clara"></div>
          <div class="hc-clara-quote">« Faire de chaque finition un détail que l’on remarque seulement lorsqu’il manque. »</div>
        </div>
        <div class="hc-clara-right">
          <div class="hc-clara-section"><div class="hc-clara-section-head"><h3>Portrait créatif</h3><span>Signature</span></div><div class="hc-clara-bio">Clara regarde la mode comme une mémoire à construire. Elle préfère les volumes doux, les gestes précis et les pièces qui semblent simples jusqu’à ce qu’on s’approche. Son univers privilégie la sensibilité, les belles finitions et l’émotion discrète.</div><div class="hc-clara-chips"><span class="hc-clara-chip">Finitions délicates</span><span class="hc-clara-chip">Volumes doux</span><span class="hc-clara-chip">Émotion</span><span class="hc-clara-chip">Élégance quotidienne</span></div></div>
          <div class="hc-clara-section"><div class="hc-clara-section-head"><h3>Instinct créatif</h3><span>Départ</span></div><div class="hc-clara-stats"><div class="hc-clara-stat"><b>Sensibilité</b><strong>92</strong><div class="hc-clara-bar"><i style="width:92%"></i></div></div><div class="hc-clara-stat"><b>Précision</b><strong>86</strong><div class="hc-clara-bar"><i style="width:86%"></i></div></div><div class="hc-clara-stat"><b>Audace</b><strong>68</strong><div class="hc-clara-bar"><i style="width:68%"></i></div></div></div></div>
          <div class="hc-clara-section"><div class="hc-clara-section-head"><h3>Galerie personnage</h3><span>Visuels sélectionnés</span></div><div class="hc-clara-gallery"><div class="hc-clara-card full"><img src="${src}" alt="Silhouette de Clara"><span>Silhouette signature</span></div><div class="hc-clara-card crop"><img src="${src}" alt="Portrait de Clara"><span>Portrait</span></div><div class="hc-clara-card detail"><img src="${src}" alt="Détail du visage de Clara"><span>Détail</span></div></div></div>
          <div class="hc-clara-section"><div class="hc-clara-section-head"><h3>Vestiaire</h3><span>3 directions</span></div><div class="hc-clara-look-row"><div class="hc-clara-look"><b>Signature corail</b><small>Chemise ivoire · jupe corail · escarpins nude</small></div><div class="hc-clara-look"><b>Atelier noir</b><small>Version bureau plus graphique et structurée</small></div><div class="hc-clara-look"><b>Soirée</b><small>Robe noire longue · bijoux délicats · silhouette couture</small></div></div></div>
        </div>
      </section>`;
    document.body.appendChild(o);
    const close=()=>{o.classList.remove('open');setTimeout(()=>{o.style.display='none'},230)};
    $('.hc-clara-close',o).onclick=close;
    o.addEventListener('click',e=>{if(e.target===o)close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&o.classList.contains('open'))close()});
    return o;
  }

  function open(){installCss();const o=build();if(!o)return;o.style.display='grid';requestAnimationFrame(()=>o.classList.add('open'))}
  function boot(){installCss();document.addEventListener('click',e=>{const b=e.target.closest('#characters .hc-focus [data-profile]');if(!b)return;const focused=$('#characters .hc-person.focused');if(focused?.dataset.id!=='clara')return;e.preventDefault();e.stopImmediatePropagation();open()},true)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();