(function(){
  if(window.__HCInesOfficialVisual)return;
  window.__HCInesOfficialVisual=true;
  const $=(s,r=document)=>r.querySelector(s);
  const ASSET='./ines-transparent.webp?v=clean-20260821-1706';

  function installCss(){
    if($('#hcInesCleanVisualStyles'))return;
    const s=document.createElement('style');
    s.id='hcInesCleanVisualStyles';
    s.textContent=`
      #characters .hc-person[data-id='ines']{grid-row:1 / 3!important;grid-column:2!important;z-index:5!important}
      #characters .hc-person[data-id='ines']:before{inset:0 0 10%!important;border-radius:31px 31px 22px 22px!important;background:radial-gradient(circle at 48% 35%,rgba(255,255,255,.98) 0 28%,rgba(252,246,237,.95) 52%,rgba(244,232,217,.95) 100%)!important;border:1px solid rgba(186,130,98,.15)!important;box-shadow:0 22px 46px rgba(90,61,42,.10),inset 0 0 0 1px rgba(255,255,255,.55)!important}
      #characters .hc-person[data-id='ines']:after{content:'02'!important;top:4%!important;left:7%!important;font:400 clamp(25px,2.15vw,38px)/1 Georgia,serif!important;color:#c8a97f!important;opacity:1!important}
      #characters .hc-person[data-id='ines'] .fig{width:131%!important;height:93%!important;top:-2.5%!important;opacity:1!important;filter:none!important;overflow:visible!important}
      #characters .hc-person[data-id='ines'] .fig:before{content:'PERSONNAGE FINAL';position:absolute;right:3%;top:3%;z-index:8;writing-mode:vertical-rl;font:600 5.7px/1 Arial,sans-serif;letter-spacing:.17em;color:#a97c66}
      #characters .hc-person[data-id='ines'] .fig:after{content:'✦  ✦';position:absolute;right:2.5%;top:17%;font-size:7px;letter-spacing:5px;color:#d1ad7d;opacity:.72}
      #characters .hc-person[data-id='ines'] .fig img.hc-ines-master{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;object-position:50% 100%!important;border-radius:0!important;background:transparent!important;mix-blend-mode:multiply!important;filter:drop-shadow(0 17px 15px rgba(82,51,35,.14)) saturate(1.035) contrast(1.025)!important}
      #characters .hc-person[data-id='ines']:hover .fig,#characters .hc-person[data-id='ines'].focused .fig{transform:translateX(-50%) translateY(-8px) scale(1.028)!important}
      #characters .hc-person[data-id='ines'] .tag{bottom:0!important;width:106%!important;padding:11px 8px 10px!important;border-radius:19px!important;background:linear-gradient(180deg,#f4e7d7,#efdfcc)!important;border-color:rgba(190,121,90,.16)!important;box-shadow:0 10px 24px rgba(83,58,42,.075)!important}
      #characters .hc-person[data-id='ines'] .tag:before{content:'SÉLECTION OFFICIELLE'!important;position:absolute;left:50%;top:-18px;transform:translateX(-50%);font:600 5px Arial,sans-serif;letter-spacing:.18em;color:#a87661;white-space:nowrap}
      #characters .hc-person[data-id='ines'] .tag:after{content:none!important}
      #characters .hc-person[data-id='ines'] .tag strong{font:400 20px/1 Georgia,serif!important;color:#624538!important;letter-spacing:-.02em}
      #characters .hc-person[data-id='ines'] .tag span{font-size:6.1px!important;letter-spacing:.125em!important;color:#9b725f!important}
      #characters .hc-person[data-id='ines'] .fig{opacity:1!important;filter:none!important}
      @media(max-width:1100px){#characters .hc-person[data-id='ines']{grid-row:1 / 3!important;grid-column:2!important}}
    `;
    document.head.appendChild(s);
  }

  function apply(){
    installCss();
    const card=$('#characters .hc-person[data-id="ines"]');
    if(!card)return;
    const fig=$('.fig',card);
    if(!fig)return;
    let img=$('img.hc-ines-master',fig);
    if(!img){
      fig.querySelectorAll('img,svg,.placeholder').forEach(n=>n.remove());
      img=document.createElement('img');
      img.className='hc-ines-master';
      img.alt='Inès';
      img.decoding='async';
      img.loading='eager';
      fig.prepend(img);
    }
    if(img.getAttribute('src')!==ASSET)img.src=ASSET;
    const strong=$('.tag strong',card); if(strong)strong.textContent='Inès';
    const span=$('.tag span',card); if(span)span.textContent='SOLAIRE · COULEUR & MOUVEMENT';
  }

  function boot(){
    apply();
    const root=$('#characters')||document.documentElement;
    new MutationObserver(apply).observe(root,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
