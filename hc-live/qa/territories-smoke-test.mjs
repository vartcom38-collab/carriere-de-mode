import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const ROOT=process.cwd();
const HC=path.join(ROOT,'hc-live');
const failures=[];
const warnings=[];
const notes=[];

function walk(dir){
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(ent=>{
    const p=path.join(dir,ent.name);
    return ent.isDirectory()?walk(p):[p];
  });
}
const rel=f=>path.relative(ROOT,f).replaceAll('\\','/');
const all=walk(HC);
const js=all.filter(f=>f.endsWith('.js'));
const territoryPrefixes=['ain-','allier-','ardeche-','cantal-','drome-','isere-','loire-','haute-loire-','puy-de-dome-','rhone-','savoie-','haute-savoie-'];
const territoryJs=js.filter(file=>{
  const name=path.basename(file);
  return territoryPrefixes.some(p=>name.startsWith(p)) || /territor|city-content-(selector|runtime)|local-interaction-bridge/.test(name);
});

for(const file of territoryJs){
  try{execFileSync(process.execPath,['--check',file],{stdio:'pipe'});}
  catch(err){failures.push(`SYNTAX ${rel(file)}\n${String(err.stderr||err.message)}`)}
}
notes.push(`Syntaxe vérifiée sur ${territoryJs.length} fichiers JS territoriaux.`);

const requiredEngines=[
  'ain-territorial-gameplay-v1.js','allier-territorial-gameplay-v1.js','ardeche-territorial-gameplay-v1.js',
  'cantal-territorial-gameplay-v1.js','drome-territorial-gameplay-v1.js','isere-territorial-gameplay-v1.js',
  'loire-territorial-gameplay-v1.js','haute-loire-territorial-gameplay-v1.js','puy-de-dome-territorial-gameplay-v1.js',
  'rhone-territorial-gameplay-v1.js','savoie-territorial-gameplay-v1.js','haute-savoie-territorial-gameplay-v1.js'
];
for(const name of requiredEngines){if(!fs.existsSync(path.join(HC,name)))failures.push(`MISSING ENGINE hc-live/${name}`)}
notes.push('Présence des 12 moteurs départementaux vérifiée.');

const loaderFiles=[
  path.join(HC,'territorial-signal-runtime-v1.js'),
  path.join(HC,'territory-context-savoie-addon-v1.js'),
  path.join(HC,'territory-context-haute-savoie-addon-v1.js'),
  path.join(HC,'ville/index.html')
].filter(fs.existsSync);
const scriptRefRe=/['\"]([^'\"]+\.js)(?:\?[^'\"]*)?['\"]/g;
for(const source of loaderFiles){
  const text=fs.readFileSync(source,'utf8');
  for(const m of text.matchAll(scriptRefRe)){
    const ref=m[1];
    if(/^https?:/.test(ref)||ref.includes('${')||ref.startsWith('data:'))continue;
    const target=path.resolve(path.dirname(source),ref);
    if(!fs.existsSync(target))failures.push(`MISSING REF ${rel(source)} -> ${ref}`);
  }
}
notes.push(`Références JS locales vérifiées dans ${loaderFiles.map(rel).join(', ')}.`);

// Recherche globale en warning : certaines banques territoriales ont un nom de fichier générique
// (ex. Bourg/Oyonnax, Romans/Valence) et ne doivent pas échapper au contrôle de contenu.
const placeholderRx=/name:\s*`Contact \$\{city\}|name:\s*['\"]Contact [^'\"]+ \d+['\"]|Soline Arpin/;
for(const file of js){
  const text=fs.readFileSync(file,'utf8');
  if(placeholderRx.test(text))warnings.push(`PLACEHOLDER ${rel(file)}`);
}
notes.push(`Recherche globale placeholders : ${warnings.length} fichier(s) encore signalé(s), sans bloquer la syntaxe/runtime.`);

const runtime=fs.readFileSync(path.join(HC,'territorial-signal-runtime-v1.js'),'utf8');
for(const code of ['01','03','07','15','26','38','42','43','63','69','73','74']){
  if(!runtime.includes(`'${code}'`))failures.push(`RUNTIME CODE ABSENT ${code}`);
}
notes.push('Présence des 12 codes départementaux dans le pont territorial vérifiée.');

const savoieLoader=fs.readFileSync(path.join(HC,'territory-context-savoie-addon-v1.js'),'utf8');
for(const name of ['savoie-primary-cities-universe-v1.js','savoie-primary-cities-banks-v1.js','savoie-high-resorts-universe-v1.js','savoie-high-resorts-banks-v1.js']){
  if(!savoieLoader.includes(name))failures.push(`SAVOIE LOADER REF ABSENTE ${name}`);
}
if(!/HCLocalMap/.test(savoieLoader))failures.push('SAVOIE LOADER sans attente HCLocalMap');
const hsLoader=fs.readFileSync(path.join(HC,'territory-context-haute-savoie-addon-v1.js'),'utf8');
if(!/HCLocalMap/.test(hsLoader))failures.push('HAUTE-SAVOIE LOADER sans attente HCLocalMap');
notes.push('Garde-fous loaders 73/74 vérifiés.');

console.log('=== Haute Couture Live · territoires smoke test ===');
for(const n of notes)console.log('✓',n);
for(const w of warnings)console.warn('⚠',w);
if(failures.length){
  console.error(`\n${failures.length} échec(s):`);
  for(const f of failures)console.error('\n✗',f);
  process.exit(1);
}
console.log('\n✓ SMOKE TEST TERRITORIAL PASSÉ');
