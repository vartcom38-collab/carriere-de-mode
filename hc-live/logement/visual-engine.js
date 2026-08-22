/* Haute Couture Live — logement ultra-léger. Photos désactivées temporairement pour privilégier le gameplay. */
(function(){
  const BUILD='20260822-1750';
  let installed=false;

  function $(id){return document.getElementById(id)}
  function items(){try{return typeof stock==='function'?stock():[]}catch(e){return[]}}
  function selectedListing(){try{return items().find(x=>String(x.id)===String(st.listing))||null}catch(e){return null}}

  function ensureStyles(){
    if($('hc-lite-housing-css'))return;
    const s=document.createElement('style');s.id='hc-lite-housing-css';s.textContent=`
      .listing.hc-lite-card{display:grid!important;grid-template-columns:92px minmax(0,1fr)!important;gap:10px!important;align-items:center!important}
      .hc-lite-photo{height:76px;border-radius:10px;overflow:hidden;background:linear-gradient(135deg,#f7eadc,#e7ceb9 48%,#c7d5bc);display:grid;place-items:center;text-align:center;padding:7px;font:900 8px/1.2 Arial,sans-serif;letter-spacing:.08em;color:#725d53}
      .hc-lite-copy{min-width:0}
      @media(max-width:760px){.listing.hc-lite-card{grid-template-columns:78px minmax(0,1fr)!important}.hc-lite-photo{height:68px}}
    `;document.head.appendChild(s)
  }

  function decorateCards(){
    ensureStyles();
    document.querySelectorAll('.listing[data-id]').forEach(card=>{
      if(card.classList.contains('hc-lite-card'))return;
      const copy=document.createElement('div');copy.className='hc-lite-copy';
      while(card.firstChild)copy.appendChild(card.firstChild);
      const photo=document.createElement('div');photo.className='hc-lite-photo';photo.innerHTML='PHOTO<br>À VENIR';
      card.appendChild(photo);card.appendChild(copy);card.classList.add('hc-lite-card')
    })
  }

  function resetDetailPlaceholder(){
    const m=$('mainVisual');if(!m)return;
    m.style.background='linear-gradient(135deg,#f7eadc,#e6cbb5 45%,#c7d5bc)';
    m.innerHTML='';m.className='gallery-illustration';
  }

  function chooseHome(){
    const x=selectedListing();if(!x)return;
    const now=new Date().toISOString();
    let start=null;try{start=typeof START_BUDGET!=='undefined'?START_BUDGET:null}catch(e){}
    const payload={...st,home:x,chosenAt:now,startingBudget:start,estimatedEntryCost:(x.price||0)+(x.charges||0)+(x.price||0)};
    try{
      localStorage.setItem('haute-couture-home',JSON.stringify(payload));
      localStorage.setItem('haute-couture-residence',JSON.stringify({...x,city:st.city,region:st.region,selectedAt:now}));
      localStorage.setItem('haute-couture-current-screen','chez-moi');
      localStorage.setItem('haute-couture-screen','chez-moi')
    }catch(e){}
    const btn=$('detailVisit');if(btn){btn.textContent='✓ LOGEMENT CHOISI';btn.disabled=true}
    location.href='../chez-moi/'
  }

  function fixChoiceButton(){
    const btn=$('detailVisit');if(!btn)return;
    btn.textContent='♡ CHOISIR CE LOGEMENT';btn.disabled=false;btn.onclick=chooseHome
  }

  function install(){
    if(installed)return true;
    try{if(typeof side!=='function'||typeof openListingDetail!=='function'||typeof st==='undefined')return false}catch(e){return false}
    installed=true;ensureStyles();

    try{
      const originalSide=side;
      side=function(){const r=originalSide.apply(this,arguments);decorateCards();return r}
    }catch(e){}

    try{
      const originalOpen=openListingDetail;
      openListingDetail=function(){const r=originalOpen.apply(this,arguments);resetDetailPlaceholder();fixChoiceButton();return r}
    }catch(e){}

    decorateCards();fixChoiceButton();
    window.HCVisualEngine={build:BUILD,mode:'lightweight',chooseHome,decorateCards};
    return true
  }

  let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>120)clearInterval(timer)},50);
})();
