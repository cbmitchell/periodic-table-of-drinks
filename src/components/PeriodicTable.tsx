import { Box, Typography } from '@mui/material'
import { memo, useEffect, useMemo, useRef } from 'react'
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch'
import type { ElementGroup } from '../types/ElementGroup'
import {
  CELL_HEIGHT,
  CELL_WIDTH,
  COMPACT_CELL_HEIGHT,
  COMPACT_CELL_WIDTH,
  DrinkCell,
  type DrinkCellProps,
} from './DrinkCell'
import { CellLegend } from './CellLegend'
import { GroupKeyLegend } from './GroupKeyLegend'

const GAP_PX = 4 // MUI gap: 0.5 = 4px
const COMPACT_LABEL_COL_W = 20 // width of row-number column in compact mode
const COMPACT_LABEL_ROW_H = 16 // height of column-number row in compact mode
const COMPACT_TITLE_ROW_H = 64 // estimated height of the title row
const SCALE_PADDING = 32
const PAN_MARGIN = 64 // minimum margin between table edge and viewport edge when panning

function calculateScale(cellWidth: number, cellHeight: number): number {
  const scaleFactor = cellWidth / COMPACT_CELL_WIDTH
  const labelColW = COMPACT_LABEL_COL_W * scaleFactor
  const labelRowH = COMPACT_LABEL_ROW_H * scaleFactor
  const titleRowH = COMPACT_TITLE_ROW_H * scaleFactor
  const tableWidth = 18 * cellWidth + 17 * GAP_PX + GAP_PX + labelColW
  const tableHeight =
    10 * cellHeight + 9 * GAP_PX + GAP_PX + labelRowH + GAP_PX + titleRowH
  return Math.min(
    (window.innerWidth - SCALE_PADDING) / tableWidth,
    (window.innerHeight - SCALE_PADDING) / tableHeight,
  )
}

interface PeriodicTableProps {
  drinks: DrinkCellProps[]
  viewMode: 'full' | 'compact'
  onDrinkClick?: (drink: DrinkCellProps) => void
  groupLabels?: Partial<Record<ElementGroup, string>>
  transformRef?: React.RefObject<ReactZoomPanPinchRef | null>
  onZoomChange?: (scale: number) => void
}

export const PeriodicTable = memo(function PeriodicTable({
  drinks,
  viewMode,
  onDrinkClick,
  groupLabels,
  transformRef,
  onZoomChange,
}: PeriodicTableProps) {
  const isCompact = viewMode === 'compact'
  const cellWidth = isCompact ? COMPACT_CELL_WIDTH : CELL_WIDTH
  const cellHeight = isCompact ? COMPACT_CELL_HEIGHT : CELL_HEIGHT
  const labelFontSize = isCompact ? '16pt' : '28pt'

  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () =>
      transformRef?.current?.centerView(calculateScale(cellWidth, cellHeight))
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [transformRef, cellWidth, cellHeight])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let startX = 0,
      startY = 0
    const onPointerDown = (e: PointerEvent) => {
      startX = e.clientX
      startY = e.clientY
    }
    const onClickCapture = (e: MouseEvent) => {
      if (Math.hypot(e.clientX - startX, e.clientY - startY) > 5)
        e.stopPropagation()
    }
    container.addEventListener('pointerdown', onPointerDown)
    container.addEventListener('click', onClickCapture, { capture: true })
    return () => {
      container.removeEventListener('pointerdown', onPointerDown)
      container.removeEventListener('click', onClickCapture, { capture: true })
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const state = transformRef?.current?.instance.transformState
      if (!state) return
      if (e.ctrlKey) {
        // Trackpad pinch: zoom toward cursor position
        const scaleFactor = Math.exp(-e.deltaY * 0.003)
        const newScale = Math.min(Math.max(state.scale * scaleFactor, 0.1), 4)
        const rect = container.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const contentX = (mouseX - state.positionX) / state.scale
        const contentY = (mouseY - state.positionY) / state.scale
        transformRef?.current?.setTransform(
          mouseX - contentX * newScale,
          mouseY - contentY * newScale,
          newScale,
          0,
        )
        return
      }
      // Regular scroll: pan with margin-aware bounds
      let newX = state.positionX - e.deltaX
      let newY = state.positionY - e.deltaY
      const grid = gridRef.current
      if (grid) {
        const gridW = grid.offsetWidth * state.scale
        const gridH = grid.offsetHeight * state.scale
        const wrapperW = window.innerWidth
        const wrapperH = window.innerHeight
        const m = PAN_MARGIN
        newX = Math.min(
          Math.max(newX, Math.min(m, wrapperW - gridW - m)),
          Math.max(m, wrapperW - gridW + m),
        )
        newY = Math.min(
          Math.max(newY, Math.min(m, wrapperH - gridH - m)),
          Math.max(m, wrapperH - gridH + m),
        )
      }
      transformRef?.current?.setTransform(newX, newY, state.scale, 0)

      // After scroll ends, center any axis where the content fits in the viewport
      clearTimeout(scrollEndTimer)
      scrollEndTimer = setTimeout(() => {
        const s = transformRef?.current?.instance.transformState
        const g = gridRef.current
        if (!s || !g) return
        const gridW = g.offsetWidth * s.scale
        const gridH = g.offsetHeight * s.scale
        const fitsX = gridW <= window.innerWidth
        const fitsY = gridH <= window.innerHeight
        if (!fitsX && !fitsY) return
        transformRef?.current?.setTransform(
          fitsX ? (window.innerWidth - gridW) / 2 : s.positionX,
          fitsY ? (window.innerHeight - gridH) / 2 : s.positionY,
          s.scale,
          200,
        )
      }, 75)
    }
    let scrollEndTimer: ReturnType<typeof setTimeout>
    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      container.removeEventListener('wheel', handleWheel)
      clearTimeout(scrollEndTimer)
    }
  }, [transformRef])

  useEffect(() => {
    transformRef?.current?.centerView(calculateScale(cellWidth, cellHeight))
  }, [transformRef, cellWidth, cellHeight])

  // Compute the first (minimum) row occupied in each column, so each column
  // number can be placed just above that cell rather than at a uniform top.
  const firstDrink = useMemo(
    () => drinks.find((d) => d.atomic_number === 1),
    [drinks],
  )

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
      ref={gridRef}
      sx={{
        display: 'inline-grid',
        gridTemplateRows: `auto auto repeat(10, ${cellHeight}px)`,
        gridTemplateColumns: `auto repeat(18, ${cellWidth}px)`,
        gap: 0.5,
      }}
    >
      {/* Title — spans the full grid width in the first row */}
      <Typography
        variant="h2"
        sx={{
          gridRow: 1,
          gridColumn: '1 / -1',
          textAlign: 'center',
          fontWeight: 'bold',
          py: 1,
          fontSize: isCompact ? '48pt' : '98pt',
        }}
      >
        Periodic Table of Drinks
      </Typography>

      {/* Row numbers — placed just to the left of each row's first cell.
			    Rows 8–10 (the gap row and lanthanides/actinides) are skipped. */}
      {Array.from({ length: 10 }, (_, i) => {
        const row = i + 1
        if (row >= 8) return null
        const displayNum = row
        const minCol = minColByRow[row]
        if (minCol === undefined) return null
        return (
          <Box
            key={`row-${row}`}
            sx={{
              ...labelSx,
              gridRow: row + 2,
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
              gridRow: minRow + 1,
              gridColumn: col + 1,
              alignSelf: 'end',
            }}
          >
            {col}
          </Box>
        )
      })}

      {/* Group key legend — sits in the empty space above the d-block columns (labeled 3–12) */}
      {groupLabels && (
        <Box
          sx={{
            gridRow: 3,
            gridColumn: '5 / 14',
            alignSelf: 'start',
            height: 0,
            overflow: 'visible',
          }}
        >
          <Box sx={{ pt: 0, pl: 1 }}>
            <GroupKeyLegend groupLabels={groupLabels} compact={isCompact} />
          </Box>
        </Box>
      )}

      {/* Cell legend — floats above the table starting at column 7 */}
      {firstDrink && (
        <Box
          sx={{
            gridRow: 3,
            gridColumn: '8 / -1',
            alignSelf: 'start',
            height: 0,
            overflow: 'visible',
          }}
        >
          <Box sx={{ marginTop: `${0.5 * cellHeight + GAP_PX}px` }}>
            <CellLegend
              drink={firstDrink}
              compact={isCompact}
              cellWidth={cellWidth}
              cellHeight={cellHeight}
            />
          </Box>
        </Box>
      )}

      {/* Drink cells — shifted +1 on both axes for the label row/column */}
      {drinks.map((drink) => (
        <DrinkCell
          key={`${drink.row},${drink.col}`}
          {...drink}
          row={drink.row + 2}
          col={drink.col + 1}
          compact={isCompact}
          onClick={
            isCompact && onDrinkClick ? () => onDrinkClick(drink) : undefined
          }
        />
      ))}
    </Box>
  )

  return (
    <Box
      ref={containerRef}
      sx={{ position: 'fixed', inset: 0, overflow: 'hidden' }}
    >
      <TransformWrapper
        ref={transformRef}
        initialScale={calculateScale(cellWidth, cellHeight)}
        minScale={0.1}
        maxScale={4}
        centerOnInit
        limitToBounds={false}
        wheel={{ disabled: true }}
        onTransformed={(_, state) => onZoomChange?.(state.scale)}
        onPanningStop={(ref) => {
          const s = ref.instance.transformState
          const grid = gridRef.current
          if (!grid) return
          const gridW = grid.offsetWidth * s.scale
          const gridH = grid.offsetHeight * s.scale
          const wrapperW = window.innerWidth
          const wrapperH = window.innerHeight
          const m = PAN_MARGIN
          const newX = Math.min(
            Math.max(s.positionX, Math.min(m, wrapperW - gridW - m)),
            Math.max(m, wrapperW - gridW + m),
          )
          const newY = Math.min(
            Math.max(s.positionY, Math.min(m, wrapperH - gridH - m)),
            Math.max(m, wrapperH - gridH + m),
          )
          if (newX !== s.positionX || newY !== s.positionY) {
            ref.setTransform(newX, newY, s.scale, 200)
          }
        }}
      >
        <TransformComponent wrapperStyle={{ width: '100vw', height: '100vh' }}>
          {grid}
        </TransformComponent>
      </TransformWrapper>
    </Box>
  )
})
