/* Compatibility shim only.
   Ain studio preparation is handled by ain-parity-system-bridge-v1.js.
   Cached pages may still request this asset, so it remains a non-duplicating facade. */
(function(){
'use strict';
if(window.__HCAinStudioPhotoV1)return;window.__HCAinStudioPhotoV1=true;
const bridge=()=>window.HCAinParitySystemBridge||null;
window.HCAinStudioPhoto={
 finished(){return bridge()?.finishedCreations?.()||[]},
 open(payload){return bridge()?.prepareStudio?.(payload||{})||null},
 record(payload){return bridge()?.prepareStudio?.(payload||{})||null}
};
})();
