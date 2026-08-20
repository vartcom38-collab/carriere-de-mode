(function(){
  if(window.__HCCharacterDetailPremium)return;
  window.__HCCharacterDetailPremium=true;
  const $=(s,r=document)=>r.querySelector(s);

  function installCss(){
    if($('#hcCharacterDetailPremiumStyles'))return;
    const st=document.createElement('style');
    st.id='hcCharacterDetailPremiumStyles';
    st.textContent=`
      @media (min-width:980px), (min-width:768px) and (min-height:900px){
        #characters .hc-focus{scrollbar-width:none!important}
        #characters .hc-focus::-webkit-scrollbar{display:none!important}
        #characters .hc-focus.open .hc-focus-header-final,
        #characters .hc-focus.open .hc-focus-block,
        #characters .hc-focus.open .hc-detail-premium,
        #characters .hc-focus.open .hc-focus-actions{animation:hcDetailIn .42s cubic-bezier(.2,.78,.2,1) both}
        #characters .hc-focus.open .hc-focus-block:nth-of-type(2){animation-delay:.035s}
        #characters .hc-focus.open .hc-focus-block:nth-of-type(3){animation-delay:.07s}
        #characters .hc-focus.open .hc-detail-premium{animation-delay:.105s}
        #characters .hc-focus.open .hc-focus-actions{animation-delay:.14s}
        @keyframes hcDetailIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}

        #characters .hc-detail-premium{margin:11px 0 4px;padding:12px 0 2px;border-top:1px solid rgba(91,72,54,.12)}
        #characters .hc-detail-eyebrow{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px;font:600 6px/1 Arial,sans-serif;letter-spacing:.19em;text-transform:uppercase;color:#a07662}
        #characters .hc-detail-eyebrow:after{content:'01';font:400 16px/1 Georgia,serif;letter-spacing:-.04em;color:#c1a27d}
        #characters .hc-signatures{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:11px}
        #characters .hc-signature{padding:5px 8px;border-radius:999px;background:#f3e9dd;border:1px solid rgba(141,104,79,.08);font:500 6px/1 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#8e6856}
        #characters .hc-meter{display:grid;grid-template-columns:76px 1fr 24px;gap:7px;align-items:center;margin:7px 0}
        #characters .hc-meter label{font:500 6.2px/1 Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#77766f}
        #characters .hc-meter-track{height:5px;border-radius:99px;background:#ece5db;overflow:hidden}
        #characters .hc-meter-track i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#a8b69e,#71856e);transform-origin:left;animation:hcMeterGrow .65s .16s ease both}
        @keyframes hcMeterGrow{from{transform:scaleX(.05);opacity:.35}to{transform:scaleX(1);opacity:1}}
        #characters .hc-meter em{font:400 8px/1 Georgia,serif;color:#7a746d;font-style:normal;text-align:right}
        #characters .hc-detail-note{margin-top:10px;padding:9px 11px;border-radius:11px;background:rgba(249,244,237,.84);font:italic 10.5px/1.35 Georgia,serif;color:#665f58}

        #characters .hc-focus-actions button{position:relative;overflow:hidden;transition:transform .18s ease,box-shadow .18s ease,background .18s ease!important}
        #characters .hc-focus-actions button:hover{transform:translateY(-2px);box-shadow:0 8px 18px rgba(70,52,38,.07)!important}
        #characters .hc-focus-actions .primary:hover{box-shadow:0 12px 27px rgba(83,103,79,.24)!important}
        #characters .hc-focus-actions .primary:after{content:'';position:absolute;top:-60%;bottom:-60%;width:34px;left:-55px;transform:rotate(18deg);background:linear-gradient(90deg,transparent,rgba(255,255,255,.26),transparent);transition:left .58s ease}
        #characters .hc-focus-actions .primary:hover:after{left:calc(100% + 30px)}
        #characters .hc-focus-portrait-final img{transition:transform .35s cubic-bezier(.2,.8,.2,1),filter .3s ease!important}
        #characters .hc-focus-header-final:hover .hc-focus-portrait-final img{transform:scale(1.18)!important;filter:saturate(1.07) contrast(1.025)!important}
      }
    `;
    document.head.appendChild(st);
  }

  function ensureDetail(){
    const focus=$('#characters .hc-focus');
    if(!focus||!focus.classList.contains('open'))return;
    const title=$('.hc-focus-title-final h3',focus)||$('h3',focus);
    if(!title||title.textContent.trim()!=='Clara'){
      $('.hc-detail-premium',focus)?.remove();
      return;
    }
    if($('.hc-detail-premium',focus))return;
    const actions=$('.hc-focus-actions',focus);
    if(!actions)return;
    const box=document.createElement('section');
    box.className='hc-detail-premium';
    box.innerHTML=`
      <div class="hc-detail-eyebrow">Signature créative</div>
      <div class="hc-signatures">
        <span class="hc-signature">Finitions</span>
        <span class="hc-signature">Volumes doux</span>
        <span class="hc-signature">Émotion</span>
      </div>
      <div class="hc-meter"><label>Sensibilité</label><span class="hc-meter-track"><i style="width:92%"></i></span><em>92</em></div>
      <div class="hc-meter"><label>Précision</label><span class="hc-meter-track"><i style="width:84%"></i></span><em>84</em></div>
      <div class="hc-meter"><label>Audace</label><span class="hc-meter-track"><i style="width:68%"></i></span><em>68</em></div>
      <div class="hc-detail-note">Sa force : transformer un détail discret en souvenir de mode.</div>`;
    actions.insertAdjacentElement('beforebegin',box);
  }

  function boot(){
    installCss();
    const root=$('#characters');
    if(!root)return;
    let pending=false;
    const schedule=()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;ensureDetail()})};
    new MutationObserver(schedule).observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
    schedule();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();