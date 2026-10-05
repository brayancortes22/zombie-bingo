import React, { useEffect, useState } from 'react'
import { useBingoGame } from '../../hooks/useBingoGame'
import { useZombieBots } from '../../hooks/useZombieBots'
import { soundEngine } from '../../services/soundEngine'
import { multiplayerService } from '../../services/multiplayerService'
import { GameHeader } from '../hud/GameHeader'
import { Balotera3D } from '../3d/Balotera3D'
import { BingoBoard } from '../board/BingoBoard'
import { PotionRack } from '../potions/PotionRack'
import { OpponentsRadar } from '../hud/OpponentsRadar'
import { CinematicEffectOverlay } from '../modals/CinematicEffectOverlay'
import { VictoryModal } from '../modals/VictoryModal'
import type { PotionType, BingoBall } from '../../types/bingo'
import type { RoomData } from '../../types/navigation'
import { ArrowLeft, Radio } from 'lucide-react'

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
  const [remoteWinner, setRemoteWinner] = useState<string | null>(null)

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
    injectBall,
    markCell,
    castPotion,
    receiveEnemyAttack,
    resetGame,
  } = useBingoGame({
    onBallDrawn: (ball) => {
      if (room?.isHost) {
        multiplayerService.drawBallot(ball)
      }
    },
  })

  // Sincronización WebRTC en Clientes
  useEffect(() => {
    if (!room) return

    if (!room.isHost) {
      multiplayerService.onBallotReceived((ball) => {
        injectBall(ball as unknown as BingoBall)
      })
    }

    multiplayerService.onBingoClaim((claim) => {
      setRemoteWinner(claim.winnerName)
      soundEngine.playVictory()
    })
  }, [room, injectBall])

  // Bots si es partida individual o complemento en sala pequeña
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
    setRemoteWinner(null)
  }

  const handleMark = (r: number, c: number) => {
    markCell(r, c)
    if (room) {
      const marked = grid.flat().filter((cell) => cell.isMarked).length + 1
      multiplayerService.sendProgress(marked)
    }
  }

  const handleCallBingo = () => {
    if (winPattern) {
      soundEngine.playVictory()
      if (room) {
        const myName = room.players.find((p) => p.isHost === room.isHost)?.name || 'Superviviente'
        multiplayerService.claimBingo(myName)
      }
    } else {
      soundEngine.playZombieGroan()
    }
  }

  const handleExit = () => {
    if (room) {
      multiplayerService.leaveRoom()
    }
    onExitGame()
  }

  return (
    <div className="w-full flex flex-col flex-1 z-10">
      {/* Top Exit Strip */}
      <div className="flex items-center justify-between mb-3 max-w-6xl w-full mx-auto px-2">
        <button
          type="button"
          onClick={handleExit}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/80 hover:bg-black text-amber-400 font-horror text-sm border border-red-950 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-red-500" />
          <span>Volver al Menú Principal</span>
        </button>

        {room ? (
          <span className="flex items-center gap-1.5 text-xs font-horror text-yellow-400 bg-black/85 px-3.5 py-1 rounded-full border border-yellow-500/50">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>SALA MULTIJUGADOR #{room.id} ({room.isHost ? '👑 Host' : '📡 P2P Conectado'})</span>
          </span>
        ) : (
          <span className="text-xs font-horror text-emerald-400 bg-black/80 px-3 py-1 rounded-full border border-emerald-500/40">
            Modo Supervivencia Solitario
          </span>
        )}
      </div>

      {remoteWinner && (
        <div className="max-w-6xl w-full mx-auto mb-3 p-3 rounded-2xl bg-gradient-to-r from-yellow-900/90 via-red-950/90 to-yellow-900/90 border-2 border-yellow-400 text-center font-horror text-lg text-yellow-300 shadow-2xl animate-bounce">
          🏆 ¡{remoteWinner} ha cantado ¡BINGO! en la sala multijugador!
        </div>
      )}

      {/* Top HUD Header */}
      <GameHeader
        drawnBalls={drawnBalls}
        onDrawBall={room && !room.isHost ? () => {} : drawBall}
        isAutoDraw={room && !room.isHost ? false : isAutoDraw}
        onToggleAutoDraw={room && !room.isHost ? () => {} : () => setIsAutoDraw((prev) => !prev)}
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
            onMarkCell={handleMark}
            isVertigoActive={vertigoDuration > 0}
            onCallBingo={handleCallBingo}
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
