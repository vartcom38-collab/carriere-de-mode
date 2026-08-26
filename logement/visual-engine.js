/* Haute Couture Live — passerelle logement racine vers les annonces réelles ChercherTrouver. */
(function(){
'use strict';
if(window.HCVisualEngine?.mode==='real-listings-root-bridge')return;
const BUILD='20260826-root-real-housing1';
const CURRENT_ENDPOINT='https://carriere-de-mode-visuals.vercel.app/api/real-estate-listings';
const FEED='../hc-live/logement/real-estate-live-feed-v1.js';

function purgeLegacy(){
  try{
    localStorage.removeItem('haute-couture-housing-spatial-market-v1');
    localStorage.removeItem('haute-couture-housing-gallery-assignments-v1');
    localStorage.removeItem('haute-couture-real-listings-cache-v2');
    localStorage.removeItem('haute-couture-real-listings-cache-v3');
    localStorage.setItem('haute-couture-real-estate-api-endpoint',CURRENT_ENDPOINT);
  }catch(e){}
}

function neutralizeLabels(){
  document.querySelectorAll('#detailModal .thumb').forEach((th,i)=>{
    const span=th.querySelector('span');
    if(span)span.textContent=`Photo ${i+1}`;
  });
}

function loadFeed(){
  if(window.HCRealEstateLiveFeed)return Promise.resolve(window.HCRealEstateLiveFeed);
  return new Promise((resolve,reject)=>{
    const existing=document.querySelector('script[data-hc-root-real-estate-feed]');
    if(existing){
      let n=0;const t=setInterval(()=>{n++;if(window.HCRealEstateLiveFeed){clearInterval(t);resolve(window.HCRealEstateLiveFeed)}else if(n>120){clearInterval(t);reject(new Error('real_estate_feed_timeout'))}},50);return;
    }
    const s=document.createElement('script');
    s.src=FEED+'?v='+BUILD;
    s.defer=true;
    s.setAttribute('data-hc-root-real-estate-feed','1');
    s.onload=()=>resolve(window.HCRealEstateLiveFeed);
    s.onerror=()=>reject(new Error('real_estate_feed_load_failed'));
    document.head.appendChild(s);
  });
}

async function boot(){
  purgeLegacy();
  neutralizeLabels();
  const observer=new MutationObserver(neutralizeLabels);
  try{observer.observe(document.getElementById('detailModal')||document.body,{subtree:true,childList:true,characterData:true})}catch(e){}
  try{
    const feed=await loadFeed();
    if(feed){
      try{feed.configure(CURRENT_ENDPOINT)}catch(e){}
      try{feed.reset()}catch(e){}
      let n=0;const t=setInterval(()=>{
        n++;
        try{
          if(typeof st!=='undefined'&&typeof stock==='function'&&typeof openListingDetail==='function'){
            clearInterval(t);
            feed.fetchCity(true).then(()=>{try{if(typeof side==='function')side();if(typeof drawListings==='function'&&st.level==='listing')drawListings()}catch(e){}});
          }else if(n>160)clearInterval(t);
        }catch(e){if(n>160)clearInterval(t)}
      },50);
    }
  }catch(e){console.error('HC real housing bridge',e)}
}

window.HCVisualEngine={build:BUILD,mode:'real-listings-root-bridge',purgeLegacy,neutralizeLabels};
if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
