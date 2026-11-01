// Mock push service. Replace internals with @stomp/stompjs Client when backend is available.
import {getMutable} from "../mock/data";
const listeners=new Set();let timer=null;
function tick(){const d=getMutable(),now=Date.now();let changed=false;d.alerts.forEach(a=>{if(a.status==="Pending"&&a.escalateAt&&now>=a.escalateAt){a.status="Escalated";changed=true}});const event={type:changed?"alerts-escalated":"heartbeat",at:new Date().toISOString(),message:changed?"One or more alerts escalated":"Live feed connected"};listeners.forEach(fn=>fn(event));}
export function subscribeMockUpdates(callback){listeners.add(callback);if(!timer)timer=setInterval(tick,2000);return()=>{listeners.delete(callback);if(!listeners.size&&timer){clearInterval(timer);timer=null}}}
export function publishMockEvent(event){listeners.forEach(fn=>fn(event))}
export function startMockEscalation(){if(!timer)timer=setInterval(tick,2000);return()=>{if(timer){clearInterval(timer);timer=null}}}
