import {Canvas, useFrame, useThree} from '@react-three/fiber';
import {useTexture, Float} from '@react-three/drei';
import {useRef, useMemo, useEffect, Suspense} from 'react';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────
   GLSL: vertex passthrough
───────────────────────────────────────────────── */
const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/* ─────────────────────────────────────────────────
   GLSL: LED wave-transition fragment shader

   Effect pipeline:
   1. Radial wave sweeps from mask center outward
   2. Pixels ahead of wave  → show texA (old color)
   3. Pixels behind wave    → show texB (new color)
   4. Pixels AT wave front  → emissive pulse (peak glow)
   5. LED pixels (bright+saturated) react strongest
   6. Micro-flicker adds organic texture at the front
───────────────────────────────────────────────── */
const FRAG = /* glsl */ `
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform float uProgress;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying vec2 vUv;

  /* Deterministic pseudo-random for organic flicker */
  float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  /* Soft noise for gentle variation */
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = rand(i);
    float b = rand(i + vec2(1.0, 0.0));
    float c = rand(i + vec2(0.0, 1.0));
    float d = rand(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  /* Detect LED pixels: bright + saturated areas of the mask */
  float detectLED(vec3 c, float alpha) {
    if (alpha < 0.05) return 0.0;
    float lum    = dot(c, vec3(0.299, 0.587, 0.114));
    float maxC   = max(c.r, max(c.g, c.b));
    float minC   = min(c.r, min(c.g, c.b));
    float chroma = maxC - minC;
    /* Colored LEDs: moderately bright + colorful */
    float colorLED = smoothstep(0.22, 0.65, lum) * smoothstep(0.1, 0.42, chroma);
    /* Bright-white LEDs: very high luminance regardless of chroma */
    float whiteLED = smoothstep(0.72, 0.96, lum) * 0.55;
    return max(colorLED, whiteLED);
  }

  void main() {
    vec2 uv = vUv;

    /* Radial distance from mask center (normalized so corners ≈ 1) */
    vec2 center = vec2(0.5, 0.50);
    float dist   = length((uv - center) * vec2(1.0, 1.05)) * 1.38;

    /* Wave radius expands from 0 → 1.15 over the full progress */
    float waveR = uProgress * 1.15;

    /* How far past this pixel the wave has travelled
       +ve → wave has passed → show texB
       -ve → wave not yet reached → show texA          */
    float wavePass = waveR - dist;

    /* Soft blend zone around wave front (±0.10 units) */
    float blend = smoothstep(-0.10, 0.10, wavePass);

    /* Sample both textures */
    vec4 colA = texture2D(uTexA, uv);
    vec4 colB = texture2D(uTexB, uv);

    /* LED strength in each frame, alpha-gated */
    float ledA   = detectLED(colA.rgb, colA.a);
    float ledB   = detectLED(colB.rgb, colB.a);
    float ledMix = mix(ledA, ledB, blend);

    /* Base blend */
    vec4 base = mix(colA, colB, blend);

    /* ── Emissive pulse exactly at wave front ──
       exp decay: sharp spike at wavePass=0, fades either side */
    float frontProx = exp(-abs(wavePass) * 16.0) * ledMix;

    /* Energy pulse color = midpoint between old and new */
    vec3 pulseCol = mix(uColorA, uColorB, 0.5) * 1.4;

    /* Brighten LED pixels at wave front */
    base.rgb += pulseCol * frontProx * 0.7;

    /* ── Secondary ripple ── faint echo ring behind front */
    float echo     = exp(-abs(wavePass + 0.18) * 22.0) * ledMix * 0.28;
    base.rgb      += mix(uColorA, uColorB, blend) * echo;

    /* ── Micro flicker ── organic texture at pulse peak */
    float flickerSeed = noise(uv * 6.0 + uTime * 0.18);
    float flicker     = (flickerSeed - 0.5) * 0.04 * frontProx;
    base.rgb         += flicker;

    /* ── Ambient LED glow ── subtle always-on emissive tint */
    float ambientLED = ledMix * 0.06;
    base.rgb        += mix(uColorA, uColorB, blend) * ambientLED;

    /* Preserve source alpha for mask silhouette transparency */
    float alpha = mix(colA.a, colB.a, blend);

    gl_FragColor = vec4(base.rgb, alpha);
  }
`;

/* ─────────────────────────────────────────────────
   Mask plane — loads textures, drives shader
───────────────────────────────────────────────── */
function MaskPlane({slides, activeIdx, prevIdx, progressRef, mouseRef}) {
  const matRef  = useRef();
  const meshRef = useRef();

  /* Load all 7 textures upfront so transitions are instant */
  const textures = useTexture(slides.map((s) => s.image));

  /* Uniforms object — stable across renders */
  const uniforms = useMemo(
    () => ({
      uTexA:     {value: null},
      uTexB:     {value: null},
      uProgress: {value: 0},
      uTime:     {value: 0},
      uColorA:   {value: new THREE.Color()},
      uColorB:   {value: new THREE.Color()},
    }),
    [],
  );

  /* Sync texture + color uniforms when slide indices change */
  useEffect(() => {
    if (!matRef.current) return;
    uniforms.uTexA.value = textures[prevIdx];
    uniforms.uTexB.value = textures[activeIdx];
    uniforms.uColorA.value.set(slides[prevIdx].color);
    uniforms.uColorB.value.set(slides[activeIdx].color);
    matRef.current.uniformsNeedUpdate = true;
  }, [activeIdx, prevIdx, textures, slides, uniforms]);

  /* rAF loop: read progressRef + mouse → update shader + 3D tilt */
  useFrame(({clock}) => {
    if (!matRef.current || !meshRef.current) return;

    /* Drive shader progress from shared ref (set by parent RAF) */
    uniforms.uProgress.value = progressRef.current;
    uniforms.uTime.value     = clock.getElapsedTime();

    /* Buttery-smooth mouse-reactive tilt */
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    meshRef.current.rotation.y +=
      (mx * 0.14 - meshRef.current.rotation.y) * 0.045;
    meshRef.current.rotation.x +=
      (-my * 0.09 - meshRef.current.rotation.x) * 0.045;
  });

  return (
    <mesh ref={meshRef} scale={[2.9, 2.9, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

/* Suspense fallback — plain image while textures load */
function FallbackImage({src, alt}) {
  return (
    <mesh scale={[2.9, 2.9, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────
   Public export — drop-in Canvas replacement for
   the mask <img> in LightTherapySection
───────────────────────────────────────────────── */
export function LEDMaskCanvas({slides, activeIdx, prevIdx, progressRef, mouseRef}) {
  return (
    <Canvas
      camera={{position: [0, 0, 3.6], fov: 38}}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false,
      }}
      dpr={[1, 1.5]}
      style={{width: '100%', height: '100%', display: 'block'}}
      flat
    >
      {/* Minimal lighting — shader handles its own emissive */}
      <ambientLight intensity={0.6} />

      <Suspense fallback={<FallbackImage src={slides[activeIdx].image} />}>
        {/* Drei Float: idle float + subtle tilt */}
        <Float
          speed={1.3}
          floatIntensity={0.35}
          rotationIntensity={0.04}
          floatingRange={[-0.06, 0.06]}
        >
          <MaskPlane
            slides={slides}
            activeIdx={activeIdx}
            prevIdx={prevIdx}
            progressRef={progressRef}
            mouseRef={mouseRef}
          />
        </Float>
      </Suspense>
    </Canvas>
  );
}
