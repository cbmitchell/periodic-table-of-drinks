import { Box } from '@mui/material'
import { memo, useEffect, useMemo, useState } from 'react'
import {
  CELL_HEIGHT,
  CELL_WIDTH,
  COMPACT_CELL_HEIGHT,
  COMPACT_CELL_WIDTH,
  DrinkCell,
  type DrinkCellProps,
} from './DrinkCell'

const GAP_PX = 4 // MUI gap: 0.5 = 4px
const COMPACT_LABEL_COL_W = 20 // width of row-number column in compact mode
const COMPACT_LABEL_ROW_H = 16 // height of column-number row in compact mode
const COMPACT_TABLE_WIDTH =
  18 * COMPACT_CELL_WIDTH + 17 * GAP_PX + GAP_PX + COMPACT_LABEL_COL_W
export const FULL_TABLE_WIDTH = 18 * CELL_WIDTH + 17 * GAP_PX
const COMPACT_TABLE_HEIGHT =
  10 * COMPACT_CELL_HEIGHT + 9 * GAP_PX + GAP_PX + COMPACT_LABEL_ROW_H
const SCALE_PADDING = 32

function calculateScale(): number {
  return Math.min(
    (window.innerWidth - SCALE_PADDING) / COMPACT_TABLE_WIDTH,
    (window.innerHeight - SCALE_PADDING) / COMPACT_TABLE_HEIGHT,
    1,
  )
}

interface PeriodicTableProps {
  drinks: DrinkCellProps[]
  viewMode: 'full' | 'compact'
  onDrinkClick?: (drink: DrinkCellProps) => void
}

export const PeriodicTable = memo(function PeriodicTable({
  drinks,
  viewMode,
  onDrinkClick,
}: PeriodicTableProps) {
  const [scale, setScale] = useState(calculateScale)

  useEffect(() => {
    if (viewMode !== 'compact') return
    const handleResize = () => setScale(calculateScale())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [viewMode])

  const isCompact = viewMode === 'compact'
  const cellWidth = isCompact ? COMPACT_CELL_WIDTH : CELL_WIDTH
  const cellHeight = isCompact ? COMPACT_CELL_HEIGHT : CELL_HEIGHT
  const labelFontSize = isCompact ? '16pt' : '28pt'

  // Compute the first (minimum) row occupied in each column, so each column
  // number can be placed just above that cell rather than at a uniform top.
  const minRowByCol = useMemo(
    () =>
      drinks.reduce<Record<number, number>>((acc, drink) => {
        if (acc[drink.col] === undefined || drink.row < acc[drink.col]) {
          acc[drink.col] = drink.row
        }
        return acc
      }, {}),
    [drinks],
  )

  // Compute the first (minimum) col occupied in each row, so each row number
  // can be placed just to the left of that cell rather than at a uniform left.
  const minColByRow = useMemo(
    () =>
      drinks.reduce<Record<number, number>>((acc, drink) => {
        if (acc[drink.row] === undefined || drink.col < acc[drink.row]) {
          acc[drink.row] = drink.col
        }
        return acc
      }, {}),
    [drinks],
  )

  const labelSx = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: labelFontSize,
    color: 'text.secondary',
    userSelect: 'none' as const,
    fontWeight: 'bold',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  }

  // Single flat grid:
  //   column 1          → row-number labels
  //   columns 2–19      → drink columns 1–18
  //   row 1 (auto)      → space above the first drink row; column-number labels
  //                        float here via alignSelf: end
  //   rows 2–11 (fixed) → drink rows 1–10
  //
  // Each column-number label is placed at gridRow = minRowByCol[col] (the row
  // just above the first drink cell for that column) and uses alignSelf: end to
  // sit flush against the drink cell below it.
  const grid = (
    <Box
      sx={{
        display: 'inline-grid',
        gridTemplateRows: `auto repeat(10, ${cellHeight}px)`,
        gridTemplateColumns: `auto repeat(18, ${cellWidth}px)`,
        gap: 0.5,
      }}
    >
      {/* Row numbers — placed just to the left of each row's first cell.
			    Row 8 is the empty gap before lanthanides/actinides and is skipped;
			    rows 9 and 10 are displayed as 8 and 9. */}
      {Array.from({ length: 10 }, (_, i) => {
        const row = i + 1
        if (row === 8) return null
        const displayNum = row < 8 ? row : row - 1
        const minCol = minColByRow[row]
        if (minCol === undefined) return null
        return (
          <Box
            key={`row-${row}`}
            sx={{
              ...labelSx,
              gridRow: row + 1,
              gridColumn: minCol,
              justifySelf: 'end',
              pr: 1,
            }}
          >
            {displayNum}
          </Box>
        )
      })}

      {/* Column numbers — placed at the row just above each column's first cell */}
      {Array.from({ length: 18 }, (_, i) => {
        const col = i + 1
        const minRow = minRowByCol[col]
        if (minRow === undefined) return null
        return (
          <Box
            key={`col-${col}`}
            sx={{
              ...labelSx,
              gridRow: minRow,
              gridColumn: col + 1,
              alignSelf: 'end',
            }}
          >
            {col}
          </Box>
        )
      })}

      {/* Drink cells — shifted +1 on both axes for the label row/column */}
      {drinks.map((drink) => (
        <DrinkCell
          key={`${drink.row},${drink.col}`}
          {...drink}
          row={drink.row + 1}
          col={drink.col + 1}
          compact={isCompact}
          onClick={
            isCompact && onDrinkClick ? () => onDrinkClick(drink) : undefined
          }
        />
      ))}
    </Box>
  )

  if (isCompact) {
    return (
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            transform: `scale(${scale})`,
            transformOrigin: 'center',
          }}
        >
          {grid}
        </Box>
      </Box>
    )
  }

  return <Box sx={{ width: '100%', height: '100vh' }}>{grid}</Box>
})
