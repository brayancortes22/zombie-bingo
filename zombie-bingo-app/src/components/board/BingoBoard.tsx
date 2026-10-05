import React from 'react'
import type { BoardCell } from '../../types/bingo'
import { BingoCell } from './BingoCell'

interface BingoBoardProps {
  grid: BoardCell[][]
  drawnNumbers: Set<number>
  onMarkCell: (row: number, col: number) => void
  isVertigoActive?: boolean
}

const COLUMNS = [
  { letter: 'B', range: '1-15', bg: 'bg-blue-600/20 text-blue-400 border-blue-500/30' },
  { letter: 'I', range: '16-30', bg: 'bg-purple-600/20 text-purple-400 border-purple-500/30' },
  { letter: 'N', range: '31-45', bg: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' },
  { letter: 'G', range: '46-60', bg: 'bg-amber-600/20 text-amber-400 border-amber-500/30' },
  { letter: 'O', range: '61-75', bg: 'bg-rose-600/20 text-rose-400 border-rose-500/30' },
]

export const BingoBoard: React.FC<BingoBoardProps> = ({
  grid,
  drawnNumbers,
  onMarkCell,
  isVertigoActive = false,
}) => {
  return (
    <div
      className={`glass-panel p-3.5 sm:p-5 rounded-2xl w-full max-w-xl mx-auto shadow-2xl border border-slate-700/60 transition-transform duration-500 ${
        isVertigoActive ? 'rotate-180 scale-95' : ''
      }`}
    >
      {/* Column Letter Headers */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-2.5 sm:mb-3">
        {COLUMNS.map((col) => (
          <div
            key={col.letter}
            className={`flex flex-col items-center justify-center py-1.5 sm:py-2 rounded-xl border ${col.bg} shadow-inner font-display font-black text-xl sm:text-2xl tracking-wider select-none`}
          >
            <span>{col.letter}</span>
            <span className="text-[10px] font-mono opacity-70 tracking-tighter">
              {col.range}
            </span>
          </div>
        ))}
      </div>

      {/* 5x5 Cells Grid */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {grid.map((rowCells, rIdx) =>
          rowCells.map((cell, cIdx) => (
            <BingoCell
              key={`${rIdx}-${cIdx}`}
              cell={cell}
              canMark={drawnNumbers.has(cell.number)}
              onMark={onMarkCell}
            />
          ))
        )}
      </div>
    </div>
  )
}
