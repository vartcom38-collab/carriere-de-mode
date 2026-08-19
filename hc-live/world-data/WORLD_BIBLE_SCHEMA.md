# Haute Couture — World Bible schema

Cette base sert à construire le monde jouable territoire par territoire.

## Règle de séparation
- **Réel vérifié** : géographie, monuments, musées, patrimoine, collections, savoir-faire, personnages historiques, faits culturels.
- **Fictif de jeu** : PNJ persistants, galeries/ateliers inventés, intrigues, missions, négociations, rencontres, autorisations, collaborations.
- Les fiches doivent toujours signaler explicitement ce qui est `real` et ce qui est `fictional`.

## Hiérarchie
`France → Région → Département → Commune/Ville → Lieu → Découverte`

## Structure d'un territoire
Chaque département contient :
- `territories` : villes, villages, zones naturelles et pôles culturels intéressants.
- `realPlaces` : lieux réels vérifiés.
- `fictionalPlaces` : lieux narratifs cohérents mais inventés.
- `npcs` : personnages fictifs persistants liés au territoire.
- `encounters` : rencontres contextuelles.
- `missions` : situations acceptables/refusables déclenchées localement.
- `events` : événements temporaires ou saisonniers.
- `drawingLessons` : cours de dessin liés aux découvertes.
- `unlockCatalog` : vêtements, détails, chaussures, accessoires, motifs, palettes, matières, silhouettes, shootings.
- `visualProduction` : visuels à générer plus tard pour rendre le territoire jouable.

## Fiche d'un lieu réel
Champs recommandés :
- `id`, `name`, `commune`, `department`, `region`, `kind`, `reality: "real"`
- `sourceNotes` : résumé factuel vérifié
- `culture` : histoire, époque, architecture, usages, artistes/personnalités, collections
- `creativeReading` : formes, matières, couleurs, textures, lumière, mouvement, symboles
- `fashionKnowledge` : vêtement, textile, accessoires, construction, techniques, histoire de la mode
- `keywords` : mots-clés de recherche du carnet
- `visit` : durée de jeu, coût indicatif de jeu, conditions, revisitable
- `discoveries` : pages carnet débloquées
- `unlocks` : ids du catalogue créatif
- `drawingLessons` : ids de cours
- `shootingPotential` : potentiel, conditions fictives futures
- `encounterHooks` : ids de rencontres possibles
- `missionHooks` : ids de missions possibles

## Déblocages créatifs
Chaque visite peut débloquer plusieurs familles :
- prêt-à-styliser : hauts, bas, robes, manteaux, chaussures, sacs, bijoux, coiffures
- composants : cols, manches, plis, drapés, fermetures, poches, empiècements
- motifs : répétitions, broderies, textures, ornements
- palettes
- matières / rendus
- poses / silhouettes
- fonds de shooting
- cours de dessin

Le lieu ne doit pas automatiquement produire une « collection toute faite ». Il enrichit le vocabulaire créatif du joueur.

## Cours de dessin
Niveaux :
1. `trace` — suivre des repères
2. `guided` — construire étape par étape
3. `memory` — redessiner avec peu de guides
4. `variation` — transformer le modèle
5. `creation` — créer une version personnelle à partir des inspirations du lieu

Chaque cours indique :
- objet dessiné
- prérequis
- étapes
- erreurs fréquentes
- compétences gagnées
- modèle prêt-à-utiliser éventuellement débloqué
- variantes

## PNJ persistants
Chaque PNJ fictif possède :
- métier, personnalité, goûts, valeurs
- lieux habituels
- réseau local
- relation / confiance / mémoire des conversations
- évolution possible dans le temps
- missions, recommandations et arcs narratifs

Un PNJ déjà rencontré reste le même lors d'un retour plusieurs années de jeu plus tard.

## Principe de gameplay voyage
Une visite peut donner :
`culture + connaissance + inspiration + carnet + déblocages + apprentissage + rencontre + opportunité`

Mais rien n'est obligatoire : le joueur choisit ses visites, peut repartir sans tout voir et revenir plus tard.
