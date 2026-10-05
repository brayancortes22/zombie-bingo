import { useState, useEffect, useRef } from 'react'
import { useBingoGame } from './hooks/useBingoGame'
import { useZombieBots } from './hooks/useZombieBots'
import { soundEngine } from './services/soundEngine'
import { GameHeader } from './components/hud/GameHeader'
import { Balotera3D } from './components/3d/Balotera3D'
import { BingoBoard } from './components/board/BingoBoard'
import { PotionRack } from './components/potions/PotionRack'
import { OpponentsRadar } from './components/hud/OpponentsRadar'
import { BloodRain } from './components/effects/BloodRain'
import { CinematicEffectOverlay } from './components/modals/CinematicEffectOverlay'
import { VictoryModal } from './components/modals/VictoryModal'
import type { PotionType } from './types/bingo'

export function App() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const bgMusicRef = useRef<HTMLAudioElement | null>(null)

  const {
    grid,
    currentBall,
    drawnBalls,
    drawnNumbers,
    isSpinning,
    isAutoDraw,
    setIsAutoDraw,
    energy,
    maxEnergy,
    score,
    elapsedTime,
    winPattern,
    patternName,
    cooldowns,
    fogDuration,
    freezeDuration,
    vertigoDuration,
    drawBall,
    markCell,
    castPotion,
    receiveEnemyAttack,
    resetGame,
  } = useBingoGame()

  const { opponents, applyPlayerPotionToBots, resetBots } = useZombieBots({
    currentBall,
    onAttackPlayer: receiveEnemyAttack,
  })

  // Background Soundtrack (sonido_juego3.mp3)
  useEffect(() => {
    const audio = new Audio('/sound/sonido_juego3.mp3')
    audio.loop = true
    audio.volume = 0.35
    bgMusicRef.current = audio

    const playMusic = () => {
      if (soundEnabled) {
        audio.play().catch(() => {
          // Autoplay policy: will start on first user interaction
        })
      }
    }

    playMusic()

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  useEffect(() => {
    if (bgMusicRef.current) {
      if (soundEnabled) {
        bgMusicRef.current.play().catch(() => {})
      } else {
        bgMusicRef.current.pause()
      }
    }
  }, [soundEnabled])

  const handleToggleSound = () => {
    const next = !soundEnabled
    soundEngine.enabled = next
    setSoundEnabled(next)
  }

  const handleCastPotion = (type: PotionType) => {
    castPotion(type)
    applyPlayerPotionToBots(type)
  }

  const handleFullReset = () => {
    resetGame()
    resetBots()
  }

  return (
    <div className="zombie-bg min-h-screen text-slate-100 flex flex-col p-3 sm:p-5 relative selection:bg-red-500 selection:text-white">
      {/* Falling Blood Rain from Original goteo.css */}
      <BloodRain />

      {/* Main Container */}
      <main className="w-full max-w-6xl mx-auto flex-1 flex flex-col z-10">
        {/* Top HUD Header */}
        <GameHeader
          drawnBalls={drawnBalls}
          onDrawBall={drawBall}
          isAutoDraw={isAutoDraw}
          onToggleAutoDraw={() => setIsAutoDraw((prev) => !prev)}
          isSpinning={isSpinning}
          onResetGame={handleFullReset}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          score={score}
        />

        {/* Main Battlefield */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
          {/* Left Column: 3D Gothic Balotera & Opponents Radar */}
          <section className="lg:col-span-5 flex flex-col gap-5">
            <Balotera3D currentBall={currentBall} isSpinning={isSpinning} />
            <OpponentsRadar opponents={opponents} />
          </section>

          {/* Right Column: 5x5 Stone Frame Board & Real Potions Rack */}
          <section className="lg:col-span-7 flex flex-col gap-5">
            <BingoBoard
              grid={grid}
              drawnNumbers={drawnNumbers}
              onMarkCell={markCell}
              isVertigoActive={vertigoDuration > 0}
              onCallBingo={() => {
                if (winPattern) {
                  soundEngine.playVictory()
                } else {
                  soundEngine.playZombieGroan()
                }
              }}
              onNewCard={handleFullReset}
            />

            <PotionRack
              energy={energy}
              maxEnergy={maxEnergy}
              onUsePotion={handleCastPotion}
              cooldowns={cooldowns}
            />
          </section>
        </div>
      </main>

      {/* Enemy Potion Overlays (Fog, Freeze, Vertigo) */}
      <CinematicEffectOverlay
        isFogActive={fogDuration > 0}
        isFreezeActive={freezeDuration > 0}
        isVertigoActive={vertigoDuration > 0}
        fogRemaining={fogDuration}
        freezeRemaining={freezeDuration}
        vertigoRemaining={vertigoDuration}
      />

      {/* Victory Celebration Modal */}
      <VictoryModal
        isOpen={Boolean(winPattern)}
        patternName={patternName}
        score={score}
        ballsDrawn={drawnBalls.length}
        elapsedTime={elapsedTime}
        onRestart={handleFullReset}
      />
    </div>
  )
}

export default App
