import CloseIcon from '@mui/icons-material/Close'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import TuneIcon from '@mui/icons-material/Tune'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grow,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Typography,
} from '@mui/material'
import { drinkLists } from '../assets/drinkData'
import type { ListSelection } from '../types/ListSelection'
import type { PanZoomHandle } from './PeriodicTable'

interface ControlPanelProps {
  viewMode: 'full' | 'compact'
  onViewModeChange: (mode: 'full' | 'compact') => void
  collapsed: boolean
  onCollapseToggle: () => void
  listSelection: ListSelection
  onListChange: (selection: ListSelection) => void
  darkMode: boolean
  onDarkModeToggle: () => void
  zoomRef?: React.RefObject<PanZoomHandle | null>
  zoomScale?: number | null
}

export function ControlPanel({
  viewMode,
  onViewModeChange,
  collapsed,
  onCollapseToggle,
  listSelection,
  onListChange,
  darkMode,
  onDarkModeToggle,
  zoomRef,
  zoomScale,
}: ControlPanelProps) {
  const zIndex = (theme: { zIndex: { modal: number } }) => theme.zIndex.modal + 1

  return (
    <>
      <IconButton
        onClick={onCollapseToggle}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex,
          pointerEvents: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 3,
          borderRadius: 1,
          '&:hover': { bgcolor: 'background.paper' },
        }}
      >
        {collapsed ? <TuneIcon /> : <CloseIcon />}
      </IconButton>

      <Grow in={!collapsed} unmountOnExit style={{ transformOrigin: 'top right' }}>
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: 56,
            right: 16,
            zIndex,
            pointerEvents: 'auto',
            width: 220,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <FormControl size="small" fullWidth>
            <InputLabel>Drink List</InputLabel>
            <Select
              label="Drink List"
              value={String(listSelection)}
              MenuProps={{ sx: { zIndex: (theme) => theme.zIndex.modal + 2 } }}
              onChange={(e) => onListChange(Number(e.target.value))}
            >
              {drinkLists.map((list, i) => (
                <MenuItem key={list.title} value={String(i)}>
                  {list.title}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {drinkLists[listSelection]?.description?.trim()}
            </FormHelperText>
          </FormControl>
          <Button
            variant="contained"
            fullWidth
            onClick={() =>
              onViewModeChange(viewMode === 'compact' ? 'full' : 'compact')
            }
          >
            {viewMode === 'compact' ? 'Full View' : 'Compact View'}
          </Button>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Zoom {zoomScale != null ? `${Math.round(zoomScale * 100)}%` : ''}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => zoomRef?.current?.zoomOut()}
                sx={{ pointerEvents: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}
              >
                <ZoomOutIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => zoomRef?.current?.zoomIn()}
                sx={{ pointerEvents: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}
              >
                <ZoomInIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => zoomRef?.current?.reset()}
                sx={{ pointerEvents: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}
              >
                <RestartAltIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={onDarkModeToggle}
                size="small"
              />
            }
            label="Dark Mode"
            sx={{ mx: 0 }}
          />
        </Paper>
      </Grow>
    </>
  )
}
