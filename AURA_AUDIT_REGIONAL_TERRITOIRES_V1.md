# AUDIT RÉGIONAL — AUVERGNE-RHÔNE-ALPES — V5

Date : 2026-09-11
Branche : `territoires-france`

## Verdict

**AUVERGNE-RHÔNE-ALPES : 12/12 DÉPARTEMENTS DENSES ET 12/12 VALIDÉS PAR UN SCÉNARIO REPRÉSENTATIF EN CHROMIUM.**

Départements : Ain (01), Allier (03), Ardèche (07), Cantal (15), Drôme (26), Isère (38), Loire (42), Haute-Loire (43), Puy-de-Dôme (63), Rhône / territoire gameplay 69, Savoie (73), Haute-Savoie (74).

La QA navigateur départementale représentative n’est plus un verrou territorial. Cela ne signifie pas que chaque ville, chaque événement et chaque combinaison de sauvegarde ont été parcourus : la campagne garantit un chemin E2E réel par département et les chaînes de chargement particulières 73/74.

## Règle canonique validée

Résidence, présence physique/voyage et focus de carte sont distincts. **Regarder un territoire ne téléporte jamais Marion.**

Cette règle est testée dans Chromium par comparaison de la présence persistée avant/après changement de focus cartographique.

## Campagne navigateur réelle

Workflow : `.github/workflows/territoires-ui-e2e.yml`

Run régional complet de référence :
- run : **`34600225098`**
- commit testé : **`a6a0d21332276d48f77e6931f832e49b77c789e2`**
- job navigateur : **`103265430367`**
- conclusion : **SUCCESS**

Le même job exécute sept scénarios Playwright/Chromium couvrant les douze départements.

### Contrat E2E contrôlé

Selon le département, le test vérifie tout ou partie des éléments suivants avec un socle commun obligatoire :
- présence réelle du bon département ;
- chargement du moteur et/ou des banques territoriales attendues ;
- ouverture d’un vrai lieu documentaire issu du runtime ;
- média réel et source lorsqu’un média documentaire est associé ;
- actions contextuelles ;
- consommation réelle de temps de jeu ;
- persistance de la mémoire d’action ;
- rendu distinct des lieux fictifs ;
- focus de carte sans changement de présence ;
- absence du stack Gard/Nîmes hors Gard ;
- absence d’exception bloquante dans le scénario.

## Scénarios départementaux validés

- **Ain 01 — Bourg-en-Bresse / Monastère royal de Brou** : photo réelle, action 35 min, mémoire, focus Lyon sans déplacement, fiction distincte.
- **Allier 03 — Moulins / CNCS** : couche dense 240 / 400 / 120 / 72, photo réelle, action 45 min, mémoire, anti-téléportation.
- **Ardèche 07 — Marcols-les-Eaux / Moulinage de la Neuve** : lieu documentaire, action 35 min, mémoire, focus Valence sans déplacement.
- **Cantal 15 — Aurillac / parapluie & accessoire** : 248 / 408 / 120 / 72, photo réelle, action 25 min, mémoire.
- **Drôme 26 — Romans-sur-Isère / Musée de la Chaussure** : lieu documentaire, action 35 min, mémoire, focus Aubenas sans déplacement.
- **Isère 38 — Bourgoin-Jallieu / Musée textile** : moteur 22 / 26 / 14 / 14, photo réelle, 4 actions, action 20 min, focus Saint-Étienne sans déplacement.
- **Loire 42 — Saint-Chamond / tresses, lacets & ruban** : couche dense 256 / 416 / 120 / 72, photo réelle, 4 actions, action 20 min, focus Lyon sans déplacement.
- **Haute-Loire 43 — Retournac / manufacture & mémoire dentellière** : 248 / 416 / 123 / 72, photo réelle, 4 actions, action 20 min.
- **Puy-de-Dôme 63 — Thiers / Musée de la Coutellerie** : 256 / 416 / 121 / 72, photo réelle, action 25 min.
- **Rhône / gameplay 69 — Amplepuis / Musée Barthélemy Thimonnier** : couche dense 256 / 416 / 120 / 72, photo réelle, action 35 min, focus Grenoble sans déplacement.
- **Savoie 73 — Séez / Filature Arpin** : chaîne haute vallée complète, 2 lieux d’univers, banque et addon chargés, photo réelle, 4 actions, action 20 min, focus Annecy sans déplacement.
- **Haute-Savoie 74 — Le Grand-Bornand / laine, soie & tissage** : moteur principal 320 personnages / 540 briefs, cartes principale + secondaire, univers et banques chargés, photo réelle, 4 actions, action 20 min, focus Chambéry sans déplacement.

Les formats de volumes ne sont pas strictement identiques entre générations de moteurs ; les chiffres ci-dessus sont les valeurs réellement observées dans les APIs testées et ne doivent pas être additionnés entre banques susceptibles de recouvrir du contenu.

## Bugs réels trouvés par la QA navigateur

### Double chargement Savoie / Haute-Savoie

La campagne Chromium a trouvé un défaut qui n’était pas détectable par le simple smoke-test Node : le runtime générique pouvait avoir déjà injecté un script, puis l’addon 73/74 attendait sur ce même élément un événement `load` déjà passé.

Conséquence : blocage du loader avant les cartes/univers/banques avancés.

Corrections :
- `territory-context-savoie-addon-v1.js` **V5 puis V6** : détection idempotente des APIs globales déjà actives ;
- `territory-context-haute-savoie-addon-v1.js` **V3** : même stratégie ;
- chargement séquentiel maintenu ;
- attente explicite de `HCLocalMap` maintenue.

Les deux départements alpins repassent ensuite au vert dans le run régional complet.

## Média documentaire AURA

Un complément non destructif a été ajouté :
- `hc-live/ville/territorial-place-media-aura-final-v1.js`

Il ajoute les médias/sources manquants pour les trois ancrages finaux de la campagne :
- Musée de Bourgoin-Jallieu · textile ;
- Saint-Chamond · tresses, lacets & ruban ;
- Musée Barthélemy Thimonnier · couture mécanique.

Le pack est chargé avant l’interface de lieu par le bootstrap Ville AURA afin que la première ouverture soit déjà correctement documentée.

## Smoke-test territorial

Le smoke-test Node reste actif en complément du navigateur :
- syntaxe des fichiers territoriaux ;
- présence des moteurs ;
- références JS locales ;
- codes départementaux ;
- garde-fous loaders ;
- recherche des anciens placeholders ciblés.

Les deux niveaux de QA sont complémentaires : Node détecte rapidement les défauts structurels, Chromium valide les interactions réelles DOM/runtime/persistance.

Après suppression de l’ancien `territory-context-ain-addon-v1.js`, devenu redondant avec le runtime générique et les packs denses Ain, les deux validations ont été rejouées :
- smoke run `34600664807` : **SUCCESS** ;
- Chromium run `34600664850` : **SUCCESS**, 12/12 scénarios toujours verts.

## Correctifs consolidés

### Stale-state

Les moteurs historiquement concernés ont été corrigés ou vérifiés dans leur version actuelle. Le principe retenu est de persister l’état contenant les nouveaux unlocks avant les émissions de signaux, afin qu’un `emit()` ne puisse plus être écrasé par une sauvegarde locale obsolète.

### Routage

`territorial-signal-runtime-v1.js` V8 contient un fallback régional couvrant les pôles denses et les variantes critiques d’apostrophes ASCII/typographiques, notamment Bourg-d'Oisans / Bourg-d’Oisans, Tain-l'Hermitage / Tain-l’Hermitage, Vallon-Pont-d'Arc / Vallon-Pont-d’Arc et Val-d'Isère / Val-d’Isère.

### PNJ

Les anciens placeholders ciblés `Contact <ville> <n>` ont été nettoyés dans la couche territoriale contrôlée. Les nouvelles banques denses utilisent des noms fictionnels déterministes avec rôles/secteurs/traits selon les fichiers.

`Soline Arpin` a été renommée **Soline Perrier** afin d’éviter toute ambiguïté avec la vraie maison Arpin.

## État régional

- Ain — DENSE / CHROMIUM OK
- Allier — DENSE / CHROMIUM OK
- Ardèche — DENSE / CHROMIUM OK
- Cantal — DENSE / CHROMIUM OK
- Drôme — DENSE / CHROMIUM OK
- Isère — DENSE / CHROMIUM OK
- Loire — DENSE / CHROMIUM OK
- Haute-Loire — DENSE / CHROMIUM OK
- Puy-de-Dôme — DENSE / CHROMIUM OK
- Rhône / gameplay 69 — DENSE / CHROMIUM OK
- Savoie — DENSE / CHROMIUM OK
- Haute-Savoie — DENSE / CHROMIUM OK

## Dettes non bloquantes avant une éventuelle fusion

- `territory-context-v1.js` et le fallback V8 du runtime dupliquent encore partiellement certains alias ; une source unique serait préférable à terme.
- Une normalisation globale accents/apostrophes/tirets/espaces reste souhaitable.
- Le gameplay `69` regroupe encore Rhône + Métropole de Lyon par simplification technique connue ; les textes documentaires conservent la distinction institutionnelle réelle.
- Les chaînes de cache (`?v=`) restent à aligner avant une mise en production afin que les navigateurs ne conservent pas d’anciennes versions des loaders/runtimes.
- La campagne E2E est représentative par département ; elle ne remplace pas une future matrice exhaustive de toutes les villes, saisons, sauvegardes et événements.
- Des erreurs syntaxiques préexistantes signalées dans des fichiers **non territoriaux** restent un chantier App/Atelier séparé et ne sont pas couvertes par ce verdict.

## Conclusion

La couche territoriale Auvergne-Rhône-Alpes n’a plus de département structurellement vide et dispose désormais d’une **preuve navigateur réelle représentative sur les 12 départements**.

Le verrou « QA navigateur départementale » est donc levé pour le chantier territorial. Le nettoyage de l’addon Ain est terminé et validé ; le dernier nettoyage territorial pré-fusion identifié est l’alignement des cache-busters des loaders/runtimes.

**Aucun merge vers `main` et aucun déploiement ne doivent être effectués sans demande explicite de l’utilisateur.**
