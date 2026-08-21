(function(){
  if(window.__HCCharacterVisualCropV5)return;window.__HCCharacterVisualCropV5=true;
  const $=(s,r=document)=>r.querySelector(s);
  function boot(){
    const s=document.createElement('style');s.id='hcCharacterVisualCropV5Styles';s.textContent=`
      html body #characters .hc-person[data-id='clara'] .fig,
      html body #characters .hc-person[data-id='ines'] .fig,
      html body #characters .hc-person[data-id='maya'] .fig{left:5%!important;right:5%!important;top:4%!important;bottom:19%!important;width:auto!important;height:auto!important;overflow:hidden!important;border-radius:18px!important;background:radial-gradient(circle at 50% 34%,#fffdfa 0 38%,#f8eee2 74%,#f1e3d3 100%)!important}
      html body #characters .hc-person[data-id='ines'] .fig .hc-ines-master{display:block!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:50% 44%!important;transform:scale(1.01)!important;opacity:1!important;filter:none!important;mix-blend-mode:normal!important}
      html body #characters .hc-person[data-id='clara'] .tag:before,
      html body #characters .hc-person[data-id='ines'] .tag:before,
      html body #characters .hc-person[data-id='maya'] .tag:before{content:'SÉLECTION OFFICIELLE'!important;display:block!important;position:absolute!important;left:50%!important;top:-16px!important;transform:translateX(-50%)!important;white-space:nowrap!important;padding:3px 6px!important;border-radius:999px!important;background:rgba(255,252,247,.9)!important;border:1px solid rgba(103,82,62,.06)!important;font:600 4.8px/1 Arial,sans-serif!important;letter-spacing:.12em!important;color:#9d7764!important}
      html body #characters .hc-person[data-id='clara'] .tag:after,
      html body #characters .hc-person[data-id='ines'] .tag:after,
      html body #characters .hc-person[data-id='maya'] .tag:after{display:none!important}
      html body #characters .hc-cast.has-focus .hc-person:not(.focused),html body #characters .hc-person{opacity:1!important;filter:none!important}
    `;document.head.appendChild(s);
    const c=$('#characters .hc-person[data-id="ines"]');if(c)c.dataset.hcOfficial='1';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();