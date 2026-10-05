import React from 'react'
import { ArrowLeft } from 'lucide-react'

interface PotionsGuideViewProps {
  onBack: () => void
}

export const PotionsGuideView: React.FC<PotionsGuideViewProps> = ({ onBack }) => {
  return (
    <div className="zombie-bg min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center relative selection:bg-red-500 selection:text-white">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="fixed top-6 left-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/80 hover:bg-black text-amber-400 font-horror text-lg border-2 border-red-950 transition-all cursor-pointer shadow-2xl"
      >
        <ArrowLeft className="w-5 h-5 text-red-500" />
        <span>Volver al Inicio</span>
      </button>

      {/* Main Container */}
      <div className="bg-black/80 backdrop-blur-md rounded-3xl p-6 sm:p-10 max-w-5xl w-full border-2 border-red-950 shadow-2xl z-10 mt-8">
        <h1 className="text-4xl sm:text-6xl font-horror text-center text-red-500 tracking-wider mb-2 drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
          Posiones Zombie
        </h1>
        <p className="text-center text-sm font-horror text-emerald-400 mb-8 tracking-widest">
          GUÍA DEL ARSENAL TÁCTICO ORIGINAL DE SUPERVIVENCIA
        </p>

        {/* 3 Columns Grid (Honoring posionesZombie.html) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Posion 1: Cinematica (3posion.jpeg) */}
          <div className="flex flex-col items-center p-5 rounded-2xl bg-slate-950/80 border-2 border-red-900 shadow-xl hover:border-amber-500 transition-all group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-500/60 p-1.5 bg-black mb-4 shadow-lg group-hover:scale-105 transition-transform">
              <img
                src="/img/3posion.jpeg"
                alt="Poción de Cinemática"
                className="w-full h-full object-cover rounded-full animate-agitar"
              />
            </div>
            <h2 className="text-2xl font-horror text-amber-400 text-center mb-2">
              Posión de Cinematica
            </h2>
            <p className="text-xs text-slate-300 text-center leading-relaxed mb-4 flex-1">
              Activa una cinemática zombie que bloquea temporalmente la pantalla del oponente, impidiéndole ver su cartón durante el efecto.
            </p>
            <span className="font-horror text-red-500 text-base font-bold tracking-wider">
              Duración: 10 segundos
            </span>
          </div>

          {/* Posion 2: Bloqueo (2posion.jpeg) */}
          <div className="flex flex-col items-center p-5 rounded-2xl bg-slate-950/80 border-2 border-red-900 shadow-xl hover:border-cyan-500 transition-all group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-500/60 p-1.5 bg-black mb-4 shadow-lg group-hover:scale-105 transition-transform">
              <img
                src="/img/2posion.jpeg"
                alt="Poción de Bloqueo"
                className="w-full h-full object-cover rounded-full animate-agitar"
              />
            </div>
            <h2 className="text-2xl font-horror text-cyan-400 text-center mb-2">
              Posión de Bloqueo
            </h2>
            <p className="text-xs text-slate-300 text-center leading-relaxed mb-4 flex-1">
              Bloquea un número que aún no ha salido en el cartón del oponente, impidiéndole marcarlo cuando aparezca.
            </p>
            <span className="font-horror text-red-500 text-base font-bold tracking-wider">
              Duración: 10 segundos
            </span>
          </div>

          {/* Posion 3: Giro (1posion.jpeg) */}
          <div className="flex flex-col items-center p-5 rounded-2xl bg-slate-950/80 border-2 border-red-900 shadow-xl hover:border-purple-500 transition-all group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/60 p-1.5 bg-black mb-4 shadow-lg group-hover:scale-105 transition-transform">
              <img
                src="/img/1posion.jpeg"
                alt="Poción de Giro"
                className="w-full h-full object-cover rounded-full animate-agitar"
              />
            </div>
            <h2 className="text-2xl font-horror text-purple-400 text-center mb-2">
              Posión de Giro
            </h2>
            <p className="text-xs text-slate-300 text-center leading-relaxed mb-4 flex-1">
              Gira los números del cartón del oponente, dificultando su lectura y capacidad de marcar los números correctamente.
            </p>
            <span className="font-horror text-red-500 text-base font-bold tracking-wider">
              Duración: 10 segundos
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
