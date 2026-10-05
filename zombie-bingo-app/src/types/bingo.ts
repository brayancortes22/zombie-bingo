export type BingoLetter = 'B' | 'I' | 'N' | 'G' | 'O'

export interface BingoBall {
  letter: BingoLetter
  number: number
  color: string
}

export interface BoardCell {
  row: number
  col: number
  letter: BingoLetter
  number: number
  isMarked: boolean
  isFree?: boolean
  isBlocked?: boolean
  isFrozen?: boolean
}

export type PotionType = 'fog' | 'freeze' | 'vertigo' | 'shield' | 'nuke'

export interface Potion {
  id: PotionType
  name: string
  description: string
  duration: number
  energyCost: number
  icon: string
  color: string
  cooldownRemaining: number
}

export interface Opponent {
  id: string
  name: string
  avatar: string
  markedCount: number
  totalNeeded: number
  isFrozen: boolean
  hasFog: boolean
  hasShield: boolean
  health: number
}

export type WinPattern = 'line-horizontal' | 'line-vertical' | 'line-diagonal' | 'four-corners' | 'zombie-cross' | 'blackout' | null

export interface GameStats {
  ballsDrawn: number
  marksCount: number
  potionsUsed: number
  elapsedTime: number
  score: number
}
