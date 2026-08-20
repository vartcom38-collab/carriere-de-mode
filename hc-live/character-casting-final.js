(function(){
  if(window.__HCCharacterCastingFinal)return;
  window.__HCCharacterCastingFinal=true;
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  function installCss(){
    if($('#hcCharacterCastingFinalStyles'))return;
    const s=document.createElement('style');
    s.id='hcCharacterCastingFinalStyles';
    s.textContent=`
      #characters{--hc-ink:#313633;--hc-paper:#fffdf8;--hc-cream:#f7efe4;--hc-line:rgba(91,72,54,.12);--hc-coral:#c87459;--hc-sage:#788b74;background:#f5efe6!important}
      #characters .hc-page{background:linear-gradient(90deg,#fffdf9 0 67%,#ded3c4 67.05%,#f5eee5 67.55%,#fffdf9 68.15%,#fffdf9 100%)!important}
      #characters .hc-cast-head{top:2.1%!important;left:4.2%!important;right:34.5%!important;text-align:center!important}
      #characters .hc-cast-head:before{content:'CARNET DE PERSONNAGES';display:block;margin-bottom:4px;font:600 7px/1 Arial,sans-serif;letter-spacing:.23em;color:#a77a65}
      #characters .hc-cast-head h2{margin:0!important;font:400 clamp(40px,4vw,66px)/.95 Georgia,serif!important;letter-spacing:-.035em!important;color:var(--hc-ink)!important}
      #characters .hc-cast-head p{margin:9px 0 0!important;font:400 9px/1.2 Arial,sans-serif!important;letter-spacing:.11em!important;color:#8f796b!important}

      #characters .hc-grid{top:14.2%!important;left:3.8%!important;right:34.7%!important;bottom:3.9%!important;display:grid!important;grid-template-columns:1.55fr repeat(6,minmax(0,1fr))!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:2.4% 1.2%!important;align-items:stretch!important}
      #characters .hc-person{position:relative!important;inset:auto!important;width:auto!important;height:auto!important;transform:none!important;border-radius:18px!important;overflow:visible!important;isolation:isolate!important;transition:transform .22s ease,opacity .22s ease!important}
      #characters .hc-person:before{content:'';position:absolute;inset:1% 2% 12%;z-index:-2;border-radius:18px;background:linear-gradient(155deg,rgba(255,255,255,.62),rgba(245,237,226,.44));border:1px solid rgba(98,76,57,.065);box-shadow:0 6px 16px rgba(76,56,38,.035);transition:.23s ease}
      #characters .hc-person:hover:before,#characters .hc-person.focused:before{background:#fffdfa;border-color:rgba(190,121,90,.16);box-shadow:0 16px 34px rgba(69,50,36,.10);transform:translateY(-2px)}
      #characters .hc-person:hover,#characters .hc-person.focused{z-index:8!important}

      #characters .hc-person .fig{position:absolute!important;left:50%!important;transform:translateX(-50%)!important;width:82%!important;height:72%!important;top:4%!important;overflow:visible!important;transition:transform .24s ease,filter .24s ease,opacity .24s ease!important}
      #characters .hc-person .tag{position:absolute!important;left:50%!important;transform:translateX(-50%)!important;bottom:0!important;width:94%!important;padding:7px 5px 6px!important;border-radius:999px!important;background:rgba(247,239,228,.96)!important;border:1px solid rgba(103,82,62,.07)!important;box-shadow:0 5px 14px rgba(74,58,42,.035)!important;text-align:center!important;backdrop-filter:blur(5px)}
      #characters .hc-person .tag strong{font:400 14px/1.05 Georgia,serif!important;color:#544a42!important}
      #characters .hc-person .tag span{margin-top:3px!important;font:500 5.8px/1 Arial,sans-serif!important;letter-spacing:.075em!important;color:#a59b92!important}

      #characters .hc-person:not([data-id='clara']) .fig{opacity:.19!important;filter:grayscale(.45) saturate(.28) sepia(.08)!important}
      #characters .hc-person:not([data-id='clara']) .tag:before{content:'PORTRAIT EN CRÉATION';position:absolute;left:50%;top:-17px;transform:translateX(-50%);white-space:nowrap;padding:3px 7px;border-radius:999px;background:rgba(255,252,247,.72);border:1px solid rgba(104,82,62,.06);font:500 5px/1 Arial,sans-serif;letter-spacing:.10em;color:#b5aaa1}
      #characters .hc-person:not([data-id='clara']):hover .fig,#characters .hc-person:not([data-id='clara']).focused .fig{opacity:.38!important;filter:grayscale(.22) saturate(.5)!important;transform:translateX(-50%) translateY(-3px)!important}
      #characters .hc-cast.has-focus .hc-person:not(.focused){opacity:.68!important;filter:none!important}

      #characters .hc-person[data-id='clara']{grid-row:1 / 3!important;grid-column:1!important;z-index:5!important}
      #characters .hc-person[data-id='clara']:before{inset:0 0 10%!important;border-radius:28px 28px 20px 20px!important;background:radial-gradient(circle at 48% 38%,rgba(255,255,255,.94) 0 29%,rgba(250,241,229,.92) 62%,rgba(244,232,217,.93) 100%)!important;border:1px solid rgba(186,130,98,.13)!important;box-shadow:0 17px 36px rgba(90,61,42,.08)!important}
      #characters .hc-person[data-id='clara']:after{content:'01';position:absolute;top:4%;left:7%;z-index:7;font:400 clamp(22px,2vw,35px)/1 Georgia,serif;color:#c7aa83;letter-spacing:-.04em}
      #characters .hc-person[data-id='clara'] .fig{width:124%!important;height:91%!important;top:-2%!important}
      #characters .hc-person[data-id='clara'] .fig:before{content:'PERSONNAGE FINAL';position:absolute;right:5%;top:3%;z-index:8;writing-mode:vertical-rl;font:600 5.7px/1 Arial,sans-serif;letter-spacing:.16em;color:#ae8874}
      #characters .hc-person[data-id='clara'] .fig .hc-clara-master{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;object-position:50% 100%!important;border-radius:0!important;mix-blend-mode:multiply!important;filter:drop-shadow(0 14px 12px rgba(82,51,35,.13)) saturate(1.03) contrast(1.02)!important;-webkit-mask-image:linear-gradient(to bottom,#000 0 92%,rgba(0,0,0,.92) 96%,transparent 100%)!important;mask-image:linear-gradient(to bottom,#000 0 92%,rgba(0,0,0,.92) 96%,transparent 100%)!important}
      #characters .hc-person[data-id='clara']:hover .fig,#characters .hc-person[data-id='clara'].focused .fig{transform:translateX(-50%) translateY(-7px) scale(1.025)!important}
      #characters .hc-person[data-id='clara'] .tag{bottom:0!important;width:104%!important;padding:10px 7px 9px!important;border-radius:18px!important;background:#f1e3d2!important;border-color:rgba(190,121,90,.15)!important;box-shadow:0 9px 20px rgba(83,58,42,.07)!important}
      #characters .hc-person[data-id='clara'] .tag strong{font:400 19px/1 Georgia,serif!important;color:#644739!important}
      #characters .hc-person[data-id='clara'] .tag span{font-size:6.2px!important;letter-spacing:.12em!important;color:#9f7663!important}

      #characters .hc-focus{padding:13px 24px 18px!important;color:var(--hc-ink)!important}
      #characters .hc-focus-nav{padding:0 0 11px!important;border-bottom:1px solid var(--hc-line)!important}
      #characters .hc-focus-nav:before{content:'PORTRAIT';margin-right:auto;font:600 6.5px/1 Arial,sans-serif;letter-spacing:.21em;color:#a97963}
      #characters .hc-focus-header-final{display:grid;grid-template-columns:112px 1fr;gap:17px;align-items:center;padding:14px 0 13px;border-bottom:1px solid var(--hc-line)}
      #characters .hc-focus-portrait-final{width:108px;height:108px;border-radius:50%;overflow:hidden;background:#fbf2e7;border:1px solid rgba(184,130,99,.28);box-shadow:0 8px 24px rgba(85,59,40,.08);position:relative}
      #characters .hc-focus-portrait-final:after{content:'✦';position:absolute;left:50%;bottom:-1px;transform:translateX(-50%);width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:#fffdf9;color:#c29a75;border:1px solid rgba(184,130,99,.24);font-size:9px}
      #characters .hc-focus-portrait-final img{width:100%;height:100%;object-fit:cover;object-position:50% 13%;display:block;mix-blend-mode:multiply;transform:scale(1.14);filter:saturate(1.03) contrast(1.02)}
      #characters .hc-focus-title-final h3{margin:0 0 7px!important;font:400 35px/.95 Georgia,serif!important;letter-spacing:-.025em!important;color:#383530!important}
      #characters .hc-focus-title-final .vibe{margin:0!important;font:italic 13px/1.45 Georgia,serif!important;color:#9b6954!important}
      #characters .hc-focus>h3,#characters .hc-focus>.vibe{display:none!important}
      #characters .hc-focus-block{padding:11px 0!important;border-top:1px solid var(--hc-line)!important}
      #characters .hc-focus-header-final + .hc-focus-block{border-top:0!important}
      #characters .hc-focus-block b{font:600 6.5px/1 Arial,sans-serif!important;letter-spacing:.18em!important;color:#70866d!important}
      #characters .hc-focus-block p{margin:5px 0 0!important;font:400 12.2px/1.44 Georgia,serif!important;color:#514b45!important}
      #characters .hc-projection{margin-top:7px!important;padding:12px 13px!important;background:linear-gradient(145deg,#f2e9df,#ebe0d5)!important;border:1px solid rgba(104,82,62,.05)!important;border-radius:13px!important}
      #characters .hc-focus-actions{gap:8px!important;margin-top:12px!important}
      #characters .hc-focus-actions button{min-height:41px!important;border-radius:10px!important;background:#fffdfa!important;border:1px solid rgba(91,72,55,.14)!important;font:400 10px Georgia,serif!important}
      #characters .hc-focus-actions .primary{background:#788b74!important;color:#fff!important;border:0!important;font:400 14px Georgia,serif!important;box-shadow:0 8px 20px rgba(83,103,79,.16)!important}

      @media(max-width:1100px){
        #characters .hc-grid{grid-template-columns:1.45fr repeat(4,minmax(0,1fr))!important;overflow-y:auto!important;grid-auto-rows:minmax(150px,1fr)!important}
        #characters .hc-person[data-id='clara']{grid-row:1 / 3!important}
      }
      @media(max-width:760px){
        #characters .hc-page{background:#fffdf9!important}
        #characters .hc-cast-head{right:4.5%!important}
        #characters .hc-grid{right:4.5%!important;grid-template-columns:1.25fr repeat(2,minmax(0,1fr))!important}
        #characters .hc-focus{display:none!important}
      }
    `;
    document.head.appendChild(s);
  }

  function numberCards(root){
    $$('.hc-person',root).forEach((p,i)=>p.dataset.hcNum=String(i+1).padStart(2,'0'));
  }

  function buildFocusHeader(root){
    const focus=$('.hc-focus',root);
    const clara=$('.hc-person[data-id="clara"] .hc-clara-master',root);
    if(!focus||!clara||$('.hc-focus-header-final',focus))return;
    const h3=$('h3',focus),vibe=$('.vibe',focus);
    const wrap=document.createElement('div');wrap.className='hc-focus-header-final';
    const portrait=document.createElement('div');portrait.className='hc-focus-portrait-final';
    const img=document.createElement('img');img.src=clara.src;img.alt='Clara';portrait.appendChild(img);
    const title=document.createElement('div');title.className='hc-focus-title-final';
    const nh=document.createElement('h3');nh.textContent=h3?.textContent||'Clara';
    const nv=document.createElement('div');nv.className='vibe';nv.textContent=vibe?.textContent||'Poétique · détails sensibles';
    title.append(nh,nv);wrap.append(portrait,title);
    $('.hc-focus-nav',focus)?.insertAdjacentElement('afterend',wrap);
  }

  function apply(){
    const cast=$('#characters .hc-cast');
    const clara=$('#characters .hc-person[data-id="clara"] .hc-clara-master');
    if(!cast||!clara)return false;
    installCss();
    numberCards(cast);
    buildFocusHeader(cast);
    return true;
  }

  let tries=0;
  function boot(){
    if(apply())return;
    if(++tries<90)setTimeout(boot,60);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();