# ISÈRE — AUDIT DE COUVERTURE TERRITORIALE V1

Branche de travail : `territoires-france`

Objectif : vérifier que l'Isère n'est pas seulement couverte géographiquement, mais que chaque pôle apporte une identité de gameplay distincte et nourrit réellement les systèmes Téléphone, Agenda, Atelier, Book, clientes, B2B, scène et shooting.

## Validation navigateur réelle — 11 septembre 2026

L’Isère est désormais validée dans la campagne E2E Chromium de la branche `territoires-france`.

Scénario de référence : **Bourgoin-Jallieu / Musée de Bourgoin-Jallieu · textile**.

Le test vérifie réellement :
- présence physique de Marion à Bourgoin-Jallieu ;
- moteur territorial Isère chargé avec 22 personnages, 26 briefs, 14 secrets et 14 familles d’événements ;
- marqueur `is-bj-musee` produit par le vrai pack carte ;
- affichage `PHOTO RÉELLE` avec source Wikimedia Commons ;
- 4 actions contextuelles ;
- consommation de 20 minutes sur l’action testée ;
- mémoire d’action persistée ;
- focus Saint-Étienne traité en aperçu sans téléportation ;
- rendu distinct d’un lieu fictif ;
- absence du runtime Gard/Nîmes hors Gard.

## Pôles denses

### Grenoble
Identité : métropole alpine, innovation, textile technique, design, recherche matière, scène culturelle, éditorial, Bastille et grands contrastes urbain/montagne.
Rôle gameplay : carrière créative avancée, B2B, prototypes, réseau, Book.

### Bourgoin-Jallieu
Identité : tissage, impression textile, ennoblissement, mémoire industrielle du Nord-Isère.
Rôle gameplay : apprentissage textile, archives, matières, motif, métiers d'art.

### Vienne
Identité : histoire textile, drap, patrimoine, scène, costume, festivals et habillage.
Rôle gameplay : costume de scène, retouches urgentes, Book culturel, commandes événementielles.

## Pôles intermédiaires spécialisés

### Voiron
Identité : clientèle locale, retouche, réparation, cérémonie, commerce, porte de Chartreuse.
Rôle gameplay : commandes réalistes de proximité, bouche-à-oreille, upcycling, réseau.

### Vizille
Identité : patrimoine, parc, représentation, cérémonie, image.
Rôle gameplay : shootings, costume contemporain inspiré du patrimoine, clientèle événementielle.

### Villard-de-Lans / Vercors
Identité : froid, mobilité, laine, superposition, outdoor, tests en conditions réelles.
Rôle gameplay : prototypes, essais portés, B2B outdoor, photo neige/mouvement.

### Bourg-d'Oisans / Oisans
Identité : haute montagne, performance, cyclisme, abrasion, mobilité verticale, clientèle sportive et touristique.
Rôle gameplay : prototypes exigeants, campagnes outdoor, partenariats, réparation technique.

### La Tour-du-Pin
Identité : proximité, patrimoine local, petite scène culturelle, retouche et cérémonies.
Rôle gameplay : missions accessibles, clientes, habillage, rythme de carrière local.

### Crémieu
Identité : cité médiévale, pierre, halles, charpente, motif, costume et accessoires.
Rôle gameplay : recherche formelle, accessoires, shooting patrimoine, scénographie.

### Saint-Marcellin / Sud-Grésivaudan
Identité : vallée, marché, clientèle quotidienne, réemploi, transition vers les massifs.
Rôle gameplay : commandes locales, upcycling, portrait d'artisans, mini éditoriaux.

### Saint-Pierre-de-Chartreuse / Chartreuse
Identité : savoir-faire, artisans, laine, élevage, transhumance, bois, forêt, petites séries.
Rôle gameplay : réseau artisanal, matières naturelles, accessoires, commandes fonctionnelles douces.

### Crolles / Grésivaudan
Identité : vallée productive, artisanat contemporain, mémoire ganterie, chanvre, agriculture et industrie.
Rôle gameplay : petite série, sourcing, B2B, capsules fonctionnelles, héritage de matière.

### Allevard / Belledonne
Identité : fer, eau, forges, moulins, thermalisme, ski, effort et récupération.
Rôle gameplay : prototypes thermiques, gestes/motifs mécaniques, Book patrimoine, outdoor distinct du Vercors.

### Pont-en-Royans / Royans
Identité : maisons suspendues, eau, gorges, verticalité, façades et photographie.
Rôle gameplay : motifs architecturaux, palettes, shooting, accessoires et silhouettes verticales.

## Couverture système

- Atelier : très forte couverture (matières, prototypes, retouche, costume, upcycling, accessoires).
- Book : très forte couverture (patrimoine, photographie, recherche textile, nature, architecture).
- Téléphone : rumeurs, contacts, secrets et leads fournis par le moteur Isère.
- Agenda : familles événementielles saisonnières et briefs locaux.
- Clientes : Voiron, La Tour-du-Pin, Saint-Marcellin, Vizille, Vienne et pôles touristiques.
- B2B : Grenoble, Bourgoin-Jallieu, Grésivaudan, Vercors, Oisans, Belledonne.
- Scène : Vienne, Vizille, La Tour-du-Pin, Grenoble.
- Shooting : Grenoble, Vienne, Vizille, Vercors, Oisans, Crémieu, Belledonne, Royans.
- Sourcing/matière : Bourgoin-Jallieu, Chartreuse, Grésivaudan, Belledonne, Voiron.

## Identités matière / motif déjà différenciées

- Bourgoin-Jallieu : trame, impression, ennoblissement.
- Grenoble : textile technique, innovation, contraste urbain/alpin.
- Vienne : drap, costume, mouvement de scène.
- Chartreuse : laine, feutre, bois, forêt, troupeau, chemin.
- Grésivaudan : chanvre, cuir, main, tresse, flux.
- Belledonne : métal, onde, forge, gradient thermique.
- Vercors : superposition, relief, froid, fonction.
- Oisans : abrasion, verticalité, performance, transition vallée-altitude.
- Crémieu : charpente, arc, trame de pierre.
- Royans : suspension, façade, courant, reflet.
- Vizille : jardin, symétrie, représentation.
- Saint-Marcellin : marché, usage, parcelle, réemploi.

## Manques non bloquants

L'Isère est désormais assez dense pour servir de département complet de référence. Les ajouts suivants peuvent venir plus tard sans bloquer le passage au territoire suivant :

- Lac de Paladru / archéologie et eau ;
- Morestel / art et paysage ;
- Les Deux Alpes / station plus commerciale et internationale ;
- Alpe d'Huez / luxe sportif, événementiel et haute altitude ;
- Mens / Trièves / ruralité et matières naturelles ;
- La Mure / Matheysine / patrimoine minier et relief ;
- Roussillon / vallée industrielle du Rhône côté Isère.

Ces zones doivent être traitées comme extensions, pas comme conditions nécessaires pour considérer l'Isère jouable.

## Verdict

Statut : **ISÈRE DENSE / RUNTIME TERRITORIAL OPÉRATIONNEL / VALIDÉ EN CHROMIUM**.

Le département possède maintenant une métropole forte, plusieurs pôles textiles/patrimoniaux, plusieurs types de montagne, des villes de clientèle, des zones B2B, des territoires de scène, des axes de sourcing et de nombreuses identités de matière et de motif. Il peut servir de modèle pour la densification des futurs départements alpins, notamment Savoie et Haute-Savoie, sans copier leurs identités futures.
