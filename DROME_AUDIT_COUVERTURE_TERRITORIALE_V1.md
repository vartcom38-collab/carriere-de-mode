# DRÔME — AUDIT DE COUVERTURE TERRITORIALE V1

Statut : **DENSE / RUNTIME TERRITORIAL OPÉRATIONNEL / E2E CHROMIUM VALIDÉ**
Branche : `territoires-france`

## Pôles forts

- Romans-sur-Isère — chaussure, cuir, bottier, forme, montage, maroquinerie, luxe, patrimoine industriel.
- Valence — création urbaine, image, art, métiers d’art, clientèle, B2B et événements.
- Crest — scène, costume, verticalité, vallée, photographie.
- Die / Diois — fibres naturelles, couleur, teinture végétale, paysage, artisanat.
- Nyons — vestiaire méridional, clientèle, cérémonie, marché, lumière.
- Montélimar — clientèle de passage, retouche, petite série, vestiaire léger.
- Grignan — patrimoine, métiers d’art, cuir, accessoires, cérémonie, photographie.
- Dieulefit / Bourdeaux — métiers d’art, surface, couleur, collaborations transdisciplinaires, petite série.
- Tain-l’Hermitage — hospitalité, uniforme contemporain, clientèle premium, accessoire, vallée du Rhône.
- Vercors drômois — laine, chanvre, mémoire des draps/tissages/filatures/moulinages, réparation et prototype montagne.

## Systèmes couverts

Atelier, Book, Téléphone, Agenda, clientes, B2B, shooting, costume, scène, matières, sourcing, petite série, chaussure, cuir, accessoires, patrimoine, couleur, teinture, outdoor, réparation et collaboration.

## Couverture saisonnière

- printemps : métiers d’art, couleur, artisanat, hospitalité ;
- été : scène, cérémonie, tourisme, photographie, vestiaire léger ;
- automne : patrimoine, création, cuir, artisanat, clientèle ;
- hiver : cuir, atelier, réparation, laine et Vercors.

## Couverture matière / motif

Matières : cuir, lin, coton, laine, chanvre, soie, crêpe, toile, maille technique, matières de chaussure.
Motifs et références : tressage, ligne de pied, talon, relief, plantes, strates, pierre, ombre, courbes du Rhône, trames textiles, surfaces de métiers d’art.

## QA navigateur — validée le 11 septembre 2026
Le scénario Playwright/Chromium valide :
- présence physique à Romans-sur-Isère ;
- 13 lieux Drôme réellement chargés par la carte départementale ;
- Musée de la Chaussure affiché avec photo réelle, source et statut documentaire ;
- 3 actions patrimoine disponibles ;
- une action consomme 35 minutes et persiste la mémoire du lieu ;
- regarder Aubenas ne déplace pas Marion de Romans-sur-Isère ;
- contenu fictif illustré et explicitement marqué comme fiction ;
- absence du stack Gard/Nîmes hors Gard.

## Extensions futures non bloquantes

- Saint-Jean-en-Royans / Saint-Laurent-en-Royans pour approfondir moulinages et tissages ;
- Saillans et vallée de la Drôme ;
- Saoû / forêt et relief ;
- Grands pôles événementiels ponctuels selon saison ;
- petites communes documentaires ajoutées au fil des besoins.

## Verdict

La Drôme possède suffisamment de contrastes territoriaux et de boucles de gameplay pour être considérée comme **dense**, et son parcours territorial de référence est désormais validé end-to-end dans Chromium.
