import type { Friend } from '../types/navigation'

const STORAGE_KEY = 'zombie_bingo_friends_v1'

export const INITIAL_SURVIVORS: Friend[] = [
  { id: '101', name: 'Carlos_Sniper', avatar: '/img/avatar1.jpg', isOnline: true, level: 14 },
  { id: '102', name: 'Elena_Doc', avatar: '/img/avatar2.jpg', isOnline: true, level: 22 },
  { id: '103', name: 'ZombieHunter99', avatar: '/img/avatar3.jpg', isOnline: false, level: 8 },
  { id: '104', name: 'Sarah_Biohazard', avatar: '/img/avatar1.jpg', isOnline: true, level: 19 },
  { id: '105', name: 'Capitan_Ramos', avatar: '/img/avatar2.jpg', isOnline: false, level: 30 },
  { id: '106', name: 'Tati_Crossbow', avatar: '/img/avatar3.jpg', isOnline: true, level: 12 },
  { id: '107', name: 'Nico_Survivor', avatar: '/img/avatar1.jpg', isOnline: true, level: 16 },
  { id: '108', name: 'Valen_Chemist', avatar: '/img/avatar2.jpg', isOnline: false, level: 25 },
]

export const friendsService = {
  getFriends(): Friend[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        return JSON.parse(data)
      }
      // Por defecto, primeros 2 supervivientes agregados como en la demo original
      const defaults = [INITIAL_SURVIVORS[0], INITIAL_SURVIVORS[1]]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
      return defaults
    } catch {
      return [INITIAL_SURVIVORS[0], INITIAL_SURVIVORS[1]]
    }
  },

  addFriend(friend: Friend): Friend[] {
    const friends = this.getFriends()
    if (!friends.some((f) => f.id === friend.id)) {
      const updated = [...friends, friend]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    }
    return friends
  },

  removeFriend(id: string): Friend[] {
    const friends = this.getFriends()
    const updated = friends.filter((f) => f.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  },

  isFriend(id: string): boolean {
    return this.getFriends().some((f) => f.id === id)
  },

  getAllSurvivors(): Friend[] {
    return INITIAL_SURVIVORS
  },

  searchSurvivors(query: string): Friend[] {
    const clean = query.trim().toLowerCase()
    if (!clean) return INITIAL_SURVIVORS
    return INITIAL_SURVIVORS.filter(
      (s) => s.id.toLowerCase().includes(clean) || s.name.toLowerCase().includes(clean)
    )
  },
}
