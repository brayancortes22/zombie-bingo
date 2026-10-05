import { useState, useEffect } from 'react'
import type { BingoBall, Opponent, PotionType } from '../types/bingo'

const INITIAL_BOTS: Opponent[] = [
  {
    id: 'bot-1',
    name: 'Cerebro Podrido',
    avatar: '🧟‍♂️',
    markedCount: 1, // Free center
    totalNeeded: 24,
    isFrozen: false,
    hasFog: false,
    hasShield: false,
    health: 100,
  },
  {
    id: 'bot-2',
    name: 'Necro-Mutante',
    avatar: '☣️',
    markedCount: 1,
    totalNeeded: 24,
    isFrozen: false,
    hasFog: false,
    hasShield: false,
    health: 100,
  },
  {
    id: 'bot-3',
    name: 'Toxik Walker',
    avatar: '💀',
    markedCount: 1,
    totalNeeded: 24,
    isFrozen: false,
    hasFog: false,
    hasShield: false,
    health: 100,
  },
]

interface UseZombieBotsProps {
  currentBall: BingoBall | null
  onAttackPlayer: (type: PotionType) => void
}

export function useZombieBots({ currentBall, onAttackPlayer }: UseZombieBotsProps) {
  const [opponents, setOpponents] = useState<Opponent[]>(INITIAL_BOTS)

  // React to new ball drawn
  useEffect(() => {
    if (!currentBall) return

    setOpponents((prev) =>
      prev.map((bot) => {
        if (bot.isFrozen || bot.hasFog) return bot // Disabled while under effect

        // Probabilities based on bot difficulty
        let chance = 0.35
        if (bot.id === 'bot-2') chance = 0.55
        if (bot.id === 'bot-3') chance = 0.45

        if (Math.random() < chance) {
          return {
            ...bot,
            markedCount: Math.min(bot.totalNeeded, bot.markedCount + 1),
          }
        }
        return bot
      })
    )
  }, [currentBall])

  // Periodic bot attack against player
  useEffect(() => {
    const attackInterval = setInterval(() => {
      // 30% chance each interval that Necro-Mutante strikes the player
      if (Math.random() < 0.35) {
        const attacks: PotionType[] = ['fog', 'freeze', 'vertigo']
        const chosen = attacks[Math.floor(Math.random() * attacks.length)]
        onAttackPlayer(chosen)
      }
    }, 28000)

    return () => clearInterval(attackInterval)
  }, [onAttackPlayer])

  // Apply player potion effect to opponents
  const applyPlayerPotionToBots = (type: PotionType) => {
    setOpponents((prev) =>
      prev.map((bot) => {
        if (type === 'fog') {
          return { ...bot, hasFog: true }
        }
        if (type === 'freeze') {
          return { ...bot, isFrozen: true }
        }
        return bot
      })
    )

    // Clear enemy debuffs after duration
    setTimeout(() => {
      setOpponents((prev) =>
        prev.map((b) => ({
          ...b,
          hasFog: false,
          isFrozen: false,
        }))
      )
    }, 7000)
  }

  const resetBots = () => {
    setOpponents(INITIAL_BOTS)
  }

  return {
    opponents,
    applyPlayerPotionToBots,
    resetBots,
  }
}
