(function(){
  if(window.__HCBourgVectorMapInstalled)return;window.__HCBourgVectorMapInstalled=true;
  const STYLE='https://tiles.openfreemap.org/styles/liberty';
  const ML_JS='https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.js';
  const ML_CSS='https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.css';
  const $=(s,r=document)=>r.querySelector(s);
  let map=null,stage=null,loading=false;

  const permanent=[
    {id:'centre',name:'Centre ancien',kind:'quartier',icon:'house',lng:5.2257,lat:46.2054,text:'Le cœur de Bourg-en-Bresse. Les petites rues, vitrines et rendez-vous de quartier deviendront progressivement des points de jeu.'},
    {id:'gare',name:'Gare',kind:'transport',icon:'station',lng:5.21461,lat:46.20010,text:'Le point de départ des déplacements vers d’autres villes et, plus tard, d’autres régions.'},
    {id:'brou',name:'Monastère royal de Brou',kind:'patrimoine',icon:'brou',lng:5.23576,lat:46.19766,text:'Un grand repère culturel de la ville, utilisable pour les sorties, inspirations, rencontres et événements.'},
    {id:'marche',name:'Place du marché',kind:'vie locale',icon:'market',lng:5.2252,lat:46.2059,text:'Un lieu vivant : matières, rencontres et petits événements pourront apparaître ici selon la date.'},
    {id:'parc',name:'Parc de Brou',kind:'nature',icon:'tree',lng:5.2380,lat:46.1975,text:'Un lieu calme qui pourra accueillir croquis, promenades, rendez-vous et scènes saisonnières.'}
  ];
  const mobile=[
    {id:'popup',name:'Pop-up textile',kind:'événement',icon:'spark'},
    {id:'brocante',name:'Brocante',kind:'événement',icon:'stall'},
    {id:'atelier',name:'Atelier ouvert',kind:'création',icon:'atelier'}
  ];

  function geo(){return window.HCFranceGeo?.state||null}
  function active(){const g=geo();return !!($('#location')?.classList.contains('active')&&g?.department?.code==='01'&&g?.commune?.nom==='Bourg-en-Bresse')}
  function gameDay(){try{return Number(window.HauteCoutureCore?.load?.()?.world?.day)||1}catch(e){return 1}}
  function hash(v){return String(v).split('').reduce((a,c)=>((a*33)+c.charCodeAt(0))>>>0,5381)}

  function icon(name){
    const common='viewBox="0 0 56 56" aria-hidden="true"';
    const wrap=paths=>'<svg '+common+'>'+paths+'</svg>';
    if(name==='brou')return wrap('<path d="M10 40h36M15 39V23l5-5 5 5v16M30 39V18l5-7 5 7v21"/><path d="M12 23h15M28 22h15M20 18v-6M35 11V7"/><path class="wash" d="M12 39V25h14v14zM29 39V20h13v19z"/>');
    if(name==='station')return wrap('<path d="M13 38h30V20H13zM18 20v-5h20v5M19 28h18M21 34h4m6 0h4M17 43l5-5m17 5-5-5"/><path class="wash" d="M15 22h26v14H15z"/>');
    if(name==='market')return wrap('<path d="M12 25h32M15 25l3-10h20l3 10M17 25v15m22-15v15M15 40h26"/><path d="M19 15v10m7-10v10m7-10v10"/><path class="wash" d="M16 26h24v13H16z"/>');
    if(name==='tree')return wrap('<path d="M28 41V28M23 41h10"/><path d="M28 10c8 0 13 6 11 12 6 3 3 11-4 11-3 5-12 5-15 0-7 1-10-7-5-11-2-7 5-12 13-12z"/><path class="wash" d="M16 22c0-7 5-11 12-11s12 5 12 11-5 12-12 12-12-5-12-12z"/>');
    if(name==='house')return wrap('<path d="M12 28l16-13 16 13M16 26v15h24V26M24 41V30h8v11M19 30h4m10 0h4"/><path class="wash" d="M18 27h20v12H18z"/>');
    if(name==='atelier')return wrap('<path d="M13 18h30v23H13zM18 24h20M18 30h11M18 36h17"/><path d="M34 14l8 8M38 12l6 6"/><path class="wash" d="M15 20h26v19H15z"/>');
    if(name==='stall')return wrap('<path d="M13 24h30M16 24l3-9h18l3 9M17 24v17m22-17v17M14 41h28"/><path class="wash" d="M18 26h20v13H18z"/>');
    return wrap('<path d="M28 10l3 11 11 3-11 4-3 11-4-11-11-4 11-3z"/><path class="wash" d="M28 15l2 8 8 2-8 3-2 8-3-8-8-3 8-2z"/>');
  }

  function loadMapLibre(cb){
    if(window.maplibregl)return cb();
    if(loading)return setTimeout(()=>loadMapLibre(cb),120);
    loading=true;
    if(!document.querySelector('link[data-hc-maplibre]')){const l=document.createElement('link');l.rel='stylesheet';l.href=ML_CSS;l.dataset.hcMaplibre='1';document.head.appendChild(l)}
    const s=document.createElement('script');s.src=ML_JS;s.async=true;s.onload=()=>{loading=false;cb()};s.onerror=()=>{loading=false;showFallback()};document.head.appendChild(s);
  }

  function css(){if($('#hcBourgVectorStyles'))return;const st=document.createElement('style');st.id='hcBourgVectorStyles';st.textContent=`
  .hc-bourg-vector{position:absolute;inset:0;z-index:12;overflow:hidden;border-radius:18px;background:#f7f4ec;isolation:isolate}
  .hc-bourg-vector:before{content:"";position:absolute;inset:0;z-index:6;pointer-events:none;background-image:radial-gradient(rgba(61,73,64,.055) .7px,transparent .7px),linear-gradient(115deg,rgba(255,255,255,.22),transparent 35%);background-size:8px 8px,100% 100%;mix-blend-mode:multiply}
  .hc-bourg-vector .maplibregl-canvas{filter:saturate(.48) contrast(.91) brightness(1.07)}.hc-bourg-vector .maplibregl-control-container{display:none}
  .hc-bourg-frame{position:absolute;inset:10px;z-index:18;border:1px solid rgba(86,100,88,.16);border-radius:16px;pointer-events:none;box-shadow:inset 0 0 0 5px rgba(255,253,247,.28)}
  .hc-bourg-title{position:absolute;left:22px;top:18px;z-index:22;padding:7px 12px 8px;background:rgba(250,248,242,.84);border-radius:12px;pointer-events:none;box-shadow:0 3px 12px rgba(66,67,56,.05)}
  .hc-bourg-title b{display:block;font:26px/1 Georgia,serif;font-weight:400;letter-spacing:-.02em;color:#48504a}.hc-bourg-title small{font:9px Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#7d8c7c}
  .hc-bourg-doodle{position:absolute;z-index:19;pointer-events:none;color:#718472;opacity:.58;font:italic 11px Georgia,serif}.hc-bourg-doodle.one{right:28px;top:26px;transform:rotate(2deg)}.hc-bourg-doodle.two{left:26px;bottom:25px;transform:rotate(-2deg)}
  .hc-map-symbol{position:relative;width:76px;height:76px;border:0;background:transparent;cursor:pointer;touch-action:manipulation;padding:0;display:grid;place-items:center}.hc-map-symbol .paper{position:relative;width:52px;height:52px;display:grid;place-items:center;border-radius:47% 53% 50% 46%;background:rgba(255,252,244,.96);border:1px solid rgba(75,93,78,.18);box-shadow:0 5px 16px rgba(50,60,51,.10);transition:.18s ease}.hc-map-symbol svg{width:43px;height:43px;overflow:visible}.hc-map-symbol svg path{fill:none;stroke:#506257;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}.hc-map-symbol svg .wash{fill:#dcebd9;stroke:none;opacity:.68}.hc-map-symbol:hover .paper,.hc-map-symbol:focus .paper{transform:translateY(-2px) scale(1.06);background:#fffef9}.hc-map-symbol .label{position:absolute;top:61px;left:50%;transform:translateX(-50%) rotate(-1deg);white-space:nowrap;padding:2px 6px;background:rgba(255,252,245,.9);font:10px Georgia,serif;color:#4d5a51;border-radius:5px;box-shadow:0 1px 4px rgba(55,58,51,.05)}
  .hc-map-symbol.event .paper{width:44px;height:44px;background:#fff4d9;border:1px dashed rgba(199,151,88,.65);animation:hcEventPulse 2.8s ease-in-out infinite}.hc-map-symbol.event svg{width:35px;height:35px}.hc-map-symbol.event svg path{stroke:#8b6c45}.hc-map-symbol.event svg .wash{fill:#f3d8a1}.hc-map-symbol.event .label{top:56px;font-style:italic}
  .hc-map-sheet{position:absolute;right:20px;bottom:22px;z-index:35;width:min(380px,88%);background:rgba(255,253,247,.98);border:1px solid rgba(74,82,71,.18);border-radius:17px;box-shadow:0 18px 48px rgba(34,38,32,.16);padding:15px 44px 15px 16px;display:none}.hc-map-sheet.open{display:block}.hc-map-sheet button.close{position:absolute;right:12px;top:8px;border:0;background:none;font-size:24px;color:#596258;cursor:pointer}.hc-map-sheet h3{margin:3px 0 5px;font:21px Georgia,serif;font-weight:400}.hc-map-sheet small{font:9px Arial,sans-serif;text-transform:uppercase;letter-spacing:.13em;color:#778071}.hc-map-sheet p{font:12px/1.45 Georgia,serif;color:#66685f;margin:5px 0}.hc-map-sheet .temporary{margin-top:8px;padding:6px 8px;background:#fff5df;border-radius:8px;font:10px Arial,sans-serif;color:#806847}
  .hc-map-fallback{position:absolute;inset:0;display:grid;place-items:center;padding:24px;text-align:center;background:#f7f4ec;color:#687064;font:14px Georgia,serif}
  @keyframes hcEventPulse{50%{transform:translateY(-2px) scale(1.06)}}
  @media(max-width:760px){.hc-map-symbol{width:86px;height:86px}.hc-map-symbol .label{display:none}.hc-bourg-title b{font-size:20px}.hc-bourg-doodle{display:none}.hc-map-sheet{left:4%;right:4%;width:auto;bottom:12px}}
  `;document.head.appendChild(st)}

  function simplifyStyle(){
    if(!map)return;
    (map.getStyle().layers||[]).forEach(l=>{try{
      const id=(l.id||'').toLowerCase(),sl=String(l['source-layer']||'').toLowerCase(),k=id+' '+sl;
      if(l.type==='symbol'){map.setLayoutProperty(l.id,'visibility','none');return}
      if(l.type==='background'){map.setPaintProperty(l.id,'background-color','#f7f4ec');return}
      if(l.type==='fill'){
        if(/water/.test(k)){map.setPaintProperty(l.id,'fill-color','#d7ebe7');map.setPaintProperty(l.id,'fill-opacity',.78)}
        else if(/park|wood|grass|landcover|landuse/.test(k)){map.setPaintProperty(l.id,'fill-color','#e4eee0');map.setPaintProperty(l.id,'fill-opacity',.74)}
        else if(/building/.test(k)){map.setPaintProperty(l.id,'fill-color','#f1e5d5');map.setPaintProperty(l.id,'fill-opacity',.62)}
        else {map.setPaintProperty(l.id,'fill-color','#f7f3eb');map.setPaintProperty(l.id,'fill-opacity',.55)}
      }
      if(l.type==='line'){
        if(/motorway|trunk|primary/.test(k)){map.setPaintProperty(l.id,'line-color','#c7d5c3');map.setPaintProperty(l.id,'line-opacity',.9)}
        else if(/road|street|transport|secondary|tertiary/.test(k)){map.setPaintProperty(l.id,'line-color','#d7ded0');map.setPaintProperty(l.id,'line-opacity',.9)}
        else if(/water/.test(k)){map.setPaintProperty(l.id,'line-color','#add3ce');map.setPaintProperty(l.id,'line-opacity',.8)}
        else {map.setPaintProperty(l.id,'line-color','#d8d0c5');map.setPaintProperty(l.id,'line-opacity',.38)}
      }
    }catch(e){}});
  }

  function addMarker(p,isEvent=false){
    const el=document.createElement('button');el.className='hc-map-symbol'+(isEvent?' event':'');el.setAttribute('aria-label',p.name);el.innerHTML='<span class="paper">'+icon(p.icon)+'</span><span class="label">'+p.name+'</span>';
    el.onclick=e=>{e.preventDefault();e.stopPropagation();openSheet(p,isEvent)};
    new maplibregl.Marker({element:el,anchor:'center'}).setLngLat([p.lng,p.lat]).addTo(map);
  }
  function eventPlaces(){const d=gameDay(),seed=hash('bourg|'+d);return mobile.slice(0,1+(seed%2)).map((e,i)=>({...e,lng:5.218+(hash(seed+'x'+i)%1800)/100000,lat:46.197+(hash(seed+'y'+i)%1100)/100000}))}
  function openSheet(p,isEvent){const sh=$('.hc-map-sheet',stage);if(!sh)return;sh.innerHTML='<button class="close" aria-label="Fermer">×</button><small>'+p.kind+'</small><h3>'+p.name+'</h3><p>'+(p.text||'Ce repère existe seulement aujourd’hui sur ta carte. Il peut changer de place ou disparaître au fil du jeu.')+'</p>'+(isEvent?'<div class="temporary">Repère temporaire · couche gameplay indépendante du plan</div>':'');sh.classList.add('open');sh.querySelector('.close').onclick=()=>sh.classList.remove('open')}

  function mount(){
    if(!active())return unmount();
    if(stage&&stage.isConnected){map?.resize();return}
    const zone=$('.france-zone');if(!zone)return;
    css();stage=document.createElement('div');stage.className='hc-bourg-vector';stage.id='hcBourgVectorMap';stage.innerHTML='<div class="hc-bourg-frame"></div><div class="hc-bourg-title"><small>Ain · carnet de ville interactif</small><b>Bourg-en-Bresse</b></div><div class="hc-bourg-doodle one">promener le regard · trouver les détails</div><div class="hc-bourg-doodle two">la ville change avec les jours</div><div class="hc-map-sheet"></div>';zone.appendChild(stage);
    loadMapLibre(()=>{
      if(!stage?.isConnected||!active())return;
      map=new maplibregl.Map({container:stage,style:STYLE,center:[5.226,46.202],zoom:13.25,minZoom:11.7,maxZoom:15.7,pitch:0,bearing:0,attributionControl:false,dragRotate:false,pitchWithRotate:false,touchPitch:false,fadeDuration:0});
      map.touchZoomRotate.disableRotation();
      map.on('load',()=>{simplifyStyle();permanent.forEach(p=>addMarker(p,false));eventPlaces().forEach(p=>addMarker(p,true));});
      map.on('error',()=>{});
    });
  }
  function unmount(){if(!stage)return;try{map?.remove()}catch(e){}map=null;stage.remove();stage=null}
  function showFallback(){if(!stage)return;stage.innerHTML='<div class="hc-map-fallback">La carte interactive n’a pas pu charger. Le reste du jeu reste utilisable.</div>'}
  function boot(){let sig='';const tick=()=>{const g=geo(),s=[!!$('#location')?.classList.contains('active'),g?.department?.code,g?.commune?.nom].join('|');if(s!==sig){sig=s;active()?mount():unmount()}};tick();setInterval(tick,900);const loc=$('#location');if(loc)new MutationObserver(tick).observe(loc,{attributes:true,attributeFilter:['class']})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();