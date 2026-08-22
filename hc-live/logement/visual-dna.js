/* Haute Couture Live — moteur d'ADN visuel logement
   Chaque annonce reçoit une identité visuelle déterministe.
   Ce fichier ne génère pas encore l'image distante : il prépare les données,
   les prompts et le cache nécessaires pour brancher le backend d'images. */

const HC_VISUAL_DNA_VERSION='1.0';
const HC_VISUAL_CACHE_KEY='haute-couture-listing-visuals-v1';

const HC_HOUSING_ARCHETYPES=[
  {id:'mini-studio',label:'Mini studio première installation',types:['Studio mansardé'],surface:[12,18],layout:['micro-studio optimisé','studio compact avec kitchenette'],standing:['simple','première installation']},
  {id:'bright-studio',label:'Studio lumineux',types:['Studio lumineux'],surface:[18,27],layout:['studio ouvert lumineux','studio avec grande fenêtre'],standing:['simple soigné','milieu de gamme']},
  {id:'balcony-studio',label:'Studio avec balcon',types:['Studio lumineux'],surface:[20,30],requires:'balcony',layout:['studio ouvert avec balcon','studio traversant compact'],standing:['milieu de gamme']},
  {id:'attic-studio',label:'Studio sous les toits',types:['Studio mansardé'],surface:[14,24],layout:['mansarde cosy','sous-pente optimisée'],standing:['simple soigné','charme ancien']},
  {id:'creative-t1',label:'T1 créatif',types:['T1 rénové'],surface:[22,32],layout:['pièce principale avec coin nuit','T1 avec coin création'],standing:['milieu de gamme']},
  {id:'cosy-t2',label:'T2 cosy',types:['Deux-pièces créatif'],surface:[30,45],layout:['salon et chambre séparée','T2 semi-ouvert'],standing:['milieu de gamme']},
  {id:'old-character',label:'Appartement ancien de caractère',types:['Appartement ancien'],surface:[25,50],layout:['ancien avec parquet','appartement haut sous plafond'],standing:['charme ancien','milieu de gamme']},
  {id:'ground-workshop',label:'Rez-de-chaussée atelier',types:['Rez-de-chaussée atelier'],surface:[25,45],layout:['RDC avec grand mur de travail','atelier domestique compact'],standing:['brut créatif','simple soigné']},
  {id:'creative-share',label:'Coloc créative',types:['Deux-pièces créatif','Appartement ancien'],surface:[45,90],layout:['grande pièce commune','colocation créative'],standing:['simple vivant','milieu de gamme']},
  {id:'small-loft',label:'Petit loft',types:['Petit loft'],surface:[32,55],layout:['volume ouvert','petit loft atelier'],standing:['milieu de gamme','premium créatif']},
  {id:'premium-flat',label:'Appartement premium',types:['T1 rénové','Deux-pièces créatif','Appartement ancien'],surface:[42,75],layout:['appartement chic','volume élégant avec dressing'],standing:['premium']},
  {id:'outdoor-home',label:'Logement avec extérieur',types:['Studio lumineux','Deux-pièces créatif','Appartement ancien'],surface:[30,85],requires:'balcony',layout:['logement ouvert sur extérieur','pièce de vie avec terrasse ou balcon'],standing:['milieu de gamme','premium']}
];

const HC_CITY_SIGNATURES={
  'Paris':{id:'paris_compact_chic',architecture:['parquet ancien','moulures discrètes','mansarde parisienne','fenêtres sur cour'],palettes:['crème, noir doux, corail sourd, bois chaud','ivoire, sauge grisée, bois miel'],decor:['chic compact','mode éditoriale','vintage parisien raffiné'],views:['toits urbains','cour intérieure','balcon filant'],light:['lumière diffuse de grande fenêtre','soleil doux de fin de matinée']},
  'Lyon':{id:'lyon_warm_creative',architecture:['parquet chaud','hautes fenêtres','pierre ancienne','volume canut inspiré'],palettes:['beige chaud, olive, terracotta, bois miel','crème, ocre doux, vert sauge'],decor:['créatif chaleureux','arty pratique','ancien modernisé'],views:['cour lyonnaise','rue ancienne','toits de la ville'],light:['lumière chaude latérale','soleil de fin d’après-midi']},
  'Fréjus':{id:'frejus_mediterranean_bright',architecture:['murs clairs','carrelage méditerranéen','volets ou persiennes','ouvertures lumineuses'],palettes:['sable, crème, terracotta, turquoise doux','ivoire, vert olive clair, bleu grisé'],decor:['méditerranéen créatif','balnéaire élégant','simple solaire'],views:['balcon ensoleillé','rue provençale','végétation méditerranéenne'],light:['forte lumière naturelle','soleil méditerranéen filtré']},
  'Marseille':{id:'marseille_solar_arty',architecture:['murs texturés','carrelage ancien','grandes ouvertures','petit balcon urbain'],palettes:['craie, terracotta, bleu profond, bois clair','sable, pêche, olive, blanc cassé'],decor:['arty méditerranéen','créatif solaire','bohème urbain'],views:['toits méditerranéens','rue dense et lumineuse','balcon planté'],light:['soleil franc du Sud','lumière dorée']},
  'Bordeaux':{id:'bordeaux_stone_elegant',architecture:['pierre blonde','hautes fenêtres','parquet clair','plafond généreux'],palettes:['pierre, crème, bois blond, vert grisé','beige, cognac doux, ivoire'],decor:['élégant naturel','chic doux','créatif raffiné'],views:['façades en pierre','cour claire','rue bordelaise'],light:['lumière ample et douce','soleil clair']},
  'Lille':{id:'lille_cosy_brick',architecture:['brique apparente par touches','parquet plus foncé','fenêtres verticales','ancien nordiste'],palettes:['crème, brique sourde, bleu gris, bois brun','beige chaud, vert profond, rouille'],decor:['cosy créatif','vintage chaleureux','urbain cocon'],views:['rue de briques','cour intérieure','toits du Nord'],light:['lumière diffuse','lumière douce de matin couvert']},
  'Nice':{id:'nice_riviera_pastel',architecture:['volets méditerranéens','balcon','murs clairs','détails Belle Époque simplifiés'],palettes:['crème, rose poudré, vert d’eau, bois clair','sable, bleu Riviera, pêche'],decor:['Riviera doux','chic pastel','méditerranéen élégant'],views:['balcon lumineux','façades pastel','végétation du Sud'],light:['lumière Riviera très claire','soleil matinal']},
  'Toulouse':{id:'toulouse_terracotta_young',architecture:['brique rose par touches','parquet','fenêtres hautes','volume chaleureux'],palettes:['rose terre cuite, crème, bois, sauge','ocre rose, ivoire, bleu grisé'],decor:['jeune arty','chaleureux créatif','vintage doux'],views:['toits de brique','rue toulousaine','cour végétale'],light:['lumière chaude','soleil doux du Sud-Ouest']}
};

const HC_REGION_SIGNATURES={
  'Île-de-France':{id:'idf_urban_compact',architecture:['appartement urbain compact','fenêtres verticales'],palettes:['crème, taupe, noir doux, bois'],decor:['urbain soigné'],views:['cour urbaine','rue dense'],light:['lumière urbaine diffuse']},
  'Auvergne-Rhône-Alpes':{id:'aura_warm_urban',architecture:['parquet chaud','ancien urbain modernisé'],palettes:['beige, olive, bois miel'],decor:['créatif chaleureux'],views:['rue de centre-ville','cour claire'],light:['lumière latérale douce']},
  'Provence-Alpes-Côte d’Azur':{id:'paca_mediterranean',architecture:['murs clairs','ouvertures ensoleillées'],palettes:['sable, terracotta, bleu doux, crème'],decor:['méditerranéen créatif'],views:['végétation du Sud','balcon lumineux'],light:['soleil méditerranéen']},
  'Nouvelle-Aquitaine':{id:'na_soft_stone',architecture:['pierre claire','bois naturel'],palettes:['crème, pierre, vert grisé'],decor:['naturel élégant'],views:['rue claire','cour végétale'],light:['lumière douce']},
  'Occitanie':{id:'occitanie_warm_south',architecture:['tons chauds','ancien du Sud modernisé'],palettes:['terre cuite, crème, sauge'],decor:['jeune créatif'],views:['rue du Sud','cour ensoleillée'],light:['lumière chaude']},
  'Hauts-de-France':{id:'hdf_cosy_urban',architecture:['brique ou ancien urbain','parquet'],palettes:['brique sourde, crème, bleu gris'],decor:['cosy créatif'],views:['rue urbaine','cour'],light:['lumière diffuse']}
};

const HC_DECOR_STYLES=['minimal créatif','vintage éditorial','bohème maîtrisé','arty contemporain','mode parisienne','naturel méditerranéen','récupération chic','soft modern'];
const HC_FLOORS=['parquet miel','parquet ancien','bois clair','carrelage crème','carreaux vintage discrets','sol minéral clair'];
const HC_FURNITURE=['mobilier léger et dépareillé','mobilier compact aux lignes simples','pièces vintage choisies','mobilier bois clair et textile écru','mobilier créatif de petit appartement'];
const HC_QUIRKS=['mur légèrement irrégulier qui donne du charme','petit renfoncement utile pour le rangement','circulation un peu serrée','grand mur libre parfait pour une table de coupe','coin fenêtre très agréable','rangements limités mais bien placés','cuisine petite mais fonctionnelle','volume simple facile à personnaliser'];
const HC_CAMERA=['vue trois-quarts depuis l’entrée','vue large depuis un angle de la pièce','vue à hauteur humaine vers la fenêtre','perspective latérale montrant la circulation'];

function hcHash(s){let x=2166136261;for(const c of String(s)){x^=c.charCodeAt(0);x=Math.imul(x,16777619)}return x>>>0}
function hcRng(seed){let a=hcHash(seed);return()=>{let t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function hcPick(r,a){return a[Math.floor(r()*a.length)]}
function hcClamp(n,a,b){return Math.max(a,Math.min(b,n))}

function hcCitySignature(city,region){return HC_CITY_SIGNATURES[city]||HC_REGION_SIGNATURES[region]||{id:'france_editorial_home',architecture:['appartement français contemporain avec quelques détails anciens'],palettes:['crème, bois chaud, corail sourd, vert grisé'],decor:['créatif éditorial'],views:['rue française','cour claire'],light:['lumière naturelle douce']}}

function hcChooseArchetype(listing,r){let possible=HC_HOUSING_ARCHETYPES.filter(a=>a.types.includes(listing.title)&&listing.surface>=a.surface[0]-3&&listing.surface<=a.surface[1]+8);if(listing.balcony){const outdoor=HC_HOUSING_ARCHETYPES.filter(a=>a.requires==='balcony'&&a.types.includes(listing.title));possible=possible.concat(outdoor)}if(!possible.length)possible=HC_HOUSING_ARCHETYPES.filter(a=>a.types.includes(listing.title));if(!possible.length)possible=HC_HOUSING_ARCHETYPES;return hcPick(r,possible)}

function hcBuildVisualDNA(listing,context={}){
  if(listing.visual&&listing.visual.version===HC_VISUAL_DNA_VERSION)return listing.visual;
  const city=context.city||listing.city||'';
  const region=context.region||listing.region||'';
  const seed=`${city}|${listing.id}|${listing.title}|${listing.surface}|${listing.floor}|${listing.price}`;
  const r=hcRng(seed),sig=hcCitySignature(city,region),arch=hcChooseArchetype(listing,r);
  const atelierScore=hcClamp(Math.round((listing.surface-14)/8)+(listing.title.includes('atelier')||listing.title.includes('loft')?2:0),1,5);
  const standing=listing.price>1300?'premium':listing.price>850?'milieu de gamme':'première installation';
  const visual={
    version:HC_VISUAL_DNA_VERSION,
    visualSeed:`${(city||'france').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-')}-${hcHash(seed).toString(36)}`,
    visualStatus:'pending',
    generationStage:'metadata_ready',
    citySignature:sig.id,
    archetype:arch.id,
    archetypeLabel:arch.label,
    layoutType:hcPick(r,arch.layout),
    standingLevel:standing,
    architecture:hcPick(r,sig.architecture),
    palette:hcPick(r,sig.palettes),
    decorSignature:hcPick(r,[...sig.decor,...HC_DECOR_STYLES]),
    floorMaterial:hcPick(r,HC_FLOORS),
    furnitureSignature:hcPick(r,HC_FURNITURE),
    lightSignature:hcPick(r,sig.light),
    viewSignature:listing.balcony?hcPick(r,sig.views):hcPick(r,[...sig.views,'vue sur cour','fenêtre sur rue']),
    cameraAngle:hcPick(r,HC_CAMERA),
    atelierPotential:atelierScore,
    creativeFeature:atelierScore>=4?'vrai coin couture avec table de travail':atelierScore===3?'coin couture compact intégré':atelierScore===2?'petit bureau transformable pour coudre':'aucun atelier permanent, seulement une solution pliable',
    quirks:[hcPick(r,HC_QUIRKS),hcPick(r,HC_QUIRKS)],
    imageStyle:'illustration éditoriale mode, contours propres, formes simplifiées, couleurs douces mais affirmées, lumière chaleureuse, même univers graphique que les personnages du jeu, jamais photoréaliste',
    assets:{thumbnail:null,mainImage:null,gallery:{kitchen:null,bathroom:null,window:null,creative:null}},
    prompts:null
  };
  visual.prompts=hcBuildVisualPrompts(listing,visual,{city,region,district:context.district||listing.district||''});
  listing.visual=visual;
  return visual;
}

function hcBuildVisualPrompts(listing,v,ctx={}){
  const facts=`Ville : ${ctx.city||'France'}. Quartier/secteur : ${ctx.district||'non précisé'}. Type : ${listing.title}. Surface : ${listing.surface} m². ${listing.rooms||1} pièce(s). Étage : ${listing.floor===0?'rez-de-chaussée':listing.floor+'e'}. ${listing.furnished?'Meublé':'Non meublé'}. ${listing.balcony?'Balcon présent':'Pas de balcon'}. État : ${(listing.tags&&listing.tags[2])||'habitable'}.`;
  const identity=`ADN unique : ${v.visualSeed}. Archétype : ${v.archetypeLabel}. Architecture : ${v.architecture}. Palette : ${v.palette}. Décor : ${v.decorSignature}. Sol : ${v.floorMaterial}. Mobilier : ${v.furnitureSignature}. Lumière : ${v.lightSignature}. Vue : ${v.viewSignature}. Potentiel couture : ${v.creativeFeature}. Particularité : ${v.quirks.join(' ; ')}.`;
  const style=`Illustration intérieure premium pour un jeu de carrière dans la mode. Même langage graphique que les personnages : dessin éditorial propre, contours maîtrisés, formes simplifiées, couleurs chaleureuses et raffinées, légère texture dessinée, ambiance lifestyle mode. Pas de photoréalisme, pas de rendu 3D réaliste, pas d'aquarelle floue, pas de texte, pas de logo, pas d'interface dans l'image. L'appartement doit rester crédible pour son prix et sa surface : ne pas embellir artificiellement un petit logement modeste.`;
  const continuity=`Conserver exactement le même appartement, la même implantation, la même palette, les mêmes meubles principaux et le même niveau de gamme que l'image principale ${v.visualSeed}.`;
  return{
    thumbnail:`${style} ${facts} ${identity} Créer une vignette de l'annonce, cadrage clair et lisible, pièce principale immédiatement reconnaissable.`,
    main:`${style} ${facts} ${identity} Créer l'image principale du logement. ${v.cameraAngle}. Montrer l'espace de vie le plus représentatif, avec une composition élégante mais naturelle. Adapter subtilement l'architecture à ${ctx.city||'la ville'} sans clichés touristiques.`,
    kitchen:`${style} ${facts} ${identity} ${continuity} Vue secondaire centrée sur la cuisine ou kitchenette, fidèle à la surface réelle du logement.`,
    bathroom:`${style} ${facts} ${identity} ${continuity} Vue secondaire de la salle d'eau, cohérente avec le standing et l'âge du logement.`,
    window:`${style} ${facts} ${identity} ${continuity} Vue secondaire vers ${listing.balcony?'le balcon et':'la fenêtre et'} ${v.viewSignature}.`,
    creative:`${style} ${facts} ${identity} ${continuity} Vue secondaire du rangement, bureau ou espace créatif. Montrer honnêtement : ${v.creativeFeature}.`
  }
}

function hcReadVisualCache(){try{return JSON.parse(localStorage.getItem(HC_VISUAL_CACHE_KEY)||'{}')}catch(e){return{}}}
function hcWriteVisualCache(cache){try{localStorage.setItem(HC_VISUAL_CACHE_KEY,JSON.stringify(cache))}catch(e){}}
function hcHydrateVisual(listing,context){const cache=hcReadVisualCache(),v=hcBuildVisualDNA(listing,context),saved=cache[v.visualSeed];if(saved){v.visualStatus=saved.visualStatus||v.visualStatus;v.generationStage=saved.generationStage||v.generationStage;v.assets={...v.assets,...saved.assets,gallery:{...v.assets.gallery,...(saved.assets&&saved.assets.gallery)}}}return v}
function hcSaveVisual(listing){if(!listing.visual)return;const cache=hcReadVisualCache();cache[listing.visual.visualSeed]={visualStatus:listing.visual.visualStatus,generationStage:listing.visual.generationStage,assets:listing.visual.assets,updatedAt:new Date().toISOString()};hcWriteVisualCache(cache)}

/* API publique pour le futur backend de génération */
window.HCVisualDNA={version:HC_VISUAL_DNA_VERSION,archetypes:HC_HOUSING_ARCHETYPES,citySignatures:HC_CITY_SIGNATURES,build:hcBuildVisualDNA,hydrate:hcHydrateVisual,save:hcSaveVisual,buildPrompts:hcBuildVisualPrompts};
