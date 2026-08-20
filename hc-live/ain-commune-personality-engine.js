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
  const exact={
    'Jujurieux':'textile','Saint-Rambert-en-Bugey':'textile','Neuville-les-Dames':'textile',
    'Oyonnax':'industry','Plagne':'industry',
    'Trévoux':'craft','Meillonnas':'craft','Fareins':'heritage','Pérouges':'heritage','Ambronay':'heritage','Pont-de-Vaux':'heritage',
    'Villars-les-Dombes':'nature','Ceyzérieu':'nature','Cuisiat':'nature','Chézery-Forens':'nature',
    'Mijoux':'craft','Gex':'mountain','Lélex':'mountain','Plateau d’Hauteville':'mountain','Belley':'mountain',
    'Vonnas':'hospitality'
  };
  const groups={
    mountain:['Divonne-les-Bains','Ferney-Voltaire','Prévessin-Moëns','Thoiry','Collonges','Bellegarde-sur-Valserine','Valserhône'],
    nature:['Ars-sur-Formans','Châtillon-sur-Chalaronne','Saint-Paul-de-Varax','Pont-d’Ain','Pont-d Ain','Seyssel'],
    heritage:['Saint-Sorlin-en-Bugey','Meximieux','Montluel','Miribel'],
    industry:['Ambérieu-en-Bugey','Beynost','Bellignat','Nantua'],
    craft:['Reyrieux','Montmerle-sur-Saône','Thoissey']
  };
  Object.entries(groups).forEach(([k,names])=>names.forEach(n=>{if(!exact[n])exact[n]=k}));
  function profile(name,code){let id=exact[name];if(!id){const ids=['general','nature','craft','heritage','textile','industry','mountain','hospitality'];id=ids[hash((code||'')+'|'+name)%ids.length]}const a=archetypes[id]||archetypes.general;return {...a,commune:name,uniqueLabel:a.venue[0]+' · '+name,secretLabel:a.secret[0]+' · '+name};}
  function places(name,code){const p=profile(name,code);return {
    profile:p,
    special:['special',p.uniqueLabel,p.venue[1],p.venue[2],p.venue[3]],
    secret:['secret-personality',p.secretLabel,p.secret[1],p.secret[2],p.secret[3]]
  }}
  window.HCAinCommunePersonality={profile,places,archetypes,exact};
})();