/* Haute Couture Live — couche cartographique Gard.
   Sur la carte d'une ville, n'affiche que le noyau de départ + les lieux réellement découverts.
   Les lieux fictifs utilisent des zones cohérentes sans fausse adresse exacte.
*/
(function(){
'use strict';
const CACHE_KEY='haute-couture-gard-geocode-v1',WORLD_KEY='haute-couture-gard-world-v2';
const SKIP=new Set(['nimes-arenes','nimes-maison-carree','nimes-jardins-fontaine','nimes-musee-romanite','nimes-tour-magne']);
const STARTER=new Set(['nimes-mercerie-atelier','nimes-brocante-textile','nimes-cafe-creative','nimes-atelier-broderie','nimes-gare','nimes-halles','nimes-esplanade']);
const READY=new Set(['nimes-arenes','nimes-musee-romanite','nimes-maison-carree','nimes-tour-magne','nimes-jardins-fontaine','nimes-temple-diane','nimes-castellum','nimes-porte-auguste','nimes-porte-france','nimes-beaux-arts','nimes-vieux-nimes','nimes-carre-art','nimes-cultures-taurines','nimes-halles','nimes-esplanade','nimes-cathedrale','nimes-archives','nimes-bibliotheque-patrimoine','nimes-grand-temple','nimes-centre-historique','nimes-mercerie-atelier','nimes-brocante-textile','nimes-cafe-creative','nimes-atelier-broderie','nimes-hotel-test','nimes-showroom-test','nimes-gare']);
const LOGICAL={
 'nimes-mercerie-atelier':{lat:43.8377,lng:4.3570,zone:'Écusson · secteur commerçant'},
 'nimes-brocante-textile':{lat:43.8365,lng:4.3548,zone:'Centre ancien · secteur brocante'},
 'nimes-cafe-creative':{lat:43.8374,lng:4.3589,zone:'Écusson · secteur cafés'},
 'nimes-atelier-broderie':{lat:43.8391,lng:4.3556,zone:'Centre · secteur ateliers'},
 'nimes-hotel-test':{lat:43.8329,lng:4.3653,zone:'Gare / centre · secteur hôtels'},
 'nimes-showroom-test':{lat:43.8383,lng:4.3546,zone:'Maison Carrée / centre · secteur prestige'}
};
const readJSON=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch(e){return f}},readCache=()=>readJSON(CACHE_KEY,{}),saveCache=c=>localStorage.setItem(CACHE_KEY,JSON.stringify(c));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const iconFor=p=>/museum|culture|library|archive/.test(p.category)?'✦':/market|vintage|shop|mode/.test(p.category)?'✂':/nature|garden|landscape/.test(p.category)?'❧':/view|tower/.test(p.category)?'◌':/hotel/.test(p.category)?'⌂':/transport|station/.test(p.category)?'↗':/showroom|prestige/.test(p.category)?'◇':/people|cafe|artisan/.test(p.category)?'♡':'♜';
const typeLabel=p=>/museum/.test(p.category)?'MUSÉE':/market|shop/.test(p.category)?'ADRESSE MODE':/nature|garden/.test(p.category)?'PAYSAGE':/archive|library/.test(p.category)?'RECHERCHE':/hotel/.test(p.category)?'HÔTEL':/transport|station/.test(p.category)?'TRANSPORT':/showroom|prestige/.test(p.category)?'SHOWROOM':/cafe/.test(p.category)?'CAFÉ':/artisan/.test(p.category)?'ARTISAN':'PATRIMOINE';
function waitForRuntime(cb,n=0){const map=window.HCLeafletMap,p=window.HCGardComplete;if(map&&p&&window.L){cb(map,p);return}if(n<100)setTimeout(()=>waitForRuntime(cb,n+1),80)}
function currentCity(){let raw={};try{raw=JSON.parse(localStorage.getItem('haute-couture-home')||'{}')}catch(e){}return raw.city||raw.home?.city||'Nîmes'}
function centerOf(map){const c=map.getCenter();return{lat:c.lat,lng:c.lng}}
function softOffset(pt,id){const h=[...String(id)].reduce((a,c)=>((a*31+c.charCodeAt(0))>>>0),7),a=(h%360)*Math.PI/180,r=.00018+((h>>8)%30)/300000;return{lat:pt.lat+Math.sin(a)*r,lng:pt.lng+Math.cos(a)*r}}
function fictionalPoint(base,place){const z=LOGICAL[place.id];return z?softOffset(z,place.id):softOffset(base,place.id)}
function zoneLabel(place){return LOGICAL[place.id]?.zone||`${place.city} · zone de gameplay`}
function guideData(place){return {id:place.id,name:place.name,where:place.real===false?zoneLabel(place):`${place.city} · Gard`,text:`${place.name} fait partie de ton réseau de lieux connus. ${READY.has(place.id)?'Une fiche de gameplay détaillée est disponible.':'Sa fiche éditoriale sera enrichie progressivement.'}`,unlock:READY.has(place.id)?'Visite · mémoire de carte · rencontres possibles · Book · inspirations / déblocages selon le lieu.':'Découverte de territoire · mémoire de carte · rencontre ou événement possible.'}}
function resolveVisit(place,btn){if(btn?.dataset.done==='1')return;const r=window.HCGardGameplay?.visit?window.HCGardGameplay.visit(place.id):window.HCGardWorld?.onVisit?.(place);if(btn){btn.dataset.done='1';btn.textContent='✓ VISITÉ'}return r}
function addVisitButton(place){const actions=document.querySelector('.guide-actions');if(!actions)return;let btn=actions.querySelector('#hcVisitPlace');if(!btn){btn=document.createElement('button');btn.id='hcVisitPlace';btn.className='save';actions.insertBefore(btn,actions.firstChild)}btn.dataset.done='0';btn.textContent=`VISITER · ${Number(place.visit?.durationMinutes||45)} MIN`;btn.onclick=e=>{e.preventDefault();e.stopPropagation();resolveVisit(place,btn)}}
function openPlace(place){if(window.HCNimesPlaceUI?.open?.(place))return;const d=guideData(place),$=s=>document.querySelector(s);$('#guideType').textContent=typeLabel(place);$('#guideTitle').textContent=place.name;$('#guideWhere').textContent=d.where;const gt=$('#guideText');if(gt)gt.textContent=d.text;const gc=$('#guideChips');if(gc)gc.innerHTML=[...(place.tags||[])].slice(0,8).map(x=>`<span class="chip">${esc(x)}</span>`).join('');const gm=$('#guideMode');if(gm)gm.innerHTML='<b>LECTURE MODE</b><br>'+esc((place.tags||[]).join(' · '));const gu=$('#guideUnlock');if(gu)gu.textContent=d.unlock;addVisitButton(place);$('#overlay')?.classList.add('open')}
async function geocode(place,cache){if(cache[place.id])return cache[place.id];const q=encodeURIComponent(`${place.name}, ${place.city}, Gard, France`);try{const r=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=fr&q=${q}`,{headers:{'Accept-Language':'fr'}});if(!r.ok)return null;const j=await r.json();if(j?.[0]){const pt={lat:Number(j[0].lat),lng:Number(j[0].lon)};cache[place.id]=pt;saveCache(cache);return pt}}catch(e){}return null}
function markerIcon(place){const ready=READY.has(place.id),html=`<div style="width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:${ready?'#fff3e8':'#f1ece7'};border:2px solid ${ready?'#d98b70':'#cfc4bb'};box-shadow:0 4px 12px #0003;font-size:14px;cursor:pointer">${iconFor(place)}</div>`;return L.divIcon({className:'',html,iconSize:[32,32],iconAnchor:[16,16]})}
function addMarker(layer,place,pt){const where=place.real===false?zoneLabel(place):(READY.has(place.id)?'Lieu de gameplay disponible':'Lieu connu');const m=L.marker([pt.lat,pt.lng],{icon:markerIcon(place)}).bindTooltip(`<b>${esc(place.name)}</b><br>${esc(where)}`).on('click',()=>openPlace(place));m.addTo(layer);return m}
function knownIds(){const w=readJSON(WORLD_KEY,{}),ids=new Set([...(w.discoveredPlaces||[]),...Object.keys(w.placeMemory||{})]);STARTER.forEach(x=>ids.add(x));return ids}
function run(map,p){const layer=L.layerGroup().addTo(map),cache=readCache(),city=norm(currentCity()),known=knownIds();const all=(p.places||[]).filter(x=>!SKIP.has(x.id)&&x.id!=='nimes-photo-studio'&&norm(x.city)===city&&known.has(x.id));const priority=[...all].sort((a,b)=>(READY.has(b.id)?1:0)-(READY.has(a.id)?1:0)),base=centerOf(map),done=new Set();
  priority.filter(x=>x.real===false).forEach(place=>{addMarker(layer,place,fictionalPoint(base,place));done.add(place.id)});
  priority.filter(place=>cache[place.id]).forEach(place=>{addMarker(layer,place,cache[place.id]);done.add(place.id)});
  let i=0;async function next(){while(i<priority.length&&done.has(priority[i].id))i++;if(i>=priority.length)return;const place=priority[i++];if(place.real===false){addMarker(layer,place,fictionalPoint(base,place));done.add(place.id);setTimeout(next,50);return}const pt=await geocode(place,cache);if(pt){addMarker(layer,place,pt);done.add(place.id)}setTimeout(next,900)}next();
  window.HCGardMapLayer={layer,readyIds:[...READY],knownIds:[...known],openPlace,visit:resolveVisit,refresh:()=>location.reload()};window.dispatchEvent(new CustomEvent('hc-gard-map-layer-ready',{detail:{ready:READY.size,total:all.length,known:known.size}}));
}
waitForRuntime(run);
})();