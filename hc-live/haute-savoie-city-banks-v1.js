/* Haute Couture Live — banques villes Haute-Savoie V1 */
(function(){'use strict';if(window.__HCHauteSavoieCityBanksV1)return;window.__HCHauteSavoieCityBanksV1=true;const ctx=window.HCTerritoryContext,p=ctx?.getPresence?.();if(String(p?.departmentCode||'')!=='74')return;const city=String(p.city||'');const C={
'Annecy':['lac & élégance','design urbain','cérémonie','éditorial'],
'Chamonix-Mont-Blanc':['alpinisme','performance','expédition','luxe sportif'],
'Le Grand-Bornand':['laine','soie','tissage','alpage'],
'Châtel':['station-village','frontière','après-ski','capsule hiver'],
'Megève':['luxe alpin','hôtellerie','soirée','ski chic'],
'Évian-les-Bains':['thermalisme','lac','palaces','villégiature'],
'Thonon-les-Bains':['Léman','artisanat','patrimoine','clientèle locale'],
'Morzine':['glisse','culture','sportswear','réparation'],
'Avoriaz':['architecture','snowboard','image futuriste','performance'],
'La Clusaz':['Aravis','ski','artisanat','maille']};const themes=C[city];if(!themes)return;const ci=Object.keys(C).indexOf(city),people=[],briefs=[],secrets=[],events=[];for(let i=0;i<(ci<5?36:32);i++)people.push({id:`hs-bank-p-${ci}-${i}`,city,name:`Contact ${city} ${i+1}`,role:['artisan','cliente','photographe','acheteur','costumier','styliste'][i%6],fictional:true});for(let i=0;i<(ci<5?62:54);i++)briefs.push({id:`hs-bank-b-${ci}-${i}`,city,title:`${themes[i%themes.length]} · brief ${i+1}`,systems:['Atelier','Book',i%3?'Agenda':'shooting'],needs:1+(i%4),fictional:true});for(let i=0;i<(ci<5?18:16);i++)secrets.push({id:`hs-bank-s-${ci}-${i}`,city,title:`Piste discrète ${themes[i%themes.length]} ${i+1}`,needs:2+(i%4),hidden:true,fictional:true});for(let i=0;i<(ci<5?11:9);i++)events.push({id:`hs-bank-e-${ci}-${i}`,city,label:`Saison ${themes[i%themes.length]}`,months:i%2?[1,2,3,7,8,12]:[4,5,6,9,10,11],themes,fictional:true});const bank={version:1,departmentCode:'74',city,people,briefs,secrets,eventFamilies:events};window.HCCityContentBank=bank;window.dispatchEvent(new CustomEvent('hc-city-bank-ready',{detail:bank}));})();