import React from 'react'
import type { PotionType } from '../../types/bingo'
import { soundEngine } from '../../services/soundEngine'
import { EyeOff, Snowflake, RotateCcw, ShieldCheck, Zap } from 'lucide-react'

interface PotionRackProps {
  energy: number
  maxEnergy: number
  onUsePotion: (type: PotionType) => void
  cooldowns: Record<PotionType, number>
}

const POTIONS = [
  {
    id: 'fog' as PotionType,
    name: 'Cinemática Zombie',
    cost: 30,
    desc: 'Ciega la pantalla de tus oponentes con niebla densa y gemidos durante 8s.',
    icon: EyeOff,
    color: 'from-amber-600 to-orange-700 border-amber-500/50 text-amber-200',
  },
  {
    id: 'freeze' as PotionType,
    name: 'Congelación Glacial',
    cost: 40,
    desc: 'Congela casillas enemigas impidiendo que marquen durante 6s.',
    icon: Snowflake,
    color: 'from-cyan-600 to-blue-800 border-cyan-500/50 text-cyan-200',
  },
  {
    id: 'vertigo' as PotionType,
    name: 'Poción de Giro',
    cost: 45,
    desc: 'Rota el cartón de tus oponentes 180° dificultando su lectura.',
    icon: RotateCcw,
    color: 'from-purple-600 to-fuchsia-800 border-purple-500/50 text-purple-200',
  },
  {
    id: 'shield' as PotionType,
    name: 'Vacuna Sagrada',
    cost: 35,
    desc: 'Crea un escudo bio-químico que anula el próximo ataque enemigo.',
    icon: ShieldCheck,
    color: 'from-emerald-600 to-teal-800 border-emerald-500/50 text-emerald-200',
  },
]

export const PotionRack: React.FC<PotionRackProps> = ({
  energy,
  maxEnergy,
  onUsePotion,
  cooldowns,
}) => {
  const energyPercent = Math.min(100, Math.round((energy / maxEnergy) * 100))

  const handleCast = (id: PotionType, cost: number) => {
    if (energy < cost || cooldowns[id] > 0) return
    soundEngine.playPotion()
    onUsePotion(id)
  }

  return (
    <div className="glass-panel p-4 rounded-2xl w-full max-w-xl mx-auto shadow-xl border border-slate-700/60">
      {/* Energy Bar Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
          <Zap className="w-4 h-4 animate-bounce text-amber-400" />
          <span>Ira & Energía Zombie</span>
        </div>
        <span className="text-xs font-mono font-bold text-slate-300 tabular-nums">
          {energy} / {maxEnergy} PE
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/80 mb-4">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-300 shadow-sm"
          style={{ width: `${energyPercent}%` }}
        />
      </div>

      {/* Potion Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {POTIONS.map((pot) => {
          const Icon = pot.icon
          const hasEnergy = energy >= pot.cost
          const cd = cooldowns[pot.id] || 0
          const isDisabled = !hasEnergy || cd > 0

          return (
            <button
              key={pot.id}
              type="button"
              disabled={isDisabled}
              onClick={() => handleCast(pot.id, pot.cost)}
              title={`${pot.name}: ${pot.desc}`}
              className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border bg-gradient-to-br transition-all duration-200 select-none ${
                pot.color
              } ${
                isDisabled
                  ? 'opacity-40 grayscale cursor-not-allowed border-slate-800'
                  : 'hover:scale-105 active:scale-95 shadow-lg cursor-pointer hover:brightness-110'
              }`}
            >
              {/* Cooldown Overlay */}
              {cd > 0 && (
                <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center text-xs font-mono font-bold text-white z-10 tabular-nums">
                  {cd}s
                </div>
              )}

              <Icon className="w-6 h-6 mb-1.5" />
              <span className="text-xs font-bold leading-tight text-center">
                {pot.name}
              </span>
              <span className="text-[10px] font-mono mt-1 px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-semibold">
                {pot.cost} PE
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
