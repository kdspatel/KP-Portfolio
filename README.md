# KP — Creative Developer Portfolio

Plain HTML + CSS + JavaScript (no build step). GSAP + ScrollTrigger, Three.js, Lenis and the
Bricolage Grotesque font are loaded from CDNs, so you need internet.

## Run it
- VS Code: install **Live Server** -> right-click `index.html` -> *Open with Live Server*.
  (Open it through a server, not by double-clicking: the navbar logo uses a CSS mask which browsers block on `file://`.)
- Hostinger: upload **everything inside this folder** (index.html, css/, js/, assets/) into `public_html`.

## Folder structure
```
index.html          page markup (sections are marked with comments)
assets/
  logo.png          KP logo (white, transparent) - used by the navbar
  favicon.svg       browser-tab icon
css/                one file per part of the page
  base.css          colours (variables), reset, shared utilities, shared keyframes
  components.css    tiny pieces used in several sections (tags, status dot)
  ui.css            custom cursor, glow trail, scroll progress bar, section label
  loader.css        loading screen
  navbar.css        floating navbar + mobile menu
  hero.css          hero headline, stickers, chips
  marquee.css       crossing ribbons
  about.css         about paragraph + facts
  statement.css     "Don't just make it work" phrases
  work.css          selected work cards
  services.css      "What I do" cards + their animated illustrations
  contact.css       contact page + footer
js/                 classic scripts that share one scope - KEEP THIS ORDER (it is the order in index.html)
  core.js           helpers, safety checks, GSAP setup, smooth scroll
  webgl.js          Three.js scene, orb, hero background shader, colour themes
  pointer.js        cursor, magnetic buttons, glow trail
  hero.js           hero letters, lens, word slot, clock
  render-loop.js    the one requestAnimationFrame loop
  loader.js         loader particles (KP + circle), blast, reveal
  navbar.js         navbar sliding highlight + mobile menu
  scroll.js         every ScrollTrigger animation
  cards.js          3D tilt on project cards
  contact.js        contact form + India time
  boot.js           final ScrollTrigger refresh
```

## Where to change things
| I want to change...                       | Open                                   |
|-------------------------------------------|----------------------------------------|
| Colours of the whole site                 | `js/webgl.js` -> `TH` array; `css/base.css` -> `:root` |
| Name / hero text / word slot              | `index.html` (HERO section)            |
| Projects (name, tags, colours)            | `index.html` (WORK section)            |
| Services text                             | `index.html` (SERVICES section)        |
| Email, Instagram, LinkedIn, GitHub        | `index.html` (CONTACT + MOBILE MENU) and `js/contact.js` (email in the Gmail link) |
| Logo                                      | replace `assets/logo.png` (white shape on transparent background) |
| Loader speed / blast                      | `js/loader.js`                         |
| Animation speed of a section              | `js/scroll.js`                         |
