/* js/render-loop.js
   The single requestAnimationFrame loop (3D scene + hero effects).
   (classic script: shares one global scope with the other files, so keep the load order from index.html) */

/* render loop */
function frame(t){
  requestAnimationFrame(frame);
  const s=t/1000;sm.x+=(px/innerWidth-sm.x)*.05;sm.y+=(py/innerHeight-sm.y)*.05;vel*=.92;
  if(heavyOn){
    {let i=0;while(i<4&&seg[i]>=1)i++;const p=S[i],q=S[i+1],k=seg[i];G.position.x+=(p.x+(q.x-p.x)*k-G.position.x)*.12;G.position.y+=(p.y+(q.y-p.y)*k-G.position.y)*.12;G.scale.setScalar(G.scale.x+(p.s+(q.s-p.s)*k-G.scale.x)*.12)}
    BU.uTime.value=s;blob.rotation.y=s/4+(sm.x-.5)*1.4;blob.rotation.x=(sm.y-.5)*.9;
    
    stars.rotation.y=s*.02+scrollY*.0003;camB.position.x=(sm.x-.5)*.6;camB.position.y=-(sm.y-.5)*.4;camB.lookAt(0,0,0);
    renderer.clear();
    if(BG.uAlpha.value>.01){const lv=t-last<2500,tx=lv?px/innerWidth:.5+.3*Math.sin(s*.45),ty=lv?1-py/innerHeight:.5+.22*Math.sin(s*.7+1);
      bm.x+=(tx-bm.x)*.08;bm.y+=(ty-bm.y)*.08;BG.uMouse.value.set(bm.x,bm.y);BG.uTime.value=s;renderer.render(bgS,bgC);renderer.clearDepth()}
    renderer.render(sceneB,camB);
    if(heroOn&&!reduce)stks.forEach(e=>{const d=+e.dataset.d;e.style.translate=`${(sm.x-.5)*d*60}px ${(sm.y-.5)*d*60}px`});
    if(heroOn&&!reduce){const live=t-last<2500;
      chs.forEach((el,i)=>{let k;
        if(live){const r=el.getBoundingClientRect();k=Math.max(0,1-Math.hypot(r.left+r.width/2-px,r.top+r.height/2-py)/300);k*=k*(3-2*k)}
        else k=(Math.sin(t/650-i*.45)+1)/2*.7;
        const q=st[i];q.w+=(300+k*WK-q.w)*.12;q.x+=(75+k*XK-q.x)*.12;
        const fv=`"wght" ${q.w|0},"wdth" ${q.x|0}`;el.style.fontVariationSettings=fv;const m=mirror.get(el);if(m)m.style.fontVariationSettings=fv});
      const lr=lensLn.getBoundingClientRect(),tx=live?px-lr.left:lr.width*(.5+.38*Math.sin(s*.7)),ty=live?py-lr.top:lr.height*(.5+.12*Math.sin(s*1.3)),tr=live?170:120;
      L.x+=(tx-L.x)*.18;L.y+=(ty-L.y)*.18;L.r+=(tr-L.r)*.1;
      lensTop.style.setProperty("--mx",L.x+"px");lensTop.style.setProperty("--my",L.y+"px");lensTop.style.setProperty("--r",L.r+"px")}
  }
  if(!reduce)drawTrail()}
requestAnimationFrame(frame);
