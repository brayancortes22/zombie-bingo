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
    <header className="bg-black/80 backdrop-blur-md p-4 rounded-3xl w-full max-w-6xl mx-auto shadow-2xl mb-4 border-2 border-red-950">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Title & Brand */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/img/zombie_inicio.png"
              alt="Zombie"
              className="w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]"
            />
            <div>
              <h1 className="text-3xl sm:text-4xl font-horror text-red-500 tracking-wider flex items-center gap-2 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                ZOMBIE <span className="text-yellow-400">BINGO</span>
              </h1>
              <p className="text-xs font-horror text-emerald-400 tracking-widest -mt-1">
                EL JUEGO DE TERROR Y SUPERVIVENCIA ORIGINAL
              </p>
            </div>
          </div>

          {/* Quick Sound/Reset for Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={onToggleSound}
              className="p-2 rounded-xl bg-slate-900 border border-red-900 text-slate-300"
              title="Sonido"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-red-500" />}
            </button>
            <button
              type="button"
              onClick={onResetGame}
              className="p-2 rounded-xl bg-slate-900 border border-red-900 text-slate-300"
              title="Reiniciar"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Bar (Original .resultados style) */}
        <div className="flex items-center gap-2 overflow-x-auto py-1.5 px-3 bg-[#3accb4]/25 border border-[#3accb4]/60 rounded-full shadow-inner">
          <span className="text-xs font-horror text-emerald-300 uppercase tracking-widest pl-1">
            Balotas:
          </span>
          {recentBalls.length === 0 ? (
            <span className="text-xs font-horror text-slate-400 italic px-2">Esperando...</span>
          ) : (
            recentBalls.map((b, idx) => (
              <span
                key={`${b.letter}-${b.number}-${idx}`}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full font-horror text-lg text-white shadow-md border border-white/50 shrink-0 animate-stamp"
                style={{ backgroundColor: b.color }}
              >
                {b.letter}{b.number}
              </span>
            ))
          )}
        </div>

        {/* Action Controls & Score */}
        <div className="flex items-center gap-3 justify-end">
          <div className="hidden sm:flex flex-col items-end mr-1">
            <span className="text-xs font-horror text-slate-400 uppercase tracking-wider">Puntuación</span>
            <span className="text-2xl font-horror text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {score} PTS
            </span>
          </div>

          <button
            type="button"
            onClick={onDrawBall}
            disabled={isSpinning || isAutoDraw}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-horror text-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-lg shadow-red-950 border border-red-400/60 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Dices className="w-5 h-5" />
            <span>Sacar Balota</span>
          </button>

          <button
            type="button"
            onClick={onToggleAutoDraw}
            title={isAutoDraw ? 'Pausar Auto-Piloto' : 'Activar Auto-Piloto (Saca balotas y marca casillas solo)'}
            className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl font-horror text-lg border transition-all cursor-pointer ${
              isAutoDraw
                ? 'bg-amber-500/30 text-amber-300 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse'
                : 'bg-slate-900 text-slate-300 border-red-900 hover:text-white hover:border-red-600'
            }`}
          >
            {isAutoDraw ? <Pause className="w-5 h-5 text-amber-400" /> : <Play className="w-5 h-5 text-emerald-400" />}
            <span className="hidden sm:inline">
              {isAutoDraw ? '⚡ Auto-Piloto (Marcando...)' : '⚡ Auto-Piloto'}
            </span>
            <span className="sm:hidden">
              {isAutoDraw ? 'Auto' : '⚡'}
            </span>
          </button>

          <div className="hidden md:flex items-center gap-2 ml-1">
            <button
              type="button"
              onClick={onToggleSound}
              className="p-3 rounded-2xl bg-slate-900 text-slate-300 hover:text-white border border-red-950"
              title="Sonido"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-red-500" />}
            </button>
            <button
              type="button"
              onClick={onResetGame}
              className="p-3 rounded-2xl bg-slate-900 text-slate-300 hover:text-white border border-red-950"
              title="Reiniciar"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
