/* Haute Couture Live — références visuelles Atelier v1.
   Références réelles pour identifier les composants; les rendus finaux restent générés dans le flow Atelier.
*/
(function(){
'use strict';
if(window.HCAtelierVisualReferences)return;
const fileUrl=f=>'https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(f);
const pageUrl=f=>'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(f);
const R=(id,file,note)=>({id,image:fileUrl(file),source:pageUrl(file),provider:'Wikimedia Commons',note});
const refs={
 'top-corset':R('top-corset','Corset (2024-03-15) 01.jpg','Structure de corset réelle.'),
 'top-bustier':R('top-bustier','Bodice.jpg','Référence de corsage structuré.'),
 'sleeve-balloon':R('sleeve-balloon','Evening dress MET DT7445.jpg','Volume de manche bouffante.'),
 'sleeve-gigot':R('sleeve-gigot','Woman’s Ball Gown LACMA M.2007.211.734 (1 of 6).jpg','Volume historique de manche.'),
 'skirt-plissee':R('skirt-plissee','Pleatedskirt.jpg','Référence de jupe plissée.'),
 'detail-pleat':R('detail-pleat','Box pleats 1.jpg','Détail de construction de plis.'),
 'jacket-tuxedo':R('jacket-tuxedo','Casaco- Smoking, Acervo do Museu Paulista da USP (1).jpg','Construction réelle de veste smoking.'),
 'collar-lapel':R('collar-lapel','Solapa esmoquin.JPG','Détail de revers smoking.'),
 'shoe-pump':R('shoe-pump','A pair of high-heeled shoes.jpg','Référence d’escarpins.'),
 'shoe-stiletto':R('shoe-stiletto','Black heels 2.jpg','Référence de talon haut fin.'),
 'bridal-bodice-corset':R('bridal-bodice-corset','1934 wedding dress by Charles James for Baba Beaton.jpg','Référence historique de robe de mariée.'),
 'redcarpet-cape':R('redcarpet-cape','Cannes 2016 20.jpg','Référence d’allure événementielle.'),
 'pants-tailleur':R('pants-tailleur','Tuxedo details.jpg','Référence de détails tailoring.')
};
const galleries={
 tops:'https://commons.wikimedia.org/wiki/Category:Bodices',
 sleeves:'https://commons.wikimedia.org/wiki/Category:Sleeves',
 necklines:'https://commons.wikimedia.org/wiki/Category:Necklines',
 collars:'https://commons.wikimedia.org/wiki/Category:Collars_(clothing)',
 bottoms:'https://commons.wikimedia.org/wiki/Category:Skirts',
 'dress-bases':'https://commons.wikimedia.org/wiki/Category:Dresses',
 outerwear:'https://commons.wikimedia.org/wiki/Category:Jackets',
 construction:'https://commons.wikimedia.org/wiki/Category:Clothing_construction',
 trains:'https://commons.wikimedia.org/wiki/Category:Wedding_dresses',
 capes:'https://commons.wikimedia.org/wiki/Category:Capes_(clothing)',
 headwear:'https://commons.wikimedia.org/wiki/Category:Headgear',
 details:'https://commons.wikimedia.org/wiki/Category:Clothing_details',
 ornaments:'https://commons.wikimedia.org/wiki/Category:Trimmings',
 shoes:'https://commons.wikimedia.org/wiki/Category:Shoes',
 bags:'https://commons.wikimedia.org/wiki/Category:Handbags',
 stage:'https://commons.wikimedia.org/wiki/Category:Stage_costumes',
 pageant:'https://commons.wikimedia.org/wiki/Category:Beauty_pageants',
 'red-carpet':'https://commons.wikimedia.org/wiki/Category:Red_carpet',
 ceremony:'https://commons.wikimedia.org/wiki/Category:Formal_wear',
 bridal:'https://commons.wikimedia.org/wiki/Category:Wedding_dresses'
};
window.HCAtelierVisualReferences={version:1,refs,galleries,forItem:id=>refs[id]||null,forCategory:c=>galleries[c]||null,enrich:item=>({...item,visualReference:refs[item.id]||null,visualGallery:galleries[item.category]||null})};
})();