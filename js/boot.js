/* js/boot.js
   Final ScrollTrigger refresh after everything has loaded.
   (classic script: shares one global scope with the other files, so keep the load order from index.html) */

addEventListener("load",()=>setTimeout(()=>ScrollTrigger.refresh(),400));
