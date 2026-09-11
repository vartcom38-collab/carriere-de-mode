# Audit couverture territoriale — Cantal (15) V1

Statut : **DENSE / RUNTIME TERRITORIAL OPÉRATIONNEL / E2E CHROMIUM VALIDÉ**

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
- Le Lioran : station de montagne et pratiques saisonnières.
- Salers, Saint-Flour et autres pôles : patrimoine et paysage utilisés comme références de gameplay, sans inventer de filière textile locale non documentée.

## Technique
- moteur Cantal V2 avec correction du stale-state ;
- chargement automatique moteur + carte existante + carte dense + univers dense + banque dense ;
- store 15 repris par Téléphone / Agenda / Atelier / Book ;
- Aurillac parapluie possède désormais une fiche documentaire avec photo/source.

## Règle canonique
Le focus carte ne modifie jamais la présence physique de Marion.

## QA navigateur — validée le 11 septembre 2026
Le scénario Playwright/Chromium valide :
- présence à Aurillac ;
- densité réellement chargée : 248 personnages / 408 briefs / 120 secrets / 72 événements ;
- lieu « Aurillac · parapluie & accessoire » avec photo réelle et source ;
- 3 actions artisan, dont une consomme 25 minutes ;
- mémoire de lieu persistée ;
- focus Le Puy-en-Velay en aperçu sans déplacement ;
- contenu fictif illustré et clairement étiqueté ;
- absence du stack Gard/Nîmes hors Gard.
