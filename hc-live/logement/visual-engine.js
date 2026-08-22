/* Haute Couture Live — hotfix performance logement. Photos et géocodage détaillé désactivés temporairement. */
(function(){
  const BUILD='20260822-1754';
  let installed=false;
  function $(id){return document.getElementById(id)}
  function items(){try{return typeof stock==='function'?stock():[]}catch(e){return[]}}
  function selectedListing(){try{return items().find(x=>String(x.id)===String(st.listing))||null}catch(e){return null}}

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
      localStorage.setItem('haute-couture-screen','chez-moi');
    }catch(e){}
    location.href='../chez-moi/'
  }

  function fixChoiceButton(){
    const btn=$('detailVisit');if(!btn)return;
    btn.textContent='♡ CHOISIR CE LOGEMENT';btn.disabled=false;btn.onclick=chooseHome;
  }

  function install(){
    if(installed)return true;
    try{
      if(typeof side!=='function'||typeof openListingDetail!=='function'||typeof st==='undefined'||typeof stock!=='function')return false;
    }catch(e){return false}
    installed=true;

    /* Évite les 16 requêtes reverse-geocoding et le rerender complet déclenché à leur retour. */
    try{
      snapAddresses=function(list){
        try{list.forEach(x=>{if(!x.address||x.address==='Adresse en cours…')x.address=(st.city||'Ville')+' · secteur résidentiel'})}catch(e){}
        return Promise.resolve();
      };
      SNAP_RUNNING=false;
    }catch(e){}

    /* Une sélection ne doit pas reconstruire toute la carte Leaflet. */
    try{
      refreshListingsOnMap=function(){
        try{
          document.querySelectorAll('.home-pin').forEach(p=>p.classList.remove('selected'));
        }catch(e){}
      };
    }catch(e){}

    try{
      const originalOpen=openListingDetail;
      openListingDetail=function(){
        const r=originalOpen.apply(this,arguments);
        resetDetailPlaceholder();fixChoiceButton();return r;
      };
    }catch(e){}

    fixChoiceButton();
    window.HCVisualEngine={build:BUILD,mode:'performance-hotfix',chooseHome};
    return true;
  }

  let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>100)clearInterval(timer)},30);
})();
