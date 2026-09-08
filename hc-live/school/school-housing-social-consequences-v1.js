/* Haute Couture Live — conséquences sociales du logement étudiant v1 */
(function(){
'use strict';
if(window.HCSchoolHousingSocialConsequencesV1)return;
const H='haute-couture-school-housing-v1',C='haute-couture-school-community-v1',K='haute-couture-school-housing-social-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
const now=()=>new Date().toISOString();
function profile(){const h=read(H,{}),type=h.type||'residence';return type==='colocation'?{type,social:'forte',privacy:'moyenne',rhythm:'vie partagée',encounter:'Les discussions continuent facilement après les cours : cuisine, salon, retours tardifs, petites invitations.'}:type==='studio'?{type,social:'faible',privacy:'forte',rhythm:'indépendante',encounter:'Les rencontres demandent davantage une décision de sortir ou de rester à l’école après les cours.'}:{type:'residence',social:'moyenne',privacy:'moyenne',rhythm:'étudiante',encounter:'Les couloirs, espaces communs et voisins étudiants créent des occasions de recroiser des gens sans les imposer.'}}
function state(){return read(K,{version:1,encounters:[],lastDay:null})}
function dailyChance(){const p=profile();return p.type==='colocation'?0.62:p.type==='residence'?0.42:0.20}
function seed(){const h=read(H,{}),a=read('haute-couture-school-academic-v1',{day:1,week:1,year:1});const str=[h.type,h.city,a.year,a.week,a.day].join('|');let x=0;for(let i=0;i<str.length;i++)x=(x*31+str.charCodeAt(i))>>>0;return x}
function candidate(){const community=window.HCSchoolCommunity;if(!community)return null;const students=community.students||[];if(!students.length)return null;return students[seed()%students.length]}
function maybeCreate(){const a=read('haute-couture-school-academic-v1',{day:1,week:1,year:1}),dayKey=[a.year,a.week,a.day].join('-'),s=state();if(s.lastDay===dayKey)return s.encounters[0]||null;s.lastDay=dayKey;const roll=(seed()%100)/100;if(roll>=dailyChance()){write(K,s);return null}const person=candidate(),p=profile();if(!person){write(K,s);return null}const item={id:'housing-social-'+dayKey+'-'+person.id,personId:person.id,name:person.name,housingType:p.type,city:read(H,{}).city||'',at:now(),text:p.type==='colocation'?`${person.name} passe un moment dans l’appartement ou rejoint une discussion de coloc. La relation peut continuer hors de l’école.`:p.type==='residence'?`Tu recroises ${person.name} près de la résidence. Ce n’est pas un rendez-vous prévu, juste une occasion de parler autrement qu’en cours.`:`Tu hésites à rentrer directement au studio. ${person.name} propose de prolonger un peu la journée autour d’un café ou d’un trajet.`};s.encounters.unshift(item);s.encounters=s.encounters.slice(0,40);write(K,s);try{window.HCSchoolCommunity?.interact?.(person.id,'discuter')}catch(_){}window.dispatchEvent(new CustomEvent('hc-school-housing-encounter',{detail:item}));return item}
function summary(){return{...profile(),recent:state().encounters.slice(0,5)}}
function boot(){setTimeout(maybeCreate,500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.HCSchoolHousingSocialConsequencesV1={version:1,profile,state,maybeCreate,summary,storageKey:K};
})();
