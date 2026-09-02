/* Haute Couture Live — quote -> production preflight bridge v1 */
(function(){
'use strict';
function install(){const q=window.HCAtelierQuoteEngine,p=window.HCAtelierRealisationPreflight;if(!q||!p){setTimeout(install,120);return}if(p.__hcQuoteBridge)return;p.__hcQuoteBridge=true;const old=p.estimate.bind(p);p.estimate=function(){const base=old()||{},quote=q.estimate({mode:(JSON.parse(localStorage.getItem('haute-couture-client-orders-v1')||'[]').find(x=>!['delivered','completed','cancelled'].includes(x.status))?.proposal?.workMode)||'soigne'});return{...base,complexity:quote.complexity,minutes:quote.minutes,meters:quote.meters,quote,ready:base.ready,warnings:base.warnings||[]}};console.info('[Atelier] devis réaliste branché au préflight de réalisation')}
setTimeout(install,500);
})();