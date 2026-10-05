import React, { useState } from 'react'
import type { RoomData, UserSession } from '../../types/navigation'

interface JoinRoomViewProps {
  user: UserSession
  onJoinSuccess: (room: RoomData) => void
  onCancel: () => void
}

export const JoinRoomView: React.FC<JoinRoomViewProps> = ({
  user,
  onJoinSuccess,
  onCancel,
}) => {
  const [roomId, setRoomId] = useState('777')
  const [password, setPassword] = useState('1234')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onJoinSuccess({
      id: roomId,
      password,
      maxPlayers: 4,
      isHost: false,
      players: [
        {
          id: 'host-1',
          name: 'Anfitrión Zombie',
          avatar: '/img/avatar2.jpg',
          isHost: true,
          isReady: true,
        },
        {
          id: user.id,
          name: user.username,
          avatar: user.avatar,
          isHost: false,
          isReady: true,
        },
      ],
    })
  }

  return (
    <div className="zombie-bg min-h-screen flex items-center justify-center p-4 relative selection:bg-red-500 selection:text-white">
      <div className="bg-black/85 backdrop-blur-md rounded-3xl p-6 sm:p-10 max-w-lg w-full border-2 border-red-950 shadow-2xl relative z-10">
        <h1 className="text-4xl font-horror text-center text-red-500 tracking-wider mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
          Unirse a una sala
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-horror text-amber-400 mb-1 tracking-wider">
              ID de la Sala:
            </label>
            <input
              type="text"
              required
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Ej. 1042"
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border-2 border-red-950 focus:border-red-500 focus:outline-none text-white text-base font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-horror text-amber-400 mb-1 tracking-wider">
              Contraseña de la Sala:
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña de acceso"
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border-2 border-red-950 focus:border-red-500 focus:outline-none text-white text-base font-mono"
            />
          </div>

          <div className="flex items-center gap-4 mt-4">
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 font-horror text-2xl text-white tracking-widest border border-green-400/50 shadow-xl cursor-pointer active:scale-95 transition-all"
            >
              Unirse
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
