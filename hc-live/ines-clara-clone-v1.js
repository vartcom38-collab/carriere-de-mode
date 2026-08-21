(function(){
  if(window.__HCInesClaraCloneV1)return;window.__HCInesClaraCloneV1=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const D={
    name:'Inès', vibe:'Solaire · couleur & mouvement',
    regard:'Palette vive · imprimés · fluidité',
    search:'Faire remarquer sa première capsule grâce à une identité joyeuse et immédiatement reconnaissable.',
    projection:'Tu oseras plus vite les couleurs, les rencontres et les idées spontanées, avec une énergie très directe.',
    tags:['Solaire','Fluide','Sociale'], pace:'Rapide · social · instinctif',
    levels:['En progression','Forte','À l’aise'],
    personality:'Spontanée, chaleureuse et sociable. Inès ose vite, aime travailler en mouvement et transforme facilement une rencontre en idée.',
    path:'Formation courte en stylisme, petits jobs en boutique puis premières collaborations sur des shootings locaux.',
    knows:['Association des couleurs','Imprimés','Silhouettes fluides','Styling','Présentation orale'],
    learn:['Patronage','Finitions haut de gamme','Budgets','Production','Négociation']
  };
  function css(){if($('#hcInesClaraCloneV1Styles'))return;const s=document.createElement('style');s.id='hcInesClaraCloneV1Styles';s.textContent=`
    #characters .hc-focus.hc-ines-clone .hc-focus-portrait-final{display:grid!important;place-items:center!important;background:linear-gradient(180deg,#f7eee4,#ead7c7)!important;color:#b67b62!important;font:600 26px Georgia,serif!important}
    #characters .hc-focus.hc-ines-clone .hc-focus-portrait-final img{display:none!important}
    #characters .hc-focus.hc-ines-clone .hc-focus-portrait-final:after{content:'02';}
    #characters .hc-focus.hc-ines-clone .hc-ines-tags{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 10px}
    #characters .hc-focus.hc-ines-clone .hc-ines-tags span{padding:6px 8px;border-radius:999px;background:#f3e9dd;font:600 6px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#8f6f5e}
    #characters .hc-focus.hc-ines-clone .hc-ines-start{margin:10px 0 12px;padding:12px 13px;border-radius:15px;background:linear-gradient(135deg,#fffaf3,#f2e6d9);border:1px solid rgba(142,101,76,.09)}
    #characters .hc-focus.hc-ines-clone .hc-ines-start .eyebrow{font:700 7px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#8d7b6f;margin-bottom:7px}
    #characters .hc-focus.hc-ines-clone .hc-ines-start .pace{font:italic 15px/1.2 Georgia,serif;color:#66564e;margin-bottom:9px}
    #characters .hc-focus.hc-ines-clone .hc-ines-levels{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
    #characters .hc-focus.hc-ines-clone .hc-ines-levels div{padding:7px 6px;border-radius:10px;background:rgba(255,253,248,.85);text-align:center}
    #characters .hc-focus.hc-ines-clone .hc-ines-levels b{display:block;font:600 6px Arial,sans-serif;text-transform:uppercase;color:#9a8778;margin-bottom:3px}
    #characters .hc-focus.hc-ines-clone .hc-ines-levels span{font:12px Georgia,serif;color:#514944}
  `;document.head.appendChild(s)}
  function render(){
    const root=$('#characters .hc-cast'); if(!root)return;
    const card=$('.hc-person[data-id="ines"]',root), box=$('.hc-focus',root); if(!card||!box)return;
    $$('.hc-person',root).forEach(n=>n.classList.remove('focused')); card.classList.add('focused');
    box.className='hc-focus hc-ines-clone';
    box.innerHTML=`
      <div class="hc-focus-nav"><button type="button" data-prev>‹</button><span>2 / 12</span><button type="button" data-next>›</button></div>
      <div class="hc-focus-header-final"><div class="hc-focus-portrait-final" aria-label="Portrait Inès"></div><div class="hc-focus-title-final"><h3>Inès</h3><div class="vibe">${D.vibe}</div></div></div>
      <div class="hc-focus-block"><b>Son regard</b><p>${D.regard}</p></div>
      <div class="hc-focus-block"><b>Elle recherche</b><p>${D.search}</p></div>
      <div class="hc-focus-block hc-projection"><b>Et si je devenais elle ?</b><p>${D.projection}</p></div>
      <div class="hc-ines-tags">${D.tags.map(x=>`<span>${x}</span>`).join('')}</div>
      <section class="hc-ines-start"><div class="eyebrow">Ton début de partie</div><div class="pace">${D.pace}</div><div class="hc-ines-levels"><div><b>Technique</b><span>${D.levels[0]}</span></div><div><b>Créativité</b><span>${D.levels[1]}</span></div><div><b>Réseau</b><span>${D.levels[2]}</span></div></div></section>
      <div class="hc-focus-actions"><button type="button" data-close>Fermer</button><button type="button" class="primary" data-profile>Découvrir Inès</button></div>`;
  }
  function choose(){try{localStorage.setItem('haute-couture-character','ines');localStorage.setItem('haute-couture-selected-character','ines');localStorage.setItem('selectedCharacter','ines')}catch(e){} $('.hc-all-sheet')?.remove(); try{if(typeof window.displayScreen==='function'){window.displayScreen('location');return}}catch(e){} }
  function openDossier(){
    $('.hc-all-sheet')?.remove(); const o=document.createElement('div'); o.className='hc-all-sheet';
    o.innerHTML=`<section class="paper" role="dialog" aria-modal="true"><button class="x">×</button><div class="hc-all-dossier"><aside class="hc-all-left"><small>PERSONNAGE · DOSSIER</small><h2>Inès</h2><em>${D.vibe}</em><div class="quote">« ${D.search} »</div></aside><main class="hc-all-right"><section class="hc-all-story"><h3>Sa personnalité</h3><p>${D.personality}</p></section><section class="hc-all-story"><h3>Son parcours</h3><p>${D.path}</p></section><div class="hc-all-two"><section class="hc-all-story"><h3>Ce qu’elle connaît déjà</h3><ul>${D.knows.map(x=>`<li>${x}</li>`).join('')}</ul></section><section class="hc-all-story"><h3>Ce qu’elle veut apprendre</h3><ul>${D.learn.map(x=>`<li>${x}</li>`).join('')}</ul></section></div><section class="hc-all-story"><h3>Ton début de partie avec Inès</h3><p><em>${D.pace}</em></p><ul><li>Technique : ${D.levels[0]}</li><li>Créativité : ${D.levels[1]}</li><li>Réseau : ${D.levels[2]}</li></ul></section><button class="hc-all-choose">✦ Je deviens Inès</button></main></div></section>`;
    document.body.appendChild(o); $('.x',o).onclick=()=>o.remove(); o.onclick=e=>{if(e.target===o)o.remove()}; $('.hc-all-choose',o).onclick=choose;
  }
  function boot(){
    css();
    document.addEventListener('click',e=>{
      const card=e.target.closest?.('#characters .hc-person[data-id="ines"]');
      if(card){e.preventDefault();e.stopImmediatePropagation();render();return}
      const box=e.target.closest?.('#characters .hc-focus.hc-ines-clone'); if(!box)return;
      if(e.target.closest('[data-profile]')){e.preventDefault();e.stopImmediatePropagation();openDossier();return}
      if(e.target.closest('[data-close]')){e.preventDefault();e.stopImmediatePropagation();box.innerHTML='';box.className='hc-focus';return}
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
