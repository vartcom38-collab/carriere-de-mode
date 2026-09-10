# Audit couverture territoriale — Cantal (15) V1

Statut : **DENSE / RUNTIME TERRITORIAL OPÉRATIONNEL**

## Pôles couverts
- Aurillac — parapluie, accessoire, motif, arts de la rue, costume mobile.
- Salers — laine, maille, pierre volcanique, clientèle saisonnière.
- Saint-Flour — basalte, patrimoine, photographie, cérémonie.
- Chaudes-Aigues — thermalisme chaud, bien-être, hôtellerie, séjour.
- Laveissière / Le Lioran — froid, ski, mobilité, performance, réparation.
- Murat — montagne, cuir, laine, marchés et artisanat.
- Mauriac — proximité, retouche, réemploi, cérémonie locale.
- Massiac — passage, mobilité, petites commandes et réparation.

## Volumes extension dense
- 248 personnages fictionnels
- 408 briefs
- 120 secrets/pistes
- 72 familles d’événements

## Socle documentaire
- Aurillac : industrie et savoir-faire du parapluie, collections municipales, histoire de fabrication locale.
- Chaudes-Aigues : station thermale, source du Par à 82 °C et centre Caleden.
- Le Lioran : station familiale et pratiques de montagne/nordiques.
- Salers, Saint-Flour et autres pôles : patrimoine et paysage utilisés comme références de gameplay, sans inventer de filière textile locale non documentée.

## Technique
- moteur Cantal passé en V2 avec correction du stale-state ;
- runtime générique V7 avec fallback direct des principales villes du 15 ;
- chargement automatique moteur + carte existante + carte dense + univers dense + banque dense ;
- store 15 déjà repris par Téléphone / Agenda / Atelier / Book.

## Règle canonique
Le focus carte ne modifie jamais la présence physique de Marion.

## QA
Branchement GitHub vérifié. Aucun test navigateur end-to-end n’a encore été réalisé dans cette passe.
