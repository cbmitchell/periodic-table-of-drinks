import {
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { memo } from 'react'
import type { ElementGroup } from '../types/ElementGroup'
import type { DrinkProps } from '../types/drink'

const elementGroupColors: Record<ElementGroup, string> = {
  alkali_metals: '#f2b3d3',
  alkaline_earth_metals: '#f2e2b3',
  transition_metals: '#f1f2b3',
  post_transition_metals: '#b3d5f2',
  metalloids: '#b7f2b3',
  nonmetals: '#e0b3f2',
  halogens: '#b3f0f2',
  noble_gases: '#f2b3b3',
  lanthanides: '#daf2b3',
  actinides: '#f2c4b3',
}

export const CELL_WIDTH = 256
export const CELL_HEIGHT = 340
export const COMPACT_CELL_WIDTH = 104
export const COMPACT_CELL_HEIGHT = 138

// Internal layout constants
const COMPACT_CONTENT_HEIGHT = 100
const COMPACT_ABBR_FONT_SIZE = 40
const COMPACT_ABBR_HEIGHT = 36
const FULL_CONTENT_HEIGHT = 128
const FULL_ABBR_FONT_SIZE = 80
const FULL_ABBR_HEIGHT = 64
const FULL_IMAGE_HEIGHT = '85%'
const LIST_ITEM_FONT_SIZE = '8pt'

interface CellProps {
  row: number
  col: number
}

export interface DrinkCellProps extends Omit<DrinkProps, 'group'>, CellProps {
  group: ElementGroup
  compact?: boolean
  onClick?: () => void
}

function hideOnError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = 'none'
}

export const DrinkCell = memo(function DrinkCell({
  title,
  abbreviation,
  icon,
  ingredients,
  instructions = [''],
  row,
  col,
  group,
  compact = false,
  onClick,
}: DrinkCellProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const width = compact ? COMPACT_CELL_WIDTH : CELL_WIDTH
  const height = compact ? COMPACT_CELL_HEIGHT : CELL_HEIGHT
  const baseColor = elementGroupColors[group]
  const backgroundColor = isDark
    ? `color-mix(in srgb, ${baseColor}, #303030 65%)`
    : baseColor
  const iconColor = isDark ? 'white' : 'black'
  const saturation = isDark ? '200%' : '100%'

  return (
    <Card
      onClick={onClick}
      sx={{
        width,
        height,
        backgroundColor,
        filter: `saturate(${saturation})`,
        gridRow: row,
        gridColumn: col,
        overflow: 'hidden',
        cursor: compact ? 'pointer' : 'default',
        '&:hover': compact ? { boxShadow: 6 } : undefined,
      }}
    >
      <CardContent
        sx={{ p: compact ? 1 : 2, '&:last-child': { pb: compact ? 1 : 2 } }}
      >
        {compact ? (
          <Grid container spacing={0}>
            <Grid size={8}>
              <Box sx={{ position: 'relative', height: COMPACT_CONTENT_HEIGHT }}>
                <Typography
                  sx={{
                    fontSize: LIST_ITEM_FONT_SIZE,
                    lineHeight: 1.2,
                    fontWeight: 'medium',
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: COMPACT_ABBR_FONT_SIZE,
                    fontWeight: 'bold',
                    lineHeight: 0.9,
                    height: COMPACT_ABBR_HEIGHT,
                    position: 'absolute',
                    bottom: 0,
                  }}
                >
                  {abbreviation}
                </Typography>
              </Box>
            </Grid>
            <Grid size={4} sx={{ position: 'relative' }}>
              <Box
                component="img"
                src={`glass-icons/${iconColor}/${icon}.png`}
                alt={`${icon} glass`}
                onError={hideOnError}
                sx={{ width: '100%', position: 'absolute', bottom: 0 }}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={0}>
            <Grid size={8}>
              <Box sx={{ position: 'relative', height: FULL_CONTENT_HEIGHT }}>
                <Typography
                  sx={{
                    fontWeight: 'medium',
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: FULL_ABBR_FONT_SIZE,
                    fontWeight: 'bold',
                    lineHeight: 0.8,
                    height: FULL_ABBR_HEIGHT,
                    position: 'absolute',
                    bottom: 0,
                  }}
                >
                  {abbreviation}
                </Typography>
              </Box>
            </Grid>
            <Grid size={4} sx={{ position: 'relative' }}>
              <Box
                component="img"
                src={`glass-icons/${iconColor}/${icon}.png`}
                alt={`${icon} glass`}
                onError={hideOnError}
                sx={{ height: FULL_IMAGE_HEIGHT, position: 'absolute', bottom: 0 }}
              />
            </Grid>
            <Grid size={6}>
              <Box sx={{ p: 1 }}>
                <List dense sx={{ listStyleType: 'disc', pl: 0 }}>
                  {ingredients.map((ingredient) => (
                    <ListItem key={ingredient} disablePadding>
                      <ListItemText
                        sx={{ fontSize: 8, display: 'list-item', my: 0 }}
                        primary={ingredient}
                        slotProps={{ primary: { sx: { fontSize: LIST_ITEM_FONT_SIZE } } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
            <Grid size={6}>
              <Box sx={{ p: 1 }}>
                <List dense sx={{ listStyleType: 'disc', pl: 0 }}>
                  {instructions.map((instruction) => (
                    <ListItem key={instruction} disablePadding>
                      <ListItemText
                        sx={{ fontSize: 8, display: 'list-item', my: 0 }}
                        primary={instruction}
                        slotProps={{ primary: { sx: { fontSize: LIST_ITEM_FONT_SIZE } } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  )
})
