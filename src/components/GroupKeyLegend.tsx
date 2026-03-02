import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { ElementGroup } from '../types/ElementGroup'
import { elementGroupColors } from './DrinkCell'

const GROUP_ORDER: ElementGroup[] = [
  'alkali_metals',
  'alkaline_earth_metals',
  'transition_metals',
  'post_transition_metals',
  'metalloids',
  'nonmetals',
  'halogens',
  'noble_gases',
  'lanthanides',
  'actinides',
]

interface GroupKeyLegendProps {
  groupLabels: Partial<Record<ElementGroup, string>>
  compact?: boolean
}

export function GroupKeyLegend({ groupLabels, compact = true }: GroupKeyLegendProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const squareSize = compact ? 14 : 34
  const rowGap = compact ? 0.75 : 2
  const itemGap = compact ? 1 : 2
  const fontSize = compact ? '1rem' : '2.25rem'

  const entries = GROUP_ORDER.flatMap((group) => {
    const label = groupLabels[group]
    return label !== undefined ? [{ group, label }] : []
  })

  if (entries.length === 0) return null

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: rowGap }}>
      {entries.map(({ group, label }) => {
        const baseColor = elementGroupColors[group]
        const backgroundColor = isDark
          ? `color-mix(in srgb, ${baseColor}, #000000 55%)`
          : baseColor
        return (
          <Box
            key={group}
            sx={{ display: 'flex', alignItems: 'center', gap: itemGap }}
          >
            <Box
              sx={{
                width: squareSize,
                height: squareSize,
                flexShrink: 0,
                backgroundColor,
                filter: isDark ? 'saturate(250%)' : undefined,
                borderRadius: '2px',
              }}
            />
            <Typography sx={{ fontSize }}>{label}</Typography>
          </Box>
        )
      })}
    </Box>
  )
}
