# Audit parité Nîmes → territoires

Branche de reconstruction : `nimes-parity-territoires`.

## Source de vérité

Le Gameplay Master V2 impose que Nîmes soit la ville test de référence. Un territoire n'est pas terminé parce que ses lieux ont un pin. Chaque type de lieu doit disposer d'une interface adaptée, d'actions réelles, de conséquences connectées à d'autres systèmes, d'une mémoire et d'un intérêt de revisite.

La carte territoriale AURA actuellement déployée ne respecte pas encore cette règle : `hc-live/ville/index.html` route tous les marqueurs vers `HCLocalMapOpenGuide()`, une fiche générique commune (titre, texte, tags, Book, déplacement).

## Templates à reproduire depuis le modèle Nîmes

| Famille | Expérience attendue | Connexions minimales |
|---|---|---|
| Musée / monument / patrimoine | grand visuel réel, histoire, détails, lecture mode, VISITER avec durée, revisites, rencontres/événements | Book + Atelier + temps |
| Mercerie / tissus | fiches textile premium, assortiment propre au lieu, panier, paiement/déblocage | argent + Atelier + mémoire fournisseur |
| Friperie / brocante | pièce unique, histoire, examen, provenance, négociation à choix, achat/laisser | Book + Atelier/upcycling + relation |
| Café / bar / restaurant | ambiance, affluence, personnes présentes, scènes/rumeurs/rendez-vous, actions sociales | relations + téléphone/missions + temps |
| Artisan / savoir-faire | univers artisan, technique, durée/coût, apprendre/conseil/collaboration | Atelier + carrière/clients + mémoire |
| Studio photo | choix création, objectif, direction d'image, sélection finale, destination | Book + Ateliergram + réputation |
| Archives / bibliothèque | recherche riche par période/silhouette/matière/technique/etc. | Book + Atelier + temps |
| Rue / quartier / promenade | points narratifs temporaires, objets visuels distincts | rencontres + inspirations + événements |
| Rumeur | pièce éditoriale, information incertaine/contextuelle | personnages + opportunités |
| Affiche | visuel diégétique et actions noter/se renseigner/garder/ignorer/envoyer | agenda + téléphone/contacts |
| Rencontre | portrait, identité/contextes, 2–4 choix de réponse | relations + mémoire + réseau |
| Événement | interface adaptée à sa nature, actions contextuelles, calendrier | agenda + relations + missions |
| Hôtel | choix de séjour puis chez-moi temporaire | argent + agenda + téléphone |
| Showroom / prestige | accès conditionnel, collection, presse/acheteurs, décisions pro | réputation + carrière + relations |
| Gare / transport | destinations, horaires, durée, prix, collisions agenda/deadlines | argent + temps + agenda |

## Défaut structurel actuel

`hc-live/ville/index.html` expose une seule voie d'ouverture :

`marker click → HCLocalMapOpenGuide(place) → overlay générique`

Ce flux doit devenir :

`marker click → place archetype router → template spécialisé → actions → conséquences monde`

L'overlay générique ne doit rester qu'un fallback de sécurité pour un contenu non encore migré et ne doit pas servir de critère de complétude.

## Règles de reconstruction AURA

1. Aucun département n'est déclaré terminé sur le seul critère du nombre de lieux.
2. Chaque lieu préparé reçoit un `archetype` fonctionnel explicite.
3. Chaque archétype route vers son interface spécialisée.
4. Une visite qui prend du temps avance l'horloge du jeu.
5. Les conséquences doivent toucher au moins deux autres systèmes pertinents.
6. Les rencontres, rumeurs, affiches, invitations et événements ne sont pas des pins permanents interchangeables : ils suivent jour/heure/saison/progression/mémoire.
7. Les lieux réels utilisent de vraies sources/visuels adaptés ; les éléments fictifs restent explicitement fictifs.
8. Les revisites doivent avoir un intérêt et respecter la mémoire du monde.
9. La QA se fait par archétype ET par territoire.
10. Pas de déploiement de la reconstruction tant que les templates pilotes ne sont pas validés dans l'interface réelle.

## Densité

Les 146 lieux AURA actuellement visibles sont une couverture cartographique initiale, pas un objectif de contenu final. La densité cible doit être issue de la matrice territoriale complète : villes/villages, quartiers/zones, monuments, musées, patrimoine, paysages, commerces mode, merceries, brocantes, artisans, archives, studios, lieux sociaux, hôtels, showrooms, transports, événements, personnages, rencontres libres, éléments temporaires, missions, secrets et revisites.

## Ordre de reprise recommandé

1. Reconstituer et verrouiller le template Patrimoine sur un lieu Nîmes de référence puis un lieu AURA.
2. Mercerie / tissus.
3. Café / lieu social.
4. Brocante / friperie.
5. Artisan / savoir-faire.
6. Archives / bibliothèque.
7. Gare / transport.
8. Rue/quartier + rencontres/rumeurs/affiches/inspirations temporaires.
9. Studio photo, hôtel, showroom/prestige, événements.
10. Étendre chaque template validé aux lieux homologues des 12 départements, puis reprendre la densité territoire par territoire.

## Critère de fin

Une ville est considérée prête seulement lorsque ses lieux importants sont accessibles, leurs interfaces spécialisées fonctionnent, les actions consomment le temps prévu, les dialogues/rencontres et mémoires fonctionnent, les déblocages atteignent l'Atelier/Book, les conséquences atteignent téléphone/agenda/carrière lorsque pertinent, et les revisites sont utiles.