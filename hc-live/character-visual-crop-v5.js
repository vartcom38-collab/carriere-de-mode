(function(){
  if(window.__HCCharacterVisualCropV5)return;window.__HCCharacterVisualCropV5=true;
  const $=(s,r=document)=>r.querySelector(s);

  function css(){
    if($('#hcCharacterVisualCropV5Styles'))return;
    const s=document.createElement('style');s.id='hcCharacterVisualCropV5Styles';s.textContent=`
      html body #characters .hc-person[data-id='clara'] .fig,
      html body #characters .hc-person[data-id='ines'] .fig,
      html body #characters .hc-person[data-id='maya'] .fig{left:5%!important;right:5%!important;top:4%!important;bottom:19%!important;width:auto!important;height:auto!important;overflow:hidden!important;border-radius:18px!important;background:radial-gradient(circle at 50% 34%,#fffdfa 0 38%,#f8eee2 74%,#f1e3d3 100%)!important}
      html body #characters .hc-person[data-id='clara'] .fig .hc-clara-master,
      html body #characters .hc-person[data-id='maya'] .fig .hc-maya-master{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:contain!important;object-position:50% 100%!important;transform:none!important;filter:none!important;mix-blend-mode:normal!important;border:0!important;border-radius:0!important}
      html body #characters .hc-person[data-id='ines'] .fig .hc-ines-master.hc-ines-source-v5{position:absolute!important;width:1px!important;height:1px!important;left:-9999px!important;top:-9999px!important;opacity:0!important;pointer-events:none!important}
      html body #characters .hc-crop-svg-v5{position:absolute;inset:0;width:100%;height:100%;display:block;overflow:hidden;pointer-events:none}
      html body #characters .hc-person[data-id='clara'] .tag:before,
      html body #characters .hc-person[data-id='ines'] .tag:before,
      html body #characters .hc-person[data-id='maya'] .tag:before{content:'SÉLECTION OFFICIELLE'!important;display:block!important;position:absolute!important;left:50%!important;top:-16px!important;transform:translateX(-50%)!important;white-space:nowrap!important;padding:3px 6px!important;border-radius:999px!important;background:rgba(255,252,247,.9)!important;border:1px solid rgba(103,82,62,.06)!important;font:600 4.8px/1 Arial,sans-serif!important;letter-spacing:.12em!important;color:#9d7764!important}
      html body #characters .hc-person[data-id='clara'] .tag:after,
      html body #characters .hc-person[data-id='ines'] .tag:after,
      html body #characters .hc-person[data-id='maya'] .tag:after{display:none!important}
      html body #characters .hc-cast.has-focus .hc-person:not(.focused),html body #characters .hc-person{opacity:1!important;filter:none!important}
      .hc-focus-header-v2 .portrait .hc-crop-svg-v5{position:relative!important;width:100%!important;height:100%!important}
      .hc-portrait-v2 .hc-crop-svg-v5{position:absolute!important;inset:0!important;width:100%!important;height:100%!important}
      .hc-portrait-v2 .hc-portrait-card-v2 .hc-crop-svg-v5{background:transparent}
    `;document.head.appendChild(s)
  }

  function cropSvg(src,mode='full'){
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('hc-crop-svg-v5');svg.setAttribute('preserveAspectRatio','xMidYMid meet');
    const im=document.createElementNS('http://www.w3.org/2000/svg','image');im.setAttribute('href',src);svg.appendChild(im);
    const probe=new Image();probe.onload=()=>{
      const w=probe.naturalWidth||1,h=probe.naturalHeight||1;
      let x=0,y=0,vw=w,vh=h;
      if(mode==='ines-full'){vw=w*.78;}
      if(mode==='ines-face'){x=w*.05;y=h*.01;vw=w*.66;vh=h*.31;}
      if(mode==='ines-detail'){x=w*.04;y=h*.14;vw=w*.72;vh=h*.42;}
      svg.setAttribute('viewBox',`${x} ${y} ${vw} ${vh}`);im.setAttribute('width',w);im.setAttribute('height',h);
    };probe.src=src;return svg
  }

  function mountInes(){
    const card=$('#characters .hc-person[data-id="ines"]'),fig=$('.fig',card);if(!fig)return false;
    let img=$('.hc-ines-master',fig)||$('img',fig);if(!img||!img.src)return false;
    img.classList.add('hc-ines-source-v5');
    if(!$('.hc-ines-card-crop-v5',fig)){
      const svg=cropSvg(img.src,'ines-full');svg.classList.add('hc-ines-card-crop-v5');fig.appendChild(svg)
    }
    card.dataset.hcOfficial='1';return true
  }
  function normalizeOfficial(){
    ['clara','maya'].forEach(id=>{const c=$(`#characters .hc-person[data-id="${id}"]`);if(c)c.dataset.hcOfficial='1'});
  }

  function syncFocus(){
    const card=$('#characters .hc-person.focused'),focus=$('#characters .hc-focus');if(!card||!focus)return;
    if(card.dataset.id!=='ines')return;
    const src=$('.hc-ines-source-v5',card)?.src;if(!src)return;
    const p=$('.hc-focus-header-v2 .portrait',focus);if(!p)return;
    p.innerHTML='';p.appendChild(cropSvg(src,'ines-face'));
  }

  function syncGallery(){
    const o=$('.hc-portrait-v2.open');if(!o)return;
    const hero=$('.hc-portrait-hero-v2[data-id="ines"]',o);if(!hero)return;
    const src=$('#characters .hc-person[data-id="ines"] .hc-ines-source-v5')?.src;if(!src)return;
    const replace=(box,mode)=>{if(!box||$('.hc-crop-svg-v5',box))return;const old=$('img',box);if(old)old.style.display='none';box.appendChild(cropSvg(src,mode))};
    replace(hero,'ines-full');replace($('.hc-portrait-card-v2.full[data-id="ines"]',o),'ines-full');replace($('.hc-portrait-card-v2.face[data-id="ines"]',o),'ines-face');replace($('.hc-portrait-card-v2.detail[data-id="ines"]',o),'ines-detail');
  }

  function boot(){
    css();normalizeOfficial();let n=0;(function wait(){if(mountInes()){setTimeout(syncFocus,80);return}if(++n<120)setTimeout(wait,50)})();
    document.addEventListener('click',e=>{
      if(e.target.closest?.('#characters .hc-person,#characters .hc-focus-nav'))setTimeout(syncFocus,25);
      if(e.target.closest?.('#characters .hc-focus [data-profile]')){setTimeout(syncGallery,80);setTimeout(syncGallery,220)}
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();