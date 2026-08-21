(function(){
  if(window.__HCMayaCardFinalV1)return;window.__HCMayaCardFinalV1=true;
  const $=(s,r=document)=>r.querySelector(s);

  function css(){
    /* Maya repart de zero visuellement : on supprime le style de son ancienne fiche. */
    $('#hcMayaOfficialVisualV3Styles')?.remove();
    if($('#hcMayaCardFinalV1Styles'))return;
    const s=document.createElement('style');
    s.id='hcMayaCardFinalV1Styles';
    s.textContent=`
      html body #characters .hc-person[data-id='maya']{overflow:visible!important}
      html body #characters .hc-person[data-id='maya'] .fig{position:absolute!important;left:5%!important;right:5%!important;top:4%!important;bottom:19%!important;width:auto!important;height:auto!important;border-radius:20px!important;overflow:hidden!important;background:radial-gradient(circle at 50% 34%,#fffdfa 0 36%,#f9efe4 72%,#f2e4d6 100%)!important;box-shadow:inset 0 0 0 1px rgba(115,86,64,.045)!important;transform:none!important;opacity:1!important;filter:none!important}
      html body #characters .hc-person[data-id='maya'] .fig:before,html body #characters .hc-person[data-id='maya'] .fig:after{display:none!important}
      html body #characters .hc-person[data-id='maya'] .fig img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:contain!important;object-position:50% 100%!important;transform:scale(.96)!important;transform-origin:50% 100%!important;mix-blend-mode:normal!important;filter:drop-shadow(0 9px 10px rgba(71,50,35,.10))!important;background:transparent!important;border:0!important;border-radius:0!important;opacity:1!important}
      html body #characters .hc-person[data-id='maya']:hover .fig,html body #characters .hc-person[data-id='maya'].focused .fig{transform:none!important;opacity:1!important;filter:none!important}
      html body #characters .hc-person[data-id='maya']:hover .fig img,html body #characters .hc-person[data-id='maya'].focused .fig img{transform:scale(.96)!important}
      html body #characters .hc-person[data-id='maya'] .tag{background:linear-gradient(180deg,#f6eadb,#f1dfca)!important;border-radius:17px!important}
      html body #characters .hc-person[data-id='maya'] .tag:before{content:'SÉLECTION OFFICIELLE'!important;position:absolute!important;left:50%!important;top:-17px!important;transform:translateX(-50%)!important;white-space:nowrap!important;padding:3px 7px!important;border-radius:999px!important;background:rgba(255,252,247,.88)!important;border:1px solid rgba(104,82,62,.06)!important;font:600 4.8px/1 Arial,sans-serif!important;letter-spacing:.11em!important;color:#a87661!important}
      html body #characters .hc-person[data-id='maya'] .tag:after{content:none!important}
    `;
    document.head.appendChild(s);
  }

  function mount(){
    css();
    const card=$('#characters .hc-person[data-id="maya"]');
    if(!card)return false;
    const fig=$('.fig',card);
    const img=fig&&$('img',fig);
    if(!fig||!img||!img.src)return false;

    card.dataset.hcOfficial='1';
    card.dataset.hcNum='03';
    img.alt='Maya';

    const strong=$('.tag strong',card);
    if(strong)strong.textContent='Maya';
    const span=$('.tag span',card);
    if(span)span.textContent='DIRECTION CRÉATIVE · SILHOUETTE';
    return true;
  }

  function boot(){
    let n=0;
    (function wait(){
      if(mount())return;
      if(++n<160)setTimeout(wait,50);
    })();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
