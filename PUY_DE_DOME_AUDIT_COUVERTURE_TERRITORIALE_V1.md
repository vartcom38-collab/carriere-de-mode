# PUY-DE-DÔME — AUDIT DE COUVERTURE TERRITORIALE V1

Statut : **DENSE / RUNTIME TERRITORIAL OPÉRATIONNEL / E2E CHROMIUM VALIDÉ**

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

## Fondations documentaires
- Clermont-Ferrand : création textile contemporaine et réseau culturel.
- Thiers : Musée de la Coutellerie, histoire sociale/économique de la coutellerie, précision et production contemporaine de haute technicité.
- Ambert : Moulin Richard de Bas, papier fait main, chiffons, eau et transmission du geste papetier.
- Mont-Dore / La Bourboule : patrimoine thermal et villégiature.

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
- `puy-de-dome-territorial-gameplay-v1.js` en logique V2 avec correction stale-state.
- `puy-de-dome-dense-city-banks-v1.js`
- `puy-de-dome-dense-universe-v1.js` V2, avec `documentaryPlaces` pour Thiers et Ambert sans casser l’ancien format `cities`.
- `puy-de-dome-dense-map-addon-v1.js`
- branchement automatique par `territorial-signal-runtime-v1.js`.

## QA navigateur — validée le 11 septembre 2026
Le scénario Playwright/Chromium valide :
- présence physique à Thiers ;
- densité réellement chargée : 256 / 416 / 121 / 72 ;
- Musée de la Coutellerie affiché avec photo réelle, source et contexte documentaire ;
- 3 actions artisan disponibles ;
- une action consomme 25 minutes et persiste la mémoire ;
- focus Lyon en simple aperçu sans déplacement de Marion ;
- contenu fictif illustré et clairement identifié ;
- absence du stack Gard/Nîmes hors Gard.

## Extensions futures non bloquantes
- Saint-Nectaire
- Besse-et-Saint-Anastaise
- Billom
- Pont-du-Château
- Châtel-Guyon
- approfondissement de certaines routines et relations individuelles de PNJ générés.

## Verdict
Le Puy-de-Dôme est dense, documenté sur ses principaux ancrages et désormais validé end-to-end dans Chromium.
