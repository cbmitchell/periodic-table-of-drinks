import { Box } from '@mui/material'
import { CELL_HEIGHT, CELL_WIDTH, DrinkCell, type DrinkCellProps } from './DrinkCell'

interface PeriodicTableProps {
  drinks: DrinkCellProps[]
}

export function PeriodicTable({ drinks }: PeriodicTableProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        width: '100%',
        height: '100vh',
        gridTemplateRows: `repeat(10, ${CELL_HEIGHT}px)`,
        gridTemplateColumns: `repeat(18, ${CELL_WIDTH}px)`,
        gap: 0.5,
      }}
    >
      {drinks.map((drink) => (
        <DrinkCell key={`${drink.row},${drink.col}`} {...drink} />
      ))}
    </Box>
  )
}
