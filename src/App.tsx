import { DrinkCell } from "./components/DrinkCell";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme } from "./theme";

const ingredients = [
	'1 ½ oz chocolate vodka',
	'1 ½ oz Irish cream',
	'1 ½ oz Kahlua',
	'1 oz creme de cacao',
	'48 oz chocolate ice cream',
	'Chocolate syrup',
	'Chocolate sprinkles',
]

const instructions = [
	'Combine ingredients in blender',
	'Cover and blend well',
	'Put chocolate sprinkles on a dish',
	'Coat rim of glass in chocolate syrup',
	'Touch rim of glass to sprinkles',
]

export default function App() {
	return (
		<ThemeProvider theme={lightTheme}>
			<DrinkCell
				title = 'Frozen Chocolate Mudslide'
				abbreviation = 'Cm'
				icon = 'hurricane'
				ingredients = {ingredients}
				instructions = {instructions}
			/>
		</ThemeProvider>
	)
}
