/* js/hero.js
   Hero headline: letters that swell near the cursor, lens reveal, rotating word slot, India clock.
   (classic script: shares one global scope with the other files, so keep the load order from index.html) */

/* hero letters: weight swells toward the cursor */
const split=el=>{el.innerHTML=el.textContent.trim().split(/\s+/).map(w=>`<span class="w">${[...w].map(c=>`<span class="ch">${c}</span>`).join("")}</span>`).join(" ");return[...el.querySelectorAll(".ch")]};
const chs=$$("#h1 .ln:not(.slot-ln)").flatMap(split),st=chs.map(()=>({w:300,x:75}));let heroOn=true;
const lensLn=$("#h1 .lens"),baseCh=[...lensLn.querySelectorAll(".ch")],lensTop=document.createElement("span");
lensTop.className="lensTop";lensTop.setAttribute("aria-hidden","true");lensTop.innerHTML=lensLn.innerHTML;lensLn.appendChild(lensTop);
const topCh=[...lensTop.querySelectorAll(".ch")],mirror=new Map(baseCh.map((c,i)=>[c,topCh[i]])),L={x:-999,y:0,r:0},stks=$$(".stk");
/* rotating word slot */
const slw=$(".slw"),sl=$$(".sl"),slotEl=$(".slot"),fitSlot=()=>{slotEl.style.width=Math.max(...sl.map(x=>x.firstChild.offsetWidth))+"px"};
document.fonts.ready.then(fitSlot);addEventListener("resize",fitSlot);fitSlot();
if(!reduce){const stl=gsap.timeline({repeat:-1,delay:4});for(let i=1;i<sl.length;i++)stl.to(slw,{yPercent:-100*i/sl.length,duration:.8,ease:"expo.inOut"},"+=1.4");stl.set(slw,{yPercent:0})}
/* live India clock */
const clk=$("#clk"),tick=()=>clk.textContent="India · "+new Date().toLocaleTimeString("en-GB",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit"});tick();setInterval(tick,15000);
let WK=500,XK=25;const wk=()=>{WK=innerWidth<800?230:500;XK=innerWidth<800?8:25};wk();addEventListener("resize",wk);
new IntersectionObserver(([e])=>heroOn=e.isIntersecting).observe($("#h1"));
