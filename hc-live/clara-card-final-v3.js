(function(){
  if(window.__HCClaraCardFinalV3)return;window.__HCClaraCardFinalV3=true;
  const $=(s,r=document)=>r.querySelector(s);
  function css(){
    if($('#hcClaraCardFinalV3Styles'))return;
    const s=document.createElement('style');s.id='hcClaraCardFinalV3Styles';s.textContent=`
      /* Clara = carte maître. Même gabarit que le reste, visuel réellement contenu. */
      html body #characters .hc-person[data-id='clara']{border-radius:22px!important;overflow:visible!important}
      html body #characters .hc-person[data-id='clara']:before{border-radius:22px!important;background:linear-gradient(155deg,#fffdfa,#f6ecdf)!important}
      html body #characters .hc-person[data-id='clara'] .fig{position:absolute!important;left:5%!important;right:5%!important;top:4%!important;bottom:19%!important;width:auto!important;height:auto!important;overflow:hidden!important;border-radius:19px!important;background:radial-gradient(circle at 50% 28%,#fffdf9 0 36%,#f8eee3 73%,#efe0cf 100%)!important;box-shadow:inset 0 0 0 1px rgba(116,89,68,.045)!important;transform:none!important}
      html body #characters .hc-person[data-id='clara'] .fig:before{display:block!important;content:''!important;position:absolute!important;inset:auto 20% 3% 20%!important;height:9px!important;border-radius:50%!important;background:rgba(83,57,39,.09)!important;filter:blur(4px)!important;z-index:0!important}
      html body #characters .hc-person[data-id='clara'] .fig:after{display:none!important}
      html body #characters .hc-person[data-id='clara'] .hc-clara-master{position:absolute!important;left:-5%!important;top:-2%!important;width:110%!important;height:104%!important;max-width:none!important;max-height:none!important;object-fit:contain!important;object-position:50% 100%!important;transform:none!important;transform-origin:50% 100%!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;filter:saturate(1.02) contrast(1.015)!important;mix-blend-mode:multiply!important;z-index:1!important}
      html body #characters .hc-person[data-id='clara']:hover .hc-clara-master,html body #characters .hc-person[data-id='clara'].focused .hc-clara-master{transform:none!important}
      html body #characters .hc-person[data-id='clara'] .tag{left:4%!important;right:4%!important;bottom:3%!important;width:auto!important;transform:none!important;min-height:12.5%!important;padding:8px 6px 7px!important;border-radius:16px!important;background:linear-gradient(180deg,#f5e8d9,#f0dfcb)!important;border:1px solid rgba(111,84,63,.075)!important}
      html body #characters .hc-person[data-id='clara'] .tag strong{font:400 16px/1 Georgia,serif!important;color:#4a433e!important}
      html body #characters .hc-person[data-id='clara'] .tag span{font:600 5.7px/1.15 Arial,sans-serif!important;letter-spacing:.08em!important;color:#8f796b!important}
      html body #characters .hc-person[data-id='clara'] .tag:before{content:'SÉLECTION OFFICIELLE'!important;display:block!important;position:absolute!important;left:50%!important;top:-16px!important;transform:translateX(-50%)!important;white-space:nowrap!important;padding:3px 7px!important;border-radius:999px!important;background:rgba(255,252,247,.93)!important;border:1px solid rgba(103,82,62,.06)!important;font:600 4.8px/1 Arial,sans-serif!important;letter-spacing:.12em!important;color:#a27661!important}
      html body #characters .hc-person[data-id='clara'].focused:before{border-color:rgba(203,126,89,.42)!important;box-shadow:0 24px 48px rgba(67,48,34,.15),0 0 0 1px rgba(255,255,255,.7) inset!important}
      html body #characters .hc-cast.has-focus .hc-person:not(.focused){opacity:1!important;filter:none!important}
      /* Portrait de droite : même Clara, recadrée volontairement. */
      html body #characters .hc-focus-header-v2[data-id='clara'] .portrait{background:radial-gradient(circle,#fffaf4,#efe0cf)!important}
      html body #characters .hc-focus-header-v2[data-id='clara'] .portrait img{width:118%!important;height:118%!important;margin:-5% 0 0 -9%!important;object-fit:cover!important;object-position:50% 12%!important;transform:none!important;mix-blend-mode:multiply!important}
      /* La comparaison doit rester visible, y compris sur les grands écrans. */
      .hc-compare-v1{z-index:300!important;left:32px!important;bottom:22px!important;transform:none!important;max-width:calc(100vw - 64px)!important}
      .hc-compare-v1.open{display:flex!important}
      .hc-compare-v1 .go{min-width:120px!important}
      /* Dossier Clara : plus éditorial, sans galerie inutile. */
      .hc-clara-sheet-v1 .paper{width:min(1160px,95vw)!important;border-radius:30px!important;background:linear-gradient(90deg,#fffdf8 0 49%,#e9ded1 49.3%,#fffdf8 50% 100%)!important;box-shadow:0 34px 90px rgba(44,32,24,.24)!important}
      .hc-clara-dossier-v1{grid-template-columns:.72fr 1.28fr!important;gap:34px!important}
      .hc-clara-left-v1{padding:10px 14px!important;position:relative!important;min-height:630px!important;display:flex!important;flex-direction:column!important}
      .hc-clara-left-v1:after{content:'01';position:absolute;right:10px;top:2px;font:400 46px/1 Georgia,serif;color:#c6a987}
      .hc-clara-left-v1 h2{font-size:76px!important;color:#302f2c!important}
      .hc-clara-left-v1 em{color:#936452!important;font-size:15px!important}
      .hc-clara-left-v1 .quote{margin-top:auto!important;background:linear-gradient(135deg,#f2e5d7,#f7efe5)!important;border:1px solid rgba(151,102,74,.08)!important;padding:18px!important}
      .hc-clara-right-v1{gap:13px!important}
      .hc-story-v1{padding:17px 18px!important;border-radius:18px!important;background:rgba(255,250,244,.92)!important}
      .hc-story-v1 h3{font-size:22px!important}
      .hc-story-v1 p,.hc-story-v1 li{font-size:13px!important;line-height:1.55!important}
      @media(max-width:850px){.hc-clara-left-v1{min-height:auto!important}.hc-clara-dossier-v1{grid-template-columns:1fr!important}}
    `;document.head.appendChild(s)
  }
  function patch(){
    const card=$('#characters .hc-person[data-id="clara"]');if(card)card.dataset.hcOfficial='1';
    const focus=$('#characters .hc-focus');const selected=$('#characters .hc-person.focused')?.dataset.id;
    if(selected==='clara'&&focus){
      const p=$('.hc-focus-actions [data-profile]',focus);if(p)p.textContent='Découvrir Clara';
      const c=$('.hc-focus-actions [data-compare]',focus);if(c&&c.textContent.trim()==='Comparer')c.setAttribute('aria-label','Ajouter Clara au comparatif');
    }
  }
  function boot(){css();$('#characters .selection-art')?.remove();let n=0;(function wait(){const card=$('#characters .hc-person[data-id="clara"]'),img=$('.hc-clara-master',card);if(card&&img){patch();return}if(++n<120)setTimeout(wait,50)})();document.addEventListener('click',e=>{if(e.target.closest?.('#characters .hc-person,#characters .hc-focus'))setTimeout(patch,20)},true)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();