/* Haute Couture Live — identité professionnelle émergente v1 */
(function(){
'use strict';
if(window.HCCareerEmergentIdentityV1)return;
const KEY='haute-couture-career-emergent-identity-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
const game=()=>window.HCGame?.get?.()||{};
function origin(){return window.HCCareerOriginV1?.get?.()||read('haute-couture-start-path-v1',{})||{}}
function collect(){
 const signals=[];
 const book=read('haute-couture-book-v1',{items:[]});
 for(const x of (book.items||[])){
  const tags=[...(x.tags||[]),...(x.materials||[]),...(x.motifs||[]),...(x.silhouettes||[])].map(v=>String(typeof v==='string'?v:(v.name||v.title||'')).toLowerCase());
  signals.push(...tags.map(tag=>({tag,source:'book',weight:x.favorite?3:1})));
 }
 const skills=read('haute-couture-atelier-unlocks-v1',[]);
 for(const s of skills){const label=String(s.name||s.label||s.title||s.id||'').toLowerCase();if(label)signals.push({tag:label,source:'technique',weight:3})}
 const orders=read('haute-couture-client-orders-v1',{});for(const o of Object.values(orders||{})){if(!o||typeof o!=='object')continue;const text=[o.title,o.brief,o.category,o.type,o.notes].filter(Boolean).join(' ').toLowerCase();if(text)signals.push({tag:text,source:'client',weight:['completed','fitting_ok'].includes(o.status)?3:1})}
 const rel=read('haute-couture-client-relations-v1',{});for(const [id,r] of Object.entries(rel||{})){if((r?.trust||0)>0)signals.push({tag:'clientèle fidèle '+id,source:'client',weight:2})}
 const social=read('haute-couture-nimes-social-consequences-v1',{});for(const e of (social.records||social.history||[]).slice(-40)){const text=[e.type,e.topic,e.context,e.note].filter(Boolean).join(' ').toLowerCase();if(text)signals.push({tag:text,source:'network',weight:1})}
 return signals;
}
const THEMES=[
 {id:'ceremony',label:'pièces de cérémonie et silhouettes habillées',words:['gala','cérémon','mariage','soir','robe','spectaculaire']},
 {id:'drape',label:'drapés, mouvement et matières fluides',words:['drap','fluide','mousseline','soie','voile','satin']},
 {id:'structure',label:'construction nette et silhouettes architecturées',words:['tailoring','structur','architecture','gabardine','coupe','patron','volume']},
 {id:'textile',label:'matières, surface et savoir-faire textile',words:['textile','boutis','brod','matière','tissu','teinture','surface','artisan']},
 {id:'heritage',label:'traduction contemporaine du patrimoine',words:['roman','patrimoine','mosaïque','antique','nîmes','camargue','architecture']},
 {id:'image',label:'pièces pensées avec une forte dimension image',words:['photo','éditorial','shoot','image','ateliergram','presse']}
];
function compute(){const signals=collect(),scores={};THEMES.forEach(t=>scores[t.id]=0);for(const s of signals){for(const t of THEMES){if(t.words.some(w=>s.tag.includes(w)))scores[t.id]+=Number(s.weight||1)}}const ranked=THEMES.map(t=>({...t,score:scores[t.id]})).sort((a,b)=>b.score-a.score);const top=ranked[0],second=ranked[1];let stage='open',sentence='Ta pratique reste encore ouverte. Rien ne te définit assez nettement pour fermer des portes.';if(top.score>=5){stage=top.score>=10&&top.score>=second.score+3?'distinct':'emerging';sentence=stage==='distinct'?`Ton travail commence à être clairement associé à ${top.label}.`:`Une direction revient souvent dans ton parcours : ${top.label}. Elle n’est pas encore une étiquette, mais elle devient reconnaissable.`}return{version:1,updatedAt:game()?.clock?.iso||new Date().toISOString(),origin:origin()?.type||origin()?.origin||'direct',stage,sentence,top:top?.id||null,ranked:ranked.map(x=>({id:x.id,label:x.label,score:x.score})),signalCount:signals.length}}
function refresh(){const s=compute();write(KEY,s);window.dispatchEvent(new CustomEvent('hc-career-identity',{detail:s}));return s}
function publicProfile(){const s=refresh();return{stage:s.stage,sentence:s.sentence,top:s.top,secondary:s.ranked.filter(x=>x.score>0).slice(1,3).map(x=>x.label)}}
['hc-book-state','hc-client-order','hc-skill-unlock','hc-atelier-unlock','hc-nimes-social-message','hc-territorial-encounter'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(refresh,50)));
window.HCCareerEmergentIdentityV1={version:1,collect,compute,refresh,publicProfile,storageKey:KEY};
})();