(function(){
  if(window.__HCHousingUIInstalled)return;window.__HCHousingUIInstalled=true;
  function install(){
    const root=document.getElementById('location');
    if(!root)return false;
    root.classList.add('hc-housing-da');
    const shell=root.querySelector('.world-shell');
    const mapPaper=root.querySelector('.map-paper');
    const zone=root.querySelector('.france-zone');
    const explorer=root.querySelector('.explorer');
    const prop=root.querySelector('.property-panel');
    if(!shell||!mapPaper||!zone||!explorer||!prop)return false;

    // Title and brand adapted to the validated visual direction.
    const top=mapPaper.querySelector('.topline');
    if(top){
      top.innerHTML='<div class="hc-housing-brand"><div class="hc-logo">HAUTE COUTURE <span>Le jeu</span></div><div class="hc-housing-title">CHOISIS<br>TON LOGEMENT</div><div class="hc-housing-sub">Ton atelier, ton refuge,<br>ton point de départ</div><p>Installe-toi quelque part en France. Chaque ville a son ambiance, ses opportunités et ses inspirations.</p></div><div class="hc-player-pill"><span class="avatar" id="chosenAvatar">✦</span><span id="chosenName">Personnage</span></div>';
    }

    const note=zone.querySelector('.map-note');
    if(note)note.innerHTML='<strong>Bonjour la France ✦</strong><br>Clique sur une région, puis affine jusqu’au département et à la ville pour voir les annonces.';

    // Keep all existing interaction logic, only replace presentation.
    const style=document.createElement('style');style.id='hcHousingDAStyles';style.textContent=`
      #location.hc-housing-da{background:#f7f1e7;overflow:auto;color:#3a3f3d}
      #location.hc-housing-da:before{content:"";position:fixed;inset:0;pointer-events:none;background:
        radial-gradient(circle at 65% 22%,rgba(207,227,210,.35),transparent 28%),
        radial-gradient(circle at 34% 68%,rgba(207,227,210,.30),transparent 34%),
        linear-gradient(180deg,rgba(255,255,255,.42),rgba(247,241,231,.28));z-index:0}
      #location .world-shell{position:relative;z-index:1;min-height:100vh;padding:18px 20px 22px;display:grid;grid-template-columns:minmax(760px,1.65fr) minmax(320px,.62fr);gap:14px}
      #location .paper{background:rgba(255,252,245,.76);border:1px solid rgba(90,74,58,.16);box-shadow:none;border-radius:18px}
      #location .map-paper{padding:0;overflow:hidden;position:relative;min-height:calc(100vh - 40px)}
      .hc-housing-brand{position:absolute;left:3.2%;top:3.5%;width:25%;z-index:7;padding:8px 10px}
      .hc-logo{font:22px Georgia,serif;letter-spacing:.06em;border-bottom:1px solid rgba(76,66,56,.18);padding-bottom:8px;margin-bottom:18px}.hc-logo span{display:block;font:italic 16px cursive;color:#aa7776;text-align:center;margin-top:-2px}
      .hc-housing-title{font:clamp(35px,3.2vw,54px)/.98 'Trebuchet MS',Arial,sans-serif;letter-spacing:.02em;color:#303432;margin:4px 0 16px}.hc-housing-sub{font:italic 23px/1.25 cursive;color:#b57c7b;margin:0 0 18px}.hc-housing-brand p{font:14px/1.6 Georgia,serif;max-width:240px;color:#5c5650}
      .hc-player-pill{position:absolute;right:2.4%;top:2%;z-index:9;display:flex;gap:8px;align-items:center;padding:7px 10px;border-radius:999px;background:rgba(255,252,245,.9);border:1px solid rgba(80,70,60,.16);font-size:12px}
      #location .crumbs{position:absolute;left:31%;right:26%;top:2.5%;z-index:9;margin:0;justify-content:center}.crumb{background:rgba(255,252,245,.88);font-size:11px;padding:6px 9px}.crumb.active{background:#dfe8d7}
      #location .map-layout{display:block;min-height:calc(100vh - 40px)}
      #location .france-zone{position:absolute;left:28%;right:25%;top:8%;bottom:4%;min-height:0;border:0;border-radius:0;background:
        radial-gradient(ellipse at 50% 50%,rgba(255,253,247,.96) 0 54%,transparent 55%),
        radial-gradient(circle at 12% 45%,rgba(191,215,218,.45),transparent 40%),
        radial-gradient(circle at 88% 58%,rgba(191,215,218,.45),transparent 42%);overflow:visible}
      #location .france-svg{width:82%;opacity:.65;filter:drop-shadow(0 6px 14px rgba(80,75,65,.06))}.france-shape{fill:#fdfbf5;stroke:#9ca99b;stroke-width:2}
      #location .region-pin{border:0;background:rgba(255,253,247,.74);box-shadow:none;color:#3f4440;padding:5px 7px;border-radius:8px;font:12px/1.1 'Trebuchet MS',Arial,sans-serif;text-transform:uppercase;letter-spacing:.02em}
      #location .region-pin:hover,#location .region-pin.active{background:#e2ebdc;outline:1px solid #9aac91;transform:translate(-50%,-50%) scale(1.05)}
      #location .map-note{left:6%;right:auto;bottom:2.5%;max-width:250px;background:rgba(255,248,239,.92);border:1px solid rgba(180,132,124,.28);font-size:12px;line-height:1.45;box-shadow:none}
      #location .map-note strong{font:18px cursive;color:#6f766b}
      #location .explorer{position:absolute;left:3%;top:47%;width:23%;max-height:39%;z-index:8;border:1px solid rgba(90,80,70,.15);border-radius:14px;background:rgba(234,239,227,.82);padding:13px;overflow:auto}
      #location .explorer .kicker{font-size:10px;color:#77856c}.explorer h3{font:20px Georgia,serif;margin:4px 0}.explorer p{font:12px/1.4 Georgia,serif}.choice-list{gap:5px}.choice{background:rgba(255,253,248,.86);border:1px solid rgba(90,80,70,.14);border-radius:7px;padding:8px 9px;font-size:12px}.choice:hover,.choice.active{background:#e5ecdf;border-color:#9baa91}
      #location .property-panel{min-height:calc(100vh - 40px);padding:18px 15px;background:rgba(255,252,246,.9);border-radius:18px;overflow:hidden}
      #location .property-panel>.kicker{text-align:center;font:20px cursive;text-transform:none;letter-spacing:.03em;color:#514d48;margin-bottom:2px}
      #location .property-panel h2{font:25px Georgia,serif;text-align:center;margin:4px 0}.scope-badge{align-self:center;background:#e8eee2;padding:6px 9px;font-size:10px}.property-panel>p{text-align:center;font-size:11px;margin:4px 0 10px}
      #location .listing-stack{display:grid;grid-template-columns:1fr;gap:7px;overflow:auto;padding-right:2px}
      #location .listing{grid-template-columns:92px 1fr;gap:9px;padding:8px;background:rgba(255,253,248,.82);border:1px solid rgba(88,75,61,.15);border-radius:11px;box-shadow:none}
      #location .listing:hover,#location .listing.selected{background:#f6f9f1;border-color:#97a889;box-shadow:0 6px 15px rgba(60,70,55,.07)}
      #location .listing-art{min-height:78px;border-radius:8px;font-size:24px}.listing-art:after{font-size:8px;background:rgba(255,252,245,.82)}
      #location .listing h3{font:14px Georgia,serif}.listing-meta{font-size:10px}.listing-price{font-size:15px}.listing small{font-size:10px}
      #location .confirm-wrap{padding-top:9px}.confirm-wrap button{border-radius:8px;background:#849678;font:15px Georgia,serif;padding:11px}.status{font-size:10px}
      #location .world-back{left:2%;top:auto;bottom:2%;z-index:14;background:rgba(255,252,245,.92);font-size:12px;padding:8px 12px}
      #location:after{content:"Chaque choix influencera ton quotidien, tes rencontres et les opportunités qui s’offriront à toi.";position:absolute;left:34%;bottom:1.5%;z-index:6;padding:9px 18px;background:rgba(245,221,210,.76);border:1px solid rgba(180,130,120,.2);border-radius:12px;font:13px Georgia,serif;color:#5c5651;pointer-events:none}
      #location .property-sheet{background:#fbf7ef;border-radius:16px}.preview-info h2{font-family:Georgia,serif}.preview-actions .primary{background:#849678}
      @media(max-width:1050px){#location .world-shell{grid-template-columns:1fr}.hc-housing-brand{position:relative;left:auto;top:auto;width:auto;padding:18px 18px 0}.hc-housing-title{font-size:38px}.hc-housing-sub{font-size:20px}.hc-player-pill{top:10px;right:10px}#location .map-paper{min-height:760px}#location .france-zone{left:22%;right:6%;top:18%;bottom:8%}#location .explorer{left:3%;top:40%;width:24%;max-height:42%}#location .property-panel{min-height:auto;max-height:none}#location:after{display:none}}
      @media(max-width:760px){#location .world-shell{padding:6px}.hc-logo{font-size:18px}.hc-housing-title{font-size:32px}.hc-housing-brand p{max-width:65%}#location .map-paper{min-height:900px}#location .france-zone{left:2%;right:2%;top:30%;bottom:24%}#location .explorer{left:4%;right:4%;top:auto;bottom:4%;width:auto;max-height:22%}.region-pin{font-size:9px!important}.hc-player-pill{display:none}#location .crumbs{left:3%;right:3%;top:25%}}
    `;document.head.appendChild(style);
    return true;
  }
  let tries=0;const t=setInterval(()=>{tries++;if(install()||tries>120)clearInterval(t)},100);
})();