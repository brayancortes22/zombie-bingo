import React from 'react'
import type { PotionType } from '../../types/bingo'
import { soundEngine } from '../../services/soundEngine'
import { Zap } from 'lucide-react'

interface PotionRackProps {
  energy: number
  maxEnergy: number
  onUsePotion: (type: PotionType) => void
  cooldowns: Record<PotionType, number>
}

const ORIGINAL_POTIONS = [
  {
    id: 'fog' as PotionType,
    name: 'Poción de Cinemática',
    cost: 30,
    desc: 'Activa una cinemática zombie que ciega temporalmente la pantalla del oponente durante 8s.',
    img: '/img/3posion.jpeg',
    glowColor: 'border-amber-500 shadow-amber-900/60',
  },
  {
    id: 'vertigo' as PotionType,
    name: 'Poción de Giro',
    cost: 45,
    desc: 'Gira los números del cartón del oponente 180°, dificultando su lectura.',
    img: '/img/1posion.jpeg',
    glowColor: 'border-purple-500 shadow-purple-900/60',
  },
  {
    id: 'freeze' as PotionType,
    name: 'Poción de Bloqueo',
    cost: 40,
    desc: 'Bloquea un número que aún no ha salido en el cartón del rival por 6s.',
    img: '/img/2posion.jpeg',
    glowColor: 'border-cyan-500 shadow-cyan-900/60',
  },
  {
    id: 'shield' as PotionType,
    name: 'Vacuna Antídoto',
    cost: 35,
    desc: 'Escudo bio-químico que inmuniza contra el próximo ataque enemigo.',
    img: '/img/pociones_1.png',
    glowColor: 'border-emerald-500 shadow-emerald-900/60',
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
    <div className="bg-black/75 backdrop-blur-md p-4 rounded-3xl w-full max-w-xl mx-auto shadow-2xl border-2 border-red-900/80">
      {/* Energy Bar Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm font-horror text-amber-400 text-lg tracking-wider">
          <Zap className="w-5 h-5 animate-bounce text-red-500" />
          <span>Ira & Pociones Zombie</span>
        </div>
        <span className="text-xs font-mono font-bold text-slate-300 tabular-nums">
          {energy} / {maxEnergy} PE
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-red-800/60 mb-4">
        <div
          className="h-full rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 transition-all duration-300 shadow-sm"
          style={{ width: `${energyPercent}%` }}
        />
      </div>

      {/* Real Potion Bottles Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ORIGINAL_POTIONS.map((pot) => {
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
              className={`relative flex flex-col items-center justify-between p-2.5 rounded-2xl border-2 bg-gradient-to-b from-slate-900/90 to-black/90 transition-all select-none ${
                pot.glowColor
              } ${
                isDisabled
                  ? 'opacity-40 grayscale cursor-not-allowed border-slate-800'
                  : 'hover:scale-105 active:scale-95 shadow-xl cursor-pointer hover:border-emerald-400 animate-pulsar'
              }`}
            >
              {/* Cooldown Overlay */}
              {cd > 0 && (
                <div className="absolute inset-0 bg-black/80 rounded-2xl flex items-center justify-center text-sm font-mono font-bold text-red-400 z-20 tabular-nums">
                  {cd}s
                </div>
              )}

              {/* Shaking Bottle Image */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-red-500/40 p-1 bg-black/60 shadow-inner flex items-center justify-center mb-1">
                <img
                  src={pot.img}
                  alt={pot.name}
                  className={`w-full h-full object-cover rounded-full ${
                    !isDisabled ? 'animate-agitar' : ''
                  }`}
                />
              </div>

              <span className="text-xs font-horror text-amber-300 text-center leading-tight">
                {pot.name}
              </span>

              <span className="text-[10px] font-mono mt-1 px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-800 font-bold">
                {pot.cost} PE
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
