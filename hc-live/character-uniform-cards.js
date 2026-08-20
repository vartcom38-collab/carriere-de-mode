(function(){
  if(window.__HCCharacterUniformCards)return;
  window.__HCCharacterUniformCards=true;
  const style=document.createElement('style');
  style.id='hcCharacterUniformCardsStyles';
  style.textContent=`
    /* Casting uniforme : chaque personnage a exactement le même poids visuel au repos. */
    #characters .hc-person .fig,
    #characters .hc-person:not([data-id='clara']) .fig{opacity:1!important;filter:none!important}
    #characters .hc-person:not([data-id='clara']):hover .fig,
    #characters .hc-person:not([data-id='clara']).focused .fig{opacity:1!important;filter:none!important}
    #characters .hc-cast.has-focus .hc-person:not(.focused){opacity:1!important;filter:none!important}

    /* Même format de carte pour Clara, Inès, Maya et tous les personnages. */
    #characters .hc-grid{grid-template-columns:repeat(6,minmax(0,1fr))!important;grid-template-rows:repeat(2,minmax(0,1fr))!important}
    #characters .hc-person,
    #characters .hc-person[data-id='clara'],
    #characters .hc-person[data-id='ines'],
    #characters .hc-person[data-id='maya']{
      grid-column:auto!important;grid-row:auto!important;width:auto!important;height:auto!important;min-width:0!important;min-height:0!important;border-radius:21px!important;overflow:visible!important;transform:translateZ(0)!important;transform-origin:50% 52%!important;transition:transform .22s cubic-bezier(.2,.8,.2,1),filter .22s ease,opacity .22s ease!important
    }
    #characters .hc-person:before,
    #characters .hc-person[data-id='clara']:before,
    #characters .hc-person[data-id='ines']:before,
    #characters .hc-person[data-id='maya']:before{
      inset:1% 2% 12%!important;border-radius:21px!important;transition:box-shadow .22s ease,border-color .22s ease,background .22s ease!important
    }
    #characters .hc-person .fig,
    #characters .hc-person[data-id='clara'] .fig,
    #characters .hc-person[data-id='ines'] .fig,
    #characters .hc-person[data-id='maya'] .fig{
      width:82%!important;height:73%!important;top:3%!important;overflow:hidden!important;border-radius:19px!important;transform:translateX(-50%)!important;transition:transform .22s cubic-bezier(.2,.8,.2,1)!important
    }
    #characters .hc-person[data-id='clara'] .fig .hc-clara-master,
    #characters .hc-person[data-id='ines'] .fig img,
    #characters .hc-person[data-id='ines'] .fig .hc-ines-master,
    #characters .hc-person[data-id='maya'] .fig img,
    #characters .hc-person[data-id='maya'] .fig .hc-maya-master{
      width:100%!important;height:100%!important;object-fit:contain!important;object-position:50% 100%!important;border-radius:19px!important;max-width:100%!important;max-height:100%!important
    }
    #characters .hc-person .tag,
    #characters .hc-person[data-id='clara'] .tag,
    #characters .hc-person[data-id='ines'] .tag,
    #characters .hc-person[data-id='maya'] .tag{
      bottom:0!important;width:94%!important;min-height:0!important;padding:8px 5px 7px!important;border-radius:18px!important
    }
    #characters .hc-person .tag strong,
    #characters .hc-person[data-id='clara'] .tag strong,
    #characters .hc-person[data-id='ines'] .tag strong,
    #characters .hc-person[data-id='maya'] .tag strong{font-size:14.5px!important}
    #characters .hc-person .tag span,
    #characters .hc-person[data-id='clara'] .tag span,
    #characters .hc-person[data-id='ines'] .tag span,
    #characters .hc-person[data-id='maya'] .tag span{font-size:5.8px!important;letter-spacing:.08em!important}
    #characters .hc-person[data-id='clara']:after,
    #characters .hc-person[data-id='ines']:after,
    #characters .hc-person[data-id='maya']:after{top:5%!important;left:8%!important;font-size:17px!important}
    #characters .hc-person[data-id='clara'] .fig:before,#characters .hc-person[data-id='clara'] .fig:after{display:none!important}
    #characters .hc-person[data-id='clara']:hover .fig,#characters .hc-person[data-id='clara'].focused .fig,
    #characters .hc-person[data-id='ines']:hover .fig,#characters .hc-person[data-id='ines'].focused .fig,
    #characters .hc-person[data-id='maya']:hover .fig,#characters .hc-person[data-id='maya'].focused .fig{transform:translateX(-50%)!important}

    /* Agrandissement de consultation : la grille ne bouge pas, seule la carte passe devant. */
    @media (hover:hover) and (pointer:fine){
      #characters .hc-person:hover{transform:translateY(-7px) scale(1.105)!important;z-index:40!important}
      #characters .hc-person:hover:before{border-color:rgba(181,118,85,.22)!important;box-shadow:0 22px 44px rgba(71,50,35,.15),inset 0 1px rgba(255,255,255,.78)!important;background:linear-gradient(155deg,rgba(255,255,255,.96),rgba(247,237,224,.82))!important}
    }
    #characters .hc-person.focused{transform:translateY(-7px) scale(1.105)!important;z-index:42!important}
    #characters .hc-person.focused:before{border-color:rgba(181,118,85,.25)!important;box-shadow:0 24px 48px rgba(71,50,35,.16),0 0 0 1px rgba(255,255,255,.55) inset!important;background:linear-gradient(155deg,rgba(255,255,255,.98),rgba(246,235,221,.88))!important}

    @media (min-width:980px), (min-width:768px) and (min-height:900px){
      html body #characters .hc-grid{grid-template-columns:repeat(6,minmax(0,1fr))!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:2.6% 1.4%!important}
      html body #characters .hc-person,
      html body #characters .hc-person[data-id='clara'],
      html body #characters .hc-person[data-id='ines'],
      html body #characters .hc-person[data-id='maya']{grid-column:auto!important;grid-row:auto!important}
      html body #characters .hc-person .fig,
      html body #characters .hc-person[data-id='clara'] .fig,
      html body #characters .hc-person[data-id='ines'] .fig,
      html body #characters .hc-person[data-id='maya'] .fig{width:82%!important;height:73%!important;top:3%!important;opacity:1!important;filter:none!important}
    }

    @media(max-width:900px){
      #characters .hc-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:none!important;grid-auto-rows:minmax(150px,1fr)!important}
      #characters .hc-person,
      #characters .hc-person[data-id='clara'],
      #characters .hc-person[data-id='ines'],
      #characters .hc-person[data-id='maya']{grid-column:auto!important;grid-row:auto!important;min-height:150px!important}
      #characters .hc-person.focused{transform:translateY(-3px) scale(1.045)!important;z-index:42!important}
    }

    @media (prefers-reduced-motion:reduce){#characters .hc-person,#characters .hc-person:before,#characters .hc-person .fig{transition:none!important}}
  `;
  document.head.appendChild(style);
})();