(function(){

  if(window.__HCMayaOfficialVisualV4)return;
  window.__HCMayaOfficialVisualV4=true;

  const $=(s,r=document)=>r.querySelector(s);

  const MAYA='./maya-official.webp?v=maya-20260821-final';

  function css(){

    if($('#hcMayaOfficialVisualV4Styles'))return;

    const s=document.createElement('style');

    s.id='hcMayaOfficialVisualV4Styles';

    s.textContent=`

      /* =========================
         CARTE MAYA
         COPIE DU FORMAT INÈS
         ========================= */

      html body #characters .hc-person[data-id='maya']{
        overflow:visible!important;
      }

      html body #characters .hc-person[data-id='maya'] .fig{
        position:absolute!important;

        left:5%!important;
        right:5%!important;

        top:4%!important;
        bottom:19%!important;

        width:auto!important;
        height:auto!important;

        border-radius:20px!important;

        overflow:hidden!important;

        background:
          radial-gradient(
            circle at 50% 34%,
            #fffdfa 0 36%,
            #f9efe4 72%,
            #f2e4d6 100%
          )!important;

        box-shadow:
          inset 0 0 0 1px rgba(115,86,64,.045)!important;

        transform:none!important;
      }


      /* On enlève les anciens éléments décoratifs */

      html body #characters .hc-person[data-id='maya'] .fig:before,
      html body #characters .hc-person[data-id='maya'] .fig:after{
        display:none!important;
        content:none!important;
      }


      /* =========================
         IMAGE MAYA
         ========================= */

      html body #characters .hc-person[data-id='maya']
      .fig img.hc-maya-master{

        position:absolute!important;

        inset:0!important;

        width:100%!important;
        height:100%!important;

        max-width:none!important;
        max-height:none!important;

        object-fit:contain!important;

        /*
          On garde les pieds en bas,
          comme Clara et Inès
        */

        object-position:50% 100%!important;


        /*
          Maya était trop petite.
          On l'agrandit légèrement
          tout en la gardant dans le cadre.
        */

        transform:
          translateY(5px)
          scale(1.055)!important;

        transform-origin:50% 100%!important;


        mix-blend-mode:normal!important;

        filter:
          drop-shadow(
            0 9px 10px rgba(71,50,35,.10)
          )!important;

        background:transparent!important;

        border:0!important;
        border-radius:0!important;
      }


      /* Pas de zoom supplémentaire au survol */

      html body #characters
      .hc-person[data-id='maya']:hover
      .fig img.hc-maya-master,

      html body #characters
      .hc-person[data-id='maya'].focused
      .fig img.hc-maya-master{

        transform:
          translateY(5px)
          scale(1.055)!important;
      }


      /* =========================
         FOND DU NOM
         IDENTIQUE À INÈS
         ========================= */

      html body #characters .hc-person[data-id='maya'] .tag{

        background:
          linear-gradient(
            180deg,
            #f6eadb,
            #f1dfca
          )!important;

        border-radius:17px!important;
      }


      /* Nom */

      html body #characters
      .hc-person[data-id='maya']
      .tag strong{

        color:#624538!important;
      }


      /* Sous-titre */

      html body #characters
      .hc-person[data-id='maya']
      .tag span{

        color:#9b725f!important;
      }


      /* Maya devient un personnage officiel */

      html body #characters
      .hc-person[data-id='maya']
      .tag:before{

        content:'SÉLECTION OFFICIELLE'!important;

        position:absolute!important;

        left:50%!important;
        top:-18px!important;

        transform:translateX(-50%)!important;

        padding:3px 7px!important;

        border-radius:999px!important;

        background:rgba(255,252,247,.90)!important;

        border:
          1px solid rgba(104,82,62,.06)!important;

        font:
          600 5px/1 Arial,sans-serif!important;

        letter-spacing:.16em!important;

        color:#a87661!important;

        white-space:nowrap!important;
      }


      html body #characters
      .hc-person[data-id='maya']
      .tag:after{

        display:none!important;
        content:none!important;
      }


      /* Numéro */

      html body #characters
      .hc-person[data-id='maya']:after{

        content:'03'!important;

        color:#c8a97f!important;

        opacity:1!important;
      }


      /*
        Les règles globales mettent tous les personnages
        sauf Clara en mode "portrait en création".
        On annule ça pour Maya.
      */

      html body #characters
      .hc-person[data-id='maya']
      .fig{

        opacity:1!important;
        filter:none!important;
      }


      html body #characters
      .hc-person[data-id='maya']:hover
      .fig,

      html body #characters
      .hc-person[data-id='maya'].focused
      .fig{

        opacity:1!important;
        filter:none!important;
      }

    `;

    document.head.appendChild(s);
  }


  function mount(){

    css();

    const card=$(
      '#characters .hc-person[data-id="maya"]'
    );

    if(!card)return false;


    const fig=$('.fig',card);

    if(!fig)return false;


    /*
      On supprime complètement
      l'ancien visuel de Maya
    */

    fig
      .querySelectorAll(
        'img,svg,.placeholder'
      )
      .forEach(n=>n.remove());


    /*
      On recrée Maya proprement
      comme Inès
    */

    const img=document.createElement('img');

    img.className='hc-maya-master';

    img.alt='Maya';

    img.loading='eager';

    img.decoding='async';

    img.src=MAYA;


    fig.prepend(img);


    /*
      Infos de carte
    */

    const strong=$('.tag strong',card);

    if(strong){
      strong.textContent='Maya';
    }


    const span=$('.tag span',card);

    if(span){
      span.textContent=
        'DIRECTION CRÉATIVE · SILHOUETTE';
    }


    card.dataset.hcOfficial='1';


    return true;
  }


  function boot(){

    let attempts=0;

    (function wait(){

      if(mount())return;

      attempts++;

      if(attempts<160){
        setTimeout(wait,50);
      }

    })();
  }


  if(document.readyState==='loading'){

    document.addEventListener(
      'DOMContentLoaded',
      boot,
      {once:true}
    );

  }else{

    boot();

  }

})();
