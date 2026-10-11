/* js/core.js
   Helpers, safety nets (library check + local error box), GSAP/ScrollTrigger setup, Lenis smooth scroll.
   (classic script: shares one global scope with the other files, so keep the load order from index.html) */

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
/* safety nets: say exactly what failed instead of a dead page */
const _msg=(t,bg)=>{const d=document.createElement("div");d.style.cssText="position:fixed;z-index:99999;left:10px;right:10px;bottom:10px;background:"+bg+";color:#000;padding:12px 16px;font:600 13px/1.4 monospace;border:2px solid #000;border-radius:8px";d.textContent=t;document.body.appendChild(d)};
if(typeof gsap==="undefined"||typeof ScrollTrigger==="undefined"||typeof THREE==="undefined"){
  const l=document.getElementById("loader");l&&l.remove();const f=document.getElementById("fx");f&&f.remove();
  _msg("A library failed to load (GSAP / ScrollTrigger / Three.js). Check your internet connection or ad-blocker, then refresh.","#ff5fa2");throw new Error("Libraries missing")}
if(["localhost","127.0.0.1",""].includes(location.hostname)||location.search.includes("debug"))
  addEventListener("error",e=>_msg("JS error: "+e.message+" ("+String(e.filename).split("/").pop()+":"+e.lineno+")","#ffe14a"));
gsap.registerPlugin(ScrollTrigger);ScrollTrigger.config({ignoreMobileResize:true});
let vel=0;

/* smooth scroll */
const lenis=typeof Lenis!=="undefined"&&!reduce?new Lenis({lerp:.09}):null;
if(lenis){lenis.on("scroll",ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);lenis.stop();
  $$('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{const t=$(a.getAttribute("href"));if(t){e.preventDefault();lenis.scrollTo(t,{duration:1.8})}}))}
