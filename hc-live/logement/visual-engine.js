/* Haute Couture Live — logement fluide + photos réelles + adresses/carte légères. */
(function(){
  const BUILD='20260826-real-housing-feed5';
  const CURRENT_ENDPOINT='https://carriere-de-mode-visuals.vercel.app/api/real-estate-listings';
  let installed=false,depsReady=false,queueRunning=false,addressRunning=false;
  const queued=new Set(),attempted=new Set();

  function $(id){return document.getElementById(id)}
  function items(){try{return typeof stock==='function'?stock():[]}catch(e){return[]}}
  function selectedListing(){try{return items().find(x=>String(x.id)===String(st.listing))||null}catch(e){return null}}
  function context(x){return{city:(typeof st!=='undefined'&&st.city)||x.city||'',region:(typeof st!=='undefined'&&st.region)||x.region||'',district:x.district||''}}

  function purgeLegacyHousing(){
    try{
      localStorage.removeItem('haute-couture-housing-spatial-market-v1');
      localStorage.removeItem('haute-couture-housing-gallery-assignments-v1');
      localStorage.removeItem('haute-couture-real-listings-cache-v2');
      const ep=String(localStorage.getItem('haute-couture-real-estate-api-endpoint')||'');
      if(!ep||/vartcom38-7358s-projects\.vercel\.app/i.test(ep))localStorage.setItem('haute-couture-real-estate-api-endpoint',CURRENT_ENDPOINT);
    }catch(e){}
  }

  function neutralizeLegacyGallery(){
    const thumbs=[...document.querySelectorAll('#detailModal .thumb')];
    thumbs.forEach((th,i)=>{const span=th.querySelector('span');if(span)span.textContent=`Photo ${i+1}`});
    const main=$('mainVisual');
    if(main&&main.classList.contains('gallery-illustration')){
      main.style.position='absolute';main.style.inset='0';
    }
  }

  function loadScript(src,test){return new Promise((resolve,reject)=>{if(test())return resolve();const s=document.createElement('script');s.src=src+'?v='+BUILD;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
  async function loadDeps(){
    if(depsReady)return true;
    try{
      await loadScript('./visual-dna.js',()=>!!window.HCVisualDNA);
      await loadScript('./visual-service.js',()=>!!window.HCVisualService);
      await loadScript('./real-estate-live-feed-v1.js',()=>!!window.HCRealEstateLiveFeed);
      depsReady=!!(window.HCVisualDNA&&window.HCVisualService&&window.HCRealEstateLiveFeed);
      if(depsReady){
        try{window.HCRealEstateLiveFeed.configure(CURRENT_ENDPOINT)}catch(e){}
        try{window.HCRealEstateLiveFeed.reset()}catch(e){}
      }
    }catch(e){console.error('HC photos: dépendances indisponibles',e);depsReady=false}
    return depsReady;
  }

  function ensureStyles(){
    if($('hc-photo-queue-css'))return;
    const s=document.createElement('style');s.id='hc-photo-queue-css';s.textContent=`
      .listing.hc-photo-card{display:grid!important;grid-template-columns:92px minmax(0,1fr)!important;gap:10px!important;align-items:center!important}
      .hc-photo-slot{height:76px;border-radius:10px;overflow:hidden;background:linear-gradient(135deg,#f7eadc,#e7ceb9 48%,#c7d5bc);display:grid;place-items:center;text-align:center;padding:7px;font:900 8px/1.2 Arial,sans-serif;letter-spacing:.07em;color:#725d53}
      .hc-photo-slot img{width:100%;height:100%;display:block;object-fit:cover}
      .hc-photo-copy{min-width:0}
      @media(max-width:760px){.listing.hc-photo-card{grid-template-columns:78px minmax(0,1fr)!important}.hc-photo-slot{height:68px}}
    `;document.head.appendChild(s)
  }

  function hydrate(x){try{return window.HCVisualDNA.hydrate(x,context(x))}catch(e){return null}}
  function cachedUrl(x){
    if(x?.realListing&&x.gallery?.[0]?.url)return x.gallery[0].url;
    const v=hydrate(x);if(!v)return'';
    if(v.assets&&v.assets.mainImage)return v.assets.mainImage;
    try{const c=window.HCVisualService.getCached(v.visualSeed,'main');return c&&c.url?c.url:''}catch(e){return''}
  }

  function slotForCard(card){
    if(!card)return null;
    let slot=card.querySelector(':scope > .hc-photo-slot');if(slot)return slot;
    const copy=document.createElement('div');copy.className='hc-photo-copy';
    while(card.firstChild)copy.appendChild(card.firstChild);
    slot=document.createElement('div');slot.className='hc-photo-slot';slot.textContent='PHOTO À VENIR';
    card.appendChild(slot);card.appendChild(copy);card.classList.add('hc-photo-card');
    return slot
  }
  function setSlot(slot,text){if(slot)slot.textContent=text}
  function setImage(slot,url){if(slot&&url)slot.innerHTML=`<img src="${url}" alt="Photo réelle du logement">`}
  function cardFor(id){return document.querySelector(`.listing[data-id="${CSS.escape(String(id))}"]`)}

  function decorateCards(){
    ensureStyles();
    const list=items();
    document.querySelectorAll('.listing[data-id]').forEach(card=>{
      const x=list.find(v=>String(v.id)===String(card.dataset.id));if(!x)return;
      const slot=slotForCard(card),url=depsReady?cachedUrl(x):'';
      if(url)setImage(slot,url);else if(attempted.has(String(x.id)))setSlot(slot,'PHOTO EN ATTENTE');else setSlot(slot,'PHOTO À VENIR');
    })
  }

  function showMain(url){
    const m=$('mainVisual');if(!m)return;
    if(url){m.className='';m.style.position='absolute';m.style.inset='0';m.innerHTML=`<img src="${url}" alt="Photo réelle du logement" style="width:100%;height:100%;display:block;object-fit:cover">`}
    else{m.style.position='absolute';m.style.inset='0';m.className='gallery-illustration';m.innerHTML=''}
  }

  async function generateOne(x){
    if(!x||!depsReady)return;
    const id=String(x.id),card=cardFor(id),slot=slotForCard(card);
    const existing=cachedUrl(x);if(existing){setImage(slot,existing);return}
    if(x.realListing)return;
    if(attempted.has(id))return;
    attempted.add(id);setSlot(slot,'PHOTO EN CHARGEMENT…');
    try{
      const out=await window.HCVisualService.request(x,context(x),'main');
      if(out&&out.url){
        setImage(slot,out.url);
        try{if(String(st.listing)===id&&$('detailModal')?.classList.contains('open'))showMain(out.url)}catch(e){}
      }else setSlot(slot,'PHOTO EN ATTENTE');
    }catch(e){console.error('HC housing photo',id,e);setSlot(slot,'PHOTO INDISPONIBLE')}
  }

  async function runQueue(){
    if(queueRunning||!depsReady)return;queueRunning=true;
    try{
      while(queued.size){
        const id=queued.values().next().value;queued.delete(id);
        const x=items().find(v=>String(v.id)===String(id));
        if(x)await generateOne(x);
        await new Promise(r=>setTimeout(r,350));
      }
    }finally{queueRunning=false}
  }
  function queueVisible(){
    if(!depsReady)return;
    const list=items();
    document.querySelectorAll('.listing[data-id]').forEach(card=>{
      const x=list.find(v=>String(v.id)===String(card.dataset.id));if(!x||x.realListing)return;
      if(!cachedUrl(x)&&!attempted.has(String(x.id)))queued.add(String(x.id));
    });
    if('requestIdleCallback'in window)requestIdleCallback(()=>runQueue(),{timeout:1800});else setTimeout(runQueue,900)
  }

  function updateAddressInCard(x){
    const card=cardFor(x.id);if(!card)return;
    const meta=card.querySelector('.meta');
    if(meta)meta.textContent=`${x.address} · ${x.surface} m²`;
  }

  function findMarkerNear(lat,lng){
    let best=null,bestD=Infinity;
    try{
      if(!window.LIVE_MAP||!LIVE_MAP.eachLayer)return null;
      LIVE_MAP.eachLayer(layer=>{
        if(!layer||typeof layer.getLatLng!=='function'||!layer.getElement)return;
        const node=layer.getElement();if(!node||!node.querySelector||!node.querySelector('.home-pin'))return;
        const p=layer.getLatLng(),d=Math.abs(p.lat-lat)+Math.abs(p.lng-lng);
        if(d<bestD){bestD=d;best=layer}
      })
    }catch(e){}
    return bestD<0.02?best:null
  }

  function updateAddressOnMap(x,oldLat,oldLng){
    try{
      const marker=findMarkerNear(oldLat,oldLng);if(!marker)return;
      if(typeof marker.setLatLng==='function')marker.setLatLng([x.lat,x.lng]);
      if(typeof marker.setTooltipContent==='function')marker.setTooltipContent(`${x.address}<br>${x.title} · ${x.surface} m²`)
    }catch(e){}
  }

  async function resolveAddressesSequential(list,key){
    if(addressRunning)return;addressRunning=true;
    try{
      for(const x of list){
        if(!x)continue;
        if(x.realListing){updateAddressInCard(x);continue}
        if(x.address&&x.address!=='Adresse en cours…'&&!/secteur résidentiel$/i.test(x.address)){updateAddressInCard(x);continue}
        const oldLat=x.lat,oldLng=x.lng;
        try{
          if(typeof snapOne==='function')await snapOne(x);
          else x.address=(st.city||'Ville')+' · secteur résidentiel';
        }catch(e){x.address=(st.city||'Ville')+' · secteur résidentiel'}
        updateAddressInCard(x);updateAddressOnMap(x,oldLat,oldLng);
        await new Promise(r=>setTimeout(r,140));
      }
    }finally{addressRunning=false;try{SNAP_RUNNING=false}catch(e){}}
  }

  function refreshSelectionOnly(){
    try{
      const x=selectedListing();
      if(!LIVE_MAP||!LIVE_MAP.eachLayer)return;
      LIVE_MAP.eachLayer(layer=>{
        if(!layer||!layer.getElement||typeof layer.getLatLng!=='function')return;
        const node=layer.getElement(),pin=node&&node.querySelector?node.querySelector('.home-pin'):null;if(!pin)return;
        pin.classList.remove('selected');
        if(!x)return;
        const p=layer.getLatLng(),d=Math.abs(p.lat-x.lat)+Math.abs(p.lng-x.lng);
        if(d<0.0015)pin.classList.add('selected')
      })
    }catch(e){}
  }

  function chooseHome(){
    const x=selectedListing();if(!x)return;
    const now=new Date().toISOString();let start=null;try{start=typeof START_BUDGET!=='undefined'?START_BUDGET:null}catch(e){}
    const payload={...st,home:x,chosenAt:now,startingBudget:start,estimatedEntryCost:(x.price||0)+(x.charges||0)+(x.price||0)};
    try{
      localStorage.setItem('haute-couture-home',JSON.stringify(payload));
      localStorage.setItem('haute-couture-residence',JSON.stringify({...x,city:st.city,region:st.region,selectedAt:now}));
      localStorage.setItem('haute-couture-current-screen','chez-moi');
      localStorage.setItem('haute-couture-screen','chez-moi');
    }catch(e){}
    location.href='../chez-moi/'
  }
  function fixChoiceButton(){const btn=$('detailVisit');if(!btn)return;btn.textContent='♡ CHOISIR CE LOGEMENT';btn.disabled=false;btn.onclick=chooseHome}

  function install(){
    if(installed)return true;
    try{if(typeof side!=='function'||typeof openListingDetail!=='function'||typeof st==='undefined'||typeof stock!=='function')return false}catch(e){return false}
    installed=true;
    purgeLegacyHousing();
    neutralizeLegacyGallery();

    try{
      snapAddresses=function(list,key){
        try{SNAP_RUNNING=true}catch(e){}
        setTimeout(()=>resolveAddressesSequential(list,key),80);
        return Promise.resolve()
      };
      refreshListingsOnMap=refreshSelectionOnly;
    }catch(e){}

    try{
      const originalSide=side;
      side=function(){const r=originalSide.apply(this,arguments);decorateCards();neutralizeLegacyGallery();setTimeout(queueVisible,1000);return r}
    }catch(e){}

    try{
      const originalOpen=openListingDetail;
      openListingDetail=function(){
        const r=originalOpen.apply(this,arguments);const x=selectedListing();
        fixChoiceButton();neutralizeLegacyGallery();
        if(x&&depsReady){const url=cachedUrl(x);if(url)showMain(url);else{showMain('');if(!x.realListing&&!attempted.has(String(x.id))){queued.add(String(x.id));runQueue()}}}
        setTimeout(()=>{neutralizeLegacyGallery();try{if(x?.realListing&&window.HCRealEstateLiveFeed)window.HCRealEstateLiveFeed.fetchCity(false)}catch(e){}},60);
        return r
      }
    }catch(e){}

    fixChoiceButton();
    const galleryObserver=new MutationObserver(()=>neutralizeLegacyGallery());
    try{galleryObserver.observe(document.getElementById('detailModal')||document.body,{subtree:true,childList:true,characterData:true})}catch(e){}
    loadDeps().then(ok=>{if(ok){decorateCards();neutralizeLegacyGallery();setTimeout(queueVisible,1400);setTimeout(()=>window.HCRealEstateLiveFeed?.fetchCity?.(true),400)}});
    window.HCVisualEngine={build:BUILD,mode:'real-listings-first',chooseHome,decorateCards,queueVisible,neutralizeLegacyGallery,purgeLegacyHousing};
    return true
  }

  let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>100)clearInterval(timer)},30);
})();