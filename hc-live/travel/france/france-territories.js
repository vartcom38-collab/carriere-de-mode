/* Haute Couture Live — France territorial registry
   Source de référence structurelle : Code officiel géographique INSEE 2026.
   18 régions administratives, 101 départements. Cette couche ne contient pas encore
   les communes : chaque département chargera son propre fichier de contenu. */
(function(){
'use strict';
const regions=[
 {code:'84',slug:'auvergne-rhone-alpes',name:'Auvergne-Rhône-Alpes',kind:'metropole',departments:[['01','Ain'],['03','Allier'],['07','Ardèche'],['15','Cantal'],['26','Drôme'],['38','Isère'],['42','Loire'],['43','Haute-Loire'],['63','Puy-de-Dôme'],['69','Rhône'],['73','Savoie'],['74','Haute-Savoie']]},
 {code:'27',slug:'bourgogne-franche-comte',name:'Bourgogne-Franche-Comté',kind:'metropole',departments:[['21','Côte-d’Or'],['25','Doubs'],['39','Jura'],['58','Nièvre'],['70','Haute-Saône'],['71','Saône-et-Loire'],['89','Yonne'],['90','Territoire de Belfort']]},
 {code:'53',slug:'bretagne',name:'Bretagne',kind:'metropole',departments:[['22','Côtes-d’Armor'],['29','Finistère'],['35','Ille-et-Vilaine'],['56','Morbihan']]},
 {code:'24',slug:'centre-val-de-loire',name:'Centre-Val de Loire',kind:'metropole',departments:[['18','Cher'],['28','Eure-et-Loir'],['36','Indre'],['37','Indre-et-Loire'],['41','Loir-et-Cher'],['45','Loiret']]},
 {code:'94',slug:'corse',name:'Corse',kind:'metropole',departments:[['2A','Corse-du-Sud'],['2B','Haute-Corse']]},
 {code:'44',slug:'grand-est',name:'Grand Est',kind:'metropole',departments:[['08','Ardennes'],['10','Aube'],['51','Marne'],['52','Haute-Marne'],['54','Meurthe-et-Moselle'],['55','Meuse'],['57','Moselle'],['67','Bas-Rhin'],['68','Haut-Rhin'],['88','Vosges']]},
 {code:'32',slug:'hauts-de-france',name:'Hauts-de-France',kind:'metropole',departments:[['02','Aisne'],['59','Nord'],['60','Oise'],['62','Pas-de-Calais'],['80','Somme']]},
 {code:'11',slug:'ile-de-france',name:'Île-de-France',kind:'metropole',departments:[['75','Paris'],['77','Seine-et-Marne'],['78','Yvelines'],['91','Essonne'],['92','Hauts-de-Seine'],['93','Seine-Saint-Denis'],['94','Val-de-Marne'],['95','Val-d’Oise']]},
 {code:'28',slug:'normandie',name:'Normandie',kind:'metropole',departments:[['14','Calvados'],['27','Eure'],['50','Manche'],['61','Orne'],['76','Seine-Maritime']]},
 {code:'75',slug:'nouvelle-aquitaine',name:'Nouvelle-Aquitaine',kind:'metropole',departments:[['16','Charente'],['17','Charente-Maritime'],['19','Corrèze'],['23','Creuse'],['24','Dordogne'],['33','Gironde'],['40','Landes'],['47','Lot-et-Garonne'],['64','Pyrénées-Atlantiques'],['79','Deux-Sèvres'],['86','Vienne'],['87','Haute-Vienne']]},
 {code:'76',slug:'occitanie',name:'Occitanie',kind:'metropole',departments:[['09','Ariège'],['11','Aude'],['12','Aveyron'],['30','Gard'],['31','Haute-Garonne'],['32','Gers'],['34','Hérault'],['46','Lot'],['48','Lozère'],['65','Hautes-Pyrénées'],['66','Pyrénées-Orientales'],['81','Tarn'],['82','Tarn-et-Garonne']]},
 {code:'52',slug:'pays-de-la-loire',name:'Pays de la Loire',kind:'metropole',departments:[['44','Loire-Atlantique'],['49','Maine-et-Loire'],['53','Mayenne'],['72','Sarthe'],['85','Vendée']]},
 {code:'93',slug:'provence-alpes-cote-d-azur',name:'Provence-Alpes-Côte d’Azur',kind:'metropole',departments:[['04','Alpes-de-Haute-Provence'],['05','Hautes-Alpes'],['06','Alpes-Maritimes'],['13','Bouches-du-Rhône'],['83','Var'],['84','Vaucluse']]},
 {code:'01',slug:'guadeloupe',name:'Guadeloupe',kind:'outre-mer',departments:[['971','Guadeloupe']]},
 {code:'03',slug:'guyane',name:'Guyane',kind:'outre-mer',departments:[['973','Guyane']]},
 {code:'02',slug:'martinique',name:'Martinique',kind:'outre-mer',departments:[['972','Martinique']]},
 {code:'04',slug:'la-reunion',name:'La Réunion',kind:'outre-mer',departments:[['974','La Réunion']]},
 {code:'06',slug:'mayotte',name:'Mayotte',kind:'outre-mer',departments:[['976','Mayotte']]}
].map(r=>({...r,departments:r.departments.map(([code,name])=>({code,name,slug:name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),contentFile:`./departments/${code}.js`}))}));
const byRegionCode=Object.fromEntries(regions.map(r=>[r.code,r]));
const byRegionSlug=Object.fromEntries(regions.map(r=>[r.slug,r]));
const departments=regions.flatMap(r=>r.departments.map(d=>({...d,regionCode:r.code,regionSlug:r.slug,regionName:r.name})));
const byDepartmentCode=Object.fromEntries(departments.map(d=>[d.code,d]));
const byDepartmentSlug=Object.fromEntries(departments.map(d=>[d.slug,d]));
window.HCFranceTerritories={version:1,source:'INSEE COG 2026',regions,departments,byRegionCode,byRegionSlug,byDepartmentCode,byDepartmentSlug};
})();