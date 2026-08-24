/* Haute Couture Live — moteur de recherche / recommandations France v1.
   But: le joueur ne voyage jamais à l'aveugle. Une demande libre (matière, technique,
   ambiance, mission, type de lieu, ville, département...) renvoie des destinations préparées.
   Le moteur n'invente pas de lieu précis : il indexe uniquement les contenus réellement chargés.
   Les départements futurs peuvent s'enregistrer via HCFranceDiscovery.registerPack().
*/
(function(){
'use strict';
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,' ').replace(/[^a-z0-9]+/g,' ').trim();
const uniq=a=>[...new Set((a||[]).filter(Boolean))];
const words=s=>norm(s).split(/\s+/).filter(x=>x.length>1);
const STOP=new Set('je veux cherche trouver besoin aller ou endroit lieu lieux pour avec dans des une un les du de la le et en sur mon ma mes me qui quoi vers faire voir visiter inspiration inspirer quelque chose'.split(' '));
const SYN={
 tissu:['tissu','textile','etoffe','laine','soie','lin','serge','coton','dentelle','galon','ruban','mercerie'],
 couture:['couture','mode','stylisme','atelier','broderie','tailoring','patron','costume','vetement'],
 vintage:['vintage','brocante','chine','friperie','ancien','archive','objet'],
 architecture:['architecture','monument','patrimoine','pierre','colonne','arc','arcade','ruine','eglise','chateau','tour'],
 art:['art','musee','galerie','peinture','sculpture','photo','exposition'],
 nature:['nature','jardin','paysage','mer','eau','garrigue','camargue','cevennes','plante','botanique'],
 photo:['photo','photographie','shoot','shooting','vue','panorama','lumiere'],
 bijoux:['bijou','bijoux','metal','bronze','or','argent','accessoire'],
 marche:['marche','halles','artisan','artisanat','local','terroir','commerce'],
 recherche:['archive','archives','bibliotheque','recherche','document','histoire','patrimoine'],
 rencontre:['rencontre','reseau','client','cliente','contact','cafe','social','soirée','evenement'],
 mariage:['mariage','mariee','ceremonie','wedding'],
 scene:['scene','spectacle','costume','theatre','festival','concert']
};
const INTENTS={
 acheter:['acheter','achat','fournisseur','mercerie','boutique','marche','halles','stock','matiere'],
 inspirer:['inspiration','inspirer','moodboard','croquis','palette','motif','silhouette','architecture','musee','nature'],
 rencontrer:['rencontre','reseau','contact','client','cliente','cafe','evenement','social'],
 photographier:['photo','shoot','shooting','panorama','vue','lumiere','spot'],
 rechercher:['archive','bibliotheque','document','recherche','histoire','fonds'],
 chiner:['brocante','vintage','chine','ancien','bouton','linge','patron'],
 collaborer:['artisan','atelier','broderie','photo','collaboration','fournisseur'],
 visiter:['visite','musee','monument','patrimoine','jardin','lieu']
};
const CATEGORY={
 museum:['musee','art','culture','collection','exposition'],
 monument:['monument','patrimoine','architecture','histoire'],
 market:['marche','halles','acheter','artisan','terroir'],
 shop:['boutique','mercerie','acheter','fournisseur','mode'],
 vintage:['brocante','vintage','chiner','ancien'],
 archive:['archives','bibliotheque','recherche','document'],
 library:['bibliotheque','livre','recherche','archive'],
 garden:['jardin','nature','plante','promenade'],
 nature:['nature','paysage','eau','mer','garrigue','cevennes'],
 view:['vue','panorama','photo','shooting'],
 cafe:['cafe','rencontre','reseau','social'],
 studio:['studio','photo','shooting','collaboration'],
 artisan:['artisan','atelier','savoir faire','collaboration'],
 church:['eglise','religieux','architecture','patrimoine'],
 castle:['chateau','patrimoine','architecture'],
 urban:['ville','rue','quartier','promenade','architecture']
};
const packs=new Map();
function registerPack(id,pack,meta={}){if(!pack)return;packs.set(String(id),{pack,meta});window.dispatchEvent(new CustomEvent('hc-france-search-index-updated',{detail:{id}}));}
function autoRegister(){if(window.HCGardComplete)registerPack('30',window.HCGardComplete,{department:'Gard',region:'Occitanie'});}
function territoryMeta(place,entry){const t=window.HCFranceTerritories,code=entry?.meta?.departmentCode||entry?.pack?.code||'';const d=t?.byDepartmentCode?.[String(code)]||null;return {department:entry?.meta?.department||d?.name||entry?.pack?.name||'',region:entry?.meta?.region||d?.regionName||''}}
function placeDoc(place,entry){const tm=territoryMeta(place,entry),tags=uniq([...(place.tags||[]),...(place.identity||[]),...(place.keywords||[]),...(place.activities||[])]),category=String(place.category||'');const text=norm([place.name,place.city,category,tags.join(' '),tm.department,tm.region].join(' '));return {kind:'place',id:place.id,name:place.name,city:place.city||'',category,tags,real:place.real!==false,fictionalized:!!place.fictionalized,available:place.available!==false,visit:place.visit||{},department:tm.department,region:tm.region,sourceUrl:place.sourceUrl||'',sourceLabel:place.sourceLabel||'',raw:place,text};}
function allPlaces(){autoRegister();const out=[];for(const entry of packs.values())for(const p of (entry.pack.places||[]))out.push(placeDoc(p,entry));return out}
function expandTokens(query){const base=words(query).filter(x=>!STOP.has(x)),out=new Set(base);for(const [root,list] of Object.entries(SYN)){if(base.some(t=>t===root||list.includes(t))){out.add(root);list.forEach(x=>out.add(norm(x)))}}return [...out]}
function currentContext(){let h={};try{h=JSON.parse(localStorage.getItem('haute-couture-home')||'{}')}catch(e){}const gs=window.HCGame?.get?.()||{};return {city:h.city||h.home?.city||gs.player?.city||'',department:h.department||'',region:h.region||''}}
function classify(query){const q=norm(query),intents=[];for(const [id,list] of Object.entries(INTENTS))if(list.some(x=>q.includes(norm(x))))intents.push(id);return intents}
function scoreDoc(doc,query,opts={}){const toks=expandTokens(query),q=norm(query),ctx=currentContext();let score=0;const reasons=[];if(!toks.length)return {score:0,reasons:[]};
  const name=norm(doc.name),city=norm(doc.city),cat=norm(doc.category),tagText=norm(doc.tags.join(' '));
  if(q&&name.includes(q)){score+=35;reasons.push('nom exact ou très proche')}
  for(const t of toks){if(name.includes(t)){score+=12;reasons.push(`nom : ${t}`)}if(city.includes(t)){score+=10;reasons.push(`ville : ${doc.city}`)}if(tagText.includes(t)){score+=8;reasons.push(`thème : ${t}`)}if(cat.includes(t)){score+=7;reasons.push(`type de lieu : ${t}`)}if(norm(doc.department).includes(t)){score+=7;reasons.push(`département : ${doc.department}`)}if(norm(doc.region).includes(t)){score+=5;reasons.push(`région : ${doc.region}`)}}
  const intents=classify(query);for(const intent of intents){const keys=INTENTS[intent]||[];if(keys.some(k=>doc.text.includes(norm(k)))){score+=7;reasons.push(`adapté pour ${intent}`)}}
  for(const [catKey,keys] of Object.entries(CATEGORY)){if(cat.includes(catKey)&&keys.some(k=>toks.includes(norm(k))))score+=8}
  if(opts.scope==='near'&&ctx.city&&city===norm(ctx.city)){score+=18;reasons.push('dans ta ville actuelle')}
  if(opts.scope==='department'&&ctx.department&&norm(doc.department)===norm(ctx.department)){score+=14;reasons.push('dans ton département')}
  if(opts.scope==='region'&&ctx.region&&norm(doc.region)===norm(ctx.region)){score+=10;reasons.push('dans ta région')}
  if(opts.availableOnly&&doc.available===false)return {score:-1,reasons:[]};
  if(doc.real)score+=1;
  return {score,reasons:uniq(reasons).slice(0,4)};
}
function search(query,opts={}){const docs=allPlaces();let res=docs.map(doc=>{const s=scoreDoc(doc,query,opts);return {...doc,score:s.score,reasons:s.reasons}}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name,'fr')).slice(0,Number(opts.limit||12));return res}
function suggest(query,opts={}){const results=search(query,opts);return {query,context:currentContext(),intents:classify(query),results,empty:results.length===0};}
function preparedTerritories(){const t=window.HCFranceTerritories;return (t?.regions||[]).map(r=>({region:r.name,departments:r.departments.map(d=>({code:d.code,name:d.name,hasPack:packs.has(String(d.code))}))}))}
function audit(){autoRegister();return {packs:[...packs.keys()],places:allPlaces().length,territories:window.HCFranceTerritories?.departments?.length||0,rule:'specific place results come only from registered prepared content; no invented POIs'};}
window.HCFranceDiscovery={registerPack,search,suggest,audit,preparedTerritories,currentContext};
autoRegister();
})();