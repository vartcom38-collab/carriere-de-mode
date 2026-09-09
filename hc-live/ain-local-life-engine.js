(function(){
  if(window.__HCAinLocalLifeInstalled)return;window.__HCAinLocalLifeInstalled=true;
  const KEY='haute-couture-ain-personal-map-v1';
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const hash=v=>String(v||'').split('').reduce((a,c)=>((a*33)+c.charCodeAt(0))>>>0,5381);
  const first=['Camille','Nora','Malo','Inès','Sacha','Lina','Noé','Maëlle','Yanis','Lou','Jade','Simon','Mina','Éloi','Romane','Ilyes','Zoé','Nino'];
  const last=['Berger','Roux','Vernier','Morel','Costa','Perrin','Bailly','Giraud','Faure','Meyer','Caron','Marchal','Lombard','Renaud','Collet','Arnaud','Masson','Roche'];
  const templates={
    bresse:[
      {place:'Le Comptoir des Étoffes',kind:'Mercerie de gameplay',glyph:'✂',role:'commerçant·e textile',systems:['matières','clientes','réseau'],intro:'Une petite adresse de fournitures où circulent aussi des nouvelles locales.'},
      {place:'La Table du Passage',kind:'Café de gameplay',glyph:'☕',role:'personne qui tient le lieu',systems:['rencontres','événements','clientes'],intro:'Un rendez-vous régulier de quartier, pratique pour voir revenir les mêmes visages.'},
      {place:'Studio Bocage',kind:'Atelier photo fictif',glyph:'▣',role:'photographe indépendant·e',systems:['Book','shooting','réseau'],intro:'Un petit studio qui travaille avec des commerces, familles et événements du secteur.'}
    ],
    dombes:[
      {place:'Atelier des Reflets',kind:'Atelier matière fictif',glyph:'≈',role:'artisan·e couleur et matière',systems:['Atelier','matières','recherche'],intro:'Une adresse qui observe eau, végétal et teintes saisonnières sans imposer de commande.'},
      {place:'Café des Étangs',kind:'Café de gameplay',glyph:'☕',role:'hôte du lieu',systems:['rencontres','réseau','habitudes'],intro:'Un café où habitants, visiteurs et organisateurs finissent par se recroiser.'},
      {place:'Le Panneau des Saisons',kind:'Relais local fictif',glyph:'▧',role:'personne du réseau associatif',systems:['événements','clientes','carnet'],intro:'Un relais d’informations locales : marchés, observations, fêtes et petits besoins ponctuels.'}
    ],
    bugey:[
      {place:'Maison du Fil Vivant',kind:'Adresse textile fictive',glyph:'≋',role:'passeur·se de matières',systems:['Atelier','matières','mémoire'],intro:'Une adresse de gameplay qui relie archives, matières actuelles et fournisseurs du territoire.'},
      {place:'Atelier du Métal Fin',kind:'Atelier d’art fictif',glyph:'◇',role:'artisan·e métal et ornement',systems:['Atelier','accessoires','collaboration'],intro:'Un petit atelier pour parler détail, fermoir, ornement ou pièce métallique sur mesure.'},
      {place:'Le Banc de la Vallée',kind:'Lieu de rencontre fictif',glyph:'☕',role:'habitant·e bien connecté·e',systems:['réseau','clientes','mémoire locale'],intro:'Un point de rendez-vous sans prestige particulier, mais où le bouche-à-oreille compte.'}
    ],
    hautbugey:[
      {place:'Prototype 01',kind:'Atelier prototype fictif',glyph:'◉',role:'prototypiste accessoire',systems:['Atelier','accessoires','production'],intro:'Une petite structure de gameplay autour des essais, formes, montages et petites séries.'},
      {place:'Matière Commune',kind:'Bibliothèque matière fictive',glyph:'▦',role:'technicien·ne matière',systems:['matières','recherche','carrière'],intro:'Un lieu où l’on compare finitions, rigidités, transparences et possibilités de fabrication.'},
      {place:'Le Café des Dessinateurs',kind:'Café de gameplay',glyph:'☕',role:'créatif·ve indépendant·e',systems:['réseau','collaboration','clientes'],intro:'Une adresse informelle fréquentée par des profils de fabrication et de création.'}
    ],
    gexjura:[
      {place:'Atelier des Couches',kind:'Atelier technique fictif',glyph:'△',role:'réparateur·rice textile technique',systems:['Atelier','réparation','matières'],intro:'Un atelier de gameplay autour du mouvement, de la protection et des vêtements très portés.'},
      {place:'Maison des Passages',kind:'Lieu d’accueil fictif',glyph:'⇆',role:'hôte événementiel·le',systems:['événements','clientes','réseau'],intro:'Un lieu où résidents et personnes de passage peuvent se rencontrer sans hiérarchie de prestige.'},
      {place:'Le Comptoir du Col',kind:'Commerce fictif',glyph:'☕',role:'commerçant·e local·e',systems:['habitudes','réseau','clientes'],intro:'Une adresse récurrente qui change de fréquentation avec les saisons.'}
    ],
    perouges:[
      {place:'La Cour des Images',kind:'Studio fictif',glyph:'▣',role:'photographe de patrimoine',systems:['Book','shooting','réseau'],intro:'Une petite adresse pour parler cadrage, lieux anciens et prises de vue.'},
      {place:'L’Échoppe des Reprises',kind:'Brocante fictive',glyph:'⌁',role:'revendeur·se réemploi',systems:['matières','réemploi','Atelier'],intro:'Une échoppe de gameplay où vieux textiles, accessoires et objets changent régulièrement.'},
      {place:'Le Salon de la Porte Haute',kind:'Lieu de rendez-vous fictif',glyph:'☕',role:'hôte local·e',systems:['rencontres','clientes','événements'],intro:'Un point de rencontre où visiteurs, habitants et professionnels se croisent.'}
    ],
    revermont:[
      {place:'Atelier Terre & Fil',kind:'Atelier partagé fictif',glyph:'◇',role:'artisan·e pluridisciplinaire',systems:['Atelier','collaboration','matières'],intro:'Un atelier de gameplay pour petites séries, détails et croisements entre matières.'},
      {place:'La Maison des Gestes',kind:'Lieu de transmission fictif',glyph:'✦',role:'personne qui anime des ateliers',systems:['savoir-faire','réseau','événements'],intro:'Un lieu où des gestes se transmettent et où les habitants se retrouvent ponctuellement.'},
      {place:'Le Café du Piémont',kind:'Café de gameplay',glyph:'☕',role:'habitant·e du réseau local',systems:['habitudes','clientes','mémoire'],intro:'Une adresse simple où les relations se construisent surtout parce qu’on revient.'}
    ],
    generic:[
      {place:'L’Adresse des Matières',kind:'Commerce fictif',glyph:'✂',role:'commerçant·e local·e',systems:['matières','réseau'],intro:'Une adresse de gameplay liée aux fournitures et au bouche-à-oreille.'},
      {place:'Le Café du Centre',kind:'Café fictif',glyph:'☕',role:'hôte du lieu',systems:['rencontres','clientes'],intro:'Un lieu récurrent du quotidien où certains visages reviennent.'},
      {place:'L’Atelier Local',kind:'Atelier fictif',glyph:'◇',role:'artisan·e local·e',systems:['Atelier','collaboration'],intro:'Un atelier de gameplay dont la spécialité se précise à mesure que Marion connaît la commune.'}
    ]
  };
  function geo(){return window.HCFranceGeo?.state||null}
  function day(){try{return Number(window.HauteCoutureCore?.load?.()?.world?.day)||1}catch(e){return 1}}
  function current(){const s=geo();if(!s||s.department?.code!=='01'||!s.commune)return null;return {name:s.commune.nom,code:s.commune.code||s.commune.nom}}
  function mapEl(){return $('#hcBourgInteractiveMap')||$('#hcAinCommuneMap')}
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
  function save(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}window.dispatchEvent(new CustomEvent('hc-ain-local-memory-changed'));return v}
  function basin(c){return window.HCAinCommunePersonality?.basinFor?.(c.name)||window.HCAinCommunePersonality?.profile?.(c.name,c.code)?.basin||{id:'generic',label:'Ain · territoire local'}}
  function personName(seed){return first[seed%first.length]+' '+last[Math.floor(seed/13)%last.length]}
  function build(c){const b=basin(c),pool=templates[b.id]||templates.generic;return pool.map((t,i)=>{const h=hash(c.code+'|local-life|'+i);return {...t,id:'ain-local:'+c.code+':'+i,personId:'ain-person:'+c.code+':'+i,person:personName(h),basin:b.id,territory:b.label,commune:c.name,x:20+(h%61),y:24+(Math.floor(h/97)%54),fictional:true}})}
  function rec(c){const all=load();return all[c.code]||{name:c.name,visits:0}}
  function remember(item,action){const c=current();if(!c)return null;const all=load(),r=all[c.code]||{name:c.name,visits:0,firstDay:day(),lastDay:day()};r.localLife=r.localLife||{};const old=r.localLife[item.id]||{id:item.id,personId:item.personId,place:item.place,kind:item.kind,person:item.person,role:item.role,basin:item.basin,territory:item.territory,commune:c.name,fictional:true,known:false,met:false,professionalOpen:false,firstDay:day(),lastDay:day(),history:[]};old.known=true;old.lastDay=day();if(action==='hello')old.met=true;if(action==='work'){old.met=true;old.professionalOpen=true}old.history=Array.isArray(old.history)?old.history:[];old.history.push({day:day(),action});old.history=old.history.slice(-30);r.localLife[item.id]=old;r.name=c.name;all[c.code]=r;save(all);window.dispatchEvent(new CustomEvent('hc-ain-local-contact',{detail:{...old,action,systems:item.systems}}));return old}
  function status(item,c){return rec(c).localLife?.[item.id]||null}
  function sheet(map){return $('#hcAcmSheet',map)||$('#hcBourgSheet',map)||$('.hc-bourg-sheet',map)}
  function toast(text){const map=mapEl(),t=map&&($('#hcAcmToast',map)||$('#hcBourgToast',map));if(!t)return;t.textContent=text;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),1700)}
  function open(item){const c=current(),map=mapEl(),sh=map&&sheet(map);if(!c||!sh)return;const s=status(item,c),known=!!s?.known,met=!!s?.met;sh.innerHTML='<button class="close">×</button><small>'+esc(item.kind)+' · '+esc(item.territory)+'</small><h3>'+esc(item.place)+'</h3><p>'+esc(item.intro)+'</p><p class="hc-ain-local-person"><b>'+esc(item.person)+'</b> · '+esc(item.role)+(met?' · déjà rencontré·e':'')+'</p><p class="hc-ain-local-systems">Peut nourrir : '+esc(item.systems.join(' · '))+'. Aucun contrat ou relation n’est créé automatiquement.</p><div class="hc-ain-local-actions"><button data-a="note">'+(known?'Adresse déjà connue':'Noter cette adresse')+'</button><button data-a="hello">'+(met?'Reprendre contact':'Se présenter')+'</button><button data-a="work">Parler de son travail</button></div>';sh.classList.add('open');$('.close',sh).onclick=()=>sh.classList.remove('open');$$('[data-a]',sh).forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='note'&&known){toast('Cette adresse est déjà dans ta carte.');return}const r=remember(item,a);if(a==='note')toast('Adresse ajoutée à ta carte personnelle ✎');if(a==='hello')toast(r?.met?'Rencontre gardée en mémoire.':'');if(a==='work')toast('Le lien professionnel est ouvert, sans mission automatique.');open(item)})}
  function css(){if($('#hcAinLocalLifeStyles'))return;const st=document.createElement('style');st.id='hcAinLocalLifeStyles';st.textContent=`.hc-ain-local-life{position:absolute;z-index:14;width:62px;height:62px;transform:translate(-50%,-50%);border:0;background:transparent;cursor:pointer}.hc-ain-local-life .draw{position:absolute;left:50%;top:50%;width:34px;height:34px;transform:translate(-50%,-50%) rotate(-2deg);display:grid;place-items:center;background:#f9efe0;border:1px solid rgba(126,101,77,.28);border-radius:48% 52% 45% 55%;font:17px Georgia,serif}.hc-ain-local-life .name{position:absolute;left:50%;top:89%;transform:translateX(-50%);white-space:nowrap;background:rgba(255,250,239,.96);padding:2px 5px;border-bottom:1px solid rgba(111,143,107,.35);font:9px Georgia,serif;opacity:0}.hc-ain-local-life:hover .name,.hc-ain-local-life:focus .name,.hc-ain-local-life.known .name{opacity:1}.hc-ain-local-life.met .draw{background:#e8efe2}.hc-ain-local-person{border-top:1px solid #e7ddcf;padding-top:8px}.hc-ain-local-systems{font-size:10px!important;color:#746b61!important}.hc-ain-local-actions{display:flex;gap:6px;flex-wrap:wrap}.hc-ain-local-actions button{border:1px solid rgba(105,128,91,.3);background:#edf2e7;padding:7px 9px;font:11px Georgia,serif;cursor:pointer}@media(max-width:850px){.hc-ain-local-life{width:74px;height:74px}.hc-ain-local-life .name{display:none}}`;document.head.appendChild(st)}
  function render(){const c=current(),map=mapEl();if(!c||!map||!document.querySelector('#location.active'))return false;css();$$('.hc-ain-local-life',map).forEach(x=>x.remove());const r=rec(c),visits=Math.max(1,Number(r.visits)||1),items=build(c),visible=items.slice(0,visits>=3?3:visits>=2?2:1);visible.forEach(item=>{const s=status(item,c),b=document.createElement('button');b.className='hc-ain-local-life'+(s?.known?' known':'')+(s?.met?' met':'');b.style.left=item.x+'%';b.style.top=item.y+'%';b.setAttribute('aria-label',item.place+' · '+item.person);b.innerHTML='<span class="draw">'+esc(item.glyph)+'</span><span class="name">'+esc(item.place)+'</span>';b.onclick=e=>{e.preventDefault();open(item)};map.appendChild(b)});return true}
  function boot(){let sig='';const tick=()=>{const c=current(),map=mapEl();if(!c||!map)return;const r=rec(c),s=c.code+'|'+(r.visits||0)+'|'+Object.keys(r.localLife||{}).length+'|'+map.id;if(s!==sig){sig=s;render()}};setInterval(tick,850);window.addEventListener('hc-ain-local-memory-changed',()=>{sig='';setTimeout(tick,50)});document.addEventListener('click',e=>{if(e.target.closest('#choiceList,.crumbs,.region-pin')){sig='';setTimeout(tick,120)}})}
  window.HCAinLocalLife={build,current,status,remember,render};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();