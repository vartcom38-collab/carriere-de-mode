# AUDIT RÉGIONAL — AUVERGNE-RHÔNE-ALPES — V4

Date : 2026-09-10
Branche : `territoires-france`

## Verdict

**AUVERGNE-RHÔNE-ALPES : 12/12 DÉPARTEMENTS DENSES. QA STATIQUE ET SMOKE-TEST CI TERRITORIAL PASSÉS. QA NAVIGATEUR RÉELLE ENCORE REQUISE AVANT FUSION.**

Départements : Ain (01), Allier (03), Ardèche (07), Cantal (15), Drôme (26), Isère (38), Loire (42), Haute-Loire (43), Puy-de-Dôme (63), Rhône / territoire gameplay 69, Savoie (73), Haute-Savoie (74).

## Règle canonique

Résidence, présence physique/voyage et focus de carte sont distincts. **Regarder un territoire ne téléporte jamais Marion.** Les systèmes territoriaux s’activent à partir de la présence physique.

## QA automatisée exécutée

Un smoke-test dédié a été ajouté :
- `hc-live/qa/territories-smoke-test.mjs`
- `.github/workflows/territoires-smoke.yml`

Le workflow s’exécute sur `territoires-france` lors des changements `hc-live/**`.

Il contrôle :
- la syntaxe Node de 101 fichiers JS territoriaux ;
- la présence des 12 moteurs départementaux ;
- l’existence des références JS locales appelées par le runtime, les loaders 73/74 et la page Ville ;
- la présence des 12 codes départementaux dans le pont territorial ;
- les garde-fous `HCLocalMap` des loaders Savoie / Haute-Savoie ;
- une recherche globale des anciens placeholders `Contact <ville> <n>` dans tous les JS de `hc-live/`.

### Historique utile

Le premier passage large du CI a échoué et a réellement révélé plusieurs défauts territoriaux :
- syntaxe du moteur Haute-Savoie ;
- syntaxe de `puy-de-dome-dense-universe-v1.js` ;
- deux erreurs de syntaxe dans `ville/territorial-place-familiarity-v1.js` ;
- anciens générateurs de noms placeholders.

Ces défauts territoriaux ont été corrigés.

Le run territorial `34506716082` a constitué le premier passage vert du smoke-test recentré.

Après élargissement du contrôle des placeholders à tous les JS, le run `34507135565` est également passé avec succès et a identifié les dernières banques génériques à nettoyer.

Après nettoyage final, le run **`34507415931`** est passé avec succès sur le commit `7e4d6376dea387b93da4c247351bbc44febb7074` avec :
- **101 fichiers JS territoriaux : syntaxe OK** ;
- **12 moteurs départementaux présents** ;
- **références JS locales vérifiées** ;
- **0 fichier avec placeholder ciblé** ;
- **12 codes départementaux présents dans le pont** ;
- **garde-fous loaders 73/74 vérifiés** ;
- verdict final : **SMOKE TEST TERRITORIAL PASSÉ**.

Cette QA CI est une vraie exécution Node/GitHub Actions. Elle ne remplace toutefois pas une session dans un navigateur avec DOM, Leaflet, navigation utilisateur et persistance réelle de partie.

## Correctifs consolidés

### Stale-state

Corrigé sur Drôme, Ardèche, Savoie, Haute-Savoie, Loire et Haute-Loire. Rhône, Allier, Cantal et Puy-de-Dôme avaient déjà été corrigés. Ain utilise une architecture où les signaux enrichissent le même objet mémoire avant sauvegarde et n’a pas présenté ce défaut dans le flux inspecté.

### Routage

`territorial-signal-runtime-v1.js` V8 contient un fallback régional couvrant les pôles denses et les variantes critiques d’apostrophes ASCII/typographiques, notamment Bourg-d'Oisans / Bourg-d’Oisans, Tain-l'Hermitage / Tain-l’Hermitage, Vallon-Pont-d'Arc / Vallon-Pont-d’Arc et Val-d'Isère / Val-d’Isère.

### PNJ — placeholders supprimés

Les IDs existants ont été conservés afin de préserver la compatibilité des sauvegardes, mais les banques ciblées génèrent maintenant des noms fictionnels déterministes et, selon le fichier, rôle, quartier/zone et trait de personnalité.

Nettoyage effectué notamment sur :
- Ain dense ;
- Bourg-en-Bresse / Oyonnax ;
- Moulins / Vichy ;
- Romans-sur-Isère / Valence ;
- Drôme secondaire V1/V2 ;
- Ardèche primaire et secondaire ;
- Isère secondaire V1/V2 et massifs/vallées ;
- Savoie primaire et stations ;
- Haute-Savoie moteur, banques principales et banques secondaires ;
- banques `secondary-strong` et `secondary-tier2`.

Le smoke-test global de contenu confirme désormais **0 occurrence ciblée** de `Contact <ville> <n>` / `Soline Arpin` dans les JS de `hc-live/`.

`Soline Arpin` a été renommée **Soline Perrier** pour éviter toute ambiguïté avec la vraie maison Arpin.

### Savoie 73 — loader

Deux noms de fichiers inexistants ont été corrigés : le loader utilise désormais `savoie-primary-cities-universe-v1.js` et `savoie-primary-cities-banks-v1.js`.

Le loader :
- charge les scripts structurants séquentiellement ;
- charge le moteur 73 avant les addons ;
- attend explicitement `window.HCLocalMap` avant les packs carte/univers ;
- sépare villes de base et stations ;
- supporte les deux apostrophes de Val-d’Isère ;
- émet `hc-savoie-runtime-ready` ou `hc-territory-load-error`.

### Haute-Savoie 74 — loader et moteur

Le loader :
- reconnaît code, nom de département ou ville connue ;
- peut corriger la présence vers code 74 si nécessaire ;
- charge séquentiellement ;
- attend explicitement `window.HCLocalMap` avant carte et univers ;
- charge moteur → carte → univers → banques ;
- émet `hc-haute-savoie-runtime-ready` ou `hc-territory-load-error`.

Le moteur Haute-Savoie V2 a été corrigé pour le stale-state, la syntaxe et les PNJ nommés.

## État régional

- Ain — DENSE
- Allier — DENSE
- Ardèche — DENSE
- Cantal — DENSE
- Drôme — DENSE
- Isère — DENSE
- Loire — DENSE
- Haute-Loire — DENSE
- Puy-de-Dôme — DENSE
- Rhône / gameplay 69 — DENSE
- Savoie — DENSE
- Haute-Savoie — DENSE

## Ce que le premier scan large a aussi révélé — HORS PÉRIMÈTRE TERRITORIAL

Le tout premier smoke-test avait volontairement tenté `node --check` sur l’ensemble des JS de `hc-live/`. Il a révélé des erreurs de syntaxe préexistantes dans plusieurs fichiers non territoriaux, notamment certains fichiers Atelier et `professional-life-engine.js`.

Ces défauts ne sont **pas** présentés comme corrigés par le chantier territorial. Le smoke-test a ensuite été recentré sur les fichiers territoriaux pour ne pas mélanger deux chantiers distincts.

Ils devront être traités dans le chat / chantier App-Atelier approprié avant de pouvoir parler de santé syntaxique globale de toute l’application.

## Dernier verrou avant fusion

### QA navigateur réelle — BLOQUANTE

Sur une version réellement servie de la branche :
1. entrer physiquement dans au moins une ville par département ;
2. contrôler console et réseau : aucun 404 / aucune exception ;
3. vérifier marqueurs et univers ;
4. déclencher une rencontre ;
5. déclencher brief ou secret ;
6. vérifier Téléphone et Agenda ;
7. vérifier Atelier et Book ;
8. recharger et contrôler la persistance ;
9. vérifier que le simple focus de carte ne modifie pas la présence ;
10. en Savoie tester une ville primaire + une station ;
11. en Haute-Savoie tester une ville primaire + une secondaire.

Cette QA navigateur n’est **pas encore déclarée passée**.

## Dettes non bloquantes

- `territory-context-v1.js` et le fallback V8 du runtime dupliquent encore partiellement les alias ; une source unique serait préférable à terme.
- Une normalisation globale accents/apostrophes/tirets/espaces serait plus robuste qu’une accumulation d’alias.
- Les PNJ sont maintenant nommés, mais le futur système relationnel doit encore enrichir âge, situation économique, goûts vestimentaires, horaires, motivations, affinités, rivalités, romance et mémoire fine.
- Le gameplay `69` regroupe encore Rhône + Métropole de Lyon par simplification technique connue.

## Conclusion

La région n’a plus de département structurellement vide. Les erreurs territoriales détectables par le smoke-test ont été corrigées et **le CI territorial est vert avec zéro placeholder ciblé**.

Le dernier verrou territorial avant fusion est désormais **la QA navigateur end-to-end réelle**. Les erreurs syntaxiques non territoriales révélées par le scan large constituent un chantier séparé et ne doivent pas être confondues avec le statut de la couche territoriale.

Aucun merge vers `main` et aucun déploiement ne doivent être effectués sans demande explicite de l’utilisateur.