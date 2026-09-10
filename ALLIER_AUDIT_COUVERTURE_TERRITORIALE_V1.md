# Audit couverture territoriale — Allier (03) V1

Statut : **DENSE / RUNTIME TERRITORIAL OPÉRATIONNEL**

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
- runtime générique V6 : fallback direct pour les principales villes 03 ;
- chargement automatique moteur + carte + univers dense + banque dense quand une présence physique Allier est détectée ;
- signaux déjà repris par Téléphone / Agenda / Atelier / Book via le store 03.

## Règle canonique
Voir ou ouvrir l’Allier sur la carte ne téléporte jamais Marion. La présence physique reste distincte du focus carte et de la résidence.

## QA
Branchement GitHub vérifié. Aucun test navigateur end-to-end n’a encore été réalisé dans cette passe.
