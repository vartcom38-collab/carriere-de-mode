/* Haute Couture Live — client de génération d'images à la demande. */
(function(){
  const CACHE_KEY='haute-couture-visual-service-cache-v1';
  const ENDPOINT_KEY='haute-couture-visual-api-endpoint';
  function cache(){try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'{}')}catch(e){return{}}}
  function saveCache(c){try{localStorage.setItem(CACHE_KEY,JSON.stringify(c))}catch(e){}}
  function endpoint(){return localStorage.getItem(ENDPOINT_KEY)||window.HC_VISUAL_API_ENDPOINT||''}
  function key(seed,view){return seed+'|'+view}
  function getCached(seed,view){return cache()[key(seed,view)]||null}
  function remember(seed,view,url){const c=cache();c[key(seed,view)]={url,at:new Date().toISOString()};saveCache(c)}
  function setAsset(listing,view,url){const v=listing.visual;if(!v||!url)return;if(view==='main')v.assets.mainImage=url;else if(view==='thumbnail')v.assets.thumbnail=url;else v.assets.gallery[view]=url;v.visualStatus=view==='main'?'main_ready':'gallery_partial';v.generationStage=v.visualStatus;if(window.HCVisualDNA&&window.HCVisualDNA.save)window.HCVisualDNA.save(listing)}
  async function request(listing,context={},view='main'){
    if(!listing||!listing.visual)throw new Error('visual_dna_missing');
    const v=listing.visual,found=getCached(v.visualSeed,view);if(found&&found.url){setAsset(listing,view,found.url);return{url:found.url,cached:true}}
    const api=endpoint();if(!api)return{pending:true,reason:'endpoint_missing'};
    v.visualStatus='generating';v.generationStage='generating_'+view;
    if(window.HCVisualDNA&&window.HCVisualDNA.save)window.HCVisualDNA.save(listing);
    const prompt=(v.prompts&&v.prompts[view])||(v.prompts&&v.prompts.main)||'';
    const res=await fetch(api,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({listingId:listing.id,visualSeed:v.visualSeed,view,prompt,context,metadata:{citySignature:v.citySignature,archetype:v.archetype,palette:v.palette,architecture:v.architecture,decor:v.decorSignature}})});
    if(!res.ok){const t=await res.text();v.visualStatus='error';v.generationStage='error';throw new Error('visual_api_'+res.status+': '+t.slice(0,180))}
    const data=await res.json();if(!data.url)throw new Error('visual_api_missing_url');
    remember(v.visualSeed,view,data.url);setAsset(listing,view,data.url);return{url:data.url,cached:false};
  }
  function configure(url){if(url)localStorage.setItem(ENDPOINT_KEY,url);else localStorage.removeItem(ENDPOINT_KEY)}
  window.HCVisualService={request,configure,endpoint,getCached};
})();
