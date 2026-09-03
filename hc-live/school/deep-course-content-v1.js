/* Haute Couture Live — contenus pédagogiques approfondis v1.
   Synthèse originale inspirée de programmes publics/officiels (IFM, ESMOD, FIT) ; pas reproduction de cours propriétaires. */
(function(){
'use strict';
if(window.HCDeepCourses)return;
const deep={
 'w1-drawing':{
  objectives:['Comprendre la ligne d’action','Construire une figure simple avant les détails','Identifier appuis, bassin et épaules','Utiliser l’allongement de mode sans perdre la cohérence anatomique','Traduire une silhouette par masses'],
  vocabulary:[['ligne d’action','axe gestuel principal qui donne énergie et direction à la pose'],['appui','zone du corps qui porte réellement le poids'],['contre-posto','déséquilibre contrôlé entre bassin et épaules lié à l’appui'],['silhouette','lecture globale du contour et des proportions'],['croquis gestuel','dessin court qui cherche mouvement et structure plutôt que détail']],
  chapters:[
   {title:'1 · Voir le geste avant le corps',text:'Avant de construire une figure, cherche une direction principale. La ligne d’action n’est ni la colonne vertébrale anatomique exacte ni un contour : c’est une simplification du mouvement. Une pose raide possède malgré tout une direction. Une pose en marche combine inclinaison du tronc, décalage du bassin et projection d’un membre. Commencer par le geste évite de fabriquer un mannequin figé.'},
   {title:'2 · Réduire le corps à quelques masses',text:'Travaille d’abord avec tête, cage thoracique, bassin, bras et jambes. La cage thoracique et le bassin peuvent être représentés comme deux volumes orientés. Leur angle relatif donne immédiatement de la vie à la pose. Les articulations ne sont pas des décorations : elles déterminent où le corps peut changer de direction.'},
   {title:'3 · Poids et équilibre',text:'Demande toujours : quelle jambe porte le poids ? Dans une station contrapposto, la jambe d’appui tend à stabiliser le bassin alors que l’autre se libère. Le bassin s’incline et les épaules compensent souvent en sens opposé. Si la verticale du centre de masse tombe trop loin de l’appui, la pose semble tomber.'},
   {title:'4 · Proportions de mode',text:'Les proportions de mode peuvent être allongées pour mieux présenter la silhouette du vêtement. L’allongement ne doit pas effacer les repères essentiels : position des épaules, taille, bassin, genoux et pieds. Commence avec une figure cohérente puis étire progressivement certaines distances. Ne change pas chaque partie indépendamment au hasard.'},
   {title:'5 · Du corps au vêtement',text:'Une fois la pose lisible, dessine le vêtement par grandes masses : largeur d’épaules, taille, longueur, volume autour des hanches, évasement, asymétrie. Ne commence pas par les boutons, poches ou motifs. Un vêtement réussi en croquis reste compréhensible même sans détails.'},
   {title:'6 · Plis : tension, compression, gravité',text:'Les plis ne sont pas des zigzags décoratifs. Ils apparaissent autour de points de tension, de compression, d’appui ou sous l’effet de la gravité. Un tissu souple produit des plis plus nombreux et fluides ; une matière raide garde des plans plus grands ; une matière lourde tire davantage vers le bas.'}
  ],
  mistakes:['Dessiner le contour complet avant l’axe','Placer bassin et épaules parfaitement horizontaux dans toutes les poses','Allonger les jambes sans ajuster le reste de la figure','Ajouter les détails avant la masse du vêtement','Dessiner des plis sans point de tension identifiable'],
  guidedPractice:[
   {title:'Échauffement 10 minutes',steps:['20 lignes longues sans lever le stylet','10 courbes en S','10 ellipses rapides','5 silhouettes en 30 secondes']},
   {title:'Appuis',steps:['Dessine 4 lignes d’action','Ajoute cage thoracique et bassin','Choisis la jambe d’appui','Trace une verticale de contrôle','Corrige jusqu’à ce que la pose semble stable']},
   {title:'Silhouette vêtement',steps:['Choisis une pose','Ajoute 3 vêtements très différents uniquement par contour','Compare ajusté / droit / volumineux','Ajoute seulement ensuite 3 détails maximum']}
  ],
  homework:'Réalise une planche de 12 silhouettes : 4 poses debout, 4 en mouvement, 4 assises ou inclinées. Pour chaque silhouette, note en une phrase où se trouve l’appui et quelle décision de volume vestimentaire tu as prise.',
  stylusRoute:'../school-drawing/'
 },
 'w1-textile':{
  objectives:['Distinguer fibre, fil et étoffe','Comprendre tissé et maille sans mémoriser un catalogue','Observer chaîne, trame, biais et droit-fil','Décrire la main, le poids, la souplesse et le tombé','Relier comportement textile et décision de design'],
  vocabulary:[['fibre','élément de base pouvant être filé ou assemblé'],['fil','ensemble continu de fibres ou filament utilisé pour construire une étoffe'],['étoffe','surface textile obtenue notamment par tissage, tricotage ou autres procédés'],['chaîne','fils longitudinaux d’un tissu tissé'],['trame','fils transversaux croisant la chaîne'],['biais','direction oblique par rapport à chaîne et trame, souvent plus déformable'],['main','sensation tactile générale d’une étoffe'],['tombé','manière dont une étoffe chute, plie et réagit à la gravité']],
  chapters:[
   {title:'1 · Ne pas confondre matière et étoffe',text:'Coton, laine ou polyester désignent d’abord des familles de fibres ; toile, sergé, satin, jersey ou feutre décrivent des structures ou familles d’étoffes. Une même fibre peut donner plusieurs étoffes très différentes. À l’école, le but est d’apprendre à analyser ces relations, pas de mémoriser tous les textiles existants.'},
   {title:'2 · Tissé et maille',text:'Un tissu tissé repose sur l’entrecroisement de deux systèmes de fils, chaîne et trame. Une maille repose sur des boucles interconnectées. Cette différence structurelle influence élasticité, stabilité, bord roulotté éventuel, déformation et comportement lors de la coupe.'},
   {title:'3 · Droit-fil et biais',text:'Le droit-fil correspond généralement à la direction de chaîne. Il structure l’aplomb et la stabilité du vêtement. Le biais, situé approximativement à 45° dans un tissu équilibré, offre davantage de déformation et peut donner un tombé plus fluide. Utiliser le biais modifie profondément le comportement d’une pièce.'},
   {title:'4 · Construire un vocabulaire tactile',text:'Évite “joli”, “doux” ou “pas agréable” comme seules descriptions. Essaie : sec, gras, nerveux, mou, compact, spongieux, glissant, rêche, duveteux, craquant, transparent, opaque, extensible, ressortissant. Le vocabulaire sert à prévoir les volumes avant même de patronner.'},
   {title:'5 · Poids, épaisseur et tombé',text:'Poids et épaisseur ne sont pas exactement synonymes. Une étoffe peut être épaisse mais légère, ou fine mais dense. Observe comment elle forme un pli, si le pli reste net, s’il s’écrase, s’il rebondit, et comment la lumière révèle son relief.'},
   {title:'6 · Tester avant de choisir',text:'Avant d’attribuer un usage, plie, froisse, suspend, étire doucement, superpose et éclaire la matière. Le choix textile est un test de comportement. Une silhouette dessinée sans tenir compte de ce comportement peut devenir irréalisable ou produire un résultat très différent.'}
  ],
  mistakes:['Croire qu’une fibre correspond à un seul tissu','Choisir un tissu uniquement par couleur','Ignorer le droit-fil','Confondre poids et épaisseur','Nommer une matière avant de l’observer','Penser qu’un tissu plus cher convient automatiquement mieux'],
  guidedPractice:[
   {title:'Fiche matière sans nom',steps:['Choisis 3 étoffes autour de toi','Cache ou ignore leur nom','Décris surface et main','Teste pli et froissage','Observe tombé suspendu','Propose un usage puis justifie']},
   {title:'Droit-fil / biais',steps:['Prends un tissu tissé simple','Repère lisière si visible','Teste traction chaîne','Teste traction trame','Teste traction oblique','Compare les déformations']}
  ],
  homework:'Constitue 5 fiches matière. Ne cherche le nom exact qu’à la fin. Pour chacune : structure supposée, poids relatif, souplesse, élasticité, surface, tombé, transparence et deux usages possibles.',
  discoveryRule:'Ce cours ne débloque aucun catalogue complet : chaque étoffe précise, technique régionale ou matière rare reste une découverte indépendante.'
 },
 'w1-pattern':{
  objectives:['Comprendre pourquoi un patron représente un volume en 2D','Lire droit-fil, ligne de couture, valeurs et repères','Distinguer aisance de confort et aisance de style','Comprendre le rôle d’une pince','Préparer la progression jupe → corsage/chemise → manches/cols → robe → pantalon'],
  vocabulary:[['patron de base','construction de référence servant de point de départ aux transformations'],['ligne de couture','ligne théorique où les pièces sont assemblées'],['valeur de couture','marge ajoutée autour de la ligne de couture pour permettre l’assemblage'],['aisance de confort','espace nécessaire au mouvement et à la respiration'],['aisance de style','volume ajouté ou retiré volontairement pour la silhouette'],['pince','retrait contrôlé de surface qui transforme une forme plane en volume'],['cran','petit repère aidant à faire correspondre des pièces'],['aplomb','équilibre vertical correct du vêtement sur le corps']],
  chapters:[
   {title:'1 · Du corps 3D au patron 2D',text:'Le patron est une représentation plane destinée à redevenir volume après coupe et assemblage. Certaines zones du corps peuvent être approchées par des surfaces relativement planes ; d’autres exigent retraits, découpes ou volumes. Le modélisme consiste à contrôler cette transformation.'},
   {title:'2 · Mesure corporelle et aisance',text:'Une mesure du corps n’est pas automatiquement la mesure du vêtement. Il faut déterminer l’aisance nécessaire. Une jupe près du corps exige malgré tout un minimum de mouvement ; un manteau demande davantage d’espace ; une silhouette oversize transforme volontairement les proportions.'},
   {title:'3 · La pince comme transfert de volume',text:'Imagine une feuille plate posée sur un volume arrondi : elle crée un excès. En retirant un secteur puis en rapprochant les bords, on forme une pince. Une pince peut souvent être déplacée autour d’un même point de volume en ouvrant une nouvelle ligne et en fermant l’ancienne.'},
   {title:'4 · Repères indispensables',text:'Un patron lisible indique pièce, taille, quantité à couper, droit-fil, milieu, crans, lignes importantes et informations nécessaires à l’assemblage. Les valeurs de couture doivent être distinguées de la ligne réelle d’assemblage.'},
   {title:'5 · Ordre d’apprentissage',text:'Une progression débutante cohérente commence souvent par une jupe droite parce qu’elle permet de travailler mesures, pinces, côtés, taille, fermeture et ourlet avec une géométrie relativement lisible. Viennent ensuite transformations, corsage/chemise, manches et cols, robe et pantalon.'},
   {title:'6 · Toile et essayage',text:'Une toile permet de tester le patron avant le tissu final. On contrôle lignes horizontales et verticales, aisance, tensions, plis parasites, équilibre devant/dos et position des coutures. Une correction réussie doit être reportée sur le patron.'}
  ],
  mistakes:['Ajouter des valeurs de couture sans distinguer la ligne d’assemblage','Confondre mesure corps et mesure vêtement','Déplacer une pince sans conserver sa logique de volume','Oublier droit-fil et crans','Corriger uniquement la toile sans corriger le patron','Chercher à construire un pantalon complexe avant les bases'],
  guidedPractice:[
   {title:'Lecture de patron',steps:['Dessine une pièce simple','Ajoute droit-fil','Ajoute ligne de taille ou bassin','Ajoute crans','Ajoute ligne de couture','Ajoute valeur de couture avec une autre convention graphique']},
   {title:'Comprendre la pince',steps:['Dessine un cercle représentant le point de volume','Trace une pince arrivant avant ce point','Imagine sa fermeture','Dessine une nouvelle direction de pince','Ferme mentalement la première et ouvre la seconde']}
  ],
  homework:'Dessine un mini-patron pédagogique de jupe devant et dos, sans chercher encore les dimensions parfaites. Fais apparaître : milieu, côté, taille, bassin, droit-fil, pince(s), fermeture supposée, crans et valeurs de couture. Explique en 8 à 12 lignes la fonction de chaque information.',
  progression:['Jupe droite','Transformations de jupe','Corsage ou chemise','Manipulation de pinces','Emmanchure et manche','Cols','Robe et introduction au moulage','Pantalon']
 }
};
function get(id){return deep[id]||null}
window.HCDeepCourses={version:1,get,all:deep};
})();