# Audit couverture territoriale — Allier (03) V1

Statut : **DENSE / RUNTIME TERRITORIAL OPÉRATIONNEL / MOULINS PARITÉ NÎMES FERMÉE / QA TRANSVERSALE VERTE**

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
- Coco Chanel peut être liée à Moulins uniquement comme référence historique/documentaire ; elle ne doit jamais devenir un PNJ contemporain conversationnel.

## Runtime Moulins — parité Nîmes fermée
Moulins possède désormais un runtime réellement joué, et pas seulement une banque de marqueurs :
- expériences spécialisées CNCS/patrimoine, archives, studio photo, hôtel temporaire et social/café ;
- personnages fictifs persistants, briefs, événements et objets narratifs temporaires ;
- mémoire de visite et revisites ;
- temps canonique via `HCGame.advanceTime` ;
- conséquences Téléphone / Agenda ;
- invitations détaillées et RSVP ;
- déblocages Book / Atelier ;
- studio photo bloqué sans création Atelier terminée, puis activé à partir d’une vraie création terminée ;
- interface Ville visible : marqueurs dédiés, événement saisonnier, objets temporaires et actions dans le guide ;
- saisonnalité pilotée par le mois du temps de jeu, et non par le mois civil.

Le runtime Allier reste inactif hors département 03 et le bridge canonique est unique afin d’éviter les doubles écouteurs.

## Règle canonique
Voir ou ouvrir l’Allier sur la carte ne téléporte jamais Marion. La présence physique reste distincte du focus carte et de la résidence.

## QA de fermeture — SHA fonctionnel commun
SHA fonctionnel de référence : `cea32ffbef97b1aeb4705f168af7453f0c893714` (`fix(allier): drive Moulins seasonal UI from game time`).

Les trois recettes ont été validées sur ce même SHA :
- **Allier Nimes Parity** — run `34954175589` — succès. Le test couvre notamment l’interface visible de Moulins, le temps canonique, la mémoire, l’hôtel, invitations/RSVP, Phone/Agenda, les Book/Atelier actions, le studio avec vraie création Atelier et la garde documentaire Chanel.
- **Territoires UI E2E** — run `34954175588` — succès. Tous les blocs représentatifs passent, dont Ain + Allier, ainsi que les contrôles Atelier des 12 départements.
- **Territoires UI Exhaustive** — run `34954175629` — succès. Les 12 jobs `01, 03, 07, 15, 26, 38, 42, 43, 63, 69, 73, 74` sont tous `success`.

Aucune assertion QA ni aucun timeout n’a été abaissé pour obtenir cette fermeture.

## Décision
**Moulins peut être considéré fermé au niveau de parité Nîmes actuellement exigé.**

La fermeture du département Allier complet continue ville par ville. Le prochain pôle approfondi est **Montluçon**, puis **Vichy**.

## Déploiement
Aucun déploiement de production n’est effectué à ce stade. La branche de travail reste `nimes-parity-territoires`.
