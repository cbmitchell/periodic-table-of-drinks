import { Dialog, DialogContent } from '@mui/material'
import { DrinkCell, type DrinkCellProps } from './DrinkCell'

interface DrinkDetailModalProps {
  drink: DrinkCellProps | null
  onClose: () => void
}

export function DrinkDetailModal({ drink, onClose }: DrinkDetailModalProps) {
  return (
    <Dialog
      open={drink !== null}
      onClose={onClose}
      maxWidth={false}
      aria-label={drink?.title ?? 'Drink details'}
    >
      <DialogContent sx={{ p: 0 }}>
        {drink && <DrinkCell {...drink} compact={false} onClick={undefined} />}
      </DialogContent>
    </Dialog>
  )
}
