/* Haute Couture Live — moteur visuel logement + choix vers Chez Moi. */
(function(){
  const BUILD='20260822-1742';
  const inflight=new Map();
  let wired=false,observer=null,paintTimer=null;

  function loadScript(src,test){return new Promise((resolve,reject)=>{if(test())return resolve();const s=document.createElement('script');s.src=src+'?v='+BUILD;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
  async function loadDeps(){await loadScript('./visual-dna.js',()=>!!window.HCVisualDNA);await loadScript('./visual-service.js',()=>!!window.HCVisualService)}
  function waitGame(){return new Promise(resolve=>{let n=0;const t=setInterval(()=>{n++;try{if(typeof stock==='function'&&typeof st!=='undefined'){clearInterval(t);resolve(true);return}}catch(e){}if(n>240){clearInterval(t);resolve(false)}},50)})}
  function ctx(x){let city='',region='';try{city=st.city||'';region=st.region||''}catch(e){}return{city:city||x.city||'',region:region||x.region||'',district:x.district||''}}
  function hydrate(x){return window.HCVisualDNA.hydrate(x,ctx(x))}
  function items(){try{return stock()}catch(e){return[]}}

  function ensureStyles(){
    if(document.getElementById('hc-visual-css'))return;
    const s=document.createElement('style');s.id='hc-visual-css';s.textContent=`
      .listing.hc-visual-card{display:grid!important;grid-template-columns:108px minmax(0,1fr)!important;gap:10px!important;align-items:stretch!important}
      .hc-visual-preview{min-height:92px;border-radius:11px;overflow:hidden;background:linear-gradient(135deg,#f7eadc,#e7ceb9 48%,#c7d5bc);display:grid;place-items:center;position:relative}
      .hc-visual-preview img{width:100%;height:100%;object-fit:cover;display:block}
      .hc-visual-label{padding:8px;text-align:center;font:900 8px/1.25 Arial,sans-serif;letter-spacing:.08em;color:#6e584e}
      .hc-visual-label small{display:block;margin-top:4px;font:italic 9px/1.2 Georgia,serif;letter-spacing:0;color:#846d63}
      .hc-visual-copy{min-width:0;align-self:center}
      @media(max-width:760px){.listing.hc-visual-card{grid-template-columns:92px minmax(0,1fr)!important}.hc-visual-preview{min-height:82px}}
    `;document.head.appendChild(s)
  }

  function preview(card){if(!card)return null;let p=card.querySelector('.hc-visual-preview');if(p)return p;ensureStyles();const copy=document.createElement('div');copy.className='hc-visual-copy';while(card.firstChild)copy.appendChild(card.firstChild);p=document.createElement('div');p.className='hc-visual-preview';card.appendChild(p);card.appendChild(copy);card.classList.add('hc-visual-card');return p}
  function label(p,a,b){if(p)p.innerHTML=`<div class="hc-visual-label">${a}<small>${b||''}</small></div>`}
  function showCardImage(p,url){if(p&&url)p.innerHTML=`<img src="${url}" alt="Aperçu du logement">`}
  function showMainImage(url){const m=document.getElementById('mainVisual');if(!m||!url)return;m.style.background='#efe4d9';m.innerHTML=`<img src="${url}" alt="Illustration du logement" style="width:100%;height:100%;object-fit:cover;display:block">`}
  function showMainStatus(v,text){const m=document.getElementById('mainVisual');if(!m)return;m.style.background='linear-gradient(135deg,#fff4ea,#ead5c2 46%,#c9d8c7)';m.innerHTML=`<div style="max-width:520px;padding:18px;background:#fffaf1e8;border:1px solid #d9bfae;border-radius:16px;font:14px/1.5 Georgia,serif;color:#493a33"><b style="display:block;font:900 10px Arial,sans-serif;letter-spacing:.1em;margin-bottom:7px">${text}</b><strong style="font-size:21px">${v.archetypeLabel}</strong><br>${v.architecture} · ${v.decorSignature}</div>`}
  function cachedMain(x,v){if(v.assets&&v.assets.mainImage)return v.assets.mainImage;try{const c=window.HCVisualService.getCached&&window.HCVisualService.getCached(v.visualSeed,'main');if(c&&c.url){v.assets.mainImage=c.url;window.HCVisualDNA.save(x);return c.url}}catch(e){}return null}

  async function ensureMain(x,p){
    if(!x||!window.HCVisualService)return null;
    const v=hydrate(x),already=cachedMain(x,v);if(already){showCardImage(p,already);return already}
    const key=v.visualSeed+'|main';if(inflight.has(key)){label(p,'GÉNÉRATION EN COURS…','1 image principale');try{const u=await inflight.get(key);if(u)showCardImage(p,u);return u}catch(e){return null}}
    label(p,'GÉNÉRATION EN COURS…','1 image principale');
    const task=(async()=>{const out=await window.HCVisualService.request(x,ctx(x),'main');return out&&out.url?out.url:null})();inflight.set(key,task);
    try{const u=await task;if(u)showCardImage(p,u);else label(p,'VISUEL EN ATTENTE','On réglera les photos ensuite');return u}catch(e){console.error('HC Magnific main generation failed',e);label(p,'VISUEL INDISPONIBLE','On réglera les photos ensuite');return null}finally{inflight.delete(key)}
  }

  function paintCards(generateSelected){
    const list=items();if(!list.length)return;
    document.querySelectorAll('.listing[data-id]').forEach(card=>{const x=list.find(a=>String(a.id)===String(card.dataset.id));if(!x)return;const p=preview(card),v=hydrate(x),u=cachedMain(x,v);if(u){showCardImage(p,u);return}let selected=false;try{selected=String(st.listing)===String(x.id)}catch(e){}if(selected){label(p,'PHOTO PRINCIPALE','DA du jeu');if(generateSelected)ensureMain(x,p)}else label(p,'PHOTO DU LOGEMENT','Sélectionne l’annonce')})
  }
  function schedulePaint(generateSelected){clearTimeout(paintTimer);paintTimer=setTimeout(()=>paintCards(!!generateSelected),30)}

  function paintDetail(x){
    if(!x)return;const v=hydrate(x),u=cachedMain(x,v);if(u)showMainImage(u);else showMainStatus(v,'PHOTO À VENIR');
    const keys=['main','kitchen','bathroom','window'],names=['Pièce principale','Cuisine','Salle d’eau','Extérieur / vue'];
    document.querySelectorAll('.thumb').forEach((t,i)=>{const sp=t.querySelector('span');if(sp)sp.textContent=names[i];t.style.cursor='pointer';t.onclick=async()=>{const fresh=hydrate(x),asset=keys[i]==='main'?cachedMain(x,fresh):fresh.assets.gallery[keys[i]];if(asset){showMainImage(asset);return}if(keys[i]==='main'){const url=await ensureMain(x,null);if(url)showMainImage(url);return}showMainStatus(fresh,'GÉNÉRATION DE CETTE VUE…');try{const out=await window.HCVisualService.request(x,ctx(x),keys[i]);if(out&&out.url)showMainImage(out.url);else showMainStatus(fresh,'VUE EN ATTENTE')}catch(e){showMainStatus(fresh,'VUE INDISPONIBLE')}}})
  }

  function selectedListing(){try{return items().find(a=>String(a.id)===String(st.listing))||null}catch(e){return null}}
  function chooseHome(x){
    if(!x)return;
    const now=new Date().toISOString();
    const payload={...st,home:x,chosenAt:now,startingBudget:typeof START_BUDGET!=='undefined'?START_BUDGET:null,estimatedEntryCost:(x.price||0)+(x.charges||0)+(x.price||0)};
    try{
      localStorage.setItem('haute-couture-home',JSON.stringify(payload));
      localStorage.setItem('haute-couture-residence',JSON.stringify({...x,city:st.city,region:st.region,selectedAt:now}));
      localStorage.setItem('haute-couture-current-screen','chez-moi');
      localStorage.setItem('haute-couture-screen','chez-moi');
    }catch(e){}
    const btn=document.getElementById('detailVisit');if(btn){btn.textContent='✓ LOGEMENT CHOISI';btn.disabled=true}
    setTimeout(()=>{location.href='../chez-moi/'},180)
  }

  function fixChoiceButton(){const btn=document.getElementById('detailVisit');if(!btn)return;btn.textContent='♡ CHOISIR CE LOGEMENT';btn.onclick=null}
  function captureChoice(e){
    const btn=e.target&&e.target.closest?e.target.closest('#detailVisit'):null;if(!btn)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    const x=selectedListing();if(x)chooseHome(x)
  }

  function watchDom(){
    if(observer)return;observer=new MutationObserver(()=>{schedulePaint(false);fixChoiceButton()});observer.observe(document.body,{childList:true,subtree:true});
    const listings=document.getElementById('listings');if(listings)listings.addEventListener('click',()=>setTimeout(()=>schedulePaint(true),60),true)
  }

  async function wire(){
    if(wired)return;wired=true;try{await loadDeps()}catch(e){console.error('HC visual deps failed',e);wired=false;return}
    const ready=await waitGame();if(!ready){console.error('HC visual engine: game not ready');wired=false;return}
    document.addEventListener('click',captureChoice,true);
    watchDom();fixChoiceButton();
    try{if(typeof openListingDetail==='function'){const originalOpen=openListingDetail;openListingDetail=function(){const r=originalOpen.apply(this,arguments);try{const x=selectedListing();paintDetail(x);setTimeout(fixChoiceButton,0)}catch(e){console.error(e)}return r}}}catch(e){}
    schedulePaint(false);setTimeout(()=>schedulePaint(false),500);
    window.HCVisualEngine={build:BUILD,paintCards,paintDetail,ensureMain,chooseHome};
  }

  if(document.readyState==='loading')window.addEventListener('load',wire,{once:true});else wire();
})();
