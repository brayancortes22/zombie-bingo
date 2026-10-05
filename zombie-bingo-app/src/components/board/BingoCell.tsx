import React from 'react'
import type { BoardCell } from '../../types/bingo'
import { soundEngine } from '../../services/soundEngine'
import { Snowflake, ShieldAlert } from 'lucide-react'

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
      <div className="relative flex flex-col items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-red-950 via-slate-900 to-black border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] select-none">
        <img
          src="/img/calabasa.jpg"
          alt="Libre"
          className="w-7 h-7 sm:w-9 sm:h-9 object-cover rounded-full border border-amber-400"
        />
        <span className="text-[9px] font-horror text-amber-300 uppercase tracking-tighter">
          LIBRE
        </span>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={cell.isMarked || cell.isFrozen || (!canMark && !cell.isMarked)}
      className={`relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full font-horror text-xl sm:text-2xl transition-all duration-200 select-none cursor-pointer focus:outline-none active:scale-95 shadow-lg ${
        cell.isMarked
          ? 'bg-red-950/80 text-white border-2 border-red-500 shadow-[0_0_18px_rgba(239,68,68,0.7)]'
          : canMark
          ? 'bg-[#76a1ff] hover:bg-[#5b8cf7] text-slate-950 border-2 border-yellow-400 animate-pulse hover:scale-105 shadow-[0_0_15px_rgba(118,161,255,0.7)]'
          : 'bg-[#567bcc]/90 hover:bg-[#4d6ec0] text-slate-900 border border-slate-700/80'
      } ${cell.isFrozen ? 'ring-4 ring-cyan-400 bg-cyan-950/90 text-cyan-200 cursor-not-allowed' : ''} ${
        cell.isBlocked ? 'ring-4 ring-purple-600 bg-purple-950/90 cursor-not-allowed' : ''
      }`}
    >
      {/* Number */}
      <span className="z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        {cell.number}
      </span>

      {/* Real Blood / Footprint Stamp when Marked */}
      {cell.isMarked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-full overflow-hidden">
          <img
            src="/img/sangre.png"
            alt="Marcado"
            className="w-full h-full object-cover opacity-85 animate-stamp"
          />
        </div>
      )}

      {/* Freeze Indicator */}
      {cell.isFrozen && (
        <div className="absolute top-0.5 right-0.5 text-cyan-300 z-20">
          <Snowflake className="w-4 h-4 animate-spin" />
        </div>
      )}

      {/* Blocked Indicator */}
      {cell.isBlocked && (
        <div className="absolute top-0.5 right-0.5 text-purple-400 z-20">
          <ShieldAlert className="w-4 h-4" />
        </div>
      )}
    </button>
  )
}
