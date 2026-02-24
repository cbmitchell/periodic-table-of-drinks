import type { GlassIconName } from './components/DrinkCell'
import { ThemeProvider } from '@mui/material/styles'
import { lightTheme } from './theme'
import { PeriodicTable } from './components/PeriodicTable'
import type { ElementGroup } from './types/ElementGroup'
import { drinkData } from './assets/drinkData'
import { fillDrinkData } from './utils/fillDrinkData'

const title = 'Frozen Chocolate Mudslide'
const abbreviation = 'Cm'
const icon: GlassIconName = 'hurricane'
const group: ElementGroup = 'actinides'
const ingredients = [
  '1 ½ oz chocolate vodka',
  '1 ½ oz Irish cream',
  '1 ½ oz Kahlua',
  '1 oz creme de cacao',
  '48 oz chocolate ice cream',
  'Chocolate syrup',
  'Chocolate sprinkles',
]
const instructions = [
  'Combine ingredients in blender',
  'Cover and blend well',
  'Put chocolate sprinkles on a dish',
  'Coat rim of glass in chocolate syrup',
  'Touch rim of glass to sprinkles',
]
const testProps = {
  title,
  abbreviation,
  icon,
  group,
  ingredients,
  instructions,
}

const filledDrinkData = fillDrinkData(drinkData)

export default function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <PeriodicTable drinks={filledDrinkData} />
    </ThemeProvider>
  )
}
