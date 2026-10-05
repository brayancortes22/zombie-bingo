import React, { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { soundEngine } from '../../services/soundEngine'
import { Trophy, Dices, Clock, Zap, RotateCcw } from 'lucide-react'

interface VictoryModalProps {
  isOpen: boolean
  patternName: string
  score: number
  ballsDrawn: number
  elapsedTime: number
  onRestart: () => void
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  patternName,
  score,
  ballsDrawn,
  elapsedTime,
  onRestart,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundEngine.playVictory()
      // Confetti burst
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#F59E0B', '#EF4444', '#8B5CF6'],
      })
    }
  }, [isOpen])

  if (!isOpen) return null

  const minutes = Math.floor(elapsedTime / 60)
  const seconds = elapsedTime % 60
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-glow p-6 sm:p-8 rounded-3xl max-w-md w-full border-2 border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.3)] text-center relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Trophy icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-950/40 text-slate-950">
          <Trophy className="w-9 h-9 sm:w-11 sm:h-11" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white font-display mb-1">
          ¡BINGO ZOMBIE!
        </h2>
        <p className="text-sm font-semibold text-emerald-400 mb-6">
          Patrón Completado: <span className="text-white underline">{patternName}</span>
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-6 text-left">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Puntaje</span>
            </div>
            <div className="text-lg font-black text-white font-display tabular-nums">
              {score}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
              <Dices className="w-3 h-3 text-emerald-400" />
              <span>Balotas</span>
            </div>
            <div className="text-lg font-black text-white font-display tabular-nums">
              {ballsDrawn}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>Tiempo</span>
            </div>
            <div className="text-lg font-black text-white font-display tabular-nums">
              {formattedTime}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-base bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Jugar Otra Partida</span>
        </button>
      </div>
    </div>
  )
}
