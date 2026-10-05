import type { RoomPlayer } from './navigation'

export interface BallotData {
  number: number
  letter: 'B' | 'I' | 'N' | 'G' | 'O'
}

export type PeerMessageType =
  | 'JOIN_REQUEST'
  | 'JOIN_ACCEPTED'
  | 'JOIN_REJECTED'
  | 'ROOM_UPDATE'
  | 'TOGGLE_READY'
  | 'START_GAME'
  | 'BALLOT_DRAWN'
  | 'PLAYER_PROGRESS'
  | 'BINGO_CLAIM'
  | 'LEAVE_ROOM'

export interface PeerMessage {
  type: PeerMessageType
  senderId: string
  payload?: any
}

export interface JoinPayload {
  player: RoomPlayer
  password?: string
}

export interface RoomUpdatePayload {
  roomId: string
  maxPlayers: number
  players: RoomPlayer[]
}

export interface ProgressPayload {
  playerId: string
  markedCount: number
}

export interface BingoClaimPayload {
  winnerId: string
  winnerName: string
}
