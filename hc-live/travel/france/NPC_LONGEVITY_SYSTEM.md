# Haute Couture Live — système de personnages territoriaux longue durée

## But
Permettre des milliers de rencontres distinctes sur 20–30 ans de temps de jeu sans afficher les mêmes personnes partout ni épuiser un territoire en quelques semaines.

## Trois niveaux de personnages
1. **Personnages auteurs** : personnages importants écrits à la main, avec portrait, histoire longue, missions et arcs relationnels.
2. **Personnages territoriaux persistants** : générés de manière déterministe à partir du lieu, de la période et d’un seed ; une fois rencontrés, ils gardent leur identité, métier, caractère et historique dans la sauvegarde.
3. **Figurants contextuels** : silhouettes temporaires pour marchés, musées, événements, files d’attente, cafés, etc. Ils ne deviennent persistants que si une interaction les promeut.

## Diversité
Le générateur combine prénom, nom, rôle local, traits principaux/secondaires, objectif, style relationnel, tranche d’âge narrative, rapport à la mode, habitudes, disponibilité et hooks. Avec les pools combinatoires, le moteur peut produire des centaines de milliers de profils distincts sans devoir écrire manuellement autant de fichiers.

Les personnages importants d’un territoire restent néanmoins éditorialisés manuellement pour garantir des histoires fortes.

## Apparition
Une rencontre dépend de plusieurs facteurs :
- lieu précis ou écosystème ;
- jour de jeu et saison ;
- nombre de visites ;
- réputation et ancienneté de carrière ;
- actions récentes ;
- personnages déjà connus ;
- événements locaux ;
- cooldown de la rencontre ;
- rareté.

Un symbole « rencontre » n’apparaît donc pas forcément lors de la première visite d’un lieu. Certaines personnes sont révélées par un message, une rumeur, une autre relation, un marché, une mission, une story ou une visite répétée.

## Mémoire
À la première vraie interaction, le personnage est enregistré dans `knownPeople` : identité, lieu de rencontre, jour de rencontre, traits, profession, relation, historique et lieux où il a été recroisé.

## Renouvellement
Les pools tournent par périodes de 28 jours de jeu. Cela ne remplace pas un personnage connu : ça renouvelle seulement les personnes potentielles que l’on peut découvrir. Les personnages persistants peuvent réapparaître plus tard grâce à leurs propres règles.

## Progression lente
La plupart des rencontres donnent : conversation, renseignement, adresse, petite inspiration, rumeur ou relation. Très peu donnent immédiatement une mission de carrière majeure. Une relation utile peut demander plusieurs rencontres espacées sur des semaines, mois ou années de jeu.

## Arcs possibles
- cliente occasionnelle → cliente régulière → recommandation ;
- artisan aperçu au marché → atelier visité → collaboration ;
- journaliste locale → petit article → invitation → contact national plusieurs années après ;
- collectionneur → objet montré → enquête → archive rare ;
- costumière → dépannage → commandes théâtre → gros projet historique ;
- commerçante → stock spécial → confiance → accès arrière-boutique / pièce rare.

## Réel vs fiction
Les personnalités historiques réelles apparaissent seulement comme contenu documentaire vérifié. Les personnages jouables contemporains fictifs ne doivent pas être présentés comme des personnes réelles liées à un commerce réel sans vérification.