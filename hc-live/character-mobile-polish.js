(function(){
  if(window.__HCCharacterMobilePolish)return;
  window.__HCCharacterMobilePolish=true;
  const $=(s,r=document)=>r.querySelector(s);
  function install(){
    if($('#hcCharacterMobilePolishStyles'))return;
    const st=document.createElement('style');
    st.id='hcCharacterMobilePolishStyles';
    st.textContent=`
      @media(max-width:900px){
        #characters{overflow:hidden!important;background:#fffaf3!important}
        #characters .selection-wrap,#characters .selection-stage,#characters .hc-cast{width:100vw!important;height:100svh!important;max-width:none!important;overflow:hidden!important}
        #characters .hc-page{inset:0!important;width:100%!important;height:100%!important;background:radial-gradient(circle at 18% 11%,rgba(239,220,196,.34),transparent 29%),linear-gradient(180deg,#fffdf9 0%,#fffaf5 100%)!important}
        #characters .hc-page:before{display:none!important}
        #characters .hc-cast-head{left:18px!important;right:18px!important;top:max(14px,env(safe-area-inset-top))!important;text-align:center!important;z-index:12!important}
        #characters .hc-cast-head:before{font-size:5.5px!important;letter-spacing:.19em!important;margin-bottom:4px!important}
        #characters .hc-cast-head h2{font-size:clamp(31px,8.8vw,48px)!important;line-height:.94!important;white-space:nowrap!important}
        #characters .hc-cast-head h2:after{display:none!important}
        #characters .hc-cast-head p{margin-top:6px!important;font-size:7px!important;letter-spacing:.08em!important}

        #characters .hc-grid{left:14px!important;right:14px!important;top:118px!important;bottom:18px!important;width:auto!important;display:grid!important;grid-template-columns:minmax(150px,1.45fr) repeat(3,minmax(96px,1fr))!important;grid-template-rows:repeat(4,minmax(138px,1fr))!important;grid-auto-flow:row!important;gap:12px!important;padding:8px 4px 24px!important;overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:none!important;overscroll-behavior:contain!important}
        #characters .hc-grid::-webkit-scrollbar{display:none!important}
        #characters .hc-person{min-height:138px!important;border-radius:22px!important;overflow:visible!important;transform:none!important}
        #characters .hc-person:before{inset:0 0 18px!important;border-radius:22px!important;background:linear-gradient(155deg,rgba(255,255,255,.91),rgba(247,237,224,.74))!important;border:1px solid rgba(125,96,71,.10)!important;box-shadow:0 8px 22px rgba(76,52,36,.055)!important}
        #characters .hc-person:after{top:10px!important;left:12px!important;font-size:13px!important}
        #characters .hc-person .fig{width:82%!important;height:76%!important;top:5%!important}
        #characters .hc-person .tag{bottom:0!important;width:96%!important;min-height:47px!important;padding:8px 5px 7px!important;border-radius:17px!important;background:rgba(246,235,220,.97)!important;box-shadow:0 7px 18px rgba(70,51,37,.055)!important}
        #characters .hc-person .tag strong{font-size:15px!important}
        #characters .hc-person .tag span{font-size:5.8px!important;max-width:94%!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
        #characters .hc-person:not([data-id='clara']) .tag:before{top:-15px!important;font-size:4.5px!important;padding:3px 5px!important}
        #characters .hc-person:not([data-id='clara']) .tag:after{display:none!important}

        #characters .hc-person[data-id='clara']{grid-column:1!important;grid-row:1 / 3!important;min-height:288px!important;z-index:6!important}
        #characters .hc-person[data-id='clara']:before{inset:0 0 19px!important;border-radius:34px 34px 24px 24px!important;background:radial-gradient(circle at 50% 34%,#fff 0 28%,#fbf3e8 54%,#f1dfca 100%)!important;border:1px solid rgba(184,126,93,.18)!important;box-shadow:0 18px 38px rgba(91,60,41,.11)!important}
        #characters .hc-person[data-id='clara']:after{top:13px!important;left:16px!important;font-size:26px!important;color:#c6a679!important}
        #characters .hc-person[data-id='clara'] .fig{width:126%!important;height:88%!important;top:1%!important;overflow:hidden!important;border-radius:30px 30px 18px 18px!important}
        #characters .hc-person[data-id='clara'] .fig:before{right:11px!important;top:13px!important;font-size:5px!important;letter-spacing:.12em!important}
        #characters .hc-person[data-id='clara'] .fig:after{display:none!important}
        #characters .hc-person[data-id='clara'] .fig .hc-clara-master{border-radius:30px 30px 18px 18px!important;object-position:50% 100%!important;mix-blend-mode:multiply!important;filter:drop-shadow(0 12px 11px rgba(82,51,35,.12)) saturate(1.03) contrast(1.02)!important}
        #characters .hc-person[data-id='clara'] .tag{width:102%!important;min-height:61px!important;padding:10px 7px 9px!important;border-radius:21px!important;background:linear-gradient(180deg,#f4e6d5,#edd9c2)!important}
        #characters .hc-person[data-id='clara'] .tag:before{top:-17px!important;font-size:4.7px!important}
        #characters .hc-person[data-id='clara'] .tag strong{font-size:20px!important}
        #characters .hc-person[data-id='clara'] .tag span{font-size:5.8px!important}
        #characters .hc-person:hover,#characters .hc-person:focus-visible,#characters .hc-person.focused{transform:none!important}
        #characters .hc-focus{display:none!important}
        #characters .hc-compare,#characters .hc-compare-panel{display:none!important}
        #hcReturnHome{left:max(10px,env(safe-area-inset-left))!important;top:max(10px,env(safe-area-inset-top))!important;padding:9px 13px!important;font-size:12px!important;box-shadow:0 6px 16px rgba(60,45,32,.10)!important}
      }

      @media(max-width:900px) and (orientation:landscape){
        #characters .hc-cast-head{top:9px!important;left:118px!important;right:18px!important}
        #characters .hc-cast-head:before{font-size:5px!important;margin-bottom:2px!important}
        #characters .hc-cast-head h2{font-size:36px!important}
        #characters .hc-cast-head p{font-size:6.5px!important;margin-top:3px!important}
        #characters .hc-grid{top:82px!important;bottom:10px!important;grid-template-columns:minmax(168px,1.35fr) repeat(4,minmax(105px,1fr))!important;grid-template-rows:repeat(3,minmax(130px,1fr))!important;gap:10px!important;padding-bottom:16px!important}
        #characters .hc-person[data-id='clara']{grid-row:1 / 3!important;min-height:270px!important}
        #characters .hc-person[data-id='clara'] .fig{height:87%!important;width:120%!important}
      }

      @media(max-width:560px) and (orientation:portrait){
        #characters .hc-cast-head{top:58px!important}
        #characters .hc-cast-head h2{font-size:36px!important}
        #characters .hc-grid{top:154px!important;grid-template-columns:minmax(145px,1.3fr) repeat(2,minmax(94px,1fr))!important;grid-template-rows:repeat(6,minmax(132px,1fr))!important}
        #characters .hc-person[data-id='clara']{grid-row:1 / 3!important;min-height:276px!important}
      }
    `;
    document.head.appendChild(st);
  }
  function boot(){install()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();