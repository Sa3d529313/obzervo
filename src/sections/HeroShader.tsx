import { useEffect, useRef } from 'react'

// Hero background: a column of light rising from the bottom centre (Cantaloupe core,
// Electric Blue fan, Midnight Black above), seen through vertical ribbed glass.
// Plain WebGL — one fullscreen triangle, no three.js needed.

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uRibPx;
uniform vec2 uMouse;

const vec3 INK = vec3(0.008, 0.027, 0.039);       // #02070A
const vec3 NAVY = vec3(0.02, 0.06, 0.13);         // first hint of blue out of the black
const vec3 DEEP = vec3(0.012, 0.22, 0.45);        // mid blue, where black has turned
const vec3 BLUE = vec3(0.008, 0.592, 0.871);      // #0297DE
const vec3 LAVENDER = vec3(0.55, 0.5, 0.85);      // blue lit by the orange below
const vec3 ROSE = vec3(0.86, 0.42, 0.6);          // the pink seam between blue and orange
const vec3 ORANGE = vec3(0.988, 0.451, 0.302);    // #FC734D
const vec3 EMBER = vec3(0.93, 0.33, 0.24);        // deeper orange at the bottom centre
const vec3 PEACH = vec3(1.0, 0.85, 0.76);         // soft glow at the arch's crown

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main() {
  // All shapes are laid out in screen fractions (0..1 across, 0..1 up), so the
  // composition matches the reference on any screen shape.
  vec2 uv = gl_FragCoord.xy / uRes;

  // Ribbed glass: each rib is a cylinder lens that samples the scene a little to the side.
  float f = fract(gl_FragCoord.x / uRibPx) - 0.5;
  vec2 s = uv;
  s.x += f * (uRibPx / uRes.x) * 2.6;

  // Slow organic drift on the edges; small enough that the silhouette stays put.
  float t = uTime * 0.05;
  float n1 = fbm(vec2(s.x * 3.0, s.y * 2.0 - t)) - 0.5;
  float n2 = fbm(vec2(s.x * 2.0 + 7.0, s.y * 1.5 - t * 0.7)) - 0.5;
  float x = s.x - 0.5 - uMouse.x * 0.02 + n1 * 0.035;
  float y = s.y + n2 * 0.04;
  float breathe = 0.98 + 0.02 * sin(uTime * 0.35);

  // Shape: a curved capital "A" pointing up. Each colour band is bounded by
  // |x| < w(y) with w(y) = base · (1 − y/height)^k and k > 1, so the sides are concave —
  // they flare out to the screen edges at the bottom and sweep in to a thin tip
  // (an Eiffel-tower silhouette rather than a dome). y counts up from the bottom.

  // The whole composition is stretched upward from the floor: it sits higher on the
  // screen and is taller, while the wide base still fills the card row at the bottom.
  float LIFT = 1.22;
  float ys = y / LIFT;

  // Blue: flares past both edges at the floor, tip at the very top of the hero.
  float wB = 0.95 * pow(max(1.0 - ys / (1.08 * breathe), 0.0), 1.55) + 0.004;
  float dB = abs(x) / wB;
  float blue = (1.0 - smoothstep(0.35, 1.25, dB)) * smoothstep(1.0, 0.6, y); // keep a dark band under the nav
  vec3 col = INK;
  col = mix(col, NAVY, smoothstep(0.0, 0.3, blue));
  col = mix(col, DEEP, smoothstep(0.15, 0.6, blue));
  col = mix(col, BLUE, smoothstep(0.5, 1.0, blue) * 0.85);

  // Orange: also flares past the edges at the floor (a touch narrower than the blue),
  // then sweeps inward to a tip just under the subtitle.
  float wO = 0.7 * pow(max(1.0 - ys / (0.62 * breathe), 0.0), 1.9) + 0.003;
  float dO = abs(x) / wO;
  float yFade = smoothstep(0.62, 0.32, ys);
  float lav = (1.0 - smoothstep(1.0, 2.2, dO)) * smoothstep(0.7, 0.3, ys); // lavender wash beside it
  float rim = (1.0 - smoothstep(0.75, 1.45, dO)) * smoothstep(0.66, 0.3, ys); // pink seam
  float orange = (1.0 - smoothstep(0.45, 1.05, dO)) * yFade;
  col = mix(col, LAVENDER, lav * 0.25);
  col = mix(col, ROSE, rim * 0.8);
  col = mix(col, ORANGE, orange);
  col = mix(col, EMBER, (1.0 - smoothstep(0.0, 0.7, dO)) * smoothstep(0.35, 0.0, ys) * 0.45);

  // Soft peach glow where the two curves meet near the tip.
  float glow = exp(-(pow(x / 0.05, 2.0) + pow((ys - 0.4) / 0.08, 2.0)));
  col = mix(col, PEACH, glow * 0.5);

  // Faint light beam rising through the headline.
  float beam = exp(-pow(x / 0.01, 2.0)) * smoothstep(0.4, 0.8, y) * (1.0 - smoothstep(0.82, 0.97, y));
  col += BLUE * 0.18 * beam;

  // Rib shading: bright leading edge, soft shadow at the seam.
  float edge = smoothstep(0.5, 0.4, abs(f));
  col *= mix(0.88, 1.0, edge);
  col *= 1.0 + (0.5 - abs(f + 0.18)) * 0.18;

  // Film grain.
  col += (hash(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5) * 0.035;

  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? 'shader error')
  return sh
}

export function HeroShader({ running }: { running: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const live = useRef(running)
  live.current = running

  useEffect(() => {
    const el = canvas.current!
    const gl = el.getContext('webgl', { antialias: false, premultipliedAlpha: false })
    if (!gl) return

    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uRib = gl.getUniformLocation(prog, 'uRibPx')
    const uMouse = gl.getUniformLocation(prog, 'uMouse')

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const resize = () => {
      el.width = Math.round(el.clientWidth * dpr)
      el.height = Math.round(el.clientHeight * dpr)
      gl.viewport(0, 0, el.width, el.height)
      gl.uniform2f(uRes, el.width, el.height)
      gl.uniform1f(uRib, (el.clientWidth < 700 ? 8 : 11) * dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth - 0.5
      mouse.ty = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('pointermove', onMove)

    // Only render while the hero is on screen.
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(el)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = performance.now()
    let raf = 0
    let drawn = false
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      // Behind the preloader it holds its first frame, leaving the GPU to the loading animation.
      if (!visible || (!live.current && drawn)) return
      drawn = true
      mouse.x += (mouse.tx - mouse.x) * 0.04
      mouse.y += (mouse.ty - mouse.y) * 0.04
      gl.uniform1f(uTime, reduce ? 8 : (now - start) / 1000)
      gl.uniform2f(uMouse, mouse.x, mouse.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={canvas} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}
