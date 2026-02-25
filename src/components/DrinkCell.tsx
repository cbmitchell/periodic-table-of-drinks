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

interface CellProps {
  row: number
  col: number
}

export interface DrinkCellProps extends Omit<DrinkProps, 'group'>, CellProps {
  group: ElementGroup
  compact?: boolean
  onClick?: () => void
}

export function DrinkCell({
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
  const width = compact ? COMPACT_CELL_WIDTH : CELL_WIDTH
  const height = compact ? COMPACT_CELL_HEIGHT : CELL_HEIGHT

  return (
    <Card
      onClick={onClick}
      sx={{
        width,
        height,
        backgroundColor: elementGroupColors[group],
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
              <Box sx={{ position: 'relative', height: 100 }}>
                <Typography
                  sx={{
                    fontSize: '8pt',
                    lineHeight: 1.2,
                    fontWeight: 'medium',
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 40,
                    fontWeight: 'bold',
                    lineHeight: 0.9,
                    height: 36,
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
                src={`glass-icons/black/${icon}.png`}
                sx={{ width: '100%', position: 'absolute', bottom: 0 }}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={0}>
            <Grid size={8}>
              <Box sx={{ position: 'relative', height: 128 }}>
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
                    fontSize: 80,
                    fontWeight: 'bold',
                    lineHeight: 0.8,
                    height: 64,
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
                src={`glass-icons/black/${icon}.png`}
                sx={{ height: '85%', position: 'absolute', bottom: 0 }}
              ></Box>
            </Grid>
            <Grid size={6}>
              <Box sx={{ p: 1 }}>
                <List dense sx={{ listStyleType: 'disc', pl: 0 }}>
                  {ingredients.map((ingredient, index) => (
                    <ListItem key={`${index}-${ingredient}`} disablePadding>
                      <ListItemText
                        sx={{ fontSize: 8, display: 'list-item', my: 0 }}
                        primary={ingredient}
                        slotProps={{ primary: { sx: { fontSize: '8pt' } } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
            <Grid size={6}>
              <Box sx={{ p: 1 }}>
                <List dense sx={{ listStyleType: 'disc', pl: 0 }}>
                  {instructions.map((instruction, index) => (
                    <ListItem key={`${index}-${instruction}`} disablePadding>
                      <ListItemText
                        sx={{ fontSize: 8, display: 'list-item', my: 0 }}
                        primary={instruction}
                        slotProps={{ primary: { sx: { fontSize: '8pt' } } }}
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
}
