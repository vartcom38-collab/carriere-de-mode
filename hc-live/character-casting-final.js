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
      #characters{--hc-ink:#2f3431;--hc-paper:#fffdf8;--hc-cream:#f7efe4;--hc-line:rgba(91,72,54,.12);--hc-coral:#c87459;--hc-sage:#788b74;--hc-gold:#c9aa7e;background:#f5efe6!important}
      #characters .hc-page{background:
        radial-gradient(circle at 22% 15%,rgba(239,222,200,.30),transparent 25%),
        radial-gradient(circle at 55% 80%,rgba(233,221,204,.26),transparent 27%),
        linear-gradient(90deg,#fffdf9 0 67%,#ded3c4 67.05%,#f5eee5 67.55%,#fffdf9 68.15%,#fffdf9 100%)!important}
      #characters .hc-page:before{content:'';position:absolute;inset:0;pointer-events:none;opacity:.28;background-image:radial-gradient(rgba(125,103,82,.16) .55px,transparent .55px);background-size:8px 8px;mix-blend-mode:multiply}
      #characters .hc-cast-head{top:2.0%!important;left:4.2%!important;right:34.5%!important;text-align:center!important}
      #characters .hc-cast-head:before{content:'CARNET DE PERSONNAGES  ·  COLLECTION 01';display:block;margin-bottom:5px;font:600 6.6px/1 Arial,sans-serif;letter-spacing:.24em;color:#a77a65}
      #characters .hc-cast-head h2{margin:0!important;font:400 clamp(42px,4.15vw,69px)/.93 Georgia,serif!important;letter-spacing:-.045em!important;color:var(--hc-ink)!important;text-wrap:balance}
      #characters .hc-cast-head h2:after{content:'✦';display:inline-block;margin-left:13px;vertical-align:24%;font:400 14px Georgia,serif;color:#c59f76;opacity:.8}
      #characters .hc-cast-head p{margin:10px 0 0!important;font:400 8.8px/1.2 Arial,sans-serif!important;letter-spacing:.115em!important;color:#8f796b!important}

      #characters .hc-grid{top:14.1%!important;left:3.35%!important;right:34.4%!important;bottom:3.7%!important;display:grid!important;grid-template-columns:1.68fr repeat(6,minmax(0,1fr))!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:2.5% 1.15%!important;align-items:stretch!important}
      #characters .hc-person{position:relative!important;inset:auto!important;width:auto!important;height:auto!important;transform:none!important;border-radius:19px!important;overflow:visible!important;isolation:isolate!important;transition:transform .24s cubic-bezier(.2,.8,.2,1),opacity .22s ease!important}
      #characters .hc-person:before{content:'';position:absolute;inset:1% 2% 12%;z-index:-2;border-radius:19px;background:linear-gradient(155deg,rgba(255,255,255,.68),rgba(245,237,226,.46));border:1px solid rgba(98,76,57,.07);box-shadow:0 6px 16px rgba(76,56,38,.035),inset 0 1px rgba(255,255,255,.65);transition:.24s ease}
      #characters .hc-person:after{content:attr(data-hc-num);position:absolute;top:5%;left:8%;z-index:9;font:400 16px/1 Georgia,serif;color:#b59b7a;letter-spacing:-.04em;opacity:.8}
      #characters .hc-person:hover:before,#characters .hc-person.focused:before{background:#fffdfa;border-color:rgba(190,121,90,.18);box-shadow:0 18px 38px rgba(69,50,36,.12),0 1px 0 rgba(255,255,255,.8) inset;transform:translateY(-3px)}
      #characters .hc-person:hover,#characters .hc-person.focused{z-index:8!important;transform:translateY(-1px)!important}

      #characters .hc-person .fig{position:absolute!important;left:50%!important;transform:translateX(-50%)!important;width:82%!important;height:72%!important;top:4%!important;overflow:visible!important;transition:transform .25s cubic-bezier(.2,.8,.2,1),filter .24s ease,opacity .24s ease!important}
      #characters .hc-person .tag{position:absolute!important;left:50%!important;transform:translateX(-50%)!important;bottom:0!important;width:94%!important;padding:7px 5px 6px!important;border-radius:999px!important;background:rgba(247,239,228,.965)!important;border:1px solid rgba(103,82,62,.075)!important;box-shadow:0 5px 14px rgba(74,58,42,.04)!important;text-align:center!important;backdrop-filter:blur(6px)}
      #characters .hc-person .tag strong{font:400 14px/1.05 Georgia,serif!important;color:#544a42!important}
      #characters .hc-person .tag span{margin-top:3px!important;font:500 5.7px/1 Arial,sans-serif!important;letter-spacing:.08em!important;color:#a59b92!important}

      #characters .hc-person:not([data-id='clara']) .fig{opacity:.17!important;filter:grayscale(.5) saturate(.24) sepia(.08)!important}
      #characters .hc-person:not([data-id='clara']) .tag:before{content:'PORTRAIT EN CRÉATION';position:absolute;left:50%;top:-17px;transform:translateX(-50%);white-space:nowrap;padding:3px 7px;border-radius:999px;background:rgba(255,252,247,.78);border:1px solid rgba(104,82,62,.06);font:500 4.8px/1 Arial,sans-serif;letter-spacing:.11em;color:#b4aaa1}
      #characters .hc-person:not([data-id='clara']) .tag:after{content:'✦';position:absolute;left:50%;bottom:-17px;transform:translateX(-50%);font-size:7px;color:#c4b49f;opacity:.55}
      #characters .hc-person:not([data-id='clara']):hover .fig,#characters .hc-person:not([data-id='clara']).focused .fig{opacity:.36!important;filter:grayscale(.25) saturate(.5)!important;transform:translateX(-50%) translateY(-4px) scale(1.015)!important}
      #characters .hc-cast.has-focus .hc-person:not(.focused){opacity:.66!important;filter:none!important}

      #characters .hc-person[data-id='clara']{grid-row:1 / 3!important;grid-column:1!important;z-index:5!important}
      #characters .hc-person[data-id='clara']:before{inset:0 0 10%!important;border-radius:31px 31px 22px 22px!important;background:
        radial-gradient(circle at 48% 35%,rgba(255,255,255,.98) 0 28%,rgba(252,246,237,.95) 52%,rgba(244,232,217,.95) 100%)!important;
        border:1px solid rgba(186,130,98,.15)!important;box-shadow:0 22px 46px rgba(90,61,42,.10),inset 0 0 0 1px rgba(255,255,255,.55)!important}
      #characters .hc-person[data-id='clara']:after{content:'01';top:4%;left:7%;font:400 clamp(25px,2.15vw,38px)/1 Georgia,serif;color:#c8a97f;opacity:1}
      #characters .hc-person[data-id='clara'] .fig{width:131%!important;height:93%!important;top:-2.5%!important}
      #characters .hc-person[data-id='clara'] .fig:before{content:'PERSONNAGE FINAL';position:absolute;right:3%;top:3%;z-index:8;writing-mode:vertical-rl;font:600 5.7px/1 Arial,sans-serif;letter-spacing:.17em;color:#a97c66}
      #characters .hc-person[data-id='clara'] .fig:after{content:'✦  ✦';position:absolute;right:2.5%;top:17%;font-size:7px;letter-spacing:5px;color:#d1ad7d;opacity:.72}
      #characters .hc-person[data-id='clara'] .fig .hc-clara-master{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;object-position:50% 100%!important;border-radius:0!important;mix-blend-mode:multiply!important;filter:drop-shadow(0 17px 15px rgba(82,51,35,.14)) saturate(1.035) contrast(1.025)!important;-webkit-mask-image:linear-gradient(to bottom,#000 0 93%,rgba(0,0,0,.93) 97%,transparent 100%)!important;mask-image:linear-gradient(to bottom,#000 0 93%,rgba(0,0,0,.93) 97%,transparent 100%)!important}
      #characters .hc-person[data-id='clara']:hover .fig,#characters .hc-person[data-id='clara'].focused .fig{transform:translateX(-50%) translateY(-8px) scale(1.028)!important}
      #characters .hc-person[data-id='clara'] .tag{bottom:0!important;width:106%!important;padding:11px 8px 10px!important;border-radius:19px!important;background:linear-gradient(180deg,#f4e7d7,#efdfcc)!important;border-color:rgba(190,121,90,.16)!important;box-shadow:0 10px 24px rgba(83,58,42,.075)!important}
      #characters .hc-person[data-id='clara'] .tag:before{content:'SÉLECTION OFFICIELLE';position:absolute;left:50%;top:-18px;transform:translateX(-50%);font:600 5px Arial,sans-serif;letter-spacing:.18em;color:#a87661;white-space:nowrap}
      #characters .hc-person[data-id='clara'] .tag strong{font:400 20px/1 Georgia,serif!important;color:#624538!important;letter-spacing:-.02em}
      #characters .hc-person[data-id='clara'] .tag span{font-size:6.1px!important;letter-spacing:.125em!important;color:#9b725f!important}

      #characters .hc-focus{padding:12px 25px 19px!important;color:var(--hc-ink)!important;background:linear-gradient(180deg,rgba(255,253,249,.98),rgba(255,252,247,.98))!important}
      #characters .hc-focus:before{content:'DOSSIER PERSONNAGE';display:block;margin-bottom:8px;font:600 6.3px Arial,sans-serif;letter-spacing:.23em;color:#a87862}
      #characters .hc-focus-nav{padding:0 0 12px!important;border-bottom:1px solid var(--hc-line)!important}
      #characters .hc-focus-nav:before{content:'PORTRAIT  ·  COLLECTION 01';margin-right:auto;font:600 6.3px/1 Arial,sans-serif;letter-spacing:.20em;color:#9d7e6d}
      #characters .hc-focus-header-final{display:grid;grid-template-columns:118px 1fr;gap:18px;align-items:center;padding:15px 0 14px;border-bottom:1px solid var(--hc-line);position:relative}
      #characters .hc-focus-header-final:after{content:'✦';position:absolute;right:2px;top:17px;font-size:11px;color:#d0ad7f;opacity:.8}
      #characters .hc-focus-portrait-final{width:113px;height:113px;border-radius:50%;overflow:hidden;background:#fbf2e7;border:1px solid rgba(184,130,99,.30);box-shadow:0 10px 26px rgba(85,59,40,.09),0 0 0 5px rgba(250,243,233,.75);position:relative}
      #characters .hc-focus-portrait-final:after{content:'✦';position:absolute;left:50%;bottom:-1px;transform:translateX(-50%);width:23px;height:23px;border-radius:50%;display:grid;place-items:center;background:#fffdf9;color:#c29a75;border:1px solid rgba(184,130,99,.24);font-size:9px}
      #characters .hc-focus-portrait-final img{width:100%;height:100%;object-fit:cover;object-position:50% 13%;display:block;mix-blend-mode:multiply;transform:scale(1.14);filter:saturate(1.035) contrast(1.025)}
      #characters .hc-focus-title-final h3{margin:0 0 7px!important;font:400 38px/.93 Georgia,serif!important;letter-spacing:-.03em!important;color:#383530!important}
      #characters .hc-focus-title-final .vibe{margin:0!important;font:italic 13.5px/1.48 Georgia,serif!important;color:#97644f!important}
      #characters .hc-focus>h3,#characters .hc-focus>.vibe{display:none!important}
      #characters .hc-focus-block{padding:12px 0!important;border-top:1px solid var(--hc-line)!important}
      #characters .hc-focus-header-final + .hc-focus-block{border-top:0!important}
      #characters .hc-focus-block b{font:600 6.4px/1 Arial,sans-serif!important;letter-spacing:.19em!important;color:#70866d!important}
      #characters .hc-focus-block p{margin:5px 0 0!important;font:400 12.4px/1.48 Georgia,serif!important;color:#4d4843!important}
      #characters .hc-projection{position:relative;margin-top:8px!important;padding:13px 36px 13px 14px!important;background:linear-gradient(145deg,#f3ebe2,#ebe0d5)!important;border:1px solid rgba(104,82,62,.06)!important;border-radius:14px!important;box-shadow:inset 0 1px rgba(255,255,255,.55)!important}
      #characters .hc-projection:after{content:'❧';position:absolute;right:14px;bottom:10px;font:400 26px Georgia,serif;color:#bba88f;opacity:.45;transform:rotate(-18deg)}
      #characters .hc-focus-actions{gap:9px!important;margin-top:13px!important}
      #characters .hc-focus-actions button{min-height:43px!important;border-radius:11px!important;background:#fffdfa!important;border:1px solid rgba(91,72,55,.14)!important;font:400 10.5px Georgia,serif!important;transition:transform .18s ease,box-shadow .18s ease,background .18s ease!important}
      #characters .hc-focus-actions button:hover{transform:translateY(-2px);box-shadow:0 8px 18px rgba(70,52,38,.07)!important}
      #characters .hc-focus-actions .primary{background:linear-gradient(180deg,#80917b,#72856e)!important;color:#fff!important;border:0!important;font:400 14.5px Georgia,serif!important;box-shadow:0 9px 22px rgba(83,103,79,.18)!important;letter-spacing:.01em}
      #characters .hc-focus-actions .primary:before{content:'✦';margin-right:9px;color:#f4eadb}

      @media(max-width:1100px){
        #characters .hc-grid{grid-template-columns:1.52fr repeat(4,minmax(0,1fr))!important;overflow-y:auto!important;grid-auto-rows:minmax(150px,1fr)!important}
        #characters .hc-person[data-id='clara']{grid-row:1 / 3!important}
      }
      @media(max-width:760px){
        #characters .hc-page{background:#fffdf9!important}
        #characters .hc-cast-head{right:4.5%!important}
        #characters .hc-grid{right:4.5%!important;grid-template-columns:1.28fr repeat(2,minmax(0,1fr))!important}
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