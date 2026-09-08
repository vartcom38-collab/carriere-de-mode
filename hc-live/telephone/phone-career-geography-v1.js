/* Haute Couture Live — portée géographique de carrière v2
   Les territoires professionnels ne forment pas une échelle Nîmes -> Paris.
   Une spécialité peut ouvrir plusieurs foyers de carrière indépendants selon les réseaux réels de la partie. */
(function(){
'use strict';
if(window.__HC_CAREER_GEOGRAPHY__)return;window.__HC_CAREER_GEOGRAPHY__=true;
const TERRITORY_KEY='haute-couture-territorial-world-v1';
const TRACKS={tailoring:'Tailoring',bridal:'Bridal',ceremonie:'Cérémonie',scene:'Scène',redCarpet:'Red carpet',pageant:'Pageant',avantGarde:'Avant-garde',upcycling:'Upcycling',editorial:'Éditorial'};
const POOLS={
 tailoring:['Lyon','Paris','Bordeaux','Lille','Strasbourg','Toulouse'],
 bridal:['Lyon','Paris','Marseille','Bordeaux','Montpellier','Nice'],
 ceremonie:['Lyon','Paris','Marseille','Bordeaux','Toulouse','Nice'],
 scene:['Paris','Lyon','Marseille','Avignon','Montpellier','Lille'],
 redCarpet:['Paris','Cannes','Lyon','Marseille','Nice'],
 pageant:['Lyon','Paris','Marseille','Toulouse','Bordeaux'],
 avantGarde:['Paris','Lyon','Marseille','Bordeaux','Strasbourg'],
 upcycling:['Lyon','Paris','Nantes','Bordeaux','Marseille','Toulouse'],
 editorial:['Paris','Lyon','Marseille','Bordeaux','Lille','Strasbourg']
};
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch(e){return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
const slug=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function game(){try{return window.HCGame?.get?.()||null}catch(e){return null}}
function clientele(){try{return window.HCCareerLocalClienteleV1?.publicProfile?.()||read('haute-couture-career-local-clientele-v1',{})||{}}catch(_){return{}}}
function contactFor(g,track){const list=(g?.professionalNetwork||[]).filter(x=>x.specialty===track);return list.sort((a,b)=>(b.firstContactDay||0)-(a.firstContactDay||0))[0]||null}
function existingTerritories(g){const set=new Set();const cp=clientele();for(const t of cp.territories||[])if(t?.name)set.add(t.name);if(g?.player?.city)set.add(g.player.city);for(const x of g?.careerTravelLeads||[])if(x?.city)set.add(x.city);return set}
function cityFor(track,threshold){const g=game()||{},pool=POOLS[track]||POOLS.editorial,used=existingTerritories(g),start=(Object.keys(TRACKS).indexOf(track)*3+threshold)%pool.length;for(let i=0;i<pool.length;i++){const city=pool[(start+i)%pool.length];if(!used.has(city))return city}return pool[start%pool.length]}
function scopeFor(threshold){return threshold>=16?'portée large':threshold>=10?'réseau élargi':'nouveau territoire'}
function territorialUnlock(city,track,threshold){const s=read(TERRITORY_KEY,{version:1,places:{},encounters:{},knownPeople:{},rumors:[],unlocks:{}});s.unlocks=s.unlocks||{};const key='career-city-'+slug(city);if(!s.unlocks[key])s.unlocks[key]={source:'career-reputation',city,track,threshold,day:game()?.clock?.day||1};write(TERRITORY_KEY,s);window.dispatchEvent(new CustomEvent('hc-territory-state',{detail:s}))}
function registerLead(track,score,threshold){const g=game(),label=TRACKS[track];if(!g||!label)return;const city=cityFor(track,threshold),id=`career-geo-${track}-${threshold}`,contact=contactFor(g,track);if(g.flags?.careerGeographyLedger?.[id])return;
 window.HCGame?.mutate?.(s=>{s.flags=s.flags||{};s.flags.careerGeographyLedger=s.flags.careerGeographyLedger||{};if(s.flags.careerGeographyLedger[id])return;s.flags.careerGeographyLedger[id]=s.clock?.iso||new Date().toISOString();s.careerTravelLeads=s.careerTravelLeads||[];const lead={id,city,scope:scopeFor(threshold),specialty:track,specialtyLabel:label,specialtyScore:score,threshold,createdDay:s.clock?.day||1,createdAt:s.clock?.iso||new Date().toISOString(),sourceContact:contact?{name:contact.name,role:contact.role}:null,status:'piste professionnelle',playable:false,reason:threshold>=16?`Ton travail en ${label} circule assez largement pour faire apparaître une nouvelle piste à ${city}.`:threshold>=10?`Ton réseau en ${label} s’étend : un contact ou une recommandation ouvre une piste à ${city}.`:`Une première piste en ${label} apparaît à ${city}, sans remplacer tes autres territoires.`};if(!s.careerTravelLeads.some(x=>x.id===id))s.careerTravelLeads.unshift(lead);s.messages=s.messages||[];const from=contact?.name||'Réseau professionnel',text=`Une piste liée à ton travail en ${label} apparaît à ${city}. Ce territoire s’ajoute à ta carrière : il ne devient pas automatiquement plus important que ceux où tu as déjà une clientèle fidèle.`;if(!s.messages.some(m=>m.id===id))s.messages.unshift({id,from,avatar:String(from)[0]||'R',subject:`Une piste à ${city}`,text,receivedAt:s.clock?.iso||new Date().toISOString(),read:false,action:null,meta:{source:'career-geography',city,track}});});territorialUnlock(city,track,threshold);window.dispatchEvent(new CustomEvent('hc-career-geography',{detail:{track,score,threshold,city}}))}
function sync(){const g=game();if(!g)return;const r=g.reputationTracks||{};for(const track of Object.keys(TRACKS)){const score=Math.max(0,Number(r[track]||0));if(score>=6)registerLead(track,score,6);if(score>=10)registerLead(track,score,10);if(score>=16)registerLead(track,score,16)}}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]))}
function injectUI(){const qs=new URLSearchParams(location.search);if((qs.get('app')||'home')!=='carriere')return false;const wrap=document.querySelector('.hcc-wrap');if(!wrap||document.getElementById('hcc-geography'))return false;const g=game()||{},leads=(g.careerTravelLeads||[]).slice().sort((a,b)=>(b.threshold||0)-(a.threshold||0)||(b.createdDay||0)-(a.createdDay||0)),cp=clientele(),bases=(cp.territories||[]).filter(x=>x.counts?.clients>0).slice(0,4);const section=document.createElement('section');section.id='hcc-geography';section.className='hcc-section';section.innerHTML=`<h2>Portée du réseau</h2>${bases.length?`<div class="hcc-note">Foyers de clientèle réels : ${bases.map(x=>`${esc(x.name)} (${x.counts.clients} cliente${x.counts.clients>1?'s':''})`).join(' · ')}</div>`:''}${leads.length?leads.map(x=>`<article class="hcc-domain"><div class="hcc-head"><b>${esc(x.city)}</b><span class="hcc-badge">${esc(x.scope)} · ${esc(x.specialtyLabel)}</span></div><p>${esc(x.reason)}${x.sourceContact?` ${esc(x.sourceContact.name)} (${esc(x.sourceContact.role)}) est lié à cette piste.`:''}</p></article>`).join(''):`<div class="hcc-empty">Aucune nouvelle piste géographique n’est encore apparue. Ta carrière peut néanmoins déjà avoir plusieurs foyers de clientèle selon les commandes réellement vécues.</div>`}<div class="hcc-note">Une ville n’est jamais un niveau supérieur. Sa force dépendra de ce que tu y construis réellement : clientes, retours, réseau, collaborations et durée.</div>`;const note=wrap.querySelector('.hcc-note');if(note)wrap.insertBefore(section,note);else wrap.appendChild(section);return true}
function boot(){let tries=0;const tick=()=>{tries++;if(window.HCGame){sync();if(injectUI())return}if(tries<120)setTimeout(tick,50)};tick()}
boot();
window.addEventListener('hc-game-state',()=>setTimeout(()=>{sync();injectUI()},0));
window.addEventListener('hc-specialty-reputation',()=>setTimeout(()=>{sync();injectUI()},0));
window.addEventListener('hc-career-local-clientele',()=>setTimeout(()=>injectUI(),0));
})();