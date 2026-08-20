(function(){
  if(window.__HCCharacterUniformCards)return;
  window.__HCCharacterUniformCards=true;
  const style=document.createElement('style');
  style.id='hcCharacterUniformCardsStyles';
  style.textContent=`
    /* Tous les personnages gardent la même présence visuelle : pas de grisage ni de baisse d'opacité. */
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
    @media (min-width:980px), (min-width:768px) and (min-height:900px){
      html body #characters .hc-person:not([data-id='clara']) .fig{
        opacity:1!important;
        filter:none!important;
      }
    }
  `;
  document.head.appendChild(style);
})();