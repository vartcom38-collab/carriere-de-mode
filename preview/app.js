const HOME_URL='./assets/home.jpg';

class HomeScene extends Phaser.Scene{
  constructor(){super('home')}
  preload(){ this.load.image('home',HOME_URL); }
  create(){
    this.bg=this.add.image(0,0,'home').setOrigin(0.5);
    this.hotspots=[];
    this.makeHotspot(.132,.775,.247,.165,'Continuer');
    this.makeHotspot(.381,.765,.254,.178,'Nouvelle Partie',()=>this.showNote('Accueil validé → prochaine étape : le carnet'));
    this.makeHotspot(.657,.775,.226,.165,'Options');
    this.makeHotspot(.93,.025,.065,.09,'Paramètres');
    this.scale.on('resize',()=>this.layout());
    this.layout();
  }
  makeHotspot(x,y,w,h,label,onClick){
    const r=this.add.rectangle(0,0,10,10,0xffffff,0.001).setOrigin(0,0).setInteractive({useHandCursor:true});
    r.meta={x,y,w,h,label};
    r.on('pointerdown',()=>{ if(onClick) onClick(); });
    this.hotspots.push(r);
  }
  layout(){
    const w=this.scale.width,h=this.scale.height;
    const tex=this.textures.get('home').getSourceImage();
    const iw=tex.width||320, ih=tex.height||240;
    const s=Math.max(w/iw,h/ih);
    this.bg.setPosition(w/2,h/2).setScale(s);
    const dw=iw*s, dh=ih*s, ox=(w-dw)/2, oy=(h-dh)/2;
    for(const r of this.hotspots){
      const m=r.meta;
      r.setPosition(ox+m.x*dw,oy+m.y*dh);
      r.setSize(m.w*dw,m.h*dh);
      r.input.hitArea.setTo(0,0,m.w*dw,m.h*dh);
    }
  }
  showNote(text){
    if(this.note){this.note.destroy()}
    const w=this.scale.width,h=this.scale.height;
    const bg=this.add.rectangle(w/2,h*.1,Math.min(520,w*.86),52,0xf6f4ee,.94).setStrokeStyle(1,0xa8b89a,.8).setDepth(20);
    const t=this.add.text(w/2,h*.1,text,{fontFamily:'Arial',fontSize:'16px',color:'#3a3f3d'}).setOrigin(.5).setDepth(21);
    this.note=this.add.container(0,0,[bg,t]);
    this.time.delayedCall(1800,()=>{if(this.note){this.note.destroy();this.note=null}});
  }
}

new Phaser.Game({
  type:Phaser.AUTO,
  parent:'game',
  backgroundColor:'#f6f4ee',
  scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH,width:window.innerWidth,height:window.innerHeight},
  render:{antialias:true,pixelArt:false},
  scene:[HomeScene]
});
