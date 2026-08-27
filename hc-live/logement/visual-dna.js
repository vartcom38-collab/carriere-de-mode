/* Haute Couture Live — ADN visuel logement V3 : un bien = une identité photo unique. */
(function(){
'use strict';
const VERSION='3.0';
const CACHE_KEY='haute-couture-listing-visuals-v3';
function hash(s){let x=2166136261;for(const c of String(s)){x^=c.charCodeAt(0);x=Math.imul(x,16777619)}return x>>>0}
function rng(seed){return function(){let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function read(){try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'{}')}catch(e){return{}}}
function write(v){try{localStorage.setItem(CACHE_KEY,JSON.stringify(v))}catch(e){}}
function pick(a,r){return a[Math.floor(r()*a.length)]}
function cityDNA(city){
 const c=String(city||'').toLowerCase();
 if(c.includes('nîmes')||c.includes('nimes'))return{architecture:['immeuble nîmois ancien, murs clairs et encadrements simples','appartement méridional ancien rénové avec détails conservés','petit immeuble du centre de Nîmes aux proportions modestes'],palette:['crème, terracotta douce, sauge','ivoire, bois miel, rose argile','sable, olive pâle, bois chaud'],view:['rue nîmoise claire','cour ancienne lumineuse','toits et façades claires de Nîmes']};
 if(c.includes('paris'))return{architecture:['petit appartement haussmannien avec moulures discrètes et parquet','immeuble parisien ancien, hautes fenêtres et proportions compactes','ancien parisien rénové sans luxe excessif'],palette:['crème, noir doux, bois miel','ivoire, vieux rose, chêne','beige pierre, brun chaud, vert grisé'],view:['toits parisiens','cour intérieure claire','façades parisiennes']};
 return{architecture:['appartement français ancien rénové','petit immeuble urbain avec détails conservés','logement contemporain chaleureux dans une enveloppe simple','ancien sobre avec caractère'],palette:['crème, sauge grisée, bois chaud','ivoire, rose poudré, chêne','sable, terracotta pâle, vert doux','beige pierre, bois blond, brun rosé'],view:['rue française','cour claire','toits urbains','façades de quartier']};
}
function buildPrompts(listing,v,context={}){
 const city=context.city||listing.city||'France';
 const facts=`Location: ${city}. Unique property ID: ${listing.id}. Housing type: ${listing.title||'apartment'}. Surface: ${listing.surface||25} m². Rooms: ${listing.rooms||1}. Floor: ${listing.floor===0?'ground floor':(listing.floor||1)+' floor'}. ${listing.balcony?'Private balcony.':'No balcony.'} ${listing.furnished?'Furnished.':'Unfurnished.'}`;
 const style='Photorealistic French rental listing photography, editorial but believable. Natural daylight, attractive and warm without looking staged like a luxury hotel. Correct proportions for the stated surface and budget. Realistic lens around 28–35mm, eye-level camera, no people, no text, no logo, no UI, no fisheye, no impossible geometry, no duplicated furniture, no showroom perfection.';
 const identity=`EXACT PROPERTY IDENTITY: architecture=${v.architecture}; wall treatment=${v.wallSignature}; floor=${v.floorMaterial}; windows=${v.windowSignature}; kitchen=${v.kitchenSignature}; bathroom=${v.bathroomSignature}; furniture=${v.furnitureSignature}; palette=${v.palette}; lighting=${v.lightSignature}; signature feature=${v.signatureFeature}; layout=${v.layoutSignature}; view=${v.viewSignature}.`;
 const uniqueness=`This is a nationally unique property with fingerprint ${v.propertyFingerprint}. The room geometry, window placement, floor, wall treatment, cabinetry and furniture arrangement must not be recycled from another listing.`;
 const continuity=`For all secondary views, preserve the exact same apartment shell, materials, windows, cabinetry, furniture family and spatial logic as the main reference image. Do not redesign the apartment between views.`;
 return{
  main:`${style} ${facts} ${identity} ${uniqueness} Main living-space listing photo. Make the home immediately desirable to live in while remaining credible and attainable.`,
  kitchen:`${style} ${facts} ${identity} ${uniqueness} ${continuity} Show the kitchen or kitchenette from a plausible connected angle. It must unmistakably be the same apartment as the main image.`,
  bathroom:`${style} ${facts} ${identity} ${uniqueness} ${continuity} Show the bathroom with exactly the same age, renovation level and material language as the main image.`,
  window:`${style} ${facts} ${identity} ${uniqueness} ${continuity} Show the window side and ${listing.balcony?'the same private balcony with ':''}${v.viewSignature}.`,
  creative:`${style} ${facts} ${identity} ${uniqueness} ${continuity} Show the storage or fashion-work corner without changing the room. ${v.creativeFeature}.`,
  thumbnail:`${style} ${facts} ${identity} ${uniqueness} Inviting main-room listing thumbnail.`
 };
}
function build(listing,context={}){
 if(listing.visual&&listing.visual.version===VERSION)return listing.visual;
 const city=context.city||listing.city||'',region=context.region||listing.region||'',base=cityDNA(city),property=listing.propertyDNA||{};
 const seedText=`PHOTO-V3|FR|${listing.id}|${city}|${listing.title}|${listing.surface}|${listing.floor}|${listing.price}|${property.signature||''}`;
 const r=rng(hash(seedText)),surface=Number(listing.surface)||25;
 const architecture=property.architecture||pick(base.architecture,r),palette=property.palette||pick(base.palette,r);
 const floorMaterial=property.material||pick(['parquet ancien','parquet miel','tomettes','béton ciré clair','carrelage minéral mat','bois blond'],r);
 const wallSignature=pick(['murs ivoire légèrement texturés','murs blancs cassés avec un pan plus chaud','murs crème mat avec traces d’ancien discrètes','murs sable clair très sobres'],r);
 const windowSignature=pick(['deux hautes fenêtres bois peint','une grande fenêtre simple à deux vantaux','fenêtre large avec radiateur bas','ouverture verticale ancienne avec volets intérieurs'],r);
 const kitchenSignature=pick(['kitchenette ivoire avec plan bois','petite cuisine blanche mate avec crédence minérale','cuisine compacte bois clair et façades crème','coin cuisine ancien rénové avec étagères ouvertes'],r);
 const bathroomSignature=pick(['petite salle d’eau carrelage crème mat','salle d’eau blanche avec détails laiton discret','douche compacte, faïence ivoire et meuble bois','salle d’eau simple, carreaux minéraux clairs'],r);
 const furnitureSignature=pick(['canapé compact texturé + table ronde + meuble bas bois','banquette claire + table vintage + étagère fine','petit canapé écru + table basse bois + portant mode discret','fauteuil vintage + canapé compact + table repas légère'],r);
 const atelierScore=Math.max(1,Math.min(5,Math.round((surface-14)/8)+(/atelier|loft/i.test(listing.title||'')?2:0)));
 const v={version:VERSION,visualSeed:`photo-v3-${(city||'france').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-')}-${hash(seedText).toString(36)}`,visualStatus:'pending',generationStage:'metadata_ready',citySignature:(city||region||'france').toLowerCase(),propertyFingerprint:property.signature||hash(seedText+'fingerprint').toString(36),archetypeLabel:listing.title||'Appartement',architecture,palette,floorMaterial,wallSignature,windowSignature,kitchenSignature,bathroomSignature,furnitureSignature,lightSignature:property.light||pick(['lumière chaude latérale','lumière traversante','lumière douce du matin','soleil de fin de journée','grande fenêtre avec lumière diffuse'],r),viewSignature:listing.balcony?`balcon privé, ${pick(base.view,r)}`:pick(base.view,r),signatureFeature:property.feature||pick(['alcôve','grande fenêtre','niche murale','coin repas près de la fenêtre','poutres discrètes','hauteur sous plafond'],r),layoutSignature:property.layout||((listing.rooms||1)>=2?'séjour distinct + pièce séparée':'pièce principale ouverte'),creativeFeature:atelierScore>=4?'vrai coin couture avec table de travail':atelierScore>=3?'coin couture compact intégré':'petit espace créatif transformable',imageStyle:'photorealistic editorial French rental photography',assets:{thumbnail:null,mainImage:null,gallery:{kitchen:null,bathroom:null,window:null,creative:null}},prompts:null};
 v.prompts=buildPrompts(listing,v,context);listing.visual=v;return v;
}
function hydrate(listing,context={}){const v=build(listing,context),saved=read()[v.visualSeed];if(saved){v.visualStatus=saved.visualStatus||v.visualStatus;v.generationStage=saved.generationStage||v.generationStage;v.assets={...v.assets,...(saved.assets||{}),gallery:{...v.assets.gallery,...((saved.assets&&saved.assets.gallery)||{})}}}return v}
function save(listing){if(!listing||!listing.visual)return;const c=read(),v=listing.visual;c[v.visualSeed]={visualStatus:v.visualStatus,generationStage:v.generationStage,assets:v.assets,propertyFingerprint:v.propertyFingerprint,updatedAt:new Date().toISOString()};write(c)}
window.HCVisualDNA={version:VERSION,build,hydrate,save,buildPrompts};
})();