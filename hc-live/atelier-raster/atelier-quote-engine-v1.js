/* Haute Couture Live — moteur de devis couture réaliste v1
   Source commune pour temps, matière, coût et prix conseillé.
*/
(function(){
'use strict';
if(window.HCAtelierQuoteEngine)return;
const K={board:'haute-couture-atelier-board-v2',sketch:'haute-couture-atelier-selected-sketch-v2',fabric:'haute-couture-atelier-selected-fabric-v1',orders:'haute-couture-client-orders-v1'};
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch(_){return f}};
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const round10=n=>Math.max(0,Math.round(Number(n||0)/10)*10),round1=n=>Math.round(Number(n||0)*10)/10;
function activeOrder(){return read(K.orders,[]).find(x=>!['delivered','completed','cancelled'].includes(x.status))||null}
function words(){const b=read(K.board,{})||{},s=read(K.sketch,{})||{},o=activeOrder()||{};const pieces=[...(b.pieces||[]),...(b.components||[])];return norm([pieces.map(x=>x.name||x.category||x.moodKind).join(' '),s.name,s.direction,o.garment,o.brief?.style,o.notes,(b.notes||[]).map(x=>x.noteText||x.name).join(' ')].join(' '))}
function garmentBase(text,pieces){let hours=0,meters=0,labels=[];const add=(rx,h,m,l)=>{if(rx.test(text)){hours+=h;meters+=m;labels.push(l)}};
 add(/t[- ]?shirt|tee|top|haut|debardeur/,8,1.2,'haut');
 add(/chemise|blouse/,12,1.8,'chemise/blouse');
 add(/jupe/,11,1.8,'jupe');
 add(/pantalon/,14,2.2,'pantalon');
 add(/robe/,22,3.2,'robe');
 add(/veste|blazer|tailleur/,30,3.0,'veste tailleur');
 add(/manteau|trench/,36,3.8,'manteau');
 add(/corset|bustier/,28,1.8,'corseterie');
 add(/cape/,18,2.8,'cape');
 if(!hours){const n=Math.max(1,pieces.length||1);hours=10+n*5;meters=1.4+n*.7;labels.push(n>1?'ensemble sur mesure':'pièce sur mesure')}
 return{hours,meters,labels};}
function complexity(text){let h=0,supplies=0,score=1,features=[];const add=(rx,hh,ss,label,pts=1)=>{if(rx.test(text)){h+=hh;supplies+=ss;score+=pts;features.push(label)}};
 add(/drap|drape|drapé/,6,12,'drapé'); add(/asym/,3,4,'asymétrie'); add(/pliss|plissé/,7,18,'plissé'); add(/broder/,16,45,'broderie',2); add(/perle|strass|bijou|ornement/,12,65,'ornements',2); add(/dentelle/,7,35,'dentelle'); add(/plume/,10,55,'plumes',2); add(/traine|traîne/,6,20,'traîne'); add(/baleine|corset/,8,28,'baleines/corseterie'); add(/doublure|double/,5,18,'doublure'); add(/main|haute couture|finition main/,8,25,'finitions main',2); add(/soie|satin|tulle|organza|mousseline/,3,12,'matière délicate');
 return{hours:h,supplies,score:Math.min(5,score),features};}
function modeFactor(mode){if(mode==='rapide')return{time:.82,rate:32,overhead:.10,margin:.18,label:'Rapide'};if(mode==='couture')return{time:1.28,rate:52,overhead:.16,margin:.32,label:'Haute couture'};return{time:1,rate:42,overhead:.13,margin:.25,label:'Soignée'}}
function estimate(opts={}){const b=read(K.board,{pieces:[],components:[]})||{},s=read(K.sketch,null)||window.__HC_SELECTED_SKETCH__||null,f=read(K.fabric,null),o=activeOrder()||{};const pieces=b.pieces?.length?b.pieces:(b.components||[]).filter(x=>!x.moodKind||x.moodKind==='reference');const text=words();const g=garmentBase(text,pieces),c=complexity(text),mode=opts.mode||o.proposal?.workMode||'soigne',mf=modeFactor(mode);
 const fittingHours=o?2.5:1,patternHours=Math.max(3,Math.round((g.hours+c.hours)*.18)),prepHours=2,workHours=round1((g.hours+c.hours+patternHours+fittingHours+prepHours)*mf.time);
 const meters=round1(Math.max(1.2,(g.meters+c.score*.18)*(mode==='couture'?1.08:1)));
 let meterPrice=Number(f?.meter||f?.pricePerMeter||f?.price||0);if(!meterPrice){if(/soie|satin|organza|mousseline/.test(text))meterPrice=75;else if(/dentelle/.test(text))meterPrice=95;else if(/laine|cachemire/.test(text))meterPrice=85;else meterPrice=38}
 const materialCost=round10(meters*meterPrice),suppliesCost=round10(35+c.supplies+(pieces.length>1?20:0)),laborCost=round10(workHours*mf.rate),directCost=materialCost+suppliesCost+laborCost,atelierOverhead=round10(directCost*mf.overhead),subtotal=directCost+atelierOverhead,margin=round10(subtotal*mf.margin),price=round10(subtotal+margin);
 const calendarDays=Math.max(4,Math.ceil(workHours/5)+2+(mode==='couture'?3:mode==='rapide'?0:1));
 return{version:1,sketch:s,mode,modeLabel:mf.label,pieces,complexity:c.score,features:c.features,workHours,minutes:Math.round(workHours*60),meters,meterPrice,materialCost,suppliesCost,laborRate:mf.rate,laborCost,atelierOverhead,margin,price,deliveryDays:calendarDays,breakdown:{patronageHours:patternHours,fittingHours,prepHours,constructionHours:round1(g.hours+c.hours),garmentLabels:g.labels},currency:'EUR'}
 function mount(){const h=document.getElementById('hcClientWorkflowV2');if(!h)return;const mode=h.querySelector('#hcCw2Mode')?.value||'soigne',q=estimate({mode});const price=h.querySelector('#hcCw2Price'),days=h.querySelector('#hcCw2Days');if(price&&!price.dataset.hcQuoteTouched){price.value=q.price;price.dataset.hcQuoteGenerated='1'}if(days&&!days.dataset.hcQuoteTouched){days.value=q.deliveryDays;days.dataset.hcQuoteGenerated='1'}price?.addEventListener('input',()=>price.dataset.hcQuoteTouched='1',{once:true});days?.addEventListener('input',()=>days.dataset.hcQuoteTouched='1',{once:true});
  let box=h.querySelector('#hcQuoteBreakdown');if(!box){box=document.createElement('div');box.id='hcQuoteBreakdown';const actions=h.querySelector('.hc-cw2-actions');actions?.parentNode.insertBefore(box,actions)}if(box)box.innerHTML=`<div style="margin-top:11px;border:1px solid #e1d5cc;border-radius:14px;background:#fff;padding:12px"><div style="font:900 8px Arial;letter-spacing:.12em;color:#a56f5c">DEVIS CALCULÉ PAR L’ATELIER</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:9px;font:11px Georgia,serif"><div><b>${q.workHours} h</b><br>travail estimé</div><div><b>${q.meters} m</b><br>matière principale</div><div><b>${q.complexity}/5</b><br>complexité</div><div><b>${q.materialCost} €</b><br>matières</div><div><b>${q.suppliesCost} €</b><br>fournitures</div><div><b>${q.laborCost} €</b><br>main-d’œuvre</div><div><b>${q.atelierOverhead} €</b><br>frais atelier</div><div><b>${q.margin} €</b><br>marge</div><div><b>${q.price} €</b><br>prix conseillé</div></div>${q.features.length?`<div style="margin-top:8px;font:10px/1.45 Georgia,serif;color:#6e5d54">Complexité détectée : ${q.features.join(' · ')}</div>`:''}</div>`;
 }
 function refresh(){setTimeout(mount,30)}
 document.addEventListener('input',e=>{if(e.target?.id==='hcCw2Mode'){const p=document.getElementById('hcCw2Price'),d=document.getElementById('hcCw2Days');if(p){delete p.dataset.hcQuoteTouched}if(d){delete d.dataset.hcQuoteTouched}refresh()}},true);
 window.addEventListener('hc-atelier-sketch-selected',refresh);window.addEventListener('hc-client-order',refresh);window.addEventListener('hc-atelier-moodboard-changed',refresh);window.addEventListener('hc-atelier-fabric-selected',refresh);
 setTimeout(mount,1400);window.HCAtelierQuoteEngine={version:1,estimate,mount,refresh};
})();