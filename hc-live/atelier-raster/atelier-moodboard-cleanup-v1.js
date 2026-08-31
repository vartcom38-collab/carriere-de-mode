/* Haute Couture Live — moodboard cleanup v1.1
   Nettoie les doublons de barres et garde une seule commande moodboard.
   Fix critique : le moodboard devient l'unique propriétaire du drop catalogue.
*/
(function(){
'use strict';
if(window.__HC_MOODBOARD_CLEANUP_V1__)return;
window.__HC_MOODBOARD_CLEANUP_V1__=true;
let tries=0;

function installSingleDropOwner(board){
  if(!board||board.dataset.hcSingleDropOwner)return;
  board.dataset.hcSingleDropOwner='1';

  const isCatalogPayload=e=>{
    try{
      const raw=e.dataTransfer?.getData('text/hcv2-item');
      if(!raw)return null;
      const data=JSON.parse(raw);
      return data?.kind==='catalog'&&data?.id?data:null;
    }catch(_){return null;}
  };

  board.addEventListener('dragover',e=>{
    const types=[...(e.dataTransfer?.types||[])];
    if(!types.includes('text/hcv2-item'))return;
    e.preventDefault();
    if(e.dataTransfer)e.dataTransfer.dropEffect='copy';
    board.classList.add('hc-board-dragover');
  },true);

  board.addEventListener('drop',async e=>{
    const data=isCatalogPayload(e);
    if(!data)return; // laisse les tissus/autres anciens flux continuer normalement

    // IMPORTANT : un seul handler doit créer la carte.
    // Le shell v2 possède encore un ancien drop en bubbling ; on le neutralise ici.
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    board.classList.remove('hc-board-dragover');
    document.body.classList.remove('hc-library-dragging');

    const api=window.HCAtelierBoardComponents;
    if(!api?.addToBoard)return;
    const r=board.getBoundingClientRect();
    const x=e.clientX-r.left-82;
    const y=e.clientY-r.top-80;
    const ok=await api.addToBoard(data.id,{referenceId:data.referenceId||null,x,y});
    if(ok){
      // Synchronisation après toutes les MutationObserver / anciens patches du même tick.
      requestAnimationFrame(()=>{
        api.sync?.();
        setTimeout(()=>api.sync?.(),50);
        window.dispatchEvent(new CustomEvent('hc-atelier-moodboard-changed'));
      });
    }
  },true);
}

function run(){
  tries++;
  const board=document.getElementById('board');
  if(!board){if(tries<80)setTimeout(run,150);return;}

  installSingleDropOwner(board);

  const fixed=document.getElementById('hcMoodboardToolbarFixed');
  const old=document.getElementById('hcMoodboardToolbar');
  if(fixed&&old)old.remove();
  if(fixed){
    const b=fixed.querySelector('b');
    const s=fixed.querySelector('span');
    if(b)b.textContent='Composer mon moodboard';
    if(s)s.textContent='Placement libre · références · matières · couleurs · notes';
  }
  const empty=document.getElementById('hcBoardEmpty');
  if(empty){
    const b=empty.querySelector('b');
    const s=empty.querySelector('span');
    if(b)b.textContent='Ta planche est libre';
    if(s)s.textContent='Glisse ici tes inspirations et organise-les comme une vraie planche de styliste.';
  }
  if(!document.getElementById('hcMoodboardCleanupCss')){
    const style=document.createElement('style');style.id='hcMoodboardCleanupCss';style.textContent=`
#hcMoodboardToolbarFixed{margin-bottom:12px!important}
#hcMoodboardToolbarFixed+ #board{margin-top:0!important}
.hcv2-left-top h2{letter-spacing:-.02em}
.hcv2-acc>summary{background:#fffdf9!important}
.hcv2-acc[open]>summary{background:#f8efe8!important;border-bottom:1px solid #eadfd6!important}
.hcv2-acc>summary:hover{background:#fbf4ee!important}
`;
    document.head.appendChild(style);
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,150));else setTimeout(run,150);
})();
