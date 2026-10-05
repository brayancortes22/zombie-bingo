import { useState, useEffect, useCallback, useMemo } from 'react'
import type { BingoBall, BoardCell, PotionType, WinPattern } from '../types/bingo'
import { soundEngine } from '../services/soundEngine'

const BALL_COLORS = {
  B: '#3B82F6', // Blue
  I: '#8B5CF6', // Purple
  N: '#10B981', // Toxic Green
  G: '#F97316', // Orange
  O: '#EF4444', // Crimson Blood
}

const RANGES = {
  B: { min: 1, max: 15 },
  I: { min: 16, max: 30 },
  N: { min: 31, max: 45 },
  G: { min: 46, max: 60 },
  O: { min: 61, max: 75 },
}

export function useBingoGame(options: { onBallDrawn?: (ball: BingoBall) => void } = {}) {
  const { onBallDrawn } = options
  // Generate Fresh 5x5 Card
  const generateBoard = useCallback((): BoardCell[][] => {
    const letters: (keyof typeof RANGES)[] = ['B', 'I', 'N', 'G', 'O']
    const cols: number[][] = letters.map((letra) => {
      const { min, max } = RANGES[letra]
      const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i)
      // Shuffle pool
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[pool[i], pool[j]] = [pool[j], pool[i]]
      }
      return pool.slice(0, 5)
    })

    const grid: BoardCell[][] = []
    for (let r = 0; r < 5; r++) {
      const row: BoardCell[] = []
      for (let c = 0; c < 5; c++) {
        const isFree = r === 2 && c === 2
        row.push({
          row: r,
          col: c,
          letter: letters[c],
          number: cols[c][r],
          isMarked: isFree,
          isFree,
          isBlocked: false,
          isFrozen: false,
        })
      }
      grid.push(row)
    }
    return grid
  }, [])

  // Generate 75-Ball Tumbler Pool
  const generateTumbler = useCallback((): BingoBall[] => {
    const balls: BingoBall[] = []
    const letters: (keyof typeof RANGES)[] = ['B', 'I', 'N', 'G', 'O']
    letters.forEach((letra) => {
      const { min, max } = RANGES[letra]
      for (let n = min; n <= max; n++) {
        balls.push({
          letter: letra,
          number: n,
          color: BALL_COLORS[letra],
        })
      }
    })
    // Shuffle
    for (let i = balls.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[balls[i], balls[j]] = [balls[j], balls[i]]
    }
    return balls
  }, [])

  const [grid, setGrid] = useState<BoardCell[][]>(generateBoard)
  const [tumbler, setTumbler] = useState<BingoBall[]>(generateTumbler)
  const [drawnBalls, setDrawnBalls] = useState<BingoBall[]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [isAutoDraw, setIsAutoDraw] = useState(false)
  const [energy, setEnergy] = useState(30)
  const [maxEnergy] = useState(100)
  const [score, setScore] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [winPattern, setWinPattern] = useState<WinPattern>(null)
  const [patternName, setPatternName] = useState<string>('')
  const [hasShield, setHasShield] = useState(false)

  // Debuff states from enemy attacks
  const [fogDuration, setFogDuration] = useState(0)
  const [freezeDuration, setFreezeDuration] = useState(0)
  const [vertigoDuration, setVertigoDuration] = useState(0)

  // Potion Cooldowns
  const [cooldowns, setCooldowns] = useState<Record<PotionType, number>>({
    fog: 0,
    freeze: 0,
    vertigo: 0,
    shield: 0,
    nuke: 0,
  })

  // Timer loop for buffs, debuffs, cooldowns, and elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
      setFogDuration((prev) => Math.max(0, prev - 1))
      setFreezeDuration((prev) => Math.max(0, prev - 1))
      setVertigoDuration((prev) => Math.max(0, prev - 1))

      setCooldowns((prev) => ({
        fog: Math.max(0, prev.fog - 1),
        freeze: Math.max(0, prev.freeze - 1),
        vertigo: Math.max(0, prev.vertigo - 1),
        shield: Math.max(0, prev.shield - 1),
        nuke: Math.max(0, prev.nuke - 1),
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const drawnNumbers = useMemo(() => {
    return new Set(drawnBalls.map((b) => b.number))
  }, [drawnBalls])

  const currentBall = drawnBalls[drawnBalls.length - 1] || null

  // Pattern Verification Logic
  const checkWinPatterns = useCallback((currentGrid: BoardCell[][]) => {
    const isCellMarked = (r: number, c: number) => currentGrid[r][c].isMarked

    // 1. Horizontal Lines
    for (let r = 0; r < 5; r++) {
      if ([0, 1, 2, 3, 4].every((c) => isCellMarked(r, c))) {
        return { pattern: 'line-horizontal' as WinPattern, name: `Línea Horizontal (Fila ${r + 1})` }
      }
    }

    // 2. Vertical Columns
    for (let c = 0; c < 5; c++) {
      if ([0, 1, 2, 3, 4].every((r) => isCellMarked(r, c))) {
        return { pattern: 'line-vertical' as WinPattern, name: `Columna Vertical (${['B', 'I', 'N', 'G', 'O'][c]})` }
      }
    }

    // 3. Diagonal
    if ([0, 1, 2, 3, 4].every((i) => isCellMarked(i, i))) {
      return { pattern: 'line-diagonal' as WinPattern, name: 'Diagonal Principal' }
    }
    if ([0, 1, 2, 3, 4].every((i) => isCellMarked(i, 4 - i))) {
      return { pattern: 'line-diagonal' as WinPattern, name: 'Diagonal Inversa' }
    }

    // 4. Four Corners
    if (isCellMarked(0, 0) && isCellMarked(0, 4) && isCellMarked(4, 0) && isCellMarked(4, 4)) {
      return { pattern: 'four-corners' as WinPattern, name: 'Cuatro Esquinas' }
    }

    // 5. Blackout
    let allMarked = true
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (!isCellMarked(r, c)) allMarked = false
      }
    }
    if (allMarked) {
      return { pattern: 'blackout' as WinPattern, name: '¡APOCALIPSIS BINGO COMPLETO!' }
    }

    return null
  }, [])

  // Mark Cell
  const markCell = useCallback(
    (row: number, col: number) => {
      if (freezeDuration > 0) return // Player frozen

      setGrid((prev) => {
        const next = prev.map((r, rIdx) =>
          r.map((cell, cIdx) => {
            if (rIdx === row && cIdx === col) {
              return { ...cell, isMarked: true }
            }
            return cell
          })
        )

        // Add energy and score
        setEnergy((e) => Math.min(maxEnergy, e + 15))
        setScore((s) => s + 100)

        // Check patterns
        const result = checkWinPatterns(next)
        if (result && !winPattern) {
          setWinPattern(result.pattern)
          setPatternName(result.name)
          setScore((s) => s + 1000)
        }

        return next
      })
    },
    [freezeDuration, maxEnergy, checkWinPatterns, winPattern]
  )

  // Draw Ball
  const drawBall = useCallback(() => {
    if (tumbler.length === 0 || isSpinning) return

    setIsSpinning(true)
    soundEngine.playRoll()

    setTimeout(() => {
      const nextBall = tumbler[0]
      setTumbler((prev) => prev.slice(1))
      setDrawnBalls((prev) => [...prev, nextBall])
      setIsSpinning(false)
      soundEngine.playBallPop()
      onBallDrawn?.(nextBall)
    }, 900)
  }, [tumbler, isSpinning, onBallDrawn])

  // Auto-draw loop (saca balotas cada 3.2 segundos en modo automático)
  useEffect(() => {
    if (!isAutoDraw || winPattern) return
    const interval = setInterval(() => {
      drawBall()
    }, 3200)
    return () => clearInterval(interval)
  }, [isAutoDraw, winPattern, drawBall])

  // Auto-Dauber: busca y marca automáticamente la celda en el cartón cuando sale la balota
  useEffect(() => {
    if (!isAutoDraw || !currentBall || winPattern) return

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const cell = grid[r][c]
        if (cell.number === currentBall.number && !cell.isMarked && !cell.isBlocked) {
          const timer = setTimeout(() => {
            markCell(r, c)
            soundEngine.playStamp()
          }, 450)
          return () => clearTimeout(timer)
        }
      }
    }
  }, [currentBall, isAutoDraw, grid, markCell, winPattern])

  // Detener modo automático y celebrar al completar patrón ganador
  useEffect(() => {
    if (winPattern && isAutoDraw) {
      soundEngine.playVictory()
      setIsAutoDraw(false)
    }
  }, [winPattern, isAutoDraw, setIsAutoDraw])

  // Inject Ball from Remote Host
  const injectBall = useCallback((ball: BingoBall) => {
    setIsSpinning(true)
    soundEngine.playRoll()

    setTimeout(() => {
      setDrawnBalls((prev) => [...prev, ball])
      setIsSpinning(false)
      soundEngine.playBallPop()
    }, 900)
  }, [])

  // Cast Potion
  const castPotion = useCallback(
    (type: PotionType) => {
      const costs: Record<PotionType, number> = {
        fog: 30,
        freeze: 40,
        vertigo: 45,
        shield: 35,
        nuke: 80,
      }
      const cost = costs[type]
      if (energy < cost) return

      setEnergy((e) => e - cost)
      setCooldowns((cd) => ({ ...cd, [type]: 12 }))

      if (type === 'shield') {
        setHasShield(true)
      }
    },
    [energy]
  )

  // Receive Enemy Attack
  const receiveEnemyAttack = useCallback(
    (type: PotionType) => {
      if (hasShield) {
        setHasShield(false)
        soundEngine.playPotion()
        return // Shield blocked attack
      }

      if (type === 'fog') {
        setFogDuration(8)
        soundEngine.playZombieGroan()
      } else if (type === 'freeze') {
        setFreezeDuration(6)
        soundEngine.playFreeze()
      } else if (type === 'vertigo') {
        setVertigoDuration(7)
      }
    },
    [hasShield]
  )

  // Reset Game
  const resetGame = useCallback(() => {
    setGrid(generateBoard())
    setTumbler(generateTumbler())
    setDrawnBalls([])
    setIsSpinning(false)
    setIsAutoDraw(false)
    setEnergy(30)
    setScore(0)
    setElapsedTime(0)
    setWinPattern(null)
    setPatternName('')
    setHasShield(false)
    setFogDuration(0)
    setFreezeDuration(0)
    setVertigoDuration(0)
  }, [generateBoard, generateTumbler])

  return {
    grid,
    currentBall,
    drawnBalls,
    drawnNumbers,
    isSpinning,
    isAutoDraw,
    setIsAutoDraw,
    energy,
    maxEnergy,
    score,
    elapsedTime,
    winPattern,
    patternName,
    cooldowns,
    fogDuration,
    freezeDuration,
    vertigoDuration,
    hasShield,
    drawBall,
    injectBall,
    markCell,
    castPotion,
    receiveEnemyAttack,
    resetGame,
  }
}
