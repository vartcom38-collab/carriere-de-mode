/* Haute Couture Live — School premium visuals v1 */
(function(){
'use strict';
if(window.HCSchoolPremiumVisuals)return;

const path=location.pathname.toLowerCase();
const screen=(path.match(/\/(school(?:-[^/]+)?)(?:\/|$)/)||[])[1]||'school';
document.documentElement.classList.add('hc-school-premium');
document.body.classList.add('hc-school-premium-body','hc-'+screen);

const PHOTO={
  atelier:'https://images.unsplash.com/photo-1753164597544-a2736833357e?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=72&w=2400',
  study:'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&fm=jpg&q=82&w=2200',
  textile:'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&fm=jpg&q=82&w=2200',
  drawing:'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&fm=jpg&q=82&w=2200',
  city:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&fm=jpg&q=82&w=2200'
};

const css=document.createElement('style');
css.id='hc-school-premium-css';
css.textContent=`
:root{--hcsp-ink:#1f1814;--hcsp-muted:#75665c;--hcsp-paper:#fffaf5;--hcsp-rose:#bd7770;--hcsp-line:rgba(78,55,43,.14);--hcsp-shadow:0 26px 75px rgba(57,39,30,.14)}
html.hc-school-premium{background:#f3ebe4}
body.hc-school-premium-body{position:relative;isolation:isolate;background:linear-gradient(180deg,#fbf7f2 0%,#f1e5db 100%)!important;color:var(--hcsp-ink)!important;font-family:Georgia,'Times New Roman',serif!important;min-height:100vh}
body.hc-school-premium-body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;background:linear-gradient(90deg,rgba(255,251,247,.97),rgba(247,236,227,.88)),url('${PHOTO.atelier}') center/cover no-repeat;opacity:.9}
body.hc-school-premium-body main,body.hc-school-premium-body .wrap{position:relative;z-index:1}
body.hc-school-premium-body h1,body.hc-school-premium-body h2,body.hc-school-premium-body h3{font-family:Georgia,'Times New Roman',serif!important;font-weight:400!important;letter-spacing:-.025em!important;color:var(--hcsp-ink)!important}
body.hc-school-premium-body h1{font-size:clamp(42px,4vw,68px)!important;line-height:.98!important}
body.hc-school-premium-body p,body.hc-school-premium-body .sub,body.hc-school-premium-body .lead{font-family:Georgia,'Times New Roman',serif!important;color:var(--hcsp-muted)!important}
body.hc-school-premium-body .eyebrow{font:800 10px/1.2 Arial,sans-serif!important;letter-spacing:.18em!important;text-transform:uppercase!important;color:var(--hcsp-rose)!important}
body.hc-school-premium-body .card,body.hc-school-premium-body .panel,body.hc-school-premium-body .module{background:rgba(255,250,245,.93)!important;border:1px solid rgba(255,255,255,.72)!important;box-shadow:var(--hcsp-shadow)!important;backdrop-filter:blur(16px);border-radius:24px!important}
body.hc-school-premium-body button,body.hc-school-premium-body .btn{font-family:Arial,sans-serif!important;letter-spacing:.04em}
body.hc-school-premium-body button:hover,body.hc-school-premium-body .btn:hover{transform:translateY(-2px)}

body.hc-school-enrollment::before{background:linear-gradient(90deg,rgba(28,20,17,.46) 0 45%,rgba(251,246,241,.97) 64%),url('${PHOTO.atelier}') 18% center/cover no-repeat;opacity:1}
body.hc-school-enrollment .wrap{max-width:1440px!important;min-height:100vh;padding:70px 5vw 70px 53%!important}
body.hc-school-enrollment .wrap::before{content:'TON PARCOURS COMMENCE ICI';position:fixed;left:6vw;bottom:9vh;color:white;font:500 14px/1.4 Arial,sans-serif;letter-spacing:.22em;max-width:320px}
body.hc-school-enrollment .wrap::after{content:'Apprendre. Essayer. Recommencer. Trouver ta manière de créer.';position:fixed;left:6vw;bottom:13vh;color:white;font:italic 29px/1.2 Georgia,serif;max-width:500px;text-shadow:0 2px 12px rgba(0,0,0,.3)}
body.hc-school-enrollment .steps{gap:7px!important;margin:26px 0 18px!important}
body.hc-school-enrollment .step{background:rgba(239,228,220,.78)!important;border:1px solid var(--hcsp-line);color:#736259!important}
body.hc-school-enrollment .step.active{background:var(--hcsp-ink)!important;color:white!important}
body.hc-school-enrollment .card{padding:30px!important}
body.hc-school-enrollment textarea,body.hc-school-enrollment input{background:rgba(255,255,255,.72)!important}
body.hc-school-enrollment .btn{background:var(--hcsp-ink)!important;border-radius:999px!important;padding:14px 24px!important}

body.hc-school-home::before{background:linear-gradient(180deg,rgba(251,247,242,.84),rgba(240,226,215,.92)),url('${PHOTO.study}') center/cover no-repeat;opacity:1}
body.hc-school-home .wrap{max-width:1440px!important;padding:64px 4vw 80px!important}
body.hc-school-home .room{min-height:560px!important;background:linear-gradient(180deg,rgba(24,17,14,.04),rgba(24,17,14,.42)),url('${PHOTO.atelier}') center/cover no-repeat!important;border:0!important;border-radius:28px!important;box-shadow:0 34px 90px rgba(46,30,23,.23)!important}
body.hc-school-home .room>*{display:none!important}
body.hc-school-home .room::before{content:'Ton espace. Tes recherches. Tes premières idées.';position:absolute;left:38px;bottom:42px;color:white;font:italic clamp(25px,2.5vw,40px)/1.1 Georgia,serif;max-width:560px;text-shadow:0 2px 16px rgba(0,0,0,.45)}
body.hc-school-home .actions{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:12px!important}
body.hc-school-home .actions .btn{background:rgba(255,250,245,.9)!important;border:1px solid rgba(255,255,255,.8)!important;box-shadow:0 15px 42px rgba(56,39,30,.09)!important;padding:18px!important;min-height:100px;transition:.22s ease}
body.hc-school-home .actions .btn:hover{box-shadow:0 22px 50px rgba(56,39,30,.16)!important}

body.hc-school-campus::before{background:linear-gradient(90deg,rgba(247,238,230,.88),rgba(252,248,244,.92)),url('${PHOTO.atelier}') center/cover no-repeat;opacity:1}
body.hc-school-campus .wrap,body.hc-school-campus main{max-width:1500px!important;margin:auto!important;padding-left:4vw!important;padding-right:4vw!important}
body.hc-school-campus [class*='room'],body.hc-school-campus [class*='zone']{border-radius:20px!important;transition:.24s ease}
body.hc-school-campus [class*='room']:hover,body.hc-school-campus [class*='zone']:hover{transform:translateY(-3px);box-shadow:0 22px 60px rgba(50,32,24,.13)!important}

body.hc-school-day::before,body.hc-school-planning::before{background:linear-gradient(90deg,rgba(255,251,247,.94),rgba(242,230,220,.85)),url('${PHOTO.study}') center/cover no-repeat;opacity:1}
body.hc-school-day .wrap,body.hc-school-planning .wrap{max-width:1380px!important;padding:64px 4vw 80px!important}

body.hc-school-course::before,body[class*='hc-school-drawing']::before{background:linear-gradient(90deg,rgba(249,241,233,.94),rgba(255,251,247,.88)),url('${PHOTO.drawing}') center/cover no-repeat;opacity:1}
body.hc-school-textile-lab::before{background:linear-gradient(90deg,rgba(249,241,233,.94),rgba(255,251,247,.9)),url('${PHOTO.textile}') center/cover no-repeat;opacity:1}
body.hc-school-course .wrap,body.hc-school-course main,body[class*='hc-school-drawing'] .wrap,body.hc-school-textile-lab .wrap{max-width:1480px!important;margin:auto!important}

body[class*='hc-school-year']::before,body[class*='hc-school-project']::before,body[class*='hc-school-midyear']::before,body[class*='hc-school-term']::before{background:linear-gradient(90deg,rgba(252,247,242,.94),rgba(240,227,217,.9)),url('${PHOTO.atelier}') center/cover no-repeat;opacity:1}

@media(max-width:950px){
 body.hc-school-enrollment::before{background:linear-gradient(180deg,rgba(27,20,17,.28),rgba(250,244,239,.97)),url('${PHOTO.atelier}') center top/cover no-repeat}
 body.hc-school-enrollment .wrap{padding:300px 22px 60px!important}
 body.hc-school-enrollment .wrap::before,body.hc-school-enrollment .wrap::after{display:none}
 body.hc-school-home .actions{grid-template-columns:repeat(2,minmax(0,1fr))!important}
}
@media(max-width:620px){body.hc-school-home .actions{grid-template-columns:1fr!important}body.hc-school-premium-body h1{font-size:40px!important}}
`;
document.head.appendChild(css);

const core=['school','school-campus','school-day','school-course','school-home'];
if(core.includes(screen)){
  const host=document.querySelector('main,.wrap');
  if(host&&!host.querySelector('.hcsp-brand')){
    const brand=document.createElement('div');
    brand.className='hcsp-brand';
    brand.textContent='Haute Couture Live · École';
    Object.assign(brand.style,{font:'800 9px/1 Arial,sans-serif',letterSpacing:'.18em',textTransform:'uppercase',color:'#a96e68',marginBottom:'14px'});
    host.prepend(brand);
  }
}

/* During the guided first day, a dedicated focus layer prevents global school
   systems from visually piling up on the arrival/home/day screens. */
let arrival=null;try{arrival=JSON.parse(localStorage.getItem('haute-couture-school-day1-flow-v1')||'null')}catch(_){}
if(arrival&&arrival.phase!=='done'&&/\/school-(home|day|welcome|tour)\/?$/.test(path)&&!window.HCSchoolArrivalFocusV1&&!document.querySelector('script[data-hc-arrival-focus]')){
  const marker='/hc-live/';const i=location.pathname.indexOf(marker);const base=i>=0?location.pathname.slice(0,i)+marker:'../';
  const s=document.createElement('script');s.src=base+'school/school-arrival-focus-v1.js?v=20260906-focus2';s.defer=true;s.setAttribute('data-hc-arrival-focus','1');document.head.appendChild(s);
}

window.HCSchoolPremiumVisuals={screen,PHOTO};
})();