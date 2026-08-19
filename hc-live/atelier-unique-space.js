(function(){
  if(window.__HCAtelierUniqueSpaceInstalled)return;window.__HCAtelierUniqueSpaceInstalled=true;
  const $=(s,r=document)=>r.querySelector(s);
  function home(){try{return window.HauteCoutureCore?.load?.()?.home?.current||JSON.parse(localStorage.getItem('haute-couture-residence')||'null')}catch(e){return null}}
  function hash(v){let h=2166136261;for(const c of String(v||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
  function unit(seed,n){let x=(seed+Math.imul(n+1,2654435761))>>>0;x^=x>>>16;x=Math.imul(x,2246822507)>>>0;x^=x>>>13;return (x>>>0)/4294967295}
  function between(seed,n,a,b){return a+(b-a)*unit(seed,n)}
  function profile(){const h=home()||{};const id=h.id||[h.city,h.type,h.surface,h.price].join('|');const seed=hash(id);const surface=Number(h.surface)||24;const generous=surface>=36;const compact=surface<=23;const side=unit(seed,1)>.5?'left':'right';const windowSpread=between(seed,2,16,28);const tableW=between(seed,3,22,31);const tableBottom=between(seed,4,17,25);const shelfW=between(seed,5,13,19);const rugW=between(seed,6,26,39);const rugH=between(seed,7,10,17);const rotation=between(seed,8,-5,5);const cuttingSide=unit(seed,9)>.5?'left':'right';const wallSplit=between(seed,10,64,74);const windowTop=between(seed,11,8,15);const windowH=between(seed,12,27,36);const tableLeft=side==='left'?between(seed,13,19,30):between(seed,13,48,60);const shelfRight=side==='left'?between(seed,14,5,12):between(seed,14,70,82);const machineLeft=tableLeft+between(seed,15,3,8);const cuttingLeft=cuttingSide==='left'?between(seed,16,18,34):between(seed,16,51,67);const window1=side==='left'?between(seed,17,6,15):between(seed,17,56,67);const window2=side==='left'?window1+windowSpread:window1-windowSpread;const layoutIndex=seed%1000000;
    return{h,id,seed,surface,generous,compact,side,tableW,tableBottom,shelfW,rugW,rugH,rotation,cuttingLeft,wallSplit,windowTop,windowH,tableLeft,shelfRight,machineLeft,window1,window2,layoutIndex};
  }
  function styles(){if($('#hcUniqueSpaceStyles'))return;const st=document.createElement('style');st.id='hcUniqueSpaceStyles';st.textContent=`
    #atelier .atelier-room.hc-unique-space{background:linear-gradient(180deg,var(--hc-wall,#eee7dc) 0 var(--hc-wall-split,69%),var(--hc-floor,#c9a27d) var(--hc-wall-split,69%) 100%)!important}
    #atelier .atelier-room.hc-unique-space .hc-home-window{top:var(--hc-window-top,11%)!important;height:var(--hc-window-h,31%)!important}
    #atelier .atelier-room.hc-unique-space .hc-home-window.w1{left:var(--hc-window1,8%)!important}
    #atelier .atelier-room.hc-unique-space .hc-home-window.w2{left:var(--hc-window2,29%)!important}
    #atelier .atelier-room.hc-unique-space .hc-home-table{left:var(--hc-table-left,24%)!important;bottom:var(--hc-table-bottom,20%)!important;width:var(--hc-table-w,27%)!important;transform:rotate(var(--hc-table-rot,0deg))}
    #atelier .atelier-room.hc-unique-space .hc-home-machine{left:var(--hc-machine-left,28%)!important;bottom:calc(var(--hc-table-bottom,20%) + 9%)!important}
    #atelier .atelier-room.hc-unique-space .hc-home-cutting{left:var(--hc-cutting-left,51%)!important;bottom:calc(var(--hc-table-bottom,20%) + 2%)!important}
    #atelier .atelier-room.hc-unique-space .hc-home-shelf{right:auto!important;left:var(--hc-shelf-left,76%)!important;width:var(--hc-shelf-w,16%)!important;bottom:var(--hc-shelf-bottom,18%)!important}
    #atelier .atelier-room.hc-unique-space .hc-home-rug{left:var(--hc-rug-left,27%)!important;bottom:var(--hc-rug-bottom,13%)!important;width:var(--hc-rug-w,32%)!important;height:var(--hc-rug-h,14%)!important;transform:skewX(var(--hc-rug-skew,-9deg)) rotate(var(--hc-rug-rot,0deg))!important}
    #atelier .atelier-room.hc-unique-space.hc-layout-mirrored .hc-home-meta{left:auto!important;right:4%!important}
    #atelier .atelier-room.hc-unique-space.hc-layout-compact .hc-home-cutting{transform:scale(.88);transform-origin:left bottom}
    #atelier .atelier-room.hc-unique-space.hc-layout-generous .hc-home-table{width:calc(var(--hc-table-w,27%) + 3%)!important}
  `;document.head.appendChild(st)}
  function apply(){const room=$('#atelier .atelier-room');if(!room)return false;styles();const p=profile();room.classList.add('hc-unique-space');room.classList.toggle('hc-layout-mirrored',p.side==='right');room.classList.toggle('hc-layout-compact',p.compact);room.classList.toggle('hc-layout-generous',p.generous);
    const shelfLeft=p.side==='left'?between(p.seed,18,72,82):between(p.seed,18,5,14);const rugLeft=between(p.seed,19,20,46);const rugBottom=between(p.seed,20,8,15);const shelfBottom=between(p.seed,21,15,25);const rugSkew=between(p.seed,22,-13,9);
    const vars={
      '--hc-wall-split':p.wallSplit+'%','--hc-window-top':p.windowTop+'%','--hc-window-h':p.windowH+'%','--hc-window1':p.window1+'%','--hc-window2':p.window2+'%','--hc-table-left':p.tableLeft+'%','--hc-table-bottom':p.tableBottom+'%','--hc-table-w':p.tableW+'%','--hc-table-rot':p.rotation+'deg','--hc-machine-left':p.machineLeft+'%','--hc-cutting-left':p.cuttingLeft+'%','--hc-shelf-left':shelfLeft+'%','--hc-shelf-w':p.shelfW+'%','--hc-shelf-bottom':shelfBottom+'%','--hc-rug-left':rugLeft+'%','--hc-rug-bottom':rugBottom+'%','--hc-rug-w':p.rugW+'%','--hc-rug-h':p.rugH+'%','--hc-rug-skew':rugSkew+'deg','--hc-rug-rot':between(p.seed,23,-4,4)+'deg'};
    Object.entries(vars).forEach(([k,v])=>room.style.setProperty(k,v));
    room.dataset.hcPropertyLayout=p.id;room.dataset.hcLayoutSignature='property-'+p.layoutIndex;
    const layer=$('#hcHomeArchitecture',room);if(layer)layer.dataset.layoutSignature='property-'+p.layoutIndex;
    return true;
  }
  function patch(){const c=window.HauteCoutureCore;if(!c||c.__hcUniqueSpacePatched)return;c.__hcUniqueSpacePatched=true;const old=c.moveHome;if(typeof old==='function')c.moveHome=function(){const s=old.apply(c,arguments);setTimeout(apply,70);return s}}
  function observe(){const a=$('#atelier');if(!a||a.dataset.hcUniqueSpaceObserver)return;a.dataset.hcUniqueSpaceObserver='1';new MutationObserver(()=>{if(a.classList.contains('active'))setTimeout(apply,70)}).observe(a,{attributes:true,attributeFilter:['class']})}
  function install(){patch();observe();return apply()}
  let tries=0;const t=setInterval(()=>{tries++;if(install()||tries>180)clearInterval(t)},80);
})();