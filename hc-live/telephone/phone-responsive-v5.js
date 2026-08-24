/* Responsive shell for the realistic phone UI. Keeps the page itself fixed; only the phone screen scrolls. */
(function(){
'use strict';
function apply(){
  if(document.getElementById('hc-phone-responsive-v5'))return;
  const s=document.createElement('style');s.id='hc-phone-responsive-v5';s.textContent=`
html,body{height:100%;overflow:hidden!important}.page{height:100dvh!important;max-width:none!important;padding:0!important}.top{display:none!important}.shell{height:100dvh!important;min-height:0!important;display:grid!important;grid-template-columns:1fr!important;place-items:center!important;overflow:hidden!important}.phone-wrap{height:100dvh!important;min-height:0!important;width:100%!important;display:grid!important;place-items:center!important;padding:8px!important}.phone{width:min(480px,calc((100dvh - 16px)*.56),calc(100vw - 16px))!important;height:min(860px,calc(100dvh - 16px))!important;min-height:0!important;margin:0!important;border-radius:34px!important}.screen{min-height:0!important;overflow-y:auto!important;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}.dock{flex:0 0 auto!important;position:relative!important;z-index:50!important;pointer-events:auto!important}.dock button{pointer-events:auto!important;touch-action:manipulation!important}.phonebar{flex:0 0 auto!important}.side,.right{display:none!important}
@media (min-width:700px) and (max-width:1180px){.phone{width:min(560px,calc(100vw - 28px),calc((100dvh - 18px)*.66))!important;height:min(900px,calc(100dvh - 18px))!important}.phone-wrap{padding:9px!important}}
@media (max-width:699px){html,body,.page,.shell,.phone-wrap{height:100dvh!important}.phone-wrap{padding:0!important}.phone{width:100vw!important;height:100dvh!important;border:0!important;border-radius:0!important;box-shadow:none!important}.phonebar{padding-top:max(10px,env(safe-area-inset-top))!important;height:calc(44px + env(safe-area-inset-top))!important}.dock{padding-bottom:max(5px,env(safe-area-inset-bottom))!important;height:calc(64px + env(safe-area-inset-bottom))!important}}
@media (max-height:720px) and (min-width:700px){.phonebar{height:38px!important}.dock{height:58px!important}.hcr-top{height:45px!important}.hcr-stories{padding-top:8px!important;padding-bottom:7px!important}.hcr-ring{width:54px!important;height:54px!important}.hcr-story{flex-basis:60px!important}}
`;
  document.head.appendChild(s);
}
apply();
window.addEventListener('resize',apply,{passive:true});
})();