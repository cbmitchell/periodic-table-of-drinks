import { Typography } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { useEffect, useMemo, useState } from 'react'
import { drinkLists } from './assets/drinkData'
import { ControlPanel } from './components/ControlPanel'
import type { DrinkCellProps } from './components/DrinkCell'
import { DrinkDetailModal } from './components/DrinkDetailModal'
import { PeriodicTable, FULL_TABLE_WIDTH } from './components/PeriodicTable'
import { lightTheme } from './theme'
import { fillDrinkData } from './utils/fillDrinkData'

type ListSelection = 'random' | number

export default function App() {
  const [viewMode, setViewMode] = useState<'full' | 'compact'>('compact')
  const [selectedDrink, setSelectedDrink] = useState<DrinkCellProps | null>(
    null,
  )
  const [panelVisible, setPanelVisible] = useState(true)
  const [panelCollapsed, setPanelCollapsed] = useState(false)
  const [listSelection, setListSelection] = useState<ListSelection>(0)

  const filledDrinkData = useMemo(() => {
    if (listSelection === 'random') return fillDrinkData([], true)
    return fillDrinkData(drinkLists[listSelection].drinks, false)
  }, [listSelection])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault()
        setPanelVisible((v) => !v)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <ThemeProvider theme={lightTheme}>
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          ...(viewMode === 'compact'
            ? {
                position: 'fixed',
                top: 16,
                left: 0,
                right: 0,
                zIndex: 10,
                pointerEvents: 'none',
              }
            : {
                width: FULL_TABLE_WIDTH,
                pt: 2,
                pb: 1,
              }),
        }}
      >
        Periodic Table of Drinks
      </Typography>
      <PeriodicTable
        drinks={filledDrinkData}
        viewMode={viewMode}
        onDrinkClick={setSelectedDrink}
      />
      <DrinkDetailModal
        drink={selectedDrink}
        onClose={() => setSelectedDrink(null)}
      />
      {panelVisible && (
        <ControlPanel
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          collapsed={panelCollapsed}
          onCollapseToggle={() => setPanelCollapsed((c) => !c)}
          listSelection={listSelection}
          onListChange={setListSelection}
        />
      )}
    </ThemeProvider>
  )
}
