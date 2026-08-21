(function(){
  if(window.__HCInesV3)return;window.__HCInesV3=true;
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const D={
    name:'Inès',vibe:'Solaire · couleur & mouvement',
    regard:'Palette vive · imprimés · fluidité',
    search:'Créer une mode spontanée qui vit avec le corps et faire remarquer sa première capsule.',
    projection:'Tu oseras plus vite les couleurs, les rencontres et les idées spontanées. Les opportunités sociales et les projets très visuels ressortiront davantage.',
    tags:['Solaire','Fluide','Sociale'],pace:'Rapide · social · instinctif',
    levels:['En progression','Forte','À l’aise'],
    personality:'Spontanée, chaleureuse et sociable. Inès ose vite, aime travailler en mouvement et transforme facilement une rencontre en idée.',
    path:'Formation courte en stylisme, petits jobs en boutique puis premières collaborations sur des shootings locaux.',
    knows:['Association des couleurs','Imprimés','Silhouettes fluides','Styling','Présentation orale'],
    learn:['Patronage','Finitions haut de gamme','Budgets','Production','Négociation'],
    goal:'Faire remarquer sa première capsule grâce à une identité joyeuse et immédiatement reconnaissable.'
  };
  function css(){
    if($('#hcInesV3Styles'))return;
    const s=document.createElement('style');s.id='hcInesV3Styles';s.textContent=`
      #characters .hc-person[data-id="ines"] .fig{opacity:1!important;filter:none!important;overflow:hidden!important}
      #characters .hc-person[data-id="ines"] .fig svg{display:none!important}
      #characters .hc-person[data-id="ines"] .hc-ines-v3-img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;object-position:50% 100%!important;filter:drop-shadow(0 10px 10px rgba(65,45,35,.12))!important}
      #characters .hc-focus.hc-ines-v3{display:block!important}
      #characters .hc-focus.hc-ines-v3 .hc-focus-header-final{display:flex;align-items:center;gap:16px;padding-bottom:14px;border-bottom:1px solid rgba(70,65,58,.12);margin-bottom:6px}
      #characters .hc-focus.hc-ines-v3 .hc-focus-portrait-final{width:92px;height:92px;flex:0 0 92px;border-radius:50%;overflow:hidden;background:#f5e9dc;border:1px solid rgba(155,113,88,.18)}
      #characters .hc-focus.hc-ines-v3 .hc-focus-portrait-final img{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 13%;transform:scale(2.15);transform-origin:50% 16%}
      #characters .hc-focus.hc-ines-v3 .hc-focus-title-final h3{margin:0 0 5px;font:400 30px/1 Georgia,serif;color:#4e4944}
      #characters .hc-focus.hc-ines-v3 .hc-focus-title-final .vibe{margin:0;font:italic 13px Georgia,serif;color:#a56f5b}
      #characters .hc-ines-v3-tags{display:flex;gap:6px;flex-wrap:wrap;margin:9px 0}
      #characters .hc-ines-v3-tags span{padding:6px 8px;border-radius:999px;background:#f3e9dd;font:600 6px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#8f6f5e}
      #characters .hc-ines-v3-start{margin:10px 0 12px;padding:12px 13px;border-radius:15px;background:linear-gradient(135deg,#fffaf3,#f2e6d9);border:1px solid rgba(142,101,76,.09)}
      #characters .hc-ines-v3-start .eyebrow{font:700 7px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#8d7b6f;margin-bottom:7px}
      #characters .hc-ines-v3-start .pace{font:italic 15px/1.2 Georgia,serif;color:#66564e;margin-bottom:9px}
      #characters .hc-ines-v3-levels{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
      #characters .hc-ines-v3-levels div{padding:7px 6px;border-radius:10px;background:rgba(255,253,248,.86);text-align:center}
      #characters .hc-ines-v3-levels b{display:block;font:600 6px Arial,sans-serif;text-transform:uppercase;color:#9a8778;margin-bottom:3px}
      #characters .hc-ines-v3-levels span{font:12px Georgia,serif;color:#514944}
      .hc-ines-v3-sheet{position:fixed;inset:0;z-index:400;display:grid;place-items:center;padding:22px;background:rgba(54,44,35,.42);backdrop-filter:blur(10px)}
      .hc-ines-v3-sheet .paper{position:relative;width:min(1080px,95vw);max-height:92vh;overflow:auto;border-radius:28px;background:#fffdf8;padding:30px 34px}
      .hc-ines-v3-sheet .x{position:absolute;right:16px;top:14px;width:42px;height:42px;border-radius:50%;border:1px solid #dccbbb;background:#fffaf3;font-size:24px;cursor:pointer}
      .hc-ines-v3-dossier{display:grid;grid-template-columns:.7fr 1.3fr;gap:30px}.hc-ines-v3-left h2{font:400 72px/.9 Georgia,serif;margin:8px 0;color:#4e4944}.hc-ines-v3-left em{color:#a56f5b}.hc-ines-v3-left .quote{margin-top:18px;padding:15px;border-radius:16px;background:#f2e7da;font:italic 15px/1.45 Georgia,serif}.hc-ines-v3-right{display:grid;gap:12px}.hc-ines-v3-story{padding:16px 17px;border-radius:17px;background:#fffaf4;border:1px solid rgba(101,78,59,.08)}.hc-ines-v3-story h3{margin:0 0 7px;font:400 21px Georgia,serif}.hc-ines-v3-story p,.hc-ines-v3-story li{font:12.5px/1.5 Georgia,serif;color:#5d554e}.hc-ines-v3-two{display:grid;grid-template-columns:1fr 1fr;gap:12px}.hc-ines-v3-choose{width:100%;min-height:52px;border:0;border-radius:14px;background:#788d72;color:#fff;font:17px Georgia,serif;cursor:pointer}
      @media(max-width:800px){.hc-ines-v3-dossier,.hc-ines-v3-two{grid-template-columns:1fr}.hc-ines-v3-left h2{font-size:54px}.hc-ines-v3-sheet{padding:0}.hc-ines-v3-sheet .paper{width:100vw;max-height:100svh;border-radius:0}}
    `;document.head.appendChild(s);
  }
  function ensureAsset(done){
    if(window.HC_INES_FULL_V2){done&&done();return}
    let s=$('#hcInesAssetV3');
    if(s){s.addEventListener('load',()=>done&&done(),{once:true});return}
    s=document.createElement('script');s.id='hcInesAssetV3';s.src='./ines-full-v2.js?v=d6aa0cc7';s.onload=()=>done&&done();document.head.appendChild(s);
  }
  function mountCard(){
    const fig=$('#characters .hc-person[data-id="ines"] .fig');if(!fig||!window.HC_INES_FULL_V2)return false;
    $$('img',fig).forEach(n=>{if(!n.classList.contains('hc-ines-v3-img'))n.remove()});
    $$('svg',fig).forEach(n=>n.style.display='none');
    let img=$('.hc-ines-v3-img',fig);if(!img){img=document.createElement('img');img.className='hc-ines-v3-img';img.alt='Inès';fig.appendChild(img)}
    img.src=window.HC_INES_FULL_V2;return true;
  }
  function mountWhenReady(){
    if(mountCard())return;
    const root=$('#characters');if(!root)return;
    const mo=new MutationObserver(()=>{if(mountCard())mo.disconnect()});mo.observe(root,{childList:true,subtree:true});setTimeout(()=>mo.disconnect(),8000);
  }
  function render(){
    const root=$('#characters .hc-cast'),card=$('#characters .hc-person[data-id="ines"]'),box=$('#characters .hc-focus');if(!root||!card||!box)return;
    $$('#characters .hc-person').forEach(n=>n.classList.toggle('focused',n===card));root.classList.add('has-focus');box.className='hc-focus open hc-ines-v3';
    const src=window.HC_INES_FULL_V2||'';
    box.innerHTML=`<div class="hc-focus-nav"><button class="hc-icon" type="button" data-ines-prev>‹</button><span>2 / 12</span><button class="hc-icon" type="button" data-ines-next>›</button></div><div class="hc-focus-header-final"><div class="hc-focus-portrait-final"><img src="${src}" alt="Portrait Inès"></div><div class="hc-focus-title-final"><h3>Inès</h3><div class="vibe">${D.vibe}</div></div></div><div class="hc-focus-block"><b>Son regard</b><p>${D.regard}</p></div><div class="hc-focus-block"><b>Elle recherche</b><p>${D.search}</p></div><div class="hc-focus-block hc-projection"><b>Et si je devenais elle ?</b><p>${D.projection}</p></div><div class="hc-ines-v3-tags">${D.tags.map(x=>`<span>${x}</span>`).join('')}</div><section class="hc-ines-v3-start"><div class="eyebrow">Ton début de partie</div><div class="pace">${D.pace}</div><div class="hc-ines-v3-levels"><div><b>Technique</b><span>${D.levels[0]}</span></div><div><b>Créativité</b><span>${D.levels[1]}</span></div><div><b>Réseau</b><span>${D.levels[2]}</span></div></div></section><div class="hc-focus-actions"><button type="button" data-ines-close>Fermer</button><button type="button" class="primary" data-ines-profile>Découvrir Inès</button></div>`;
  }
  function dossier(){
    $('.hc-ines-v3-sheet')?.remove();const o=document.createElement('div');o.className='hc-ines-v3-sheet';o.innerHTML=`<section class="paper" role="dialog" aria-modal="true" aria-label="Découvrir Inès"><button class="x">×</button><div class="hc-ines-v3-dossier"><aside class="hc-ines-v3-left"><small>PERSONNAGE 02 · DOSSIER</small><h2>Inès</h2><em>${D.vibe}</em><div class="quote">« ${D.goal} »</div></aside><main class="hc-ines-v3-right"><section class="hc-ines-v3-story"><h3>Sa personnalité</h3><p>${D.personality}</p></section><section class="hc-ines-v3-story"><h3>Son parcours</h3><p>${D.path}</p></section><div class="hc-ines-v3-two"><section class="hc-ines-v3-story"><h3>Ce qu’elle connaît déjà</h3><ul>${D.knows.map(x=>`<li>${x}</li>`).join('')}</ul></section><section class="hc-ines-v3-story"><h3>Ce qu’elle veut apprendre</h3><ul>${D.learn.map(x=>`<li>${x}</li>`).join('')}</ul></section></div><section class="hc-ines-v3-story"><h3>Ton début de partie avec Inès</h3><p><em>${D.pace}</em></p><ul><li>Technique : ${D.levels[0]}</li><li>Créativité : ${D.levels[1]}</li><li>Réseau : ${D.levels[2]}</li></ul></section><button class="hc-ines-v3-choose">✦ Je deviens Inès</button></main></div></section>`;document.body.appendChild(o);$('.x',o).onclick=()=>o.remove();o.onclick=e=>{if(e.target===o)o.remove()};$('.hc-ines-v3-choose',o).onclick=()=>{try{localStorage.setItem('haute-couture-character','ines');localStorage.setItem('haute-couture-selected-character','ines');localStorage.setItem('selectedCharacter','ines')}catch(e){}o.remove();try{if(typeof window.displayScreen==='function')window.displayScreen('location')}catch(e){}};
  }
  function boot(){
    css();ensureAsset(()=>{mountWhenReady();if($('#characters .hc-focus.hc-ines-v3'))render()});
    document.addEventListener('click',e=>{
      const card=e.target.closest?.('#characters .hc-person[data-id="ines"]');
      if(card){e.preventDefault();e.stopImmediatePropagation();ensureAsset(()=>{mountCard();render()});return}
      if(e.target.closest?.('#characters .hc-focus.hc-ines-v3 [data-ines-profile]')){e.preventDefault();e.stopImmediatePropagation();dossier();return}
      if(e.target.closest?.('#characters .hc-focus.hc-ines-v3 [data-ines-close]')){e.preventDefault();e.stopImmediatePropagation();const b=$('#characters .hc-focus');if(b){b.className='hc-focus';b.innerHTML=''}$('#characters .hc-cast')?.classList.remove('has-focus');$('#characters .hc-person[data-id="ines"]')?.classList.remove('focused');return}
      if(e.target.closest?.('#characters .hc-focus.hc-ines-v3 [data-ines-prev]')){e.preventDefault();e.stopImmediatePropagation();$('#characters .hc-person[data-id="clara"]')?.click();return}
      if(e.target.closest?.('#characters .hc-focus.hc-ines-v3 [data-ines-next]')){e.preventDefault();e.stopImmediatePropagation();$('#characters .hc-person[data-id="maya"]')?.click();return}
    },true);
    mountWhenReady();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();