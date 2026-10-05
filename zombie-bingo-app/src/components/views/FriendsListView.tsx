import React, { useState } from 'react'
import { ArrowLeft, Search, UserCheck, UserPlus, Circle } from 'lucide-react'
import { friendsService } from '../../services/friendsService'
import type { Friend } from '../../types/navigation'

interface FriendsListViewProps {
  onBack: () => void
  onFriendsUpdated?: () => void
}

export const FriendsListView: React.FC<FriendsListViewProps> = ({ onBack, onFriendsUpdated }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [survivors, setSurvivors] = useState<Friend[]>(friendsService.getAllSurvivors())
  const [friendsList, setFriendsList] = useState<Friend[]>(friendsService.getFriends())
  const [notification, setNotification] = useState<string | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSurvivors(friendsService.searchSurvivors(searchQuery))
  }

  const handleToggleFriend = (survivor: Friend) => {
    const isAlready = friendsList.some((f) => f.id === survivor.id)
    let updated: Friend[]
    if (isAlready) {
      updated = friendsService.removeFriend(survivor.id)
      setNotification(`Has eliminado a ${survivor.name} de tus amigos`)
    } else {
      updated = friendsService.addFriend(survivor)
      setNotification(`¡${survivor.name} añadido a tus amigos!`)
    }
    setFriendsList(updated)
    onFriendsUpdated?.()
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <div className="zombie-bg min-h-screen flex items-center justify-center p-4 relative selection:bg-red-500 selection:text-white">
      <div className="bg-black/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 max-w-4xl w-full border-2 border-red-900 shadow-2xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-red-950">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-yellow-400 font-horror text-base border border-red-900 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Refugio
          </button>
          <h2 className="text-2xl sm:text-3xl font-horror text-red-500 tracking-wider">
            Lista de Jugadores
          </h2>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-800/40">
            {friendsList.length} Amigos
          </span>
        </div>

        {notification && (
          <div className="mb-4 py-2 px-4 rounded-xl bg-red-950/80 border border-red-600 text-yellow-300 text-center font-horror text-sm animate-pulse">
            {notification}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Panel: Search & Filter (Authentic from original) */}
          <div className="md:col-span-4 bg-slate-950/80 p-5 rounded-2xl border border-red-950 flex flex-col gap-4">
            <h3 className="font-horror text-yellow-400 text-lg border-b border-red-950 pb-2">
              Buscar Superviviente
            </h3>
            <form onSubmit={handleSearch} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-horror text-slate-300 mb-1">
                  ID o Nombre de Jugador:
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ej. 101 o Sniper"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-red-950 focus:border-red-500 focus:outline-none text-white text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-rose-800 hover:from-red-600 hover:to-rose-700 font-horror text-white text-base flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <Search className="w-4 h-4" />
                Buscar Jugador
              </button>
            </form>
            <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-red-950">
              <p>💡 Tip: Busca por ID (101-108) o por nombre.</p>
              <p>Los amigos agregados aparecerán en la franja inferior del Refugio.</p>
            </div>
          </div>

          {/* Right Panel: Survivor List */}
          <div className="md:col-span-8 bg-slate-950/80 p-5 rounded-2xl border border-red-950 flex flex-col">
            <h3 className="font-horror text-yellow-400 text-lg mb-3 pb-2 border-b border-red-950 flex items-center justify-between">
              <span>Supervivientes Encontrados ({survivors.length})</span>
            </h3>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {survivors.map((survivor) => {
                const isFriend = friendsList.some((f) => f.id === survivor.id)
                return (
                  <div
                    key={survivor.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-red-950/80 hover:border-red-700/60 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={survivor.avatar}
                          alt={survivor.name}
                          className="w-11 h-11 rounded-full object-cover border border-red-800"
                        />
                        <Circle
                          className={`w-3 h-3 absolute bottom-0 right-0 fill-current ${
                            survivor.isOnline ? 'text-emerald-500' : 'text-slate-600'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="font-horror text-white text-base leading-tight">
                          {survivor.name}
                        </div>
                        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                          <span>ID: {survivor.id}</span>
                          <span>·</span>
                          <span className="text-amber-400">Nivel {survivor.level}</span>
                          <span>·</span>
                          <span className={survivor.isOnline ? 'text-emerald-400' : 'text-slate-500'}>
                            {survivor.isOnline ? 'En línea' : 'Desconectado'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleFriend(survivor)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-horror text-xs tracking-wider transition-all cursor-pointer ${
                        isFriend
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-red-950 hover:text-red-300 hover:border-red-700'
                          : 'bg-red-950/90 text-yellow-300 border border-red-800 hover:bg-red-900'
                      }`}
                    >
                      {isFriend ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Amigo</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Agregar</span>
                        </>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
