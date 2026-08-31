/* Haute Couture Live — moodboard cleanup v1
   Nettoie les doublons de barres et garde une seule commande moodboard.
*/
(function(){
'use strict';
if(window.__HC_MOODBOARD_CLEANUP_V1__)return;
window.__HC_MOODBOARD_CLEANUP_V1__=true;
let tries=0;
function run(){
  tries++;
  const board=document.getElementById('board');
  if(!board){if(tries<80)setTimeout(run,150);return;}
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
