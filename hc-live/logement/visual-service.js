/* Haute Couture Live — visuels logement : vraies photos d'abord, génération en secours. */
(function(){
  const CACHE_KEY='haute-couture-visual-service-cache-v1';
  const ENDPOINT_KEY='haute-couture-visual-api-endpoint';
  const LEGACY_ENDPOINT='https://pmsowlrsbyczjjwzuzsr.supabase.co/functions/v1/hc-generate-listing-visual';
  const DEFAULT_ENDPOINT='https://carriere-de-mode-visuals-vartcom38-7358s-projects.vercel.app/api/generate-listing-visual';
  const DEFAULT_STATUS_ENDPOINT='https://carriere-de-mode-visuals-vartcom38-7358s-projects.vercel.app/api/check-listing-visual';
  const PROVIDER='magnific';
  const REAL_PROVIDER='real-photo-library';
  const IMG=id=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=84`;
  const REAL_PHOTOS={
    compact:[
      IMG('photo-1522708323590-d24dbb6b0267'),
      IMG('photo-1505693416388-ac5ce068fe85'),
      IMG('photo-1600566753190-17f0baa2a6c3')
    ],
    bright:[
      IMG('photo-1615529182904-14819c35db37'),
      IMG('photo-1615874694520-474822394e73'),
      IMG('photo-1600210492486-724fe5c67fb0')
    ],
    old:[
      IMG('photo-1600607687939-ce8a6c25118c'),
      IMG('photo-1618221195710-dd6b41faaea6'),
      IMG('photo-1586023492125-27b2c045efd7')
    ],
    loft:[
      IMG('photo-1600566753086-00f18fb6b3ea'),
      IMG('photo-1600607688969-a5bfcd646154'),
      IMG('photo-1600566752355-35792bedcfea')
    ],
    premium:[
      IMG('photo-1600566753190-17f0baa2a6c3'),
      IMG('photo-1600210492486-724fe5c67fb0'),
      IMG('photo-1615874694520-474822394e73')
    ],
    outdoor:[
      IMG('photo-1600585154340-be6161a56a0c'),
      IMG('photo-1600607687939-ce8a6c25118c'),
      IMG('photo-1615529182904-14819c35db37')
    ],
    commercial:[
      IMG('photo-1441986300917-64674bd600d8'),
      IMG('photo-1556742049-0cfed4f6a45d'),
      IMG('photo-1604719312566-8912e9227c6a')
    ]
  };
  function hash(s){let h=2166136261;for(const c of String(s||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
  function cache(){try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'{}')}catch(e){return{}}}
  function saveCache(c){try{localStorage.setItem(CACHE_KEY,JSON.stringify(c))}catch(e){}}
  function endpoint(){const stored=localStorage.getItem(ENDPOINT_KEY);if(stored===LEGACY_ENDPOINT){localStorage.removeItem(ENDPOINT_KEY);return window.HC_VISUAL_API_ENDPOINT||DEFAULT_ENDPOINT}return stored||window.HC_VISUAL_API_ENDPOINT||DEFAULT_ENDPOINT}
  function statusEndpoint(){return window.HC_VISUAL_STATUS_ENDPOINT||DEFAULT_STATUS_ENDPOINT}
  function key(seed,view){return seed+'|'+view}
  function getCached(seed,view){return cache()[key(seed,view)]||null}
  function remember(seed,view,url,provider=PROVIDER){const c=cache();c[key(seed,view)]={url,at:new Date().toISOString(),provider};saveCache(c)}
  function familyFor(listing,v){
    const text=[listing?.title,listing?.type,v?.archetype,v?.archetypeLabel,v?.standingLevel].join(' ').toLowerCase();
    if(/boutique|commerce|showroom|local commercial/.test(text))return'commercial';
    if(listing?.balcony||/extérieur|terrasse|balcon/.test(text))return'outdoor';
    if(/loft|atelier|rez-de-chaussée/.test(text))return'loft';
    if(/ancien|caractère|parquet|moulure/.test(text))return'old';
    if(/premium|haut de gamme/.test(text)||Number(listing?.price||0)>1200)return'premium';
    if(/lumineux|t1|deux-pièces|t2/.test(text)||Number(listing?.surface||0)>=24)return'bright';
    return'compact';
  }
  function resolveRealPhoto(listing,view='main'){
    if(!listing)return null;
    const v=listing.visual||{};
    const family=familyFor(listing,v),arr=REAL_PHOTOS[family]||REAL_PHOTOS.bright;
    const base=hash(`${listing.id}|${listing.title}|${listing.surface}|${listing.price}|${family}`);
    const offset=view==='main'?0:view==='thumbnail'?1:2+hash(view)%Math.max(1,arr.length);
    return{url:arr[(base+offset)%arr.length],provider:REAL_PROVIDER,family};
  }
  function setAsset(listing,view,url,provider){
    const v=listing.visual;if(!v||!url)return;
    v.assets=v.assets||{thumbnail:null,mainImage:null,gallery:{}};v.assets.gallery=v.assets.gallery||{};
    if(view==='main')v.assets.mainImage=url;else if(view==='thumbnail')v.assets.thumbnail=url;else v.assets.gallery[view]=url;
    v.visualStatus=view==='main'?'main_ready':'gallery_partial';v.generationStage=view==='main'?'real_photo_ready':v.visualStatus;
    if(provider===REAL_PROVIDER){v.mainImageSource='real-photo';v.mainImageProvider=REAL_PROVIDER}
    if(window.HCVisualDNA&&window.HCVisualDNA.save)window.HCVisualDNA.save(listing)
  }
  function ensureRealMain(listing){
    if(!listing||!listing.visual)return null;
    const real=resolveRealPhoto(listing,'main');if(!real)return null;
    setAsset(listing,'main',real.url,REAL_PROVIDER);remember(listing.visual.visualSeed||listing.id,'main',real.url,REAL_PROVIDER);return real;
  }
  function patchDNA(){
    const d=window.HCVisualDNA;if(!d||d.__realEstatePhotosPatched||typeof d.hydrate!=='function')return false;
    const original=d.hydrate.bind(d);
    d.hydrate=function(listing,context){const v=original(listing,context);try{ensureRealMain(listing)}catch(e){}return listing?.visual||v};
    d.__realEstatePhotosPatched=true;return true
  }
  patchDNA();
  let patchTries=0;const patchTimer=setInterval(()=>{patchTries++;if(patchDNA()||patchTries>120)clearInterval(patchTimer)},25);
  async function waitForTask(taskId,{timeoutMs=180000,intervalMs=2500}={}){
    const started=Date.now();while(Date.now()-started<timeoutMs){await new Promise(r=>setTimeout(r,intervalMs));const res=await fetch(statusEndpoint()+'?taskId='+encodeURIComponent(taskId),{headers:{'Accept':'application/json'}});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data.error||('visual_status_'+res.status));const url=data.publicUrl||data.url||data.public_url||null;if(url)return{url,provider:data.provider||PROVIDER,taskId};if(data.status==='FAILED')throw new Error('visual_generation_failed')}return{pending:true,provider:PROVIDER,taskId,reason:'visual_generation_timeout'}
  }
  async function request(listing,context={},view='main'){
    if(!listing||!listing.visual)throw new Error('visual_dna_missing');
    if(view==='main'||view==='thumbnail'){
      const real=resolveRealPhoto(listing,view);if(real){setAsset(listing,view,real.url,REAL_PROVIDER);remember(listing.visual.visualSeed||listing.id,view,real.url,REAL_PROVIDER);return{url:real.url,cached:true,provider:REAL_PROVIDER,real:true,family:real.family}}
    }
    const v=listing.visual,found=getCached(v.visualSeed,view);if(found&&found.url){setAsset(listing,view,found.url,found.provider);return{url:found.url,cached:true,provider:found.provider||PROVIDER}}
    const api=endpoint();v.visualStatus='generating';v.generationStage='generating_'+view;if(window.HCVisualDNA&&window.HCVisualDNA.save)window.HCVisualDNA.save(listing);
    const prompt=(v.prompts&&v.prompts[view])||(v.prompts&&v.prompts.main)||'';
    const res=await fetch(api,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({listingId:listing.id,visualSeed:v.visualSeed,promptKey:view,promptText:prompt,view,prompt,provider:PROVIDER,city:context.city||listing.city||'',district:context.district||listing.district||'',context,visual:{archetypeLabel:v.archetypeLabel||v.archetype||'',architecture:v.architecture||'',palette:v.palette||'',decorSignature:v.decorSignature||'',floorMaterial:v.floorMaterial||'',furnitureSignature:v.furnitureSignature||'',lightSignature:v.lightSignature||'',viewSignature:v.viewSignature||view,creativeFeature:v.creativeFeature||''},metadata:{citySignature:v.citySignature,archetype:v.archetype,palette:v.palette,architecture:v.architecture,decor:v.decorSignature,imageStyle:v.imageStyle}})});
    const data=await res.json().catch(()=>({}));if(!res.ok){v.visualStatus='pending';v.generationStage='provider_wait';if(window.HCVisualDNA&&window.HCVisualDNA.save)window.HCVisualDNA.save(listing);return{pending:true,provider:PROVIDER,reason:data.error||('visual_api_'+res.status)}}
    let url=data.publicUrl||data.url||data.public_url||null;if(!url&&(data.pending||data.status==='IN_PROGRESS')){const taskId=data.jobId||data.taskId||data.id||null;if(!taskId){v.visualStatus='pending';v.generationStage='provider_wait';if(window.HCVisualDNA&&window.HCVisualDNA.save)window.HCVisualDNA.save(listing);return{pending:true,provider:data.provider||PROVIDER,reason:'visual_api_missing_task_id'}}const waited=await waitForTask(taskId);if(waited&&waited.url)url=waited.url;else{v.visualStatus='pending';v.generationStage='provider_wait';if(window.HCVisualDNA&&window.HCVisualDNA.save)window.HCVisualDNA.save(listing);return waited}}
    if(!url)return{pending:true,provider:data.provider||PROVIDER,reason:'visual_api_missing_url'};remember(v.visualSeed,view,url,data.provider||PROVIDER);setAsset(listing,view,url,data.provider||PROVIDER);return{url,cached:!!data.cached,provider:data.provider||PROVIDER}
  }
  function configure(url){if(url)localStorage.setItem(ENDPOINT_KEY,url);else localStorage.removeItem(ENDPOINT_KEY)}
  window.HCVisualService={request,waitForTask,configure,endpoint,statusEndpoint,getCached,resolveRealPhoto,ensureRealMain,provider:REAL_PROVIDER,fallbackProvider:PROVIDER};
})();

/* Chez moi — raccourci Book injecté sans toucher au gros hub historique. */
(function(){
  if(!/\/chez-moi\/?$/.test(location.pathname))return;
  const add=()=>{
    if(document.getElementById('hc-book-shortcut'))return;
    const grid=document.querySelector('.actions-grid');if(!grid)return;
    const b=document.createElement('button');b.id='hc-book-shortcut';b.className='action-card ready';
    b.innerHTML='<span class="icon">▤</span><b>Mon Book</b><small>Inspis, lieux, matières, palettes, silhouettes et pépites sauvegardées.</small>';b.onclick=()=>location.href='../book/';
    const end=document.getElementById('endDayBtn');grid.insertBefore(b,end||null);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();
})();
