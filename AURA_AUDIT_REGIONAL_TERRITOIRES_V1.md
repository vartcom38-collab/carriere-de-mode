# AUDIT RÉGIONAL — AUVERGNE-RHÔNE-ALPES — V2

Date : 2026-09-10
Branche : `territoires-france`

## Verdict

**AUVERGNE-RHÔNE-ALPES : COUVERTURE TERRITORIALE DENSE SUR LES 12 DÉPARTEMENTS. QA STRUCTURELLE RENFORCÉE. QA NAVIGATEUR ENCORE À FAIRE AVANT FUSION.**

Départements couverts : Ain (01), Allier (03), Ardèche (07), Cantal (15), Drôme (26), Isère (38), Loire (42), Haute-Loire (43), Puy-de-Dôme (63), Rhône / territoire gameplay 69, Savoie (73), Haute-Savoie (74).

## Règle territoriale canonique

Résidence, présence physique/voyage et focus de carte restent distincts. **Ouvrir ou regarder un territoire ne téléporte jamais Marion.** Les rencontres, briefs et signaux territoriaux sont déclenchés à partir de la présence physique, pas du simple focus carte.

## Correctifs réalisés pendant l’audit

### 1. Fiabilisation stale-state

Corrigé sur Drôme, Ardèche, Savoie, Loire et Haute-Loire. Déjà corrigé auparavant sur Rhône, Allier, Cantal et Puy-de-Dôme. Ain : architecture différente, pas de stale-state identifié dans le flux inspecté.

Principe appliqué : les briefs, secrets et événements sont persistés avant émission des signaux ; aucun snapshot ancien ne doit être réécrit après un `emit()` susceptible d’avoir enrichi le store.

### 2. Routage régional

`territorial-signal-runtime-v1.js` est passé en V8 avec un fallback régional étendu couvrant les pôles denses des 12 départements, dont les variantes d’apostrophes ASCII/typographiques critiques (`Bourg-d'Oisans` / `Bourg-d’Oisans`, `Tain-l'Hermitage` / `Tain-l’Hermitage`, `Val-d'Isère` / `Val-d’Isère`, etc.).

### 3. Savoie — collision documentaire

Le PNJ fictif `Soline Arpin` a été renommé **Soline Perrier** afin d’éviter toute ambiguïté avec la véritable maison Arpin utilisée comme ancrage documentaire.

### 4. Savoie — loader réellement corrigé

Un 404 structurel a été trouvé dans `territory-context-savoie-addon-v1.js` : le loader appelait `savoie-primary-territories-universe-v1.js` / `savoie-primary-territories-banks-v1.js`, fichiers inexistants.

Correctif V2 :
- utilisation des vrais fichiers `savoie-primary-cities-universe-v1.js` et `savoie-primary-cities-banks-v1.js` ;
- chargement séquentiel via Promises ;
- moteur Savoie chargé avant l’addon des stations ;
- univers et banque chargés avant l’addon gameplay ;
- support de `Val-d'Isère` et `Val-d’Isère` ;
- émission d’un événement `hc-savoie-runtime-ready` en cas de succès et `hc-territory-load-error` en cas d’échec.

Le fichier `savoie-primary-cities-universe-v1.js` a été vérifié présent sur la branche.

### 5. Nettoyage des PNJ placeholders

Les banques héritées suivantes ne génèrent plus de noms `Contact <ville> <n>` :
- `drome-secondary-cities-banks-v2.js` ;
- `ardeche-primary-cities-banks-v1.js` ;
- `ardeche-secondary-cities-banks-v1.js` ;
- `savoie-primary-cities-banks-v1.js` ;
- `savoie-high-resorts-banks-v1.js`.

Les IDs restent inchangés pour préserver la compatibilité avec les sauvegardes et références existantes. Les PNJ reçoivent désormais des noms fictionnels déterministes, leur rôle, leur zone/quartier quand la banque en possède un, et un trait de personnalité de base.

Cette passe ne remplace pas encore le futur système relationnel complet (âge, niveau économique, goûts vestimentaires, emploi du temps, motivations, affinités, romance/rivalité, mémoire fine), mais la dette des noms placeholders est supprimée pour ces banques.

## État régional

### Ain — DENSE
Bourg-en-Bresse, Oyonnax, Jujurieux, Pérouges, Pays de Gex, Bugey, Dombes et pôles secondaires.

### Allier — DENSE
Moulins, Vichy, Montluçon, Bourbon-l’Archambault, Saint-Pourçain-sur-Sioule, Lapalisse, Commentry, Hérisson.

### Ardèche — DENSE
Annonay, Aubenas, Privas, Tournon-sur-Rhône, Le Teil, Marcols-les-Eaux, Jaujac, Largentière, Les Vans, Vallon-Pont-d’Arc, Saint-Agrève.

### Cantal — DENSE
Aurillac, Salers, Saint-Flour, Chaudes-Aigues, Laveissière / Le Lioran, Murat, Mauriac, Massiac.

### Drôme — DENSE
Romans-sur-Isère, Valence, Crest, Die, Nyons, Montélimar, Grignan, Dieulefit, Bourdeaux, Tain-l’Hermitage, La Chapelle-en-Vercors.

### Isère — DENSE
Grenoble, Bourgoin-Jallieu, Vienne, Voiron, Vizille, Villard-de-Lans, Bourg-d’Oisans, La Tour-du-Pin, Crémieu, Saint-Marcellin, Chartreuse, Grésivaudan, Belledonne, Royans.

### Loire — DENSE
Saint-Étienne, Roanne, Charlieu, Montbrison, Saint-Chamond, Rive-de-Gier, Firminy, Feurs, Saint-Bonnet-le-Château, Boën-sur-Lignon, Noirétable, Saint-Galmier.

### Haute-Loire — DENSE
Le Puy-en-Velay, Retournac, Brioude, La Chaise-Dieu, Blesle, Yssingeaux, Monistrol-sur-Loire, Langeac.

### Puy-de-Dôme — DENSE
Clermont-Ferrand, Thiers, Riom, Volvic, Le Mont-Dore, La Bourboule, Issoire, Ambert, Orcines / Chaîne des Puys.

### Rhône / territoire gameplay 69 — DENSE
Lyon, Villeurbanne, Villefranche-sur-Saône, Tarare, Amplepuis, Thizy-les-Bourgs, Oullins-Pierre-Bénite, Givors.

### Savoie — DENSE
Chambéry, Aix-les-Bains, Albertville, Beaufort, Bourg-Saint-Maurice, Modane + stations et hautes vallées densifiées.

### Haute-Savoie — DENSE
Annecy, Chamonix-Mont-Blanc, Le Grand-Bornand, Châtel, Megève, Évian-les-Bains, Thonon-les-Bains, Morzine, Avoriaz, La Clusaz, Cluses, Sallanches, Saint-Gervais-les-Bains, Samoëns, Yvoire.

## Dettes restantes avant fusion

### A. QA navigateur / runtime réel — BLOQUANT POUR FUSION

À faire sur une version réellement servie de la branche :
- entrer physiquement dans au moins une ville par département ;
- vérifier le chargement sans erreur console / 404 ;
- observer un marqueur ;
- déclencher une rencontre ;
- provoquer un brief ou secret ;
- vérifier Téléphone, Agenda, Atelier et Book ;
- recharger et confirmer la persistance ;
- vérifier que le focus carte seul ne déplace jamais Marion ;
- tester au moins une ville Savoie de base et une station après correction du loader.

Cette QA n’est **pas** encore déclarée passée.

### B. Tables centrales héritées — NON BLOQUANT

`territory-context-v1.js` garde une table historique plus petite que le fallback V8. Le runtime compense le problème, mais une future refactorisation pourra avoir une source d’alias unique.

### C. Relations PNJ — NON BLOQUANT

Les noms placeholders ont été supprimés des banques héritées ciblées. Il reste à enrichir les PNJ avec âge/tranche d’âge, situation économique, goûts, personnalité détaillée, horaires, motivations, compatibilités et mémoire relationnelle profonde.

### D. Normalisation globale des noms — NON BLOQUANT

Le fallback V8 couvre plusieurs variantes critiques. Une fonction de normalisation globale reste préférable à long terme pour accents, apostrophes, tirets, espaces et changements administratifs.

## Conclusion

La région n’a plus de département structurellement vide et les principales dettes de cohérence détectées en lecture de code ont été corrigées. Le dernier verrou avant fusion n’est plus le contenu territorial : c’est **la QA navigateur réelle sur la branche**.

Aucun merge vers `main` et aucun déploiement ne doivent être effectués sans demande explicite.