import React from 'react'
import { EyeOff, Snowflake, RotateCcw } from 'lucide-react'

interface CinematicEffectOverlayProps {
  isFogActive: boolean
  isFreezeActive: boolean
  isVertigoActive: boolean
  fogRemaining: number
  freezeRemaining: number
  vertigoRemaining: number
}

export const CinematicEffectOverlay: React.FC<CinematicEffectOverlayProps> = ({
  isFogActive,
  isFreezeActive,
  isVertigoActive,
  fogRemaining,
  freezeRemaining,
  vertigoRemaining,
}) => {
  return (
    <>
      {/* Fog / Cinematic Zombie Jumpscare Fog Overlay */}
      {isFogActive && (
        <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-emerald-950/85 backdrop-blur-xl animate-zombie-fog transition-all">
          <div className="text-center p-6 rounded-3xl bg-black/60 border border-emerald-500/40 shadow-2xl max-w-sm mx-4">
            <span className="text-6xl animate-bounce inline-block mb-2">🧟‍♂️</span>
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-black text-xl font-display mb-1">
              <EyeOff className="w-5 h-5 text-amber-400" />
              <span>¡NIEBLA ZOMBIE!</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Un oponente activó una poción cinematográfica. Tu visión está severamente bloqueada.
            </p>
            <div className="text-sm font-mono font-bold text-amber-400 tabular-nums">
              Disipando en: {fogRemaining}s
            </div>
          </div>
        </div>
      )}

      {/* Freeze Border Effect */}
      {isFreezeActive && (
        <div className="fixed inset-0 z-40 pointer-events-none border-[12px] border-cyan-400/70 shadow-[inset_0_0_80px_rgba(6,182,212,0.4)] flex items-start justify-center pt-6">
          <div className="bg-cyan-950/90 text-cyan-200 border border-cyan-400/60 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg text-xs font-bold font-mono">
            <Snowflake className="w-4 h-4 animate-spin text-cyan-300" />
            <span>¡CARTÓN CONGELADO! ({freezeRemaining}s)</span>
          </div>
        </div>
      )}

      {/* Vertigo Floating Notice */}
      {isVertigoActive && (
        <div className="fixed bottom-6 right-6 z-40 pointer-events-none bg-purple-950/90 text-purple-200 border border-purple-400/60 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl text-xs font-bold font-mono">
          <RotateCcw className="w-4 h-4 animate-spin text-purple-400" />
          <span>¡POCIÓN DE GIRO ACTIVA! ({vertigoRemaining}s)</span>
        </div>
      )}
    </>
  )
}
