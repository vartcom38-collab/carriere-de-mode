(function(){
  if(window.__HCCareerUICleanupInstalled)return;window.__HCCareerUICleanupInstalled=true;
  const $=(s,r=document)=>r.querySelector(s);
  function installStyles(){if($('#hcCareerCleanupStyles'))return;const st=document.createElement('style');st.id='hcCareerCleanupStyles';st.textContent=`
    #atelier .hc-stats{grid-template-columns:repeat(4,1fr)!important}
    #atelier .hc-stat{background:rgba(232,238,225,.82)!important}
    #atelier .hc-emotion{display:none!important}
    @media(max-width:850px){#atelier .hc-stats{grid-template-columns:repeat(2,1fr)!important}}
  `;document.head.appendChild(st)}
  function refresh(){
    installStyles();
    const stats=$('#atelier .hc-stats');if(!stats)return;
    if(stats.dataset.hcCareerOnly!=='1'){
      stats.dataset.hcCareerOnly='1';
      stats.innerHTML='<div class="hc-stat">Budget<strong id="hcMoney">—</strong></div><div class="hc-stat">Jour<strong id="hcDay">—</strong></div><div class="hc-stat">Réputation<strong id="hcCareerRep">—</strong></div><div class="hc-stat">Commandes<strong id="hcCareerOrders">—</strong></div>';
    }
    try{
      const s=window.HauteCoutureCore?.load?.();if(!s)return;
      const rep=(s.player?.reputation?.local||0)+(s.player?.reputation?.professional||0)+(s.player?.reputation?.creative||0);
      const orders=s.missions?.completed?.length||0;
      const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
      set('hcMoney',(s.player?.money??0)+' €');
      set('hcDay','Jour '+(s.world?.day||1));
      set('hcCareerRep',rep);
      set('hcCareerOrders',orders);
    }catch(e){}
  }
  const obs=new MutationObserver(refresh);obs.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  setInterval(refresh,900);setTimeout(refresh,100);
})();