/* Haute Couture Live — moteur de circuits territoriaux immersifs v1 */
(function(){
'use strict';
if(window.HCTerritorialCircuitEngineV1)return;
const KEY='haute-couture-territorial-circuit-v1';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(_){return f}};
const write=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));return v};
function state(){const s=read(KEY,{version:1,circuits:{},unlocks:[],memory:[]});s.circuits=s.circuits||{};s.unlocks=s.unlocks||[];s.memory=s.memory||[];return s}
function circuitState(id){const s=state();return s.circuits[id]||{started:false,completed:false,stages:{},firstStartAt:null,lastPlayedAt:null}}
function saveCircuit(id,c){const s=state();s.circuits[id]=c;write(KEY,s);return c}
function start(id){const c=circuitState(id);c.started=true;c.firstStartAt=c.firstStartAt||new Date().toISOString();c.lastPlayedAt=new Date().toISOString();return saveCircuit(id,c)}
function unlockItem(circuitId,id){const circuit=window.HCTerritorialCircuits?.[circuitId];if(!circuit)return false;const item=(circuit.unlocks||[]).find(x=>x.id===id);if(!item)return false;const s=state();if(s.unlocks.some(x=>x.id===id))return false;const entry={...item,circuitId,at:new Date().toISOString()};s.unlocks.unshift(entry);write(KEY,s);window.dispatchEvent(new CustomEvent('hc-circuit-unlock',{detail:entry}));return true}
function completeStage(circuitId,stageId){const circuit=window.HCTerritorialCircuits?.[circuitId];if(!circuit)return null;const stage=(circuit.stages||[]).find(x=>x.id===stageId);if(!stage)return null;const c=start(circuitId);c.stages[stageId]={done:true,at:new Date().toISOString()};c.lastPlayedAt=new Date().toISOString();saveCircuit(circuitId,c);(stage.unlocks||[]).forEach(id=>unlockItem(circuitId,id));window.dispatchEvent(new CustomEvent('hc-circuit-stage',{detail:{circuitId,stageId,stage}}));if((circuit.stages||[]).every(x=>c.stages[x.id]?.done))finish(circuitId);return c}
function remember(circuitId,stageId,text,meta={}){const s=state();s.memory.unshift({circuitId,stageId,text,meta,at:new Date().toISOString()});s.memory=s.memory.slice(0,400);write(KEY,s);window.dispatchEvent(new CustomEvent('hc-circuit-memory',{detail:{circuitId,stageId,text,meta}}))}
function finish(circuitId){const circuit=window.HCTerritorialCircuits?.[circuitId];if(!circuit)return null;const c=start(circuitId);c.completed=true;c.completedAt=c.completedAt||new Date().toISOString();saveCircuit(circuitId,c);(circuit.unlocks||[]).forEach(u=>unlockItem(circuitId,u.id));window.dispatchEvent(new CustomEvent('hc-circuit-complete',{detail:{circuitId,circuit}}));return c}
function progress(circuitId){const circuit=window.HCTerritorialCircuits?.[circuitId],c=circuitState(circuitId);const total=circuit?.stages?.length||0,done=Object.values(c.stages||{}).filter(x=>x?.done).length;return {done,total,completed:c.completed}}
window.HCTerritorialCircuitEngineV1={version:1,state,circuitState,start,completeStage,remember,finish,progress,storageKey:KEY};
})();