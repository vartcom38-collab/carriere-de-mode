# HAUTE COUTURE LIVE — AUDIT RUNTIME TERRITORIAL V1

## But
Vérifier que le pipeline territorial ne s’arrête pas à la recherche ou à la carte mais traverse réellement le jeu.

## Chaîne validée
1. Région / département / ville documentés.
2. Présence physique distincte de la résidence et du simple focus carte.
3. Chargement du moteur départemental selon présence.
4. Chargement du pack carte local.
5. Chargement du pack ville-univers si la ville en possède un.
6. Chargement de la banque ville si disponible.
7. Observation explicite d’un lieu.
8. Référence envoyée vers Atelier / Book selon type de lieu.
9. Interaction personnage fictif persistante.
10. Sélecteur ville anti-répétition.
11. Déclenchement progressif de rencontres / briefs / secrets / événements.
12. Conversion vers gameState.messages et gameState.calendar.
13. Conservation du contexte : ville, département, quartier, niveau, famille événementielle, source.
14. Mémoire de l’historique ville et anti-reroll.

## Départements actuellement branchés
- Ain (01)
- Allier (03)
- Cantal (15)
- Loire (42)
- Haute-Loire (43)
- Puy-de-Dôme (63)
- Rhône (69)

## Villes avec banque dédiée / ville-univers forte
- Lyon
- Villeurbanne
- Clermont-Ferrand
- Saint-Étienne
- Moulins
- Vichy
- Aurillac
- Le Puy-en-Velay
- Bourg-en-Bresse
- Oyonnax
- Thiers
- Riom
- Roanne
- Charlieu
- Villefranche-sur-Saône

## Villes renforcées vague 2
- Montluçon
- Brioude
- Saint-Flour
- Salers
- Montbrison
- Tarare

## Anti-redondance
Le sélecteur dynamique mémorise :
- les derniers briefs utilisés ;
- les derniers personnages proposés ;
- les secrets déjà révélés ;
- les éditions d’événements déjà exploitées.

Règles actuelles :
- éviter les 12 derniers briefs ;
- éviter les 8 derniers personnages ;
- secret conditionné par nombre de visites ;
- édition événementielle distincte par année ;
- les futurs événements au-delà de 2026 sont explicitement FICTION GAMEPLAY ;
- le runtime espace les gros déclenchements pour qu’un simple clic de carte ne crée pas une avalanche de missions.

## Règle de présence
La résidence ne déclenche pas le contenu local. La présence physique / voyage est prioritaire. Un territoire regardé sur la grande carte reste un aperçu jusqu’à une action explicite de déplacement.

## Règle grande ville
Le niveau ville doit rester le plus dense. La couche régionale sert à l’identité et aux grands flux ; la couche départementale structure bassins et circulation ; les grandes villes portent la majorité du contenu vécu.

## Points encore à tester en situation réelle
- ordre de chargement des scripts dans un navigateur froid ;
- migration de vieilles sauvegardes très anciennes ;
- affichage visuel des messages territoriaux dans toutes les variantes du Téléphone ;
- affichage des métadonnées quartier / source dans l’Agenda ;
- passage d’année 2026 → 2027 → années lointaines ;
- navigation successive entre deux départements sans rechargement complet de page ;
- équilibre du rythme de déclenchement dans une longue session ;
- vérification que les événements locaux ne créent pas deux fois la même entrée via moteur départemental + banque ville.

## Statut
ARCHITECTURE TERRITORIALE JOUABLE V1 — EN PLACE SUR BRANCHE `territoires-france`.

Ce statut ne signifie pas que tout le contenu régional est terminé. Il signifie que la chaîne technique commune est maintenant suffisamment complète pour accueillir les prochains départements et villes sans reconstruire l’architecture à chaque fois.
