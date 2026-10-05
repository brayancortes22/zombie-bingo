import React from 'react'
import type { BoardCell } from '../../types/bingo'
import { soundEngine } from '../../services/soundEngine'
import { Skull, Snowflake, ShieldAlert } from 'lucide-react'

interface BingoCellProps {
  cell: BoardCell
  canMark: boolean
  onMark: (row: number, col: number) => void
}

export const BingoCell: React.FC<BingoCellProps> = ({ cell, canMark, onMark }) => {
  const handleClick = () => {
    if (cell.isFree || cell.isMarked || cell.isFrozen) return
    soundEngine.playStamp()
    onMark(cell.row, cell.col)
  }

  if (cell.isFree) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[58px] sm:min-h-[72px] rounded-xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-emerald-900/40 border-2 border-emerald-500/60 shadow-lg text-emerald-400 select-none">
        <Skull className="w-6 h-6 animate-pulse text-emerald-400" />
        <span className="text-[10px] font-extrabold tracking-widest uppercase mt-0.5 text-emerald-300">
          LIBRE
        </span>
        <div className="absolute inset-0 bg-emerald-500/10 rounded-xl pointer-events-none" />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={cell.isMarked || cell.isFrozen || (!canMark && !cell.isMarked)}
      className={`relative flex items-center justify-center min-h-[58px] sm:min-h-[72px] rounded-xl font-display font-bold text-lg sm:text-2xl transition-all duration-200 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-95 ${
        cell.isMarked
          ? 'bg-gradient-to-br from-emerald-600 to-teal-900 text-white shadow-emerald-900/50 shadow-md border border-emerald-400/80'
          : canMark
          ? 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border border-emerald-500/40 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-950/30'
          : 'bg-slate-900/70 text-slate-400 border border-slate-800 hover:border-slate-700'
      } ${cell.isFrozen ? 'ring-2 ring-cyan-400 bg-cyan-950/60 text-cyan-200 cursor-not-allowed' : ''} ${
        cell.isBlocked ? 'ring-2 ring-purple-600 bg-purple-950/60 cursor-not-allowed' : ''
      }`}
    >
      {/* Number */}
      <span className="tabular-nums tracking-tight z-10">
        {cell.number}
      </span>

      {/* Marked Zombie Splat Stamp */}
      {cell.isMarked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full border-2 border-emerald-300/40 bg-emerald-500/20 animate-stamp flex items-center justify-center">
            <span className="text-emerald-300 font-extrabold text-xs tracking-tighter opacity-80 rotate-[-12deg]">
              INFECTADO
            </span>
          </div>
        </div>
      )}

      {/* Frost Indicator */}
      {cell.isFrozen && (
        <div className="absolute top-1 right-1 text-cyan-300">
          <Snowflake className="w-3.5 h-3.5 animate-spin" />
        </div>
      )}

      {/* Blocked Indicator */}
      {cell.isBlocked && (
        <div className="absolute top-1 right-1 text-purple-400">
          <ShieldAlert className="w-3.5 h-3.5" />
        </div>
      )}
    </button>
  )
}
