(function(){
  if(window.__HCBourgVectorMapInstalled)return;window.__HCBourgVectorMapInstalled=true;
  const STYLE='https://tiles.openfreemap.org/styles/liberty';
  const ML_JS='https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.js';
  const ML_CSS='https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.css';
  const $=(s,r=document)=>r.querySelector(s);
  let map=null,stage=null,loading=false,lastActive=false;

  const permanent=[
    {id:'centre',name:'Centre ancien',kind:'quartier',glyph:'⌂',lng:5.2257,lat:46.2054},
    {id:'gare',name:'Gare',kind:'transport',glyph:'▤',lng:5.21461,lat:46.20010},
    {id:'brou',name:'Monastère royal de Brou',kind:'patrimoine',glyph:'♜',lng:5.23576,lat:46.19766},
    {id:'marche',name:'Place du marché',kind:'vie locale',glyph:'◌',lng:5.2252,lat:46.2059},
    {id:'parc',name:'Parc de Brou',kind:'nature',glyph:'❧',lng:5.2380,lat:46.1975}
  ];
  const mobile=[
    {id:'popup',name:'Pop-up textile',kind:'événement',glyph:'✦'},
    {id:'brocante',name:'Brocante',kind:'événement',glyph:'⌁'},
    {id:'atelier',name:'Atelier ouvert',kind:'création',glyph:'◇'}
  ];

  function geo(){return window.HCFranceGeo?.state||null}
  function active(){const g=geo();return !!($('#location')?.classList.contains('active')&&g?.department?.code==='01'&&g?.commune?.nom==='Bourg-en-Bresse')}
  function gameDay(){try{return Number(window.HauteCoutureCore?.load?.()?.world?.day)||1}catch(e){return 1}}
  function hash(v){return String(v).split('').reduce((a,c)=>((a*33)+c.charCodeAt(0))>>>0,5381)}

  function loadMapLibre(cb){
    if(window.maplibregl)return cb();
    if(loading)return setTimeout(()=>loadMapLibre(cb),120);
    loading=true;
    if(!document.querySelector('link[data-hc-maplibre]')){const l=document.createElement('link');l.rel='stylesheet';l.href=ML_CSS;l.dataset.hcMaplibre='1';document.head.appendChild(l)}
    const s=document.createElement('script');s.src=ML_JS;s.async=true;s.onload=()=>{loading=false;cb()};s.onerror=()=>{loading=false;showFallback()};document.head.appendChild(s);
  }

  function css(){if($('#hcBourgVectorStyles'))return;const st=document.createElement('style');st.id='hcBourgVectorStyles';st.textContent=`
  .hc-bourg-vector{position:absolute;inset:0;z-index:12;background:#f7f4ec;overflow:hidden;border-radius:16px}.hc-bourg-vector .maplibregl-canvas{filter:saturate(.68) contrast(.94) brightness(1.04)}.hc-bourg-vector .maplibregl-control-container{display:none}.hc-bourg-title{position:absolute;left:18px;top:14px;z-index:20;background:rgba(250,248,241,.9);padding:8px 11px;border-radius:12px;border:1px solid rgba(70,78,68,.12);pointer-events:none}.hc-bourg-title b{display:block;font:22px/1 Georgia,serif;font-weight:400}.hc-bourg-title small{font:10px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#6f7f71}.hc-bourg-note{position:absolute;right:14px;bottom:12px;z-index:20;background:rgba(250,248,241,.9);padding:7px 10px;border-radius:11px;font:10px/1.35 Arial,sans-serif;color:#6c7068;pointer-events:none}.hc-map-symbol{width:54px;height:54px;border:0;background:transparent;cursor:pointer;display:grid;place-items:center;touch-action:manipulation}.hc-map-symbol .ink{width:34px;height:34px;border-radius:46% 54% 48% 52%;display:grid;place-items:center;background:#fffdf7;border:1px solid rgba(72,91,72,.24);box-shadow:0 3px 12px rgba(42,45,38,.10);font:18px Georgia,serif;transition:.15s}.hc-map-symbol:hover .ink,.hc-map-symbol:focus .ink{transform:scale(1.1);background:#e8f0df}.hc-map-symbol .label{position:absolute;top:42px;left:50%;transform:translateX(-50%);white-space:nowrap;padding:2px 5px;background:rgba(255,253,247,.92);font:10px Georgia,serif;color:#495148;border-radius:6px}.hc-map-symbol.event .ink{background:#fff3d9;border-style:dashed}.hc-map-sheet{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);z-index:30;width:min(430px,88%);background:rgba(255,253,247,.97);border:1px solid rgba(74,82,71,.18);border-radius:16px;box-shadow:0 16px 42px rgba(34,38,32,.16);padding:14px 44px 14px 15px;display:none}.hc-map-sheet.open{display:block}.hc-map-sheet button.close{position:absolute;right:12px;top:8px;border:0;background:none;font-size:24px}.hc-map-sheet h3{margin:3px 0 4px;font:20px Georgia,serif;font-weight:400}.hc-map-sheet small{font:10px Arial,sans-serif;text-transform:uppercase;letter-spacing:.1em;color:#778071}.hc-map-fallback{position:absolute;inset:0;display:grid;place-items:center;padding:24px;text-align:center;background:#f7f4ec;color:#687064;font:14px Georgia,serif}@media(max-width:760px){.hc-map-symbol{width:64px;height:64px}.hc-map-symbol .label{display:none}.hc-bourg-title b{font-size:18px}}
  `;document.head.appendChild(st)}

  function simplifyStyle(){
    if(!map)return;
    const style=map.getStyle();
    (style.layers||[]).forEach(l=>{try{
      const id=(l.id||'').toLowerCase(),sl=String(l['source-layer']||'').toLowerCase();
      if(l.type==='symbol'){map.setLayoutProperty(l.id,'visibility','none');return}
      if(l.type==='background')map.setPaintProperty(l.id,'background-color','#f6f2e9');
      if(l.type==='fill'){
        if(/water/.test(id+sl))map.setPaintProperty(l.id,'fill-color','#cfe4df');
        else if(/park|landcover|landuse|wood|grass/.test(id+sl))map.setPaintProperty(l.id,'fill-color','#dfe9d6');
        else if(/building/.test(id+sl)){map.setPaintProperty(l.id,'fill-color','#fbf6ec');map.setPaintProperty(l.id,'fill-opacity',.82)}
        else map.setPaintProperty(l.id,'fill-color','#f1eee5');
      }
      if(l.type==='line'){
        if(/road|street|transport/.test(id+sl)){map.setPaintProperty(l.id,'line-color','#b8c9b5');map.setPaintProperty(l.id,'line-opacity',.78)}
        else if(/water/.test(id+sl))map.setPaintProperty(l.id,'line-color','#a9cfca');
        else {map.setPaintProperty(l.id,'line-color','#c8c3b9');map.setPaintProperty(l.id,'line-opacity',.45)}
      }
    }catch(e){}});
  }

  function addMarker(p,isEvent=false){
    const el=document.createElement('button');el.className='hc-map-symbol'+(isEvent?' event':'');el.setAttribute('aria-label',p.name);el.innerHTML='<span class="ink">'+p.glyph+'</span><span class="label">'+p.name+'</span>';
    el.onclick=e=>{e.stopPropagation();openSheet(p)};
    new maplibregl.Marker({element:el,anchor:'center'}).setLngLat([p.lng,p.lat]).addTo(map);
  }
  function eventPlaces(){const d=gameDay(),seed=hash('bourg|'+d);return mobile.slice(0,1+(seed%2)).map((e,i)=>({...e,lng:5.218+(hash(seed+'x'+i)%1800)/100000,lat:46.197+(hash(seed+'y'+i)%1100)/100000}))}
  function openSheet(p){const sh=$('.hc-map-sheet',stage);if(!sh)return;sh.innerHTML='<button class="close" aria-label="Fermer">×</button><small>'+p.kind+'</small><h3>'+p.name+'</h3><p>'+(p.kind==='événement'?'Ce repère est temporaire : il peut apparaître, disparaître ou changer d’endroit selon la date du jeu.':'Ce repère fait partie de la carte permanente de Bourg-en-Bresse.')+'</p>';sh.classList.add('open');sh.querySelector('.close').onclick=()=>sh.classList.remove('open')}

  function mount(){
    if(!active())return unmount();
    if(stage&&stage.isConnected){map?.resize();return}
    const zone=$('.france-zone');if(!zone)return;
    css();
    stage=document.createElement('div');stage.className='hc-bourg-vector';stage.id='hcBourgVectorMap';stage.innerHTML='<div class="hc-bourg-title"><small>Ain · plan interactif</small><b>Bourg-en-Bresse</b></div><div class="hc-bourg-note">Plan 2D réel simplifié · les symboles de jeu restent des couches indépendantes</div><div class="hc-map-sheet"></div>';
    zone.appendChild(stage);
    loadMapLibre(()=>{
      if(!stage?.isConnected||!active())return;
      map=new maplibregl.Map({container:stage,style:STYLE,center:[5.226,46.202],zoom:13.15,minZoom:11.7,maxZoom:15.7,pitch:0,bearing:0,attributionControl:false,dragRotate:false,pitchWithRotate:false,touchPitch:false});
      map.touchZoomRotate.disableRotation();
      map.on('load',()=>{simplifyStyle();permanent.forEach(p=>addMarker(p,false));eventPlaces().forEach(p=>addMarker(p,true));});
      map.on('error',()=>{});
    });
  }
  function unmount(){if(!stage)return;try{map?.remove()}catch(e){}map=null;stage.remove();stage=null}
  function showFallback(){if(!stage)return;stage.innerHTML='<div class="hc-map-fallback">La carte interactive n’a pas pu charger. Le reste du jeu reste utilisable.</div>'}
  function boot(){let sig='';const tick=()=>{const g=geo(),s=[!!$('#location')?.classList.contains('active'),g?.department?.code,g?.commune?.nom].join('|');if(s!==sig){sig=s;active()?mount():unmount()}};tick();setInterval(tick,700);const loc=$('#location');if(loc)new MutationObserver(tick).observe(loc,{attributes:true,attributeFilter:['class']})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();