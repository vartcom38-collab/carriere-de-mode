/* Haute Couture Live — rencontres hors promo converties en scènes immersives v1 */
(function(){
'use strict';
if(window.HCSchoolExpandedSocialDialogueBridgeV1)return;
const KEY='haute-couture-school-expanded-social-dialogue-bridge-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}},write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
const portraits={
 'other-student':'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&fm=jpg&q=84&w=1000',
 creative:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&fm=jpg&q=84&w=1000',
 artisan:'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&fm=jpg&q=84&w=1000',
 'young-pro':'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&fm=jpg&q=84&w=1000'
};
function state(){const s=read(KEY,{version:1,opened:{}});s.opened=s.opened||{};return s}
function visibleIdentity(o){const r=o.record||{};if(r.mode==='glimpse'||r.mode==='recognition')return{name:r.mode==='recognition'?'Une personne déjà croisée':'Quelqu’un que tu ne connais pas encore',role:'Présence dans la ville'};return{name:o.person.name,role:o.person.role}}
function sceneFor(o){const id=visibleIdentity(o),p=o.person,r=o.record,photo=portraits[p.kind]||portraits.creative;let text='',choices=[];
 if(r.mode==='glimpse'){text=p.intro;choices=[{label:'Continuer ma route',reply:'Tu continues. Cette personne reste simplement une présence aperçue dans le décor.',replyEffects:{event:'hc-expanded-social-dialogue-resolve',detail:{action:'continue'}}},{label:'Ne pas forcer la rencontre',reply:'Tu ne transformes pas chaque personne croisée en interaction. Peut-être que vos chemins se recroiseront.',replyEffects:{event:'hc-expanded-social-dialogue-resolve',detail:{action:'skip'}}}]}
 else if(r.mode==='recognition'){text=`Tu reconnais la personne aperçue plus tôt. ${p.intro}`;choices=[{label:'Échanger un signe',reply:'Vous vous reconnaissez désormais de vue, sans avoir encore réellement fait connaissance.',replyEffects:{event:'hc-expanded-social-dialogue-resolve',detail:{action:'continue'}}},{label:'Continuer ma journée',reply:'Tu poursuis ton chemin. La reconnaissance reste là pour une prochaine fois.',replyEffects:{event:'hc-expanded-social-dialogue-resolve',detail:{action:'skip'}}}]}
 else if(r.mode==='introduction'){text=`Une connaissance vous présente. Tu apprends enfin son prénom : ${p.name}. La conversation part naturellement de ${p.interest}.`;choices=[{label:'Prendre quelques minutes pour discuter',reply:`Tu fais réellement connaissance avec ${p.name}. Cette personne entre maintenant dans ton monde vécu.`,replyEffects:{event:'hc-expanded-social-dialogue-resolve',detail:{action:'continue'}}},{label:'Saluer et reprendre ma journée',reply:'La présentation a eu lieu, mais tu ne prolonges pas pour le moment.',replyEffects:{event:'hc-expanded-social-dialogue-resolve',detail:{action:'skip'}}}]}
 else{text=`Vous vous êtes déjà croisés plusieurs fois. Cette fois, la conversation dure assez pour parler de ${p.interest}.`;choices=[{label:'Continuer la conversation',reply:`${p.name} n’est plus seulement une personne croisée : vous avez désormais un début de relation.`,replyEffects:{event:'hc-expanded-social-dialogue-resolve',detail:{action:'continue'}}},{label:'Écourter gentiment',reply:'Tu reprends ta journée sans transformer ce moment en obligation sociale.',replyEffects:{event:'hc-expanded-social-dialogue-resolve',detail:{action:'skip'}}}]}
 return{id:`expanded-${r.key}`,speaker:{name:id.name,role:id.role,photo},eyebrow:r.mode==='introduction'?'Une présentation naturelle':'Une rencontre dans le monde',dismissible:true,start:'hello',nodes:{hello:{text,subtext:'Le jeu ne te révèle que ce que tu as réellement appris sur cette personne.',choices}}}}
function suppress(){const el=document.getElementById('hc-expanded-social-world');if(!el)return;const o=window.HCSchoolExpandedSocialWorldV1?.encounter?.();el.style.display=o?.record?.status==='available'?'none':''}
function maybeOpen(){if(!window.HCImmersiveDialogueV1||!window.HCSchoolExpandedSocialWorldV1)return;const o=window.HCSchoolExpandedSocialWorldV1.encounter();if(!o||o.record?.status!=='available'){suppress();return}const s=state();if(s.opened[o.record.key]){suppress();return}s.opened[o.record.key]={personId:o.person.id,mode:o.record.mode,at:new Date().toISOString()};write(KEY,s);suppress();setTimeout(()=>window.HCImmersiveDialogueV1.open(sceneFor(o)),850)}
window.addEventListener('hc-expanded-social-dialogue-resolve',e=>{window.HCSchoolExpandedSocialWorldV1?.resolve?.(e.detail?.action==='skip'?'skip':'continue');setTimeout(suppress,80)});
const boot=()=>{let n=0,t=setInterval(()=>{n++;if(window.HCImmersiveDialogueV1&&window.HCSchoolExpandedSocialWorldV1){clearInterval(t);maybeOpen()}else if(n>35)clearInterval(t)},120)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.HCSchoolExpandedSocialDialogueBridgeV1={version:1,sceneFor,maybeOpen,state,storageKey:KEY};
})();
