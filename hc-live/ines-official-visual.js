(function(){
  if(window.__HCInesApprovedCardV1)return;
  window.__HCInesApprovedCardV1=true;
  const $=(s,r=document)=>r.querySelector(s);
  const CARD='data:image/webp;base64,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[...TRUNCATED...]';

  function installCss(){
    if($('#hcInesApprovedCardStyles'))return;
    const s=document.createElement('style');
    s.id='hcInesApprovedCardStyles';
    s.textContent=`
      #characters .hc-person[data-id='ines']{
        position:relative!important;
        overflow:hidden!important;
        border-radius:30px!important;
        background:#fbf7ef!important;
      }
      #characters .hc-person[data-id='ines']::before,
      #characters .hc-person[data-id='ines']::after{
        display:none!important;
        content:none!important;
      }
      #characters .hc-person[data-id='ines'] > .fig,
      #characters .hc-person[data-id='ines'] > .tag{
        opacity:0!important;
        visibility:hidden!important;
        pointer-events:none!important;
      }
      #characters .hc-person[data-id='ines'] .hc-ines-approved-card{
        position:absolute!important;
        inset:0!important;
        width:100%!important;
        height:100%!important;
        display:block!important;
        object-fit:fill!important;
        border:0!important;
        border-radius:inherit!important;
        background:#fbf7ef!important;
        pointer-events:none!important;
        z-index:20!important;
        transform:none!important;
        filter:none!important;
      }
      #characters .hc-person[data-id='ines']:hover .hc-ines-approved-card,
      #characters .hc-person[data-id='ines'].focused .hc-ines-approved-card,
      #characters .hc-person[data-id='ines'].selected .hc-ines-approved-card{
        transform:none!important;
        filter:none!important;
      }
    `;
    document.head.appendChild(s);
  }

  function apply(){
    installCss();
    const card=$('#characters .hc-person[data-id="ines"]');
    if(!card)return;
    let img=$('.hc-ines-approved-card',card);
    if(!img){
      img=document.createElement('img');
      img.className='hc-ines-approved-card';
      img.alt='Inès';
      img.decoding='async';
      img.loading='eager';
      card.appendChild(img);
    }
    if(img.src!==CARD)img.src=CARD;
  }

  function boot(){
    apply();
    const root=$('#characters')||document.documentElement;
    new MutationObserver(apply).observe(root,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
