/* Haute Couture Live — Book personnel V1 */
(function(){
'use strict';
const KEY='haute-couture-book-v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{version:1,items:[],collections:{Lieux:[],Mode:[],Matieres:[],Motifs:[],Palettes:[],Adresses:[],Silhouettes:[],Photos:[],Posts:[],Secrets:[]}}}catch(e){return{version:1,items:[],collections:{}}}};
const save=s=>{localStorage.setItem(KEY,JSON.stringify(s));window.dispatchEvent(new CustomEvent('hc-book-state',{detail:s}));return s};
const slug=s=>String(s||'item').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function add(item){const s=read(),id=item.id||slug((item.type||'inspi')+'-'+(item.title||'')+'-'+(item.sourceId||''));const old=s.items.find(x=>x.id===id);if(old)return old;const x={id,title:item.title||'Inspiration',type:item.type||'Inspiration',category:item.category||'Mode',image:item.image||'',images:item.images||[],note:item.note||'',source:item.source||'',sourceId:item.sourceId||'',place:item.place||'',palette:item.palette||[],materials:item.materials||[],motifs:item.motifs||[],atelierUnlocks:item.atelierUnlocks||[],socialUnlocks:item.socialUnlocks||[],tags:item.tags||[],savedAt:new Date().toISOString(),favorite:false};s.items.unshift(x);s.collections=s.collections||{};(s.collections[x.category]||(s.collections[x.category]=[])).unshift(id);save(s);return x}
function remove(id){const s=read();s.items=s.items.filter(x=>x.id!==id);Object.keys(s.collections||{}).forEach(k=>s.collections[k]=(s.collections[k]||[]).filter(x=>x!==id));save(s)}
function toggleFavorite(id){const s=read(),x=s.items.find(i=>i.id===id);if(x)x.favorite=!x.favorite;save(s)}
function updateNote(id,note){const s=read(),x=s.items.find(i=>i.id===id);if(x)x.note=String(note||'');save(s)}
function has(id){return read().items.some(x=>x.id===id)}
window.HCBook={storageKey:KEY,get:read,add,remove,toggleFavorite,updateNote,has};
})();