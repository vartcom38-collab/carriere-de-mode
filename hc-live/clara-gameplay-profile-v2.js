(function(){
  if(window.__HCClaraGameplayProfileV2)return;window.__HCClaraGameplayProfileV2=true;
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const DATA={
    background:'École d’arts appliqués à Lyon · stage en atelier de robes de mariée',
    objective:'Décrocher une place dans un atelier reconnu et construire une première mini-collection personnelle.',
    pace:'Lent · sensible · précis',
    levels:[['Technique','À l’aise'],['Créativité','Forte'],['Réseau','Débutante']],
    quote:'Je préfère qu’un détail juste parle plus fort qu’un vêtement qui crie.'
  };
  function css(){
    if($('#hcClaraGameplayProfileV2Styles'))return;
    const s=document.createElement('style');s.id='hcClaraGameplayProfileV2Styles';s.textContent=`
      #characters .hc-focus[data-hc-clara='1'] .hc-focus-actions{grid-template-columns:1fr!important}
      #characters .hc-focus[data-hc-clara='1'] [data-compare]{display:none!important}
      #characters .hc-focus .hc-start-card-v2{margin:10px 0 12px;padding:12px 13px;border-radius:15px;background:linear-gradient(135deg,#fffaf3,#f2e6d9);border:1px solid rgba(142,101,76,.09)}
      #characters .hc-focus .hc-start-card-v2 .eyebrow{font:700 7px/1 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#8d7b6f;margin-bottom:7px}
      #characters .hc-focus .hc-start-card-v2 .pace{font:italic 15px/1.2 Georgia,serif;color:#66564e;margin-bottom:9px}
      #characters .hc-focus .hc-start-grid-v2{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
      #characters .hc-focus .hc-start-grid-v2 div{padding:7px 6px;border-radius:10px;background:rgba(255,253,248,.85);text-align:center;border:1px solid rgba(121,91,70,.06)}
      #characters .hc-focus .hc-start-grid-v2 b{display:block;font:600 6px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#9a8778;margin-bottom:3px}
      #characters .hc-focus .hc-start-grid-v2 span{font:12px Georgia,serif;color:#514944}
      .hc-clara-sheet-v1 .hc-clara-path-meta-v2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}
      .hc-clara-sheet-v1 .hc-clara-meta-v2{padding:15px 16px;border-radius:17px;background:#f6ecdf;border:1px solid rgba(123,92,70,.08)}
      .hc-clara-sheet-v1 .hc-clara-meta-v2 b{display:block;font:700 8px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#8e786a;margin-bottom:5px}
      .hc-clara-sheet-v1 .hc-clara-meta-v2 p{margin:0;font:13px/1.45 Georgia,serif;color:#554d47}
      .hc-clara-sheet-v1 .hc-levels-v2{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}
      .hc-clara-sheet-v1 .hc-level-v2{padding:11px;border-radius:13px;background:#fffaf4;border:1px solid rgba(110,83,63,.08)}
      .hc-clara-sheet-v1 .hc-level-v2 b{display:block;font:600 7px Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#927e70;margin-bottom:4px}
      .hc-clara-sheet-v1 .hc-level-v2 span{font:15px Georgia,serif;color:#4f4944}
      .hc-clara-sheet-v1 .hc-clara-choose-v2{margin-top:14px;width:100%;min-height:50px;border:0;border-radius:14px;background:#788d72;color:white;font:17px Georgia,serif;cursor:pointer;box-shadow:0 10px 24px rgba(76,94,70,.16)}
      .hc-clara-sheet-v1 .hc-clara-choose-v2:hover{transform:translateY(-1px)}
      @media(max-width:850px){.hc-clara-sheet-v1 .hc-clara-path-meta-v2,.hc-clara-sheet-v1 .hc-levels-v2{grid-template-columns:1fr}}
    `;document.head.appendChild(s)
  }
  function selected(){return $('#characters .hc-person.focused')?.dataset.id||null}
  function patchFocus(){
    const focus=$('#characters .hc-focus');if(!focus)return;
    const isClara=selected()==='clara';
    focus.dataset.hcClara=isClara?'1':'0';
    if(!isClara){$('.hc-start-card-v2',focus)?.remove();return}
    const actions=$('.hc-focus-actions',focus);if(!actions)return;
    const compare=$('[data-compare]',actions);if(compare)compare.style.display='none';
    const primary=$('[data-profile]',actions);if(primary)primary.textContent='Découvrir Clara';
    if(!$('.hc-start-card-v2',focus)){
      const c=document.createElement('section');c.className='hc-start-card-v2';
      c.innerHTML=`<div class="eyebrow">Ton début de partie</div><div class="pace">${DATA.pace}</div><div class="hc-start-grid-v2">${DATA.levels.map(x=>`<div><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div>`;
      actions.before(c);
    }
  }
  function enrichSheet(){
    const sheet=$('.hc-clara-sheet-v1.open');if(!sheet)return false;
    const right=$('.hc-clara-right-v1',sheet),left=$('.hc-clara-left-v1',sheet);if(!right||!left)return false;
    if(!$('.hc-clara-path-meta-v2',sheet)){
      const meta=document.createElement('div');meta.className='hc-clara-path-meta-v2';
      meta.innerHTML=`<div class="hc-clara-meta-v2"><b>Milieu de départ</b><p>${DATA.background}</p></div><div class="hc-clara-meta-v2"><b>Premier objectif</b><p>${DATA.objective}</p></div>`;
      const first=$('.hc-story-v1:nth-of-type(2)',right)||$('.hc-story-v1',right);(first||right).insertAdjacentElement(first?'afterend':'afterbegin',meta);
    }
    if(!$('.hc-levels-v2',sheet)){
      const levels=document.createElement('div');levels.className='hc-levels-v2';levels.innerHTML=DATA.levels.map(x=>`<div class="hc-level-v2"><b>${x[0]}</b><span>${x[1]}</span></div>`).join('');right.prepend(levels);
    }
    if(!$('.hc-clara-choose-v2',sheet)){
      const b=document.createElement('button');b.type='button';b.className='hc-clara-choose-v2';b.textContent='✦ Je deviens Clara';b.onclick=chooseClara;right.appendChild(b)
    }
    const q=$('.quote',left);if(q&&!q.dataset.v2){q.dataset.v2='1';q.insertAdjacentHTML('beforebegin',`<div style="margin-top:18px;font:italic 14px/1.45 Georgia,serif;color:#78665b">« ${DATA.quote} »</div>`)}
    return true
  }
  function chooseClara(){
    try{localStorage.setItem('haute-couture-character','clara');localStorage.setItem('haute-couture-selected-character','clara');localStorage.setItem('selectedCharacter','clara')}catch(e){}
    document.querySelector('.hc-sheet-v1')?.remove();
    try{if(typeof window.displayScreen==='function'){window.displayScreen('location');return}}catch(e){}
    const loc=$('#location');if(loc){document.querySelectorAll('.panel,.optionsPanel').forEach(p=>p.classList.remove('active'));loc.classList.add('active');loc.style.display='block'}
  }
  function watchOpen(){let n=0;const t=setInterval(()=>{if(enrichSheet()||++n>20)clearInterval(t)},40)}
  function boot(){css();setTimeout(patchFocus,220);document.addEventListener('click',e=>{
    if(e.target.closest?.('#characters .hc-person,#characters .hc-focus-nav'))setTimeout(patchFocus,20);
    if(e.target.closest?.('#characters .hc-focus [data-profile]')&&selected()==='clara')watchOpen();
  },true)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();