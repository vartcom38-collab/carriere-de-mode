(function(){
  if(window.__HCAinMapLiveEventsInstalled)return;window.__HCAinMapLiveEventsInstalled=true;
  const SEEN='haute-couture-ain-live-events-seen-v1';
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const hash=v=>String(v||'').split('').reduce((a,c)=>((a*33)+c.charCodeAt(0))>>>0,5381);
  function geo(){return window.HCFranceGeo?.state||null}
  function game(){try{return window.HauteCoutureCore?.load?.()||null}catch(e){return null}}
  function day(){return Number(game()?.world?.day)||1}
  function season(d=day()){return ['printemps','été','automne','hiver'][Math.floor((Math.max(1,d)-1)/15)%4]}
  function current(){const s=geo();if(!s||s.department?.code!=='01'||!s.commune)return null;return {name:s.commune.nom,code:s.commune.code||s.commune.nom}}
  function map(){return $('#hcBourgInteractiveMap')||$('#hcAinCommuneMap')}
  function profile(){const c=current();if(!c)return 'general';try{return window.HCAinCommunePersonality?.profile?.(c.name,c.code)?.id||window.HCAinCommunePersonality?.places?.(c.name,c.code)?.profile?.id||'general'}catch(e){return 'general'}}
  const common=[
    {id:'market',glyph:'◌',title:'Marché éphémère',kind:'Vie locale',text:'Quelques stands sont installés aujourd’hui. Une conversation ou une matière inattendue peut s’y trouver.'},
    {id:'poster',glyph:'▧',title:'Nouvelle affiche',kind:'Indice',text:'Une affiche vient d’être placardée : atelier, exposition, recherche de modèle ou appel à collaboration.'},
    {id:'popup',glyph:'✦',title:'Petit pop-up',kind:'Création',text:'Une présence temporaire apparaît sur le plan pour quelques jours seulement.'},
    {id:'brocante',glyph:'⌁',title:'Brocante locale',kind:'Trouvaille',text:'Objets, tissus, boutons, vieux papiers et détails peuvent nourrir une future création.'}
  ];
  const themed={
    textile:[{id:'swatches',glyph:'≋',title:'Table d’échantillons',kind:'Matières',text:'Des échantillons et fins de rouleaux sont visibles aujourd’hui.'}],
    heritage:[{id:'sketch',glyph:'✎',title:'Séance de croquis',kind:'Patrimoine',text:'Un petit rendez-vous de dessin s’est installé près d’un repère patrimonial.'}],
    nature:[{id:'light',glyph:'❧',title:'Observation saisonnière',kind:'Inspiration',text:'La lumière et la végétation rendent ce lieu particulièrement intéressant aujourd’hui.'}],
    craft:[{id:'openstudio',glyph:'◇',title:'Atelier ouvert',kind:'Artisanat',text:'Un atelier ouvre exceptionnellement sa porte aujourd’hui.'}],
    industry:[{id:'prototype',glyph:'◉',title:'Démonstration de prototype',kind:'Fabrication',text:'Une petite démonstration technique est visible sur le plan.'}],
    mountain:[{id:'outdoor',glyph:'△',title:'Rendez-vous en plein air',kind:'Mouvement',text:'Le relief et la météo donnent lieu à une observation temporaire.'}],
    hospitality:[{id:'meeting',glyph:'☕',title:'Rendez-vous du jour',kind:'Rencontre',text:'Un rendez-vous ponctuel attire aujourd’hui plusieurs personnes du réseau local.'}],
    general:[]
  };
  function eventsFor(c,d){const p=profile(),pool=[...(themed[p]||[]),...common],seed=hash(c.code+'|'+d+'|'+p),count=1+(seed%2),out=[];for(let i=0;i<count;i++){const base=pool[(seed+i*7)%pool.length],h=hash(seed+'|'+i+'|'+base.id);out.push({...base,id:c.code+'-'+d+'-'+base.id+'-'+i,x:18+(h%66),y:25+(Math.floor(h/91)%52),season:season(d),day:d})}return out}
  function readSeen(){try{return new Set(JSON.parse(localStorage.getItem(SEEN)||'[]'))}catch(e){return new Set()}}
  function markSeen(id){const a=readSeen();a.add(id);try{localStorage.setItem(SEEN,JSON.stringify([...a]))}catch(e){}}
  function addCarnet(evt,c){const core=window.HauteCoutureCore;if(!core?.load||!core?.save)return;const s=core.load();if(!s)return;s.carnet=s.carnet||{};s.carnet.pages=s.carnet.pages||[];const id='map-event-'+evt.id;if(!s.carnet.pages.some(p=>p.id===id))s.carnet.pages.push({id,type:'lieu',title:evt.title+' · '+c.name,text:evt.text+' ('+evt.season+', jour '+evt.day+')',createdDay:evt.day});core.save(s)}
  function css(){if($('#hcAinLiveEventStyles'))return;const st=document.createElement('style');st.id='hcAinLiveEventStyles';st.textContent=`
  .hc-map-live-event{position:absolute;z-index:16;width:64px;height:64px;transform:translate(-50%,-50%);border:0;background:transparent;cursor:pointer;touch-action:manipulation}.hc-map-live-event .hc-live-draw{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(-2deg);width:34px;height:34px;display:grid;place-items:center;background:#fff3d8;border:1px dashed rgba(190,151,91,.55);border-radius:48% 52% 44% 56%;font:17px Georgia,serif;box-shadow:0 3px 8px rgba(61,46,30,.09);animation:hcLiveBreathe 2.8s ease-in-out infinite}.hc-map-live-event .hc-live-name{position:absolute;left:50%;top:88%;transform:translateX(-50%);white-space:nowrap;background:rgba(255,249,234,.96);border-bottom:1px solid rgba(190,151,91,.38);padding:2px 5px;font:9px Georgia,serif;opacity:0;pointer-events:none}.hc-map-live-event:hover .hc-live-name,.hc-map-live-event:focus .hc-live-name{opacity:1}.hc-map-live-event.seen .hc-live-draw{animation:none;opacity:.72}.hc-live-season-stamp{position:absolute;right:4%;top:16%;z-index:15;padding:4px 7px;background:rgba(255,250,239,.82);border-left:2px solid rgba(111,143,107,.4);font:9px Georgia,serif;color:#666c61;transform:rotate(1deg)}@keyframes hcLiveBreathe{50%{transform:translate(-50%,-50%) rotate(1deg) scale(1.08)}}@media(max-width:850px){.hc-map-live-event{width:76px;height:76px}.hc-map-live-event .hc-live-name{display:none}.hc-live-season-stamp{right:3%;top:14%}}
  `;document.head.appendChild(st)}
  function open(evt,btn){const m=map(),c=current();if(!m||!c)return;markSeen(evt.id);btn?.classList.add('seen');let sheet=$('#hcAcmSheet',m)||$('#hcBourgSheet',m);if(!sheet)return;sheet.innerHTML='<button class="close">×</button><small>'+esc(evt.kind)+' · '+esc(evt.season)+' · jour '+evt.day+'</small><h3>'+esc(evt.title)+'</h3><p>'+esc(evt.text)+'</p><button class="action">Garder une trace dans mon carnet</button>';sheet.classList.add('open');sheet.querySelector('.close').onclick=()=>sheet.classList.remove('open');sheet.querySelector('.action').onclick=()=>{addCarnet(evt,c);sheet.classList.remove('open');render()}}
  function render(){const c=current(),m=map();if(!c||!m)return false;css();$$('.hc-map-live-event,.hc-live-season-stamp',m).forEach(x=>x.remove());const d=day(),seen=readSeen(),evts=eventsFor(c,d);evts.forEach(evt=>{const b=document.createElement('button');b.className='hc-map-live-event'+(seen.has(evt.id)?' seen':'');b.style.left=evt.x+'%';b.style.top=evt.y+'%';b.setAttribute('aria-label',evt.title);b.innerHTML='<span class="hc-live-draw">'+esc(evt.glyph)+'</span><span class="hc-live-name">'+esc(evt.title)+'</span>';b.onclick=e=>{e.preventDefault();open(evt,b)};m.appendChild(b)});const stamp=document.createElement('div');stamp.className='hc-live-season-stamp';stamp.textContent=season(d)+' · '+evts.length+' événement'+(evts.length>1?'s':'')+' aujourd’hui';m.appendChild(stamp);return true}
  function boot(){css();let sig='';setInterval(()=>{const c=current(),m=map();if(!c||!m)return;const s=c.code+'|'+day()+'|'+m.id;if(s!==sig){sig=s;render()}},500);const loc=$('#location');if(loc)new MutationObserver(()=>setTimeout(render,100)).observe(loc,{subtree:true,childList:true,attributes:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();