(function(){
if(window.__HCInesOfficialVisualV2)return;window.__HCInesOfficialVisualV2=true;
const $=(s,r=document)=>r.querySelector(s);
function css(){if($('#hcInesOfficialVisualV2Styles'))return;const s=document.createElement('style');s.id='hcInesOfficialVisualV2Styles';s.textContent=`
#characters .hc-person[data-id="ines"] .fig{opacity:1!important;filter:none!important;overflow:hidden!important}
#characters .hc-person[data-id="ines"] .fig svg{display:none!important}
#characters .hc-person[data-id="ines"] .fig .hc-ines-v2{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;object-position:50% 100%!important;filter:drop-shadow(0 12px 13px rgba(78,52,40,.12)) saturate(1.02)!important}
#characters .hc-person[data-id="ines"] .tag:before{content:'SÉLECTION OFFICIELLE'!important;color:#a87661!important}
#characters .hc-person[data-id="ines"] .tag:after{display:none!important}
#characters .hc-person[data-id="ines"]:hover .fig,#characters .hc-person[data-id="ines"].focused .fig{opacity:1!important;filter:none!important}
#characters .hc-focus.hc-focus-ines .hc-focus-portrait-final img{object-fit:cover!important;object-position:50% 24%!important;transform:scale(1.02)!important;mix-blend-mode:normal!important;filter:none!important}
`;document.head.appendChild(s)}
function mountCard(){const fig=$('#characters .hc-person[data-id="ines"] .fig');if(!fig||!window.HC_INES_FULL_V2)return false;let img=$('.hc-ines-v2',fig);if(!img){img=document.createElement('img');img.className='hc-ines-v2';img.alt='Inès';fig.appendChild(img)}img.src=window.HC_INES_FULL_V2;return true}
function syncFocus(){const root=$('#characters .hc-cast');if(!root)return;const focused=$('.hc-person.focused',root)?.dataset.id;const f=$('.hc-focus',root);if(!f)return;f.classList.toggle('hc-focus-ines',focused==='ines');if(focused!=='ines')return;const h=$('.hc-focus-header-final',f);if(h){const img=$('.hc-focus-portrait-final img',h);if(img&&window.HC_INES_PORTRAIT_V2){img.src=window.HC_INES_PORTRAIT_V2;img.alt='Inès'}const title=$('.hc-focus-title-final h3',h);if(title)title.textContent='Inès';const vibe=$('.hc-focus-title-final .vibe',h);if(vibe)vibe.textContent='Solaire · couleur & mouvement'}}
function apply(){css();mountCard();syncFocus()}
function boot(){let n=0;const tick=()=>{apply();if(++n<120)setTimeout(tick,120)};tick();document.addEventListener('click',e=>{if(e.target.closest?.('#characters .hc-person,#characters .hc-focus-nav'))setTimeout(apply,0)},true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();