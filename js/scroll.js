/* js/scroll.js
   All ScrollTrigger scenes: hero tear, marquee, about, statement, work, services, contact, orb path, themes.
   (classic script: shares one global scope with the other files, so keep the load order from index.html) */

/* ===== scroll animations ===== */
const NAMES = ["Intro", "About", "Philosophy", "Work", "Services", "Contact"];
gsap.to("#prog", {
  scaleX: 1,
  ease: "none",
  scrollTrigger: { scrub: 0.3, start: 0, end: "max" },
});

// hero: lines tear apart, orb drifts
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
  })
  .to("#h1 .ln:nth-child(1)", { xPercent: -18 }, 0)
  .to("#h1 .ln:nth-child(2)", { xPercent: 16 }, 0)
  .to("#h1 .ln:nth-child(3)", { xPercent: -10 }, 0)
  .to(".hero-foot", { opacity: 0, y: -60 }, 0)
  .to(".chips", { opacity: 0 }, 0)
  .to(".s-hire", { y: -260, x: 90, rotate: 18 }, 0)
  .to(".s-star", { y: -340, scale: 1.6 }, 0)
  .to(".s-tag", { y: -200, x: -120, rotate: -12 }, 0);

gsap.to(BG.uAlpha, {
  value: 0,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom 25%",
    scrub: true,
  },
});

gsap.fromTo(
  ".ra",
  { rotate: -8 },
  {
    rotate: -3,
    ease: "none",
    scrollTrigger: {
      trigger: ".mq",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  },
);
gsap.fromTo(
  ".rbb",
  { rotate: 8 },
  {
    rotate: 3,
    ease: "none",
    scrollTrigger: {
      trigger: ".mq",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  },
);
// marquees: speed, direction and skew follow scroll velocity
const t1 = gsap.to("#m1", {
    xPercent: -50,
    duration: 22,
    ease: "none",
    repeat: -1,
  }),
  t2 = gsap.fromTo(
    "#m2",
    { xPercent: -50 },
    { xPercent: 0, duration: 26, ease: "none", repeat: -1 },
  );
const skewEls = ".mq,.card";
ScrollTrigger.create({
  onUpdate: (s) => {
    const v = s.getVelocity();
    vel = Math.abs(v);
    const k = gsap.utils.clamp(-8, 8, v / -250);
    [t1, t2].forEach((t) =>
      gsap.to(t, {
        timeScale: 1 + Math.min(Math.abs(v) / 250, 8) * s.direction,
        duration: 0.2,
        overwrite: true,
      }),
    );
    gsap.to([t1, t2], {
      timeScale: 1,
      delay: 0.4,
      duration: 1.2,
      overwrite: "auto",
    });
    gsap.to(skewEls, { skewX: k, duration: 0.25, overwrite: "auto" });
    clearTimeout(window.skT);
    window.skT = setTimeout(
      () =>
        gsap.to(skewEls, {
          skewX: 0,
          duration: 0.9,
          ease: "power3.out",
          overwrite: "auto",
        }),
      90,
    );
  },
});

// about: pinned, words light up, facts rise, rings parallax
const ab = $("#abt");
ab.innerHTML = ab.textContent
  .trim()
  .split(/\s+/)
  .map((w) => `<span class="wd">${w}</span>`)
  .join(" ");
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".about",
      start: "top top",
      end: "+=180%",
      pin: true,
      scrub: 1,
    },
  })
  .to(".wd", { opacity: 1, stagger: 0.12, duration: 0.6, ease: "none" })
  .from(".fact", { opacity: 0, y: 50, stagger: 0.25, duration: 0.6 }, ">-.2");
$$(".fl").forEach((el) =>
  gsap.to(el, {
    y: -(el.dataset.s * 160),
    ease: "none",
    scrollTrigger: {
      trigger: ".about",
      start: "top bottom",
      end: "+=280%",
      scrub: 1,
    },
  }),
);

// statement: pinned, three phrases slam in and out
const ph = $$(".ph"),
  tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".st",
      start: "top top",
      end: "+=320%",
      pin: true,
      scrub: 1,
    },
  });
ph.forEach((p, i) => {
  tl2.fromTo(
    p,
    { scale: 2.8, opacity: 0, rotate: i % 2 ? 5 : -5, filter: innerWidth < 800 ? "blur(10px)" : "blur(24px)", },
    {
      scale: 1,
      opacity: 1,
      rotate: 0,
      filter: "blur(0px)",
      duration: 1,
      ease: "power3.out",
    },
  );
  if (i < ph.length - 1)
    tl2.to(
      p,
      { scale: 0.25, opacity: 0, duration: 0.8, ease: "power2.in" },
      "+=.5",
    );
});

// work: horizontal pin, parallax art and scale-in cards (desktop)
ScrollTrigger.matchMedia({
  "(min-width:801px)": () => {
    const tr = $("#track"),
      d = () => tr.scrollWidth - innerWidth;
    const hT = gsap.to(tr, {
      x: () => -d(),
      ease: "none",
      scrollTrigger: {
        trigger: ".work",
        pin: true,
        scrub: 1,
        end: () => "+=" + d(),
        invalidateOnRefresh: true,
        onUpdate: (s) => ($(".wp i").style.transform = `scaleX(${s.progress})`),
      },
    });
    $$(".card").forEach((c) => {
      const a = c.querySelector(".art");
      if (a)
        gsap.fromTo(
          a,
          { xPercent: -12 },
          {
            xPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: c,
              containerAnimation: hT,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      gsap.fromTo(
        c,
        { scale: 0.84 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: c,
            containerAnimation: hT,
            start: "left 92%",
            end: "left 45%",
            scrub: true,
          },
        },
      );
    });
  },
});

// services: stacking panels shrink back as the next one slides over
gsap.from(".svh h2", {
  yPercent: 100,
  opacity: 0,
  duration: 1.1,
  ease: "expo.out",
  scrollTrigger: { trigger: ".svh", start: "top 75%" },
});
const pns = $$(".pn");
pns.forEach((p, i) => {
  if (i < pns.length - 1)
    gsap.to(p.querySelector(".pi"), {
      scale: 0.88,
      opacity: 0.3,
      ease: "none",
      scrollTrigger: {
        trigger: pns[i + 1],
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    });
  gsap.from(p.querySelectorAll(".rv"), {
    y: 90,
    opacity: 0,
    stagger: 0.1,
    duration: 1,
    ease: "power4.out",
    scrollTrigger: { trigger: p, start: "top 55%" },
  });
});

// contact: headline slams in from both sides
gsap.fromTo(
  ".ct .ln:nth-child(1) .c2",
  { xPercent: -45 },
  {
    xPercent: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".ct",
      start: "top bottom",
      end: "top 20%",
      scrub: 1,
    },
  },
);
gsap.fromTo(
  ".ct .ln:nth-child(2) .c2",
  { xPercent: 45 },
  {
    xPercent: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".ct",
      start: "top bottom",
      end: "top 20%",
      scrub: 1,
    },
  },
);
gsap.from(".ct .row", {
  y: 60,
  opacity: 0,
  duration: 1,
  ease: "power4.out",
  scrollTrigger: { trigger: ".ct .row", start: "top 92%" },
});

// orb travels with the story: each section reports its own progress, the render loop blends the positions
[".about", ".st", ".work", ".stack", ".ct"].forEach((sel, i) =>
  ScrollTrigger.create({
    trigger: sel,
    start: "top bottom",
    end: "top 25%",
    onUpdate: (t) => (seg[i] = t.progress),
    onRefresh: (t) => (seg[i] = t.progress),
  }),
);
// theme + section label
[
  [".hero", 0],
  [".about", 1],
  [".st", 2],
  [".work", 3],
  [".stack", 4],
  [".ct", 5],
].forEach(([sel, i]) =>
  ScrollTrigger.create({
    trigger: sel,
    start: "top 50%",
    end: "bottom 50%",
    onToggle: (s) => {
      if (s.isActive) {
        theme(i);
        $("#sec").textContent = NAMES[i];
        navActive(i);
      }
    },
  }),
);
