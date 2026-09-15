/* Compatibility shim only.
   Ain invitations/RSVP are handled by ain-parity-system-bridge-v1.js.
   This facade avoids duplicate messages/calendar writes while cached pages may still request the asset. */
(function(){
'use strict';
if(window.__HCAinInvitationsV1)return;window.__HCAinInvitationsV1=true;
const bridge=()=>window.HCAinParitySystemBridge||null;
window.HCAinInvitations={
 issue(payload){return bridge()?.createInvitation?.(typeof payload==='object'?payload:{source:payload})||null},
 respond(id,status){return bridge()?.respondInvitation?.(id,status)||null}
};
})();
