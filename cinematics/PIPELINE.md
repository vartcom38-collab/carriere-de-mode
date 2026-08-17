# Pipeline cinématique — HAUTE COUTURE

## Rôles des outils

### Image generation
Crée les images de référence cohérentes : héroïne, personnages secondaires, décors, accessoires, logements, rues, gares, taxis, ateliers, vêtements et plans de raccord.

### HeyGen
Utilisé lorsque le plan demande un personnage réellement animé : visage, gestes, posture, mouvement du corps, dialogue/lip-sync, ou animation d’une illustration de personnage. Les rendus sont exportés en MP4 et archivés dans `cinematics/renders/` avant intégration.

### HyperFrames
Utilisé pour les transitions et le montage programmatiques : pages de carnet, cartes, titres, raccords, superpositions, transitions, lumière, sous-titres et assemblage de plusieurs plans. La source vidéo reste déterministe et versionnée.

### Godot
Moteur final du jeu. Godot lit les clips vidéo, déclenche leur lecture, permet de les passer, puis rend la main à une scène interactive. Les choix de région, ville, quartier ou logement restent de vraies interfaces Godot, pas des vidéos.

## Structure

- `cinematics/DESIGN.md` : direction artistique officielle.
- `cinematics/manifests/` : description de chaque séquence et de ses plans.
- `cinematics/renders/` : vidéos finales intégrables dans Godot.
- `cinematics/hyperframes/` : compositions de transitions/montage.
- `assets/cinematics/` : fichiers vidéo réellement embarqués dans le build Godot.
- `scripts/cinematic_player.gd` : lecteur vidéo Godot commun.

## Règles de production

1. Un plan montrant un personnage doit comporter un mouvement humain visible. Un simple zoom sur une illustration n’est pas considéré comme une cinématique personnage.
2. Les choix importants restent interactifs dans Godot.
3. Les cinématiques sont courtes, découpées en plans de 3 à 10 secondes et peuvent être passées.
4. Le format maître du jeu est 4:3. Les outils vidéo ne proposant que 16:9 produisent un master recadrable avec zone sûre 4:3 au centre.
5. Toujours préserver la cohérence de l’héroïne d’un plan à l’autre : coiffure, âge apparent, vêtements, proportions, palette et trait.
6. Chaque rendu doit avoir un identifiant stable comme `np_001_depart`, `np_002_train`, etc.
7. Godot ne dépend d’aucun service externe à l’exécution : les vidéos finales sont embarquées localement dans l’application.

## Nouvelle Partie — séquence cible

1. `np_001_carnet` — caméra vers le carnet, ouverture / page tournée.
2. `np_002_reve` — héroïne dans son petit espace, elle prépare son départ et ferme son carnet.
3. Interface Godot : pays → région → ville → quartier.
4. `np_003_depart` — sac/carton, sortie, gare.
5. `np_004_train` — voyage avec paysage en mouvement.
6. Interface Godot : choix et visite du logement.
7. `np_005_arrivee` — entrée avec cartons dans le logement choisi.
8. `np_006_rideaux` — elle marche à la fenêtre et ouvre les rideaux.
9. Interface Godot : installation du premier coin atelier.
10. `np_007_premiere_commande` — arrivée/contact de la première cliente.
