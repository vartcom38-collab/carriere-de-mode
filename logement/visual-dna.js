/* Haute Couture Live — ADN visuel logement public. */
(function(){
  const VERSION='1.1';
  const CACHE_KEY='haute-couture-listing-visuals-v1';
  function hash(s){let x=2166136261;for(const c of String(s)){x^=c.charCodeAt(0);x=Math.imul(x,16777619)}return x>>>0}
  function read(){try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'{}')}catch(e){return{}}}
  function write(v){try{localStorage.setItem(CACHE_KEY,JSON.stringify(v))}catch(e){}}
  function cityDNA(city,region){
    const c=String(city||'').toLowerCase();
    if(c.includes('nîmes')||c.includes('nimes'))return{architecture:'murs clairs, détails anciens du Sud, grandes ouvertures',palette:'crème, rose poudré, terracotta douce, vert sauge, bois chaud',decor:'mode française solaire et raffinée',light:'lumière naturelle chaude du Sud',view:'rue nîmoise ou balcon lumineux'};
    if(c.includes('paris'))return{architecture:'moulures discrètes, parquet ancien, hautes fenêtres',palette:'crème, rose poudré, noir doux, bois miel',decor:'mode parisienne chic et compacte',light:'lumière diffuse de grande fenêtre',view:'toits parisiens ou cour élégante'};
    if(c.includes('lyon'))return{architecture:'parquet chaud, pierre ancienne, hautes fenêtres',palette:'beige chaud, terracotta, olive, bois miel',decor:'créatif chaleureux et élégant',light:'lumière chaude latérale',view:'cour lyonnaise ou rue ancienne'};
    if(c.includes('marseille')||c.includes('nice')||c.includes('fréjus')||c.includes('frejus'))return{architecture:'murs clairs, ouvertures lumineuses, détails méditerranéens',palette:'sable, crème, rose pêche, vert olive clair, bleu grisé',decor:'Riviera créative et raffinée',light:'soleil méditerranéen filtré',view:'balcon lumineux ou rue du Sud'};
    return{architecture:'appartement français avec détails anciens simplifiés',palette:'crème, rose poudré, sauge grisée, bois chaud',decor:'lifestyle mode français raffiné',light:'lumière naturelle douce et chaude',view:'rue française ou cour claire'};
  }
  function buildPrompts(listing,v,context={}){
    const city=context.city||listing.city||'France';
    const facts=`Location: ${city}. Housing type: ${listing.title||'apartment'}. Surface: ${listing.surface||25} m². Rooms: ${listing.rooms||1}. Floor: ${listing.floor===0?'ground floor':(listing.floor||1)+' floor'}. ${listing.balcony?'Private balcony.':'No balcony.'} ${listing.furnished?'Furnished.':'Unfurnished.'}`;
    const style='Premium fashion-career game apartment illustration in the exact same visual universe as elegant stylized female character cards. Clean confident outlines, simplified elegant shapes, controlled volumes, smooth shading, refined warm pastel colors, chic French lifestyle mood, polished visual-novel/mobile fashion game finish. A character from the game should be able to stand in this room with no visual rupture. No photorealism, no realistic 3D render, no painterly concept art, no watercolor, no messy brush texture, no text, no logo, no UI.';
    const identity=`Apartment identity: ${v.archetypeLabel}; architecture: ${v.architecture}; palette: ${v.palette}; decor: ${v.decorSignature}; floor: ${v.floorMaterial}; furniture: ${v.furnitureSignature}; light: ${v.lightSignature}; view: ${v.viewSignature}; creative feature: ${v.creativeFeature}.`;
    const continuity=`Keep exactly the same apartment identity, furniture family, palette and level of finish as seed ${v.visualSeed}.`;
    return{
      main:`${style} ${facts} ${identity} Main living-space view, believable proportions for the real surface and price, three-quarter human-height camera, elegant but lived-in, subtle fashion touches such as clothing rack, magazines, sewing or styling accessories only when plausible.`,
      kitchen:`${style} ${facts} ${identity} ${continuity} Secondary view centered on the kitchen or kitchenette, compact and believable.`,
      bathroom:`${style} ${facts} ${identity} ${continuity} Secondary view of the bathroom, coherent with the apartment's age and budget.`,
      window:`${style} ${facts} ${identity} ${continuity} Secondary view toward ${listing.balcony?'the balcony and ':''}${v.viewSignature}.`,
      creative:`${style} ${facts} ${identity} ${continuity} Secondary view of storage or the fashion-work corner. Show honestly: ${v.creativeFeature}.`,
      thumbnail:`${style} ${facts} ${identity} Clear readable listing thumbnail of the main room.`
    };
  }
  function build(listing,context={}){
    if(listing.visual&&listing.visual.version===VERSION)return listing.visual;
    const city=context.city||listing.city||'',region=context.region||listing.region||'',sig=cityDNA(city,region);
    const seed=`${city}|${listing.id}|${listing.title}|${listing.surface}|${listing.floor}|${listing.price}`;
    const surface=Number(listing.surface)||25;
    const atelierScore=Math.max(1,Math.min(5,Math.round((surface-14)/8)+(/atelier|loft/i.test(listing.title||'')?2:0)));
    const v={
      version:VERSION,
      visualSeed:`${(city||'france').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-')}-${hash(seed).toString(36)}`,
      visualStatus:'pending',generationStage:'metadata_ready',citySignature:(city||region||'france').toLowerCase(),
      archetype:/atelier/i.test(listing.title||'')?'ground-workshop':/loft/i.test(listing.title||'')?'small-loft':surface<24?'bright-studio':surface<38?'creative-t1':'cosy-t2',
      archetypeLabel:/atelier/i.test(listing.title||'')?'Rez-de-chaussée atelier':/loft/i.test(listing.title||'')?'Petit loft':surface<24?'Studio lumineux':surface<38?'T1 créatif':'T2 cosy',
      architecture:sig.architecture,palette:sig.palette,decorSignature:sig.decor,
      floorMaterial:/ancien/i.test((listing.tags||[]).join(' '))?'parquet ancien':'parquet miel',
      furnitureSignature:'mobilier élégant aux lignes simples, quelques pièces mode choisies',
      lightSignature:sig.light,viewSignature:listing.balcony?'balcon privé, '+sig.view:sig.view,
      creativeFeature:atelierScore>=4?'vrai coin couture avec table de travail':atelierScore>=3?'coin couture compact intégré':'petit espace créatif transformable',
      imageStyle:'premium fashion-game visual novel, clean linework, refined pastel palette, smooth illustrated shading, same universe as character cards',
      assets:{thumbnail:null,mainImage:null,gallery:{kitchen:null,bathroom:null,window:null,creative:null}},prompts:null
    };
    v.prompts=buildPrompts(listing,v,context);listing.visual=v;return v;
  }
  function hydrate(listing,context={}){const v=build(listing,context),saved=read()[v.visualSeed];if(saved){v.visualStatus=saved.visualStatus||v.visualStatus;v.generationStage=saved.generationStage||v.generationStage;v.assets={...v.assets,...(saved.assets||{}),gallery:{...v.assets.gallery,...((saved.assets&&saved.assets.gallery)||{})}}}return v}
  function save(listing){if(!listing||!listing.visual)return;const c=read(),v=listing.visual;c[v.visualSeed]={visualStatus:v.visualStatus,generationStage:v.generationStage,assets:v.assets,updatedAt:new Date().toISOString()};write(c)}
  window.HCVisualDNA={version:VERSION,build,hydrate,save,buildPrompts};
})();
