/* Haute Couture Live — registre local territorial V2
   IMPORTANT : ce registre s'active par présence/voyage, jamais par simple résidence.
*/
(function(){
'use strict';
if(window.__HCTerritorialRegistryV2)return;window.__HCTerritorialRegistryV2=true;
const ctx=window.HCTerritoryContext,bridge=window.HCLocalMap;if(!ctx||!bridge)return;
const here=ctx.getPresence?.();if(!here)return; // aucun voyage / aucune présence explicite = aucun contenu territorial déclenché par le logement
const dept=String(here.departmentCode||'');
const P={
'30':[
 {id:'nimes-arenes',dept:'30',departmentName:'Gard',city:'Nîmes',name:'Arènes de Nîmes',cat:'heritage',lat:43.83489,lng:4.35962,where:'Nîmes · Gard',text:'Architecture romaine, répétition des arches, pierre chaude et lignes de coupe.',palette:['pierre chaude','ivoire','ombre graphite'],materials:['lin structuré','toile'],motifs:['arcades','rythme vertical'],unlock:'Book Nîmes · architecture · piste de coupe structurée.'},
 {id:'nimes-maison-carree',dept:'30',departmentName:'Gard',city:'Nîmes',name:'Maison Carrée',cat:'heritage',lat:43.83819,lng:4.35611,where:'Nîmes · Gard',text:'Proportion, colonnes, symétrie et rigueur architecturale.',palette:['calcaire','crème'],materials:['gabardine','crêpe'],motifs:['colonnes','symétrie'],unlock:'Référence tailoring · bordure · proportions.'},
 {id:'nimes-jardins',dept:'30',departmentName:'Gard',city:'Nîmes',name:'Jardins de la Fontaine',cat:'nature',lat:43.84135,lng:4.34999,where:'Nîmes · Gard',text:'Eau, escaliers, végétation et pierre nourrissent drapés, transparences et palettes saisonnières.',palette:['sauge','pierre','eau grisée'],materials:['voile','mousseline','lin'],motifs:['feuillage','eau'],unlock:'Palette · motif organique · shooting.'}
],
'01':[
 {id:'ain-brou',dept:'01',departmentName:'Ain',city:'Bourg-en-Bresse',name:'Monastère royal de Brou',cat:'heritage',lat:46.19766,lng:5.23576,where:'Bourg-en-Bresse · Ain',text:'Architecture, sculpture, dentelle de pierre et recherche patrimoniale.',palette:['ivoire','pierre','verre coloré'],materials:['toile','laine'],motifs:['arcades','entrelacs'],unlock:'Book patrimoine · inspiration coupe · événement culturel.'},
 {id:'ain-soieries',dept:'01',departmentName:'Ain',city:'Jujurieux',name:'Soieries Bonnet · Jujurieux',cat:'fabric',lat:46.041,lng:5.4098,where:'Jujurieux · Ain',text:'Soie, velours, chaîne-trame, dessin textile et mémoire ouvrière.',palette:['ivoire soie','grenat','noir'],materials:['soie','velours','fils'],motifs:['armures','répétitions'],unlock:'TECHNIQUE_OBSERVED · MATERIAL_KNOWLEDGE · BOOK_RESEARCH.'},
 {id:'ain-oyonnax',dept:'01',departmentName:'Ain',city:'Oyonnax',name:'Oyonnax · Peigne & matière',cat:'craft',lat:46.2572,lng:5.6555,where:'Oyonnax · Ain',text:'Peigne, lunetterie, plasturgie, accessoire et prototype.',palette:['écaille','ambre','noir'],materials:['acétate','métal'],motifs:['courbes','modules'],unlock:'CRAFT_CONTACT · DESIGN_REFERENCE · prototype.'}
],
'03':[
 {id:'allier-moulins',dept:'03',departmentName:'Allier',city:'Moulins',name:'Moulins · Costume & scène',cat:'culture',lat:46.5657,lng:3.334,where:'Moulins · Allier',text:'Costume de scène, patrimoine et recherche textile.',palette:['rouge théâtre','or','noir'],materials:['velours','passementerie'],motifs:['ornement scénique'],unlock:'Références costume · Book · missions culturelles.'},
 {id:'allier-vichy',dept:'03',departmentName:'Allier',city:'Vichy',name:'Vichy · quartier thermal',cat:'heritage',lat:46.128,lng:3.4264,where:'Vichy · Allier',text:'Architecture thermale, réception, Opéra et clientèle de séjour.',palette:['blanc','vert d’eau','or doux'],materials:['crêpe','soie'],motifs:['ferronneries','galeries'],unlock:'Cérémonie · shooting · clientèle saisonnière.'}
],
'63':[
 {id:'pdd-clermont',dept:'63',departmentName:'Puy-de-Dôme',city:'Clermont-Ferrand',name:'Clermont-Ferrand · Textile contemporain',cat:'culture',lat:45.7772,lng:3.087,where:'Clermont-Ferrand · Puy-de-Dôme',text:'Textile contemporain, art, photographie et expérimentation.',palette:['lave sombre','rouge','ivoire'],materials:['textile expérimental','laine'],motifs:['volcan','trame'],unlock:'Réseau culturel · Book contemporain · événements évolutifs.'},
 {id:'pdd-thiers',dept:'63',departmentName:'Puy-de-Dôme',city:'Thiers',name:'Thiers · Métal & design',cat:'craft',lat:45.8565,lng:3.547,where:'Thiers · Puy-de-Dôme',text:'Surface, poids, fixation, fermoir et collaboration artisanale.',palette:['acier','noir forge','bois'],materials:['métal','bois','cuir'],motifs:['rivets','lignes tendues'],unlock:'CRAFT_CONTACT · COLLAB_CAPABILITY · accessoire.'},
 {id:'pdd-volvic',dept:'63',departmentName:'Puy-de-Dôme',city:'Volvic',name:'Volvic · Pierre & métiers d’art',cat:'craft',lat:45.8715,lng:3.0371,where:'Volvic · Puy-de-Dôme',text:'Lave, émail, forge et artisanat.',palette:['lave','bleu profond','émail'],materials:['pierre','émail','métal'],motifs:['texture volcanique'],unlock:'Matière locale · accessoire · collaboration.'}
],
'15':[
 {id:'cantal-aurillac',dept:'15',departmentName:'Cantal',city:'Aurillac',name:'Aurillac · Parapluie & scène',cat:'craft',lat:44.926,lng:2.44,where:'Aurillac · Cantal',text:'Patronnage, structure, accessoire et arts de la rue.',palette:['rouge théâtre','gris pluie','bois'],materials:['toile imperméable','métal fin'],motifs:['baleines','rayons'],unlock:'Observation technique · costume/scène · accessoire.'},
 {id:'cantal-salers',dept:'15',departmentName:'Cantal',city:'Salers',name:'Salers · laine & patrimoine',cat:'heritage',lat:45.1377,lng:2.4947,where:'Salers · Cantal',text:'Laine, marché, patrimoine et paysage saisonnier.',palette:['basalte','vert pâture','écru'],materials:['laine','soie','lin'],motifs:['pierre','relief'],unlock:'Marché · matière · shooting · cérémonie.'}
],
'43':[
 {id:'hl-puy',dept:'43',departmentName:'Haute-Loire',city:'Le Puy-en-Velay',name:'Le Puy-en-Velay · Dentelle',cat:'fabric',lat:45.0439,lng:3.885,where:'Le Puy-en-Velay · Haute-Loire',text:'Dentelle aux fuseaux : observer, s’initier, pratiquer, collaborer puis transmettre.',palette:['écru','noir','rouge profond'],materials:['fil de lin','coton','soie'],motifs:['dentelle','réseaux'],unlock:'Progression technique réelle · collaboration dentelle.'},
 {id:'hl-brioude',dept:'43',departmentName:'Haute-Loire',city:'Brioude',name:'Brioude · Dentelle & métiers d’art',cat:'fabric',lat:45.2942,lng:3.3842,where:'Brioude · Haute-Loire',text:'Formation, exposition, dentelle et métiers d’art.',palette:['ivoire','bleu','or doux'],materials:['dentelle','fil'],motifs:['Cluny','réseaux'],unlock:'Formation · exposition · Book technique.'}
],
'42':[
 {id:'loire-stetienne',dept:'42',departmentName:'Loire',city:'Saint-Étienne',name:'Saint-Étienne · Ruban & design',cat:'fabric',lat:45.4397,lng:4.3872,where:'Saint-Étienne · Loire',text:'Rubanerie, Jacquard, design, industrie et textile technique.',palette:['noir charbon','rouge ruban','acier'],materials:['ruban','velours','textile technique'],motifs:['Jacquard','bordures'],unlock:'Structure · répétition · résistance · réseau industriel.'},
 {id:'loire-charlieu',dept:'42',departmentName:'Loire',city:'Charlieu',name:'Charlieu · Soierie',cat:'fabric',lat:46.159,lng:4.172,where:'Charlieu · Loire',text:'Démonstration et initiation au tissage, chaîne et trame.',palette:['ivoire','bleu soie','grenat'],materials:['soie','fils'],motifs:['armures','trame'],unlock:'TECHNIQUE_OBSERVED · initiation tissage · Book.'},
 {id:'loire-roanne',dept:'42',departmentName:'Loire',city:'Roanne',name:'Roanne · Habillement & réseau',cat:'culture',lat:46.0362,lng:4.068,where:'Roanne · Loire',text:'Production, habillement, commerce et réseau de créateurs.',palette:['marine','écru','rouge'],materials:['maille','tissu habillement'],motifs:['production','série'],unlock:'Réseau professionnel · clientèle · briefs production.'}
]};
const list=P[dept]||[];if(!list.length)return;
/* Dans une carte locale, on privilégie la ville réellement visitée mais on laisse voir les pôles proches du même département si le zoom les englobe. */
list.forEach(p=>bridge.addMarker(p));
})();