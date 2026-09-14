# Audit couverture territoriale — Allier (03) V1

Statut : **DENSE / RUNTIME TERRITORIAL OPÉRATIONNEL / E2E CHROMIUM VALIDÉ**

## Pôles couverts
- Moulins — costume de scène, archives, scénographie, broderie, apprentissage.
- Vichy — thermalisme, élégance de séjour, réception, photographie, clientèle saisonnière.
- Montluçon — scène, musique, mémoire industrielle, réemploi, vêtement robuste.
- Bourbon-l’Archambault — thermalisme intime, fidélisation, patrimoine.
- Saint-Pourçain-sur-Sioule — réception, saisonnalité, image, artisanat.
- Lapalisse — patrimoine, passage, cérémonie, mobilité.
- Commentry — industrie, workwear, réparation, robustesse.
- Hérisson — petite échelle, festival, matières naturelles, photographie.

## Volumes extension dense
- 240 personnages fictionnels
- 400 briefs
- 120 secrets/pistes
- 72 familles d’événements

## Socle documentaire
- Moulins : CNCS, collections de costume et accessoires de scène, transmission et ateliers.
- Vichy : patrimoine thermal, parcs, architecture et clientèle de séjour.
- Les autres identités sont utilisées comme cadres de gameplay prudents ; ne pas transformer une inspiration locale en affirmation historique non documentée.

## Technique
- moteur Allier passé en V2 avec correction du stale-state : on persiste briefs/secrets/événements avant émission des signaux ;
- chargement automatique moteur + carte + univers dense + banque dense quand une présence physique Allier est détectée ;
- signaux repris par Téléphone / Agenda / Atelier / Book via le store 03 ;
- CNCS exposé comme lieu documentaire avec photo/source, sans transformer l’institution réelle en relation fictive.

## Règle canonique
Voir ou ouvrir l’Allier sur la carte ne téléporte jamais Marion. La présence physique reste distincte du focus carte et de la résidence.

## QA navigateur — validée le 11 septembre 2026
Le scénario Playwright/Chromium valide :
- présence physique à Moulins ;
- banque dense 240 / 400 / 120 / 72 réellement chargée ;
- CNCS affiché avec photo réelle, source et statut documentaire ;
- action CNCS consommant 45 minutes ;
- mémoire de lieu persistée ;
- focus Clermont-Ferrand en aperçu sans déplacement de Marion ;
- contenu fictif illustré et explicitement marqué comme fiction ;
- absence du stack Gard/Nîmes hors Gard.
