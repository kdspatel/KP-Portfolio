// /* js/webgl.js
//    Three.js scene: liquid orb, hero contour-map shader, stars, orb positions per section, per-section colour themes.
//    (classic script: shares one global scope with the other files, so keep the load order from index.html) */

// /* WebGL: liquid orb + rings + star field (transparent, sits over the page colour) */
// let heavyOn = false; // switched on by loader.js when the reveal starts (the render loop only draws after that)
// const renderer = new THREE.WebGLRenderer({
//   canvas: $("#gl"),
//   alpha: true,
//   antialias: true,
// });
// renderer.setPixelRatio(
//   Math.min(devicePixelRatio, innerWidth < 800 ? 1.25 : 1.75),
// );
// const mob = innerWidth < 800,
//   sceneB = new THREE.Scene(),
//   camB = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 60);
// camB.position.z = 6;
// const BU = {
//   uTime: { value: 0 },
//   uA: { value: new THREE.Color() },
//   uB: { value: new THREE.Color() },
// };
// const blob = new THREE.Mesh(
//   new THREE.IcosahedronGeometry(1.5, innerWidth < 800 ? 30 : 48),
//   new THREE.ShaderMaterial({
//     uniforms: BU,
//     vertexShader: `uniform float uTime;varying vec3 vN,vP;varying float vK;
// float d(vec3 p){return sin(p.x*2.1+uTime*.9)*sin(p.y*2.4-uTime*.7)*sin(p.z*2.+uTime*.8);}
// void main(){vec3 p=position;float k=d(p)*.34+sin(p.y*5.+uTime*1.3)*.04;vK=k;p+=normal*k;vN=normalize(normalMatrix*normal);vP=(modelViewMatrix*vec4(p,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
//     fragmentShader: `uniform vec3 uA,uB;varying vec3 vN,vP;varying float vK;
// void main(){vec3 n=normalize(vN),v=normalize(-vP);float f=pow(1.-max(dot(n,v),0.),2.4);
// vec3 c=mix(uA,uB,clamp(n.y*.5+.5+vK*1.5,0.,1.));c=c*.85+f*vec3(1.)*.55;gl_FragColor=vec4(c,1.);}`,
//   }),
// );
// const G = new THREE.Group();
// G.add(blob);
// sceneB.add(G);
// renderer.autoClear = false;
// /* hero background: living contour-map shader that bends around the cursor */
// const bgS = new THREE.Scene(),
//   bgC = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
//   bm = { x: 0.5, y: 0.5 };
// const BG = {
//   uTime: { value: 0 },
//   uAlpha: { value: 1 },
//   uRes: { value: new THREE.Vector2(1, 1) },
//   uMouse: { value: new THREE.Vector2(0.5, 0.5) },
//   uBg: { value: new THREE.Color() },
//   uA: { value: new THREE.Color() },
//   uB: { value: new THREE.Color() },
// };
// bgS.add(
//   new THREE.Mesh(
//     new THREE.PlaneGeometry(2, 2),
//     new THREE.ShaderMaterial({
//       uniforms: BG,
//       transparent: true,
//       depthTest: false,
//       depthWrite: false,
//       vertexShader: "void main(){gl_Position=vec4(position.xy,0.,1.);}",
//       fragmentShader: `uniform float uTime,uAlpha;uniform vec2 uRes,uMouse;uniform vec3 uBg,uA,uB;
// float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
// float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
// float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
// void main(){
//  vec2 uv=gl_FragCoord.xy/uRes,asp=vec2(uRes.x/uRes.y,1.);
//  vec2 p=(uv-.5)*asp*2.,m=(uMouse-.5)*asp*2.;
//  float md=length(p-m),t=uTime*.1,g=exp(-md*2.4);
//  vec2 q=vec2(fbm(p*1.3+t),fbm(p*1.3+vec2(4.,2.)-t));
//  float f=fbm(p*1.15+q*1.9+(p-m)*g*.7);
//  float c=abs(fract(f*11.)-.5),line=1.-smoothstep(.0,.07,c);
//  vec3 col=uBg*(.8+.35*f);
//  col=mix(col,vec3(1.),line*(.16+g*.2));
//  col+=mix(uB,uA,f)*g*.45;
//  col=mix(col,uA,line*g*.85);
//  col*=1.-.3*length(uv-.5);
//  gl_FragColor=vec4(col,uAlpha);}`,
//     }),
//   ),
// );
// const sp = new Float32Array(420 * 3);
// for (let i = 0; i < 420; i++)
//   sp.set(
//     [
//       (Math.random() - 0.5) * 16,
//       (Math.random() - 0.5) * 10,
//       (Math.random() - 0.5) * 8 - 1,
//     ],
//     i * 3,
//   );
// const sg = new THREE.BufferGeometry();
// sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
// const starM = new THREE.PointsMaterial({
//     color: 0xffffff,
//     size: 0.035,
//     transparent: true,
//     opacity: 0.7,
//   }),
//   stars = new THREE.Points(sg, starM);
// sceneB.add(stars);
// const seg = [0, 0, 0, 0, 0];
// let S = [];
// function buildS() {
//   const m = innerWidth < 800,
//     hw = Math.tan((20 * Math.PI) / 180) * 6 * (innerWidth / innerHeight);
//   S = [
//     { x: hw - (m ? 0.7 : 1.2), y: m ? 1.3 : -0.5, s: m ? 0.8 : 1.2 },
//     { x: m ? 0 : -2.7, y: m ? -1.5 : 0, s: 1.1 },
//     { x: 0, y: 0, s: 3 },
//     { x: m ? 0 : 3.4, y: m ? 1.8 : 1.5, s: 0.55 },
//     { x: 0, y: 0, s: 0.5 },
//     { x: 0, y: -0.5, s: 1.5 },
//   ];
// }
// buildS();
// addEventListener("resize", buildS);
// G.position.set(S[0].x, S[0].y, 0);
// G.scale.setScalar(S[0].s);
// function size() {
//   camB.aspect = innerWidth / innerHeight;
//   camB.updateProjectionMatrix();
//   renderer.setSize(innerWidth, innerHeight, false);
//   const pr = renderer.getPixelRatio();
//   BG.uRes.value.set(innerWidth * pr, innerHeight * pr);
// }
// size();
// addEventListener("resize", size);

// /* colour themes per section: page colour, text colour and orb colours all morph together */
// const TH = [
//   ["#1a24ff", "#fff6e8", "#ffe14a", "#ff5fa2"],
//   ["#fff6e8", "#0b0b1a", "#1a24ff", "#ff5fa2"],
//   ["#0b0b1a", "#fff6e8", "#ffe14a", "#1a24ff"],
//   ["#ffe14a", "#0b0b1a", "#1a24ff", "#ff5fa2"],
//   ["#0b0b1a", "#fff6e8", "#ff5fa2", "#ffe14a"],
//   ["#ff5fa2", "#0b0b1a", "#fff6e8", "#1a24ff"],
// ].map((a) => a.map((h) => new THREE.Color(h)));
// const cur = TH[0].map((c) => c.clone()),
//   tp = { k: 1 };
// let from = [];
// function apply() {
//   const r = document.documentElement.style;
//   r.setProperty("--bg", "#" + cur[0].getHexString());
//   r.setProperty("--ink", "#" + cur[1].getHexString());
//   BU.uA.value.copy(cur[2]);
//   BU.uB.value.copy(cur[3]);
//   BG.uBg.value.copy(cur[0]);
//   BG.uA.value.copy(cur[2]);
//   BG.uB.value.copy(cur[3]);
//   starM.color.copy(cur[1]);
// }
// function theme(i) {
//   from = cur.map((c) => c.clone());
//   gsap.killTweensOf(tp);
//   tp.k = 0;
//   gsap.to(tp, {
//     k: 1,
//     duration: 0.8,
//     ease: "power2.out",
//     onUpdate() {
//       cur.forEach((c, j) => c.copy(from[j]).lerp(TH[i][j], tp.k));
//       apply();
//     },
//   });
// }
// apply();

/* js/webgl.js
   Three.js scene: liquid orb, hero contour-map shader, stars, orb positions per section, per-section colour themes.
   (classic script: shares one global scope with the other files, so keep the load order from index.html) */

/* WebGL: liquid orb + rings + star field (transparent, sits over the page colour) */
let heavyOn = false; // switched on by loader.js when the reveal starts (the render loop only draws after that)
const renderer = new THREE.WebGLRenderer({
  canvas: $("#gl"),
  alpha: true,
  antialias: true,
});
renderer.setPixelRatio(
  Math.min(devicePixelRatio, innerWidth < 800 ? 1.25 : 1.75),
);
const mob = innerWidth < 800,
  sceneB = new THREE.Scene(),
  camB = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 60);
camB.position.z = 6;
const BU = {
  uTime: { value: 0 },
  uA: { value: new THREE.Color() },
  uB: { value: new THREE.Color() },
};
const blob = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.5, innerWidth < 800 ? 30 : 48),
  new THREE.ShaderMaterial({
    uniforms: BU,
    vertexShader: `uniform float uTime;varying vec3 vN,vP;varying float vK;
float d(vec3 p){return sin(p.x*2.1+uTime*.9)*sin(p.y*2.4-uTime*.7)*sin(p.z*2.+uTime*.8);}
void main(){vec3 p=position;float k=d(p)*.34+sin(p.y*5.+uTime*1.3)*.04;vK=k;p+=normal*k;vN=normalize(normalMatrix*normal);vP=(modelViewMatrix*vec4(p,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
    fragmentShader: `uniform vec3 uA,uB;varying vec3 vN,vP;varying float vK;
void main(){vec3 n=normalize(vN),v=normalize(-vP);float f=pow(1.-max(dot(n,v),0.),2.4);
vec3 c=mix(uA,uB,clamp(n.y*.5+.5+vK*1.5,0.,1.));c=c*.85+f*vec3(1.)*.55;gl_FragColor=vec4(c,1.);}`,
  }),
);
const G = new THREE.Group();
G.add(blob);
sceneB.add(G);
renderer.autoClear = false;
/* hero background: living contour-map shader that bends around the cursor */
const bgS = new THREE.Scene(),
  bgC = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
  bm = { x: 0.5, y: 0.5 };
const BG = {
  uTime: { value: 0 },
  uAlpha: { value: 1 },
  uRes: { value: new THREE.Vector2(1, 1) },
  uMouse: { value: new THREE.Vector2(0.5, 0.5) },
  uBg: { value: new THREE.Color() },
  uA: { value: new THREE.Color() },
  uB: { value: new THREE.Color() },
};
bgS.add(
  new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      uniforms: BG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      vertexShader: "void main(){gl_Position=vec4(position.xy,0.,1.);}",
      fragmentShader: `uniform float uTime,uAlpha;uniform vec2 uRes,uMouse;uniform vec3 uBg,uA,uB;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/uRes,asp=vec2(uRes.x/uRes.y,1.);
 vec2 p=(uv-.5)*asp*2.,m=(uMouse-.5)*asp*2.;
 float md=length(p-m),t=uTime*.1,g=exp(-md*2.4);
 vec2 q=vec2(fbm(p*1.3+t),fbm(p*1.3+vec2(4.,2.)-t));
 float f=fbm(p*1.15+q*1.9+(p-m)*g*.7);
 float c=abs(fract(f*11.)-.5),line=1.-smoothstep(.0,.07,c);
 vec3 col=uBg*(.8+.35*f);
 col=mix(col,vec3(1.),line*(.16+g*.2));
 col+=mix(uB,uA,f)*g*.45;
 col=mix(col,uA,line*g*.85);
 col*=1.-.3*length(uv-.5);
 gl_FragColor=vec4(col,uAlpha);}`,
    }),
  ),
);
const sp = new Float32Array(420 * 3);
for (let i = 0; i < 420; i++)
  sp.set(
    [
      (Math.random() - 0.5) * 16,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 8 - 1,
    ],
    i * 3,
  );
const sg = new THREE.BufferGeometry();
sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
const starM = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.035,
    transparent: true,
    opacity: 0.7,
  }),
  stars = new THREE.Points(sg, starM);
sceneB.add(stars);
const seg = [0, 0, 0, 0, 0];
let S = [];
function buildS() {
  const m = innerWidth < 800,
    hw = Math.tan((20 * Math.PI) / 180) * 6 * (innerWidth / innerHeight);
  S = [
    { x: hw - (m ? 0.7 : 1.2), y: m ? 1.3 : -0.5, s: m ? 0.8 : 1.2 },
    { x: m ? 0 : -2.7, y: m ? -1.5 : 0, s: 1.1 },
    { x: 0, y: 0, s: 3 },
    { x: m ? 0 : 3.4, y: m ? 1.8 : 1.5, s: 0.55 },
    { x: 0, y: 0, s: 0.5 },
    { x: 0, y: -0.5, s: 1 },
  ];
}
buildS();
addEventListener("resize", buildS);
G.position.set(S[0].x, S[0].y, 0);
G.scale.setScalar(S[0].s);
function size() {
  camB.aspect = innerWidth / innerHeight;
  camB.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight, false);
  const pr = renderer.getPixelRatio();
  BG.uRes.value.set(innerWidth * pr, innerHeight * pr);
}
size();
addEventListener("resize", size);

/* colour themes per section: page colour, text colour and orb colours all morph together
   each theme = [page background, text + star particles, jelly bottom colour, jelly top colour]
   the LAST theme is the contact section: black page, white text and particles, pink + yellow jelly */
const TH = [
  ["#1a24ff", "#fff6e8", "#ffe14a", "#ff5fa2"],
  ["#fff6e8", "#0b0b1a", "#1a24ff", "#ff5fa2"],
  ["#0b0b1a", "#fff6e8", "#ffe14a", "#1a24ff"],
  ["#ffe14a", "#0b0b1a", "#1a24ff", "#ff5fa2"],
  ["#0b0b1a", "#fff6e8", "#ff5fa2", "#ffe14a"],
  ["#000000", "#ffffff", "#ff5fa2", "#ffe14a"],
].map((a) => a.map((h) => new THREE.Color(h)));
const cur = TH[0].map((c) => c.clone()),
  tp = { k: 1 };
let from = [];
function apply() {
  const r = document.documentElement.style;
  r.setProperty("--bg", "#" + cur[0].getHexString());
  r.setProperty("--ink", "#" + cur[1].getHexString());
  BU.uA.value.copy(cur[2]);
  BU.uB.value.copy(cur[3]);
  BG.uBg.value.copy(cur[0]);
  BG.uA.value.copy(cur[2]);
  BG.uB.value.copy(cur[3]);
  starM.color.copy(cur[1]);
}
function theme(i) {
  from = cur.map((c) => c.clone());
  gsap.killTweensOf(tp);
  tp.k = 0;
  gsap.to(tp, {
    k: 1,
    duration: 0.8,
    ease: "power2.out",
    onUpdate() {
      cur.forEach((c, j) => c.copy(from[j]).lerp(TH[i][j], tp.k));
      apply();
    },
  });
}
apply();
