(function(){
  if(window.__HCCharacterCastingStabilityV2)return;
  window.__HCCharacterCastingStabilityV2=true;
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  function css(){
    if($('#hcCharacterCastingStabilityV2Styles'))return;
    const s=document.createElement('style');
    s.id='hcCharacterCastingStabilityV2Styles';
    s.textContent=`
      /* La sélection appartient au clic. Le survol n'altère jamais le personnage choisi. */
      #characters .hc-cast.has-focus .hc-person:not(.focused),
      #characters .hc-person,
      #characters .hc-person .fig{opacity:1!important;filter:none!important}

      /* Une grille unique : même format, même présence, même rayon pour tout le casting. */
      #characters .hc-grid{grid-template-columns:repeat(6,minmax(0,1fr))!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:2.4% 1.35%!important;overflow:visible!important}
      #characters .hc-person,
      #characters .hc-person[data-id]{grid-column:auto!important;grid-row:auto!important;min-width:0!important;min-height:0!important;width:auto!important;height:auto!important;border-radius:22px!important;overflow:visible!important;transform-origin:50% 52%!important;transition:transform .22s cubic-bezier(.2,.78,.2,1),filter .22s ease!important;z-index:1!important}
      #characters .hc-person:before,
      #characters .hc-person[data-id]:before{inset:0!important;border-radius:22px!important;background:linear-gradient(155deg,rgba(255,255,255,.94),rgba(246,238,227,.91))!important;border:1px solid rgba(110,87,67,.105)!important;box-shadow:0 8px 20px rgba(65,47,33,.055),inset 0 1px rgba(255,255,255,.76)!important;transform:none!important}

      /* La zone visuelle est réellement contenue par la carte : aucun angle droit ne peut dépasser. */
      #characters .hc-person .fig,
      #characters .hc-person[data-id='clara'] .fig,
      #characters .hc-person[data-id='ines'] .fig,
      #characters .hc-person[data-id='maya'] .fig{position:absolute!important;left:5.5%!important;right:5.5%!important;top:4%!important;bottom:18%!important;width:auto!important;height:auto!important;transform:none!important;overflow:hidden!important;border-radius:18px!important;background:radial-gradient(circle at 50% 34%,#fffdf8 0 33%,#f8efe4 72%,#f1e5d7 100%)!important;filter:none!important}
      #characters .hc-person .fig>img,
      #characters .hc-person[data-id='clara'] .fig .hc-clara-master,
      #characters .hc-person[data-id='ines'] .fig .hc-ines-master,
      #characters .hc-person[data-id='maya'] .fig .hc-maya-master{display:block!important;width:100%!important;height:100%!important;max-width:100%!important;max-height:100%!important;object-fit:contain!important;object-position:50% 100%!important;border:0!important;border-radius:0!important;transform:none!important;filter:none!important;box-shadow:none!important;background:transparent!important}
      #characters .hc-person[data-id='clara'] .fig .hc-clara-master,
      #characters .hc-person[data-id='ines'] .fig .hc-ines-master{mix-blend-mode:multiply!important}
      #characters .hc-person[data-id='maya'] .fig .hc-maya-master{mix-blend-mode:normal!important}
      #characters .hc-person .fig>svg{display:block!important;width:100%!important;height:100%!important;opacity:1!important;filter:none!important}

      #characters .hc-person .tag,
      #characters .hc-person[data-id] .tag{left:4%!important;right:4%!important;bottom:3%!important;width:auto!important;min-height:12%!important;transform:none!important;padding:8px 6px 7px!important;border-radius:16px!important;background:rgba(246,236,222,.96)!important;border:1px solid rgba(111,85,63,.07)!important;box-shadow:none!important}
      #characters .hc-person .tag strong,#characters .hc-person[data-id] .tag strong{font:400 15px/1.05 Georgia,serif!important;color:#514840!important}
      #characters .hc-person .tag span,#characters .hc-person[data-id] .tag span{font:600 5.7px/1.15 Arial,sans-serif!important;letter-spacing:.075em!important;color:#937f70!important}
      #characters .hc-person[data-id='clara'] .fig:before,#characters .hc-person[data-id='clara'] .fig:after{display:none!important}

      /* Agrandissement de consultation sans changer la sélection ni déplacer la grille. */
      @media (hover:hover) and (pointer:fine){
        #characters .hc-person:hover{transform:translateY(-6px) scale(1.07)!important;z-index:55!important}
        #characters .hc-person:hover:before{box-shadow:0 22px 42px rgba(64,47,34,.15),inset 0 1px rgba(255,255,255,.82)!important;border-color:rgba(178,116,84,.20)!important}
      }
      #characters .hc-person.focused{transform:translateY(-6px) scale(1.075)!important;z-index:58!important}
      #characters .hc-person.focused:before{box-shadow:0 24px 46px rgba(64,47,34,.16),0 0 0 1px rgba(255,255,255,.60) inset!important;border-color:rgba(178,116,84,.24)!important}
      #characters .hc-person:hover .fig,#characters .hc-person.focused .fig,
      #characters .hc-person[data-id='clara']:hover .fig,#characters .hc-person[data-id='clara'].focused .fig,
      #characters .hc-person[data-id='ines']:hover .fig,#characters .hc-person[data-id='ines'].focused .fig,
      #characters .hc-person[data-id='maya']:hover .fig,#characters .hc-person[data-id='maya'].focused .fig{transform:none!important}

      /* Dossier de droite : portrait toujours lié au personnage sélectionné. */
      #characters .hc-focus>.hc-focus-header-final{display:none!important}
      #characters .hc-focus>.hc-focus-header-v2{display:grid;grid-template-columns:104px 1fr;gap:16px;align-items:center;padding:14px 0 15px;border-bottom:1px solid rgba(91,72,54,.12)}
      #characters .hc-focus-header-v2 .portrait{width:100px;height:100px;border-radius:50%;overflow:hidden;background:#f8efe4;border:1px solid rgba(174,123,92,.25);box-shadow:0 8px 22px rgba(78,56,40,.08)}
      #characters .hc-focus-header-v2 .portrait img{width:100%;height:100%;display:block;object-fit:cover;object-position:50% 13%;mix-blend-mode:multiply;transform:scale(1.20)}
      #characters .hc-focus-header-v2[data-id='ines'] .portrait img{object-position:50% 12%;transform:scale(1.33)}
      #characters .hc-focus-header-v2[data-id='maya'] .portrait img{object-position:50% 10%;transform:scale(1.34);mix-blend-mode:normal}
      #characters .hc-focus-header-v2 .portrait svg{width:100%;height:100%;display:block}
      #characters .hc-focus-header-v2 h3{margin:0 0 6px!important;font:400 36px/.95 Georgia,serif!important;color:#37342f!important}
      #characters .hc-focus-header-v2 p{margin:0;font:italic 13px/1.4 Georgia,serif;color:#906653}
      #characters .hc-focus>.hc-focus-header-v2~h3,#characters .hc-focus>.hc-focus-header-v2~.vibe{display:none!important}

      @media(max-width:900px){
        #characters .hc-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:none!important;grid-auto-rows:minmax(155px,1fr)!important;overflow:auto!important}
        #characters .hc-person.focused{transform:translateY(-3px) scale(1.035)!important}
      }
      @media (prefers-reduced-motion:reduce){#characters .hc-person,#characters .hc-person:before{transition:none!important}}
    `;
    document.head.appendChild(s);
  }

  function currentImage(card){
    if(!card)return null;
    const img=$('.fig img',card);
    if(img&&img.src&&!img.src.endsWith('#'))return {type:'img',src:img.src,alt:img.alt||card.dataset.id||''};
    const svg=$('.fig svg',card);
    return svg?{type:'svg',html:svg.outerHTML}:null;
  }

  function syncHeader(){
    const focus=$('#characters .hc-focus');
    const card=$('#characters .hc-person.focused');
    if(!focus||!focus.classList.contains('open')||!card)return;
    const nav=$('.hc-focus-nav',focus);if(!nav)return;
    $('.hc-focus-header-v2',focus)?.remove();
    const name=$('.tag strong',card)?.textContent?.trim()||card.dataset.id||'';
    const vibe=$('.tag span',card)?.textContent?.trim()||'';
    const visual=currentImage(card);
    const head=document.createElement('div');head.className='hc-focus-header-v2';head.dataset.id=card.dataset.id||'';
    const media=visual?.type==='img'?`<img src="${visual.src}" alt="${name}">`:visual?.type==='svg'?visual.html:'';
    head.innerHTML=`<div class="portrait">${media}</div><div><h3>${name}</h3><p>${vibe}</p></div>`;
    nav.insertAdjacentElement('afterend',head);
  }

  function schedule(){setTimeout(syncHeader,0);requestAnimationFrame(syncHeader)}

  function boot(){
    css();
    /* Neutralise uniquement l'ancien changement de sélection au survol. Le clic reste intact. */
    document.addEventListener('mouseenter',e=>{if(e.target?.closest?.('#characters .hc-person'))e.stopImmediatePropagation()},true);
    document.addEventListener('click',e=>{if(e.target.closest?.('#characters .hc-person,#characters .hc-focus-nav'))schedule()},true);
    document.addEventListener('keydown',e=>{if($('#characters')?.classList.contains('active')&&(e.key==='ArrowLeft'||e.key==='ArrowRight'))schedule()},true);
    setTimeout(syncHeader,120);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();