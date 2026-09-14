# ARDÈCHE — AUDIT DE COUVERTURE TERRITORIALE V1

Statut : **DENSE / RUNTIME TERRITORIAL OPÉRATIONNEL / E2E CHROMIUM VALIDÉ**
Branche : `territoires-france`
Date : 2026-09-11

## Pôles couverts

- Annonay — cuir, papeterie, textile, invention, patrimoine industriel, accessoires.
- Aubenas / Ucel — soie, moulinage, torsion du fil, marché, artisanat, clientèle.
- Privas — représentation, clientèle locale et institutionnelle, retouche, cérémonie.
- Tournon-sur-Rhône — vallée du Rhône, image, patrimoine, coteaux, éditorial.
- Le Teil — réemploi, réparation, stocks dormants, transformation.
- Marcols-les-Eaux — moulinage vivant, machines, hydraulique, mémoire ouvrière.
- Jaujac / Monts d’Ardèche — savoir-faire textiles, châtaigneraies, relief volcanique, réemploi, motifs de territoire.
- Largentière — vallée, eau, fil, tissage, passementerie, patrimoine.
- Les Vans — Cévennes, lin, chanvre, marché, vestiaire léger, clientèle saisonnière.
- Vallon-Pont-d’Arc — rivière, roche, outdoor estival, photographie, tourisme international.
- Saint-Agrève — plateau, laine, maille, froid, petite série, réparation et tests portés.

## Couverture gameplay

Le département alimente : Atelier, Book, Téléphone, Agenda, clientes, B2B, shooting, matière, technique, réemploi, patrimoine et événements saisonniers.

Les événements futurs doivent rester des familles évolutives et ne jamais recopier automatiquement une édition réelle passée. Les lieux fictifs sont marqués `fictional:true`.

## Base documentaire retenue

Le patrimoine textile ardéchois est structurant : soie, moulinages, passementerie, tissage, laine, recyclage et technologies de fabrication contemporaines. Le Moulinage de la Neuve à Marcols-les-Eaux constitue une référence forte : construit en 1860 pour la soie naturelle, il conserve ses machines et sa logique hydraulique ; l’exploitation s’arrête en 1967 et le site est aujourd’hui présenté en visites avec des machines authentiques en fonctionnement. Annonay apporte une autre identité industrielle fondée notamment sur le cuir, la papeterie et le textile.

La Slow Fashion Week Ardèche du 29 septembre au 3 octobre 2026 constitue une référence réelle datée pour la période 2026 ; elle ne doit pas être répétée telle quelle automatiquement les années suivantes. Les futures années utilisent des familles événementielles inspirées des dynamiques territoriales.

## QA navigateur — validée le 11 septembre 2026
Le scénario Playwright/Chromium valide :
- présence physique à Marcols-les-Eaux ;
- 11 lieux Ardèche réellement chargés par la carte départementale ;
- Moulinage de la Neuve affiché avec image réelle, source régionale et statut documentaire ;
- 3 actions patrimoine disponibles ;
- une action consomme 35 minutes et persiste la mémoire du lieu ;
- regarder Valence ne déplace pas Marion de Marcols-les-Eaux ;
- contenu fictif illustré et explicitement marqué comme fiction ;
- absence du stack Gard/Nîmes hors Gard.

## Extensions non bloquantes

À développer plus tard si besoin : Joyeuse, Balazuc, Vogüé, Ruoms, Lamastre, Le Cheylard, Saint-Martin-de-Valamas, Vals-les-Bains, Antraigues-sur-Volane, Saint-Péray, Guilherand-Granges, plateau du Mézenc côté ardéchois.

## Verdict

L’Ardèche dispose d’assez de contrastes territoriaux et de volume de contenu pour être considérée comme dense dans le runtime France, et son parcours territorial de référence est désormais validé end-to-end dans Chromium.
