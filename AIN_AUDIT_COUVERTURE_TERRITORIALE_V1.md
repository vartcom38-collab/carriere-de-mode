# AIN — AUDIT COUVERTURE TERRITORIALE V1

Statut : **DENSE / RUNTIME TERRITORIAL OPÉRATIONNEL / PARITÉ NÎMES FERMÉE / QA TRANSVERSALE VERTE**

## Pôles couverts
- Bourg-en-Bresse — capitale départementale, architecture, cérémonie, photographie, clientèle, métiers d’art.
- Oyonnax — peigne, plasturgie, acétate, lunetterie, prototype, design et accessoire.
- Jujurieux — soieries, velours, tissage, archives, mémoire industrielle textile.
- Pérouges — patrimoine, pierre, photographie, cérémonie, vintage et réemploi.
- Gex / Pays de Gex — clientèle transfrontalière, Genève, Monts Jura, savoir-faire et mobilité.
- Ferney-Voltaire — culture, réception, représentation et réseau international.
- Mijoux — lapidaire, pierre, bijou/accessoire, froid jurassien.
- Belley / Bugey — clientèle locale, vallée, cérémonie, matières sobres.
- Villars-les-Dombes / Dombes — eau, lumière, mariage, photographie, saisonnalité extérieure.
- Nantua / Haut-Bugey — lac, relief, image, pont avec l’écosystème industriel d’Oyonnax.

## Ancrages documentaires principaux
- Soieries Bonnet à Jujurieux : ensemble industriel textile exceptionnel conservant dimensions matérielles et immatérielles de l’industrie textile.
- Musée du Peigne et de la Plasturgie à Oyonnax : environ 16 000 objets, ornements de coiffure, lunettes, matières plastiques, mode, design, machines et outils ; présence de créations de Paco Rabanne dans les collections.
- Pays de Gex : chemin des savoir-faire, artisans/producteurs, Monts Jura, patrimoine et logique transfrontalière.

## Banques de contenu
Banques existantes Bourg-en-Bresse + Oyonnax :
- 68 personnages
- 120 briefs
- 36 secrets
- 22 familles d’événements

Extension dense Jujurieux / Pérouges / Gex / Ferney-Voltaire / Mijoux / Belley / Villars-les-Dombes / Nantua :
- 240 personnages
- 408 briefs
- 122 secrets
- 71 familles d’événements

Total bancaire minimal Ain :
- **308 personnages**
- **528 briefs**
- **158 secrets**
- **93 familles d’événements**

Ces totaux n’incluent pas les contacts persistants, briefs et événements déjà générés directement par `ain-territorial-gameplay-v1.js`, afin d’éviter le double comptage.

## Systèmes couverts
- Atelier : matières, prototype, accessoire, tissage, réemploi, cérémonie.
- Book : architecture, patrimoine industriel, photo, nature, recherche matière.
- Téléphone : contacts, rumeurs, recommandations, réseaux locaux/transfrontaliers.
- Agenda : briefs et familles d’événements saisonniers.
- Clientes : cérémonie, mariage, clientèle locale et internationale.
- B2B : Oyonnax, Nantua/Haut-Bugey, Pays de Gex.
- Shooting : Bourg, Pérouges, Dombes, Nantua.
- Sourcing / matériaux : Jujurieux, Oyonnax, Mijoux.
- Temps canonique : les actions territoriales passent par le temps de jeu central.
- Invitations : création, téléphone, RSVP et agenda canonique.
- Studio photo : blocage sans création Atelier terminée, puis utilisation de la vraie création finie.
- Mémoire / revisites : visites, découvertes, relations et hébergement temporaire persistants.

## Intégration runtime
Le code départemental `01` était déjà reconnu par `territory-context-v1.js` et son moteur territorial était déjà chargé. L’audit avait identifié un manque : aucun pack carte `01` n’était présent dans `DEPARTMENT_MAP_PACK`.

Correction appliquée sans remplacer le moteur existant :
- `ain-map-content-v2.js`
- `ain-dense-universe-v1.js`
- `ain-dense-city-banks-v1.js`
- branchement via `territorial-signal-runtime-v1.js::bootstrapExtendedTerritories()` pour `01`.

La fermeture de parité Nîmes ajoute également :
- `ain-territorial-gameplay-v1.js` V2 ;
- `ain-parity-system-bridge-v1.js` comme source canonique pour temps, invitations/RSVP et studio ;
- les shims de compatibilité `ain-canonical-time-v1.js`, `ain-invitations-v1.js`, `ain-studio-photo-v1.js` sans listeners concurrents.

Le store `haute-couture-ain-territorial-gameplay-v1` reste intégré au rattrapage des signaux.

## QA navigateur — validation dédiée Ain
Le scénario Playwright/Chromium dédié valide notamment :
- cinq pôles Ain avec interfaces spécialisées ;
- personnes et objets narratifs temporaires ;
- mémoire de visite, Book et Atelier ;
- hébergement temporaire ;
- temps canonique ;
- invitation → Téléphone → RSVP → Agenda ;
- studio utilisant une vraie création Atelier terminée ;
- absence de `SyntaxError` / `ReferenceError` bloquante.

Référence de validation dédiée déjà obtenue : commit `c4a98a305719fcce8a6f96d8e7303179fa8e6f46`, workflow `Ain Nîmes Parity`, vert.

## QA transversale AURA — fermeture du 15 septembre 2026
La fermeture finale n’est pas basée uniquement sur le test dédié Ain. Elle a été revalidée dans les deux recettes régionales au SHA exact :

`ed5fb90b6450cdf3cae1e8a4e30d915a9ab19bf1`

### Interfaces représentatives
Workflow : `Territoires UI E2E`
Run : `34951350562`
Résultat : **VERT**.

Blocs validés :
- Ain + Allier ;
- Cantal ;
- Haute-Loire ;
- Puy-de-Dôme ;
- Drôme + Ardèche ;
- Savoie + Haute-Savoie ;
- Isère + Loire + Rhône ;
- Atelier unlocks 01/03/07/15 ;
- Atelier unlocks 26/38/42/43 ;
- Atelier unlocks 63/69/73/74.

Cette recette contrôle réellement l’ouverture et la visibilité des interfaces ainsi que les ponts vers l’Atelier ; elle ne se limite pas à vérifier la présence de données.

### Matrice exhaustive 12 départements
Workflow : `Territoires UI Exhaustive`
Run : `34951350541`
Résultat final après reruns ciblés de deux timeouts d’exécution : **12/12 VERTS**.

Départements validés : `01`, `03`, `07`, `15`, `26`, `38`, `42`, `43`, `63`, `69`, `73`, `74`.

Aucune assertion métier ou documentaire n’a été supprimée ou abaissée. Les deux échecs transitoires constatés sur `43` (Langeac) et `73` (Chambéry) étaient des timeouts de passage ; les reruns du même SHA ont réussi sans modification de code ni augmentation du timeout. Les 17 défauts de contenu Haute-Loire précédemment détectés sur Crozatier, Dentelle du Puy, Chavaniac-Lafayette et la référence documentaire Lafayette sont corrigés à la source et ne réapparaissent plus.

### Décision de fermeture
**Ain 01 peut être considéré comme fermé au niveau de parité territoriale actuellement exigé pour passer au département suivant.**

Cette fermeture signifie :
- test dédié Ain validé ;
- interfaces AURA représentatives validées ;
- ponts Atelier validés ;
- matrice exhaustive 12 départements validée ;
- distinction réel / fictif et contrat média contrôlés ;
- temps, mémoire, Book, Atelier, invitations et studio couverts par les systèmes Ain.

**Aucun déploiement production n’a été effectué dans cette phase.**

## Extensions futures non bloquantes
- Trévoux / Val de Saône
- Ambronay
- Cerdon
- Divonne-les-Bains
- Plateau d’Hauteville
- Miribel / côtière lyonnaise

Ces extensions ne sont pas nécessaires pour considérer l’Ain jouable et territorialement dense.