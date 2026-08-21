(function(){
  if(window.__HCCharacterCreatorCleanupV1)return;
  window.__HCCharacterCreatorCleanupV1=true;
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  function installCss(){
    if($('#hcCharacterCreatorCleanupV1Styles'))return;
    const s=document.createElement('style');
    s.id='hcCharacterCreatorCleanupV1Styles';
    s.textContent=`
      #characters.hc-creator-mode{overflow:hidden!important;background:#f5efe6!important}
      #characters.hc-creator-mode > .selection-wrap,
      #characters.hc-creator-mode > .selection-stage,
      #characters.hc-creator-mode > .selection-art,
      #characters.hc-creator-mode > .hit-grid,
      #characters.hc-creator-mode > .profile-card,
      #characters.hc-creator-mode > .profile-dim{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
      #characters.hc-creator-mode .hc-cast:not(.hc-creator-host){display:none!important;visibility:hidden!important;pointer-events:none!important}
      #characters.hc-creator-mode .hc-creator-host{display:block!important;position:absolute!important;inset:0!important;z-index:80!important;background:#f8f2e9!important;overflow:hidden!important}
      #characters.hc-creator-mode .hc-creator-host>.hc-page{display:block!important;position:absolute!important;inset:0!important;left:0!important;right:0!important;top:0!important;bottom:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;background:linear-gradient(180deg,#fffdf9,#f8f1e8)!important}
      #characters.hc-creator-mode .hc-creator-host>.hc-page:before,
      #characters.hc-creator-mode .hc-creator-host>.hc-page:after{display:none!important}
      #characters.hc-creator-mode .hc-creator-host .hc-grid,
      #characters.hc-creator-mode .hc-creator-host .hc-cast-head,
      #characters.hc-creator-mode .hc-creator-host .hc-focus,
      #characters.hc-creator-mode .hc-creator-host .hc-person{display:none!important;visibility:hidden!important;pointer-events:none!important}
      #characters.hc-creator-mode .hc-creator-host .hc-cc{display:block!important;position:absolute!important;inset:0!important;z-index:100!important;background:linear-gradient(180deg,#fffdf9,#f8f1e8)!important;overflow:hidden!important}
      #characters.hc-creator-mode .hc-cc-shell{left:7%!important;right:7%!important;top:6%!important;bottom:6%!important;max-width:1600px!important;margin:auto!important}
      #characters.hc-creator-mode .hc-cc h2{font-size:clamp(46px,4.2vw,72px)!important;line-height:.95!important;margin-bottom:4px!important}
      #characters.hc-creator-mode .hc-cc-lead{margin-top:8px!important;margin-bottom:16px!important}
      #characters.hc-creator-mode .hc-cc-stage{position:relative!important;z-index:2!important}
      #characters.hc-creator-mode .hc-cc-side{position:relative!important;z-index:2!important}
      @media(max-width:1000px){#characters.hc-creator-mode .hc-cc-shell{left:4%!important;right:4%!important;top:5%!important;bottom:5%!important}}
    `;
    document.head.appendChild(s);
  }

  function clean(){
    const root=$('#characters');
    const creator=$('#characters .hc-cc');
    if(!root||!creator)return false;
    installCss();
    root.classList.add('hc-creator-mode');
    const host=creator.closest('.hc-cast');
    if(host)host.classList.add('hc-creator-host');

    $$('#characters .profile-card,#characters .profile-dim,#characters .selection-art,#characters .hit-grid').forEach(n=>{
      n.classList.remove('open','active');
      n.setAttribute('aria-hidden','true');
    });
    $$('#characters .hc-cast').forEach(c=>{
      if(c!==host)c.classList.remove('has-focus');
    });
    return true;
  }

  function boot(){
    let tries=0;
    (function wait(){
      if(clean()){
        const root=$('#characters');
        if(root)new MutationObserver(()=>clean()).observe(root,{childList:true,subtree:true});
        return;
      }
      if(++tries<200)setTimeout(wait,40);
    })();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
