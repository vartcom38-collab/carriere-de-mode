import fs from 'node:fs';
import path from 'node:path';

const ROOT=process.cwd();
const HC=path.join(ROOT,'hc-live');
const CODES=new Set(['01','03','07','15','26','38','42','43','63','69','73','74']);
const SUPPORTED=new Set(['fabric','craft','culture','heritage','markets','vintage','nature','view','libraries','jewelry','people','cafe','shop','photo','transport','quarter','event']);
const KIND_TO_CAT={quartier:'quarter',transport:'transport',patrimoine:'heritage','vie locale':'markets',nature:'nature','événement':'event',creation:'craft','création':'craft'};
const MEDIA_KEYS=['image','photo','imageUrl'];
const SOURCE_KEYS=['source','imageSource','attribution'];
const ROOTS=[
 path.join(HC,'ville','index.html'),
 path.join(HC,'territory-context-v1.js'),
 path.join(HC,'territorial-signal-runtime-v1.js'),
 path.join(HC,'territory-context-savoie-addon-v1.js'),
 path.join(HC,'territory-context-haute-savoie-addon-v1.js')
];

function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{const p=path.join(dir,e.name);return e.isDirectory()?walk(p):[p]})}
function val(body,key){const rx=new RegExp(key+"\\s*:\\s*['\"]([^'\"]+)['\"]");const m=body.match(rx);return m?m[1]:null}
function bool(body,key){return new RegExp(key+'\\s*:\\s*true').test(body)}
function hasAny(body,keys){return keys.some(k=>new RegExp(k+'\\s*:').test(body))}
function normalizedCategory(body){const cat=val(body,'cat')||val(body,'category');if(cat)return cat;const kind=val(body,'kind');return kind?(KIND_TO_CAT[kind]||kind):null}
function looksDynamicId(id){return !id||id.endsWith('-')||/\$\{|\+\s*[a-zA-Z_$]/.test(id)}
function rel(p){return path.relative(ROOT,p).replaceAll('\\','/')}

/* Registre média central */
const MEDIA_REGISTRY=path.join(HC,'ville','territorial-place-media-aura-v1.js');
const mediaById=new Map();
let fictionalVisualContract=false;
if(fs.existsSync(MEDIA_REGISTRY)){
 const text=fs.readFileSync(MEDIA_REGISTRY,'utf8');
 const rx=/['"]([^'"]+)['"]\s*:\s*\{([^{}]*?(?:commons\([^)]*\)|image\s*:[^,}]+)[^{}]*?)\}/g;
 for(const m of text.matchAll(rx)){
   const body=m[2],hasImage=/\bimage\s*:/.test(body),hasSource=/\bsource\s*:/.test(body);
   if(hasImage||hasSource)mediaById.set(m[1],{hasImage,hasSource});
 }
 fictionalVisualContract=/ILLUSTRATION DE JEU/.test(text)&&/decorateFictional/.test(text)&&/gameIllustration/.test(text);
}

/* Détermine la surface réellement atteignable depuis les loaders actifs. */
const active=new Set();
const queue=ROOTS.filter(fs.existsSync);
function resolveRef(from,raw){
 const clean=raw.split('?')[0].split('#')[0];
 if(!clean.endsWith('.js'))return null;
 let p;
 if(clean.startsWith('/'))p=path.join(ROOT,clean.replace(/^\/+/,''));
 else p=path.resolve(path.dirname(from),clean);
 return p.startsWith(ROOT)&&fs.existsSync(p)?p:null;
}
while(queue.length){
 const file=queue.shift();if(active.has(file)||!fs.existsSync(file))continue;active.add(file);
 const text=fs.readFileSync(file,'utf8');
 const refs=[...text.matchAll(/['"]([^'"\n]+\.js(?:\?[^'"\n]*)?)['"]/g)].map(m=>m[1]);
 for(const raw of refs){const p=resolveRef(file,raw);if(p&&!active.has(p))queue.push(p)}
}
/* Certains loaders sont chargés indirectement via création de script et chemins stockés : on garde explicitement les racines territoriales. */
for(const f of walk(HC).filter(f=>/territorial-map-registry-v2\.js$/.test(f)||/territory-place-(?:interface|media)-.*\.js$/.test(f)))active.add(f);

function scan(files){
 const markers=[];
 for(const file of files){
   if(!file.endsWith('.js')||!fs.existsSync(file))continue;
   const text=fs.readFileSync(file,'utf8');
   const rx=/\{id\s*:\s*['"]([^'"]+)['"][\s\S]{0,2600}?\}/g;
   for(const m of text.matchAll(rx)){
     const body=m[0],id=m[1];if(looksDynamicId(id))continue;
     if(!/\bname\s*:/.test(body)||!(/\blat\s*:/.test(body)&&/\blng\s*:/.test(body)))continue;
     const dept=val(body,'dept')||val(body,'departmentCode');if(dept&&!CODES.has(String(dept)))continue;
     const reg=mediaById.get(id)||{};
     const marker={id,dept:dept||null,city:val(body,'city'),name:val(body,'name'),cat:normalizedCategory(body),kind:val(body,'kind'),fictional:bool(body,'fictional'),documentaryContext:bool(body,'documentaryContext'),hasImage:hasAny(body,MEDIA_KEYS)||!!reg.hasImage,hasSource:hasAny(body,SOURCE_KEYS)||!!reg.hasSource,hasText:/\b(text|description)\s*:/.test(body),hasUnlock:/\bunlock\s*:/.test(body),file:rel(file),mediaRegistry:mediaById.has(id)};
     if(!markers.some(x=>x.id===marker.id&&x.file===marker.file))markers.push(marker);
   }
 }
 return markers;
}

const historicalFiles=walk(HC).filter(f=>f.endsWith('.js'));
const historical=scan(historicalFiles);
const markers=scan([...active]);
const byId=new Map();for(const m of markers){const a=byId.get(m.id)||[];a.push(m);byId.set(m.id,a)}
const duplicates=[...byId.entries()].filter(([,a])=>a.length>1).map(([id,a])=>({id,count:a.length,files:[...new Set(a.map(x=>x.file))]}));
const real=markers.filter(x=>!x.fictional),fictional=markers.filter(x=>x.fictional);
const missingRealMedia=real.filter(x=>!x.hasImage||!x.hasSource);
const fictionalMissingVisual=fictionalVisualContract?[]:fictional.filter(x=>!x.hasImage);
const unsupported=markers.filter(x=>x.cat&&!SUPPORTED.has(x.cat));
const noCategory=markers.filter(x=>!x.cat);
const noText=markers.filter(x=>!x.hasText);
const noUnlock=markers.filter(x=>!x.hasUnlock);
const byDept={};for(const code of CODES){const d=markers.filter(x=>String(x.dept||'')===code),r=d.filter(x=>!x.fictional),f=d.filter(x=>x.fictional);byDept[code]={definitions:d.length,real:r.length,fictional:f.length,realValidatedMedia:r.filter(x=>x.hasImage&&x.hasSource).length,realMissingMedia:r.filter(x=>!x.hasImage||!x.hasSource).length,fictionalVisualCoverage:fictionalVisualContract?f.length:f.filter(x=>x.hasImage).length,missingText:d.filter(x=>!x.hasText).length,missingUnlock:d.filter(x=>!x.hasUnlock).length}}
const out={summary:{historicalDefinitions:historical.length,activeFiles:active.size,activeDefinitions:markers.length,realDefinitions:real.length,fictionalDefinitions:fictional.length,mediaRegistryEntries:mediaById.size,realWithImageAndSource:real.filter(x=>x.hasImage&&x.hasSource).length,realMissingValidatedMedia:missingRealMedia.length,fictionalVisualContract,fictionalWithVisual:fictionalVisualContract?fictional.length:fictional.filter(x=>x.hasImage).length,fictionalMissingVisual:fictionalMissingVisual.length,unsupportedCategories:unsupported.length,noCategory:noCategory.length,noText:noText.length,noUnlock:noUnlock.length,duplicateIds:duplicates.length,supportedInterfaceCategories:[...SUPPORTED]},byDepartment:byDept,activeFiles:[...active].map(rel).sort(),markers,duplicates,realMissingValidatedMedia:missingRealMedia,fictionalMissingVisual,unsupported,noCategory,noText,noUnlock};
fs.writeFileSync(path.join(HC,'qa','territories-ui-media-audit-report.json'),JSON.stringify(out,null,2));
console.log('=== AURA · audit interfaces & médias · SURFACE ACTIVE ===');
for(const [k,v] of Object.entries(out.summary))console.log(`${k}:`,Array.isArray(v)?v.join(', '):v);
console.log('\n--- PAR DÉPARTEMENT ---');for(const [code,d] of Object.entries(byDept))console.log(`${code}: réel ${d.realValidatedMedia}/${d.real} média validé · fictif ${d.fictionalVisualCoverage}/${d.fictional} visuel · texte manquant ${d.missingText} · effet manquant ${d.missingUnlock}`);
if(missingRealMedia.length){console.log('\n--- LIEUX RÉELS ACTIFS SANS IMAGE + SOURCE VALIDÉES ---');for(const m of missingRealMedia)console.log(`${m.dept||'?'} | ${m.city||'?'} | ${m.id} | ${m.name||'?'} | ${m.file}`)}
if(unsupported.length||noCategory.length){console.error('\nINTERFACE CONTRACT FAILURE: catégorie non couverte ou absente.');process.exit(2)}
if(process.env.AURA_MEDIA_STRICT==='1'&&(missingRealMedia.length||fictionalMissingVisual.length||noText.length||noUnlock.length)){console.error(`\nSTRICT FAILURE: médias réels=${missingRealMedia.length}, visuels fictifs=${fictionalMissingVisual.length}, textes=${noText.length}, effets=${noUnlock.length}.`);process.exit(3)}
console.log('\nAudit actif terminé. Le mode strict valide uniquement la surface réellement atteignable.');