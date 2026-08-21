(function(){
  if(window.__HCInesApprovedLayout)return;
  window.__HCInesApprovedLayout=true;
  const $=(s,r=document)=>r.querySelector(s);

  function install(){
    if($('#hcInesApprovedLayoutStyles'))return;
    const s=document.createElement('style');
    s.id='hcInesApprovedLayoutStyles';
    s.textContent=`
      #characters .hc-person[data-id='ines']{
        overflow:hidden!important;
        background:linear-gradient(180deg,#fffaf2 0%,#fbf5eb 72%,#f6eadb 100%)!important;
      }
      #characters .hc-person[data-id='ines'] .fig{
        width:124%!important;
        height:84%!important;
        left:50%!important;
        top:2.5%!important;
        transform:translateX(-50%)!important;
        overflow:hidden!important;
        border-radius:24px 24px 16px 16px!important;
        background:transparent!important;
      }
      #characters .hc-person[data-id='ines'] .fig img{
        display:block!important;
        width:100%!important;
        height:100%!important;
        max-width:none!important;
        max-height:none!important;
        object-fit:contain!important;
        object-position:50% 100%!important;
        transform:scale(1.18) translateY(2.8%)!important;
        transform-origin:50% 100%!important;
        background:transparent!important;
        border-radius:0!important;
        filter:none!important;
      }
      #characters .hc-person[data-id='ines']:hover .fig,
      #characters .hc-person[data-id='ines'].focused .fig,
      #characters .hc-person[data-id='ines'].selected .fig{
        transform:translateX(-50%)!important;
      }
      #characters .hc-person[data-id='ines'] .tag{
        z-index:12!important;
      }
      #characters .hc-person[data-id='ines'] .tag:before{
        z-index:14!important;
      }
    `;
    document.head.appendChild(s);
  }

  function apply(){
    install();
    const card=$('#characters .hc-person[data-id="ines"]');
    if(!card)return;
    const strong=$('.tag strong',card); if(strong)strong.textContent='Inès';
    const span=$('.tag span',card); if(span)span.textContent='SOLAIRE · COULEUR & MOUVEMENT';
  }

  function boot(){
    apply();
    const root=$('#characters')||document.documentElement;
    new MutationObserver(apply).observe(root,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
