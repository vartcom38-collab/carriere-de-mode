# AUDIT RÉGIONAL — AUVERGNE-RHÔNE-ALPES — V1

Date : 2026-09-10
Branche : `territoires-france`

## Verdict

**AUVERGNE-RHÔNE-ALPES : COUVERTURE TERRITORIALE DENSE SUR LES 12 DÉPARTEMENTS, PRÊTE POUR QA NAVIGATEUR AVANT FUSION.**

Départements couverts :
- Ain (01)
- Allier (03)
- Ardèche (07)
- Cantal (15)
- Drôme (26)
- Isère (38)
- Loire (42)
- Haute-Loire (43)
- Puy-de-Dôme (63)
- Rhône / territoire gameplay 69
- Savoie (73)
- Haute-Savoie (74)

## Règle territoriale canonique

Résidence, présence physique/voyage et focus de carte restent distincts.

**Ouvrir ou regarder un territoire ne téléporte jamais Marion.**

Les rencontres, briefs et signaux territoriaux sont déclenchés à partir de la présence physique, pas du simple focus carte.

## Correctifs réalisés pendant l’audit

### 1. Fiabilisation stale-state

Les moteurs suivants utilisaient un ancien pattern où un snapshot local pouvait être réécrit après `emit()` et supprimer les signaux nouvellement persistés :
- Drôme
- Ardèche
- Savoie
- Loire
- Haute-Loire

Ils ont été corrigés :
- les briefs/secrets sont persistés avant émission des signaux ;
- les événements sont persistés avant émission quand le moteur possède un store d’événements ;
- les anciens `write(s)` finaux susceptibles d’écraser les signaux ont été supprimés ou déplacés.

Déjà corrigés auparavant :
- Rhône
- Allier
- Cantal
- Puy-de-Dôme

Ain : architecture différente, pas de stale-state identifié dans le flux inspecté ; `addSignal()` modifie le même objet mémoire sauvegardé ensuite.

### 2. Routage régional

`territorial-signal-runtime-v1.js` passe en V8 et possède maintenant un fallback régional étendu couvrant les pôles denses des 12 départements.

Ajouts importants :
- secondaires Ardèche et Drôme ;
- villes denses Loire / Haute-Loire / Puy-de-Dôme / Allier / Cantal / Rhône ;
- variantes d’apostrophes typographiques et ASCII ;
- `Bourg-d’Oisans` et `Bourg-d'Oisans` ;
- `Vallon-Pont-d’Arc` et `Vallon-Pont-d'Arc` ;
- `Tain-l’Hermitage` et `Tain-l'Hermitage` ;
- `Val-d’Isère` et `Val-d'Isère` ;
- principales villes Savoie et Haute-Savoie.

Le pont peut donc déduire un code départemental dans davantage de cas lorsque l’état de voyage ne fournit qu’un nom de commune.

### 3. Savoie — collision documentaire

Le PNJ fictif `Soline Arpin` a été renommé **Soline Perrier** afin d’éviter toute ambiguïté avec la véritable manufacture / maison Arpin utilisée comme ancrage documentaire pour la laine en Savoie.

## État par département

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

Note documentaire : le gameplay `69` regroupe actuellement Rhône + Métropole de Lyon pour des raisons de continuité du moteur. Cette simplification est connue et volontaire à ce stade.

### Savoie — DENSE
Chambéry, Aix-les-Bains, Albertville, Beaufort, Bourg-Saint-Maurice, Modane + stations et hautes vallées densifiées.

### Haute-Savoie — DENSE
Annecy, Chamonix-Mont-Blanc, Le Grand-Bornand, Châtel, Megève, Évian-les-Bains, Thonon-les-Bains, Morzine, Avoriaz, La Clusaz, Cluses, Sallanches, Saint-Gervais-les-Bains, Samoëns, Yvoire.

## Dettes restantes non bloquantes

### A. QA navigateur / runtime réel

À faire avant fusion :
- entrer physiquement dans au moins une ville par département ;
- vérifier chargement des scripts sans 404 ;
- observer un marqueur ;
- déclencher une rencontre ;
- provoquer un brief ou secret ;
- vérifier remontée Téléphone ;
- vérifier Agenda ;
- vérifier Atelier ;
- vérifier Book ;
- recharger la page et confirmer la persistance ;
- vérifier qu’un focus carte seul ne déplace pas Marion.

Cette QA n’a **pas** encore été déclarée passée.

### B. Tables centrales héritées

`territory-context-v1.js` garde encore une table historique de villes plus petite que le fallback V8. Le runtime V8 compense une grande partie du problème, mais une future passe de nettoyage pourra synchroniser directement les deux tables pour réduire la duplication.

### C. Haute-Savoie / Savoie

Le chargement 74 conserve son architecture spécifique déjà branchée sur la page Ville. Le fallback V8 connaît les principales communes du 74, mais la passe de refactorisation future pourra unifier totalement 73/74 avec le même chargeur générique que les autres départements.

### D. PNJ placeholders hérités

Certaines anciennes banques générées pendant les premières vagues Drôme, Ardèche et Savoie utilisent encore des noms de type `Contact <ville> <n>`.

Ce n’est pas un blocage runtime mais c’est la principale dette de contenu restante. Passe recommandée :
- noms fictionnels naturels ;
- âge / tranche d’âge ;
- métier ;
- niveau économique ;
- goût vestimentaire ;
- personnalité ;
- horaires / lieux de présence ;
- motivations ;
- potentiel amitié / rivalité / romance / client / collaboration ;
- mémoire relationnelle.

### E. Normalisation des noms

Le fallback V8 couvre plusieurs apostrophes critiques. Une future fonction de normalisation globale serait néanmoins plus robuste qu’une accumulation d’alias :
- apostrophe droite / typographique ;
- tirets ;
- accents ;
- espaces ;
- variantes administratives récentes.

## Conclusion

La région n’a plus de département structurellement vide.

Le prochain travail recommandé n’est **pas** d’ajouter encore du volume territorial à Auvergne-Rhône-Alpes. Il est de faire une vraie QA end-to-end et une passe PNJ/relations sur les banques héritées, puis seulement ensuite de commencer une autre région française.

Aucun merge vers `main` et aucun déploiement ne doivent être effectués sans demande explicite.