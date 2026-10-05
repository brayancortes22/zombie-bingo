import React from 'react'
import type { BingoBall } from '../../types/bingo'
import { Volume2, VolumeX, Play, Pause, Dices, RotateCcw } from 'lucide-react'

interface GameHeaderProps {
  drawnBalls: BingoBall[]
  onDrawBall: () => void
  isAutoDraw: boolean
  onToggleAutoDraw: () => void
  isSpinning: boolean
  onResetGame: () => void
  soundEnabled: boolean
  onToggleSound: () => void
  score: number
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  drawnBalls,
  onDrawBall,
  isAutoDraw,
  onToggleAutoDraw,
  isSpinning,
  onResetGame,
  soundEnabled,
  onToggleSound,
  score,
}) => {
  const recentBalls = [...drawnBalls].reverse().slice(0, 6)

  return (
    <header className="glass-panel p-3.5 sm:p-4 rounded-2xl w-full max-w-5xl mx-auto shadow-2xl mb-4 border border-slate-700/60">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Title & Brand */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🧟</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display flex items-center gap-1.5">
                ZOMBIE <span className="text-emerald-400">BINGO</span>
              </h1>
              <p className="text-[11px] font-mono text-slate-400 tracking-wide">
                Apocalipsis 3D · Supervivencia Táctica
              </p>
            </div>
          </div>

          {/* Quick Audio & Reset (Mobile) */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleSound}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              title="Sonido"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              type="button"
              onClick={onResetGame}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              title="Nueva Partida"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* History Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1.5 bg-slate-900/80 rounded-xl border border-slate-800/80">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider pl-1 mr-1">
            Historial:
          </span>
          {recentBalls.length === 0 ? (
            <span className="text-xs text-slate-500 italic py-1 px-2">Sin balotas aún</span>
          ) : (
            recentBalls.map((b, idx) => (
              <span
                key={`${b.letter}-${b.number}-${idx}`}
                className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-xs text-white shadow tabular-nums shrink-0"
                style={{ backgroundColor: b.color }}
              >
                {b.letter}{b.number}
              </span>
            ))
          )}
        </div>

        {/* Action Controls & Score */}
        <div className="flex items-center gap-2 justify-end">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-[10px] uppercase font-mono text-slate-400">Puntaje</span>
            <span className="text-lg font-black text-amber-400 font-display tabular-nums">
              {score} PTS
            </span>
          </div>

          <button
            type="button"
            onClick={onDrawBall}
            disabled={isSpinning || isAutoDraw}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-lg shadow-emerald-950/40 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Dices className="w-4 h-4" />
            <span>Sacar Balota</span>
          </button>

          <button
            type="button"
            onClick={onToggleAutoDraw}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm transition-all border ${
              isAutoDraw
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-950/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {isAutoDraw ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline">{isAutoDraw ? 'Pausar' : 'Auto'}</span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 ml-1">
            <button
              type="button"
              onClick={onToggleSound}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              title="Sonido"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              type="button"
              onClick={onResetGame}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              title="Nueva Partida"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
