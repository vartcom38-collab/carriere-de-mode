/* Haute Couture Live — devis couture v2 : styliste + confection + notoriété */
(function(){
'use strict';
const base=()=>window.HCAtelierQuoteEngine?.estimate?.({mode:document.getElementById('hcCw2Mode')?.value||'soigne'})||null;
const round10=n=>Math.max(0,Math.round(Number(n||0)/10)*10);
function estimate(opts={}){
 const raw=window.__HC_QUOTE_V1_ESTIMATE__?window.__HC_QUOTE_V1_ESTIMATE__(opts):base();
 if(!raw)return null;
 const wf=window.HCAtelierWorkforcePlanning;
 const worker=wf?.selected?.()||{id:'self',name:'Moi-même',type:'self',rate:0,speed:1};
 const creativeHours=wf?.creativeHours?.(raw.workHours)||Math.max(3,raw.workHours*.24);
 const sewingHours=wf?.sewingHours?.(raw.workHours)||Math.max(0,raw.workHours-creativeHours);
 const stylistRate=wf?.stylistRate?.()||32;
 const reputation=wf?.reputation?.()||0;
 const mode=opts.mode||raw.mode||'soigne';
 const creativeFee=round10(creativeHours*stylistRate);
 const selfSewRate=mode==='couture' ? 44 : (mode==='rapide' ? 28 : 34);
 const sewingCost=worker.type==='self' ? round10(sewingHours*selfSewRate) : round10(sewingHours*Number(worker.rate||0));
 const overheadRate=mode==='couture' ? .16 : (mode==='rapide' ? .10 : .13);
 const atelierOverhead=round10((raw.materialCost+raw.suppliesCost+creativeFee+sewingCost)*overheadRate);
 const subtotal=raw.materialCost+raw.suppliesCost+creativeFee+sewingCost+atelierOverhead;
 const marginRate=mode==='couture' ? .30 : (mode==='rapide' ? .18 : .24);
 const margin=round10(subtotal*marginRate);
 const signature=Math.max(0,round10(reputation>=50 ? subtotal*Math.min(.35,reputation/900) : 0));
 const price=round10(subtotal+margin+signature);
 const speed=Math.max(.6,Number(worker.speed||1));
 const productionDays=Math.max(2,Math.ceil((sewingHours/speed)/5));
 const deliveryDays=Math.max(raw.deliveryDays,productionDays+3);
 return{...raw,version:2,worker,creativeHours:Math.round(creativeHours*10)/10,sewingHours:Math.round(sewingHours*10)/10,stylistRate,reputation,creativeFee,sewingCost,atelierOverhead,margin,signature,price,deliveryDays};
}
function mount(){
 const h=document.getElementById('hcClientWorkflowV2');
 if(!h)return;
 window.HCAtelierWorkforcePlanning?.mount?.();
 const mode=h.querySelector('#hcCw2Mode')?.value||'soigne';
 const q=estimate({mode});
 if(!q)return;
 const p=h.querySelector('#hcCw2Price'),d=h.querySelector('#hcCw2Days');
 if(p&&!p.dataset.hcQuoteTouched)p.value=q.price;
 if(d&&!d.dataset.hcQuoteTouched)d.value=q.deliveryDays;
 let box=h.querySelector('#hcQuoteBreakdown');
 if(!box){box=document.createElement('div');box.id='hcQuoteBreakdown';const actions=h.querySelector('.hc-cw2-actions');if(actions)actions.parentNode.insertBefore(box,actions)}
 if(!box)return;
 box.innerHTML=`<div style="margin-top:11px;border:1px solid #e1d5cc;border-radius:14px;background:#fff;padding:12px"><div style="font:900 8px Arial;letter-spacing:.12em;color:#a56f5c">DEVIS PROFESSIONNEL DE L'ATELIER</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:9px;font:11px Georgia,serif"><div><b>${q.workHours} h</b><br>travail total</div><div><b>${q.creativeHours} h</b><br>direction styliste</div><div><b>${q.sewingHours} h</b><br>confection</div><div><b>${q.materialCost} €</b><br>matières</div><div><b>${q.suppliesCost} €</b><br>fournitures</div><div><b>${q.creativeFee} €</b><br>création · ${q.stylistRate} €/h</div><div><b>${q.sewingCost} €</b><br>${q.worker.type==='self'?'confection interne':q.worker.name}</div><div><b>${q.atelierOverhead} €</b><br>frais atelier</div><div><b>${q.margin} €</b><br>marge</div>${q.signature?`<div><b>${q.signature} €</b><br>valeur de signature</div>`:''}<div><b>${q.deliveryDays} j</b><br>délai conseillé</div><div><b>${q.price} €</b><br>prix conseillé</div></div><div style="margin-top:8px;font:10px/1.45 Georgia,serif;color:#6e5d54">Notoriété : ${q.reputation} · ${q.worker.type==='self'?'Fabrication par toi-même':`Fabrication confiée à ${q.worker.name}`}. Le taux de création augmente avec ta réputation ; le tarif de la couturière dépend de son propre profil.</div></div>`;
}
function refresh(){setTimeout(mount,30)}
let tries=0;
const t=setInterval(()=>{
 tries++;
 if(window.HCAtelierQuoteEngine?.estimate&&window.HCAtelierQuoteEngine.version===1){
   window.__HC_QUOTE_V1_ESTIMATE__=window.HCAtelierQuoteEngine.estimate.bind(window.HCAtelierQuoteEngine);
   window.HCAtelierQuoteEngine={version:2,estimate,mount,refresh};
   clearInterval(t);
   mount();
 } else if(tries>80)clearInterval(t);
},80);
window.addEventListener('hc-atelier-workforce-changed',refresh);
window.addEventListener('hc-game-state',refresh);
})();