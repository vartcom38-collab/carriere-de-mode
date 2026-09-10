# HAUTE-LOIRE (43) — AUDIT COUVERTURE TERRITORIALE V1

Statut : **DENSE / RUNTIME TERRITORIAL OPÉRATIONNEL**

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

Le département `43` possède déjà :
- `haute-loire-territorial-gameplay-v1.js`
- `haute-loire-map-content-v1.js`

La couche dense ajoute :
- `haute-loire-dense-city-banks-v1.js`
- `haute-loire-dense-universe-v1.js`
- `haute-loire-dense-map-addon-v1.js`

Le pont territorial générique charge ces packs en présence physique `43` et contient maintenant des alias de secours pour Yssingeaux, Monistrol-sur-Loire, Langeac, La Chaise-Dieu et Blesle. Il peut aussi charger le moteur départemental lorsque le code n’est pas encore fourni par le voyage mais que la ville est reconnue.

## Règles gameplay

- Ouvrir/regarder une ville ne téléporte jamais Marion.
- La découverte locale peut alimenter Atelier, Book, Téléphone et Agenda.
- Les personnages interactifs ajoutés sont fictionnels.
- Les lieux/références documentaires ne créent jamais de relation fictive avec une institution réelle.
- La dentelle ne doit pas devenir l’unique sujet du département : scène, patrimoine, clientèle, réparation, ruralité et métiers d’art restent des axes complémentaires.

## QA restant

- Pas encore de validation end-to-end dans un navigateur réel.
- À terme, harmoniser les anciennes banques Haute-Loire avec le niveau de détail des nouveaux PNJ (traits, routines, relations, économie).
- Étendre éventuellement vers Craponne-sur-Arzon, Pradelles, Saint-Julien-Chapteuil ou d’autres communes si un besoin gameplay apparaît.
