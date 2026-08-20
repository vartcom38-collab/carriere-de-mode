(function(){
  if(window.__HCCharacterInteractionPrototype)return;window.__HCCharacterInteractionPrototype=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const cast=[
    {id:'clara',name:'Clara',note:'Poétique · détails sensibles',accent:'#d8b6a6',dress:'#ead6c8',hair:'#5b4438',object:'carnet'},
    {id:'ines',name:'Inès',note:'Solaire · couleur & mouvement',accent:'#d8845d',dress:'#e8a173',hair:'#2d2523',object:'foulard'},
    {id:'maya',name:'Maya',note:'Direction créative · silhouette',accent:'#839579',dress:'#9dac91',hair:'#3a2d2a',object:'crayon'}
  ];
  let mounted=false,focused=null,coarse=matchMedia('(pointer:coarse)').matches;

  function css(){if($('#hcCharacterInteractionStyles'))return;const s=document.createElement('style');s.id='hcCharacterInteractionStyles';s.textContent=`
  #characters .selection-stage.hc-proto-on .selection-art{filter:saturate(.72) brightness(1.05);opacity:.62;transform:scale(1.015);transition:.45s ease}
  #characters .selection-stage.hc-proto-on .hit-grid{pointer-events:none;opacity:0}
  .hc-char-proto{position:absolute;inset:0;z-index:4;pointer-events:none;overflow:hidden}
  .hc-char-proto:before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(248,245,238,.10),rgba(248,245,238,.32) 70%,rgba(248,245,238,.72));pointer-events:none}
  .hc-char-proto-head{position:absolute;left:50%;top:3.5%;transform:translateX(-50%);text-align:center;pointer-events:none}
  .hc-char-proto-head b{font:clamp(24px,3vw,42px)/1 Georgia,serif;font-weight:400;color:#3f413d}.hc-char-proto-head small{display:block;margin-top:6px;font:10px Arial,sans-serif;letter-spacing:.17em;text-transform:uppercase;color:#7b8276}
  .hc-char-proto-row{position:absolute;left:8%;right:8%;bottom:5%;top:13%;display:flex;align-items:flex-end;justify-content:center;gap:clamp(12px,3.4vw,54px);pointer-events:none}
  .hc-char-standee{position:relative;width:min(25%,250px);height:86%;border:0;background:transparent;padding:0;cursor:pointer;pointer-events:auto;transform-origin:50% 100%;transition:transform .28s cubic-bezier(.2,.75,.2,1),filter .28s,opacity .28s;touch-action:manipulation;outline:none}
  .hc-char-standee .figure{position:absolute;left:50%;bottom:9%;width:82%;height:82%;transform:translateX(-50%);filter:drop-shadow(0 12px 10px rgba(55,45,38,.13));transition:transform .28s cubic-bezier(.2,.75,.2,1)}
  .hc-char-standee .ground{position:absolute;left:20%;right:20%;bottom:5%;height:18px;border-radius:50%;background:radial-gradient(ellipse,rgba(67,62,55,.16),transparent 70%);transition:.28s}
  .hc-char-standee .scribble{position:absolute;left:50%;bottom:1.5%;transform:translateX(-50%) rotate(-2deg);white-space:nowrap;background:rgba(255,252,246,.90);border:1px solid rgba(74,70,62,.10);box-shadow:0 7px 20px rgba(50,40,30,.08);border-radius:999px;padding:7px 12px;opacity:.88;transition:.25s}
  .hc-char-standee .scribble strong{display:block;font:18px 'Segoe Print','Bradley Hand',cursive;font-weight:500;color:#454943}.hc-char-standee .scribble span{display:block;font:9px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#7a8177;margin-top:1px}
  .hc-char-standee:hover,.hc-char-standee:focus-visible,.hc-char-standee.focused{transform:translateY(-16px) scale(1.075);z-index:3}
  .hc-char-standee:hover .figure,.hc-char-standee:focus-visible .figure,.hc-char-standee.focused .figure{transform:translateX(-50%) translateY(-4px)}
  .hc-char-standee:hover .ground,.hc-char-standee.focused .ground{transform:scale(.88);opacity:.65}
  .hc-char-proto.has-focus .hc-char-standee:not(.focused){filter:saturate(.68) brightness(.98);opacity:.58;transform:scale(.965)}
  .hc-char-proto.has-focus .hc-char-standee.focused{opacity:1;filter:none}
  .hc-char-hint{position:absolute;left:50%;bottom:1.5%;transform:translateX(-50%);z-index:7;background:rgba(62,67,60,.90);color:#fff;border-radius:999px;padding:8px 13px;font:10px Arial,sans-serif;letter-spacing:.04em;opacity:0;transition:.2s;pointer-events:none}.hc-char-hint.show{opacity:1;bottom:3%}
  .hc-char-proto-badge{position:absolute;right:14px;top:14px;z-index:7;background:rgba(255,252,246,.86);border:1px solid rgba(70,70,64,.12);border-radius:999px;padding:7px 10px;font:9px Arial,sans-serif;letter-spacing:.11em;text-transform:uppercase;color:#6f786d;pointer-events:none}
  .hc-char-spark{position:absolute;left:50%;top:12%;font-size:16px;opacity:0;transform:translate(-50%,6px);transition:.28s;color:#7d9274}.hc-char-standee.focused .hc-char-spark{opacity:1;transform:translate(-50%,0)}
  @keyframes hc-breathe{0%,100%{transform:translateX(-50%) translateY(0) scaleY(1)}50%{transform:translateX(-50%) translateY(-2px) scaleY(1.004)}}
  .hc-char-standee.focused .figure{animation:hc-breathe 3.6s ease-in-out infinite}
  @media(max-width:760px){.hc-char-proto-row{left:2%;right:2%;gap:2px;top:15%;bottom:6%}.hc-char-standee{width:32%;height:82%}.hc-char-standee .figure{width:96%;height:79%;bottom:12%}.hc-char-standee .scribble{padding:6px 8px;max-width:96%}.hc-char-standee .scribble strong{font-size:15px}.hc-char-standee .scribble span{display:none}.hc-char-proto-head{top:5%}.hc-char-proto-head b{font-size:25px}.hc-char-proto-head small{font-size:8px}.hc-char-proto-badge{right:8px;top:8px}.hc-char-standee:hover{transform:none}.hc-char-standee.focused{transform:translateY(-10px) scale(1.05)}}
  `;document.head.appendChild(s)}

  function figure(c,i){
    const skin=['#e8b996','#b77f60','#c79272'][i];
    const hair=c.hair, dress=c.dress, accent=c.accent;
    return `<svg viewBox="0 0 220 520" aria-hidden="true" preserveAspectRatio="xMidYMax meet">
      <defs><linearGradient id="g${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dress}"/><stop offset="1" stop-color="${accent}"/></linearGradient></defs>
      <path d="M70 500 C85 490 135 490 150 500" fill="none" stroke="#7f796f" stroke-width="3" stroke-linecap="round" opacity=".45"/>
      <ellipse cx="110" cy="83" rx="44" ry="49" fill="${hair}"/>
      <ellipse cx="110" cy="91" rx="32" ry="38" fill="${skin}"/>
      <path d="M78 82 Q108 40 143 74 Q132 43 105 43 Q79 46 69 73Z" fill="${hair}"/>
      <path d="M96 92 q6 5 12 0M120 92 q6 5 12 0" fill="none" stroke="#4e4038" stroke-width="2" stroke-linecap="round"/>
      <path d="M108 106 q5 4 10 0" fill="none" stroke="#8d5f54" stroke-width="2" stroke-linecap="round"/>
      <path d="M96 126 L91 154 L129 154 L124 126" fill="${skin}"/>
      <path d="M75 158 Q110 139 145 158 L172 337 Q143 362 110 365 Q77 362 48 337Z" fill="url(#g${i})" stroke="#5d5b55" stroke-width="2"/>
      <path d="M72 164 Q54 210 44 274" fill="none" stroke="${skin}" stroke-width="19" stroke-linecap="round"/><path d="M148 164 Q168 214 176 274" fill="none" stroke="${skin}" stroke-width="19" stroke-linecap="round"/>
      <path d="M71 355 L76 478" fill="none" stroke="#4d4843" stroke-width="19" stroke-linecap="round"/><path d="M146 355 L143 478" fill="none" stroke="#4d4843" stroke-width="19" stroke-linecap="round"/>
      <path d="M61 484 q20-7 35 0" stroke="#3f3c38" stroke-width="12" stroke-linecap="round"/><path d="M127 484 q20-7 35 0" stroke="#3f3c38" stroke-width="12" stroke-linecap="round"/>
      ${i===0?'<path d="M80 203 Q110 225 140 203" fill="none" stroke="#fff8ef" stroke-width="5" stroke-dasharray="3 7"/><path d="M148 241 q25 10 19 41 q-20 8-34-10" fill="#d6ad91" opacity=".9"/>':''}
      ${i===1?'<path d="M66 178 Q113 213 154 175" fill="none" stroke="#eecf91" stroke-width="15" stroke-linecap="round"/><path d="M158 179 q14 29 24 48" fill="none" stroke="#eecf91" stroke-width="10" stroke-linecap="round"/>':''}
      ${i===2?'<path d="M104 172 L118 318" stroke="#51564d" stroke-width="4"/><path d="M170 248 l24 38" stroke="#343630" stroke-width="5" stroke-linecap="round"/>':''}
    </svg>`
  }

  function triggerProfile(id){
    const btn=$(`.char-hit[data-id="${id}"]`)||$$('.char-hit').find(x=>x.dataset.id===id);
    if(btn){btn.click();return true}
    if(typeof window.openProfile==='function'){window.openProfile(id);return true}
    return false;
  }
  function setFocus(id,announce=true){
    focused=id;const root=$('.hc-char-proto');if(!root)return;root.classList.add('has-focus');$$('.hc-char-standee',root).forEach(b=>b.classList.toggle('focused',b.dataset.id===id));
    if(announce){const c=cast.find(x=>x.id===id),hint=$('.hc-char-hint',root);if(hint&&c){hint.textContent=coarse?`${c.name} · touche encore pour ouvrir sa fiche`:`${c.name} · clique pour ouvrir sa fiche`;hint.classList.add('show');clearTimeout(hint._t);hint._t=setTimeout(()=>hint.classList.remove('show'),1800)}}
  }
  function clearFocus(){focused=null;const root=$('.hc-char-proto');if(!root)return;root.classList.remove('has-focus');$$('.hc-char-standee',root).forEach(b=>b.classList.remove('focused'))}
  function onActivate(e){const b=e.currentTarget,id=b.dataset.id;if(coarse&&focused!==id){e.preventDefault();setFocus(id);return}setFocus(id,false);triggerProfile(id)}

  function mount(){
    if(mounted)return;const screen=$('#characters'),stage=$('#characters .selection-stage');if(!screen||!stage)return;mounted=true;css();stage.classList.add('hc-proto-on');
    const root=document.createElement('div');root.className='hc-char-proto';root.innerHTML=`<div class="hc-char-proto-head"><b>Qui vas-tu devenir ?</b><small>prototype interactif · 3 personnages test</small></div><div class="hc-char-proto-badge">Interaction test</div><div class="hc-char-proto-row"></div><div class="hc-char-hint"></div>`;stage.appendChild(root);
    const row=$('.hc-char-proto-row',root);
    cast.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.className='hc-char-standee';b.dataset.id=c.id;b.setAttribute('aria-label',`Découvrir ${c.name}`);b.innerHTML=`<span class="hc-char-spark">✦</span><span class="ground"></span><span class="figure">${figure(c,i)}</span><span class="scribble"><strong>${c.name}</strong><span>${c.note}</span></span>`;b.addEventListener('mouseenter',()=>{if(!coarse)setFocus(c.id,false)});b.addEventListener('mouseleave',()=>{if(!coarse&&!$('#profileCard')?.classList.contains('open'))clearFocus()});b.addEventListener('focus',()=>setFocus(c.id,false));b.addEventListener('click',onActivate);row.appendChild(b)});
    root.addEventListener('pointerdown',e=>{if(e.target===root||e.target===row)clearFocus()});
  }
  function sync(){const active=$('#characters')?.classList.contains('active');if(active)mount()}
  function boot(){const screen=$('#characters');if(!screen)return;new MutationObserver(sync).observe(screen,{attributes:true,attributeFilter:['class']});sync()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();