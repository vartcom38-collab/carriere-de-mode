(function(){
  if(window.__HCAtelierMemoryLayoutInstalled)return;window.__HCAtelierMemoryLayoutInstalled=true;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  function styles(){if($('#hcAtelierMemoryLayoutStyles'))return;const st=document.createElement('style');st.id='hcAtelierMemoryLayoutStyles';st.textContent=`
  #atelier .atelier-room{position:relative;overflow:hidden}
  #hcMemoryWall{position:absolute!important;inset:0!important;width:auto!important;top:0!important;right:0!important;z-index:5!important;pointer-events:none!important;filter:none!important}
  #hcMemoryWall .hc-memory-wall-title{display:none!important}
  #hcMemoryWall .hc-memory-wall-grid{position:absolute!important;inset:0!important;display:block!important;pointer-events:none!important}
  #hcMemoryWall .hc-memory-trace{position:absolute!important;width:74px!important;min-height:0!important;pointer-events:auto!important;transition:transform .18s ease,filter .18s ease,opacity .18s ease!important;z-index:2}
  #hcMemoryWall .hc-memory-trace:hover{z-index:10!important;transform:rotate(0deg) translateY(-4px) scale(1.08)!important}
  #hcMemoryWall .hc-trace-caption{opacity:0;transform:translateY(-2px);transition:.15s;background:rgba(255,250,241,.92);padding:2px 4px;border-radius:5px;box-shadow:0 2px 7px rgba(45,35,25,.08)}
  #hcMemoryWall .hc-memory-trace:hover .hc-trace-caption{opacity:1;transform:none}
  #hcMemoryWall .hc-trace-day{display:none}
  #hcMemoryWall .zone-wall{top:10%;right:18%}
  #hcMemoryWall .zone-wall.z2{top:15%;right:10%}
  #hcMemoryWall .zone-wall.z3{top:8%;right:28%}
  #hcMemoryWall .zone-wall.z4{top:22%;right:20%}
  #hcMemoryWall .zone-table{left:28%;bottom:25%}
  #hcMemoryWall .zone-table.z2{left:36%;bottom:20%}
  #hcMemoryWall .zone-table.z3{left:42%;bottom:27%}
  #hcMemoryWall .zone-shelf{right:7%;bottom:24%}
  #hcMemoryWall .zone-shelf.z2{right:14%;bottom:18%}
  #hcMemoryWall .zone-mirror{left:8%;top:20%}
  #hcMemoryWall .zone-mirror.z2{left:12%;top:31%}
  #hcMemoryWall .zone-boxes{right:7%;bottom:8%}
  #hcMemoryWall .zone-boxes.z2{right:17%;bottom:10%}
  #hcMemoryWall .zone-floor{left:48%;bottom:9%}
  #hcMemoryWall .zone-floor.z2{left:57%;bottom:12%}
  #hcMemoryWall .hc-memory-trace.zone-table .hc-trace-visual,#hcMemoryWall .hc-memory-trace.zone-shelf .hc-trace-visual,#hcMemoryWall .hc-memory-trace.zone-boxes .hc-trace-visual,#hcMemoryWall .hc-memory-trace.zone-floor .hc-trace-visual{transform:scale(.88)}
  @media(max-width:850px){
    #hcMemoryWall .hc-memory-trace{width:58px!important}
    #hcMemoryWall .zone-wall{top:8%;right:12%}.zone-wall.z2{top:17%;right:7%}
    #hcMemoryWall .zone-table{left:33%;bottom:24%}.zone-table.z2{left:45%;bottom:19%}
    #hcMemoryWall .zone-shelf{right:5%;bottom:27%}.zone-shelf.z2{right:13%;bottom:17%}
    #hcMemoryWall .zone-mirror{left:5%;top:18%}.zone-mirror.z2{left:8%;top:30%}
    #hcMemoryWall .zone-boxes{right:5%;bottom:8%}.zone-boxes.z2{right:15%;bottom:9%}
    #hcMemoryWall .zone-floor{left:50%;bottom:8%}.zone-floor.z2{left:62%;bottom:11%}
  }
  `;document.head.appendChild(st)}
  function zoneFor(btn,i){const v=$('.hc-trace-visual',btn);const cls=[...(v?.classList||[])].find(x=>x.indexOf('hc-trace-')===0&&x!=='hc-trace-visual')||'';const type=cls.replace('hc-trace-','');
    if(type==='frame'||type==='sketch'||type==='postcard')return'wall';
    if(type==='swatch'||type==='object')return i%2?'table':'shelf';
    if(type==='letter'||type==='flower')return i%2?'mirror':'wall';
    if(type==='note')return i%2?'boxes':'table';
    return i%2?'floor':'wall';
  }
  function arrange(){const wall=$('#hcMemoryWall'),room=$('#atelier .atelier-room');if(!wall||!room)return false;styles();const counts={wall:0,table:0,shelf:0,mirror:0,boxes:0,floor:0};$$('.hc-memory-trace',wall).forEach((b,i)=>{['zone-wall','zone-table','zone-shelf','zone-mirror','zone-boxes','zone-floor','z2','z3','z4'].forEach(c=>b.classList.remove(c));const z=zoneFor(b,i);counts[z]++;b.classList.add('zone-'+z);const n=counts[z];if(n>1)b.classList.add('z'+Math.min(n,4));b.dataset.hcZone=z;b.title=(b.title||'Souvenir')+' · '+({wall:'accroché au mur',table:'posé sur la table',shelf:'gardé sur une étagère',mirror:'près du miroir',boxes:'avec les cartons',floor:'posé dans l’atelier'}[z]||'dans l’atelier'))});return true}
  function observe(){const room=$('#atelier .atelier-room');if(!room||room.dataset.hcMemoryLayout)return false;room.dataset.hcMemoryLayout='1';new MutationObserver(()=>setTimeout(arrange,0)).observe(room,{childList:true,subtree:true});return true}
  function install(){styles();const ok=arrange();observe();return ok}
  let tries=0;const t=setInterval(()=>{tries++;if(install()||tries>180)clearInterval(t)},80);
})();