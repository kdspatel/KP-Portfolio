/* js/pointer.js
   Custom cursor, magnetic buttons, glow trail and click burst.
   (classic script: shares one global scope with the other files, so keep the load order from index.html) */

/* pointer, cursor, glow trail + click burst */
let px=innerWidth/2,py=innerHeight/2,last=-1e9,sm={x:.5,y:.5};
addEventListener("pointermove",e=>{px=e.clientX;py=e.clientY;last=performance.now()});
const cx=gsap.quickTo("#cur","x",{duration:.25,ease:"power3"}),cy=gsap.quickTo("#cur","y",{duration:.25,ease:"power3"});
addEventListener("pointermove",e=>{cx(e.clientX);cy(e.clientY)});
$$("[data-c]").forEach(el=>{el.addEventListener("pointerenter",()=>gsap.to("#cur",{scale:el.classList.contains("card")?6:3.5,duration:.35}));el.addEventListener("pointerleave",()=>gsap.to("#cur",{scale:1,duration:.35}))});
$$(".mag").forEach(el=>{el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect();gsap.to(el,{x:(e.clientX-r.left-r.width/2)*.3,y:(e.clientY-r.top-r.height/2)*.4,duration:.4})});el.addEventListener("pointerleave",()=>gsap.to(el,{x:0,y:0,duration:.8,ease:"elastic.out(1,.4)"}))});
const tcv=$("#tc"),tg=tcv.getContext("2d"),dots=[];
const rs=()=>{tcv.width=innerWidth;tcv.height=innerHeight};rs();addEventListener("resize",rs);
addEventListener("pointermove",e=>{if(dots.length<90)dots.push({x:e.clientX,y:e.clientY,vx:0,vy:0,l:1,r:12+Math.random()*10})});
addEventListener("pointerdown",e=>{for(let i=0;i<34;i++){const a=Math.random()*6.283,s=2+Math.random()*8;dots.push({x:e.clientX,y:e.clientY,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1,r:4+Math.random()*8,b:1})}});
function drawTrail(){tg.clearRect(0,0,tcv.width,tcv.height);tg.globalCompositeOperation="lighter";
 for(let i=dots.length-1;i>=0;i--){const d=dots[i];d.x+=d.vx;d.y+=d.vy;d.vx*=.94;d.vy*=.94;d.l-=d.b?.025:.04;d.r*=.975;
  if(d.l<=0){dots.splice(i,1);continue}
  tg.fillStyle=d.b?`rgba(255,225,74,${d.l*.55})`:`rgba(255,95,162,${d.l*.35})`;tg.beginPath();tg.arc(d.x,d.y,d.r,0,6.283);tg.fill()}
 tg.globalCompositeOperation="source-over"}
