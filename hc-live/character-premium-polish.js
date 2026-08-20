(function(){
  if(window.__HCCharacterPremiumPolishV2)return;window.__HCCharacterPremiumPolishV2=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  function css(){
    let s=$('#hcCharacterPremiumPolishStyles');if(s)s.remove();
    s=document.createElement('style');s.id='hcCharacterPremiumPolishStyles';s.textContent=`
      #characters{--ink:#343936;--paper:#fffdf9;--paper2:#f8f1e7;--coral:#c86f58;--sage:#7f927b;--line:rgba(82,65,50,.12);background:#f4eee5!important}
      #characters .hc-page{background:linear-gradient(90deg,#fffdf9 0 66.5%,#d8cbbb 66.56%,#f6eee4 67.15%,#fffdf9 68%,#fffdf9 100%)!important}
      #characters .hc-page:after{opacity:.07!important}
      #characters .hc-cast-head{top:2.2%!important;left:4.5%!important;right:35%!important}
      #characters .hc-cast-head:before{content:'CARNET DE PERSONNAGES';display:block;margin-bottom:5px;font:600 7px/1 Arial,sans-serif;letter-spacing:.22em;color:#a17763}
      #characters .hc-cast-head h2{font:400 clamp(38px,3.75vw,62px)/.94 Georgia,serif!important;letter-spacing:-.035em!important;color:var(--ink)!important}
      #characters .hc-cast-head p{margin-top:10px!important;font-size:9px!important;letter-spacing:.11em!important;color:#927d6d!important}
      #characters .hc-grid{top:14.4%!important;bottom:4.7%!important;gap:1.8% 1.8%!important}
      #characters .hc-person{border-radius:18px!important;overflow:visible!important;isolation:isolate!important}
      #characters .hc-person:before{content:'';position:absolute;inset:2% 3% 11%;z-index:-2;border-radius:17px;background:rgba(255,255,255,.46);border:1px solid rgba(97,77,60,.065);box-shadow:0 5px 14px rgba(73,53,38,.025);transition:.24s ease}
      #characters .hc-person:after{content:attr(data-hc-num);position:absolute;top:5%;left:8%;z-index:5;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:rgba(255,253,249,.86);border:1px solid rgba(94,75,57,.12);font:600 7px Arial,sans-serif;letter-spacing:.04em;color:#9a8272;transition:.2s}
      #characters .hc-person:hover:before,#characters .hc-person.focused:before{background:#fffefa;border-color:rgba(188,120,91,.18);box-shadow:0 16px 34px rgba(69,50,36,.12);transform:rotate(-.35deg) translateY(-2px)}
      #characters .hc-person:hover:after,#characters .hc-person.focused:after{background:#c8785d;color:white;border-color:transparent}
      #characters .hc-person .fig{width:76%!important;height:73%!important;top:2%!important;overflow:visible!important;transition:.25s ease!important}
      #characters .hc-person .tag{bottom:0!important;width:91%!important;padding:7px 5px 6px!important;border-radius:9px!important;background:rgba(250,245,237,.94)!important;border:1px solid rgba(103,82,62,.07)!important;box-shadow:0 4px 10px rgba(74,58,42,.025)!important;backdrop-filter:blur(4px)}
      #characters .hc-person .tag strong{font:400 15px/1.05 Georgia,serif!important;color:#4d463e!important}
      #characters .hc-person .tag span{margin-top:3px!important;font-size:6.5px!important;letter-spacing:.075em!important;color:#a39990!important}
      #characters .hc-person:not([data-id='clara']) .fig{opacity:.22!important;filter:grayscale(.32) saturate(.32) sepia(.08)!important}
      #characters .hc-person:not([data-id='clara']):before{background:linear-gradient(145deg,rgba(255,255,255,.35),rgba(244,237,227,.38))}
      #characters .hc-person:not([data-id='clara']) .tag:before{content:'portrait en création';position:absolute;left:50%;top:-16px;transform:translateX(-50%);white-space:nowrap;font:italic 6px Georgia,serif;color:#b3a89f;opacity:.72}
      #characters .hc-person:not([data-id='clara']):hover .fig,#characters .hc-person:not([data-id='clara']).focused .fig{opacity:.42!important;filter:grayscale(.18) saturate(.55)!important}
      #characters .hc-cast.has-focus .hc-person:not(.focused){opacity:.64!important;filter:none!important}
      #characters .hc-person[data-id='clara']{z-index:3!important}
      #characters .hc-person[data-id='clara']:before{background:linear-gradient(155deg,#fffdfa,#f5eadf)!important;border-color:rgba(190,121,90,.19)!important;box-shadow:0 14px 32px rgba(92,58,41,.095)!important}
      #characters .hc-person[data-id='clara'] .fig{width:108%!important;height:90%!important;top:-9%!important}
      #characters .hc-person[data-id='clara'] .fig .hc-clara-master{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;object-position:50% 100%!important;border-radius:0!important;mix-blend-mode:multiply!important;filter:drop-shadow(0 13px 11px rgba(85,53,38,.12)) saturate(1.02) contrast(1.02)!important;-webkit-mask-image:none!important;mask-image:none!important}
      #characters .hc-person[data-id='clara']:hover .fig,#characters .hc-person[data-id='clara'].focused .fig{transform:translateX(-50%) translateY(-5px) scale(1.035)!important}
      #characters .hc-person[data-id='clara'] .tag{background:#f3e6d8!important;border-color:rgba(190,121,90,.15)!important}
      #characters .hc-person[data-id='clara'] .tag strong{font-size:17px!important;color:#6e493b!important}
      #characters .hc-person[data-id='clara'] .tag:after{content:'01  •  personnage final';display:block;margin-top:3px;font:600 5.8px Arial,sans-serif;letter-spacing:.13em;text-transform:uppercase;color:#ad765f}
      #characters .hc-focus{padding:13px 24px 20px!important;color:var(--ink)!important}
      #characters .hc-focus:after{content:'HAUTE COUTURE — DOSSIER PERSONNAGE';position:absolute;right:24px;bottom:10px;font:600 5.5px Arial,sans-serif;letter-spacing:.16em;color:#c1b5aa;pointer-events:none}
      #characters .hc-focus-nav{padding:0 0 10px!important;border-bottom:1px solid var(--line)!important}
      #characters .hc-focus-nav:before{content:'PORTRAIT';font:600 7px Arial,sans-serif;letter-spacing:.2em;color:#a97760;margin-right:auto}
      #characters .hc-icon{width:38px!important;height:38px!important;background:#fffdf8!important;border-color:rgba(93,73,56,.14)!important;box-shadow:none!important}
      #characters .hc-focus .hc-focus-portrait{height:190px;margin:12px 0 13px;border-radius:18px;overflow:hidden;background:linear-gradient(145deg,#f3e6db,#fffdfa);position:relative;box-shadow:inset 0 0 0 1px rgba(95,76,58,.07)}
      #characters .hc-focus .hc-focus-portrait:before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.45),transparent 45%);z-index:2;pointer-events:none}
      #characters .hc-focus .hc-focus-portrait img{width:100%;height:100%;object-fit:cover;object-position:50% 17%;display:block;mix-blend-mode:multiply;filter:saturate(1.01) contrast(1.02)}
      #characters .hc-focus h3{font:400 36px/.95 Georgia,serif!important;letter-spacing:-.025em!important;margin:11px 0 4px!important;color:#3d3934!important}
      #characters .hc-focus .vibe{font:italic 13px Georgia,serif!important;color:#9b6651!important;margin-bottom:16px!important}
      #characters .hc-focus-block{padding:10px 0!important;border-top:1px solid var(--line)!important}
      #characters .hc-focus-block b{font-size:7px!important;letter-spacing:.17em!important;color:#7e9279!important}
      #characters .hc-focus-block p{font-size:12.5px!important;line-height:1.44!important;color:#4f4a45!important}
      #characters .hc-projection{margin-top:6px!important;padding:12px 13px!important;background:linear-gradient(145deg,#f1e7dd,#ebe1d6)!important;border-radius:12px!important}
      #characters .hc-focus-actions{gap:8px!important;margin-top:13px!important}
      #characters .hc-focus-actions button{min-height:42px!important;border-radius:10px!important;background:#fffdfa!important;border:1px solid rgba(91,72,55,.13)!important;font-size:10px!important}
      #characters .hc-focus-actions .primary{background:#788b74!important;color:white!important;border:0!important;font:400 14px Georgia,serif!important;box-shadow:0 8px 20px rgba(83,103,79,.17)!important}
      #characters .hc-focus-actions .primary:hover{transform:translateY(-1px);background:#6f836b!important}
      #characters .hc-compare{background:rgba(255,253,249,.96)!important;border:1px solid rgba(95,75,57,.08)!important}
      @media(max-width:900px){
        #characters .hc-cast-head:before{font-size:6px}
        #characters .hc-grid{gap:1.2%!important}
        #characters .hc-person .fig{width:70%!important;height:69%!important}
        #characters .hc-person[data-id='clara'] .fig{width:99%!important;height:84%!important;top:-5%!important}
        #characters .hc-person:after{width:19px;height:19px;font-size:6px}
        #characters .hc-focus .hc-focus-portrait{height:105px;margin:2px 0 5px}
        #characters .hc-focus h3{font-size:24px!important}
      }
    `;document.head.appendChild(s);
  }
  function numbers(){ $$('.hc-person').forEach((p,i)=>p.dataset.hcNum=String(i+1).padStart(2,'0')); }
  function portrait(){
    const root=$('#characters .hc-cast');if(!root)return;
    const focus=$('.hc-focus',root),clara=$('.hc-person[data-id="clara"] .hc-clara-master',root);if(!focus||!clara)return;
    const active=$('.hc-person[data-id="clara"]',root)?.classList.contains('focused');let p=$('.hc-focus-portrait',focus);
    if(active){if(!p){p=document.createElement('div');p.className='hc-focus-portrait';const img=document.createElement('img');img.alt='Clara';img.src=clara.src;p.appendChild(img);const nav=$('.hc-focus-nav',focus);nav?.insertAdjacentElement('afterend',p)}else{const im=$('img',p);if(im&&im.src!==clara.src)im.src=clara.src}}
    else if(p)p.remove();
  }
  function sync(){css();numbers();portrait()}
  const mo=new MutationObserver(sync);
  function boot(){sync();mo.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();