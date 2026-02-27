import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import { Box, Dialog, DialogContent, IconButton, Tooltip } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { toBlob, toPng } from 'html-to-image'
import { useRef } from 'react'
import { DrinkCell, type DrinkCellProps } from './DrinkCell'

interface DrinkDetailModalProps {
  drink: DrinkCellProps | null
  onClose: () => void
}

export function DrinkDetailModal({ drink, onClose }: DrinkDetailModalProps) {
  const cellRef = useRef<HTMLDivElement>(null)
  const theme = useTheme()
  const logoColor = theme.palette.mode === 'dark' ? 'white' : 'black'
  const logoSrc = `logos/${logoColor}/PToD.png`

  const handleSave = async () => {
    if (!cellRef.current) return
    try {
      const dataUrl = await toPng(cellRef.current, { pixelRatio: 2 })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `${drink?.title?.replace(/\s+/g, '-').toLowerCase() ?? 'drink'}.png`
      link.click()
    } catch (err) {
      console.error('Failed to capture screenshot:', err)
    }
  }

  const handleCopy = async () => {
    if (!cellRef.current) return
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': toBlob(cellRef.current, {
            pixelRatio: 2,
          }) as Promise<Blob>,
        }),
      ])
    } catch (err) {
      console.error('Failed to copy screenshot:', err)
    }
  }

  return (
    <Dialog
      open={drink !== null}
      onClose={onClose}
      maxWidth={false}
      aria-label={drink?.title ?? 'Drink details'}
      PaperProps={{ sx: { overflow: 'visible' } }}
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
  )
}
