(function(){
  if(window.__HCCharacterFramePositionFix)return;
  window.__HCCharacterFramePositionFix=true;
  const st=document.createElement('style');
  st.id='hcCharacterFramePositionFixStyles';
  st.textContent=`
    @media (min-width:901px){
      /* Desktop / iPad: Clara stays completely inside her approved card. */
      #characters .hc-person[data-id='clara']{
        overflow:visible!important;
        transform:none!important;
      }
      #characters .hc-person[data-id='clara']:before{
        inset:0 0 10%!important;
        border-radius:30px 30px 22px 22px!important;
      }
      #characters .hc-person[data-id='clara'] .fig{
        left:0!important;
        top:0!important;
        width:100%!important;
        height:88%!important;
        transform:none!important;
        overflow:hidden!important;
        border-radius:29px 29px 18px 18px!important;
        clip-path:inset(0 round 29px 29px 18px 18px)!important;
      }
      #characters .hc-person[data-id='clara'] .fig .hc-clara-master{
        display:block!important;
        width:100%!important;
        height:100%!important;
        max-width:100%!important;
        max-height:100%!important;
        object-fit:contain!important;
        object-position:50% 100%!important;
        transform:none!important;
        border-radius:0!important;
        -webkit-mask-image:none!important;
        mask-image:none!important;
        mix-blend-mode:multiply!important;
        filter:drop-shadow(0 10px 10px rgba(82,51,35,.10)) saturate(1.02) contrast(1.015)!important;
      }
      #characters .hc-person[data-id='clara']:hover .fig,
      #characters .hc-person[data-id='clara'].focused .fig{
        transform:none!important;
      }
      #characters .hc-person[data-id='clara'] .fig:before{
        right:10px!important;
        top:13px!important;
      }
      #characters .hc-person[data-id='clara'] .tag{
        left:50%!important;
        bottom:0!important;
        width:100%!important;
        transform:translateX(-50%)!important;
        border-radius:20px!important;
      }
      /* Keep the whole casting composition aligned like the approved reference. */
      #characters .hc-cast-head{top:2.3%!important}
      #characters .hc-grid{top:15.5%!important;bottom:4.5%!important}
      #characters .hc-focus{top:11.5%!important;bottom:4.5%!important}
    }
  `;
  document.head.appendChild(st);
})();