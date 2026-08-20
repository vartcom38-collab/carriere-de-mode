(function(){
  if(window.__HCCharacterNotebookSplitInstalled)return;
  window.__HCCharacterNotebookSplitInstalled=true;
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  function installCss(){
    if($('#hcCharacterNotebookSplitStyles'))return;
    const st=document.createElement('style');
    st.id='hcCharacterNotebookSplitStyles';
    st.textContent=`
      #characters .selection-wrap{position:absolute!important;inset:0!important;display:block!important;width:100vw!important;height:100vh!important;overflow:hidden!important}
      #characters .selection-stage{position:absolute!important;inset:0!important;width:100vw!important;height:100vh!important;max-width:none!important;max-height:none!important;aspect-ratio:auto!important;box-shadow:none!important;overflow:hidden!important}
      #characters .hc-cast{
        inset:0!important;width:100%!important;height:100%!important;
        background:radial-gradient(circle at 20% 8%,rgba(255,255,255,.92),transparent 25%),linear-gradient(135deg,#ded3c5,#eee5d8 56%,#d8cbbb)!important;
      }
      #characters .hc-page{
        left:2.5%!important;right:2.5%!important;top:2.2%!important;bottom:2.8%!important;
        background:linear-gradient(90deg,#fffdf8 0 66.8%,#f3ecdf 67%,#fbf7ef 67.8%,#fffdf8 100%)!important;
        box-shadow:0 24px 60px rgba(55,40,28,.19)!important;
        border-radius:12px 18px 16px 9px!important;
      }
      #characters .hc-page:before{
        left:66.6%!important;top:0!important;bottom:0!important;width:16px!important;
        background:linear-gradient(90deg,rgba(107,88,68,.08),rgba(255,255,255,.7) 48%,rgba(107,88,68,.08))!important;
        opacity:.72!important;
      }
      #characters .hc-page:after{
        background:linear-gradient(rgba(196,181,161,.08) 1px,transparent 1px)!important;
        background-size:100% 38px!important;opacity:.16!important;
      }
      #characters .hc-cast-head{left:6%!important;right:35%!important;top:4.6%!important;text-align:center!important}
      #characters .hc-cast-head h2{font-size:clamp(28px,3vw,48px)!important}
      #characters .hc-cast-head p{font-size:10px!important}

      #characters .hc-grid{
        left:6%!important;right:35%!important;top:15.5%!important;bottom:6.5%!important;
        display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;
        grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:1.2% 1.7%!important;
        overflow:visible!important;padding:0!important;
      }
      #characters .hc-person{z-index:2!important;transform-origin:50% 78%!important}
      #characters .hc-person .fig{width:78%!important;height:74%!important;top:1%!important}
      #characters .hc-person .tag{width:95%!important;bottom:1%!important}
      #characters .hc-person .tag strong{font-size:15px!important}
      #characters .hc-person .tag span{font-size:7px!important}
      #characters .hc-person:hover,#characters .hc-person:focus-visible,#characters .hc-person.focused{
        transform:translateY(-5px) scale(1.055)!important;z-index:4!important;
      }
      #characters .hc-cast.has-focus .hc-person:not(.focused){opacity:.55!important;filter:saturate(.72)!important}

      #characters .hc-focus{
        left:69%!important;right:5%!important;top:14.5%!important;bottom:6.5%!important;width:auto!important;
        max-height:none!important;overflow:auto!important;padding:17px 18px 16px!important;
        transform:none!important;transition:opacity .2s ease!important;
        background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
        z-index:8!important;opacity:0!important;pointer-events:none!important;
      }
      #characters .hc-focus.open{opacity:1!important;pointer-events:auto!important;transform:none!important}
      #characters .hc-focus.open:before{display:none!important}
      #characters .hc-focus:not(.open):before{
        content:'Choisis une silhouette…';display:block;position:absolute;left:18px;right:18px;top:43%;
        text-align:center;font:italic 15px Georgia,serif;color:rgba(87,78,67,.48);letter-spacing:.02em;
      }
      #characters .hc-focus-nav{padding-bottom:8px;border-bottom:1px solid rgba(88,72,57,.11)}
      #characters .hc-focus h3{font-size:31px!important;margin-top:12px!important}
      #characters .hc-focus .vibe{margin-bottom:14px!important}
      #characters .hc-focus-actions{margin-top:14px!important}
      #characters .hc-focus-actions .primary{background:#71806c!important}

      #characters .hc-compare{left:6%!important;bottom:3.5%!important;max-width:57%!important}
      #characters .hc-compare-panel{left:6%!important;bottom:9.5%!important;width:min(560px,56%)!important}

      @media(max-width:900px){
        #characters .selection-stage{width:100vw!important;height:100vh!important}
        #characters .hc-page{left:1%!important;right:1%!important;top:1%!important;bottom:1%!important;background:linear-gradient(180deg,#fffdf8 0 62%,#f3ecdf 62.2%,#fffdf8 63%,#fffdf8 100%)!important}
        #characters .hc-page:before{left:0!important;right:0!important;top:62%!important;bottom:auto!important;width:100%!important;height:14px!important;background:linear-gradient(180deg,rgba(107,88,68,.07),rgba(255,255,255,.75),rgba(107,88,68,.06))!important}
        #characters .hc-cast-head{left:5%!important;right:5%!important;top:3.5%!important}
        #characters .hc-cast-head h2{font-size:28px!important}
        #characters .hc-grid{left:4%!important;right:4%!important;top:13.5%!important;bottom:39%!important;grid-template-columns:repeat(4,1fr)!important;grid-template-rows:repeat(3,1fr)!important;overflow:visible!important}
        #characters .hc-person .fig{width:72%!important;height:72%!important}
        #characters .hc-person .tag strong{font-size:13px!important}
        #characters .hc-focus{left:4%!important;right:4%!important;top:64%!important;bottom:3%!important;width:auto!important;max-height:none!important;padding:12px 16px!important;border-radius:0!important}
        #characters .hc-focus h3{font-size:24px!important;margin-top:5px!important}
        #characters .hc-focus-block{display:none!important}
        #characters .hc-focus .hc-projection{display:block!important}
        #characters .hc-compare{display:none!important}
        #characters .hc-compare-panel{display:none!important}
      }
    `;
    document.head.appendChild(st);
  }

  function clearFocus(){
    const root=$('.hc-cast');
    if(!root)return;
    root.classList.remove('has-focus');
    $$('.hc-person',root).forEach(p=>p.classList.remove('focused'));
    const f=$('.hc-focus',root);if(f)f.classList.remove('open');
  }

  function wire(root){
    if(!root||root.dataset.hcSplitWired)return;
    root.dataset.hcSplitWired='1';
    let leaveTimer=null;
    const cancel=()=>{if(leaveTimer){clearTimeout(leaveTimer);leaveTimer=null}};
    const maybeClear=e=>{
      const t=e.target;
      if(t.closest?.('.hc-person')||t.closest?.('.hc-focus')||t.closest?.('.hc-compare')||t.closest?.('.hc-compare-panel'))return;
      cancel();leaveTimer=setTimeout(clearFocus,110);
    };
    root.addEventListener('pointermove',maybeClear,true);
    root.addEventListener('pointerover',e=>{if(e.target.closest?.('.hc-person,.hc-focus'))cancel()},true);
    root.addEventListener('click',e=>{
      if(!matchMedia('(pointer:coarse)').matches)return;
      if(e.target.closest?.('.hc-person,.hc-focus,.hc-compare,.hc-compare-panel'))return;
      clearFocus();
    },true);
  }

  function apply(){
    installCss();
    const root=$('#characters .hc-cast');
    if(root)wire(root);
  }

  function boot(){
    apply();
    const stage=$('#characters .selection-stage');
    if(stage)new MutationObserver(apply).observe(stage,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();