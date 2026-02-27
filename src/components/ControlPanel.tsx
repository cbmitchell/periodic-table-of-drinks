import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { drinkLists } from "../assets/drinkData";

type ListSelection = "random" | number;

interface ControlPanelProps {
  viewMode: "full" | "compact";
  onViewModeChange: (mode: "full" | "compact") => void;
  collapsed: boolean;
  onCollapseToggle: () => void;
  listSelection: ListSelection;
  onListChange: (selection: ListSelection) => void;
}

export function ControlPanel({
  viewMode,
  onViewModeChange,
  collapsed,
  onCollapseToggle,
  listSelection,
  onListChange,
}: ControlPanelProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: (theme) => theme.zIndex.modal + 1,
        minWidth: 220,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold">
          Controls
        </Typography>
        <IconButton size="small" onClick={onCollapseToggle}>
          {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </Box>
      <Collapse in={!collapsed}>
        <Box sx={{ px: 2, pb: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Drink List</InputLabel>
            <Select
              label="Drink List"
              value={listSelection === "random" ? "random" : String(listSelection)}
              MenuProps={{ sx: { zIndex: (theme) => theme.zIndex.modal + 2 } }}
              onChange={(e) => {
                const val = e.target.value;
                onListChange(val === "random" ? "random" : Number(val));
              }}
            >
              <MenuItem value="random">Random</MenuItem>
              {drinkLists.map((list, i) => (
                <MenuItem key={list.title} value={String(i)}>
                  {list.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            fullWidth
            onClick={() =>
              onViewModeChange(viewMode === "compact" ? "full" : "compact")
            }
          >
            {viewMode === "compact" ? "Full View" : "Compact View"}
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
}
