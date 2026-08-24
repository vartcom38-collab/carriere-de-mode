# Haute Couture Live — schéma des pages de lieu riches

Objectif : chaque lieu cliquable doit devenir à la fois un guide culturel immersif, une page de book de styliste et une source de gameplay.

## Règle de source
Pour tout lieu réel, les faits historiques et culturels doivent être construits en priorité à partir :
1. du site officiel du monument / musée / institution ;
2. du site officiel de la ville, de l’office de tourisme, du département ou de la région ;
3. de bases patrimoniales publiques reconnues ;
4. de sources secondaires fiables seulement pour compléter.

Chaque fiche conserve ses sources dans `sources[]` avec `label`, `url`, `kind`, `checkedAt` et éventuellement la section concernée. Les éléments fictionnels de gameplay doivent être marqués `fictional:true` ou rangés dans une section `gameplay` distincte. Ne jamais présenter une invention de jeu comme un fait historique.

## Contrat recommandé d’une fiche
```js
{
  id,
  name,
  city,
  department,
  region,
  category,
  coords:{lat,lng},
  real:true,
  sources:[{label,url,kind:'official',checkedAt:'YYYY-MM-DD'}],
  media:{
    hero:{url,credit,sourceUrl,licenseNote},
    gallery:[{url,caption,credit,sourceUrl,licenseNote}],
    details:[{kind:'object|sculpture|textile|architecture|motif',url,caption}]
  },
  guide:{
    introduction,
    history,
    chronology:[{date,label,text}],
    visitAsIfThere:[{order,title,text,mediaRef}],
    anecdotes:[{title,text,sourceRef}],
    objects:[{id,title,type,period,description,whyItMatters,mediaRef,tags}],
    artworks:[{id,title,artist,period,description,mediaRef,tags}],
    architecture:[{title,text,mediaRef,tags}],
    vocabulary:[{term,definition}],
    learnMore:[{title,text}]
  },
  fashionLens:{
    story,
    palette:[{name,hex,origin}],
    materials:[{name,why,mediaRef,tags}],
    motifs:[{name,origin,mediaRef,tags}],
    forms:[{name,origin,tags}],
    jewelry:[{name,origin,mediaRef,tags}],
    accessories:[{name,origin,mediaRef,tags}],
    silhouettes:[{name,description,tags}],
    constructionIdeas:[{name,description,tags}],
    references:[{type:'collection|designer|costume|period',title,text,sourceRef,tags}]
  },
  gameplay:{
    tags:[],
    bookTags:[],
    atelierTags:[],
    socialTags:[],
    layers:[],
    secrets:[],
    encounters:[],
    unlocks:[]
  }
}
```

## Page visuelle
La page doit ressembler à un carnet de voyage / magazine de styliste : grande photo réelle, plusieurs doubles pages ou sections, cartes, chronologie, photos d’objets et sculptures, palettes en vraies pastilles colorées, textures ou tissus, motifs, accessoires, dessins de construction et encarts manuscrits simulés. Elle ne doit pas ressembler à une modale technique.

## Visite immersive
Le joueur doit pouvoir parcourir le lieu comme une visite guidée : « entrée », « salle suivante », « objet à observer », « détail architectural », « anecdote », etc. Un musée peut donc contenir plusieurs dizaines de sous-fiches : sculptures, monnaies, mosaïques, textiles, objets quotidiens, bijoux, fragments architecturaux, tableaux, archives selon ses collections réelles.

## Book
« Ajouter à mon Book » doit sauvegarder une page riche, pas seulement un nom : photos, résumé, palette, matières, motifs, objets favoris, références, tags et notes perso. Les tags doivent être transversaux afin de relier plus tard la carte, le Book, l’atelier et les commandes.

Exemples de tags : `romanite`, `antiquite`, `mosaique`, `drape`, `bronze`, `pierre`, `costume-historique`, `architecture`, `bijou-antique`, `camargue`, `broderie`, `indigo`.

## Recherche atelier
Le futur atelier doit pouvoir demander `HCBook.searchByTags(['romanite','drape'])` pour retrouver les inspirations sauvegardées. Une commande de costumes romains pourra ainsi suggérer automatiquement les pages de Book et déblocages pertinents.