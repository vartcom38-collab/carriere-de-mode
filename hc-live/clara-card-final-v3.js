(function(){
  if(window.__HCClaraCardFinalV3)return;window.__HCClaraCardFinalV3=true;
  const $=(s,r=document)=>r.querySelector(s);
  function css(){
    if($('#hcClaraCardFinalV3Styles'))return;
    const s=document.createElement('style');s.id='hcClaraCardFinalV3Styles';s.textContent=`
      html body #characters .hc-person[data-id='clara']{overflow:visible!important}
      html body #characters .hc-person[data-id='clara'] .fig{position:absolute!important;left:5%!important;right:5%!important;top:4%!important;bottom:19%!important;width:auto!important;height:auto!important;border-radius:20px!important;overflow:hidden!important;background:radial-gradient(circle at 50% 34%,#fffdfa 0 36%,#f9efe4 72%,#f2e4d6 100%)!important;box-shadow:inset 0 0 0 1px rgba(115,86,64,.045)!important;transform:none!important}
      html body #characters .hc-person[data-id='clara'] .fig:before,html body #characters .hc-person[data-id='clara'] .fig:after{display:none!important}
      html body #characters .hc-person[data-id='clara'] .fig img.hc-clara-master{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:contain!important;object-position:50% 100%!important;transform:scale(.96)!important;transform-origin:50% 100%!important;mix-blend-mode:normal!important;filter:drop-shadow(0 9px 10px rgba(71,50,35,.10))!important;background:transparent!important;border:0!important;border-radius:0!important}
      html body #characters .hc-person[data-id='clara']:hover .fig img.hc-clara-master,html body #characters .hc-person[data-id='clara'].focused .fig img.hc-clara-master{transform:scale(.96)!important}
      html body #characters .hc-person[data-id='clara'] .tag{background:linear-gradient(180deg,#f6eadb,#f1dfca)!important;border-radius:17px!important}
      html body #characters .hc-focus-header-v2[data-id='clara'] .portrait img{object-fit:cover!important;object-position:50% 13%!important;transform:scale(1.18)!important;mix-blend-mode:normal!important;background:#f8eee3!important}
      html body #characters:has(.hc-person[data-id='clara'].focused) .hc-focus [data-compare]{display:none!important}
      html body #characters:has(.hc-person[data-id='clara'].focused) .hc-focus .hc-focus-actions{grid-template-columns:1fr!important}
      #characters .hc-clara-start-stable{margin:10px 0 12px;padding:12px 13px;border-radius:15px;background:linear-gradient(135deg,#fffaf3,#f2e6d9);border:1px solid rgba(142,101,76,.09)}
      #characters .hc-clara-start-stable .eyebrow{font:700 7px/1 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#8d7b6f;margin-bottom:7px}
      #characters .hc-clara-start-stable .pace{font:italic 15px/1.2 Georgia,serif;color:#66564e;margin-bottom:9px}
      #characters .hc-clara-start-stable .levels{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
      #characters .hc-clara-start-stable .levels div{padding:7px 6px;border-radius:10px;background:rgba(255,253,248,.85);text-align:center;border:1px solid rgba(121,91,70,.06)}
      #characters .hc-clara-start-stable b{display:block;font:600 6px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#9a8778;margin-bottom:3px}
      #characters .hc-clara-start-stable span{font:12px Georgia,serif;color:#514944}
    `;document.head.appendChild(s)
  }
  function dist(r,g,b,c){const dr=r-c[0],dg=g-c[1],db=b-c[2];return Math.sqrt(dr*dr+dg*dg+db*db)}
  function cutout(img){
    if(!img||img.dataset.hcCutoutV3==='1')return Promise.resolve(false);
    return new Promise(resolve=>{
      const src=new Image();src.onload=()=>{
        try{
          const max=1000,sc=Math.min(1,max/Math.max(src.naturalWidth,src.naturalHeight));
          const w=Math.max(2,Math.round(src.naturalWidth*sc)),h=Math.max(2,Math.round(src.naturalHeight*sc));
          const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(src,0,0,w,h);
          const id=x.getImageData(0,0,w,h),d=id.data;
          const samples=[];const q=Math.max(3,Math.round(Math.min(w,h)*.025));
          for(let yy=0;yy<q;yy++)for(let xx=0;xx<q;xx++)[[xx,yy],[w-1-xx,yy],[xx,h-1-yy],[w-1-xx,h-1-yy]].forEach(([px,py])=>{const i=(py*w+px)*4;samples.push([d[i],d[i+1],d[i+2]])});
          const bg=[0,1,2].map(k=>samples.reduce((a,v)=>a+v[k],0)/samples.length);
          const seen=new Uint8Array(w*h),queue=new Int32Array(w*h);let head=0,tail=0;
          const add=p=>{if(p<0||p>=w*h||seen[p])return;const i=p*4;if(dist(d[i],d[i+1],d[i+2],bg)>46)return;seen[p]=1;queue[tail++]=p};
          for(let xx=0;xx<w;xx++){add(xx);add((h-1)*w+xx)}for(let yy=0;yy<h;yy++){add(yy*w);add(yy*w+w-1)}
          while(head<tail){const p=queue[head++],px=p%w,py=(p/w)|0;if(px>0)add(p-1);if(px<w-1)add(p+1);if(py>0)add(p-w);if(py<h-1)add(p+w)}
          let minx=w,miny=h,maxx=0,maxy=0;
          for(let p=0;p<w*h;p++){const i=p*4;if(seen[p])d[i+3]=0;else if(d[i+3]){const px=p%w,py=(p/w)|0;if(px<minx)minx=px;if(px>maxx)maxx=px;if(py<miny)miny=py;if(py>maxy)maxy=py}}
          x.putImageData(id,0,0);
          const pad=Math.max(6,Math.round(Math.min(w,h)*.015));minx=Math.max(0,minx-pad);miny=Math.max(0,miny-pad);maxx=Math.min(w-1,maxx+pad);maxy=Math.min(h-1,maxy+pad);
          const cw=Math.max(2,maxx-minx+1),ch=Math.max(2,maxy-miny+1),out=document.createElement('canvas');out.width=cw;out.height=ch;out.getContext('2d').drawImage(c,minx,miny,cw,ch,0,0,cw,ch);
          img.src=out.toDataURL('image/webp',.9);img.dataset.hcCutoutV3='1';img.alt='Clara';resolve(true)
        }catch(e){resolve(false)}
      };src.onerror=()=>resolve(false);src.src=img.currentSrc||img.src
    })
  }
  function syncPortrait(){const card=$('#characters .hc-person[data-id="clara"]'),img=$('.hc-clara-master',card);if(!img||!img.src)return;const p=$('#characters .hc-focus-header-v2[data-id="clara"] .portrait img');if(p&&p.src!==img.src)p.src=img.src}
  function enhanceFocus(){
    const clara=$('#characters .hc-person[data-id="clara"].focused'),focus=$('#characters .hc-focus');if(!focus)return;
    if(!clara){$('.hc-clara-start-stable',focus)?.remove();return}
    $('[data-compare]',focus)?.remove();
    const primary=$('[data-profile]',focus);if(primary)primary.textContent='Découvrir Clara';
    const actions=$('.hc-focus-actions',focus);if(actions&&!$('.hc-clara-start-stable',focus)){
      const box=document.createElement('section');box.className='hc-clara-start-stable';box.innerHTML='<div class="eyebrow">Ton début de partie</div><div class="pace">Lent · sensible · précis</div><div class="levels"><div><b>Technique</b><span>À l’aise</span></div><div><b>Créativité</b><span>Forte</span></div><div><b>Réseau</b><span>Débutante</span></div></div>';actions.before(box)
    }
  }
  function mount(){css();$('#characters .selection-art')?.remove();const card=$('#characters .hc-person[data-id="clara"]'),img=$('.hc-clara-master',card);if(!card||!img)return false;card.dataset.hcOfficial='1';cutout(img).then(()=>{syncPortrait();setTimeout(syncPortrait,80)});enhanceFocus();return true}
  function boot(){let n=0;(function wait(){if(mount())return;if(++n<120)setTimeout(wait,50)})();let ticks=0;const t=setInterval(()=>{enhanceFocus();if(++ticks>60)clearInterval(t)},100);document.addEventListener('click',e=>{if(e.target.closest?.('#characters .hc-person,#characters .hc-focus-nav'))setTimeout(()=>{syncPortrait();enhanceFocus()},30)},true)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();