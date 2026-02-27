import { ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { drinkData } from "./assets/drinkData";
import { ControlPanel } from "./components/ControlPanel";
import type { DrinkCellProps } from "./components/DrinkCell";
import { DrinkDetailModal } from "./components/DrinkDetailModal";
import { PeriodicTable } from "./components/PeriodicTable";
import { lightTheme } from "./theme";
import { fillDrinkData } from "./utils/fillDrinkData";

const filledDrinkData = fillDrinkData(drinkData);

export default function App() {
	const [viewMode, setViewMode] = useState<"full" | "compact">("compact");
	const [selectedDrink, setSelectedDrink] = useState<DrinkCellProps | null>(null);
	const [panelVisible, setPanelVisible] = useState(true);
	const [panelCollapsed, setPanelCollapsed] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				e.code === "Space" &&
				!(e.target instanceof HTMLInputElement) &&
				!(e.target instanceof HTMLTextAreaElement)
			) {
				e.preventDefault();
				setPanelVisible((v) => !v);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

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
			{panelVisible && (
				<ControlPanel
					viewMode={viewMode}
					onViewModeChange={setViewMode}
					collapsed={panelCollapsed}
					onCollapseToggle={() => setPanelCollapsed((c) => !c)}
				/>
			)}
		</ThemeProvider>
	);
}
