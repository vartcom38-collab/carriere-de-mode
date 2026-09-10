# SAVOIE — AUDIT DE COUVERTURE TERRITORIALE V1

Statut : **DENSE / RUNTIME TERRITORIAL OPÉRATIONNEL SUR LA PAGE VILLE VIA ADDON 73**

## Pôles couverts
- Chambéry — patrimoine urbain, création, métiers d’art, costume contemporain.
- Aix-les-Bains — thermalisme, palaces, villégiature, clientèle élégante, hôtellerie et image.
- Albertville — carrefour alpin, héritage olympique, événementiel sportif, artisanat et réseau.
- Beaufort / Beaufortain — laine, maille, alpage, petite série, usage quotidien d’altitude.
- Bourg-Saint-Maurice / Tarentaise — resorts internationaux, luxe alpin, clientèle, B2B.
- Modane / Maurienne — mobilité, froid, industrie alpine, réparation et test terrain.
- Courchevel — excellence de service, luxe, hôtellerie, représentation et commandes premium.
- Méribel — architecture chalet, maille, lifestyle et élégance sportive.
- Val Thorens — très haute altitude, tests de matériel, ski cross, performance et visibilité.
- Tignes — snowboard, freestyle, culture rider, film, photo et expérimentation.
- Val-d’Isère — village historique, compétition internationale, festivals, hôtellerie et art de vivre.
- La Plagne — architecture de station, bobsleigh, grands équipements, culture sportive.
- Les Arcs — architecture moderne, diagonales, modularité, altitude et photo.
- Séez — laine, drap, filature, foulage, transmission et matière alpine.
- Saint-Jean-de-Maurienne — costumes, arts et traditions populaires, mémoire vestimentaire et réinterprétation contemporaine.

## Différenciation montagne
La Savoie ne doit jamais réduire toutes ses stations au même gameplay.
- Courchevel : luxe / service / représentation.
- Méribel : chalet / maille / lifestyle.
- Val Thorens : haute altitude / test / performance.
- Tignes : rider / snowboard / culture visuelle.
- Val-d’Isère : compétition / village / festivals.
- La Plagne : sport / architecture / volume.
- Les Arcs : architecture moderne / image.
- Beaufort-Séez : laine / savoir-faire / matière.
- Maurienne : mobilité / froid / patrimoine vestimentaire.

## Systèmes alimentés
Atelier, Book, Téléphone, Agenda, clientes, B2B, shooting, matière, performance, retouche, événementiel.

## Saisonnalité
Hiver fort pour stations et haute montagne ; été actif pour randonnée, image, patrimoine et clientèle ; intersaisons plus faibles mais utiles pour préparation de collection, sourcing, réparation, formation et réseau.

## Documentation réelle à préserver
- Courchevel : destination de service/excellence et forte programmation événementielle.
- Val Thorens : haute altitude, ouverture précoce, événements de glisse dont ski cross.
- Tignes : culture snowboard, film, exposition, concerts et événements sportifs.
- Val-d’Isère : Critérium, festivals, village et calendrier hiver très développé.
- Les Arcs / La Plagne : activités culturelles et sportives, architecture et grands équipements.
- Saint-Jean-de-Maurienne : Musée des Costumes, Arts et Traditions Populaires.

Les éditions réelles datées ne doivent pas être répétées automatiquement les années suivantes. Les années futures passent par des familles événementielles fictives/évolutives.

## Extensions non bloquantes
Valloire, Aussois, Les Menuires, Valmorel, Les Saisies, Pralognan-la-Vanoise, Brides-les-Bains, La Rosière, Sainte-Foy-Tarentaise, Bonneval-sur-Arc.

## Point technique
Le contexte territorial principal ne contenait pas encore le département 73 dans ses tables. Pour éviter une réécriture risquée du fichier central minifié, `territory-context-savoie-addon-v1.js` est chargé explicitement par `hc-live/ville/index.html` après `territory-context-v1.js`. Il charge le moteur Savoie, les cartes et les packs de ville lorsqu’une présence réelle en Savoie (`departmentCode: 73`) est détectée.

La règle canonique reste inchangée : **ouvrir ou regarder la carte ne déplace jamais Marion**.