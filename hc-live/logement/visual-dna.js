/* Haute Couture Live — ADN visuel logement V2 : un bien = une identité visuelle unique. */
(function(){
'use strict';
const VERSION='2.0';
const CACHE_KEY='haute-couture-listing-visuals-v2';
function hash(s){let x=2166136261;for(const c of String(s)){x^=c.charCodeAt(0);x=Math.imul(x,16777619)}return x>>>0}
function rng(seed){return function(){let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function read(){try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'{}')}catch(e){return{}}}
function write(v){try{localStorage.setItem(CACHE_KEY,JSON.stringify(v))}catch(e){}}
function pick(a,r){return a[Math.floor(r()*a.length)]}
function cityDNA(city){
  const c=String(city||'').toLowerCase();
  if(c.includes('nîmes')||c.includes('nimes'))return{architecture:['murs clairs et détails anciens du Sud','immeuble nîmois ancien aux proportions simples','appartement méridional rénové sans luxe ostentatoire'],palette:['crème, terracotta douce, sauge','ivoire, bois miel, rose argile','sable, vert olive pâle, bois chaud'],decor:['solaire et raffiné','ancien du Sud remis au goût du jour','créatif méditerranéen discret'],view:['rue nîmoise claire','cour ancienne lumineuse','toits et façades claires de Nîmes']};
  if(c.includes('paris'))return{architecture:['moulures discrètes et parquet ancien','petit appartement haussmannien simplifié','immeuble parisien ancien avec hautes fenêtres'],palette:['crème, noir doux, bois miel','ivoire, vieux rose, chêne','beige pierre, brun chaud, vert grisé'],decor:['parisien chic compact','ancien élégant mais vécu','éditorial discret'],view:['toits parisiens','cour intérieure claire','façades parisiennes']};
  if(c.includes('lyon'))return{architecture:['pierre ancienne et hautes fenêtres','appartement lyonnais aux volumes chaleureux','ancien rénové avec parquet'],palette:['beige chaud, olive, bois miel','ivoire, terracotta, chêne','sable, brun doux, vert grisé'],decor:['lyonnais créatif et chaleureux','ancien sobre','contemporain doux dans une enveloppe ancienne'],view:['cour lyonnaise','rue ancienne','toits urbains']};
  if(c.includes('marseille')||c.includes('nice')||c.includes('fréjus')||c.includes('frejus'))return{architecture:['murs clairs et ouvertures méditerranéennes','ancien du Sud rénové','appartement lumineux aux proportions simples'],palette:['sable, pêche, olive clair','crème, bleu grisé, bois clair','ivoire, rose chaud, vert pâle'],decor:['Riviera créative','méditerranéen épuré','solaire et élégant'],view:['balcon lumineux','rue du Sud','façades claires et ciel ouvert']};
  return{architecture:['appartement français ancien simplifié','petit immeuble urbain rénové','logement contemporain chaleureux','ancien avec détails conservés'],palette:['crème, sauge grisée, bois chaud','ivoire, rose poudré, chêne','sable, terracotta pâle, vert doux','beige pierre, bois blond, brun rosé'],decor:['lifestyle mode français raffiné','créatif mais crédible','chaleureux et vécu','élégant sans luxe excessif'],view:['rue française','cour claire','toits urbains','façades de quartier']};
}
function buildPrompts(listing,v,context={}){
  const city=context.city||listing.city||'France';
  const facts=`Location: ${city}. Unique property ID: ${listing.id}. Housing type: ${listing.title||'apartment'}. Surface: ${listing.surface||25} m². Rooms: ${listing.rooms||1}. Floor: ${listing.floor===0?'ground floor':(listing.floor||1)+' floor'}. ${listing.balcony?'Private balcony.':'No balcony.'} ${listing.furnished?'Furnished.':'Unfurnished.'}`;
  const style='Editorial-quality realistic interior photograph for a premium French fashion-career game. Natural daylight, believable lived-in proportions, warm tasteful styling, aspirational but attainable, no luxury-showroom perfection, no people, no text, no logo, no UI, no fisheye, no impossible architecture.';
  const identity=`This exact apartment identity must remain consistent across every view. Architecture: ${v.architecture}. Palette: ${v.palette}. Decor: ${v.decorSignature}. Floor: ${v.floorMaterial}. Furniture family: ${v.furnitureSignature}. Light: ${v.lightSignature}. View: ${v.viewSignature}. Signature feature: ${v.signatureFeature}. Layout: ${v.layoutSignature}.`;
  const uniqueness=`This is a one-off nationally unique French property. Do not reuse a generic room layout or furniture arrangement. Preserve property fingerprint ${v.propertyFingerprint}.`;
  const continuity=`Keep exactly the same walls, floor, windows, cabinetry, furniture family, palette, age, level of finish and spatial logic as visual seed ${v.visualSeed}.`;
  return{
    main:`${style} ${facts} ${identity} ${uniqueness} Main living-space listing photo, three-quarter human-height camera, immediately inviting and believable. Show why someone would want to live here.`,
    kitchen:`${style} ${facts} ${identity} ${uniqueness} ${continuity} Secondary photo centered on the kitchen or kitchenette. It must clearly belong to the same apartment.`,
    bathroom:`${style} ${facts} ${identity} ${uniqueness} ${continuity} Secondary photo of the bathroom, coherent with the exact same apartment age, budget and materials.`,
    window:`${style} ${facts} ${identity} ${uniqueness} ${continuity} Secondary photo toward ${listing.balcony?'the balcony and ':''}${v.viewSignature}.`,
    creative:`${style} ${facts} ${identity} ${uniqueness} ${continuity} Secondary photo of storage or the fashion-work corner. Show honestly: ${v.creativeFeature}.`,
    thumbnail:`${style} ${facts} ${identity} ${uniqueness} Clear inviting listing thumbnail of the main room.`
  };
}
function build(listing,context={}){
  if(listing.visual&&listing.visual.version===VERSION)return listing.visual;
  const city=context.city||listing.city||'',region=context.region||listing.region||'',base=cityDNA(city);
  const property=listing.propertyDNA||{};
  const seedText=`FR|${listing.id}|${city}|${listing.title}|${listing.surface}|${listing.floor}|${listing.price}|${property.signature||''}`;
  const seed=hash(seedText),r=rng(seed),surface=Number(listing.surface)||25;
  const architecture=property.architecture||pick(base.architecture,r),palette=(property.palette||pick(base.palette,r)),decor=property.mood||pick(base.decor,r);
  const floors=[property.material,'parquet ancien','parquet miel','tomettes','béton ciré clair','bois blond'].filter(Boolean);
  const furniture=['mobilier vintage léger + table simple','mobilier contemporain doux + quelques pièces chinées','meubles simples en bois + touches mode','mélange compact de rangement sur mesure et mobilier léger'];
  const atelierScore=Math.max(1,Math.min(5,Math.round((surface-14)/8)+(/atelier|loft/i.test(listing.title||'')?2:0)));
  const v={version:VERSION,visualSeed:`${(city||'france').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-')}-${hash(seedText).toString(36)}`,visualStatus:'pending',generationStage:'metadata_ready',citySignature:(city||region||'france').toLowerCase(),propertyFingerprint:property.signature||hash(seedText+'fingerprint').toString(36),archetype:/atelier/i.test(listing.title||'')?'ground-workshop':/loft/i.test(listing.title||'')?'small-loft':surface<24?'bright-studio':surface<38?'creative-t1':'cosy-t2',archetypeLabel:listing.title||'Appartement',architecture,palette,decorSignature:decor,floorMaterial:pick(floors,r),furnitureSignature:pick(furniture,r),lightSignature:property.light||pick(['lumière chaude latérale','lumière traversante','lumière douce du matin','soleil de fin de journée','grande fenêtre avec lumière diffuse'],r),viewSignature:listing.balcony?`balcon privé, ${pick(base.view,r)}`:pick(base.view,r),signatureFeature:property.feature||pick(['alcôve','grande fenêtre','niche murale','mur clair texturé','coin repas près de la fenêtre','poutres discrètes','hauteur sous plafond'],r),layoutSignature:property.layout||((listing.rooms||1)>=2?'séjour distinct + pièce séparée':'pièce principale ouverte'),creativeFeature:atelierScore>=4?'vrai coin couture avec table de travail':atelierScore>=3?'coin couture compact intégré':'petit espace créatif transformable',imageStyle:'realistic editorial French rental photography, warm aspirational lived-in mood',assets:{thumbnail:null,mainImage:null,gallery:{kitchen:null,bathroom:null,window:null,creative:null}},prompts:null};
  v.prompts=buildPrompts(listing,v,context);listing.visual=v;return v;
}
function hydrate(listing,context={}){const v=build(listing,context),saved=read()[v.visualSeed];if(saved){v.visualStatus=saved.visualStatus||v.visualStatus;v.generationStage=saved.generationStage||v.generationStage;v.assets={...v.assets,...(saved.assets||{}),gallery:{...v.assets.gallery,...((saved.assets&&saved.assets.gallery)||{})}}}return v}
function save(listing){if(!listing||!listing.visual)return;const c=read(),v=listing.visual;c[v.visualSeed]={visualStatus:v.visualStatus,generationStage:v.generationStage,assets:v.assets,propertyFingerprint:v.propertyFingerprint,updatedAt:new Date().toISOString()};write(c)}
window.HCVisualDNA={version:VERSION,build,hydrate,save,buildPrompts};
})();