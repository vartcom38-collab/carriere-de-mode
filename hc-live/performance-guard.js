(function(){
  if(window.__HCPerformanceGuardInstalled)return;window.__HCPerformanceGuardInstalled=true;
  const blank='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
  const refs=[['#prologue img.carnet-bg','prologue'],['#characters img.selection-art','characters']];
  function park(){refs.forEach(([sel,name])=>{const img=document.querySelector(sel);if(!img)return;if(!img.dataset.hcSrc&&img.getAttribute('src'))img.dataset.hcSrc=img.getAttribute('src');if(!document.querySelector('#'+name+'.active')&&img.getAttribute('src')!==blank)img.setAttribute('src',blank)})}
  function hydrate(){refs.forEach(([sel,name])=>{const img=document.querySelector(sel);if(!img||!img.dataset.hcSrc)return;if(document.querySelector('#'+name+'.active')&&img.getAttribute('src')!==img.dataset.hcSrc){img.decoding='async';img.setAttribute('src',img.dataset.hcSrc)}})}
  function tick(){park();hydrate()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
  document.addEventListener('click',()=>setTimeout(tick,0),true);
  window.addEventListener('pageshow',tick);
})();