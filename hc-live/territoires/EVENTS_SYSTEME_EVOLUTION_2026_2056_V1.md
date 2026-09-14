# HAUTE COUTURE LIVE — SYSTÈME D’ÉVÉNEMENTS ÉVOLUTIFS 2026 → 2056

## OBJECTIF

Les événements réels de 2026 servent de **base documentaire** et de référence initiale. Ils ne doivent jamais être rejoués à l’identique pendant 20 à 30 ans de carrière.

Le système doit produire un monde crédible où :
- certains événements reviennent chaque année ;
- certaines éditions changent de thème, de lieu, de partenaires ou d’ampleur ;
- certains événements disparaissent ;
- d’autres naissent ;
- certains fusionnent ou se déplacent ;
- certaines éditions deviennent exceptionnelles ;
- Marion garde la mémoire de ce qu’elle a déjà vécu ;
- le gameplay ne recycle jamais exactement le même brief, la même rencontre et la même conséquence.

Principe central :

**événement-source réel → famille d’événement → édition annuelle → variations → conséquences → mémoire → édition suivante différente**

---

# 1 — LES ÉVÉNEMENTS 2026 NE SONT PAS DES ÉVÉNEMENTS PERMANENTS

Chaque événement réel documenté en 2026 doit recevoir un statut :

- `ANNUAL_STABLE` : rendez-vous historiquement récurrent, mais édition variable ;
- `ANNUAL_VARIABLE` : revient souvent mais avec contenu fortement renouvelé ;
- `PERIODIC` : peut revenir tous les 2, 3, 4 ans ou de manière irrégulière ;
- `ONE_OFF_REAL_2026` : édition/exposition précise 2026 qui ne doit jamais être supposée revenir ;
- `SEASONAL_FAMILY` : famille générique annuelle (brocante, marché de Noël, saison thermale, festival d’été, exposition temporaire) ;
- `PROCEDURAL_FICTION` : événement fictif généré par le jeu à partir de la réalité territoriale ;
- `LEGACY_EVENT` : événement disparu mais conservé dans la mémoire de Marion et du territoire.

Une exposition temporaire de 2026 ne devient jamais automatiquement une exposition permanente.

---

# 2 — UNE ÉDITION ANNUELLE EST UNE INSTANCE, PAS LE MÊME ÉVÉNEMENT

Exemple :

`Biennale textile Clermont-Ferrand`

peut produire :

- 2026 : territoire / textile / production ;
- 2028 : couleur et paysage ;
- 2030 : réparation et transmission ;
- 2032 : fibres techniques ;
- 2034 : costume et scène ;

Ce sont cinq éditions d’une même famille, avec des artistes, commandes, lieux, ateliers et conséquences différents.

Le moteur doit mémoriser un `event_family_id` et un `edition_id` distinct.

---

# 3 — VARIABLES D’UNE ÉDITION

Chaque nouvelle édition peut varier selon :

- thème ;
- commissariat / direction ;
- lieux participants ;
- durée ;
- échelle locale / départementale / régionale / nationale / internationale ;
- public ;
- météo et saison ;
- nombre de participants ;
- artistes / artisans / intervenants ;
- partenaires ;
- budget ;
- réputation de l’événement ;
- incidents ;
- nouvelle adresse ;
- changements politiques ou institutionnels non simulés nominativement ;
- évolution démographique ;
- évolution des métiers ;
- changement climatique ;
- nouveaux matériaux ;
- tendances culturelles ;
- niveau de carrière de Marion ;
- réseau local de Marion ;
- éditions que Marion a déjà vécues.

---

# 4 — ANTI-REDONDANCE ABSOLUE

Avant de générer une proposition liée à un événement, vérifier :

1. Marion a-t-elle déjà reçu un brief très proche ?
2. a-t-elle déjà rencontré ce type de client dans ce même contexte ?
3. a-t-elle déjà découvert ce secret ?
4. a-t-elle déjà utilisé ce lieu de la même façon ?
5. a-t-elle déjà produit une création avec le même objectif narratif ?
6. cette édition apporte-t-elle au moins une nouveauté significative ?

Si la réponse 6 est non, l’événement ne génère pas de mission spéciale cette année.

Un événement peut simplement exister dans l’agenda et la ville sans toujours produire du gameplay majeur.

---

# 5 — MÉMOIRE DES ÉDITIONS

Conserver pour chaque événement :

- années vues ;
- années auxquelles Marion a participé ;
- créations associées ;
- personnes rencontrées ;
- invitations refusées ;
- réussites ;
- échecs ;
- incidents ;
- collaborations ;
- accès obtenus ;
- articles / photographies / traces Book ;
- changements remarqués entre deux éditions.

Exemple :

> « Tu étais venue ici huit ans plus tôt. À l’époque le défilé se tenait encore dans la cour. Cette année, l’organisation a investi l’ancienne usine. »

---

# 6 — CYCLE DE VIE D’UN ÉVÉNEMENT

Un événement peut suivre :

`naissance → petite édition → croissance → reconnaissance → crise → transformation → disparition / renaissance`

Toutes les familles ne suivent pas ce cycle intégralement.

Évolutions possibles :

- changement de nom ;
- changement de lieu ;
- nouveau directeur ;
- élargissement du programme ;
- édition réduite ;
- année blanche ;
- fusion avec un autre événement ;
- scission ;
- recentrage ;
- disparition ;
- retour dix ans plus tard ;
- création d’un événement concurrent.

---

# 7 — NAISSANCE DE NOUVEAUX ÉVÉNEMENTS

Le monde ne peut pas dépendre uniquement d’événements existants en 2026.

Le moteur doit pouvoir générer :

- nouvelle exposition temporaire ;
- nouveau marché de créateurs ;
- semaine des métiers d’art ;
- festival textile ;
- festival photo ;
- nouveau salon mariage ;
- défilé étudiant ;
- concours jeune création ;
- journée patrimoine industriel ;
- résidence artistique ;
- nouvelle foire vintage ;
- festival musical ;
- nouvel événement sportif ou touristique créant des besoins vestimentaires ;
- inauguration culturelle ;
- anniversaire important d’un lieu ;
- rétrospective historique ;
- événement lié à une nouvelle génération d’artisans.

Ces événements sont marqués `PROCEDURAL_FICTION` sauf s’ils correspondent à un événement réel revalidé pour l’année concernée.

---

# 8 — ÉVÉNEMENTS NON-MODE = GAMEPLAY MODE POSSIBLE

Le jeu ne doit jamais donner l’impression que tout territoire possède un festival de mode.

Une feria, un festival de jazz, une saison thermale, une fête patrimoniale, une course, une fête médiévale, un festival cinéma ou une inauguration peuvent créer :

- tenue de scène ;
- costume ;
- habillage ;
- tenue protocolaire ;
- tenue de voyage ;
- série d’accessoires ;
- commande mariage / réception ;
- stylisme photo ;
- vêtements pour personnel ;
- retouches urgentes ;
- shooting éditorial ;
- collaboration avec artisan ;
- recherche pour une collection future.

Mais cela reste une conséquence possible, jamais automatique.

---

# 9 — POIDS DE LA CARRIÈRE

Le même événement produit des opportunités différentes selon le niveau de Marion.

## Début
- visiter ;
- observer ;
- aider ponctuellement ;
- petite retouche ;
- petite commande ;
- participer à un atelier public ;
- rencontrer un personnage.

## Développement
- stylisme d’un participant ;
- mini-série ;
- shooting ;
- costume ;
- stand partagé ;
- collaboration avec un artisan.

## Confirmée
- capsule ;
- artiste principal ;
- commande institutionnelle fictive ;
- direction vestimentaire partielle ;
- présentation publique ;
- conférence / jury occasionnel.

## Avancée
- commissariat lié au vêtement ;
- rétrospective ;
- mentorat ;
- jury ;
- création d’un événement ;
- transmission ;
- archive personnelle exposée ;
- retour comme invitée majeure dans un lieu fréquenté au début de carrière.

---

# 10 — ROTATION DES TYPES DE GAMEPLAY

Pour éviter qu’un même festival génère chaque année « fais une robe », le moteur choisit parmi plusieurs fonctions :

- `OBSERVE`
- `RESEARCH`
- `MEET`
- `CLIENT_ORDER`
- `ALTERATION`
- `COSTUME`
- `ACCESSORY`
- `PHOTO`
- `COLLAB`
- `BOOK_MEMORY`
- `PRESS`
- `JURY`
- `TEACH`
- `MENTOR`
- `SHOW`
- `SOURCE_MATERIAL`
- `SECRET`
- `NO_SPECIAL_EVENT`

Deux années consécutives d’une même famille ne devraient pas utiliser la même fonction principale sauf justification narrative forte.

---

# 11 — BUDGET DE RÉPÉTITION

Pour chaque `event_family_id`, conserver :

- `last_primary_gameplay_type`
- `last_client_archetype`
- `last_location`
- `last_reward_type`
- `last_visual_theme`
- `last_material_family`
- `last_major_character`

Le moteur attribue un malus aux éléments récemment utilisés.

Exemple :

Si les deux dernières éditions d’un festival ont déjà produit :
- une tenue de scène ;
- un shooting nocturne ;

l’édition suivante privilégie plutôt :
- une collaboration accessoire ;
- un jury ;
- une recherche textile ;
- aucune mission mais une rencontre ;
- un événement perturbé ou transformé.

---

# 12 — REDONDANCE À L’ÉCHELLE DU TERRITOIRE

L’anti-répétition ne doit pas fonctionner uniquement événement par événement.

Si Marion vient d’avoir trois missions mariage dans le département, la prochaine fête locale ne doit pas immédiatement générer encore un mariage même si cela serait plausible.

Le moteur vérifie :

- les 10 dernières missions locales ;
- les 20 dernières missions globales ;
- les catégories trop fréquentes ;
- les matières trop utilisées ;
- les mêmes silhouettes ;
- les mêmes types de clients ;
- les mêmes types de lieux.

---

# 13 — ANNÉES CALMES

Toutes les années ne doivent pas être spectaculaires.

Une famille d’événements peut avoir une édition :

- normale ;
- faible ;
- très forte ;
- annulée ;
- déplacée ;
- reprogrammée ;
- limitée ;
- exceptionnelle.

Une carrière longue a besoin de respiration.

---

# 14 — ÉVÉNEMENTS EXCEPTIONNELS

Rarement, une édition peut recevoir un tag :

- `ANNIVERSARY`
- `MAJOR_REOPENING`
- `INTERNATIONAL_YEAR`
- `NEW_VENUE`
- `FINAL_EDITION`
- `RETURN_AFTER_ABSENCE`
- `MAJOR_RETROSPECTIVE`
- `GENERATION_CHANGE`

Ces éditions peuvent débloquer du contenu rare.

---

# 15 — RELATIONS ET ÉVÉNEMENTS

Les événements changent aussi à cause des personnes.

Un personnage peut :

- devenir organisateur ;
- quitter l’événement ;
- inviter Marion ;
- ne plus pouvoir l’aider ;
- présenter Marion à quelqu’un ;
- devenir client ;
- devenir concurrent ;
- revenir après plusieurs années ;
- transmettre son rôle à un autre personnage.

L’événement devient ainsi un lieu de mémoire humaine, pas seulement une date dans l’agenda.

---

# 16 — ÉVÉNEMENTS ET TÉLÉPHONE

Les éditions ne doivent pas simplement apparaître sur la carte.

Elles peuvent arriver via :

- affiche ;
- presse locale ;
- message d’un contact ;
- ancienne cliente ;
- artisan ;
- musée ;
- école ;
- hôtel ;
- photographe ;
- organisateur ;
- rumeur ;
- agenda public ;
- invitation directe.

La source dépend du réseau de Marion.

---

# 17 — ÉVÉNEMENTS RÉELS FUTURS

Règle de production :

- 2026 peut être documenté précisément avec les données réelles vérifiées ;
- les années futures ne doivent jamais prétendre connaître la programmation réelle à l’avance ;
- elles utilisent les familles d’événements documentées + contenu procédural fictif ;
- si le jeu est mis à jour plus tard avec de vraies données d’une année, celles-ci peuvent remplacer la génération fictive de cette année uniquement.

Donc :

**réalité connue → canon documentaire**

**futur non connu → simulation plausible clairement fictionnelle**

---

# 18 — GÉNÉRATION D’UNE ANNÉE

Au début d’une année de jeu :

1. charger les familles d’événements du territoire ;
2. déterminer celles qui reviennent ;
3. déterminer les années blanches ;
4. créer les éditions ;
5. tirer thèmes / lieux / intensité ;
6. vérifier historique des éditions ;
7. appliquer anti-redondance ;
8. connecter aux personnages vivants ;
9. connecter au niveau de carrière de Marion ;
10. déterminer les événements visibles publiquement ;
11. cacher certains événements derrière réseau / rumeur / réputation ;
12. inscrire uniquement les événements déjà connus de Marion dans son agenda.

---

# 19 — EXEMPLE SUR 12 ANS

Famille fictive inspirée d’un festival textile territorial :

2026 — Marion visite et participe à un atelier.
2027 — pas d’édition.
2028 — elle photographie une installation avec une photographe locale.
2029 — année blanche.
2030 — une ancienne rencontre lui propose une petite capsule.
2031 — pas de mission personnelle ; elle découvre une nouvelle matière.
2032 — changement de direction ; ambiance différente.
2033 — événement déplacé après travaux.
2034 — Marion est invitée comme créatrice confirmée.
2035 — festival réduit ; aucune mission.
2036 — anniversaire exceptionnel ; elle participe à un jury.
2037 — un ancien participant lance son propre événement concurrent.

Aucun de ces retours ne rejoue la même boucle.

---

# 20 — RÈGLE POUR TOUS LES DOCUMENTS TERRITORIAUX

À partir de maintenant, chaque événement documenté doit contenir ou permettre :

- `source_year`
- `real_or_fiction`
- `recurrence_type`
- `event_family`
- `season_window`
- `possible_variations`
- `career_uses`
- `memory_keys`
- `anti_repeat_tags`
- `possible_end_state`

Les listes d’événements 2026 servent à définir le **potentiel du territoire**, pas à figer son futur.

---

# 21 — PHILOSOPHIE FINALE

Une joueuse qui reste trente ans dans la même région ne doit jamais avoir l’impression de rejouer trente fois la même année.

Le jeu doit produire :

**des habitudes reconnaissables + des éditions différentes + des personnes qui évoluent + des lieux qui changent + des opportunités adaptées à la carrière + une mémoire de tout ce qui s’est déjà passé.**

La répétition du calendrier crée la familiarité.

La variation des éditions crée la vie.
