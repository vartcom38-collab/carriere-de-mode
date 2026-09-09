(function(){
  if(window.__HCAinCommunePersonalityInstalled)return;window.__HCAinCommunePersonalityInstalled=true;
  const hash=v=>String(v||'').split('').reduce((a,c)=>((a*33)+c.charCodeAt(0))>>>0,5381);

  const archetypes={
    textile:{id:'textile',subtitle:'Textile, transmission, ateliers et matières.',accent:'sage',venue:['Maison des matières','Textile & savoir-faire','✂','Un lieu de jeu centré sur les tissus, gestes, archives et fournisseurs.'],secret:['Carnet de fournisseur','Indice textile','·','Une piste discrète vers une matière, un atelier ou une recommandation.']},
    heritage:{id:'heritage',subtitle:'Patrimoine, pierre, détails et mise en scène.',accent:'ochre',venue:['Maison du patrimoine','Architecture & image','⌂','Un lieu de jeu pour croquis, shootings, commandes culturelles et recherche visuelle.'],secret:['Passage ancien','Indice patrimonial','·','Un détail discret peut mener à un lieu de prise de vue ou une rencontre.']},
    nature:{id:'nature',subtitle:'Paysage, eau, végétation et saisons.',accent:'mint',venue:['Belvédère / jardin','Observation','❧','Un point d’observation qui change avec les saisons et nourrit le carnet.'],secret:['Sentier noté au crayon','Indice nature','·','Une petite piste d’observation apparaît dans la carte personnelle.']},
    craft:{id:'craft',subtitle:'Artisanat, détail, petite série et collaboration.',accent:'terracotta',venue:['Atelier d’artisan','Artisanat','◇','Un lieu de collaboration, démonstration, prototype et petite production.'],secret:['Porte d’atelier','Adresse discrète','·','Une adresse de bouche-à-oreille peut se révéler en observant le plan.']},
    industry:{id:'industry',subtitle:'Matière, fabrication, prototypes et réseaux professionnels.',accent:'pearl',venue:['Fabrique / atelier matière','Industrie & création','◉','Un lieu de jeu autour des procédés, prototypes, accessoires et production.'],secret:['Ancien dépôt','Indice industriel','·','Un lieu secondaire peut donner accès à une matière ou un contact professionnel.']},
    mountain:{id:'mountain',subtitle:'Relief, protection, mouvement et lumière.',accent:'blue',venue:['Point haut / maison locale','Paysage & technique','△','Un lieu pour étudier volumes, superpositions, mouvement et conditions extérieures.'],secret:['Adresse d’altitude','Indice local','·','Une piste discrète vers un artisan, un guide ou un lieu de shooting.']},
    hospitality:{id:'hospitality',subtitle:'Accueil, événementiel, gastronomie et présentation.',accent:'gold',venue:['Maison d’accueil','Événementiel','✦','Un lieu pour rendez-vous, habillage d’événement, présentation et réseau.'],secret:['Invitation manuscrite','Indice événement','·','Une invitation discrète peut ouvrir une commande ou une rencontre.']},
    general:{id:'general',subtitle:'Vie locale, rencontres, création et petites adresses.',accent:'sage',venue:['Adresse locale','Découverte','✦','Une adresse propre à cette commune qui peut devenir importante dans ta carrière.'],secret:['Note pliée','Indice local','·','Un indice discret vers une nouvelle adresse ou une recommandation.']}
  };

  /*
   * Les bassins ne sont pas des niveaux de prestige. Ils donnent une texture locale aux
   * communes et branchent le même gameplay universel sur des réalités différentes :
   * territoire -> logement -> lieux -> habitants -> savoir-faire -> événements -> réseau
   * -> clientes/opportunités -> habitudes -> mémoire locale.
   */
  const basins={
    bresse:{id:'bresse',label:'Bresse · Bourg',tone:'Bocage, marchés, gastronomie et vie de préfecture.',anchors:['Bourg-en-Bresse','Vonnas','Pont-de-Vaux'],materials:['linge de maison','vannerie et bois','matières de table'],heritage:['Monastère royal de Brou','fermes et bocage bressans'],seasons:{printemps:'marchés, jardins et reprises locales',été:'fêtes de village et événements en plein air',automne:'récoltes, marchés et préparation des rendez-vous d’hiver',hiver:'Glorieuses de Bresse et saison des grandes tablées'},hooks:['clientes de cérémonie et d’événement','habillage de table ou de lieu','réseau de commerçants et d’hôtellerie','shootings patrimoine']},
    dombes:{id:'dombes',label:'Dombes',tone:'Étangs, oiseaux, brumes, pêche et châteaux.',anchors:['Villars-les-Dombes','Châtillon-sur-Chalaronne','Saint-Paul-de-Varax'],materials:['reflets d’eau','roseaux et végétal','matières imperméables et superpositions'],heritage:['étangs de la Dombes','châteaux et villages de la Dombes'],seasons:{printemps:'retour du végétal et observation des étangs',été:'lumière sur l’eau et événements de plein air',automne:'pêches d’étangs et migrations d’oiseaux',hiver:'brumes, eau froide et paysages dépouillés'},hooks:['recherche couleur et matière','shootings au bord de l’eau','rencontres de producteurs et guides','commandes inspirées par le paysage']},
    bugey:{id:'bugey',label:'Bugey · Cerdon · Jujurieux',tone:'Vallées industrielles, soie, cuivre, vigne et relief.',anchors:['Jujurieux','Cerdon','Ambérieu-en-Bugey','Belley'],materials:['soie','cuivre et métal','laine et fibres de vallée'],heritage:['Soieries Bonnet','Cuivrerie de Cerdon','mémoire ouvrière des vallées'],seasons:{printemps:'réouverture des parcours patrimoniaux et vallées',été:'routes de savoir-faire et lumière du relief',automne:'matières chaudes, vendanges et patrimoine industriel',hiver:'archives, ateliers intérieurs et transmission'},hooks:['recherche textile documentée','collaboration artisan-métal','accessoires et ornements','mémoire ouvrière dans le Book']},
    hautbugey:{id:'hautbugey',label:'Haut-Bugey · Oyonnax',tone:'Design industriel, peigne, plasturgie, accessoires et montagne.',anchors:['Oyonnax','Nantua','Bellignat'],materials:['acétate et matières plastiques','ornements de coiffure','lunetterie et accessoires'],heritage:['Musée du Peigne et de la Plasturgie','mémoire industrielle de la Plastics Vallée'],seasons:{printemps:'prototypes, nouvelles séries et reprise des sorties',été:'design, lac et événements de vallée',automne:'matières, couleurs et visites d’ateliers',hiver:'prototype en intérieur et paysages techniques'},hooks:['prototype d’accessoire','ornement de coiffure','lunetterie et détail mode','contacts fabrication et petite série']},
    gexjura:{id:'gexjura',label:'Pays de Gex · Monts Jura',tone:'Frontière, altitude, mobilité, protection et clientèle internationale.',anchors:['Gex','Divonne-les-Bains','Ferney-Voltaire','Mijoux','Lélex'],materials:['maille et couche thermique','matières protectrices','cuir et accessoires de montagne'],heritage:['villages du Pays de Gex','paysages et savoir-faire jurassiens'],seasons:{printemps:'transition de saison et randonnée',été:'altitude, festivals et clientèle de passage',automne:'brouillard, superpositions et retour au calme',hiver:'ski, froid, protection et mouvements sportifs'},hooks:['vêtement de mouvement','vestiaire d’altitude','clientes de passage et transfrontalières','shootings neige et relief']},
    perouges:{id:'perouges',label:'Pérouges · Plaine de l’Ain',tone:'Cité médiévale, pierre, plaine, passages et proximité lyonnaise.',anchors:['Pérouges','Meximieux','Montluel','Miribel'],materials:['lin et toile','cuir patiné','pierre et tons minéraux'],heritage:['cité médiévale de Pérouges','architecture de la Plaine de l’Ain'],seasons:{printemps:'rues anciennes, visiteurs et reprise des terrasses',été:'forte fréquentation et événements patrimoniaux',automne:'pierre humide, teintes sourdes et brocantes',hiver:'rues calmes, détails architecturaux et lumière basse'},hooks:['shooting éditorial patrimonial','costume ou pièce de cérémonie','rencontres de passage','brocante, réemploi et accessoires']},
    revermont:{id:'revermont',label:'Revermont',tone:'Piémont, pierre, villages, artisanat et chemins.',anchors:['Meillonnas','Treffort-Cuisiat','Ceyzériat'],materials:['terre et céramique','lin et fibres rustiques','bois et pierre'],heritage:['villages du Revermont','artisanat de Meillonnas'],seasons:{printemps:'chemins, jardins et ateliers qui rouvrent',été:'marchés, plein air et lumière sèche',automne:'matières terreuses et récoltes',hiver:'artisanat intérieur, pierre et transmission'},hooks:['collaboration artisanale','palette terre et minéral','pièces lentes et petites séries','réseau de village']},
    generic:{id:'generic',label:'Ain · territoire local',tone:'Commune à découvrir sans scénario géographique imposé.',anchors:[],materials:['matières trouvées localement'],heritage:['mémoire communale'],seasons:{printemps:'reprise locale',été:'vie extérieure',automne:'matières et marchés',hiver:'vie intérieure et transmission'},hooks:['rencontres locales','adresses discrètes','clientes de proximité','carnet de territoire']}
  };

  const exact={
    'Jujurieux':'textile','Saint-Rambert-en-Bugey':'textile','Neuville-les-Dames':'textile',
    'Oyonnax':'industry','Plagne':'industry',
    'Trévoux':'craft','Meillonnas':'craft','Fareins':'heritage','Pérouges':'heritage','Ambronay':'heritage','Pont-de-Vaux':'heritage',
    'Villars-les-Dombes':'nature','Ceyzérieu':'nature','Cuisiat':'nature','Chézery-Forens':'nature',
    'Mijoux':'craft','Gex':'mountain','Lélex':'mountain','Plateau d’Hauteville':'mountain','Belley':'mountain',
    'Vonnas':'hospitality','Bourg-en-Bresse':'hospitality','Cerdon':'craft','Châtillon-sur-Chalaronne':'heritage','Nantua':'industry'
  };
  const groups={
    mountain:['Divonne-les-Bains','Ferney-Voltaire','Prévessin-Moëns','Thoiry','Collonges','Bellegarde-sur-Valserine','Valserhône'],
    nature:['Ars-sur-Formans','Châtillon-sur-Chalaronne','Saint-Paul-de-Varax','Pont-d’Ain','Pont-d Ain','Seyssel'],
    heritage:['Saint-Sorlin-en-Bugey','Meximieux','Montluel','Miribel'],
    industry:['Ambérieu-en-Bugey','Beynost','Bellignat','Nantua'],
    craft:['Reyrieux','Montmerle-sur-Saône','Thoissey','Cerdon']
  };
  Object.entries(groups).forEach(([k,names])=>names.forEach(n=>{if(!exact[n])exact[n]=k}));

  const basinExact={
    'Bourg-en-Bresse':'bresse','Vonnas':'bresse','Pont-de-Vaux':'bresse','Montrevel-en-Bresse':'bresse','Saint-Trivier-de-Courtes':'bresse',
    'Villars-les-Dombes':'dombes','Châtillon-sur-Chalaronne':'dombes','Saint-Paul-de-Varax':'dombes','Ars-sur-Formans':'dombes',
    'Jujurieux':'bugey','Cerdon':'bugey','Ambérieu-en-Bugey':'bugey','Belley':'bugey','Saint-Rambert-en-Bugey':'bugey','Plateau d’Hauteville':'bugey','Ceyzérieu':'bugey','Seyssel':'bugey',
    'Oyonnax':'hautbugey','Nantua':'hautbugey','Bellignat':'hautbugey','Plagne':'hautbugey',
    'Gex':'gexjura','Divonne-les-Bains':'gexjura','Ferney-Voltaire':'gexjura','Prévessin-Moëns':'gexjura','Thoiry':'gexjura','Mijoux':'gexjura','Lélex':'gexjura','Chézery-Forens':'gexjura','Valserhône':'gexjura','Bellegarde-sur-Valserine':'gexjura',
    'Pérouges':'perouges','Meximieux':'perouges','Montluel':'perouges','Miribel':'perouges','Beynost':'perouges',
    'Meillonnas':'revermont','Cuisiat':'revermont','Ceyzériat':'revermont'
  };

  function basinFor(name){return basins[basinExact[name]]||basins.generic}
  function profile(name,code){let id=exact[name];if(!id){const ids=['general','nature','craft','heritage','textile','industry','mountain','hospitality'];id=ids[hash((code||'')+'|'+name)%ids.length]}const a=archetypes[id]||archetypes.general,b=basinFor(name);return {...a,commune:name,basin:b,territoryLabel:b.label,uniqueLabel:a.venue[0]+' · '+name,secretLabel:a.secret[0]+' · '+name};}
  function places(name,code){const p=profile(name,code);return {profile:p,special:['special',p.uniqueLabel,p.venue[1],p.venue[2],p.venue[3]],secret:['secret-personality',p.secretLabel,p.secret[1],p.secret[2],p.secret[3]]}}
  function hierarchy(name,code,season='printemps'){const p=profile(name,code),b=p.basin||basins.generic;return {department:'Ain',commune:name,basin:b.id,territory:b.label,identity:p.id,tone:b.tone,season,seasonRhythm:b.seasons[season]||b.seasons.printemps,materials:[...b.materials],heritage:[...b.heritage],hooks:[...b.hooks],chain:['territoire','logement','lieux','habitants','commerces-artisans','événements','réseau','clientes-opportunités','habitudes','mémoire locale']}}

  window.HCAinCommunePersonality={profile,places,hierarchy,basinFor,basins,archetypes,exact};
})();