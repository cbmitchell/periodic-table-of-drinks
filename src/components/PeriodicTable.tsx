import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
	CELL_HEIGHT,
	CELL_WIDTH,
	COMPACT_CELL_HEIGHT,
	COMPACT_CELL_WIDTH,
	DrinkCell,
	type DrinkCellProps,
} from "./DrinkCell";

const GAP_PX = 4; // MUI gap: 0.5 = 4px
const COMPACT_TABLE_WIDTH = 18 * COMPACT_CELL_WIDTH + 17 * GAP_PX;
const COMPACT_TABLE_HEIGHT = 10 * COMPACT_CELL_HEIGHT + 9 * GAP_PX;
const SCALE_PADDING = 32;

function calculateScale(): number {
	return Math.min(
		(window.innerWidth - SCALE_PADDING) / COMPACT_TABLE_WIDTH,
		(window.innerHeight - SCALE_PADDING) / COMPACT_TABLE_HEIGHT,
		1,
	);
}

interface PeriodicTableProps {
	drinks: DrinkCellProps[];
	viewMode: "full" | "compact";
	onDrinkClick?: (drink: DrinkCellProps) => void;
}

export function PeriodicTable({
	drinks,
	viewMode,
	onDrinkClick,
}: PeriodicTableProps) {
	const [scale, setScale] = useState(calculateScale);

	useEffect(() => {
		if (viewMode !== "compact") return;
		const handleResize = () => setScale(calculateScale());
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [viewMode]);

	const isCompact = viewMode === "compact";
	const cellWidth = isCompact ? COMPACT_CELL_WIDTH : CELL_WIDTH;
	const cellHeight = isCompact ? COMPACT_CELL_HEIGHT : CELL_HEIGHT;

	const grid = (
		<Box
			sx={{
				display: "grid",
				gridTemplateRows: `repeat(10, ${cellHeight}px)`,
				gridTemplateColumns: `repeat(18, ${cellWidth}px)`,
				gap: 0.5,
			}}
		>
			{drinks.map((drink) => (
				<DrinkCell
					key={`${drink.row},${drink.col}`}
					{...drink}
					compact={isCompact}
					onClick={
						isCompact && onDrinkClick ? () => onDrinkClick(drink) : undefined
					}
				/>
			))}
		</Box>
	);

	if (isCompact) {
		return (
			<Box
				sx={{
					position: "fixed",
					inset: 0,
					overflow: "hidden",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Box
					sx={{
						transform: `scale(${scale})`,
						transformOrigin: "center",
					}}
				>
					{grid}
				</Box>
			</Box>
		);
	}

	return <Box sx={{ width: "100%", height: "100vh" }}>{grid}</Box>;
}
