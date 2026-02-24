// Merges manually defined drink data with placeholder entries for every cell in the
// periodic table. Used in App.tsx to produce the full array passed to PeriodicTable.

import { defaultCells } from "../assets/drinkData";
import type { DrinkCellProps } from "../components/DrinkCell";
import { generateRandomDrink } from "./randomizers";

export function fillDrinkData(drinks: DrinkCellProps[]): DrinkCellProps[] {
  const drinkMap = new Map(drinks.map(d => [`${d.row},${d.col}`, d]))

  return defaultCells.map(defaultCell => {
    const existing = drinkMap.get(`${defaultCell.row},${defaultCell.col}`)
    if (existing) return existing
    return {
      ...generateRandomDrink(),
      group: defaultCell.group,
      row: defaultCell.row,
      col: defaultCell.col,
    }
  })
}