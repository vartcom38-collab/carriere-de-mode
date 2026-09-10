import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const ROOT=process.cwd();
const HC=path.join(ROOT,'hc-live');
const failures=[];
const notes=[];

function walk(dir){
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(ent=>{
    const p=path.join(dir,ent.name);
    return ent.isDirectory()?walk(p):[p];
  });
}

const all=walk(HC);
const js=all.filter(f=>f.endsWith('.js'));
const rel=f=>path.relative(ROOT,f).replaceAll('\\','/');

for(const file of js){
  try{execFileSync(process.execPath,['--check',file],{stdio:'pipe'});}
  catch(err){failures.push(`SYNTAX ${rel(file)}\n${String(err.stderr||err.message)}`)}
}
notes.push(`Syntaxe vérifiée sur ${js.length} fichiers JS sous hc-live/.`);

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
    let target;
    if(source.endsWith('index.html')) target=path.resolve(path.dirname(source),ref);
    else target=path.resolve(path.dirname(source),ref);
    if(!fs.existsSync(target))failures.push(`MISSING REF ${rel(source)} -> ${ref}`);
  }
}
notes.push(`Références JS locales vérifiées dans ${loaderFiles.map(rel).join(', ')}.`);

const forbidden=[
  /name:\s*`Contact \$\{city\}/,
  /name:\s*['\"]Contact [^'\"]+ \d+['\"]/,
  /Soline Arpin/
];
for(const file of js){
  const text=fs.readFileSync(file,'utf8');
  for(const rx of forbidden){if(rx.test(text))failures.push(`PLACEHOLDER ${rel(file)} matches ${rx}`)}
}
notes.push('Recherche des placeholders historiques ciblés effectuée.');

const runtime=fs.readFileSync(path.join(HC,'territorial-signal-runtime-v1.js'),'utf8');
for(const code of ['01','03','07','15','26','38','42','43','63','69','73','74']){
  if(!runtime.includes(`'${code}'`))failures.push(`RUNTIME CODE ABSENT ${code}`);
}
notes.push('Présence des 12 codes départementaux dans le pont territorial vérifiée.');

const context=fs.readFileSync(path.join(HC,'territory-context-v1.js'),'utf8');
if(!/focus/i.test(context)&&!/map/i.test(context))notes.push('INFO: règle focus carte à confirmer par QA navigateur.');

console.log('=== Haute Couture Live · territoires smoke test ===');
for(const n of notes)console.log('✓',n);
if(failures.length){
  console.error(`\n${failures.length} échec(s):`);
  for(const f of failures)console.error('\n✗',f);
  process.exit(1);
}
console.log('\n✓ SMOKE TEST STATIQUE PASSÉ');
