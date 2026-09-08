import { Box, Typography } from '@mui/material'
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { select } from 'd3-selection'
import 'd3-transition' // side-effect import: adds Selection.prototype.transition (used for animated zoom/fit)
import { zoom, zoomTransform, ZoomTransform } from 'd3-zoom'
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
const SCALE_PADDING = 32 // viewport margin to leave around the fitted table
const MIN_SCALE = 0.1
const MAX_SCALE = 4
const FIT_ANIMATION_MS = 200

type Extent = [[number, number], [number, number]]

// Mirrors d3-zoom's own default constrain (read from its source, since the library
// doesn't export it): pins translateExtent's edges to extent's edges when the content is
// larger than the viewport on that axis, and centers it when the content is smaller.
function defaultConstrain(transform: ZoomTransform, extent: Extent, translateExtent: Extent): ZoomTransform {
  const dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0]
  const dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0]
  const dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1]
  const dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1]
  return transform.translate(
    dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
    dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1),
  )
}

// The imperative API PeriodicTable exposes on `transformRef`, for ControlPanel's zoom
// buttons. A plain object assigned to the ref rather than useImperativeHandle, since
// transformRef is an ordinary prop here, not a forwarded ref.
export interface PanZoomHandle {
  zoomIn: () => void
  zoomOut: () => void
  reset: () => void
}

interface PeriodicTableProps {
  drinks: DrinkCellProps[]
  viewMode: 'full' | 'compact'
  onDrinkClick?: (drink: DrinkCellProps) => void
  groupLabels?: Partial<Record<ElementGroup, string>>
  transformRef?: React.RefObject<PanZoomHandle | null>
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

  // Kept in sync with cellWidth/cellHeight on every render so constrainWithEdgeMargin
  // (configured once, below) always sees the current view mode's cell size without
  // needing to be reconfigured on every view-mode toggle.
  const cellSizeRef = useRef({ width: cellWidth, height: cellHeight })
  useLayoutEffect(() => {
    cellSizeRef.current = { width: cellWidth, height: cellHeight }
  }, [cellWidth, cellHeight])

  // Expands translateExtent by a per-axis margin before applying defaultConstrain, so
  // panning past the table's true edge is allowed rather than stopping flush against it.
  // The margin is derived fresh from the transform's *current* scale on every call — a
  // static, pre-expanded translateExtent can't do this, since the amount of world-space
  // padding needed to hold a constant on-screen margin shrinks as you zoom in. Sized so
  // that, at the panning limit, an edge cell can be centered in the viewport: half the
  // viewport (in world units at this scale) minus half a cell.
  const constrainWithEdgeMargin = useCallback((transform: ZoomTransform, extent: Extent, translateExtent: Extent): ZoomTransform => {
    const { width, height } = cellSizeRef.current
    const marginX = Math.max(0, (extent[1][0] - extent[0][0]) / (2 * transform.k) - width / 2)
    const marginY = Math.max(0, (extent[1][1] - extent[0][1]) / (2 * transform.k) - height / 2)
    const expanded: Extent = [
      [translateExtent[0][0] - marginX, translateExtent[0][1] - marginY],
      [translateExtent[1][0] + marginX, translateExtent[1][1] + marginY],
    ]
    return defaultConstrain(transform, extent, expanded)
  }, [])

  // A single zoom behavior instance for the component's lifetime. All panning and
  // zooming — drag, ctrl+wheel/trackpad-pinch zoom, touch pinch, the buttons below, and
  // fitToViewport — goes through this one object, which funnels every change through the
  // same constrain(transform, extent, translateExtent) step before it's ever applied.
  // There's no separate cached bounds value for any interaction to fall out of sync with.
  const zoomBehavior = useMemo(
    () =>
      zoom<HTMLDivElement, unknown>()
        .scaleExtent([MIN_SCALE, MAX_SCALE])
        .clickDistance(5), // suppresses the click event after a real drag, so panning a cell out from under the cursor doesn't also open it
    [],
  )

  // Binds the zoom behavior to the container: drag and ctrl+wheel/pinch zoom (native to
  // the library, self-consistent) plus applying the resulting transform to the grid.
  // Plain scroll is filtered out here and handled by the separate wheel effect below.
  useLayoutEffect(() => {
    const container = containerRef.current
    const grid = gridRef.current
    if (!container || !grid) return
    zoomBehavior
      .filter((event) => (event.type === 'wheel' ? event.ctrlKey : !event.button))
      .constrain(constrainWithEdgeMargin)
      .on('zoom', (event) => {
        // Not event.transform.toString(): that emits SVG transform-attribute syntax
        // (unitless translate), which is invalid as a CSS transform property value —
        // the browser silently drops it, with no console error, leaving the element
        // untransformed.
        const { k, x, y } = event.transform
        grid.style.transform = `translate(${x}px, ${y}px) scale(${k})`
        onZoomChange?.(k)
      })
    select(container).call(zoomBehavior)
    return () => {
      select(container).on('.zoom', null)
    }
  }, [zoomBehavior, onZoomChange, constrainWithEdgeMargin])

  // Scales and centers the table to fit the viewport, measuring the grid's actual
  // (unscaled) rendered size rather than predicting it from layout constants — so this
  // can't drift out of sync with DrinkCell's dimensions or the grid's own shape. Also
  // keeps translateExtent (the pan boundary) up to date with that same measurement, so
  // panning can never be bounded against a stale size.
  const fitToViewport = useCallback(
    (animate: boolean) => {
      const container = containerRef.current
      const grid = gridRef.current
      if (!container || !grid) return
      const scale = Math.min(
        MAX_SCALE,
        Math.max(
          MIN_SCALE,
          Math.min(
            (window.innerWidth - SCALE_PADDING) / grid.offsetWidth,
            (window.innerHeight - SCALE_PADDING) / grid.offsetHeight,
          ),
        ),
      )
      zoomBehavior.translateExtent([
        [0, 0],
        [grid.offsetWidth, grid.offsetHeight],
      ])
      const target = new ZoomTransform(
        scale,
        (window.innerWidth - grid.offsetWidth * scale) / 2,
        (window.innerHeight - grid.offsetHeight * scale) / 2,
      )
      const selection = select(container)
      if (animate) {
        selection.transition().duration(FIT_ANIMATION_MS).call(zoomBehavior.transform, target)
      } else {
        selection.call(zoomBehavior.transform, target)
      }
    },
    [zoomBehavior],
  )

  // Runs before paint, both immediately on mount and whenever the grid's own rendered
  // size changes for any reason (a view-mode toggle, different drink data, font-load
  // reflow, ...) — observing the real element means this can't miss a cause of resize
  // the way a hardcoded dependency list could.
  useLayoutEffect(() => {
    fitToViewport(false)
    const grid = gridRef.current
    if (!grid) return
    const observer = new ResizeObserver(() => fitToViewport(false))
    observer.observe(grid)
    return () => observer.disconnect()
  }, [fitToViewport])

  useEffect(() => {
    const handleResize = () => fitToViewport(true)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [fitToViewport])

  // Plain scroll pans the table; ctrl+scroll/trackpad-pinch zoom is left entirely to the
  // zoom behavior above (it recalculates its own pan bounds on every zoom, so it's
  // trustworthy) — that behavior's filter rejects non-ctrl wheel events, so this is the
  // only handler acting on them. translateBy reads the current transform itself and runs
  // through the same constrain step as every other interaction.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return
      e.preventDefault()
      const { k } = zoomTransform(container)
      zoomBehavior.translateBy(select(container), -e.deltaX / k, -e.deltaY / k)
    }
    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [zoomBehavior])

  // Exposes zoomIn/zoomOut/reset to ControlPanel. A plain assignment rather than
  // useImperativeHandle since transformRef is an ordinary prop, not a forwarded ref.
  useEffect(() => {
    if (!transformRef) return
    const container = containerRef.current
    const scaleBy = (k: number) => {
      if (!container) return
      select(container).transition().duration(FIT_ANIMATION_MS).call(zoomBehavior.scaleBy, k)
    }
    transformRef.current = {
      zoomIn: () => scaleBy(1.5),
      zoomOut: () => scaleBy(1 / 1.5),
      reset: () => fitToViewport(true),
    }
    return () => {
      transformRef.current = null
    }
  }, [transformRef, zoomBehavior, fitToViewport])

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
        transformOrigin: '0 0',
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
      {grid}
    </Box>
  )
})
