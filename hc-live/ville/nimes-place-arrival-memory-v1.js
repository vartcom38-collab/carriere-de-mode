/* Haute Couture Live — mémoire d'arrivée dans les lieux de Nîmes v1
   Première visite, familiarité, souvenirs et arrivée immersive sans rejouer la même intro.
*/
(function(){
'use strict';
if(window.HCNimesPlaceArrivalMemoryV1)return;
const KEY='haute-couture-nimes-place-arrival-memory-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}},write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
const day=()=>Number(window.HCGame?.get?.()?.clock?.day||1);
function state(){const s=read(KEY,{version:1,places:{}});s.places=s.places||{};return s}
function context(){const body=document.getElementById('npBody');if(!body)return null;const raw=(body.textContent||'').toLowerCase(),map=[['Café des Croquis','café des croquis'],['Brocante textile','brocante'],['Mercerie','mercerie'],['Arènes de Nîmes','arènes'],['Maison Carrée','maison carrée'],['Musée de la Romanité','romanité'],['Jardins de la Fontaine','fontaine'],['Tour Magne','tour magne'],['Atelier de Claire Vidal','claire']];const found=map.find(([,needle])=>raw.includes(needle));return found?.[0]||null}
function knownHere(place){const people=window.HCNimesPeople||[],pop=window.HCTerritorialPopulationV1;return people.filter(p=>p.places?.includes(place)&&pop?.personState?.(p.id)?.known).slice(0,3)}
function line(place,entry){const known=knownHere(place);if(entry.visits<=1){const first={
'Café des Croquis':'Tu entres et prends quelques secondes pour comprendre le rythme du lieu avant de choisir une table ou de parler à quelqu’un.',
'Brocante textile':'Tu laisses d’abord ton regard parcourir les matières, les bords usés et les objets qui ne racontent pas encore leur histoire.',
'Mercerie':'Les couleurs et les fournitures se lisent mieux quand tu ne cherches pas immédiatement quelque chose de précis.',
'Arènes de Nîmes':'Avant de chercher une information, tu regardes l’échelle du monument et la répétition de ses ouvertures.',
'Maison Carrée':'La façade paraît simple de loin ; en t’approchant, les proportions et le décor commencent à se distinguer.',
'Musée de la Romanité':'Tu entres sans savoir encore quel objet ou quel détail retiendra ton attention aujourd’hui.',
'Jardins de la Fontaine':'L’eau, la pierre et la végétation donnent plusieurs rythmes au même lieu.',
'Tour Magne':'La hauteur change immédiatement ta manière de lire la ville.',
'Atelier de Claire Vidal':'Tu reconnais d’abord le calme du travail manuel et la place laissée aux gestes.'};return first[place]||`Tu arrives à ${place} et prends quelques secondes pour regarder avant d’agir.`}
 if(known.length)return `${place} n’est plus tout à fait anonyme. ${known[0].firstName} fait partie des visages que tu associes désormais à cet endroit.`;
 if(entry.visits>=4)return `Tu connais maintenant assez ${place} pour ne plus avoir besoin de tout observer à chaque passage. Certains détails te reviennent presque automatiquement.`;
 return `Tu reviens à ${place}. Le lieu te paraît déjà moins neuf qu’à ta première visite.`}
function record(place){const s=state(),p=s.places[place]||(s.places[place]={visits:0,firstDay:day(),days:[],memories:[]});if(p.lastDay!==day()){p.visits++;p.lastDay=day();p.days.unshift(day());p.days=p.days.slice(0,40)}write(KEY,s);return p}
function show(place,entry){if(!place||!window.HCImmersiveDialogueV1)return;const id=`arrival:${place}:${day()}`;if(entry.lastSceneId===id)return;entry.lastSceneId=id;const s=state();s.places[place]=entry;write(KEY,s);const txt=line(place,entry);const scene={id:`nimes-place-arrival-${place}-${day()}`,speaker:{name:place,role:entry.visits<=1?'Première arrivée':'Un lieu que tu connais',photo:'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&fm=jpg&q=82&w=1200'},eyebrow:`Nîmes · ${entry.visits<=1?'découvrir':'revenir'}`,start:'look',nodes:{look:{text:txt,choices:[{label:'Regarder encore un instant.',reply:'Tu laisses le lieu exister avant de chercher une action à faire.'},{label:'Continuer ma visite.',reply:'Tu reprends ce que tu étais venue faire.'}]}}};setTimeout(()=>window.HCImmersiveDialogueV1.open(scene),260)}
function trigger(){const place=context();if(!place)return;const entry=record(place);if(entry.lastDay!==day())return;show(place,entry);window.dispatchEvent(new CustomEvent('hc-nimes-place-arrival',{detail:{place,visits:entry.visits,day:day()}}))}
function boot(){const body=document.getElementById('npBody');if(!body)return setTimeout(boot,150);let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(trigger,260)}).observe(body,{childList:true,subtree:true,characterData:true});setTimeout(trigger,650)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.HCNimesPlaceArrivalMemoryV1={version:1,state,context,record,trigger,storageKey:KEY};
})();