import CloseIcon from '@mui/icons-material/Close'
import TuneIcon from '@mui/icons-material/Tune'
import {
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
} from '@mui/material'
import { drinkLists } from '../assets/drinkData'
import type { ListSelection } from '../types/ListSelection'

interface ControlPanelProps {
  viewMode: 'full' | 'compact'
  onViewModeChange: (mode: 'full' | 'compact') => void
  collapsed: boolean
  onCollapseToggle: () => void
  listSelection: ListSelection
  onListChange: (selection: ListSelection) => void
  darkMode: boolean
  onDarkModeToggle: () => void
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
}: ControlPanelProps) {
  const zIndex = (theme: { zIndex: { modal: number } }) => theme.zIndex.modal + 1

  return (
    <>
      <IconButton
        onClick={onCollapseToggle}
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex,
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
            position: 'fixed',
            top: 56,
            right: 16,
            zIndex,
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
