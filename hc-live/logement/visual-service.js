/* Haute Couture Live — client de génération d'images à la demande V2. */
(function(){
'use strict';
const CACHE_KEY='haute-couture-visual-service-cache-v2';
const PENDING_KEY='haute-couture-visual-service-pending-v2';
const ENDPOINT_KEY='haute-couture-visual-api-endpoint';
const LEGACY_ENDPOINT='https://pmsowlrsbyczjjwzuzsr.supabase.co/functions/v1/hc-generate-listing-visual';
const DEFAULT_ENDPOINT='https://carriere-de-mode-visuals-vartcom38-7358s-projects.vercel.app/api/generate-listing-visual';
const PROVIDER='magnific';
const RETRY_MS=45000;
function readJson(k,f={}){try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch(e){return f}}
function writeJson(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function cache(){return readJson(CACHE_KEY,{})}
function pending(){return readJson(PENDING_KEY,{})}
function endpoint(){const stored=localStorage.getItem(ENDPOINT_KEY);if(stored===LEGACY_ENDPOINT){localStorage.removeItem(ENDPOINT_KEY);return window.HC_VISUAL_API_ENDPOINT||DEFAULT_ENDPOINT}return stored||window.HC_VISUAL_API_ENDPOINT||DEFAULT_ENDPOINT}
function key(seed,view){return seed+'|'+view}
function getCached(seed,view){return cache()[key(seed,view)]||null}
function remember(seed,view,url){const c=cache();c[key(seed,view)]={url,at:new Date().toISOString(),provider:PROVIDER};writeJson(CACHE_KEY,c)}
function rememberPending(seed,view,data={}){const p=pending();p[key(seed,view)]={at:Date.now(),jobId:data.jobId||data.taskId||data.id||null};writeJson(PENDING_KEY,p)}
function clearPending(seed,view){const p=pending();delete p[key(seed,view)];writeJson(PENDING_KEY,p)}
function isCoolingDown(seed,view){const p=pending()[key(seed,view)];return !!(p&&Date.now()-Number(p.at||0)<RETRY_MS)}
function setAsset(listing,view,url){const v=listing.visual;if(!v||!url)return;if(view==='main')v.assets.mainImage=url;else if(view==='thumbnail')v.assets.thumbnail=url;else v.assets.gallery[view]=url;v.visualStatus=view==='main'?'main_ready':'gallery_partial';v.generationStage=v.visualStatus;window.HCVisualDNA?.save?.(listing)}
async function request(listing,context={},view='main'){
 if(!listing||!listing.visual)throw new Error('visual_dna_missing');
 const v=listing.visual,found=getCached(v.visualSeed,view);if(found?.url){setAsset(listing,view,found.url);return{url:found.url,cached:true,provider:found.provider||PROVIDER}}
 if(isCoolingDown(v.visualSeed,view))return{pending:true,provider:PROVIDER,reason:'provider_cooldown'};
 const prompt=(v.prompts&&v.prompts[view])||(v.prompts&&v.prompts.main)||'';
 const referenceImageUrl=view==='main'?null:(v.assets?.mainImage||getCached(v.visualSeed,'main')?.url||null);
 v.visualStatus='generating';v.generationStage='generating_'+view;window.HCVisualDNA?.save?.(listing);
 const body={
  listingId:listing.id,visualSeed:v.visualSeed,promptKey:view,promptText:prompt,view,prompt,provider:PROVIDER,
  city:context.city||listing.city||'',district:context.district||listing.district||'',context,
  referenceImageUrl,reference_image_url:referenceImageUrl,referenceMode:referenceImageUrl?'preserve-property-identity':'none',
  propertyFingerprint:v.propertyFingerprint||listing.propertyDNA?.signature||String(listing.id),
  visual:{archetypeLabel:v.archetypeLabel||'',architecture:v.architecture||'',palette:v.palette||'',floorMaterial:v.floorMaterial||'',wallSignature:v.wallSignature||'',windowSignature:v.windowSignature||'',kitchenSignature:v.kitchenSignature||'',bathroomSignature:v.bathroomSignature||'',furnitureSignature:v.furnitureSignature||'',lightSignature:v.lightSignature||'',viewSignature:v.viewSignature||view,signatureFeature:v.signatureFeature||'',layoutSignature:v.layoutSignature||'',creativeFeature:v.creativeFeature||''},
  metadata:{citySignature:v.citySignature,propertyFingerprint:v.propertyFingerprint,imageStyle:v.imageStyle,referenceRequired:view!=='main'}
 };
 const res=await fetch(endpoint(),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 const data=await res.json().catch(()=>({}));
 if(!res.ok){v.visualStatus='pending';v.generationStage='provider_wait';rememberPending(v.visualSeed,view,data);window.HCVisualDNA?.save?.(listing);return{pending:true,provider:PROVIDER,reason:data.error||('visual_api_'+res.status)}}
 const url=data.publicUrl||data.url||data.public_url||null;
 if((data.pending||data.status==='IN_PROGRESS')&&!url){v.visualStatus='pending';v.generationStage='provider_wait';rememberPending(v.visualSeed,view,data);window.HCVisualDNA?.save?.(listing);return{pending:true,provider:data.provider||PROVIDER,jobId:data.jobId||data.taskId||data.id||null}}
 if(!url){rememberPending(v.visualSeed,view,data);return{pending:true,provider:data.provider||PROVIDER,reason:'visual_api_missing_url'}}
 clearPending(v.visualSeed,view);remember(v.visualSeed,view,url);setAsset(listing,view,url);return{url,cached:!!data.cached,provider:data.provider||PROVIDER,referenceUsed:!!referenceImageUrl};
}
function configure(url){if(url)localStorage.setItem(ENDPOINT_KEY,url);else localStorage.removeItem(ENDPOINT_KEY)}
window.HCVisualService={version:2,request,configure,endpoint,getCached,provider:PROVIDER};
})();