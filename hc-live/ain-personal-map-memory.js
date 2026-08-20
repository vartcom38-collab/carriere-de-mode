(function(){
  if(window.__HCAinPersonalMapInstalled)return;window.__HCAinPersonalMapInstalled=true;
  const KEY='haute-couture-ain-personal-map-v1';
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const hash=v=>String(v||'').split('').reduce((a,c)=>((a*33)+c.charCodeAt(0))>>>0,5381);
  function geo(){return window.HCFranceGeo?.state||null}
  function game(){try{return window.HauteCoutureCore?.load?.()||null}catch(e){return null}}
  function current(){const s=geo();if(!s||s.department?.code!=='01'||!s.commune)return null;return {code:s.commune.code||s.commune.nom,name:s.commune.nom}}
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
  function save(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}return v}
  function touchVisit(){const c=current();if(!c)return null;const all=load(),g=game(),day=g?.world?.day||1,r=all[c.code]||{name:c.name,visits:0,firstDay:day,lastDay:0};if(r.lastDay!==day){r.visits=(r.visits||0)+1;r.lastDay=day}r.name=c.name;all[c.code]=r;save(all);return r}
  function readList(key){try{const x=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(x)?x:[]}catch(e){return []}}
  function mapEl(){return $('#hcBourgInteractiveMap')||$('#hcAinCommuneMap')}
  function placeEntries(map,c){const out=[];
    const generic=readList('haute-couture-ain-commune-discoveries-v1:'+c.code);
    const bourg=readList('haute-couture-bourg-map-discoveries-v1');
    const personal=readList('haute-couture-ain-commune-personality-notes-v1:'+c.code);
    const ids=new Set([...generic,...(c.name==='Bourg-en-Bresse'?bourg:[]),...personal]);
    $$('button.hc-acm-hotspot,button.hc-bourg-hotspot',map).forEach(btn=>{
      const label=$('.name,.draw + .name,.label',btn)?.textContent?.trim()||btn.getAttribute('aria-label')||'';
      const found=btn.classList.contains('found')||ids.has(btn.dataset?.hcPersonalitySpecial)||ids.has(btn.dataset?.hcPersonalitySecret);
      const named=label&&!/Détail à observer/i.test(label);
      if(found&&named)out.push({id:'found-'+label,label:'✦ '+label,x:parseFloat(btn.style.left)||50,y:parseFloat(btn.style.top)||50,kind:'discovery'});
    });
    if(personal.length)out.push({id:'notes',label:personal.length===1?'adresse notée':'adresses notées · '+personal.length,x:78,y:18,kind:'note'});
    const g=game();
    const home=g?.home?.current||(()=>{try{return JSON.parse(localStorage.getItem('haute-couture-residence')||'null')}catch(e){return null}})();
    if(home?.city===c.name)out.push({id:'home',label:'⌂ chez moi / atelier',x:18,y:82,kind:'home'});
    const travel=(g?.travel?.visited||[]).filter(v=>v.city===c.name);
    if(travel.length)out.push({id:'travel',label:'souvenir · '+travel[travel.length-1].name,x:74,y:78,kind:'memory'});
    const pages=(g?.carnet?.pages||[]).filter(p=>(p.title+' '+p.text).toLowerCase().includes(c.name.toLowerCase())).slice(-2);
    pages.forEach((p,i)=>out.push({id:'page-'+i,label:'✎ '+p.title,x:22+i*8,y:72-i*9,kind:'memory'}));
    const seen=new Set();return out.filter(x=>!seen.has(x.id)&&(seen.add(x.id),true));
  }
  function css(){if($('#hcPersonalMapStyles'))return;const st=document.createElement('style');st.id='hcPersonalMapStyles';st.textContent=`
    .hc-personal-map-layer{position:absolute;inset:0;z-index:9;pointer-events:none}.hc-personal-ink{position:absolute;transform:translate(-50%,-50%) rotate(var(--r));max-width:150px;padding:2px 5px;background:rgba(255,250,239,.74);border-bottom:1px solid rgba(111,143,107,.34);font:10px/1.15 Georgia,serif;color:#596257;box-shadow:0 1px 0 rgba(255,255,255,.5);opacity:.88}.hc-personal-ink.kind-home{border-bottom-color:rgba(212,130,90,.5);font-style:italic}.hc-personal-ink.kind-memory{background:rgba(255,247,223,.78);font-style:italic}.hc-personal-ink.kind-note{border:1px dashed rgba(111,143,107,.3);transform:translate(-50%,-50%) rotate(-2deg)}.hc-personal-stamp{position:absolute;left:4%;bottom:4%;z-index:17;pointer-events:none;background:rgba(255,250,239,.9);border:1px solid rgba(89,97,78,.22);padding:5px 8px;transform:rotate(-1deg);font:9px Georgia,serif;color:#667060}.hc-personal-stamp b{font-weight:400;font-size:11px}.hc-personal-stamp small{display:block;font:8px Arial,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:#8a8579}.hc-map-stage-1 .hc-personal-ink:nth-child(n+3){display:none}.hc-map-stage-2 .hc-personal-ink:nth-child(n+5){display:none}@media(max-width:850px){.hc-personal-ink{font-size:9px;max-width:118px;padding:2px 4px}.hc-personal-stamp{left:3%;bottom:3%}}
  `;document.head.appendChild(st)}
  function render(){const c=current(),map=mapEl();if(!c||!map||!document.querySelector('#location.active'))return false;css();const rec=touchVisit()||{visits:1};let layer=$('.hc-personal-map-layer',map);if(layer)layer.remove();layer=document.createElement('div');layer.className='hc-personal-map-layer';const entries=placeEntries(map,c);const stage=Math.min(3,1+Math.floor(((rec.visits||1)-1)/2)+Math.floor(entries.length/4));map.classList.remove('hc-map-stage-1','hc-map-stage-2','hc-map-stage-3');map.classList.add('hc-map-stage-'+stage);
    entries.forEach(e=>{const n=document.createElement('div');n.className='hc-personal-ink kind-'+e.kind;n.style.left=e.x+'%';n.style.top=e.y+'%';n.style.setProperty('--r',(((hash(c.code+'|'+e.id)%7)-3)*.7)+'deg');n.textContent=e.label;layer.appendChild(n)});map.appendChild(layer);
    let stamp=$('.hc-personal-stamp',map);if(stamp)stamp.remove();stamp=document.createElement('div');stamp.className='hc-personal-stamp';stamp.innerHTML='<small>Ma carte</small><b>'+esc(c.name)+'</b> · '+entries.length+' repère'+(entries.length>1?'s':'')+' · visite '+(rec.visits||1);map.appendChild(stamp);return true}
  function boot(){css();let last='';const tick=()=>{const c=current(),map=mapEl();if(!c||!map||!document.querySelector('#location.active'))return;const signature=c.code+'|'+(game()?.world?.day||1)+'|'+localStorage.length;if(signature!==last){last=signature;render()}};setInterval(tick,1200);window.addEventListener('storage',()=>{last='';setTimeout(tick,80)});document.addEventListener('click',e=>{if(e.target.closest('#choiceList,.crumbs,.region-pin,.hc-acm-hotspot,.hc-bourg-hotspot')){last='';setTimeout(tick,120)}})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();