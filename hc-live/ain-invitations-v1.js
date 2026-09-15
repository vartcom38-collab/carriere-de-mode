/* Ain — invitations / RSVP canoniques */
(function(){
'use strict';
if(window.__HCAinInvitationsV1)return;window.__HCAinInvitationsV1=true;
const KEY='haute-couture-ain-territorial-gameplay-v1';
const read=()=>{try{const m=JSON.parse(localStorage.getItem(KEY)||'{}');m.invitations=m.invitations||{};return m}catch(_){return{invitations:{}}}};
const save=m=>{try{localStorage.setItem(KEY,JSON.stringify(m))}catch(_){}return m};
const game=()=>window.HCGame||null;
const presence=()=>window.HCTerritoryContext?.getPresence?.()||null;
const active=()=>String(presence()?.departmentCode||'')==='01';
const now=()=>game()?.get?.().clock?.iso||new Date().toISOString();
function tomorrow19(){const d=new Date(now());d.setDate(d.getDate()+1);d.setHours(19,0,0,0);const p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T19:00:00`}
function issue(source='territoire'){
 if(!active())return null;const m=read(),year=new Date(now()).getFullYear(),id='ain-bourg-invitation-'+year;if(m.invitations[id])return m.invitations[id];
 const city=presence()?.city||'Bourg-en-Bresse',inv={id,title:'Présentation créative locale',city,location:city+' · lieu privé FICTION GAMEPLAY',provenance:'Alice Bertrand · réseau événementiel FICTION GAMEPLAY',dressCode:'créatif soigné',start:tomorrow19(),status:'pending',source,createdAt:now()};
 m.invitations[id]=inv;save(m);game()?.addMessage?.({id:'msg-'+id,from:'Alice Bertrand',avatar:'A',subject:'Invitation — présentation créative',text:`J’organise demain une petite présentation professionnelle à ${city}. Si tu veux venir, confirme ta présence. Dress code : ${inv.dressCode}.`,action:{type:'ain_invitation',id}});window.dispatchEvent(new CustomEvent('hc-ain-invitation',{detail:inv}));return inv;
}
function respond(id,status){const m=read(),inv=m.invitations[id];if(!inv||!['accepted','declined'].includes(status))return{ok:false};inv.status=status;inv.respondedAt=now();save(m);if(status==='accepted'){const s=game()?.get?.();if(!s?.calendar?.some?.(e=>e.id==='calendar-'+id))game()?.schedule?.({id:'calendar-'+id,title:inv.title,type:'invitation',start:inv.start,status:'planned',location:inv.location});game()?.addMessage?.({id:'msg-'+id+'-ok',from:'Alice Bertrand',avatar:'A',subject:'Invitation confirmée',text:'C’est noté. Le rendez-vous est maintenant dans ton Agenda.'})}else game()?.addMessage?.({id:'msg-'+id+'-no',from:'Alice Bertrand',avatar:'A',subject:'Invitation déclinée',text:'Merci pour ta réponse. Une autre occasion pourra se présenter.'});window.dispatchEvent(new CustomEvent('hc-ain-invitation-rsvp',{detail:{...inv}}));return{ok:true,inv}}
window.addEventListener('hc-territorial-person-memory',e=>{const d=e.detail||{},p=d.person||{};if(String(d.departmentCode||'')==='01'&&p.id==='alice-bertrand'&&Number(p.memory?.interactions||0)>=2)issue('relation')});
window.addEventListener('hc-territorial-brief-unlocked',e=>{const d=e.detail||{};if(String(d.departmentCode||'')==='01'&&String(d.brief?.city||presence()?.city||'').includes('Bourg'))issue('brief')});
function decorate(){if(!active())return;const actions=document.querySelector('#overlay .guide-actions');if(!actions||actions.querySelector('.hc-ain-rsvp'))return;const inv=Object.values(read().invitations).find(x=>x.status==='pending');if(!inv)return;const box=document.createElement('div');box.className='hc-ain-rsvp';box.style.cssText='width:100%;padding:12px;margin:8px 0;border:1px solid #d7c5b8;border-radius:12px;background:#fff8f2;color:#211a16';box.innerHTML=`<strong>INVITATION EN ATTENTE</strong><div style="margin-top:6px">${inv.title} · ${inv.city}<br><small>${inv.provenance} · dress code ${inv.dressCode}</small></div><div style="display:flex;gap:7px;margin-top:10px"><button data-r="accepted">ACCEPTER</button><button data-r="declined">DÉCLINER</button></div>`;actions.prepend(box);box.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{const r=respond(inv.id,b.dataset.r);if(r.ok)box.innerHTML='<strong>✓ RÉPONSE ENREGISTRÉE</strong><div style="margin-top:6px">'+(b.dataset.r==='accepted'?'Ajoutée à l’Agenda.':'Invitation déclinée.')+'</div>'})}
let tries=0,t=setInterval(()=>{tries++;if(window.HCLocalMapOpenGuide&&!window.__HCAinInviteGuideHook){window.__HCAinInviteGuideHook=true;const base=window.HCLocalMapOpenGuide;window.HCLocalMapOpenGuide=function(item){base(item);setTimeout(decorate,0)};clearInterval(t)}else if(tries>80)clearInterval(t)},100);
window.HCAinInvitations={issue,respond};
})();