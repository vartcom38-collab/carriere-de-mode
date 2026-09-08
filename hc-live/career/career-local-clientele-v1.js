/* Haute Couture Live — clientèle locale vécue v1
   Pas de jauge publique : déduit une présence professionnelle locale à partir des clientes réellement livrées,
   de leurs retours, recommandations et liens persistants. */
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
function compute(){
 const done=orders().filter(delivered),by={},after=read(A,{items:{}}),network=read(R,{people:{},edges:[]});
 for(const o of done){const k=clientKey(o);if(!k)continue;const c=by[k]||(by[k]={id:k,name:o.clientName||'Cliente',orders:0,returns:0,transformations:0,referrals:0,lastAt:'',firstAt:o.createdAt||o.deliveredAt||''});c.orders++;if(o.source==='client-returning')c.returns++;if(o.returnKind==='transform_old')c.transformations++;const at=o.deliveredAt||o.createdAt||'';if(!c.lastAt||new Date(at)>new Date(c.lastAt))c.lastAt=at}
 for(const item of Object.values(after.items||{})){const k=item.clientId||String(item.clientName||'').trim().toLowerCase().replace(/\s+/g,'-'),c=by[k];if(!c)continue;for(const e of item.events||[])if(e.status==='done'&&e.type==='referral')c.referrals++}
 for(const e of network.edges||[]){const c=by[e.from];if(c&&e.type==='referral')c.referrals=Math.max(c.referrals,1)}
 const clients=Object.values(by),repeat=clients.filter(c=>c.orders>1||c.returns>0),prescribers=clients.filter(c=>c.referrals>0),transforming=clients.filter(c=>c.transformations>0);
 const referredOrders=done.filter(o=>o.source==='client-referral').length;
 const total=done.length,unique=clients.length,repeatOrders=done.filter(o=>o.source==='client-returning').length,referrals=prescribers.reduce((n,c)=>n+c.referrals,0);
 let stage='first-clients',label='Premières clientes',sentence='Ton travail circule encore surtout de personne à personne, à petite échelle.';
 if(unique>=2&&(referrals>=1||referredOrders>=1)){stage='word-of-mouth';label='Le bouche-à-oreille commence';sentence='Des clientes commencent à parler de ton travail sans que tu aies besoin de provoquer chaque rencontre.'}
 if(unique>=4&&repeat.length>=1&&referrals>=2){stage='local-clientele';label='Une clientèle locale se forme';sentence='À Nîmes, plusieurs personnes ne te voient plus seulement comme une créatrice découverte une fois : elles reviennent ou te recommandent.'}
 if(unique>=7&&repeat.length>=2&&prescribers.length>=2){stage='known-address';label='Une adresse que l’on se transmet';sentence='Ton nom commence à circuler comme une adresse fiable dans plusieurs petits cercles locaux.'}
 if(unique>=12&&repeat.length>=4&&prescribers.length>=4){stage='established-local';label='Une clientèle nîmoise installée';sentence='Ta clientèle possède maintenant sa propre mémoire : anciennes clientes, recommandations et nouvelles commandes se nourrissent les unes des autres.'}
 const strongest=clients.slice().sort((a,b)=>(b.orders+b.referrals*2+b.returns*2)-(a.orders+a.referrals*2+a.returns*2)).slice(0,4);
 return{version:1,updatedAt:iso(),stage,label,sentence,territory:'Nîmes',counts:{deliveredOrders:total,clients:unique,repeatClients:repeat.length,repeatOrders,referringClients:prescribers.length,referrals,referredOrders,transformingClients:transforming.length},strongest};
}
function refresh(){const s=compute();write(KEY,s);window.dispatchEvent(new CustomEvent('hc-career-local-clientele',{detail:s}));return s}
function publicProfile(){const s=refresh();return{stage:s.stage,label:s.label,sentence:s.sentence,counts:{...s.counts},strongest:s.strongest.map(x=>({...x}))}}
['hc-client-order','hc-client-aftercare-state','hc-client-aftercare-event','hc-client-referral-network-state','hc-fitting-delivered'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(refresh,60)));
setTimeout(refresh,250);
window.HCCareerLocalClienteleV1={version:1,compute,refresh,publicProfile,storageKey:KEY};
})();