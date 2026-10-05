import React from 'react'
import type { Opponent } from '../../types/bingo'
import { EyeOff, Snowflake, Shield, Skull } from 'lucide-react'

interface OpponentsRadarProps {
  opponents: Opponent[]
}

export const OpponentsRadar: React.FC<OpponentsRadarProps> = ({ opponents }) => {
  return (
    <div className="glass-panel p-3.5 sm:p-4 rounded-2xl w-full max-w-sm mx-auto shadow-xl border border-slate-700/60">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
          <Skull className="w-4 h-4 text-rose-500" />
          <span>Radar de Horda Zombie</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800/60 font-mono">
          3 Contrincantes
        </span>
      </div>

      <div className="space-y-2.5">
        {opponents.map((bot) => {
          const progress = Math.round((bot.markedCount / bot.totalNeeded) * 100)

          return (
            <div
              key={bot.id}
              className={`p-2.5 rounded-xl border transition-all duration-300 ${
                bot.isFrozen
                  ? 'bg-cyan-950/40 border-cyan-500/40'
                  : bot.hasFog
                  ? 'bg-amber-950/40 border-amber-500/40'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{bot.avatar}</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 leading-tight">
                      {bot.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                      {bot.markedCount} de {bot.totalNeeded} números
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-1">
                  {bot.isFrozen && (
                    <span title="Congelado" className="p-1 rounded bg-cyan-900/80 text-cyan-300">
                      <Snowflake className="w-3.5 h-3.5 animate-spin" />
                    </span>
                  )}
                  {bot.hasFog && (
                    <span title="Ciego por Niebla" className="p-1 rounded bg-amber-900/80 text-amber-300">
                      <EyeOff className="w-3.5 h-3.5" />
                    </span>
                  )}
                  {bot.hasShield && (
                    <span title="Escudo Activo" className="p-1 rounded bg-emerald-900/80 text-emerald-300">
                      <Shield className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    progress > 75
                      ? 'bg-rose-500'
                      : progress > 45
                      ? 'bg-amber-400'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
