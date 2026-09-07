/* Haute Couture Live — transitions immersives globales v1 */
(function(){
'use strict';
if(window.HCImmersiveTransitionsV1)return;
const labels=[
 [/\/ville\/?(?:$|\?)/i,'Tu sors en ville.','La lumière, le bruit et les habitudes du quartier reprennent autour de toi.'],
 [/\/atelier(?:-raster)?\/?/i,'Tu rejoins l’Atelier.','Le reste de la journée se resserre autour des matières, des gestes et de ce qu’il reste à décider.'],
 [/\/telephone\/?/i,'Tu prends ton téléphone.','Messages, silences et réponses en attente reviennent au premier plan.'],
 [/\/book\/?/i,'Tu ouvres ton Book.','Des projets, lieux et rencontres vécus reviennent par fragments.'],
 [/\/agenda\/?/i,'Tu regardes ton agenda.','Les rendez-vous à venir replacent la journée dans son rythme.'],
 [/\/chez-moi\/?/i,'Tu rentres chez toi.','Le bruit retombe. Ce qui s’est passé aujourd’hui reste avec toi.'],
 [/\/school/i,'Tu rejoins l’école.','Couloirs, ateliers, voix et travail en cours reprennent leur place.']
];
function textFor(url){const u=String(url||'');for(const [rx,title,text] of labels)if(rx.test(u))return{title,text};return{title:'Tu continues ta journée.','text':'Un autre moment commence.'}}
function style(){if(document.getElementById('hcTransitionStyle'))return;const s=document.createElement('style');s.id='hcTransitionStyle';s.textContent=`#hc-transition{position:fixed;inset:0;z-index:2147482500;background:linear-gradient(120deg,rgba(25,17,14,.94),rgba(67,47,39,.92));display:grid;place-items:center;color:#fff;opacity:0;pointer-events:none;transition:opacity .22s ease}#hc-transition.hc-show{opacity:1;pointer-events:auto}.hct-copy{width:min(760px,84vw);padding:32px;text-align:left}.hct-k{font:900 9px/1 Arial,sans-serif;letter-spacing:.18em;color:#e8c8c2;text-transform:uppercase}.hct-copy h2{font:clamp(38px,5vw,72px)/.95 Georgia,serif;font-weight:400;margin:10px 0 12px}.hct-copy p{font:16px/1.55 Georgia,serif;color:rgba(255,255,255,.82);max-width:620px;margin:0}.hct-line{margin-top:24px;width:86px;height:1px;background:rgba(255,255,255,.45)}@media (prefers-reduced-motion:reduce){#hc-transition{transition:none}}`;document.head.appendChild(s)}
function host(){style();let h=document.getElementById('hc-transition');if(!h){h=document.createElement('div');h.id='hc-transition';h.innerHTML='<div class="hct-copy"><div class="hct-k">HAUTE COUTURE LIVE</div><h2></h2><p></p><div class="hct-line"></div></div>';document.body.appendChild(h)}return h}
function go(url){if(!url)return;const h=host(),copy=textFor(url);h.querySelector('h2').textContent=copy.title;h.querySelector('p').textContent=copy.text;h.classList.add('hc-show');setTimeout(()=>{location.href=url},420)}
function intercept(e){const a=e.target.closest('a[href]');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank'||a.hasAttribute('download'))return;const href=a.getAttribute('href');if(!href||href.startsWith('#')||href.startsWith('javascript:')||/^https?:/i.test(href)&&!href.includes(location.host))return;e.preventDefault();go(a.href)}
document.addEventListener('click',intercept,true);
window.addEventListener('hc-transition-go',e=>{if(e.detail?.url)go(e.detail.url)});
window.HCImmersiveTransitionsV1={version:1,go,textFor};
})();