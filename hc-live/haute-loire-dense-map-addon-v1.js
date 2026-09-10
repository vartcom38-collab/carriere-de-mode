/* Haute Couture Live — Haute-Loire dense map addon V1 */
(function(){
'use strict';if(window.__HCHauteLoireDenseMapAddonV1)return;window.__HCHauteLoireDenseMapAddonV1=true;
const ctx=window.HCTerritoryContext,bridge=window.HCLocalMap,p=ctx?.getPresence?.();if(!ctx||!bridge||String(p?.departmentCode||'')!=='43')return;
[
{id:'hl43-map-puy',city:'Le Puy-en-Velay',name:'Le Puy · dentelle, costume & création',cat:'fabric',lat:45.0439,lng:3.885,text:'Pôle majeur de dentelle aux fuseaux, formation, archives et création contemporaine.',materials:['lin','coton','soie'],motifs:['entrelacs','réseaux'],palette:['écru','noir','rouge profond']},
{id:'hl43-map-retournac',city:'Retournac',name:'Retournac · manufacture de dentelles',cat:'heritage',lat:45.204,lng:4.034,text:'Mémoire industrielle, dentelle mécanique, dessins et transmission.',materials:['dentelle','fils'],motifs:['dessins techniques','réseaux'],palette:['écru','bleu passé','gris']},
{id:'hl43-map-brioude',city:'Brioude',name:'Brioude · métiers d’art',cat:'craft',lat:45.2942,lng:3.3842,text:'Collaborations matière, objet, bijou, textile et exposition.',materials:['lin','métal fin'],motifs:['ornement'],palette:['ivoire','bleu','or doux']},
{id:'hl43-map-chaise',city:'La Chaise-Dieu',name:'La Chaise-Dieu · scène & costume',cat:'culture',lat:45.321,lng:3.696,text:'Musique, loges, costume, retouches et image.',materials:['velours','crêpe'],motifs:['rythme'],palette:['noir scène','pierre','or']},
{id:'hl43-map-yssingeaux',city:'Yssingeaux',name:'Yssingeaux · clientèle & marchés',cat:'markets',lat:45.143,lng:4.124,text:'Vie locale, commandes, retouches et réseau quotidien.',materials:['laine','lin'],motifs:['trame'],palette:['écru','vert','brique']},
{id:'hl43-map-monistrol',city:'Monistrol-sur-Loire',name:'Monistrol · mobilité & jeune réseau',cat:'culture',lat:45.292,lng:4.172,text:'Clientèle active et circulation professionnelle vers Saint-Étienne.',materials:['maille','denim'],motifs:['flux'],palette:['bleu','gris','ivoire']},
{id:'hl43-map-blesle',city:'Blesle',name:'Blesle · patrimoine vestimentaire',cat:'heritage',lat:45.318,lng:3.17,text:'Coiffes, bordures, architecture et mémoire rurale comme références.',materials:['lin','dentelle'],motifs:['coiffe','bordure'],palette:['écru','terre','noir']},
{id:'hl43-map-langeac',city:'Langeac',name:'Langeac · réparation & matière rurale',cat:'craft',lat:45.101,lng:3.494,text:'Laine, lin, cuir, réparation et petites séries.',materials:['laine','lin','cuir'],motifs:['rivière','relief'],palette:['vert sombre','écru','brun']}
].forEach(x=>bridge.addMarker({dept:'43',departmentName:'Haute-Loire',where:x.city+' · Haute-Loire',unlock:'Clientèle · Atelier · Book · découverte territoriale.',...x}));
})();