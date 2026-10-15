/* The living atmosphere (Concept A6).

   A slow, domain-warped field of light over the paper, drawn by WebGL into a small canvas (about a
   quarter of the screen's resolution: the field is soft by nature, and the browser's upscale
   costs nothing in quality). The colours are the palette's seven proven pigments, read from the
   page's tokens, and they are mixed with the paper in linear light: every pixel is a convex blend
   of the paper and pigments that each keep 7:1 for ink, so no blend is ever darker than the
   darkest pigment. Light only ever brightens it.

   The field moves on its own (seconds, not scroll), parts gently around a mouse pointer, and
   drifts upward a little as the page scrolls, slower than the content, so it reads as far away.

   Costs and courtesy: at most 30 frames a second; nothing is drawn while the tab is hidden or
   while a deep band covers the whole viewport; under reduced motion one still frame is drawn and
   the pointer is ignored. The only output is the canvas: no style is written anywhere, so the
   document is never invalidated. Without WebGL the static gradients beneath it remain. */

const VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uPointer;
uniform float uScroll;
uniform vec3 uPaper;
uniform vec3 uCol[7];
uniform vec4 uOrb[7];
uniform vec4 uPath[7];
uniform float uCover;
uniform vec3 uClear;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*vnoise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
vec3 toSrgb(vec3 c){return mix(c*12.92,1.055*pow(c,vec3(1./2.4))-.055,step(.0031308,c));}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  float asp=uRes.x/uRes.y;
  vec2 p=vec2((uv.x-.5)*asp,uv.y-.5-uScroll*.32);
  float t=uTime;
  vec2 q=vec2(fbm(p*1.1+vec2(0.,t*.021)),fbm(p*1.1+vec2(5.2,-t*.017)));
  vec2 r=vec2(fbm(p*1.5+2.4*q+vec2(1.7,9.2)+t*.012),fbm(p*1.5+2.4*q+vec2(8.3,2.8)-t*.014));
  vec2 w=p+.58*(r-.5);
  vec2 pp=vec2((uPointer.x-.5)*asp,uPointer.y-.5);
  vec2 d=w-pp;
  float near=exp(-dot(d,d)*6.5)*uPointer.z;
  w+=d*near*.42;
  vec3 acc=vec3(0.);float tot=0.;
  for(int i=0;i<7;i++){
    float fi=float(i);
    vec2 c=uOrb[i].xy+uPath[i].xy*vec2(sin(t*uPath[i].z+fi*1.7+uScroll*2.1),cos(t*uPath[i].w+fi*2.3-uScroll*1.3));
    vec2 e=w-c;
    float g=exp(-dot(e,e)/(uOrb[i].z*uOrb[i].z))*uOrb[i].w;
    acc+=uCol[i]*g;tot+=g;
  }
  vec3 tint=acc/max(tot,1e-4);
  float cover=uCover*(1.-exp(-tot*1.7));
  vec2 cl=vec2((uv.x-.5)*asp,uv.y-uClear.y);
  cover*=1.-uClear.z*exp(-dot(cl,cl)/(uClear.x*uClear.x));
  float veil=fbm(w*1.45+vec2(t*.016,-t*.01));
  cover*=.88+.26*smoothstep(.3,.7,veil);
  vec3 col=mix(uPaper,tint,clamp(cover,0.,uCover));
  vec2 ld=normalize(vec2(.8,-.6));
  float band=exp(-pow(dot(p-vec2(sin(t*.013)*.9,cos(t*.009)*.3),ld),2.)/.09);
  col=mix(col,vec3(1.,.992,.975),band*.3);
  col=mix(col,vec3(1.),near*.16);
  gl_FragColor=vec4(toSrgb(col),1.);
}`;

/* Where each pigment lives and how it wanders (x, y in the field's units, radius, weight; then the
   amplitude and frequency of a slow Lissajous path). Warm light above, cool air below, the centre
   kept clear for the words. Pink stays in a far corner, away from the one pink action. */
const LAYOUT: Record<string, [number, number, number, number, number, number, number, number]> = {
  sun: [-.62, .34, .42, 1, .16, .1, .031, .027],
  peach: [.58, .36, .38, .9, .14, .12, .024, .033],
  coral: [.74, -.18, .3, .8, .12, .14, .037, .022],
  sky: [-.7, -.34, .4, 1, .15, .1, .026, .029],
  sage: [.12, -.52, .44, 1, .2, .08, .019, .035],
  leaf: [-.2, -.62, .26, .8, .18, .07, .041, .024],
  rose: [.92, .58, .26, .7, .1, .06, .028, .039],
};

/* The field's tempo: slow enough to read over, quick enough to be seen living (about 5–8 % of a
   patch of sky changes visibly in three seconds; nothing ever jumps). */
const TEMPO = 1.35;

const lin = (c: number) => (c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
const rgb = (hex: string) => { const h = hex.trim().replace('#', ''); return [0, 2, 4].map(i => lin(parseInt(h.slice(i, i + 2), 16) / 255)); };

export function atmosphere(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('canvas');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: 'low-power' });
  if (!gl) return;
  const compile = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
  const vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const at = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(at); gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);
  const U = (n: string) => gl.getUniformLocation(prog, n);
  const u = { res: U('uRes'), time: U('uTime'), pointer: U('uPointer'), scroll: U('uScroll') };

  // The pigments are the palette's own tokens, so the proof in the palette covers what is drawn.
  const css = getComputedStyle(document.documentElement);
  const names = Object.keys(LAYOUT);
  gl.uniform3fv(U('uPaper'), rgb(css.getPropertyValue('--lb-cream') || '#fbf8f1'));
  gl.uniform3fv(U('uCol'), names.flatMap(n => rgb(css.getPropertyValue(`--lb-air-${n}`) || '#fbf8f1')));
  gl.uniform4fv(U('uOrb'), names.flatMap(n => LAYOUT[n].slice(0, 4)));
  gl.uniform4fv(U('uPath'), names.flatMap(n => LAYOUT[n].slice(4)));
  gl.uniform1f(U('uCover'), .92);
  gl.uniform3fv(U('uClear'), [.34, .55, .5]);

  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer: fine)');
  const covers = [...document.querySelectorAll<HTMLElement>('[data-air-cover]')];
  const ptr = { x: .5, y: .55, z: 0, tx: .5, ty: .55, tz: 0, seen: 0 };
  let w = 0, h = 0, raf = 0, last = 0, clock = 37, lastY = -1, covered = false;

  function size() {
    const nw = Math.max(32, Math.round(innerWidth / 4)), nh = Math.max(32, Math.round(innerHeight / 4));
    if (nw === w && nh === h) return;
    w = nw; h = nh; canvas!.width = w; canvas!.height = h;
    gl!.viewport(0, 0, w, h); gl!.uniform2f(u.res, w, h);
  }
  function draw() {
    gl!.uniform1f(u.time, clock);
    gl!.uniform3f(u.pointer, ptr.x, ptr.y, ptr.z);
    gl!.uniform1f(u.scroll, Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)));
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
  }
  function check() {
    // Reading rectangles only when the page has moved; nothing has been written this frame.
    if (scrollY === lastY) return;
    lastY = scrollY;
    covered = covers.some(c => { const r = c.getBoundingClientRect(); return r.top <= 0 && r.bottom >= innerHeight; });
  }
  function tick(now: number) {
    raf = requestAnimationFrame(tick);
    const dt = now - last;
    if (dt < 31) return;
    last = now;
    const step = Math.min(dt, 100) / 1000;
    clock += step * TEMPO;
    const k = 1 - Math.exp(-step / .28);
    ptr.x += (ptr.tx - ptr.x) * k; ptr.y += (ptr.ty - ptr.y) * k;
    if (now - ptr.seen > 2600) ptr.tz = 0;
    ptr.z += (ptr.tz - ptr.z) * (1 - Math.exp(-step / .6));
    check();
    if (!covered) draw();
  }
  const running = () => !!raf;
  function start() { if (!raf && !still.matches && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(tick); } }
  function stop() { cancelAnimationFrame(raf); raf = 0; }
  function mode() {
    stop(); size(); ptr.z = ptr.tz = 0; draw(); start();
    root.dataset.air = still.matches ? 'still' : document.hidden ? 'paused' : 'live';
  }

  addEventListener('resize', () => { size(); if (!running()) draw(); }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); root.dataset.air = still.matches ? 'still' : document.hidden ? 'paused' : 'live'; });
  still.addEventListener('change', mode);
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || !fine.matches || still.matches) return;
    ptr.tx = e.clientX / innerWidth; ptr.ty = 1 - e.clientY / innerHeight; ptr.tz = 1; ptr.seen = performance.now();
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { ptr.tz = 0; });
  mode();
  root.classList.add('is-drawn');
}

const root = document.querySelector<HTMLElement>('[data-air]');
if (root) atmosphere(root);
