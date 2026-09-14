# AIN — AUDIT D’INTÉGRATION CARTE V1

## Statut général

**Ain : première intégration territoriale complète en cours, utilisable comme département pilote du pipeline standard.**

L’objectif de cet audit n’est pas de valider la recherche documentaire — déjà largement avancée — mais de vérifier que le contenu quitte réellement les fichiers de recherche pour devenir exploitable sur les cartes et par les systèmes de jeu.

---

## 1. Grande carte interactive

### En place

La couche Ain expose désormais :

- Bourg-en-Bresse ;
- Oyonnax ;
- Jujurieux ;
- Cerdon ;
- Saint-Rambert-en-Bugey ;
- Pérouges ;
- Ambronay ;
- Nantua ;
- Gex ;
- Ferney-Voltaire ;
- Mijoux ;
- Villars-les-Dombes ;
- Châtillon-sur-Chalaronne ;
- Vonnas ;
- Belley ;
- Meillonnas ;
- Ambérieu-en-Bugey ;
- Valserhône.

Chaque pôle possède une identité gameplay courte permettant de comprendre pourquoi une créatrice de mode pourrait y aller.

### Règle validée

Ouvrir un pôle = aperçu.

Ouvrir une commune = aperçu.

Seul **SE RENDRE ICI** change la présence de Marion.

Aucune résidence n’est nécessaire.

---

## 2. Carte locale Sortir / Ville

### En place

Le registre Ain contient maintenant des repères dans plusieurs familles :

- patrimoine ;
- culture ;
- archives ;
- textile ;
- artisanat ;
- bijoux / accessoires ;
- nature ;
- marchés ;
- rencontres fictives ;
- couche saisonnière.

Exemples déjà intégrés : Brou, archives de Bourg, scène culturelle de Bourg, émaux bressans comme inspiration, Soieries Bonnet, cuivre de Cerdon, mémoire de la schappe, Musée du Peigne et de la Plasturgie, Grande Vapeur, Pérouges, Ambronay, Nantua, Gex, Ferney, Mijoux, Dombes, Châtillon-sur-Chalaronne, Vonnas, Belley, Meillonnas.

---

## 3. Résidence / présence / exploration

### Validé

La résidence et la présence sont stockées séparément.

La carte locale préfère la présence réelle. La résidence n’est qu’un repère « CHEZ MOI » quand elle existe.

Un territoire n’active pas ses contenus locaux simplement parce que Marion y possède un logement.

L’absence de logement ne bloque plus la carte locale.

---

## 4. Saison

### Première couche en place

L’Ain possède des variations procédurales simples selon la saison du temps de jeu :

- printemps : lumière, végétation, repérage ;
- été : événements extérieurs, mariages, festivals ;
- automne : matières plus denses, brocante, upcycling ;
- hiver : froid, relief, cérémonies, superposition.

### À approfondir

Brancher progressivement le calendrier annuel réel documenté et ses occurrences précises, avec revalidation des dates lorsque nécessaire.

---

## 5. Atelier / Book

### En place

Les repères territoriaux peuvent déjà porter des sorties comme :

- `TECHNIQUE_OBSERVED` ;
- `MATERIAL_KNOWLEDGE` ;
- `DESIGN_REFERENCE` ;
- `PALETTE_REFERENCE` ;
- `MOTIF_REFERENCE` ;
- `CRAFT_CONTACT` ;
- `COLLAB_CAPABILITY` ;
- `BOOK_RESEARCH`.

La carte locale peut enregistrer un lieu dans le Book.

### Règle validée

Observer un métier ou un savoir-faire ne donne pas une maîtrise immédiate.

---

## 6. Personnages

### Première couche en place

Les rencontres fictives peuvent apparaître comme contenu local clairement marqué fiction gameplay.

### Encore à convertir depuis les banques Ain

- davantage de personnages persistants ;
- lieux fréquentés ;
- horaires probables ;
- réseaux ;
- historique de relation ;
- déplacement entre communes ;
- événements qui les font apparaître ;
- revisites plusieurs années plus tard.

Les personnes réelles restent du contexte documentaire et ne deviennent pas automatiquement des PNJ scénarisés.

---

## 7. Missions / briefs / clientèle

### Recherche disponible

Les banques de missions, clientèle, briefs, secrets et opportunités existent dans les fichiers territoriaux Ain et Bourg.

### Prochaine conversion technique

Pour chaque mission :

- territoire ;
- niveau de carrière ;
- saison ;
- personnage ou type de clientèle ;
- origine de l’opportunité ;
- lieu ;
- conséquence téléphone / agenda ;
- sortie Atelier ;
- sortie Book ;
- réputation ;
- revisite éventuelle.

Cette couche doit être branchée progressivement sans transformer la carte en liste exhaustive de quêtes visibles d’avance.

---

## 8. Secrets / rumeurs / découvertes

### Recherche disponible

Des banques existent déjà, notamment pour Bourg et les principaux bassins Ain.

### Principe d’intégration

Un secret ne doit pas apparaître comme un pin standard dès la première visite.

Il doit dépendre d’au moins un des facteurs suivants :

- relation ;
- réputation ;
- visite précédente ;
- événement ;
- saison ;
- rumeur ;
- mission ;
- personnage ;
- progression de carrière.

---

## 9. Revisites / carrière longue

### Structure disponible

Le fichier de changement du monde Ain prévoit notamment : retraite, transmission, fermeture, nouvel atelier, nouveaux matériaux, nouvelles générations de clientes et transformation d’événements.

### À brancher

Les cartes doivent pouvoir modifier les repères, les contacts ou les opportunités en fonction de l’année de carrière et de l’historique de Marion.

---

## 10. Verdict

### Déjà réellement passé de la recherche à la carte

- architecture présence/résidence/exploration ;
- grande carte Ain élargie ;
- voyage explicite ;
- carte locale utilisable sans résidence ;
- principaux pôles Ain ;
- premières ressources patrimoine/textile/artisanat/culture/nature ;
- premières sorties Book/Atelier ;
- première saisonnalité ;
- première rencontre fictive.

### Encore à convertir

- calendrier événementiel détaillé ;
- personnages persistants complets ;
- dizaines de briefs ;
- clientèle détaillée ;
- secrets/rumeurs ;
- téléphone et agenda ;
- réputation locale ;
- revisites relationnelles ;
- changement du monde 20–30 ans ;
- davantage de lieux commerciaux/professionnels réels vérifiés.

## Règle pour les prochains territoires

Aucun nouveau département ne doit être considéré terminé simplement parce que sa recherche est écrite.

Il doit passer par le même pipeline jusqu’à ce que ses données puissent réellement alimenter :

**grande carte → voyage → carte locale → rencontres → événements → missions → Atelier → Book → mémoire → revisites.**