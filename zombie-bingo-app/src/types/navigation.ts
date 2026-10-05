export type ViewMode =
  | 'login'
  | 'home'
  | 'potions-guide'
  | 'create-room'
  | 'join-room'
  | 'lobby'
  | 'game'

export interface UserSession {
  id: string
  username: string
  email?: string
  avatar: string
  isAuthenticated: boolean
}

export interface RoomPlayer {
  id: string
  name: string
  avatar: string
  isHost: boolean
  isReady: boolean
}

export interface RoomData {
  id: string
  password?: string
  maxPlayers: number
  players: RoomPlayer[]
  isHost: boolean
}
