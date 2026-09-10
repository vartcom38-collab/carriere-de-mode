# PUY-DE-DÔME — AUDIT DE COUVERTURE TERRITORIALE V1

Statut : **DENSE / RUNTIME TERRITORIAL OPÉRATIONNEL**

## Pôles couverts
- Clermont-Ferrand — textile contemporain, image, culture, réseau métropolitain.
- Thiers — coutellerie, métal, précision, accessoires, fixation, industrie.
- Riom — patrimoine, archives, cérémonie, recherche documentaire.
- Volvic — pierre de lave, émail, relief, métiers d’art.
- Le Mont-Dore — thermalisme, Belle Époque, montagne, hôtellerie, clientèle de séjour.
- La Bourboule — villégiature, familles, thermalisme, retouche, maille et élégance pratique.
- Issoire — commerce, cérémonie, patrimoine et réseau local.
- Ambert — papier fait main, chiffon de coton/lin, réemploi, impression et surface.
- Orcines / Chaîne des Puys — paysage volcanique, météo, outdoor, palette, shooting.

## Banque dense V1
Total exact de la couche complémentaire :
- **256 personnages**
- **416 briefs**
- **121 secrets**
- **72 familles d’événements**

Ces volumes sont additionnels au moteur départemental déjà existant et aux contenus spécifiques de Clermont-Ferrand.

## Fondations documentaires
- Clermont-Ferrand : Biennale Textile 2026, création textile contemporaine et réseau culturel.
- Thiers : Musée de la Coutellerie, histoire sociale/économique de la coutellerie et production contemporaine de haute technicité.
- Ambert : Moulin Richard de Bas, fabrication de papier feuille à feuille, chiffons de coton et de lin, énergie hydraulique et transmission du geste papetier.
- Mont-Dore / La Bourboule : patrimoine thermal et Belle Époque, villas, palaces, casinos, thermes et clientèle de séjour.

Les lieux et personnes explicitement signalés comme fictionnels servent uniquement le gameplay. Les éléments documentaires ne doivent pas être transformés en relations ou commandes fictives attribuées à de vraies personnes/structures.

## Systèmes couverts
- Atelier
- Book
- Téléphone
- Agenda
- Clientes
- Réseau professionnel
- Shooting
- Matières
- Accessoires
- Métiers d’art
- Réemploi
- Patrimoine
- Thermalisme
- Événements saisonniers

## Technique
- `puy-de-dome-territorial-gameplay-v1.js` passé en logique V2 avec correction stale-state.
- `puy-de-dome-dense-city-banks-v1.js`
- `puy-de-dome-dense-universe-v1.js`
- `puy-de-dome-dense-map-addon-v1.js`
- branchement automatique par `territorial-signal-runtime-v1.js` V5.
- fallback de reconnaissance pour Thiers, Riom, Volvic, Le Mont-Dore, La Bourboule, Issoire, Ambert et Orcines.

## QA restante non bloquante
- Test navigateur end-to-end encore à faire.
- Enrichir plus tard les relations individuelles/schedules de certains PNJ générés.
- Possibles extensions : Saint-Nectaire, Besse-et-Saint-Anastaise, Billom, Pont-du-Château, Châtel-Guyon.

## Verdict
Le Puy-de-Dôme possède désormais assez de diversité géographique, artisanale, culturelle, thermale, industrielle et créative pour être considéré comme **dense** dans la structure territoriale actuelle.