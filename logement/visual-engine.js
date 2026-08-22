/* Haute Couture Live — branche l'ADN visuel et la génération à la demande au moteur d'annonces. */
(function(){
  const inflight=new Map();
  function loadScript(src,test){return new Promise((resolve,reject)=>{if(test())return resolve();const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
  async function loadDeps(){await loadScript('./visual-dna.js',()=>!!window.HCVisualDNA);await loadScript('./visual-service.js',()=>!!window.HCVisualService)}
  function waitGame(){return new Promise(resolve=>{let n=0;const t=setInterval(()=>{n++;try{if(typeof stock==='function'&&typeof openListingDetail==='function'){clearInterval(t);resolve(true)}}catch(e){}if(n>100){clearInterval(t);resolve(false)}},50)})}
  function contextFor(x){return{city:(typeof st!=='undefined'&&st.city)||x.city||'',region:(typeof st!=='undefined'&&st.region)||x.region||'',district:x.district||''}}
  function decorateAll(items){if(!window.HCVisualDNA)return items;items.forEach(x=>window.HCVisualDNA.hydrate(x,contextFor(x)));return items}
  function dnaLabel(v){if(!v)return'';return `${v.archetypeLabel} · ${v.citySignature} · ${v.visualSeed}`}
  function showImage(main,url){if(!main)return;main.style.background='#efe4d9';main.style.cursor='default';main.innerHTML=`<img src="${url}" alt="Illustration du logement" style="width:100%;height:100%;object-fit:cover;display:block">`}
  function showPending(main,v,msg,clickable=false){if(!main)return;main.style.background='linear-gradient(135deg,#fff4ea,#ead5c2 46%,#c9d8c7)';main.style.cursor=clickable?'pointer':'default';main.innerHTML=`<div style="max-width:520px;padding:18px;background:#fffaf1e8;border:1px solid #d9bfae;border-radius:16px;font:14px/1.5 Georgia,serif;color:#493a33"><b style="display:block;font:900 10px Arial,sans-serif;letter-spacing:.12em;margin-bottom:7px">${msg}</b><strong style="font-size:21px">${v.archetypeLabel}</strong><br>${v.architecture} · ${v.decorSignature}<br>${v.lightSignature}<br><small style="display:block;margin-top:8px;color:#7e685d">${v.visualSeed}</small></div>`}
  }
  function ensureCardStyles(){
    if(document.getElementById('hc-listing-visual-styles'))return;
    const s=document.createElement('style');s.id='hc-listing-visual-styles';s.textContent=`
      .listing.hc-with-visual{display:grid!important;grid-template-columns:108px minmax(0,1fr)!important;gap:10px!important;align-items:stretch}
      .hc-listing-preview{min-height:96px;border-radius:11px;overflow:hidden;position:relative;background:linear-gradient(135deg,#f7eadc,#e6cbb5 45%,#c7d5bc);display:grid;place-items:center}
      .hc-listing-preview img{width:100%;height:100%;object-fit:cover;display:block}
      .hc-listing-preview .hc-preview-label{padding:8px;text-align:center;font:900 8px/1.25 Arial,sans-serif;letter-spacing:.08em;color:#70594f}
      .hc-listing-preview .hc-preview-label small{display:block;font:italic 9px/1.25 Georgia,serif;letter-spacing:0;margin-top:4px;color:#886f63}
      .hc-listing-copy{min-width:0;align-self:center}
      @media(max-width:760px){.listing.hc-with-visual{grid-template-columns:92px minmax(0,1fr)!important}.hc-listing-preview{min-height:84px}}
    `;document.head.appendChild(s);
  }
  function cardPreview(card){
    if(!card)return null;
    let preview=card.querySelector('.hc-listing-preview');
    if(preview)return preview;
    ensureCardStyles();
    const copy=document.createElement('div');copy.className='hc-listing-copy';
    while(card.firstChild)copy.appendChild(card.firstChild);
    preview=document.createElement('div');preview.className='hc-listing-preview';preview.innerHTML='<div class="hc-preview-label">VISUEL EN PRÉPARATION<small>1 image principale</small></div>';
    card.appendChild(preview);card.appendChild(copy);card.classList.add('hc-with-visual');
    return preview;
  }
  function showCardPending(preview,label='GÉNÉRATION…'){
    if(!preview)return;preview.innerHTML=`<div class="hc-preview-label">${label}<small>DA du jeu</small></div>`;
  }
  function showCardImage(preview,url){if(preview&&url)preview.innerHTML=`<img src="${url}" alt="Aperçu du logement">`}
  async function ensureMainImage(x,preview){
    if(!x||!window.HCVisualDNA||!window.HCVisualService)return null;
    const v=window.HCVisualDNA.hydrate(x,contextFor(x));
    if(v.assets&&v.assets.mainImage){showCardImage(preview,v.assets.mainImage);return v.assets.mainImage}
    const key=v.visualSeed+'|main';
    if(inflight.has(key)){showCardPending(preview);try{const url=await inflight.get(key);if(url)showCardImage(preview,url);return url}catch(e){showCardPending(preview,'VISUEL INDISPONIBLE');return null}}
    showCardPending(preview);
    const task=(async()=>{const out=await window.HCVisualService.request(x,contextFor(x),'main');return out&&out.url?out.url:null})();
    inflight.set(key,task);
    try{const url=await task;if(url)showCardImage(preview,url);else showCardPending(preview,'VISUEL EN ATTENTE');return url}catch(e){showCardPending(preview,'VISUEL INDISPONIBLE');return null}finally{inflight.delete(key)}
  }
  function paintListingCards(){
    if(typeof stock!=='function')return;
    const items=decorateAll(stock());
    document.querySelectorAll('.listing[data-id]').forEach(card=>{
      const x=items.find(a=>String(a.id)===String(card.dataset.id));if(!x)return;
      const preview=cardPreview(card);ensureMainImage(x,preview);
    });
  }
  async function generateView(x,view='main'){
    if(!x||!window.HCVisualService)return;const v=window.HCVisualDNA.hydrate(x,contextFor(x));const main=document.getElementById('mainVisual');
    if(view==='main'&&v.assets&&v.assets.mainImage){showImage(main,v.assets.mainImage);return}
    if(view==='main')showPending(main,v,'GÉNÉRATION MAGNIFIC EN COURS…');
    try{const out=await window.HCVisualService.request(x,contextFor(x),view);if(out.url&&view==='main')showImage(main,out.url);else if(out.pending&&view==='main')showPending(main,v,'GÉNÉRATION EN COURS — RÉESSAIE DANS UN INSTANT',true)}catch(e){if(view==='main')showPending(main,v,'SERVICE VISUEL INDISPONIBLE — RÉESSAIE',true)}
  }
  function paintDetail(x){
    if(!x||!window.HCVisualDNA)return;
    const v=window.HCVisualDNA.hydrate(x,contextFor(x)),main=document.getElementById('mainVisual');
    if(main){
      main.dataset.visualSeed=v.visualSeed;main.dataset.visualStatus=v.visualStatus;
      if(v.assets&&v.assets.mainImage){showImage(main,v.assets.mainImage);main.onclick=null}
      else{
        showPending(main,v,'CHARGEMENT DE LA PHOTO PRINCIPALE…');
        ensureMainImage(x,null).then(url=>{if(url)showImage(main,url);else showPending(main,v,'VISUEL EN ATTENTE — RÉESSAIE',true)});
      }
    }
    const thumbs=document.querySelectorAll('.thumb');const names=['Pièce principale','Cuisine','Salle d’eau','Extérieur / vue'];const keys=['main','kitchen','bathroom','window'];
    thumbs.forEach((t,i)=>{t.dataset.visualSeed=v.visualSeed;t.dataset.promptKey=keys[i];t.style.cursor='pointer';const sp=t.querySelector('span');if(sp)sp.textContent=names[i];t.onclick=async()=>{const asset=keys[i]==='main'?v.assets.mainImage:v.assets.gallery[keys[i]];if(asset){showImage(main,asset);return}showPending(main,v,keys[i]==='main'?'CHARGEMENT DE LA PHOTO PRINCIPALE…':'GÉNÉRATION DE CETTE VUE…');try{const out=keys[i]==='main'?{url:await ensureMainImage(x,null)}:await window.HCVisualService.request(x,contextFor(x),keys[i]);if(out&&out.url)showImage(main,out.url);else showPending(main,v,'VUE EN ATTENTE — RÉESSAIE DANS UN INSTANT',true)}catch(e){showPending(main,v,'VUE INDISPONIBLE — RÉESSAIE',true)}}});
    const about=document.getElementById('aboutList');if(about&&!about.querySelector('[data-visual-dna]')){const d=document.createElement('div');d.dataset.visualDna='1';d.textContent=`Identité visuelle : ${v.palette} · ${v.floorMaterial}`;about.appendChild(d)}
    x.visual=v;window.HCVisualDNA.save(x);
  }
  async function wire(){await loadDeps();const ready=await waitGame();if(!ready)return;
    try{const originalStock=stock;stock=function(){return decorateAll(originalStock.apply(this,arguments))}}catch(e){}
    try{const originalSide=side;side=function(){const result=originalSide.apply(this,arguments);setTimeout(paintListingCards,0);return result}}catch(e){}
    try{const originalOpen=openListingDetail;openListingDetail=function(){const result=originalOpen.apply(this,arguments);try{const x=stock().find(a=>String(a.id)===String(st.listing));paintDetail(x)}catch(e){}return result}}catch(e){}
    try{decorateAll(stock());setTimeout(paintListingCards,0)}catch(e){}
    window.HCVisualEngine={decorate:decorateAll,paintDetail,paintListingCards,contextFor,dnaLabel,generateView,ensureMainImage};
  }
  window.addEventListener('load',wire,{once:true});
})();
