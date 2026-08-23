(function(){
  if(window.HCAtelierAssets)return;
  const base='./assets/v1/';
  window.HCAtelierAssets={
    canvas:{width:700,height:1000},
    silhouette:base+'silhouette-front.svg',
    categories:['TOUS','HAUTS','MANCHES','BAS','ROBES','DÉTAILS'],
    parts:[
      {id:'top-drape',cat:'HAUTS',slot:'haut',name:'Top drapé',src:base+'top-drape.svg',minutes:35,meters:1.2},
      {id:'top-corset',cat:'HAUTS',slot:'haut',name:'Corset cœur',src:base+'top-corset.svg',minutes:45,meters:0.9},
      {id:'top-shirt',cat:'HAUTS',slot:'haut',name:'Chemise fluide',src:base+'top-shirt.svg',minutes:40,meters:1.4},
      {id:'sleeves-puff',cat:'MANCHES',slot:'manches',name:'Manches ballon',src:base+'sleeves-puff.svg',minutes:25,meters:0.8},
      {id:'sleeves-long',cat:'MANCHES',slot:'manches',name:'Manches longues',src:base+'sleeves-long.svg',minutes:30,meters:1.0},
      {id:'skirt-drape',cat:'BAS',slot:'bas',name:'Jupe drapée',src:base+'skirt-drape.svg',minutes:50,meters:1.8},
      {id:'pants-tailored',cat:'BAS',slot:'bas',name:'Pantalon tailleur',src:base+'pants-tailored.svg',minutes:65,meters:2.0},
      {id:'dress-asym',cat:'ROBES',slot:'robe',name:'Robe asymétrique',src:base+'dress-asym.svg',minutes:95,meters:3.2},
      {id:'dress-column',cat:'ROBES',slot:'robe',name:'Robe colonne',src:base+'dress-column.svg',minutes:85,meters:2.8},
      {id:'detail-belt-ring',cat:'DÉTAILS',slot:'detail',name:'Ceinture anneau',src:base+'detail-belt-ring.svg',minutes:20,meters:0.2}
    ]
  };
})();
