import React, { useState } from 'react'
import type { RoomData, UserSession } from '../../types/navigation'

interface CreateRoomViewProps {
  user: UserSession
  onCreateRoom: (room: RoomData) => void
  onCancel: () => void
}

export const CreateRoomView: React.FC<CreateRoomViewProps> = ({
  user,
  onCreateRoom,
  onCancel,
}) => {
  const [password, setPassword] = useState('1234')
  const [maxPlayers, setMaxPlayers] = useState(4)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const roomId = Math.floor(1000 + Math.random() * 9000).toString()
    onCreateRoom({
      id: roomId,
      password,
      maxPlayers,
      isHost: true,
      players: [
        {
          id: user.id,
          name: user.username,
          avatar: user.avatar,
          isHost: true,
          isReady: true,
        },
      ],
    })
  }

  return (
    <div className="zombie-bg min-h-screen flex items-center justify-center p-4 relative selection:bg-red-500 selection:text-white">
      <div className="bg-black/85 backdrop-blur-md rounded-3xl p-6 sm:p-10 max-w-lg w-full border-2 border-red-950 shadow-2xl relative z-10">
        <h1 className="text-4xl font-horror text-center text-red-500 tracking-wider mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
          Crea tu sala
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-horror text-amber-400 mb-1 tracking-wider">
              Contraseña de la Sala:
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña requerida"
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border-2 border-red-950 focus:border-red-500 focus:outline-none text-white text-base font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-horror text-amber-400 mb-1 tracking-wider">
              Número de Jugadores (Máximo 50):
            </label>
            <input
              type="number"
              min={2}
              max={50}
              required
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Math.min(50, Math.max(2, parseInt(e.target.value) || 2)))}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border-2 border-red-950 focus:border-red-500 focus:outline-none text-white text-base font-mono"
            />
          </div>

          <div className="flex items-center gap-4 mt-4">
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 font-horror text-2xl text-white tracking-widest border border-green-400/50 shadow-xl cursor-pointer active:scale-95 transition-all"
            >
              Aceptar
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 font-horror text-2xl text-slate-300 tracking-widest border border-red-950 cursor-pointer active:scale-95 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
