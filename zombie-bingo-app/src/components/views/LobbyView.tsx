import React, { useEffect, useState } from 'react'
import type { RoomData, UserSession } from '../../types/navigation'
import { multiplayerService } from '../../services/multiplayerService'
import { Play, LogOut, Users, Copy, Radio } from 'lucide-react'

interface LobbyViewProps {
  user: UserSession
  room: RoomData
  onStartGame: () => void
  onLeaveRoom: () => void
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  room: initialRoom,
  onStartGame,
  onLeaveRoom,
}) => {
  const [currentRoom, setCurrentRoom] = useState<RoomData>(initialRoom)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    multiplayerService.onRoomUpdate((updated) => {
      setCurrentRoom({ ...updated })
    })

    multiplayerService.onGameStart(() => {
      onStartGame()
    })
  }, [onStartGame])

  const copyRoomId = () => {
    navigator.clipboard?.writeText(currentRoom.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleStart = () => {
    if (currentRoom.isHost) {
      multiplayerService.startGame()
    } else {
      onStartGame()
    }
  }

  const handleLeave = () => {
    multiplayerService.leaveRoom()
    onLeaveRoom()
  }

  return (
    <div className="zombie-bg min-h-screen flex items-center justify-center p-4 relative selection:bg-red-500 selection:text-white">
      <div className="bg-black/85 backdrop-blur-md rounded-3xl p-6 sm:p-10 max-w-xl w-full border-2 border-red-950 shadow-2xl relative z-10 text-center">
        {/* Room Header */}
        <h1 className="text-4xl sm:text-5xl font-horror text-red-500 tracking-wider mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
          Sala de Espera P2P
        </h1>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-yellow-500/50 mb-6">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-horror text-slate-300">Código de Sala:</span>
          <span className="text-lg font-horror text-yellow-400 font-bold tracking-widest uppercase">
            {currentRoom.id}
          </span>
          <button
            type="button"
            onClick={copyRoomId}
            className="p-1 rounded text-slate-400 hover:text-white cursor-pointer ml-1"
            title="Copiar código de sala"
          >
            <Copy className="w-4 h-4" />
          </button>
          {copied && <span className="text-[10px] text-emerald-400 font-mono">¡Copiado!</span>}
        </div>

        {/* Players List */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-red-950 mb-6 text-left">
          <div className="flex items-center justify-between text-xs font-horror text-slate-400 mb-3">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Supervivientes Conectados ({currentRoom.players.length} / {currentRoom.maxPlayers}):</span>
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>En vivo WebRTC</span>
            </span>
          </div>

          <div className="space-y-2.5">
            {currentRoom.players.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-red-500/80"
                  />
                  <div>
                    <h3 className="text-sm font-horror text-amber-300 leading-tight">
                      {p.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      {p.isHost ? '👑 Anfitrión (Host)' : 'Superviviente Conectado'}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-horror px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Listo
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-3">
          {currentRoom.isHost ? (
            <button
              type="button"
              onClick={handleStart}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 font-horror text-2xl text-white tracking-widest border border-yellow-400/60 shadow-xl cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-6 h-6 fill-white" />
              <span>Comenzar Partida Multijugador</span>
            </button>
          ) : (
            <div className="py-3 px-4 rounded-2xl bg-slate-900/90 border border-yellow-500/40 text-sm font-horror text-yellow-300 animate-pulse">
              Esperando a que el anfitrión inicie la partida para todos...
            </div>
          )}

          <button
            type="button"
            onClick={handleLeave}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 font-horror text-lg text-slate-400 hover:text-red-400 border border-red-950 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Abandonar Sala</span>
          </button>
        </div>
      </div>
    </div>
  )
}
