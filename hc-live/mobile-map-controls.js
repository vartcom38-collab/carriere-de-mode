(function(){
  if(window.__HCMobileMapControlsInstalled)return;window.__HCMobileMapControlsInstalled=true;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  function injectCss(){if($('#hcMobileMapControlsStyles'))return;const st=document.createElement('style');st.id='hcMobileMapControlsStyles';st.textContent=`
  @media(max-width:850px), (pointer:coarse){
    #location .france-zone{min-height:520px;touch-action:pan-y;overscroll-behavior:contain}
    .hc-ain-map,.hc-bourg-map{touch-action:pan-y;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
    .hc-ain-hotspot,.hc-bourg-hotspot{width:76px!important;height:76px!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent}
    .hc-ain-hotspot .sketch,.hc-bourg-hotspot .draw{width:38px!important;height:38px!important;font-size:19px!important}
    .hc-ain-hotspot .label,.hc-bourg-hotspot .name{font-size:12px!important;padding:4px 7px!important;max-width:150px;white-space:normal!important;text-align:center;line-height:1.15}
    .hc-ain-observe,.hc-bourg-observe{min-height:44px;min-width:44px;padding:10px 12px!important;font-size:12px!important;touch-action:manipulation}
    .hc-ain-sheet,.hc-bourg-sheet{position:fixed!important;left:8px!important;right:8px!important;bottom:max(8px,env(safe-area-inset-bottom))!important;width:auto!important;max-height:44vh;overflow:auto;z-index:80!important;border-radius:16px!important;transform:none!important;padding:18px!important}
    .hc-ain-sheet button.close,.hc-bourg-sheet .close{width:44px;height:44px;font-size:28px!important;top:2px!important;right:2px!important}
    .hc-ain-sheet .go,.hc-bourg-sheet .action{min-height:46px;width:100%;font-size:14px!important}
    .hc-ain-title,.hc-bourg-title{pointer-events:none;max-width:58%!important}.hc-ain-title span,.hc-bourg-title span{font-size:10px!important;line-height:1.25}
    .hc-ain-legend,.hc-bourg-legend{display:none!important}
    .hc-mobile-map-help{position:absolute;left:50%;bottom:2.5%;transform:translateX(-50%);z-index:25;background:rgba(255,251,241,.94);border:1px solid rgba(90,80,68,.18);border-radius:999px;padding:7px 10px;font:11px Arial,sans-serif;color:#625b53;white-space:nowrap;pointer-events:none;box-shadow:0 3px 10px rgba(50,40,30,.08)}
  }
  `;document.head.appendChild(st)}
  function isTouch(){return matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0||innerWidth<=850}
  function decorateMap(map){if(!map||map.dataset.hcMobileReady)return;map.dataset.hcMobileReady='1';if(isTouch()&&!$('.hc-mobile-map-help',map)){const h=document.createElement('div');h.className='hc-mobile-map-help';h.textContent='Touchez un lieu pour l’ouvrir · appui long = détail caché';map.appendChild(h)}
  }
  function patchButton(btn){if(btn.dataset.hcMobileTap)return;btn.dataset.hcMobileTap='1';let downAt=0,moved=false,startX=0,startY=0,longPress=false;
    btn.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'&&e.pointerType!=='pen')return;downAt=Date.now();moved=false;longPress=false;startX=e.clientX;startY=e.clientY;},true);
    btn.addEventListener('pointermove',e=>{if(!downAt)return;if(Math.abs(e.clientX-startX)>10||Math.abs(e.clientY-startY)>10)moved=true;},true);
    btn.addEventListener('pointerup',e=>{if(e.pointerType!=='touch'&&e.pointerType!=='pen')return;const elapsed=Date.now()-downAt;downAt=0;if(moved)return;if(elapsed>=560){longPress=true;return}if(btn.classList.contains('secret')&&!btn.classList.contains('found'))return;btn.classList.add('armed');},true);
    btn.addEventListener('click',()=>{if(longPress){longPress=false;return}if(isTouch())btn.classList.add('armed')},true);
  }
  function patch(){injectCss();$$('.hc-ain-map,.hc-bourg-map').forEach(decorateMap);$$('.hc-ain-hotspot,.hc-bourg-hotspot').forEach(patchButton)}
  const mo=new MutationObserver(()=>patch());mo.observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('resize',patch,{passive:true});addEventListener('orientationchange',()=>setTimeout(patch,180),{passive:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patch);else patch();
})();