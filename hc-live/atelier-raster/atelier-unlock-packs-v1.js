/* Haute Couture Live — Atelier unlock packs v1
   Groupes prêts à être reliés aux lieux, PNJ, événements et progression.
*/
(function(){
'use strict';
function boot(){
 const C=window.HCAtelierCatalog;if(!C||C.version<3){setTimeout(boot,60);return}
 if(window.HCAtelierUnlockPacks)return;
 const ids=q=>C.search(q).map(x=>x.id);
 const byTag=t=>C.findByTag(t).map(x=>x.id);
 const bySource=s=>C.discoverableFrom(s).map(x=>x.id);
 const U={
  starter:{label:'Base de départ',ids:[...(C.starterIds||[])]},
  mercerie:{label:'Mercerie — matières, ornements et fournitures',ids:bySource('mercerie')},
  artisan:{label:'Artisans — techniques et construction',ids:bySource('artisan')},
  archives:{label:'Archives — histoire, coupe et références',ids:bySource('archive')},
  museum:{label:'Musées — pièces historiques et techniques rares',ids:bySource('museum')},
  boutique:{label:'Boutiques — accessoires et prêt-à-porter',ids:bySource('boutique')},
  mentor:{label:'Mentors — savoir-faire avancé',ids:bySource('mentor')},
  travel:{label:'Voyages — régional et inspirations étrangères',ids:bySource('travel')},
  wedding:{label:'Mariage & cérémonie',ids:[...byTag('bridal'),...byTag('wedding'),...byTag('bridesmaid'),...byTag('baptism'),...byTag('communion')]},
  lingerie:{label:'Lingerie',ids:[...byTag('lingerie'),...byTag('corsetry')]},
  swim:{label:'Maillot',ids:byTag('swim')},
  tailoring:{label:'Tailoring & costume',ids:byTag('tailoring')},
  menswear:{label:'Homme',ids:byTag('menswear')},
  kids:{label:'Enfant & bébé',ids:[...byTag('kids'),...byTag('baby')]},
  cabaret:{label:'Cabaret',ids:byTag('cabaret')},
  stage:{label:'Scène & spectacle',ids:byTag('stage')},
  dance:{label:'Danse',ids:byTag('dance')},
  pageant:{label:'Miss & concours',ids:[...byTag('miss'),...byTag('pageant')]},
  cannes:{label:'Cannes & tapis rouge',ids:[...byTag('cannes'),...byTag('red-carpet')]},
  themePark:{label:'Parc à thème & personnage',ids:[...byTag('theme-park'),...byTag('character')]},
  historical:{label:'Historique',ids:byTag('historical')},
  regional:{label:'Régional',ids:byTag('regional')},
  avantGarde:{label:'Avant-garde',ids:[...byTag('concept'),...byTag('couture')]},
  sport:{label:'Sport',ids:byTag('sport')},
  nightwear:{label:'Nuit',ids:byTag('nightwear')},
  uniform:{label:'Uniformes',ids:byTag('uniform')},
  denim:{label:'Denim',ids:byTag('denim')},
  pleats:{label:'Plissés',ids:byTag('pleats')},
  embroidery:{label:'Broderie',ids:byTag('embroidery')}
 };
 for(const p of Object.values(U))p.ids=[...new Set(p.ids)].filter(id=>!!C.byId(id));
 const API={version:1,packs:U,get:id=>U[id]||null,all:()=>Object.entries(U).map(([id,v])=>({id,...v})),contains:(packId,itemId)=>U[packId]?.ids.includes(itemId)||false};
 window.HCAtelierUnlockPacks=API;
 window.dispatchEvent(new CustomEvent('hc-atelier-unlock-packs-ready',{detail:{version:1,count:Object.keys(U).length}}));
}
boot();
})();