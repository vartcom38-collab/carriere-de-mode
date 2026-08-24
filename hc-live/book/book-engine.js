/* Haute Couture Live — Book personnel V2 : pages riches + recherche par tags */
(function(){
'use strict';
const KEY='haute-couture-book-v1';
const empty=()=>({version:2,items:[],collections:{Lieux:[],Mode:[],Matieres:[],Motifs:[],Palettes:[],Adresses:[],Silhouettes:[],Photos:[],Posts:[],Secrets:[]}});
const read=()=>{try{const s=JSON.parse(localStorage.getItem(KEY)||'null')||empty();s.version=2;s.items=s.items||[];s.collections=s.collections||empty().collections;return s}catch(e){return empty()}};
const save=s=>{localStorage.setItem(KEY,JSON.stringify(s));window.dispatchEvent(new CustomEvent('hc-book-state',{detail:s}));return s};
const slug=s=>String(s||'item').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const uniq=a=>[...new Set((a||[]).filter(Boolean).map(x=>String(x).trim()).filter(Boolean))];
function normalize(item){return{
 id:item.id||slug((item.type||'inspi')+'-'+(item.title||'')+'-'+(item.sourceId||'')),
 title:item.title||'Inspiration',type:item.type||'Inspiration',category:item.category||'Mode',
 image:item.image||item.heroImage||'',images:item.images||item.media?.gallery||[],note:item.note||'',source:item.source||'',sources:item.sources||[],sourceId:item.sourceId||'',place:item.place||'',
 summary:item.summary||'',history:item.history||'',anecdotes:item.anecdotes||[],objects:item.objects||[],artworks:item.artworks||[],architecture:item.architecture||[],chronology:item.chronology||[],visitAsIfThere:item.visitAsIfThere||[],
 palette:item.palette||[],materials:item.materials||[],motifs:item.motifs||[],forms:item.forms||[],jewelry:item.jewelry||[],accessories:item.accessories||[],silhouettes:item.silhouettes||[],constructionIdeas:item.constructionIdeas||[],references:item.references||[],
 atelierUnlocks:item.atelierUnlocks||[],socialUnlocks:item.socialUnlocks||[],tags:uniq([...(item.tags||[]),...(item.bookTags||[]),...(item.atelierTags||[])]),
 page:item.page||item.guide||null,fashionLens:item.fashionLens||null,gameplay:item.gameplay||null,
 savedAt:item.savedAt||new Date().toISOString(),favorite:!!item.favorite
}}
function add(item){const s=read(),x=normalize(item),old=s.items.find(i=>i.id===x.id);if(old){Object.assign(old,{...x,savedAt:old.savedAt,favorite:old.favorite,note:old.note||x.note});save(s);return old}s.items.unshift(x);(s.collections[x.category]||(s.collections[x.category]=[])).unshift(x.id);save(s);return x}
function addPlacePage(place){const guide=place.guide||place.carnet||{},fashion=place.fashionLens||{},media=place.media||{};return add({id:'place-'+(place.id||slug(place.name)),title:place.name||guide.title,type:'Lieu',category:'Lieux',sourceId:place.id,place:[place.city,place.department].filter(Boolean).join(' · '),image:media.hero?.url||place.image||'',images:(media.gallery||[]).map(x=>x.url||x),sources:place.sources||[],summary:guide.introduction||guide.summary||'',history:guide.history||'',chronology:guide.chronology||[],visitAsIfThere:guide.visitAsIfThere||[],anecdotes:guide.anecdotes||[],objects:guide.objects||[],artworks:guide.artworks||[],architecture:guide.architecture||[],palette:fashion.palette||place.palette||[],materials:fashion.materials||place.materials||[],motifs:fashion.motifs||place.motifs||[],forms:fashion.forms||[],jewelry:fashion.jewelry||[],accessories:fashion.accessories||[],silhouettes:fashion.silhouettes||[],constructionIdeas:fashion.constructionIdeas||[],references:fashion.references||[],tags:[...(place.gameplay?.tags||[]),...(place.gameplay?.bookTags||[]),...(place.gameplay?.atelierTags||[]),...(place.tags||[])],page:guide,fashionLens:fashion,gameplay:place.gameplay||null})}
function remove(id){const s=read();s.items=s.items.filter(x=>x.id!==id);Object.keys(s.collections||{}).forEach(k=>s.collections[k]=(s.collections[k]||[]).filter(x=>x!==id));save(s)}
function toggleFavorite(id){const s=read(),x=s.items.find(i=>i.id===id);if(x)x.favorite=!x.favorite;save(s)}
function updateNote(id,note){const s=read(),x=s.items.find(i=>i.id===id);if(x)x.note=String(note||'');save(s)}
function has(id){return read().items.some(x=>x.id===id)}
function byTag(tag){const t=slug(tag);return read().items.filter(x=>(x.tags||[]).some(v=>slug(v)===t))}
function searchByTags(tags,{mode='any'}={}){const q=uniq(tags).map(slug);if(!q.length)return read().items;return read().items.filter(x=>{const have=(x.tags||[]).map(slug);return mode==='all'?q.every(t=>have.includes(t)):q.some(t=>have.includes(t))})}
function search(text){const q=String(text||'').trim().toLowerCase();if(!q)return read().items;return read().items.filter(x=>[x.title,x.place,x.summary,x.history,...(x.tags||[])].join(' ').toLowerCase().includes(q))}
function allTags(){const m={};read().items.forEach(x=>(x.tags||[]).forEach(t=>m[t]=(m[t]||0)+1));return Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([tag,count])=>({tag,count}))}
window.HCBook={storageKey:KEY,get:read,add,addPlacePage,remove,toggleFavorite,updateNote,has,byTag,searchByTags,search,allTags,normalize};
})();