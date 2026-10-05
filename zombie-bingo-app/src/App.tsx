import { useState } from 'react'
import { useBingoGame } from './hooks/useBingoGame'
import { useZombieBots } from './hooks/useZombieBots'
import { soundEngine } from './services/soundEngine'
import { GameHeader } from './components/hud/GameHeader'
import { Balotera3D } from './components/3d/Balotera3D'
import { BingoBoard } from './components/board/BingoBoard'
import { PotionRack } from './components/potions/PotionRack'
import { OpponentsRadar } from './components/hud/OpponentsRadar'
import { CinematicEffectOverlay } from './components/modals/CinematicEffectOverlay'
import { VictoryModal } from './components/modals/VictoryModal'
import type { PotionType } from './types/bingo'

export function App() {
  const [soundEnabled, setSoundEnabled] = useState(true)

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

  const handleToggleSound = () => {
    soundEngine.enabled = !soundEnabled
    setSoundEnabled(!soundEnabled)
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
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col p-3 sm:p-6 relative selection:bg-emerald-500 selection:text-black">
      {/* Background Ambience Glow */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-900/15 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Main Container */}
      <main className="w-full max-w-6xl mx-auto flex-1 flex flex-col">
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

        {/* Main 2-Column Battlefield */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
          {/* Left Column: 3D Balotera & Opponents Radar */}
          <section className="lg:col-span-5 flex flex-col gap-5">
            <Balotera3D currentBall={currentBall} isSpinning={isSpinning} />
            <OpponentsRadar opponents={opponents} />
          </section>

          {/* Right Column: 5x5 Bingo Board & Potions Rack */}
          <section className="lg:col-span-7 flex flex-col gap-5">
            <BingoBoard
              grid={grid}
              drawnNumbers={drawnNumbers}
              onMarkCell={markCell}
              isVertigoActive={vertigoDuration > 0}
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
