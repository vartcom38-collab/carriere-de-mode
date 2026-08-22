/* Haute Couture Live — client de génération d'images à la demande. */
(function(){
  const CACHE_KEY='haute-couture-visual-service-cache-v1';
  const ENDPOINT_KEY='haute-couture-visual-api-endpoint';
  const DEFAULT_ENDPOINT='https://pmsowlrsbyczjjwzuzsr.supabase.co/functions/v1/hc-generate-listing-visual';
  function cache(){try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'{}')}catch(e){return{}}}
  function saveCache(c){try{localStorage.setItem(CACHE_KEY,JSON.stringify(c))}catch(e){}}
  function endpoint(){return localStorage.getItem(ENDPOINT_KEY)||window.HC_VISUAL_API_ENDPOINT||DEFAULT_ENDPOINT}
  function key(seed,view){return seed+'|'+view}
  function getCached(seed,view){return cache()[key(seed,view)]||null}
  function remember(seed,view,url){const c=cache();c[key(seed,view)]={url,at:new Date().toISOString()};saveCache(c)}
  function setAsset(listing,view,url){const v=listing.visual;if(!v||!url)return;if(view==='main')v.assets.mainImage=url;else if(view==='thumbnail')v.assets.thumbnail=url;else v.assets.gallery[view]=url;v.visualStatus=view==='main'?'main_ready':'gallery_partial';v.generationStage=v.visualStatus;if(window.HCVisualDNA&&window.HCVisualDNA.save)window.HCVisualDNA.save(listing)}
  async function request(listing,context={},view='main'){
    if(!listing||!listing.visual)throw new Error('visual_dna_missing');
    const v=listing.visual,found=getCached(v.visualSeed,view);if(found&&found.url){setAsset(listing,view,found.url);return{url:found.url,cached:true}}
    const api=endpoint();
    v.visualStatus='generating';v.generationStage='generating_'+view;
    if(window.HCVisualDNA&&window.HCVisualDNA.save)window.HCVisualDNA.save(listing);
    const prompt=(v.prompts&&v.prompts[view])||(v.prompts&&v.prompts.main)||'';
    const res=await fetch(api,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      listingId:listing.id,
      visualSeed:v.visualSeed,
      promptKey:view,
      promptText:prompt,
      city:context.city||'',
      district:context.district||''
    })});
    const data=await res.json().catch(()=>({}));
    if(!res.ok){v.visualStatus='error';v.generationStage='error';throw new Error(data.error||('visual_api_'+res.status))}
    const url=data.publicUrl||data.url;
    if(!url)throw new Error('visual_api_missing_url');
    remember(v.visualSeed,view,url);setAsset(listing,view,url);return{url,cached:!!data.cached};
  }
  function configure(url){if(url)localStorage.setItem(ENDPOINT_KEY,url);else localStorage.removeItem(ENDPOINT_KEY)}
  window.HCVisualService={request,configure,endpoint,getCached};
})();
