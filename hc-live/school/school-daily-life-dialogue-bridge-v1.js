/* Haute Couture Live — transforme les moments quotidiens de l'école en scènes de dialogue immersives v1 */
(function(){
'use strict';
if(window.HCSchoolDailyLifeDialogueBridgeV1)return;
const PHOTO={
 'Léa Morin':'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&fm=jpg&q=84&w=1000',
 'Mila Nguyen':'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&fm=jpg&q=84&w=1000',
 'Nora Diallo':'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&fm=jpg&q=84&w=1000',
 'Sacha Bernard':'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&fm=jpg&q=84&w=1000',
 'Yanis Coste':'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&fm=jpg&q=84&w=1000',
 'Jade Ollivier':'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&fm=jpg&q=84&w=1000',
 'Elsa Kim':'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&fm=jpg&q=84&w=1000',
 'Maud Lefèvre':'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&fm=jpg&q=84&w=1000'
};
const KEY='haute-couture-school-daily-life-dialogue-bridge-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}},write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
function state(){const s=read(KEY,{version:1,opened:{}});s.opened=s.opened||{};return s}
function personName(m){return m.person||m.teacher||'Quelqu’un'}
function buildScene(m){const name=personName(m);return{id:`school-daily-${m.record.key}-${m.id}`,speaker:{name,role:m.type,photo:PHOTO[name]||'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&fm=jpg&q=84&w=1000'},eyebrow:'Un moment de la journée',dismissible:true,start:'hello',nodes:{hello:{text:m.text,subtext:'Tu peux répondre comme tu le sens. Il n’y a pas de “bonne” réponse sociale à optimiser.',choices:m.choices.map((c,i)=>({label:c[0],reply:c[1],replyEffects:{event:'hc-school-daily-life-dialogue-resolve',detail:{index:i,key:m.record.key}}}))}}}}
function suppressCard(){const el=document.getElementById('hc-school-daily-life');if(!el)return;const m=window.HCSchoolDailyLifeV1?.today?.();if(m?.record?.status==='available'){el.style.display='none'}else{el.style.display=''}}
function maybeOpen(){const path=location.pathname.toLowerCase();if(!/school-(day|life)/.test(path))return;if(!window.HCImmersiveDialogueV1||!window.HCSchoolDailyLifeV1)return;const m=window.HCSchoolDailyLifeV1.today();if(!m||m.record?.status!=='available'){suppressCard();return}const s=state();if(s.opened[m.record.key]){suppressCard();return}s.opened[m.record.key]={momentId:m.id,at:new Date().toISOString()};write(KEY,s);suppressCard();setTimeout(()=>window.HCImmersiveDialogueV1.open(buildScene(m)),520)}
window.addEventListener('hc-school-daily-life-dialogue-resolve',e=>{const i=Number(e.detail?.index);window.HCSchoolDailyLifeV1?.resolve?.(i);setTimeout(suppressCard,80)});
window.addEventListener('hc-dialogue-close',()=>setTimeout(suppressCard,40));
const boot=()=>{let tries=0;const timer=setInterval(()=>{tries++;if(window.HCImmersiveDialogueV1&&window.HCSchoolDailyLifeV1){clearInterval(timer);maybeOpen();return}if(tries>30)clearInterval(timer)},120)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.HCSchoolDailyLifeDialogueBridgeV1={version:1,buildScene,maybeOpen,state,storageKey:KEY};
})();
