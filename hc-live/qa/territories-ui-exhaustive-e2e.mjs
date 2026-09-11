import { chromium } from 'playwright';

const BASE=process.env.HC_BASE_URL||'http://127.0.0.1:4173/hc-live/ville/';
const ROOT=BASE.replace(/ville\/?$/,'');
const DEPTS={
 '01':['Bourg-en-Bresse','Oyonnax','Jujurieux','Pérouges','Gex','Ferney-Voltaire','Mijoux','Belley','Villars-les-Dombes','Nantua'],
 '03':['Moulins','Vichy','Montluçon','Bourbon-l’Archambault','Néris-les-Bains','Charroux','Souvigny','Lapalisse','Saint-Pourçain-sur-Sioule','Commentry','Hérisson'],
 '07':['Annonay','Aubenas','Privas','Tournon-sur-Rhône','Le Teil','Marcols-les-Eaux','Jaujac','Largentière','Les Vans','Vallon-Pont-d’Arc','Saint-Agrève'],
 '15':['Aurillac','Salers','Saint-Flour','Chaudes-Aigues','Laveissière','Murat','Mauriac','Massiac'],
 '26':['Romans-sur-Isère','Valence','Crest','Die','Nyons','Montélimar','Grignan','Dieulefit','Bourdeaux','Tain-l’Hermitage','La Chapelle-en-Vercors'],
 '38':['Grenoble','Bourgoin-Jallieu','Vienne','Voiron','Vizille','Villard-de-Lans',"Bourg-d'Oisans",'La Tour-du-Pin','Crémieu','Saint-Marcellin','Saint-Pierre-de-Chartreuse','Crolles','Allevard','Pont-en-Royans'],
 '42':['Saint-Étienne','Roanne','Charlieu','Saint-Chamond','Montbrison','Firminy','Feurs','Rive-de-Gier','Saint-Bonnet-le-Château','Boën-sur-Lignon','Noirétable','Saint-Galmier'],
 '43':['Le Puy-en-Velay','Brioude','Retournac','La Chaise-Dieu','Blesle','Yssingeaux','Monistrol-sur-Loire','Langeac'],
 '63':['Clermont-Ferrand','Thiers','Riom','Volvic','Le Mont-Dore','La Bourboule','Issoire','Ambert','Orcines'],
 '69':['Lyon','Villeurbanne','Villefranche-sur-Saône','Tarare','Amplepuis','Thizy-les-Bourgs','Oullins-Pierre-Bénite','Givors'],
 '73':['Chambéry','Aix-les-Bains','Albertville','Beaufort','Bourg-Saint-Maurice','Modane','Courchevel','Méribel','Val Thorens','Tignes',"Val-d'Isère",'La Plagne','Les Arcs','Séez','Saint-Jean-de-Maurienne'],
 '74':['Annecy','Chamonix-Mont-Blanc','Le Grand-Bornand','Châtel','Megève','Évian-les-Bains','Thonon-les-Bains','Morzine','Avoriaz','La Clusaz','Cluses','Sallanches','Saint-Gervais-les-Bains','Samoëns','Yvoire']
};
const NAMES={'01':'Ain','03':'Allier','07':'Ardèche','15':'Cantal','26':'Drôme','38':'Isère','42':'Loire','43':'Haute-Loire','63':'Puy-de-Dôme','69':'Rhône','73':'Savoie','74':'Haute-Savoie'};
const NEED_CHIPS=new Set(['fabric','craft','heritage','nature','view','jewelry']);
const failures=[];const warnings=[];const seen=new Map();
const browser=await chromium.launch({headless:true});
const page=await browser.newPage();page.setDefaultTimeout(10000);
await page.route('**/tile.openstreetmap.org/**',r=>r.abort());
await page.addInitScript(()=>{
 window.__qaCapturedPlaces=[];
 let value;
 Object.defineProperty(window,'HCLocalMap',{configurable:true,get(){return value},set(v){value=v;if(v?.addMarker&&!v.__qaWrapped){const original=v.addMarker.bind(v);v.addMarker=function(p){try{window.__qaCapturedPlaces.push(JSON.parse(JSON.stringify(p)))}catch(_){window.__qaCapturedPlaces.push(p)}return original(p)};v.__qaWrapped=true;}}});
});
await page.goto(ROOT,{waitUntil:'domcontentloaded'});

for(const [code,cities] of Object.entries(DEPTS)){
 for(const city of cities){
  const presence={city,departmentCode:code,departmentName:NAMES[code],lat:46,lng:4,reason:'visit'};
  await page.evaluate(p=>localStorage.setItem('haute-couture-current-presence-v1',JSON.stringify(p)),presence);
  const pageErrors=[];const consoleErrors=[];
  const onPage=e=>pageErrors.push(String(e.message||e));const onConsole=m=>{if(m.type()==='error')consoleErrors.push(m.text())};
  page.on('pageerror',onPage);page.on('console',onConsole);
  try{
   await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:20000});
   await page.waitForFunction(()=>!!window.HCTerritoryContext&&!!window.HCTerritorialPlaceInterfaceV1&&!!window.HCLocalMap,{timeout:15000});
   await page.waitForTimeout(900);
   const markers=await page.evaluate(()=>[...(window.__qaCapturedPlaces||[])]);
   const unique=[];const ids=new Set();for(const p of markers){if(!p?.id||ids.has(p.id))continue;ids.add(p.id);unique.push(p)}
   console.log(`CITY ${code} ${city} · ${unique.length} marqueur(s)`);
   if(!unique.length)warnings.push(`${code} ${city}: aucun marqueur injecté`);
   for(const p of unique){
    if(seen.has(p.id))continue;seen.set(p.id,{code,city,name:p.name||p.id,fictional:!!p.fictional,cat:p.cat||p.category||null});
    const ui=await page.evaluate(place=>{window.HCTerritorialPlaceInterfaceV1.open(place);const q=s=>document.querySelector(s);return{title:q('#tpTitle')?.textContent?.trim()||'',text:q('#tpText')?.textContent?.trim()||'',source:q('#tpSource')?.textContent?.trim()||'',flag:q('#tpHero .tp-mediaflag')?.textContent?.trim()||'',status:q('#tpStatus')?.textContent?.trim()||'',unlock:q('#tpUnlock')?.textContent?.trim()||'',chips:document.querySelectorAll('#tpChips .tp-chip').length,actions:document.querySelectorAll('[data-tpa]').length,book:!!q('#tpBook'),travel:!!q('#tpTravel'),img:!!q('#tpHero img')};},p);
    if(ui.img){await page.waitForTimeout(40);const media=await page.evaluate(()=>{const i=document.querySelector('#tpHero img');return i?{complete:i.complete,w:i.naturalWidth,h:i.naturalHeight,flag:document.querySelector('#tpHero .tp-mediaflag')?.textContent?.trim()||''}:{complete:false,w:0,h:0,flag:document.querySelector('#tpHero .tp-mediaflag')?.textContent?.trim()||''}});ui.media=media;}
    const tag=`${code} | ${city} | ${p.id} | ${p.name||''}`;
    if(!ui.title)failures.push(tag+' · titre manquant');
    if(!ui.text)failures.push(tag+' · texte manquant');
    if(!ui.unlock)failures.push(tag+' · gain/effet manquant');
    if(ui.actions<2)failures.push(tag+` · actions insuffisantes (${ui.actions})`);
    if(!ui.book||!ui.travel)failures.push(tag+' · boutons Book/déplacement manquants');
    if(NEED_CHIPS.has(p.cat)&&ui.chips===0)failures.push(tag+' · matières/motifs/palette absents');
    if(p.fictional){if(!/FICTIONNEL/.test(ui.status)||!/ILLUSTRATION|FICTIF/.test(ui.flag))failures.push(tag+' · fiction mal signalée');}
    else{
      if(ui.flag!=='PHOTO RÉELLE')failures.push(tag+' · photo réelle validée absente');
      if(!ui.source||/manquante|revalider/i.test(ui.source))failures.push(tag+' · source image absente/non validée');
      if(ui.img&&ui.media?.complete&&ui.media.w===0)failures.push(tag+' · image cassée');
      if(!/RÉEL \/ DOCUMENTAIRE/.test(ui.status))failures.push(tag+' · statut documentaire absent');
    }
   }
   if(pageErrors.some(x=>/SyntaxError|ReferenceError/.test(x)))failures.push(`${code} ${city} · erreur page: ${pageErrors.join(' | ')}`);
   if(consoleErrors.some(x=>/Uncaught|ReferenceError|SyntaxError/i.test(x)))failures.push(`${code} ${city} · erreur console: ${consoleErrors.join(' | ')}`);
  }catch(e){failures.push(`${code} ${city} · chargement/QA impossible: ${e.message}`)}
  finally{page.off('pageerror',onPage);page.off('console',onConsole)}
 }
}
await browser.close();
const rows=[...seen.entries()].map(([id,x])=>({id,...x}));
console.log(`\nTOTAL CLIQUABLES UNIQUES: ${rows.length}`);console.log(`RÉELS: ${rows.filter(x=>!x.fictional).length} · FICTIFS: ${rows.filter(x=>x.fictional).length}`);
if(warnings.length){console.log(`AVERTISSEMENTS: ${warnings.length}`);for(const w of warnings)console.log('!',w)}
if(failures.length){console.error(`\nRECETTE EXHAUSTIVE: ${failures.length} défaut(s)`);for(const f of failures)console.error('✗',f);process.exit(1)}
console.log('\n✓ RECETTE EXHAUSTIVE AURA PASSÉE · tous les marqueurs réellement cliquables ont une interface complète et cohérente.');
