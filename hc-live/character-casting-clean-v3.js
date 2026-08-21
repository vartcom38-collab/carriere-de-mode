(function(){
  if(window.__HCCharacterCastingCleanV3)return;window.__HCCharacterCastingCleanV3=true;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  let lockedId=null,restoring=false;
  function css(){
    if($('#hcCharacterCastingCleanV3Styles'))return;
    const s=document.createElement('style');s.id='hcCharacterCastingCleanV3Styles';s.textContent=`
      /* CASTING V3 — une seule géométrie pour toutes les cartes */
      html body #characters .hc-grid{grid-template-columns:repeat(6,minmax(0,1fr))!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:2.5% 1.35%!important;overflow:visible!important}
      html body #characters .hc-person,html body #characters .hc-person[data-id]{grid-column:auto!important;grid-row:auto!important;position:relative!important;width:auto!important;height:auto!important;min-width:0!important;min-height:0!important;border-radius:22px!important;overflow:visible!important;opacity:1!important;filter:none!important;transform-origin:50% 52%!important;z-index:1!important}
      html body #characters .hc-person:before,html body #characters .hc-person[data-id]:before{inset:0!important;border-radius:22px!important;background:linear-gradient(155deg,#fffdfa,#f6ecdf)!important;border:1px solid rgba(105,82,62,.11)!important;box-shadow:0 8px 22px rgba(67,49,35,.055),inset 0 1px rgba(255,255,255,.8)!important;transform:none!important}
      html body #characters .hc-person:after,html body #characters .hc-person[data-id]:after{top:4.2%!important;left:7%!important;font-size:17px!important;color:#b89b76!important;z-index:8!important}

      /* Aucun personnage n'est grisé. */
      html body #characters .hc-cast.has-focus .hc-person:not(.focused),html body #characters .hc-person .fig,html body #characters .hc-person:not([data-id='clara']) .fig,html body #characters .hc-person .fig>svg{opacity:1!important;filter:none!important}

      /* Même fenêtre d'image, réellement masquée par des coins arrondis. */
      html body #characters .hc-person .fig,html body #characters .hc-person[data-id='clara'] .fig,html body #characters .hc-person[data-id='ines'] .fig,html body #characters .hc-person[data-id='maya'] .fig{position:absolute!important;left:5%!important;right:5%!important;top:4%!important;bottom:19%!important;width:auto!important;height:auto!important;overflow:hidden!important;border-radius:18px!important;transform:none!important;background:radial-gradient(circle at 50% 34%,#fffdfa 0 38%,#f8eee2 74%,#f1e3d3 100%)!important;box-shadow:inset 0 0 0 1px rgba(113,88,67,.045)!important}
      html body #characters .hc-person .fig:before,html body #characters .hc-person .fig:after{display:none!important}
      html body #characters .hc-person .fig>img,html body #characters .hc-person[data-id='clara'] .fig .hc-clara-master,html body #characters .hc-person[data-id='ines'] .fig .hc-ines-master,html body #characters .hc-person[data-id='maya'] .fig .hc-maya-master{position:absolute!important;inset:0!important;display:block!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:contain!important;object-position:50% 100%!important;border:0!important;border-radius:0!important;box-shadow:none!important;filter:none!important;background:transparent!important;transform-origin:50% 100%!important}
      html body #characters .hc-person[data-id='clara'] .fig .hc-clara-master{transform:scale(1.16)!important;mix-blend-mode:multiply!important}
      html body #characters .hc-person[data-id='ines'] .fig .hc-ines-master{transform:translateX(-2%) scale(1.12)!important;mix-blend-mode:multiply!important}
      html body #characters .hc-person[data-id='maya'] .fig .hc-maya-master{transform:scale(1.04)!important;mix-blend-mode:normal!important}
      html body #characters .hc-person .fig>svg{width:100%!important;height:100%!important;transform:none!important}

      /* Le nom fait partie de la carte, il n'est plus un bloc flottant extérieur. */
      html body #characters .hc-person .tag,html body #characters .hc-person[data-id] .tag{left:4%!important;right:4%!important;bottom:3%!important;width:auto!important;min-height:12.5%!important;padding:8px 6px 7px!important;transform:none!important;border-radius:16px!important;overflow:hidden!important;background:linear-gradient(180deg,#f4e8d8,#f1e1cd)!important;border:1px solid rgba(112,86,64,.08)!important;box-shadow:none!important;text-align:center!important}
      html body #characters .hc-person .tag:before,html body #characters .hc-person .tag:after{display:none!important}
      html body #characters .hc-person .tag strong,html body #characters .hc-person[data-id] .tag strong{font:400 15px/1.05 Georgia,serif!important;color:#514840!important}
      html body #characters .hc-person .tag span,html body #characters .hc-person[data-id] .tag span{font:600 5.7px/1.15 Arial,sans-serif!important;letter-spacing:.075em!important;color:#927d6e!important}

      /* Hover = consultation uniquement. Sélection = clic uniquement. */
      @media (hover:hover) and (pointer:fine){html body #characters .hc-person:hover{transform:translateY(-6px) scale(1.07)!important;z-index:60!important}html body #characters .hc-person:hover:before{box-shadow:0 24px 48px rgba(65,47,34,.16),inset 0 1px rgba(255,255,255,.85)!important;border-color:rgba(176,115,83,.22)!important}}
      html body #characters .hc-person.focused{transform:translateY(-6px) scale(1.075)!important;z-index:62!important}
      html body #characters .hc-person.focused:before{box-shadow:0 25px 50px rgba(65,47,34,.16),0 0 0 1px rgba(255,255,255,.55) inset!important;border-color:rgba(176,115,83,.26)!important}
      html body #characters .hc-person:hover .fig,html body #characters .hc-person.focused .fig{transform:none!important}

      /* Portrait du dossier : même personnage que celui verrouillé au clic. */
      html body #characters .hc-focus-header-v2 .portrait{overflow:hidden!important;border-radius:50%!important;background:#f8eee2!important}
      html body #characters .hc-focus-header-v2 .portrait img{width:100%!important;height:100%!important;object-fit:cover!important;object-position:50% 14%!important;mix-blend-mode:multiply!important}
      html body #characters .hc-focus-header-v2[data-id='clara'] .portrait img{transform:scale(1.22)!important;object-position:50% 12%!important}
      html body #characters .hc-focus-header-v2[data-id='ines'] .portrait img{transform:scale(1.38)!important;object-position:48% 10%!important}
      html body #characters .hc-focus-header-v2[data-id='maya'] .portrait img{transform:scale(1.30)!important;object-position:50% 8%!important;mix-blend-mode:normal!important}

      /* Galerie : cadrages dédiés, jamais le même crop aveugle partout. */
      .hc-portrait-v2 .hc-portrait-hero-v2{overflow:hidden!important;border-radius:26px!important}
      .hc-portrait-v2 .hc-portrait-hero-v2 img{object-fit:contain!important;object-position:50% 100%!important;transform:none!important}
      .hc-portrait-v2 .hc-portrait-hero-v2[data-id='clara'] img{transform:scale(1.06)!important}
      .hc-portrait-v2 .hc-portrait-hero-v2[data-id='ines'] img{transform:translateX(-2%) scale(1.04)!important}
      .hc-portrait-v2 .hc-portrait-card-v2{overflow:hidden!important;border-radius:18px!important}
      .hc-portrait-v2 .hc-portrait-card-v2.full img{object-fit:contain!important;object-position:50% 100%!important;transform:none!important;padding:8px!important}
      .hc-portrait-v2 .hc-portrait-card-v2.face[data-id='clara'] img{object-position:50% 9%!important;transform:scale(1.62)!important}
      .hc-portrait-v2 .hc-portrait-card-v2.detail[data-id='clara'] img{object-position:50% 7%!important;transform:scale(2.02)!important}
      .hc-portrait-v2 .hc-portrait-card-v2.face[data-id='ines'] img{object-position:48% 7%!important;transform:scale(1.75)!important}
      .hc-portrait-v2 .hc-portrait-card-v2.detail[data-id='ines'] img{object-position:48% 6%!important;transform:scale(2.18)!important}
      .hc-portrait-v2 .hc-portrait-card-v2.face[data-id='maya'] img{object-position:50% 7%!important;transform:scale(1.58)!important}
      .hc-portrait-v2 .hc-portrait-card-v2.detail[data-id='maya'] img{object-position:50% 6%!important;transform:scale(2)!important}

      @media(max-width:900px){html body #characters .hc-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:none!important;grid-auto-rows:minmax(155px,1fr)!important}html body #characters .hc-person.focused{transform:translateY(-3px) scale(1.035)!important}}
    `;document.head.appendChild(s)
  }
  function card(id){return $(`#characters .hc-person[data-id="${id}"]`)}
  function selectLocked(){
    if(!lockedId||restoring)return;const c=card(lockedId);if(!c||c.classList.contains('focused'))return;
    restoring=true;c.click();setTimeout(()=>{restoring=false},0)
  }
  function boot(){
    css();
    const root=$('#characters');if(!root)return;
    /* Premier clic réel = verrouillage du personnage. Le passage de souris ne peut plus changer durablement la fiche. */
    document.addEventListener('click',e=>{const c=e.target.closest?.('#characters .hc-person');if(c&&!restoring)lockedId=c.dataset.id||lockedId},true);
    ['mouseenter','mouseover','pointerover'].forEach(type=>document.addEventListener(type,e=>{const c=e.target.closest?.('#characters .hc-person');if(!c||!lockedId||c.dataset.id===lockedId)return;queueMicrotask(selectLocked)},true));
    document.addEventListener('click',e=>{if(e.target.closest?.('#characters .hc-focus-nav'))setTimeout(()=>{const f=$('#characters .hc-person.focused');if(f)lockedId=f.dataset.id},0)},true);
    setTimeout(()=>{const f=$('#characters .hc-person.focused');if(f)lockedId=f.dataset.id},120)
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();