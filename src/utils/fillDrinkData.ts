// Merges manually defined drink data with placeholder entries for every cell in the
// periodic table. Used in App.tsx to produce the full array passed to PeriodicTable.

import { defaultCells } from "../assets/drinkData";
import type { DrinkCellProps } from "../components/DrinkCell";
import type { DrinkProps } from "../types/drink";
import { generateRandomDrink } from "./randomizers";

export function fillDrinkData(drinks: DrinkProps[]): DrinkCellProps[] {
  const drinkByAtomicNumber = new Map(
    drinks
      .filter((d): d is DrinkProps & { atomic_number: number } => d.atomic_number != null)
      .map(d => [d.atomic_number, d])
  )

  return defaultCells.map((defaultCell, index) => {
    const drinkItem = drinkByAtomicNumber.get(index + 1)
    if (drinkItem) {
      return { ...drinkItem, ...defaultCell }
    }
    return {
      ...generateRandomDrink(),
      ...defaultCell,
    }
  })
}