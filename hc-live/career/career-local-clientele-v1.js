/* Haute Couture Live — clientèle territoriale vécue v2
   Pas de jauge publique : déduit des foyers de clientèle à partir des commandes réellement livrées,
   retours, recommandations et transformations. Nîmes est un territoire test, jamais un centre imposé. */
(function(){
'use strict';
if(window.HCCareerLocalClienteleV1)return;
const KEY='haute-couture-career-local-clientele-v1';
const O='haute-couture-client-orders-v1',A='haute-couture-client-aftercare-v1',R='haute-couture-client-referral-network-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
const iso=()=>window.HCGame?.get?.()?.clock?.iso||new Date().toISOString();
function orders(){const x=read(O,[]);return Array.isArray(x)?x:Object.values(x||{}).filter(v=>v&&typeof v==='object')}
function clientKey(o){return o.clientId||String(o.clientName||'').trim().toLowerCase().replace(/\s+/g,'-')}
function delivered(o){return ['completed','delivered'].includes(String(o.status||''))||!!o.deliveredAt}
function territoryOf(o){return String(o.territory||o.city||o.clientTerritory||o.brief?.territory||o.brief?.city||'Nîmes').trim()||'Nîmes'}
function stageFor(t){const unique=t.clients.length,repeat=t.clients.filter(c=>c.orders>1||c.returns>0),prescribers=t.clients.filter(c=>c.referrals>0),refs=prescribers.reduce((n,c)=>n+c.referrals,0),referred=t.orders.filter(o=>o.source==='client-referral').length;let stage='first-clients',label='Premières clientes',sentence=`À ${t.name}, ton travail circule encore à petite échelle.`;if(unique>=2&&(refs>=1||referred>=1)){stage='word-of-mouth';label='Le bouche-à-oreille commence';sentence=`À ${t.name}, des clientes commencent à parler de ton travail sans que tu provoques chaque rencontre.`}if(unique>=4&&repeat.length>=1&&refs>=2){stage='local-clientele';label='Une clientèle se forme';sentence=`À ${t.name}, certaines clientes reviennent et d’autres arrivent par recommandation.`}if(unique>=7&&repeat.length>=2&&prescribers.length>=2){stage='known-address';label='Une adresse que l’on se transmet';sentence=`À ${t.name}, ton nom commence à circuler comme une adresse fiable dans plusieurs petits cercles.`}if(unique>=12&&repeat.length>=4&&prescribers.length>=4){stage='established-local';label='Une clientèle installée';sentence=`À ${t.name}, ta clientèle possède désormais sa propre mémoire : anciennes clientes, retours et recommandations se nourrissent.`}return{stage,label,sentence}}
function compute(){
 const done=orders().filter(delivered),after=read(A,{items:{}}),network=read(R,{people:{},edges:[]}),territories={};
 function terr(name){const key=String(name||'Nîmes').trim()||'Nîmes';return territories[key]||(territories[key]={name:key,orders:[],clients:[],byClient:{}})}
 for(const o of done){const t=terr(territoryOf(o)),k=clientKey(o);if(!k)continue;t.orders.push(o);const c=t.byClient[k]||(t.byClient[k]={id:k,name:o.clientName||'Cliente',orders:0,returns:0,transformations:0,referrals:0,lastAt:'',firstAt:o.createdAt||o.deliveredAt||'',territory:t.name});c.orders++;if(o.source==='client-returning')c.returns++;if(o.returnKind==='transform_old')c.transformations++;const at=o.deliveredAt||o.createdAt||'';if(!c.lastAt||new Date(at)>new Date(c.lastAt))c.lastAt=at}
 for(const t of Object.values(territories))t.clients=Object.values(t.byClient);
 for(const item of Object.values(after.items||{})){for(const t of Object.values(territories)){const k=item.clientId||String(item.clientName||'').trim().toLowerCase().replace(/\s+/g,'-'),c=t.byClient[k];if(!c)continue;for(const e of item.events||[])if(e.status==='done'&&e.type==='referral')c.referrals++}}
 for(const e of network.edges||[]){for(const t of Object.values(territories)){const c=t.byClient[e.from];if(c&&e.type==='referral')c.referrals=Math.max(c.referrals,1)}}
 const profiles=Object.values(territories).map(t=>{const st=stageFor(t),repeat=t.clients.filter(c=>c.orders>1||c.returns>0),prescribers=t.clients.filter(c=>c.referrals>0),strongest=t.clients.slice().sort((a,b)=>(b.orders+b.referrals*2+b.returns*2)-(a.orders+a.referrals*2+a.returns*2)).slice(0,4);return{name:t.name,...st,counts:{deliveredOrders:t.orders.length,clients:t.clients.length,repeatClients:repeat.length,repeatOrders:t.orders.filter(o=>o.source==='client-returning').length,referringClients:prescribers.length,referrals:prescribers.reduce((n,c)=>n+c.referrals,0),referredOrders:t.orders.filter(o=>o.source==='client-referral').length,transformingClients:t.clients.filter(c=>c.transformations>0).length},strongest}}).sort((a,b)=>(b.counts.clients+b.counts.repeatClients*2+b.counts.referrals*2)-(a.counts.clients+a.counts.repeatClients*2+a.counts.referrals*2));
 const primary=profiles[0]||{name:null,stage:'none',label:'Clientèle en construction',sentence:'Aucun territoire ne s’impose encore.',counts:{deliveredOrders:0,clients:0,repeatClients:0,repeatOrders:0,referringClients:0,referrals:0,referredOrders:0,transformingClients:0},strongest:[]};
 const totalClients=new Set(done.map(clientKey).filter(Boolean)).size;
 return{version:2,updatedAt:iso(),territories:profiles,primaryTerritory:primary.name,stage:primary.stage,label:primary.label,sentence:profiles.length>1?`${primary.sentence} D’autres foyers existent aussi : ${profiles.slice(1,4).map(x=>x.name).join(', ')}.`:primary.sentence,counts:{deliveredOrders:done.length,clients:totalClients,territories:profiles.length},strongest:primary.strongest};
}
function refresh(){const s=compute();write(KEY,s);window.dispatchEvent(new CustomEvent('hc-career-local-clientele',{detail:s}));return s}
function publicProfile(){const s=refresh();return{stage:s.stage,label:s.label,sentence:s.sentence,primaryTerritory:s.primaryTerritory,territories:s.territories.map(t=>({...t,counts:{...t.counts},strongest:t.strongest.map(x=>({...x}))})),counts:{...s.counts},strongest:s.strongest.map(x=>({...x}))}}
['hc-client-order','hc-client-aftercare-state','hc-client-aftercare-event','hc-client-referral-network-state','hc-fitting-delivered'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(refresh,60)));
setTimeout(refresh,250);
window.HCCareerLocalClienteleV1={version:2,compute,refresh,publicProfile,territoryOf,storageKey:KEY};
})();