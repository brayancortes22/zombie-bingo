import React, { useState } from 'react'
import type { RoomData, UserSession, RoomPlayer } from '../../types/navigation'
import { multiplayerService } from '../../services/multiplayerService'

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
  const [roomId, setRoomId] = useState('')
  const [password, setPassword] = useState('1234')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const clientPlayer: RoomPlayer = {
      id: user.id,
      name: user.username,
      avatar: user.avatar,
      isHost: false,
      isReady: false,
    }

    try {
      const room = await multiplayerService.joinRoom(roomId, password || undefined, clientPlayer)
      onJoinSuccess(room)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con la sala'
      setError(msg)
      setLoading(false)
    }
  }

  return (
    <div className="zombie-bg min-h-screen flex items-center justify-center p-4 relative selection:bg-red-500 selection:text-white">
      <div className="bg-black/85 backdrop-blur-md rounded-3xl p-6 sm:p-10 max-w-lg w-full border-2 border-red-950 shadow-2xl relative z-10">
        <h1 className="text-4xl font-horror text-center text-red-500 tracking-wider mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
          Unirse a una sala P2P
        </h1>

        {error && (
          <div className="mb-4 py-2 px-3 rounded-xl bg-red-950/80 border border-red-600 text-yellow-300 text-xs font-horror text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-horror text-amber-400 mb-1 tracking-wider">
              Código / ID de la Sala:
            </label>
            <input
              type="text"
              required
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="Ej. 777 o SALA1"
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border-2 border-red-950 focus:border-red-500 focus:outline-none text-white text-base font-mono uppercase tracking-widest font-bold text-center"
            />
          </div>

          <div>
            <label className="block text-sm font-horror text-amber-400 mb-1 tracking-wider">
              Contraseña de la Sala (si requiere):
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña de acceso"
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border-2 border-red-950 focus:border-red-500 focus:outline-none text-white text-base font-mono text-center"
            />
          </div>

          <div className="flex items-center gap-4 mt-4">
            <button
              type="submit"
              disabled={loading || !roomId.trim()}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 disabled:opacity-50 font-horror text-2xl text-white tracking-widest border border-green-400/50 shadow-xl cursor-pointer active:scale-95 transition-all"
            >
              {loading ? 'Conectando con Host...' : 'Unirse a Sala'}
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
