import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import { Alert, Box, Dialog, DialogContent, IconButton, Snackbar, Tooltip } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { toBlob, toPng } from 'html-to-image'
import { useRef, useState } from 'react'
import { DrinkCell, type DrinkCellProps } from './DrinkCell'

interface DrinkDetailModalProps {
  drink: DrinkCellProps | null
  onClose: () => void
}

type SnackbarState = { open: boolean; message: string; severity: 'success' | 'error' }

export function DrinkDetailModal({ drink, onClose }: DrinkDetailModalProps) {
  const cellRef = useRef<HTMLDivElement>(null)
  const theme = useTheme()
  const logoColor = theme.palette.mode === 'dark' ? 'white' : 'black'
  const logoSrc = `${import.meta.env.BASE_URL}logos/${logoColor}/PToD.png`
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  })

  const handleSave = async () => {
    if (!cellRef.current) return
    try {
      // First call loads external resources (images, fonts); second call captures correctly
      await toPng(cellRef.current, { pixelRatio: 2 })
      const dataUrl = await toPng(cellRef.current, { pixelRatio: 2 })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `${drink?.title?.replace(/\s+/g, '-').toLowerCase() ?? 'drink'}.png`
      link.click()
      setSnackbar({ open: true, message: 'Drink saved successfully!', severity: 'success' })
    } catch (err) {
      console.error('Failed to capture screenshot:', err)
      setSnackbar({ open: true, message: 'There was an issue saving the drink', severity: 'error' })
    }
  }

  const handleCopy = async () => {
    if (!cellRef.current) return
    try {
      const el = cellRef.current
      // clipboard.write must be called within the user gesture activation window,
      // so call it immediately with a Promise — Chrome keeps the permission alive
      // while the Promise resolves, allowing the warmup + capture to happen inside.
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': (async () => {
            // First call loads external resources (images, fonts); second call captures correctly
            await toPng(el, { pixelRatio: 2 })
            const blob = await toBlob(el, { pixelRatio: 2 })
            if (!blob) throw new Error('Failed to generate image blob')
            return blob
          })(),
        }),
      ])
      setSnackbar({ open: true, message: 'Drink copied successfully!', severity: 'success' })
    } catch (err) {
      console.error('Failed to copy screenshot:', err)
      setSnackbar({ open: true, message: 'There was an issue copying the drink', severity: 'error' })
    }
  }

  return (
    <>
      <Dialog
        open={drink !== null}
        onClose={onClose}
        maxWidth={false}
        aria-label={drink?.title ?? 'Drink details'}
        slotProps={{ paper: { sx: { overflow: 'visible' } } }}
      >
        <DialogContent sx={{ p: 0, overflow: 'visible' }}>
          {drink && (
            <Box sx={{ position: 'relative' }}>
              <Box ref={cellRef} sx={{ position: 'relative' }}>
                <DrinkCell {...drink} compact={false} onClick={undefined} />
                <Box
                  component="img"
                  src={logoSrc}
                  alt="Logo"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    maxHeight: 32,
                    maxWidth: 32,
                    display: 'block',
                    pointerEvents: 'none',
                  }}
                />
              </Box>
              <Tooltip title="Save image" placement="right">
                <IconButton
                  onClick={handleSave}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: '100%',
                    ml: 1,
                    backgroundColor: 'background.paper',
                    boxShadow: 2,
                    '&:hover': { backgroundColor: 'background.default' },
                  }}
                >
                  <SaveAltIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy image" placement="right">
                <IconButton
                  onClick={handleCopy}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 40,
                    left: '100%',
                    ml: 1,
                    backgroundColor: 'background.paper',
                    boxShadow: 2,
                    '&:hover': { backgroundColor: 'background.default' },
                  }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}
