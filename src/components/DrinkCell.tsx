import {
	Box,
	Card,
	CardContent,
	Grid,
	List,
	ListItem,
	ListItemText,
	Typography,
} from "@mui/material";

export type GlassIconName =
	| "collins"
	| "coup"
	| "flute"
	| "hurricane"
	| "irish"
	| "margarita"
	| "martini"
	| "mule"
	| "pint"
	| "rocks"
	| "tiki"
	| "wine";

const glassIconBasePath = "glass-icons/black/";

const glassIcons: Record<GlassIconName, string> = {
	collins: "collins.png",
	coup: "coup.png",
	flute: "flute.png",
	hurricane: "hurricane.png",
	irish: "irish.png",
	margarita: "margarita.png",
	martini: "martini.png",
	mule: "mule.png",
	pint: "pint.png",
	rocks: "rocks.png",
	tiki: "tiki.png",
	wine: "wine.png",
};

export type ElementGroup =
	| "alkali_metals"
	| "alkaline_earth_metals"
	| "transition_metals"
	| "post_transition_metals"
	| "metalloids"
	| "nonmetals"
	| "halogens"
	| "noble_gases"
	| "lanthanides"
	| "actinides";

const elementGroupColors: Record<ElementGroup, string> = {
	alkali_metals: "red",
	alkaline_earth_metals: "orange",
	transition_metals: "yellow",
	post_transition_metals: "teal",
	metalloids: "green",
	nonmetals: "purple",
	halogens: "cyan",
	noble_gases: "pink",
	lanthanides: "lightgreen",
	actinides: "lavender",
};

interface DrinkCellProps {
	title: string;
	abbreviation: string;
	icon: GlassIconName;
	ingredients: string[];
	instructions?: string[];
	group?: ElementGroup;
}

const CELL_WIDTH = 256;
const CELL_HEIGHT = 320;

export function DrinkCell({
	title,
	abbreviation,
	icon,
	ingredients,
	instructions = [""],
	group = "actinides",
}: DrinkCellProps) {
	return (
		<Card
			sx={{
				width: CELL_WIDTH,
				height: CELL_HEIGHT,
				backgroundColor: elementGroupColors[group],
			}}
		>
			<CardContent>
				<Grid container spacing={0}>
					<Grid size={8}>
						<Box>
							<Typography
								sx={{
									fontWeight: "medium",
									minHeight: 48,
									lineHeight: 1.2,
								}}
							>
								{title}
							</Typography>
							<Typography
								sx={{
									fontSize: 80,
									fontWeight: "bold",
									lineHeight: 0.8,
									height: 64,
								}}
							>
								{abbreviation}
							</Typography>
						</Box>
					</Grid>
					<Grid size={4} sx={{ position: "relative" }}>
						<Box
							component="img"
							src={`${glassIconBasePath}${glassIcons[icon]}`}
							sx={{ width: "100%", position: "absolute", bottom: 0 }}
						></Box>
					</Grid>
					<Grid size={6}>
						<Box sx={{ p: 1 }}>
							<List dense sx={{ listStyleType: "disc", pl: 0 }}>
								{ingredients.map((ingredient) => (
									<ListItem key={ingredient} disablePadding>
										<ListItemText
											sx={{ fontSize: 8, display: "list-item", my: 0 }}
											primary={ingredient}
											slotProps={{ primary: { sx: { fontSize: "8pt" } } }}
										/>
									</ListItem>
								))}
							</List>
						</Box>
					</Grid>
					<Grid size={6}>
						<Box sx={{ p: 1 }}>
							<List dense sx={{ listStyleType: "disc", pl: 0 }}>
								{instructions.map((instruction) => (
									<ListItem key={instruction} disablePadding>
										<ListItemText
											sx={{ fontSize: 8, display: "list-item", my: 0 }}
											primary={instruction}
											slotProps={{ primary: { sx: { fontSize: "8pt" } } }}
										/>
									</ListItem>
								))}
							</List>
						</Box>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
}
