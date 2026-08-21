(function(){
  if(window.__HCCharacterPortraitGalleryV2)return;
  window.__HCCharacterPortraitGalleryV2=true;
  const $=(s,r=document)=>r.querySelector(s);
  const profiles={
    clara:{name:'Clara',num:'01',vibe:'Poétique · détails sensibles',bio:'Clara observe la mode à travers les finitions, les volumes doux et les détails qui donnent une mémoire à une pièce.',chips:['Finitions délicates','Volumes doux','Émotion','Élégance quotidienne'],quote:'Créer des pièces que l’on garde comme des souvenirs.'},
    ines:{name:'Inès',num:'02',vibe:'Solaire · couleur & mouvement',bio:'Inès construit ses silhouettes autour de la couleur, du mouvement et d’une énergie spontanée. Son vestiaire doit vivre avec le corps.',chips:['Couleur','Fluidité','Imprimés','Confort stylé'],quote:'Créer une mode spontanée qui vit avec le corps.'},
    maya:{name:'Maya',num:'03',vibe:'Direction créative · silhouette',bio:'Maya pense en image, en allure et en impact. Elle cherche une silhouette immédiatement lisible, précise et forte.',chips:['Direction créative','Structure','Contraste','Impact'],quote:'Signer une collection immédiatement reconnaissable.'}
  };

  function css(){
    if($('#hcCharacterPortraitGalleryV2Styles'))return;
    const s=document.createElement('style');s.id='hcCharacterPortraitGalleryV2Styles';s.textContent=`
      .hc-portrait-v2{position:fixed;inset:0;z-index:280;display:none;place-items:center;padding:18px;background:rgba(236,227,216,.78);backdrop-filter:blur(12px);opacity:0;transition:opacity .22s ease}
      .hc-portrait-v2.open{display:grid;opacity:1}
      .hc-portrait-sheet-v2{position:relative;width:min(1420px,96vw);height:min(840px,94vh);overflow:hidden;border-radius:30px;background:linear-gradient(90deg,#fffdf8 0 49.4%,#e6dacb 49.55%,#f8f1e8 50%,#fffdf9 50.65% 100%);border:1px solid rgba(97,74,55,.13);box-shadow:0 34px 90px rgba(55,40,28,.23)}
      .hc-portrait-sheet-v2:before{content:'';position:absolute;inset:0;pointer-events:none;opacity:.20;background:radial-gradient(circle at 18% 18%,rgba(228,202,175,.34),transparent 24%),radial-gradient(circle at 83% 77%,rgba(216,203,186,.25),transparent 22%),radial-gradient(rgba(120,98,78,.14) .55px,transparent .55px);background-size:auto,auto,9px 9px}
      .hc-portrait-close-v2{position:absolute;right:20px;top:18px;z-index:5;width:46px;height:46px;border-radius:50%;border:1px solid rgba(91,70,53,.16);background:rgba(255,253,249,.94);font:24px Georgia,serif;color:#4b433d;cursor:pointer}
      .hc-portrait-left-v2{position:absolute;left:0;top:0;bottom:0;width:50%;padding:34px 38px 28px;display:grid;grid-template-rows:auto 1fr auto;gap:10px;overflow:hidden}
      .hc-portrait-kicker-v2{font:600 7px Arial,sans-serif;letter-spacing:.22em;color:#a27661;text-transform:uppercase}.hc-portrait-title-v2{margin:7px 0 0;font:400 clamp(48px,5vw,78px)/.9 Georgia,serif;letter-spacing:-.045em;color:#303531}.hc-portrait-vibe-v2{margin:9px 0 0;font:italic 14px Georgia,serif;color:#93624f}
      .hc-portrait-hero-v2{position:relative;min-height:0;overflow:hidden;border-radius:26px;background:radial-gradient(circle at 50% 34%,rgba(255,255,255,.98),rgba(249,240,229,.94) 58%,rgba(239,224,207,.94));border:1px solid rgba(184,129,96,.13)}
      .hc-portrait-hero-v2 img{position:absolute;inset:2% 2% 0;width:96%;height:98%;object-fit:contain;object-position:50% 100%;display:block;mix-blend-mode:multiply;filter:none}
      .hc-portrait-hero-v2[data-id='maya'] img{mix-blend-mode:normal}
      .hc-portrait-hero-v2:after{content:attr(data-num) '  ·  PORTRAIT OFFICIEL';position:absolute;left:16px;top:15px;padding:5px 8px;border-radius:999px;background:rgba(255,252,247,.82);font:600 6px Arial,sans-serif;letter-spacing:.15em;color:#9c705d}
      .hc-portrait-quote-v2{padding:11px 14px;border-radius:14px;background:rgba(243,234,223,.85);font:italic 12.5px/1.45 Georgia,serif;color:#62584f;border:1px solid rgba(104,82,62,.06)}
      .hc-portrait-right-v2{position:absolute;left:50%;right:0;top:0;bottom:0;padding:38px 42px 30px;overflow:auto}.hc-portrait-right-v2::-webkit-scrollbar{width:8px}.hc-portrait-right-v2::-webkit-scrollbar-thumb{background:#ded0bf;border-radius:99px}
      .hc-portrait-section-v2{padding:0 0 20px;margin-bottom:20px;border-bottom:1px solid rgba(91,72,54,.11)}.hc-portrait-section-v2:last-child{border-bottom:0}
      .hc-portrait-section-head-v2{display:flex;justify-content:space-between;align-items:flex-end;gap:14px;margin-bottom:13px}.hc-portrait-section-head-v2 h3{margin:0;font:400 26px/1 Georgia,serif;color:#3b3733}.hc-portrait-section-head-v2 span{font:600 6px Arial,sans-serif;letter-spacing:.18em;color:#9c7b68;text-transform:uppercase}
      .hc-portrait-bio-v2{font:400 14px/1.55 Georgia,serif;color:#514b45}.hc-portrait-chips-v2{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}.hc-portrait-chip-v2{padding:7px 10px;border-radius:999px;background:#f2e8db;border:1px solid rgba(117,89,65,.07);font:10px Arial,sans-serif;color:#785f50}
      .hc-portrait-gallery-v2{display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:11px}.hc-portrait-card-v2{position:relative;min-height:210px;border-radius:18px;overflow:hidden;background:linear-gradient(145deg,#fffaf3,#eee2d3);border:1px solid rgba(103,82,62,.08)}
      .hc-portrait-card-v2 img{position:absolute;inset:0;width:100%;height:100%;display:block;mix-blend-mode:multiply}.hc-portrait-card-v2.full img{object-fit:contain;object-position:50% 100%;padding:7px}.hc-portrait-card-v2.face img{object-fit:cover;object-position:50% 12%;transform:scale(1.34)}.hc-portrait-card-v2.detail img{object-fit:cover;object-position:50% 10%;transform:scale(1.62)}
      .hc-portrait-card-v2[data-id='maya'] img{mix-blend-mode:normal}.hc-portrait-card-v2 span{position:absolute;left:10px;bottom:10px;padding:6px 8px;border-radius:999px;background:rgba(255,252,247,.9);font:600 6px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#765d4e}
      .hc-portrait-note-v2{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.hc-portrait-note-v2 div{padding:13px;border-radius:16px;background:#fbf6ef;border:1px solid rgba(103,82,62,.07)}.hc-portrait-note-v2 b{display:block;font:400 16px Georgia,serif;color:#403a35}.hc-portrait-note-v2 small{display:block;margin-top:5px;font:9px/1.4 Arial,sans-serif;color:#857468}
      @media(max-width:900px){.hc-portrait-v2{padding:0}.hc-portrait-sheet-v2{width:100vw;height:100svh;border-radius:0}.hc-portrait-left-v2{width:44%;padding:26px 20px 22px}.hc-portrait-right-v2{left:44%;padding:32px 22px 24px}.hc-portrait-gallery-v2{grid-template-columns:1fr 1fr}.hc-portrait-card-v2{min-height:150px}.hc-portrait-note-v2{grid-template-columns:1fr}}
    `;document.head.appendChild(s)
  }

  function sourceFor(card){const img=$('.fig img',card);return img?.src||null}
  function build(id,src){
    const p=profiles[id];if(!p||!src)return null;
    document.querySelector('.hc-portrait-v2')?.remove();
    const o=document.createElement('div');o.className='hc-portrait-v2';o.innerHTML=`
      <section class="hc-portrait-sheet-v2" role="dialog" aria-modal="true" aria-label="Portrait complet de ${p.name}">
        <button class="hc-portrait-close-v2" type="button" aria-label="Fermer">×</button>
        <div class="hc-portrait-left-v2">
          <header><div class="hc-portrait-kicker-v2">DOSSIER PERSONNAGE · COLLECTION 01</div><h2 class="hc-portrait-title-v2">${p.name}</h2><p class="hc-portrait-vibe-v2">${p.vibe}</p></header>
          <div class="hc-portrait-hero-v2" data-id="${id}" data-num="${p.num}"><img src="${src}" alt="${p.name}"></div>
          <div class="hc-portrait-quote-v2">« ${p.quote} »</div>
        </div>
        <div class="hc-portrait-right-v2">
          <section class="hc-portrait-section-v2"><div class="hc-portrait-section-head-v2"><h3>Portrait créatif</h3><span>Identité</span></div><div class="hc-portrait-bio-v2">${p.bio}</div><div class="hc-portrait-chips-v2">${p.chips.map(x=>`<span class="hc-portrait-chip-v2">${x}</span>`).join('')}</div></section>
          <section class="hc-portrait-section-v2"><div class="hc-portrait-section-head-v2"><h3>Galerie personnage</h3><span>Vues du visuel officiel</span></div><div class="hc-portrait-gallery-v2"><div class="hc-portrait-card-v2 full" data-id="${id}"><img src="${src}" alt="Silhouette de ${p.name}"><span>Silhouette</span></div><div class="hc-portrait-card-v2 face" data-id="${id}"><img src="${src}" alt="Portrait de ${p.name}"><span>Portrait</span></div><div class="hc-portrait-card-v2 detail" data-id="${id}"><img src="${src}" alt="Détail de ${p.name}"><span>Détail</span></div></div></section>
          <section class="hc-portrait-section-v2"><div class="hc-portrait-section-head-v2"><h3>Repères visuels</h3><span>Pas de faux look</span></div><div class="hc-portrait-note-v2"><div><b>Silhouette</b><small>Le visuel principal reste toujours cadré en entier, sans coupe arbitraire.</small></div><div><b>Portrait</b><small>Le visage est recadré séparément pour la lecture du personnage.</small></div><div><b>Tenues</b><small>Les variantes ne seront affichées que lorsqu’un vrai visuel correspondant existe.</small></div></div></section>
        </div>
      </section>`;
    document.body.appendChild(o);
    const close=()=>{o.classList.remove('open');setTimeout(()=>o.remove(),220)};
    $('.hc-portrait-close-v2',o).onclick=close;o.addEventListener('click',e=>{if(e.target===o)close()});
    const esc=e=>{if(e.key==='Escape'){document.removeEventListener('keydown',esc);close()}};document.addEventListener('keydown',esc);
    return o
  }

  function openSelected(){
    const card=$('#characters .hc-person.focused');if(!card)return false;
    const id=card.dataset.id;if(!profiles[id])return false;
    const src=sourceFor(card);if(!src)return false;
    css();const o=build(id,src);if(!o)return false;o.style.display='grid';requestAnimationFrame(()=>o.classList.add('open'));return true
  }

  function boot(){
    css();
    document.addEventListener('click',e=>{const b=e.target.closest?.('#characters .hc-focus [data-profile]');if(!b)return;if(!openSelected())return;e.preventDefault();e.stopImmediatePropagation()},true)
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();