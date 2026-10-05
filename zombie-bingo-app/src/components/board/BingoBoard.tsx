import React from 'react'
import type { BoardCell } from '../../types/bingo'
import { BingoCell } from './BingoCell'

interface BingoBoardProps {
  grid: BoardCell[][]
  drawnNumbers: Set<number>
  onMarkCell: (row: number, col: number) => void
  isVertigoActive?: boolean
  onCallBingo?: () => void
  onNewCard?: () => void
}

const COLUMNS = ['B', 'I', 'N', 'G', 'O']

export const BingoBoard: React.FC<BingoBoardProps> = ({
  grid,
  drawnNumbers,
  onMarkCell,
  isVertigoActive = false,
  onCallBingo,
  onNewCard,
}) => {
  return (
    <div
      className={`marco-zombie p-4 sm:p-7 w-full max-w-xl mx-auto shadow-2xl transition-transform duration-500 relative ${
        isVertigoActive ? 'rotate-180 scale-95' : ''
      }`}
    >
      {/* Column Letter Headers (B I N G O) */}
      <div className="grid grid-cols-5 gap-2 sm:gap-4 mb-3 sm:mb-4">
        {COLUMNS.map((letra) => (
          <div
            key={letra}
            className="flex items-center justify-center font-horror text-4xl sm:text-5xl text-[#ffd620] drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] select-none tracking-widest"
          >
            {letra}
          </div>
        ))}
      </div>

      {/* 5x5 Circular Cells Grid */}
      <div className="grid grid-cols-5 gap-2 sm:gap-4 justify-items-center mb-5">
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

      {/* Original Action Buttons Strip */}
      <div className="flex items-center justify-center gap-4 pt-3 border-t border-red-950/60">
        <button
          type="button"
          onClick={onCallBingo}
          className="btn-zombie-bingo px-8 py-3.5 rounded-xl font-horror text-2xl text-white font-bold cursor-pointer select-none tracking-widest"
        >
          ¡BINGO!
        </button>

        <button
          type="button"
          onClick={onNewCard}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-horror text-lg tracking-wider border border-green-400/50 shadow-lg cursor-pointer transition-all active:scale-95"
        >
          Generar Cartón
        </button>
      </div>
    </div>
  )
}
