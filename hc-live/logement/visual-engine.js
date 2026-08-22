/* Haute Couture Live — branche l'ADN visuel et la génération à la demande au moteur d'annonces. */
(function(){
  function loadScript(src,test){return new Promise((resolve,reject)=>{if(test())return resolve();const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
  async function loadDeps(){await loadScript('./visual-dna.js',()=>!!window.HCVisualDNA);await loadScript('./visual-service.js',()=>!!window.HCVisualService)}
  function waitGame(){return new Promise(resolve=>{let n=0;const t=setInterval(()=>{n++;try{if(typeof stock==='function'&&typeof openListingDetail==='function'){clearInterval(t);resolve(true)}}catch(e){}if(n>100){clearInterval(t);resolve(false)}},50)})}
  function contextFor(x){return{city:(typeof st!=='undefined'&&st.city)||x.city||'',region:(typeof st!=='undefined'&&st.region)||x.region||'',district:x.district||''}}
  function decorateAll(items){if(!window.HCVisualDNA)return items;items.forEach(x=>window.HCVisualDNA.hydrate(x,contextFor(x)));return items}
  function dnaLabel(v){if(!v)return'';return `${v.archetypeLabel} · ${v.citySignature} · ${v.visualSeed}`}
  function showImage(main,url){if(!main)return;main.style.background='#efe4d9';main.style.cursor='default';main.innerHTML=`<img src="${url}" alt="Illustration du logement" style="width:100%;height:100%;object-fit:cover;display:block">`}
  function showPending(main,v,msg,clickable=false){if(!main)return;main.style.background='linear-gradient(135deg,#fff4ea,#ead5c2 46%,#c9d8c7)';main.style.cursor=clickable?'pointer':'default';main.innerHTML=`<div style="max-width:520px;padding:18px;background:#fffaf1e8;border:1px solid #d9bfae;border-radius:16px;font:14px/1.5 Georgia,serif;color:#493a33"><b style="display:block;font:900 10px Arial,sans-serif;letter-spacing:.12em;margin-bottom:7px">${msg}</b><strong style="font-size:21px">${v.archetypeLabel}</strong><br>${v.architecture} · ${v.decorSignature}<br>${v.lightSignature}<br><small style="display:block;margin-top:8px;color:#7e685d">${v.visualSeed}</small></div>`}
  }
  async function generateView(x,view='main'){
    if(!x||!window.HCVisualService)return;const v=window.HCVisualDNA.hydrate(x,contextFor(x));const main=document.getElementById('mainVisual');
    if(view==='main'&&v.assets&&v.assets.mainImage){showImage(main,v.assets.mainImage);return}
    if(view==='main')showPending(main,v,'GÉNÉRATION MAGNIFIC EN COURS…');
    try{const out=await window.HCVisualService.request(x,contextFor(x),view);if(out.url&&view==='main')showImage(main,out.url);else if(out.pending&&view==='main')showPending(main,v,'GÉNÉRATION EN COURS — RÉESSAIE DANS UN INSTANT',true)}catch(e){if(view==='main')showPending(main,v,'SERVICE VISUEL INDISPONIBLE — CLIQUE POUR RÉESSAYER',true)}
  }
  function paintDetail(x){
    if(!x||!window.HCVisualDNA)return;
    const v=window.HCVisualDNA.hydrate(x,contextFor(x)),main=document.getElementById('mainVisual');
    if(main){
      main.dataset.visualSeed=v.visualSeed;main.dataset.visualStatus=v.visualStatus;
      if(v.assets&&v.assets.mainImage){showImage(main,v.assets.mainImage);main.onclick=null}
      else{
        showPending(main,v,'CLIQUE ICI POUR GÉNÉRER LE VISUEL',true);
        main.onclick=()=>{main.onclick=null;generateView(x,'main')};
      }
    }
    const thumbs=document.querySelectorAll('.thumb');const names=['Pièce principale','Cuisine','Salle d’eau','Extérieur / vue'];const keys=['main','kitchen','bathroom','window'];
    thumbs.forEach((t,i)=>{t.dataset.visualSeed=v.visualSeed;t.dataset.promptKey=keys[i];t.style.cursor='pointer';const sp=t.querySelector('span');if(sp)sp.textContent=names[i];t.onclick=async()=>{const asset=keys[i]==='main'?v.assets.mainImage:v.assets.gallery[keys[i]];if(asset){showImage(main,asset);return}showPending(main,v,'GÉNÉRATION DE LA VUE…');try{const out=await window.HCVisualService.request(x,contextFor(x),keys[i]);if(out.url)showImage(main,out.url);else showPending(main,v,'VUE EN COURS — RÉESSAIE DANS UN INSTANT',true)}catch(e){showPending(main,v,'VUE INDISPONIBLE — RÉESSAIE',true)}}});
    const about=document.getElementById('aboutList');if(about&&!about.querySelector('[data-visual-dna]')){const d=document.createElement('div');d.dataset.visualDna='1';d.textContent=`Identité visuelle : ${v.palette} · ${v.floorMaterial}`;about.appendChild(d)}
    x.visual=v;window.HCVisualDNA.save(x);
  }
  async function wire(){await loadDeps();const ready=await waitGame();if(!ready)return;
    try{const originalStock=stock;stock=function(){return decorateAll(originalStock.apply(this,arguments))}}catch(e){}
    try{const originalOpen=openListingDetail;openListingDetail=function(){const result=originalOpen.apply(this,arguments);try{const x=stock().find(a=>String(a.id)===String(st.listing));paintDetail(x)}catch(e){}return result}}catch(e){}
    try{decorateAll(stock())}catch(e){}
    window.HCVisualEngine={decorate:decorateAll,paintDetail,contextFor,dnaLabel,generateView};
  }
  window.addEventListener('load',wire,{once:true});
})();
