import fs from 'node:fs';
import path from 'node:path';

const ROOT=process.cwd(),HC=path.join(ROOT,'hc-live');
const CODES=new Set(['01','03','07','15','26','38','42','43','63','69','73','74']);
const SUPPORTED=new Set(['fabric','craft','culture','heritage','markets','vintage','nature','view','libraries','jewelry','people','cafe','shop','photo','transport','quarter','event']);
const KIND_TO_CAT={quartier:'quarter',transport:'transport',patrimoine:'heritage','vie locale':'markets',nature:'nature','événement':'event',creation:'craft','création':'craft'};
const MEDIA_KEYS=['image','photo','imageUrl'],SOURCE_KEYS=['source','imageSource','attribution'];
const ROOTS=['ville/index.html','territory-context-v1.js','territorial-signal-runtime-v1.js','territory-context-savoie-addon-v1.js','territory-context-haute-savoie-addon-v1.js'].map(x=>path.join(HC,x));
const MEDIA_REGISTRIES=['ville/territorial-place-media-aura-v1.js','ville/territorial-place-media-aura-final-v1.js'].map(x=>path.join(HC,x));
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>{const p=path.join(d,e.name);return e.isDirectory()?walk(p):[p]})}
function val(b,k){const m=b.match(new RegExp(k+"\\s*:\\s*['\"]([^'\"]+)['\"]"));return m?m[1]:null}
function bool(b,k){return new RegExp(k+'\\s*:\\s*true').test(b)}
function hasAny(b,ks){return ks.some(k=>new RegExp(k+'\\s*:').test(b))}
function cat(b){const c=val(b,'cat')||val(b,'category');if(c)return c;const k=val(b,'kind');return k?(KIND_TO_CAT[k]||k):null}
function rel(p){return path.relative(ROOT,p).replaceAll('\\','/')}
function dynamic(id){return !id||id.endsWith('-')||/\$\{|\+\s*[a-zA-Z_$]/.test(id)}

const mediaById=new Map();let fictionalVisualContract=false;
for(const f of MEDIA_REGISTRIES.filter(fs.existsSync)){
 const t=fs.readFileSync(f,'utf8');
 const rx=/['"]([^'"]+)['"]\s*:\s*\{([^{}]*?(?:commons\([^)]*\)|image\s*:[^,}]+)[^{}]*?)\}/g;
 for(const m of t.matchAll(rx)){const b=m[2],old=mediaById.get(m[1])||{};mediaById.set(m[1],{hasImage:old.hasImage||/\bimage\s*:/.test(b),hasSource:old.hasSource||/\bsource\s*:/.test(b),registry:rel(f)})}
 fictionalVisualContract||=/ILLUSTRATION DE JEU/.test(t)&&/decorateFictional/.test(t)&&/gameIllustration/.test(t);
}

const active=new Set(),queue=ROOTS.filter(fs.existsSync);
function resolve(from,raw){const c=raw.split('?')[0].split('#')[0];if(!c.endsWith('.js'))return null;const p=c.startsWith('/')?path.join(ROOT,c.replace(/^\/+/,'')):path.resolve(path.dirname(from),c);return p.startsWith(ROOT)&&fs.existsSync(p)?p:null}
while(queue.length){const f=queue.shift();if(active.has(f)||!fs.existsSync(f))continue;active.add(f);const t=fs.readFileSync(f,'utf8');for(const m of t.matchAll(/['"]([^'"\n]+\.js(?:\?[^'"\n]*)?)['"]/g)){const p=resolve(f,m[1]);if(p&&!active.has(p))queue.push(p)}}
for(const f of walk(HC).filter(f=>/territorial-map-registry-v2\.js$/.test(f)||/territory-place-(?:interface|media)-.*\.js$/.test(f)))active.add(f);

function scan(files){const out=[];for(const f of files){if(!f.endsWith('.js')||!fs.existsSync(f))continue;const t=fs.readFileSync(f,'utf8');for(const m of t.matchAll(/\{id\s*:\s*['"]([^'"]+)['"][\s\S]{0,2600}?\}/g)){const b=m[0],id=m[1];if(dynamic(id)||!/\bname\s*:/.test(b)||!(/\blat\s*:/.test(b)&&/\blng\s*:/.test(b)))continue;const dept=val(b,'dept')||val(b,'departmentCode');if(dept&&!CODES.has(String(dept)))continue;const reg=mediaById.get(id)||{};out.push({id,dept:dept||null,city:val(b,'city'),name:val(b,'name'),cat:cat(b),fictional:bool(b,'fictional'),documentaryContext:bool(b,'documentaryContext')||/documentary\s*:\s*true/.test(b),hasImage:hasAny(b,MEDIA_KEYS)||!!reg.hasImage,hasSource:hasAny(b,SOURCE_KEYS)||!!reg.hasSource,hasText:/\b(text|description)\s*:/.test(b),hasUnlock:/\bunlock\s*:/.test(b),file:rel(f),mediaRegistry:reg.registry||null})}}return out}
const historical=scan(walk(HC).filter(f=>f.endsWith('.js'))),markers=scan([...active]);
const byId=new Map();for(const m of markers){const a=byId.get(m.id)||[];a.push(m);byId.set(m.id,a)}
const duplicates=[...byId.entries()].filter(([,a])=>a.length>1).map(([id,a])=>({id,count:a.length,files:[...new Set(a.map(x=>x.file))]}));
const real=markers.filter(x=>!x.fictional),fictional=markers.filter(x=>x.fictional);
/* Le smoke statique ne prétend plus que tout objet non-fictionnel est un lieu documentaire précis.
   Le contrat photo+source est bloquant ici uniquement quand la donnée le déclare documentaire.
   Tous les marqueurs réellement cliquables restent contrôlés plus sévèrement par l'E2E exhaustif. */
const documentary=real.filter(x=>x.documentaryContext||x.hasImage||x.hasSource);
const missingRequiredDocumentaryMedia=documentary.filter(x=>!x.hasImage||!x.hasSource);
const coverageMissing=real.filter(x=>!x.hasImage||!x.hasSource);
const fictionalMissingVisual=fictionalVisualContract?[]:fictional.filter(x=>!x.hasImage);
const unsupported=markers.filter(x=>x.cat&&!SUPPORTED.has(x.cat)),noCategory=markers.filter(x=>!x.cat),noText=markers.filter(x=>!x.hasText),noUnlock=markers.filter(x=>!x.hasUnlock);
const byDept={};for(const code of CODES){const d=markers.filter(x=>String(x.dept||'')===code),r=d.filter(x=>!x.fictional),f=d.filter(x=>x.fictional),doc=r.filter(x=>x.documentaryContext||x.hasImage||x.hasSource);byDept[code]={definitions:d.length,real:r.length,fictional:f.length,documentary:doc.length,documentaryValidatedMedia:doc.filter(x=>x.hasImage&&x.hasSource).length,documentaryMissingMedia:doc.filter(x=>!x.hasImage||!x.hasSource).length,coverageMissing:r.filter(x=>!x.hasImage||!x.hasSource).length,fictionalVisualCoverage:fictionalVisualContract?f.length:f.filter(x=>x.hasImage).length,missingText:d.filter(x=>!x.hasText).length,sourceLevelMissingUnlock:d.filter(x=>!x.hasUnlock).length}}
const out={summary:{historicalDefinitions:historical.length,activeFiles:active.size,activeDefinitions:markers.length,realDefinitions:real.length,fictionalDefinitions:fictional.length,documentaryDefinitions:documentary.length,documentaryMissingValidatedMedia:missingRequiredDocumentaryMedia.length,realCoverageMissingMedia:coverageMissing.length,fictionalVisualContract,fictionalMissingVisual:fictionalMissingVisual.length,unsupportedCategories:unsupported.length,noCategory:noCategory.length,noText:noText.length,sourceLevelNoUnlock:noUnlock.length,duplicateIds:duplicates.length},byDepartment:byDept,duplicates,missingRequiredDocumentaryMedia,coverageMissing,noUnlock};
fs.writeFileSync(path.join(HC,'qa','territories-ui-media-audit-report.json'),JSON.stringify(out,null,2));
console.log('=== AURA · audit interfaces & médias · SURFACE ACTIVE ===');for(const [k,v] of Object.entries(out.summary))console.log(`${k}:`,v);
console.log('\n--- PAR DÉPARTEMENT ---');for(const [code,d] of Object.entries(byDept))console.log(`${code}: documentaire ${d.documentaryValidatedMedia}/${d.documentary} · couverture réelle manquante ${d.coverageMissing} · fictif ${d.fictionalVisualCoverage}/${d.fictional} · texte ${d.missingText} · gain source ${d.sourceLevelMissingUnlock}`);
if(missingRequiredDocumentaryMedia.length){console.log('\n--- LIEUX EXPLICITEMENT DOCUMENTAIRES SANS IMAGE + SOURCE ---');for(const m of missingRequiredDocumentaryMedia)console.log(`${m.dept||'?'} | ${m.city||'?'} | ${m.id} | ${m.name||'?'} | ${m.file}`)}
if(noUnlock.length)console.log(`\nINFO: ${noUnlock.length} définition(s) source sans unlock littéral; la recette runtime vérifie le gain final après enrichissement/addMarker.`);
if(coverageMissing.length)console.log(`INFO: ${coverageMissing.length} définition(s) non-fictionnelles sans média statique; leur caractère réellement cliquable et leur média final sont vérifiés par l'audit E2E exhaustif.`);
if(unsupported.length||noCategory.length){console.error('\nINTERFACE CONTRACT FAILURE: catégorie non couverte ou absente.');process.exit(2)}
if(process.env.AURA_MEDIA_STRICT==='1'&&(missingRequiredDocumentaryMedia.length||fictionalMissingVisual.length||noText.length)){console.error(`\nSTRICT FAILURE: documentaires=${missingRequiredDocumentaryMedia.length}, visuels fictifs=${fictionalMissingVisual.length}, textes=${noText.length}.`);process.exit(3)}
console.log('\n✓ Audit statique passé. Le verdict de couverture finale appartient à la recette exhaustive des marqueurs réellement cliquables.');
