import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { BingoBall } from '../../types/bingo'

interface Balotera3DProps {
  currentBall: BingoBall | null
  isSpinning: boolean
  onSpinEnd?: () => void
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

    // Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 1.2, 5.2)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    mount.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x10b981, 3.5, 10)
    pointLight.position.set(2, 3, 3)
    scene.add(pointLight)

    const backLight = new THREE.PointLight(0x8b5cf6, 2.5, 10)
    backLight.position.set(-2, -1, -2)
    scene.add(backLight)

    // Balotera Cage Group
    const cage = new THREE.Group()
    scene.add(cage)
    cageRef.current = cage

    // Wireframe Sphere Cage
    const sphereGeo = new THREE.IcosahedronGeometry(1.6, 2)
    const wireframe = new THREE.WireframeGeometry(sphereGeo)
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xe2b714,
      transparent: true,
      opacity: 0.85,
    })
    const cageLines = new THREE.LineSegments(wireframe, lineMat)
    cage.add(cageLines)

    // Cage Inner Metal Ribs
    const ringGeo = new THREE.TorusGeometry(1.6, 0.04, 16, 64)
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.35,
      metalness: 0.8,
    })
    const ring1 = new THREE.Mesh(ringGeo, metalMat)
    const ring2 = new THREE.Mesh(ringGeo, metalMat)
    ring2.rotation.x = Math.PI / 2
    cage.add(ring1)
    cage.add(ring2)

    // Bouncing Balls Inside
    const ballColors = [0x3b82f6, 0x8b5cf6, 0x10b981, 0xf97316, 0xef4444]
    const balls: THREE.Mesh[] = []
    for (let i = 0; i < 28; i++) {
      const bGeo = new THREE.SphereGeometry(0.24, 16, 16)
      const bMat = new THREE.MeshStandardMaterial({
        color: ballColors[i % ballColors.length],
        roughness: 0.2,
        metalness: 0.4,
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

    // Stand base
    const baseGeo = new THREE.CylinderGeometry(0.3, 0.8, 1.8, 16)
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 })
    const base = new THREE.Mesh(baseGeo, baseMat)
    base.position.set(0, -2.1, 0)
    scene.add(base)

    // Animation Loop
    let reqId: number
    const clock = new THREE.Clock()

    const animate = () => {
      reqId = requestAnimationFrame(animate)
      const delta = clock.getDelta()

      if (cageRef.current) {
        const speed = isSpinning ? 14 : 0.8
        cageRef.current.rotation.y += speed * delta
        cageRef.current.rotation.x += (speed * 0.4) * delta

        // Jiggle balls inside when spinning
        if (isSpinning) {
          innerBallsRef.current.forEach((b) => {
            b.position.x += (Math.random() - 0.5) * 0.08
            b.position.y += (Math.random() - 0.5) * 0.08
            b.position.z += (Math.random() - 0.5) * 0.08
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
      lineMat.dispose()
      ringGeo.dispose()
      metalMat.dispose()
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [isSpinning])

  return (
    <div className="relative flex flex-col items-center justify-center p-3 rounded-2xl glass-panel-glow w-full max-w-sm mx-auto shadow-2xl">
      <div className="absolute top-3 left-4 flex items-center gap-1.5 z-10">
        <span className="relative flex h-2.5 w-2.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isSpinning ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSpinning ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
        </span>
        <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400 font-mono">
          {isSpinning ? 'Girando Balotera...' : 'Balotera 3D Activa'}
        </span>
      </div>

      <div ref={mountRef} className="w-full h-56 cursor-grab active:cursor-grabbing" />

      {/* Extracted Ball Presentation Card */}
      <div className="w-full mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between px-2">
        <div className="text-xs text-slate-400">
          Última balota:
        </div>
        {currentBall ? (
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg text-white shadow-lg animate-stamp tabular-nums"
              style={{ backgroundColor: currentBall.color }}
            >
              {currentBall.letter}
            </span>
            <span className="text-2xl font-black text-white tabular-nums tracking-tight font-display">
              {currentBall.number}
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-500 italic">En espera de extracción</span>
        )}
      </div>
    </div>
  )
}
