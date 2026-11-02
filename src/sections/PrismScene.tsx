import { useMemo, useRef, type MutableRefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { CENTER, PILLS, PILL_WIDTH } from '../components/Logo'

// The Obzervo mark as three solid glass pills. Same geometry as the SVG logo,
// mapped from SVG artboard units into world space.
const SCALE = 1 / 200

function usePills() {
  return useMemo(
    () =>
      PILLS.map((p) => {
        const dx = p.x2 - p.x1
        const dy = p.y2 - p.y1
        const length = Math.hypot(dx, dy) * SCALE
        return {
          position: new THREE.Vector3(((p.x1 + p.x2) / 2 - CENTER.x) * SCALE, -((p.y1 + p.y2) / 2 - CENTER.y) * SCALE, 0),
          // Capsule geometry runs along Y; rotate it onto the pill's axis.
          rotation: -Math.atan2(dy, dx) + Math.PI / 2,
          length,
        }
      }),
    [],
  )
}

// What the glass "sees" through itself: a neutral grey studio lined with white softboxes.
// Keeps the pills clear and colourless whatever sits behind the canvas.
function useStudioTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 256
    c.height = 512
    const ctx = c.getContext('2d')!
    // Even wall (the texture maps to the screen, so any vertical gradient would make
    // one pill darker than the others depending on where it sits).
    ctx.fillStyle = '#8b949a'
    ctx.fillRect(0, 0, 256, 512)
    // Evenly repeating softbox stripes: the light/dark contrast is what the glass bends and reads as "glass".
    for (let x = 16; x < 256; x += 32) {
      const streak = ctx.createLinearGradient(x - 9, 0, x + 9, 0)
      streak.addColorStop(0, 'rgba(255,255,255,0)')
      streak.addColorStop(0.5, 'rgba(255,255,255,0.95)')
      streak.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = streak
      ctx.fillRect(x - 9, 0, 18, 512)
    }
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

function GlassMark({ progress }: { progress: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null)
  const pills = usePills()
  const studio = useStudioTexture()
  const radius = (PILL_WIDTH / 2) * SCALE

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const p = progress.current
    // Spin in the picture plane (a third of a turn = the mark maps onto itself),
    // with a gentle tilt so the glass catches light. The mark always stays readable.
    const targetZ = -p * ((Math.PI * 2) / 3)
    const targetY = Math.sin(p * Math.PI * 2) * 0.45 + state.pointer.x * 0.3
    const targetX = state.pointer.y * -0.25 + Math.sin(p * Math.PI) * 0.2
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, targetZ, 4, dt)
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 4, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 4, dt)
    // Holds its size while the two statements take turns above it, then grows to centre stage.
    const finale = THREE.MathUtils.smoothstep(p, 0.7, 0.92)
    const s = 0.42 + finale * 0.14
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 4, dt))
  })

  return (
    <group ref={group} scale={0.42}>
      {pills.map((p, i) => (
        <mesh key={i} position={p.position} rotation={[0, 0, p.rotation]} scale={[1, 1, 0.6]}>
          <capsuleGeometry args={[radius, p.length, 24, 48]} />
          <MeshTransmissionMaterial
            background={studio}
            samples={8}
            resolution={512}
            thickness={1.2}
            roughness={0.06}
            transmission={1}
            ior={1.45}
            chromaticAberration={0.05}
            anisotropy={0.1}
            distortion={0.08}
            distortionScale={0.3}
            temporalDistortion={0}
            color="#ffffff"
          />
        </mesh>
      ))}
    </group>
  )
}

export default function PrismScene({ progress, active }: { progress: MutableRefObject<number>; active: boolean }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <GlassMark progress={progress} />
      {/* Neutral white studio lighting only — no coloured light reaches the glass. */}
      <Environment resolution={256}>
        <Lightformer intensity={4.5} position={[0, 4, 3]} scale={[8, 1.5, 1]} form="rect" />
        <Lightformer intensity={2.4} position={[5, 0, 2]} scale={[2, 6, 1]} form="rect" />
        <Lightformer intensity={2.4} position={[-5, -1, 2]} scale={[2, 6, 1]} form="rect" />
        <Lightformer intensity={1.2} position={[0, -4, 4]} scale={[6, 1, 1]} form="ring" />
      </Environment>
    </Canvas>
  )
}
