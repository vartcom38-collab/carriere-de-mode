/* Haute Couture Live — Atelier production schema v1
   Rend le catalogue autonome: compatibilités, slots, règles de déblocage, prompt Magnific, contexte métier.
*/
(function(){
'use strict';
function boot(){
 const C=window.HCAtelierCatalog;if(!C){setTimeout(boot,60);return}
 if(C.productionSchemaVersion>=1)return;
 const SLOT_BY_CATEGORY={
  tops:['upper-body'],bottoms:['lower-body'],'dress-bases':['full-body'],sleeves:['sleeve'],necklines:['neckline'],collars:['collar'],backs:['back'],outerwear:['outer-layer'],lingerie:['foundation'],swimwear:['swim'],hosiery:['legs'],construction:['construction'],trains:['train'],capes:['cape'],headwear:['head'],details:['detail'],ornaments:['ornament'],pockets:['pocket'],closures:['closure'],belts:['waist-accessory'],shoes:['feet'],bags:['hand-accessory'],accessories:['accessory'],stage:['stage-module'],pageant:['pageant-module'],'red-carpet':['red-carpet-module'],ceremony:['ceremony-module'],bridal:['bridal-module'],'avant-garde':['concept-module'],menswear:['menswear'],kids:['kids'],baby:['baby'],nightwear:['nightwear'],sportswear:['sportswear'],dancewear:['dancewear'],uniforms:['uniform'],jewelry:['jewelry'],materials:['material'],patterns:['pattern']
 };
 const TECH_BY_TAG={corsetry:'corseterie',tailoring:'tailoring',bridal:'ceremonie',cabaret:'scene',stage:'scene',pageant:'concours',historical:'archives',knit:'maille',lingerie:'lingerie',swim:'maillot',denim:'denim',pleats:'plissage',drape:'drape',embroidery:'broderie',themePark:'costume-technique','theme-park':'costume-technique',dance:'danse',uniform:'uniforme'};
 const SOURCE_LABELS={starter:'Base de départ',practice:'Pratique',mercerie:'Mercerie',artisan:'Artisan',archive:'Archives',museum:'Musée',boutique:'Boutique',event:'Événement',mentor:'Mentor',travel:'Voyage',jeweler:'Bijoutier',artist:'Artiste'};
 const OCCASION_TAGS={bridal:['bride','wedding','bridesmaid'],ceremony:['baptism','communion','civil','wedding'],pageant:['miss','pageant'],cabaret:['cabaret','stage'],stage:['stage','dance','themePark'],redCarpet:['cannes','redCarpet','gala'],tailoring:['work','civil','gala'],lingerie:['photo','stage'],swim:['photo'],kids:['baptism','communion','wedding'],historical:['regional','stage'],uniform:['uniform']};
 const unique=a=>[...new Set((a||[]).filter(Boolean))];
 function inferTech(item){const arr=[];(item.tags||[]).forEach(t=>{if(TECH_BY_TAG[t])arr.push(TECH_BY_TAG[t])});return unique(arr.length?arr:['couture-generale'])}
 function inferOccasions(item){const out=['personal'];for(const t of item.tags||[]){for(const [tag,occs] of Object.entries(OCCASION_TAGS)){if(t===tag||String(t).includes(tag))out.push(...occs)}}return unique(out)}
 function inferUnlock(item){const sources=(item.sources||[]).map(s=>({type:s,label:SOURCE_LABELS[s]||s}));return {starter:!!C.starterIds?.has?.(item.id),tier:Number(item.tier||2),sources,requiresDiscovery:!C.starterIds?.has?.(item.id),repeatableDiscovery:false}}
 function inferCompatibility(item){
  const incompatible=[];
  if(item.category==='necklines')incompatible.push('other-neckline');
  if(item.category==='collars')incompatible.push('some-necklines');
  if(item.category==='sleeves')incompatible.push('other-sleeve-style');
  if(item.category==='backs')incompatible.push('other-back-style');
  return {slots:SLOT_BY_CATEGORY[item.category]||['misc'],requires:[],incompatible,allowMultiple:['details','ornaments','accessories','jewelry','pockets','closures'].includes(item.category)};
 }
 function promptFor(item){return `${item.name}; ${item.visualQuery||''}; professional fashion design construction reference; preserve garment logic; ${inferTech(item).join(', ')}`}
 C.items.forEach(item=>{
  item.production=item.production||{};
  item.production.compatibility=inferCompatibility(item);
  item.production.techniques=inferTech(item);
  item.production.occasions=inferOccasions(item);
  item.production.unlock=inferUnlock(item);
  item.production.promptToken=promptFor(item);
  item.production.visual={query:item.visualQuery||item.name,referenceRequired:true,status:item.referenceUrl?'ready':'needs-reference'};
  item.production.gameplay={canBeBriefRequirement:true,canBeReward:true,canBeDiscovered:true,canBeFavorite:true,canBeUsedInMagnific:true};
 });
 C.productionSchemaVersion=1;
 C.productionById=id=>C.byId(id)?.production||null;
 C.compatibleWith=(a,b)=>{const A=typeof a==='string'?C.byId(a):a,B=typeof b==='string'?C.byId(b):b;if(!A||!B)return false;const sa=A.production?.compatibility?.slots||[],sb=B.production?.compatibility?.slots||[];if(sa.some(x=>sb.includes(x))&&!A.production.compatibility.allowMultiple&&!B.production.compatibility.allowMultiple)return false;return true};
 C.promptTokens=ids=>(ids||[]).map(id=>C.byId(id)?.production?.promptToken).filter(Boolean);
 window.dispatchEvent(new CustomEvent('hc-atelier-production-schema-ready',{detail:{count:C.items.length,version:1}}));
 }
 boot();
})();