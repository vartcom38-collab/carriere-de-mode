/* Haute Couture Live — navigateur territorial France global V1
   Vue France legere, puis rendu detaille d'un departement a la demande.
*/
(function(){
'use strict';
if(window.__HCTerritorialMapGlobalBrowserV1)return;
window.__HCTerritorialMapGlobalBrowserV1=true;

const AURA=[
  ['01','Ain'],['03','Allier'],['07','Ardeche'],['15','Cantal'],['26','Drome'],['38','Isere'],
  ['42','Loire'],['43','Haute-Loire'],['63','Puy-de-Dome'],['69','Rhone'],['73','Savoie'],['74','Haute-Savoie']
];
const REGISTRY_CODES=new Set(['01']);
const PACKS={
  '03':'../allier-map-content-v1.js','07':'../ardeche-map-content-v1.js','15':'../cantal-map-content-v1.js',
  '26':'../drome-map-content-v1.js','38':'../isere-map-content-v1.js','42':'../loire-map-content-v1.js',
  '43':'../haute-loire-map-content-v1.js','63':'../puy-de-dome-map-content-v1.js','69':'../rhone-map-content-v1.js',
  '73':'../savoie-map-content-v1.js','74':'../haute-savoie-map-content-v1.js'
};
const REGISTRY='../territorial-map-registry-v2.js';
const ALL_CODES=AURA.map(x=>x[0]);
const NAME=Object.fromEntries(AURA);

function ready(){
  const bridge=window.HCLocalMap;
  if(!bridge?.map||!bridge?.addMarker)return setTimeout(ready,40);
  boot(bridge).catch(err=>{
    console.error('[HC France map]',err);
    const loading=document.querySelector('#loading');
    if(loading)loading.textContent='Carte France : chargement incomplet';
  });
}

async function boot(bridge){
  const map=bridge.map;
  const ctx=window.HCTerritoryContext;
  const realPresence=ctx?.getPresence?.()||null;
  const realHome=ctx?.getResidence?.()||null;
  const originalAdd=bridge.addMarker.bind(bridge);
  const seen=new Set();
  const byDept=new Map();
  let total=0;

  Object.values(bridge.groups||{}).forEach(group=>group?.clearLayers?.());
  bridge.globalBrowse=true;

  bridge.addMarker=function(place){
    if(!place||place.lat==null||place.lng==null)return;
    const id=String(place.id||[place.dept,place.city,place.name,place.lat,place.lng].join('|'));
    if(seen.has(id))return;
    seen.add(id);
    const dept=String(place.dept||'');
    if(!byDept.has(dept))byDept.set(dept,[]);
    byDept.get(dept).push(place);
    total+=1;
  };

  installUi(map,realPresence,realHome,byDept,()=>total,code=>renderDept(code));
  map.setView([46.6,2.2],6);

  for(const code of ALL_CODES){
    const src=REGISTRY_CODES.has(code)?REGISTRY:PACKS[code];
    if(!src)continue;
    console.log('[HC France map] chargement',code,src);
    await loadPackIsolated(code,src,bridge);
    console.log('[HC France map] charge',code,(byDept.get(code)||[]).length);
    refreshUi(byDept,total);
  }

  bridge.addMarker=originalAdd;
  refreshUi(byDept,total,true);

  function renderDept(code){
    Object.values(bridge.groups||{}).forEach(group=>group?.clearLayers?.());
    const pts=byDept.get(code)||[];
    pts.forEach(p=>originalAdd(p));
    if(!pts.length)return;
    const bounds=L.latLngBounds(pts.map(p=>[Number(p.lat),Number(p.lng)]));
    map.fitBounds(bounds.pad(.12),{maxZoom:10});
    const title=document.querySelector('#mapTitle');
    if(title)title.textContent=`DEPARTEMENT ${code} · ${NAME[code]||''}`;
  }

  window.__HCFranceMapState={byDept,getTotal:()=>total,renderDept};
  console.log('[HC France map] pret',Object.fromEntries([...byDept].map(([k,v])=>[k,v.length])),'total',total);
  document.dispatchEvent(new CustomEvent('hc-territorial-global-map-ready',{
    detail:{codes:[...byDept.keys()],counts:Object.fromEntries([...byDept].map(([k,v])=>[k,v.length])),total}
  }));
}

function loadPackIsolated(code,src,bridge){
  return new Promise(resolve=>{
    const frame=document.createElement('iframe');
    frame.setAttribute('aria-hidden','true');
    frame.tabIndex=-1;
    frame.style.cssText='position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;top:-9999px;border:0';
    document.body.appendChild(frame);
    const win=frame.contentWindow;
    const doc=frame.contentDocument;
    win.HCTerritoryContext={getPresence:()=>({departmentCode:code,city:'Consultation France'})};
    win.HCLocalMap={addMarker:p=>bridge.addMarker(p)};
    win.HauteCoutureCore=window.HauteCoutureCore;
    const script=doc.createElement('script');
    script.src=new URL(src,location.href).href+'?globalBrowse=1';
    let done=false;
    const finish=()=>{if(done)return;done=true;frame.remove();resolve();};
    const timer=setTimeout(()=>{console.warn('[HC France map] timeout pack',code,src);finish();},4000);
    script.onload=()=>{clearTimeout(timer);finish();};
    script.onerror=()=>{clearTimeout(timer);console.warn('[HC France map] pack non charge',code,src);finish();};
    doc.head.appendChild(script);
  });
}

function installUi(map,presence,home,byDept,getTotal,renderDept){
  const cityTitle=document.querySelector('#cityTitle');
  if(cityTitle)cityTitle.textContent='LA FRANCE';
  const headP=document.querySelector('.head p');
  if(headP)headP.textContent='Explore les territoires integres. Choisir un departement affiche ses lieux sans deplacer Marion ; seul « Se rendre ici » lance un voyage.';

  const style=document.createElement('style');
  style.textContent=`
    .territory-browser{margin:12px 0;padding:11px;border:1px solid var(--line);border-radius:14px;background:#fff}
    .territory-browser strong{display:block;font:17px Georgia,serif;margin-bottom:3px}
    .territory-browser small{display:block;color:var(--muted);font-size:9px;line-height:1.4;margin-bottom:8px}
    .territory-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px}
    .territory-chip{border:1px solid var(--line);background:#fffaf4;border-radius:10px;padding:7px;text-align:left;font:800 9px Arial;cursor:pointer}
    .territory-chip.ready{background:#eef4ea}.territory-chip b{float:right;font-size:9px}
    .map-global-actions{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:10px 0}
    .map-global-actions button{border:0;border-radius:11px;padding:9px;background:#211a16;color:#fff;font-size:9px;font-weight:900;cursor:pointer}
    .map-global-actions button.alt{background:#efe3d9;color:#211a16}
  `;
  document.head.appendChild(style);

  const panel=document.querySelector('.panel');
  const filters=document.querySelector('#filters');
  if(panel&&filters){
    const actions=document.createElement('div');
    actions.className='map-global-actions';
    actions.innerHTML='<button type="button" id="showFrance">VOIR TOUTE LA FRANCE</button><button type="button" class="alt" id="showMe">ME RECENTRER</button>';
    panel.insertBefore(actions,filters);
    const browser=document.createElement('section');
    browser.className='territory-browser';
    browser.innerHTML='<strong>Territoires integres</strong><small id="territorySummary">Chargement des 12 departements AURA...</small><div class="territory-grid" id="territoryGrid"></div>';
    panel.insertBefore(browser,filters);
    document.querySelector('#showFrance').onclick=()=>{
      Object.values(window.HCLocalMap.groups||{}).forEach(group=>group?.clearLayers?.());
      map.setView([46.6,2.2],6);
      const title=document.querySelector('#mapTitle');if(title)title.textContent='FRANCE · TERRITOIRES INTEGRES';
    };
    document.querySelector('#showMe').onclick=()=>{
      const p=presence||home;
      if(p?.lat!=null&&p?.lng!=null)map.setView([Number(p.lat),Number(p.lng)],12);
      else map.setView([46.6,2.2],6);
    };
  }

  function globalTitle(){
    const el=document.querySelector('#mapTitle');
    if(!el)return;
    const z=map.getZoom();
    if(z<9)el.textContent='FRANCE · TERRITOIRES INTEGRES';
  }
  map.on('zoomend',()=>setTimeout(globalTitle,0));
  globalTitle();

  window.__HCFranceMapState={byDept,getTotal};
  window.__HCFranceRenderDept=renderDept;
}

function refreshUi(byDept,total,done=false){
  const grid=document.querySelector('#territoryGrid');
  const summary=document.querySelector('#territorySummary');
  const loading=document.querySelector('#loading');
  const auraReady=AURA.filter(([code])=>(byDept.get(code)||[]).length>0).length;
  if(summary)summary.textContent=`AURA ${auraReady}/12 · ${total} lieux disponibles${done?' · pret a explorer':''}`;
  if(loading)loading.textContent=`AURA ${auraReady}/12 · ${total} lieux`;
  if(!grid)return;
  grid.innerHTML=AURA.map(([code,label])=>{
    const n=(byDept.get(code)||[]).length;
    return `<button type="button" class="territory-chip ${n?'ready':''}" data-dept="${code}">${code} · ${label}<b>${n||'—'}</b></button>`;
  }).join('');
  grid.querySelectorAll('[data-dept]').forEach(btn=>btn.onclick=()=>window.__HCFranceMapState?.renderDept?.(btn.dataset.dept));
}

ready();
})();
