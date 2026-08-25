/* Haute Couture Live — fiche personnage vendeuse brocante Nîmes.
   Personnage fictif récurrent, relié à la mémoire de relation de la brocante.
*/
(function(){
'use strict';
const STATEKEY='haute-couture-nimes-brocante-state-v2';
const $=s=>document.querySelector(s);
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch(e){return f}};
const SELLER={
  id:'nimes-brocante-anais-ravel',
  firstName:'Anaïs',
  lastName:'Ravel',
  role:'Brocanteuse · chineuse textile',
  city:'Nîmes',
  fictional:true,
  image:'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=900',
  bio:'Anaïs tient sa brocante comme une collection vivante. Elle préfère les vêtements imparfaits, repris, transformés ou chargés d’une histoire aux pièces trop impeccables. Elle achète peu, garde longtemps, et se souvient très bien des personnes qui regardent la construction d’un vêtement avant son étiquette.',
  traits:['Observatrice','Directe','Très attachée à la provenance','Peu impressionnée par la réputation'],
  likes:'La curiosité sincère, les détails de construction, les gens qui savent laisser une pièce quand elle ne leur parle pas.',
  unlock:'Avec une relation suffisante, Anaïs pourra te prévenir d’un arrivage, garder une pièce de côté ou te parler d’un vendeur privé.'
};
function relation(){const s=read(STATEKEY,{});return Number(s.relation||0)}
function relationLabel(n){if(n>=6)return'Très bonne connaissance';if(n>=3)return'Confiance naissante';if(n>=1)return'Elle te reconnaît';return'Première rencontre'}
function css(){if($('#hcBrocanteSellerStyle'))return;const s=document.createElement('style');s.id='hcBrocanteSellerStyle';s.textContent=`
.nbs-card{display:grid;grid-template-columns:118px 1fr auto;gap:14px;align-items:center;background:#fff8f1;border:1px solid #e4d1c3;border-radius:20px;padding:12px;margin:0 0 14px;box-shadow:0 8px 20px #6b4a3410}.nbs-photo{width:118px;height:118px;object-fit:cover;border-radius:16px;background:#eee}.nbs-kicker{font-size:8px;letter-spacing:.14em;font-weight:900;color:#a47865}.nbs-card h3{font:27px/.95 Georgia,serif;margin:4px 0 5px}.nbs-card p{font:11px/1.5 Georgia,serif;color:#67574f;margin:0}.nbs-rel{display:inline-block;margin-top:8px;border:1px solid #dfcfc2;background:#fff;border-radius:999px;padding:6px 9px;font-size:8px;font-weight:900}.nbs-open{border:0;border-radius:11px;background:#211a16;color:#fff;padding:11px 13px;font-size:9px;font-weight:900;cursor:pointer}.nbs-modal{position:fixed;inset:0;z-index:9300;background:#241b16aa;display:grid;place-items:center;padding:20px}.nbs-sheet{width:min(900px,94vw);max-height:88vh;overflow:auto;background:#fffaf5;border:1px solid #ead9ca;border-radius:26px;padding:18px;box-shadow:0 28px 80px #0006}.nbs-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:14px}.nbs-close{border:1px solid #dfcfc2;background:#fff;border-radius:50%;width:40px;height:40px;font-size:22px;cursor:pointer}.nbs-profile{display:grid;grid-template-columns:280px 1fr;gap:22px}.nbs-profile img{width:100%;height:360px;object-fit:cover;border-radius:20px}.nbs-copy h2{font:44px/.9 Georgia,serif;margin:4px 0 8px}.nbs-copy p{font:14px/1.65 Georgia,serif;color:#5f5149}.nbs-facts{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:14px}.nbs-fact{border:1px solid #eadfd6;border-radius:14px;padding:11px;background:#fff}.nbs-fact small{display:block;font-size:7px;letter-spacing:.12em;font-weight:900;color:#9a7f70;margin-bottom:4px}.nbs-fact b,.nbs-fact span{font:13px/1.45 Georgia,serif}.nbs-disclaimer{margin-top:14px;font-size:8px;letter-spacing:.1em;color:#9a8172;text-transform:uppercase}@media(max-width:760px){.nbs-card{grid-template-columns:88px 1fr}.nbs-photo{width:88px;height:88px}.nbs-open{grid-column:1/-1}.nbs-profile{grid-template-columns:1fr}.nbs-profile img{height:280px}.nbs-facts{grid-template-columns:1fr}}
`;document.head.appendChild(s)}
function openProfile(){const n=relation(),m=document.createElement('div');m.className='nbs-modal';m.innerHTML=`<section class="nbs-sheet"><div class="nbs-head"><div class="nbs-kicker">PERSONNAGE · BROCANTE TEXTILE · NÎMES</div><button class="nbs-close" aria-label="Fermer">×</button></div><div class="nbs-profile"><img src="${SELLER.image}" alt="Portrait de ${SELLER.firstName} ${SELLER.lastName}"><div class="nbs-copy"><div class="nbs-kicker">${SELLER.role}</div><h2>${SELLER.firstName} ${SELLER.lastName}</h2><div class="nbs-rel">RELATION · ${relationLabel(n)} · ${n}</div><p>${SELLER.bio}</p><div class="nbs-facts"><div class="nbs-fact"><small>PERSONNALITÉ</small><span>${SELLER.traits.join(' · ')}</span></div><div class="nbs-fact"><small>CE QU’ELLE APPRÉCIE</small><span>${SELLER.likes}</span></div><div class="nbs-fact"><small>RÔLE DANS TA CARRIÈRE</small><span>${SELLER.unlock}</span></div><div class="nbs-fact"><small>STATUT</small><b>${n>=3?'Contact potentiel renforcé':'Relation à construire'}</b></div></div><div class="nbs-disclaimer">Personnage fictif créé pour le gameplay de Nîmes.</div></div></div></section>`;document.body.appendChild(m);const close=()=>m.remove();m.querySelector('.nbs-close').onclick=close;m.onclick=e=>{if(e.target===m)close()}}
function inject(){const body=$('#npBody');if(!body||!body.querySelector('.nbv3-grid')||body.querySelector('.nbs-card'))return;const n=relation(),card=document.createElement('section');card.className='nbs-card';card.innerHTML=`<img class="nbs-photo" src="${SELLER.image}" alt="${SELLER.firstName} ${SELLER.lastName}"><div><div class="nbs-kicker">LA VENDEUSE</div><h3>${SELLER.firstName} ${SELLER.lastName}</h3><p>${SELLER.role}. ${relationLabel(n)}.</p><span class="nbs-rel">RELATION · ${n}</span></div><button class="nbs-open">VOIR SA FICHE</button>`;card.querySelector('.nbs-open').onclick=openProfile;body.insertBefore(card,body.querySelector('.nbv3-grid'))}
function install(){css();const body=$('#npBody');if(!body){setTimeout(install,120);return}const obs=new MutationObserver(()=>inject());obs.observe(body,{childList:true,subtree:true});inject();window.addEventListener('hc-game-state',inject)}
install();
window.HCNimesBrocanteSeller=SELLER;
})();
