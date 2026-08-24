/* Haute Couture Live — Nîmes rich cultural + fashion content pilot
   Facts are sourced from official / institutional sources. Fashion readings and gameplay rewards are creative interpretation.
*/
(function(){
'use strict';
const data={
 cityId:'nimes',city:'Nîmes',department:'30',region:'Occitanie',
 sourcePolicy:'real facts verified; fashion reading/gameplay fictional and clearly separated',
 places:{
  'nimes-arenes':{
   officialSources:[
    {label:'Arènes de Nîmes — histoire',url:'https://www.arenes-nimes.com/histoire-des-arenes/'},
    {label:'Arènes de Nîmes — monument',url:'https://www.arenes-nimes.com/monuments/arenes-de-nimes-2/'}
   ],
   heroSearch:'Arènes de Nîmes façade amphithéâtre',
   gallerySearch:['Arènes de Nîmes arcades','Arènes de Nîmes intérieur gradins','Arènes de Nîmes gladiateurs décor sculpté','Arènes de Nîmes velum'],
   facts:{
    summary:'Amphithéâtre romain construit vers la fin du Ier siècle / autour de 100 apr. J.-C., remarquablement conservé et encore utilisé comme lieu de spectacle.',
    architecture:['133 m de long','101 m de large','piste ovale 68 × 38 m','façade d’environ 21 m','120 arcades sur deux niveaux','60 colonnes engagées'],
    history:['Antiquité : jeux et spectacles','Moyen Âge : transformation en forteresse puis quartier habité','XIXe siècle : disparition progressive des habitations et restauration','Aujourd’hui : scène culturelle et événementielle'],
    anecdotes:['Les habitants ont réutilisé l’amphithéâtre comme quartier d’habitation, ce qui a contribué à sa conservation.','Un système de mâts et de câbles permettait de soutenir un velum.','Des décors sculptés représentent notamment des gladiateurs et la louve allaitant Romulus et Remus.'],
    objectsAndDetails:[
     {id:'arenes-bulls',title:'Avant-corps de taureaux',kind:'sculpture_architecturale',observe:'Entrée principale, puissance animale, frontalité, relief.'},
     {id:'arenes-gladiators',title:'Gladiateurs en combat',kind:'relief',observe:'Dynamique du corps, tension, équipement, silhouettes opposées.'},
     {id:'arenes-wolf',title:'Louve de Rome',kind:'relief',observe:'Symbole fondateur, composition narrative, figure animale.'},
     {id:'arenes-arcades',title:'Rythme des arcades',kind:'architecture',observe:'Répétition, verticalité, ombre/lumière, superposition.'}
    ]
   },
   fashionReading:{
    concept:'Architecture du corps',
    palette:[{name:'Calcaire chaud',hex:'#C8A77D'},{name:'Ivoire poussière',hex:'#E9DFC9'},{name:'Ombre pierre',hex:'#5D514A'},{name:'Bronze patiné',hex:'#7E6A4A'}],
    materials:['lin lavé','gabardine structurée','cuir patiné','organza fumé'],
    motifs:['arcades répétées','ellipse','bandes superposées','frise figurative'],
    jewelry:['manchette bronze martelé','boucle inspirée d’un anneau antique'],
    accessories:['ceinture large cuir','sandale lacée reinterpretée'],
    silhouettes:['robe colonne drapée','veste architecturée à découpes arquées','cape circulaire'],
    atelierUnlocks:[
     {id:'cut-arcade-panel',type:'garment_detail',title:'Découpe arcade',assetRequired:true,tags:['romanité','architecture','arcade','nimes']},
     {id:'pattern-elliptic-cape',type:'garment',title:'Cape elliptique',assetRequired:true,tags:['romanité','ellipse','cape','nimes']}
    ]
   },
   visitChapters:[
    {id:'arrival',title:'Face à la façade',unlock:'first_visit'},
    {id:'circulation',title:'Dans les galeries',unlock:'first_visit'},
    {id:'sculpted-details',title:'Chercher les reliefs',unlock:'visit>=2'},
    {id:'medieval-life',title:'Quand les Arènes étaient un quartier',unlock:'visit>=2'},
    {id:'designer-eye',title:'Lire l’amphithéâtre comme un vêtement',unlock:'careerYears>=1'}
   ]
  },
  'nimes-musee-romanite':{
   officialSources:[
    {label:'Musée de la Romanité — histoire des collections',url:'https://museedelaromanite.fr/histoire-des-collections'},
    {label:'Ville de Nîmes — Musée de la Romanité',url:'https://www.nimes.fr/que-faire-a-nimes/culture/les-musees-le-planetarium/musee-de-la-romanite'},
    {label:'POP — Muséofile',url:'https://pop.culture.gouv.fr/notice/museo/M0455'}
   ],
   heroSearch:'Musée de la Romanité Nîmes façade',
   gallerySearch:['Musée de la Romanité mosaïque de Penthée','Musée de la Romanité mosaïque enclos du gouverneur','Musée de la Romanité buste Apollon bronze','Musée de la Romanité Silène','Musée de la Romanité Vénus statue'],
   facts:{
    summary:'Musée d’archéologie ouvert en 2018 face aux Arènes, présentant environ 25 siècles d’histoire de Nîmes et des collections archéologiques locales et régionales.',
    architecture:['Bâtiment contemporain conçu par Elizabeth de Portzamparc','façade évoquant une toge de verre plissée','lames de verre renvoyant à l’idée de mosaïque','jardin archéologique méditerranéen','rooftop panoramique'],
    history:['Les collections archéologiques nîmoises se constituent depuis le XVIe siècle.','La Maison Carrée devient un premier musée à partir de 1823.','Le Musée de la Romanité ouvre en 2018.','Les collections continuent de s’enrichir grâce à l’archéologie contemporaine.'],
    anecdotes:['Jean-François Séguier, érudit nîmois, a déchiffré la dédicace de la Maison Carrée.','Le musée mêle collections et dispositifs multimédias pour raconter la romanisation de Nîmes.'],
    objectsAndDetails:[
     {id:'romanite-apollon',title:'Buste d’Apollon en bronze',kind:'sculpture',observe:'Bronze, visage idéalisé, lumière sur le métal, coiffure.'},
     {id:'romanite-eagles',title:'Frise aux aigles',kind:'relief',observe:'Rythme héraldique, ailes, symétrie, répétition.'},
     {id:'romanite-penthee',title:'Mosaïque de Penthée',kind:'mosaic',observe:'Narration, tesselles, palette, géométrie et bordures.'},
     {id:'romanite-governor',title:'Mosaïque dite de l’enclos du gouverneur',kind:'mosaic',observe:'Réseau géométrique et composition pavimentaire.'},
     {id:'romanite-silene',title:'Silène',kind:'sculpture',observe:'Expression, volume, drapé et traitement de surface.'},
     {id:'romanite-venus',title:'Vénus',kind:'sculpture',observe:'Canon du corps, posture, douceur des volumes.'},
     {id:'romanite-dolium',title:'Dolium',kind:'object',observe:'Grand contenant, courbe, terre cuite, proportion utilitaire.'}
    ]
   },
   fashionReading:{
    concept:'De la mosaïque au drapé',
    palette:[{name:'Marbre ivoire',hex:'#E7DDC8'},{name:'Terre cuite',hex:'#B76F4E'},{name:'Bronze ancien',hex:'#7E6B4D'},{name:'Noir tesselle',hex:'#2E2926'},{name:'Rouge pompéien',hex:'#8C3F36'}],
    materials:['soie plissée','organza','lin','cuir bronze','jacquard géométrique'],
    motifs:['mosaïque tessellée','frise aux aigles','grecque géométrique','médaillon central'],
    jewelry:['pendentif médaillon','manchette bronze','boucles en forme de disque'],
    accessories:['ceinture drapée','sac rigide mosaïque','sandale à brides'],
    silhouettes:['toge contemporaine','robe drapée asymétrique','jupe panneaux mosaïque','manteau à bordure frise'],
    atelierUnlocks:[
     {id:'motif-roman-mosaic-border',type:'motif',title:'Bordure mosaïque romaine',assetRequired:true,tags:['romanité','mosaïque','géométrique','nimes']},
     {id:'pleat-toga-glass',type:'garment_detail',title:'Plissé toga',assetRequired:true,tags:['romanité','plissé','toge','nimes']},
     {id:'palette-romanite-museum',type:'palette',title:'Palette Musée de la Romanité',assetRequired:true,tags:['romanité','bronze','terre-cuite','ivoire']}
    ]
   },
   visitChapters:[
    {id:'facade',title:'La toge de verre',unlock:'first_visit'},
    {id:'gaul',title:'Avant Rome : les Volques Arécomiques',unlock:'first_visit'},
    {id:'romanization',title:'La romanisation de Nîmes',unlock:'first_visit'},
    {id:'mosaics',title:'Lire les mosaïques',unlock:'visit>=2'},
    {id:'sculptures',title:'Corps, dieux et visages',unlock:'visit>=2'},
    {id:'archives',title:'Comment une collection se construit',unlock:'careerYears>=1'},
    {id:'new-archaeology',title:'L’archéologie continue',unlock:'careerYears>=2'}
   ]
  },
  'nimes-tour-magne':{
   officialSources:[{label:'Arènes de Nîmes — histoire de la Tour Magne',url:'https://www.arenes-nimes.com/histoire-de-la-tour-magne/'}],
   heroSearch:'Tour Magne Nîmes',
   facts:{summary:'Tour dominante de l’enceinte augustéenne, intégrant une tour gauloise plus ancienne et témoignant de la superposition des périodes gauloise et romaine.',anecdotes:['La construction romaine a englobé une tour gauloise préexistante.','La tour romaine a atteint environ 36 mètres de haut.']},
   fashionReading:{concept:'Strates et verticalité',palette:[{name:'Pierre claire',hex:'#C8B08C'},{name:'Vert garrigue',hex:'#75825D'},{name:'Terre',hex:'#8C684B'}],materials:['laine sèche','lin','cuir naturel'],motifs:['strates','verticales','enceinte'],silhouettes:['manteau colonne','robe à panneaux superposés'],atelierUnlocks:[{id:'construction-strata-panel',type:'garment_detail',title:'Panneaux stratifiés',assetRequired:true,tags:['tour-magne','strates','verticalité']}]}
  },
  'nimes-maison-carree':{
   officialSources:[{label:'Maison Carrée — site documentaire officiel',url:'https://www.maisoncarree.eu/'}],
   heroSearch:'Maison Carrée Nîmes',
   facts:{summary:'Temple romain majeur de Nîmes, documenté à travers son architecture, son histoire, son quartier et une riche iconographie ancienne.',anecdotes:['Le site documentaire rassemble dessins, peintures, gravures, photographies et objets liés au monument.']},
   fashionReading:{concept:'Proportion classique',palette:[{name:'Ivoire temple',hex:'#E6D9BE'},{name:'Ombre grise',hex:'#716961'}],materials:['crêpe lourd','gabardine','soie mate'],motifs:['colonnade','fronton','module répétitif'],silhouettes:['robe colonne','tailleur à proportions strictes'],atelierUnlocks:[{id:'classic-column-dress',type:'garment',title:'Robe colonne classique',assetRequired:true,tags:['maison-carree','colonne','classique','romanité']}]}
  }
 },
 tagsIndex:{romanite:['nimes-arenes','nimes-musee-romanite','nimes-tour-magne','nimes-maison-carree'],mosaic:['nimes-musee-romanite'],drape:['nimes-musee-romanite','nimes-arenes'],architecture:['nimes-arenes','nimes-tour-magne','nimes-maison-carree']}
};
window.HCNimesRichContent=data;
})();