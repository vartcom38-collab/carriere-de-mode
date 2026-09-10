# AUDIT RÉGIONAL — AUVERGNE-RHÔNE-ALPES — V3

Date : 2026-09-10
Branche : `territoires-france`

## Verdict

**AUVERGNE-RHÔNE-ALPES : 12/12 DÉPARTEMENTS DENSES. QA STATIQUE/STRUCTURELLE RENFORCÉE. QA NAVIGATEUR RÉELLE ENCORE REQUISE AVANT FUSION.**

Départements : Ain (01), Allier (03), Ardèche (07), Cantal (15), Drôme (26), Isère (38), Loire (42), Haute-Loire (43), Puy-de-Dôme (63), Rhône / territoire gameplay 69, Savoie (73), Haute-Savoie (74).

## Règle canonique

Résidence, présence physique/voyage et focus de carte sont distincts. **Regarder un territoire ne téléporte jamais Marion.** Les systèmes territoriaux s’activent à partir de la présence physique.

## Correctifs consolidés

### Stale-state

Corrigé sur Drôme, Ardèche, Savoie, Haute-Savoie, Loire et Haute-Loire. Rhône, Allier, Cantal et Puy-de-Dôme avaient déjà été corrigés. Ain utilise une architecture où les signaux enrichissent le même objet mémoire avant sauvegarde et n’a pas présenté ce défaut dans le flux inspecté.

### Routage

`territorial-signal-runtime-v1.js` V8 contient un fallback régional couvrant les pôles denses et les variantes critiques d’apostrophes ASCII/typographiques, notamment Bourg-d'Oisans / Bourg-d’Oisans, Tain-l'Hermitage / Tain-l’Hermitage, Vallon-Pont-d'Arc / Vallon-Pont-d’Arc et Val-d'Isère / Val-d’Isère.

### PNJ

Les générateurs de banques historiques Drôme secondaire, Ardèche primaire/secondaire, Savoie primaire/stations ont été remplacés par des générateurs de noms fictionnels déterministes tout en conservant leurs IDs. Le moteur Haute-Savoie V2 ne génère plus non plus de `Contact <ville> <n>` et conserve ses IDs `hs-p-*`.

`Soline Arpin` a été renommée **Soline Perrier** pour éviter toute ambiguïté avec la vraie maison Arpin.

### Savoie 73 — loader

Deux noms de fichiers inexistants ont été corrigés : le loader utilise désormais `savoie-primary-cities-universe-v1.js` et `savoie-primary-cities-banks-v1.js`.

Le loader est maintenant V3 :
- scripts structurants chargés séquentiellement ;
- moteur 73 chargé avant les addons ;
- attente explicite de `window.HCLocalMap` avant les packs carte/univers ;
- villes de base et stations séparées ;
- support des deux apostrophes de Val-d’Isère ;
- événements `hc-savoie-runtime-ready` et `hc-territory-load-error`.

### Haute-Savoie 74 — loader

Le loader est maintenant V2 :
- reconnaissance par code, nom de département ou ville connue ;
- correction de présence vers code 74 si nécessaire ;
- chargement séquentiel ;
- attente explicite de `window.HCLocalMap` avant carte et univers ;
- chargement moteur → carte → univers → banques ;
- événements `hc-haute-savoie-runtime-ready` et `hc-territory-load-error`.

Le moteur Haute-Savoie est maintenant V2 avec stale-state corrigé et PNJ fictionnels nommés.

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

## Dernier verrou avant fusion

### QA navigateur réelle — BLOQUANTE

Sur une version réellement servie de la branche :
1. entrer physiquement dans au moins une ville par département ;
2. contrôler console et réseau : aucun 404 / aucune exception ;
3. vérifier marqueurs et univers ;
4. déclencher rencontre ;
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
- Les PNJ sont désormais nommés, mais le futur système relationnel doit encore enrichir âge, situation économique, goûts vestimentaires, horaires, motivations, affinités, rivalités, romance et mémoire fine.
- Le gameplay `69` regroupe encore Rhône + Métropole de Lyon par simplification technique connue.

## Conclusion

La région n’a plus de département structurellement vide et les défauts statiques critiques trouvés pendant l’audit ont été traités. **Ne pas fusionner dans `main` ni déployer avant la QA navigateur réelle**, sauf demande explicite de l’utilisateur.