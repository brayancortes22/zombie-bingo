import React from 'react'
import type { Opponent } from '../../types/bingo'
import { EyeOff, Snowflake, Shield } from 'lucide-react'

interface OpponentsRadarProps {
  opponents: Opponent[]
}

const AVATAR_MAP: Record<string, string> = {
  'bot-1': '/img/avatar1.jpg',
  'bot-2': '/img/avatar2.jpg',
  'bot-3': '/img/avatar3.jpg',
}

export const OpponentsRadar: React.FC<OpponentsRadarProps> = ({ opponents }) => {
  return (
    <div className="bg-black/80 backdrop-blur-md p-4 rounded-3xl w-full max-w-sm mx-auto shadow-2xl border-2 border-red-950">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-horror text-red-400 tracking-wider">
          <img src="/img/zombies.png" alt="Zombies" className="w-5 h-5 object-contain" />
          <span>Horda Enemiga en Vivo</span>
        </div>
        <span className="text-[10px] font-horror px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800">
          3 Rivales
        </span>
      </div>

      <div className="space-y-3">
        {opponents.map((bot) => {
          const progress = Math.round((bot.markedCount / bot.totalNeeded) * 100)
          const avatarSrc = AVATAR_MAP[bot.id] || '/img/avatar1.jpg'

          return (
            <div
              key={bot.id}
              className={`p-3 rounded-2xl border-2 transition-all duration-300 ${
                bot.isFrozen
                  ? 'bg-cyan-950/50 border-cyan-500'
                  : bot.hasFog
                  ? 'bg-amber-950/50 border-amber-500'
                  : 'bg-slate-950/80 border-red-950'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={avatarSrc}
                    alt={bot.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-red-600/80 shadow"
                  />
                  <div>
                    <h4 className="text-sm font-horror text-amber-300 leading-tight">
                      {bot.name}
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">
                      {bot.markedCount} / {bot.totalNeeded} balotas
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-1">
                  {bot.isFrozen && (
                    <span title="Congelado" className="p-1 rounded-full bg-cyan-900 text-cyan-300">
                      <Snowflake className="w-3.5 h-3.5 animate-spin" />
                    </span>
                  )}
                  {bot.hasFog && (
                    <span title="Ciego por Niebla" className="p-1 rounded-full bg-amber-900 text-amber-300">
                      <EyeOff className="w-3.5 h-3.5" />
                    </span>
                  )}
                  {bot.hasShield && (
                    <span title="Con Escudo" className="p-1 rounded-full bg-emerald-900 text-emerald-300">
                      <Shield className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>

              {/* Blood Red Progress Bar */}
              <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-red-950">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    progress > 75
                      ? 'bg-gradient-to-r from-red-600 to-rose-500'
                      : progress > 45
                      ? 'bg-gradient-to-r from-amber-600 to-yellow-500'
                      : 'bg-gradient-to-r from-emerald-600 to-green-500'
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
