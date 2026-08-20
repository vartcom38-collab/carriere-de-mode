(function(){
  if(window.__HCCharacterPremiumPolishStable)return;
  window.__HCCharacterPremiumPolishStable=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

  function installCss(){
    if($('#hcCharacterPremiumPolishStableStyles'))return;
    const s=document.createElement('style');
    s.id='hcCharacterPremiumPolishStableStyles';
    s.textContent=`
      #characters{--hc-ink:#343936;--hc-paper:#fffdf9;--hc-coral:#c86f58;--hc-sage:#7f927b;--hc-line:rgba(82,65,50,.12);background:#f4eee5!important}
      #characters .hc-page{background:linear-gradient(90deg,#fffdf9 0 66.5%,#d8cbbb 66.56%,#f6eee4 67.15%,#fffdf9 68%,#fffdf9 100%)!important}
      #characters .hc-cast-head{top:2.35%!important;left:4.5%!important;right:35%!important}
      #characters .hc-cast-head:before{content:'CARNET DE PERSONNAGES';display:block;margin-bottom:5px;font:600 7px/1 Arial,sans-serif;letter-spacing:.22em;color:#a17763}
      #characters .hc-cast-head h2{font:400 clamp(38px,3.75vw,62px)/.94 Georgia,serif!important;letter-spacing:-.035em!important;color:var(--hc-ink)!important}
      #characters .hc-cast-head p{margin-top:10px!important;font-size:9px!important;letter-spacing:.11em!important;color:#927d6d!important}
      #characters .hc-grid{top:14.4%!important;bottom:4.8%!important;gap:1.8% 1.8%!important}
      #characters .hc-person{border-radius:18px!important;overflow:visible!important;isolation:isolate!important}
      #characters .hc-person:before{content:'';position:absolute;inset:2% 3% 11%;z-index:-2;border-radius:17px;background:rgba(255,255,255,.38);border:1px solid rgba(97,77,60,.055);transition:transform .22s ease,box-shadow .22s ease,background .22s ease}
      #characters .hc-person:hover:before,#characters .hc-person.focused:before{background:#fffefa;box-shadow:0 15px 32px rgba(69,50,36,.11);transform:translateY(-2px)}
      #characters .hc-person .tag{bottom:0!important;width:91%!important;padding:7px 5px 6px!important;border-radius:10px!important;background:rgba(250,245,237,.94)!important;border:1px solid rgba(103,82,62,.07)!important;box-shadow:0 4px 10px rgba(74,58,42,.025)!important}
      #characters .hc-person .tag strong{font:400 15px/1.05 Georgia,serif!important;color:#4d463e!important}
      #characters .hc-person .tag span{margin-top:3px!important;font-size:6.5px!important;letter-spacing:.075em!important;color:#a39990!important}
      #characters .hc-person:not([data-id='clara']) .fig{opacity:.20!important;filter:grayscale(.32) saturate(.30) sepia(.08)!important}
      #characters .hc-person:not([data-id='clara']) .tag:before{content:'portrait en création';position:absolute;left:50%;top:-15px;transform:translateX(-50%);white-space:nowrap;font:italic 6px Georgia,serif;color:#b3a89f;opacity:.7}
      #characters .hc-person:not([data-id='clara']):hover .fig,#characters .hc-person:not([data-id='clara']).focused .fig{opacity:.40!important;filter:grayscale(.18) saturate(.52)!important}
      #characters .hc-cast.has-focus .hc-person:not(.focused){opacity:.68!important;filter:none!important}
      #characters .hc-person[data-id='clara']:before{background:linear-gradient(155deg,#fffdfa,#f7eee5)!important;border-color:rgba(190,121,90,.17)!important;box-shadow:0 12px 28px rgba(92,58,41,.08)!important}
      #characters .hc-person[data-id='clara'] .fig{width:112%!important;height:92%!important;top:-10%!important;overflow:visible!important}
      #characters .hc-person[data-id='clara'] .fig .hc-clara-master{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;object-position:50% 100%!important;border-radius:0!important;mix-blend-mode:multiply!important;filter:drop-shadow(0 12px 10px rgba(85,53,38,.11)) saturate(1.02) contrast(1.015)!important;mask-image:none!important;-webkit-mask-image:none!important}
      #characters .hc-person[data-id='clara']:hover .fig,#characters .hc-person[data-id='clara'].focused .fig{transform:translateX(-50%) translateY(-5px) scale(1.035)!important}
      #characters .hc-person[data-id='clara'] .tag{background:#f3e6d8!important;border-color:rgba(190,121,90,.15)!important}
      #characters .hc-person[data-id='clara'] .tag strong{font-size:17px!important;color:#6e493b!important}
      #characters .hc-person[data-id='clara'] .tag:after{content:'01  •  personnage final';display:block;margin-top:3px;font:600 5.8px Arial,sans-serif;letter-spacing:.13em;text-transform:uppercase;color:#ad765f}
      #characters .hc-focus{padding:15px 24px 20px!important;color:var(--hc-ink)!important}
      #characters .hc-focus-nav{padding-bottom:10px!important;border-bottom:1px solid var(--hc-line)!important}
      #characters .hc-focus-nav:before{content:'PORTRAIT';font:600 7px Arial,sans-serif;letter-spacing:.2em;color:#a97760;margin-right:auto}
      #characters .hc-focus .hc-focus-portrait{height:185px;margin:12px 0 13px;border-radius:18px;overflow:hidden;background:#fffdfa;position:relative;box-shadow:inset 0 0 0 1px rgba(95,76,58,.07)}
      #characters .hc-focus .hc-focus-portrait img{width:100%;height:100%;object-fit:cover;object-position:50% 16%;display:block;mix-blend-mode:multiply;filter:saturate(1.01) contrast(1.02)}
      #characters .hc-focus h3{font:400 36px/.95 Georgia,serif!important;letter-spacing:-.025em!important;margin:11px 0 4px!important;color:#3d3934!important}
      #characters .hc-focus .vibe{font:italic 13px Georgia,serif!important;color:#9b6651!important;margin-bottom:16px!important}
      #characters .hc-focus-block{padding:10px 0!important;border-top:1px solid var(--hc-line)!important}
      #characters .hc-focus-block b{font-size:7px!important;letter-spacing:.17em!important;color:#7e9279!important}
      #characters .hc-focus-block p{font-size:12.5px!important;line-height:1.44!important;color:#4f4a45!important}
      #characters .hc-projection{margin-top:6px!important;padding:12px 13px!important;background:linear-gradient(145deg,#f1e7dd,#ebe1d6)!important;border-radius:12px!important}
      #characters .hc-focus-actions{gap:8px!important;margin-top:13px!important}
      #characters .hc-focus-actions button{min-height:42px!important;border-radius:10px!important;background:#fffdfa!important;border:1px solid rgba(91,72,55,.13)!important;font-size:10px!important}
      #characters .hc-focus-actions .primary{background:#788b74!important;color:#fff!important;border:0!important;font:400 14px Georgia,serif!important;box-shadow:0 8px 20px rgba(83,103,79,.17)!important}
      @media(max-width:900px){#characters .hc-person[data-id='clara'] .fig{width:101%!important;height:85%!important;top:-5%!important}#characters .hc-focus .hc-focus-portrait{height:104px;margin:3px 0 5px}#characters .hc-focus h3{font-size:24px!important}}
    `;
    document.head.appendChild(s);
  }

  function numbers(root){
    $$('.hc-person',root).forEach((p,i)=>{const n=String(i+1).padStart(2,'0');if(p.dataset.hcNum!==n)p.dataset.hcNum=n});
  }

  function portrait(root){
    const focus=$('.hc-focus',root),clara=$('.hc-person[data-id="clara"] .hc-clara-master',root);
    if(!focus||!clara)return;
    const active=$('.hc-person[data-id="clara"]',root)?.classList.contains('focused');
    let p=$('.hc-focus-portrait',focus);
    if(active&&!p){
      p=document.createElement('div');p.className='hc-focus-portrait';
      const img=document.createElement('img');img.alt='Clara';img.src=clara.src;p.appendChild(img);
      $('.hc-focus-nav',focus)?.insertAdjacentElement('afterend',p);
    }else if(!active&&p){p.remove()}
  }

  function apply(){
    installCss();
    const root=$('#characters .hc-cast');if(!root)return;
    numbers(root);portrait(root);
  }

  let scheduled=false;
  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;apply()})}
  function boot(){
    apply();
    const stage=$('#characters .selection-stage')||$('#characters');
    if(stage)new MutationObserver(schedule).observe(stage,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();