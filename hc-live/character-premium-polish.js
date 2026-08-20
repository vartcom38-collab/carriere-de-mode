(function(){
  if(window.__HCCharacterPremiumPolish)return;window.__HCCharacterPremiumPolish=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  function css(){
    if($('#hcCharacterPremiumPolishStyles'))return;
    const s=document.createElement('style');s.id='hcCharacterPremiumPolishStyles';s.textContent=`
      #characters .hc-page{background:linear-gradient(90deg,#fffdf8 0 66.8%,#e9dfd1 66.86%,#fbf7ef 67.55%,#fffdf8 100%)!important}
      #characters .hc-cast-head{top:2.7%!important}
      #characters .hc-cast-head h2{font-size:clamp(34px,3.55vw,58px)!important;letter-spacing:-.025em;color:#343936!important}
      #characters .hc-cast-head p{margin-top:8px!important;color:#806e61!important;font-size:10px!important;letter-spacing:.08em!important}
      #characters .hc-grid{top:13.8%!important;bottom:4.3%!important;gap:1.7% 2%!important}
      #characters .hc-person{border-radius:24px!important;isolation:isolate!important;overflow:visible!important}
      #characters .hc-person:before{content:'';position:absolute;inset:5% 5% 12%;border-radius:22px;background:linear-gradient(180deg,rgba(255,255,255,.28),rgba(242,233,219,.22));border:1px solid rgba(112,90,70,.055);opacity:.6;transition:.22s;z-index:-1}
      #characters .hc-person:hover:before,#characters .hc-person.focused:before{opacity:1;background:linear-gradient(180deg,rgba(255,255,255,.72),rgba(244,234,220,.52));box-shadow:0 14px 28px rgba(73,56,42,.10)}
      #characters .hc-person .fig{width:82%!important;height:77%!important;top:0!important}
      #characters .hc-person .tag{bottom:0!important;width:92%!important;padding:8px 6px 7px!important;border-radius:999px!important;background:rgba(245,238,227,.88)!important;backdrop-filter:blur(4px);border:1px solid rgba(116,95,73,.08);box-shadow:0 4px 10px rgba(74,58,42,.04)}
      #characters .hc-person .tag strong{font-size:16px!important;color:#51493f!important}
      #characters .hc-person .tag span{font-size:7px!important;color:#9b9389!important}
      #characters .hc-person:not([data-id='clara']) .fig{opacity:.36!important;filter:grayscale(.18) saturate(.55)!important}
      #characters .hc-person:not([data-id='clara']):hover .fig,#characters .hc-person:not([data-id='clara']).focused .fig{opacity:.58!important;filter:grayscale(.08) saturate(.7)!important}
      #characters .hc-person[data-id='clara'] .fig{width:100%!important;height:87%!important;top:-5%!important;overflow:visible!important}
      #characters .hc-person[data-id='clara'] .fig .hc-clara-master{width:100%!important;height:100%!important;object-fit:contain!important;object-position:center bottom!important;border-radius:0!important;mix-blend-mode:multiply!important;filter:drop-shadow(0 13px 10px rgba(81,53,39,.14)) saturate(.98) contrast(1.015)!important;-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 4%,#000 92%,transparent 100%);mask-image:linear-gradient(to bottom,transparent 0,#000 4%,#000 92%,transparent 100%)}
      #characters .hc-person[data-id='clara']:hover .fig .hc-clara-master,#characters .hc-person[data-id='clara'].focused .fig .hc-clara-master{filter:drop-shadow(0 18px 14px rgba(81,53,39,.2)) saturate(1.03) contrast(1.02)!important}
      #characters .hc-person[data-id='clara']:after{content:'PERSONNAGE FINAL';position:absolute;right:3%;top:4%;padding:4px 7px;border-radius:999px;background:#7d8b78;color:#fff;font:600 6px Arial,sans-serif;letter-spacing:.13em;opacity:.88}
      #characters .hc-focus{padding:15px 22px 18px!important}
      #characters .hc-focus-nav{position:relative;z-index:2}
      #characters .hc-focus .hc-focus-portrait{height:180px;margin:8px 0 10px;border-radius:24px;overflow:hidden;background:linear-gradient(145deg,#f2e8dc,#fbf7f0);position:relative;box-shadow:inset 0 0 0 1px rgba(95,76,58,.08)}
      #characters .hc-focus .hc-focus-portrait img{width:100%;height:100%;object-fit:cover;object-position:50% 18%;display:block;mix-blend-mode:multiply;filter:saturate(.97) contrast(1.02)}
      #characters .hc-focus .hc-focus-portrait:after{content:'';position:absolute;inset:0;box-shadow:inset 0 -28px 32px rgba(255,253,248,.6);pointer-events:none}
      #characters .hc-focus h3{font-size:34px!important;letter-spacing:-.02em!important;margin:9px 0 2px!important;color:#3d3934!important}
      #characters .hc-focus .vibe{font-size:14px!important;color:#8e684f!important}
      #characters .hc-focus-block{padding:11px 0!important}
      #characters .hc-focus-block b{color:#7b8b75!important;font-size:8px!important}
      #characters .hc-focus-block p{font-size:13px!important;line-height:1.45!important}
      #characters .hc-projection{background:linear-gradient(145deg,#f4ece2,#ece2d7)!important;border-radius:16px!important;padding:12px!important}
      #characters .hc-focus-actions button{border-radius:14px!important;background:rgba(255,252,247,.92)!important}
      #characters .hc-focus-actions .primary{background:#768570!important;box-shadow:0 8px 18px rgba(86,105,81,.18)!important}
      @media(max-width:900px){#characters .hc-person[data-id='clara'] .fig{width:94%!important;height:82%!important;top:-2%!important}#characters .hc-focus .hc-focus-portrait{height:108px;margin:3px 0 6px}#characters .hc-focus h3{font-size:24px!important}}
    `;document.head.appendChild(s);
  }
  function portrait(){
    const root=$('#characters .hc-cast'); if(!root)return;
    const focus=$('.hc-focus',root), clara=$('.hc-person[data-id="clara"] .hc-clara-master',root); if(!focus||!clara)return;
    const active=$('.hc-person[data-id="clara"]',root)?.classList.contains('focused');
    let p=$('.hc-focus-portrait',focus);
    if(active){
      if(!p){p=document.createElement('div');p.className='hc-focus-portrait';const img=document.createElement('img');img.alt='Portrait de Clara';img.src=clara.src;p.appendChild(img);const nav=$('.hc-focus-nav',focus);nav?.insertAdjacentElement('afterend',p)}
      else {const im=$('img',p);if(im&&im.src!==clara.src)im.src=clara.src}
    } else if(p){p.remove()}
  }
  function sync(){css();portrait()}
  const mo=new MutationObserver(sync);
  function boot(){sync();mo.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();