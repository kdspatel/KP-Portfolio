/* js/cards.js
   3D tilt on project cards.
   (classic script: shares one global scope with the other files, so keep the load order from index.html) */

// 3D tilt on project cards
// $$(".card:not(.cta)").forEach(c=>{
//   c.addEventListener("pointermove",e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;gsap.to(c,{rotateY:x*10,rotateX:-y*10,transformPerspective:900,duration:.5,ease:"power3"})});
//   c.addEventListener("pointerleave",()=>gsap.to(c,{rotateX:0,rotateY:0,duration:.8,ease:"elastic.out(1,.5)"}));
// });

/* js/cards.js
   3D tilt on project cards.
   (classic script: shares one global scope with the other files, so keep the load order from index.html) */

// 3D tilt on project cards
$$(".card:not(.cta)").forEach(c => {
  c.addEventListener("pointermove", e => {
    const r = c.getBoundingClientRect(),
          x = (e.clientX - r.left) / r.width - .5,
          y = (e.clientY - r.top) / r.height - .5;
    gsap.to(c, { rotateY: x * 10, rotateX: -y * 10, transformPerspective: 900, duration: .5, ease: "power3" });
  });
  c.addEventListener("pointerleave", () => {
    gsap.to(c, { rotateX: 0, rotateY: 0, duration: .8, ease: "elastic.out(1,.5)" });
  });
});

// recalculate the horizontal scroll length once all project images have loaded
window.addEventListener("load", () => {
  if (window.ScrollTrigger) ScrollTrigger.refresh();
});
