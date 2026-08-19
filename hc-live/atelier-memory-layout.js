(function(){
  if(window.__HCAtelierMemoryLayoutInstalled)return;window.__HCAtelierMemoryLayoutInstalled=true;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  function residence(){try{return window.HauteCoutureCore?.load?.()?.home?.current||JSON.parse(localStorage.getItem('haute-couture-residence')||'null')}catch(e){return null}}
  function homeProfile(){const h=residence()||{},surface=Number(h.surface)||24,type=String(h.type||'').toLowerCase(),dna=h.hcDna||{};let size=surface<=23?'compact':surface>=36?'generous':'balanced';if(/t2|atelier/.test(type)&&surface>=28)size='generous';const work=/très bon|coin atelier|atelier/.test(String(h.workspace||'')+' '+String(h.potential||'')+' '+String(dna.atelier||'')+' '+type);return{size,work,surface,type,home:h}}
  function styles(){if($('#hcAtelierMemoryLayoutStyles'))return;const st=document.createElement('style');st.id='hcAtelierMemoryLayoutStyles';st.textContent=`
  #atelier .atelier-room{position:relative;overflow:hidden}
  #hcMemoryWall{position:absolute!important;inset:0!important;width:auto!important;top:0!important;right:0!important;z-index:5!important;pointer-events:none!important;filter:none!important}
  #hcMemoryWall .hc-memory-wall-title{display:none!important}
  #hcMemoryWall .hc-memory-wall-grid{position:absolute!important;inset:0!important;display:block!important;pointer-events:none!important}
  #hcMemoryWall .hc-memory-trace{position:absolute!important;width:74px!important;min-height:0!important;pointer-events:auto!important;transition:transform .18s ease,filter .18s ease,opacity .18s ease!important;z-index:2}
  #hcMemoryWall .hc-memory-trace:hover{z-index:10!important;transform:rotate(0deg) translateY(-4px) scale(1.08)!important}
  #hcMemoryWall .hc-trace-caption{opacity:0;transform:translateY(-2px);transition:.15s;background:rgba(255,250,241,.92);padding:2px 4px;border-radius:5px;box-shadow:0 2px 7px rgba(45,35,25,.08)}
  #hcMemoryWall .hc-memory-trace:hover .hc-trace-caption{opacity:1;transform:none}#hcMemoryWall .hc-trace-day{display:none}
  #hcMemoryWall .zone-wall{top:10%;right:18%}#hcMemoryWall .zone-wall.z2{top:15%;right:10%}#hcMemoryWall .zone-wall.z3{top:8%;right:28%}#hcMemoryWall .zone-wall.z4{top:22%;right:20%}
  #hcMemoryWall .zone-table{left:28%;bottom:25%}#hcMemoryWall .zone-table.z2{left:36%;bottom:20%}#hcMemoryWall .zone-table.z3{left:42%;bottom:27%}
  #hcMemoryWall .zone-shelf{right:7%;bottom:24%}#hcMemoryWall .zone-shelf.z2{right:14%;bottom:18%}
  #hcMemoryWall .zone-mirror{left:8%;top:20%}#hcMemoryWall .zone-mirror.z2{left:12%;top:31%}
  #hcMemoryWall .zone-boxes{right:7%;bottom:8%}#hcMemoryWall .zone-boxes.z2{right:17%;bottom:10%}
  #hcMemoryWall .zone-floor{left:48%;bottom:9%}#hcMemoryWall .zone-floor.z2{left:57%;bottom:12%}
  #hcMemoryWall .hc-memory-trace.zone-table .hc-trace-visual,#hcMemoryWall .hc-memory-trace.zone-shelf .hc-trace-visual,#hcMemoryWall .hc-memory-trace.zone-boxes .hc-trace-visual,#hcMemoryWall .hc-memory-trace.zone-floor .hc-trace-visual{transform:scale(.88)}
  /* Petit studio : les souvenirs restent près du coin de travail, sans envahir la pièce. */
  #hcMemoryWall.hc-home-compact .zone-wall{right:11%;top:11%}#hcMemoryWall.hc-home-compact .zone-wall.z2{right:20%;top:18%}#hcMemoryWall.hc-home-compact .zone-wall.z3{right:8%;top:26%}
  #hcMemoryWall.hc-home-compact .zone-table{left:25%;bottom:24%}#hcMemoryWall.hc-home-compact .zone-table.z2{left:35%;bottom:21%}
  #hcMemoryWall.hc-home-compact .zone-boxes{right:8%;bottom:9%}#hcMemoryWall.hc-home-compact .zone-mirror{left:7%;top:23%}
  #hcMemoryWall.hc-home-compact .zone-shelf{right:10%;bottom:20%}#hcMemoryWall.hc-home-compact .zone-floor{left:43%;bottom:10%}
  #hcMemoryWall.hc-home-compact .hc-memory-trace:nth-child(n+6){display:none!important}
  /* Logement plus généreux : les traces respirent et occupent davantage le décor. */
  #hcMemoryWall.hc-home-generous .zone-wall{top:8%;right:22%}#hcMemoryWall.hc-home-generous .zone-wall.z2{top:13%;right:10%}#hcMemoryWall.hc-home-generous .zone-wall.z3{top:7%;right:34%}#hcMemoryWall.hc-home-generous .zone-wall.z4{top:21%;right:27%}
  #hcMemoryWall.hc-home-generous .zone-table{left:24%;bottom:27%}#hcMemoryWall.hc-home-generous .zone-table.z2{left:37%;bottom:20%}#hcMemoryWall.hc-home-generous .zone-table.z3{left:49%;bottom:28%}
  #hcMemoryWall.hc-home-generous .zone-shelf{right:5%;bottom:29%}#hcMemoryWall.hc-home-generous .zone-shelf.z2{right:16%;bottom:20%}
  #hcMemoryWall.hc-home-generous .zone-mirror{left:6%;top:18%}#hcMemoryWall.hc-home-generous .zone-mirror.z2{left:11%;top:32%}
  #hcMemoryWall.hc-home-generous .zone-floor{left:54%;bottom:8%}#hcMemoryWall.hc-home-generous .zone-floor.z2{left:66%;bottom:12%}
  #hcMemoryWall.hc-work-friendly .zone-table .hc-trace-visual{transform:scale(.94)}#hcMemoryWall.hc-work-friendly .zone-table{z-index:4}
  #hcMemoryWall:after{content:attr(data-home-note);position:absolute;right:3%;bottom:4%;max-width:180px;padding:5px 8px;border-radius:8px;background:rgba(255,250,241,.72);font:9px/1.35 Georgia,serif;color:#746a60;opacity:0;transition:.18s;pointer-events:none}#hcMemoryWall:hover:after{opacity:.9}
  @media(max-width:850px){#hcMemoryWall .hc-memory-trace{width:58px!important}#hcMemoryWall .zone-wall{top:8%;right:12%}#hcMemoryWall .zone-wall.z2{top:17%;right:7%}#hcMemoryWall .zone-table{left:33%;bottom:24%}#hcMemoryWall .zone-table.z2{left:45%;bottom:19%}#hcMemoryWall .zone-shelf{right:5%;bottom:27%}#hcMemoryWall .zone-shelf.z2{right:13%;bottom:17%}#hcMemoryWall .zone-mirror{left:5%;top:18%}#hcMemoryWall .zone-mirror.z2{left:8%;top:30%}#hcMemoryWall .zone-boxes{right:5%;bottom:8%}#hcMemoryWall .zone-boxes.z2{right:15%;bottom:9%}#hcMemoryWall .zone-floor{left:50%;bottom:8%}#hcMemoryWall .zone-floor.z2{left:62%;bottom:11%}#hcMemoryWall:after{display:none}}
  `;document.head.appendChild(st)}
  function zoneFor(btn,i,p){const v=$('.hc-trace-visual',btn);const cls=[...(v?.classList||[])].find(x=>x.indexOf('hc-trace-')===0&&x!=='hc-trace-visual')||'';const type=cls.replace('hc-trace-','');
    if(type==='frame'||type==='sketch'||type==='postcard')return'wall';
    if(type==='swatch')return p.work?'table':(i%2?'table':'shelf');
    if(type==='object')return p.size==='compact'?'table':(i%2?'table':'shelf');
    if(type==='letter'||type==='flower')return i%2?'mirror':'wall';
    if(type==='note')return p.size==='generous'?(i%2?'floor':'table'):(i%2?'boxes':'table');
    return i%2?'floor':'wall';
  }
  function arrange(){const wall=$('#hcMemoryWall'),room=$('#atelier .atelier-room');if(!wall||!room)return false;styles();const p=homeProfile();wall.classList.remove('hc-home-compact','hc-home-balanced','hc-home-generous','hc-work-friendly');wall.classList.add('hc-home-'+p.size);if(p.work)wall.classList.add('hc-work-friendly');const label=p.size==='compact'?'Petit espace : les souvenirs se concentrent autour du coin de travail.':p.size==='generous'?'Plus d’espace : ta carrière commence à se déployer dans toute la pièce.':'Les souvenirs trouvent peu à peu leur place chez toi.';wall.dataset.homeNote=(p.surface?p.surface+' m² · ':'')+label;room.dataset.hcHomeMemoryProfile=p.size;
    const counts={wall:0,table:0,shelf:0,mirror:0,boxes:0,floor:0};$$('.hc-memory-trace',wall).forEach((b,i)=>{['zone-wall','zone-table','zone-shelf','zone-mirror','zone-boxes','zone-floor','z2','z3','z4'].forEach(c=>b.classList.remove(c));const z=zoneFor(b,i,p);counts[z]++;b.classList.add('zone-'+z);const n=counts[z];if(n>1)b.classList.add('z'+Math.min(n,4));b.dataset.hcZone=z;b.title=(b.title||'Souvenir').split(' · ')[0]+' · '+({wall:'accroché au mur',table:'posé sur la table',shelf:'gardé sur une étagère',mirror:'près du miroir',boxes:'avec les cartons',floor:'posé dans l’atelier'}[z]||'dans l’atelier'))});return true}
  function observe(){const room=$('#atelier .atelier-room');if(!room||room.dataset.hcMemoryLayout)return false;room.dataset.hcMemoryLayout='1';new MutationObserver(()=>setTimeout(arrange,0)).observe(room,{childList:true,subtree:true});return true}
  function patchMove(){const c=window.HauteCoutureCore;if(!c||c.__hcMemoryLayoutMovePatched)return;c.__hcMemoryLayoutMovePatched=true;const old=c.moveHome;if(typeof old==='function')c.moveHome=function(){const s=old.apply(c,arguments);setTimeout(arrange,30);return s}}
  function install(){styles();patchMove();const ok=arrange();observe();return ok}
  let tries=0;const t=setInterval(()=>{tries++;if(install()||tries>180)clearInterval(t)},80);
})();