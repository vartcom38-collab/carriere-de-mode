/* Haute Couture Live — Rhône dense map addon V1 */
(function(){
'use strict';
if(window.__HCRhoneDenseMapAddonV1)return;window.__HCRhoneDenseMapAddonV1=true;
const ctx=window.HCTerritoryContext,bridge=window.HCLocalMap;if(!ctx||!bridge||String(ctx.getPresence?.()?.departmentCode||'')!=='69')return;
[
{id:'rh-map-amplepuis',dept:'69',departmentName:'Rhône',city:'Amplepuis',name:'Amplepuis · machine à coudre & construction',cat:'heritage',lat:45.972,lng:4.331,where:'Amplepuis · Rhône',text:'Technique de couture, assemblage, mécanique, réparation et transmission.',materials:['fil','toile'],motifs:['point','assemblage'],palette:['acier','écru'],unlock:'BOOK_RESEARCH · TECHNIQUE_OBSERVED.'},
{id:'rh-map-thizy',dept:'69',departmentName:'Rhône',city:'Thizy-les-Bourgs',name:'Thizy-les-Bourgs · manufacture & textile',cat:'fabric',lat:46.033,lng:4.313,where:'Thizy-les-Bourgs · Rhône',text:'Mémoire de production textile, tissage, teinturerie et patrimoine industriel.',materials:['molleton','fils','tissus'],motifs:['trame','répétition'],palette:['brique','écru','indigo'],unlock:'MATERIAL_KNOWLEDGE · BOOK_RESEARCH.'},
{id:'rh-map-oullins',dept:'69',departmentName:'Rhône',city:'Oullins-Pierre-Bénite',name:'Oullins-Pierre-Bénite · atelier de proximité',cat:'craft',lat:45.714,lng:4.807,where:'Oullins-Pierre-Bénite',text:'Retouche, petite série, clientèle de proximité et circulation métropolitaine.',materials:['gabardine','jersey'],motifs:['pratique'],palette:['marine','gris'],unlock:'CRAFT_CONTACT · CLIENTELE.',fictional:true},
{id:'rh-map-givors',dept:'69',departmentName:'Rhône',city:'Givors',name:'Givors · industrie & fonction',cat:'heritage',lat:45.584,lng:4.769,where:'Givors · Rhône',text:'Vêtement robuste, fonction, réparation et paysage industriel.',materials:['sergé','toile'],motifs:['structure'],palette:['acier','bleu travail'],unlock:'DESIGN_REFERENCE · workwear.',fictional:true}
].forEach(p=>bridge.addMarker(p));
})();