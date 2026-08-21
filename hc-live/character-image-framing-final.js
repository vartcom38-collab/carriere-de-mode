(function(){
  if(window.__HCCharacterImageFramingFinal)return;window.__HCCharacterImageFramingFinal=true;
  const s=document.createElement('style');s.id='hcCharacterImageFramingFinalStyles';s.textContent=`
    /* Ajustements finaux des visuels officiels dans leurs cartes. */
    #characters .hc-person[data-id='clara'] .fig .hc-clara-master{width:100%!important;height:100%!important;object-fit:contain!important;object-position:50% 100%!important;transform:none!important}
    #characters .hc-person[data-id='ines'] .fig .hc-ines-master{width:122%!important;height:100%!important;max-width:none!important;object-fit:contain!important;object-position:43% 100%!important;transform:translateX(-8%)!important}
    #characters .hc-person[data-id='maya'] .fig .hc-maya-master{width:100%!important;height:100%!important;object-fit:contain!important;object-position:50% 100%!important;transform:none!important}

    /* Dans la galerie, le cadre reste lié au même personnage et les marges parasites sont masquées. */
    .hc-portrait-hero-v2[data-id='ines'] img{width:118%!important;left:-9%!important;object-position:43% 100%!important}
    .hc-portrait-card-v2[data-id='ines'].full img{width:118%!important;left:-9%!important;object-position:43% 100%!important}
    .hc-portrait-card-v2[data-id='ines'].face img{width:118%!important;left:-9%!important;object-position:43% 10%!important;transform:scale(1.30)!important}
    .hc-portrait-card-v2[data-id='ines'].detail img{width:118%!important;left:-9%!important;object-position:43% 8%!important;transform:scale(1.52)!important}
  `;document.head.appendChild(s)
})();