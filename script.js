// Cada zona: id, nombre, descripción, pts (coordenadas sobre la foto) y scene (la foto 360° que se asignará después).
const ZONES = [
 {id:"edifA", name:"Edificio A (Administrativo)", pts:"336,500 369,389 470,395 442,502 430,503 431,532 336,528 334,497"},
 {id:"edifB", name:"Edificio B (Centro de Cómputo)", desc:"Aquí se encuentra el Centro de Cómputo.", pts:"613,513 614,510 615,394 767,401 797,511 773,513 768,542 613,531"},
 {id:"patio", name:"El Cheto de FMAT", pts:"607,439 602,454 587,466 564,474 537,477 510,474 488,466 472,454 467,439 472,424 488,412 510,404 537,401 564,404 587,412 602,424"},
 {id:"acceso", name:"Plaza de acceso", pts:"475,536 610,547 640,592 470,592"},
 {id:"plaza", name:"Plaza central", pts:"503,312 579,312 580,337 582,390 503,388"},
 {id:"cafe", name:"Plaza Roja", pts:"580,337 610,336 640,342 654,354 658,368 650,382 636,391 610,390 582,390"},
 {id:"teatro", name:"Mini teatro al aire libre", pts:"747,365 742,328 688,332 692,366"},
 {id:"edifC", name:"Edificio C", pts:"448,239 579,241 581,279 434,279"},
 {id:"edifD", name:"Edificio D", pts:"618,240 770,242 774,288 618,284"},
 {id:"edifE", name:"Edificio E", pts:"390,352 412,287 495,283 480,380 395,386"},
 {id:"ingQuimica", name:"Facultad de Ingeniería Química (próximamente)", desc:"La Facultad de Ingeniería Química se agregará próximamente.", pts:"258,362 3,343 133,201 366,212", upcoming:true},
 {id:"edifG", name:"Edificio G (Laboratorios)", pts:"400,158 390,178 268,170 279,156"},
 {id:"edifH", name:"Edificio H", pts:"617,205 752,208 750,225 618,227"},
 {id:"canchas", name:"Canchas FMAT", pts:"528,120 619,121 618,99 531,99"},
 {id:"biblio", name:"Biblioteca de Ciencias Exactas", pts:"889,408 825,317 843,278 1070,271 1132,369 1133,414 895,412 902,371 902,369"},
 {id:"estac", name:"Estacionamiento", pts:"0,508 105,508 125,540 205,572 250,590 255,632 380,652 560,648 650,665 780,660 960,672 960,698 0,698"}
].map(z=>({desc:"Aquí irá la descripción de este espacio y el acceso a su foto 360°.",scene:null,...z}));

const NS="http://www.w3.org/2000/svg", $=id=>document.getElementById(id);
const svg=$("svg"), mapEl=$("map"), list=$("list"), go=$("go");
const pan=$("pan"), reducedMotion=matchMedia("(prefers-reduced-motion: reduce)").matches, canPan=matchMedia("(hover: hover) and (pointer: fine)").matches;
const callout=$("zoneCallout"), calloutLine=$("calloutLine"), calloutDot=$("calloutDot"), calloutLines=$("calloutLines");
let current=null, currentCalloutId=null, tx=0, ty=0, cx=0, cy=0, zoom=1, mapHovered=false;

ZONES.forEach(z=>{
  const p=document.createElementNS(NS,"polygon");
  p.setAttribute("points",z.pts); p.setAttribute("class","zone"); p.setAttribute("tabindex","0");
  if(z.upcoming)p.classList.add("upcoming");
  p.setAttribute("role","button"); p.setAttribute("aria-label",z.name); p.id="z-"+z.id;
  p.addEventListener("pointerenter",()=>showCallout(z));
  p.addEventListener("pointerleave",hideCallout);
  p.addEventListener("focus",()=>showCallout(z));
  p.addEventListener("blur",hideCallout);
  p.addEventListener("click",()=>select(current?.id===z.id?null:z.id));
  p.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();select(current?.id===z.id?null:z.id)}});
  $("zones").appendChild(p);
  const li=document.createElement("li"), b=document.createElement("button");
  b.textContent=z.name; b.id="b-"+z.id; if(z.upcoming)b.classList.add("upcoming"); b.onclick=()=>select(z.id); li.appendChild(b); list.appendChild(li);
});

function showCallout(zone){
  currentCalloutId=zone.id;
  $("calloutName").textContent=zone.name;
  $("calloutDesc").textContent=zone.desc;
  callout.hidden=false;
  callout.classList.add("visible");
  requestAnimationFrame(updateCallout);
}
function hideCallout(){
  currentCalloutId=null;
  callout.classList.remove("visible");
  callout.hidden=true;
  calloutLines.hidden=true;
}
function select(id){
  if(!id){
    current=null;
    document.querySelectorAll(".zone,.list button").forEach(n=>n.classList.remove("on"));
    $("title").textContent="Elige una zona";
    $("desc").textContent="Selecciona un edificio en el mapa o en la lista.";
    go.disabled=true;
    hideCallout();
    return;
  }
  current=ZONES.find(z=>z.id===id);
  if(!current)return;
  document.querySelectorAll(".zone,.list button").forEach(n=>n.classList.remove("on"));
  $("z-"+id).classList.add("on"); $("b-"+id).classList.add("on");
  $("title").textContent=current.name; $("desc").textContent=current.desc;
  go.disabled=!current.scene;
}
go.onclick=()=>{ if(current&&current.scene){ /* aquí se abrirá el visor 360° */ } };

// Modo trazo
let pts=[];
$("mode").onchange=e=>{document.body.classList.toggle("editing",e.target.checked); if(!e.target.checked){pts=[];draw();}};
svg.addEventListener("click",e=>{
  if(!document.body.classList.contains("editing"))return;
  const m=svg.getScreenCTM().inverse(), pt=new DOMPoint(e.clientX,e.clientY).matrixTransform(m);
  pts.push([Math.round(pt.x),Math.round(pt.y)]); draw();
});
function draw(){
  const g=$("draft"); g.innerHTML="";
  if(pts.length){
    const pl=document.createElementNS(NS,"polygon");
    pl.setAttribute("points",pts.join(" ")); pl.setAttribute("fill","rgba(233,168,0,.3)"); pl.setAttribute("stroke","#e9a800"); pl.setAttribute("stroke-width","2");
    g.appendChild(pl);
    pts.forEach(([x,y])=>{const c=document.createElementNS(NS,"circle");c.setAttribute("cx",x);c.setAttribute("cy",y);c.setAttribute("r",4);c.setAttribute("fill","#fff");c.setAttribute("stroke","#e9a800");g.appendChild(c);});
  }
  $("out").value=pts.map(p=>p.join(",")).join(" ");
}
$("undo").onclick=()=>{pts.pop();draw()};
$("clear").onclick=()=>{pts=[];draw()};
$("copy").onclick=async()=>{
  const output=$("out");
  output.select();
  let copied=false;
  if(navigator.clipboard&&navigator.clipboard.writeText){
    try{await navigator.clipboard.writeText(output.value);copied=true;}catch{}
  }
  if(!copied){
    try{copied=document.execCommand("copy");}catch{}
  }
  $("copyStatus").textContent=copied
    ?"Coordenadas copiadas."
    :"No se pudieron copiar automáticamente. Las coordenadas siguen seleccionadas para que las copies manualmente.";
};

// Portada y pantalla de carga
const LOGOS={uady:"assets/uady-logo.svg",fmat:"assets/fmat-logo.png"};
LOGOS.sign="assets/sign.jpg";
document.querySelectorAll("img[data-logo]").forEach(i=>{i.src=LOGOS[i.dataset.logo]});
const cover=$("cover"), loading=$("loading"), menu=$("menu"), mbtn=$("menuBtn");
document.querySelectorAll(".brand-home").forEach(button=>button.addEventListener("click",()=>cover.classList.remove("hide")));
cover.style.backgroundImage='url("assets/cover.jpg")';
const t0=performance.now();
function ready(){ setTimeout(()=>{ loading.classList.add("hide"); $("startBtn").focus({preventScroll:true}); }, Math.max(0,1400-(performance.now()-t0))); }
if(document.readyState==="complete") ready(); else window.addEventListener("load",ready);
function start(){ cover.classList.add("hide"); }
$("startBtn").addEventListener("click",start);
// Ejes que siguen al cursor, con las coordenadas del mapa
const ro=$("ro");
cover.addEventListener("pointermove",e=>{
  const r=cover.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top;
  cover.style.setProperty("--cx",x+"px"); cover.style.setProperty("--cy",y+"px");
  ro.textContent="x "+Math.round(x/r.width*1136)+", y "+Math.round(60+y/r.height*638);
});
mbtn.onclick=()=>{ const o=menu.classList.toggle("open"); mbtn.setAttribute("aria-expanded",o); };
function addItem(label,fn){ const b=document.createElement("button"); b.textContent=label; b.onclick=()=>{ menu.classList.remove("open"); mbtn.setAttribute("aria-expanded","false"); fn(); }; menu.appendChild(b); }
addItem("Portada",()=>cover.classList.remove("hide"));
ZONES.forEach(z=>addItem(z.name,()=>{ start(); select(z.id); }));

function polygonCentroid(zone){
  const points=zone.pts.split(/\s+/).map(pair=>pair.split(",").map(Number));
  let area=0, x=0, y=0;
  points.forEach((point,index)=>{
    const next=points[(index+1)%points.length], cross=point[0]*next[1]-next[0]*point[1];
    area+=cross; x+=(point[0]+next[0])*cross; y+=(point[1]+next[1])*cross;
  });
  if(Math.abs(area)<1e-6){
    return points.reduce((center,point)=>[center[0]+point[0]/points.length,center[1]+point[1]/points.length],[0,0]);
  }
  return [x/(3*area),y/(3*area)];
}
function updateCallout(){
  if(!currentCalloutId||callout.hidden)return;
  const zoneData=ZONES.find(item=>item.id===currentCalloutId);
  const rect=mapEl.getBoundingClientRect();
  const width=mapEl.clientWidth, height=mapEl.clientHeight, box=callout.getBoundingClientRect();
  const center=polygonCentroid(zoneData), point=svg.createSVGPoint();
  point.x=center[0]; point.y=center[1];
  const screen=point.matrixTransform(svg.getScreenCTM());
  const anchorX=screen.x-rect.left-mapEl.clientLeft, anchorY=screen.y-rect.top-mapEl.clientTop;
  const right=anchorX+20+box.width<=width-8;
  const left=Math.max(8,Math.min(right?anchorX+20:anchorX-box.width-20,width-box.width-8));
  const top=Math.max(8,Math.min(anchorY-box.height-16,height-box.height-8));
  const endX=right?left:left+box.width, endY=Math.max(top+8,Math.min(anchorY,top+box.height-8));
  callout.style.left=left+"px"; callout.style.top=top+"px";
  calloutLines.hidden=false;
  const inverse=svg.getScreenCTM().inverse(), anchor=svg.createSVGPoint(), endpoint=svg.createSVGPoint();
  anchor.x=screen.x; anchor.y=screen.y;
  endpoint.x=rect.left+mapEl.clientLeft+endX; endpoint.y=rect.top+mapEl.clientTop+endY;
  const localAnchor=anchor.matrixTransform(inverse), localEndpoint=endpoint.matrixTransform(inverse);
  calloutLine.setAttribute("x1",localAnchor.x); calloutLine.setAttribute("y1",localAnchor.y);
  calloutLine.setAttribute("x2",localEndpoint.x); calloutLine.setAttribute("y2",localEndpoint.y);
  calloutDot.setAttribute("cx",center[0]); calloutDot.setAttribute("cy",center[1]);
}
function aim(e){
  if(reducedMotion||!canPan||e.pointerType==="touch"||document.body.classList.contains("editing"))return;
  mapHovered=true;
  const rect=mapEl.getBoundingClientRect();
  tx=((e.clientX-rect.left)/rect.width-.5)*2;
  ty=((e.clientY-rect.top)/rect.height-.5)*2;
}
mapEl.addEventListener("pointermove",aim);
mapEl.addEventListener("pointerleave",()=>{tx=0;ty=0;mapHovered=false;});
mapEl.addEventListener("click",e=>{
  if(document.body.classList.contains("editing")||e.target.closest(".zone"))return;
  select(null);
});
window.addEventListener("resize",()=>{if(currentCalloutId)updateCallout();});
(function animateMap(){
  const editing=document.body.classList.contains("editing");
  const targetX=editing||reducedMotion?0:tx, targetY=editing||reducedMotion?0:ty;
  const targetZoom=editing||reducedMotion||!canPan||!mapHovered?1:1.015;
  cx+=(targetX-cx)*.06; cy+=(targetY-cy)*.06; zoom+=(targetZoom-zoom)*.06;
  const width=mapEl.clientWidth, height=mapEl.clientHeight;
  pan.style.transform="translate("+(-cx*(zoom-1)*width/2)+"px,"+(-cy*(zoom-1)*height/2)+"px) scale("+zoom+")";
  if(currentCalloutId)updateCallout();
  requestAnimationFrame(animateMap);
})();
