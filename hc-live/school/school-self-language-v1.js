/* Haute Couture Live — cohérence joueur : aucun prénom imposé dans l'école v1 */
(function(){
'use strict';
if(window.HCSchoolSelfLanguageV1)return;
const CKEY='haute-couture-school-community-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}},write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
function cleanStorage(){const c=read(CKEY,null);if(!c)return;if('player'in c)c.player=null;Object.values(c.relationships||{}).forEach(r=>(r.history||[]).forEach(h=>{if(typeof h.text==='string')h.text=h.text.replace(/Marion a pris du temps pour aider/g,'Tu as pris du temps pour aider').replace(/Marion a demandé un avis/g,'Tu as demandé un avis').replace(/Marion/g,'Tu')}));write(CKEY,c)}
function cleanDOM(){const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while((n=walker.nextNode())){if(n.nodeValue&&/Marion/.test(n.nodeValue))n.nodeValue=n.nodeValue.replace(/Marion/g,'Tu')}}
function run(){cleanStorage();cleanDOM()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,100));else setTimeout(run,100);setTimeout(run,700);new MutationObserver(()=>{clearTimeout(window.__hcSelfLangTimer);window.__hcSelfLangTimer=setTimeout(cleanDOM,30)}).observe(document.documentElement,{childList:true,subtree:true});
window.HCSchoolSelfLanguageV1={version:1,run};
})();