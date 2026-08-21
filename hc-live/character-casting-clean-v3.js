(function(){
  if(window.__HCCharacterCastingCleanV3)return;
  window.__HCCharacterCastingCleanV3=true;
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const profiles={
    clara:{name:'Clara',note:'Poétique · détails sensibles',strength:'Volumes doux · finitions délicates',dream:'Créer des pièces que l’on garde comme des souvenirs.',projection:'Tu remarqueras plus vite les belles finitions, les détails sensibles et les histoires cachées.'},
    ines:{name:'Inès',note:'Solaire · couleur & mouvement',strength:'Palette · imprimés · fluidité',dream:'Créer une mode spontanée qui vit avec le corps.',projection:'Les couleurs, imprimés et rencontres créatives ressortiront davantage dans ton début de partie.'},
    maya:{name:'Maya',note:'Direction créative · silhouette',strength:'Image · allure · impact',dream:'Signer une collection immédiatement reconnaissable.',projection:'Tu seras attirée par les projets visibles, les briefs ambitieux et les occasions de construire une image forte.'},
    elise:{name:'Élise',note:'Rigoureuse · élégante',strength:'Coupe · soie · précision',dream:'Atteindre une élégance si juste qu’elle paraît évidente.',projection:'Les belles matières, les finitions exigeantes et les projets précis auront plus de poids.'},
    salome:{name:'Salomé',note:'Libre · inspirée',strength:'Volume · naturel · mouvement',dream:'Créer sans perdre la liberté du premier croquis.',projection:'Les matières brutes, paysages et pistes inattendues apparaîtront plus naturellement.'},
    anais:{name:'Anaïs',note:'Pratique · authentique',strength:'Construction · lin · fonction',dream:'Faire des pièces belles, solides et faites pour vivre.',projection:'Tu identifieras plus vite les solutions pratiques et les projets où le savoir-faire compte.'},
    jade:{name:'Jade',note:'Artisanale · tactile',strength:'Cuir · gestes main · caractère',dream:'Faire reconnaître la valeur du travail artisanal dans une mode contemporaine.',projection:'Les artisans, matières de caractère et techniques manuelles seront plus visibles.'},
    camille:{name:'Camille',note:'Créative · vintage',strength:'Upcycling · transformation · trouvaille',dream:'Transformer l’existant jusqu’à le rendre évident.',projection:'Tu repéreras davantage les pièces à transformer, les trouvailles vintage et les secondes vies.'},
    louise:{name:'Louise',note:'Scénique · narrative',strength:'Costume · scène · ornement',dream:'Créer des costumes que l’on reconnaît avant même l’histoire.',projection:'Les projets de scène, personnages et détails narratifs attireront davantage ton attention.'},
    margaux:{name:'Margaux',note:'Romantique · intuitive',strength:'Broderie · motifs · minutie',dream:'Faire du détail une signature sans alourdir la silhouette.',projection:'Les motifs, broderies et savoir-faire décoratifs prendront plus de place dans tes découvertes.'},
    juliette:{name:'Juliette',note:'Sensible · matière',strength:'Dentelle · lin · texture',dream:'Créer des pièces calmes, tactiles et presque intemporelles.',projection:'Les textures naturelles et détails textiles subtils ressortiront davantage.'},
    romane:{name:'Romane',note:'Énergique · sportive',strength:'Mouvement · confort · fonction',dream:'Prouver qu’un vêtement fonctionnel peut avoir autant de caractère qu’une pièce spectaculaire.',projection:'Tu remarqueras plus facilement le confort, la construction et les projets liés au mouvement.'}
  };
  let selected='clara';

  function installCss(){
    if($('#hcCharacterCastingCleanV3Styles'))return;
    const s=document.createElement('style');s.id='hcCharacterCastingCleanV3Styles';s.textContent=`
      html body #characters .hc-grid{grid-template-columns:repeat(6,minmax(0,1fr))!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:20px 16px!important;align-items:stretch!important;overflow:visible!important}
      html body #characters .hc-person,html body #characters .hc-person[data-id]{position:relative!important;grid-column:auto!important;grid-row:auto!important;width:100%!important;height:100%!important;min-height:0!important;border-radius:24px!important;overflow:visible!important;opacity:1!important;filter:none!important;transform:none!important;background:transparent!important;z-index:1!important}
      html body #characters .hc-cast.has-focus .hc-person:not(.focused){opacity:1!important;filter:none!important}
      html body #characters .hc-person:before,html body #characters .hc-person[data-id]:before{content:''!important;position:absolute!important;inset:0!important;border-radius:24px!important;background:linear-gradient(160deg,#fffdf8 0%,#f8efe4 100%)!important;border:1px solid rgba(110,87,67,.12)!important;box-shadow:0 7px 18px rgba(62,45,33,.055)!important;z-index:-1!important;transform:none!important}
      html body #characters .hc-person .fig,html body #characters .hc-person[data-id] .fig{position:absolute!important;left:8px!important;right:8px!important;top:8px!important;bottom:66px!important;width:auto!important;height:auto!important;border-radius:18px 18px 14px 14px!important;overflow:hidden!important;background:linear-gradient(180deg,#fffdf9,#f7eee2)!important;transform:none!important;opacity:1!important;filter:none!important}
      html body #characters .hc-person .fig>img,html body #characters .hc-person[data-id] .fig>img{position:absolute!important;display:block!important;max-width:none!important;max-height:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;filter:none!important;mix-blend-mode:normal!important;transform-origin:50% 100%!important}
      html body #characters .hc-person .fig>svg{width:100%!important;height:100%!important;display:block!important;opacity:1!important;filter:none!important}
      html body #characters .hc-person .tag,html body #characters .hc-person[data-id] .tag{position:absolute!important;left:8px!important;right:8px!important;bottom:8px!important;width:auto!important;height:50px!important;min-height:50px!important;padding:8px 8px 6px!important;border-radius:15px!important;background:#f4e8d8!important;border:1px solid rgba(110,87,67,.07)!important;box-shadow:none!important;transform:none!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important}
      html body #characters .hc-person .tag strong,html body #characters .hc-person[data-id] .tag strong{font:400 17px/1 Georgia,serif!important;color:#554940!important}
      html body #characters .hc-person .tag span,html body #characters .hc-person[data-id] .tag span{margin-top:4px!important;font:600 5.6px/1.15 Arial,sans-serif!important;letter-spacing:.07em!important;color:#927d6d!important;max-width:100%!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
      html body #characters .hc-person .tag:after{display:none!important}
      html body #characters .hc-person:after,html body #characters .hc-person[data-id]:after{top:18px!important;left:18px!important;z-index:6!important;font-size:17px!important;opacity:1!important}
      html body #characters .hc-person[data-id='clara'] .fig:before,html body #characters .hc-person[data-id='clara'] .fig:after{display:none!important}
      html body #characters .hc-person[data-id='clara'] .fig .hc-clara-master{width:148%!important;height:148%!important;left:-24%!important;top:-22%!important;object-fit:contain!important;object-position:50% 100%!important;transform:none!important;mix-blend-mode:multiply!important}
      html body #characters .hc-person[data-id='ines'] .fig .hc-ines-master{width:184%!important;height:126%!important;left:-43%!important;top:-10%!important;object-fit:cover!important;object-position:24% 50%!important;transform:none!important;mix-blend-mode:multiply!important}
      html body #characters .hc-person[data-id='maya'] .fig .hc-maya-master{width:106%!important;height:106%!important;left:-3%!important;top:-3%!important;object-fit:contain!important;object-position:50% 100%!important;transform:none!important;mix-blend-mode:normal!important}
      @media (hover:hover) and (pointer:fine){html body #characters .hc-person:hover{transform:translateY(-5px) scale(1.055)!important;z-index:60!important}html body #characters .hc-person:hover:before{box-shadow:0 22px 40px rgba(65,47,33,.14)!important;border-color:rgba(181,118,85,.2)!important}}
      html body #characters .hc-person.focused{transform:translateY(-5px) scale(1.06)!important;z-index:62!important}
      html body #characters .hc-person.focused:before{box-shadow:0 24px 44px rgba(65,47,33,.15)!important;border-color:rgba(181,118,85,.24)!important}
      html body #characters .hc-person:hover .fig,html body #characters .hc-person.focused .fig{transform:none!important}
      html body #characters .hc-focus>.hc-focus-header-final,html body #characters .hc-focus>.hc-focus-header-v2{display:none!important}
      html body #characters .hc-focus>.hc-focus-header-v3{display:grid!important;grid-template-columns:104px 1fr!important;gap:16px!important;align-items:center!important;padding:14px 0 15px!important;border-bottom:1px solid rgba(91,72,54,.12)!important}
      html body #characters .hc-focus-header-v3 .portrait{width:100px;height:100px;border-radius:50%;overflow:hidden;background:#f8efe4;border:1px solid rgba(174,123,92,.25);box-shadow:0 8px 22px rgba(78,56,40,.08);position:relative}
      html body #characters .hc-focus-header-v3 .portrait img{position:absolute;width:100%;height:100%;object-fit:cover;object-position:50% 18%;display:block;filter:none!important;transform:none!important}
      html body #characters .hc-focus-header-v3[data-id='ines'] .portrait img{object-position:33% 18%;transform:scale(1.15)!important}
      html body #characters .hc-focus-header-v3[data-id='maya'] .portrait img{object-position:50% 11%;transform:scale(1.18)!important}
      html body #characters .hc-focus-header-v3 h3{margin:0 0 6px!important;font:400 36px/.95 Georgia,serif!important;color:#37342f!important}
      html body #characters .hc-focus-header-v3 p{margin:0;font:italic 13px/1.4 Georgia,serif;color:#906653}
      html body #characters .hc-focus>.hc-focus-header-v3~h3,html body #characters .hc-focus>.hc-focus-header-v3~.vibe{display:none!important}
      @media(max-width:1100px){html body #characters .hc-grid{gap:16px 12px!important}}
      @media(max-width:900px){html body #characters .hc-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:none!important;grid-auto-rows:minmax(170px,1fr)!important;overflow:auto!important}html body #characters .hc-person.focused{transform:translateY(-2px) scale(1.025)!important}}
    `;document.head.appendChild(s)
  }

  function imgFor(card){return $('.fig img',card)?.src||null}
  function renderFocus(id){
    const root=$('#characters .hc-cast'),focus=$('.hc-focus',root),card=$(`.hc-person[data-id="${id}"]`,root),p=profiles[id];
    if(!focus||!card||!p)return;
    const ids=$$('.hc-person',root).map(x=>x.dataset.id);const idx=Math.max(0,ids.indexOf(id));const src=imgFor(card);
    focus.innerHTML=`<div class="hc-focus-nav"><button class="hc-icon" data-v3-prev>‹</button><span>${idx+1} / ${ids.length}</span><button class="hc-icon" data-v3-next>›</button></div><div class="hc-focus-header-v3" data-id="${id}"><div class="portrait">${src?`<img src="${src}" alt="${p.name}">`:''}</div><div><h3>${p.name}</h3><p>${p.note}</p></div></div><div class="hc-focus-block"><b>Son regard</b><p>${p.strength}</p></div><div class="hc-focus-block"><b>Elle recherche</b><p>${p.dream}</p></div><div class="hc-focus-block hc-projection"><b>Et si je devenais elle ?</b><p>${p.projection}</p></div><div class="hc-focus-actions"><button data-v3-compare>Comparer</button><button data-v3-close>Fermer</button><button class="primary" data-profile>Voir son portrait complet</button></div>`;
    focus.classList.add('open');
    $('[data-v3-prev]',focus).onclick=()=>select(ids[(idx-1+ids.length)%ids.length]);
    $('[data-v3-next]',focus).onclick=()=>select(ids[(idx+1)%ids.length]);
    $('[data-v3-close]',focus).onclick=clear;
  }
  function select(id){
    const root=$('#characters .hc-cast');if(!root||!profiles[id])return;selected=id;root.classList.add('has-focus');$$('.hc-person',root).forEach(c=>c.classList.toggle('focused',c.dataset.id===id));renderFocus(id)
  }
  function clear(){const root=$('#characters .hc-cast');if(!root)return;root.classList.remove('has-focus');$$('.hc-person',root).forEach(c=>c.classList.remove('focused'));$('.hc-focus',root)?.classList.remove('open')}
  function hardenCards(){
    const root=$('#characters .hc-cast');if(!root)return false;const grid=$('.hc-grid',root);if(!grid)return false;
    $$('.hc-person',grid).forEach(old=>{const id=old.dataset.id;if(!id)return;const clone=old.cloneNode(true);clone.classList.remove('focused');clone.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();select(id)});old.replaceWith(clone)});
    ['clara','ines','maya'].forEach(id=>{const c=$(`.hc-person[data-id="${id}"]`,grid);if(c)c.dataset.hcOfficial='1'});
    select(selected);return true
  }
  function boot(){installCss();let n=0;(function wait(){if(hardenCards())return;if(++n<120)setTimeout(wait,60)})()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();