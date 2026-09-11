import { chromium } from 'playwright';

const BASE=process.env.HC_BASE_URL||'http://127.0.0.1:4173/hc-live/ville/';
const ONLY=String(process.env.HC_DEPT||'').trim();
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

async function makePage(code,city){
 const page=await browser.newPage();page.setDefaultTimeout(7000);
 const presence={city,departmentCode:code,departmentName:NAMES[code],lat:46,lng:4,reason:'visit'};
 const pageErrors=[],consoleErrors=[];
 page.on('pageerror',e=>pageErrors.push(String(e.message||e)));
 page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
 await page.route('**/*',r=>{const u=r.request().url(),t=r.request().resourceType();if(['image','media','font'].includes(t)||u.includes('tile.openstreetmap.org'))return r.abort();return r.continue()});
 await page.addInitScript(p=>{
  localStorage.setItem('haute-couture-current-presence-v1',JSON.stringify(p));
  window.__qaCapturedPlaces=[];
  let value;
  Object.defineProperty(window,'HCLocalMap',{configurable:true,get(){return value},set(v){value=v;if(v?.addMarker&&!v.__qaWrapped){const original=v.addMarker.bind(v);v.addMarker=function(place){try{window.__qaCapturedPlaces.push(JSON.parse(JSON.stringify(place)))}catch(_){window.__qaCapturedPlaces.push(place)}return original(place)};v.__qaWrapped=true;}}});
 },presence);
 await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000});
 await page.waitForFunction(()=>!!window.HCTerritoryContext&&!!window.HCTerritorialPlaceInterfaceV1&&!!window.HCLocalMap,{timeout:10000});
 let prev=-1,stable=0;for(let i=0;i<12&&stable<3;i++){await page.waitForTimeout(100);const n=await page.evaluate(()=>window.__qaCapturedPlaces?.length||0);if(n===prev)stable++;else{prev=n;stable=0}}
 return{page,pageErrors,consoleErrors};
}
function isFiction(p){return !!(p.fictional||p.fictionalFamily||p.fictionalFuture||p.evolutive||/famille événementielle/i.test(String(p.name||'')))}

const entries=Object.entries(DEPTS).filter(([c])=>!ONLY||c===ONLY);if(ONLY&&!entries.length)throw new Error('HC_DEPT inconnu: '+ONLY);
for(const [code,cities] of entries){
 for(const city of cities){
  let page=null;
  try{
   const made=await makePage(code,city);page=made.page;
   const markers=await page.evaluate(()=>[...(window.__qaCapturedPlaces||[])]);
   const unique=[];const ids=new Set();for(const p of markers){if(!p?.id||ids.has(p.id))continue;ids.add(p.id);unique.push(p)}
   console.log(`CITY ${code} ${city} · ${unique.length} marqueur(s)`);if(!unique.length)warnings.push(`${code} ${city}: aucun marqueur injecté`);
   for(const p of unique){
    if(seen.has(p.id))continue;const fictional=isFiction(p);seen.set(p.id,{code,city,name:p.name||p.id,fictional,cat:p.cat||p.category||null});
    const ui=await page.evaluate(place=>{window.HCTerritorialPlaceInterfaceV1.open(place);const q=s=>document.querySelector(s);const img=q('#tpHero img');return{title:q('#tpTitle')?.textContent?.trim()||'',source:q('#tpSource')?.textContent?.trim()||'',flag:q('#tpHero .tp-mediaflag')?.textContent?.trim()||'',status:q('#tpStatus')?.textContent?.trim()||'',chips:document.querySelectorAll('#tpChips .tp-chip').length,actions:document.querySelectorAll('[data-tpa]').length,book:!!q('#tpBook'),travel:!!q('#tpTravel'),img:!!img,imgSrc:img?.getAttribute('src')||''};},p);
    const tag=`${code} | ${city} | ${p.id} | ${p.name||''}`;
    if(!ui.title)failures.push(tag+' · titre manquant');
    if(!String(p.text||p.description||'').trim())failures.push(tag+' · texte propre au lieu manquant');
    if(!String(p.unlock||'').trim())failures.push(tag+' · gain/effet propre au lieu manquant');
    if(ui.actions<2)failures.push(tag+` · actions insuffisantes (${ui.actions})`);
    if(!ui.book||!ui.travel)failures.push(tag+' · boutons Book/déplacement manquants');
    if(NEED_CHIPS.has(p.cat)&&!(p.materials?.length||p.motifs?.length||p.palette?.length))failures.push(tag+' · matières/motifs/palette absents');
    if(fictional){if(!/FICTIONNEL/.test(ui.status)||!/ILLUSTRATION|FICTIF/.test(ui.flag))failures.push(tag+' · fiction/événement évolutif mal signalé');}
    else{
      if(ui.flag!=='PHOTO RÉELLE')failures.push(tag+' · photo réelle validée absente');
      if(!ui.img||!ui.imgSrc)failures.push(tag+' · URL image absente');
      if(!ui.source||/manquante|revalider/i.test(ui.source))failures.push(tag+' · source image absente/non validée');
      if(!/RÉEL \/ DOCUMENTAIRE/.test(ui.status))failures.push(tag+' · statut documentaire absent');
    }
   }
   if(made.pageErrors.some(x=>/SyntaxError|ReferenceError/.test(x)))failures.push(`${code} ${city} · erreur page: ${made.pageErrors.join(' | ')}`);
   if(made.consoleErrors.some(x=>/Uncaught|ReferenceError|SyntaxError/i.test(x)))failures.push(`${code} ${city} · erreur console: ${made.consoleErrors.join(' | ')}`);
  }catch(e){failures.push(`${code} ${city} · chargement/QA impossible: ${e.message}`)}finally{if(page)await page.close().catch(()=>{})}
 }
}
await browser.close();
const rows=[...seen.entries()].map(([id,x])=>({id,...x}));
console.log(`\nTOTAL CLIQUABLES UNIQUES${ONLY?' '+ONLY:''}: ${rows.length}`);console.log(`RÉELS: ${rows.filter(x=>!x.fictional).length} · FICTIFS/ÉVOLUTIFS: ${rows.filter(x=>x.fictional).length}`);
if(warnings.length){console.log(`AVERTISSEMENTS: ${warnings.length}`);for(const w of warnings)console.log('!',w)}
const uniq=[...new Set(failures)];
if(uniq.length){console.error(`\nRECETTE EXHAUSTIVE${ONLY?' '+ONLY:''}: ${uniq.length} défaut(s)`);for(const f of uniq)console.error('✗',f);process.exit(1)}
console.log(`\n✓ RECETTE EXHAUSTIVE AURA${ONLY?' '+ONLY:''} PASSÉE · chaque marqueur cliquable a contenu, gain, actions et contrat média cohérents.`);
