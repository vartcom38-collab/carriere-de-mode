/* Haute Couture Live — normalisation des marqueurs territoriaux V6
   Sépare strictement réel / fictif, enrichit les gains créatifs identifiés avant
   capture QA et charge les couches média documentaires additives.
*/
(function(){
'use strict';
if(window.__HCTerritorialPlaceNormalizerV6)return;window.__HCTerritorialPlaceNormalizerV6=true;

(function loadTerritorialMedia(){
 const packs=[
  ['hcMediaLoireRhoneV1','./territorial-place-media-loire-rhone-v1.js?v=20260915-aura3','__HCTerritorialPlaceMediaLoireRhoneV2'],
  ['hcMediaArdecheV1','./territorial-place-media-ardeche-v1.js?v=20260915-aura3','__HCTerritorialPlaceMediaArdecheV1'],
  ['hcMediaHauteSavoieV1','./territorial-place-media-haute-savoie-v1.js?v=20260915-aura3','__HCTerritorialPlaceMediaHauteSavoieV1'],
  ['hcMediaSavoieV1','./territorial-place-media-savoie-v1.js?v=20260915-aura3','__HCTerritorialPlaceMediaSavoieV1'],
  ['hcMediaAllierV1','./territorial-place-media-allier-v1.js?v=20260915-aura3','__HCTerritorialPlaceMediaAllierV1'],
  ['hcMediaCantalV1','./territorial-place-media-cantal-v1.js?v=20260915-aura3','__HCTerritorialPlaceMediaCantalV1'],
  ['hcMediaHauteLoireV1','./territorial-place-media-haute-loire-v1.js?v=20260915-hl43-2','__HCTerritorialPlaceMediaHauteLoireV1'],
  ['hcMediaPuyDeDomeV1','./territorial-place-media-puy-de-dome-v1.js?v=20260915-aura3','__HCTerritorialPlaceMediaPuyDeDomeV1'],
  ['hcMediaAuraFinalV3','./territorial-place-media-aura-final-v1.js?v=20260915-aura3','__HCTerritorialPlaceMediaAURAFinalV3'],
  ['hcMediaAuraDepthV1','./territorial-place-media-aura-depth-v1.js?v=20260915-aura1','__HCTerritorialPlaceMediaAURADepthV1']
 ];
 let attempts=0;
 function inject(){
  if(!window.HCTerritorialPlaceMediaAURA?.items){if(attempts++<80)setTimeout(inject,25);return;}
  for(const [id,src,guard] of packs){
   if(window[guard]||document.getElementById(id))continue;
   const s=document.createElement('script');s.id=id;s.src=src;document.head.appendChild(s);
  }
 }
 inject();
})();

const CREATIVE_FIXES={
 'charlieu-centre':{palette:['pierre claire','ocre doux','gris ardoise'],materials:['lin','laine'],motifs:['arcades','trame médiévale']},
 'charlieu-atelier':{palette:['écru','bleu atelier','bois'],materials:['soie','fils','bois'],motifs:['navette','chaîne-trame']},
 'tier2-montbrison-0':{palette:['pierre claire','vert jardin','ardoise'],materials:['lin','laine fine'],motifs:['façades','trame historique']},
 'tier2-montbrison-2':{palette:['ivoire','rose poudré','bleu nuit'],materials:['soie','crêpe','dentelle'],motifs:['cérémonie','plis souples']},
 'tier2-montbrison-8':{palette:['vert tendre','pierre','bleu eau'],materials:['lin','toile'],motifs:['jardin','courbes de promenade']},
 'vfs-centre':{palette:['pierre dorée','crème','gris zinc'],materials:['lin','laine fine'],motifs:['façades','rythme urbain']},
 'vfs-beaujolais':{palette:['lie-de-vin','pierre dorée','vert vigne'],materials:['soie','velours','lin'],motifs:['vigne','courbes du relief']},
 'tier2-tarare-0':{palette:['écru','gris atelier','bleu nuit'],materials:['voilage','coton','fils'],motifs:['trame','mémoire industrielle']},
 'tier2-tarare-3':{palette:['blanc cassé','gris perle','bleu brume'],materials:['voilage','organza','fils fins'],motifs:['transparence','rayures légères']},
 'tier2-tarare-8':{palette:['vert sombre','pierre','bleu horizon'],materials:['laine','toile'],motifs:['relief','lignes d’horizon']},
 'tier2-montlu-on-0':{palette:['grès chaud','gris ardoise','rouille sourde'],materials:['lin lourd','laine sèche','cuir patiné'],motifs:['ruelles médiévales','pans de bois','verticales de tour']},
 'tier2-montlu-on-2':{palette:['vert canal','bleu gris','brique'],materials:['toile de coton','sergé','cordage'],motifs:['reflets d’eau','écluses','lignes de halage']},
 'tier2-montlu-on-3':{palette:['acier','noir charbon','rouille'],materials:['denim','toile technique','métal'],motifs:['rayons de rotonde','rails','rivets']},
 'tier2-montlu-on-5':{palette:['noir scène','bordeaux','ivoire'],materials:['velours','satin','laine de costume'],motifs:['rideaux','plis de scène','lignes de vestiaire']},
 '03-maison-mantin':{palette:['bois sombre','ivoire','vert patiné'],materials:['velours','bois','cuir'],motifs:['cabinet de curiosités','passementerie','ornements fin XIXe']},
 '07-pont-arc':{palette:['calcaire clair','vert rivière','ocre'],materials:['lin','toile','cuir'],motifs:['arche naturelle','courbes d’eau','strates rocheuses']},
 'tier2-salers-0':{palette:['basalte sombre','pierre blonde','vert prairie'],materials:['laine','lin','cuir'],motifs:['façades de Salers','verticales de tours','pavés']},
 'tier2-salers-1':{palette:['écru laine','rouge profond','vert plateau'],materials:['laine','soie','feutre'],motifs:['étals','trames mêlées','petites séries']},
 'tier2-salers-3':{palette:['écru','gris mouton','brun atelier'],materials:['laine','feutre','fil épais'],motifs:['torsades','boucles','gestes d’atelier']},
 'tier2-salers-7':{palette:['vert plateau','gris basalte','bleu ciel'],materials:['laine','toile','cuir'],motifs:['lignes de crête','routes sinueuses','herbes hautes']},
 'tier2-saint-flour-0':{palette:['basalte noir','gris argent','ocre sec'],materials:['laine','lin','cuir'],motifs:['ville haute','verticales rocheuses','murailles']},
 'tier2-saint-flour-1':{palette:['gris lave','pierre sombre','rouille douce'],materials:['lin','laine sèche','cuir'],motifs:['ruelles anciennes','arcades','rythmes de façades']},
 'tier2-saint-flour-4':{palette:['écru','anthracite','brun naturel'],materials:['laine','feutre','fil cardé'],motifs:['torsades','maille dense','gestes d’atelier']},
 'tier2-saint-flour-8':{palette:['bleu horizon','gris basalte','vert plateau'],materials:['laine','toile','lin'],motifs:['horizons larges','courbes du relief','strates']},
 '26-grignan-chateau':{palette:['pierre blonde','lavande grisée','bordeaux'],materials:['soie','lin','velours'],motifs:['terrasses','correspondance','drapés XVIIe']},
 '26-hauterives-palais':{palette:['ocre','grès','vert mousse'],materials:['toile','broderie','perles minérales'],motifs:['coquillages','arabesques','architecture naïve']},
 '42-firminy-corbu':{palette:['béton clair','rouge primaire','bleu profond'],materials:['toile technique','laine','métal'],motifs:['modulor','géométrie','brise-soleil']},
 'tier2-brioude-0':{palette:['ivoire dentelle','pierre blonde','bleu grisé'],materials:['dentelle','lin','fil de coton'],motifs:['fuseaux','réseaux ajourés','rosaces']},
 'tier2-brioude-1':{palette:['pierre blonde','terre cuite','gris ardoise'],materials:['lin','laine sèche','cuir'],motifs:['arcades','façades anciennes','rythmes de ruelle']},
 'tier2-brioude-4':{palette:['écru','ocre atelier','bleu encre'],materials:['lin','fil','bois'],motifs:['trame artisanale','gestes d’atelier','géométries textiles']},
 '43-dentelle':{palette:['ivoire dentelle','écru','bleu grisé'],materials:['dentelle','fil de coton','lin'],motifs:['fuseaux','réseau ajouré','bordure placée']},
 '43-lafayette-chateau':{palette:['bleu uniforme','écru','rouge sourd'],materials:['laine de costume','lin','métal'],motifs:['galons','boutons','correspondance']},
 '69-soierie-vivante':{palette:['ivoire soie','rouge garance','bleu nuit'],materials:['soie','satin','fils'],motifs:['jacquard','chaîne-trame','mécanique de métier']},
 '73-charmettes':{palette:['vert jardin','écru papier','bois'],materials:['lin','laine fine','papier'],motifs:['herbier','écriture','petits carreaux']},
 'riom-centre':{palette:['pierre blonde','gris lave','vert patiné'],materials:['lin','laine','pierre volcanique'],motifs:['tour d’horloge','façades classiques','rythmes de rues']}
};

const UNLOCK_FIXES={
 '03-maison-mantin':'BOOK_RESEARCH · intérieur fin XIXe · détails, ornements et palette.',
 '03-vichy-social':'RELATION_MEMORY · réseau local de Vichy · nouvelle piste sociale.',
 'fig-03-chanel':'DESIGN_REFERENCE · Chanel à Moulins · contexte historique documentaire.',
 '07-papeteries':'BOOK_RESEARCH · mémoire papetière ardéchoise · textures et fibres.',
 '07-annonay-social':'RELATION_MEMORY · réseau créatif d’Annonay.',
 '07-pont-arc':'DESIGN_REFERENCE · Pont d’Arc · courbes, strates et palette naturelle.',
 'fig-07-montgolfier':'DESIGN_REFERENCE · Montgolfier à Annonay · volume et enveloppe.',
 'fig-07-ferrat':'BOOK_RESEARCH · Jean Ferrat et Antraigues · référence culturelle documentaire.',
 '15-aurillac-costume':'BOOK_RESEARCH · costume et collections d’Aurillac · silhouettes et détails.',
 '15-salers':'DESIGN_REFERENCE · Salers · architecture, laine et palette volcanique.',
 '15-aurillac-social':'RELATION_MEMORY · réseau créatif d’Aurillac.',
 'fig-15-pompidou':'BOOK_RESEARCH · Georges Pompidou · repère culturel cantalien documentaire.',
 '26-romans-chaussure':'TECHNIQUE_OBSERVED · construction chaussure · référence matière et volume.',
 '26-grignan-chateau':'BOOK_RESEARCH · Château de Grignan · silhouette, textile et correspondance.',
 '26-hauterives-palais':'DESIGN_REFERENCE · Palais idéal · motif architectural et texture.',
 'fig-26-sevigne':'BOOK_RESEARCH · Madame de Sévigné à Grignan · référence documentaire.',
 'fig-26-cheval':'DESIGN_REFERENCE · Facteur Cheval · architecture imaginaire documentée.',
 '38-stendhal-museum':'BOOK_RESEARCH · Stendhal à Grenoble · archives et références visuelles.',
 '38-berlioz-house':'BOOK_RESEARCH · Berlioz à La Côte-Saint-André · maison et archives.',
 '38-grenoble-social':'RELATION_MEMORY · réseau créatif grenoblois.',
 'fig-38-stendhal':'DESIGN_REFERENCE · Stendhal · référence littéraire grenobloise.',
 'fig-38-berlioz':'DESIGN_REFERENCE · Berlioz · référence musicale iséroise.',
 '42-mai-rubans':'TECHNIQUE_OBSERVED · rubanerie stéphanoise · trames et passementerie.',
 '42-firminy-corbu':'DESIGN_REFERENCE · Firminy-Vert · géométrie moderniste et modulor.',
 '42-sainte-social':'RELATION_MEMORY · réseau créatif stéphanois.',
 'fig-42-corbusier':'BOOK_RESEARCH · Le Corbusier à Firminy · référence architecturale.',
 '43-crozatier':'BOOK_RESEARCH · costumes, objets et mémoire locale · piste de collection.',
 '43-dentelle':'TECHNIQUE_OBSERVED · dentelle aux fuseaux · MOTIF_REFERENCE · Book.',
 '43-lafayette-chateau':'BOOK_RESEARCH · référence costume historique · palette et détails d’uniforme.',
 'fig-43-lafayette':'DESIGN_REFERENCE · recherche documentaire Lafayette · piste de collection historique.',
 '63-bargoin-textile':'BOOK_RESEARCH · collections textiles Bargoin · matière, motif et couleur.',
 '63-michelin':'DESIGN_REFERENCE · patrimoine industriel Michelin · graphisme et technique.',
 '63-clermont-social':'RELATION_MEMORY · réseau créatif clermontois.',
 'fig-63-pascal':'BOOK_RESEARCH · Blaise Pascal à Clermont · référence scientifique documentaire.',
 '69-maison-canuts':'TECHNIQUE_OBSERVED · canut et métier Jacquard · savoir-faire lyonnais.',
 '69-soierie-vivante':'TECHNIQUE_OBSERVED · tissage vivant de la soie · chaîne, trame et mécanique.',
 '69-lyon-social':'RELATION_MEMORY · réseau créatif lyonnais.',
 'fig-69-jacquard':'DESIGN_REFERENCE · Joseph-Marie Jacquard · mécanique textile documentée.',
 'fig-69-saintex':'BOOK_RESEARCH · Saint-Exupéry à Lyon · référence littéraire documentaire.',
 '73-charmettes':'BOOK_RESEARCH · Les Charmettes · écriture, jardin et palette savoyarde.',
 '73-opinel-museum':'BOOK_RESEARCH · Musée Opinel · geste, acier, bois et objet.',
 '73-chambery-social':'RELATION_MEMORY · réseau créatif chambérien.',
 'fig-73-rousseau':'BOOK_RESEARCH · Rousseau aux Charmettes · référence documentaire.',
 'fig-73-opinel':'DESIGN_REFERENCE · Joseph Opinel · objet, bois et industrie savoyarde.',
 '74-annecy-chateau':'BOOK_RESEARCH · Château d’Annecy · costumes, architecture et collections.',
 '74-evian-palais':'DESIGN_REFERENCE · Palais Lumière · villégiature, lignes Belle Époque.',
 '74-annecy-social':'RELATION_MEMORY · réseau créatif annécien.',
 'fig-74-berthollet':'BOOK_RESEARCH · Berthollet · référence scientifique haut-savoyarde.',
 'fig-74-novarina':'BOOK_RESEARCH · Valère Novarina · référence théâtrale haut-savoyarde.',
 'pdd-d-thiers':'Débloque l’inspiration « précision coutelière »',
 'pdd-d-riom':'Débloque l’inspiration « archives de Riom »',
 'pdd-d-volvic':'Débloque l’inspiration « lave et pierre de Volvic »',
 'pdd-d-montdore':'Débloque l’inspiration « élégance thermale alpine »',
 'pdd-d-bourboule':'Débloque l’inspiration « villégiature thermale »',
 'pdd-d-issoire':'Débloque l’inspiration « patrimoine roman »',
 'pdd-d-ambert':'Débloque l’inspiration « papier chiffon »',
 'pdd-d-orcines':'Débloque l’inspiration « relief volcanique »'
};

function fictional(p){
 if(!p)return false;
 if(p.fictional===true||p.fictionalFamily===true||p.fictionalFuture===true||p.evolutive===true)return true;
 const type=String(p.gameplayType||'').toLowerCase();
 if(type==='person'||type==='event'||type==='rumor'||type==='secret')return true;
 const kind=String(p.kind||'').toLowerCase(),text=String(p.text||p.description||'').toLowerCase(),id=String(p.id||'').toLowerCase();
 if(/fiction gameplay|fictif|fictive|illustration de jeu/.test(kind+' '+text))return true;
 if(/(?:^|-)person(?:-|$)/.test(id))return true;
 if(/(?:^|-)event(?:-|$)/.test(id)&&!/real|document/.test(kind))return true;
 if(/famille événementielle|famille evolutive|famille évolutive/.test(text+' '+String(p.name||'').toLowerCase()))return true;
 return false;
}
function enrichCreative(p){const fix=CREATIVE_FIXES[p?.id];if(!fix)return p;for(const k of ['palette','materials','motifs'])if(!(p[k]?.length))p[k]=[...fix[k]];return p;}
function enrichUnlock(p){const fix=UNLOCK_FIXES[p?.id];if(fix&&!String(p.unlock||'').trim())p.unlock=fix;return p;}
function normalize(p){if(!p||typeof p!=='object')return p;enrichCreative(p);enrichUnlock(p);if(fictional(p)){p.fictional=true;p.documentaryContext=false}return p;}
function wrap(map){if(!map?.addMarker||map.__hcPlaceNormalizerV6)return map;const original=map.addMarker.bind(map);map.addMarker=function(place){return original(normalize(place))};map.__hcPlaceNormalizerV6=true;return map;}

let current=window.HCLocalMap,mapReady=false;
const early=new Set();
function relevantScript(s){return s?.tagName==='SCRIPT'&&/^hc/i.test(String(s.id||''))&&/(Map|Universe)/i.test(String(s.id||''))&&s.src}
function track(s){if(!relevantScript(s)||s.__hcEarlyTracked)return;s.__hcEarlyTracked=true;s.addEventListener('load',()=>{if(!mapReady)early.add(s)},{once:true});try{if(!mapReady&&performance.getEntriesByName(s.src).some(e=>e.responseEnd>0))early.add(s)}catch(_){}}
document.querySelectorAll('script[id]').forEach(track);
const observer=new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(track)));observer.observe(document.documentElement,{childList:true,subtree:true});
async function replayEarly(){if(!early.size)return;for(const s of [...early]){if(s.__hcEarlyReplayed)continue;s.__hcEarlyReplayed=true;try{const text=await fetch(s.src,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.text()});const guard=text.match(/if\(window\.(__[A-Za-z0-9_$]+)\)return;window\.\1=true/);if(guard){try{delete window[guard[1]]}catch(_){window[guard[1]]=false}}(0,eval)(text+'\n//# sourceURL='+s.src.split('?')[0]+'?hc-replay=1')}catch(e){console.warn('[HC territoires] retry pack impossible',s.id,e)}}}
try{const desc=Object.getOwnPropertyDescriptor(window,'HCLocalMap');if(!desc||desc.configurable){Object.defineProperty(window,'HCLocalMap',{configurable:true,get(){return current},set(v){current=wrap(v);mapReady=!!current;if(mapReady){observer.disconnect();queueMicrotask(()=>replayEarly());setTimeout(()=>window.HCTerritoryContext?.loadDepartmentGameplay?.(),0)}}})}}catch(_){}
if(current){current=wrap(current);mapReady=true;observer.disconnect();queueMicrotask(()=>replayEarly())}
window.HCTerritorialPlaceNormalizerV1=window.HCTerritorialPlaceNormalizerV2=window.HCTerritorialPlaceNormalizerV3=window.HCTerritorialPlaceNormalizerV4=window.HCTerritorialPlaceNormalizerV5=window.HCTerritorialPlaceNormalizerV6={version:6,normalize,isFictional:fictional,wrap,replayEarly};
})();