import { Box, Button, Collapse, IconButton, Paper, Typography } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ControlPanelProps {
  viewMode: "full" | "compact";
  onViewModeChange: (mode: "full" | "compact") => void;
  collapsed: boolean;
  onCollapseToggle: () => void;
}

export function ControlPanel({
  viewMode,
  onViewModeChange,
  collapsed,
  onCollapseToggle,
}: ControlPanelProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: (theme) => theme.zIndex.modal + 1,
        minWidth: 180,
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
        <Box sx={{ px: 2, pb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
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
