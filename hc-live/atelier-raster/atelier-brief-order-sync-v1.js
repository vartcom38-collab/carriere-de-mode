/* Haute Couture Live — sync brief visible -> commande active v1 */
(function(){
'use strict';
if(window.__HC_BRIEF_ORDER_SYNC_V1__)return;window.__HC_BRIEF_ORDER_SYNC_V1__=true;
const KEY='haute-couture-client-orders-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch(_){return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(_){return false}};
const norm=s=>String(s||'').replace(/\s+/g,' ').trim();
function active(){return read(KEY,[]).find(x=>!['delivered','completed','cancelled'].includes(x.status))||null}
function rows(){const out={};document.querySelectorAll('.briefRow').forEach(r=>{const k=norm(r.querySelector('b')?.textContent).replace(/:$/,''),v=norm(r.querySelector('span')?.textContent||r.textContent.replace(r.querySelector('b')?.textContent||'',''));if(k&&v)out[k]=v});return out}
function num(s){const m=String(s||'').replace(/\s/g,'').match(/(\d+(?:[.,]\d+)?)/);return m?Number(m[1].replace(',','.')):0}
function makeFromVisibleBrief(){if(active())return null;const vals=rows();const clientName=norm(document.querySelector('.client')?.textContent||document.querySelector('.hc-order-name')?.textContent||document.querySelector('[data-client-name]')?.getAttribute('data-client-name'));
 const garment=vals['Vêtement']||vals['Pièce']||vals['Demande']||'';
 const occasion=vals['Occasion']||norm((document.querySelector('.meta')?.textContent||'').split('·')[0]);
 const style=vals['Style']||'';
 const palette=vals['Palette']||vals['Couleurs']||'';
 const avoid=vals['À éviter']||'';
 const materials=vals['Matières']||vals['Matière']||'';
 const budget=num(vals['Budget']);
 const reward=num(vals['Rémunération']);
 const notes=norm(document.querySelector('#clientNotes')?.value||document.querySelector('.quote')?.textContent||document.querySelector('.hc-order-quote')?.textContent);
 const visibleBrief=!!document.querySelector('.brief,.hcv3-brief-host,#hcActiveClientOrder');
 if(!visibleBrief||(!clientName&&!garment&&!notes))return null;
 const o={id:'brief-order-'+Date.now(),clientName:clientName||'Cliente',clientRole:'Cliente',garment:garment||'Création sur mesure',occasion,notes,budget,reward,estimatedMinutes:300,status:'accepted',progress:'brief_received',brief:{style,paletteLiked:palette?[palette]:[],paletteAvoid:avoid?[avoid]:[],materialsPreferred:materials?[materials]:[]},source:'visible-brief-sync',createdAt:new Date().toISOString()};
 const arr=read(KEY,[]);write(KEY,[o,...arr].slice(0,100));window.dispatchEvent(new CustomEvent('hc-client-order',{detail:o}));console.info('[Atelier] brief visible synchronisé en commande active',o);return o}
 function sync(){const o=makeFromVisibleBrief();if(o)window.HCAtelierClientWorkflow?.render?.()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(sync,1000));else setTimeout(sync,1000);
 window.addEventListener('hc-atelier-sketch-selected',()=>setTimeout(sync,40));
 const mo=new MutationObserver(()=>{if(!active())setTimeout(sync,80)});setTimeout(()=>mo.observe(document.body,{childList:true,subtree:true}),700);
 window.HCAtelierBriefOrderSync={version:1,sync,active};
})();