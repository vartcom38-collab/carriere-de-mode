# TELEPHONE — GAMEPLAY SYSTEM

## Principe
Le téléphone est un hub de carrière et de vie : messages, appels, contacts, opportunités, faux réseau social, notifications, médiathèque et déclencheurs. Le réseau social doit fonctionner sans coût de génération : il réutilise les visuels déjà présents ou débloqués dans la partie.

## Règle zéro crédit
- Poster, liker, commenter, suivre, faire une story, recevoir des réactions et gagner des abonnés ne déclenche aucun appel externe.
- Les contenus sociaux viennent de la médiathèque locale du jeu.
- Une image générée ailleurs dans le jeu (ex. Atelier) peut être ajoutée à la médiathèque, puis réutilisée gratuitement.
- Les futurs packs de pays/régions/villes devront fournir leurs propres médias réutilisables.

## État social persistant
Clé : `haute-couture-phone-social-v2`

Contient :
- profil : handle, bio, followers, following, portée, engagement ;
- posts, stories, feed, notifications ;
- médiathèque et packs débloqués ;
- contacts enrichis ;
- opportunités sociales ;
- ledger de triggers afin qu’un événement unique ne soit jamais rejoué ;
- cooldowns et activité journalière ;
- villes/lieux visités ;
- analytics cumulés.

## Sources de médias
1. starter : vie quotidienne / café / carnet / look / moodboard ;
2. atelier : croquis, drapés, nuanciers, coulisses ;
3. mission : brief cliente, essayage, avant retouche ;
4. portfolio : création terminée, détail final, avant/après ;
5. travel : rue, café, vitrine, détail urbain ;
6. opportunity : shooting, collaboration, presse ;
7. atelier_export : vrai rendu ou croquis exporté par l’Atelier ;
8. future_region_pack : médias débloqués lors d’un voyage ou d’une découverte.

Chaque média a : `id`, `packId`, `title`, `type`, `caption`, `category`, `imageKey`, `imageUrl`, `city`, `source`, `used`, `free`.

## Types de publications
- look
- sketch
- moodboard
- detail
- backstage
- before_after
- finished
- travel
- milestone

Le type influence la portée. Les créations terminées, avant/après et voyages sont plus performants que les coulisses répétitives.

## Déclencheurs déjà codés
### Début de partie
- déblocage du pack starter ;
- déblocage du pack Atelier ;
- notification expliquant le mode zéro crédit.

### Première mission
Dès qu’une mission existe en statut offered / accepted / in_progress / completed :
- déblocage du pack première cliente ;
- nouveaux médias publiables.

### Premier projet terminé
Dès que `portfolio.length >= 1` :
- déblocage création terminée ;
- détail couture final ;
- avant/après.

### Ville / voyage
- la ville actuelle est enregistrée comme premier lieu ;
- chaque événement terminé avec `location` peut enregistrer un nouveau lieu ;
- `HCGame.registerVisit(place)` émet `hc-travel-visited` ;
- `HCPhone.registerTravel(place)` peut être appelé directement ;
- un nouveau lieu déclenche une notification de médias disponibles.

### Atelier
Le téléphone scanne les clés :
- `haute-couture-atelier-exports`
- `haute-couture-atelier-media`
- `hc-atelier-exports`

Chaque nouvel export devient un média publiable. Le futur Atelier peut aussi émettre :
`window.dispatchEvent(new CustomEvent('hc-atelier-media',{detail:{...}}))`

Ou appeler :
`HCPhone.registerAtelierMedia(payload)`.

### Seuils sociaux
- 100 followers : premier regard pro + opportunité de repost boutique ;
- 250 followers + réputation 3 : mini shooting ;
- 500 followers + 1 projet portfolio : collaboration créatrice ;
- 1 000 followers : média local / portrait ;
- 2 500 followers + réputation 12 : gifting / maison émergente ;
- réputation 20 : visibilité pro renforcée.

Chaque trigger est enregistré dans `triggerLedger` et ne se déclenche qu’une fois.

## Publication et portée
La performance dépend de :
- followers actuels ;
- réputation du personnage ;
- type de média ;
- nouveauté du média ;
- nombre de publications déjà faites dans la journée ;
- seed déterministe du contenu.

Le système calcule localement :
- reach ;
- likes ;
- comments ;
- followerGain ;
- score.

Aucun crédit n’est utilisé.

## Anti-farm
- réutiliser le même média réduit progressivement sa nouveauté ;
- multiplier les posts le même jour réduit fortement la portée ;
- les stories ont aussi une pénalité de saturation ;
- un appel au même contact ne donne qu’un bonus relationnel par jour.

## Commentaires
Les commentaires sont créés localement :
- priorité aux relations connues du joueur ;
- sinon comptes fictifs génériques ;
- templates courts adaptés au contenu mode.

À l’avenir, les PNJ importants pourront avoir leur propre table de réactions et de tonalités.

## Appels
`HCPhone.callContact(name)` :
- +1 affinité ;
- +1 confiance ;
- +12 minutes de temps de jeu ;
- une entrée dans l’historique relationnel ;
- pas de nouveau bonus si on rappelle le même contact le même jour.

## Opportunités sociales
Une opportunité contient :
- id, title, from, kind ;
- requirement ;
- reward ;
- status ;
- action.

Récompenses possibles :
- followers ;
- réputation ;
- nouveaux médias ;
- futures missions / invitations / événements.

## Réseau et voyages — contrat pour les futures régions
Chaque nouveau pack géographique devra pouvoir être enregistré ainsi :

```js
HCPhone.registerMediaPack({
  id:'paris-fashion-week',
  label:'Paris Fashion Week',
  source:'travel',
  items:[
    ['pfw-street-1','Street style','travel','Paris entre deux rendez-vous.','travel'],
    ['pfw-showroom-1','Showroom','backstage','Repérage showroom.','travel']
  ]
});
HCPhone.unlockPack('paris-fashion-week',{city:'Paris'});
```

Le pays / région / ville devient donc aussi une source de contenu social, sans qu’il soit nécessaire de créer un nouveau système à chaque destination.

## Événements inter-modules
Événements déjà supportés :
- `hc-game-state`
- `hc-travel-visited`
- `hc-atelier-media`
- `hc-phone-state`

Cela permet de connecter progressivement Ville, Agenda, Atelier, Voyages, Missions et Dressing au téléphone sans les coupler directement.

## API publique
`HCPhone.get()`
`HCPhone.availableMedia()`
`HCPhone.getMedia(id)`
`HCPhone.publish(mediaId, caption)`
`HCPhone.story(mediaId, caption)`
`HCPhone.likeFeed(postId)`
`HCPhone.saveFeed(postId)`
`HCPhone.followAccount(handle)`
`HCPhone.callContact(name)`
`HCPhone.resolveOpportunity(id, choice)`
`HCPhone.registerTravel(place)`
`HCPhone.registerAtelierMedia(payload)`
`HCPhone.registerMediaPack(pack)`
`HCPhone.unlockPack(id, context)`
`HCPhone.markNotificationRead(id)`
`HCPhone.unreadNotifications()`
`HCPhone.sync()`

## Étapes suivantes prévues
- brancher visuellement la galerie sur `HCPhone.availableMedia()` ;
- faire afficher les vraies images débloquées plutôt que les fonds temporaires ;
- connecter Dressing pour produire une carte média `look` ;
- connecter Ville / Voyages aux packs régionaux ;
- ajouter les stories de PNJ et les interactions privées ;
- transformer certaines opportunités sociales en vrais événements Agenda ;
- donner à chaque PNJ important une personnalité sociale ;
- ajouter commentaires de marques, clientes, médias et rivales selon réputation et historique.
