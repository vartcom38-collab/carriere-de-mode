/* Haute Couture Live — Haute-Loire dense universe V1 */
(function(){
'use strict';
if(window.__HCHauteLoireDenseUniverseV1)return;window.__HCHauteLoireDenseUniverseV1=true;
const ctx=window.HCTerritoryContext,bridge=window.HCLocalMap,p=ctx?.getPresence?.();if(!ctx||!bridge||String(p?.departmentCode||'')!=='43')return;
const U={
'Le Puy-en-Velay':[
{id:'hl43-puy-conservatoire',name:'Dentelle du Puy · apprentissage & création contemporaine',cat:'fabric',lat:45.0436,lng:3.8844,text:'Fuseaux, mise en carte, finition, montage et création contemporaine.',materials:['lin','coton','soie','fil métallique'],motifs:['entrelacs','réseaux','bordures'],palette:['écru','noir','or doux']},
{id:'hl43-puy-crozatier',name:'Crozatier · archives, échantillons & modernité',cat:'culture',lat:45.0387,lng:3.8872,text:'Recherche visuelle autour des collections dentellières, dessins et échantillons.',materials:['dentelle','papier','fils'],motifs:['cartons','répétitions'],palette:['ivoire','sépia','grenat']}
],
'Retournac':[
{id:'hl43-retournac-manufacture',name:'Retournac · manufacture & mémoire dentellière',cat:'fabric',lat:45.205,lng:4.034,text:'Dentelle aux fuseaux, dentelle mécanique, dessins industriels et mémoire du travail.',materials:['dentelle','fils','cartons'],motifs:['dessins techniques','réseaux'],palette:['écru','bleu passé','gris machine']}
],
'Brioude':[{id:'hl43-brioude-craft',name:'Brioude · métiers d’art & collaborations',cat:'craft',lat:45.294,lng:3.384,text:'Croisements entre vêtement, bijou, objet, couleur et exposition.',materials:['dentelle','métal fin','lin'],motifs:['ornement','surface'],palette:['ivoire','bleu profond','or doux']}],
'La Chaise-Dieu':[{id:'hl43-chaise-scene',name:'La Chaise-Dieu · scène, loges & patrimoine',cat:'culture',lat:45.321,lng:3.696,text:'Costume sobre, habillage, retouches de scène et photographie dans un contexte musical.',materials:['velours','crêpe','laine fine'],motifs:['rythme','voûtes'],palette:['noir scène','pierre','or']}],
'Blesle':[{id:'hl43-blesle-memory',name:'Blesle · mémoire vestimentaire & village',cat:'heritage',lat:45.318,lng:3.17,text:'Coiffes, bordures, silhouettes rurales et architecture comme références, sans reproduction littérale.',materials:['lin','dentelle','laine'],motifs:['bordure','coiffe','pierre'],palette:['écru','terre','noir']}],
'Yssingeaux':[{id:'hl43-yssingeaux-daily',name:'Yssingeaux · clientèle & quotidien',cat:'markets',lat:45.143,lng:4.124,text:'Marché, retouche, petite commande, bouche-à-oreille et fidélité locale.',materials:['laine','lin','coton'],motifs:['trame','quotidien'],palette:['écru','vert','brique']}],
'Monistrol-sur-Loire':[{id:'hl43-monistrol-network',name:'Monistrol · réseau, mobilité & jeune création',cat:'culture',lat:45.292,lng:4.172,text:'Clientèle active, déplacement vers Saint-Étienne, ateliers légers et réseau professionnel.',materials:['maille','denim','tissus techniques'],motifs:['flux','liaisons'],palette:['bleu','gris','ivoire']}],
'Langeac':[{id:'hl43-langeac-rural',name:'Langeac · matière rurale & réparation',cat:'craft',lat:45.101,lng:3.494,text:'Laine, lin, cuir, réparation et petites séries adaptées à une économie locale.',materials:['laine','lin','cuir'],motifs:['rivière','trame','relief'],palette:['vert sombre','écru','brun']}]};
(U[String(p?.city||'')]||[]).forEach(x=>bridge.addMarker({dept:'43',departmentName:'Haute-Loire',city:String(p.city),where:String(p.city)+' · Haute-Loire',fictional:false,...x,unlock:'DESIGN_REFERENCE · BOOK_RESEARCH · réseau local.'}));
window.HCHauteLoireDenseUniverse={version:1,universes:U};
})();