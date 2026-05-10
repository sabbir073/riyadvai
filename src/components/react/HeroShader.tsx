import { useEffect, useRef } from 'react';

const VERT = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uIntensity;
varying vec2 vUv;

vec3 palette(float t) {
  // brand-tinted: deep navy → cyan → gold tail
  vec3 a = vec3(0.07, 0.09, 0.18);
  vec3 b = vec3(0.20, 0.45, 0.85);
  vec3 c = vec3(0.85, 0.65, 0.30);
  float k1 = smoothstep(0.0, 0.5, t);
  float k2 = smoothstep(0.5, 1.0, t);
  return mix(a, b, k1) + (c - vec3(0.0)) * k2 * 0.35;
}

void main() {
  vec2 uv = vUv;
  vec2 p = (uv * 2.0 - 1.0);
  p.x *= uResolution.x / uResolution.y;

  float t = uTime * 0.06;

  // mouse parallax pulls flow center
  vec2 m = (uMouse - 0.5) * 0.5;
  p -= m;

  // layered domain warp
  for (float i = 1.0; i < 4.0; i++) {
    p.x += 0.45 / i * sin(i * 2.4 * p.y + t * (1.0 + i * 0.1));
    p.y += 0.45 / i * cos(i * 1.6 * p.x + t * (1.2 + i * 0.05));
  }

  float d = length(p);
  float n = 0.5 + 0.5 * sin(d * 3.0 - t * 2.0);
  vec3 col = palette(clamp(n, 0.0, 1.0));

  // soft vignette toward edges
  float vignette = smoothstep(1.4, 0.4, length((uv - 0.5) * vec2(1.5, 1.0)));
  col *= mix(0.45, 1.0, vignette);

  // subtle film grain
  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.025;

  col *= uIntensity;
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function HeroShader({ intensity = 1 }: { intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const ogl = await import('ogl');
      if (cancelled || !ref.current) return;
      const { Renderer, Triangle, Program, Mesh, Vec2 } = ogl;

      const renderer = new Renderer({
        alpha: false,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio, 1.5),
      });
      const gl = renderer.gl;
      gl.clearColor(0.05, 0.07, 0.14, 1);
      ref.current.appendChild(gl.canvas);
      gl.canvas.style.position = 'absolute';
      gl.canvas.style.inset = '0';
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      gl.canvas.style.display = 'block';

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new Vec2(1, 1) },
          uMouse: { value: new Vec2(0.5, 0.5) },
          uIntensity: { value: intensity },
        },
      });
      const mesh = new Mesh(gl, { geometry, program });

      const resize = () => {
        const el = ref.current;
        if (!el) return;
        const { clientWidth: w, clientHeight: h } = el;
        renderer.setSize(w, h);
        program.uniforms.uResolution.value.set(w, h);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(ref.current);

      const onMove = (e: PointerEvent) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        program.uniforms.uMouse.value.set(
          (e.clientX - r.left) / r.width,
          1 - (e.clientY - r.top) / r.height,
        );
      };
      ref.current.addEventListener('pointermove', onMove);

      let raf = 0;
      let running = true;
      const tick = (t: number) => {
        if (!running) return;
        program.uniforms.uTime.value = t * 0.001;
        renderer.render({ scene: mesh });
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      // pause when off-screen
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !running) {
            running = true;
            raf = requestAnimationFrame(tick);
          } else if (!entry.isIntersecting && running) {
            running = false;
            cancelAnimationFrame(raf);
          }
        },
        { threshold: 0.05 },
      );
      io.observe(ref.current);

      cleanup = () => {
        running = false;
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        ref.current?.removeEventListener('pointermove', onMove);
        gl.canvas.remove();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [intensity]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.22 0.08 220 / 0.55), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, oklch(0.7 0.13 60 / 0.18), transparent 50%), oklch(0.13 0.02 250)',
      }}
    />
  );
}
