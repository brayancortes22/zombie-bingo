import React, { useState } from 'react'
import type { UserSession } from '../../types/navigation'
import { GoogleAuthButton } from '../auth/GoogleAuthButton'

interface LoginViewProps {
  onLoginSuccess: (user: UserSession) => void
  onPlayGuest: () => void
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onPlayGuest }) => {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState('/img/avatar1.jpg')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLoginSuccess({
      id: 'usr-' + Date.now(),
      username: username.trim() || 'Superviviente',
      avatar,
      isAuthenticated: true,
    })
  }

  return (
    <div className="zombie-bg min-h-screen flex items-center justify-center p-4 relative selection:bg-red-500 selection:text-white">
      <div className="bg-black/85 backdrop-blur-md rounded-3xl p-6 sm:p-9 max-w-2xl w-full border-2 border-red-900 shadow-2xl relative z-10">
        {/* Top Switcher */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-red-950">
          <button
            type="button"
            onClick={onPlayGuest}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 font-horror text-base border border-emerald-500/40 transition-all cursor-pointer"
          >
            Ver Juego (Invitado)
          </button>

          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-yellow-400 font-horror text-base border border-red-800 transition-all cursor-pointer"
          >
            {isRegister ? 'Ya tengo cuenta' : 'Crear Cuenta'}
          </button>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-horror text-center text-red-500 tracking-wider mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
          {isRegister ? 'Registro de Superviviente' : 'Iniciar Sesión'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Zombie Art */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <img
              src="/img/image-removebg-preview.png"
              alt="Zombie Plash"
              className="w-40 sm:w-48 object-contain drop-shadow-[0_0_20px_rgba(239,68,68,0.7)] hover:scale-105 transition-transform"
            />
            <span className="text-xs font-horror text-amber-400 tracking-widest mt-2">
              ZOMBIE BINGO APOCALYPSE
            </span>
          </div>

          {/* Right Form */}
          <form onSubmit={handleSubmit} className="md:col-span-7 flex flex-col gap-3.5">
            <div>
              <label className="block text-xs font-horror text-slate-300 mb-1">
                Elige tu Avatar de Superviviente:
              </label>
              <div className="flex items-center gap-3">
                {['/img/avatar1.jpg', '/img/avatar2.jpg', '/img/avatar3.jpg'].map((av, idx) => (
                  <img
                    key={av}
                    src={av}
                    alt={`Avatar ${idx + 1}`}
                    onClick={() => setAvatar(av)}
                    className={`w-12 h-12 rounded-full object-cover cursor-pointer border-2 transition-all hover:scale-105 ${
                      avatar === av ? 'border-yellow-400 scale-110 shadow-lg shadow-yellow-500/50' : 'border-slate-700 opacity-60'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-horror text-slate-300 mb-1">
                Usuario o Correo Electrónico
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej. brayan_cortes"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-red-950 focus:border-red-500 focus:outline-none text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-horror text-slate-300 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-red-950 focus:border-red-500 focus:outline-none text-white text-sm"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 font-horror text-xl text-white tracking-widest border border-red-400/50 shadow-xl cursor-pointer active:scale-95 transition-all"
            >
              {isRegister ? 'Registrarme' : 'Entrar al Juego'}
            </button>

            {!isRegister && (
              <span className="text-center text-xs font-mono text-slate-400 hover:text-amber-400 cursor-pointer pt-1">
                ¿Olvidaste tu contraseña?
              </span>
            )}

            {/* Divisor estético */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-red-950" />
              <span className="text-[11px] font-horror text-slate-400 uppercase tracking-wider">
                o continúa con
              </span>
              <div className="flex-1 h-px bg-red-950" />
            </div>

            {/* Botón de Google OAuth */}
            <GoogleAuthButton onSuccess={onLoginSuccess} isRegister={isRegister} />
          </form>
        </div>
      </div>
    </div>
  )
}
