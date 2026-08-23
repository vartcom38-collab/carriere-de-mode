/* Haute Couture Live — matières: découverte permanente + variantes achetées, sans métrage. */
(function(){
  if(window.HCMaterials)return;
  const MATERIALS={
    coton:{id:'coton',name:'Coton',family:'naturel',desc:'Polyvalent, net et facile à vivre.',baseSale:1.00,discovery:'départ',colors:['ivoire','noir','bleu nuit','sauge','terracotta','rose poudré']},
    satin:{id:'satin',name:'Satin',family:'fluide',desc:'Lumineux, souple et habillé.',baseSale:1.18,discovery:'départ',colors:['ivoire','noir','bordeaux','bleu nuit','rose poudré','champagne']},
    velours:{id:'velours',name:'Velours',family:'riche',desc:'Profond, doux et spectaculaire.',baseSale:1.32,discovery:'mercerie / voyage',colors:['noir','bordeaux','vert bouteille','bleu nuit','prune','camel']},
    lin:{id:'lin',name:'Lin',family:'naturel',desc:'Texturé, frais et solaire.',baseSale:1.08,discovery:'sud / mercerie',colors:['naturel','blanc cassé','olive','bleu ciel','ocre','corail']},
    denim:{id:'denim',name:'Denim',family:'structuré',desc:'Solide, graphique et quotidien.',baseSale:1.12,discovery:'territoire textile',colors:['brut','indigo','noir','écru','gris pierre']},
    tweed:{id:'tweed',name:'Tweed',family:'structuré',desc:'Texturé, chic et construit.',baseSale:1.30,discovery:'voyage / fournisseur',colors:['écru','noir et blanc','rose chiné','vert forêt','marine']},
    dentelle:{id:'dentelle',name:'Dentelle',family:'détail',desc:'Délicate, graphique et précieuse.',baseSale:1.42,discovery:'adresse textile',colors:['ivoire','noir','rouge profond','bleu nuit','rose ancien']},
    tulle:{id:'tulle',name:'Tulle',family:'léger',desc:'Transparent, aérien et volumineux.',baseSale:1.20,discovery:'cours / cérémonie',colors:['ivoire','noir','nude','rose pâle','bleu brume']},
    laine:{id:'laine',name:'Laine',family:'chaud',desc:'Chaude, souple ou structurée selon le tissage.',baseSale:1.22,discovery:'voyage / saison',colors:['camel','anthracite','écru','marine','bordeaux','mousse']}
  };
  const COLOR_HEX={ivoire:'#f3ecdd',noir:'#232326','bleu nuit':'#273953',sauge:'#83967f',terracotta:'#b76f5f','rose poudré':'#d9aaa8',bordeaux:'#7d3140',champagne:'#d9c09c','vert bouteille':'#2f5647',prune:'#6b405b',camel:'#b78862',naturel:'#d7c3a5','blanc cassé':'#efe8dc',olive:'#70744c','bleu ciel':'#9fc6d5',ocre:'#c29446',corail:'#d98774',brut:'#34485d',indigo:'#3d4e72','écru':'#e7ddc7','gris pierre':'#88837c','noir et blanc':'#b9b6b2','rose chiné':'#c59899','vert forêt':'#405746',marine:'#2d3c54','rouge profond':'#8c2f36','rose ancien':'#b9848a',nude:'#d8b5a1','rose pâle':'#e6c3c6','bleu brume':'#b8cbd2',anthracite:'#4d4b4c',mousse:'#66735b'};
  const PATTERNS=['Uni','Rayures','Pois','Carreaux','Fleurs'];
  function ensure(){
    if(!window.HCGame)return null;
    let s=HCGame.get();
    if(!s.materials){HCGame.mutate(st=>{st.materials={discovered:{coton:{at:st.clock.iso,source:'Début de carrière'},satin:{at:st.clock.iso,source:'Début de carrière'}},ownedVariants:[],history:[]};});s=HCGame.get();}
    if(!s.materials.discovered)s.materials.discovered={};
    if(!Array.isArray(s.materials.ownedVariants))s.materials.ownedVariants=[];
    if(!Array.isArray(s.materials.history))s.materials.history=[];
    return s.materials;
  }
  function variantId(materialId,color,pattern='Uni'){return [materialId,color,pattern].join('|');}
  function discover(materialId,source='Découverte'){const m=MATERIALS[materialId];if(!m||!window.HCGame)return false;ensure();let changed=false;HCGame.mutate(st=>{st.materials=st.materials||{discovered:{},ownedVariants:[],history:[]};if(!st.materials.discovered[materialId]){st.materials.discovered[materialId]={at:st.clock.iso,source};st.materials.history.push({type:'discover',materialId,source,at:st.clock.iso});changed=true;}});return changed;}
  function isDiscovered(id){const x=ensure();return !!x?.discovered?.[id];}
  function discoveredList(){const x=ensure();return Object.keys(x?.discovered||{}).map(id=>({...MATERIALS[id],discoveryInfo:x.discovered[id]})).filter(Boolean);}
  function owned(){const x=ensure();return (x?.ownedVariants||[]).map(v=>({...v,material:MATERIALS[v.materialId]}));}
  function owns(materialId,color,pattern='Uni'){return owned().some(v=>v.id===variantId(materialId,color,pattern));}
  function priceFor(materialId,color,pattern='Uni'){const m=MATERIALS[materialId];if(!m)return 0;const colorIndex=Math.max(0,m.colors.indexOf(color));const pat=pattern==='Uni'?0:4;return Math.round(8+(m.baseSale*9)+colorIndex*1.2+pat);}
  function buy(materialId,color,pattern='Uni',source='Mercerie'){if(!window.HCGame||!isDiscovered(materialId))return {ok:false,reason:'undiscovered'};const id=variantId(materialId,color,pattern);if(owns(materialId,color,pattern))return {ok:true,already:true};const price=priceFor(materialId,color,pattern),s=HCGame.get();if(Number(s.player.money)<price)return {ok:false,reason:'money',price};HCGame.mutate(st=>{st.player.money-=price;st.transactions.unshift({id:'mat-'+Date.now(),amount:-price,label:`${MATERIALS[materialId].name} ${color} · ${pattern}`,category:'materials',at:st.clock.iso});st.materials.ownedVariants.push({id,materialId,color,pattern,buyPrice:price,source,boughtAt:st.clock.iso});st.materials.history.push({type:'buy',id,price,source,at:st.clock.iso});});return {ok:true,price,id};}
  function saleImpact(variant){const m=MATERIALS[variant?.materialId];if(!m)return 0;return Math.round((variant.buyPrice||priceFor(variant.materialId,variant.color,variant.pattern))*m.baseSale*1.55);}
  function swatchStyle(v){const c=COLOR_HEX[v.color]||'#ddd';if(v.pattern==='Rayures')return `repeating-linear-gradient(135deg,${c} 0 10px,rgba(255,255,255,.55) 10px 15px)`;if(v.pattern==='Pois')return `radial-gradient(circle at 25% 25%,rgba(255,255,255,.7) 0 3px,transparent 4px),${c}`;if(v.pattern==='Carreaux')return `linear-gradient(90deg,rgba(255,255,255,.35) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.35) 1px,transparent 1px),${c}`;if(v.pattern==='Fleurs')return `radial-gradient(circle at 25% 35%,rgba(255,255,255,.65) 0 4px,transparent 5px),radial-gradient(circle at 70% 70%,rgba(255,255,255,.5) 0 3px,transparent 4px),${c}`;return c;}
  window.HCMaterials={catalog:MATERIALS,colors:COLOR_HEX,patterns:PATTERNS,ensure,discover,isDiscovered,discoveredList,owned,owns,buy,priceFor,saleImpact,variantId,swatchStyle};
})();