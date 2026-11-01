// Fictional demo data around Phagwara, Punjab.
const base=[31.2240,75.7708];
const routeDefs=[
 {id:"R-101",name:"Greenfield North Loop",busId:"BUS-01",driverId:"D-01",stops:["Model Town Gate","Guru Hargobind Nagar","Urban Estate Phase I","LPU Main Gate","Lovely Professional University","Chaheru Crossing","School Campus"]},
 {id:"R-102",name:"City Centre Express",busId:"BUS-02",driverId:"D-02",stops:["Bus Stand Phagwara","Hoshiarpur Road","Gurdwara Sukhchain Sahib","Town Hall","Satnampura Market","Banga Road Junction","School Campus"]},
 {id:"R-103",name:"Westside Community Route",busId:"BUS-03",driverId:"D-03",stops:["Palahi Road","Sugar Mill Chowk","Mehtan Village Turn","GT Road Service Lane","Chaheru Village","LPU West Gate","School Campus"]}
];
const coords=[[31.219,75.772],[31.226,75.765],[31.232,75.779],[31.238,75.769],[31.242,75.775],[31.248,75.764],[31.253,75.772]];
export const routes=routeDefs.map((r,ri)=>({...r,stops:r.stops.map((name,i)=>({id:`${r.id}-S${i+1}`,name,sequence:i+1,lat:coords[i][0]+ri*.003+(i%2)*.001,lng:coords[i][1]+ri*.002}))}));
export const buses=[
 {id:"BUS-01",plate:"PB-36-A 4101",routeId:"R-101",driverId:"D-01",status:"Active",lat:31.235,lng:75.772},
 {id:"BUS-02",plate:"PB-36-B 2088",routeId:"R-102",driverId:"D-02",status:"Active",lat:31.229,lng:75.781},
 {id:"BUS-03",plate:"PB-36-C 7752",routeId:"R-103",driverId:"D-03",status:"Active",lat:31.242,lng:75.763}
];
export const drivers=[
 {id:"D-01",name:"Gurpreet Singh",email:"driver1@saferoute.demo",role:"driver",phone:"+91 98765 41001",active:true,busId:"BUS-01"},
 {id:"D-02",name:"Manpreet Kaur",email:"driver2@saferoute.demo",role:"driver",phone:"+91 98765 41002",active:true,busId:"BUS-02"},
 {id:"D-03",name:"Harpreet Singh",email:"driver3@saferoute.demo",role:"driver",phone:"+91 98765 41003",active:true,busId:"BUS-03"}
];
export const coordinators=[
 {id:"C-01",name:"Amandeep Sharma",email:"coordinator@saferoute.demo",role:"coordinator",phone:"+91 98765 42001",active:true},
 {id:"C-02",name:"Simran Gill",email:"coordinator2@saferoute.demo",role:"coordinator",phone:"+91 98765 42002",active:true}
];
export const admin={id:"A-01",name:"School Administrator",email:"admin@saferoute.demo",role:"admin",active:true};
const first=["Aarav","Anaya","Vivaan","Aadhya","Arjun","Ishita","Reyansh","Kiara","Advik","Myra","Kabir","Saanvi","Dhruv","Pari","Rohan","Navya","Krish","Meher","Veer","Diya"];
const last=["Sharma","Verma","Kaur","Singh","Patel","Gill","Kumar","Malhotra","Bedi","Arora"];
export const parents=Array.from({length:20},(_,i)=>{const ri=i%3, si=i===0?4:(i*2+1)%7;return {id:`P-${String(i+1).padStart(2,"0")}`,name:`${last[(i+2)%last.length]} ${["Aman","Riya","Neha","Rahul","Karan","Simran","Pooja","Nitin","Meena","Jaspreet"][i%10]}`,email:i===0?"parent1@saferoute.demo":`parent${i+1}@saferoute.demo`,role:"parent",active:true,phone:`+91 98${String(76540000+i).slice(-8)}`,childName:`${first[i]} ${last[i%last.length]}`,routeId:routes[ri].id,busId:routes[ri].busId,stopId:routes[ri].stops[si].id,scheduledEta:`${7+Math.floor((30+si*5)/60)}:${String((30+si*5)%60).padStart(2,"0")} AM`};});
const now=Date.now();
export let incidents=[
 {id:"INC-2408",busId:"BUS-02",routeId:"R-102",type:"Traffic",severity:"Moderate",status:"Active",note:"Slow traffic near Town Hall due to road works.",createdAt:new Date(now-8*60000).toISOString(),affectedStopIds:routes[1].stops.slice(3,7).map(s=>s.id),delay:12},
 {id:"INC-2407",busId:"BUS-01",routeId:"R-101",type:"Mechanical",severity:"Major",status:"Active",note:"Driver reported a warning light. Vehicle is safely stopped.",createdAt:new Date(now-4*60000).toISOString(),affectedStopIds:routes[0].stops.slice(4,7).map(s=>s.id),delay:24},
 {id:"INC-2402",busId:"BUS-03",routeId:"R-103",type:"Diversion",severity:"Minor",status:"Resolved",note:"Temporary diversion cleared.",createdAt:new Date(now-86400000).toISOString(),affectedStopIds:routes[2].stops.slice(2,5).map(s=>s.id),delay:5}
];
export let alerts=[];
function buildAlerts(){
 alerts=[];
 incidents.filter(x=>x.status==="Active").forEach(inc=>{
  const route=routes.find(r=>r.id===inc.routeId);
  parents.filter(p=>p.routeId===inc.routeId&&inc.affectedStopIds.includes(p.stopId)).forEach((p,j)=>{
   const stop=route.stops.find(s=>s.id===p.stopId);
   alerts.push({id:`ALT-${inc.id}-${p.id}`,incidentId:inc.id,parentId:p.id,childName:p.childName,stopName:stop.name,type:inc.type,severity:inc.severity,status:j===0?"Acknowledged":"Pending",message:`${inc.type} reported on ${route.name}. Your stop is affected; updated arrival estimate is ${p.scheduledEta}.`,createdAt:inc.createdAt,oldEta:p.scheduledEta,newEta:shiftEta(p.scheduledEta,inc.delay),delay:inc.delay,acknowledgedAt:j===0?new Date(now-2*60000).toISOString():null,escalateAt:Date.now()+30000});
  });
 });
}
function shiftEta(eta,mins){let m=eta.match(/(\d+):(\d+) (AM|PM)/);let h=+m[1]%12+(m[3]==="PM"?12:0), total=h*60+ +m[2]+mins;let nh=Math.floor(total/60)%24;return `${nh%12||12}:${String(total%60).padStart(2,"0")} ${nh>=12?"PM":"AM"}`;}
buildAlerts();
export function resetMockData(){incidents=[...incidents];buildAlerts();}
export function getMutable(){return {incidents,alerts,routes,buses,drivers,parents,coordinators,admin};}
export function setIncidents(v){incidents=v;}
export function setAlerts(v){alerts=v;}
export function setRoutes(v){routes.splice(0,routes.length,...v);}
export function setBuses(v){buses.splice(0,buses.length,...v);}
export function setParents(v){parents.splice(0,parents.length,...v);}
export function setDrivers(v){drivers.splice(0,drivers.length,...v);}
export const demoAccounts=[
 {role:"Parent",email:"parent1@saferoute.demo",password:"demo123"},
 {role:"Driver",email:"driver1@saferoute.demo",password:"demo123"},
 {role:"Coordinator",email:"coordinator@saferoute.demo",password:"demo123"},
 {role:"Admin",email:"admin@saferoute.demo",password:"demo123"}
];