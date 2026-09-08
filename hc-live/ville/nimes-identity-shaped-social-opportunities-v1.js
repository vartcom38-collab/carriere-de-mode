/* Haute Couture Live — Nîmes : opportunités sociales façonnées par l'identité pro v1 */
(function(){
'use strict';
if(window.HCNimesIdentityShapedSocialOpportunitiesV1)return;
const KEY='haute-couture-nimes-deferred-social-opportunities-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
function identity(){return window.HCCareerEmergentIdentityV1?.publicProfile?.()||read('haute-couture-career-emergent-identity-v1',{})||{stage:'open',top:null}}
function person(id){return (window.HCNimesPeople||[]).find(x=>x.id===id)||null}
const SOURCE_HINTS={
 'nimes-claire-vidal':['textile','craft'],
 'nimes-ines-barrot':['textile','craft'],
 'nimes-adel-benali':['structure','craft'],
 'nimes-clara-sorel':['textile','craft'],
 'nimes-gaspard-rouviere':['image','craft'],
 'nimes-lila-bresson':['image','collaboration'],
 'nimes-noe-carriere':['image','collaboration'],
 'nimes-victor-meunier':['image','collaboration'],
 'nimes-salma-cherif':['image','collaboration'],
 'nimes-pauline-rey':['heritage','cultural'],
 'nimes-sacha-maurel':['heritage','cultural'],
 'nimes-lea-ortiz':['heritage','cultural'],
 'nimes-manon-vial':['heritage','cultural'],
 'nimes-julie-mas':['heritage','cultural'],
 'nimes-maya-fabre':['ceremony','client'],
 'nimes-aurelie-perrin':['ceremony','client'],
 'nimes-hugo-vernet':['image','client'],
 'eloise-martin':['ceremony','client'],
 'nimes-romeo-blanc':['image','collaboration'],
 'nimes-nassim-garcia':['structure','collaboration']
};
const AXES={
 ceremony:{kind:'client',axis:'commande cérémonie',message:'une cliente ou un besoin habillé',place:['Café des Croquis','Rendez-vous cliente']},
 drape:{kind:'client',axis:'silhouette en mouvement',message:'une pièce où le tombé et le mouvement comptent vraiment',place:['Café des Croquis','Rendez-vous cliente']},
 structure:{kind:'collaboration',axis:'construction et volume',message:'un projet où la coupe et la structure seront au centre',place:['Café des Croquis','Musée de la Romanité']},
 textile:{kind:'craft',axis:'matière et savoir-faire',message:'un échange autour d’une matière, d’un geste ou d’un test textile',place:['Atelier de Claire Vidal','Mercerie','Brocante textile']},
 heritage:{kind:'cultural',axis:'patrimoine et création',message:'une proposition qui relie territoire, culture et création contemporaine',place:['Musée de la Romanité','Maison Carrée','Arènes de Nîmes']},
 image:{kind:'collaboration',axis:'image et éditorial',message:'un projet de shooting, d’image ou de mise en scène',place:['Jardins de la Fontaine','Café des Croquis','Musée de la Romanité']}
};
function chooseAxis(entry){const id=identity(),srcHints=SOURCE_HINTS[entry.sourceId]||[],targetHints=SOURCE_HINTS[entry.targetId]||[];const pool=[...srcHints,...targetHints];if(id.stage!=='open'&&id.top&&pool.includes(id.top))return id.top;if(pool[0]&&AXES[pool[0]])return pool[0];if(id.stage!=='open'&&id.top&&AXES[id.top])return id.top;return null}
function shape(entry){if(!entry||entry.meta?.identityShaped)return entry;const axisId=chooseAxis(entry),axis=axisId&&AXES[axisId];if(!axis)return entry;entry.kind=axis.kind;entry.topic=axis.axis;entry.meta={...(entry.meta||{}),identityShaped:true,identityAxis:axisId,identityLabel:axis.axis,identityMessage:axis.message,preferredPlaces:axis.place,sourcePerson:person(entry.sourceId)?.name||null,targetPerson:person(entry.targetId)?.name||null};return entry}
function reshapeQueued(){const s=read(KEY,{queue:[],delivered:[]});let changed=false;s.queue=(s.queue||[]).map(x=>{const before=JSON.stringify(x);shape(x);if(JSON.stringify(x)!==before)changed=true;return x});if(changed)write(KEY,s);return s}
window.addEventListener('hc-nimes-deferred-scheduled',e=>{const id=e.detail?.id;if(!id)return;const s=read(KEY,{queue:[]});const x=(s.queue||[]).find(v=>v.id===id);if(x){shape(x);write(KEY,s);window.dispatchEvent(new CustomEvent('hc-nimes-deferred-shaped',{detail:x}))}});
window.addEventListener('hc-career-identity',()=>setTimeout(reshapeQueued,30));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(reshapeQueued,250));else setTimeout(reshapeQueued,250);
window.HCNimesIdentityShapedSocialOpportunitiesV1={version:1,identity,chooseAxis,shape,reshapeQueued};
})();