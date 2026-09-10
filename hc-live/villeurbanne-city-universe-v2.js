/* Haute Couture Live — Villeurbanne ville-univers V2
   Ville autonome : scène, création contemporaine, vie quotidienne, jeunes réseaux, ateliers et mobilités métropolitaines.
   Révélation progressive selon présence, visites et saison.
*/
(function(){
'use strict';
if(window.__HCVilleurbanneCityUniverseV2)return;window.__HCVilleurbanneCityUniverseV2=true;
const ctx=window.HCTerritoryContext,bridge=window.HCLocalMap;if(!ctx||!bridge)return;
const p=ctx.getPresence?.();if(String(p?.departmentCode||'')!=='69'||String(p?.city||'')!=='Villeurbanne')return;
const MEM='haute-couture-city-universe-villeurbanne-v2';
const read=()=>{try{return JSON.parse(localStorage.getItem(MEM)||'null')||{visits:0,seen:{}}}catch(_){return{visits:0,seen:{}}}};
const game=()=>{try{return window.HCGame?.get?.()||{}}catch(_){return{}}};
const day=()=>Number(game()?.clock?.day)||1;
const season=()=>['hiver','printemps','été','automne'][Math.floor((((day()-1)%365)+365)%365/91.25)]||'hiver';
let m=read();m.visits=Math.max(1,Number(m.visits||0)+1);localStorage.setItem(MEM,JSON.stringify(m));
const base={dept:'69',departmentName:'Rhône',city:'Villeurbanne'};
const P=[
 {id:'vil-gratte-ciel',name:'Gratte-Ciel · centre urbain',cat:'heritage',lat:45.7669,lng:4.8795,where:'Gratte-Ciel · Villeurbanne',text:'Architecture, lignes verticales, symétrie et vie quotidienne donnent une base forte de silhouette urbaine.',materials:['gabardine','laine','toile'],motifs:['verticales','géométrie'],palette:['ivoire','gris','bleu'],unlock:'DESIGN_REFERENCE · clientèle urbaine.',min:1},
 {id:'vil-tnp',name:'TNP · scène & costume',cat:'culture',lat:45.7666,lng:4.8808,where:'Gratte-Ciel · Villeurbanne',text:'Spectacle vivant, équipes artistiques, habillage et publics réguliers peuvent nourrir réseau et missions scène.',materials:['velours','crêpe','matières scène'],motifs:['mouvement','lumière'],palette:['noir','rouge','or'],unlock:'BOOK_RESEARCH · missions scène.',min:1},
 {id:'vil-campus',name:'Campus & jeunes réseaux créatifs',cat:'culture',lat:45.7801,lng:4.8728,where:'La Doua · Villeurbanne',text:'Étudiants, recherche, jeunes projets, événements et collaborations créent une clientèle et des rencontres différentes de Lyon-centre.',materials:['maille','coton','matières expérimentales'],motifs:['modules','réseau'],palette:['variable'],unlock:'Jeunes clientes · collaborations · projets collectifs.',min:1},
 {id:'vil-charpennes',name:'Charpennes · mobilité & vie quotidienne',cat:'markets',lat:45.7706,lng:4.8634,where:'Charpennes · Villeurbanne',text:'Flux métro/tram, commerces de proximité, cafés et rendez-vous rapides : terrain de clientèle quotidienne et de rencontres répétées.',materials:['coton','maille','tailoring pratique'],motifs:['flux'],palette:['urbain'],unlock:'Clientèle quotidienne · réseau.',min:1},
 {id:'vil-cusset',name:'Cusset · quartier résidentiel',cat:'markets',lat:45.7578,lng:4.9022,where:'Cusset · Villeurbanne',text:'Vie résidentielle, familles, cérémonies, retouches et commandes récurrentes créent un autre rythme de carrière.',materials:['crêpe','laine','coton'],motifs:['quotidien'],palette:['variable'],unlock:'Clientèle locale · retouches · cérémonies.',min:2},
 {id:'vil-atelier-collectif',name:'Atelier du Passage · collectif fictif',cat:'people',lat:45.7685,lng:4.8855,where:'Villeurbanne',fictional:true,personId:'vil-p-atelier',text:'Un collectif fictif de jeunes créateurs partage machines, conseils et petites productions. Le lien s’ouvre seulement si Marion revient.',materials:['textiles divers','chutes'],motifs:['prototype'],palette:['variable'],unlock:'CRAFT_CONTACT · COLLAB_CAPABILITY.',min:2},
 {id:'vil-photo',name:'Studio des Gratte-Ciel · fictif',cat:'people',lat:45.7657,lng:4.8779,where:'Villeurbanne',fictional:true,personId:'vil-p-photo',text:'Studio photo fictif travaillant portraits, petites campagnes et spectacles locaux.',materials:['image'],motifs:['cadrage'],palette:['variable'],unlock:'Book · shooting · réseau.',min:2},
 {id:'vil-costume',name:'Habilleuse de tournée · rencontre fictive',cat:'people',lat:45.7662,lng:4.8815,where:'Villeurbanne',fictional:true,personId:'vil-p-costume',text:'Une habilleuse fictive peut devenir récurrente au fil des productions et recommander Marion plus tard.',materials:['costume','réparation'],motifs:['scène'],palette:['noir'],unlock:'Relation persistante · missions costume.',min:2},
 {id:'vil-seconde-main',name:'Circuit seconde main de quartier',cat:'vintage',lat:45.7727,lng:4.8835,where:'Villeurbanne',text:'Friperies, ressourceries, vide-dressings et ventes ponctuelles servent de sourcing et de matière narrative.',materials:['vintage','maille','cuir','coton'],motifs:['réemploi'],palette:['variable'],unlock:'Sourcing · upcycling · Book.',min:2},
 {id:'vil-cafe-reseau',name:'Café des Répétitions · fictif',cat:'people',lat:45.7689,lng:4.8822,where:'Gratte-Ciel · Villeurbanne',fictional:true,personId:'vil-p-cafe',text:'Café fictif où artistes, techniciens et habitants finissent par se reconnaître après plusieurs passages.',materials:[],motifs:['habitudes'],palette:['brun','crème'],unlock:'Rencontres libres · rumeurs · réseau.',min:3},
 {id:'vil-marche',name:'Marché & vie locale',cat:'markets',lat:45.7652,lng:4.8891,where:'Villeurbanne',text:'Marchés, habitants, annonces et besoins du quotidien donnent des commandes modestes mais persistantes.',materials:['coton','lin','laine'],motifs:['trame sociale'],palette:['variable'],unlock:'Clientes locales · petites missions.',min:3},
 {id:'vil-evenement-ete',name:'Saison culturelle d’été · famille évolutive',cat:'culture',lat:45.7681,lng:4.8811,where:'Villeurbanne',text:'Concerts, spectacles et événements de plein air changent chaque année et peuvent faire apparaître techniciens, artistes et besoins de tenue.',materials:['matières scène','coton'],motifs:['mouvement'],palette:['été'],unlock:'Agenda · scène · population temporaire.',min:2,seasons:['été']},
 {id:'vil-rentree',name:'Rentrée créative · famille évolutive',cat:'culture',lat:45.7793,lng:4.8713,where:'La Doua · Villeurbanne',text:'Rentrée étudiante et culturelle : nouveaux groupes, projets, appels, ateliers et jeunes clients changent d’une année à l’autre.',materials:['matières expérimentales'],motifs:['nouveaux réseaux'],palette:['automne'],unlock:'Rumeurs · collaborations · agenda.',min:3,seasons:['automne']},
 {id:'vil-secret-costume',name:'Carnet de contacts de tournée · secret fictif',cat:'people',lat:45.7672,lng:4.8828,where:'Villeurbanne',fictional:true,secret:true,personId:'vil-secret-tournee',text:'Un ancien carnet de contacts de tournée circule entre techniciens. Il n’est révélé qu’après une vraie relation.',materials:[],motifs:['réseau'],palette:[],unlock:'Secret · réseau scène.',min:5}
];
const visible=P.filter(x=>m.visits>=x.min&&(!x.seasons||x.seasons.includes(season()))&&!x.secret);
visible.forEach(x=>bridge.addMarker({...base,...x}));
window.HCVilleurbanneCityUniverseV2={version:2,visits:m.visits,season:season(),all:P,visible};
})();