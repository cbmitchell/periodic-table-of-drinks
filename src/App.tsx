import { CssBaseline, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { drinkLists } from "./assets/drinkData";
import { ControlPanel } from "./components/ControlPanel";
import type { DrinkCellProps } from "./components/DrinkCell";
import { DrinkDetailModal } from "./components/DrinkDetailModal";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { FULL_TABLE_WIDTH, PeriodicTable } from "./components/PeriodicTable";
import { darkTheme, lightTheme } from "./theme";
import type { ListSelection } from "./types/ListSelection";
import { fillDrinkData } from "./utils/fillDrinkData";
import { useSessionStorage } from "./utils/useSessionStorage";

export default function App() {
	const [viewMode, setViewMode] = useSessionStorage<"full" | "compact">(
		"ptod_view_mode",
		"compact",
	);
	const [selectedDrink, setSelectedDrink] = useState<DrinkCellProps | null>(
		null,
	);
	const [panelVisible, setPanelVisible] = useState(true);
	const [panelCollapsed, setPanelCollapsed] = useSessionStorage(
		"ptod_panel_collapsed",
		false,
	);
	const [listSelection, setListSelection] = useState<ListSelection>(() => {
		const params = new URLSearchParams(window.location.search);
		const list = params.get("list");
		if (list !== null) {
			const pathIdx = drinkLists.findIndex((l) => l.path === list);
			if (pathIdx !== -1) return pathIdx;
			const idx = Number(list);
			if (!Number.isNaN(idx) && idx >= 0 && idx < drinkLists.length) return idx;
		}
		return 0;
	});
	const [darkMode, setDarkMode] = useSessionStorage("ptod_dark_mode", false);

	const filledDrinkData = useMemo(() => {
		const list = drinkLists[listSelection];
		return fillDrinkData(list.drinks, !!list.isRandom);
	}, [listSelection]);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		params.set("list", drinkLists[listSelection].path ?? String(listSelection));
		window.history.replaceState(null, "", `?${params}`);
	}, [listSelection]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement;
			const isInteractive =
				target instanceof HTMLInputElement ||
				target instanceof HTMLTextAreaElement ||
				target instanceof HTMLSelectElement ||
				target instanceof HTMLButtonElement ||
				target.isContentEditable;
			if (e.code === "Space" && !isInteractive) {
				e.preventDefault();
				setPanelVisible((v) => !v);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
			<CssBaseline />
			<Typography
				variant="h4"
				sx={{
					textAlign: "center",
					fontWeight: "bold",
					...(viewMode === "compact"
						? {
								position: "fixed",
								top: 16,
								left: 0,
								right: 0,
								zIndex: 10,
								pointerEvents: "none",
							}
						: {
								width: FULL_TABLE_WIDTH,
								pt: 2,
								pb: 1,
							}),
				}}
			>
				Periodic Table of Drinks
			</Typography>
			<ErrorBoundary>
				<PeriodicTable
					drinks={filledDrinkData}
					viewMode={viewMode}
					onDrinkClick={setSelectedDrink}
				/>
			</ErrorBoundary>
			<DrinkDetailModal
				drink={selectedDrink}
				onClose={() => setSelectedDrink(null)}
			/>
			{panelVisible && (
				<ControlPanel
					viewMode={viewMode}
					onViewModeChange={setViewMode}
					collapsed={panelCollapsed}
					onCollapseToggle={() => setPanelCollapsed(!panelCollapsed)}
					listSelection={listSelection}
					onListChange={setListSelection}
					darkMode={darkMode}
					onDarkModeToggle={() => setDarkMode(!darkMode)}
				/>
			)}
		</ThemeProvider>
	);
}
