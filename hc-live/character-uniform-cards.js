(function(){
  if(window.__HCCharacterUniformCards)return;
  window.__HCCharacterUniformCards=true;
  const style=document.createElement('style');
  style.id='hcCharacterUniformCardsStyles';
  style.textContent=`
    /* Casting uniforme : chaque personnage a exactement le même poids visuel. */
    #characters .hc-person .fig,
    #characters .hc-person:not([data-id='clara']) .fig{
      opacity:1!important;
      filter:none!important;
    }
    #characters .hc-person:not([data-id='clara']):hover .fig,
    #characters .hc-person:not([data-id='clara']).focused .fig{
      opacity:1!important;
      filter:none!important;
    }
    #characters .hc-cast.has-focus .hc-person:not(.focused){
      opacity:1!important;
      filter:none!important;
    }

    /* Même format de carte pour Clara, Inès et tous les personnages. */
    #characters .hc-grid{
      grid-template-columns:repeat(6,minmax(0,1fr))!important;
      grid-template-rows:repeat(2,minmax(0,1fr))!important;
    }
    #characters .hc-person,
    #characters .hc-person[data-id='clara'],
    #characters .hc-person[data-id='ines']{
      grid-column:auto!important;
      grid-row:auto!important;
      width:auto!important;
      height:auto!important;
      min-width:0!important;
      min-height:0!important;
      border-radius:21px!important;
      overflow:visible!important;
    }
    #characters .hc-person:before,
    #characters .hc-person[data-id='clara']:before,
    #characters .hc-person[data-id='ines']:before{
      inset:1% 2% 12%!important;
      border-radius:21px!important;
    }
    #characters .hc-person .fig,
    #characters .hc-person[data-id='clara'] .fig,
    #characters .hc-person[data-id='ines'] .fig{
      width:82%!important;
      height:73%!important;
      top:3%!important;
      overflow:hidden!important;
      border-radius:19px!important;
      transform:translateX(-50%)!important;
    }
    #characters .hc-person[data-id='clara'] .fig .hc-clara-master,
    #characters .hc-person[data-id='ines'] .fig img,
    #characters .hc-person[data-id='ines'] .fig .hc-ines-master{
      width:100%!important;
      height:100%!important;
      object-fit:contain!important;
      object-position:50% 100%!important;
      border-radius:19px!important;
      max-width:100%!important;
      max-height:100%!important;
    }
    #characters .hc-person .tag,
    #characters .hc-person[data-id='clara'] .tag,
    #characters .hc-person[data-id='ines'] .tag{
      bottom:0!important;
      width:94%!important;
      min-height:0!important;
      padding:8px 5px 7px!important;
      border-radius:18px!important;
    }
    #characters .hc-person .tag strong,
    #characters .hc-person[data-id='clara'] .tag strong,
    #characters .hc-person[data-id='ines'] .tag strong{
      font-size:14.5px!important;
    }
    #characters .hc-person .tag span,
    #characters .hc-person[data-id='clara'] .tag span,
    #characters .hc-person[data-id='ines'] .tag span{
      font-size:5.8px!important;
      letter-spacing:.08em!important;
    }
    #characters .hc-person[data-id='clara']:after,
    #characters .hc-person[data-id='ines']:after{
      top:5%!important;
      left:8%!important;
      font-size:17px!important;
    }
    #characters .hc-person[data-id='clara'] .fig:before,
    #characters .hc-person[data-id='clara'] .fig:after{
      display:none!important;
    }
    #characters .hc-person[data-id='clara']:hover .fig,
    #characters .hc-person[data-id='clara'].focused .fig,
    #characters .hc-person[data-id='ines']:hover .fig,
    #characters .hc-person[data-id='ines'].focused .fig{
      transform:translateX(-50%)!important;
    }

    @media (min-width:980px), (min-width:768px) and (min-height:900px){
      html body #characters .hc-grid{
        grid-template-columns:repeat(6,minmax(0,1fr))!important;
        grid-template-rows:repeat(2,minmax(0,1fr))!important;
        gap:2.6% 1.4%!important;
      }
      html body #characters .hc-person,
      html body #characters .hc-person[data-id='clara'],
      html body #characters .hc-person[data-id='ines']{
        grid-column:auto!important;
        grid-row:auto!important;
      }
      html body #characters .hc-person .fig,
      html body #characters .hc-person[data-id='clara'] .fig,
      html body #characters .hc-person[data-id='ines'] .fig{
        width:82%!important;
        height:73%!important;
        top:3%!important;
        opacity:1!important;
        filter:none!important;
      }
    }

    @media(max-width:900px){
      #characters .hc-grid{
        grid-template-columns:repeat(3,minmax(0,1fr))!important;
        grid-template-rows:none!important;
        grid-auto-rows:minmax(150px,1fr)!important;
      }
      #characters .hc-person,
      #characters .hc-person[data-id='clara'],
      #characters .hc-person[data-id='ines']{
        grid-column:auto!important;
        grid-row:auto!important;
        min-height:150px!important;
      }
    }
  `;
  document.head.appendChild(style);
})();