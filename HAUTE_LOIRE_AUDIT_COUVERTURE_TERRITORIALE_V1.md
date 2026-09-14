# HAUTE-LOIRE (43) — AUDIT COUVERTURE TERRITORIALE V1

Statut : **DENSE / RUNTIME TERRITORIAL OPÉRATIONNEL / E2E CHROMIUM VALIDÉ**

## Pôles couverts
- Le Puy-en-Velay — dentelle aux fuseaux, apprentissage, création contemporaine, costume, archives.
- Retournac — manufacture de dentelles, dentelle mécanique, dessins techniques, mémoire du travail.
- Brioude — métiers d’art, exposition, collaboration matière/objet/vêtement.
- La Chaise-Dieu — scène, musique, costume, loges, retouches, image.
- Blesle — patrimoine vestimentaire, coiffes, bordures, village, mémoire rurale.
- Yssingeaux — clientèle locale, marchés, retouches, petites commandes.
- Monistrol-sur-Loire — mobilité, réseau actif, jeune création, lien vers Saint-Étienne.
- Langeac — laine, lin, cuir, réparation et petites séries en contexte rural.

## Densité banques V1
- 248 personnages fictionnels
- 416 briefs
- 123 secrets / pistes
- 72 familles d’événements

Ces volumes s’ajoutent au moteur Haute-Loire et à ses personnages/briefs déjà présents.

## Base documentaire
Le Puy-en-Velay reste un centre majeur de dentelle aux fuseaux. Le Centre d’Enseignement maintient la pratique et la transmission ; l’Atelier conservatoire national produit également des œuvres contemporaines à haute technicité.

Retournac conserve dans son bâtiment d’origine l’ensemble d’une ancienne manufacture de dentelles, plus de 450 000 pièces, des milliers de dessins dentelliers et un atelier de dentelle mécanique.

Les événements futurs générés par le jeu sont des éditions fictionnelles ou des familles événementielles évolutives. Les événements historiques ou réels servent de documentation et ne sont jamais répétés artificiellement à l’identique.

## Intégration runtime
Le département `43` possède :
- `haute-loire-territorial-gameplay-v1.js`
- `haute-loire-map-content-v1.js`
- `haute-loire-dense-city-banks-v1.js`
- `haute-loire-dense-universe-v1.js`
- `haute-loire-dense-map-addon-v1.js`

Le pont territorial générique charge ces packs en présence physique `43` et contient les alias de secours nécessaires.

## Règles gameplay
- Ouvrir/regarder une ville ne téléporte jamais Marion.
- La découverte locale peut alimenter Atelier, Book, Téléphone et Agenda.
- Les personnages interactifs ajoutés sont fictionnels.
- Les lieux/références documentaires ne créent jamais de relation fictive avec une institution réelle.
- La dentelle ne doit pas devenir l’unique sujet du département.

## QA navigateur — validée le 11 septembre 2026
Le scénario Playwright/Chromium valide :
- présence à Retournac ;
- densité réellement chargée : 248 / 416 / 123 / 72 ;
- manufacture/musée de Retournac avec photo réelle, source et contexte documentaire ;
- 4 actions textile disponibles ;
- une action consomme 20 minutes et persiste la mémoire du lieu ;
- focus Clermont-Ferrand en aperçu sans déplacement de Marion ;
- lieu fictif illustré et étiqueté comme fiction ;
- absence du stack Gard/Nîmes hors Gard.

## Extensions futures non bloquantes
- Craponne-sur-Arzon
- Pradelles
- Saint-Julien-Chapteuil
- harmonisation plus fine des routines et économies individuelles de certains PNJ générés.
