/* Haute Couture Live — Gard complete content pack.
   Real places are anchored to official/institutional sources when listed.
   Characters, relationship arcs, missions, clients, secrets and fashion translations are fictional gameplay.
*/
(function(){
'use strict';
const P=(id,name,city,category,ecosystem,sourceUrl,sourceLabel,tags,minutes=90)=>({id,name,city,category,ecosystem,real:true,sourceUrl,sourceLabel,tags,visit:{durationMinutes:minutes,baseCulture:'first_visit',revisitAdds:['encounter','rare_object','event','mission','seasonal_detail']}});
const pack={
 code:'30',name:'Gard',version:'2026-08-24-complete-1',designRule:'culture source in place sheet; gameplay unlock shows usable fashion translation, never a misleading archaeological image',
 coverage:{goal:'finish Gard before next department',tiers:{major:'full rich sheet + book + atelier + characters + missions + revisits',secondary:'rich sheet + at least 3 gameplay hooks',village:'curated discovery + local inspiration + encounter pool'}},
 officialSources:[
  {label:'Pont du Gard — site officiel',url:'https://pontdugard.fr/fr/decouvrir'},
  {label:'Aigues-Mortes — office de tourisme',url:'https://ot-aiguesmortes.com/les-incontournables'},
  {label:'Cévennes Tourisme — guide découverte',url:'https://www.cevennes-tourisme.fr/'},
  {label:'Saint-Gilles — commune',url:'https://www.saint-gilles.fr/'},
  {label:'Nîmes — patrimoine',url:'https://www.nimes.fr/que-faire-a-nimes/patrimoine'},
  {label:'UNESCO — Maison Carrée',url:'https://whc.unesco.org/fr/list/1569/'},
  {label:'UNESCO — Pont du Gard',url:'https://whc.unesco.org/fr/list/344/'}
 ],
 hubs:[
  {id:'nimes',name:'Nîmes',tier:'major',identity:['romanité','ville contemporaine','marchés','culture','tailoring architectural']},
  {id:'uzes',name:'Uzès',tier:'major',identity:['duché','marché','source de l’aqueduc','élégance provençale','artisanat']},
  {id:'pont-du-gard',name:'Pont du Gard / Vers-Pont-du-Gard',tier:'major',identity:['aqueduc','garrigue','eau','construction modulaire']},
  {id:'aigues-mortes',name:'Aigues-Mortes',tier:'major',identity:['remparts','salins','Camargue','médiéval','couleurs minérales']},
  {id:'saint-gilles',name:'Saint-Gilles',tier:'major',identity:['abbatiale','sculpture romane','pèlerinage','Camargue']},
  {id:'le-grau-du-roi',name:'Le Grau-du-Roi / Port-Camargue',tier:'major',identity:['mer','pêche','dunes','phare','sports nautiques']},
  {id:'anduze',name:'Anduze',tier:'major',identity:['vase d’Anduze','protestantisme','Gardon','train vapeur','bambous']},
  {id:'saint-jean-du-gard',name:'Saint-Jean-du-Gard',tier:'major',identity:['soie','filature','Cévennes','train vapeur','mémoire textile']},
  {id:'beaucaire',name:'Beaucaire',tier:'secondary',identity:['Rhône','foire','château','troglodyte','brocante']},
  {id:'sommieres',name:'Sommières',tier:'secondary',identity:['Vidourle','pont antique','château','marché']},
  {id:'le-vigan',name:'Le Vigan',tier:'secondary',identity:['Cévennes','marché','musée','laine','châtaigne']},
  {id:'vauvert',name:'Vauvert / Petite Camargue',tier:'secondary',identity:['Scamandre','roseaux','chevaux','vignes des sables']},
  {id:'villeneuve-les-avignon',name:'Villeneuve-lès-Avignon',tier:'secondary',identity:['chartreuse','fort','abbaye','Rhône','jardins']},
  {id:'pont-saint-esprit',name:'Pont-Saint-Esprit',tier:'secondary',identity:['Rhône','pont médiéval','musée laïque','Provence gardoise']},
  {id:'vezenobres',name:'Vézénobres',tier:'village',identity:['village perché','figue','pierre','ruelles']},
  {id:'sauve',name:'Sauve',tier:'village',identity:['village médiéval','mer des rochers','fourche de micocoulier']},
  {id:'lussan',name:'Lussan',tier:'village',identity:['pierre','remparts','céramique','concluses']},
  {id:'aigueze',name:'Aiguèze',tier:'village',identity:['gorges de l’Ardèche','village perché','pierre claire']},
  {id:'montclus',name:'Montclus',tier:'village',identity:['Cèze','donjon','pierre','végétation']},
  {id:'barjac',name:'Barjac',tier:'village',identity:['Renaissance','brocante','marché','pierre blonde']}
 ],
 places:[
  P('nimes-arenes','Arènes de Nîmes','Nîmes','monument','nimes','https://www.arenes-nimes.com/','Arènes de Nîmes',['arcades','ellipse','pierre','spectacle'],90),
  P('nimes-musee-romanite','Musée de la Romanité','Nîmes','museum','nimes','https://museedelaromanite.fr/','Musée de la Romanité',['mosaïque','bronze','drapé','archéologie'],150),
  P('nimes-maison-carree','Maison Carrée','Nîmes','monument','nimes','https://www.arenes-nimes.com/monuments/maison-carree/','Maison Carrée',['corinthien','acanthe','colonne','bronze'],75),
  P('nimes-tour-magne','Tour Magne','Nîmes','monument+viewpoint','nimes','https://www.nimes.fr/que-faire-a-nimes/patrimoine/les-monuments-romains/la-tour-magne','Ville de Nîmes',['verticalité','strates','panorama','pierre'],75),
  P('nimes-jardins-fontaine','Jardins de la Fontaine','Nîmes','garden','nimes','https://www.nimes.fr/que-faire-a-nimes/patrimoine/les-jardins-de-la-fontaine','Ville de Nîmes',['eau','balustrade','sauge','drapé'],90),
  P('nimes-temple-diane','Temple de Diane','Nîmes','ruin','nimes','https://www.nimes.fr/que-faire-a-nimes/patrimoine/les-jardins-de-la-fontaine','Ville de Nîmes',['voûte','niche','ruine','ombre'],45),
  P('nimes-castellum','Castellum divisorium','Nîmes','archaeology','nimes','https://www.nimes.fr/que-faire-a-nimes/patrimoine/les-monuments-romains','Ville de Nîmes',['eau','cercle','canalisation','réseau'],40),
  P('nimes-porte-auguste','Porte Auguste','Nîmes','monument','nimes','https://www.nimes.fr/que-faire-a-nimes/patrimoine/les-monuments-romains','Ville de Nîmes',['porte','double arcade','rythme','entrée'],35),
  P('nimes-porte-france','Porte de France','Nîmes','monument','nimes','https://www.nimes.fr/que-faire-a-nimes/patrimoine/les-monuments-romains','Ville de Nîmes',['arc','passage','pierre','trace urbaine'],30),
  P('nimes-beaux-arts','Musée des Beaux-Arts de Nîmes','Nîmes','museum','nimes','https://www.nimes.fr/que-faire-a-nimes/culture/les-musees-le-planetarium','Ville de Nîmes',['peinture','portrait','couleur','drapé'],100),
  P('nimes-vieux-nimes','Musée du Vieux Nîmes','Nîmes','museum','nimes','https://www.nimes.fr/que-faire-a-nimes/culture/les-musees-le-planetarium','Ville de Nîmes',['textile local','vie quotidienne','costume','objets'],90),
  P('nimes-carre-art','Carré d’Art','Nîmes','museum+library','nimes','https://www.carreartmusee.com/','Carré d’Art',['art contemporain','graphisme','édition','architecture'],120),
  P('nimes-cultures-taurines','Musée des Cultures Taurines','Nîmes','museum','nimes','https://www.nimes.fr/que-faire-a-nimes/culture/les-musees-le-planetarium','Ville de Nîmes',['costume','broderie','cape','culture taurine'],90),
  P('nimes-halles','Les Halles de Nîmes','Nîmes','market','nimes','https://www.leshallesdenimes.fr/','Halles de Nîmes',['couleur','terroir','panier','matière quotidienne'],60),
  P('nimes-esplanade','Esplanade Charles-de-Gaulle & fontaine Pradier','Nîmes','urban','nimes','https://www.nimes.fr/','Ville de Nîmes',['fontaine','statuaire','place','silhouette urbaine'],40),

  P('uzes-duche','Le Duché d’Uzès','Uzès','castle','uzes','https://www.uzes-tourisme.com/','Office de tourisme Uzès',['tour','armoiries','velours','cérémonie'],100),
  P('uzes-fenestrelle','Tour Fenestrelle & cathédrale Saint-Théodorit','Uzès','monument','uzes','https://www.uzes-tourisme.com/','Office de tourisme Uzès',['fenêtres','cercle','clocher','verticalité'],70),
  P('uzes-place-herbes','Place aux Herbes & marché','Uzès','market','uzes','https://www.uzes-tourisme.com/','Office de tourisme Uzès',['marché','vannerie','toile','couleurs provençales'],75),
  P('uzes-jardin-medieval','Jardin médiéval d’Uzès','Uzès','garden','uzes','https://www.jardinmedievaluzes.com/','Jardin médiéval',['plantes tinctoriales','herbier','texture','botanique'],75),
  P('uzes-musee-borias','Musée Georges Borias','Uzès','museum','uzes','https://www.uzes.fr/','Ville d’Uzès',['histoire locale','artisanat','objets','archives'],80),
  P('uzes-vallee-eure','Vallée de l’Eure & source de l’aqueduc','Uzès','nature+archaeology','uzes','https://www.uzes-tourisme.com/','Office de tourisme Uzès',['eau','source','aqueduc','mousse'],90),
  P('uzes-haribo','Musée du Bonbon Haribo','Uzès','museum','uzes','https://www.museeharibo.fr/','Musée Haribo',['couleur pop','emballage','forme','jeu'],90),

  P('pont-du-gard','Pont du Gard','Vers-Pont-du-Gard','monument','pont-du-gard','https://pontdugard.fr/fr/decouvrir','Pont du Gard',['arches','module','pierre','eau'],150),
  P('pont-du-gard-musee','Musée du Pont du Gard','Vers-Pont-du-Gard','museum','pont-du-gard','https://pontdugard.fr/fr/decouvrir/musee','Pont du Gard',['chantier','outil','construction','eau'],90),
  P('pont-du-gard-garrigue','Mémoires de Garrigue','Vers-Pont-du-Gard','landscape','pont-du-gard','https://pontdugard.fr/fr/decouvrir/memoires-de-garrigue','Pont du Gard',['olivier','muret','garrigue','fibres naturelles'],90),
  P('pont-du-gard-vestiges','Sentier des vestiges de l’aqueduc','Vers-Pont-du-Gard','archaeology+walk','pont-du-gard','https://pontdugard.fr/fr/decouvrir/visites-guidees','Pont du Gard',['fragment','canal','courbe terrain','trace'],100),
  P('pont-du-gard-gardon','Bords du Gardon','Vers-Pont-du-Gard','nature','pont-du-gard','https://pontdugard.fr/fr/decouvrir/au-bord-de-leau','Pont du Gard',['eau verte','galets','transparence','reflet'],90),

  P('aigues-remparts','Tours et Remparts d’Aigues-Mortes','Aigues-Mortes','monument','aigues-mortes','https://ot-aiguesmortes.com/annuaire/les-tours-et-remparts-d-aigues-mortes','Office de tourisme Aigues-Mortes',['créneaux','pierre','horizon','fortification'],120),
  P('aigues-constance','Tour de Constance','Aigues-Mortes','tower','aigues-mortes','https://ot-aiguesmortes.com/les-tours-et-les-remparts','Office de tourisme Aigues-Mortes',['cylindre','voûte','épaisseur','lumière'],75),
  P('aigues-salin','Salin d’Aigues-Mortes','Aigues-Mortes','industrial+nature','aigues-mortes','https://www.visitesalinsdecamargue.com/','Salins du Midi',['rose salin','sel','cristal','blanc','eau'],120),
  P('aigues-sablons','Église Notre-Dame-des-Sablons','Aigues-Mortes','church','aigues-mortes','https://ot-aiguesmortes.com/l-eglise-et-les-chapelles','Office de tourisme Aigues-Mortes',['vitrail','gothique','pierre','couleur'],60),
  P('aigues-penitents-blancs','Chapelle des Pénitents Blancs','Aigues-Mortes','chapel','aigues-mortes','https://ot-aiguesmortes.com/l-eglise-et-les-chapelles','Office de tourisme Aigues-Mortes',['fresque','baroque','bleu','or'],55),
  P('aigues-penitents-gris','Chapelle des Pénitents Gris','Aigues-Mortes','chapel','aigues-mortes','https://ot-aiguesmortes.com/l-eglise-et-les-chapelles','Office de tourisme Aigues-Mortes',['retable','bois sculpté','dorure','frise'],55),
  P('aigues-place-saint-louis','Place Saint-Louis','Aigues-Mortes','urban','aigues-mortes','https://ot-aiguesmortes.com/les-incontournables','Office de tourisme Aigues-Mortes',['terrasse','statue','ombre','lin'],45),
  P('aigues-marche','Marché d’Aigues-Mortes','Aigues-Mortes','market','aigues-mortes','https://ot-aiguesmortes.com/les-incontournables','Office de tourisme Aigues-Mortes',['panier','produits camarguais','textile marché','couleur'],60),

  P('saint-gilles-abbatiale','Abbatiale de Saint-Gilles','Saint-Gilles','church','saint-gilles','https://www.saint-gilles.fr/','Ville de Saint-Gilles',['portail sculpté','roman','pèlerinage','pierre'],100),
  P('saint-gilles-crypte','Crypte & tombeau de saint Gilles','Saint-Gilles','heritage','saint-gilles','https://www.saint-gilles.fr/','Ville de Saint-Gilles',['voûte','ombre','chapiteau','pèlerinage'],60),
  P('saint-gilles-vis','La Vis de Saint-Gilles','Saint-Gilles','architecture','saint-gilles','https://www.saint-gilles.fr/','Ville de Saint-Gilles',['spirale','escalier','taille de pierre','compagnonnage'],45),
  P('saint-gilles-maison-romane','Maison romane / musée','Saint-Gilles','museum','saint-gilles','https://www.saint-gilles.fr/','Ville de Saint-Gilles',['archéologie','ethnologie','ornithologie','objets'],75),
  P('saint-gilles-port','Port de Saint-Gilles & canal','Saint-Gilles','waterfront','saint-gilles','https://www.saint-gilles.fr/','Ville de Saint-Gilles',['cordage','bateau','canal','toile'],60),

  P('grau-espiguette','Plage de l’Espiguette','Le Grau-du-Roi','nature','le-grau-du-roi','https://www.letsgrau.com/','Office de tourisme Le Grau-du-Roi',['dune','sable','vent','blanc','ligne horizon'],120),
  P('grau-port-peche','Port de pêche du Grau-du-Roi','Le Grau-du-Roi','harbour','le-grau-du-roi','https://www.letsgrau.com/','Office de tourisme Le Grau-du-Roi',['filet','cordage','ciré','marine'],80),
  P('grau-seaquarium','Seaquarium Institut Marin','Le Grau-du-Roi','aquarium','le-grau-du-roi','https://www.seaquarium.fr/','Seaquarium',['écaille','transparence','bleu','mouvement'],120),
  P('grau-port-camargue','Port-Camargue','Le Grau-du-Roi','marina','le-grau-du-roi','https://www.portcamargue.com/','Port Camargue',['voile','drisse','blanc','marine','sport'],90),

  P('anduze-horloge','Tour de l’Horloge','Anduze','monument','anduze','https://www.cevennes-tourisme.fr/','Cévennes Tourisme',['cadran','pierre','verticalité','temps'],40),
  P('anduze-pagode','Fontaine Pagode','Anduze','fountain','anduze','https://www.cevennes-tourisme.fr/','Cévennes Tourisme',['tuile vernissée','forme pagode','couleur','eau'],40),
  P('anduze-temple','Grand Temple d’Anduze','Anduze','religious','anduze','https://www.cevennes-tourisme.fr/','Cévennes Tourisme',['sobriété','bois','volume','protestantisme'],55),
  P('anduze-poteries','Ateliers du Vase d’Anduze','Anduze','craft','anduze','https://www.vase-anduze.fr/','Vase d’Anduze',['céramique','guirlande','émail','vert','ocre'],100),
  P('anduze-marche','Marché d’Anduze','Anduze','market','anduze','https://www.cevennes-tourisme.fr/','Cévennes Tourisme',['panier','châtaigne','pélardon','artisanat'],60),
  P('generargues-bambouseraie','Bambouseraie en Cévennes','Générargues','botanical','anduze','https://www.bambouseraie.fr/','Bambouseraie',['bambou','verticalité','vert','tressage'],150),
  P('cevennes-train-vapeur','Train à vapeur des Cévennes','Anduze / Saint-Jean-du-Gard','transport-heritage','anduze','https://www.trainavapeur.com/','Train à vapeur des Cévennes',['métal noir','fumée','rayure','voyage'],120),

  P('stjean-maison-rouge','Maison Rouge — Musée des vallées cévenoles','Saint-Jean-du-Gard','museum','saint-jean-du-gard','https://www.maisonrouge-musee.fr/','Maison Rouge',['soie','filature','métiers','costume','Cévennes'],150),
  P('stjean-centre','Centre ancien de Saint-Jean-du-Gard','Saint-Jean-du-Gard','urban','saint-jean-du-gard','https://www.cevennes-tourisme.fr/','Cévennes Tourisme',['pierre','volet','marché','montagne'],60),

  P('beaucaire-chateau','Château de Beaucaire','Beaucaire','castle','beaucaire','https://www.provence-camargue-tourisme.com/','Office de tourisme Provence Camargue',['forteresse','Rhône','pierre','panorama'],90),
  P('beaucaire-saint-roman','Abbaye troglodytique de Saint-Roman','Beaucaire','abbey','beaucaire','https://www.abbaye-saint-roman.com/','Abbaye Saint-Roman',['roche','cavité','taille','ombre'],100),
  P('beaucaire-port','Port de plaisance de Beaucaire','Beaucaire','harbour','beaucaire','https://www.provence-camargue-tourisme.com/','Office de tourisme Provence Camargue',['cordage','Rhône','bateau','toile'],60),
  P('beaucaire-musee','Musée Auguste Jacquet','Beaucaire','museum','beaucaire','https://www.provence-camargue-tourisme.com/','Office de tourisme Provence Camargue',['histoire locale','foire','objets','archives'],75),

  P('sommieres-pont','Pont romain de Sommières','Sommières','monument','sommieres','https://www.ot-sommieres.com/','Office de tourisme Sommières',['arches','rivière','pierre','inondation'],60),
  P('sommieres-chateau','Château de Sommières','Sommières','castle','sommieres','https://www.ot-sommieres.com/','Office de tourisme Sommières',['tour','muraille','panorama','pierre'],80),
  P('sommieres-marche','Marché de Sommières','Sommières','market','sommieres','https://www.ot-sommieres.com/','Office de tourisme Sommières',['brocante','textile marché','panier','couleur'],75),

  P('levigan-musee-cevenol','Musée Cévenol','Le Vigan','museum','le-vigan','https://www.museecevenol.fr/','Musée Cévenol',['laine','soie','outils','costume','Cévennes'],120),
  P('levigan-marche','Marché du Vigan','Le Vigan','market','le-vigan','https://www.cevennes-tourisme.fr/','Cévennes Tourisme',['châtaigne','laine','panier','terroir'],70),

  P('vauvert-scamandre','Réserve naturelle régionale du Scamandre','Vauvert','nature','vauvert','https://www.camarguegardoise.com/','Camargue Gardoise',['roseau','oiseau','marais','sagne'],120),
  P('vauvert-vignes-sables','Vignobles des sables / Petite Camargue','Vauvert','landscape','vauvert','https://www.camarguegardoise.com/','Camargue Gardoise',['sable','vigne','roseau','vent'],90),

  P('villeneuve-chartreuse','Chartreuse Notre-Dame-du-Val-de-Bénédiction','Villeneuve-lès-Avignon','monument','villeneuve-les-avignon','https://chartreuse.org/','La Chartreuse',['cloître','fresque','jardin','silence'],120),
  P('villeneuve-fort-saint-andre','Fort Saint-André','Villeneuve-lès-Avignon','fort','villeneuve-les-avignon','https://www.monuments-nationaux.fr/','Centre des monuments nationaux',['crénelage','tour','pierre','Rhône'],90),
  P('villeneuve-musee-pierre-luxembourg','Musée Pierre-de-Luxembourg','Villeneuve-lès-Avignon','museum','villeneuve-les-avignon','https://www.museepierredeLuxembourg.fr/','Musée Pierre-de-Luxembourg',['peinture','dorure','drapé','religieux'],80),

  P('pontst-musee-laique','Musée d’art sacré du Gard','Pont-Saint-Esprit','museum','pont-saint-esprit','https://musees.gard.fr/','Département du Gard',['textile liturgique','orfèvrerie','objet','broderie'],100),
  P('pontst-pont-medieval','Pont médiéval de Pont-Saint-Esprit','Pont-Saint-Esprit','bridge','pont-saint-esprit','https://www.provenceoccitane.com/','Provence Occitane',['arches','Rhône','pierre','travée'],60),

  P('vezenobres-centre','Village perché de Vézénobres','Vézénobres','village','vezenobres','https://www.cevennes-tourisme.fr/','Cévennes Tourisme',['figue','ruelle','pierre','terrasse'],75),
  P('sauve-mer-rochers','Mer des Rochers','Sauve','nature','sauve','https://www.piemont-cevenol-tourisme.com/','Piémont Cévenol Tourisme',['calcaire','faille','mousse','irrégulier'],100),
  P('sauve-fourche','Conservatoire de la fourche de Sauve','Sauve','craft','sauve','https://www.piemont-cevenol-tourisme.com/','Piémont Cévenol Tourisme',['micocoulier','bois','fourche','artisanat'],75),
  P('lussan-village','Village de Lussan','Lussan','village','lussan','https://www.provenceoccitane.com/','Provence Occitane',['pierre','rempart','céramique','ocre'],75),
  P('aigueze-village','Village d’Aiguèze','Aiguèze','village','aigueze','https://www.provenceoccitane.com/','Provence Occitane',['falaise','pierre claire','Ardèche','verticalité'],75),
  P('montclus-village','Montclus & vallée de la Cèze','Montclus','village+nature','montclus','https://www.provenceoccitane.com/','Provence Occitane',['Cèze','donjon','pierre','végétal'],80),
  P('barjac-brocante','Barjac — centre ancien & grande brocante','Barjac','market+village','barjac','https://www.provenceoccitane.com/','Provence Occitane',['brocante','linge ancien','pierre','objet trouvé'],120)
 ],
 characters:[
  {id:'gard-ines',name:'Inès',home:'Nîmes',role:'amie / première cliente',ageBand:'20s',personality:['spontanée','affective','un peu indécise'],style:['féminin','vintage léger','couleurs chaudes'],relationshipArc:['amie','cliente régulière','confidente','possible ambassadrice locale'],missionHooks:['retouche robe','tenue anniversaire','mariage amie','shooting Ateliergram']},
  {id:'gard-amelie-curator',name:'Amélie Vidal',home:'Nîmes',role:'médiatrice de musée',ageBand:'30s',personality:['précise','curieuse','généreuse'],style:['minimal','bijoux bronze'],relationshipArc:['contact culturel','conseillère','accès réserves/rencontre scientifique'],missionHooks:['tenue conférence','soirée mécènes','capsule inspirée d’une exposition']},
  {id:'gard-samia-embroiderer',name:'Samia Benali',home:'Nîmes',role:'brodeuse indépendante',ageBand:'30s',personality:['exigeante','drôle','très technique'],style:['noir','or mat','pièces fortes'],relationshipArc:['fournisseur','collaboratrice','alliée de concours'],missionHooks:['échantillon brodé','sauver une pièce ratée','commande scène']},
  {id:'gard-lucas-photographer',name:'Lucas Ferrand',home:'Nîmes',role:'photographe mode / architecture',ageBand:'20s',personality:['calme','obsession lumière','fiable'],style:['workwear','monochrome'],relationshipArc:['rencontre photo','collaborateur Book','campagne locale'],missionHooks:['shooting Arènes','éditorial Tour Magne','lookbook Gard']},
  {id:'gard-claire-vintage',name:'Claire Roussel',home:'Nîmes',role:'brocanteuse / vintage',ageBand:'40s',personality:['cash','œil redoutable','protectrice'],style:['tailoring vintage','bijoux chinés'],relationshipArc:['adresse rare','source d’archives','mentor informel'],missionHooks:['restauration manteau','identifier boutons','vente privée']},
  {id:'gard-adrien-jeweler',name:'Adrien Mourier',home:'Uzès',role:'bijoutier contemporain',ageBand:'30s',personality:['réservé','perfectionniste','poétique'],style:['métal brut','lignes nettes'],relationshipArc:['contact marché','collaboration capsule','pièce signature'],missionHooks:['fermoir bronze','bijou défilé','commande mariage']},
  {id:'gard-jeanne-market',name:'Jeanne Fabre',home:'Uzès',role:'organisatrice de marché / commerçante textile',ageBand:'50s',personality:['sociable','réseau immense','pragmatique'],style:['lin','foulards'],relationshipArc:['porte d’entrée Uzès','réseau artisans','clientèle locale'],missionHooks:['stand capsule','uniforme commerçantes','festival d’été']},
  {id:'gard-theo-stonemason',name:'Théo Arnal',home:'Vers-Pont-du-Gard',role:'tailleur de pierre',ageBand:'30s',personality:['manuel','posé','fier du geste'],style:['workwear naturel'],relationshipArc:['rencontre patrimoine','conseiller matière/structure','ami local'],missionHooks:['tablier atelier','shooting matière','installation expo']},
  {id:'gard-lea-salt',name:'Léa Aubert',home:'Aigues-Mortes',role:'guide des salins / photographe amateur',ageBand:'20s',personality:['énergique','franche','très visuelle'],style:['blanc','rose salin','sport chic'],relationshipArc:['guide','source palette','créatrice de contenu'],missionHooks:['tenue événement salin','éditorial rose-blanc','capsule été']},
  {id:'gard-malik-heritage',name:'Malik Daoud',home:'Aigues-Mortes',role:'médiateur patrimoine',ageBand:'30s',personality:['passionné','pédagogue','ironique'],style:['sobre','bleu nuit'],relationshipArc:['contact culturel','accès visite spéciale','conseil historique'],missionHooks:['costume médiation moderne','soirée Saint-Louis','contenu Book']},
  {id:'gard-ana-gardian',name:'Anaïs Reynaud',home:'Vauvert',role:'gardiane',ageBand:'20s',personality:['directe','fière','loyale'],style:['chemise blanche','noir','cuir'],relationshipArc:['rencontre Camargue','confiance lente','commande tradition réinterprétée'],missionHooks:['veste fonctionnelle','accessoire cuir','tenue fête votive']},
  {id:'gard-matteo-bootmaker',name:'Matteo Soler',home:'Petite Camargue',role:'artisan cuir / bottier fictif',ageBand:'40s',personality:['silencieux','obsédé par la durabilité'],style:['cuir patiné'],relationshipArc:['artisan rare','collaboration chaussure','fournisseur premium'],missionHooks:['sandale lacée','botte scène','sac utilitaire']},
  {id:'gard-nora-marine',name:'Nora Benhamou',home:'Le Grau-du-Roi',role:'biologiste marine / cliente',ageBand:'30s',personality:['vive','rationnelle','sens de l’humour'],style:['marine','minimal technique'],relationshipArc:['cliente','ambassadrice durable','contact événement'],missionHooks:['tenue conférence mer','robe gala institut','capsule filet/cordage non littérale']},
  {id:'gard-yanis-sail',name:'Yanis Costa',home:'Port-Camargue',role:'voilier / skipper',ageBand:'20s',personality:['sportif','débrouillard','compétitif'],style:['nautique technique'],relationshipArc:['contact sport','test textile','campagne outdoor'],missionHooks:['coupe-vent','sac technique','uniforme équipage']},
  {id:'gard-celine-potter',name:'Céline Roux',home:'Anduze',role:'céramiste',ageBand:'30s',personality:['chaleureuse','très couleur','expérimentale'],style:['volumes simples','émaux vifs'],relationshipArc:['artisanat croisé','collaboration matière/couleur','expo'],missionHooks:['capsule vase Anduze','boutons céramique','shooting atelier']},
  {id:'gard-isaac-textile',name:'Isaac Martin',home:'Saint-Jean-du-Gard',role:'médiateur textile / ancien technicien de filature',ageBand:'60s',personality:['patient','mémoire immense','un peu secret'],style:['laine','bleu de travail'],relationshipArc:['source histoire soie','mentor technique','accès archives'],missionHooks:['restauration échantillon','lecture métier à tisser','défi soie']},
  {id:'gard-romy-designer',name:'Romy Chastel',home:'Saint-Jean-du-Gard',role:'créatrice textile contemporaine',ageBand:'30s',personality:['indépendante','conceptuelle','exigeante'],style:['plissé','soie mate','teintures végétales'],relationshipArc:['rivale amicale','collaboration','concours régional'],missionHooks:['duo soie','expo Maison Rouge','collection Cévennes']},
  {id:'gard-paul-antiques',name:'Paul Grégoire',home:'Beaucaire',role:'antiquaire / brocanteur',ageBand:'50s',personality:['charmeur','marchandeur','très cultivé'],style:['vestes anciennes','chemises claires'],relationshipArc:['brocante','source objets rares','contact foire'],missionHooks:['authentifier dentelle','trouver boucle','costume foire']},
  {id:'gard-maud-wedding',name:'Maud Cazals',home:'Sommières',role:'wedding planner',ageBand:'30s',personality:['organisée','pressée','très réseau'],style:['tailleur pastel'],relationshipArc:['cliente pro','flux commandes mariage','prestige local'],missionHooks:['robe invitée','tenue mariée','uniforme équipe mariage']},
  {id:'gard-bastien-wool',name:'Bastien Vidal',home:'Le Vigan',role:'éleveur / transformateur laine fictif',ageBand:'30s',personality:['terre-à-terre','écologue','curieux mode'],style:['laine brute','workwear'],relationshipArc:['matière locale','fournisseur','capsule traçable'],missionHooks:['manteau laine','échantillons feutrés','marché hiver']},
  {id:'gard-lina-journalist',name:'Lina Perez',home:'Nîmes',role:'journaliste culture & lifestyle',ageBand:'30s',personality:['rapide','fine','imprévisible'],style:['tailleur couleur','chaussures fortes'],relationshipArc:['article local','critique','alliée média'],missionHooks:['interview atelier','tenue plateau','dossier créateurs du Gard']},
  {id:'gard-eva-theatre',name:'Eva Brunel',home:'Nîmes',role:'régisseuse costume / scène',ageBand:'40s',personality:['efficace','pas de blabla','protectrice des artisans'],style:['noir technique'],relationshipArc:['premières commandes scène','réseau spectacle','grosse production'],missionHooks:['retouche express','costume scène','habillage festival']},
  {id:'gard-gaspard-chef',name:'Gaspard Noguier',home:'Uzès',role:'chef / client événementiel',ageBand:'40s',personality:['généreux','maniaque détail','sensible aux matières'],style:['blanc cassé','tablier premium'],relationshipArc:['client lifestyle','uniformes','événement prestige'],missionHooks:['tablier signature','uniforme brigade','dîner caritatif']},
  {id:'gard-sofia-gallery',name:'Sofia Delmas',home:'Villeneuve-lès-Avignon',role:'galeriste / commissaire',ageBand:'40s',personality:['élégante','sélective','stratégique'],style:['minimal noir','bijoux sculpturaux'],relationshipArc:['contact art','mécènes','collection capsule'],missionHooks:['vernissage','tenue artiste','installation textile']}
 ],
 characterRules:{spawn:'contextual not all at once',memory:true,relationshipEffects:['missions','discounts','rare_access','social_mentions','career_opportunities'],maxConcurrentNewContacts:6},
 missionFamilies:[
  {id:'heritage-translation',label:'Traduire un lieu en vêtement',examples:['arcades vers découpes','mosaïque vers broderie','garrigue vers palette/matière','salin vers couleur/transparence']},
  {id:'local-client',label:'Commandes de clientèle locale',examples:['mariage','anniversaire','gala','tenue de travail','soirée culturelle']},
  {id:'artisan-collab',label:'Collaborations artisanales',examples:['broderie','bijou','cuir','céramique','laine','soie']},
  {id:'editorial',label:'Éditoriaux et shootings',examples:['architecture','Camargue','Cévennes','mer','marché']},
  {id:'event-costume',label:'Scène et événements',examples:['festival','médiation patrimoniale','défilé','soirée mécènes','fête locale']},
  {id:'archive-hunt',label:'Objets et archives rares',examples:['boutons','dentelle','patron','photo','étiquette','outil textile']}
 ],
 seasonalEvents:[
  {id:'gard-spring-market',season:'spring',areas:['Uzès','Sommières','Anduze'],hooks:['marché artisans','capsule lin','rencontre fournisseur']},
  {id:'gard-summer-camargue',season:'summer',areas:['Aigues-Mortes','Le Grau-du-Roi','Vauvert'],hooks:['fêtes','soirée salins','shooting lumière','commande estivale']},
  {id:'gard-summer-pont',season:'summer',areas:['Pont du Gard'],hooks:['soirée culturelle','lumière sur arches','client événementiel']},
  {id:'gard-autumn-brocante',season:'autumn',areas:['Barjac','Beaucaire','Sommières'],hooks:['archives rares','vintage','boutons','dentelles']},
  {id:'gard-autumn-cevennes',season:'autumn',areas:['Le Vigan','Saint-Jean-du-Gard','Anduze'],hooks:['châtaigne','laine','soie','teintures végétales']},
  {id:'gard-winter-culture',season:'winter',areas:['Nîmes','Uzès','Villeneuve-lès-Avignon'],hooks:['musées','gala','commandes cérémonie','recherche Book']}
 ],
 fashionTranslationRules:{
  allowed:['real garment photo','museum fashion object','fashion archive','clearly labeled contemporary equivalent','generated fashion image only when no adequate reference exists'],
  forbidden:['archaeological object used as final fashion unlock when unlock is garment/accessory','mislabelled mosaic as drape','invented historical claim','decorative vector placeholder for major unlock'],
  ifNoGoodTranslation:'do not create the Atelier card; keep cultural source in Book only'
 },
 completionChecklist:['major hubs have factual rich sheet','base cultural content first visit','at least 3 useful fashion translations per major hub','all major unlocks have usable visuals','character encounters linked to places','missions linked to at least 2 systems','Book tags and source provenance','revisit hooks','seasonal hooks','social post opportunities','Atelier prompt hints']
};
window.HCGardComplete=pack;
window.HCFranceDepartmentData=window.HCFranceDepartmentData||{};
const base=window.HCFranceDepartmentData['30'];
if(base){base.completePack=pack;base.cities=base.cities||[];const known=new Set(base.cities.map(x=>x.name));pack.hubs.forEach(h=>{if(!known.has(h.name))base.cities.push({id:h.id,name:h.name,priority:h.tier==='major'?'major':'secondary',icons:['culture','people','secret'],layers:h.tier==='major'?7:4})});base.characterDirectory=pack.characters;base.missionFamilies=pack.missionFamilies;base.seasonalEvents=pack.seasonalEvents;base.completionChecklist=pack.completionChecklist;}
})();