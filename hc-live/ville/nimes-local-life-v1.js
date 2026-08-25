/* Haute Couture Live — Nîmes local life expansion.
   Real civic/cultural places use institutional sources. Shops, studios, cafés, clients and relationship arcs are fictionalized gameplay so the career can renew over decades.
*/
(function(){
'use strict';
const wait=(fn,n=0)=>{if(fn())return;if(n<40)setTimeout(()=>wait(fn,n+1),80)};
wait(()=>{
 const p=window.HCGardComplete;if(!p)return false;
 const has=(arr,id)=>arr.some(x=>x.id===id);
 const addPlace=x=>{p.places=p.places||[];if(!has(p.places,x.id))p.places.push(x)};
 const addChar=x=>{p.characters=p.characters||[];if(!has(p.characters,x.id))p.characters.push(x)};
 const real=(id,name,category,url,label,tags,minutes=60)=>({id,name,city:'Nîmes',category,ecosystem:'nimes',real:true,sourceUrl:url,sourceLabel:label,tags,visit:{durationMinutes:minutes,baseCulture:'first_visit',revisitAdds:['encounter','research','event','mission','seasonal_detail']}});
 [
  real('nimes-cathedrale','Cathédrale Notre-Dame-et-Saint-Castor','church+heritage','https://www.nimes-tourisme.com/','Office de tourisme de Nîmes',['roman','gothique','frise','pierre','porte','drapé'],70),
  real('nimes-archives','Archives de Nîmes','archives+research','https://archives.nimes.fr/','Archives de Nîmes',['archives','photographie','plan','patron','mémoire urbaine'],90),
  real('nimes-bibliotheque-patrimoine','Bibliothèque Carré d’Art — fonds patrimoniaux','library+archives','https://www.nimes.fr/que-faire-a-nimes/culture/reseau-de-bibliotheques-municipales/les-bibliotheques-de-nimes/bibliotheque-carre-d-art-jean-bousquet','Ville de Nîmes',['manuscrit','reliure','livre artiste','tauromachie','iconographie'],90),
  real('nimes-grand-temple','Grand Temple de Nîmes','religious+heritage','https://www.nimes.fr/','Ville de Nîmes',['architecture protestante','bois','sobriété','symétrie'],50),
  real('nimes-centre-historique','Écusson — centre historique','urban+walk','https://www.nimes-tourisme.com/','Office de tourisme de Nîmes',['ruelles','façades','portes','ferronnerie','ombre','placettes'],100),
  real('nimes-gare','Gare de Nîmes Centre','transport+station','https://www.garesetconnexions.sncf/fr/gares-services/nimes','SNCF Gares & Connexions',['gare','transport','départ','destination','trajet'],20)
 ].forEach(addPlace);
 [
  {id:'nimes-mercerie-atelier',name:'Mercerie des Arceaux',city:'Nîmes',category:'mode-shop',ecosystem:'nimes',real:false,fictionalized:true,tags:['galon','boutons','dentelle','doublure','ruban'],visit:{durationMinutes:40,baseCulture:'first_visit',revisitAdds:['new_stock','special_order','encounter']},stockRotation:['galons anciens','boutons nacre','dentelle coton','ruban velours','doublure imprimée','passementerie métallique']},
  {id:'nimes-brocante-textile',name:'Brocante textile du centre',city:'Nîmes',category:'vintage+market',ecosystem:'nimes',real:false,fictionalized:true,tags:['linge ancien','vêtement vintage','bouton','broderie','patron'],visit:{durationMinutes:75,baseCulture:'first_visit',revisitAdds:['rare_object','archive','encounter']},lootPool:['lot de boutons anciens','napperon brodé','châle abîmé','coupon de serge','patron incomplet','broche fantaisie']},
  {id:'nimes-cafe-creative',name:'Café des Croquis',city:'Nîmes',category:'cafe+people',ecosystem:'nimes',real:false,fictionalized:true,tags:['rencontre','croquis','réseau','client'],visit:{durationMinutes:45,baseCulture:'first_visit',revisitAdds:['encounter','client','rumour','social_post']}},
  {id:'nimes-photo-studio',name:'Studio lumière du centre',city:'Nîmes',category:'creative-studio',ecosystem:'nimes',real:false,fictionalized:true,tags:['photo','lookbook','portrait','campagne'],visit:{durationMinutes:120,baseCulture:'first_visit',revisitAdds:['shoot','mission','collaboration']}},
  {id:'nimes-atelier-broderie',name:'Atelier de broderie — Nîmes',city:'Nîmes',category:'artisan+mode',ecosystem:'nimes',real:false,fictionalized:true,tags:['broderie','soutache','perle','fil métal'],visit:{durationMinutes:90,baseCulture:'first_visit',revisitAdds:['sample','collaboration','rush_order']}},
  {id:'nimes-hotel-test',name:'Hôtel des Arènes',city:'Nîmes',category:'hotel+travel',ecosystem:'nimes',real:false,fictionalized:true,tags:['hôtel','chambre','voyage','repos','chez-moi temporaire'],visit:{durationMinutes:15,baseCulture:'first_visit',revisitAdds:['invitation','client','event']}},
  {id:'nimes-showroom-test',name:'Showroom Maison Mistral',city:'Nîmes',category:'showroom+prestige',ecosystem:'nimes',real:false,fictionalized:true,tags:['showroom','acheteur','presse','invitation','prestige'],visit:{durationMinutes:90,baseCulture:'first_visit',revisitAdds:['buyer','press','invitation','mission']}}
 ].forEach(addPlace);
 [
  {id:'gard-maud-archivist',name:'Maud Cazeneuve',home:'Nîmes',role:'archiviste municipale',ageBand:'40s',personality:['méthodique','discrète','passionnée par les détails'],style:['chemises impeccables','marine','broches anciennes'],relationshipArc:['chercheuse distante','source fiable','accès à des dossiers thématiques','complice de recherche'],missionHooks:['retrouver une photographie de vêtement','reconstituer un détail textile à partir d’archives','préparer une tenue pour une conférence patrimoniale']},
  {id:'gard-noe-stylist',name:'Noé Carrière',home:'Nîmes',role:'assistant styliste / futur rival amical',ageBand:'20s',personality:['ambitieux','rapide','bon œil','compétitif sans être cruel'],style:['tailoring souple','noir','accessoires argent'],relationshipArc:['rencontre','émulation','rivalité créative','collaboration ou distance selon choix'],missionHooks:['challenge de silhouette locale','éditorial commun','concours régional']},
  {id:'gard-lila-mercerie',name:'Lila Moreno',home:'Nîmes',role:'mercière',ageBand:'50s',personality:['chaleureuse','mémoire incroyable','négociatrice'],style:['chemisiers imprimés','tablier sombre','boucles dorées'],relationshipArc:['commerçante','bonne adresse','commandes réservées','source de pièces rares'],missionHooks:['retrouver un galon discontinué','composer une gamme de boutons','commande urgente pour une cliente']},
  {id:'gard-yannis-cafe',name:'Yannis Roux',home:'Nîmes',role:'gérant de café culturel',ageBand:'30s',personality:['sociable','observateur','connaît tout le monde'],style:['workwear clair','chemise ouverte','montre vintage'],relationshipArc:['connaissance','informateur local','connecteur de réseau','ami'],missionHooks:['tenue pour soirée culturelle','présenter une cliente','organiser un mini pop-up']},
  {id:'gard-eloise-client',name:'Éloïse Martin',home:'Nîmes',role:'avocate / cliente locale',ageBand:'30s',personality:['très précise','élégante','pressée'],style:['tailleur','tons crème','bijoux fins'],relationshipArc:['cliente exigeante','cliente régulière','recommandations haut de gamme'],missionHooks:['tailleur audience','robe dîner professionnel','tenue cérémonie civile']},
  {id:'gard-basile-costume',name:'Basile Rey',home:'Nîmes',role:'régisseur costume / spectacle',ageBand:'40s',personality:['pragmatique','créatif sous pression','loyal'],style:['noir utilitaire','poches','baskets'],relationshipArc:['contact technique','commanditaire','réseau scène','accès coulisses'],missionHooks:['retouche costume scène','pièce résistante pour spectacle','urgence de dernière minute']}
 ].forEach(addChar);
 p.nimesLocalSystems={
  archives:{researchTopics:['textile nîmois','photographies anciennes','plans de façades','costume taurin','publicité locale','commerces disparus'],rareUnlocks:['patron reconstitué','motif oublié','adresse d’un ancien atelier'],cooldownDays:45},
  commerce:{rotationDays:14,priceVariation:true,specialOrders:true,relationshipDiscounts:true},
  social:{meetingSpots:['Café des Croquis','Les Halles de Nîmes','Carré d’Art','Esplanade'],chanceByVisit:.35},
  longCareer:{afterYears:{2:['clients par recommandation','petites collaborations'],5:['archives privées','commandes de scène'],10:['mentorat local','expositions rétrospectives'],20:['transmission atelier','anciens clients devenus prescripteurs']}}
 };
 window.dispatchEvent(new CustomEvent('hc-nimes-local-life-ready',{detail:p.nimesLocalSystems}));
 return true;
});
})();