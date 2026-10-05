import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { BingoBall } from '../../types/bingo'

interface Balotera3DProps {
  currentBall: BingoBall | null
  isSpinning: boolean
}

export const Balotera3D: React.FC<Balotera3DProps> = ({ currentBall, isSpinning }) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const cageRef = useRef<THREE.Group | null>(null)
  const innerBallsRef = useRef<THREE.Mesh[]>([])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const width = mount.clientWidth || 320
    const height = mount.clientHeight || 260

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 1.2, 5.2)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // Horror Lighting: Creepy Blood Red + Toxic Green
    const ambientLight = new THREE.AmbientLight(0x221111, 1.2)
    scene.add(ambientLight)

    const toxicLight = new THREE.PointLight(0x10b981, 4.5, 12)
    toxicLight.position.set(2, 2.5, 2.5)
    scene.add(toxicLight)

    const bloodLight = new THREE.PointLight(0xef4444, 4.0, 10)
    bloodLight.position.set(-2, -1.5, -2)
    scene.add(bloodLight)

    // Balotera Cage Group
    const cage = new THREE.Group()
    scene.add(cage)
    cageRef.current = cage

    // Rusted Iron Geodesic Sphere
    const sphereGeo = new THREE.IcosahedronGeometry(1.6, 2)
    const wireframe = new THREE.WireframeGeometry(sphereGeo)
    const ironLineMat = new THREE.LineBasicMaterial({
      color: 0x991b1b, // Rusted blood red iron
      transparent: true,
      opacity: 0.9,
    })
    const cageLines = new THREE.LineSegments(wireframe, ironLineMat)
    cage.add(cageLines)

    // Spiked Rings
    const ringGeo = new THREE.TorusGeometry(1.6, 0.05, 12, 48)
    const rustedMat = new THREE.MeshStandardMaterial({
      color: 0x450a0a,
      roughness: 0.8,
      metalness: 0.7,
    })
    const r1 = new THREE.Mesh(ringGeo, rustedMat)
    const r2 = new THREE.Mesh(ringGeo, rustedMat)
    r2.rotation.x = Math.PI / 2
    cage.add(r1)
    cage.add(r2)

    // Bouncing Zombie Balotas Inside
    const ballColors = [0x3b82f6, 0x8b5cf6, 0x10b981, 0xf97316, 0xef4444]
    const balls: THREE.Mesh[] = []
    for (let i = 0; i < 28; i++) {
      const bGeo = new THREE.SphereGeometry(0.24, 16, 16)
      const bMat = new THREE.MeshStandardMaterial({
        color: ballColors[i % ballColors.length],
        roughness: 0.3,
        metalness: 0.5,
      })
      const ball = new THREE.Mesh(bGeo, bMat)
      const r = 1.1 * Math.cbrt(Math.random())
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(2 * Math.random() - 1)
      ball.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      )
      cage.add(ball)
      balls.push(ball)
    }
    innerBallsRef.current = balls

    // Tombstone Base
    const baseGeo = new THREE.CylinderGeometry(0.4, 0.9, 1.8, 16)
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.9 })
    const base = new THREE.Mesh(baseGeo, baseMat)
    base.position.set(0, -2.1, 0)
    scene.add(base)

    let reqId: number
    const clock = new THREE.Clock()

    const animate = () => {
      reqId = requestAnimationFrame(animate)
      const delta = clock.getDelta()

      if (cageRef.current) {
        const speed = isSpinning ? 15 : 0.9
        cageRef.current.rotation.y += speed * delta
        cageRef.current.rotation.x += (speed * 0.35) * delta

        if (isSpinning) {
          innerBallsRef.current.forEach((b) => {
            b.position.x += (Math.random() - 0.5) * 0.09
            b.position.y += (Math.random() - 0.5) * 0.09
            b.position.z += (Math.random() - 0.5) * 0.09
            if (b.position.length() > 1.25) {
              b.position.setLength(1.1)
            }
          })
        }
      }

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(reqId)
      renderer.dispose()
      sphereGeo.dispose()
      ironLineMat.dispose()
      ringGeo.dispose()
      rustedMat.dispose()
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [isSpinning])

  return (
    <div className="relative flex flex-col items-center justify-center p-3.5 rounded-3xl bg-black/80 backdrop-blur-md w-full max-w-sm mx-auto shadow-2xl border-2 border-red-950">
      <div className="absolute top-3 left-4 flex items-center gap-2 z-10">
        <span className="text-xl">⚰️</span>
        <span className="text-sm font-horror tracking-wider text-amber-400">
          {isSpinning ? 'Girando Balotera Zombie...' : 'Balotera Maldita 3D'}
        </span>
      </div>

      <div ref={mountRef} className="w-full h-56 cursor-grab active:cursor-grabbing" />

      {/* Extracted Ball Presentation */}
      <div className="w-full mt-2 pt-2 border-t border-red-950 flex items-center justify-between px-2">
        <div className="text-xs font-horror text-slate-400 text-sm">
          Última balota:
        </div>
        {currentBall ? (
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center w-11 h-11 rounded-full font-horror text-2xl text-white shadow-[0_0_15px_rgba(255,255,255,0.4)] border-2 border-white/60 animate-stamp"
              style={{ backgroundColor: currentBall.color }}
            >
              {currentBall.letter}
            </span>
            <span className="text-3xl font-horror text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {currentBall.number}
            </span>
          </div>
        ) : (
          <span className="text-xs font-horror text-red-500 italic">En espera de extracción</span>
        )}
      </div>
    </div>
  )
}
