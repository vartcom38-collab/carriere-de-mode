const screens=[...document.querySelectorAll('.screen')];
const modal=document.querySelector('#modal');
const transition=document.querySelector('.transition');

// Accueil V0.2 : vrais boutons visibles superposés à l'illustration.
const home=document.querySelector('#home');
if(home){
  const menu=document.createElement('div');
  menu.id='main-menu';
  Object.assign(menu.style,{position:'absolute',left:'50%',top:'73%',transform:'translate(-50%,-50%)',width:'min(330px,76vw)',display:'grid',gap:'10px',zIndex:'4'});
  const specs=[
    ['continue','Continuer',true],
    ['newgame','Nouvelle partie',false],
    ['options','Options',false]
  ];
  specs.forEach(([action,label,disabled])=>{
    const old=home.querySelector(`.hot.${action}`);
    if(old) old.style.display='none';
    const b=document.createElement('button');
    b.dataset.action=action;
    b.textContent=label;
    b.disabled=disabled;
    Object.assign(b.style,{minHeight:'52px',border:'1px solid rgba(72,61,50,.42)',borderRadius:'5px',background:'rgba(250,247,239,.84)',color:'#3a342e',letterSpacing:'.085em',textTransform:'uppercase',fontSize:'14px',fontFamily:'Arial, sans-serif',boxShadow:'0 5px 18px rgba(55,44,34,.16)',cursor:disabled?'default':'pointer'});
    if(disabled) b.style.opacity='.48';
    menu.appendChild(b);
  });
  home.appendChild(menu);
  const settings=home.querySelector('.hot.settings');
  if(settings){
    settings.textContent='⚙';
    Object.assign(settings.style,{display:'block',right:'20px',top:'18px',left:'auto',bottom:'auto',width:'42px',height:'42px',borderRadius:'50%',border:'1px solid rgba(70,60,51,.26)',background:'rgba(250,247,239,.72)',fontSize:'19px',color:'#3a342e',zIndex:'5'});
  }
}

function show(name){
  if(transition){transition.classList.remove('go');void transition.offsetWidth;transition.classList.add('go');}
  setTimeout(()=>{screens.forEach(s=>s.classList.toggle('active',s.dataset.screen===name));},transition?280:0);
}
function toast(text){const t=document.createElement('div');t.className='toast';t.textContent=text;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}

document.addEventListener('click',e=>{
  const a=e.target.closest('[data-action]');if(!a)return;
  const action=a.dataset.action;
  if(action==='newgame')show('prologue');
  if(action==='home')show('home');
  if(action==='prologue')show('prologue');
  if(action==='characters')show('characters');
  if(action==='continue')toast('Aucune sauvegarde pour le moment');
  if(action==='options'){
    document.querySelector('#modal-title').textContent='Options';
    document.querySelector('#modal-text').textContent='Les réglages son, musique et affichage seront ajoutés ici.';
    modal.showModal();
  }
  if(action==='close')modal.close();
});

document.querySelectorAll('.character').forEach(card=>card.addEventListener('click',()=>{document.querySelectorAll('.character').forEach(c=>c.classList.remove('selected'));card.classList.add('selected');const confirm=document.querySelector('.screen-characters .btn.primary');confirm.disabled=false;confirm.textContent='Confirmer ce personnage';}));
