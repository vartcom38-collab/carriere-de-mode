/* Haute Couture Live — client de génération d'images à la demande. */
(function(){
  const CACHE_KEY='haute-couture-visual-service-cache-v1';
  const ENDPOINT_KEY='haute-couture-visual-api-endpoint';
  const LEGACY_ENDPOINT='https://pmsowlrsbyczjjwzuzsr.supabase.co/functions/v1/hc-generate-listing-visual';
  const DEFAULT_ENDPOINT='https://carriere-de-mode-visuals-vartcom38-7358s-projects.vercel.app/api/generate-listing-visual';
  const DEFAULT_STATUS_ENDPOINT='https://carriere-de-mode-visuals-vartcom38-7358s-projects.vercel.app/api/check-listing-visual';
  const PROVIDER='magnific';
  function cache(){try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'{}')}catch(e){return{}}}
  function saveCache(c){try{localStorage.setItem(CACHE_KEY,JSON.stringify(c))}catch(e){}}
  function endpoint(){
    const stored=localStorage.getItem(ENDPOINT_KEY);
    if(stored===LEGACY_ENDPOINT){localStorage.removeItem(ENDPOINT_KEY);return window.HC_VISUAL_API_ENDPOINT||DEFAULT_ENDPOINT}
    return stored||window.HC_VISUAL_API_ENDPOINT||DEFAULT_ENDPOINT;
  }
  function statusEndpoint(){return window.HC_VISUAL_STATUS_ENDPOINT||DEFAULT_STATUS_ENDPOINT}
  function key(seed,view){return seed+'|'+view}
  function getCached(seed,view){return cache()[key(seed,view)]||null}
  function remember(seed,view,url){const c=cache();c[key(seed,view)]={url,at:new Date().toISOString(),provider:PROVIDER};saveCache(c)}
  function setAsset(listing,view,url){const v=listing.visual;if(!v||!url)return;if(view==='main')v.assets.mainImage=url;else if(view==='thumbnail')v.assets.thumbnail=url;else v.assets.gallery[view]=url;v.visualStatus=view==='main'?'main_ready':'gallery_partial';v.generationStage=v.visualStatus;if(window.HCVisualDNA&&window.HCVisualDNA.save)window.HCVisualDNA.save(listing)}
  async function waitForTask(taskId,{timeoutMs=180000,intervalMs=2500}={}){
    const started=Date.now();
    while(Date.now()-started<timeoutMs){
      await new Promise(r=>setTimeout(r,intervalMs));
      const res=await fetch(statusEndpoint()+'?taskId='+encodeURIComponent(taskId),{headers:{'Accept':'application/json'}});
      const data=await res.json().catch(()=>({}));
      if(!res.ok)throw new Error(data.error||('visual_status_'+res.status));
      const url=data.publicUrl||data.url||data.public_url||null;
      if(url)return{url,provider:data.provider||PROVIDER,taskId};
      if(data.status==='FAILED')throw new Error('visual_generation_failed');
    }
    return{pending:true,provider:PROVIDER,taskId,reason:'visual_generation_timeout'};
  }
  async function request(listing,context={},view='main'){
    if(!listing||!listing.visual)throw new Error('visual_dna_missing');
    const v=listing.visual,found=getCached(v.visualSeed,view);if(found&&found.url){setAsset(listing,view,found.url);return{url:found.url,cached:true,provider:found.provider||PROVIDER}}
    const api=endpoint();
    v.visualStatus='generating';v.generationStage='generating_'+view;
    if(window.HCVisualDNA&&window.HCVisualDNA.save)window.HCVisualDNA.save(listing);
    const prompt=(v.prompts&&v.prompts[view])||(v.prompts&&v.prompts.main)||'';
    const res=await fetch(api,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      listingId:listing.id,
      visualSeed:v.visualSeed,
      promptKey:view,
      promptText:prompt,
      view,
      prompt,
      provider:PROVIDER,
      city:context.city||listing.city||'',
      district:context.district||listing.district||'',
      context,
      visual:{
        archetypeLabel:v.archetypeLabel||v.archetype||'',
        architecture:v.architecture||'',
        palette:v.palette||'',
        decorSignature:v.decorSignature||'',
        floorMaterial:v.floorMaterial||'',
        furnitureSignature:v.furnitureSignature||'',
        lightSignature:v.lightSignature||'',
        viewSignature:v.viewSignature||view,
        creativeFeature:v.creativeFeature||''
      },
      metadata:{citySignature:v.citySignature,archetype:v.archetype,palette:v.palette,architecture:v.architecture,decor:v.decorSignature,imageStyle:v.imageStyle}
    })});
    const data=await res.json().catch(()=>({}));
    if(!res.ok){v.visualStatus='pending';v.generationStage='provider_wait';if(window.HCVisualDNA&&window.HCVisualDNA.save)window.HCVisualDNA.save(listing);return{pending:true,provider:PROVIDER,reason:data.error||('visual_api_'+res.status)}}
    let url=data.publicUrl||data.url||data.public_url||null;
    if(!url&&(data.pending||data.status==='IN_PROGRESS')){
      const taskId=data.jobId||data.taskId||data.id||null;
      if(!taskId){v.visualStatus='pending';v.generationStage='provider_wait';if(window.HCVisualDNA&&window.HCVisualDNA.save)window.HCVisualDNA.save(listing);return{pending:true,provider:data.provider||PROVIDER,reason:'visual_api_missing_task_id'}}
      const waited=await waitForTask(taskId);
      if(waited&&waited.url)url=waited.url;
      else{v.visualStatus='pending';v.generationStage='provider_wait';if(window.HCVisualDNA&&window.HCVisualDNA.save)window.HCVisualDNA.save(listing);return waited}
    }
    if(!url)return{pending:true,provider:data.provider||PROVIDER,reason:'visual_api_missing_url'};
    remember(v.visualSeed,view,url);setAsset(listing,view,url);return{url,cached:!!data.cached,provider:data.provider||PROVIDER};
  }
  function configure(url){if(url)localStorage.setItem(ENDPOINT_KEY,url);else localStorage.removeItem(ENDPOINT_KEY)}
  window.HCVisualService={request,waitForTask,configure,endpoint,statusEndpoint,getCached,provider:PROVIDER};
})();
