/* Haute Couture Live — branche l'ADN visuel au moteur d'annonces existant. */
(function(){
  function loadDNA(){return new Promise((resolve,reject)=>{
    if(window.HCVisualDNA)return resolve();
    const s=document.createElement('script');s.src='./visual-dna.js';s.onload=resolve;s.onerror=reject;document.head.appendChild(s);
  })}
  function waitGame(){return new Promise(resolve=>{let n=0;const t=setInterval(()=>{n++;try{if(typeof stock==='function'&&typeof openListingDetail==='function'){clearInterval(t);resolve(true)}}catch(e){}if(n>100){clearInterval(t);resolve(false)}},50)})}
  function contextFor(x){return{city:(typeof st!=='undefined'&&st.city)||x.city||'',region:(typeof st!=='undefined'&&st.region)||x.region||'',district:x.district||''}}
  function decorateAll(items){if(!window.HCVisualDNA)return items;items.forEach(x=>window.HCVisualDNA.hydrate(x,contextFor(x)));return items}
  function dnaLabel(v){if(!v)return'';return `${v.archetypeLabel} · ${v.citySignature} · ${v.visualSeed}`}
  function paintDetail(x){if(!x||!window.HCVisualDNA)return;const v=window.HCVisualDNA.hydrate(x,contextFor(x)),main=document.getElementById('mainVisual');if(main){main.dataset.visualSeed=v.visualSeed;main.dataset.visualStatus=v.visualStatus;main.style.background=`linear-gradient(135deg,#fff4ea,#ead5c2 46%,#c9d8c7)`;main.innerHTML=`<div style="max-width:520px;padding:18px;background:#fffaf1df;border:1px solid #d9bfae;border-radius:16px;font:14px/1.5 Georgia,serif;color:#493a33"><b style="display:block;font:900 10px Arial,sans-serif;letter-spacing:.12em;margin-bottom:7px">VISUEL UNIQUE PRÉPARÉ</b><strong style="font-size:21px">${v.archetypeLabel}</strong><br>${v.architecture} · ${v.decorSignature}<br>${v.lightSignature}<br><small style="display:block;margin-top:8px;color:#7e685d">ID visuel : ${v.visualSeed}<br>Image : ${v.visualStatus==='pending'?'à générer à la demande':v.visualStatus}</small></div>`}
    const thumbs=document.querySelectorAll('.thumb');const names=['Pièce principale','Cuisine','Salle d’eau','Extérieur / vue'];const keys=['main','kitchen','bathroom','window'];thumbs.forEach((t,i)=>{t.dataset.visualSeed=v.visualSeed;t.dataset.promptKey=keys[i];const sp=t.querySelector('span');if(sp)sp.textContent=names[i]});
    const about=document.getElementById('aboutList');if(about&&!about.querySelector('[data-visual-dna]')){const d=document.createElement('div');d.dataset.visualDna='1';d.textContent=`Identité visuelle : ${v.palette} · ${v.floorMaterial}`;about.appendChild(d)}
    x.visual=v;window.HCVisualDNA.save(x);
  }
  async function wire(){await loadDNA();const ready=await waitGame();if(!ready)return;
    try{const originalStock=stock;stock=function(){return decorateAll(originalStock.apply(this,arguments))}}catch(e){}
    try{const originalOpen=openListingDetail;openListingDetail=function(){const result=originalOpen.apply(this,arguments);try{const x=stock().find(a=>String(a.id)===String(st.listing));paintDetail(x)}catch(e){}return result}}catch(e){}
    try{const items=stock();decorateAll(items)}catch(e){}
    window.HCVisualEngine={decorate:decorateAll,paintDetail,contextFor,dnaLabel};
  }
  window.addEventListener('load',wire,{once:true});
})();
