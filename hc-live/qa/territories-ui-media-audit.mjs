import fs from 'node:fs';
import path from 'node:path';

const ROOT=process.cwd();
const HC=path.join(ROOT,'hc-live');
const CODES=new Set(['01','03','07','15','26','38','42','43','63','69','73','74']);
const SUPPORTED=new Set(['fabric','craft','culture','heritage','markets','vintage','nature','view','libraries','jewelry','people','cafe','shop','photo','transport','quarter','event']);
const KIND_TO_CAT={quartier:'quarter',transport:'transport',patrimoine:'heritage','vie locale':'markets',nature:'nature','événement':'event',creation:'craft','création':'craft'};
const MEDIA_KEYS=['image','photo','imageUrl'];
const SOURCE_KEYS=['source','imageSource','attribution'];
const out={markers:[],summary:{}};

function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{const p=path.join(dir,e.name);return e.isDirectory()?walk(p):[p]})}
function val(body,key){const rx=new RegExp(key+"\\s*:\\s*['\"]([^'\"]+)['\"]");const m=body.match(rx);return m?m[1]:null}
function bool(body,key){return new RegExp(key+'\\s*:\\s*true').test(body)}
function hasAny(body,keys){return keys.some(k=>new RegExp(k+'\\s*:').test(body))}
function normalizedCategory(body){const cat=val(body,'cat')||val(body,'category');if(cat)return cat;const kind=val(body,'kind');return kind?(KIND_TO_CAT[kind]||kind):null}

/* Registre média central : une même photo peut couvrir plusieurs définitions représentant exactement le même lieu. */
const MEDIA_REGISTRY=path.join(HC,'ville','territorial-place-media-aura-v1.js');
const mediaById=new Map();
if(fs.existsSync(MEDIA_REGISTRY)){
 const text=fs.readFileSync(MEDIA_REGISTRY,'utf8');
 const rx=/['"]([^'"]+)['"]\s*:\s*\{([^{}]*?(?:commons\([^)]*\)|image\s*:[^,}]+)[^{}]*?)\}/g;
 for(const m of text.matchAll(rx)){
   const body=m[2];
   const hasImage=/\bimage\s*:/.test(body);
   const hasSource=/\bsource\s*:/.test(body);
   if(hasImage||hasSource)mediaById.set(m[1],{hasImage,hasSource});
 }
}

const files=walk(HC).filter(f=>f.endsWith('.js'));
for(const file of files){
 const text=fs.readFileSync(file,'utf8');
 const rx=/\{id\s*:\s*['"]([^'"]+)['"][\s\S]{0,2600}?\}/g;
 for(const m of text.matchAll(rx)){
   const body=m[0];
   if(!/\bname\s*:/.test(body)||!(/\blat\s*:/.test(body)&&/\blng\s*:/.test(body)))continue;
   const dept=val(body,'dept')||val(body,'departmentCode');
   if(dept&&!CODES.has(String(dept)))continue;
   const reg=mediaById.get(m[1])||{};
   const marker={
     id:m[1],dept:dept||null,city:val(body,'city'),name:val(body,'name'),cat:normalizedCategory(body),kind:val(body,'kind'),
     fictional:bool(body,'fictional'),hasImage:hasAny(body,MEDIA_KEYS)||!!reg.hasImage,hasSource:hasAny(body,SOURCE_KEYS)||!!reg.hasSource,
     hasText:/\b(text|description)\s*:/.test(body),hasUnlock:/\bunlock\s*:/.test(body),file:path.relative(ROOT,file).replaceAll('\\','/'),mediaRegistry:mediaById.has(m[1])
   };
   if(!out.markers.some(x=>x.id===marker.id&&x.file===marker.file))out.markers.push(marker);
 }
}

const byId=new Map();for(const m of out.markers){const a=byId.get(m.id)||[];a.push(m);byId.set(m.id,a)}
const duplicates=[...byId.entries()].filter(([,a])=>a.length>1).map(([id,a])=>({id,count:a.length,files:[...new Set(a.map(x=>x.file))]}));
const real=out.markers.filter(x=>!x.fictional),fictional=out.markers.filter(x=>x.fictional);
const missingRealMedia=real.filter(x=>!x.hasImage||!x.hasSource);
const unsupported=out.markers.filter(x=>x.cat&&!SUPPORTED.has(x.cat));
const noCategory=out.markers.filter(x=>!x.cat);
const noText=out.markers.filter(x=>!x.hasText);
const noUnlock=out.markers.filter(x=>!x.hasUnlock);
out.summary={
 totalDefinitions:out.markers.length,realDefinitions:real.length,fictionalDefinitions:fictional.length,
 mediaRegistryEntries:mediaById.size,
 realWithImageAndSource:real.filter(x=>x.hasImage&&x.hasSource).length,
 realMissingValidatedMedia:missingRealMedia.length,fictionalWithImage:fictional.filter(x=>x.hasImage).length,
 unsupportedCategories:unsupported.length,noCategory:noCategory.length,noText:noText.length,noUnlock:noUnlock.length,
 duplicateIds:duplicates.length,supportedInterfaceCategories:[...SUPPORTED]
};
out.duplicates=duplicates;out.realMissingValidatedMedia=missingRealMedia;out.unsupported=unsupported;out.noCategory=noCategory;out.noText=noText;out.noUnlock=noUnlock;
fs.writeFileSync(path.join(HC,'qa','territories-ui-media-audit-report.json'),JSON.stringify(out,null,2));
console.log('=== AURA · audit interfaces & médias ===');
for(const [k,v] of Object.entries(out.summary))console.log(`${k}:`,Array.isArray(v)?v.join(', '):v);
if(missingRealMedia.length){console.log('\n--- DÉFINITIONS RÉELLES SANS IMAGE + SOURCE VALIDÉES ---');for(const m of missingRealMedia)console.log(`${m.dept||'?'} | ${m.city||'?'} | ${m.id} | ${m.name||'?'} | ${m.file}`)}
if(unsupported.length||noCategory.length){console.error('\nINTERFACE CONTRACT FAILURE: catégorie non couverte ou absente.');for(const m of [...unsupported,...noCategory])console.error(`${m.id} | cat=${m.cat||'ABSENTE'} | ${m.file}`);process.exit(2)}
if(process.env.AURA_MEDIA_STRICT==='1'&&missingRealMedia.length){console.error(`\nMEDIA STRICT FAILURE: ${missingRealMedia.length} définition(s) réelle(s) sans image + source.`);process.exit(3)}
console.log('\nAudit terminé. Mode normal = contrat UI. AURA_MEDIA_STRICT=1 = validation média régionale.');