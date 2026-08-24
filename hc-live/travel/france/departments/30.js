/* Haute Couture Live — Département 30 Gard
   Lieux réels vérifiés via Gard Tourisme / offices de tourisme ; récompenses et histoires = gameplay fictionnel.
*/
(function(){
'use strict';
const data={
 code:'30',slug:'gard',name:'Gard',regionCode:'76',regionName:'Occitanie',
 ecosystems:[
  {id:'gard-nimes-pont-du-gard',label:'Nîmes · Pont du Gard · Uzège',tags:['romanité','architecture','garrigue','pierre','olivier'],hubs:['Nîmes','Uzès','Vers-Pont-du-Gard']},
  {id:'gard-camargue',label:'Camargue gardoise',tags:['marais','salins','chevaux','gardians','roseaux','sagne','traditions'],hubs:['Aigues-Mortes','Saint-Gilles','Vauvert','Le Grau-du-Roi']},
  {id:'gard-cevennes',label:'Cévennes gardoises',tags:['montagne','forêt','randonnée','artisanat','matières naturelles'],hubs:['Le Vigan','Anduze']},
  {id:'gard-mediterranee',label:'Méditerranée gardoise',tags:['plage','dunes','port','lumière','vent'],hubs:['Le Grau-du-Roi','Port-Camargue']},
  {id:'gard-rhone-provence',label:'Rhône & Provence gardoise',tags:['marchés','pierre','fleuve','brocante','patrimoine'],hubs:['Beaucaire','Sommières']}
 ],
 cities:[
  {id:'nimes',name:'Nîmes',priority:'major',icons:['culture','mode','market','secret'],layers:8},
  {id:'aigues-mortes',name:'Aigues-Mortes',priority:'major',icons:['culture','nature','secret'],layers:6},
  {id:'saint-gilles',name:'Saint-Gilles',priority:'major',icons:['culture','camargue','market'],layers:5},
  {id:'uzes',name:'Uzès',priority:'major',icons:['culture','market','artisanat','secret'],layers:6},
  {id:'vers-pont-du-gard',name:'Vers-Pont-du-Gard',priority:'major',icons:['culture','nature'],layers:5},
  {id:'le-grau-du-roi',name:'Le Grau-du-Roi',priority:'major',icons:['nature','lifestyle','event'],layers:5},
  {id:'vauvert',name:'Vauvert',priority:'secondary',icons:['camargue','market','people'],layers:4},
  {id:'beaucaire',name:'Beaucaire',priority:'secondary',icons:['market','brocante','culture'],layers:4},
  {id:'sommieres',name:'Sommières',priority:'secondary',icons:['market','brocante','culture'],layers:4},
  {id:'le-vigan',name:'Le Vigan',priority:'secondary',icons:['cevennes','market','artisanat'],layers:4},
  {id:'anduze',name:'Anduze',priority:'secondary',icons:['cevennes','artisanat','nature'],layers:4}
 ],
 places:[
  {
   id:'nimes-arenes',name:'Arènes de Nîmes',city:'Nîmes',ecosystem:'gard-nimes-pont-du-gard',category:'monument',real:true,visibleFromStart:true,
   carnet:{title:'Arènes de Nîmes',summary:'Amphithéâtre romain emblématique de Nîmes. La visite nourrit d’abord le carnet d’architecture, puis peut révéler de nouvelles pistes au fil des retours.',sourceLabel:'Gard Tourisme'},
   visit:{durationMinutes:90,recommendedSlots:['10:00','11:00','15:00'],repeatCooldownDays:30},
   layers:[
    {id:'arenes-01',unlock:'first_visit',rewards:[{type:'inspiration',id:'volume-elliptique'},{type:'social',id:'nimes-arenes-photo-pack'},{type:'knowledge',id:'carnet-romanite-arenes'}]},
    {id:'arenes-02',unlock:'visit>=2 && season!=same',rewards:[{type:'atelier',id:'detail-rythme-arcades'},{type:'social',id:'nimes-stone-shadow-story'}]},
    {id:'arenes-03',unlock:'careerYears>=2 && chance',rewards:[{type:'storyHook',id:'nimes-archive-architecture'}]}
   ]
  },
  {
   id:'nimes-maison-carree',name:'Maison Carrée',city:'Nîmes',ecosystem:'gard-nimes-pont-du-gard',category:'monument',real:true,visibleFromStart:true,
   carnet:{summary:'Temple romain au cœur de Nîmes, point d’observation pour proportions, lignes et pierre claire.',sourceLabel:'Gard Tourisme'},visit:{durationMinutes:60,repeatCooldownDays:45},
   layers:[{id:'mc-01',unlock:'first_visit',rewards:[{type:'inspiration',id:'proportions-classiques'},{type:'palette',id:'pierre-ivoire-nimes'}]}]
  },
  {
   id:'pont-du-gard',name:'Pont du Gard',city:'Vers-Pont-du-Gard',ecosystem:'gard-nimes-pont-du-gard',category:'monument+nature',real:true,visibleFromStart:true,
   carnet:{summary:'Ouvrage majeur de l’aqueduc romain entre Uzès et Nîmes, inscrit au patrimoine mondial de l’UNESCO. Le jeu peut y faire émerger construction, rythme, pierre et paysage.',sourceLabel:'Gard Tourisme'},visit:{durationMinutes:150,repeatCooldownDays:45},
   layers:[{id:'pdg-01',unlock:'first_visit',rewards:[{type:'knowledge',id:'aqueduc-uzes-nimes'},{type:'inspiration',id:'superposition-arches'},{type:'social',id:'pont-du-gard-photo-pack'}]},{id:'pdg-02',unlock:'visit>=2',rewards:[{type:'atelier',id:'construction-modulaire-arches'}]}]
  },
  {
   id:'aigues-mortes-remparts',name:'Remparts d’Aigues-Mortes',city:'Aigues-Mortes',ecosystem:'gard-camargue',category:'monument',real:true,visibleFromStart:true,
   carnet:{summary:'Fortifications médiévales avec vues sur la Camargue et les salins ; très fort potentiel couleur, matière et silhouettes.',sourceLabel:'Gard Tourisme'},visit:{durationMinutes:120,repeatCooldownDays:45},
   layers:[{id:'amr-01',unlock:'first_visit',rewards:[{type:'palette',id:'sel-rose-pierre-sable'},{type:'social',id:'aigues-mortes-remparts-pack'}]},{id:'amr-02',unlock:'season==summer || season==autumn',rewards:[{type:'inspiration',id:'horizon-salin'}]}]
  },
  {
   id:'camargue-manade',name:'Visite d’une manade',city:'Camargue gardoise',ecosystem:'gard-camargue',category:'tradition',real:true,visibleFromStart:false,
   discoverVia:['Aigues-Mortes','Saint-Gilles','Vauvert','bouche-a-oreille'],
   carnet:{summary:'Découverte des traditions camarguaises autour des gardians, chevaux et taureaux. Plusieurs manades réelles existent : le jeu choisit une proposition disponible plutôt qu’un lieu unique permanent.',sourceLabel:'Gard Tourisme'},visit:{durationMinutes:180,repeatCooldownDays:90},
   layers:[{id:'manade-01',unlock:'first_visit',rewards:[{type:'inspiration',id:'camargue-noir-blanc-sable'},{type:'materialTag',id:'cuir-brut'},{type:'social',id:'camargue-manade-story'}]},{id:'manade-02',unlock:'visit>=2 && relationshipTag==local',rewards:[{type:'network',id:'contact-artisan-camargue'},{type:'storyHook',id:'camargue-tradition-thread'}]}]
  },
  {
   id:'saint-gilles-abbatiale',name:'Abbatiale de Saint-Gilles',city:'Saint-Gilles',ecosystem:'gard-camargue',category:'monument',real:true,visibleFromStart:true,
   carnet:{summary:'Grande étape patrimoniale de Saint-Gilles, liée aux chemins de Saint-Jacques-de-Compostelle et au patrimoine mondial de l’UNESCO.',sourceLabel:'Gard Tourisme'},visit:{durationMinutes:75,repeatCooldownDays:60},
   layers:[{id:'sg-01',unlock:'first_visit',rewards:[{type:'inspiration',id:'sculpture-portail'},{type:'knowledge',id:'saint-gilles-carnet'}]}]
  },
  {
   id:'nimes-mercerie-rotation',name:'Mercerie de Nîmes',city:'Nîmes',ecosystem:'gard-nimes-pont-du-gard',category:'mode-shop',real:false,fictionalized:true,visibleFromStart:false,
   discoverVia:['walk:nimes','contact','market','social'],
   carnet:{summary:'Adresse de gameplay renouvelable inspirée du tissu commercial réel de la ville. Le nom et le stock peuvent varier pour éviter de figer une enseigne réelle.'},visit:{durationMinutes:45,repeatCooldownDays:7},
   stockPools:[
    {season:'spring',items:['galon-ecru','coton-rayure-sud','boutons-nacre-clairs']},
    {season:'summer',items:['lin-sable','coton-indigo','ruban-ocre']},
    {season:'autumn',items:['serge-tabac','velours-olive','passementerie-bronze']},
    {season:'winter',items:['laine-ivoire','gabardine-noire','galon-or-vieilli']}
   ],
   unlocks:{atelier:true,social:true,inventory:true}
  },
  {
   id:'gard-grenier-secret',name:'Grenier d’archives',city:'variable',ecosystem:'variable',category:'secret',real:false,fictionalized:true,visibleFromStart:false,
   discoverVia:['relationship>=high','brocante-repeat','careerYears>=3','rare_event'],
   rarity:'very_rare',visit:{durationMinutes:90,repeatCooldownDays:365},
   lootRules:{maxOneMajorArchivePerVisit:true,majorChance:.08,minorChance:.65},
   possibleFinds:[
    {id:'vintage-jacket-01',label:'Veste couture vintage non attribuée',safeHistoricalLabel:true,uses:['inventory','atelier-reference','social','restore']},
    {id:'old-buttons-01',label:'Lot de boutons anciens',uses:['inventory','atelier-component']},
    {id:'pattern-fragment-01',label:'Fragment de patron ancien',uses:['atelier-pattern-research','carnet']}
   ]
  }
 ],
 characterPools:{
  artisans:{maxActive:4,rotationDays:120},locals:{maxActive:6,rotationDays:60},clients:{maxActive:5,rotationDays:45},media:{maxActive:3,rotationDays:180},rare:{maxActive:1,rotationDays:365}
 },
 mapSymbols:{culture:'◈',mode:'✂',market:'◇',nature:'⌁',people:'◉',event:'✦',secret:'?'}
};
window.HCFranceDepartmentData=window.HCFranceDepartmentData||{};window.HCFranceDepartmentData[data.code]=data;
})();