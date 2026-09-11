# LOIRE — AUDIT DE COUVERTURE TERRITORIALE V1

Date : 11 septembre 2026
Branche : `territoires-france`
Département : Loire (42)

## Verdict

**DENSE / RUNTIME TERRITORIAL OPÉRATIONNEL / VALIDÉ EN CHROMIUM**

La Loire possède désormais une base départementale existante complétée par une couche dense additive. Le département n'est pas réduit à Saint-Étienne : plusieurs bassins de vie, patrimoines productifs, paysages et clientèles ont des fonctions de gameplay différentes.

## Validation navigateur réelle — 11 septembre 2026

Scénario de référence : **Saint-Chamond · tresses, lacets & ruban**.

Le run Chromium vérifie :
- présence physique de Marion à Saint-Chamond ;
- vraie couche dense chargée avec **256 personnages, 416 briefs, 120 secrets et 72 familles d’événements** ;
- marqueur `lo42-sc-tresses` réellement produit par `loire-dense-universe-v1.js` ;
- affichage `PHOTO RÉELLE` avec source Ville de Saint-Chamond ;
- 4 actions contextuelles ;
- consommation de **20 minutes** sur l’action testée ;
- mémoire persistée ;
- focus Lyon traité en aperçu sans téléportation ;
- rendu distinct du contenu fictif ;
- absence du runtime Gard/Nîmes hors Gard.

## Socle déjà présent et conservé

- Saint-Étienne — ruban, Jacquard, textile, design, industrie, prototypes.
- Charlieu — soierie, chaîne-trame, transmission et patrimoine textile.
- Roanne — habillement, production, petites séries et réseau professionnel.
- Saint-Chamond — vallée du Gier, industrie, vêtement fonctionnel.
- Montbrison — Forez, marché, clientèle et cérémonie.
- Firminy — architecture moderne, géométrie, volume et image.
- Feurs — marché, quotidien et petites commandes.

Le moteur `loire-territorial-gameplay-v1.js` existant reste la base de mémoire et de signaux : rencontres, briefs, secrets, événements et références Atelier/Book.

## Extension dense V1

Pôles renforcés ou ajoutés :

1. Saint-Chamond — tresses, lacets, ruban, teinture, finitions et mémoire industrielle.
2. Rive-de-Gier — vallée industrielle, workwear, métal, structure, réemploi et photographie.
3. Firminy — Modulor, proportion, architecture portée, coupe et éditorial.
4. Feurs — marché, cérémonie, retouche, clientèle quotidienne et événements locaux.
5. Saint-Bonnet-le-Château — patrimoine, objet précieux, accessoires, petites séries et artisanat.
6. Boën-sur-Lignon — proximité, marché, réparation, lin/laine et palette du Lignon.
7. Noirétable — Haut-Forez, forêt, froid, maille, protection et réparation.
8. Saint-Galmier — eau, patrimoine, élégance, cérémonie et villégiature contemporaine.

## Volumes de la couche dense

Génération déterministe par ville :

- 32 personnages × 8 villes = **256 personnages**
- 52 briefs × 8 villes = **416 briefs**
- 15 secrets × 8 villes = **120 secrets**
- 9 familles événementielles × 8 villes = **72 familles d'événements**

Ces nombres s'ajoutent aux banques et contenus déjà existants de Saint-Étienne, Roanne, Charlieu, Montbrison et au moteur départemental. Ils ne doivent pas être additionnés à des contacts identiques si une future migration fusionne les banques.

## Qualité des personnages

La nouvelle banque n'utilise pas le placeholder `Contact <ville> <n>` : les personnages reçoivent un nom fictionnel, un rôle, un quartier/secteur et deux traits de base. Les relations approfondies restent à faire par les systèmes sociaux génériques ou une future passe personnages.

## Documentation réelle / fiction gameplay

Références documentaires structurantes :

- Saint-Chamond : moulinage de la soie, industrie rubanière, puis développement majeur des tresses et lacets ; patrimoine des fabriques et teintureries.
- Firminy : ensemble Le Corbusier et concept du Modulor utilisés comme références de proportion, volume et rapport au corps.
- Saint-Galmier : patrimoine historique, vestiges de thermes romains et source d'eau minérale.

Règle : une référence historique réelle sert de contexte, de recherche ou d'inspiration. Les personnages, commandes, ateliers secrets, ventes, collaborations et opportunités créés par les banques sont **FICTION GAMEPLAY**, sauf mention explicite contraire.

## Carte

La carte de base `loire-map-content-v1.js` est conservée.

Le complément `loire-dense-map-addon-v1.js` ajoute notamment :
- Rive-de-Gier
- Saint-Bonnet-le-Château
- Boën-sur-Lignon
- Noirétable
- Saint-Galmier

`loire-dense-universe-v1.js` ajoute des références plus détaillées dans les huit pôles de l'extension.

## Intégration runtime

`territorial-signal-runtime-v1.js` charge automatiquement, lorsque la présence physique est dans le département 42 :

- `loire-dense-map-addon-v1.js`
- `loire-dense-universe-v1.js`
- `loire-dense-city-banks-v1.js`

Le store Loire est connu du rattrapage des signaux : `haute-couture-loire-territorial-gameplay-v1`.

Les signaux alimentent Téléphone, Agenda, Atelier et Book via le pont générique.

## Règle de déplacement

**Consulter ou focaliser la Loire sur la carte ne téléporte jamais Marion.**

Résidence, présence physique et focus de carte restent des états distincts. Les packs de gameplay dense s'activent sur la présence réelle départementale.

## Extensions futures non bloquantes

- approfondir Pilat / Saint-Genest-Malifaux pour forêt, laine, climat et randonnée ;
- approfondir vallée de l'Ondaine au-delà de Firminy ;
- ajouter davantage de réseaux couture contemporains à Roanne ;
- écrire des personnages majeurs entièrement scénarisés dans chaque bassin ;
- documenter plus finement les événements datés réels avant de les utiliser comme éditions historiques.

Ces extensions ne sont pas nécessaires pour considérer la Loire comme jouable à l'échelle territoriale actuelle.
