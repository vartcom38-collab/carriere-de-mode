/* Haute Couture Live — Atelier taxonomy v1
   Bibliothèque de styliste : famille -> sous-catégorie -> références visuelles + tags transversaux.
   Cette couche décrit la structure, pas les images elles-mêmes.
*/
(function(){
'use strict';
if(window.HCAtelierTaxonomy) return;
const S=(id,label,aliases=[])=>({id,label,aliases});
const F=(id,label,subs)=>({id,label,subs});
const families=[
 F('tops','HAUTS',[
  S('tshirts','T-shirts',['tee','t-shirt']),S('tank-tops','Débardeurs',['tank']),S('caracos','Caracos'),S('tops','Tops'),S('crop-tops','Crop tops'),S('bandeaux','Bandeaux'),S('shirts','Chemises'),S('blouses','Chemisiers & blouses'),S('tunics','Tuniques'),S('bustiers','Bustiers'),S('corsets','Corsets'),S('bodies','Bodies'),S('knits','Pulls & mailles'),S('cardigans','Cardigans'),S('vests','Gilets'),S('asymmetric-tops','Tops asymétriques'),S('cape-tops','Tops-capes')
 ]),
 F('bottoms','BAS',[
  S('mini-skirts','Mini-jupes'),S('straight-skirts','Jupes droites'),S('pencil-skirts','Jupes crayon'),S('a-line-skirts','Jupes trapèze'),S('wrap-skirts','Jupes portefeuille'),S('pleated-skirts','Jupes plissées'),S('circle-skirts','Jupes cercle'),S('bubble-skirts','Jupes boule'),S('long-skirts','Jupes longues'),S('mermaid-skirts','Jupes sirène'),S('draped-skirts','Jupes drapées'),S('godet-skirts','Jupes à godets'),S('shorts','Shorts'),S('bermudas','Bermudas'),S('straight-pants','Pantalons droits'),S('cigarette-pants','Pantalons cigarette'),S('wide-pants','Pantalons larges'),S('palazzo','Palazzo'),S('flare-pants','Pantalons flare'),S('cargo-pants','Pantalons cargo'),S('tailored-pants','Pantalons tailleur'),S('pleated-pants','Pantalons à pinces'),S('harem-pants','Sarouels'),S('leggings','Leggings'),S('jeans','Jeans')
 ]),
 F('dresses','ROBES & COMBINAISONS',[
  S('straight-dresses','Robes droites'),S('a-line-dresses','Robes trapèze'),S('sheath-dresses','Robes fourreau'),S('empire-dresses','Robes empire'),S('wrap-dresses','Robes portefeuille'),S('shirt-dresses','Robes chemise'),S('skater-dresses','Robes patineuse'),S('column-dresses','Robes colonne'),S('mermaid-dresses','Robes sirène'),S('ball-gowns','Robes de bal'),S('blazer-dresses','Robes blazer'),S('slip-dresses','Robes nuisette'),S('mini-dresses','Robes mini'),S('midi-dresses','Robes midi'),S('maxi-dresses','Robes longues'),S('jumpsuits','Combinaisons'),S('playsuits','Playsuits')
 ]),
 F('sleeves','MANCHES',[
  S('sleeveless','Sans manches'),S('cap-sleeves','Mancherons'),S('short-sleeves','Manches courtes'),S('three-quarter-sleeves','Manches 3/4'),S('long-sleeves','Manches longues'),S('balloon-sleeves','Manches ballon'),S('leg-of-mutton-sleeves','Manches gigot'),S('bishop-sleeves','Manches évêque'),S('kimono-sleeves','Manches kimono'),S('raglan-sleeves','Manches raglan'),S('batwing-sleeves','Manches chauve-souris'),S('tulip-sleeves','Manches tulipe'),S('bell-sleeves','Manches cloche'),S('sheer-sleeves','Manches transparentes'),S('slit-sleeves','Manches fendues'),S('detachable-sleeves','Manches amovibles')
 ]),
 F('necklines','ENCOLURES',[
  S('round-neck','Ronde'),S('v-neck','V'),S('square-neck','Carrée'),S('boat-neck','Bateau'),S('sweetheart-neck','Cœur'),S('off-shoulder','Bardot / épaules dénudées'),S('halter-neck','Halter'),S('asymmetric-neck','Asymétrique'),S('plunging-neck','Plongeante'),S('illusion-neck','Illusion'),S('draped-neck','Drapée')
 ]),
 F('collars','COLS',[
  S('shirt-collar','Col chemise'),S('peter-pan-collar','Col Claudine'),S('stand-collar','Col montant'),S('mandarin-collar','Col officier'),S('shawl-collar','Col châle'),S('lapels','Revers tailleur'),S('bow-collar','Lavallière'),S('cowl-collar','Col bénitier'),S('sculptural-collars','Cols sculpturaux')
 ]),
 F('backs','DOS',[
  S('closed-back','Dos fermé'),S('v-back','Dos V'),S('open-back','Dos nu / ouvert'),S('keyhole-back','Dos goutte'),S('lace-up-back','Dos lacé'),S('corset-back','Dos corseté'),S('sheer-back','Dos transparent'),S('cross-back','Dos croisé'),S('draped-back','Dos drapé'),S('cutout-back','Dos découpé')
 ]),
 F('outerwear','VESTES & MANTEAUX',[
  S('blazers','Blazers'),S('tuxedo-jackets','Vestes smoking'),S('cropped-jackets','Vestes courtes'),S('oversized-jackets','Vestes oversize'),S('bombers','Bombers'),S('biker-jackets','Perfectos'),S('denim-jackets','Vestes denim'),S('trench-coats','Trenchs'),S('straight-coats','Manteaux droits'),S('cocoon-coats','Manteaux cocon'),S('capes','Capes'),S('belted-coats','Manteaux ceinturés'),S('suit-vests','Gilets de costume')
 ]),
 F('construction','CONSTRUCTION',[
  S('waistlines','Lignes de taille'),S('fitted-cuts','Coupes ajustées'),S('semi-fitted-cuts','Semi-ajustées'),S('oversized-cuts','Oversize'),S('a-lines','Lignes A'),S('column-lines','Lignes colonne'),S('mermaid-lines','Lignes sirène'),S('cocoon-volumes','Volumes cocon'),S('shoulders','Épaules'),S('princess-seams','Découpes princesse'),S('geometric-panels','Découpes géométriques'),S('layering','Superpositions'),S('insets','Empiècements'),S('boning','Baleines'),S('crinolines','Crinolines'),S('petticoats','Jupons'),S('volume-padding','Volumes & rembourrages')
 ]),
 F('details','DÉTAILS & FINITIONS',[
  S('ruffles','Volants'),S('gathers','Fronces'),S('pleats','Plis'),S('drapes','Drapés'),S('bows','Nœuds'),S('laces','Lacets'),S('buttons','Boutons'),S('zippers','Zips'),S('pockets','Poches'),S('piping','Passepoils'),S('bias','Biais'),S('slits','Fentes'),S('cutouts','Découpes'),S('embroidery','Broderies'),S('beading','Perles'),S('sequins','Sequins'),S('rhinestones','Strass'),S('appliques','Applications'),S('feathers','Plumes'),S('fringes','Franges')
 ]),
 F('trains','TRAÎNES & AJOUTS',[
  S('sweep-train','Traîne balayage'),S('short-train','Traîne courte'),S('chapel-train','Traîne chapelle'),S('cathedral-train','Traîne cathédrale'),S('detachable-train','Traîne amovible'),S('overskirts','Surjupes'),S('capes-addons','Capes'),S('veils','Voiles'),S('floating-panels','Panneaux flottants')
 ]),
 F('lingerie','LINGERIE',[
  S('bras','Soutiens-gorge'),S('balconettes','Balconnets'),S('lingerie-bandeaux','Bandeaux'),S('lingerie-corsets','Corsets lingerie'),S('bustiers-lingerie','Guêpières'),S('lingerie-bodies','Bodies'),S('briefs','Culottes'),S('boyshorts','Shortys'),S('tangas','Tangas'),S('garter-belts','Porte-jarretelles')
 ]),
 F('swimwear','MAILLOTS',[
  S('one-piece','Une-pièce'),S('bikinis','Bikinis'),S('high-waist-bikinis','Bikinis taille haute'),S('trikinis','Trikinis'),S('couture-swim','Maillots couture')
 ]),
 F('accessories','ACCESSOIRES',[
  S('bags','Sacs'),S('belts','Ceintures'),S('gloves','Gants'),S('scarves','Foulards'),S('hats','Chapeaux'),S('headpieces','Coiffes'),S('glasses','Lunettes'),S('fans','Éventails'),S('body-jewelry','Bijoux de corps')
 ]),
 F('shoes','CHAUSSURES',[
  S('pumps','Escarpins'),S('sandals','Sandales'),S('boots','Bottes'),S('ankle-boots','Bottines'),S('platforms','Plateformes'),S('ballet-flats','Ballerines'),S('sneakers','Sneakers'),S('stage-shoes','Chaussures de scène')
 ]),
 F('jewelry','BIJOUX',[
  S('necklaces','Colliers'),S('earrings','Boucles d’oreilles'),S('bracelets','Bracelets'),S('brooches','Broches'),S('waist-jewelry','Bijoux de taille'),S('hair-jewelry','Bijoux de cheveux')
 ]),
 F('materials','MATIÈRES',[
  S('silk','Soie'),S('satin','Satin'),S('chiffon','Mousseline'),S('tulle','Tulle'),S('organza','Organza'),S('lace','Dentelle'),S('velvet','Velours'),S('cotton','Coton'),S('jersey','Jersey'),S('knit','Maille'),S('denim','Denim'),S('leather','Cuir'),S('tweed','Tweed'),S('jacquard','Jacquard'),S('brocade','Brocart'),S('wool','Lainage'),S('technical','Matières techniques'),S('sheer-materials','Matières transparentes')
 ]),
 F('patterns','MOTIFS',[
  S('floral','Fleurs'),S('geometric','Géométriques'),S('stripes','Rayures'),S('polka-dots','Pois'),S('checks','Carreaux'),S('animal','Animalier'),S('paisley','Paisley'),S('abstract','Abstrait'),S('figurative','Figuratif'),S('historical','Historique')
 ]),
 F('techniques','TECHNIQUES',[
  S('draping','Drapé'),S('moulage','Moulage'),S('pleating','Plissé'),S('smocking','Smocks'),S('embroidery-technique','Broderie'),S('beading-technique','Perlage'),S('applique-technique','Appliqué'),S('quilting','Matelassage'),S('crochet','Crochet'),S('knitting','Tricot'),S('braiding','Tressage'),S('printing','Impression'),S('dyeing','Teinture'),S('laser-cut','Découpe laser'),S('textile-manipulation','Manipulation textile')
 ]),
 F('inspirations','INSPIRATIONS',[
  S('architecture','Architecture'),S('nature','Nature'),S('flowers','Fleurs'),S('landscapes','Paysages'),S('objects','Objets'),S('art','Art'),S('cinema','Cinéma'),S('music','Musique'),S('dance','Danse'),S('history','Histoire'),S('cultures','Cultures'),S('heritage','Patrimoine'),S('crafts','Artisanat'),S('travel','Voyages')
 ]),
 F('archives','ARCHIVES MODE',[
  S('decades','Décennies'),S('movements','Mouvements'),S('historical-silhouettes','Silhouettes historiques'),S('historical-details','Détails anciens'),S('haute-couture','Haute couture'),S('ready-to-wear','Prêt-à-porter'),S('stage-costume','Scène'),S('costume','Costume')
 ]),
 F('personal-book','BOOK PERSONNEL',[
  S('own-sketches','Mes croquis'),S('photos','Mes photos'),S('past-moodboards','Mes moodboards'),S('finished-creations','Mes créations'),S('favorite-details','Mes détails favoris'),S('favorite-palettes','Mes palettes favorites')
 ])
];
const tagGroups={
 fit:['ajusté','semi-ajusté','oversize','boxy','près-du-corps','ample'],
 length:['micro','court','crop','midi','long','maxi'],
 volume:['plat','fluide','structuré','bouffant','sculptural','cocon','évasé'],
 line:['droit','trapèze','A','colonne','sirène','asymétrique'],
 shoulder:['naturelle','tombante','structurée','rembourrée','dénudée'],
 transparency:['opaque','semi-transparent','transparent','illusion'],
 style:['minimaliste','romantique','couture','tailoring','streetwear','sportswear','lingerie','avant-garde','classique','bohème','glamour'],
 occasion:['quotidien','bureau','cocktail','gala','mariage','tapis rouge','scène','défilé','cérémonie','soirée'],
 era:['historique','1920s','1930s','1940s','1950s','1960s','1970s','1980s','1990s','2000s','contemporain'],
 origin:['France','Europe','Afrique','Asie','Amériques','Océanie','Méditerranée'],
 source:['école','musée','archive','artisan','mercerie','voyage','boutique','cliente','Book','création personnelle'],
 mastery:['connue','découverte','maîtrisée']
};
const statuses={known:{id:'known',label:'Connue'},discovered:{id:'discovered',label:'Découverte'},mastered:{id:'mastered',label:'Maîtrisée'}};
function family(id){return families.find(f=>f.id===id)||null}
function sub(id){for(const f of families){const s=f.subs.find(x=>x.id===id);if(s)return {...s,familyId:f.id,familyLabel:f.label}}return null}
function search(q){const s=String(q||'').trim().toLowerCase();if(!s)return[];const out=[];for(const f of families){if(f.label.toLowerCase().includes(s)||f.id.includes(s))out.push({type:'family',...f});for(const x of f.subs){const hay=[x.id,x.label,...(x.aliases||[])].join(' ').toLowerCase();if(hay.includes(s))out.push({type:'subcategory',familyId:f.id,familyLabel:f.label,...x})}}return out}
window.HCAtelierTaxonomy={version:1,families,tagGroups,statuses,family,sub,search};
window.dispatchEvent(new CustomEvent('hc-atelier-taxonomy-ready',{detail:{version:1}}));
})();