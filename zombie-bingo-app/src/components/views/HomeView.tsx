import React from 'react'
import type { UserSession } from '../../types/navigation'
import { Volume2, VolumeX, Share2, FlaskConical, Users, UserPlus, Play, LogOut } from 'lucide-react'

interface HomeViewProps {
  user: UserSession
  onPlaySolo: () => void
  onCreateRoom: () => void
  onJoinRoom: () => void
  onOpenPotionsGuide: () => void
  onLogout: () => void
  soundEnabled: boolean
  onToggleSound: () => void
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  onPlaySolo,
  onCreateRoom,
  onJoinRoom,
  onOpenPotionsGuide,
  onLogout,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <div className="zombie-bg min-h-screen flex flex-col p-4 sm:p-6 relative selection:bg-red-500 selection:text-white">
      {/* Top Header Strip (From Original inicio.php) */}
      <header className="flex items-center justify-between p-3.5 rounded-2xl bg-black/80 backdrop-blur-md border-2 border-red-950 mb-6 max-w-6xl w-full mx-auto shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-500 shadow-md">
            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-horror text-yellow-400 leading-tight">
              Bienvenido, {user.username}
            </h2>
            <span className="text-xs font-mono text-emerald-400">
              {user.provider === 'google' ? `⚡ Conectado con Google (${user.email || 'Superviviente'})` : 'Nivel 10 · Superviviente'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 font-horror text-base cursor-pointer transition-all active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Cerrar Sesión</span>
        </button>
      </header>

      {/* Main Hero & Menu */}
      <div className="max-w-6xl w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Quick Controls Strip */}
        <div className="lg:col-span-2 flex lg:flex-col items-center justify-center gap-4">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            title="Activar/Silenciar Audio"
            className="p-3.5 rounded-2xl bg-black/80 hover:bg-slate-900 border-2 border-red-950 text-slate-300 hover:text-white transition-all cursor-pointer shadow-xl"
          >
            {soundEnabled ? <Volume2 className="w-6 h-6 text-emerald-400" /> : <VolumeX className="w-6 h-6 text-red-500" />}
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={() => alert('¡Comparte Zombie Bingo con tus amigos para jugar en línea!')}
            title="Compartir Juego"
            className="p-3.5 rounded-2xl bg-black/80 hover:bg-slate-900 border-2 border-red-950 text-slate-300 hover:text-cyan-400 transition-all cursor-pointer shadow-xl"
          >
            <Share2 className="w-6 h-6" />
          </button>

          {/* Potion Guide Button (bi-capsule from inicio.php) */}
          <button
            type="button"
            onClick={onOpenPotionsGuide}
            title="Ver Guía de Posiones Zombie"
            className="p-3.5 rounded-2xl bg-black/80 hover:bg-slate-900 border-2 border-amber-500 text-amber-400 transition-all cursor-pointer shadow-xl hover:scale-105"
          >
            <FlaskConical className="w-6 h-6 animate-pulse" />
          </button>
        </div>

        {/* Center: Zombie Mascot Artwork (zombie_inicio.png) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <img
            src="/img/zombie_inicio.png"
            alt="Zombie Plash"
            className="w-64 sm:w-80 object-contain drop-shadow-[0_0_35px_rgba(239,68,68,0.7)] hover:scale-105 transition-transform duration-300"
          />
          <h1 className="text-4xl sm:text-5xl font-horror text-center text-red-500 mt-2 drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
            ZOMBIE <span className="text-yellow-400">PLASH</span>
          </h1>
        </div>

        {/* Right Side: Primary Game Mode Buttons */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <button
            type="button"
            onClick={onPlaySolo}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-700 to-red-800 hover:from-red-500 hover:to-rose-600 font-horror text-2xl sm:text-3xl text-white tracking-widest border-2 border-yellow-400/80 shadow-2xl cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Play className="w-7 h-7 fill-white" />
            <span>Partida Rápida 3D</span>
          </button>

          <button
            type="button"
            onClick={onCreateRoom}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 font-horror text-2xl sm:text-3xl text-white tracking-widest border-2 border-green-400/60 shadow-2xl cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Users className="w-7 h-7" />
            <span>Crear Sala</span>
          </button>

          <button
            type="button"
            onClick={onJoinRoom}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 font-horror text-2xl sm:text-3xl text-white tracking-widest border-2 border-purple-400/60 shadow-2xl cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <UserPlus className="w-7 h-7" />
            <span>Unirse a una Sala</span>
          </button>

          <button
            type="button"
            onClick={onOpenPotionsGuide}
            className="w-full py-3 px-6 rounded-2xl bg-black/80 hover:bg-slate-900 border-2 border-amber-500/70 font-horror text-xl text-amber-300 tracking-wider shadow-xl cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <FlaskConical className="w-5 h-5 text-amber-400" />
            <span>Explicación de Posiones</span>
          </button>
        </div>
      </div>

      {/* Bottom Friends Strip (From Original inicio.php) */}
      <div className="max-w-6xl w-full mx-auto mt-6 bg-black/75 backdrop-blur-md p-3.5 rounded-2xl border-2 border-red-950 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs font-horror text-slate-400 uppercase tracking-wider">
          💀 Amigos Agregados & Horda:
        </span>
        <div className="flex items-center gap-3">
          {['/img/avatar1.jpg', '/img/avatar2.jpg', '/img/avatar3.jpg'].map((av, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
              <img src={av} alt="Friend" className="w-6 h-6 rounded-full object-cover border border-red-500" />
              <span className="text-[11px] font-mono text-slate-300">Zombie_{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
