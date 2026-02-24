// export type WeightedItemValue = string | number | undefined

export interface WeightedItem<T> {
  likelihood: number
  value: T
}

// Type for managing lists that are to be selected from at random.
// Allows weights to be associated with list items to control likelihood of selection
//   relative to all other list items.
// Likelihood value can be any positive number, and represents the likelihood that the
//   associated element will be selected.
// Probability of selection is calculated by dividing an item's likelihood by the total
//   likelihood of all items in the list.
export class WeightedList<T> {
  items: WeightedItem<T>[]

  constructor(items: WeightedItem<T>[]) {
    this.items = items
  }

  randomlySelectItem(): T {
    const totalLikelihood = this.items.reduce((sum, i) => sum + i.likelihood, 0)
    let randomIndex = Math.floor(Math.random() * totalLikelihood)

    for (const item of this.items) {
      randomIndex -= item.likelihood
      if (randomIndex <= 0) {
        return item.value
      }
    }

    // Fallback for floating-point edge cases (random * total == total exactly)
    return this.items[this.items.length - 1].value
  }

  randomlySelectNDistinctItems(n: number): T[] {
    if (this.items.length <= n) {
      return [...this.items].map((item) => item.value)
    }

    const remaining = [...this.items]
    const selected: WeightedItem<T>[] = []

    for (let i = n; i > 0; i--) {
      const totalLikelihood = remaining.reduce(
        (sum, i) => sum + i.likelihood,
        0,
      )
      let randomIndex = Math.floor(Math.random() * totalLikelihood)

      for (let j = 0; j < remaining.length; j++) {
        randomIndex -= remaining[j].likelihood
        if (randomIndex <= 0) {
          selected.push(remaining[j])
          remaining.splice(j, 1)
          break
        }
      }
    }

    return selected.map((item) => item.value)
  }
}
