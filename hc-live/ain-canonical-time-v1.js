/* Ain -> horloge canonique */
(function(){
'use strict';
if(window.__HCAinCanonicalTimeV1)return;window.__HCAinCanonicalTimeV1=true;
window.addEventListener('hc-game-time-request',function(e){
 const d=e.detail||{};
 if(String(d.departmentCode||'')!=='01')return;
 const minutes=Math.max(0,Number(d.minutes)||0);
 if(!minutes||!window.HCGame?.advanceTime)return;
 window.HCGame.advanceTime(minutes,'Ain · '+(d.reason||'activité territoriale'));
 window.dispatchEvent(new CustomEvent('hc-ain-canonical-time',{detail:{minutes,reason:d.reason||'',city:d.city||''}}));
});
})();