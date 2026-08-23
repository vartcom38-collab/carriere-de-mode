/*
 * Haute Couture Live — Paper Doll wardrobe core
 * Architecture inspired by the Apache-2.0 Paper Doll Studio project:
 * https://github.com/Khurramali1997/paper-doll-studio
 *
 * We use the same core idea: a fixed canvas, aligned transparent layers,
 * wardrobe slots, z-order, material state, undo/redo and serialization.
 */
(function(){
  if(window.HCPaperDoll)return;
  const BASE='https://raw.githubusercontent.com/Khurramali1997/paper-doll-studio/main/public/assets/';
  const CANVAS={width:768,height:768};
  const BASE_LAYERS=[
    {id:'hair_back',src:BASE+'hair_back.png',z:10},
    {id:'body_neck',src:BASE+'body_neck.png',z:20},
    {id:'body_ears_l',src:BASE+'body_ears_l.png',z:30},
    {id:'body_ears_r',src:BASE+'body_ears_r.png',z:40},
    {id:'body_face',src:BASE+'body_face.png',z:50},
    {id:'eyes_white_l',src:BASE+'eyes_white_l.png',z:60},
    {id:'eyes_white_r',src:BASE+'eyes_white_r.png',z:70},
    {id:'eyes_irides_l',src:BASE+'eyes_irides_l.png',z:80},
    {id:'eyes_irides_r',src:BASE+'eyes_irides_r.png',z:90},
    {id:'eyes_eyelash_l',src:BASE+'eyes_eyelash_l.png',z:100},
    {id:'eyes_eyelash_r',src:BASE+'eyes_eyelash_r.png',z:110},
    {id:'eyes_eyebrow_l',src:BASE+'eyes_eyebrow_l.png',z:120},
    {id:'eyes_eyebrow_r',src:BASE+'eyes_eyebrow_r.png',z:130},
    {id:'body_nose',src:BASE+'body_nose.png',z:140},
    {id:'body_mouth',src:BASE+'body_mouth.png',z:150},
    {id:'hair_front',src:BASE+'hair_front.png',z:160},
    {id:'skin_top',src:BASE+'skin_wear_top.png',z:170},
    {id:'skin_bottom',src:BASE+'skin_wear_bottom.png',z:180},
    {id:'skin_legs',src:BASE+'skin_wear_legs.png',z:190},
    {id:'skin_hands',src:BASE+'skin_wear_hands.png',z:195}
  ];
  const WARDROBE={
    topwear:{name:'Hauts',z:210,options:[
      {id:'none',name:'Aucun haut',src:null},
      {id:'studio-top',name:'Top atelier',src:BASE+'clothing_topwear.png'}
    ]},
    bottomwear:{name:'Bas',z:220,options:[
      {id:'none',name:'Aucun bas',src:null},
      {id:'studio-bottom',name:'Bas atelier',src:BASE+'clothing_bottomwear.png'}
    ]},
    legwear:{name:'Jambes',z:230,options:[
      {id:'none',name:'Sans legwear',src:null},
      {id:'studio-legwear',name:'Legwear atelier',src:BASE+'clothing_legwear.png'}
    ]},
    handwear:{name:'Mains',z:240,options:[
      {id:'none',name:'Sans gants',src:null},
      {id:'studio-gloves',name:'Gants atelier',src:[BASE+'clothing_handwear_l.png',BASE+'clothing_handwear_r.png']}
    ]}
  };
  const state={wardrobe:{topwear:'none',bottomwear:'none',legwear:'none',handwear:'none'},materials:{},selectedSlot:'topwear'};
  let history=[];
  function snapshot(){return JSON.parse(JSON.stringify({wardrobe:state.wardrobe,materials:state.materials,selectedSlot:state.selectedSlot}));}
  function pushHistory(){history.push(snapshot());if(history.length>40)history.shift();}
  function undo(){if(!history.length)return false;const s=history.pop();state.wardrobe=s.wardrobe;state.materials=s.materials;state.selectedSlot=s.selectedSlot;return true;}
  function choose(slot,optionId){if(!WARDROBE[slot])return false;const exists=WARDROBE[slot].options.some(o=>o.id===optionId);if(!exists)return false;pushHistory();state.wardrobe[slot]=optionId;state.selectedSlot=slot;return true;}
  function applyMaterial(slot,variant){if(!WARDROBE[slot])return false;pushHistory();state.materials[slot]=variant?{id:variant.id,color:variant.color,pattern:variant.pattern,materialId:variant.materialId}:null;state.selectedSlot=slot;return true;}
  function clear(){pushHistory();Object.keys(state.wardrobe).forEach(k=>state.wardrobe[k]='none');state.materials={};}
  function serialize(){return snapshot();}
  function restore(data){if(!data)return;Object.assign(state.wardrobe,data.wardrobe||{});state.materials=data.materials||{};state.selectedSlot=data.selectedSlot||'topwear';}
  function optionFor(slot){const cfg=WARDROBE[slot],id=state.wardrobe[slot];return cfg?.options.find(o=>o.id===id)||null;}
  function hexForVariant(v){return window.HCMaterials?.colors?.[v?.color]||'#d8c4b7';}
  function layers(){
    const out=BASE_LAYERS.map(x=>({...x,type:'base'}));
    Object.entries(WARDROBE).forEach(([slot,cfg])=>{
      const o=optionFor(slot); if(!o||!o.src)return;
      const srcs=Array.isArray(o.src)?o.src:[o.src];
      srcs.forEach((src,i)=>out.push({id:slot+'-'+o.id+'-'+i,src,z:cfg.z+i*.01,type:'garment',slot,material:state.materials[slot]||null}));
    });
    return out.sort((a,b)=>a.z-b.z);
  }
  function render(container){
    if(!container)return;
    container.innerHTML='';
    layers().forEach(l=>{
      const wrap=document.createElement('div');wrap.className='pd-layer '+(l.type==='garment'?'pd-garment':'pd-base');wrap.dataset.layer=l.id;wrap.style.zIndex=String(Math.floor(l.z*10));
      const img=document.createElement('img');img.src=l.src;img.alt='';img.draggable=false;img.crossOrigin='anonymous';wrap.appendChild(img);
      if(l.type==='garment'&&l.material){
        const tint=document.createElement('div');tint.className='pd-tint';tint.style.background=hexForVariant(l.material);tint.style.webkitMaskImage=`url("${l.src}")`;tint.style.maskImage=`url("${l.src}")`;wrap.appendChild(tint);
      }
      if(l.type==='garment')wrap.onclick=(e)=>{e.stopPropagation();state.selectedSlot=l.slot;container.dispatchEvent(new CustomEvent('pd-select',{detail:{slot:l.slot}}));};
      container.appendChild(wrap);
    });
  }
  window.HCPaperDoll={canvas:CANVAS,baseLayers:BASE_LAYERS,wardrobe:WARDROBE,state,choose,applyMaterial,clear,undo,serialize,restore,render,optionFor};
})();