(function(){
  if(window.__HCCharacterDesktopIpadPolish)return;
  window.__HCCharacterDesktopIpadPolish=true;
  const st=document.createElement('style');
  st.id='hcCharacterDesktopIpadPolishStyles';
  st.textContent=`
  @media (min-width:980px), (min-width:768px) and (min-height:900px){
    html body #characters{overflow:hidden!important;background:#fffdf8!important}
    html body #characters .selection-wrap,
    html body #characters .selection-stage,
    html body #characters .hc-cast{width:100vw!important;height:100vh!important;max-width:none!important;overflow:hidden!important}

    html body #characters .hc-page{inset:0!important;width:100%!important;height:100%!important;border:0!important;border-radius:0!important;box-shadow:none!important;background:
      radial-gradient(circle at 19% 18%,rgba(240,224,204,.25),transparent 28%),
      radial-gradient(circle at 54% 86%,rgba(238,228,215,.20),transparent 24%),
      linear-gradient(90deg,#fffdf9 0 71.55%,#e3d8c8 71.62%,#f5eee5 72.12%,#fffdf9 72.7%,#fffdf9 100%)!important}
    html body #characters .hc-page:before{left:71.45%!important;right:auto!important;top:0!important;bottom:0!important;width:18px!important;height:auto!important;display:block!important;background:linear-gradient(90deg,rgba(111,90,69,.055),rgba(255,255,255,.82) 50%,rgba(111,90,69,.05))!important;opacity:.7!important}

    html body #characters .hc-cast-head{left:3.9%!important;right:29.9%!important;top:2.4%!important;text-align:center!important;z-index:12!important}
    html body #characters .hc-cast-head:before{content:'CARNET DE PERSONNAGES  ·  COLLECTION 01'!important;margin-bottom:5px!important;font:600 6.5px/1 Arial,sans-serif!important;letter-spacing:.23em!important;color:#a67861!important}
    html body #characters .hc-cast-head h2{margin:0!important;font:400 clamp(38px,3.45vw,58px)/.94 Georgia,serif!important;letter-spacing:-.038em!important;color:#303532!important;white-space:normal!important}
    html body #characters .hc-cast-head h2:after{display:none!important}
    html body #characters .hc-cast-head p{margin:8px 0 0!important;font:400 8px/1.25 Arial,sans-serif!important;letter-spacing:.105em!important;color:#907c6d!important}

    html body #characters .hc-grid{left:2.8%!important;right:30.25%!important;top:14.6%!important;bottom:4.2%!important;width:auto!important;display:grid!important;grid-template-columns:1.58fr repeat(6,minmax(0,1fr))!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:2.6% 1.4%!important;padding:0!important;overflow:visible!important;align-items:stretch!important}
    html body #characters .hc-person{position:relative!important;inset:auto!important;width:auto!important;height:auto!important;min-height:0!important;transform:none!important;border-radius:21px!important;overflow:visible!important;isolation:isolate!important}
    html body #characters .hc-person:before{inset:1% 2% 12%!important;border-radius:21px!important;background:linear-gradient(155deg,rgba(255,255,255,.72),rgba(247,239,228,.50))!important;border:1px solid rgba(103,82,62,.072)!important;box-shadow:0 7px 19px rgba(73,54,39,.035),inset 0 1px rgba(255,255,255,.72)!important}
    html body #characters .hc-person:after{top:5%!important;left:8%!important;font-size:17px!important;color:#b89d7b!important}
    html body #characters .hc-person .fig{width:82%!important;height:73%!important;top:3%!important;overflow:visible!important}
    html body #characters .hc-person .tag{bottom:0!important;width:94%!important;min-height:0!important;padding:8px 5px 7px!important;border-radius:18px!important;background:rgba(247,239,228,.965)!important;border:1px solid rgba(103,82,62,.075)!important;box-shadow:0 6px 15px rgba(74,58,42,.04)!important}
    html body #characters .hc-person .tag strong{font-size:14.5px!important}
    html body #characters .hc-person .tag span{font-size:5.8px!important;letter-spacing:.08em!important}
    html body #characters .hc-person:not([data-id='clara']) .fig{opacity:.22!important;filter:grayscale(.44) saturate(.30) sepia(.06)!important}
    html body #characters .hc-person:not([data-id='clara']) .tag:before{top:-16px!important;font-size:4.8px!important;letter-spacing:.10em!important}

    html body #characters .hc-person[data-id='clara']{grid-column:1!important;grid-row:1 / 3!important;z-index:6!important}
    html body #characters .hc-person[data-id='clara']:before{inset:0 0 10%!important;border-radius:34px 34px 25px 25px!important;background:
      radial-gradient(circle at 49% 33%,rgba(255,255,255,.99) 0 27%,rgba(252,246,238,.97) 52%,rgba(244,231,216,.96) 100%)!important;border:1px solid rgba(184,126,93,.16)!important;box-shadow:0 20px 44px rgba(87,58,41,.10),inset 0 0 0 1px rgba(255,255,255,.5)!important}
    html body #characters .hc-person[data-id='clara']:after{top:3.8%!important;left:7%!important;font-size:clamp(24px,2vw,36px)!important;color:#c7a77d!important}
    html body #characters .hc-person[data-id='clara'] .fig{width:128%!important;height:92%!important;top:-1.5%!important;overflow:visible!important}
    html body #characters .hc-person[data-id='clara'] .fig:before{right:3.5%!important;top:3%!important;font-size:5.5px!important;letter-spacing:.16em!important;color:#a77b66!important}
    html body #characters .hc-person[data-id='clara'] .fig .hc-clara-master{width:100%!important;height:100%!important;object-fit:contain!important;object-position:50% 100%!important;border-radius:0!important;mix-blend-mode:multiply!important;filter:drop-shadow(0 16px 14px rgba(82,51,35,.13)) saturate(1.03) contrast(1.02)!important}
    html body #characters .hc-person[data-id='clara'] .tag{width:103%!important;padding:12px 8px 10px!important;border-radius:22px!important;background:linear-gradient(180deg,#f4e7d7,#efddc8)!important;border-color:rgba(190,121,90,.16)!important;box-shadow:0 10px 24px rgba(83,58,42,.075)!important}
    html body #characters .hc-person[data-id='clara'] .tag strong{font-size:21px!important;color:#624638!important}
    html body #characters .hc-person[data-id='clara'] .tag span{font-size:6.1px!important;letter-spacing:.125em!important}

    html body #characters .hc-focus{display:block!important;left:73.15%!important;right:2.25%!important;top:8.2%!important;bottom:4.2%!important;width:auto!important;max-height:none!important;overflow:auto!important;padding:10px 0 16px!important;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;opacity:1!important;pointer-events:auto!important;transform:none!important;color:#333834!important}
    html body #characters .hc-focus.open{opacity:1!important;pointer-events:auto!important}
    html body #characters .hc-focus:before{content:''!important;display:none!important}
    html body #characters .hc-focus-nav{padding:0 0 11px!important;border-bottom:1px solid rgba(91,72,54,.12)!important}
    html body #characters .hc-focus-nav:before{content:''!important;display:none!important}
    html body #characters .hc-focus-header-final{display:grid!important;grid-template-columns:116px 1fr!important;gap:18px!important;align-items:center!important;padding:14px 0 14px!important;border-bottom:1px solid rgba(91,72,54,.12)!important}
    html body #characters .hc-focus-portrait-final{width:112px!important;height:112px!important;border-radius:50%!important;overflow:hidden!important;background:#fbf2e7!important;border:1px solid rgba(184,130,99,.30)!important;box-shadow:0 10px 25px rgba(85,59,40,.08),0 0 0 4px rgba(250,243,233,.7)!important}
    html body #characters .hc-focus-title-final h3{margin:0 0 7px!important;font:400 36px/.94 Georgia,serif!important;letter-spacing:-.025em!important;color:#373430!important}
    html body #characters .hc-focus-title-final .vibe{font:italic 13px/1.45 Georgia,serif!important;color:#976550!important}
    html body #characters .hc-focus-block{display:block!important;padding:11px 0!important;border-top:1px solid rgba(91,72,54,.12)!important}
    html body #characters .hc-focus-header-final + .hc-focus-block{border-top:0!important}
    html body #characters .hc-focus-block b{font:600 6.3px/1 Arial,sans-serif!important;letter-spacing:.18em!important;color:#70866d!important}
    html body #characters .hc-focus-block p{margin:5px 0 0!important;font:400 12px/1.45 Georgia,serif!important;color:#4d4843!important}
    html body #characters .hc-projection{display:block!important;margin-top:7px!important;padding:12px 34px 12px 13px!important;border-radius:14px!important;background:linear-gradient(145deg,#f3ebe2,#ebe0d5)!important;border:1px solid rgba(104,82,62,.06)!important}
    html body #characters .hc-focus-actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;margin-top:12px!important}
    html body #characters .hc-focus-actions button{min-height:42px!important;border-radius:11px!important;background:#fffdfa!important;border:1px solid rgba(91,72,55,.14)!important;font:400 10.5px Georgia,serif!important}
    html body #characters .hc-focus-actions .primary{grid-column:1 / -1!important;min-height:48px!important;border-radius:12px!important;background:linear-gradient(180deg,#80917b,#72856e)!important;color:#fff!important;border:0!important;font:400 14.5px Georgia,serif!important;box-shadow:0 9px 22px rgba(83,103,79,.18)!important}

    html body #hcReturnHome{left:18px!important;top:18px!important;padding:10px 15px!important;font-size:14px!important}
  }
  `;
  document.head.appendChild(st);
})();