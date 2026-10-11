/* js/navbar.js
   Navbar: sliding highlight that follows hover / current section, and the mobile full-screen menu.
   (classic script: shares one global scope with the other files, so keep the load order from index.html) */

/* navbar: sliding highlight follows the hovered link, otherwise the section you are in */
const nl=$("#nl"),ind=$("#ind"),nls=[...nl.querySelectorAll("a")];let navAct=null;
const place=a=>{nls.forEach(x=>x.classList.toggle("hot",x===a));
  if(!a){ind.style.opacity=0;return}
  if(!+ind.style.opacity){ind.style.transition="none";ind.style.left=a.offsetLeft+"px";ind.style.width=a.offsetWidth+"px";ind.offsetWidth;ind.style.transition=""}
  ind.style.opacity=1;ind.style.left=a.offsetLeft+"px";ind.style.width=a.offsetWidth+"px"};
nls.forEach(a=>{a.addEventListener("pointerenter",()=>place(a));a.addEventListener("pointerleave",()=>place(navAct))});
window.navActive=i=>{navAct=nls.find(a=>+a.dataset.i===i)||null;place(navAct)};
addEventListener("resize",()=>place(navAct));
addEventListener("scroll",()=>$("#tn").classList.toggle("s",scrollY>60),{passive:true});
/* mobile: full-screen menu that opens as a circle from the button */
const menu=$("#menu"),nb=$("#nb"),mis=$$(".mi");let mo=false;
function toggleMenu(o){if(o===mo)return;mo=o;nb.classList.toggle("x",o);nb.setAttribute("aria-expanded",o);nb.querySelector(".nbl").textContent=o?"Close":"Menu";
  menu.setAttribute("aria-hidden",!o);menu.style.pointerEvents=o?"auto":"none";
  const r=nb.getBoundingClientRect(),pos=`${r.left+r.width/2}px ${r.top+r.height/2}px`;
  gsap.to(menu,{clipPath:o?`circle(160% at ${pos})`:`circle(0% at ${pos})`,duration:.8,ease:"expo.inOut",overwrite:true});
  if(o)gsap.fromTo(mis,{yPercent:110},{yPercent:0,duration:.9,stagger:.07,delay:.25,ease:"expo.out"});
  lenis&&(o?lenis.stop():lenis.start())}
nb.addEventListener("click",()=>toggleMenu(!mo));
mis.forEach(a=>a.addEventListener("click",e=>{e.preventDefault();const t=$(a.getAttribute("href"));toggleMenu(false);if(t)setTimeout(()=>lenis?lenis.scrollTo(t,{duration:1.6}):t.scrollIntoView({behavior:"smooth"}),150)}));
addEventListener("keydown",e=>e.key==="Escape"&&toggleMenu(false));
addEventListener("resize",()=>innerWidth>800&&toggleMenu(false));
