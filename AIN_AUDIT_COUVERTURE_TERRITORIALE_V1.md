# AIN — AUDIT COUVERTURE TERRITORIALE V1

Statut : **DENSE / RUNTIME TERRITORIAL OPÉRATIONNEL / E2E CHROMIUM VALIDÉ**

## Pôles couverts
- Bourg-en-Bresse — capitale départementale, architecture, cérémonie, photographie, clientèle, métiers d’art.
- Oyonnax — peigne, plasturgie, acétate, lunetterie, prototype, design et accessoire.
- Jujurieux — soieries, velours, tissage, archives, mémoire industrielle textile.
- Pérouges — patrimoine, pierre, photographie, cérémonie, vintage et réemploi.
- Gex / Pays de Gex — clientèle transfrontalière, Genève, Monts Jura, savoir-faire et mobilité.
- Ferney-Voltaire — culture, réception, représentation et réseau international.
- Mijoux — lapidaire, pierre, bijou/accessoire, froid jurassien.
- Belley / Bugey — clientèle locale, vallée, cérémonie, matières sobres.
- Villars-les-Dombes / Dombes — eau, lumière, mariage, photographie, saisonnalité extérieure.
- Nantua / Haut-Bugey — lac, relief, image, pont avec l’écosystème industriel d’Oyonnax.

## Ancrages documentaires principaux
- Soieries Bonnet à Jujurieux : ensemble industriel textile exceptionnel conservant dimensions matérielles et immatérielles de l’industrie textile.
- Musée du Peigne et de la Plasturgie à Oyonnax : environ 16 000 objets, ornements de coiffure, lunettes, matières plastiques, mode, design, machines et outils ; présence de créations de Paco Rabanne dans les collections.
- Pays de Gex : chemin des savoir-faire, artisans/producteurs, Monts Jura, patrimoine et logique transfrontalière.

## Banques de contenu
Banques existantes Bourg-en-Bresse + Oyonnax :
- 68 personnages
- 120 briefs
- 36 secrets
- 22 familles d’événements

Extension dense Jujurieux / Pérouges / Gex / Ferney-Voltaire / Mijoux / Belley / Villars-les-Dombes / Nantua :
- 240 personnages
- 408 briefs
- 122 secrets
- 71 familles d’événements

Total bancaire minimal Ain :
- **308 personnages**
- **528 briefs**
- **158 secrets**
- **93 familles d’événements**

Ces totaux n’incluent pas les contacts persistants, briefs et événements déjà générés directement par `ain-territorial-gameplay-v1.js`, afin d’éviter le double comptage.

## Systèmes couverts
- Atelier : matières, prototype, accessoire, tissage, réemploi, cérémonie.
- Book : architecture, patrimoine industriel, photo, nature, recherche matière.
- Téléphone : contacts, rumeurs, recommandations, réseaux locaux/transfrontaliers.
- Agenda : briefs et familles d’événements saisonniers.
- Clientes : cérémonie, mariage, clientèle locale et internationale.
- B2B : Oyonnax, Nantua/Haut-Bugey, Pays de Gex.
- Shooting : Bourg, Pérouges, Dombes, Nantua.
- Sourcing / matériaux : Jujurieux, Oyonnax, Mijoux.

## Intégration runtime
Le code départemental `01` était déjà reconnu par `territory-context-v1.js` et son moteur territorial était déjà chargé. L’audit a identifié un manque : aucun pack carte `01` n’était présent dans `DEPARTMENT_MAP_PACK`.

Correction appliquée sans remplacer le moteur existant :
- `ain-map-content-v2.js`
- `ain-dense-universe-v1.js`
- `ain-dense-city-banks-v1.js`
- branchement via `territorial-signal-runtime-v1.js::bootstrapExtendedTerritories()` pour `01`.

Le store `haute-couture-ain-territorial-gameplay-v1` était déjà intégré au rattrapage des signaux.

## QA navigateur — validée le 11 septembre 2026
Le scénario Playwright/Chromium réel valide :
- Monastère royal de Brou rendu avec photo réelle et source documentaire ;
- 3 actions patrimoine disponibles ;
- une action consomme 35 minutes de temps de jeu ;
- la mémoire de lieu est persistée ;
- regarder Lyon ne déplace pas Marion de Bourg-en-Bresse ;
- un lieu fictif reçoit une illustration de jeu explicitement étiquetée ;
- le lourd stack Gard/Nîmes n’est plus chargé hors Gard.

Workflow validé : `Territoires UI E2E`.

## Extensions futures non bloquantes
- Trévoux / Val de Saône
- Ambronay
- Cerdon
- Divonne-les-Bains
- Plateau d’Hauteville
- Miribel / côtière lyonnaise

Ces extensions ne sont pas nécessaires pour considérer l’Ain jouable et territorialement dense.
