/* Haute Couture Live — Gare de Nîmes v2.
   Pas de destination fantôme : une ville n'est voyageable que si son module de ville est réellement produit.
*/
(function(){
'use strict';
function boot(n=0){const ui=window.HCNimesPlaceUI;if(!ui?.routes?.['nimes-gare']){if(n<120)setTimeout(()=>boot(n+1),100);return}if(window.__HC_NIMES_STATION_V2__)return;window.__HC_NIMES_STATION_V2__=true;const base=ui.routes['nimes-gare'];ui.routes['nimes-gare']=function(place){base(place);const body=document.querySelector('#npBody');if(!body)return true;const routes=[
 {city:'Montpellier',price:14,time:35,status:'future'},
 {city:'Avignon',price:18,time:40,status:'future'},
 {city:'Arles',price:12,time:25,status:'future'},
 {city:'Uzès',price:7,time:45,status:'future'},
 {city:'Marseille',price:24,time:70,status:'future'},
 {city:'Lyon',price:42,time:95,status:'future'},
 {city:'Paris',price:58,time:180,status:'future'}
];body.innerHTML=`<p class="np-intro"><b>La Gare est le point de départ vers les autres villes.</b> Le coût et le temps seront toujours visibles avant de voyager. Pour éviter les faux voyages, une destination ne devient cliquable que lorsque sa ville possède réellement sa carte, ses lieux et son gameplay.</p><div class="np-note">NÎMES · VILLE PILOTE ACTIVE<br>Les prochains départs seront activés au fur et à mesure que les villes seront produites. Ton état de Nîmes restera mémorisé quand tu partiras.</div><div class="np-grid" style="margin-top:14px">${routes.map(r=>`<article class="np-card"><div class="np-kicker">DESTINATION À VENIR</div><h3>${r.city}</h3><div class="np-meta"><b>COÛT INDICATIF</b>${r.price} €<br><b>TRAJET INDICATIF</b>${r.time} min<br><b>STATUT</b>Ville non encore produite</div><div class="np-actions"><button class="np-btn alt" disabled>NON DISPONIBLE</button></div></article>`).join('')}</div>`;return true};}
boot();
})();