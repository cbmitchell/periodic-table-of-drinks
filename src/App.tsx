import { Button } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { drinkData } from "./assets/drinkData";
import type { DrinkCellProps } from "./components/DrinkCell";
import { DrinkDetailModal } from "./components/DrinkDetailModal";
import { PeriodicTable } from "./components/PeriodicTable";
import { lightTheme } from "./theme";
import { fillDrinkData } from "./utils/fillDrinkData";

const filledDrinkData = fillDrinkData(drinkData);

export default function App() {
	const [viewMode, setViewMode] = useState<"full" | "compact">("compact");
	const [selectedDrink, setSelectedDrink] = useState<DrinkCellProps | null>(
		null,
	);

	return (
		<ThemeProvider theme={lightTheme}>
			<PeriodicTable
				drinks={filledDrinkData}
				viewMode={viewMode}
				onDrinkClick={setSelectedDrink}
			/>
			<DrinkDetailModal
				drink={selectedDrink}
				onClose={() => setSelectedDrink(null)}
			/>
			<Button
				variant="contained"
				onClick={() => setViewMode(viewMode === "compact" ? "full" : "compact")}
				sx={{
					position: "fixed",
					top: 16,
					right: 16,
					zIndex: (theme) => theme.zIndex.modal + 1,
				}}
			>
				{viewMode === "compact" ? "Full View" : "Compact View"}
			</Button>
		</ThemeProvider>
	);
}
