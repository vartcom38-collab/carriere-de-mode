# Haute Couture Live — contrat de contenu territorial France

## But
Créer une France explorable sur plusieurs décennies de temps de jeu sans épuiser le contenu ni accélérer artificiellement la carrière. La carte sert de porte d’entrée ; les territoires nourrissent l’agenda, le téléphone, Ateliergram, l’atelier, les relations, les missions et les collections.

## Hiérarchie des fichiers
- `france-territories.js` : registre national, régions + départements.
- `regions/<code>.js` : identité d’une région, écosystèmes, grands axes, progression régionale, traditions/matières, grands hubs.
- `departments/<code>.js` : villes, villages, espaces naturels, lieux visitables, commerces, culture, artisanat, personnages, secrets, événements et tables de renouvellement.
- Les villes n’ont pas besoin d’un fichier par commune au départ : un département peut contenir des centaines de points potentiels et charger des sous-fichiers seulement quand il devient très dense.

## Contrat d’un lieu
Chaque lieu réel ou inspiré du réel doit pouvoir exposer :
- identité : `id`, nom, commune, département, région, coordonnées ou ancrage cartographique ;
- catégorie : monument, musée, marché, mercerie, atelier, friperie, brocante, galerie, bibliothèque, école, café, nature, quartier, plage, manade, fabrique, patrimoine, événement, lieu caché ;
- disponibilité : permanent, saisonnier, jour de marché, événement daté, météo, réputation, relation, mission, découverte préalable ;
- temps : durée de visite, trajet éventuel, créneau conseillé ;
- carnet : résumé en français, histoire, détails à observer, plusieurs photos réelles autorisées à l’affichage ;
- gameplay : inspiration, matière, motif, palette, patron, détail de construction, objet trouvé, photo Ateliergram, story, contact, indice, relation, mission ou opportunité ;
- mémoire : première visite, visites suivantes, éléments déjà découverts, événements rares déjà vus ;
- renouvellement : variantes de visite et conséquences différentes pour éviter qu’un retour donne toujours la même scène.

## Rareté et déblocage
Un lieu ne livre jamais tout à la première visite. Il peut avoir :
- `visible` : connu sur la carte ;
- `discovered` : visité au moins une fois ;
- `layers` : couches de contenu successives ;
- `secrets` : découvertes rares ou conditionnelles ;
- `repeatPool` : scènes renouvelables ;
- `seasonalPool` : scènes par saison ;
- `careerPool` : contenu selon niveau de carrière ;
- `relationshipPool` : contenu selon personnages connus.

Exemple : les Arènes de Nîmes peuvent d’abord donner architecture/volumes + photo sociale. Une visite ultérieure peut ouvrir un détail de drapé, un événement, une rencontre ou une piste vers une autre adresse. Rien n’oblige à tout dévoiler immédiatement.

## Catégories de récompenses
Les récompenses doivent être petites et nombreuses, rarement des sauts directs de carrière :
- `inspiration`: tags, formes, volumes, lignes, couleur, texture ;
- `atelier`: motif, matière, finition, patron de base, technique, composant ;
- `social`: média, caption contextuelle, story, highlight, localisation ;
- `network`: contact, introduction, confiance, rumeur, invitation ;
- `collection`: objet trouvé, archive, bouton, bijou, galon, pièce vintage préparée ;
- `knowledge`: page de carnet, histoire de mode, référence culturelle ;
- `career`: très rarement réputation ou opportunité directe.

## Objets trouvés / archives
Les pièces découvertes (veste ancienne, bouton, passementerie, fragment textile, accessoire, patron d’archive, carte postale, etc.) sont des objets préparés par le jeu, pas dessinés par le joueur. Elles peuvent :
- entrer dans l’inventaire ;
- être restaurées ;
- inspirer une création ;
- fournir un détail réutilisable dans l’atelier ;
- être photographiées ;
- déclencher une enquête ou une histoire ;
- être revendues, conservées, offertes ou prêtées selon le type d’objet.

Pour les maisons/créateurs historiques réels, le jeu doit distinguer faits historiques vérifiés et fiction gameplay. Ne pas inventer une provenance réelle pour un objet fictif : utiliser des formulations du type « pièce vintage dans l’esprit de… », « archive attribuée dans le jeu », ou rattacher uniquement ce qui est documenté.

## Personnages
Chaque territoire possède plusieurs pools :
- habitants/contacts ordinaires ;
- artisans et commerçants ;
- clientes ;
- créateurs locaux fictifs ;
- journalistes / photographes / organisateurs ;
- personnages saisonniers ;
- personnages rares ;
- références historiques réelles utilisées seulement pour contenu documentaire.

Les mêmes personnages ne doivent pas monopoliser un territoire. Les rencontres utilisent des poids, cooldowns, saisons, conditions et états de relation.

## Écosystèmes
Un département ne se résume pas à ses villes. Il contient des écosystèmes : littoral, montagne, vallée, vignoble, Camargue, Cévennes, bassin industriel, villages de pierre, stations, ports, etc. Un écosystème peut proposer ses propres itinéraires et lieux.

Exemple Gard : Nîmes + Aigues-Mortes + Saint-Gilles + Camargue gardoise + Cévennes gardoises + Uzège/Pont du Gard, avec des contenus et rythmes distincts.

## Carte
Pas une forêt de points. Utiliser des symboles par famille :
- patrimoine/culture ;
- mode/artisanat ;
- marché/brocante ;
- nature/route ;
- rencontre ;
- événement ;
- secret (caché jusqu’au déblocage).

Au zoom : les symboles se détaillent. Au clic : ouverture du carnet du lieu, photos, informations, disponibilité, ce qui est connu/déjà découvert et bouton pour planifier dans l’agenda.

## Boucle de jeu territoriale
1. Voir ou entendre parler d’un lieu.
2. Ouvrir son carnet.
3. Planifier la visite dans l’agenda.
4. Voyager : consommation de temps de jeu uniquement.
5. Vivre une scène / choisir éventuellement une réponse.
6. Recevoir quelques découvertes cohérentes.
7. Alimenter atelier, téléphone, Ateliergram, relations et carnet.
8. Laisser des couches non découvertes pour les prochaines années.

## Longévité 20–30 ans de temps de jeu
- progression de réputation lente ;
- récompenses de visite surtout latérales, pas verticales ;
- peu de contenus exclusifs à usage unique ;
- événements annuels et saisonniers renouvelables ;
- rotation de personnages ;
- visites répétées avec nouveaux pools ;
- nouveaux lieux révélés par bouche-à-oreille, relation, agenda, média ou voyage ;
- contenu haut niveau débloqué après plusieurs années de carrière ;
- rareté forte pour les archives et rencontres majeures ;
- aucun territoire « terminé à 100 % » rapidement.

## Règle d’intégration
Chaque nouveau contenu territorial doit connecter au moins deux autres systèmes du jeu, idéalement trois : agenda + Ateliergram, atelier + inventaire, relation + mission, carnet + social, etc.
