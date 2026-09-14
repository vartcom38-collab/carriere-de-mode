# HAUTE COUTURE LIVE — PIPELINE TERRITORIAL STANDARD V1

## But
Cette méthode devient le passage obligatoire pour chaque région, département, ville, commune ou bassin territorial ajouté au jeu.

Elle évite qu’un territoire soit seulement documenté dans un fichier ou seulement représenté par quelques pins sur une carte.

Le flux complet est :

**checklist → recherche → validation du réel → traduction gameplay → données structurées → carte nationale → voyage explicite → carte locale → personnages/événements/missions → Atelier/Book → revisites → audit**

---

## 1. Checklist territoriale complète

Appliquer la checklist officielle « RECHERCHE & CONTENU TERRITORIAL » sans supprimer de catégorie.

Chaque territoire doit couvrir au minimum : identité, histoire vestimentaire, matières, motifs, savoir-faire, communes, lieux, saisonnalité, événements, mode, scène, mariage, tourisme, professionnels, personnages, clientèle, missions, photographie, Book, Atelier, secrets, connexions, carrière longue et changement du monde.

La matrice départementale à 30 catégories reste obligatoire.

---

## 2. Distinguer les statuts de contenu

Chaque élément doit être identifiable comme :

- `REAL_VERIFIED` : lieu, institution, événement, savoir-faire ou professionnel réel vérifié ;
- `REAL_CONTEXT_ONLY` : personne ou acteur réel utilisé comme contexte documentaire mais jamais automatiquement comme PNJ scénarisé ;
- `FICTION_GAMEPLAY` : personnage, atelier-pont, mission, rumeur, secret ou événement créé pour le jeu ;
- `PROCEDURAL` : contenu produit par le moteur à partir du territoire, de la saison, de la réputation, des relations ou du temps du jeu.

Un élément réel ne doit jamais recevoir une interaction fictive complexe sans passer par une couche de fiction clairement séparée.

---

## 3. Traduction en gameplay

Pour chaque lieu ou ressource, déterminer :

- pourquoi Marion viendrait ici ;
- ce qu’elle peut observer ;
- ce qu’elle peut apprendre ;
- ce qu’elle peut ajouter au Book ;
- ce qui peut nourrir l’Atelier ;
- quelles personnes elle peut rencontrer ;
- quelles missions ou commandes peuvent apparaître ;
- ce qui change selon la saison ;
- ce qui devient accessible avec la réputation ou une relation ;
- pourquoi elle aurait une raison de revenir plusieurs années plus tard.

Aucun lieu ne doit être conservé seulement parce qu’il « remplit la carte ».

---

## 4. Séparer résidence, présence et exploration

Trois états différents doivent toujours rester indépendants :

### Résidence
Lieu où Marion habite. Elle peut conserver une résidence dans un territoire tout en voyageant ailleurs.

### Présence
Lieu où Marion se trouve réellement à cet instant du jeu. C’est cette information qui active la vie locale vécue : rencontres, opportunités locales, événements de proximité, certaines missions et carte « Sortir / Ville ».

### Focus de carte
Lieu que la joueuse est seulement en train de consulter sur la grande carte interactive. Le focus ne déplace jamais Marion.

Ordre fonctionnel :

**ouvrir un territoire = aperçu**

**« SE RENDRE ICI » = changement de présence**

**acheter/louer un logement = changement de résidence uniquement**

Aucune résidence n’est obligatoire pour voyager.

---

## 5. Intégration grande carte interactive

Chaque territoire documenté doit rejoindre la couche nationale avec :

- ses pôles majeurs ;
- ses pôles secondaires utiles ;
- une courte identité gameplay ;
- une action « ouvrir la commune » quand elle existe ;
- une action explicite « se rendre ici » ;
- l’indication de la présence actuelle ;
- aucun déplacement automatique à l’ouverture d’un pin.

La grande carte est une carte d’exploration et de préparation au voyage, pas une carte de résidence.

---

## 6. Intégration carte locale

Lorsqu’une présence explicite existe dans le territoire, la carte locale peut charger :

- patrimoine ;
- musées / culture ;
- archives ;
- tissus / merceries / fournisseurs ;
- artisans ;
- marchés ;
- brocantes / vintage ;
- nature / paysages ;
- photo / points de vue ;
- bijoux / accessoires ;
- rencontres ;
- événements temporaires ;
- lieux liés aux missions.

La résidence peut être affichée comme repère « CHEZ MOI », mais ne doit jamais déclencher à elle seule le contenu local.

---

## 7. Saison et temps du jeu

Chaque territoire doit recevoir une couche saisonnière ou calendaire.

Le contenu peut dépendre de :

- jour du jeu ;
- mois / saison ;
- calendrier réel documenté quand approprié ;
- événements procéduraux ;
- réputation ;
- relations ;
- niveau de carrière ;
- historique de visites.

Un événement réel daté doit être revalidé pour l’année représentée par le jeu. Une structure récurrente peut être gardée comme patron, mais une date réelle ne doit pas être figée éternellement.

---

## 8. Personnages et vie locale

Les personnages persistants ne sont pas des pins fixes.

Ils doivent avoir :

- territoire d’attache ;
- lieux fréquentés ;
- plages d’apparition probables ;
- métier / fonction ;
- réseau ;
- relation avec Marion ;
- mémoire des rencontres ;
- capacité de déplacement éventuelle ;
- raisons de réapparaître.

Les PNJ temporaires peuvent dépendre d’un événement, d’une saison, d’une mission ou d’un passage.

---

## 9. Sorties Atelier et Book

Les découvertes territoriales doivent produire des sorties structurées compatibles avec les systèmes de création :

- `TECHNIQUE_LEARNED`
- `TECHNIQUE_OBSERVED`
- `MATERIAL_KNOWLEDGE`
- `DESIGN_REFERENCE`
- `PALETTE_REFERENCE`
- `MOTIF_REFERENCE`
- `CRAFT_CONTACT`
- `COLLAB_CAPABILITY`
- `BOOK_RESEARCH`

Observer un savoir-faire ne donne jamais automatiquement une maîtrise professionnelle.

---

## 10. Missions, opportunités et téléphone

Le territoire doit pouvoir provoquer des conséquences dans plusieurs systèmes :

- commande cliente ;
- mission professionnelle ;
- appel / message ;
- événement agenda ;
- rencontre ;
- recommandation ;
- réputation ;
- Book ;
- Atelier ;
- déplacement futur ;
- relation persistante.

Les contenus importants doivent rester déterministes ou mémorisés afin d’éviter le reroll par rechargement.

---

## 11. Revisites et carrière longue

Un territoire doit pouvoir évoluer pendant 20 à 30 années de carrière :

- départ à la retraite ;
- transmission d’atelier ;
- nouveau commerce ;
- fermeture ou disparition d’une opportunité ;
- nouvel acteur fictif ;
- nouvelle génération de clientes ;
- modification d’un événement ;
- nouvelles matières ;
- changement de réputation de Marion ;
- relations devenues fortes, froides ou professionnelles.

Les événements de changement doivent garder une trace de l’ancien état et du nouvel état.

---

## 12. Validation avant de passer au territoire suivant

Un territoire est considéré « prêt pour intégration » seulement si :

- la checklist n’a pas de grande catégorie vide ;
- les éléments réels et fictifs sont séparés ;
- les principaux pôles sont visibles sur la grande carte ;
- Marion peut s’y rendre sans y résider ;
- l’ouverture de la carte ne la téléporte pas ;
- la présence active la carte locale ;
- la résidence ne déclenche pas seule la vie locale ;
- les lieux apportent des gains ou conséquences réelles ;
- au moins une logique saisonnière existe ;
- personnages, clientèle et missions peuvent s’y greffer ;
- Atelier et Book reçoivent des sorties structurées ;
- des revisites sont prévues ;
- la carrière longue est possible ;
- un audit de clôture est réalisé.

---

## 13. Application à l’Ain

L’Ain devient le premier département à passer officiellement par ce pipeline complet.

La grande carte expose désormais les principaux pôles et plusieurs pôles secondaires ; la carte locale reçoit des lieux patrimoniaux, textiles, artisanaux, culturels, naturels et des couches saisonnières ; la présence et la résidence sont indépendantes.

La suite du travail sur l’Ain consiste à continuer à convertir les banques déjà documentées en données jouables : événements précis, personnages persistants, briefs, secrets, opportunités téléphone/agenda, revisites et changements de monde.

Ce fichier sert de gabarit obligatoire pour les prochains territoires.