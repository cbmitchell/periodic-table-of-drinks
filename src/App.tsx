import { ThemeProvider } from '@mui/material/styles'
import { lightTheme } from './theme'
import { PeriodicTable } from './components/PeriodicTable'
import { drinkData } from './assets/drinkData'
import { fillDrinkData } from './utils/fillDrinkData'

const filledDrinkData = fillDrinkData(drinkData)

export default function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <PeriodicTable drinks={filledDrinkData} />
    </ThemeProvider>
  )
}
