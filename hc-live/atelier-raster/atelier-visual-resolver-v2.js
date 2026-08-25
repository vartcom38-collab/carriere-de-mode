/* Haute Couture Live — Atelier visual resolver v2
   Résout automatiquement une vraie référence Wikimedia Commons pour chaque brique Atelier.
   Les images servent de référence visuelle/identification, jamais de rendu final de création.
*/
(function(){
'use strict';
if(window.HCAtelierVisualResolver)return;
const CACHE_KEY='haute-couture-atelier-visual-cache-v2';
const read=()=>{try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'{}')||{}}catch(e){return {}}};
const write=v=>{try{localStorage.setItem(CACHE_KEY,JSON.stringify(v))}catch(e){}};
const escQuery=s=>String(s||'').replace(/[\[\]{}<>]/g,' ').trim();
const categoryHints={
 tops:'fashion bodice top garment',bottoms:'fashion skirt trousers garment','dress-bases':'fashion dress garment',sleeves:'fashion sleeve garment detail',necklines:'fashion neckline garment detail',collars:'fashion collar garment detail',backs:'fashion dress back garment',outerwear:'fashion jacket coat garment',lingerie:'lingerie garment fashion',swimwear:'swimwear garment fashion',hosiery:'stockings tights hosiery',construction:'garment construction sewing detail',trains:'wedding dress train garment',capes:'fashion cape garment',headwear:'fashion headwear veil',details:'garment sewing detail fashion',ornaments:'fashion trimming embellishment textile',pockets:'garment pocket detail',closures:'garment closure zipper button',belts:'fashion belt garment',shoes:'fashion footwear shoes',bags:'fashion handbag',accessories:'fashion accessory garment',stage:'stage costume garment',pageant:'pageant gown costume','red-carpet':'evening gown red carpet fashion',ceremony:'formal wear ceremony garment',bridal:'wedding dress bridal garment','avant-garde':'avant garde fashion garment',menswear:'menswear tailoring garment',kids:'children clothing garment',baby:'baby ceremonial clothing',nightwear:'nightwear garment',sport:'sportswear garment',dance:'dance costume garment',uniform:'uniform clothing garment',jewelry:'fashion jewelry accessory',historical:'historical costume garment',regional:'traditional regional costume garment',materials:'textile fabric swatch',patterns:'textile pattern fabric'
};
function buildQuery(item){
 const base=[item?.name,item?.visualQuery,categoryHints[item?.category],...(item?.tags||[])].filter(Boolean).join(' ');
 return escQuery(base).slice(0,240);
}
function commonsUrl(query){
 const p=new URLSearchParams({action:'query',format:'json',origin:'*',generator:'search',gsrnamespace:'6',gsrlimit:'8',gsrsearch:query,prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'640'});
 return 'https://commons.wikimedia.org/w/api.php?'+p.toString();
}
function score(page,item){
 const title=String(page?.title||'').toLowerCase();const tags=(item?.tags||[]).map(x=>String(x).toLowerCase());let s=0;
 const name=String(item?.name||'').toLowerCase().replace(/base |manche |jupe |pantalon |robe |col |encolure |dos |chaussures? |veste |manteau /g,'').trim();
 if(name&&title.includes(name))s+=12;
 for(const t of tags)if(t.length>3&&title.includes(t))s+=2;
 if(/diagram|pattern|logo|icon|map|flag|coat of arms|poster|advert/i.test(title))s-=8;
 const info=page?.imageinfo?.[0]||{};const mime=String(info?.mime||'');if(mime.includes('jpeg')||mime.includes('png')||mime.includes('webp'))s+=2;
 return s;
}
function normalize(page,item,query){
 const ii=page?.imageinfo?.[0]||{};const m=ii.extmetadata||{};const val=k=>m[k]?.value||'';
 return {itemId:item.id,provider:'Wikimedia Commons',query,title:page.title||'',image:ii.thumburl||ii.url||'',fullImage:ii.url||'',source:ii.descriptionurl||'',license:val('LicenseShortName')||val('UsageTerms')||'',licenseUrl:val('LicenseUrl')||'',artist:val('Artist')||'',credit:val('Credit')||'',description:val('ImageDescription')||'',resolvedAt:new Date().toISOString(),automatic:true};
}
async function resolve(item,{force=false}={}){
 if(!item?.id)return null;
 const exact=window.HCAtelierVisualReferences?.forItem?.(item.id);if(exact?.image&&!force)return {...exact,itemId:item.id,automatic:false};
 const cache=read();if(cache[item.id]&&!force)return cache[item.id];
 const query=buildQuery(item);if(!query)return null;
 try{
  const r=await fetch(commonsUrl(query));if(!r.ok)throw new Error('commons_'+r.status);const j=await r.json();
  const pages=Object.values(j?.query?.pages||{}).filter(p=>p?.imageinfo?.[0]?.url);
  pages.sort((a,b)=>score(b,item)-score(a,item));const picked=pages[0];if(!picked)return null;
  const ref=normalize(picked,item,query);cache[item.id]=ref;write(cache);window.dispatchEvent(new CustomEvent('hc-atelier-visual-resolved',{detail:ref}));return ref;
 }catch(e){return null}
}
async function prewarm(ids,limit=8){
 const C=window.HCAtelierCatalog;if(!C)return [];
 const todo=(ids||[]).map(id=>C.byId(id)).filter(Boolean).slice(0,Math.max(1,limit));const out=[];
 for(const item of todo){const r=await resolve(item);if(r)out.push(r)}return out;
}
function cached(id){return read()[id]||null}
function clear(id){const c=read();if(id)delete c[id];else Object.keys(c).forEach(k=>delete c[k]);write(c)}
window.HCAtelierVisualResolver={version:2,resolve,prewarm,cached,clear,buildQuery,cacheKey:CACHE_KEY};
window.dispatchEvent(new CustomEvent('hc-atelier-visual-resolver-ready',{detail:{version:2}}));
})();