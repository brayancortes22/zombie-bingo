import React from 'react'
import { useBingoGame } from '../../hooks/useBingoGame'
import { useZombieBots } from '../../hooks/useZombieBots'
import { soundEngine } from '../../services/soundEngine'
import { GameHeader } from '../hud/GameHeader'
import { Balotera3D } from '../3d/Balotera3D'
import { BingoBoard } from '../board/BingoBoard'
import { PotionRack } from '../potions/PotionRack'
import { OpponentsRadar } from '../hud/OpponentsRadar'
import { CinematicEffectOverlay } from '../modals/CinematicEffectOverlay'
import { VictoryModal } from '../modals/VictoryModal'
import type { PotionType } from '../../types/bingo'
import type { RoomData } from '../../types/navigation'
import { ArrowLeft } from 'lucide-react'

interface GameViewProps {
  room: RoomData | null
  soundEnabled: boolean
  onToggleSound: () => void
  onExitGame: () => void
}

export const GameView: React.FC<GameViewProps> = ({
  room,
  soundEnabled,
  onToggleSound,
  onExitGame,
}) => {
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

  const handleCastPotion = (type: PotionType) => {
    castPotion(type)
    applyPlayerPotionToBots(type)
  }

  const handleFullReset = () => {
    resetGame()
    resetBots()
  }

  return (
    <div className="w-full flex flex-col flex-1 z-10">
      {/* Top Exit Strip */}
      <div className="flex items-center justify-between mb-3 max-w-6xl w-full mx-auto px-2">
        <button
          type="button"
          onClick={onExitGame}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/80 hover:bg-black text-amber-400 font-horror text-sm border border-red-950 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-red-500" />
          <span>Volver al Menú Principal</span>
        </button>

        {room && (
          <span className="text-xs font-horror text-yellow-400 bg-black/80 px-3 py-1 rounded-full border border-yellow-500/40">
            Sala #{room.id}
          </span>
        )}
      </div>

      {/* Top HUD Header */}
      <GameHeader
        drawnBalls={drawnBalls}
        onDrawBall={drawBall}
        isAutoDraw={isAutoDraw}
        onToggleAutoDraw={() => setIsAutoDraw((prev) => !prev)}
        isSpinning={isSpinning}
        onResetGame={handleFullReset}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        score={score}
      />

      {/* Main Battlefield */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start max-w-6xl w-full mx-auto">
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
