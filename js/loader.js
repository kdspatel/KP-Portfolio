/* js/loader.js
   Loader: particles forming KP with the circle around it, blast, iris reveal.
   (classic script: shares one global scope with the other files, so keep the load order from index.html) */

/* loader: particles assemble "KP" */
const cnt=$("#count"),P={v:0},setP=v=>{P.v=v;cnt.firstChild.nodeValue=Math.round(v)};
const pc=$("#pc"),g2=pc.getContext("2d"),dpr=Math.min(devicePixelRatio||1,2);
let W=innerWidth,H=innerHeight,parts=[],burstOn=false,charge=false,alive=true,mxp=-999,myp=-999;
pc.width=W*dpr;pc.height=H*dpr;g2.scale(dpr,dpr);
addEventListener("pointermove",e=>{mxp=e.clientX;myp=e.clientY});
function build(){
  if(!W||!H)return;
  const mn=Math.min(W,H);
  const measure=fs=>{const off=document.createElement("canvas");off.width=W;off.height=H;const o=off.getContext("2d");
    o.font=`800 ${fs}px "Bricolage Grotesque",sans-serif`;o.textAlign="center";o.textBaseline="middle";o.fillText("KP",W/2,H*.46);
    const d=o.getImageData(0,0,W,H).data,step=Math.max(4,Math.round(fs/70)),pts=[];let x0=W,x1=0,y0=H,y1=0;
    for(let y=0;y<H;y+=step)for(let x=0;x<W;x+=step)if(d[(y*W+x)*4+3]>128){pts.push([x,y]);if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
    return{pts,step,cx:(x0+x1)/2,cy:(y0+y1)/2,R:Math.hypot(x1-x0,y1-y0)/2*1.16}};
  let fs=Math.min(W*.46,H*.42),m=measure(fs);
  if(m.R*2>mn*.84){fs*=mn*.84/(m.R*2);m=measure(fs)}   // keep the circle on screen
  const{pts,step,cx,cy,R}=m;
  const spawn=(tx,ty,extra)=>{const a=Math.random()*6.283,r=Math.max(W,H)*(.35+Math.random()*.5);
    return Object.assign({x:W/2+Math.cos(a)*r,y:H/2+Math.sin(a)*r,vx:0,vy:0,tx,ty,th:Math.random(),s:step*.5,c:Math.random()<.12?0:Math.random()<.5?1:2},extra)};
  pts.forEach(([x,y])=>parts.push(spawn(x,y,{})));
  /* the circle around the logo: an orange ring, plus a thinner outer ring turning the other way */
  [[R,.7,.0009,0,.42],[R*1.12,1.9,-.0006,2,.32]].forEach(([r,gap,w,c,sz])=>{
    const n=Math.round(2*Math.PI*r/(step*gap));
    for(let i=0;i<n;i++){const an=i/n*6.283;parts.push(spawn(cx+r*Math.cos(an),cy+r*Math.sin(an),{rg:1,an,w,R:r,cx,cy,c,s:step*sz}))}});
}
function loaderSize(){W=innerWidth;H=innerHeight;pc.width=W*dpr;pc.height=H*dpr;g2.setTransform(dpr,0,0,dpr,0,0)}
let rsT;addEventListener("resize",()=>{if(!alive||burstOn)return;clearTimeout(rsT);rsT=setTimeout(()=>{loaderSize();parts=[];build()},150)});
Promise.race([document.fonts.load('800 100px "Bricolage Grotesque"'),new Promise(r=>setTimeout(r,2500))]).catch(()=>{}).then(build);
const COLS=["#ff6a1a","#f1eeff","#7a5cff"];let fade=1;
let lt=performance.now(),mvT=0;addEventListener("pointermove",()=>mvT=performance.now());
(function loop(now){
  if(!alive)return;requestAnimationFrame(loop);now=now||performance.now();const f=Math.min((now-lt)/16.7||1,3);lt=now;
  if(burstOn){g2.globalCompositeOperation="destination-out";g2.globalAlpha=1;g2.fillStyle="rgba(0,0,0,.2)";g2.fillRect(0,0,W,H);g2.globalCompositeOperation="source-over"}else g2.clearRect(0,0,W,H);const p=P.v/100;
  for(const q of parts){
    if(q.rg&&!burstOn){q.an+=q.w*f;q.tx=q.cx+q.R*Math.cos(q.an);q.ty=q.cy+q.R*Math.sin(q.an)}
    if(burstOn){const d=Math.pow(.975,f);q.vx*=d;q.vy*=d}
    else if(p>=q.th*.97){const k=.06*f,d=Math.pow(.8,f);q.vx+=(q.tx-q.x)*k;q.vy+=(q.ty-q.y)*k;q.vx*=d;q.vy*=d}
    else{const dx=q.x-W/2,dy=q.y-H/2,d=Math.pow(.985,f);q.vx+=(-dy*.00035-dx*.0003)*f;q.vy+=(dx*.00035-dy*.0003)*f;q.vx*=d;q.vy*=d}
    const mx=q.x-mxp,my=q.y-myp,md=Math.hypot(mx,my)||1,act=Math.max(0,1-(now-mvT)/180);
    if(md<110&&act>0&&!burstOn){const g=(110-md)/110*1.6*act*f;q.vx+=mx/md*g;q.vy+=my/md*g}
    q.x+=q.vx*f;q.y+=q.vy*f;if(charge){q.x+=(Math.random()-.5)*5;q.y+=(Math.random()-.5)*5}
  }
  if(burstOn)fade=Math.max(0,fade-.011*f);
  g2.globalAlpha=fade;
  for(let c=0;c<3;c++){g2.fillStyle=COLS[c];for(const q of parts)if(q.c===c)g2.fillRect(q.x,q.y,q.s,q.s)}
})();
gsap.to(P,{v:88,duration:3.2,ease:"power1.inOut",onUpdate:()=>setP(P.v)});
const fontsReady=document.fonts?document.fonts.ready:Promise.resolve();
const pageLoaded=new Promise(r=>document.readyState==="complete"?r():addEventListener("load",r));
const minWait=new Promise(r=>setTimeout(r,reduce?300:3600));
Promise.race([Promise.all([fontsReady,pageLoaded,minWait]),new Promise(r=>setTimeout(r,9000))]).then(()=>{
  const ref=Math.hypot(innerWidth,innerHeight)/Math.SQRT2,fx=$("#fx"),R={r:100};
  const formed=()=>new Promise(r=>{const t0=performance.now();(function chk(){const n=parts.length&&parts.filter(q=>Math.hypot(q.tx-q.x,q.ty-q.y)<8).length;if((n>parts.length*.97&&performance.now()-t0>700)||performance.now()-t0>5000)r();else requestAnimationFrame(chk)})()});
  gsap.to(P,{v:100,duration:.7,ease:"power2.out",onUpdate:()=>setP(P.v)});
  formed().then(()=>gsap.timeline()
   .to({},{duration:.5})
   .call(()=>{charge=true;gsap.to("#pc",{x:"random(-7,7)",y:"random(-7,7)",duration:.04,repeat:15,yoyo:true})})
   .to({},{duration:.65})
   .call(()=>{charge=false;burstOn=true;gsap.set("#pc",{x:0,y:0});parts.forEach(q=>{const a=Math.atan2(q.y-H*.46,q.x-W/2)+(Math.random()-.5)*.7,sp=14+Math.random()*46;q.vx=Math.cos(a)*sp;q.vy=Math.sin(a)*sp});
     gsap.fromTo("#shock",{scale:0,opacity:1},{scale:Math.max(W,H)/90,opacity:0,duration:1.1,ease:"power3.out"});
     gsap.fromTo("#flash",{opacity:.85},{opacity:0,duration:.5,ease:"power2.out"})})
   .to({},{duration:.9})
   .to([".lt",".lb"],{opacity:0,duration:.4},"+=.1")
   .call(()=>{heavyOn=true})
   .set(fx,{display:"block"})
   .to(R,{r:0,duration:1.3,ease:"expo.inOut",onUpdate(){$("#loader").style.clipPath=`circle(${R.r}% at 50% 50%)`;fx.style.width=fx.style.height=(2*R.r/100*ref)+"px"},onComplete(){alive=false;$("#loader").remove();fx.remove();lenis&&lenis.start()}},"<")
   .from(chs,{yPercent:120,rotate:8,duration:1.2,stagger:.03,ease:"expo.out"},"-=.7")
   .from(blob.scale,{x:0,y:0,z:0,duration:1.8,ease:"elastic.out(1,.55)"},"-=1")
   .from([".hero-foot",".badge",".chip",".stk",".slot-ln",".lensTop"],{opacity:0,y:30,duration:1,stagger:.1},"-=.7"));
});
