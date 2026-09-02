/* Haute Couture Live — pont validation cliente -> moteur de production v1 */
(function(){
'use strict';
if(window.__HC_CLIENT_PRODUCTION_BRIDGE_V1__)return;window.__HC_CLIENT_PRODUCTION_BRIDGE_V1__=true;
const KEY='haute-couture-client-orders-v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')||[]}catch(e){return[]}},write=a=>{try{localStorage.setItem(KEY,JSON.stringify(a));return true}catch(e){return false}};
function approved(){return read().find(x=>x.status==='approved_for_production')||null}
function withLegacyStatus(fn){const o=approved();if(!o)return fn();const all=read(),i=all.findIndex(x=>x.id===o.id);if(i<0)return fn();all[i]={...all[i],status:'accepted',_clientApprovedProduction:true};write(all);let result;try{result=fn()}finally{const latest=read(),j=latest.findIndex(x=>x.id===o.id);if(j>=0&&latest[j].status==='accepted'&&latest[j]._clientApprovedProduction){latest[j]={...latest[j],status:'approved_for_production'};delete latest[j]._clientApprovedProduction;write(latest)}}return result}
function patch(){const e=window.HCAtelierRealisationEngine;if(!e||e.__clientApprovalPatched)return false;const can=e.canRealise?.bind(e),real=e.realise?.bind(e);if(can)e.canRealise=()=>withLegacyStatus(can);if(real)e.realise=()=>withLegacyStatus(real);e.__clientApprovalPatched=true;e.clientApprovalRequired=true;console.info('[Atelier] validation cliente branchée au moteur de production');return true}
let n=0;const t=setInterval(()=>{n++;if(patch()||n>80)clearInterval(t)},150);
window.addEventListener('hc-atelier-realisation-engine-ready',patch);
})();