import { Box, Typography } from '@mui/material'
import type { DrinkCellProps } from './DrinkCell'
import { DrinkCell } from './DrinkCell'

interface LabelItem {
  text: string
  topFraction: number
}

interface CellLegendProps {
  drink: DrinkCellProps
  compact: boolean
  cellWidth: number
  cellHeight: number
}

export function CellLegend({ drink, compact, cellWidth, cellHeight }: CellLegendProps) {
  const SCALE_FACTOR = 1.5
  const scaledWidth = cellWidth * SCALE_FACTOR
  const scaledHeight = cellHeight * SCALE_FACTOR

  const labelFontSize = compact ? '10pt' : '14pt'
  const lineWidth = compact ? 16 : 24
  const leftColWidth = compact ? 80 : 160
  const rightColWidth = compact ? 120 : 200

  const leftLabels: LabelItem[] = compact
    ? [
        { text: 'Title', topFraction: 0.1 },
        { text: 'Symbol', topFraction: 0.65 },
      ]
    : [
        { text: 'Title', topFraction: 0.075 },
        { text: 'Symbol', topFraction: 0.33 },
        { text: 'Ingredients', topFraction: 0.5 },
      ]

  const rightLabels: LabelItem[] = compact
    ? [
        { text: 'Atomic Number', topFraction: 0.06 },
        { text: 'Glass Type', topFraction: 0.65 },
      ]
    : [
        { text: 'Atomic Number', topFraction: 0.035 },
        { text: 'Glass Type', topFraction: 0.33 },
        { text: 'Instructions', topFraction: 0.5 },
      ]

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}
    >
      {/* Left labels */}
      <Box
        sx={{
          position: 'relative',
          width: leftColWidth,
          height: scaledHeight,
          flexShrink: 0,
        }}
      >
        {leftLabels.map(({ text, topFraction }) => (
          <Box
            key={text}
            sx={{
              position: 'absolute',
              top: scaledHeight * topFraction,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              transform: 'translateY(-50%)',
            }}
          >
            <Typography
              sx={{
                fontSize: labelFontSize,
                whiteSpace: 'nowrap',
                color: 'text.secondary',
              }}
            >
              {text}
            </Typography>
            <Box
              sx={{
                width: lineWidth,
                height: '1px',
                bgcolor: 'text.secondary',
                flexShrink: 0,
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Scaled cell */}
      <Box
        sx={{
          width: scaledWidth,
          height: scaledHeight,
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `scale(${SCALE_FACTOR})`,
            transformOrigin: 'top left',
          }}
        >
          <DrinkCell {...drink} row={0} col={0} compact={compact} />
        </Box>
      </Box>

      {/* Right labels */}
      <Box
        sx={{
          position: 'relative',
          width: rightColWidth,
          height: scaledHeight,
          flexShrink: 0,
        }}
      >
        {rightLabels.map(({ text, topFraction }) => (
          <Box
            key={text}
            sx={{
              position: 'absolute',
              top: scaledHeight * topFraction,
              left: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              transform: 'translateY(-50%)',
            }}
          >
            <Box
              sx={{
                width: lineWidth,
                height: '1px',
                bgcolor: 'text.secondary',
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontSize: labelFontSize,
                whiteSpace: 'nowrap',
                color: 'text.secondary',
              }}
            >
              {text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
