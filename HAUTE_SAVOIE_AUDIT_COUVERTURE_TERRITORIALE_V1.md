# HAUTE-SAVOIE — AUDIT COUVERTURE TERRITORIALE V1

Département : 74  
Branche : `territoires-france`  
Date de mise à jour : 2026-09-11

## Verdict

**DENSE / RUNTIME TERRITORIAL OPÉRATIONNEL VIA ADDON 74 / VALIDÉ EN CHROMIUM**

La Haute-Savoie possède suffisamment d'archétypes territoriaux distincts pour soutenir une carrière longue sans réduire le département à une succession de stations de ski.

## Validation navigateur réelle — 11 septembre 2026

Le scénario E2E de référence utilise **Le Grand-Bornand · laine, soie & tissage**.

La campagne Chromium valide :
- chargement du moteur Haute-Savoie ;
- carte principale et carte secondaire ;
- univers principal et secondaire ;
- banques de villes principale et secondaire ;
- ouverture du lieu documentaire du Grand-Bornand avec photo réelle et source ;
- actions contextuelles, consommation de temps et persistance de la mémoire ;
- rendu distinct du contenu fictif ;
- focus carte Chambéry sans téléportation de Marion ;
- absence de runtime Gard/Nîmes hors Gard.

Le test a également révélé un vrai défaut de double chargement : l’addon 74 pouvait attendre un événement `load` déjà passé sur des scripts génériques présents dans la page. `territory-context-haute-savoie-addon-v1.js` V3 rend désormais le chargement idempotent en vérifiant l’API globale des scripts déjà actifs avant de poursuivre la chaîne.

## Couverture géographique et gameplay

- Annecy — lac, ville, cérémonie, design, éditorial.
- Chamonix-Mont-Blanc — alpinisme, expédition, performance, luxe sportif.
- Le Grand-Bornand — laine, soie, tissage, maille, feutre, alpage.
- Châtel — station-village, Chablais, frontière, capsule hiver.
- Megève — luxe alpin, hôtellerie, clientèle premium, soirée.
- Évian-les-Bains — thermalisme, villégiature, Léman, élégance.
- Thonon-les-Bains — lac, patrimoine, artisanat, clientèle locale.
- Morzine — glisse, sportswear, culture, village vivant.
- Avoriaz — architecture, snowboard, performance, image.
- La Clusaz — Aravis, ski, maille, cuir, artisanat.
- Cluses — industrie de précision, horlogerie, décolletage, hardware/accessoires.
- Sallanches — Mont-Blanc, métiers d'art, photographie, ville de vallée.
- Saint-Gervais-les-Bains — thermalisme, patrimoine, culture, Mont-Blanc.
- Samoëns — tailleurs de pierre, sculpture, botanique, motifs et volume.
- Yvoire — Léman, patrimoine, végétal, tourisme, cérémonie et éditorial.

## Systèmes alimentés

- Atelier : matières, motifs, techniques, références, prototypage, réparation, accessoires.
- Book : recherche territoriale, photographie, patrimoine, références visuelles.
- Téléphone : contacts, rumeurs, pistes et réseaux.
- Agenda : opportunités et familles événementielles saisonnières.
- Clientes : locale, villégiature, premium, internationale, resort.
- B2B : hôtellerie, sport, industrie, stations, artisans, équipements.
- Shooting : lac, montagne, architecture, village, neige, thermalisme.

## Volume des banques

Banques principales (10 pôles) : environ **340 personnages, 580 briefs, 170 secrets, 100 familles d'événements**.

Banques secondaires (5 pôles) : **150 personnages, 250 briefs, 75 secrets, 45 familles d'événements**.

Total banques ville Haute-Savoie V1 : environ **490 personnages, 830 briefs, 245 secrets et 145 familles d'événements**.

Le moteur départemental possède en plus son propre jeu de contacts/opportunités pour l'orchestration territoriale ; ces données ne sont pas additionnées au total ci-dessus pour éviter de présenter des doublons comme du contenu unique.

## Vérifications structurelles

- code départemental 74 pris en charge via `territory-context-haute-savoie-addon-v1.js` ;
- reconnaissance de secours par nom de département ou ville connue ;
- loader injecté dans `hc-live/ville/index.html` ;
- moteur territorial Haute-Savoie chargé ;
- carte principale et carte secondaire chargées ;
- univers et banques ville chargés ;
- `territorial-signal-runtime-v1.js` connaît le store 74 pour rattraper les signaux persistés ;
- ouverture/focus de carte ne déplace pas Marion ; seul un vrai déplacement appelle `setPresence`.

## Anti-duplication montagne

- Chamonix = alpinisme / expédition / extrême.
- Avoriaz = snowboard / architecture / culture visuelle.
- Morzine = village / sportswear / culture.
- Megève = luxe / palace / élégance.
- La Clusaz = Aravis / maille / artisanat / ski.
- Le Grand-Bornand = filière laine / textile artisanal / alpage.
- Châtel = station-village / frontière / petite capsule.
- Saint-Gervais = thermalisme + Mont-Blanc + patrimoine.
- Samoëns = pierre/sculpture + botanique.

## Extensions futures non bloquantes

Peuvent être ajoutés plus tard sans empêcher de considérer le département dense : Sixt-Fer-à-Cheval, Les Gets, Abondance, La Roche-sur-Foron, Bonneville, Rumilly, Passy, Combloux, Praz-sur-Arly, Vallorcine, Argentière et autres villages/plateaux.
