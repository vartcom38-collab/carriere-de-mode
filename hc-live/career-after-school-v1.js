/* Haute Couture Live — transition école -> carrière, sans bootstrap de carrière directe. */
(function(){
'use strict';
if(window.HCCareerAfterSchool)return;
const KEY='haute-couture-career-after-school-v1';
const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??f}catch(_){return f}};
function schoolChoice(){return read('haute-couture-school-choice-v1',null)}
function currentCity(){const s=window.HCGame?.get?.(),school=schoolChoice();return s?.player?.city||school?.city||'France'}
function enter(options={}){
 if(!window.HCGame?.get||!window.HCGame?.save)return{ok:false,reason:'game-engine-missing'};
 const graduated=localStorage.getItem('haute-couture-school-graduated-v1')==='true';
 if(!graduated)return{ok:false,reason:'not-graduated'};
 const s=window.HCGame.get(),school=schoolChoice(),city=String(options.city||s.player?.city||school?.city||'France').trim()||'France';
 s.path=s.path||{};
 s.path.origin=s.path.origin||'school';
 s.path.type='career';
 s.path.stage='post-school';
 s.path.schoolId=s.path.schoolId||school?.id||null;
 s.player=s.player||{};
 s.player.city=city;
 s.home=s.home||{};
 if(options.keepCurrentHome!==true){s.home.listingId=null;s.home.city=city;s.home.type='À choisir';s.home.address=city;s.home.rent=0}
 s.flags=s.flags||{};
 s.flags.schoolGraduated=true;
 s.flags.careerAfterSchool=true;
 s.flags.postSchoolBaseChosen=!!options.city;
 s.flags.directCareerIntroDisabled=true;
 (s.objectives||[]).forEach(o=>{if(o.category==='ecole'&&o.status!=='done'){o.status='done';o.completedBy='graduation'}});
 const ensureObjective=(id,title,status='active')=>{let o=(s.objectives||[]).find(x=>x.id===id);if(!o){o={id,title,status,category:'carriere'};s.objectives.push(o)}else{o.title=title;o.status=status;o.category='carriere'}return o};
 ensureObjective('career-postschool-base',options.city?`M’installer à ${city}`:'Choisir où m’installer après l’école',options.city?'done':'active');
 ensureObjective('career-postschool-portfolio','Adapter mon portfolio à une première opportunité','active');
 ensureObjective('career-postschool-opportunity','Trouver ma première opportunité après l’école','active');
 const now=s.clock?.iso||new Date().toISOString();
 if(!(s.messages||[]).some(m=>m.id==='msg-career-postschool'))s.messages.unshift({id:'msg-career-postschool',from:'Carrière',avatar:'✦',subject:'La suite commence maintenant',text:`Tes trois années d’école sont derrière toi. Ton portfolio, tes acquis et tes relations restent disponibles. Tu peux maintenant construire ta carrière depuis ${city}, changer de ville plus tard et continuer à découvrir le métier sur le terrain.`,receivedAt:now,read:false});
 window.HCGame.save(s);
 const record={version:1,enteredAt:new Date().toISOString(),city,schoolId:school?.id||null,schoolCity:school?.city||null,mode:options.mode||'chosen'};
 localStorage.setItem(KEY,JSON.stringify(record));
 localStorage.setItem('haute-couture-current-location-v1',JSON.stringify({city,source:'post-school',updatedAt:new Date().toISOString()}));
 localStorage.setItem('haute-couture-current-screen','home');
 window.dispatchEvent(new CustomEvent('hc-career-after-school',{detail:record}));
 return{ok:true,state:s,record};
}
window.HCCareerAfterSchool={version:1,enter,currentCity,schoolChoice};
})();
