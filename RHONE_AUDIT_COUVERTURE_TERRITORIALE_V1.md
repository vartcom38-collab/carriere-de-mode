# RHÔNE — AUDIT DE COUVERTURE TERRITORIALE V1

Statut : **DENSE / RUNTIME TERRITORIAL OPÉRATIONNEL / VALIDÉ EN CHROMIUM**

## Validation navigateur réelle — 11 septembre 2026

Scénario de référence : **Amplepuis / Musée Barthélemy Thimonnier · couture mécanique**.

Le run Chromium valide :
- présence physique de Marion à Amplepuis ;
- couche dense chargée avec **256 personnages, 416 briefs, 120 secrets et 72 familles d’événements** ;
- vrai marqueur `rh-dense-amplepuis-thimonnier` produit par `rhone-dense-universe-v1.js` ;
- affichage `PHOTO RÉELLE` avec source documentaire ;
- 3 actions contextuelles ;
- consommation de **35 minutes** sur l’action testée ;
- mémoire persistée ;
- focus Grenoble traité en aperçu sans téléportation ;
- rendu distinct du contenu fictif ;
- absence du runtime Gard/Nîmes hors Gard.

Le risque historique de stale-state n’est plus présent dans la version actuelle inspectée du moteur Rhône : l’état est persisté avant émission des signaux.

## Périmètre de jeu
Le runtime `69` regroupe actuellement le Rhône et la Métropole lyonnaise pour conserver la continuité du système existant. C'est une simplification de gameplay : depuis le 1er janvier 2015, la Métropole de Lyon est une collectivité territoriale à statut particulier exerçant les compétences départementales sur son territoire, distincte du Conseil départemental du Rhône. Cette distinction doit être conservée dans les textes documentaires et pourra être raffinée plus tard dans la carte sans casser le gameplay.

## Pôles couverts
- **Lyon** — soie, canuts, Jacquard, tissage, passementerie, costume, scène, design textile, vintage, image, clientèle urbaine.
- **Villeurbanne** — scène, costume vivant, jeunes réseaux, collectifs, upcycling.
- **Villefranche-sur-Saône / Beaujolais** — cérémonie, réception, patrimoine, clientèle saisonnière, photographie.
- **Tarare** — mémoire textile, voilage/mousseline, industrie, production et archives.
- **Amplepuis** — machine à coudre, construction, assemblage, réparation, mécanique et transmission.
- **Thizy-les-Bourgs / Haut-Beaujolais** — industrie textile, tissage, teinturerie, molleton/couverture, friches et mémoire ouvrière.
- **Oullins-Pierre-Bénite** — retouche, petite série, clientèle quotidienne et circulation métropolitaine (axe gameplay, lieux fictifs signalés comme tels).
- **Givors** — vêtement fonctionnel, robustesse, réparation, paysage industriel (axe gameplay, lieux fictifs signalés comme tels).

## Base documentaire utilisée
- Ville de Lyon : Maison des Canuts, métiers Jacquard, histoire de la soie et industrie textile rhônalpine contemporaine.
- Ville de Lyon : ateliers municipaux de passementerie / Soierie Vivante et patrimoine canut.
- Musées de la Communauté d'agglomération de l'Ouest Rhodanien : Musée Barthélemy Thimonnier à Amplepuis, invention de la machine à coudre et première collection publique française de machines à coudre.
- Musées de la COR : Manufacture du Haut-Beaujolais à Thizy-les-Bourgs, histoire de l'industrie textile locale.
- INSEE : distinction institutionnelle Conseil départemental du Rhône / Métropole de Lyon depuis 2015.

## Densification V1
La banque `rhone-dense-city-banks-v1.js` ajoute :
- **256 personnages fictionnels** avec noms, rôles, quartiers et traits ;
- **416 briefs** ;
- **120 secrets / pistes** ;
- **72 familles d'événements**.

Répartition :
- Lyon : 40 / 68 / 20 / 12
- Villeurbanne : 32 / 52 / 15 / 9
- Villefranche-sur-Saône : 32 / 52 / 15 / 9
- Tarare : 32 / 52 / 15 / 9
- Amplepuis : 32 / 52 / 15 / 9
- Thizy-les-Bourgs : 32 / 52 / 15 / 9
- Oullins-Pierre-Bénite : 28 / 44 / 13 / 8
- Givors : 28 / 44 / 12 / 7

## Intégration
Le pont territorial générique charge automatiquement en présence `69` :
- `rhone-dense-map-addon-v1.js`
- `rhone-dense-universe-v1.js`
- `rhone-dense-city-banks-v1.js`

Les signaux territoriaux restent compatibles avec Téléphone, Agenda, Atelier et Book via le pont territorial générique.

## Règles de vérité
Les lieux, personnages, commissions, secrets et événements inventés sont du gameplay fictif. Les institutions, musées et éléments historiques documentaires servent de contexte et ne doivent pas recevoir de commandes ou relations fictives attribuées comme réelles.

## Extensions futures non bloquantes
- Cours / Haut-Beaujolais textile ;
- L'Arbresle et vallée de la Brévenne ;
- Condrieu / vallée du Rhône pour réception, image et artisanat sans réduire le secteur au vin ;
- densification des vrais calendriers saisonniers et des marchés créatifs ;
- séparation technique plus fine Métropole de Lyon / Rhône administratif si le moteur territorial évolue vers des sous-territoires institutionnels.
