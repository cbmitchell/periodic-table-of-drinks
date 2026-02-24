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
import { defaultCellMap } from '../assets/drinkData'

export const GLASS_TYPES = [
  'collins',
  'coup',
  'flute',
  'hurricane',
  'irish',
  'margarita',
  'martini',
  'mule',
  'pint',
  'rocks',
  'shot',
  'shooter',
  'tiki',
  'wine',
] as const

export type GlassIconName = (typeof GLASS_TYPES)[number]

const glassIconBasePath = 'glass-icons/black/'

// TODO: Pretty sure there's a fun TypeScript way to simplify this.
const glassIcons: Record<GlassIconName, string> = {
  collins: 'collins.png',
  coup: 'coup.png',
  flute: 'flute.png',
  hurricane: 'hurricane.png',
  irish: 'irish.png',
  margarita: 'margarita.png',
  martini: 'martini.png',
  mule: 'mule.png',
  pint: 'pint.png',
  rocks: 'rocks.png',
  shot: 'shot.png',
  shooter: 'shooter.png',
  tiki: 'tiki.png',
  wine: 'wine.png',
}

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
  actinides: '#e0b3f2',
}

export const CELL_WIDTH = 256
export const CELL_HEIGHT = 320

export interface DrinkProps {
  title: string
  abbreviation: string
  icon: GlassIconName
  ingredients: string[]
  instructions: string[]
  group?: ElementGroup
}

interface CellProps {
  row: number
  col: number
}

export interface DrinkCellProps extends DrinkProps, CellProps {}

export function DrinkCell({
  title,
  abbreviation,
  icon,
  ingredients,
  instructions = [''],
  row,
  col,
  group = defaultCellMap.get(`${row},${col}`)!.group,
}: DrinkCellProps) {
  return (
    <Card
      sx={{
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
        backgroundColor: elementGroupColors[group!],
        gridRow: row,
        gridColumn: col,
        overflow: 'hidden',
      }}
    >
      <CardContent>
        <Grid container spacing={0}>
          <Grid size={8}>
            <Box>
              <Typography
                sx={{
                  fontWeight: 'medium',
                  minHeight: 48,
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
                }}
              >
                {abbreviation}
              </Typography>
            </Box>
          </Grid>
          <Grid size={4} sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={`${glassIconBasePath}${glassIcons[icon]}`}
              sx={{ width: '100%', position: 'absolute', bottom: 0 }}
            ></Box>
          </Grid>
          <Grid size={6}>
            <Box sx={{ p: 1 }}>
              <List dense sx={{ listStyleType: 'disc', pl: 0 }}>
                {ingredients.map((ingredient) => (
                  <ListItem key={ingredient} disablePadding>
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
                {instructions.map((instruction) => (
                  <ListItem key={instruction} disablePadding>
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
      </CardContent>
    </Card>
  )
}
